"use client";
import { useState } from "react";
import Image1 from "@/../public/image1.webp";
import Image from "next/image";

export default function RecommendationPage() {
  const [activeTab, setActiveTab] = useState("image");

  const renderTabContent = () => {
    switch (activeTab) {
      case "image":
        return (
          <div className="bg-[#E7DFD1] p-10 h-100 flex flex-col w-full">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">
                Upload Reference Image
              </legend>
              <input
                type="file"
                className="file-input w-full"
                accept="image/*"
              />
              <label className="label">Max size 2MB</label>
            </fieldset>
            <button className="btn btn-primary mt-4 w-full">
              Generate Style
            </button>
          </div>
        );

      case "destination":
        return (
          <div className="bg-[#E7DFD1] p-10 h-100 flex flex-col w-full">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Where are you going?</legend>
              <input
                type="text"
                className="input w-full"
                placeholder="E.g., Art gallery opening, Beach party, Business meeting"
              />
            </fieldset>
            <button className="btn btn-primary mt-4 w-full">
              Generate Style
            </button>
          </div>
        );

      case "free":
        return (
          <div className="bg-[#E7DFD1] p-10 h-100 flex flex-col w-full">
            <fieldset className="fieldset">
              <legend className="fieldset-legend">Describe your style</legend>
              <textarea
                className="textarea w-full h-32"
                placeholder="Freely describe the style you want, e.g., 'Casual elegant outfit inspired by Paris fashion week with neutral colors'"
              />
            </fieldset>
            <button className="btn btn-primary mt-4 w-full">
              Generate Style
            </button>
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
          <div role="tablist" className="tabs tabs-lift">
            <a
              role="tab"
              className={`tab ${activeTab === "image" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("image")}
            >
              Image
            </a>
            <a
              role="tab"
              className={`tab ${
                activeTab === "destination" ? "tab-active" : ""
              }`}
              onClick={() => setActiveTab("destination")}
            >
              Destination
            </a>
            <a
              role="tab"
              className={`tab ${activeTab === "free" ? "tab-active" : ""}`}
              onClick={() => setActiveTab("free")}
            >
              Free Text
            </a>
          </div>
          {renderTabContent()}
        </div>
        <div className="flex flex-1 h-100 w-full bg-[#E7DFD1] items-center justify-center">
          <Image
            src={Image1}
            alt="Generated Style"
            width={200}
            height={350}
            className="mx-auto"
          />
        </div>
      </div>
    </div>
  );
}
