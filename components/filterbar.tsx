"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Filters from "./filters";
import { FadersIcon } from "./icons";
import { Dict, FiltersDD } from "@/types";

type FilterBarProps = {
  filtersDD: FiltersDD;
  dict: Dict;
};

const FilterBar = ({ dict, filtersDD }: FilterBarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <div className="absolute inset-x-0 z-10 block lg:hidden ">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button
            className={` relative flex h-10 w-full items-center justify-center gap-2 bg-white px-3 py-2 text-sm text-primary shadow-sm shadow-black/5 outline-none ring-1 ring-zinc-200  transition hover:ring-zinc-300 `}
          >
            <FadersIcon weight="bold" size={16} />
            <span>{dict.filters.filtros_title}</span>
          </button>
        </DialogTrigger>

        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dict.filters.filtros_title}</DialogTitle>
          </DialogHeader>
          <Filters
            dict={dict}
            filtersDD={filtersDD}
            handleClose={handleClose}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FilterBar;
