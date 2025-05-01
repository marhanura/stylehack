import Navbar from "@/components/Navbar";

export default function HistoryPage() {
  return (
    <div className="h-screen">
      <Navbar />
      <div className="m-10 bg-[#E7DFD1] p-10 h-100 flex flex-col">
        <h1 className="text-center mb-5">My History</h1>
      </div>
    </div>
  );
}
