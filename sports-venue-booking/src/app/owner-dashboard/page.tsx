import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import AnalyticsCards from "../components/AnalyticsCards";
import VenueList from "../components/VenueList";
import ActivityTable from "../components/ActivityTable";

export default function OwnerDashboard() {
  return (
    <div className="text-on-surface">
      
      <Sidebar />

      <main className="ml-64 min-h-screen">

        <Topbar />

        <div className="p-8 max-w-[1440px] mx-auto space-y-10">

          <AnalyticsCards />

          <VenueList />

          <ActivityTable />

        </div>

      </main>
    </div>
  );
}