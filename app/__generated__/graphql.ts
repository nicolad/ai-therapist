/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AudioAsset = {
  __typename?: 'AudioAsset';
  createdAt: Scalars['String']['output'];
  goalId: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  language: Scalars['String']['output'];
  manifest: AudioManifest;
  mimeType: Scalars['String']['output'];
  storyId?: Maybe<Scalars['Int']['output']>;
  userId: Scalars['String']['output'];
  voice: Scalars['String']['output'];
};

export type AudioManifest = {
  __typename?: 'AudioManifest';
  segmentCount: Scalars['Int']['output'];
  segments: Array<AudioSegmentInfo>;
  totalDuration?: Maybe<Scalars['Float']['output']>;
};

export type AudioMetadataInput = {
  generatedAt?: InputMaybe<Scalars['String']['input']>;
  goalId?: InputMaybe<Scalars['Int']['input']>;
  model?: InputMaybe<Scalars['String']['input']>;
  noteId?: InputMaybe<Scalars['Int']['input']>;
  voice?: InputMaybe<Scalars['String']['input']>;
};

export type AudioSegmentInfo = {
  __typename?: 'AudioSegmentInfo';
  duration?: Maybe<Scalars['Float']['output']>;
  idx: Scalars['Int']['output'];
  url: Scalars['String']['output'];
};

export type BuildClaimCardsInput = {
  claims?: InputMaybe<Array<Scalars['String']['input']>>;
  perSourceLimit?: InputMaybe<Scalars['Int']['input']>;
  sources?: InputMaybe<Array<ResearchSource>>;
  text?: InputMaybe<Scalars['String']['input']>;
  topK?: InputMaybe<Scalars['Int']['input']>;
  useLlmJudge?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BuildClaimCardsResult = {
  __typename?: 'BuildClaimCardsResult';
  cards: Array<ClaimCard>;
};

export type CheckNoteClaimsInput = {
  evidenceTopK?: InputMaybe<Scalars['Int']['input']>;
  maxClaims?: InputMaybe<Scalars['Int']['input']>;
  maxSourcesToResolve?: InputMaybe<Scalars['Int']['input']>;
  noteId: Scalars['Int']['input'];
  sources?: InputMaybe<Array<ResearchSource>>;
  useJudge?: InputMaybe<Scalars['Boolean']['input']>;
};

export type CheckNoteClaimsResult = {
  __typename?: 'CheckNoteClaimsResult';
  cards: Array<ClaimCard>;
  message?: Maybe<Scalars['String']['output']>;
  noteId: Scalars['Int']['output'];
  success: Scalars['Boolean']['output'];
};

export type ClaimCard = {
  __typename?: 'ClaimCard';
  claim: Scalars['String']['output'];
  confidence: Scalars['Float']['output'];
  createdAt: Scalars['String']['output'];
  evidence: Array<EvidenceItem>;
  id: Scalars['ID']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  provenance: ClaimProvenance;
  queries: Array<Scalars['String']['output']>;
  scope?: Maybe<ClaimScope>;
  updatedAt: Scalars['String']['output'];
  verdict: ClaimVerdict;
};

export type ClaimProvenance = {
  __typename?: 'ClaimProvenance';
  generatedBy: Scalars['String']['output'];
  model?: Maybe<Scalars['String']['output']>;
  sourceTools: Array<Scalars['String']['output']>;
};

export type ClaimScope = {
  __typename?: 'ClaimScope';
  comparator?: Maybe<Scalars['String']['output']>;
  intervention?: Maybe<Scalars['String']['output']>;
  outcome?: Maybe<Scalars['String']['output']>;
  population?: Maybe<Scalars['String']['output']>;
  setting?: Maybe<Scalars['String']['output']>;
  timeframe?: Maybe<Scalars['String']['output']>;
};

export enum ClaimVerdict {
  Contradicted = 'CONTRADICTED',
  Insufficient = 'INSUFFICIENT',
  Mixed = 'MIXED',
  Supported = 'SUPPORTED',
  Unverified = 'UNVERIFIED'
}

export type CreateGoalInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  familyMemberId: Scalars['Int']['input'];
  priority?: InputMaybe<Scalars['String']['input']>;
  targetDate?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};

export type CreateNoteInput = {
  content: Scalars['String']['input'];
  createdBy?: InputMaybe<Scalars['String']['input']>;
  entityId: Scalars['Int']['input'];
  entityType: Scalars['String']['input'];
  linkedResearchIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  noteType?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};

export type DeleteGoalResult = {
  __typename?: 'DeleteGoalResult';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type DeleteNoteResult = {
  __typename?: 'DeleteNoteResult';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type DeleteQuestionsResult = {
  __typename?: 'DeleteQuestionsResult';
  deletedCount: Scalars['Int']['output'];
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type DeleteResearchResult = {
  __typename?: 'DeleteResearchResult';
  deletedCount: Scalars['Int']['output'];
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type ElevenLabsVoice = {
  __typename?: 'ElevenLabsVoice';
  description: Scalars['String']['output'];
  id: Scalars['String']['output'];
  name: Scalars['String']['output'];
};

export type EvidenceItem = {
  __typename?: 'EvidenceItem';
  excerpt?: Maybe<Scalars['String']['output']>;
  locator?: Maybe<EvidenceLocator>;
  paper: PaperCandidate;
  polarity: EvidencePolarity;
  rationale?: Maybe<Scalars['String']['output']>;
  score?: Maybe<Scalars['Float']['output']>;
};

export type EvidenceLocator = {
  __typename?: 'EvidenceLocator';
  page?: Maybe<Scalars['Int']['output']>;
  section?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export enum EvidencePolarity {
  Contradicts = 'CONTRADICTS',
  Irrelevant = 'IRRELEVANT',
  Mixed = 'MIXED',
  Supports = 'SUPPORTS'
}

export type GenerateAudioFromTextInput = {
  modelId?: InputMaybe<Scalars['String']['input']>;
  outputFormat?: InputMaybe<Scalars['String']['input']>;
  similarityBoost?: InputMaybe<Scalars['Float']['input']>;
  speed?: InputMaybe<Scalars['Float']['input']>;
  stability?: InputMaybe<Scalars['Float']['input']>;
  text: Scalars['String']['input'];
  useSpeakerBoost?: InputMaybe<Scalars['Boolean']['input']>;
  voiceId?: InputMaybe<Scalars['String']['input']>;
};

export type GenerateAudioFromTextResult = {
  __typename?: 'GenerateAudioFromTextResult';
  audioBuffer?: Maybe<Scalars['String']['output']>;
  fileName?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  sizeBytes?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GenerateAudioResult = {
  __typename?: 'GenerateAudioResult';
  audioUrl?: Maybe<Scalars['String']['output']>;
  jobId: Scalars['String']['output'];
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GenerateLongFormTextResult = {
  __typename?: 'GenerateLongFormTextResult';
  audioUrl?: Maybe<Scalars['String']['output']>;
  jobId?: Maybe<Scalars['String']['output']>;
  manifestUrl?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  segmentUrls?: Maybe<Array<Scalars['String']['output']>>;
  storyId?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
  text?: Maybe<Scalars['String']['output']>;
};

export type GenerateQuestionsResult = {
  __typename?: 'GenerateQuestionsResult';
  jobId?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  questions: Array<TherapeuticQuestion>;
  success: Scalars['Boolean']['output'];
};

export type GenerateResearchResult = {
  __typename?: 'GenerateResearchResult';
  count?: Maybe<Scalars['Int']['output']>;
  jobId?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GenerationJob = {
  __typename?: 'GenerationJob';
  createdAt: Scalars['String']['output'];
  error?: Maybe<JobError>;
  goalId: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  progress: Scalars['Float']['output'];
  result?: Maybe<JobResult>;
  status: JobStatus;
  storyId?: Maybe<Scalars['Int']['output']>;
  type: JobType;
  updatedAt: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type Goal = {
  __typename?: 'Goal';
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  familyMemberId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  notes: Array<Note>;
  priority: Scalars['String']['output'];
  questions: Array<TherapeuticQuestion>;
  research: Array<Research>;
  slug?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  stories: Array<GoalStory>;
  targetDate?: Maybe<Scalars['String']['output']>;
  therapeuticText?: Maybe<Scalars['String']['output']>;
  therapeuticTextGeneratedAt?: Maybe<Scalars['String']['output']>;
  therapeuticTextLanguage?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type GoalStory = {
  __typename?: 'GoalStory';
  audioAssets: Array<AudioAsset>;
  createdAt: Scalars['String']['output'];
  goalId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  language: Scalars['String']['output'];
  minutes: Scalars['Int']['output'];
  segments: Array<TextSegment>;
  text: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
};

export type JobError = {
  __typename?: 'JobError';
  code?: Maybe<Scalars['String']['output']>;
  details?: Maybe<Scalars['String']['output']>;
  message: Scalars['String']['output'];
};

export type JobResult = {
  __typename?: 'JobResult';
  assetId?: Maybe<Scalars['String']['output']>;
  audioUrl?: Maybe<Scalars['String']['output']>;
  count?: Maybe<Scalars['Int']['output']>;
  manifestUrl?: Maybe<Scalars['String']['output']>;
  questions?: Maybe<Array<TherapeuticQuestion>>;
  segmentUrls?: Maybe<Array<Scalars['String']['output']>>;
  text?: Maybe<Scalars['String']['output']>;
};

export enum JobStatus {
  Failed = 'FAILED',
  Running = 'RUNNING',
  Succeeded = 'SUCCEEDED'
}

export enum JobType {
  Audio = 'AUDIO',
  Longform = 'LONGFORM',
  Questions = 'QUESTIONS',
  Research = 'RESEARCH'
}

export type Mutation = {
  __typename?: 'Mutation';
  buildClaimCards: BuildClaimCardsResult;
  checkNoteClaims: CheckNoteClaimsResult;
  createGoal: Goal;
  createNote: Note;
  deleteClaimCard: Scalars['Boolean']['output'];
  deleteGoal: DeleteGoalResult;
  deleteNote: DeleteNoteResult;
  deleteResearch: DeleteResearchResult;
  deleteTherapeuticQuestions: DeleteQuestionsResult;
  generateAudio: GenerateAudioResult;
  generateAudioFromText: GenerateAudioFromTextResult;
  generateLongFormText: GenerateLongFormTextResult;
  generateResearch: GenerateResearchResult;
  generateTherapeuticQuestions: GenerateQuestionsResult;
  refreshClaimCard: ClaimCard;
  updateGoal: Goal;
  updateNote: Note;
  uploadAudioToR2: UploadAudioToR2Result;
};


export type MutationBuildClaimCardsArgs = {
  input: BuildClaimCardsInput;
};


export type MutationCheckNoteClaimsArgs = {
  input: CheckNoteClaimsInput;
};


export type MutationCreateGoalArgs = {
  input: CreateGoalInput;
};


export type MutationCreateNoteArgs = {
  input: CreateNoteInput;
};


export type MutationDeleteClaimCardArgs = {
  id: Scalars['ID']['input'];
};


export type MutationDeleteGoalArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteNoteArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteResearchArgs = {
  goalId: Scalars['Int']['input'];
};


export type MutationDeleteTherapeuticQuestionsArgs = {
  goalId: Scalars['Int']['input'];
};


export type MutationGenerateAudioArgs = {
  goalId: Scalars['Int']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
  storyId?: InputMaybe<Scalars['Int']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  voice?: InputMaybe<Scalars['String']['input']>;
};


export type MutationGenerateAudioFromTextArgs = {
  input: GenerateAudioFromTextInput;
};


export type MutationGenerateLongFormTextArgs = {
  goalId: Scalars['Int']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
  minutes?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationGenerateResearchArgs = {
  goalId: Scalars['Int']['input'];
};


export type MutationGenerateTherapeuticQuestionsArgs = {
  goalId: Scalars['Int']['input'];
};


export type MutationRefreshClaimCardArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateGoalArgs = {
  id: Scalars['Int']['input'];
  input: UpdateGoalInput;
};


export type MutationUpdateNoteArgs = {
  id: Scalars['Int']['input'];
  input: UpdateNoteInput;
};


export type MutationUploadAudioToR2Args = {
  input: UploadAudioToR2Input;
};

export type Note = {
  __typename?: 'Note';
  claimCards?: Maybe<Array<ClaimCard>>;
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  entityId: Scalars['Int']['output'];
  entityType: Scalars['String']['output'];
  goal?: Maybe<Goal>;
  id: Scalars['Int']['output'];
  linkedResearch?: Maybe<Array<Research>>;
  noteType?: Maybe<Scalars['String']['output']>;
  slug?: Maybe<Scalars['String']['output']>;
  tags?: Maybe<Array<Scalars['String']['output']>>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
  userId: Scalars['String']['output'];
};

export type PaperCandidate = {
  __typename?: 'PaperCandidate';
  abstract?: Maybe<Scalars['String']['output']>;
  authors?: Maybe<Array<Scalars['String']['output']>>;
  doi?: Maybe<Scalars['String']['output']>;
  journal?: Maybe<Scalars['String']['output']>;
  oaStatus?: Maybe<Scalars['String']['output']>;
  oaUrl?: Maybe<Scalars['String']['output']>;
  source: Scalars['String']['output'];
  title: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
  year?: Maybe<Scalars['Int']['output']>;
};

export type Query = {
  __typename?: 'Query';
  allNotes: Array<Note>;
  availableVoices: Array<ElevenLabsVoice>;
  claimCard?: Maybe<ClaimCard>;
  claimCardsForNote: Array<ClaimCard>;
  generationJob?: Maybe<GenerationJob>;
  generationJobs: Array<GenerationJob>;
  goal?: Maybe<Goal>;
  goals: Array<Goal>;
  note?: Maybe<Note>;
  notes: Array<Note>;
  research: Array<Research>;
  therapeuticQuestions: Array<TherapeuticQuestion>;
};


export type QueryAllNotesArgs = {
  userId: Scalars['String']['input'];
};


export type QueryClaimCardArgs = {
  id: Scalars['ID']['input'];
};


export type QueryClaimCardsForNoteArgs = {
  noteId: Scalars['Int']['input'];
};


export type QueryGenerationJobArgs = {
  id: Scalars['String']['input'];
};


export type QueryGenerationJobsArgs = {
  goalId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryGoalArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};


export type QueryGoalsArgs = {
  familyMemberId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};


export type QueryNoteArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
};


export type QueryNotesArgs = {
  entityId: Scalars['Int']['input'];
  entityType: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};


export type QueryResearchArgs = {
  goalId: Scalars['Int']['input'];
  userId: Scalars['String']['input'];
};


export type QueryTherapeuticQuestionsArgs = {
  goalId: Scalars['Int']['input'];
};

export type Research = {
  __typename?: 'Research';
  abstract?: Maybe<Scalars['String']['output']>;
  authors: Array<Scalars['String']['output']>;
  createdAt: Scalars['String']['output'];
  doi?: Maybe<Scalars['String']['output']>;
  evidenceLevel?: Maybe<Scalars['String']['output']>;
  extractedBy: Scalars['String']['output'];
  extractionConfidence: Scalars['Float']['output'];
  goal?: Maybe<Goal>;
  goalId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  journal?: Maybe<Scalars['String']['output']>;
  keyFindings: Array<Scalars['String']['output']>;
  relevanceScore: Scalars['Float']['output'];
  therapeuticGoalType: Scalars['String']['output'];
  therapeuticTechniques: Array<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  url?: Maybe<Scalars['String']['output']>;
  year?: Maybe<Scalars['Int']['output']>;
};

export enum ResearchSource {
  Arxiv = 'ARXIV',
  Crossref = 'CROSSREF',
  Datacite = 'DATACITE',
  Europepmc = 'EUROPEPMC',
  Openalex = 'OPENALEX',
  Pubmed = 'PUBMED',
  SemanticScholar = 'SEMANTIC_SCHOLAR'
}

export type Subscription = {
  __typename?: 'Subscription';
  audioJobStatus: GenerationJob;
  researchJobStatus: GenerationJob;
};


export type SubscriptionAudioJobStatusArgs = {
  jobId: Scalars['String']['input'];
};


export type SubscriptionResearchJobStatusArgs = {
  jobId: Scalars['String']['input'];
};

export type TextSegment = {
  __typename?: 'TextSegment';
  createdAt: Scalars['String']['output'];
  goalId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  idx: Scalars['Int']['output'];
  storyId?: Maybe<Scalars['Int']['output']>;
  text: Scalars['String']['output'];
};

export type TherapeuticQuestion = {
  __typename?: 'TherapeuticQuestion';
  createdAt: Scalars['String']['output'];
  generatedAt: Scalars['String']['output'];
  goalId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  question: Scalars['String']['output'];
  rationale: Scalars['String']['output'];
  researchId?: Maybe<Scalars['Int']['output']>;
  researchTitle?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
};

export type UpdateGoalInput = {
  description?: InputMaybe<Scalars['String']['input']>;
  priority?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  targetDate?: InputMaybe<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateNoteInput = {
  content?: InputMaybe<Scalars['String']['input']>;
  createdBy?: InputMaybe<Scalars['String']['input']>;
  linkedResearchIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  noteType?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UploadAudioToR2Input = {
  contextPrefix?: InputMaybe<Scalars['String']['input']>;
  filename?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<AudioMetadataInput>;
  modelId?: InputMaybe<Scalars['String']['input']>;
  speed?: InputMaybe<Scalars['Float']['input']>;
  stability?: InputMaybe<Scalars['Float']['input']>;
  text: Scalars['String']['input'];
  voiceId?: InputMaybe<Scalars['String']['input']>;
};

export type UploadAudioToR2Result = {
  __typename?: 'UploadAudioToR2Result';
  isPublic: Scalars['Boolean']['output'];
  message?: Maybe<Scalars['String']['output']>;
  objectKey: Scalars['String']['output'];
  success: Scalars['Boolean']['output'];
  url: Scalars['String']['output'];
};

export type GenerateAudioFromTextMutationVariables = Exact<{
  text: Scalars['String']['input'];
  voiceId?: InputMaybe<Scalars['String']['input']>;
  modelId?: InputMaybe<Scalars['String']['input']>;
  outputFormat?: InputMaybe<Scalars['String']['input']>;
  stability?: InputMaybe<Scalars['Float']['input']>;
  similarityBoost?: InputMaybe<Scalars['Float']['input']>;
  useSpeakerBoost?: InputMaybe<Scalars['Boolean']['input']>;
  speed?: InputMaybe<Scalars['Float']['input']>;
}>;


export type GenerateAudioFromTextMutation = { __typename?: 'Mutation', generateAudioFromText: { __typename?: 'GenerateAudioFromTextResult', success: boolean, message?: string | null, audioBuffer?: string | null, fileName?: string | null, sizeBytes?: number | null } };

export type GetAvailableVoicesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAvailableVoicesQuery = { __typename?: 'Query', availableVoices: Array<{ __typename?: 'ElevenLabsVoice', id: string, name: string, description: string }> };

export type UploadAudioToR2MutationVariables = Exact<{
  text: Scalars['String']['input'];
  voiceId?: InputMaybe<Scalars['String']['input']>;
  modelId?: InputMaybe<Scalars['String']['input']>;
  contextPrefix?: InputMaybe<Scalars['String']['input']>;
  filename?: InputMaybe<Scalars['String']['input']>;
  metadata?: InputMaybe<AudioMetadataInput>;
  speed?: InputMaybe<Scalars['Float']['input']>;
  stability?: InputMaybe<Scalars['Float']['input']>;
}>;


export type UploadAudioToR2Mutation = { __typename?: 'Mutation', uploadAudioToR2: { __typename?: 'UploadAudioToR2Result', success: boolean, message?: string | null, objectKey: string, url: string, isPublic: boolean } };

export type CheckNoteClaimsMutationVariables = Exact<{
  input: CheckNoteClaimsInput;
}>;


export type CheckNoteClaimsMutation = { __typename?: 'Mutation', checkNoteClaims: { __typename?: 'CheckNoteClaimsResult', success: boolean, message?: string | null, noteId: number, cards: Array<{ __typename?: 'ClaimCard', id: string, claim: string, verdict: ClaimVerdict, confidence: number, queries: Array<string>, createdAt: string, updatedAt: string, notes?: string | null, scope?: { __typename?: 'ClaimScope', population?: string | null, intervention?: string | null, comparator?: string | null, outcome?: string | null, timeframe?: string | null, setting?: string | null } | null, evidence: Array<{ __typename?: 'EvidenceItem', polarity: EvidencePolarity, excerpt?: string | null, rationale?: string | null, score?: number | null, paper: { __typename?: 'PaperCandidate', title: string, doi?: string | null, url?: string | null, year?: number | null, source: string, authors?: Array<string> | null, abstract?: string | null, journal?: string | null }, locator?: { __typename?: 'EvidenceLocator', section?: string | null, page?: number | null, url?: string | null } | null }>, provenance: { __typename?: 'ClaimProvenance', generatedBy: string, model?: string | null, sourceTools: Array<string> } }> } };

export type BuildClaimCardsFromTextMutationVariables = Exact<{ [key: string]: never; }>;


export type BuildClaimCardsFromTextMutation = { __typename?: 'Mutation', buildClaimCards: { __typename?: 'BuildClaimCardsResult', cards: Array<{ __typename?: 'ClaimCard', id: string, claim: string, verdict: ClaimVerdict, confidence: number, queries: Array<string>, createdAt: string, evidence: Array<{ __typename?: 'EvidenceItem', polarity: EvidencePolarity, excerpt?: string | null, rationale?: string | null, score?: number | null, paper: { __typename?: 'PaperCandidate', title: string, authors?: Array<string> | null, doi?: string | null, year?: number | null, journal?: string | null, oaUrl?: string | null } }>, provenance: { __typename?: 'ClaimProvenance', generatedBy: string, model?: string | null, sourceTools: Array<string> } }> } };

export type BuildClaimCardsFromClaimsMutationVariables = Exact<{ [key: string]: never; }>;


export type BuildClaimCardsFromClaimsMutation = { __typename?: 'Mutation', buildClaimCards: { __typename?: 'BuildClaimCardsResult', cards: Array<{ __typename?: 'ClaimCard', id: string, claim: string, verdict: ClaimVerdict, confidence: number, evidence: Array<{ __typename?: 'EvidenceItem', polarity: EvidencePolarity, score?: number | null, paper: { __typename?: 'PaperCandidate', title: string, doi?: string | null } }> }> } };

export type GetClaimCardQueryVariables = Exact<{ [key: string]: never; }>;


export type GetClaimCardQuery = { __typename?: 'Query', claimCard?: { __typename?: 'ClaimCard', id: string, claim: string, verdict: ClaimVerdict, confidence: number, notes?: string | null, createdAt: string, updatedAt: string, evidence: Array<{ __typename?: 'EvidenceItem', polarity: EvidencePolarity, excerpt?: string | null, rationale?: string | null, score?: number | null, paper: { __typename?: 'PaperCandidate', title: string, authors?: Array<string> | null, doi?: string | null, url?: string | null, year?: number | null, journal?: string | null } }>, scope?: { __typename?: 'ClaimScope', population?: string | null, intervention?: string | null, outcome?: string | null } | null } | null };

export type GetClaimCardsForNoteQueryVariables = Exact<{ [key: string]: never; }>;


export type GetClaimCardsForNoteQuery = { __typename?: 'Query', claimCardsForNote: Array<{ __typename?: 'ClaimCard', id: string, claim: string, verdict: ClaimVerdict, confidence: number, createdAt: string, evidence: Array<{ __typename?: 'EvidenceItem', polarity: EvidencePolarity, paper: { __typename?: 'PaperCandidate', title: string, doi?: string | null } }> }> };

export type RefreshClaimCardMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshClaimCardMutation = { __typename?: 'Mutation', refreshClaimCard: { __typename?: 'ClaimCard', id: string, claim: string, verdict: ClaimVerdict, confidence: number, updatedAt: string, evidence: Array<{ __typename?: 'EvidenceItem', polarity: EvidencePolarity, score?: number | null, paper: { __typename?: 'PaperCandidate', title: string, doi?: string | null, year?: number | null } }> } };

export type DeleteClaimCardMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteClaimCardMutation = { __typename?: 'Mutation', deleteClaimCard: boolean };

export type CreateNoteMutationVariables = Exact<{
  input: CreateNoteInput;
}>;


export type CreateNoteMutation = { __typename?: 'Mutation', createNote: { __typename?: 'Note', id: number, entityId: number, entityType: string, userId: string, noteType?: string | null, slug?: string | null, content: string, createdBy?: string | null, tags?: Array<string> | null, createdAt: string, updatedAt: string } };

export type DeleteNoteMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteNoteMutation = { __typename?: 'Mutation', deleteNote: { __typename?: 'DeleteNoteResult', success: boolean, message?: string | null } };

export type DeleteResearchMutationVariables = Exact<{
  goalId: Scalars['Int']['input'];
}>;


export type DeleteResearchMutation = { __typename?: 'Mutation', deleteResearch: { __typename?: 'DeleteResearchResult', success: boolean, message?: string | null, deletedCount: number } };

export type GenerateAudioMutationVariables = Exact<{
  goalId: Scalars['Int']['input'];
  storyId?: InputMaybe<Scalars['Int']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  voice?: InputMaybe<Scalars['String']['input']>;
}>;


export type GenerateAudioMutation = { __typename?: 'Mutation', generateAudio: { __typename?: 'GenerateAudioResult', success: boolean, message?: string | null, jobId: string, audioUrl?: string | null } };

export type GenerateLongFormTextMutationVariables = Exact<{
  goalId: Scalars['Int']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
  minutes?: InputMaybe<Scalars['Int']['input']>;
}>;


export type GenerateLongFormTextMutation = { __typename?: 'Mutation', generateLongFormText: { __typename?: 'GenerateLongFormTextResult', success: boolean, message?: string | null, text?: string | null, audioUrl?: string | null, manifestUrl?: string | null, segmentUrls?: Array<string> | null } };

export type GenerateLongFormTextRomanianMutationVariables = Exact<{
  goalId: Scalars['Int']['input'];
}>;


export type GenerateLongFormTextRomanianMutation = { __typename?: 'Mutation', generateLongFormText: { __typename?: 'GenerateLongFormTextResult', success: boolean, message?: string | null, text?: string | null, audioUrl?: string | null, manifestUrl?: string | null, segmentUrls?: Array<string> | null } };

export type GetAllNotesQueryVariables = Exact<{
  userId: Scalars['String']['input'];
}>;


export type GetAllNotesQuery = { __typename?: 'Query', allNotes: Array<{ __typename?: 'Note', id: number, entityId: number, entityType: string, userId: string, noteType?: string | null, slug?: string | null, title?: string | null, content: string, createdBy?: string | null, tags?: Array<string> | null, createdAt: string, updatedAt: string, goal?: { __typename?: 'Goal', id: number, title: string, description?: string | null, status: string, priority: string, targetDate?: string | null } | null }> };

export type GetGoalQueryVariables = Exact<{
  id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
}>;


export type GetGoalQuery = { __typename?: 'Query', goal?: { __typename?: 'Goal', id: number, slug?: string | null, title: string, description?: string | null, status: string, priority: string, targetDate?: string | null, familyMemberId: number, userId: string, therapeuticText?: string | null, therapeuticTextLanguage?: string | null, therapeuticTextGeneratedAt?: string | null, createdAt: string, updatedAt: string, notes: Array<{ __typename?: 'Note', id: number, slug?: string | null, content: string, noteType?: string | null, tags?: Array<string> | null, createdAt: string, updatedAt: string }>, research: Array<{ __typename?: 'Research', id: number, title: string, authors: Array<string>, year?: number | null, journal?: string | null, url?: string | null }> } | null };

export type GetGoalsQueryVariables = Exact<{
  familyMemberId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
}>;


export type GetGoalsQuery = { __typename?: 'Query', goals: Array<{ __typename?: 'Goal', id: number, title: string, description?: string | null, status: string, priority: string, targetDate?: string | null, familyMemberId: number, userId: string, createdAt: string, updatedAt: string, notes: Array<{ __typename?: 'Note', id: number, slug?: string | null, noteType?: string | null, tags?: Array<string> | null, createdAt: string }> }> };

export type GetNoteQueryVariables = Exact<{
  id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
}>;


export type GetNoteQuery = { __typename?: 'Query', note?: { __typename?: 'Note', id: number, entityId: number, entityType: string, userId: string, noteType?: string | null, slug?: string | null, title?: string | null, content: string, createdBy?: string | null, tags?: Array<string> | null, createdAt: string, updatedAt: string, goal?: { __typename?: 'Goal', id: number, title: string, description?: string | null, status: string, priority: string, targetDate?: string | null, createdAt: string } | null, linkedResearch?: Array<{ __typename?: 'Research', id: number, title: string, authors: Array<string>, year?: number | null, journal?: string | null, url?: string | null, therapeuticGoalType: string, relevanceScore: number }> | null, claimCards?: Array<{ __typename?: 'ClaimCard', id: string, claim: string, verdict: ClaimVerdict, confidence: number, queries: Array<string>, createdAt: string, updatedAt: string, notes?: string | null, scope?: { __typename?: 'ClaimScope', population?: string | null, intervention?: string | null, comparator?: string | null, outcome?: string | null, timeframe?: string | null, setting?: string | null } | null, evidence: Array<{ __typename?: 'EvidenceItem', polarity: EvidencePolarity, score?: number | null, excerpt?: string | null, rationale?: string | null, locator?: { __typename?: 'EvidenceLocator', page?: number | null, section?: string | null, url?: string | null } | null, paper: { __typename?: 'PaperCandidate', title: string, year?: number | null, doi?: string | null, url?: string | null, oaUrl?: string | null, source: string, authors?: Array<string> | null, abstract?: string | null, journal?: string | null } }>, provenance: { __typename?: 'ClaimProvenance', generatedBy: string, model?: string | null, sourceTools: Array<string> } }> | null } | null };

export type GetNotesQueryVariables = Exact<{
  entityId: Scalars['Int']['input'];
  entityType: Scalars['String']['input'];
  userId: Scalars['String']['input'];
}>;


export type GetNotesQuery = { __typename?: 'Query', notes: Array<{ __typename?: 'Note', id: number, entityId: number, entityType: string, userId: string, noteType?: string | null, slug?: string | null, title?: string | null, content: string, createdBy?: string | null, tags?: Array<string> | null, createdAt: string, updatedAt: string, goal?: { __typename?: 'Goal', id: number, title: string, description?: string | null, status: string, priority: string, targetDate?: string | null } | null }> };

export type UpdateNoteMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  input: UpdateNoteInput;
}>;


export type UpdateNoteMutation = { __typename?: 'Mutation', updateNote: { __typename?: 'Note', id: number, entityId: number, entityType: string, userId: string, noteType?: string | null, content: string, createdBy?: string | null, tags?: Array<string> | null, createdAt: string, updatedAt: string } };


export const GenerateAudioFromTextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GenerateAudioFromText"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"voiceId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"modelId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"outputFormat"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stability"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"similarityBoost"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"useSpeakerBoost"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Boolean"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"speed"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generateAudioFromText"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"voiceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"voiceId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"modelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"modelId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"outputFormat"},"value":{"kind":"Variable","name":{"kind":"Name","value":"outputFormat"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"stability"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stability"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"similarityBoost"},"value":{"kind":"Variable","name":{"kind":"Name","value":"similarityBoost"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"useSpeakerBoost"},"value":{"kind":"Variable","name":{"kind":"Name","value":"useSpeakerBoost"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"speed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"speed"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"audioBuffer"}},{"kind":"Field","name":{"kind":"Name","value":"fileName"}},{"kind":"Field","name":{"kind":"Name","value":"sizeBytes"}}]}}]}}]} as unknown as DocumentNode<GenerateAudioFromTextMutation, GenerateAudioFromTextMutationVariables>;
export const GetAvailableVoicesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAvailableVoices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"availableVoices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"description"}}]}}]}}]} as unknown as DocumentNode<GetAvailableVoicesQuery, GetAvailableVoicesQueryVariables>;
export const UploadAudioToR2Document = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UploadAudioToR2"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"voiceId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"modelId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"contextPrefix"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"filename"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"metadata"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"AudioMetadataInput"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"speed"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"stability"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Float"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"uploadAudioToR2"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"voiceId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"voiceId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"modelId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"modelId"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"contextPrefix"},"value":{"kind":"Variable","name":{"kind":"Name","value":"contextPrefix"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"filename"},"value":{"kind":"Variable","name":{"kind":"Name","value":"filename"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"metadata"},"value":{"kind":"Variable","name":{"kind":"Name","value":"metadata"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"speed"},"value":{"kind":"Variable","name":{"kind":"Name","value":"speed"}}},{"kind":"ObjectField","name":{"kind":"Name","value":"stability"},"value":{"kind":"Variable","name":{"kind":"Name","value":"stability"}}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"objectKey"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"isPublic"}}]}}]}}]} as unknown as DocumentNode<UploadAudioToR2Mutation, UploadAudioToR2MutationVariables>;
export const CheckNoteClaimsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CheckNoteClaims"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CheckNoteClaimsInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"checkNoteClaims"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"noteId"}},{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"claim"}},{"kind":"Field","name":{"kind":"Name","value":"scope"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"population"}},{"kind":"Field","name":{"kind":"Name","value":"intervention"}},{"kind":"Field","name":{"kind":"Name","value":"comparator"}},{"kind":"Field","name":{"kind":"Name","value":"outcome"}},{"kind":"Field","name":{"kind":"Name","value":"timeframe"}},{"kind":"Field","name":{"kind":"Name","value":"setting"}}]}},{"kind":"Field","name":{"kind":"Name","value":"verdict"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}},{"kind":"Field","name":{"kind":"Name","value":"evidence"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paper"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"doi"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"abstract"}},{"kind":"Field","name":{"kind":"Name","value":"journal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"polarity"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"rationale"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"locator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"section"}},{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"queries"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"provenance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"model"}},{"kind":"Field","name":{"kind":"Name","value":"sourceTools"}}]}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}}]}}]}}]} as unknown as DocumentNode<CheckNoteClaimsMutation, CheckNoteClaimsMutationVariables>;
export const BuildClaimCardsFromTextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BuildClaimCardsFromText"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"buildClaimCards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"text"},"value":{"kind":"StringValue","value":"Cognitive Behavioral Therapy is effective for treating anxiety disorders.\nCBT reduces anxiety symptoms by 60-80% in most patients.\nThe effects of CBT persist for years after treatment ends.","block":true}},{"kind":"ObjectField","name":{"kind":"Name","value":"perSourceLimit"},"value":{"kind":"IntValue","value":"10"}},{"kind":"ObjectField","name":{"kind":"Name","value":"topK"},"value":{"kind":"IntValue","value":"5"}},{"kind":"ObjectField","name":{"kind":"Name","value":"useLlmJudge"},"value":{"kind":"BooleanValue","value":true}},{"kind":"ObjectField","name":{"kind":"Name","value":"sources"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"CROSSREF"},{"kind":"EnumValue","value":"SEMANTIC_SCHOLAR"},{"kind":"EnumValue","value":"PUBMED"}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"claim"}},{"kind":"Field","name":{"kind":"Name","value":"verdict"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}},{"kind":"Field","name":{"kind":"Name","value":"evidence"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paper"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"doi"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"journal"}},{"kind":"Field","name":{"kind":"Name","value":"oaUrl"}}]}},{"kind":"Field","name":{"kind":"Name","value":"polarity"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"rationale"}},{"kind":"Field","name":{"kind":"Name","value":"score"}}]}},{"kind":"Field","name":{"kind":"Name","value":"queries"}},{"kind":"Field","name":{"kind":"Name","value":"provenance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"model"}},{"kind":"Field","name":{"kind":"Name","value":"sourceTools"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]}}]} as unknown as DocumentNode<BuildClaimCardsFromTextMutation, BuildClaimCardsFromTextMutationVariables>;
export const BuildClaimCardsFromClaimsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"BuildClaimCardsFromClaims"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"buildClaimCards"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"ObjectValue","fields":[{"kind":"ObjectField","name":{"kind":"Name","value":"claims"},"value":{"kind":"ListValue","values":[{"kind":"StringValue","value":"Mindfulness meditation reduces stress in adults with GAD","block":false},{"kind":"StringValue","value":"Exercise therapy improves mood in adults with major depressive disorder","block":false}]}},{"kind":"ObjectField","name":{"kind":"Name","value":"perSourceLimit"},"value":{"kind":"IntValue","value":"8"}},{"kind":"ObjectField","name":{"kind":"Name","value":"topK"},"value":{"kind":"IntValue","value":"4"}},{"kind":"ObjectField","name":{"kind":"Name","value":"useLlmJudge"},"value":{"kind":"BooleanValue","value":false}},{"kind":"ObjectField","name":{"kind":"Name","value":"sources"},"value":{"kind":"ListValue","values":[{"kind":"EnumValue","value":"SEMANTIC_SCHOLAR"},{"kind":"EnumValue","value":"OPENALEX"}]}}]}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"cards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"claim"}},{"kind":"Field","name":{"kind":"Name","value":"verdict"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}},{"kind":"Field","name":{"kind":"Name","value":"evidence"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paper"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"doi"}}]}},{"kind":"Field","name":{"kind":"Name","value":"polarity"}},{"kind":"Field","name":{"kind":"Name","value":"score"}}]}}]}}]}}]}}]} as unknown as DocumentNode<BuildClaimCardsFromClaimsMutation, BuildClaimCardsFromClaimsMutationVariables>;
export const GetClaimCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetClaimCard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"claimCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"claim_abc123def456","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"claim"}},{"kind":"Field","name":{"kind":"Name","value":"verdict"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}},{"kind":"Field","name":{"kind":"Name","value":"evidence"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paper"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"doi"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"journal"}}]}},{"kind":"Field","name":{"kind":"Name","value":"polarity"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"rationale"}},{"kind":"Field","name":{"kind":"Name","value":"score"}}]}},{"kind":"Field","name":{"kind":"Name","value":"scope"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"population"}},{"kind":"Field","name":{"kind":"Name","value":"intervention"}},{"kind":"Field","name":{"kind":"Name","value":"outcome"}}]}},{"kind":"Field","name":{"kind":"Name","value":"notes"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetClaimCardQuery, GetClaimCardQueryVariables>;
export const GetClaimCardsForNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetClaimCardsForNote"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"claimCardsForNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"noteId"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"claim"}},{"kind":"Field","name":{"kind":"Name","value":"verdict"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}},{"kind":"Field","name":{"kind":"Name","value":"evidence"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paper"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"doi"}}]}},{"kind":"Field","name":{"kind":"Name","value":"polarity"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}}]}}]} as unknown as DocumentNode<GetClaimCardsForNoteQuery, GetClaimCardsForNoteQueryVariables>;
export const RefreshClaimCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"RefreshClaimCard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"refreshClaimCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"claim_abc123def456","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"claim"}},{"kind":"Field","name":{"kind":"Name","value":"verdict"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}},{"kind":"Field","name":{"kind":"Name","value":"evidence"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"paper"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"doi"}},{"kind":"Field","name":{"kind":"Name","value":"year"}}]}},{"kind":"Field","name":{"kind":"Name","value":"polarity"}},{"kind":"Field","name":{"kind":"Name","value":"score"}}]}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<RefreshClaimCardMutation, RefreshClaimCardMutationVariables>;
export const DeleteClaimCardDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteClaimCard"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteClaimCard"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"StringValue","value":"claim_abc123def456","block":false}}]}]}}]} as unknown as DocumentNode<DeleteClaimCardMutation, DeleteClaimCardMutationVariables>;
export const CreateNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateNoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"noteType"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<CreateNoteMutation, CreateNoteMutationVariables>;
export const DeleteNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}}]}}]}}]} as unknown as DocumentNode<DeleteNoteMutation, DeleteNoteMutationVariables>;
export const DeleteResearchDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteResearch"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"goalId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteResearch"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"goalId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"goalId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"deletedCount"}}]}}]}}]} as unknown as DocumentNode<DeleteResearchMutation, DeleteResearchMutationVariables>;
export const GenerateAudioDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GenerateAudio"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"goalId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"storyId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"text"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"language"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"voice"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generateAudio"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"goalId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"goalId"}}},{"kind":"Argument","name":{"kind":"Name","value":"storyId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"storyId"}}},{"kind":"Argument","name":{"kind":"Name","value":"text"},"value":{"kind":"Variable","name":{"kind":"Name","value":"text"}}},{"kind":"Argument","name":{"kind":"Name","value":"language"},"value":{"kind":"Variable","name":{"kind":"Name","value":"language"}}},{"kind":"Argument","name":{"kind":"Name","value":"voice"},"value":{"kind":"Variable","name":{"kind":"Name","value":"voice"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"jobId"}},{"kind":"Field","name":{"kind":"Name","value":"audioUrl"}}]}}]}}]} as unknown as DocumentNode<GenerateAudioMutation, GenerateAudioMutationVariables>;
export const GenerateLongFormTextDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GenerateLongFormText"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"goalId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"language"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"minutes"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generateLongFormText"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"goalId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"goalId"}}},{"kind":"Argument","name":{"kind":"Name","value":"language"},"value":{"kind":"Variable","name":{"kind":"Name","value":"language"}}},{"kind":"Argument","name":{"kind":"Name","value":"minutes"},"value":{"kind":"Variable","name":{"kind":"Name","value":"minutes"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"audioUrl"}},{"kind":"Field","name":{"kind":"Name","value":"manifestUrl"}},{"kind":"Field","name":{"kind":"Name","value":"segmentUrls"}}]}}]}}]} as unknown as DocumentNode<GenerateLongFormTextMutation, GenerateLongFormTextMutationVariables>;
export const GenerateLongFormTextRomanianDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"GenerateLongFormTextRomanian"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"goalId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generateLongFormText"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"goalId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"goalId"}}},{"kind":"Argument","name":{"kind":"Name","value":"language"},"value":{"kind":"StringValue","value":"Romanian","block":false}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"text"}},{"kind":"Field","name":{"kind":"Name","value":"audioUrl"}},{"kind":"Field","name":{"kind":"Name","value":"manifestUrl"}},{"kind":"Field","name":{"kind":"Name","value":"segmentUrls"}}]}}]}}]} as unknown as DocumentNode<GenerateLongFormTextRomanianMutation, GenerateLongFormTextRomanianMutationVariables>;
export const GetAllNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetAllNotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"allNotes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"noteType"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"goal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"targetDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetAllNotesQuery, GetAllNotesQueryVariables>;
export const GetGoalDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGoal"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"goal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"targetDate"}},{"kind":"Field","name":{"kind":"Name","value":"familyMemberId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"therapeuticText"}},{"kind":"Field","name":{"kind":"Name","value":"therapeuticTextLanguage"}},{"kind":"Field","name":{"kind":"Name","value":"therapeuticTextGeneratedAt"}},{"kind":"Field","name":{"kind":"Name","value":"notes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"noteType"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"research"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"journal"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetGoalQuery, GetGoalQueryVariables>;
export const GetGoalsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGoals"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"familyMemberId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"goals"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"familyMemberId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"familyMemberId"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"targetDate"}},{"kind":"Field","name":{"kind":"Name","value":"familyMemberId"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"notes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"noteType"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetGoalsQuery, GetGoalsQueryVariables>;
export const GetNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"slug"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"note"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"slug"},"value":{"kind":"Variable","name":{"kind":"Name","value":"slug"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"noteType"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"goal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"targetDate"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}}]}},{"kind":"Field","name":{"kind":"Name","value":"linkedResearch"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"journal"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"therapeuticGoalType"}},{"kind":"Field","name":{"kind":"Name","value":"relevanceScore"}}]}},{"kind":"Field","name":{"kind":"Name","value":"claimCards"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"claim"}},{"kind":"Field","name":{"kind":"Name","value":"verdict"}},{"kind":"Field","name":{"kind":"Name","value":"confidence"}},{"kind":"Field","name":{"kind":"Name","value":"scope"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"population"}},{"kind":"Field","name":{"kind":"Name","value":"intervention"}},{"kind":"Field","name":{"kind":"Name","value":"comparator"}},{"kind":"Field","name":{"kind":"Name","value":"outcome"}},{"kind":"Field","name":{"kind":"Name","value":"timeframe"}},{"kind":"Field","name":{"kind":"Name","value":"setting"}}]}},{"kind":"Field","name":{"kind":"Name","value":"evidence"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"polarity"}},{"kind":"Field","name":{"kind":"Name","value":"score"}},{"kind":"Field","name":{"kind":"Name","value":"excerpt"}},{"kind":"Field","name":{"kind":"Name","value":"rationale"}},{"kind":"Field","name":{"kind":"Name","value":"locator"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"page"}},{"kind":"Field","name":{"kind":"Name","value":"section"}},{"kind":"Field","name":{"kind":"Name","value":"url"}}]}},{"kind":"Field","name":{"kind":"Name","value":"paper"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"year"}},{"kind":"Field","name":{"kind":"Name","value":"doi"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"oaUrl"}},{"kind":"Field","name":{"kind":"Name","value":"source"}},{"kind":"Field","name":{"kind":"Name","value":"authors"}},{"kind":"Field","name":{"kind":"Name","value":"abstract"}},{"kind":"Field","name":{"kind":"Name","value":"journal"}}]}}]}},{"kind":"Field","name":{"kind":"Name","value":"queries"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}},{"kind":"Field","name":{"kind":"Name","value":"provenance"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"generatedBy"}},{"kind":"Field","name":{"kind":"Name","value":"model"}},{"kind":"Field","name":{"kind":"Name","value":"sourceTools"}}]}},{"kind":"Field","name":{"kind":"Name","value":"notes"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetNoteQuery, GetNoteQueryVariables>;
export const GetNotesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetNotes"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"userId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notes"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"entityId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityId"}}},{"kind":"Argument","name":{"kind":"Name","value":"entityType"},"value":{"kind":"Variable","name":{"kind":"Name","value":"entityType"}}},{"kind":"Argument","name":{"kind":"Name","value":"userId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"userId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"noteType"}},{"kind":"Field","name":{"kind":"Name","value":"slug"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"goal"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"status"}},{"kind":"Field","name":{"kind":"Name","value":"priority"}},{"kind":"Field","name":{"kind":"Name","value":"targetDate"}}]}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<GetNotesQuery, GetNotesQueryVariables>;
export const UpdateNoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateNote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"UpdateNoteInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateNote"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"entityId"}},{"kind":"Field","name":{"kind":"Name","value":"entityType"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"noteType"}},{"kind":"Field","name":{"kind":"Name","value":"content"}},{"kind":"Field","name":{"kind":"Name","value":"createdBy"}},{"kind":"Field","name":{"kind":"Name","value":"tags"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"updatedAt"}}]}}]}}]} as unknown as DocumentNode<UpdateNoteMutation, UpdateNoteMutationVariables>;