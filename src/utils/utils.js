const API_PATH = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch(endpoint, options = {}) {
  try {
    const headers = {
      "Content-Type": "aplication/json",
      ...(options.headers || {}),
    };
    
    const res = await fetch(`${API_PATH}${endpoint}`, {
      headers,
      credentials: "include",
      ...options,
    });
    if (res.status === 401) {
      throw new Error("Unauthorized");
    }

    const contentType = res.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      const message = (data && (data.error || data.message)) || "API request failed.";
      throw new Error(message);
    }
    return data;
  } catch (error) {
    throw new Error(error.message || "API request failed.");
  }
}
