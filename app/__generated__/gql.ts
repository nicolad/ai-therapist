/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
type Documents = {
    "mutation CreateNote($input: CreateNoteInput!) {\n  createNote(input: $input) {\n    id\n    entityId\n    entityType\n    userId\n    noteType\n    content\n    createdBy\n    tags\n    createdAt\n    updatedAt\n  }\n}": typeof types.CreateNoteDocument,
    "mutation DeleteTherapyResearch($goalId: Int!) {\n  deleteTherapyResearch(goalId: $goalId) {\n    success\n    message\n    deletedCount\n  }\n}": typeof types.DeleteTherapyResearchDocument,
    "mutation GenerateAudio($goalId: Int!, $storyId: Int, $text: String, $language: String, $voice: String) {\n  generateAudio(\n    goalId: $goalId\n    storyId: $storyId\n    text: $text\n    language: $language\n    voice: $voice\n  ) {\n    success\n    message\n    jobId\n    audioUrl\n  }\n}": typeof types.GenerateAudioDocument,
    "mutation GenerateLongFormText($goalId: Int!, $language: String, $minutes: Int) {\n  generateLongFormText(goalId: $goalId, language: $language, minutes: $minutes) {\n    success\n    message\n    text\n    audioUrl\n    manifestUrl\n    segmentUrls\n  }\n}": typeof types.GenerateLongFormTextDocument,
    "mutation GenerateLongFormTextRomanian($goalId: Int!) {\n  generateLongFormText(goalId: $goalId, language: \"Romanian\") {\n    success\n    message\n    text\n    audioUrl\n    manifestUrl\n    segmentUrls\n  }\n}": typeof types.GenerateLongFormTextRomanianDocument,
    "query GetGoals($familyMemberId: Int, $status: String, $userId: String!) {\n  goals(familyMemberId: $familyMemberId, status: $status, userId: $userId) {\n    id\n    title\n    description\n    status\n    priority\n    targetDate\n    familyMemberId\n    userId\n    createdAt\n    updatedAt\n  }\n}": typeof types.GetGoalsDocument,
    "query GetNotes($entityId: Int!, $entityType: String!, $userId: String!) {\n  notes(entityId: $entityId, entityType: $entityType, userId: $userId) {\n    id\n    entityId\n    entityType\n    userId\n    noteType\n    content\n    createdBy\n    tags\n    createdAt\n    updatedAt\n  }\n}": typeof types.GetNotesDocument,
};
const documents: Documents = {
    "mutation CreateNote($input: CreateNoteInput!) {\n  createNote(input: $input) {\n    id\n    entityId\n    entityType\n    userId\n    noteType\n    content\n    createdBy\n    tags\n    createdAt\n    updatedAt\n  }\n}": types.CreateNoteDocument,
    "mutation DeleteTherapyResearch($goalId: Int!) {\n  deleteTherapyResearch(goalId: $goalId) {\n    success\n    message\n    deletedCount\n  }\n}": types.DeleteTherapyResearchDocument,
    "mutation GenerateAudio($goalId: Int!, $storyId: Int, $text: String, $language: String, $voice: String) {\n  generateAudio(\n    goalId: $goalId\n    storyId: $storyId\n    text: $text\n    language: $language\n    voice: $voice\n  ) {\n    success\n    message\n    jobId\n    audioUrl\n  }\n}": types.GenerateAudioDocument,
    "mutation GenerateLongFormText($goalId: Int!, $language: String, $minutes: Int) {\n  generateLongFormText(goalId: $goalId, language: $language, minutes: $minutes) {\n    success\n    message\n    text\n    audioUrl\n    manifestUrl\n    segmentUrls\n  }\n}": types.GenerateLongFormTextDocument,
    "mutation GenerateLongFormTextRomanian($goalId: Int!) {\n  generateLongFormText(goalId: $goalId, language: \"Romanian\") {\n    success\n    message\n    text\n    audioUrl\n    manifestUrl\n    segmentUrls\n  }\n}": types.GenerateLongFormTextRomanianDocument,
    "query GetGoals($familyMemberId: Int, $status: String, $userId: String!) {\n  goals(familyMemberId: $familyMemberId, status: $status, userId: $userId) {\n    id\n    title\n    description\n    status\n    priority\n    targetDate\n    familyMemberId\n    userId\n    createdAt\n    updatedAt\n  }\n}": types.GetGoalsDocument,
    "query GetNotes($entityId: Int!, $entityType: String!, $userId: String!) {\n  notes(entityId: $entityId, entityType: $entityType, userId: $userId) {\n    id\n    entityId\n    entityType\n    userId\n    noteType\n    content\n    createdBy\n    tags\n    createdAt\n    updatedAt\n  }\n}": types.GetNotesDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation CreateNote($input: CreateNoteInput!) {\n  createNote(input: $input) {\n    id\n    entityId\n    entityType\n    userId\n    noteType\n    content\n    createdBy\n    tags\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["mutation CreateNote($input: CreateNoteInput!) {\n  createNote(input: $input) {\n    id\n    entityId\n    entityType\n    userId\n    noteType\n    content\n    createdBy\n    tags\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation DeleteTherapyResearch($goalId: Int!) {\n  deleteTherapyResearch(goalId: $goalId) {\n    success\n    message\n    deletedCount\n  }\n}"): (typeof documents)["mutation DeleteTherapyResearch($goalId: Int!) {\n  deleteTherapyResearch(goalId: $goalId) {\n    success\n    message\n    deletedCount\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation GenerateAudio($goalId: Int!, $storyId: Int, $text: String, $language: String, $voice: String) {\n  generateAudio(\n    goalId: $goalId\n    storyId: $storyId\n    text: $text\n    language: $language\n    voice: $voice\n  ) {\n    success\n    message\n    jobId\n    audioUrl\n  }\n}"): (typeof documents)["mutation GenerateAudio($goalId: Int!, $storyId: Int, $text: String, $language: String, $voice: String) {\n  generateAudio(\n    goalId: $goalId\n    storyId: $storyId\n    text: $text\n    language: $language\n    voice: $voice\n  ) {\n    success\n    message\n    jobId\n    audioUrl\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation GenerateLongFormText($goalId: Int!, $language: String, $minutes: Int) {\n  generateLongFormText(goalId: $goalId, language: $language, minutes: $minutes) {\n    success\n    message\n    text\n    audioUrl\n    manifestUrl\n    segmentUrls\n  }\n}"): (typeof documents)["mutation GenerateLongFormText($goalId: Int!, $language: String, $minutes: Int) {\n  generateLongFormText(goalId: $goalId, language: $language, minutes: $minutes) {\n    success\n    message\n    text\n    audioUrl\n    manifestUrl\n    segmentUrls\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "mutation GenerateLongFormTextRomanian($goalId: Int!) {\n  generateLongFormText(goalId: $goalId, language: \"Romanian\") {\n    success\n    message\n    text\n    audioUrl\n    manifestUrl\n    segmentUrls\n  }\n}"): (typeof documents)["mutation GenerateLongFormTextRomanian($goalId: Int!) {\n  generateLongFormText(goalId: $goalId, language: \"Romanian\") {\n    success\n    message\n    text\n    audioUrl\n    manifestUrl\n    segmentUrls\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetGoals($familyMemberId: Int, $status: String, $userId: String!) {\n  goals(familyMemberId: $familyMemberId, status: $status, userId: $userId) {\n    id\n    title\n    description\n    status\n    priority\n    targetDate\n    familyMemberId\n    userId\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["query GetGoals($familyMemberId: Int, $status: String, $userId: String!) {\n  goals(familyMemberId: $familyMemberId, status: $status, userId: $userId) {\n    id\n    title\n    description\n    status\n    priority\n    targetDate\n    familyMemberId\n    userId\n    createdAt\n    updatedAt\n  }\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(source: "query GetNotes($entityId: Int!, $entityType: String!, $userId: String!) {\n  notes(entityId: $entityId, entityType: $entityType, userId: $userId) {\n    id\n    entityId\n    entityType\n    userId\n    noteType\n    content\n    createdBy\n    tags\n    createdAt\n    updatedAt\n  }\n}"): (typeof documents)["query GetNotes($entityId: Int!, $entityType: String!, $userId: String!) {\n  notes(entityId: $entityId, entityType: $entityType, userId: $userId) {\n    id\n    entityId\n    entityType\n    userId\n    noteType\n    content\n    createdBy\n    tags\n    createdAt\n    updatedAt\n  }\n}"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;