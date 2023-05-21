import Link from "next/link";

import { Locale } from "@/i18n-config";
import { CaretRightIcon, FacebookIcon, InstagramIcon } from "./icons";
import { Dict } from "@/types";

type Props = {
  params: { lang: Locale };
  dict: Dict;
};

export function Footer({ dict, params }: Props) {
  return (
    <footer className="bg-zinc-50 pt-28">
      <div className=" h-[400px] bg-footerBorder bg-cover bg-[80%] lg:bg-right"></div>
      <div className="grid grid-cols-1 gap-10 bg-green-700 px-4 py-8 text-green-50 lg:grid-cols-2 lg:gap-12 lg:px-12">
        <div className="columna flex flex-col gap-2">
          <h3 className="py-2 text-sm font-semibold uppercase  tracking-wide lg:px-0">
            {dict.footer.quienes_somos.quienes_somos_label}
          </h3>
          <div className="flex flex-col gap-2 ">
            <div
              dangerouslySetInnerHTML={{
                __html: dict.footer.quienes_somos.quienes_somos_text,
              }}
            />
            <Link
              href={`${params.lang}/aviso-legal`}
              className="mt-4 flex w-fit items-center gap-2 rounded-md bg-green-950/30 px-4 py-1 hover:bg-green-900 lg:justify-start"
            >
              <span className="nderline py-2 text-sm ">
                {dict.footer.quienes_somos.aviso_legal_label}
              </span>
              <CaretRightIcon size={16} weight="bold" />
            </Link>
          </div>
        </div>

        <div className="columna  flex flex-col gap-2 lg:col-start-2">
          <h3 className="py-2  text-sm font-semibold uppercase  tracking-wide lg:px-0">
            {dict.footer.contacto.contacto_label}
          </h3>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex basis-1/2 flex-col gap-4">
              <div className="flex w-full justify-start gap-3">
                <Link
                  className="text-green-50"
                  href="https://www.facebook.com/BonalbaInmogolf/"
                >
                  <FacebookIcon size={44} weight="regular" />
                </Link>
                <Link
                  className="text-green-50"
                  href="https://www.instagram.com/inmogolfbonalba/"
                >
                  <InstagramIcon size={44} weight="regular" />
                </Link>
              </div>
              <div
                dangerouslySetInnerHTML={{
                  __html: dict.footer.contacto.horario,
                }}
              />
              <p>
                <Link className="underline" href="tel:965959663">
                  965959663
                </Link>{" "}
                -{" "}
                <Link className="underline" href="tel:655849409">
                  655849409
                </Link>
              </p>
              <Link href="https://goo.gl/maps/ETpkKCv9wPuQs9CQ7">
                Calle Vespre, Centro Comercial Bonalba local 11, 03110, Mutxamel
                (Alicante), Spain
              </Link>
            </div>
            <div className="basis-1/2">
              <div className="h-full w-full overflow-hidden rounded-md ">
                <iframe
                  title="Google maps"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3124.9347420700537!2d-0.4396482870882033!3d38.44297627326901!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd623a620272964f%3A0xe3358cd49c71b93!2sInmobiliaria%20Inmogolf%20Bonalba!5e0!3m2!1sen!2ses!4v1682507335851!5m2!1sen!2ses"
                  style={{ border: 0, width: "100%", height: "100%" }}
                  /* allowFullScreen */
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Footer;
