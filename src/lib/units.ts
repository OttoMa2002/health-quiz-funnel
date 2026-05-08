export const CM_PER_INCH = 2.54;
export const KG_PER_LB = 0.45359237;

export function cmToInches(cm: number): number {
  return cm / CM_PER_INCH;
}

export function inchesToCm(inches: number): number {
  return inches * CM_PER_INCH;
}

export function kgToLb(kg: number): number {
  return kg / KG_PER_LB;
}

export function lbToKg(lb: number): number {
  return lb * KG_PER_LB;
}

/** Split total cm into ft + in, rounded to nearest inch. */
export function cmToFtIn(cm: number): { ft: number; in: number } {
  const totalInches = Math.round(cmToInches(cm));
  return {
    ft: Math.floor(totalInches / 12),
    in: totalInches % 12,
  };
}

/** Combine ft + in into cm, rounded to nearest cm. */
export function ftInToCm(ft: number, inches: number): number {
  return Math.round(inchesToCm(ft * 12 + inches));
}