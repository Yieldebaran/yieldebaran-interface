export type ModalSettings = { key: 'connectWallet' } | { key: 'selectChain' } | { key: 'account' };

type ModalState = null | ModalSettings;

export const initialModalState: ModalState = null;
