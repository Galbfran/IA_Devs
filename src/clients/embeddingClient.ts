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
      encoding_format: "float",
    });
    if (response.data[0] === undefined) {
      throw new Error("Error response undefined");
    }
    const embedding = response.data[0].embedding;
    if (typeof embedding === "string") {
      const buffer = Buffer.from(embedding, "base64");
      const floats = new Float32Array(buffer.buffer);
      return Array.from(floats);
    }
    return embedding as number[];
  } catch (error) {
    console.log(error);
    throw new Error("Error al generar embedding");
  }
}
export async function generateEmbeddings(text: string[]): Promise<number[][]> {
  try {
    const response = await embeddingClient.embeddings.create({
      model: "text-embedding-nomic-embed-text-v1.5-embedding",
      input: text,
      encoding_format: "float",
    });
    return response.data.map((item) => {
      const embedding = item.embedding;
      if (typeof embedding === "string") {
        const buffer = Buffer.from(embedding, "base64");
        const floats = new Float32Array(buffer.buffer);
        return Array.from(floats);
      }
      return embedding as number[];
    });
  } catch (error) {
    console.log(error);
    throw new Error("Error al generar embeddings");
  }
}
