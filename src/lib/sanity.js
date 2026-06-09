// src/lib/sanity.js

const projectId = "cbvavl37";
const dataset = "production";

export async function sanityQuery(query) {
  const encoded = encodeURIComponent(query);

  const res = await fetch(
    `https://${projectId}.api.sanity.io/v2025-02-19/data/query/${dataset}?query=${encoded}`,
  );

  const data = await res.json();
  return data.result;
}
