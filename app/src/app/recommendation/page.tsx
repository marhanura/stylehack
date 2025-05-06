"use client";
import { useState, ChangeEvent } from "react";
import Image1 from "@/../public/side1.webp";
import Image from "next/image";
import Swal from "sweetalert2";
import { generateRecommendation } from "./action";
import { useRouter } from "next/navigation";

type Product = {
  category: string;
  name: string;
  links: string[];
};

export default function RecommendationPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"image" | "destination" | "free">(
    "image"
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [destination, setDestination] = useState("");
  const [style, setStyle] = useState("");
  const [freeText, setFreeText] = useState("");
  const [result, setResult] = useState<Product[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleError = (message: string) => {
    Swal.fire({ title: "Error", text: message, icon: "error" });
  };

  const recByImage = async (file: File) => {
    setLoading(true);
    try {
      const form = new FormData();
      form.append("type", "image");
      form.append("input", "");
      form.append("file", file);
      const { insertedId, products } = await generateRecommendation(form);
      router.push(`/lookbook/${insertedId.toString()}`);
      setResult(products);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e)
      handleError(message);
      if (message === "Token run out. Please top up to continue.") {
        router.push("/profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const recByDestination = async () => {
    setLoading(true);
    try {
      const form = new FormData();
      form.append("type", "destination");
      form.append("input", `${destination} ${style}`);
      const { insertedId, products } = await generateRecommendation(form);
      router.push(`/lookbook/${insertedId.toString()}`);
      setResult(products);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e)
      handleError(message);
      if (message === "Token run out. Please top up to continue.") {
        router.push("/profile");
      }
    } finally {
      setLoading(false);
    }
  };

  const recByFreeText = async () => {
    setLoading(true);
    try {
      const form = new FormData();
      form.append("type", "free-text");
      form.append("input", freeText);
      const { insertedId, products } = await generateRecommendation(form);
      router.push(`/lookbook/${insertedId.toString()}`);
      setResult(products);
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : String(e)
      handleError(message);
      if (message === "Token run out. Please top up to continue.") {
        router.push("/profile");
      }
    } finally {
      setLoading(false);
    }
  };

  if (result === undefined) {
    Swal.fire({
      title: "no recomendations",
      icon: "error",
    });
    return;
  }
  const renderTabContent = () => {
    switch (activeTab) {
      case "image":
        return (
          <div className="bg-[#E7DFD1] p-10 h-100 flex flex-col w-full">
            {!result ? (
              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Upload Reference Image
                  </legend>
                  <input
                    type="file"
                    className="file-input w-full"
                    accept="image/*"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      const file = e.target.files?.[0] ?? null;
                      setImageFile(file);
                    }}
                  />
                  <label className="label">Max size 2MB</label>
                </fieldset>
                <button
                  className="btn btn-primary mt-4 w-full"
                  disabled={!imageFile || loading}
                  onClick={() => imageFile && recByImage(imageFile)}
                >
                  {loading ? "Generating…" : "Generate Style"}
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-lg mb-2">Recommendations:</h2>
                <ul className="list-disc pl-5">
                  {result.map((p) => (
                    <li key={p.name}>
                      <strong>{p.category}</strong> – {p.name}
                      <ul className="list-inside list-decimal">
                        {p.links.map((l) => (
                          <li key={l}>
                            <a
                              href={l}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {l}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case "destination":
        return (
          <div className="bg-[#E7DFD1] p-10 h-100 flex flex-col w-full">
            {!result ? (
              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Where are you going?
                  </legend>
                  <select
                    className="select"
                    name="destination"
                    value={destination}
                    onChange={(e) => setDestination(e.currentTarget.value)}
                  >
                    <option value="">--Select destination--</option>
                    <option value="beach">Beach</option>
                    <option value="museum">Museum</option>
                    <option value="cafe">Cafe</option>
                    <option value="library">Library</option>
                    <option value="garden">Garden</option>
                    <option value="restaurant">Restaurant</option>
                    <option value="office">Office</option>
                  </select>

                  <legend className="fieldset-legend">How is the style?</legend>
                  <select
                    className="select"
                    name="style"
                    value={style}
                    onChange={(e) => setStyle(e.currentTarget.value)}
                  >
                    <option value="">--Select style--</option>
                    <option value="casual">Casual</option>
                    <option value="formal">Formal</option>
                    <option value="glamour">Glamour</option>
                  </select>
                </fieldset>
                <button
                  className="btn btn-primary mt-4 w-full"
                  disabled={!destination || !style || loading}
                  onClick={recByDestination}
                >
                  {loading ? "Generating…" : "Generate Style"}
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-lg mb-2">Recommendations:</h2>
                <ul className="list-disc pl-5">
                  {result.map((p) => (
                    <li key={p.name}>
                      <strong>{p.category}</strong> – {p.name}
                      <ul className="list-inside list-decimal">
                        {p.links.map((l) => (
                          <li key={l}>
                            <a
                              href={l}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {l}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      case "free":
        return (
          <div className="bg-[#E7DFD1] p-10 h-100 flex flex-col w-full">
            {!result ? (
              <div>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">
                    Describe your style
                  </legend>
                  <textarea
                    name="free-text"
                    className="textarea w-full h-32"
                    placeholder="Freely describe the style you want…"
                    value={freeText}
                    onChange={(e) => setFreeText(e.currentTarget.value)}
                  />
                </fieldset>
                <button
                  className="btn btn-primary mt-4 w-full"
                  disabled={!freeText.trim() || loading}
                  onClick={recByFreeText}
                >
                  {loading ? "Generating…" : "Generate Style"}
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-lg mb-2">Recommendations:</h2>
                <ul className="list-disc pl-5">
                  {result.map((p) => (
                    <li key={p.name}>
                      <strong>{p.category}</strong> – {p.name}
                      <ul className="list-inside list-decimal">
                        {p.links.map((l) => (
                          <li key={l}>
                            <a
                              href={l}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {l}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="h-screen pt-25">
      <h1 className="text-center mb-5 text-2xl font-(family-name:--font-bodoni-moda)">
        Create Style Recommendation
      </h1>
      <div className="flex flex-row items-end justify-between m-10">
        <div className="flex flex-col flex-2 justify-center items-start">
          <div role="tablist" className="tabs tabs-lift text-black">
            <a
              role="tab"
              className={`tab text-black ${
                activeTab === "image" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("image")}
            >
              Image
            </a>
            <a
              role="tab"
              className={`tab text-black ${
                activeTab === "destination" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("destination")}
            >
              Destination
            </a>
            <a
              role="tab"
              className={`tab text-black ${
                activeTab === "free" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("free")}
            >
              Free Text
            </a>
          </div>
          {renderTabContent()}
        </div>
        <div className="flex flex-1 h-100 w-full bg-[#E7DFD1] items-center justify-center">
          <Image
            src={imageFile ? URL.createObjectURL(imageFile) : Image1}
            alt="Generated Style"
            width={200}
            height={350}
            className="mx-auto"
          />
        </div>
      </div>

      {/* {result && (
      )} */}
    </div>
  );
}
