export type ModalSettings = { key: 'connectWallet' } | { key: 'selectChain' };

type ModalState = null | ModalSettings;

export const initialModalState: ModalState = null;
