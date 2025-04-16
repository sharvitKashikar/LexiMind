import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Document table to store analyzed documents
export const documents = pgTable("documents", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  wordCount: integer("word_count").notNull(),
  analyzedAt: timestamp("analyzed_at").defaultNow().notNull(),
  userId: integer("user_id"),
});

// Analysis results table to store the results of document analysis
export const analysisResults = pgTable("analysis_results", {
  id: serial("id").primaryKey(),
  documentId: integer("document_id").notNull(),
  tfidfResults: jsonb("tfidf_results"),
  sentimentScore: integer("sentiment_score"),
  sentimentLabel: text("sentiment_label"),
  highlightedText: text("highlighted_text"),
  preprocessingResults: jsonb("preprocessing_results"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Document comparison table to store the results of document comparisons
export const documentComparisons = pgTable("document_comparisons", {
  id: serial("id").primaryKey(),
  document1Id: integer("document1_id").notNull(),
  document2Id: integer("document2_id").notNull(),
  similarityScore: integer("similarity_score").notNull(),
  commonKeywords: jsonb("common_keywords"),
  uniqueKeywords: jsonb("unique_keywords"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert schemas
export const insertDocumentSchema = createInsertSchema(documents).pick({
  title: true,
  content: true,
  wordCount: true,
  userId: true,
});

export const insertAnalysisResultSchema = createInsertSchema(analysisResults).pick({
  documentId: true,
  tfidfResults: true,
  sentimentScore: true,
  sentimentLabel: true,
  highlightedText: true,
  preprocessingResults: true,
});

export const insertDocumentComparisonSchema = createInsertSchema(documentComparisons).pick({
  document1Id: true,
  document2Id: true,
  similarityScore: true,
  commonKeywords: true,
  uniqueKeywords: true,
});

// Types
export type Document = typeof documents.$inferSelect;
export type InsertDocument = z.infer<typeof insertDocumentSchema>;

export type AnalysisResultRecord = typeof analysisResults.$inferSelect;
export type InsertAnalysisResult = z.infer<typeof insertAnalysisResultSchema>;

export type DocumentComparisonRecord = typeof documentComparisons.$inferSelect;
export type InsertDocumentComparison = z.infer<typeof insertDocumentComparisonSchema>;

// Custom types for frontend-backend communication

export type TfIdfKeyword = {
  term: string;
  tfidf: number;
  frequency: number;
};

export type TfIdfResult = {
  keywords: TfIdfKeyword[];
};

export type PreprocessingSteps = {
  originalText: string;
  tokenized: string[];
  withoutStopwords: string[];
  lemmatized: string[];
};

export interface AnalysisResult {
  documentId: number;
  originalText: string;
  wordCount: number;
  preprocessedWordCount: number;
  uniqueTerms: number;
  termDensity: number;
  processingTime: number;
  serverLoad: string;
  highlightedText: string;
  sentiment: {
    score: number;
    label: string;
    explanation: string;
  };
  preprocessing?: PreprocessingSteps;
  tfidf?: TfIdfResult;
}

export interface DocumentMetrics {
  nlpTerms: number;
  technicalContent: number;
  academicStyle: number;
  positiveSentiment: number;
  complexity: number;
}

export interface DocumentComparison {
  similarityScore: number;
  similarityExplanation: string;
  commonKeywords: string[];
  uniqueKeywords: {
    doc1: string[];
    doc2: string[];
  };
  doc1Metrics: DocumentMetrics;
  doc2Metrics: DocumentMetrics;
}

export interface AnalyzeTextOptions {
  preprocessing: boolean;
  tfidf: boolean;
  sentiment: boolean;
  keywords: boolean;
}
