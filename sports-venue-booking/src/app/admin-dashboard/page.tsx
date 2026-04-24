import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatsCards from "../components/StatsCards";
import ApprovalTable from "../components/ApprovalTable";
import UserModeration from "../components/UserModeration";

export default function Page() {
  return (
    <div>
      <Sidebar />

      <main className="ml-64 min-h-screen p-8 bg-surface">
        <Header />
        <StatsCards />

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
          <ApprovalTable />
          <UserModeration />
        </div>
      </main>
    </div>
  );
}