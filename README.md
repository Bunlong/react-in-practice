# React in Practice

### Hooks

#### 1. Introducing

Hooks are a new feature that lets you use state and other React features without writing a class. They're released in React v16.7.0.

Hooks are functions that let you "hook into" React state and lifecycle features from function components. Hooks don't work inside classes they let you use React without classes.

#### 2. A brief of Hook

##### State Hook

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

***Declaring multiple state variables***

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
