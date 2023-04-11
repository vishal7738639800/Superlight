import logger from '@superlight/logger';
import { ResultAsync } from 'neverthrow';
import { AppError, useSnackbarState } from 'state/snackbar.state';

export const useFailableAction = () => {
  const { setMessage } = useSnackbarState();

  const perform = <T>(result: ResultAsync<T, AppError>, errFn?: ErrorFn) => {
    return {
      onSuccess: (action: (value: T) => void) => {
        result.match(action, err => {
          errFn && errFn();
          logger.error({ err }, 'Error performing action');
          setMessage(err);
        });

        return { andThen: perform };
      },
      andThen: perform,
    };
  };

  return {
    perform,
  };
};

type ErrorFn = () => void;
