import { Locale } from "@/i18n-config";
import { FiltersDD } from "@/types";
import { createClient, groq } from "next-sanity";
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

export async function getFiltersDropdownValues(
  lang: Locale
): Promise<FiltersDD> {
  if (client) {
    const bathroomsData = clientFetch(bathroomsDD);

    const bedroomsData = clientFetch(bedroomsDD);
    const priceRentData = clientFetch(maxPriceRentDD);
    const priceSaleData = clientFetch(maxPriceSaleDD);
    const localizacionData = clientFetch(localizacionDD);
    const tipoData = clientFetch(tipoDD, { lang });
    const operacionData = clientFetch(operacionDD, { lang });

    const [
      bathroomsValues,
      bedroomsValues,
      priceRentValues,
      priceSaleValues,
      localizacionValues,
      tipoValues,
      operacionValues,
    ] = await Promise.all([
      bathroomsData,
      bedroomsData,
      priceRentData,
      priceSaleData,
      localizacionData,
      tipoData,
      operacionData,
    ]);

    return {
      bathroomsDD: bathroomsValues,
      bedroomsDD: bedroomsValues,
      priceRentDD: priceRentValues,
      priceSaleDD: priceSaleValues,
      localizacionDD: localizacionValues,
      tipoDD: tipoValues,
      operacionDD: operacionValues,
    };
  }

  return {} as any;
}

const operacionDD = groq`
  array::unique(*[_type == "operacion" ]{
  "name": title[$lang],
  "value": _id
  })
`;

const tipoDD = groq`
  array::unique(*[_type =="tipo"  && count(*[ _type == 'propiedad' && references(^._id)]) > 0]{
    "name": title[$lang],
    "value":_id
  })
`;

const localizacionDD = groq`
*[_type == 'localizacion' && !(defined(parent))]{
    title,
    _id,
    "count": count(*[_type == 'propiedad' && !(_id in path('drafts.**')) && references(^._id)]),
    "children": *[ _type == 'localizacion' && references(^._id) && count(*[_type == 'propiedad' && !(_id in path('drafts.**')) && references(^._id)]) > 0]{
      title,
      _id,
      "count": count(*[_type == 'propiedad' && !(_id in path('drafts.**')) && references(^._id)])
    } | order(title asc),

}[ count > 0 || count(children) > 0]{
  "name": title,
  "value": _id,
  count(children) > 0 => {
      children[]{
        "name": title,
        "value": _id,
      }
        },

} | order(title asc)
`;

const maxPriceSaleDD = groq`
  math::max(*[_type == 'propiedad' && operacion._ref != 'operacion-en-alquiler'].price)
`;

const maxPriceRentDD = groq`
  math::max(*[_type == 'propiedad' && operacion._ref == 'operacion-en-alquiler'].price)
`;

const bathroomsDD = groq`
  math::max(*[_type == 'propiedad'].bathrooms)
`;

const bedroomsDD = groq`
  math::max(*[_type == 'propiedad'].bedrooms)
`;
