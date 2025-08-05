import Head from "next/head";
import { useState } from "react";

export default function ImageGen() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  const generateImage = async () => {
    try {
      const res = await fetch("/api/mixtral-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.imageUrl) setImageUrl(data.imageUrl);
    } catch (err) {
      console.error("Error generating image:", err);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Head>
        <title>Mixtral Image Generator</title>
        <meta name="description" content="Mixtral AI — Image Generation Dashboard" />
      </Head>
      <h1 className="text-3xl font-bold mb-4">Mixtral Image Generator</h1>
      <input
        type="text"
        placeholder="Enter a prompt..."
        className="w-full border border-gray-300 p-2 rounded mb-4"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <button
        onClick={generateImage}
        className="bg-black text-white px-4 py-2 rounded"
      >
        Generate Image
      </button>
      {imageUrl && (
        <div className="mt-6">
          <img src={imageUrl} alt="Generated" className="rounded-lg shadow-lg" />
        </div>
      )}
    </div>
  );
}
