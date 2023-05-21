import createImageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID; // "pv8y60vp"
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET; // "production"

const imageBuilder = createImageUrlBuilder({
  projectId: projectId || "",
  dataset: dataset || "",
});

export const urlForImage = (source: Image) => {
  // Ensure that source image contains a valid reference
  /* if (!source?.asset?._ref) { */
  /*   return undefined */
  /* } */

  return imageBuilder?.image(source).auto("format").fit("max");
};
