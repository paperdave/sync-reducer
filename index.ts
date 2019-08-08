type Reducer<State, Args extends any[]> = (state: State, ...args: Args) => State;

/**
 * Creates a reducer with the same properties of the passed reducer, but syncs it's value to
 * a Storage like localStorage
 */
export default function syncReducer<State extends {}, Args extends any[]>(
  reducer: Reducer<State, Args>,
  storageKey: string,
  storage: Storage = localStorage,
): Reducer<State, Args> {
  let mostRecentState: State | undefined = undefined;

  window.addEventListener('beforeunload', () => {
    storage.setItem(storageKey, JSON.stringify(mostRecentState));
  });

  return (state: State, ...args: Args) => {
    // if there is no state...
    if (!state) {
      // ...try to get it from the Storage
      const item = storage.getItem(storageKey);
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
