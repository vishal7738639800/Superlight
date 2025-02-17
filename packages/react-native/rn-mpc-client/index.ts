import { generateGenericSecret, startGenerateGenericSecret } from './src/handlers/create-secret';
import { deriveBip32, startDerive } from './src/handlers/derive';
import { deriveBip32WithSteps, startDeriveWithSteps } from './src/handlers/derive-hardened';
import { importGenericSecret, startImportGenericSecret } from './src/handlers/import-secret';
import { DeriveFrom, ShareResult } from './src/lib/mpc/mpc-types';
import { authWebsocket } from './src/lib/websocket/ws-client';
import { Signer } from './src/lib/websocket/ws-common';
import { authWebsocketWithSetup } from './src/lib/websocket/ws-setup-client';
export { getPublicKey, getXPubKey } from './src/lib/mpc/mpc-neverthrow-wrapper';
export type { Signer };

export const useGenericSecret = () => ({
  generateGenericSecret: ({ baseUrl, sign }: ActionConfig) =>
    authWebsocket({ baseUrl, socketEndpoint: 'generateGenericSecret' }, sign)<ShareResult>(
      startGenerateGenericSecret,
      generateGenericSecret
    ),
  importGenericSecret: ({ baseUrl, sign }: ActionConfig, hexSeed: string) =>
    authWebsocketWithSetup(
      { baseUrl, socketEndpoint: 'importGenericSecret' },
      sign,
      hexSeed
    )<ShareResult>(startImportGenericSecret, importGenericSecret),
});

export const useDerive = () => ({
  deriveMasterPair: ({ baseUrl, sign }: ActionConfig, deriveConfig: DeriveMaster) =>
    authWebsocketWithSetup<DeriveFrom, null>({ baseUrl, socketEndpoint: 'derive/stepping' }, sign, {
      ...deriveConfig,
      hardened: false,
      index: 'm',
    })<ShareResult>(startDeriveWithSteps, deriveBip32WithSteps),
  deriveBip32: ({ baseUrl, sign }: ActionConfig, deriveConfig: DeriveFrom) =>
    authWebsocketWithSetup<DeriveFrom, string>(
      { baseUrl, socketEndpoint: 'derive/no-steps' },
      sign,
      deriveConfig
    )<ShareResult>(startDerive, deriveBip32),
  deriveBip32Hardened: ({ baseUrl, sign }: ActionConfig, deriveConfig: DeriveFrom) =>
    authWebsocketWithSetup<DeriveFrom, null>(
      { baseUrl, socketEndpoint: 'derive/stepping' },
      sign,
      deriveConfig
    )<ShareResult>(startDeriveWithSteps, deriveBip32WithSteps),
});

type ActionConfig = {
  baseUrl: string;
  sign: Signer;
};

type DeriveMaster = {
  peerShareId: string;
  share: string;
};
