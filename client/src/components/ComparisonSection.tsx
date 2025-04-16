import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { Document } from "@shared/schema";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { RadarChartComponent } from "@/components/ui/chart";

type ComparisonSectionProps = {
  currentDocumentId?: number;
};

export default function ComparisonSection({ currentDocumentId }: ComparisonSectionProps) {
  const [doc1Id, setDoc1Id] = useState<number | undefined>(undefined);
  const [doc2Id, setDoc2Id] = useState<number | undefined>(currentDocumentId);
  const [comparisonResult, setComparisonResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  
  const { data: documents, isLoading: isLoadingDocs } = useQuery<Document[]>({
    queryKey: ['/api/documents'],
  });
  
  const compareDocuments = async () => {
    if (!doc1Id || !doc2Id) {
      toast({
        title: "Selection Required",
        description: "Please select two documents to compare.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsLoading(true);
      const response = await apiRequest('POST', '/api/compare', {
        documentIds: [doc1Id, doc2Id]
      });
      
      const result = await response.json();
      setComparisonResult(result);
      
      toast({
        title: "Comparison Complete",
        description: "Documents have been successfully compared.",
      });
    } catch (error) {
      console.error("Comparison error:", error);
      toast({
        title: "Comparison Failed",
        description: "Unable to compare documents. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const radarData = comparisonResult ? [
    {
      category: "NLP Terms",
      value1: comparisonResult.doc1Metrics.nlpTerms,
      value2: comparisonResult.doc2Metrics.nlpTerms,
    },
    {
      category: "Technical Content",
      value1: comparisonResult.doc1Metrics.technicalContent,
      value2: comparisonResult.doc2Metrics.technicalContent,
    },
    {
      category: "Academic Style",
      value1: comparisonResult.doc1Metrics.academicStyle,
      value2: comparisonResult.doc2Metrics.academicStyle,
    },
    {
      category: "Positive Sentiment",
      value1: comparisonResult.doc1Metrics.positiveSentiment,
      value2: comparisonResult.doc2Metrics.positiveSentiment,
    },
    {
      category: "Complexity",
      value1: comparisonResult.doc1Metrics.complexity,
      value2: comparisonResult.doc2Metrics.complexity,
    },
  ] : [];
  
  const doc1Name = documents?.find(d => d.id === doc1Id)?.title || 'Document 1';
  const doc2Name = documents?.find(d => d.id === doc2Id)?.title || 'Document 2';
  
  return (
    <section className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Document Comparison</h3>
        <Button 
          variant="ghost"
          size="sm"
          className="text-primary text-sm"
          onClick={() => {
            setDoc1Id(undefined);
            setDoc2Id(undefined);
            setComparisonResult(null);
          }}
        >
          <span className="material-icons mr-1 text-sm">add</span>
          Add Document
        </Button>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="mb-6 flex items-center gap-4">
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Document 1</label>
            {isLoadingDocs ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select
                value={doc1Id?.toString()} 
                onValueChange={(value) => setDoc1Id(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a document" />
                </SelectTrigger>
                <SelectContent>
                  {documents?.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id.toString()}>
                      {doc.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Document 2</label>
            {isLoadingDocs ? (
              <Skeleton className="h-10 w-full" />
            ) : (
              <Select 
                value={doc2Id?.toString()} 
                onValueChange={(value) => setDoc2Id(Number(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a document" />
                </SelectTrigger>
                <SelectContent>
                  {documents?.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id.toString()}>
                      {doc.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        
        {!comparisonResult && (
          <div className="text-center py-8">
            <Button 
              onClick={compareDocuments}
              disabled={isLoading || !doc1Id || !doc2Id}
              className="bg-primary text-white"
            >
              {isLoading ? (
                <>
                  <span className="material-icons animate-spin mr-1 text-sm">refresh</span>
                  Comparing...
                </>
              ) : (
                <>
                  <span className="material-icons mr-1 text-sm">compare</span>
                  Compare Documents
                </>
              )}
            </Button>
          </div>
        )}
        
        {comparisonResult && (
          <>
            <div className="mb-6">
              <div className="chart-container">
                <RadarChartComponent 
                  data={radarData}
                  categories={radarData.map(d => d.category)}
                  datasets={[
                    { name: doc1Name, color: "#4f46e5", fillColor: "#4f46e5" },
                    { name: doc2Name, color: "#7c3aed", fillColor: "#7c3aed" }
                  ]}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h5 className="font-medium mb-3">Common Keywords</h5>
                <div className="flex flex-wrap gap-2">
                  {comparisonResult.commonKeywords.map((keyword: string, index: number) => (
                    <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                <h5 className="font-medium mb-3">Unique Keywords by Document</h5>
                <div className="flex flex-wrap gap-2">
                  {comparisonResult.uniqueKeywords.doc1.map((keyword: string, index: number) => (
                    <span key={`doc1-${index}`} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                      {doc1Name}: {keyword}
                    </span>
                  ))}
                  {comparisonResult.uniqueKeywords.doc2.map((keyword: string, index: number) => (
                    <span key={`doc2-${index}`} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">
                      {doc2Name}: {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h5 className="font-medium mb-3">Similarity Analysis</h5>
              <div className="flex items-center">
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className="bg-primary h-4 rounded-full" 
                    style={{ width: `${comparisonResult.similarityScore}%` }}
                  ></div>
                </div>
                <span className="ml-2 font-medium">{comparisonResult.similarityScore}%</span>
              </div>
              <p className="mt-2 text-sm text-gray-600">{comparisonResult.similarityExplanation}</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
