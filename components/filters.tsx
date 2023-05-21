"use client";

import { createNumArray, formatEUR, getRoundedZeros } from "@/lib/utils";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Fragment, useMemo, useState } from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Label } from "./ui/label";
import { Dict, FiltersDD, ParentLocalizacion } from "@/types";
import { MagnifyingGlassIcon } from "./icons";

interface Filters {
  operacion: string;
  tipo?: string;
  precioMin?: string;
  precioMax?: string;
  habitaciones?: string;
  banos?: string;
  localizacion?: string;
}

type FilterBarProps = {
  filtersDD: FiltersDD;
  dict: Dict;
  handleClose?: () => void;
};

function Filters({ dict, filtersDD, handleClose }: FilterBarProps) {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    bathroomsDD,
    bedroomsDD,
    operacionDD,
    localizacionDD,
    tipoDD,
    priceSaleDD,
    priceRentDD,
  } = filtersDD;

  const preparedTipoDD = useMemo(() => {
    return [
      {
        name: `${dict.filters.tipo_allValue}`,
        value: "tipo-todos",
      },
      ...tipoDD,
    ];
  }, [tipoDD, dict.filters.tipo_allValue]);

  const preparedLocalizacionDD = useMemo(() => {
    return [
      {
        name: `${dict.filters.localizacion_allValue}`,
        value: "localizacion-todas",
        children: [],
      },
      ...localizacionDD,
    ];
  }, [localizacionDD, dict.filters.localizacion_allValue]);

  let precioSaleArrayDD = createNumArray(getRoundedZeros(priceSaleDD), 50000);
  let precioRentArrayDD = createNumArray(getRoundedZeros(priceRentDD), 100);
  const [precioMinRentArrayDD, setPrecioMinRentArrayDD] = useState<number[]>(
    precioRentArrayDD
      ? precioRentArrayDD.slice(0, precioRentArrayDD.length - 1)
      : [0, 100, 200, 300, 400, 500]
  );
  const [precioMaxRentArrayDD, setPrecioMaxRentArrayDD] = useState<number[]>(
    precioRentArrayDD
      ? precioRentArrayDD.slice(1, precioRentArrayDD.length)
      : [100, 200, 300, 400, 500, 600]
  );
  const [precioMinSaleArrayDD, setPrecioMinSaleArrayDD] = useState<number[]>(
    precioSaleArrayDD
      ? precioSaleArrayDD.slice(0, precioSaleArrayDD.length - 1)
      : [0, 50000, 100000, 150000, 200000, 250000]
  );
  const [precioMaxSaleArrayDD, setPrecioMaxSaleArrayDD] = useState<number[]>(
    precioSaleArrayDD
      ? precioSaleArrayDD.slice(1, precioSaleArrayDD.length)
      : [50000, 100000, 150000, 200000, 250000, 300000]
  );

  const [filters, setFilters] = useState<Filters>({
    operacion:
      searchParams &&
      (searchParams.get("operacion") !== null ||
        searchParams.get("operacion") !== "")
        ? searchParams.get("operacion")!
        : "operacion-en-venta",
    tipo:
      searchParams && searchParams.has("tipo")
        ? searchParams.get("tipo")!
        : "tipo-todos",
    localizacion:
      searchParams && searchParams.has("localizacion")
        ? searchParams.get("localizacion")!
        : "localizacion-todas",
    precioMin:
      searchParams && searchParams.has("precioMin")
        ? searchParams.get("precioMin")!
        : "0",
    precioMax:
      searchParams && searchParams.has("precioMax")
        ? searchParams.get("precioMax")!
        : searchParams &&
          searchParams.has("operacion") &&
          searchParams.get("operacion") === "operacion-en-alquiler"
        ? precioMaxRentArrayDD.slice(-1).toString()
        : precioMaxSaleArrayDD.slice(-1).toString(),
  });

  const bathroomsArrayDD = createNumArray(bathroomsDD, 1);
  const bedroomsArrayDD = createNumArray(bedroomsDD, 1);

  function handleOperacion(value: string) {
    value === "operacion-en-alquiler"
      ? setFilters((prevFilters) => ({
          ...prevFilters,
          operacion: value,
          precioMin: precioMinRentArrayDD[0].toString(),
          precioMax: precioMaxRentArrayDD.slice(-1).toString(),
        }))
      : setFilters((prevFilters) => ({
          ...prevFilters,
          operacion: value,
          precioMin: precioMinSaleArrayDD[0].toString(),
          precioMax: precioMaxSaleArrayDD.slice(-1).toString(),
        }));
  }

  function handlePrecioMin(value: string) {
    filters.operacion === "operacion-en-alquiler"
      ? setPrecioMaxRentArrayDD(
          precioRentArrayDD.filter((f) => f > Number(value))
        )
      : setPrecioMaxSaleArrayDD(
          precioSaleArrayDD.filter((f) => f > Number(value))
        );

    setFilters((prevFilters) => ({
      ...prevFilters,
      precioMin: value,
    }));
  }

  function handlePrecioMax(value: string) {
    filters.operacion === "operacion-en-alquiler"
      ? setPrecioMinRentArrayDD(
          precioRentArrayDD.filter((f) => f < Number(value))
        )
      : setPrecioMinSaleArrayDD(
          precioSaleArrayDD.filter((f) => f < Number(value))
        );

    setFilters((prevFilters) => ({
      ...prevFilters,
      precioMax: value,
    }));
  }

  const createQueryString = (filters: Filters) => {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== "") {
        params.set(key, value);
      }
    }

    return params.toString();
  };

  function handleFilters() {
    handleClose && handleClose();
    params &&
      router.push(`/${params.lang}/propiedades?` + createQueryString(filters));
  }

  return (
    <div className="FILTERS grid w-full auto-rows-auto grid-cols-1 gap-4 @container">
      <ToggleGroup
        className="bg-zinc-700/10"
        type="single"
        defaultValue={filters.operacion}
        value={filters.operacion}
        onValueChange={(value) => {
          if (value) {
            handleOperacion(value);
          }
        }}
        aria-label="Tipo de operación"
      >
        {operacionDD.map((item) => (
          <ToggleGroupItem key={item.value} value={item.value}>
            {item.name}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>

      <div className="grid w-full  items-center justify-stretch gap-1">
        <Label>{dict.filters.tipo_label}</Label>
        <Select
          name="tipo"
          value={filters.tipo}
          onValueChange={(value) =>
            setFilters((prevFilters) => ({
              ...prevFilters,
              tipo: value,
            }))
          }
        >
          <SelectTrigger className="hover:shadow-inset">
            <SelectValue placeholder={dict.filters.tipo_placeholder} />
          </SelectTrigger>
          <SelectContent
            position="popper"
            sideOffset={1}
            className="max-h-[var(--radix-select-content-available-height)] w-[var(--radix-select-trigger-width)]"
          >
            {preparedTipoDD.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid w-full  items-center justify-stretch gap-1">
        <Label>{dict.filters.localizacion_label}</Label>
        <Select
          name="localizacion"
          value={filters.localizacion}
          onValueChange={(value) =>
            setFilters((prevFilters) => ({
              ...prevFilters,
              localizacion: value,
            }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder={dict.filters.localizacion_placeholder} />
          </SelectTrigger>
          <SelectContent
            position="popper"
            sideOffset={1}
            className="max-h-[var(--radix-select-content-available-height)] w-[var(--radix-select-trigger-width)]"
          >
            {preparedLocalizacionDD &&
              preparedLocalizacionDD.map(
                (localizacion: ParentLocalizacion, i) => (
                  <Fragment key={i}>
                    <SelectItem
                      aria-label={localizacion.value}
                      key={localizacion.value}
                      value={localizacion.value}
                      className="py-1.5 pl-8 pr-2 text-sm font-semibold"
                    >
                      {localizacion.name}
                    </SelectItem>
                    {localizacion.children &&
                      localizacion.children.length > 0 &&
                      localizacion.children.map((child) => (
                        <SelectItem
                          aria-label={child.value}
                          key={child.value}
                          value={child.value}
                        >
                          - {child.name}
                        </SelectItem>
                      ))}
                  </Fragment>
                )
              )}
          </SelectContent>
        </Select>
      </div>

      <div className="grid w-full  items-center justify-stretch gap-1">
        <Label>{dict.filters.banos_label}</Label>
        <ToggleGroup
          className="bg-zinc-700/10"
          type="single"
          value={filters.banos}
          onValueChange={(value) =>
            setFilters((prevFilters) => ({
              ...prevFilters,
              banos: value,
            }))
          }
          aria-label="Baños"
        >
          {bathroomsArrayDD.map((i) => (
            <ToggleGroupItem key={i} value={i.toString()}>
              {i}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="grid w-full  items-center justify-stretch gap-1">
        <Label>{dict.filters.habitaciones_label}</Label>
        <ToggleGroup
          className="bg-zinc-700/10"
          type="single"
          value={filters.habitaciones}
          onValueChange={(value) =>
            setFilters((prevFilters) => ({
              ...prevFilters,
              habitaciones: value,
            }))
          }
          aria-label="Habitaciones"
        >
          {bedroomsArrayDD.map((i) => (
            <ToggleGroupItem key={i} value={i.toString()}>
              {i}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="flex gap-4 @[17.5rem]:flex @[17.5rem]:flex-col">
        <div className="grid w-full items-center justify-stretch gap-1">
          <Label>{dict.filters.precioMin_label}</Label>
          <Select
            name="precio"
            value={filters.precioMin}
            onValueChange={(value) => handlePrecioMin(value)}
          >
            <SelectTrigger className="hover:shadow-inset">
              <SelectValue placeholder="Seleccione un rango de precios..." />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={1}
              className="max-h-[var(--radix-select-content-available-height)] w-[var(--radix-select-trigger-width)]"
            >
              {filters.operacion === "operacion-en-alquiler"
                ? precioMinRentArrayDD.map((item) => (
                    <SelectItem key={item} value={item.toString()}>
                      {formatEUR(item)}
                    </SelectItem>
                  ))
                : precioMinSaleArrayDD.map((item) => (
                    <SelectItem key={item} value={item.toString()}>
                      {formatEUR(item)}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid w-full items-center justify-stretch gap-1">
          <Label>{dict.filters.precioMax_label}</Label>
          <Select
            name="precio"
            value={filters.precioMax}
            onValueChange={(value) => handlePrecioMax(value)}
          >
            <SelectTrigger className="hover:shadow-inset">
              <SelectValue placeholder="Seleccione un rango de precios..." />
            </SelectTrigger>
            <SelectContent
              position="popper"
              sideOffset={1}
              className="max-h-[var(--radix-select-content-available-height)] w-[var(--radix-select-trigger-width)]"
            >
              {filters.operacion === "operacion-en-alquiler"
                ? precioMaxRentArrayDD.map((item) => (
                    <SelectItem key={item} value={item.toString()}>
                      {formatEUR(item)}
                    </SelectItem>
                  ))
                : precioMaxSaleArrayDD.map((item) => (
                    <SelectItem key={item} value={item.toString()}>
                      {formatEUR(item)}
                    </SelectItem>
                  ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <button
        onClick={() => handleFilters()}
        className="inline-flex h-10 w-full items-center justify-center gap-1 rounded-md bg-gradient-to-b  from-green-500 via-green-600 via-60% to-green-700 font-medium text-white shadow-button hover:translate-y-1 hover:shadow active:from-green-600 active:via-green-600 active:to-green-600 "
      >
        <MagnifyingGlassIcon weight="bold" className="h-5 w-5" />
        {dict.filters.search_button}
      </button>
    </div>
  );
}

export default Filters;
