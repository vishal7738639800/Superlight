import { CircleWallet } from '../circle/circle';
import { MpcKeyShare } from './key-share';

export interface User {
  id: string;
  devicePublicKey: string;
  keyShares: MpcKeyShare[];
  circleWallet?: CircleWallet;
}

export interface CreateUserRequest {
  devicePublicKey: string;
}

export interface CreateUserResponse {
  nonce: string;
  userId: string;
}

export interface VerifyUserRequest {
  userId: string;
  message: string;
  signature: string;
  devicePublicKey: string;
}

export interface UpdateUserWalletByPathRequest {
  path: string;
  address: string;
}
