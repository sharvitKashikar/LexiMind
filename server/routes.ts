import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { analyzeText, compareDocuments } from "./nlp";
import { z } from "zod";
import { insertDocumentSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for document analysis
  app.get("/api/documents", async (req: Request, res: Response) => {
    try {
      const documents = await storage.getAllDocuments();
      res.json(documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      res.status(500).json({ message: "Failed to fetch documents" });
    }
  });
  
  app.get("/api/documents/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid document ID" });
      }
      
      const document = await storage.getDocument(id);
      if (!document) {
        return res.status(404).json({ message: "Document not found" });
      }
      
      res.json(document);
    } catch (error) {
      console.error("Error fetching document:", error);
      res.status(500).json({ message: "Failed to fetch document" });
    }
  });
  
  app.get("/api/documents/:id/analysis", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid document ID" });
      }
      
      const analysisResult = await storage.getAnalysisResult(id);
      if (!analysisResult) {
        const document = await storage.getDocument(id);
        if (!document) {
          return res.status(404).json({ message: "Document not found" });
        }
        
        // If the document exists but no analysis is found, perform analysis
        const result = await analyzeText(document.content, {
          preprocessing: true,
          tfidf: true,
          sentiment: true,
          keywords: true
        });
        
        result.documentId = document.id;
        const savedResult = await storage.saveAnalysisResult(result);
        return res.json(savedResult);
      }
      
      res.json(analysisResult);
    } catch (error) {
      console.error("Error fetching analysis result:", error);
      res.status(500).json({ message: "Failed to fetch analysis result" });
    }
  });
  
  app.post("/api/analyze", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        text: z.string().min(10),
        title: z.string().optional(),
        options: z.object({
          preprocessing: z.boolean().default(true),
          tfidf: z.boolean().default(true),
          sentiment: z.boolean().default(true),
          keywords: z.boolean().default(true)
        }).default({
          preprocessing: true,
          tfidf: true,
          sentiment: true,
          keywords: true
        })
      });
      
      const validationResult = schema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: validationResult.error.errors 
        });
      }
      
      const { text, title, options } = validationResult.data;
      
      // Analyze the text
      const result = await analyzeText(text, options);
      
      // Create a document record
      const document = await storage.createDocument({
        title: title || `Document ${Date.now()}`,
        content: text,
        wordCount: result.wordCount,
        userId: 1 // Default user
      });
      
      // Update document ID in result and save
      result.documentId = document.id;
      const savedResult = await storage.saveAnalysisResult(result);
      
      res.json(savedResult);
    } catch (error) {
      console.error("Error analyzing text:", error);
      res.status(500).json({ message: "Failed to analyze text" });
    }
  });
  
  app.post("/api/compare", async (req: Request, res: Response) => {
    try {
      const schema = z.object({
        documentIds: z.array(z.number()).length(2),
        texts: z.array(z.string()).length(2).optional()
      });
      
      const validationResult = schema.safeParse(req.body);
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid request data", 
          errors: validationResult.error.errors 
        });
      }
      
      const { documentIds, texts } = validationResult.data;
      
      let doc1: string;
      let doc2: string;
      
      if (texts) {
        // Use provided texts directly
        [doc1, doc2] = texts;
      } else {
        // Fetch documents from storage
        const document1 = await storage.getDocument(documentIds[0]);
        const document2 = await storage.getDocument(documentIds[1]);
        
        if (!document1 || !document2) {
          return res.status(404).json({ message: "One or both documents not found" });
        }
        
        doc1 = document1.content;
        doc2 = document2.content;
      }
      
      // Compare the documents
      const comparisonResult = await compareDocuments(doc1, doc2);
      
      res.json(comparisonResult);
    } catch (error) {
      console.error("Error comparing documents:", error);
      res.status(500).json({ message: "Failed to compare documents" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
