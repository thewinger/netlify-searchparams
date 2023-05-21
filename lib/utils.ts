import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEUR(amount: number) {
  const currencyFormatter = new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return currencyFormatter.format(amount);
}

export function createNumArray(maxNum: number, step: number) {
  const arr: number[] = [];
  for (let i = 0; i <= maxNum; i += step) {
    arr.push(i);
  }
  return arr;
}

export function getRoundedZeros(value: number) {
  let roundto = "1";

  for (let i = 1; i < value.toString().length; i++) {
    roundto = roundto.concat("0");
  }

  let roundedto = parseInt(roundto);

  return Math.ceil(value / roundedto) * roundedto;
}
