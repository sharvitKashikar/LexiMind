import Sidebar from "@/components/Sidebar";
import Dashboard from "@/components/Dashboard";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <Sidebar />
      <Dashboard />
    </div>
  );
}
