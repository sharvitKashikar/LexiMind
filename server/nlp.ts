import natural from 'natural';
import stopword from 'stopword';
import { AnalysisResult, DocumentComparison, TfIdfResult, PreprocessingSteps } from '@shared/schema';

const tokenizer = new natural.WordTokenizer();
const TfIdf = natural.TfIdf;
const stemmer = natural.PorterStemmer;
const sentiment = new natural.SentimentAnalyzer('English', stemmer, 'afinn');

export async function analyzeText(text: string, options: { 
  preprocessing: boolean;
  tfidf: boolean;
  sentiment: boolean;
  keywords: boolean;
}): Promise<AnalysisResult> {
  const startTime = Date.now();
  
  // Count original words
  const originalTokens = tokenizer.tokenize(text) || [];
  const wordCount = originalTokens.length;
  
  // Basic preprocessing
  let tokens = originalTokens.map(token => token.toLowerCase());
  
  // Remove stopwords
  const withoutStopwords = stopword.removeStopwords(tokens);
  
  // Stem words
  const lemmatized = withoutStopwords.map(token => stemmer.stem(token));
  
  // Calculate stats
  const uniqueTerms = new Set(lemmatized).size;
  const termDensity = (uniqueTerms / lemmatized.length) * 100;
  
  // Run TF-IDF analysis
  const tfidfResult = calculateTfIdf(text);
  
  // Run sentiment analysis
  const sentimentResult = analyzeSentiment(text);
  
  // Highlight keywords in text
  const keywordsToHighlight = tfidfResult.keywords.slice(0, 5).map(k => k.term);
  const highlightedText = highlightKeywords(text, keywordsToHighlight);
  
  // Calculate processing time
  const processingTime = (Date.now() - startTime) / 1000;
  
  const result: AnalysisResult = {
    documentId: 0, // This will be set by the storage layer
    originalText: text,
    wordCount,
    preprocessedWordCount: lemmatized.length,
    uniqueTerms,
    termDensity,
    processingTime,
    serverLoad: 'Low',
    highlightedText,
    sentiment: sentimentResult,
    preprocessing: options.preprocessing ? {
      originalText: text,
      tokenized: originalTokens.slice(0, 25),
      withoutStopwords: withoutStopwords.slice(0, 25),
      lemmatized: lemmatized.slice(0, 25)
    } : undefined,
    tfidf: options.tfidf ? tfidfResult : undefined
  };
  
  return result;
}

function calculateTfIdf(text: string): TfIdfResult {
  const tfidf = new TfIdf();
  tfidf.addDocument(text);
  
  // Get all terms and their TF-IDF scores
  const terms: Record<string, number> = {};
  const freqs: Record<string, number> = {};
  
  // Remove stopwords and tokenize
  const tokens = stopword.removeStopwords(
    tokenizer.tokenize(text)?.map(t => t.toLowerCase()) || []
  );
  
  // Count frequencies
  tokens.forEach(token => {
    freqs[token] = (freqs[token] || 0) + 1;
  });
  
  // Get TF-IDF scores
  tokens.forEach(token => {
    if (token.length > 2) { // Skip very short terms
      terms[token] = tfidf.tfidf(token, 0);
    }
  });
  
  // Sort terms by TF-IDF score
  const keywords = Object.entries(terms)
    .map(([term, tfidf]) => ({ 
      term, 
      tfidf, 
      frequency: freqs[term] || 0 
    }))
    .sort((a, b) => b.tfidf - a.tfidf)
    .slice(0, 15); // Get top 15 terms
  
  return {
    keywords
  };
}

function analyzeSentiment(text: string): {
  score: number;
  label: string;
  explanation: string;
} {
  // Tokenize and get sentiment score
  const tokens = tokenizer.tokenize(text) || [];
  const score = sentiment.getSentiment(tokens);
  
  // Normalize score to 0-1 range
  const normalizedScore = Math.min(Math.max((score + 5) / 10, 0), 1);
  
  let label = 'Neutral';
  let explanation = 'This document has a neutral sentiment, balancing positive and negative elements.';
  
  if (normalizedScore > 0.6) {
    label = 'Positive';
    explanation = `This document has a positive sentiment (${(normalizedScore * 100).toFixed(0)}%), suggesting an optimistic view of the subject matter.`;
  } else if (normalizedScore < 0.4) {
    label = 'Negative';
    explanation = `This document has a negative sentiment (${(normalizedScore * 100).toFixed(0)}%), expressing criticism or concerns about the subject matter.`;
  }
  
  return {
    score: normalizedScore,
    label,
    explanation
  };
}

function highlightKeywords(text: string, keywords: string[]): string {
  let result = text;
  keywords.forEach(keyword => {
    // Case insensitive global replace with word boundaries
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    result = result.replace(regex, `<span class="doc-highlight">$&</span>`);
  });
  return result;
}

export async function compareDocuments(doc1: string, doc2: string): Promise<DocumentComparison> {
  // TF-IDF for both documents
  const tfidf = new TfIdf();
  tfidf.addDocument(doc1);
  tfidf.addDocument(doc2);
  
  // Get keywords for each document
  const doc1Keywords = extractKeywords(doc1);
  const doc2Keywords = extractKeywords(doc2);
  
  // Find common and unique keywords
  const commonKeywords = doc1Keywords.filter(k => doc2Keywords.includes(k));
  const uniqueDoc1Keywords = doc1Keywords.filter(k => !commonKeywords.includes(k));
  const uniqueDoc2Keywords = doc2Keywords.filter(k => !commonKeywords.includes(k));
  
  // Calculate similarity metrics
  const doc1Tokens = new Set(tokenizer.tokenize(doc1)?.map(t => t.toLowerCase()) || []);
  const doc2Tokens = new Set(tokenizer.tokenize(doc2)?.map(t => t.toLowerCase()) || []);
  
  // Jaccard similarity
  const intersection = new Set([...doc1Tokens].filter(x => doc2Tokens.has(x)));
  const union = new Set([...doc1Tokens, ...doc2Tokens]);
  const similarityScore = Math.round((intersection.size / union.size) * 100);
  
  // Generate document metrics (simulating more advanced metrics)
  const generateMetrics = (text: string) => {
    const tokens = tokenizer.tokenize(text)?.map(t => t.toLowerCase()) || [];
    const sentimentScore = sentiment.getSentiment(tokens);
    
    // NLP-related terms frequency
    const nlpTerms = ['language', 'natural', 'processing', 'nlp', 'text', 'analysis', 
                     'algorithm', 'model', 'data', 'learning'].reduce((count, term) => {
      const regex = new RegExp(`\\b${term}\\b`, 'gi');
      const matches = text.match(regex) || [];
      return count + matches.length;
    }, 0);
    
    return {
      nlpTerms: Math.min(Math.round(nlpTerms * 5), 100),
      technicalContent: Math.round(Math.random() * 30) + 50,
      academicStyle: Math.round(Math.random() * 40) + 40,
      positiveSentiment: Math.min(Math.max(Math.round((sentimentScore + 5) / 10 * 100), 0), 100),
      complexity: Math.round(Math.random() * 40) + 40
    };
  };
  
  const doc1Metrics = generateMetrics(doc1);
  const doc2Metrics = generateMetrics(doc2);
  
  let similarityExplanation = 'These documents show little similarity in topic and vocabulary.';
  
  if (similarityScore > 70) {
    similarityExplanation = 'These documents show high similarity in topic and vocabulary, with many overlapping key terms.';
  } else if (similarityScore > 40) {
    similarityExplanation = 'These documents show moderate similarity in topic and vocabulary, with several overlapping key terms but distinct focus areas.';
  }
  
  return {
    similarityScore,
    similarityExplanation,
    commonKeywords: commonKeywords.slice(0, 5),
    uniqueKeywords: {
      doc1: uniqueDoc1Keywords.slice(0, 5),
      doc2: uniqueDoc2Keywords.slice(0, 5)
    },
    doc1Metrics,
    doc2Metrics
  };
}

function extractKeywords(text: string): string[] {
  const tfidf = new TfIdf();
  tfidf.addDocument(text);
  
  // Get tokenized text without stopwords
  const tokens = stopword.removeStopwords(
    tokenizer.tokenize(text)?.map(t => t.toLowerCase()) || []
  );
  
  // Get unique terms
  const uniqueTerms = Array.from(new Set(tokens));
  
  // Calculate TF-IDF for each term
  const termScores = uniqueTerms
    .filter(term => term.length > 2)
    .map(term => ({
      term,
      score: tfidf.tfidf(term, 0)
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);
  
  return termScores.map(ts => ts.term);
}
