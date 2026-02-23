import { GoogleGenAI } from "@google/genai";
import { Transaction } from "@/types";

export async function analyzeTransactions(transactions: Transaction[]) {
  const ai = new GoogleGenAI({
    apiKey: import.meta.env.VITE_API_KEY, // Vite usa import.meta.env
  });

  const prompt = `
  Analise os seguintes dados financeiros e dê um conselho curto e prático em português brasileiro:
  Dados: ${JSON.stringify(
    transactions.map((t) => ({
      desc: t.description,
      val: t.value,
      tipo: t.type,
      cat: t.category,
    })),
  )}
  Identifique padrões de gastos e sugira melhorias.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: prompt,
  });

  return response.text;
}
