import { useState } from "react";
import Head from "next/head";

export default function ImageGen() {
  const [prompt, setPrompt] = useState("");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);

  const generateImage = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setImage("");

    try {
      const res = await fetch("/api/gen-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data?.image) {
        setImage(data.image);
      } else {
        setImage("error");
      }
    } catch (err) {
      console.error("Image error:", err);
      setImage("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head><title>🎨 Mixtral Image Generator</title></Head>
      <main className="p-6 max-w-xl mx-auto bg-white min-h-screen">
        <h1 className="text-3xl font-bold mb-4">🎨 Image Generator</h1>
        <input
          className="w-full p-2 border rounded mb-4"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && generateImage()}
          placeholder="Enter image prompt..."
        />
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={generateImage}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
        {image && image !== "error" && (
          <div className="mt-6">
            <img src={image} alt="Generated" className="w-full rounded shadow-lg" />
          </div>
        )}
        {image === "error" && (
          <p className="text-red-600 mt-4">❌ Error generating image</p>
        )}
      </main>
    </>
  );
}
