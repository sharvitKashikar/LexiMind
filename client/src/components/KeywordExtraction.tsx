import { TfIdfResult } from "@shared/schema";
import { BarChartComponent } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

type KeywordExtractionProps = {
  tfidfResult: TfIdfResult;
};

export default function KeywordExtraction({ tfidfResult }: KeywordExtractionProps) {
  if (!tfidfResult || !tfidfResult.keywords) {
    return null;
  }

  const chartData = tfidfResult.keywords.map((keyword) => ({
    name: keyword.term,
    value: keyword.tfidf,
  }));

  const handleExportKeywords = () => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Keyword,TF-IDF Score,Frequency\n" + 
      tfidfResult.keywords.map(k => `${k.term},${k.tfidf},${k.frequency}`).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "keywords.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-6">
      <h4 className="font-semibold mb-4 flex items-center">
        <span className="material-icons mr-2 text-primary">topic</span>
        Top Keywords (TF-IDF)
      </h4>
      
      <div className="chart-container mb-4">
        <BarChartComponent 
          data={chartData} 
          xKey="name"
          yKey="value"
          colors={["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"]}
          xlabel="Keywords"
          ylabel="TF-IDF Score"
        />
      </div>
      
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Keyword</TableHead>
              <TableHead>TF-IDF Score</TableHead>
              <TableHead>Frequency</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tfidfResult.keywords.map((keyword, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{keyword.term}</TableCell>
                <TableCell>{keyword.tfidf.toFixed(3)}</TableCell>
                <TableCell>{keyword.frequency}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      <div className="mt-4 text-right">
        <Button 
          variant="link" 
          className="text-primary text-sm"
          onClick={handleExportKeywords}
        >
          Export Keywords
        </Button>
      </div>
    </div>
  );
}
