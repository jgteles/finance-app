const BASE_URL = "http://127.0.0.1:8000/api";

export async function fetchTransactions() {
  try {
    const response = await fetch(`${BASE_URL}/transactions/`);

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
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return response.json();
}

export async function deleteTransaction(id: number) {
  await fetch(`${BASE_URL}/transactions/${id}/`, {
    method: "DELETE",
  });
}
