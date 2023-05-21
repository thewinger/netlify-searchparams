import { getDictionary } from "@/get-dictionary";
import { Locale, i18n } from "@/i18n-config";
import {
  client,
  clientFetch,
  getFiltersDropdownValues,
} from "@/lib/sanity.client";
import { FrontPage } from "@/types";
import { groq } from "next-sanity";
import FeaturedSlider from "@/components/featured-slider";
import PropiedadCard from "@/components/propiedad-card";
import Hero from "@/components/hero";

const frontPageQuery = groq`
{
  "featured": *[_type == "propiedad" && featured] | order(_createdAt desc) [0...6] {
    title,
    "slug": slug.current,
    "coverImage": images[0],
    "tipo": select(tipo->title[$lang] != "" => tipo->title[$lang], tipo->title['es']),
    "operacion": select(operacion->title[$lang] != "" => operacion->title[$lang], operacion->title['es']),
  },
  "latest": *[_type == "propiedad"] | order(_createdAt desc) [0...12] {
    _id,
    title,
    "slug": slug.current,
    bathrooms,
    bedrooms,
    "operacion": {
        "name": select(operacion->title[$lang] != "" => operacion->title[$lang], operacion->title['es']),
        "value": operacion._ref
    },
    "localizacion": localizacion->title,
    "localizacionPadre": localizacion->{parent->{title}},
    "tipo": select(tipo->title[$lang] != "" => tipo->title[$lang], tipo->title['es']),
    price,
    size,
    year,
    "coverImage": images[0],
  },
}`;

async function getFrontPage(lang: Locale): Promise<FrontPage> {
  if (client) {
    return (await clientFetch(frontPageQuery, { lang })) || ({} as any);
  }

  return {} as any;
}

export default async function Home({ params }: { params: { lang: Locale } }) {
  const dict = await getDictionary(params.lang);
  const { featured, latest } = await getFrontPage(params.lang);
  const filtersDD = await getFiltersDropdownValues(params.lang);
  return (
    <>
      <Hero params={params} dict={dict} filtersDD={filtersDD} />
      <section className="relative mx-auto max-w-5xl py-4 lg:px-4">
        <h2 className="p-2 px-4 text-sm font-semibold  uppercase tracking-wide text-zinc-800 lg:px-0">
          {dict.destacados}
        </h2>
        <FeaturedSlider params={params} propiedades={featured} />
      </section>
      <section className="relative mx-auto max-w-5xl p-4 py-16 ">
        <h2 className="py-2 text-sm font-semibold uppercase tracking-wide text-zinc-800 lg:px-0">
          {dict.ultimos_anadidos}
        </h2>
        <div className="grid grid-cols-cards gap-6">
          {latest.map((propiedad) => (
            <PropiedadCard
              key={propiedad.slug}
              params={params}
              dict={dict}
              propiedad={propiedad}
            />
          ))}
        </div>
      </section>
    </>
  );
}

export async function generateStaticParams() {
  const locales = i18n.locales;

  const params = locales!.flatMap((locale) => {
    return {
      lang: locale,
    };
  });

  return params;
}
