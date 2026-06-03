import OpenAI from "openai";

const embeddingClient = new OpenAI({
  baseURL: "http://localhost:1234/v1",
  apiKey: "lm-studio", // cualquier string, no se valida
});

export async function generateEmbedding(text: string): Promise<number[]> {
  try {
    const response = await embeddingClient.embeddings.create({
      model: "text-embedding-nomic-embed-text-v1.5-embedding",
      input: text,
    });
    if (response.data[0] === undefined) {
      throw new Error("Error response undefined");
    }
    return response.data[0].embedding;
  } catch (error) {
    console.log(error);
    throw new Error("Error al generar embedding");
  }
}
export async function generateEmbeddings(text: string): Promise<number[][]> {
  try {
    const response = await embeddingClient.embeddings.create({
      model: "text-embedding-nomic-embed-text-v1.5-embedding",
      input: text,
    });
    return response.data.map((item) => item.embedding);
  } catch (error) {
    console.log(error);
    throw new Error("Error al generar embeddings");
  }
}
