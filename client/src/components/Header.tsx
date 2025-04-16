export default function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-800">Text Analysis Dashboard</h2>
        <div className="flex items-center space-x-4">
          <button className="bg-white p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
            <span className="material-icons">notifications</span>
          </button>
          <button className="bg-white p-2 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100">
            <span className="material-icons">help_outline</span>
          </button>
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center text-white">
              <span className="text-xl font-bold">SK</span>
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700 hidden md:block">Sharvit Kashikar</span>
          </div>
        </div>
      </div>
    </header>
  );
}
