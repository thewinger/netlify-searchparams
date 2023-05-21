import Image from "next/image";
import Link from "next/link";
import LocaleSwitcher from "./locale-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { EnvelopeSimpleIcon, PhoneIcon } from "./icons";

import { Locale } from "@/i18n-config";
import logo from "/public/Logo_Inmogolf.png";
import { Dict } from "@/types";

type Props = {
  params: { lang: Locale };
  dict: Dict;
};

const Header = ({ params, dict }: Props) => {
  return (
    <header className="relative z-20 bg-white shadow-sm ">
      <div className="flex items-center justify-between  px-4 py-2 md:px-6">
        <Link href={`/${params.lang}`}>
          <h1 className="sr-only">Inmogolf Bonalba</h1>
          <Image
            src={logo}
            alt="Inmogolf Bonalba"
            width={156}
            height={48}
            priority
          />
        </Link>

        <div className="flex justify-between gap-4 text-green-600">
          <LocaleSwitcher dict={dict} />
          <a
            aria-label={dict.header.email}
            href="mailto:info@inmogolfbonalba.com"
          >
            <EnvelopeSimpleIcon size={32} />
          </a>

          <DropdownMenu>
            <DropdownMenuTrigger aria-label={dict.header.telefono}>
              <PhoneIcon size={32} />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-fit">
              <DropdownMenuItem className="h-10">
                <a
                  href="tel:965959663"
                  className="w-full text-center leading-10"
                >
                  965959663
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem className="h-10">
                <a
                  href="tel:655849409"
                  className=" w-full text-center leading-10"
                >
                  655849409
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
