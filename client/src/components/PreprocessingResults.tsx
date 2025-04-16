import { PreprocessingSteps } from "@shared/schema";

type PreprocessingResultsProps = {
  preprocessing: PreprocessingSteps;
};

export default function PreprocessingResults({ preprocessing }: PreprocessingResultsProps) {
  if (!preprocessing) {
    return null;
  }

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h4 className="font-semibold mb-4 flex items-center">
        <span className="material-icons mr-2 text-primary">tune</span>
        Text Preprocessing Steps
      </h4>
      
      <div className="space-y-4">
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 text-sm font-medium">Original Text</div>
          <div className="p-4 text-sm">
            {preprocessing.originalText}
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 text-sm font-medium">After Tokenization</div>
          <div className="p-4 text-sm font-mono text-xs flex flex-wrap gap-2">
            {preprocessing.tokenized.map((token, index) => (
              <span key={index} className="bg-blue-50 px-2 py-1 rounded">{token}</span>
            ))}
            {preprocessing.tokenized.length > 25 && (
              <span className="bg-blue-50 px-2 py-1 rounded">...</span>
            )}
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 text-sm font-medium">After Stopword Removal</div>
          <div className="p-4 text-sm font-mono text-xs flex flex-wrap gap-2">
            {preprocessing.withoutStopwords.map((token, index) => (
              <span key={index} className="bg-blue-50 px-2 py-1 rounded">{token}</span>
            ))}
            {preprocessing.withoutStopwords.length > 25 && (
              <span className="bg-blue-50 px-2 py-1 rounded">...</span>
            )}
          </div>
        </div>
        
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 text-sm font-medium">After Lemmatization</div>
          <div className="p-4 text-sm font-mono text-xs flex flex-wrap gap-2">
            {preprocessing.lemmatized.map((token, index) => (
              <span key={index} className="bg-blue-50 px-2 py-1 rounded">{token}</span>
            ))}
            {preprocessing.lemmatized.length > 25 && (
              <span className="bg-blue-50 px-2 py-1 rounded">...</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
