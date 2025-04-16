import { useQuery } from "@tanstack/react-query";
import { Document } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

type RecentDocumentsProps = {
  onSelectDocument: (doc: Document) => void;
};

export default function RecentDocuments({ onSelectDocument }: RecentDocumentsProps) {
  const { data: documents, isLoading, error } = useQuery<Document[]>({
    queryKey: ['/api/documents'],
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="border border-gray-200 rounded-lg p-3">
            <div className="flex justify-between items-start">
              <div>
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-4 w-40 mt-2" />
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-4 text-red-500">
        <p>Failed to load recent documents</p>
        <button 
          className="text-primary text-sm font-medium mt-2"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!documents || documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <span className="material-icons text-3xl mb-2">description</span>
        <p>No documents analyzed yet</p>
        <p className="text-sm mt-1">Your analyzed documents will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <div 
          key={doc.id} 
          className="border border-gray-200 rounded-lg p-3 hover:bg-gray-50 cursor-pointer"
          onClick={() => onSelectDocument(doc)}
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-medium">{doc.title}</h4>
              <p className="text-sm text-gray-500">{doc.wordCount} words</p>
            </div>
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Analyzed</span>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Last analyzed: {formatTimeAgo(doc.analyzedAt)}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) {
    return 'Just now';
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;
  }
  
  return date.toLocaleDateString();
}
