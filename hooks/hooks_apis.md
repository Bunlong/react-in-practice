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

> Note
> 
> The array of inputs is not passed as arguments to the effect function. Conceptually, though, that's what they represent: every value referenced inside the effect function should also appear in the inputs array. In the future, a sufficiently advanced compiler could create this array automatically.

**useContext**

```javascript
const context = useContext(Context);
```

- Its accepts a context object (the value returned from `React.createContext`) and returns the current context value, as given by the nearest context provider for the given context.
- When the provider updates, this Hook will trigger a rerender with the latest context value.

#### Additional Hooks

### useReducer

> `useReducer` is usually preferable to useState when you have complex state logic that involves multiple sub-values. It also lets you optimize performance for components that trigger deep updates because you can pass dispatch down instead of callbacks.

```javascript
const [state, dispatch] = useReducer(reducer, initialState);
```

Its accepts a reducer of type `(state, action) => newState`, and returns the current state paired with a dispatch method. (If you're familiar with Redux, you already know how this works.)

Counter example from the `useState` section, rewritten to use a reducer:

```javascript
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'reset':
      return initialState;
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      // A reducer must always return a valid state.
      // Alternatively you can throw an error if an invalid action is dispatched.
      return state;
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(reducer, {count: initialCount});
  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'reset'})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  );
}
```

Lazy initialization:

`useReducer` accepts an optional third argument, `initialAction`. If provided, the initial action is applied during the initial render. This is useful for computing an initial state that includes values passed via props:

```javascript
const initialState = {count: 0};

function reducer(state, action) {
  switch (action.type) {
    case 'reset':
      return {count: action.payload};
    case 'increment':
      return {count: state.count + 1};
    case 'decrement':
      return {count: state.count - 1};
    default:
      // A reducer must always return a valid state.
      // Alternatively you can throw an error if an invalid action is dispatched.
      return state;
  }
}

function Counter({initialCount}) {
  const [state, dispatch] = useReducer(
    reducer,
    initialState,
    {type: 'reset', payload: initialCount},
  );

  return (
    <>
      Count: {state.count}
      <button
        onClick={() => dispatch({type: 'reset', payload: initialCount})}>
        Reset
      </button>
      <button onClick={() => dispatch({type: 'increment'})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  );
}
```

### useCallback

Syntax:

```javascript
useCallback(fn, inputs) is equivalent to useMemo(() => fn, inputs).
```

For example:

```javascript
const memoizedCallback = useCallback(
  () => {
    doSomething(a, b);
  },
  [a, b],
);
```

- Returns a [memoized](https://en.wikipedia.org/wiki/Memoization "memoized") callback.
- Pass an inline callback and an array of inputs. `useCallback` will return a memoized version of the callback that only changes if one of the inputs has changed. This is useful when passing callbacks to optimized child components that rely on reference equality to prevent unnecessary renders (e.g. `shouldComponentUpdate`).

> Note
> 
> The array of inputs is not passed as arguments to the callback. Conceptually, though, that's what they represent: every value referenced inside the callback should also appear in the inputs array. In the future, a sufficiently advanced compiler could create this array automatically.

### useMemo

```javascript
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

- Returns a [memoized](https://en.wikipedia.org/wiki/Memoization "memoized") callback.
- Pass a "create" function and an array of inputs.
- `useMemo` will only recompute the memoized value when one of the inputs has changed.
- This optimization helps to avoid expensive calculations on every render.

If no array is provided, a new value will be computed whenever a new function instance is passed as the first argument. (With an inline function, on every render.)

> Note
>
> The array of inputs is not passed as arguments to the function. Conceptually, though, that's what they represent: every value referenced inside the function should also appear in the inputs array. In the future, a sufficiently advanced compiler could create this array automatically.

### useRef

```javascript
const refContainer = useRef(initialValue);
```

`useRef` returns a mutable ref object whose `.current` property is initialized to the passed argument (`initialValue`). The returned object will persist for the full lifetime of the component.

A common use case is to access a child imperatively:

```javascript
function TextInputWithFocusButton() {
  const inputEl = useRef(null);
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    inputEl.current.focus();
  };
  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>Focus the input</button>
    </>
  );
}
```

Note that `useRef()` is useful for more than the `ref` attribute.

### useImperativeMethods

```javascript
useImperativeMethods(ref, createInstance, [inputs])
```

`useImperativeMethods` customizes the instance value that is exposed to parent components when using `ref`. As always, imperative code using `refs` should be avoided in most cases. `useImperativeMethods` should be used with `forwardRef`:

```javascript
function FancyInput(props, ref) {
  const inputRef = useRef();
  useImperativeMethods(ref, () => ({
    focus: () => {
      inputRef.current.focus();
    }
  }));
  return <input ref={inputRef} ... />;
}
FancyInput = forwardRef(FancyInput);
```

In this example, a parent component that renders `<FancyInput ref={fancyInputRef} />` would be able to call `fancyInputRef.current.focus()`.

### useMutationEffect

The signature is identical to `useEffect`, but it fires synchronously during the same phase that React performs its DOM mutations, before sibling components have been updated. Use this to perform custom DOM mutations.

Prefer the standard useEffect when possible to avoid blocking visual updates.

> Note
> 
> Avoid reading from the DOM in `useMutationEffect`. If you do, you can cause performance problems by introducing [layout thrash](https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing "layout thrash"). When reading computed styles or layout information, `useLayoutEffect` is more appropriate.

### useLayoutEffect

The signature is identical to `useEffect`, but it fires synchronously after all DOM mutations. Use this to read layout from the DOM and synchronously re-render. Updates scheduled inside `useLayoutEffect` will be flushed synchronously, before the browser has a chance to paint.

Prefer the standard `useEffect` when possible to avoid blocking visual updates.

> Tip
>
> If you're migrating code from a class component, `useLayoutEffect` fires in the same phase as `componentDidMount` and `componentDidUpdate`, so if you're unsure of which effect Hook to use, it’s probably the least risky.
