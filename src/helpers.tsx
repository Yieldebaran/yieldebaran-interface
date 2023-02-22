
export const getShortenAddress = (address: string, substring?: number): string => {
  const firstCharacters = address.substring(0, substring ? substring + 2 : 4);
  const lastCharacters = address.substring(
    address.length - (substring ? substring : 2),
    address.length,
  );
  return `${firstCharacters}...${lastCharacters}`;
};

export const toHex = (num: number): string => {
  const val = Number(num);
  return '0x' + val.toString(16);
};
