export const uploadExcel = async (file: File) => {
  const token = localStorage.getItem("token"); // 👈 pegar token

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://localhost:8000/api/upload-excel/", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // 👈 enviar token
    },
    body: formData,
  });

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("Erro inesperado do servidor.");
  }

  if (!response.ok) {
    throw new Error(
      data?.error ||
      data?.detail ||
      "Erro ao enviar arquivo para o servidor."
    );
  }

  return data;
};