// const BASE_URL = "https://soc-log-analyzer-lpz1.onrender.com"; // production deployment
const BASE_URL = "http://localhost:8000"; // local development

export async function uploadLog(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Upload failed");
  }

  return response.json();
}

export async function analyzeLog(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Analysis failed");
  }

  return response.json();
}

export async function updateRules(rules) {
  const response = await fetch(`${BASE_URL}/rules`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(rules),
  });

  if (!response.ok) {
    throw new Error("Failed to update rules");
  }

  return response.json();
}

export async function getRules() {
  const response = await fetch(`${BASE_URL}/rules`);
  if (!response.ok) {
    throw new Error("Failed to fetch rules");
  }
  return response.json();
}
