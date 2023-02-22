import debug from 'debug';
import { createContext, Dispatch, SetStateAction, useCallback, useContext, useState } from 'react';
import { initialModalState, ModalSettings } from 'src/providers/store/modal';
import { FCC } from 'src/Types/FCC';

const log = debug('providers:StoreProvider');

const initialStore = {
  modal: initialModalState,
};

type StoreType = typeof initialStore;
type StoreCtxType = [StoreType, Dispatch<SetStateAction<StoreType>>];
type SetStateParameter<StateType> = Parameters<Dispatch<SetStateAction<StateType>>>[0];

const StoreCtx = createContext<StoreCtxType>([initialStore, () => null]);

export const useStore = () => useContext(StoreCtx);

export const StoreProvider: FCC = (props) => {
  const value = useState(initialStore);
  return <StoreCtx.Provider value={value}>{props.children}</StoreCtx.Provider>;
};

const makeUseState = <P extends any>(
  getter: (s: StoreType) => P,
  reducer: (s: StoreType, newVal: SetStateParameter<P>) => StoreType,
  key?: string,
) => {
  return () => {
    const [store, setState] = useStore();
    const part = getter(store);

    return [
      part,
      useCallback((newVal) => {
        setState((s) => {
          const actualPart = getter(s);
          const val = typeof newVal === 'function' ? (newVal as any)(actualPart) : newVal;
          log('setStore', key, '\ncurr', actualPart, '\nnew:', val);
          return reducer(s, val);
        });
      }, []),
    ] as [P, (newVal: SetStateParameter<P>) => void];
  };
};

const makeUseStateByKey = <K extends keyof StoreType>(key: K) =>
  makeUseState<StoreType[K]>(
    (s) => s[key],
    (s, val) => ({ ...s, [key]: val }),
    key,
  );

export const useModal = () => useStore()[0].modal;

export const useSetModal = () => {
  const [, setStore] = useStore();
  return useCallback(
    (newModal: ModalSettings | null) => setStore((s) => ({ ...s, modal: newModal })),
    [setStore],
  );
};
