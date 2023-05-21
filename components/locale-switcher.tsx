"use client";

import { i18n } from "@/i18n-config";
import { Dict } from "@/types";
import spainFlag from "@/public/es.svg";
import ukFlag from "@/public/uk.svg";
import Image from "next/image";
import Link from "next/link";
import {
  ReadonlyURLSearchParams,
  useParams,
  usePathname,
  useSearchParams,
} from "next/navigation";
import { useCallback } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface Filters {
  habitaciones?: string;
  banos?: string;
  operacion: string;
  localizacion?: string;
  tipo?: string;
  precioMin?: string;
  precioMax?: string;
}

type Props = {
  dict: Dict;
};

export default function LocaleSwitcher({ dict }: Props) {
  const pathName = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  const redirectedPathName = (locale: string) => {
    if (!pathName) return "/";
    const segments = pathName.split("/");
    segments[1] = locale;
    const newPathName = searchParams
      ? `${segments.join("/")}?${createQueryString(searchParams)}`
      : segments.join("/");
    return newPathName;
  };

  const createQueryString = useCallback(
    (searchParams: ReadonlyURLSearchParams) => {
      const params = new URLSearchParams();
      for (const [key, value] of searchParams.entries()) {
        if (value !== "") {
          params.set(key, value);
        }
      }

      return params.toString();
    },
    []
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label={dict.header.lang_switcher}
        className="uppercase"
      >
        {params!.lang == "es" ? (
          <Image src={spainFlag} width={24} height={24} alt="Idioma Español" />
        ) : (
          <Image src={ukFlag} width={24} height={24} alt="English language" />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {i18n.locales.map((locale) => {
          return (
            <DropdownMenuItem key={locale}>
              <Link
                href={redirectedPathName(locale)}
                className="flex w-full items-center gap-2"
              >
                {locale == "es" ? (
                  <>
                    <Image
                      src={spainFlag}
                      width={16}
                      height={16}
                      alt="Idioma Español"
                    />
                    <span>Español</span>
                  </>
                ) : (
                  <>
                    <Image
                      src={ukFlag}
                      width={16}
                      height={16}
                      alt="English language"
                    />
                    <span>English</span>
                  </>
                )}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
