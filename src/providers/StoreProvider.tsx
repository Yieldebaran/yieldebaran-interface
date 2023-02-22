import debug from 'debug';
import { createContext, Dispatch, SetStateAction, useState } from 'react';
import { initialModalState } from 'src/providers/store/modal';
import { FCC } from 'src/Types/FCC';

const log = debug('providers:StoreProvider');

const initialStore = {
  modal: initialModalState,
};

type StoreType = typeof initialStore;
type StoreCtxType = [StoreType, Dispatch<SetStateAction<StoreType>>];
type SetStateParameter<StateType> = Parameters<Dispatch<SetStateAction<StateType>>>[0];

const StoreCtx = createContext<StoreCtxType>([initialStore, () => null]);

export const StoreProvider: FCC = (props) => {
  const value = useState(initialStore);
  return <StoreCtx.Provider value={value}>{props.children}</StoreCtx.Provider>;
};
