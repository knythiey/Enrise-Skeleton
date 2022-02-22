export const addComma = (num: any) =>
  num
    .toString()
    .split('')
    .reverse()
    .map((digit: any, index: number) =>
      index !== 0 && index % 3 === 0 ? `${digit},` : digit
    )
    .reverse()
    .join('');