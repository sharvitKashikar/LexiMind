import { AnalysisResult } from "@shared/schema";

type StatCardsProps = {
  analysisResult: AnalysisResult;
};

export default function StatCards({ analysisResult }: StatCardsProps) {
  if (!analysisResult) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between">
          <h4 className="text-gray-500 text-sm font-medium">Word Count</h4>
          <span className="material-icons text-primary">text_fields</span>
        </div>
        <p className="text-2xl font-bold mt-2">{analysisResult.wordCount}</p>
        <div className="mt-2 text-sm text-gray-500">
          After preprocessing: {analysisResult.preprocessedWordCount}
        </div>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between">
          <h4 className="text-gray-500 text-sm font-medium">Sentiment</h4>
          <span className="material-icons text-primary">
            {analysisResult.sentiment.score > 0.6 ? "sentiment_satisfied" : 
             analysisResult.sentiment.score < 0.4 ? "sentiment_dissatisfied" : 
             "sentiment_neutral"}
          </span>
        </div>
        <p className="text-2xl font-bold mt-2">{analysisResult.sentiment.label}</p>
        <div className="mt-2 text-sm text-gray-500">
          Score: {analysisResult.sentiment.score.toFixed(2)} / 1.0
        </div>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between">
          <h4 className="text-gray-500 text-sm font-medium">Unique Terms</h4>
          <span className="material-icons text-primary">format_list_numbered</span>
        </div>
        <p className="text-2xl font-bold mt-2">{analysisResult.uniqueTerms}</p>
        <div className="mt-2 text-sm text-gray-500">
          Density: {analysisResult.termDensity.toFixed(1)}%
        </div>
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        <div className="flex items-center justify-between">
          <h4 className="text-gray-500 text-sm font-medium">Processing Time</h4>
          <span className="material-icons text-primary">timer</span>
        </div>
        <p className="text-2xl font-bold mt-2">{analysisResult.processingTime.toFixed(2)}s</p>
        <div className="mt-2 text-sm text-gray-500">
          Server load: {analysisResult.serverLoad}
        </div>
      </div>
    </div>
  );
}
