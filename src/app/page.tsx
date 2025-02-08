
export default function Home() {
  return (
    <div className="flex flex-row h-full grid grid-cols-3 gap-3 border-4 border-blue-500">
      <div className="rounded-3xl bg-red-200 col-span-2 justify-items-center items-center">
        <p>List of Applied Jobs</p>
      </div>        
      <div className="h-full border-4 border-blue-500 justify-items-center items-center">
        <p>Click a job for description</p>
      </div>
    </div>
  );
}
