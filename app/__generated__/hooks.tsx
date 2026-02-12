import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
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
  createdBy: Scalars['String']['output'];
  goalId: Scalars['Int']['output'];
  id: Scalars['String']['output'];
  language: Scalars['String']['output'];
  manifest: AudioManifest;
  mimeType: Scalars['String']['output'];
  storyId?: Maybe<Scalars['Int']['output']>;
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
  title: Scalars['String']['input'];
};

export type CreateNoteInput = {
  content: Scalars['String']['input'];
  entityId: Scalars['Int']['input'];
  entityType: Scalars['String']['input'];
  linkedResearchIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  noteType?: InputMaybe<Scalars['String']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
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
  createdBy: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  familyMemberId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  notes: Array<Note>;
  questions: Array<TherapeuticQuestion>;
  research: Array<Research>;
  slug?: Maybe<Scalars['String']['output']>;
  status: Scalars['String']['output'];
  stories: Array<GoalStory>;
  therapeuticText?: Maybe<Scalars['String']['output']>;
  therapeuticTextGeneratedAt?: Maybe<Scalars['String']['output']>;
  therapeuticTextLanguage?: Maybe<Scalars['String']['output']>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
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
  createdBy: Scalars['String']['output'];
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
};


export type QueryGoalsArgs = {
  familyMemberId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QueryNoteArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QueryNotesArgs = {
  entityId: Scalars['Int']['input'];
  entityType: Scalars['String']['input'];
};


export type QueryResearchArgs = {
  goalId: Scalars['Int']['input'];
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
  status?: InputMaybe<Scalars['String']['input']>;
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

export type CreateGoalMutationVariables = Exact<{
  input: CreateGoalInput;
}>;


export type CreateGoalMutation = { __typename?: 'Mutation', createGoal: { __typename?: 'Goal', id: number, slug?: string | null, title: string, description?: string | null, status: string, createdAt: string, updatedAt: string, familyMemberId: number } };

export type CreateNoteMutationVariables = Exact<{
  input: CreateNoteInput;
}>;


export type CreateNoteMutation = { __typename?: 'Mutation', createNote: { __typename?: 'Note', id: number, entityId: number, entityType: string, createdBy: string, noteType?: string | null, slug?: string | null, content: string, tags?: Array<string> | null, createdAt: string, updatedAt: string } };

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

export type GetAllNotesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllNotesQuery = { __typename?: 'Query', allNotes: Array<{ __typename?: 'Note', id: number, entityId: number, entityType: string, createdBy: string, noteType?: string | null, slug?: string | null, title?: string | null, content: string, tags?: Array<string> | null, createdAt: string, updatedAt: string, goal?: { __typename?: 'Goal', id: number, title: string, description?: string | null, status: string } | null }> };

export type GetGoalQueryVariables = Exact<{
  id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetGoalQuery = { __typename?: 'Query', goal?: { __typename?: 'Goal', id: number, slug?: string | null, title: string, description?: string | null, status: string, familyMemberId: number, createdBy: string, therapeuticText?: string | null, therapeuticTextLanguage?: string | null, therapeuticTextGeneratedAt?: string | null, createdAt: string, updatedAt: string, notes: Array<{ __typename?: 'Note', id: number, slug?: string | null, content: string, noteType?: string | null, tags?: Array<string> | null, createdAt: string, updatedAt: string }>, research: Array<{ __typename?: 'Research', id: number, title: string, authors: Array<string>, year?: number | null, journal?: string | null, url?: string | null }> } | null };

export type GetGoalsQueryVariables = Exact<{
  familyMemberId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetGoalsQuery = { __typename?: 'Query', goals: Array<{ __typename?: 'Goal', id: number, title: string, description?: string | null, status: string, familyMemberId: number, createdBy: string, createdAt: string, updatedAt: string, notes: Array<{ __typename?: 'Note', id: number, slug?: string | null, noteType?: string | null, tags?: Array<string> | null, createdAt: string }> }> };

export type GetNoteQueryVariables = Exact<{
  id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetNoteQuery = { __typename?: 'Query', note?: { __typename?: 'Note', id: number, entityId: number, entityType: string, createdBy: string, noteType?: string | null, slug?: string | null, title?: string | null, content: string, tags?: Array<string> | null, createdAt: string, updatedAt: string, goal?: { __typename?: 'Goal', id: number, title: string, description?: string | null, status: string, createdAt: string } | null, linkedResearch?: Array<{ __typename?: 'Research', id: number, title: string, authors: Array<string>, year?: number | null, journal?: string | null, url?: string | null, therapeuticGoalType: string, relevanceScore: number }> | null, claimCards?: Array<{ __typename?: 'ClaimCard', id: string, claim: string, verdict: ClaimVerdict, confidence: number, queries: Array<string>, createdAt: string, updatedAt: string, notes?: string | null, scope?: { __typename?: 'ClaimScope', population?: string | null, intervention?: string | null, comparator?: string | null, outcome?: string | null, timeframe?: string | null, setting?: string | null } | null, evidence: Array<{ __typename?: 'EvidenceItem', polarity: EvidencePolarity, score?: number | null, excerpt?: string | null, rationale?: string | null, locator?: { __typename?: 'EvidenceLocator', page?: number | null, section?: string | null, url?: string | null } | null, paper: { __typename?: 'PaperCandidate', title: string, year?: number | null, doi?: string | null, url?: string | null, oaUrl?: string | null, source: string, authors?: Array<string> | null, abstract?: string | null, journal?: string | null } }>, provenance: { __typename?: 'ClaimProvenance', generatedBy: string, model?: string | null, sourceTools: Array<string> } }> | null } | null };

export type GetNotesQueryVariables = Exact<{
  entityId: Scalars['Int']['input'];
  entityType: Scalars['String']['input'];
}>;


export type GetNotesQuery = { __typename?: 'Query', notes: Array<{ __typename?: 'Note', id: number, entityId: number, entityType: string, createdBy: string, noteType?: string | null, slug?: string | null, title?: string | null, content: string, tags?: Array<string> | null, createdAt: string, updatedAt: string, goal?: { __typename?: 'Goal', id: number, title: string, description?: string | null, status: string } | null }> };

export type UpdateNoteMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  input: UpdateNoteInput;
}>;


export type UpdateNoteMutation = { __typename?: 'Mutation', updateNote: { __typename?: 'Note', id: number, entityId: number, entityType: string, createdBy: string, noteType?: string | null, content: string, tags?: Array<string> | null, createdAt: string, updatedAt: string } };


export const GenerateAudioFromTextDocument = gql`
    mutation GenerateAudioFromText($text: String!, $voiceId: String, $modelId: String, $outputFormat: String, $stability: Float, $similarityBoost: Float, $useSpeakerBoost: Boolean, $speed: Float) {
  generateAudioFromText(
    input: {text: $text, voiceId: $voiceId, modelId: $modelId, outputFormat: $outputFormat, stability: $stability, similarityBoost: $similarityBoost, useSpeakerBoost: $useSpeakerBoost, speed: $speed}
  ) {
    success
    message
    audioBuffer
    fileName
    sizeBytes
  }
}
    `;
export type GenerateAudioFromTextMutationFn = Apollo.MutationFunction<GenerateAudioFromTextMutation, GenerateAudioFromTextMutationVariables>;

/**
 * __useGenerateAudioFromTextMutation__
 *
 * To run a mutation, you first call `useGenerateAudioFromTextMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateAudioFromTextMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateAudioFromTextMutation, { data, loading, error }] = useGenerateAudioFromTextMutation({
 *   variables: {
 *      text: // value for 'text'
 *      voiceId: // value for 'voiceId'
 *      modelId: // value for 'modelId'
 *      outputFormat: // value for 'outputFormat'
 *      stability: // value for 'stability'
 *      similarityBoost: // value for 'similarityBoost'
 *      useSpeakerBoost: // value for 'useSpeakerBoost'
 *      speed: // value for 'speed'
 *   },
 * });
 */
export function useGenerateAudioFromTextMutation(baseOptions?: Apollo.MutationHookOptions<GenerateAudioFromTextMutation, GenerateAudioFromTextMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateAudioFromTextMutation, GenerateAudioFromTextMutationVariables>(GenerateAudioFromTextDocument, options);
      }
export type GenerateAudioFromTextMutationHookResult = ReturnType<typeof useGenerateAudioFromTextMutation>;
export type GenerateAudioFromTextMutationResult = Apollo.MutationResult<GenerateAudioFromTextMutation>;
export type GenerateAudioFromTextMutationOptions = Apollo.BaseMutationOptions<GenerateAudioFromTextMutation, GenerateAudioFromTextMutationVariables>;
export const GetAvailableVoicesDocument = gql`
    query GetAvailableVoices {
  availableVoices {
    id
    name
    description
  }
}
    `;

/**
 * __useGetAvailableVoicesQuery__
 *
 * To run a query within a React component, call `useGetAvailableVoicesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAvailableVoicesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAvailableVoicesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAvailableVoicesQuery(baseOptions?: Apollo.QueryHookOptions<GetAvailableVoicesQuery, GetAvailableVoicesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAvailableVoicesQuery, GetAvailableVoicesQueryVariables>(GetAvailableVoicesDocument, options);
      }
export function useGetAvailableVoicesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAvailableVoicesQuery, GetAvailableVoicesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAvailableVoicesQuery, GetAvailableVoicesQueryVariables>(GetAvailableVoicesDocument, options);
        }
// @ts-ignore
export function useGetAvailableVoicesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAvailableVoicesQuery, GetAvailableVoicesQueryVariables>): Apollo.UseSuspenseQueryResult<GetAvailableVoicesQuery, GetAvailableVoicesQueryVariables>;
export function useGetAvailableVoicesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAvailableVoicesQuery, GetAvailableVoicesQueryVariables>): Apollo.UseSuspenseQueryResult<GetAvailableVoicesQuery | undefined, GetAvailableVoicesQueryVariables>;
export function useGetAvailableVoicesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAvailableVoicesQuery, GetAvailableVoicesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAvailableVoicesQuery, GetAvailableVoicesQueryVariables>(GetAvailableVoicesDocument, options);
        }
export type GetAvailableVoicesQueryHookResult = ReturnType<typeof useGetAvailableVoicesQuery>;
export type GetAvailableVoicesLazyQueryHookResult = ReturnType<typeof useGetAvailableVoicesLazyQuery>;
export type GetAvailableVoicesSuspenseQueryHookResult = ReturnType<typeof useGetAvailableVoicesSuspenseQuery>;
export type GetAvailableVoicesQueryResult = Apollo.QueryResult<GetAvailableVoicesQuery, GetAvailableVoicesQueryVariables>;
export const UploadAudioToR2Document = gql`
    mutation UploadAudioToR2($text: String!, $voiceId: String, $modelId: String, $contextPrefix: String, $filename: String, $metadata: AudioMetadataInput, $speed: Float, $stability: Float) {
  uploadAudioToR2(
    input: {text: $text, voiceId: $voiceId, modelId: $modelId, contextPrefix: $contextPrefix, filename: $filename, metadata: $metadata, speed: $speed, stability: $stability}
  ) {
    success
    message
    objectKey
    url
    isPublic
  }
}
    `;
export type UploadAudioToR2MutationFn = Apollo.MutationFunction<UploadAudioToR2Mutation, UploadAudioToR2MutationVariables>;

/**
 * __useUploadAudioToR2Mutation__
 *
 * To run a mutation, you first call `useUploadAudioToR2Mutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUploadAudioToR2Mutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [uploadAudioToR2Mutation, { data, loading, error }] = useUploadAudioToR2Mutation({
 *   variables: {
 *      text: // value for 'text'
 *      voiceId: // value for 'voiceId'
 *      modelId: // value for 'modelId'
 *      contextPrefix: // value for 'contextPrefix'
 *      filename: // value for 'filename'
 *      metadata: // value for 'metadata'
 *      speed: // value for 'speed'
 *      stability: // value for 'stability'
 *   },
 * });
 */
export function useUploadAudioToR2Mutation(baseOptions?: Apollo.MutationHookOptions<UploadAudioToR2Mutation, UploadAudioToR2MutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UploadAudioToR2Mutation, UploadAudioToR2MutationVariables>(UploadAudioToR2Document, options);
      }
export type UploadAudioToR2MutationHookResult = ReturnType<typeof useUploadAudioToR2Mutation>;
export type UploadAudioToR2MutationResult = Apollo.MutationResult<UploadAudioToR2Mutation>;
export type UploadAudioToR2MutationOptions = Apollo.BaseMutationOptions<UploadAudioToR2Mutation, UploadAudioToR2MutationVariables>;
export const CheckNoteClaimsDocument = gql`
    mutation CheckNoteClaims($input: CheckNoteClaimsInput!) {
  checkNoteClaims(input: $input) {
    success
    message
    noteId
    cards {
      id
      claim
      scope {
        population
        intervention
        comparator
        outcome
        timeframe
        setting
      }
      verdict
      confidence
      evidence {
        paper {
          title
          doi
          url
          year
          source
          authors
          abstract
          journal
        }
        polarity
        excerpt
        rationale
        score
        locator {
          section
          page
          url
        }
      }
      queries
      createdAt
      updatedAt
      provenance {
        generatedBy
        model
        sourceTools
      }
      notes
    }
  }
}
    `;
export type CheckNoteClaimsMutationFn = Apollo.MutationFunction<CheckNoteClaimsMutation, CheckNoteClaimsMutationVariables>;

/**
 * __useCheckNoteClaimsMutation__
 *
 * To run a mutation, you first call `useCheckNoteClaimsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCheckNoteClaimsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [checkNoteClaimsMutation, { data, loading, error }] = useCheckNoteClaimsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCheckNoteClaimsMutation(baseOptions?: Apollo.MutationHookOptions<CheckNoteClaimsMutation, CheckNoteClaimsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CheckNoteClaimsMutation, CheckNoteClaimsMutationVariables>(CheckNoteClaimsDocument, options);
      }
export type CheckNoteClaimsMutationHookResult = ReturnType<typeof useCheckNoteClaimsMutation>;
export type CheckNoteClaimsMutationResult = Apollo.MutationResult<CheckNoteClaimsMutation>;
export type CheckNoteClaimsMutationOptions = Apollo.BaseMutationOptions<CheckNoteClaimsMutation, CheckNoteClaimsMutationVariables>;
export const BuildClaimCardsFromTextDocument = gql`
    mutation BuildClaimCardsFromText {
  buildClaimCards(
    input: {text: """
    Cognitive Behavioral Therapy is effective for treating anxiety disorders.
    CBT reduces anxiety symptoms by 60-80% in most patients.
    The effects of CBT persist for years after treatment ends.
    """, perSourceLimit: 10, topK: 5, useLlmJudge: true, sources: [CROSSREF, SEMANTIC_SCHOLAR, PUBMED]}
  ) {
    cards {
      id
      claim
      verdict
      confidence
      evidence {
        paper {
          title
          authors
          doi
          year
          journal
          oaUrl
        }
        polarity
        excerpt
        rationale
        score
      }
      queries
      provenance {
        generatedBy
        model
        sourceTools
      }
      createdAt
    }
  }
}
    `;
export type BuildClaimCardsFromTextMutationFn = Apollo.MutationFunction<BuildClaimCardsFromTextMutation, BuildClaimCardsFromTextMutationVariables>;

/**
 * __useBuildClaimCardsFromTextMutation__
 *
 * To run a mutation, you first call `useBuildClaimCardsFromTextMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBuildClaimCardsFromTextMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [buildClaimCardsFromTextMutation, { data, loading, error }] = useBuildClaimCardsFromTextMutation({
 *   variables: {
 *   },
 * });
 */
export function useBuildClaimCardsFromTextMutation(baseOptions?: Apollo.MutationHookOptions<BuildClaimCardsFromTextMutation, BuildClaimCardsFromTextMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BuildClaimCardsFromTextMutation, BuildClaimCardsFromTextMutationVariables>(BuildClaimCardsFromTextDocument, options);
      }
export type BuildClaimCardsFromTextMutationHookResult = ReturnType<typeof useBuildClaimCardsFromTextMutation>;
export type BuildClaimCardsFromTextMutationResult = Apollo.MutationResult<BuildClaimCardsFromTextMutation>;
export type BuildClaimCardsFromTextMutationOptions = Apollo.BaseMutationOptions<BuildClaimCardsFromTextMutation, BuildClaimCardsFromTextMutationVariables>;
export const BuildClaimCardsFromClaimsDocument = gql`
    mutation BuildClaimCardsFromClaims {
  buildClaimCards(
    input: {claims: ["Mindfulness meditation reduces stress in adults with GAD", "Exercise therapy improves mood in adults with major depressive disorder"], perSourceLimit: 8, topK: 4, useLlmJudge: false, sources: [SEMANTIC_SCHOLAR, OPENALEX]}
  ) {
    cards {
      id
      claim
      verdict
      confidence
      evidence {
        paper {
          title
          doi
        }
        polarity
        score
      }
    }
  }
}
    `;
export type BuildClaimCardsFromClaimsMutationFn = Apollo.MutationFunction<BuildClaimCardsFromClaimsMutation, BuildClaimCardsFromClaimsMutationVariables>;

/**
 * __useBuildClaimCardsFromClaimsMutation__
 *
 * To run a mutation, you first call `useBuildClaimCardsFromClaimsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useBuildClaimCardsFromClaimsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [buildClaimCardsFromClaimsMutation, { data, loading, error }] = useBuildClaimCardsFromClaimsMutation({
 *   variables: {
 *   },
 * });
 */
export function useBuildClaimCardsFromClaimsMutation(baseOptions?: Apollo.MutationHookOptions<BuildClaimCardsFromClaimsMutation, BuildClaimCardsFromClaimsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<BuildClaimCardsFromClaimsMutation, BuildClaimCardsFromClaimsMutationVariables>(BuildClaimCardsFromClaimsDocument, options);
      }
export type BuildClaimCardsFromClaimsMutationHookResult = ReturnType<typeof useBuildClaimCardsFromClaimsMutation>;
export type BuildClaimCardsFromClaimsMutationResult = Apollo.MutationResult<BuildClaimCardsFromClaimsMutation>;
export type BuildClaimCardsFromClaimsMutationOptions = Apollo.BaseMutationOptions<BuildClaimCardsFromClaimsMutation, BuildClaimCardsFromClaimsMutationVariables>;
export const GetClaimCardDocument = gql`
    query GetClaimCard {
  claimCard(id: "claim_abc123def456") {
    id
    claim
    verdict
    confidence
    evidence {
      paper {
        title
        authors
        doi
        url
        year
        journal
      }
      polarity
      excerpt
      rationale
      score
    }
    scope {
      population
      intervention
      outcome
    }
    notes
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetClaimCardQuery__
 *
 * To run a query within a React component, call `useGetClaimCardQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClaimCardQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClaimCardQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetClaimCardQuery(baseOptions?: Apollo.QueryHookOptions<GetClaimCardQuery, GetClaimCardQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetClaimCardQuery, GetClaimCardQueryVariables>(GetClaimCardDocument, options);
      }
export function useGetClaimCardLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetClaimCardQuery, GetClaimCardQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetClaimCardQuery, GetClaimCardQueryVariables>(GetClaimCardDocument, options);
        }
// @ts-ignore
export function useGetClaimCardSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetClaimCardQuery, GetClaimCardQueryVariables>): Apollo.UseSuspenseQueryResult<GetClaimCardQuery, GetClaimCardQueryVariables>;
export function useGetClaimCardSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetClaimCardQuery, GetClaimCardQueryVariables>): Apollo.UseSuspenseQueryResult<GetClaimCardQuery | undefined, GetClaimCardQueryVariables>;
export function useGetClaimCardSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetClaimCardQuery, GetClaimCardQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetClaimCardQuery, GetClaimCardQueryVariables>(GetClaimCardDocument, options);
        }
export type GetClaimCardQueryHookResult = ReturnType<typeof useGetClaimCardQuery>;
export type GetClaimCardLazyQueryHookResult = ReturnType<typeof useGetClaimCardLazyQuery>;
export type GetClaimCardSuspenseQueryHookResult = ReturnType<typeof useGetClaimCardSuspenseQuery>;
export type GetClaimCardQueryResult = Apollo.QueryResult<GetClaimCardQuery, GetClaimCardQueryVariables>;
export const GetClaimCardsForNoteDocument = gql`
    query GetClaimCardsForNote {
  claimCardsForNote(noteId: 1) {
    id
    claim
    verdict
    confidence
    evidence {
      paper {
        title
        doi
      }
      polarity
    }
    createdAt
  }
}
    `;

/**
 * __useGetClaimCardsForNoteQuery__
 *
 * To run a query within a React component, call `useGetClaimCardsForNoteQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetClaimCardsForNoteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetClaimCardsForNoteQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetClaimCardsForNoteQuery(baseOptions?: Apollo.QueryHookOptions<GetClaimCardsForNoteQuery, GetClaimCardsForNoteQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetClaimCardsForNoteQuery, GetClaimCardsForNoteQueryVariables>(GetClaimCardsForNoteDocument, options);
      }
export function useGetClaimCardsForNoteLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetClaimCardsForNoteQuery, GetClaimCardsForNoteQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetClaimCardsForNoteQuery, GetClaimCardsForNoteQueryVariables>(GetClaimCardsForNoteDocument, options);
        }
// @ts-ignore
export function useGetClaimCardsForNoteSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetClaimCardsForNoteQuery, GetClaimCardsForNoteQueryVariables>): Apollo.UseSuspenseQueryResult<GetClaimCardsForNoteQuery, GetClaimCardsForNoteQueryVariables>;
export function useGetClaimCardsForNoteSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetClaimCardsForNoteQuery, GetClaimCardsForNoteQueryVariables>): Apollo.UseSuspenseQueryResult<GetClaimCardsForNoteQuery | undefined, GetClaimCardsForNoteQueryVariables>;
export function useGetClaimCardsForNoteSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetClaimCardsForNoteQuery, GetClaimCardsForNoteQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetClaimCardsForNoteQuery, GetClaimCardsForNoteQueryVariables>(GetClaimCardsForNoteDocument, options);
        }
export type GetClaimCardsForNoteQueryHookResult = ReturnType<typeof useGetClaimCardsForNoteQuery>;
export type GetClaimCardsForNoteLazyQueryHookResult = ReturnType<typeof useGetClaimCardsForNoteLazyQuery>;
export type GetClaimCardsForNoteSuspenseQueryHookResult = ReturnType<typeof useGetClaimCardsForNoteSuspenseQuery>;
export type GetClaimCardsForNoteQueryResult = Apollo.QueryResult<GetClaimCardsForNoteQuery, GetClaimCardsForNoteQueryVariables>;
export const RefreshClaimCardDocument = gql`
    mutation RefreshClaimCard {
  refreshClaimCard(id: "claim_abc123def456") {
    id
    claim
    verdict
    confidence
    evidence {
      paper {
        title
        doi
        year
      }
      polarity
      score
    }
    updatedAt
  }
}
    `;
export type RefreshClaimCardMutationFn = Apollo.MutationFunction<RefreshClaimCardMutation, RefreshClaimCardMutationVariables>;

/**
 * __useRefreshClaimCardMutation__
 *
 * To run a mutation, you first call `useRefreshClaimCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshClaimCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshClaimCardMutation, { data, loading, error }] = useRefreshClaimCardMutation({
 *   variables: {
 *   },
 * });
 */
export function useRefreshClaimCardMutation(baseOptions?: Apollo.MutationHookOptions<RefreshClaimCardMutation, RefreshClaimCardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RefreshClaimCardMutation, RefreshClaimCardMutationVariables>(RefreshClaimCardDocument, options);
      }
export type RefreshClaimCardMutationHookResult = ReturnType<typeof useRefreshClaimCardMutation>;
export type RefreshClaimCardMutationResult = Apollo.MutationResult<RefreshClaimCardMutation>;
export type RefreshClaimCardMutationOptions = Apollo.BaseMutationOptions<RefreshClaimCardMutation, RefreshClaimCardMutationVariables>;
export const DeleteClaimCardDocument = gql`
    mutation DeleteClaimCard {
  deleteClaimCard(id: "claim_abc123def456")
}
    `;
export type DeleteClaimCardMutationFn = Apollo.MutationFunction<DeleteClaimCardMutation, DeleteClaimCardMutationVariables>;

/**
 * __useDeleteClaimCardMutation__
 *
 * To run a mutation, you first call `useDeleteClaimCardMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteClaimCardMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteClaimCardMutation, { data, loading, error }] = useDeleteClaimCardMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteClaimCardMutation(baseOptions?: Apollo.MutationHookOptions<DeleteClaimCardMutation, DeleteClaimCardMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteClaimCardMutation, DeleteClaimCardMutationVariables>(DeleteClaimCardDocument, options);
      }
export type DeleteClaimCardMutationHookResult = ReturnType<typeof useDeleteClaimCardMutation>;
export type DeleteClaimCardMutationResult = Apollo.MutationResult<DeleteClaimCardMutation>;
export type DeleteClaimCardMutationOptions = Apollo.BaseMutationOptions<DeleteClaimCardMutation, DeleteClaimCardMutationVariables>;
export const CreateGoalDocument = gql`
    mutation CreateGoal($input: CreateGoalInput!) {
  createGoal(input: $input) {
    id
    slug
    title
    description
    status
    createdAt
    updatedAt
    familyMemberId
  }
}
    `;
export type CreateGoalMutationFn = Apollo.MutationFunction<CreateGoalMutation, CreateGoalMutationVariables>;

/**
 * __useCreateGoalMutation__
 *
 * To run a mutation, you first call `useCreateGoalMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateGoalMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createGoalMutation, { data, loading, error }] = useCreateGoalMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateGoalMutation(baseOptions?: Apollo.MutationHookOptions<CreateGoalMutation, CreateGoalMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateGoalMutation, CreateGoalMutationVariables>(CreateGoalDocument, options);
      }
export type CreateGoalMutationHookResult = ReturnType<typeof useCreateGoalMutation>;
export type CreateGoalMutationResult = Apollo.MutationResult<CreateGoalMutation>;
export type CreateGoalMutationOptions = Apollo.BaseMutationOptions<CreateGoalMutation, CreateGoalMutationVariables>;
export const CreateNoteDocument = gql`
    mutation CreateNote($input: CreateNoteInput!) {
  createNote(input: $input) {
    id
    entityId
    entityType
    createdBy
    noteType
    slug
    content
    createdBy
    tags
    createdAt
    updatedAt
  }
}
    `;
export type CreateNoteMutationFn = Apollo.MutationFunction<CreateNoteMutation, CreateNoteMutationVariables>;

/**
 * __useCreateNoteMutation__
 *
 * To run a mutation, you first call `useCreateNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createNoteMutation, { data, loading, error }] = useCreateNoteMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateNoteMutation(baseOptions?: Apollo.MutationHookOptions<CreateNoteMutation, CreateNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateNoteMutation, CreateNoteMutationVariables>(CreateNoteDocument, options);
      }
export type CreateNoteMutationHookResult = ReturnType<typeof useCreateNoteMutation>;
export type CreateNoteMutationResult = Apollo.MutationResult<CreateNoteMutation>;
export type CreateNoteMutationOptions = Apollo.BaseMutationOptions<CreateNoteMutation, CreateNoteMutationVariables>;
export const DeleteNoteDocument = gql`
    mutation DeleteNote($id: Int!) {
  deleteNote(id: $id) {
    success
    message
  }
}
    `;
export type DeleteNoteMutationFn = Apollo.MutationFunction<DeleteNoteMutation, DeleteNoteMutationVariables>;

/**
 * __useDeleteNoteMutation__
 *
 * To run a mutation, you first call `useDeleteNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteNoteMutation, { data, loading, error }] = useDeleteNoteMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteNoteMutation(baseOptions?: Apollo.MutationHookOptions<DeleteNoteMutation, DeleteNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteNoteMutation, DeleteNoteMutationVariables>(DeleteNoteDocument, options);
      }
export type DeleteNoteMutationHookResult = ReturnType<typeof useDeleteNoteMutation>;
export type DeleteNoteMutationResult = Apollo.MutationResult<DeleteNoteMutation>;
export type DeleteNoteMutationOptions = Apollo.BaseMutationOptions<DeleteNoteMutation, DeleteNoteMutationVariables>;
export const DeleteResearchDocument = gql`
    mutation DeleteResearch($goalId: Int!) {
  deleteResearch(goalId: $goalId) {
    success
    message
    deletedCount
  }
}
    `;
export type DeleteResearchMutationFn = Apollo.MutationFunction<DeleteResearchMutation, DeleteResearchMutationVariables>;

/**
 * __useDeleteResearchMutation__
 *
 * To run a mutation, you first call `useDeleteResearchMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteResearchMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteResearchMutation, { data, loading, error }] = useDeleteResearchMutation({
 *   variables: {
 *      goalId: // value for 'goalId'
 *   },
 * });
 */
export function useDeleteResearchMutation(baseOptions?: Apollo.MutationHookOptions<DeleteResearchMutation, DeleteResearchMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteResearchMutation, DeleteResearchMutationVariables>(DeleteResearchDocument, options);
      }
export type DeleteResearchMutationHookResult = ReturnType<typeof useDeleteResearchMutation>;
export type DeleteResearchMutationResult = Apollo.MutationResult<DeleteResearchMutation>;
export type DeleteResearchMutationOptions = Apollo.BaseMutationOptions<DeleteResearchMutation, DeleteResearchMutationVariables>;
export const GenerateAudioDocument = gql`
    mutation GenerateAudio($goalId: Int!, $storyId: Int, $text: String, $language: String, $voice: String) {
  generateAudio(
    goalId: $goalId
    storyId: $storyId
    text: $text
    language: $language
    voice: $voice
  ) {
    success
    message
    jobId
    audioUrl
  }
}
    `;
export type GenerateAudioMutationFn = Apollo.MutationFunction<GenerateAudioMutation, GenerateAudioMutationVariables>;

/**
 * __useGenerateAudioMutation__
 *
 * To run a mutation, you first call `useGenerateAudioMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateAudioMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateAudioMutation, { data, loading, error }] = useGenerateAudioMutation({
 *   variables: {
 *      goalId: // value for 'goalId'
 *      storyId: // value for 'storyId'
 *      text: // value for 'text'
 *      language: // value for 'language'
 *      voice: // value for 'voice'
 *   },
 * });
 */
export function useGenerateAudioMutation(baseOptions?: Apollo.MutationHookOptions<GenerateAudioMutation, GenerateAudioMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateAudioMutation, GenerateAudioMutationVariables>(GenerateAudioDocument, options);
      }
export type GenerateAudioMutationHookResult = ReturnType<typeof useGenerateAudioMutation>;
export type GenerateAudioMutationResult = Apollo.MutationResult<GenerateAudioMutation>;
export type GenerateAudioMutationOptions = Apollo.BaseMutationOptions<GenerateAudioMutation, GenerateAudioMutationVariables>;
export const GenerateLongFormTextDocument = gql`
    mutation GenerateLongFormText($goalId: Int!, $language: String, $minutes: Int) {
  generateLongFormText(goalId: $goalId, language: $language, minutes: $minutes) {
    success
    message
    text
    audioUrl
    manifestUrl
    segmentUrls
  }
}
    `;
export type GenerateLongFormTextMutationFn = Apollo.MutationFunction<GenerateLongFormTextMutation, GenerateLongFormTextMutationVariables>;

/**
 * __useGenerateLongFormTextMutation__
 *
 * To run a mutation, you first call `useGenerateLongFormTextMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateLongFormTextMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateLongFormTextMutation, { data, loading, error }] = useGenerateLongFormTextMutation({
 *   variables: {
 *      goalId: // value for 'goalId'
 *      language: // value for 'language'
 *      minutes: // value for 'minutes'
 *   },
 * });
 */
export function useGenerateLongFormTextMutation(baseOptions?: Apollo.MutationHookOptions<GenerateLongFormTextMutation, GenerateLongFormTextMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateLongFormTextMutation, GenerateLongFormTextMutationVariables>(GenerateLongFormTextDocument, options);
      }
export type GenerateLongFormTextMutationHookResult = ReturnType<typeof useGenerateLongFormTextMutation>;
export type GenerateLongFormTextMutationResult = Apollo.MutationResult<GenerateLongFormTextMutation>;
export type GenerateLongFormTextMutationOptions = Apollo.BaseMutationOptions<GenerateLongFormTextMutation, GenerateLongFormTextMutationVariables>;
export const GenerateLongFormTextRomanianDocument = gql`
    mutation GenerateLongFormTextRomanian($goalId: Int!) {
  generateLongFormText(goalId: $goalId, language: "Romanian") {
    success
    message
    text
    audioUrl
    manifestUrl
    segmentUrls
  }
}
    `;
export type GenerateLongFormTextRomanianMutationFn = Apollo.MutationFunction<GenerateLongFormTextRomanianMutation, GenerateLongFormTextRomanianMutationVariables>;

/**
 * __useGenerateLongFormTextRomanianMutation__
 *
 * To run a mutation, you first call `useGenerateLongFormTextRomanianMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useGenerateLongFormTextRomanianMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [generateLongFormTextRomanianMutation, { data, loading, error }] = useGenerateLongFormTextRomanianMutation({
 *   variables: {
 *      goalId: // value for 'goalId'
 *   },
 * });
 */
export function useGenerateLongFormTextRomanianMutation(baseOptions?: Apollo.MutationHookOptions<GenerateLongFormTextRomanianMutation, GenerateLongFormTextRomanianMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<GenerateLongFormTextRomanianMutation, GenerateLongFormTextRomanianMutationVariables>(GenerateLongFormTextRomanianDocument, options);
      }
export type GenerateLongFormTextRomanianMutationHookResult = ReturnType<typeof useGenerateLongFormTextRomanianMutation>;
export type GenerateLongFormTextRomanianMutationResult = Apollo.MutationResult<GenerateLongFormTextRomanianMutation>;
export type GenerateLongFormTextRomanianMutationOptions = Apollo.BaseMutationOptions<GenerateLongFormTextRomanianMutation, GenerateLongFormTextRomanianMutationVariables>;
export const GetAllNotesDocument = gql`
    query GetAllNotes {
  allNotes {
    id
    entityId
    entityType
    createdBy
    noteType
    slug
    title
    content
    createdBy
    tags
    goal {
      id
      title
      description
      status
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetAllNotesQuery__
 *
 * To run a query within a React component, call `useGetAllNotesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllNotesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllNotesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllNotesQuery(baseOptions?: Apollo.QueryHookOptions<GetAllNotesQuery, GetAllNotesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllNotesQuery, GetAllNotesQueryVariables>(GetAllNotesDocument, options);
      }
export function useGetAllNotesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllNotesQuery, GetAllNotesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllNotesQuery, GetAllNotesQueryVariables>(GetAllNotesDocument, options);
        }
// @ts-ignore
export function useGetAllNotesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetAllNotesQuery, GetAllNotesQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllNotesQuery, GetAllNotesQueryVariables>;
export function useGetAllNotesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllNotesQuery, GetAllNotesQueryVariables>): Apollo.UseSuspenseQueryResult<GetAllNotesQuery | undefined, GetAllNotesQueryVariables>;
export function useGetAllNotesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllNotesQuery, GetAllNotesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllNotesQuery, GetAllNotesQueryVariables>(GetAllNotesDocument, options);
        }
export type GetAllNotesQueryHookResult = ReturnType<typeof useGetAllNotesQuery>;
export type GetAllNotesLazyQueryHookResult = ReturnType<typeof useGetAllNotesLazyQuery>;
export type GetAllNotesSuspenseQueryHookResult = ReturnType<typeof useGetAllNotesSuspenseQuery>;
export type GetAllNotesQueryResult = Apollo.QueryResult<GetAllNotesQuery, GetAllNotesQueryVariables>;
export const GetGoalDocument = gql`
    query GetGoal($id: Int, $slug: String) {
  goal(id: $id, slug: $slug) {
    id
    slug
    title
    description
    status
    familyMemberId
    createdBy
    therapeuticText
    therapeuticTextLanguage
    therapeuticTextGeneratedAt
    notes {
      id
      slug
      content
      noteType
      tags
      createdAt
      updatedAt
    }
    research {
      id
      title
      authors
      year
      journal
      url
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetGoalQuery__
 *
 * To run a query within a React component, call `useGetGoalQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGoalQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGoalQuery({
 *   variables: {
 *      id: // value for 'id'
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetGoalQuery(baseOptions?: Apollo.QueryHookOptions<GetGoalQuery, GetGoalQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGoalQuery, GetGoalQueryVariables>(GetGoalDocument, options);
      }
export function useGetGoalLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGoalQuery, GetGoalQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGoalQuery, GetGoalQueryVariables>(GetGoalDocument, options);
        }
// @ts-ignore
export function useGetGoalSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetGoalQuery, GetGoalQueryVariables>): Apollo.UseSuspenseQueryResult<GetGoalQuery, GetGoalQueryVariables>;
export function useGetGoalSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGoalQuery, GetGoalQueryVariables>): Apollo.UseSuspenseQueryResult<GetGoalQuery | undefined, GetGoalQueryVariables>;
export function useGetGoalSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGoalQuery, GetGoalQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetGoalQuery, GetGoalQueryVariables>(GetGoalDocument, options);
        }
export type GetGoalQueryHookResult = ReturnType<typeof useGetGoalQuery>;
export type GetGoalLazyQueryHookResult = ReturnType<typeof useGetGoalLazyQuery>;
export type GetGoalSuspenseQueryHookResult = ReturnType<typeof useGetGoalSuspenseQuery>;
export type GetGoalQueryResult = Apollo.QueryResult<GetGoalQuery, GetGoalQueryVariables>;
export const GetGoalsDocument = gql`
    query GetGoals($familyMemberId: Int, $status: String) {
  goals(familyMemberId: $familyMemberId, status: $status) {
    id
    title
    description
    status
    familyMemberId
    createdBy
    notes {
      id
      slug
      noteType
      tags
      createdAt
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetGoalsQuery__
 *
 * To run a query within a React component, call `useGetGoalsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetGoalsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetGoalsQuery({
 *   variables: {
 *      familyMemberId: // value for 'familyMemberId'
 *      status: // value for 'status'
 *   },
 * });
 */
export function useGetGoalsQuery(baseOptions?: Apollo.QueryHookOptions<GetGoalsQuery, GetGoalsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetGoalsQuery, GetGoalsQueryVariables>(GetGoalsDocument, options);
      }
export function useGetGoalsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetGoalsQuery, GetGoalsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetGoalsQuery, GetGoalsQueryVariables>(GetGoalsDocument, options);
        }
// @ts-ignore
export function useGetGoalsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetGoalsQuery, GetGoalsQueryVariables>): Apollo.UseSuspenseQueryResult<GetGoalsQuery, GetGoalsQueryVariables>;
export function useGetGoalsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGoalsQuery, GetGoalsQueryVariables>): Apollo.UseSuspenseQueryResult<GetGoalsQuery | undefined, GetGoalsQueryVariables>;
export function useGetGoalsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetGoalsQuery, GetGoalsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetGoalsQuery, GetGoalsQueryVariables>(GetGoalsDocument, options);
        }
export type GetGoalsQueryHookResult = ReturnType<typeof useGetGoalsQuery>;
export type GetGoalsLazyQueryHookResult = ReturnType<typeof useGetGoalsLazyQuery>;
export type GetGoalsSuspenseQueryHookResult = ReturnType<typeof useGetGoalsSuspenseQuery>;
export type GetGoalsQueryResult = Apollo.QueryResult<GetGoalsQuery, GetGoalsQueryVariables>;
export const GetNoteDocument = gql`
    query GetNote($id: Int, $slug: String) {
  note(id: $id, slug: $slug) {
    id
    entityId
    entityType
    createdBy
    noteType
    slug
    title
    content
    createdBy
    tags
    goal {
      id
      title
      description
      status
      createdAt
    }
    linkedResearch {
      id
      title
      authors
      year
      journal
      url
      therapeuticGoalType
      relevanceScore
    }
    claimCards {
      id
      claim
      verdict
      confidence
      scope {
        population
        intervention
        comparator
        outcome
        timeframe
        setting
      }
      evidence {
        polarity
        score
        excerpt
        rationale
        locator {
          page
          section
          url
        }
        paper {
          title
          year
          doi
          url
          oaUrl
          source
          authors
          abstract
          journal
        }
      }
      queries
      createdAt
      updatedAt
      provenance {
        generatedBy
        model
        sourceTools
      }
      notes
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetNoteQuery__
 *
 * To run a query within a React component, call `useGetNoteQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNoteQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNoteQuery({
 *   variables: {
 *      id: // value for 'id'
 *      slug: // value for 'slug'
 *   },
 * });
 */
export function useGetNoteQuery(baseOptions?: Apollo.QueryHookOptions<GetNoteQuery, GetNoteQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNoteQuery, GetNoteQueryVariables>(GetNoteDocument, options);
      }
export function useGetNoteLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNoteQuery, GetNoteQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNoteQuery, GetNoteQueryVariables>(GetNoteDocument, options);
        }
// @ts-ignore
export function useGetNoteSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetNoteQuery, GetNoteQueryVariables>): Apollo.UseSuspenseQueryResult<GetNoteQuery, GetNoteQueryVariables>;
export function useGetNoteSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetNoteQuery, GetNoteQueryVariables>): Apollo.UseSuspenseQueryResult<GetNoteQuery | undefined, GetNoteQueryVariables>;
export function useGetNoteSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetNoteQuery, GetNoteQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetNoteQuery, GetNoteQueryVariables>(GetNoteDocument, options);
        }
export type GetNoteQueryHookResult = ReturnType<typeof useGetNoteQuery>;
export type GetNoteLazyQueryHookResult = ReturnType<typeof useGetNoteLazyQuery>;
export type GetNoteSuspenseQueryHookResult = ReturnType<typeof useGetNoteSuspenseQuery>;
export type GetNoteQueryResult = Apollo.QueryResult<GetNoteQuery, GetNoteQueryVariables>;
export const GetNotesDocument = gql`
    query GetNotes($entityId: Int!, $entityType: String!) {
  notes(entityId: $entityId, entityType: $entityType) {
    id
    entityId
    entityType
    createdBy
    noteType
    slug
    title
    content
    createdBy
    tags
    goal {
      id
      title
      description
      status
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetNotesQuery__
 *
 * To run a query within a React component, call `useGetNotesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetNotesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetNotesQuery({
 *   variables: {
 *      entityId: // value for 'entityId'
 *      entityType: // value for 'entityType'
 *   },
 * });
 */
export function useGetNotesQuery(baseOptions: Apollo.QueryHookOptions<GetNotesQuery, GetNotesQueryVariables> & ({ variables: GetNotesQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetNotesQuery, GetNotesQueryVariables>(GetNotesDocument, options);
      }
export function useGetNotesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetNotesQuery, GetNotesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetNotesQuery, GetNotesQueryVariables>(GetNotesDocument, options);
        }
// @ts-ignore
export function useGetNotesSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetNotesQuery, GetNotesQueryVariables>): Apollo.UseSuspenseQueryResult<GetNotesQuery, GetNotesQueryVariables>;
export function useGetNotesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetNotesQuery, GetNotesQueryVariables>): Apollo.UseSuspenseQueryResult<GetNotesQuery | undefined, GetNotesQueryVariables>;
export function useGetNotesSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetNotesQuery, GetNotesQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetNotesQuery, GetNotesQueryVariables>(GetNotesDocument, options);
        }
export type GetNotesQueryHookResult = ReturnType<typeof useGetNotesQuery>;
export type GetNotesLazyQueryHookResult = ReturnType<typeof useGetNotesLazyQuery>;
export type GetNotesSuspenseQueryHookResult = ReturnType<typeof useGetNotesSuspenseQuery>;
export type GetNotesQueryResult = Apollo.QueryResult<GetNotesQuery, GetNotesQueryVariables>;
export const UpdateNoteDocument = gql`
    mutation UpdateNote($id: Int!, $input: UpdateNoteInput!) {
  updateNote(id: $id, input: $input) {
    id
    entityId
    entityType
    createdBy
    noteType
    content
    createdBy
    tags
    createdAt
    updatedAt
  }
}
    `;
export type UpdateNoteMutationFn = Apollo.MutationFunction<UpdateNoteMutation, UpdateNoteMutationVariables>;

/**
 * __useUpdateNoteMutation__
 *
 * To run a mutation, you first call `useUpdateNoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateNoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateNoteMutation, { data, loading, error }] = useUpdateNoteMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateNoteMutation(baseOptions?: Apollo.MutationHookOptions<UpdateNoteMutation, UpdateNoteMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateNoteMutation, UpdateNoteMutationVariables>(UpdateNoteDocument, options);
      }
export type UpdateNoteMutationHookResult = ReturnType<typeof useUpdateNoteMutation>;
export type UpdateNoteMutationResult = Apollo.MutationResult<UpdateNoteMutation>;
export type UpdateNoteMutationOptions = Apollo.BaseMutationOptions<UpdateNoteMutation, UpdateNoteMutationVariables>;