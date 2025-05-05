import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="h-screen pt-25 ">
      <h2 className="font-bold text-xl text-center mb-10">
        Team Andrew & The Backbone
      </h2>
      <div className="px-10 h-100 flex flex-row gap-10 items-center justify-center">
        <div className="card bg-[#E7DFD1] shadow-sm">
          <figure className="relative w-72 h-72 overflow-hidden">
            <Image
              src="https://res.cloudinary.com/daeebexlo/image/upload/v1746417990/uvqjs0dztbczq5rqfwqk.png"
              alt="Shoes"
              fill
              className="object-cover object-[0_20%]"
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
          <figure className="relative w-72 h-72 overflow-hidden">
            <Image
              src="https://res.cloudinary.com/daeebexlo/image/upload/v1746418027/vnwi59cd9ug4kr0nweto.png"
              alt="Shoes"
              fill
              className="object-cover object-[0_20%]"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Hilmi Ahmad Dhiya`ulhaq</h2>
            <p>Backend</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">StyleHack Team</button>
            </div>
          </div>
        </div>
        <div className="card bg-[#E7DFD1] shadow-sm">
          <figure className="relative w-72 h-72 overflow-hidden">
            <Image
              src="https://res.cloudinary.com/daeebexlo/image/upload/v1746418050/ltgcczmxctsxxwem8w5z.png"
              alt="Shoes"
              fill
              className="object-cover object-[0_20%]"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Irwanda Arofana Budiono</h2>
            <p>Backend</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">StyleHack Team</button>
            </div>
          </div>
        </div>
        <div className="card bg-[#E7DFD1] shadow-sm">
          <figure className="relative w-72 h-72 overflow-hidden">
            <Image
              src="https://res.cloudinary.com/daeebexlo/image/upload/v1746418107/vp80ty4ywo2swb1l4lmu.png"
              alt="Shoes"
              fill
              className="object-cover object-[0_20%]"
            />
          </figure>
          <div className="card-body">
            <h2 className="card-title">Marha Nur Amalina</h2>
            <p>Frontend</p>
            <div className="card-actions justify-end">
              <button className="btn btn-primary">StyleHack Team</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
