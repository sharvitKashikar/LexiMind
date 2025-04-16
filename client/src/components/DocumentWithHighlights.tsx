import { AnalysisResult } from "@shared/schema";
import { Button } from "@/components/ui/button";

type DocumentWithHighlightsProps = {
  analysisResult: AnalysisResult;
};

export default function DocumentWithHighlights({ analysisResult }: DocumentWithHighlightsProps) {
  if (!analysisResult || !analysisResult.highlightedText) {
    return null;
  }

  const exportDocument = () => {
    const blob = new Blob([analysisResult.originalText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'document.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printDocument = () => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Document Analysis</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .highlight { background-color: rgba(124, 58, 237, 0.2); border-bottom: 2px solid #7c3aed; }
              .sentiment { margin-top: 30px; padding: 15px; background: #f9fafb; border-radius: 5px; }
            </style>
          </head>
          <body>
            <h1>Document Analysis</h1>
            <div>${analysisResult.highlightedText}</div>
            <div class="sentiment">
              <h2>Sentiment Analysis</h2>
              <p>Score: ${analysisResult.sentiment.score.toFixed(2)}/1.0 (${analysisResult.sentiment.label})</p>
              <p>${analysisResult.sentiment.explanation}</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h4 className="font-semibold mb-4 flex items-center justify-between">
        <span className="flex items-center">
          <span className="material-icons mr-2 text-primary">text_format</span>
          Document with Key Term Highlights
        </span>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700" onClick={exportDocument}>
            <span className="material-icons text-sm mr-1">file_download</span>
            Export
          </Button>
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700" onClick={printDocument}>
            <span className="material-icons text-sm mr-1">print</span>
            Print
          </Button>
        </div>
      </h4>
      
      <div 
        className="border border-gray-200 rounded-lg p-4 leading-relaxed"
        dangerouslySetInnerHTML={{ __html: analysisResult.highlightedText }}
      />
      
      <div className="mt-4 bg-gray-50 p-4 rounded-lg">
        <h5 className="font-medium mb-2">Sentiment Analysis</h5>
        <div className="flex items-center mb-2">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className={`h-2.5 rounded-full ${
                analysisResult.sentiment.label === 'Positive' ? 'bg-success' : 
                analysisResult.sentiment.label === 'Negative' ? 'bg-error' : 'bg-warning'
              }`} 
              style={{ width: `${analysisResult.sentiment.score * 100}%` }}
            ></div>
          </div>
          <span className="ml-2 text-sm font-medium">{Math.round(analysisResult.sentiment.score * 100)}%</span>
        </div>
        <p className="text-sm text-gray-600">{analysisResult.sentiment.explanation}</p>
      </div>
    </div>
  );
}
