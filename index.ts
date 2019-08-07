import { throttle } from '@reverse/debounce/throttle';

type Reducer<State, Args extends any[]> = (state: State, ...args: Args) => State;

export interface SyncReducerOptions {
  /** The storage to use, defaults to window.localStorage */
  storage?: Storage;
  /** Timeout for throttled saves */
  timeout?: number;
  /** Override the debounce HOF */
  throttleFunction?: typeof throttle;
}
interface ResolvedOptions {
  storage: Storage;
  timeout: number;
  throttleFunction: typeof throttle;
}

/**
 * Creates a reducer with the same properties of the passed reducer, but syncs it's value to
 * a Storage like localStorage
 */
export default function syncReducer<State extends {}, Args extends any[]>(
  reducer: Reducer<State, Args>,
  storageKey: string,
  options?: SyncReducerOptions,
): Reducer<State, Args> {
  const opt = Object.assign({}, options, {
    throttleFunction: throttle,
    storage: localStorage,
    timeout: 2000,
  } as ResolvedOptions);

  function save(state: State) {
    opt.storage.setItem(storageKey, JSON.stringify(state));
  }

  // Create a throttled save function, only if needed
  let throttledSave = opt.timeout ? opt.throttleFunction(save, opt.timeout) : save;

  return (state: State, ...args: Args) => {
    // if there is no state...
    if (!state) {
      // ...try to get it from the Storage
      const item = opt.storage.getItem(storageKey);
      if(item) {
        // Try to parse the JSON string.
        try {
          state = JSON.parse(item) as State;
        } catch (error) {
          // fall back to undefined
        }
      }
    }

    // run the reducer
    const newState: State = reducer(state, ...args);
    // run throttled save function
    throttledSave(state);
    // return state
    return newState;
  };
}
