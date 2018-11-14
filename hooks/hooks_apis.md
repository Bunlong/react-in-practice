### 7. Hooks APIs

- Basic Hooks
  - useState
  - userEffect
  - useContext

- Additional Hooks
  - useReducer
  - useCallback
  - useMemo
  - useRef
  - useImperativeMethods
  - useMutationEffect
  - useLayoutEffect

#### Basic Hooks

**useState**

```javascript
const [state, setState] = useState(initialState);
```

- Returns a stateful value, and a function to update it.
- During the initial render, the returned state (`state`) is the same as the value passed as the first argument (`initialState`).
- The `setState` function is used to update the state. It accepts a new state value and enqueues a re-render of the component.

```javascript
setState(newState);
```

Functional updates:

If the new state is computed using the previous state, you can pass a function to setState. The function will receive the previous value, and return an updated value.

The example of a counter component that uses both forms of `setState`:

```javascript
function Counter({initialCount}) {
  const [count, setCount] = useState(initialCount);
  return (
    <>
      Count: {count}
      <button onClick={() => setCount(0)}>Reset</button>
      <button onClick={() => setCount(prevCount => prevCount + 1)}>+</button>
      <button onClick={() => setCount(prevCount => prevCount - 1)}>-</button>
    </>
  );
}
```

The "+" and "-" buttons use the functional form, because the updated value is based on the previous value. But the "Reset" button uses the normal form, because it always sets the count back to 0.

Note: `useState` does not automatically merge update objects. You can replicate this behavior by combining the function updater form with object spread syntax:

```javascript
setState(prevState => {
  // Object.assign would also work
  return {...prevState, ...updatedValues};
});
```

Lazy initialization:

The `initialState` argument is the state used during the initial render. In subsequent renders, it is disregarded. If the initial state is the result of an expensive computation, you may provide a function instead, which will be executed only on the initial render:

```javascript
const [state, setState] = useState(() => {
  const initialState = someExpensiveComputation(props);
  return initialState;
});
```

**useState**

```javascript
useEffect(didUpdate);
```
