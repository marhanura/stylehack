import CustomError from "./CustomError";

export type Prompt = {
  type: "image" | "destination" | "free-text";
  input: string;
};

export async function callAiRecommendation(prompt: Prompt) {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  const res = await fetch(`${baseUrl}/recommend`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(prompt),
  });

  
  if (!res.ok) {
    // API returned an error status
    const err = await res.json()
    throw new CustomError(err.message || "AI service error", res.status);
  }
  
  const data = await res.json();


  if (!Array.isArray(data.products) || !data) {
    throw new CustomError("Invalid AI response");
  }

  return data.products as { category: string; name: string; links: string[] }[];
}
