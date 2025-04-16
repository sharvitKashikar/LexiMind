import { AnalysisResult } from "@shared/schema";
import StatCards from "@/components/StatCards";
import PreprocessingResults from "@/components/PreprocessingResults";
import KeywordExtraction from "@/components/KeywordExtraction";
import DocumentWithHighlights from "@/components/DocumentWithHighlights";

type AnalysisResultsProps = {
  analysisResult: AnalysisResult | null;
};

export default function AnalysisResults({ analysisResult }: AnalysisResultsProps) {
  if (!analysisResult) {
    return null;
  }

  return (
    <section className="mb-8">
      <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
      
      <StatCards analysisResult={analysisResult} />
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {analysisResult.preprocessing && (
          <PreprocessingResults preprocessing={analysisResult.preprocessing} />
        )}
        
        {analysisResult.tfidf && (
          <KeywordExtraction tfidfResult={analysisResult.tfidf} />
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <DocumentWithHighlights analysisResult={analysisResult} />
      </div>
    </section>
  );
}
