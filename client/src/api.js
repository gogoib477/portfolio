const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function fetchPortfolioData() {
  const response = await fetch(`${API_BASE_URL}/api/portfolio`);

  if (!response.ok) {
    throw new Error("Failed to load portfolio data");
  }

  return response.json();
}
