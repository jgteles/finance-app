const BASE_URL = "http://127.0.0.1:8000/api";

export async function fetchTransactions() {
  const response = await fetch(`${BASE_URL}/transactions/`);
  return response.json();
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
