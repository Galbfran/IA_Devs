import { Database } from "bun:sqlite";
import * as path from "path";
import * as fs from "fs";
import type { Chunk, SearchResult } from "../types.js";

interface ChunkRow {
  id: string;
  content: string;
  source: string;
  heading: string;
  position: number;
  char_count: number;
  embedding: string;
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i]! * b[i]!;
    normA += a[i]! * a[i]!;
    normB += b[i]! * b[i]!;
  }
  normA = Math.sqrt(normA);
  normB = Math.sqrt(normB);
  return normA === 0 || normB === 0 ? 0 : dotProduct / (normA * normB);
}

export class VectorStore {
  private db: Database;
  constructor(dbPath: string) {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    this.db = new Database(dbPath);
    this.createTables();
  }
  private createTables(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS chunks(
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        source TEXT NOT NULL,
        heading TEXT NOT NULL,
        position INTEGER NOT NULL,
        char_count INTEGER NOT NULL,
        embedding TEXT NOT NULL
      )
    `);
  }
  insert(chunk: Chunk, embedding: number[]): void {
    const query = this.db.prepare(`
      INSERT OR REPLACE INTO chunks
      (id, content, source, heading, position, char_count, embedding)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    query.run(
      chunk.id,
      chunk.content,
      chunk.metadata.source,
      chunk.metadata.heading,
      chunk.metadata.position,
      chunk.metadata.charCount,
      JSON.stringify(embedding),
    );
  }
  search(queryEmbedding: number[], topk: number): SearchResult[] {
    const stmt = this.db.prepare(`
      SELECT id, content, source, heading, position, char_count, embedding
      FROM chunks
    `);
    const rows = stmt.all() as ChunkRow[];

    const results = rows.map((row) => {
      const storedEmbedding = JSON.parse(row.embedding) as number[];
      const similarity = cosineSimilarity(queryEmbedding, storedEmbedding);
      return {
        row,
        similarity,
      };
    });

    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topk)
      .map(({ row, similarity }) => ({
        chunk: {
          id: row.id,
          content: row.content,
          metadata: {
            source: row.source,
            heading: row.heading,
            position: row.position,
            charCount: row.char_count,
          },
        },
        score: similarity,
      }));
  }
  clear(): void {
    const stmt = this.db.prepare("DELETE FROM chunks");
    stmt.run();
  }
  get size(): number {
    const row = this.db
      .prepare(`SELECT COUNT(*) as count FROM chunks`)
      .get() as { count: number };
    return row.count;
  }
  close(): void {
    this.db.close();
  }
}
