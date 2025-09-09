const forbiddenWords = [
  "nude","porn","pornography","sex act","underage","teen","kid","child","minor","celebrity","look like","real person","deepfake"
];

export function validatePrompt(text) {
  if (!text || typeof text !== "string") throw new Error("Prompt inválido");
  const t = text.toLowerCase();
  for (const w of forbiddenWords) {
    if (t.includes(w)) throw new Error("Prompt contiene término prohibido: " + w);
  }
  if (t.match(/\b(1[0-9]|20)\b/)) throw new Error("No especifiques edades menores a 21");
}

export function containsRealPersonRequest(text) {
  const t = text.toLowerCase();
  return /(look like|celebrity|real person|resembles|in the style of a real person)/.test(t);
}

export function isLikelyMinor(text) {
  return /\b(teen|teenager|kid|child|minor)\b/.test(text.toLowerCase());
}