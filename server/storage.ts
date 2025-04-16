import { documents, type Document, type InsertDocument, AnalysisResult } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<any | undefined>;
  getUserByUsername(username: string): Promise<any | undefined>;
  createUser(user: any): Promise<any>;
  
  // Document storage methods
  getAllDocuments(): Promise<Document[]>;
  getDocument(id: number): Promise<Document | undefined>;
  createDocument(doc: InsertDocument): Promise<Document>;
  
  // Analysis storage methods
  saveAnalysisResult(result: AnalysisResult): Promise<AnalysisResult>;
  getAnalysisResult(documentId: number): Promise<AnalysisResult | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, any>;
  private documents: Map<number, Document>;
  private analysisResults: Map<number, AnalysisResult>;
  currentUserId: number;
  currentDocId: number;
  
  constructor() {
    this.users = new Map();
    this.documents = new Map();
    this.analysisResults = new Map();
    this.currentUserId = 1;
    this.currentDocId = 1;
    
    // Add some example documents
    const sampleDocuments = [
      {
        id: this.currentDocId++,
        title: "NLP Research Paper",
        content: "Natural language processing (NLP) is a subfield of linguistics, computer science, and artificial intelligence concerned with the interactions between computers and human language. The goal is to enable computers to process and analyze large amounts of natural language data. Challenges in NLP frequently involve speech recognition, natural language understanding, and natural language generation.",
        wordCount: 54,
        analyzedAt: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
        userId: 1
      },
      {
        id: this.currentDocId++,
        title: "Product Review Dataset",
        content: "This dataset contains customer reviews for various products. Each review includes a star rating, review text, and metadata about the product. The reviews can be analyzed for sentiment, feature extraction, and opinion mining. This type of analysis helps businesses understand customer satisfaction and product performance.",
        wordCount: 43,
        analyzedAt: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        userId: 1
      },
      {
        id: this.currentDocId++,
        title: "News Articles Comparison",
        content: "News articles from different sources often present varying perspectives on the same events. By comparing the language, sentiment, and focus of these articles, we can identify potential bias and understand how different outlets frame important issues. This comparative analysis uses TF-IDF and other NLP techniques to highlight differences in coverage.",
        wordCount: 53,
        analyzedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
        userId: 1
      },
      {
        id: this.currentDocId++,
        title: "Customer Feedback Analysis",
        content: "Customer feedback provides valuable insights for business improvement. By analyzing comments, reviews, and survey responses using NLP techniques, companies can extract actionable feedback, identify trends, and categorize issues. This helps prioritize improvements and track customer sentiment over time.",
        wordCount: 40,
        analyzedAt: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
        userId: 1
      }
    ];
    
    // Store sample documents
    sampleDocuments.forEach(doc => {
      this.documents.set(doc.id, doc);
    });
  }

  async getUser(id: number): Promise<any | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<any | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: any): Promise<any> {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Document storage methods
  async getAllDocuments(): Promise<Document[]> {
    return Array.from(this.documents.values())
      .sort((a, b) => new Date(b.analyzedAt).getTime() - new Date(a.analyzedAt).getTime());
  }
  
  async getDocument(id: number): Promise<Document | undefined> {
    return this.documents.get(id);
  }
  
  async createDocument(doc: InsertDocument): Promise<Document> {
    const id = this.currentDocId++;
    const document: Document = { 
      ...doc, 
      id, 
      analyzedAt: new Date().toISOString()
    };
    this.documents.set(id, document);
    return document;
  }
  
  // Analysis storage methods
  async saveAnalysisResult(result: AnalysisResult): Promise<AnalysisResult> {
    this.analysisResults.set(result.documentId, result);
    return result;
  }
  
  async getAnalysisResult(documentId: number): Promise<AnalysisResult | undefined> {
    return this.analysisResults.get(documentId);
  }
}

export const storage = new MemStorage();
