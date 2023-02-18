import { ethers, utils } from "ethers";
import {BigNumber} from "./bigNumber"

export const eX = (bigNumber: BigNumber, decimals: number): string => {
  if(bigNumber && decimals){
    return utils.formatUnits(bigNumber._value, decimals)
  }
  return '0'
}

export const toDecimalPlaces = (bigNumber: ethers.BigNumber, decimals: number, places: number) : string => {
  if(!decimals)
      decimals = 0
    if (bigNumber){
      return decimalPlaces(ethers.utils.formatUnits(bigNumber, decimals), places)
    }
    else{
      const num = BigNumber.from("0")
      return num.toNumber().toFixed(places)
    }
}

export const decimalPlaces = (number: string, places: number) : string => {
  const temp = number.split(".")
  if (temp.length === 2){
    const decimalsTemp = Array.from(temp[1])
    if (decimalsTemp.length >= places)
      return temp[0] + "." + temp[1].substring(0, places)
    else{
      let zeroPlaces=""
      for (let i = 0; i < places - decimalsTemp.length; i++){
        zeroPlaces += "0"
      }
      return temp[0] + "." + temp[1] + zeroPlaces
    }
  }
  else{
    let zeroPlaces=""
      for (let i = 0; i < places; i++)
        zeroPlaces += "0"
      return temp[0] + "." +  zeroPlaces
  }
}

export const getShortenAddress = (address: string, substring?: number) : string => {
  const firstCharacters = address.substring(0, substring ? substring + 2 : 4);
  const lastCharacters = address.substring(
    address.length - (substring ? substring : 2),
    address.length
  );
  return `${firstCharacters}...${lastCharacters}`;
};


export const toHex = (num: number) : string => {
  const val = Number(num);
  return "0x" + val.toString(16);
};

export const delay = (n: number) => {
  return new Promise(function(resolve){
      setTimeout(resolve,n*1000);
  });
}