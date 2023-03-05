import { ZERO_ADDRESS } from 'src/constants/eth';

export const isAddressesEq = (address1: string, address2: string) =>
  address1.toLowerCase() === address2.toLowerCase();

export const isZeroAddress = (address: string) => isAddressesEq(address, ZERO_ADDRESS);
