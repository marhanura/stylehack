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

  const data = await res.json();

  if (!res.ok) {
    // API returned an error status
    throw new CustomError(data.message || "AI service error", res.status);
  }

  if (!Array.isArray(data.products)) {
    throw new CustomError("Invalid AI response");
  }

  return data.products as { category: string; name: string; links: string[] }[];
}
