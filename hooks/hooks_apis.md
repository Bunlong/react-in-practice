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

**useEffect**

```javascript
useEffect(didUpdate);
```

- It accepts a function that contains stuff, possibly effectful code.
- Mutations, subscriptions, timers, logging, and other side effects are not allowed inside the main body of a function component (referred to as React's render phase). Doing so will lead to confusing bugs and inconsistencies in the UI.
- Instead, use `useEffect`. The function passed to `useEffect` will run after the render is committed to the screen.
- By default, effects run after every completed render, but you can choose to fire it only when certain values have changed.

Cleaning up an effect: 

Often, effects create resources that need to be cleaned up before the component leaves the screen, such as a subscription or timer ID. To do this, the function passed to `useEffect` may return a clean-up function. For example, to create a subscription:

```javascript
useEffect(() => {
  const subscription = props.source.subscribe();
  return () => {
    // Clean up the subscription
    subscription.unsubscribe();
  };
});
```

The clean-up function runs before the component is removed from the UI to prevent memory leaks.

Additionally, if a component renders multiple times (as they typically do), the previous effect is cleaned up before executing the next effect. In our example, this means a new subscription is created on every update. To avoid firing an effect on every update, refer to the next section.

Timing of effects:

Unlike `componentDidMount` and `componentDidUpdate`, the function passed to `useEffect` fires after layout and paint, during a deferred event. This makes it suitable for the many common side effects, like setting up subscriptions and event handlers, because most types of work shouldn't block the browser from updating the screen.

However, not all effects can be deferred. For example, a DOM mutation that is visible to the user must fire synchronously before the next paint so that the user does not perceive a visual inconsistency. (The distinction is conceptually similar to passive versus active event listeners.) For these types of effects, React provides two additional Hooks: useMutationEffect and useLayoutEffect. These Hooks have the same signature as useEffect, and only differ in when they are fired.

Although `useEffect` is deferred until after the browser has painted, it's guaranteed to fire before any new renders. React will always flush a previous render's effects before starting a new update.

Conditionally firing an effect:

The default behavior for effects is to fire the effect after every completed render. That way an effect is always recreated if one of its inputs changes.

However, this may be overkill in some cases, like the subscription example from the previous section. We don't need to create a new subscription on every update, only if the source props has changed.

To implement this, pass a second argument to useEffect that is the array of values that the effect depends on. Our updated example now looks like this:

```javascript
useEffect(
  () => {
    const subscription = props.source.subscribe();
    return () => {
      subscription.unsubscribe();
    };
  },
  [props.source],
);
```

Now the subscription will only be recreated when props.source changes.

Passing in an empty array [] of inputs tells React that your effect doesn't depend on any values from the component, so that effect would run only on mount and clean up on unmount; it won’t run on updates.

**useContext**

```javascript
const context = useContext(Context);
```

- Its accepts a context object (the value returned from `React.createContext`) and returns the current context value, as given by the nearest context provider for the given context.
- When the provider updates, this Hook will trigger a rerender with the latest context value.
