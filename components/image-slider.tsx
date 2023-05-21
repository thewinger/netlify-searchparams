"use client";

import Shimmer from "@/lib/Shimmer";
import { urlForImage } from "@/lib/sanity.image";
import clsx from "clsx";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { Image as SanityImage } from "sanity";

type PropType = {
  slides: SanityImage[];
};

const ImageSlider = ({ slides }: PropType) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mainViewportRef, embla] = useEmblaCarousel({ skipSnaps: false });
  const [thumbViewportRef, emblaThumbs] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!embla || !emblaThumbs) return;
      embla.scrollTo(index);
    },
    [embla, emblaThumbs]
  );

  const onSelect = useCallback(() => {
    if (!embla || !emblaThumbs) return;
    setSelectedIndex(embla.selectedScrollSnap());
    emblaThumbs.scrollTo(embla.selectedScrollSnap());
  }, [embla, emblaThumbs, setSelectedIndex]);

  useEffect(() => {
    if (!embla) return;
    onSelect();
    embla.on("select", onSelect);
  }, [embla, onSelect]);

  const formattedSlides = slides.map((slide) => {
    return {
      sourceUrl: urlForImage(slide).url(),
      title: slide.asset?._ref,
    };
  });

  return (
    <div className={clsx("flex w-full gap-4 flex-col")}>
      <div
        className={clsx(
          "embla relative m-0 block w-full overflow-hidden rounded p-0 order-2"
        )}
      >
        <div className="embla__viewport w-full" ref={mainViewportRef}>
          <div className="embla__container xoverflow-x-hidden flex h-full gap-2">
            {formattedSlides.map((slide, index) => (
              <div className="embla__slide min-w-full" key={index}>
                <div className="embla__slide__inner relative aspect-[3/2] h-full overflow-hidden rounded">
                  <Image
                    className="embla__slide__img relative block rounded object-cover"
                    src={slide.sourceUrl}
                    alt={slide.title ? slide.title : ""}
                    fill
                    placeholder="blur"
                    blurDataURL={Shimmer}
                    priority
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className={clsx(
          "embla embla--thumb relative m-0 block overflow-hidden p-0",
          "w-full"
        )}
      >
        <div
          className={clsx("embla__viewport w-full", "h-full")}
          ref={thumbViewportRef}
        >
          <div
            className={clsx(
              "embla__container embla__container--thumb xh-full flex gap-1",
              "flex-col gap-1"
            )}
          >
            {formattedSlides.map((slide, index) => (
              <div
                key={index}
                className={clsx(
                  "embla__slide embla__slide--thumb aspect-[3/2] w-1/5 shrink-0 rounded transition-opacity",
                  index == selectedIndex &&
                    "is-selected border-2 border-green-500 opacity-100",
                  !(index == selectedIndex) && "opacity-75",
                  "w-full"
                )}
              >
                <button
                  onClick={() => onThumbClick(index)}
                  className="embla__slide__inner embla__slide__inner--thumb relative aspect-[3/2] w-full"
                  type="button"
                >
                  <Image
                    className="embla__slide__thumbnail  relative block rounded object-cover"
                    src={slide.sourceUrl}
                    alt={slide.title ? slide.title : ""}
                    fill
                    priority
                  />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageSlider;
