import Navbar from "@/components/Navbar";
import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="h-screen">
      <Navbar />
      <div className="m-10 p-10 h-100 flex flex-row gap-10 items-center justify-center">
        <div className="card bg-[#E7DFD1] shadow-sm">
          <figure>
            <Image
              src="https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg"
              alt="Shoes"
              width={250}
              height={250}
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Andrew Marcopascal</h2>
            <p>Backend</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">StyleHack Team</button>
            </div>
          </div>
        </div>
        <div className="card bg-[#E7DFD1] shadow-sm">
          <figure>
            <Image
              src="https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg"
              alt="Shoes"
              width={250}
              height={250}
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Andrew Marcopascal</h2>
            <p>Backend</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">StyleHack Team</button>
            </div>
          </div>
        </div>
        <div className="card bg-[#E7DFD1] shadow-sm">
          <figure>
            <Image
              src="https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg"
              alt="Shoes"
              width={250}
              height={250}
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Andrew Marcopascal</h2>
            <p>Backend</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">StyleHack Team</button>
            </div>
          </div>
        </div>
        <div className="card bg-[#E7DFD1] shadow-sm">
          <figure>
            <Image
              src="https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg"
              alt="Shoes"
              width={250}
              height={250}
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Andrew Marcopascal</h2>
            <p>Backend</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">StyleHack Team</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
