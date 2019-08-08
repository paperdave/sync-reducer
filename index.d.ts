declare type Reducer<State, Args extends any[]> = (state: State, ...args: Args) => State;
/**
 * Creates a reducer with the same properties of the passed reducer, but syncs it's value to
 * a Storage like localStorage
 *
 * @param reducer The reducer that you want to sync to localStorage
 * @param storageKey The key on localStorage that is used for syncing
 * @param storage Optionally use a different storage than localStorage
 */
export default function syncReducer<State extends {}, Args extends any[]>(reducer: Reducer<State, Args>, storageKey: string, storage?: Storage): Reducer<State, Args>;
export {};
