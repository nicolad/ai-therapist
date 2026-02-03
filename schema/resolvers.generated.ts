/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { generationJob as Query_generationJob } from './resolvers/Query/generationJob';
import    { generationJobs as Query_generationJobs } from './resolvers/Query/generationJobs';
import    { goal as Query_goal } from './resolvers/Query/goal';
import    { goals as Query_goals } from './resolvers/Query/goals';
import    { notes as Query_notes } from './resolvers/Query/notes';
import    { therapeuticQuestions as Query_therapeuticQuestions } from './resolvers/Query/therapeuticQuestions';
import    { therapyResearch as Query_therapyResearch } from './resolvers/Query/therapyResearch';
import    { createGoal as Mutation_createGoal } from './resolvers/Mutation/createGoal';
import    { createNote as Mutation_createNote } from './resolvers/Mutation/createNote';
import    { deleteGoal as Mutation_deleteGoal } from './resolvers/Mutation/deleteGoal';
import    { deleteNote as Mutation_deleteNote } from './resolvers/Mutation/deleteNote';
import    { deleteTherapeuticQuestions as Mutation_deleteTherapeuticQuestions } from './resolvers/Mutation/deleteTherapeuticQuestions';
import    { deleteTherapyResearch as Mutation_deleteTherapyResearch } from './resolvers/Mutation/deleteTherapyResearch';
import    { generateAudio as Mutation_generateAudio } from './resolvers/Mutation/generateAudio';
import    { generateLongFormText as Mutation_generateLongFormText } from './resolvers/Mutation/generateLongFormText';
import    { generateTherapeuticQuestions as Mutation_generateTherapeuticQuestions } from './resolvers/Mutation/generateTherapeuticQuestions';
import    { generateTherapyResearch as Mutation_generateTherapyResearch } from './resolvers/Mutation/generateTherapyResearch';
import    { updateGoal as Mutation_updateGoal } from './resolvers/Mutation/updateGoal';
import    { updateNote as Mutation_updateNote } from './resolvers/Mutation/updateNote';
import    { audioJobStatus as Subscription_audioJobStatus } from './resolvers/Subscription/audioJobStatus';
import    { researchJobStatus as Subscription_researchJobStatus } from './resolvers/Subscription/researchJobStatus';
import    { AudioAsset } from './resolvers/AudioAsset';
import    { AudioManifest } from './resolvers/AudioManifest';
import    { AudioSegmentInfo } from './resolvers/AudioSegmentInfo';
import    { DeleteGoalResult } from './resolvers/DeleteGoalResult';
import    { DeleteNoteResult } from './resolvers/DeleteNoteResult';
import    { DeleteQuestionsResult } from './resolvers/DeleteQuestionsResult';
import    { DeleteResearchResult } from './resolvers/DeleteResearchResult';
import    { GenerateAudioResult } from './resolvers/GenerateAudioResult';
import    { GenerateLongFormTextResult } from './resolvers/GenerateLongFormTextResult';
import    { GenerateQuestionsResult } from './resolvers/GenerateQuestionsResult';
import    { GenerateResearchResult } from './resolvers/GenerateResearchResult';
import    { GenerationJob } from './resolvers/GenerationJob';
import    { Goal } from './resolvers/Goal';
import    { GoalStory } from './resolvers/GoalStory';
import    { JobError } from './resolvers/JobError';
import    { JobResult } from './resolvers/JobResult';
import    { Note } from './resolvers/Note';
import    { TextSegment } from './resolvers/TextSegment';
import    { TherapeuticQuestion } from './resolvers/TherapeuticQuestion';
import    { TherapyResearch } from './resolvers/TherapyResearch';
    export const resolvers: Resolvers = {
      Query: { generationJob: Query_generationJob,generationJobs: Query_generationJobs,goal: Query_goal,goals: Query_goals,notes: Query_notes,therapeuticQuestions: Query_therapeuticQuestions,therapyResearch: Query_therapyResearch },
      Mutation: { createGoal: Mutation_createGoal,createNote: Mutation_createNote,deleteGoal: Mutation_deleteGoal,deleteNote: Mutation_deleteNote,deleteTherapeuticQuestions: Mutation_deleteTherapeuticQuestions,deleteTherapyResearch: Mutation_deleteTherapyResearch,generateAudio: Mutation_generateAudio,generateLongFormText: Mutation_generateLongFormText,generateTherapeuticQuestions: Mutation_generateTherapeuticQuestions,generateTherapyResearch: Mutation_generateTherapyResearch,updateGoal: Mutation_updateGoal,updateNote: Mutation_updateNote },
      Subscription: { audioJobStatus: Subscription_audioJobStatus,researchJobStatus: Subscription_researchJobStatus },
      AudioAsset: AudioAsset,
AudioManifest: AudioManifest,
AudioSegmentInfo: AudioSegmentInfo,
DeleteGoalResult: DeleteGoalResult,
DeleteNoteResult: DeleteNoteResult,
DeleteQuestionsResult: DeleteQuestionsResult,
DeleteResearchResult: DeleteResearchResult,
GenerateAudioResult: GenerateAudioResult,
GenerateLongFormTextResult: GenerateLongFormTextResult,
GenerateQuestionsResult: GenerateQuestionsResult,
GenerateResearchResult: GenerateResearchResult,
GenerationJob: GenerationJob,
Goal: Goal,
GoalStory: GoalStory,
JobError: JobError,
JobResult: JobResult,
Note: Note,
TextSegment: TextSegment,
TherapeuticQuestion: TherapeuticQuestion,
TherapyResearch: TherapyResearch
    }