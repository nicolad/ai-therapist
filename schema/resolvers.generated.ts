/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { allNotes as Query_allNotes } from './resolvers/Query/allNotes';
import    { audioFromR2 as Query_audioFromR2 } from './resolvers/Query/audioFromR2';
import    { claimCard as Query_claimCard } from './resolvers/Query/claimCard';
import    { claimCardsForNote as Query_claimCardsForNote } from './resolvers/Query/claimCardsForNote';
import    { generationJob as Query_generationJob } from './resolvers/Query/generationJob';
import    { generationJobs as Query_generationJobs } from './resolvers/Query/generationJobs';
import    { goal as Query_goal } from './resolvers/Query/goal';
import    { goals as Query_goals } from './resolvers/Query/goals';
import    { note as Query_note } from './resolvers/Query/note';
import    { notes as Query_notes } from './resolvers/Query/notes';
import    { research as Query_research } from './resolvers/Query/research';
import    { stories as Query_stories } from './resolvers/Query/stories';
import    { story as Query_story } from './resolvers/Query/story';
import    { therapeuticQuestions as Query_therapeuticQuestions } from './resolvers/Query/therapeuticQuestions';
import    { buildClaimCards as Mutation_buildClaimCards } from './resolvers/Mutation/buildClaimCards';
import    { checkNoteClaims as Mutation_checkNoteClaims } from './resolvers/Mutation/checkNoteClaims';
import    { createGoal as Mutation_createGoal } from './resolvers/Mutation/createGoal';
import    { createNote as Mutation_createNote } from './resolvers/Mutation/createNote';
import    { createStory as Mutation_createStory } from './resolvers/Mutation/createStory';
import    { deleteClaimCard as Mutation_deleteClaimCard } from './resolvers/Mutation/deleteClaimCard';
import    { deleteGoal as Mutation_deleteGoal } from './resolvers/Mutation/deleteGoal';
import    { deleteNote as Mutation_deleteNote } from './resolvers/Mutation/deleteNote';
import    { deleteResearch as Mutation_deleteResearch } from './resolvers/Mutation/deleteResearch';
import    { deleteStory as Mutation_deleteStory } from './resolvers/Mutation/deleteStory';
import    { deleteTherapeuticQuestions as Mutation_deleteTherapeuticQuestions } from './resolvers/Mutation/deleteTherapeuticQuestions';
import    { generateAudio as Mutation_generateAudio } from './resolvers/Mutation/generateAudio';
import    { generateLongFormText as Mutation_generateLongFormText } from './resolvers/Mutation/generateLongFormText';
import    { generateOpenAIAudio as Mutation_generateOpenAIAudio } from './resolvers/Mutation/generateOpenAIAudio';
import    { generateResearch as Mutation_generateResearch } from './resolvers/Mutation/generateResearch';
import    { generateTherapeuticQuestions as Mutation_generateTherapeuticQuestions } from './resolvers/Mutation/generateTherapeuticQuestions';
import    { refreshClaimCard as Mutation_refreshClaimCard } from './resolvers/Mutation/refreshClaimCard';
import    { updateGoal as Mutation_updateGoal } from './resolvers/Mutation/updateGoal';
import    { updateNote as Mutation_updateNote } from './resolvers/Mutation/updateNote';
import    { updateStory as Mutation_updateStory } from './resolvers/Mutation/updateStory';
import    { audioJobStatus as Subscription_audioJobStatus } from './resolvers/Subscription/audioJobStatus';
import    { researchJobStatus as Subscription_researchJobStatus } from './resolvers/Subscription/researchJobStatus';
import    { AudioAsset } from './resolvers/AudioAsset';
import    { AudioFromR2Result } from './resolvers/AudioFromR2Result';
import    { AudioManifest } from './resolvers/AudioManifest';
import    { AudioMetadata } from './resolvers/AudioMetadata';
import    { AudioSegmentInfo } from './resolvers/AudioSegmentInfo';
import    { BuildClaimCardsResult } from './resolvers/BuildClaimCardsResult';
import    { CheckNoteClaimsResult } from './resolvers/CheckNoteClaimsResult';
import    { ClaimCard } from './resolvers/ClaimCard';
import    { ClaimProvenance } from './resolvers/ClaimProvenance';
import    { ClaimScope } from './resolvers/ClaimScope';
import    { DeleteGoalResult } from './resolvers/DeleteGoalResult';
import    { DeleteNoteResult } from './resolvers/DeleteNoteResult';
import    { DeleteQuestionsResult } from './resolvers/DeleteQuestionsResult';
import    { DeleteResearchResult } from './resolvers/DeleteResearchResult';
import    { DeleteStoryResult } from './resolvers/DeleteStoryResult';
import    { EvidenceItem } from './resolvers/EvidenceItem';
import    { EvidenceLocator } from './resolvers/EvidenceLocator';
import    { GenerateAudioResult } from './resolvers/GenerateAudioResult';
import    { GenerateLongFormTextResult } from './resolvers/GenerateLongFormTextResult';
import    { GenerateOpenAIAudioResult } from './resolvers/GenerateOpenAIAudioResult';
import    { GenerateQuestionsResult } from './resolvers/GenerateQuestionsResult';
import    { GenerateResearchResult } from './resolvers/GenerateResearchResult';
import    { GenerationJob } from './resolvers/GenerationJob';
import    { Goal } from './resolvers/Goal';
import    { GoalStory } from './resolvers/GoalStory';
import    { JobError } from './resolvers/JobError';
import    { JobResult } from './resolvers/JobResult';
import    { Note } from './resolvers/Note';
import    { PaperCandidate } from './resolvers/PaperCandidate';
import    { Research } from './resolvers/Research';
import    { Story } from './resolvers/Story';
import    { TextSegment } from './resolvers/TextSegment';
import    { TherapeuticQuestion } from './resolvers/TherapeuticQuestion';
    export const resolvers: Resolvers = {
      Query: { allNotes: Query_allNotes,audioFromR2: Query_audioFromR2,claimCard: Query_claimCard,claimCardsForNote: Query_claimCardsForNote,generationJob: Query_generationJob,generationJobs: Query_generationJobs,goal: Query_goal,goals: Query_goals,note: Query_note,notes: Query_notes,research: Query_research,stories: Query_stories,story: Query_story,therapeuticQuestions: Query_therapeuticQuestions },
      Mutation: { buildClaimCards: Mutation_buildClaimCards,checkNoteClaims: Mutation_checkNoteClaims,createGoal: Mutation_createGoal,createNote: Mutation_createNote,createStory: Mutation_createStory,deleteClaimCard: Mutation_deleteClaimCard,deleteGoal: Mutation_deleteGoal,deleteNote: Mutation_deleteNote,deleteResearch: Mutation_deleteResearch,deleteStory: Mutation_deleteStory,deleteTherapeuticQuestions: Mutation_deleteTherapeuticQuestions,generateAudio: Mutation_generateAudio,generateLongFormText: Mutation_generateLongFormText,generateOpenAIAudio: Mutation_generateOpenAIAudio,generateResearch: Mutation_generateResearch,generateTherapeuticQuestions: Mutation_generateTherapeuticQuestions,refreshClaimCard: Mutation_refreshClaimCard,updateGoal: Mutation_updateGoal,updateNote: Mutation_updateNote,updateStory: Mutation_updateStory },
      Subscription: { audioJobStatus: Subscription_audioJobStatus,researchJobStatus: Subscription_researchJobStatus },
      AudioAsset: AudioAsset,
AudioFromR2Result: AudioFromR2Result,
AudioManifest: AudioManifest,
AudioMetadata: AudioMetadata,
AudioSegmentInfo: AudioSegmentInfo,
BuildClaimCardsResult: BuildClaimCardsResult,
CheckNoteClaimsResult: CheckNoteClaimsResult,
ClaimCard: ClaimCard,
ClaimProvenance: ClaimProvenance,
ClaimScope: ClaimScope,
DeleteGoalResult: DeleteGoalResult,
DeleteNoteResult: DeleteNoteResult,
DeleteQuestionsResult: DeleteQuestionsResult,
DeleteResearchResult: DeleteResearchResult,
DeleteStoryResult: DeleteStoryResult,
EvidenceItem: EvidenceItem,
EvidenceLocator: EvidenceLocator,
GenerateAudioResult: GenerateAudioResult,
GenerateLongFormTextResult: GenerateLongFormTextResult,
GenerateOpenAIAudioResult: GenerateOpenAIAudioResult,
GenerateQuestionsResult: GenerateQuestionsResult,
GenerateResearchResult: GenerateResearchResult,
GenerationJob: GenerationJob,
Goal: Goal,
GoalStory: GoalStory,
JobError: JobError,
JobResult: JobResult,
Note: Note,
PaperCandidate: PaperCandidate,
Research: Research,
Story: Story,
TextSegment: TextSegment,
TherapeuticQuestion: TherapeuticQuestion
    }