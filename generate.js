import { validatePrompt, containsRealPersonRequest, isLikelyMinor } from "../../lib/moderation";
import fs from "fs";
import path from "path";

const MODEL_API_URL = process.env.MODEL_API_URL || "";
const MODEL_API_KEY = process.env.MODEL_API_KEY || "";
const NSFW_CLASSIFIER_API = process.env.NSFW_CLASSIFIER_API || "";
const NSFW_API_KEY = process.env.NSFW_API_KEY || "";
const AUDIT_LOG_DIR = process.env.AUDIT_LOG_DIR || "./logs";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { prompt, gender = "any", count = 1 } = req.body || {};

  try {
    validatePrompt(prompt);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }

  if (containsRealPersonRequest(prompt)) {
    return res.status(400).json({ message: "No se permiten solicitudes de semejanza con personas reales o celebrities." });
  }
  if (isLikelyMinor(prompt)) {
    return res.status(400).json({ message: "Prohibido: referencia a menores." });
  }

  const finalPrompt = `${gender === "any" ? "adult person" : "adult " + gender}, photorealistic, tasteful lingerie, suggestive but non-explicit, no nudity, 21+ years old. Context: ${prompt}`;

  const images = [];
  for (let i = 0; i < Math.max(1, Number(count)); i++) {
    const safeSeed = Buffer.from(finalPrompt + i).toString("base64url").slice(0, 12);
    const imageUrl = `https://picsum.photos/seed/${encodeURIComponent(safeSeed)}/768/1024`;

    const nsfwScore = await fakeNsfwCheck(imageUrl);
    if (nsfwScore > 0.6) {
      await auditLog({ prompt: finalPrompt, imageUrl, nsfwScore, status: "blocked" });
      return res.status(403).json({ message: "Una de las imágenes fue marcada como inapropiada por el clasificador." });
    }

    images.push(imageUrl);
    await auditLog({ prompt: finalPrompt, imageUrl, nsfwScore, status: "ok" });
  }

  return res.status(200).json({ images });
}

async function fakeNsfwCheck(_imageUrl) {
  return 0.0;
}

async function auditLog(entry) {
  try {
    if (!fs.existsSync(AUDIT_LOG_DIR)) fs.mkdirSync(AUDIT_LOG_DIR, { recursive: true });
    const line = JSON.stringify({ ts: new Date().toISOString(), entry }) + "\n";
    fs.appendFileSync(path.join(AUDIT_LOG_DIR, "audit.log"), line);
  } catch (e) {
    console.error("Audit log failed", e);
  }
}