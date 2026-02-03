import type { MutationResolvers } from "@/schema/types.generated";
import {
  db,
  goals as goalsTable,
  familyMembers,
  therapyResearch,
  therapeuticQuestions,
} from "@/lib/db";
import { eq } from "drizzle-orm";
import { deepseek, DEEPSEEK_REASONER_MODEL } from "@/lib/deepseek/client";
import { differenceInYears, formatISO } from "date-fns";

export const generateTherapeuticQuestions: NonNullable<MutationResolvers['generateTherapeuticQuestions']> = async (_parent, { goalId }, ctx) => {
  if (!ctx.userId) {
    throw new Error("Unauthorized");
  }

  try {
    // Fetch the goal
    const [goal] = await db
      .select()
      .from(goalsTable)
      .where(eq(goalsTable.id, goalId));

    if (!goal) {
      throw new Error("Goal not found");
    }

    if (!goal.familyMemberId) {
      throw new Error("Goal does not have a family member associated");
    }

    // Fetch family member for context
    const [familyMember] = await db
      .select()
      .from(familyMembers)
      .where(eq(familyMembers.id, goal.familyMemberId));

    if (!familyMember) {
      throw new Error("Family member not found");
    }

    // Derive language based on family member ID
    // Family member ID 12 and 10 use Romanian
    const language =
      goal.familyMemberId === 12 || goal.familyMemberId === 10
        ? "Romanian"
        : "English";

    // Fetch all therapy research related to this goal
    const researchData = await db
      .select()
      .from(therapyResearch)
      .where(eq(therapyResearch.goalId, goalId));

    console.log("Fetched research data:", researchData.length, "items");

    // Calculate age if date of birth is available
    let age = 0;
    if (familyMember.dateOfBirth) {
      age = differenceInYears(new Date(), new Date(familyMember.dateOfBirth));
    }

    // Build research context if available
    let researchContext = "";
    if (researchData.length > 0) {
      researchContext = `\n\n**Available Research Insights (${researchData.length} studies):**\n`;
      researchData.forEach((research, idx) => {
        researchContext += `\n${idx + 1}. ${research.title}`;
        if (research.authors && research.authors.length > 0) {
          researchContext += ` by ${research.authors.join(", ")}`;
        }
        if (research.year) {
          researchContext += ` (${research.year})`;
        }
        if (research.keyFindings && research.keyFindings.length > 0) {
          researchContext += `\n   Key Findings:\n${research.keyFindings.map((f) => `   - ${f}`).join("\n")}`;
        }
        if (
          research.therapeuticTechniques &&
          research.therapeuticTechniques.length > 0
        ) {
          researchContext += `\n   Recommended Techniques: ${research.therapeuticTechniques.join(", ")}`;
        }
      });
    }

    // Build failed attempts context if available
    // TODO: failedAttempts field doesn't exist in database schema
    let failedAttemptsContext = "";
    // if (goal.failedAttempts && goal.failedAttempts.length > 0) {
    //   failedAttemptsContext = `\n\n**Previous Failed Attempts:**\n`;
    //   goal.failedAttempts.forEach((attempt, idx) => {
    //     failedAttemptsContext += `${idx + 1}. ${attempt}\n`;
    //   });
    //   failedAttemptsContext += `\nThese failed attempts are CRITICAL context. Generate questions that help explore why these didn't work, what was learned, and how to approach things differently.`;
    // }

    const prompt = `Generate 10-20 therapeutic questions for the following goal:

**Goal:** ${goal.title}
**Description:** ${goal.description || "Not specified"}
**Person:** ${familyMember.firstName}
**Age:** ${age} years old
**Relationship:** ${familyMember.relationship || "Not specified"}
**Language:** ${language || "English"}${researchContext}${failedAttemptsContext}

Please generate thoughtful, therapeutic questions IN ${language || "English"} that:
1. Help explore the root causes and context of this goal
2. Identify potential barriers or challenges
3. Uncover personal motivations and desires
4. Assess current situation and patterns
5. Explore emotional and psychological aspects
6. Identify support systems and resources
7. Clarify desired outcomes and success metrics
8. Consider past experiences and lessons learned
${researchData.length > 0 ? "9. Incorporate insights from the research findings above\n10. Align with evidence-based therapeutic techniques mentioned" : ""}

For each question, provide:
- The question itself (open-ended, thought-provoking, compassionate) in ${language || "English"}
- A rationale explaining WHY this question is therapeutically valuable for this specific goal in ${language || "English"}
${researchData.length > 0 ? "- The research reference (by number 1-" + researchData.length + ") that informed this question, if applicable" : ""}

Return as a JSON array with this structure:
{
  "questions": [
    {
      "question": "What specific situations or triggers make this goal feel most important to you?",
      "rationale": "This question helps identify the emotional and contextual drivers behind the goal, allowing for deeper self-awareness and motivation exploration.",
      "researchReference": 1
    },
    ...
  ]
}`;

    const response = await deepseek.chat.completions.create({
      model: DEEPSEEK_REASONER_MODEL,
      messages: [
        {
          role: "system",
          content: `You are an expert therapeutic coach and psychologist. Your role is to generate insightful, compassionate questions that help people explore their goals, challenges, and inner worlds deeply. Focus on creating questions that promote self-reflection, awareness, and meaningful insight. 
          
IMPORTANT: You MUST generate questions AND rationales in the language specified by the user. If Romanian is requested, ALL questions and ALL rationales must be in Romanian. If English is requested, everything must be in English. Ensure proper grammar, natural phrasing, and culturally appropriate language.`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 1.5,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) {
      throw new Error("No content in AI response");
    }

    const parsed = JSON.parse(content);
    const questions = parsed.questions || [];

    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error("No questions generated");
    }

    // Save questions to database with research references and rationale
    const now = formatISO(new Date());
    const questionRecords = questions.map((q: any) => {
      // Find research by reference number
      let researchId = null;
      let researchTitle = null;

      if (q.researchReference && researchData.length > 0) {
        const refIndex = q.researchReference - 1;
        if (refIndex >= 0 && refIndex < researchData.length) {
          const research = researchData[refIndex];
          researchId = research.id;
          researchTitle = research.title;
        }
      }

      return {
        goalId,
        question: q.question,
        researchId,
        researchTitle,
        rationale:
          q.rationale ||
          "Generated to explore therapeutic goals and promote self-reflection",
        generatedAt: now,
      };
    });

    const savedQuestions = await db
      .insert(therapeuticQuestions)
      .values(questionRecords)
      .returning();

    return {
      success: true,
      message: `Generated and saved ${savedQuestions.length} therapeutic questions`,
      questions: savedQuestions,
    };
  } catch (error: any) {
    console.error("Error generating therapeutic questions:", error);
    return {
      success: false,
      message: error.message || "Failed to generate questions",
      questions: [],
    };
  }
};
