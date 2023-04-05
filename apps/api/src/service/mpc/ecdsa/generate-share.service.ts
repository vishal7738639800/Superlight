import { Context } from '@crypto-mpc';
import logger from '@lib/logger';
import { step } from '@lib/utils/crypto';
import {
  databaseError,
  mpcInternalError,
  MPCWebsocketMessage,
  MPCWebsocketResult,
  WebsocketError,
  WebSocketOutput,
} from '@superlight/mpc-common';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { Observable, Subject } from 'rxjs';
import { saveKeyShare } from 'src/repository/key-share.repository';
import { User } from 'src/repository/user';
import { RawData } from 'ws';
import { createGenerateEcdsaKey } from '../mpc-context.service';

export const generateEcdsaKey = (user: User, messages: Observable<RawData>): MPCWebsocketResult => {
  const output = new Subject<ResultAsync<MPCWebsocketMessage, WebsocketError>>();

  createGenerateEcdsaKey().match(
    context => {
      messages.subscribe({
        next: message => onMessage(message, context, output, user),
        error: err => {
          logger.error({ err, user: user.id }, 'Error received from client on websocket');
          context.free();
        },
        complete: () => {
          logger.info({ user: user.id }, 'Connection on Websocket closed');
          context.free;
        },
      });
    },
    err => output.next(errAsync(err))
  );

  return output;
};

const onMessage = (message: RawData, context: Context, output: WebSocketOutput, user: User) => {
  const msg = JSON.parse(message.toString());

  const stepOutput = step(msg.message, context);

  if (stepOutput.type === 'inProgress') {
    output.next(okAsync({ type: 'inProgress', message: stepOutput.message }));
    return;
  }

  if (stepOutput.type === 'success') {
    const keyShare = context.getNewShare().toString('base64');

    output.next(saveGeneratedShare(user, keyShare));
    context.free();
    return;
  }

  if (stepOutput.type === 'error') {
    output.next(errAsync(mpcInternalError(stepOutput.error)));
    context.free();
    return;
  }

  throw new Error('Unexpected step output');
};

const saveGeneratedShare = (
  user: User,
  keyShare: string
): ResultAsync<MPCWebsocketMessage, WebsocketError> => {
  return ResultAsync.fromPromise(saveKeyShare(user, keyShare, 'ecdsa'), err =>
    databaseError(err, 'Error while saving newly generated ecdsa share')
  ).map(keyShare => ({ type: 'success', result: keyShare.id }));
};
