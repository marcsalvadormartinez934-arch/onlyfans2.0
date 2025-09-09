import React, { useState } from "react";

export default function ImageGenerator() {
  const [prompt, setPrompt] = useState("");
  const [gender, setGender] = useState("any");
  const [count, setCount] = useState(1);
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  async function handleGenerate(e) {
    e?.preventDefault();
    setError(null);
    if (!consent) return setError("Debes confirmar que tienes 21+ y aceptar las condiciones.");
    if (!prompt || prompt.trim().length < 10) return setError("Describe al menos 10 caracteres en el prompt.");

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, gender, count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Error en servidor");
      setImages(data.images || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Generador SFW — Personas adultas en lencería</h1>
      <form onSubmit={handleGenerate} className="space-y-4">
        <textarea value={prompt} onChange={(e)=>setPrompt(e.target.value)} placeholder="Ej.: retrato elegante en lencería vintage, pose segura, iluminación cálida" className="w-full h-28 p-3 border rounded" />
        <div className="flex gap-2">
          <select value={gender} onChange={(e)=>setGender(e.target.value)} className="rounded border p-2">
            <option value="any">Cualquiera</option>
            <option value="woman">Mujer adulta</option>
            <option value="man">Hombre adulto</option>
            <option value="nonbinary">No binarie adultx</option>
          </select>
          <input type="number" min={1} max={4} value={count} onChange={(e)=>setCount(Number(e.target.value))} className="w-20 rounded border p-2" />
        </div>
        <label className="block">
          <input type="checkbox" checked={consent} onChange={(e)=>setConsent(e.target.checked)} /> He leído y confirmo que soy 21+ y no solicito personas reales ni desnudez explícita.
        </label>
        <div>
          <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? "Generando..." : "Generar"}</button>
        </div>
        {error && <div className="text-red-600 mt-2">{error}</div>}
      </form>
      <section className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
        {images.map((u,i)=> (
          <img key={i} src={u} alt={`resultado-${i}`} className="w-full h-56 object-cover rounded" />
        ))}
      </section>
    </div>
  );
}