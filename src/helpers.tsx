export const getShortenAddress = (address?: string | null, substring?: number): string => {
  if (!address) return '0x00...00';
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
