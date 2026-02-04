/* This file was automatically generated. DO NOT UPDATE MANUALLY. */
    import type   { Resolvers } from './types.generated';
    import    { allNotes as Query_allNotes } from './resolvers/Query/allNotes';
import    { claimCard as Query_claimCard } from './resolvers/Query/claimCard';
import    { claimCardsForNote as Query_claimCardsForNote } from './resolvers/Query/claimCardsForNote';
import    { generationJob as Query_generationJob } from './resolvers/Query/generationJob';
import    { generationJobs as Query_generationJobs } from './resolvers/Query/generationJobs';
import    { goal as Query_goal } from './resolvers/Query/goal';
import    { goals as Query_goals } from './resolvers/Query/goals';
import    { note as Query_note } from './resolvers/Query/note';
import    { notes as Query_notes } from './resolvers/Query/notes';
import    { research as Query_research } from './resolvers/Query/research';
import    { therapeuticQuestions as Query_therapeuticQuestions } from './resolvers/Query/therapeuticQuestions';
import    { buildClaimCards as Mutation_buildClaimCards } from './resolvers/Mutation/buildClaimCards';
import    { checkNoteClaims as Mutation_checkNoteClaims } from './resolvers/Mutation/checkNoteClaims';
import    { createGoal as Mutation_createGoal } from './resolvers/Mutation/createGoal';
import    { createNote as Mutation_createNote } from './resolvers/Mutation/createNote';
import    { deleteClaimCard as Mutation_deleteClaimCard } from './resolvers/Mutation/deleteClaimCard';
import    { deleteGoal as Mutation_deleteGoal } from './resolvers/Mutation/deleteGoal';
import    { deleteNote as Mutation_deleteNote } from './resolvers/Mutation/deleteNote';
import    { deleteResearch as Mutation_deleteResearch } from './resolvers/Mutation/deleteResearch';
import    { deleteTherapeuticQuestions as Mutation_deleteTherapeuticQuestions } from './resolvers/Mutation/deleteTherapeuticQuestions';
import    { generateAudio as Mutation_generateAudio } from './resolvers/Mutation/generateAudio';
import    { generateLongFormText as Mutation_generateLongFormText } from './resolvers/Mutation/generateLongFormText';
import    { generateResearch as Mutation_generateResearch } from './resolvers/Mutation/generateResearch';
import    { generateTherapeuticQuestions as Mutation_generateTherapeuticQuestions } from './resolvers/Mutation/generateTherapeuticQuestions';
import    { refreshClaimCard as Mutation_refreshClaimCard } from './resolvers/Mutation/refreshClaimCard';
import    { updateGoal as Mutation_updateGoal } from './resolvers/Mutation/updateGoal';
import    { updateNote as Mutation_updateNote } from './resolvers/Mutation/updateNote';
import    { audioJobStatus as Subscription_audioJobStatus } from './resolvers/Subscription/audioJobStatus';
import    { researchJobStatus as Subscription_researchJobStatus } from './resolvers/Subscription/researchJobStatus';
import    { AudioAsset } from './resolvers/AudioAsset';
import    { AudioManifest } from './resolvers/AudioManifest';
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
import    { EvidenceItem } from './resolvers/EvidenceItem';
import    { EvidenceLocator } from './resolvers/EvidenceLocator';
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
import    { PaperCandidate } from './resolvers/PaperCandidate';
import    { Research } from './resolvers/Research';
import    { TextSegment } from './resolvers/TextSegment';
import    { TherapeuticQuestion } from './resolvers/TherapeuticQuestion';
    export const resolvers: Resolvers = {
      Query: { allNotes: Query_allNotes,claimCard: Query_claimCard,claimCardsForNote: Query_claimCardsForNote,generationJob: Query_generationJob,generationJobs: Query_generationJobs,goal: Query_goal,goals: Query_goals,note: Query_note,notes: Query_notes,research: Query_research,therapeuticQuestions: Query_therapeuticQuestions },
      Mutation: { buildClaimCards: Mutation_buildClaimCards,checkNoteClaims: Mutation_checkNoteClaims,createGoal: Mutation_createGoal,createNote: Mutation_createNote,deleteClaimCard: Mutation_deleteClaimCard,deleteGoal: Mutation_deleteGoal,deleteNote: Mutation_deleteNote,deleteResearch: Mutation_deleteResearch,deleteTherapeuticQuestions: Mutation_deleteTherapeuticQuestions,generateAudio: Mutation_generateAudio,generateLongFormText: Mutation_generateLongFormText,generateResearch: Mutation_generateResearch,generateTherapeuticQuestions: Mutation_generateTherapeuticQuestions,refreshClaimCard: Mutation_refreshClaimCard,updateGoal: Mutation_updateGoal,updateNote: Mutation_updateNote },
      Subscription: { audioJobStatus: Subscription_audioJobStatus,researchJobStatus: Subscription_researchJobStatus },
      AudioAsset: AudioAsset,
AudioManifest: AudioManifest,
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
EvidenceItem: EvidenceItem,
EvidenceLocator: EvidenceLocator,
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
PaperCandidate: PaperCandidate,
Research: Research,
TextSegment: TextSegment,
TherapeuticQuestion: TherapeuticQuestion
    }