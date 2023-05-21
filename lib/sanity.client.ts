import { createClient } from "next-sanity";
import { cache } from "react";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID; // "pv8y60vp"
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET; // "production"
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION; // "2023-05-03"

export const client = createClient({
  apiVersion,
  dataset,
  projectId,
  useCdn: true,
});

export const clientFetch = cache(client.fetch.bind(client));
