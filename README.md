# React in Practice

### Table of contents:

Hooks

 1. Introducing
 2. A Brief of Hook
 3. Using the State Hook
 4. Using the Effect Hook
 5. Writing Custom Hooks
 6. Hooks APIs

---

## Hooks

### 1. Introducing

Hooks are a new feature that lets you use state and other React features without writing a class. They're released in React v16.7.0.

Hooks are functions that let you "hook into" React state and lifecycle features from function components. Hooks don't work inside classes they let you use React without classes.

### 2. A Brief of Hook

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

**Declaring multiple state variables**

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
    window.addEventListener('resize', this.handleResize);
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
---
