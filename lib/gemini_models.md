Recommended Gemini embedding models

Note: model availability and exact IDs can change. Verify exact model names in your Google Cloud/GenAI console before using.

- gemini-mini-embedding — Small and fast; good for cost-sensitive use-cases and approximate semantic search.
- gemini-small-embedding — Balanced option: better quality than mini with reasonable latency.
- gemini-1.5-embedding — Higher-quality embeddings for better semantic recall (use when accuracy matters).
- gemini-2-embedding (or gemini-2.1-embedding) — Top-tier quality; use when highest retrieval accuracy is required.

Usage tips:
- Start with a smaller model (mini/small) for prototyping and indexing large corpora, then re-embed with a higher-quality model if you need improved results.
- Normalize and store embeddings as arrays of floats in your product documents (we added an `embedding` field to `lib/seedProducts.json`).
- Always check model costs and rate limits in your Google GenAI account.

If you want, I can add a small helper `lib/embeddings.ts` that calls Google GenAI embeddings API and writes vectors into the product records.