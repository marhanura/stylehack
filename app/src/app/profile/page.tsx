import Navbar from "@/components/Navbar";

export default function ProfilePage() {
  return (
    <div className="h-screen">
      <Navbar />
      <div className="m-10 bg-[#E7DFD1] p-10 h-100 flex flex-col">
        <h1 className="text-center mb-5">Profile</h1>
        <div className="flex flex-row gap-5 justify-center items-center h-full">
          <div className="flex-1 flex flex-col border-r-1 border-black h-full gap-3">
            <div className="rounded w-20 h-20 bg-primary"></div>
            <h1>Wanda</h1>
            <p>wanda@mail.com</p>
            <div>
              <h1 className="font-bold">Membership Status:</h1>
              <p>Free</p>
            </div>
            <div>
              <h1 className="font-bold">Available Tokens</h1>
              <progress
                className="progress progress-accent w-56"
                value="70"
                max="100"
              ></progress>
            </div>
          </div>
          <div className="flex-1 self-start border-r-1 border-black h-full">
            <h1 className="font-bold text-center">Style History</h1>
          </div>
          <div className="flex-1 self-start">
            <h1 className="font-bold text-center">Wishlist</h1>
          </div>
        </div>
      </div>
    </div>
  );
}
