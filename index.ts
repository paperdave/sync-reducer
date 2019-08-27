type Reducer<State, Args extends any[]> = (state: State, ...args: Args) => State;

interface SyncReducerOptions<State> {
  /** Optionally use a different storage than localStorage */
  storage?: Storage;
  /** Will write undefined for the given keys. Cannot be set with `transformFunction` */
  ignore?: (keyof State)[];
  /** If set, this will be called to transform the state into something else
    * before it is set into the Storage. Cannot be set with `ignore` */
  transformFunction?: (state: State) => State;
};

/**
 * Creates a reducer with the same properties of the passed reducer, but syncs it's value to
 * a Storage like localStorage
 *
 * @param reducer The reducer that you want to sync to localStorage
 * @param storageKey The key on localStorage that is used for syncing
 * @param options Options for the syncing
 */
export default function syncReducer<State extends {}, Args extends any[]>(
  reducer: Reducer<State, Args>,
  storageKey: string,
  options?: SyncReducerOptions<State>,
): Reducer<State, Args> {
  const opt = Object.assign(
    {
      storage: localStorage,
      ignore: [],
      transformFunction: (x: State) => Object.assign(x, opt.ignore.reduce((prev, next) => ({ ...prev, [next]: undefined }), {})),
    },
    options
  );

  let mostRecentState: State | undefined = undefined;

  window.addEventListener('beforeunload', () => {
    opt.storage.setItem(
      storageKey,
      JSON.stringify(opt.transformFunction(mostRecentState))
    );
  });

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
    // set the state
    mostRecentState = newState;
    // return state
    return newState;
  };
}
