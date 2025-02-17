import { ResultAsync } from 'neverthrow';
import { Observable, Subject } from 'rxjs';
import { WebsocketError } from 'src/error';

export type MPCWebsocketMessage<T = string> =
  | {
      type: 'inProgress';
      message: string;
    }
  | { type: 'success'; result: T }
  | { type: 'start' }
  | MPCWebscocketInit;

export type MPCWebscocketInit<T = string> = {
  type: 'init';
  parameter: T;
};

export type MPCWebsocketResult<T = string> = Observable<
  ResultAsync<MPCWebsocketMessage<T>, WebsocketError>
>;

export type WebSocketOutput<T = string> = Subject<
  ResultAsync<MPCWebsocketMessage<T>, WebsocketError>
>;
