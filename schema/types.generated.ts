import { GraphQLResolveInfo } from 'graphql';
import { GraphQLContext } from '../app/apollo/context';
export type Maybe<T> = T | null | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export type EnumResolverSignature<T, AllowedValues = any> = { [key in keyof T]?: AllowedValues };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string | number; }
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

export type AudioFromR2Result = {
  __typename?: 'AudioFromR2Result';
  audioUrl?: Maybe<Scalars['String']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  metadata?: Maybe<AudioMetadata>;
  success: Scalars['Boolean']['output'];
};

export type AudioManifest = {
  __typename?: 'AudioManifest';
  segmentCount: Scalars['Int']['output'];
  segments: Array<AudioSegmentInfo>;
  totalDuration?: Maybe<Scalars['Float']['output']>;
};

export type AudioMetadata = {
  __typename?: 'AudioMetadata';
  chunks?: Maybe<Scalars['String']['output']>;
  generatedBy?: Maybe<Scalars['String']['output']>;
  instructions?: Maybe<Scalars['String']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  textLength?: Maybe<Scalars['String']['output']>;
  voice?: Maybe<Scalars['String']['output']>;
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

export type ClaimVerdict =
  | 'CONTRADICTED'
  | 'INSUFFICIENT'
  | 'MIXED'
  | 'SUPPORTED'
  | 'UNVERIFIED';

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

export type CreateStoryInput = {
  content: Scalars['String']['input'];
  goalId: Scalars['Int']['input'];
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

export type DeleteStoryResult = {
  __typename?: 'DeleteStoryResult';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
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

export type EvidencePolarity =
  | 'CONTRADICTS'
  | 'IRRELEVANT'
  | 'MIXED'
  | 'SUPPORTS';

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

export type GenerateOpenAIAudioInput = {
  instructions?: InputMaybe<Scalars['String']['input']>;
  model?: InputMaybe<OpenAITTSModel>;
  responseFormat?: InputMaybe<OpenAIAudioFormat>;
  speed?: InputMaybe<Scalars['Float']['input']>;
  storyId?: InputMaybe<Scalars['Int']['input']>;
  streamFormat?: InputMaybe<OpenAIStreamFormat>;
  text: Scalars['String']['input'];
  uploadToCloud?: InputMaybe<Scalars['Boolean']['input']>;
  voice?: InputMaybe<OpenAITTSVoice>;
};

export type GenerateOpenAIAudioResult = {
  __typename?: 'GenerateOpenAIAudioResult';
  audioBuffer?: Maybe<Scalars['String']['output']>;
  audioUrl?: Maybe<Scalars['String']['output']>;
  duration?: Maybe<Scalars['Float']['output']>;
  key?: Maybe<Scalars['String']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  sizeBytes?: Maybe<Scalars['Int']['output']>;
  success: Scalars['Boolean']['output'];
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
  userStories: Array<Story>;
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

export type JobStatus =
  | 'FAILED'
  | 'RUNNING'
  | 'SUCCEEDED';

export type JobType =
  | 'AUDIO'
  | 'LONGFORM'
  | 'QUESTIONS'
  | 'RESEARCH';

export type Mutation = {
  __typename?: 'Mutation';
  buildClaimCards: BuildClaimCardsResult;
  checkNoteClaims: CheckNoteClaimsResult;
  createGoal: Goal;
  createNote: Note;
  createStory: Story;
  deleteClaimCard: Scalars['Boolean']['output'];
  deleteGoal: DeleteGoalResult;
  deleteNote: DeleteNoteResult;
  deleteResearch: DeleteResearchResult;
  deleteStory: DeleteStoryResult;
  deleteTherapeuticQuestions: DeleteQuestionsResult;
  generateAudio: GenerateAudioResult;
  generateLongFormText: GenerateLongFormTextResult;
  generateOpenAIAudio: GenerateOpenAIAudioResult;
  generateResearch: GenerateResearchResult;
  generateTherapeuticQuestions: GenerateQuestionsResult;
  refreshClaimCard: ClaimCard;
  setNoteVisibility: Note;
  shareNote: NoteShare;
  unshareNote: Scalars['Boolean']['output'];
  updateGoal: Goal;
  updateNote: Note;
  updateStory: Story;
};


export type MutationbuildClaimCardsArgs = {
  input: BuildClaimCardsInput;
};


export type MutationcheckNoteClaimsArgs = {
  input: CheckNoteClaimsInput;
};


export type MutationcreateGoalArgs = {
  input: CreateGoalInput;
};


export type MutationcreateNoteArgs = {
  input: CreateNoteInput;
};


export type MutationcreateStoryArgs = {
  input: CreateStoryInput;
};


export type MutationdeleteClaimCardArgs = {
  id: Scalars['ID']['input'];
};


export type MutationdeleteGoalArgs = {
  id: Scalars['Int']['input'];
};


export type MutationdeleteNoteArgs = {
  id: Scalars['Int']['input'];
};


export type MutationdeleteResearchArgs = {
  goalId: Scalars['Int']['input'];
};


export type MutationdeleteStoryArgs = {
  id: Scalars['Int']['input'];
};


export type MutationdeleteTherapeuticQuestionsArgs = {
  goalId: Scalars['Int']['input'];
};


export type MutationgenerateAudioArgs = {
  goalId: Scalars['Int']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
  storyId?: InputMaybe<Scalars['Int']['input']>;
  text?: InputMaybe<Scalars['String']['input']>;
  voice?: InputMaybe<Scalars['String']['input']>;
};


export type MutationgenerateLongFormTextArgs = {
  goalId: Scalars['Int']['input'];
  language?: InputMaybe<Scalars['String']['input']>;
  minutes?: InputMaybe<Scalars['Int']['input']>;
};


export type MutationgenerateOpenAIAudioArgs = {
  input: GenerateOpenAIAudioInput;
};


export type MutationgenerateResearchArgs = {
  goalId: Scalars['Int']['input'];
};


export type MutationgenerateTherapeuticQuestionsArgs = {
  goalId: Scalars['Int']['input'];
};


export type MutationrefreshClaimCardArgs = {
  id: Scalars['ID']['input'];
};


export type MutationsetNoteVisibilityArgs = {
  noteId: Scalars['Int']['input'];
  visibility: NoteVisibility;
};


export type MutationshareNoteArgs = {
  email: Scalars['String']['input'];
  noteId: Scalars['Int']['input'];
  role?: InputMaybe<NoteShareRole>;
};


export type MutationunshareNoteArgs = {
  email: Scalars['String']['input'];
  noteId: Scalars['Int']['input'];
};


export type MutationupdateGoalArgs = {
  id: Scalars['Int']['input'];
  input: UpdateGoalInput;
};


export type MutationupdateNoteArgs = {
  id: Scalars['Int']['input'];
  input: UpdateNoteInput;
};


export type MutationupdateStoryArgs = {
  id: Scalars['Int']['input'];
  input: UpdateStoryInput;
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
  shares: Array<NoteShare>;
  slug?: Maybe<Scalars['String']['output']>;
  tags?: Maybe<Array<Scalars['String']['output']>>;
  title?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['String']['output'];
  viewerAccess: NoteAccess;
  visibility: NoteVisibility;
};

export type NoteAccess = {
  __typename?: 'NoteAccess';
  canEdit: Scalars['Boolean']['output'];
  canRead: Scalars['Boolean']['output'];
  reason?: Maybe<Scalars['String']['output']>;
};

export type NoteShare = {
  __typename?: 'NoteShare';
  createdAt: Scalars['String']['output'];
  createdBy: Scalars['String']['output'];
  email: Scalars['String']['output'];
  noteId: Scalars['Int']['output'];
  role: NoteShareRole;
};

export type NoteShareRole =
  | 'EDITOR'
  | 'READER';

export type NoteVisibility =
  | 'PRIVATE'
  | 'PUBLIC';

export type OpenAIAudioFormat =
  | 'AAC'
  | 'FLAC'
  | 'MP3'
  | 'OPUS'
  | 'PCM'
  | 'WAV';

export type OpenAIStreamFormat =
  | 'AUDIO'
  | 'SSE';

export type OpenAITTSModel =
  | 'GPT_4O_MINI_TTS'
  | 'TTS_1'
  | 'TTS_1_HD';

export type OpenAITTSVoice =
  | 'ALLOY'
  | 'ASH'
  | 'BALLAD'
  | 'CEDAR'
  | 'CORAL'
  | 'ECHO'
  | 'FABLE'
  | 'MARIN'
  | 'NOVA'
  | 'ONYX'
  | 'SAGE'
  | 'SHIMMER'
  | 'VERSE';

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
  audioFromR2?: Maybe<AudioFromR2Result>;
  claimCard?: Maybe<ClaimCard>;
  claimCardsForNote: Array<ClaimCard>;
  generationJob?: Maybe<GenerationJob>;
  generationJobs: Array<GenerationJob>;
  goal?: Maybe<Goal>;
  goals: Array<Goal>;
  mySharedNotes: Array<Note>;
  note?: Maybe<Note>;
  notes: Array<Note>;
  research: Array<Research>;
  stories: Array<Story>;
  story?: Maybe<Story>;
  therapeuticQuestions: Array<TherapeuticQuestion>;
};


export type QueryaudioFromR2Args = {
  key: Scalars['String']['input'];
};


export type QueryclaimCardArgs = {
  id: Scalars['ID']['input'];
};


export type QueryclaimCardsForNoteArgs = {
  noteId: Scalars['Int']['input'];
};


export type QuerygenerationJobArgs = {
  id: Scalars['String']['input'];
};


export type QuerygenerationJobsArgs = {
  goalId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QuerygoalArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QuerygoalsArgs = {
  familyMemberId?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


export type QuerynoteArgs = {
  id?: InputMaybe<Scalars['Int']['input']>;
  slug?: InputMaybe<Scalars['String']['input']>;
};


export type QuerynotesArgs = {
  entityId: Scalars['Int']['input'];
  entityType: Scalars['String']['input'];
};


export type QueryresearchArgs = {
  goalId: Scalars['Int']['input'];
};


export type QuerystoriesArgs = {
  goalId: Scalars['Int']['input'];
};


export type QuerystoryArgs = {
  id: Scalars['Int']['input'];
};


export type QuerytherapeuticQuestionsArgs = {
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

export type ResearchSource =
  | 'ARXIV'
  | 'CROSSREF'
  | 'DATACITE'
  | 'EUROPEPMC'
  | 'OPENALEX'
  | 'PUBMED'
  | 'SEMANTIC_SCHOLAR';

export type Story = {
  __typename?: 'Story';
  audioGeneratedAt?: Maybe<Scalars['String']['output']>;
  audioKey?: Maybe<Scalars['String']['output']>;
  audioUrl?: Maybe<Scalars['String']['output']>;
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  createdBy: Scalars['String']['output'];
  goal?: Maybe<Goal>;
  goalId: Scalars['Int']['output'];
  id: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  audioJobStatus: GenerationJob;
  researchJobStatus: GenerationJob;
};


export type SubscriptionaudioJobStatusArgs = {
  jobId: Scalars['String']['input'];
};


export type SubscriptionresearchJobStatusArgs = {
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

export type UpdateStoryInput = {
  content?: InputMaybe<Scalars['String']['input']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = Record<PropertyKey, never>, TParent = Record<PropertyKey, never>, TContext = Record<PropertyKey, never>, TArgs = Record<PropertyKey, never>> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;





/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AudioAsset: ResolverTypeWrapper<AudioAsset>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  AudioFromR2Result: ResolverTypeWrapper<AudioFromR2Result>;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  AudioManifest: ResolverTypeWrapper<AudioManifest>;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  AudioMetadata: ResolverTypeWrapper<AudioMetadata>;
  AudioSegmentInfo: ResolverTypeWrapper<AudioSegmentInfo>;
  BuildClaimCardsInput: BuildClaimCardsInput;
  BuildClaimCardsResult: ResolverTypeWrapper<Omit<BuildClaimCardsResult, 'cards'> & { cards: Array<ResolversTypes['ClaimCard']> }>;
  CheckNoteClaimsInput: CheckNoteClaimsInput;
  CheckNoteClaimsResult: ResolverTypeWrapper<Omit<CheckNoteClaimsResult, 'cards'> & { cards: Array<ResolversTypes['ClaimCard']> }>;
  ClaimCard: ResolverTypeWrapper<Omit<ClaimCard, 'evidence' | 'verdict'> & { evidence: Array<ResolversTypes['EvidenceItem']>, verdict: ResolversTypes['ClaimVerdict'] }>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  ClaimProvenance: ResolverTypeWrapper<ClaimProvenance>;
  ClaimScope: ResolverTypeWrapper<ClaimScope>;
  ClaimVerdict: ResolverTypeWrapper<'CONTRADICTED' | 'INSUFFICIENT' | 'MIXED' | 'SUPPORTED' | 'UNVERIFIED'>;
  CreateGoalInput: CreateGoalInput;
  CreateNoteInput: CreateNoteInput;
  CreateStoryInput: CreateStoryInput;
  DeleteGoalResult: ResolverTypeWrapper<DeleteGoalResult>;
  DeleteNoteResult: ResolverTypeWrapper<DeleteNoteResult>;
  DeleteQuestionsResult: ResolverTypeWrapper<DeleteQuestionsResult>;
  DeleteResearchResult: ResolverTypeWrapper<DeleteResearchResult>;
  DeleteStoryResult: ResolverTypeWrapper<DeleteStoryResult>;
  EvidenceItem: ResolverTypeWrapper<Omit<EvidenceItem, 'polarity'> & { polarity: ResolversTypes['EvidencePolarity'] }>;
  EvidenceLocator: ResolverTypeWrapper<EvidenceLocator>;
  EvidencePolarity: ResolverTypeWrapper<'CONTRADICTS' | 'IRRELEVANT' | 'MIXED' | 'SUPPORTS'>;
  GenerateAudioResult: ResolverTypeWrapper<GenerateAudioResult>;
  GenerateLongFormTextResult: ResolverTypeWrapper<GenerateLongFormTextResult>;
  GenerateOpenAIAudioInput: GenerateOpenAIAudioInput;
  GenerateOpenAIAudioResult: ResolverTypeWrapper<GenerateOpenAIAudioResult>;
  GenerateQuestionsResult: ResolverTypeWrapper<GenerateQuestionsResult>;
  GenerateResearchResult: ResolverTypeWrapper<GenerateResearchResult>;
  GenerationJob: ResolverTypeWrapper<Omit<GenerationJob, 'status' | 'type'> & { status: ResolversTypes['JobStatus'], type: ResolversTypes['JobType'] }>;
  Goal: ResolverTypeWrapper<Omit<Goal, 'notes' | 'research' | 'userStories'> & { notes: Array<ResolversTypes['Note']>, research: Array<ResolversTypes['Research']>, userStories: Array<ResolversTypes['Story']> }>;
  GoalStory: ResolverTypeWrapper<GoalStory>;
  JobError: ResolverTypeWrapper<JobError>;
  JobResult: ResolverTypeWrapper<JobResult>;
  JobStatus: ResolverTypeWrapper<'RUNNING' | 'SUCCEEDED' | 'FAILED'>;
  JobType: ResolverTypeWrapper<'AUDIO' | 'RESEARCH' | 'QUESTIONS' | 'LONGFORM'>;
  Mutation: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Note: ResolverTypeWrapper<Omit<Note, 'claimCards' | 'goal' | 'linkedResearch' | 'shares' | 'visibility'> & { claimCards?: Maybe<Array<ResolversTypes['ClaimCard']>>, goal?: Maybe<ResolversTypes['Goal']>, linkedResearch?: Maybe<Array<ResolversTypes['Research']>>, shares: Array<ResolversTypes['NoteShare']>, visibility: ResolversTypes['NoteVisibility'] }>;
  NoteAccess: ResolverTypeWrapper<NoteAccess>;
  NoteShare: ResolverTypeWrapper<Omit<NoteShare, 'role'> & { role: ResolversTypes['NoteShareRole'] }>;
  NoteShareRole: ResolverTypeWrapper<'READER' | 'EDITOR'>;
  NoteVisibility: ResolverTypeWrapper<'PRIVATE' | 'PUBLIC'>;
  OpenAIAudioFormat: ResolverTypeWrapper<'MP3' | 'OPUS' | 'AAC' | 'FLAC' | 'WAV' | 'PCM'>;
  OpenAIStreamFormat: ResolverTypeWrapper<'SSE' | 'AUDIO'>;
  OpenAITTSModel: ResolverTypeWrapper<'TTS_1' | 'TTS_1_HD' | 'GPT_4O_MINI_TTS'>;
  OpenAITTSVoice: ResolverTypeWrapper<'ALLOY' | 'ASH' | 'BALLAD' | 'CORAL' | 'ECHO' | 'FABLE' | 'ONYX' | 'NOVA' | 'SAGE' | 'SHIMMER' | 'VERSE' | 'MARIN' | 'CEDAR'>;
  PaperCandidate: ResolverTypeWrapper<PaperCandidate>;
  Query: ResolverTypeWrapper<Record<PropertyKey, never>>;
  Research: ResolverTypeWrapper<Omit<Research, 'goal'> & { goal?: Maybe<ResolversTypes['Goal']> }>;
  ResearchSource: ResolverTypeWrapper<'ARXIV' | 'CROSSREF' | 'DATACITE' | 'EUROPEPMC' | 'OPENALEX' | 'PUBMED' | 'SEMANTIC_SCHOLAR'>;
  Story: ResolverTypeWrapper<Omit<Story, 'goal'> & { goal?: Maybe<ResolversTypes['Goal']> }>;
  Subscription: ResolverTypeWrapper<Record<PropertyKey, never>>;
  TextSegment: ResolverTypeWrapper<TextSegment>;
  TherapeuticQuestion: ResolverTypeWrapper<TherapeuticQuestion>;
  UpdateGoalInput: UpdateGoalInput;
  UpdateNoteInput: UpdateNoteInput;
  UpdateStoryInput: UpdateStoryInput;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AudioAsset: AudioAsset;
  String: Scalars['String']['output'];
  Int: Scalars['Int']['output'];
  AudioFromR2Result: AudioFromR2Result;
  Boolean: Scalars['Boolean']['output'];
  AudioManifest: AudioManifest;
  Float: Scalars['Float']['output'];
  AudioMetadata: AudioMetadata;
  AudioSegmentInfo: AudioSegmentInfo;
  BuildClaimCardsInput: BuildClaimCardsInput;
  BuildClaimCardsResult: Omit<BuildClaimCardsResult, 'cards'> & { cards: Array<ResolversParentTypes['ClaimCard']> };
  CheckNoteClaimsInput: CheckNoteClaimsInput;
  CheckNoteClaimsResult: Omit<CheckNoteClaimsResult, 'cards'> & { cards: Array<ResolversParentTypes['ClaimCard']> };
  ClaimCard: Omit<ClaimCard, 'evidence'> & { evidence: Array<ResolversParentTypes['EvidenceItem']> };
  ID: Scalars['ID']['output'];
  ClaimProvenance: ClaimProvenance;
  ClaimScope: ClaimScope;
  CreateGoalInput: CreateGoalInput;
  CreateNoteInput: CreateNoteInput;
  CreateStoryInput: CreateStoryInput;
  DeleteGoalResult: DeleteGoalResult;
  DeleteNoteResult: DeleteNoteResult;
  DeleteQuestionsResult: DeleteQuestionsResult;
  DeleteResearchResult: DeleteResearchResult;
  DeleteStoryResult: DeleteStoryResult;
  EvidenceItem: EvidenceItem;
  EvidenceLocator: EvidenceLocator;
  GenerateAudioResult: GenerateAudioResult;
  GenerateLongFormTextResult: GenerateLongFormTextResult;
  GenerateOpenAIAudioInput: GenerateOpenAIAudioInput;
  GenerateOpenAIAudioResult: GenerateOpenAIAudioResult;
  GenerateQuestionsResult: GenerateQuestionsResult;
  GenerateResearchResult: GenerateResearchResult;
  GenerationJob: GenerationJob;
  Goal: Omit<Goal, 'notes' | 'research' | 'userStories'> & { notes: Array<ResolversParentTypes['Note']>, research: Array<ResolversParentTypes['Research']>, userStories: Array<ResolversParentTypes['Story']> };
  GoalStory: GoalStory;
  JobError: JobError;
  JobResult: JobResult;
  Mutation: Record<PropertyKey, never>;
  Note: Omit<Note, 'claimCards' | 'goal' | 'linkedResearch' | 'shares'> & { claimCards?: Maybe<Array<ResolversParentTypes['ClaimCard']>>, goal?: Maybe<ResolversParentTypes['Goal']>, linkedResearch?: Maybe<Array<ResolversParentTypes['Research']>>, shares: Array<ResolversParentTypes['NoteShare']> };
  NoteAccess: NoteAccess;
  NoteShare: NoteShare;
  PaperCandidate: PaperCandidate;
  Query: Record<PropertyKey, never>;
  Research: Omit<Research, 'goal'> & { goal?: Maybe<ResolversParentTypes['Goal']> };
  Story: Omit<Story, 'goal'> & { goal?: Maybe<ResolversParentTypes['Goal']> };
  Subscription: Record<PropertyKey, never>;
  TextSegment: TextSegment;
  TherapeuticQuestion: TherapeuticQuestion;
  UpdateGoalInput: UpdateGoalInput;
  UpdateNoteInput: UpdateNoteInput;
  UpdateStoryInput: UpdateStoryInput;
};

export type AudioAssetResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AudioAsset'] = ResolversParentTypes['AudioAsset']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  goalId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  language?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  manifest?: Resolver<ResolversTypes['AudioManifest'], ParentType, ContextType>;
  mimeType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  storyId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  voice?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type AudioFromR2ResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AudioFromR2Result'] = ResolversParentTypes['AudioFromR2Result']> = {
  audioUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  metadata?: Resolver<Maybe<ResolversTypes['AudioMetadata']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type AudioManifestResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AudioManifest'] = ResolversParentTypes['AudioManifest']> = {
  segmentCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  segments?: Resolver<Array<ResolversTypes['AudioSegmentInfo']>, ParentType, ContextType>;
  totalDuration?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
};

export type AudioMetadataResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AudioMetadata'] = ResolversParentTypes['AudioMetadata']> = {
  chunks?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  generatedBy?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  instructions?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  model?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  textLength?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  voice?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type AudioSegmentInfoResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['AudioSegmentInfo'] = ResolversParentTypes['AudioSegmentInfo']> = {
  duration?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  idx?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  url?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type BuildClaimCardsResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['BuildClaimCardsResult'] = ResolversParentTypes['BuildClaimCardsResult']> = {
  cards?: Resolver<Array<ResolversTypes['ClaimCard']>, ParentType, ContextType>;
};

export type CheckNoteClaimsResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CheckNoteClaimsResult'] = ResolversParentTypes['CheckNoteClaimsResult']> = {
  cards?: Resolver<Array<ResolversTypes['ClaimCard']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  noteId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type ClaimCardResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ClaimCard'] = ResolversParentTypes['ClaimCard']> = {
  claim?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  confidence?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  evidence?: Resolver<Array<ResolversTypes['EvidenceItem']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  notes?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  provenance?: Resolver<ResolversTypes['ClaimProvenance'], ParentType, ContextType>;
  queries?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  scope?: Resolver<Maybe<ResolversTypes['ClaimScope']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  verdict?: Resolver<ResolversTypes['ClaimVerdict'], ParentType, ContextType>;
};

export type ClaimProvenanceResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ClaimProvenance'] = ResolversParentTypes['ClaimProvenance']> = {
  generatedBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  model?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sourceTools?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
};

export type ClaimScopeResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['ClaimScope'] = ResolversParentTypes['ClaimScope']> = {
  comparator?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  intervention?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  outcome?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  population?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  setting?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  timeframe?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type ClaimVerdictResolvers = EnumResolverSignature<{ CONTRADICTED?: any, INSUFFICIENT?: any, MIXED?: any, SUPPORTED?: any, UNVERIFIED?: any }, ResolversTypes['ClaimVerdict']>;

export type DeleteGoalResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DeleteGoalResult'] = ResolversParentTypes['DeleteGoalResult']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type DeleteNoteResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DeleteNoteResult'] = ResolversParentTypes['DeleteNoteResult']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type DeleteQuestionsResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DeleteQuestionsResult'] = ResolversParentTypes['DeleteQuestionsResult']> = {
  deletedCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type DeleteResearchResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DeleteResearchResult'] = ResolversParentTypes['DeleteResearchResult']> = {
  deletedCount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type DeleteStoryResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['DeleteStoryResult'] = ResolversParentTypes['DeleteStoryResult']> = {
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type EvidenceItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['EvidenceItem'] = ResolversParentTypes['EvidenceItem']> = {
  excerpt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  locator?: Resolver<Maybe<ResolversTypes['EvidenceLocator']>, ParentType, ContextType>;
  paper?: Resolver<ResolversTypes['PaperCandidate'], ParentType, ContextType>;
  polarity?: Resolver<ResolversTypes['EvidencePolarity'], ParentType, ContextType>;
  rationale?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  score?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
};

export type EvidenceLocatorResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['EvidenceLocator'] = ResolversParentTypes['EvidenceLocator']> = {
  page?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  section?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type EvidencePolarityResolvers = EnumResolverSignature<{ CONTRADICTS?: any, IRRELEVANT?: any, MIXED?: any, SUPPORTS?: any }, ResolversTypes['EvidencePolarity']>;

export type GenerateAudioResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GenerateAudioResult'] = ResolversParentTypes['GenerateAudioResult']> = {
  audioUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  jobId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type GenerateLongFormTextResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GenerateLongFormTextResult'] = ResolversParentTypes['GenerateLongFormTextResult']> = {
  audioUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  jobId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  manifestUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  segmentUrls?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  storyId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type GenerateOpenAIAudioResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GenerateOpenAIAudioResult'] = ResolversParentTypes['GenerateOpenAIAudioResult']> = {
  audioBuffer?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  audioUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  duration?: Resolver<Maybe<ResolversTypes['Float']>, ParentType, ContextType>;
  key?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  sizeBytes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type GenerateQuestionsResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GenerateQuestionsResult'] = ResolversParentTypes['GenerateQuestionsResult']> = {
  jobId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  questions?: Resolver<Array<ResolversTypes['TherapeuticQuestion']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type GenerateResearchResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GenerateResearchResult'] = ResolversParentTypes['GenerateResearchResult']> = {
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  jobId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  success?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
};

export type GenerationJobResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GenerationJob'] = ResolversParentTypes['GenerationJob']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  error?: Resolver<Maybe<ResolversTypes['JobError']>, ParentType, ContextType>;
  goalId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  progress?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  result?: Resolver<Maybe<ResolversTypes['JobResult']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['JobStatus'], ParentType, ContextType>;
  storyId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  type?: Resolver<ResolversTypes['JobType'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userId?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type GoalResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Goal'] = ResolversParentTypes['Goal']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  familyMemberId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  notes?: Resolver<Array<ResolversTypes['Note']>, ParentType, ContextType>;
  questions?: Resolver<Array<ResolversTypes['TherapeuticQuestion']>, ParentType, ContextType>;
  research?: Resolver<Array<ResolversTypes['Research']>, ParentType, ContextType>;
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  status?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  stories?: Resolver<Array<ResolversTypes['GoalStory']>, ParentType, ContextType>;
  therapeuticText?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  therapeuticTextGeneratedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  therapeuticTextLanguage?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  userStories?: Resolver<Array<ResolversTypes['Story']>, ParentType, ContextType>;
};

export type GoalStoryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['GoalStory'] = ResolversParentTypes['GoalStory']> = {
  audioAssets?: Resolver<Array<ResolversTypes['AudioAsset']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  goalId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  language?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  minutes?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  segments?: Resolver<Array<ResolversTypes['TextSegment']>, ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type JobErrorResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['JobError'] = ResolversParentTypes['JobError']> = {
  code?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  details?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  message?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type JobResultResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['JobResult'] = ResolversParentTypes['JobResult']> = {
  assetId?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  audioUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  count?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  manifestUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  questions?: Resolver<Maybe<Array<ResolversTypes['TherapeuticQuestion']>>, ParentType, ContextType>;
  segmentUrls?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  text?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type JobStatusResolvers = EnumResolverSignature<{ FAILED?: any, RUNNING?: any, SUCCEEDED?: any }, ResolversTypes['JobStatus']>;

export type JobTypeResolvers = EnumResolverSignature<{ AUDIO?: any, LONGFORM?: any, QUESTIONS?: any, RESEARCH?: any }, ResolversTypes['JobType']>;

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  buildClaimCards?: Resolver<ResolversTypes['BuildClaimCardsResult'], ParentType, ContextType, RequireFields<MutationbuildClaimCardsArgs, 'input'>>;
  checkNoteClaims?: Resolver<ResolversTypes['CheckNoteClaimsResult'], ParentType, ContextType, RequireFields<MutationcheckNoteClaimsArgs, 'input'>>;
  createGoal?: Resolver<ResolversTypes['Goal'], ParentType, ContextType, RequireFields<MutationcreateGoalArgs, 'input'>>;
  createNote?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<MutationcreateNoteArgs, 'input'>>;
  createStory?: Resolver<ResolversTypes['Story'], ParentType, ContextType, RequireFields<MutationcreateStoryArgs, 'input'>>;
  deleteClaimCard?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationdeleteClaimCardArgs, 'id'>>;
  deleteGoal?: Resolver<ResolversTypes['DeleteGoalResult'], ParentType, ContextType, RequireFields<MutationdeleteGoalArgs, 'id'>>;
  deleteNote?: Resolver<ResolversTypes['DeleteNoteResult'], ParentType, ContextType, RequireFields<MutationdeleteNoteArgs, 'id'>>;
  deleteResearch?: Resolver<ResolversTypes['DeleteResearchResult'], ParentType, ContextType, RequireFields<MutationdeleteResearchArgs, 'goalId'>>;
  deleteStory?: Resolver<ResolversTypes['DeleteStoryResult'], ParentType, ContextType, RequireFields<MutationdeleteStoryArgs, 'id'>>;
  deleteTherapeuticQuestions?: Resolver<ResolversTypes['DeleteQuestionsResult'], ParentType, ContextType, RequireFields<MutationdeleteTherapeuticQuestionsArgs, 'goalId'>>;
  generateAudio?: Resolver<ResolversTypes['GenerateAudioResult'], ParentType, ContextType, RequireFields<MutationgenerateAudioArgs, 'goalId'>>;
  generateLongFormText?: Resolver<ResolversTypes['GenerateLongFormTextResult'], ParentType, ContextType, RequireFields<MutationgenerateLongFormTextArgs, 'goalId'>>;
  generateOpenAIAudio?: Resolver<ResolversTypes['GenerateOpenAIAudioResult'], ParentType, ContextType, RequireFields<MutationgenerateOpenAIAudioArgs, 'input'>>;
  generateResearch?: Resolver<ResolversTypes['GenerateResearchResult'], ParentType, ContextType, RequireFields<MutationgenerateResearchArgs, 'goalId'>>;
  generateTherapeuticQuestions?: Resolver<ResolversTypes['GenerateQuestionsResult'], ParentType, ContextType, RequireFields<MutationgenerateTherapeuticQuestionsArgs, 'goalId'>>;
  refreshClaimCard?: Resolver<ResolversTypes['ClaimCard'], ParentType, ContextType, RequireFields<MutationrefreshClaimCardArgs, 'id'>>;
  setNoteVisibility?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<MutationsetNoteVisibilityArgs, 'noteId' | 'visibility'>>;
  shareNote?: Resolver<ResolversTypes['NoteShare'], ParentType, ContextType, RequireFields<MutationshareNoteArgs, 'email' | 'noteId'>>;
  unshareNote?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType, RequireFields<MutationunshareNoteArgs, 'email' | 'noteId'>>;
  updateGoal?: Resolver<ResolversTypes['Goal'], ParentType, ContextType, RequireFields<MutationupdateGoalArgs, 'id' | 'input'>>;
  updateNote?: Resolver<ResolversTypes['Note'], ParentType, ContextType, RequireFields<MutationupdateNoteArgs, 'id' | 'input'>>;
  updateStory?: Resolver<ResolversTypes['Story'], ParentType, ContextType, RequireFields<MutationupdateStoryArgs, 'id' | 'input'>>;
};

export type NoteResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Note'] = ResolversParentTypes['Note']> = {
  claimCards?: Resolver<Maybe<Array<ResolversTypes['ClaimCard']>>, ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  entityId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  entityType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  goal?: Resolver<Maybe<ResolversTypes['Goal']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  linkedResearch?: Resolver<Maybe<Array<ResolversTypes['Research']>>, ParentType, ContextType>;
  noteType?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  shares?: Resolver<Array<ResolversTypes['NoteShare']>, ParentType, ContextType>;
  slug?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  tags?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  title?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  viewerAccess?: Resolver<ResolversTypes['NoteAccess'], ParentType, ContextType>;
  visibility?: Resolver<ResolversTypes['NoteVisibility'], ParentType, ContextType>;
};

export type NoteAccessResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['NoteAccess'] = ResolversParentTypes['NoteAccess']> = {
  canEdit?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  canRead?: Resolver<ResolversTypes['Boolean'], ParentType, ContextType>;
  reason?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
};

export type NoteShareResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['NoteShare'] = ResolversParentTypes['NoteShare']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  noteId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  role?: Resolver<ResolversTypes['NoteShareRole'], ParentType, ContextType>;
};

export type NoteShareRoleResolvers = EnumResolverSignature<{ EDITOR?: any, READER?: any }, ResolversTypes['NoteShareRole']>;

export type NoteVisibilityResolvers = EnumResolverSignature<{ PRIVATE?: any, PUBLIC?: any }, ResolversTypes['NoteVisibility']>;

export type OpenAIAudioFormatResolvers = EnumResolverSignature<{ AAC?: any, FLAC?: any, MP3?: any, OPUS?: any, PCM?: any, WAV?: any }, ResolversTypes['OpenAIAudioFormat']>;

export type OpenAIStreamFormatResolvers = EnumResolverSignature<{ AUDIO?: any, SSE?: any }, ResolversTypes['OpenAIStreamFormat']>;

export type OpenAITTSModelResolvers = EnumResolverSignature<{ GPT_4O_MINI_TTS?: any, TTS_1?: any, TTS_1_HD?: any }, ResolversTypes['OpenAITTSModel']>;

export type OpenAITTSVoiceResolvers = EnumResolverSignature<{ ALLOY?: any, ASH?: any, BALLAD?: any, CEDAR?: any, CORAL?: any, ECHO?: any, FABLE?: any, MARIN?: any, NOVA?: any, ONYX?: any, SAGE?: any, SHIMMER?: any, VERSE?: any }, ResolversTypes['OpenAITTSVoice']>;

export type PaperCandidateResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PaperCandidate'] = ResolversParentTypes['PaperCandidate']> = {
  abstract?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  authors?: Resolver<Maybe<Array<ResolversTypes['String']>>, ParentType, ContextType>;
  doi?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  journal?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  oaStatus?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  oaUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  source?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  year?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
};

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  allNotes?: Resolver<Array<ResolversTypes['Note']>, ParentType, ContextType>;
  audioFromR2?: Resolver<Maybe<ResolversTypes['AudioFromR2Result']>, ParentType, ContextType, RequireFields<QueryaudioFromR2Args, 'key'>>;
  claimCard?: Resolver<Maybe<ResolversTypes['ClaimCard']>, ParentType, ContextType, RequireFields<QueryclaimCardArgs, 'id'>>;
  claimCardsForNote?: Resolver<Array<ResolversTypes['ClaimCard']>, ParentType, ContextType, RequireFields<QueryclaimCardsForNoteArgs, 'noteId'>>;
  generationJob?: Resolver<Maybe<ResolversTypes['GenerationJob']>, ParentType, ContextType, RequireFields<QuerygenerationJobArgs, 'id'>>;
  generationJobs?: Resolver<Array<ResolversTypes['GenerationJob']>, ParentType, ContextType, Partial<QuerygenerationJobsArgs>>;
  goal?: Resolver<Maybe<ResolversTypes['Goal']>, ParentType, ContextType, Partial<QuerygoalArgs>>;
  goals?: Resolver<Array<ResolversTypes['Goal']>, ParentType, ContextType, Partial<QuerygoalsArgs>>;
  mySharedNotes?: Resolver<Array<ResolversTypes['Note']>, ParentType, ContextType>;
  note?: Resolver<Maybe<ResolversTypes['Note']>, ParentType, ContextType, Partial<QuerynoteArgs>>;
  notes?: Resolver<Array<ResolversTypes['Note']>, ParentType, ContextType, RequireFields<QuerynotesArgs, 'entityId' | 'entityType'>>;
  research?: Resolver<Array<ResolversTypes['Research']>, ParentType, ContextType, RequireFields<QueryresearchArgs, 'goalId'>>;
  stories?: Resolver<Array<ResolversTypes['Story']>, ParentType, ContextType, RequireFields<QuerystoriesArgs, 'goalId'>>;
  story?: Resolver<Maybe<ResolversTypes['Story']>, ParentType, ContextType, RequireFields<QuerystoryArgs, 'id'>>;
  therapeuticQuestions?: Resolver<Array<ResolversTypes['TherapeuticQuestion']>, ParentType, ContextType, RequireFields<QuerytherapeuticQuestionsArgs, 'goalId'>>;
};

export type ResearchResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Research'] = ResolversParentTypes['Research']> = {
  abstract?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  authors?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  doi?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  evidenceLevel?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  extractedBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  extractionConfidence?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  goal?: Resolver<Maybe<ResolversTypes['Goal']>, ParentType, ContextType>;
  goalId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  journal?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  keyFindings?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  relevanceScore?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  therapeuticGoalType?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  therapeuticTechniques?: Resolver<Array<ResolversTypes['String']>, ParentType, ContextType>;
  title?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  year?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
};

export type ResearchSourceResolvers = EnumResolverSignature<{ ARXIV?: any, CROSSREF?: any, DATACITE?: any, EUROPEPMC?: any, OPENALEX?: any, PUBMED?: any, SEMANTIC_SCHOLAR?: any }, ResolversTypes['ResearchSource']>;

export type StoryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Story'] = ResolversParentTypes['Story']> = {
  audioGeneratedAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  audioKey?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  audioUrl?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  content?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdBy?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  goal?: Resolver<Maybe<ResolversTypes['Goal']>, ParentType, ContextType>;
  goalId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type SubscriptionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Subscription'] = ResolversParentTypes['Subscription']> = {
  audioJobStatus?: SubscriptionResolver<ResolversTypes['GenerationJob'], "audioJobStatus", ParentType, ContextType, RequireFields<SubscriptionaudioJobStatusArgs, 'jobId'>>;
  researchJobStatus?: SubscriptionResolver<ResolversTypes['GenerationJob'], "researchJobStatus", ParentType, ContextType, RequireFields<SubscriptionresearchJobStatusArgs, 'jobId'>>;
};

export type TextSegmentResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['TextSegment'] = ResolversParentTypes['TextSegment']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  goalId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  idx?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  storyId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  text?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type TherapeuticQuestionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['TherapeuticQuestion'] = ResolversParentTypes['TherapeuticQuestion']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  generatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  goalId?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  question?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  rationale?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  researchId?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType>;
  researchTitle?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  updatedAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
};

export type Resolvers<ContextType = GraphQLContext> = {
  AudioAsset?: AudioAssetResolvers<ContextType>;
  AudioFromR2Result?: AudioFromR2ResultResolvers<ContextType>;
  AudioManifest?: AudioManifestResolvers<ContextType>;
  AudioMetadata?: AudioMetadataResolvers<ContextType>;
  AudioSegmentInfo?: AudioSegmentInfoResolvers<ContextType>;
  BuildClaimCardsResult?: BuildClaimCardsResultResolvers<ContextType>;
  CheckNoteClaimsResult?: CheckNoteClaimsResultResolvers<ContextType>;
  ClaimCard?: ClaimCardResolvers<ContextType>;
  ClaimProvenance?: ClaimProvenanceResolvers<ContextType>;
  ClaimScope?: ClaimScopeResolvers<ContextType>;
  ClaimVerdict?: ClaimVerdictResolvers;
  DeleteGoalResult?: DeleteGoalResultResolvers<ContextType>;
  DeleteNoteResult?: DeleteNoteResultResolvers<ContextType>;
  DeleteQuestionsResult?: DeleteQuestionsResultResolvers<ContextType>;
  DeleteResearchResult?: DeleteResearchResultResolvers<ContextType>;
  DeleteStoryResult?: DeleteStoryResultResolvers<ContextType>;
  EvidenceItem?: EvidenceItemResolvers<ContextType>;
  EvidenceLocator?: EvidenceLocatorResolvers<ContextType>;
  EvidencePolarity?: EvidencePolarityResolvers;
  GenerateAudioResult?: GenerateAudioResultResolvers<ContextType>;
  GenerateLongFormTextResult?: GenerateLongFormTextResultResolvers<ContextType>;
  GenerateOpenAIAudioResult?: GenerateOpenAIAudioResultResolvers<ContextType>;
  GenerateQuestionsResult?: GenerateQuestionsResultResolvers<ContextType>;
  GenerateResearchResult?: GenerateResearchResultResolvers<ContextType>;
  GenerationJob?: GenerationJobResolvers<ContextType>;
  Goal?: GoalResolvers<ContextType>;
  GoalStory?: GoalStoryResolvers<ContextType>;
  JobError?: JobErrorResolvers<ContextType>;
  JobResult?: JobResultResolvers<ContextType>;
  JobStatus?: JobStatusResolvers;
  JobType?: JobTypeResolvers;
  Mutation?: MutationResolvers<ContextType>;
  Note?: NoteResolvers<ContextType>;
  NoteAccess?: NoteAccessResolvers<ContextType>;
  NoteShare?: NoteShareResolvers<ContextType>;
  NoteShareRole?: NoteShareRoleResolvers;
  NoteVisibility?: NoteVisibilityResolvers;
  OpenAIAudioFormat?: OpenAIAudioFormatResolvers;
  OpenAIStreamFormat?: OpenAIStreamFormatResolvers;
  OpenAITTSModel?: OpenAITTSModelResolvers;
  OpenAITTSVoice?: OpenAITTSVoiceResolvers;
  PaperCandidate?: PaperCandidateResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Research?: ResearchResolvers<ContextType>;
  ResearchSource?: ResearchSourceResolvers;
  Story?: StoryResolvers<ContextType>;
  Subscription?: SubscriptionResolvers<ContextType>;
  TextSegment?: TextSegmentResolvers<ContextType>;
  TherapeuticQuestion?: TherapeuticQuestionResolvers<ContextType>;
};

