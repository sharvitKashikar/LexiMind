import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { useQueryClient } from "@tanstack/react-query";

type TextInputFormProps = {
  onAnalysisComplete: (data: any) => void;
};

type FormData = {
  text: string;
  preprocessing: boolean;
  tfidf: boolean;
  sentiment: boolean;
  keywords: boolean;
};

export default function TextInputForm({ onAnalysisComplete }: TextInputFormProps) {
  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    defaultValues: {
      text: "",
      preprocessing: true,
      tfidf: true,
      sentiment: true,
      keywords: true
    }
  });
  
  const onSubmit = async (data: FormData) => {
    try {
      setIsLoading(true);
      
      const response = await apiRequest('POST', '/api/analyze', {
        text: data.text,
        options: {
          preprocessing: data.preprocessing,
          tfidf: data.tfidf,
          sentiment: data.sentiment,
          keywords: data.keywords
        }
      });
      
      const result = await response.json();
      
      // Update query cache and notify parent component
      queryClient.invalidateQueries({ queryKey: ['/api/documents'] });
      onAnalysisComplete(result);
      
      toast({
        title: "Analysis Complete",
        description: "Your text has been successfully analyzed.",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "Unable to analyze text. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleReset = () => {
    reset();
  };
  
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      // Set the form value
      reset({ 
        text,
        preprocessing: true,
        tfidf: true,
        sentiment: true,
        keywords: true
      });
    };
    reader.readAsText(file);
  };
  
  return (
    <div className="mb-6">
      <div className="flex mb-4">
        <button 
          className={`flex-1 py-2 px-4 ${inputMode === 'text' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'} rounded-tl-lg rounded-bl-lg font-medium`}
          onClick={() => setInputMode('text')}
        >
          Text Input
        </button>
        <button 
          className={`flex-1 py-2 px-4 ${inputMode === 'file' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'} rounded-tr-lg rounded-br-lg font-medium`}
          onClick={() => setInputMode('file')}
        >
          File Upload
        </button>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        {inputMode === 'text' ? (
          <div className="mb-4">
            <Label htmlFor="textAnalysis" className="block text-sm font-medium text-gray-700 mb-1">Enter or paste your text</Label>
            <Textarea 
              id="textAnalysis"
              rows={6}
              className="w-full resize-none"
              placeholder="Enter text to analyze..."
              {...register("text", { required: "Text is required for analysis" })}
            />
            {errors.text && <p className="text-red-500 text-xs mt-1">{errors.text.message}</p>}
          </div>
        ) : (
          <div className="mb-4">
            <Label htmlFor="fileUpload" className="block text-sm font-medium text-gray-700 mb-1">Upload a text file</Label>
            <div className="border border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                id="fileUpload"
                accept=".txt,.md,.csv,.json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <label htmlFor="fileUpload" className="cursor-pointer">
                <span className="material-icons text-3xl text-gray-400 mb-2">upload_file</span>
                <p className="text-sm text-gray-500">Drag and drop a file here, or click to select a file</p>
                <p className="text-xs text-gray-400 mt-1">Supported formats: .txt, .md, .csv, .json</p>
              </label>
            </div>
          </div>
        )}
        
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center space-x-2">
            <Checkbox id="preprocessing" {...register("preprocessing")} />
            <Label htmlFor="preprocessing" className="text-sm text-gray-700">Text Preprocessing</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="tfidf" {...register("tfidf")} />
            <Label htmlFor="tfidf" className="text-sm text-gray-700">TF-IDF Analysis</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="sentiment" {...register("sentiment")} />
            <Label htmlFor="sentiment" className="text-sm text-gray-700">Sentiment Analysis</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="keywords" {...register("keywords")} />
            <Label htmlFor="keywords" className="text-sm text-gray-700">Keyword Extraction</Label>
          </div>
        </div>
        
        <div className="flex justify-end">
          <Button 
            variant="outline" 
            className="mr-2" 
            type="button" 
            onClick={handleReset}
          >
            Reset
          </Button>
          <Button 
            type="submit" 
            className="bg-primary text-white" 
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="material-icons animate-spin mr-1 text-sm">refresh</span>
                Analyzing...
              </>
            ) : (
              <>
                <span className="material-icons mr-1 text-sm">analytics</span>
                Analyze Text
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
