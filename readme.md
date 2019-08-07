# sync-reducer
> Creates a reducer with the same properties of the passed reducer, but syncs it's value to
> a Storage like localStorage

## Install
```sh
npm install sync-reducer
```

## Usage
```js
import { syncReducer } from 'sync-reducer';

function reducer(state, action) {
  return state;
}

export default syncReducer(reducer, 'reducer-state');
```
