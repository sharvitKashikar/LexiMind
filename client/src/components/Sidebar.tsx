import { Link, useLocation } from "wouter";

export default function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="bg-gray-900 text-white w-full md:w-64 flex-shrink-0 flex flex-col h-screen">
      <div className="p-4 flex items-center">
        <span className="material-icons mr-2">data_object</span>
        <h1 className="text-xl font-bold">TextInsight</h1>
      </div>
      <nav className="px-2 py-4 flex-grow">
        <ul>
          <li className="mb-2">
            <Link href="/">
              <a className={`flex items-center px-4 py-2 ${location === '/' ? 'bg-gray-800' : 'hover:bg-gray-800'} rounded-lg`}>
                <span className="material-icons mr-3">dashboard</span>
                <span>Dashboard</span>
              </a>
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/text-analysis">
              <a className={`flex items-center px-4 py-2 ${location === '/text-analysis' ? 'bg-gray-800' : 'hover:bg-gray-800'} rounded-lg`}>
                <span className="material-icons mr-3">text_fields</span>
                <span>Text Analysis</span>
              </a>
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/document-comparison">
              <a className={`flex items-center px-4 py-2 ${location === '/document-comparison' ? 'bg-gray-800' : 'hover:bg-gray-800'} rounded-lg`}>
                <span className="material-icons mr-3">compare</span>
                <span>Document Comparison</span>
              </a>
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/visualizations">
              <a className={`flex items-center px-4 py-2 ${location === '/visualizations' ? 'bg-gray-800' : 'hover:bg-gray-800'} rounded-lg`}>
                <span className="material-icons mr-3">analytics</span>
                <span>Visualizations</span>
              </a>
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/history">
              <a className={`flex items-center px-4 py-2 ${location === '/history' ? 'bg-gray-800' : 'hover:bg-gray-800'} rounded-lg`}>
                <span className="material-icons mr-3">history</span>
                <span>History</span>
              </a>
            </Link>
          </li>
          <li className="mb-2">
            <Link href="/settings">
              <a className={`flex items-center px-4 py-2 ${location === '/settings' ? 'bg-gray-800' : 'hover:bg-gray-800'} rounded-lg`}>
                <span className="material-icons mr-3">settings</span>
                <span>Settings</span>
              </a>
            </Link>
          </li>
        </ul>
      </nav>
      <div className="p-4">
        <div className="px-4 py-2 bg-primary rounded-lg text-center cursor-pointer">
          <span className="material-icons mb-1">new_document</span>
          <span className="block">New Analysis</span>
        </div>
      </div>
    </div>
  );
}
