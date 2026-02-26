const BASE_URL = "http://127.0.0.1:8000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
}

export async function fetchTransactions() {
  try {
    const response = await fetch(`${BASE_URL}/transactions/`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar transações");
    }

    const data = await response.json();

    if (Array.isArray(data)) return data;
    if (Array.isArray(data.results)) return data.results;

    return [];
  } catch (error) {
    console.error("fetchTransactions error:", error);
    return [];
  }
}

export async function createTransaction(data: any) {
  const response = await fetch(`${BASE_URL}/transactions/`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function deleteTransaction(id: number) {
  await fetch(`${BASE_URL}/transactions/${id}/`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
}

export async function login(username: string, password: string) {
  const response = await fetch("http://127.0.0.1:8000/api/token/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  return response.json();
}
