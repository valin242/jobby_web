
import { Sidebar } from "./components/Sidebar";
import { JobList } from "./components/JobList";
import { JobDescription } from "./components/JobDescription";
import { JobProvider } from "./context/JobContext";

export default function Home() {
  return (
    <JobProvider>
      <div className="flex h-screen">
        <Sidebar />
        <JobList />
        <JobDescription />
      </div>
    </JobProvider>
  );
}
