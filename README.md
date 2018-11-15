# React in Practice

### Table of contents:

Hooks
 
  1. [Introducing](#hooksIntroducing)
  2. [A Brief of Hook](#hooksBrief)
      1. [Using the State Hook](./hooks/using_the_state_hook.md "Using the State Hook")
      2. [Using the Effect Hook](./hooks/using_the_effect_hook.md "Using the Effect Hook")
      3. [Building Your Own Hooks](./hooks/building_your_own_hooks.md "Building Your Own Hooks")
      4. [Rules of Hooks](./hooks/rules_of_hooks.md "Rules of Hooks")
      5. [Hooks APIs](./hooks/hooks_apis.md "Hooks APIs")

Code-Splitting

 1. [import()](#codeSplittingImport)
 2. lazy
 3. Suspense
 4. Error boundaries
 5. Route-based code splitting
 6. Named Exports

contextType

---

## Hooks

### <a name="hooksIntroducing"></a>1. Introducing

Hooks are a new feature that lets you use state and other React features without writing a class. They're released in React v16.7.0.

Hooks are functions that let you "hook into" React state and lifecycle features from function components. Hooks don't work inside classes they let you use React without classes.

### <a name="hooksBrief"></a>2. A Brief of Hook

**State Hook**

Renders a counter example. When you click the button, it increments the value:

Using React Hook

```javascript
import React, { useState } from 'react';

function App() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default App;
```

- `useState` is a Hook, we call it inside a function component to add some local state to it.
- `useState` returns a pair: the current state value and a function that lets you update it, you can call this function from an event handler or somewhere else.
- `useState` has only one argument is the initial state, in the example above 0 is the initial state.

Using React Class

```javascript
import React from 'react';

class App extends React.Component {
  state = {
    count: 0,
  }

  setCount = () => {
    this.setState({
      count: this.state.count + 1,
    });
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setCount()}>
          Click me
        </button>
      </div>
    );
  }
}

export default App;
```

Declaring multiple state variables.

You can use State Hook more than once in a single component:

```javascript
function withManyStates() {
  // Declare multiple state variables!
  const [name, setName] = useState('Brian');
  const [age, setAge] = useState(77);
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
}
```

React also provides a few built-in Hooks like `useState`. You can also create custom Hooks to reuse stateful behavior between different components. We'll look at the built-in Hooks first.

> You can learn more about the State Hook on a dedicated page: [Using the State Hook](./hooks/using_the_state_hook.md "Using the State Hook").

**Effect Hook**

You likely performe data fetching, subscriptions, or manually changing the DOM from React components using React lifecycle ( componentDidMount, componentDidUpdate and componentWillUnmount ) in React classes. We call these operations "side effects".

The Effect Hook, `useEffect`, adds the ability to perform side effects from a function component. It serves the same purpose as React lifecycle ( componentDidMount, componentDidUpdate, and componentWillUnmount ) in React classes, but unified into a single API.

Example, this component sets the document title after React updates the DOM:

Using React Hook

```javascript
import React, { useState, useEffect } from 'react';

function App() {
  const [count, setCount] = useState(0);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    // Update the document title using the browser API
    document.title = `You clicked ${count} times`;
  });

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>
        Click me
      </button>
    </div>
  );
}

export default App;
```

- When you call `useEffect`, you're telling React to run your "effect" function after flushing changes to the DOM.
- Effects are declared inside the component so they have access to its props and state. By default, React runs the effects after every render including the first render.

Using React Class

```javascript
import React from 'react';

class App extends React.Component {
  state = {
    count: 0,
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
    window.addEventListener('resize', this.setCount);
  }

  setCount = () => {
    this.setState({
      count: this.state.count + 1,
    });
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setCount()}>
          Click me
        </button>
      </div>
    );
  }
}

export default App;
```

Example, React would clean up `resize` event when the component unmounts, as well as before re-running the effect due to a subsequent render.

Using React Hook

```javascript
import React, { useState, useEffect } from 'react';

function App() {
  const [width, setWidth] = useState(window.innerWidth);

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    // Clean up resize event
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return (
    <div>
      <p>Window width: {width}</p>
    </div>
  );
}

export default App;
```

Using React Class

```javascript
import React, { Component } from 'react';

class App extends Component {
  state = {
    width: window.innerWidth,
  }

  UNSAFE_componentWillMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize = () => {
    this.setState({
      width: window.innerWidth,
    });
  }

  render() {
    return (
      <div>
        <p>Window width: {this.state.width}</p>
      </div>
    );
  }
}

export default App;
```

Just like with `useState`, you can use multiple effect in a component:

Using React Hook

```javascript
import React, { useState, useEffect } from 'react';

function App() {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    document.title = `Window width: ${width}`;
  });

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    // Clean up resize event
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });

  return (
    <div>
      <p>Window width: {width}</p>
    </div>
  );
}

export default App;
```

Hooks let you organize side effects in a component by what pieces are related (such as adding and removing a event or subscription), rather than forcing a split based on lifecycle methods.

> You can learn more about the Effect Hook on a dedicated page: [Using the Effect Hook](./hooks/using_the_effect_hook.md "Using the Effect Hook").

**Building Your Own Hooks**

Well, sometimes we want to reuse some stateful logic between components. Traditionally, there were two popular solutions to this problem: `higher-order components` and `render props`. Custom Hooks let you do this, but without adding more components to your tree.

Earlier on this page, we introduced a App component that calls the `useState` and `useEffect` Hooks to get window width and display on browser title. Let's say we also want to reuse this App logic in another component.

First, we'll extract this logic into a custom Hook called `useWindowWidth` and `useDocumentTitle`:

```javascript
function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title;
  });
}

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    // Clearn up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  });
  return width;
}
```

Now we can use it from the component:

```javascript
import React, { useState, useEffect } from 'react';

function App() {
  const width = useWindowWidth();

  useDocumentTitle(`Window width: ${width}`);

  return (
    <div>
      <p>Window width: {width}</p>
    </div>
  );
}


export default App;
```

The state of these components is completely independent. Hooks are a way to reuse stateful logic, not state itself. In fact, each call to a Hook has a completely isolated state and so you can even use the same custom Hook twice in one component.

To build your own hooks you need to follow the `useSomething` naming convention. If a function's name starts with "use" and it calls other Hooks, we say it is a custom Hook.

You can write custom Hooks that cover a wide range of use cases like form handling, animation, declarative subscriptions, timers, and probably many more we haven't considered.

> You can learn more about the Building Your Own Hooks on a dedicated page: [Building Your Own Hooks](./hooks/building_your_own_hooks.md "Building Your Own Hooks").

**Rules of Hooks**

Hooks are JavaScript functions, but they impose two additional rules:

- Only call Hooks at the top level. Don't call Hooks inside loops, conditions, or nested functions.
- Only call Hooks from React function components. Don't call Hooks from regular JavaScript functions. (There is just one other valid place to call Hooks is your own custom Hooks.)

The better way you can use a [linter plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) to enforce these rules automatically.

> You can learn more about the Rules of Hooks on a dedicated page: [Rules of Hooks](./hooks/rules_of_hooks.md "Rules of Hooks").

---

## Code-Splitting

### <a name="#codeSplittingImport"></a>1. import()

The best way to introduce code-splitting into your app is through the dynamic `import()` syntax.

Before:

```javascript
import { add } from './math';

console.log(add(16, 26));
```

After:

```javascript
import("./math").then(math => {
  console.log(math.add(16, 26));
});
```
