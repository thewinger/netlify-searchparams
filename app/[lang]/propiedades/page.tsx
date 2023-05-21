import FilterBar from "@/components/filterbar";
import Filters from "@/components/filters";
import PropiedadCard from "@/components/propiedad-card";
import { getDictionary } from "@/get-dictionary";
import { Locale } from "@/i18n-config";
import {
  client,
  clientFetch,
  getFiltersDropdownValues,
} from "@/lib/sanity.client";
import { Propiedad } from "@/types";
import clsx from "clsx";
import Link from "next/link";

type Props = {
  params: {
    lang: Locale;
  };
  searchParams: { [key: string]: string | string[] };
};

async function getSearchProperties(
  searchParams: { [key: string]: string | string[] },
  lang: Locale
): Promise<Propiedad[]> {
  if (client) {
    let query = `*[_type == 'propiedad'`;
    const queryMap = {
      precioMin: (value: string) => `price >= ${Number(value)}`,
      precioMax: (value: string) => `price <= ${Number(value)}`,
      banos: (value: string) => `bathrooms == ${value}`,
      habitaciones: (value: string) => `bedrooms == ${value}`,
      localizacion: (value: string) => {
        if (value == "localizacion-todas") {
          return `(localizacion._ref != '${value}' || localizacion->parent._ref != '${value}')`;
        }
        return `(localizacion._ref == '${value}' || localizacion->parent._ref == '${value}')`;
      },
      tipo: (value: string) => {
        if (value == "tipo-todos") {
          return `tipo._ref != '${value}'`;
        }
        return `tipo._ref == '${value}'`;
      },
    };

    for (const [key, value] of Object.entries(searchParams)) {
      const queryFn = (queryMap as any)[key];
      if (queryFn) {
        query += ` && ${queryFn(value)} `;
      } else {
        query += ` && ${key}._ref == '${value}' `;
      }
    }
    query += `]{
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
        _createdAt,
    } | order(_createdAt desc)[0...50]`;

    console.log(query);

    return await clientFetch(query, { lang });
  }

  return {} as any;
}

export default async function PropiedadesPage({ params, searchParams }: Props) {
  const dict = await getDictionary(params.lang);
  const filtersDD = await getFiltersDropdownValues(params.lang);
  const propiedades = await getSearchProperties(
    searchParams,
    params.lang as Locale
  );

  return (
    <>
      <FilterBar dict={dict} filtersDD={filtersDD} />
      <div className=" mx-auto max-w-5xl flex-col gap-6 px-4 py-20 lg:flex lg:flex-row lg:px-6 lg:py-12">
        <div className="relative isolate hidden w-[19.5rem] flex-col lg:flex">
          <h2 className="py-2 text-sm font-semibold uppercase  tracking-wide text-zinc-800 lg:px-0">
            {dict.filters.filtros_title}
          </h2>
          <Filters dict={dict} filtersDD={filtersDD} />
        </div>

        <div className="grow">
          <h2 className=" py-2 text-sm font-semibold uppercase  tracking-wide text-zinc-800 lg:px-0">
            {propiedades.length == 1
              ? `${propiedades.length} ${dict.resultado}`
              : `${propiedades.length} ${dict.resultados}`}
          </h2>
          <div
            className={clsx(
              "grid  grid-cols-cards gap-4",
              propiedades.length > 1 ? "justify-center" : ""
            )}
          >
            {propiedades.map((propiedad) => (
              <PropiedadCard
                key={propiedad.slug}
                params={params}
                dict={dict}
                propiedad={propiedad}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
