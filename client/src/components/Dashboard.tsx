import { useState } from "react";
import Header from "@/components/Header";
import TextInputForm from "@/components/TextInputForm";
import RecentDocuments from "@/components/RecentDocuments";
import AnalysisResults from "@/components/AnalysisResults";
import ComparisonSection from "@/components/ComparisonSection";
import { Card, CardContent } from "@/components/ui/card";
import { AnalysisResult, Document } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";

export default function Dashboard() {
  const [selectedDocumentId, setSelectedDocumentId] = useState<number | undefined>(undefined);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  
  const { data: selectedDocument } = useQuery<AnalysisResult>({
    queryKey: ['/api/documents', selectedDocumentId, 'analysis'],
    enabled: !!selectedDocumentId,
  });
  
  // Update analysis result when a document is selected
  useState(() => {
    if (selectedDocument) {
      setAnalysisResult(selectedDocument);
    }
  });
  
  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setSelectedDocumentId(result.documentId);
  };
  
  const handleSelectDocument = (doc: Document) => {
    setSelectedDocumentId(doc.id);
  };
  
  return (
    <div className="flex-1 overflow-auto">
      <Header />
      
      <main className="p-4 sm:p-6 lg:p-8">
        <section className="mb-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Document Analysis</h3>
                <TextInputForm onAnalysisComplete={handleAnalysisComplete} />
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-1">
            <Card className="h-full">
              <CardContent className="pt-6">
                <h3 className="text-lg font-semibold mb-4">Recent Documents</h3>
                <RecentDocuments onSelectDocument={handleSelectDocument} />
                <div className="mt-4 text-center">
                  <button className="text-primary text-sm font-medium hover:underline">View All Documents</button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
        
        {analysisResult && <AnalysisResults analysisResult={analysisResult} />}
        
        <ComparisonSection currentDocumentId={selectedDocumentId} />
      </main>
    </div>
  );
}
