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

**Rules of Hooks**

Hooks are JavaScript functions, but they impose two additional rules:

- Only call Hooks at the top level. Don't call Hooks inside loops, conditions, or nested functions.
- Only call Hooks from React function components. Don't call Hooks from regular JavaScript functions. (There is just one other valid place to call Hooks is your own custom Hooks.)

The better way you can use a [linter plugin](https://www.npmjs.com/package/eslint-plugin-react-hooks) to enforce these rules automatically.

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

### 3. Using the State Hook

#### What's a Hook?

What is a Hook? A Hook is a special function that lets you "hook into" React features. For example, `useState` is a Hook that lets you add React state to function components.

#### When would I use a Hook?

When would I use a Hook? If you write a function component and realize you need to add some state to it, previously you had to convert it to a class. Now you can use a Hook inside the existing function component.

#### Hooks and Function Components

Function components in React look like this:

```javascript
const Example = (props) => {
  // You can use Hooks here!
  return <div />;
}
```

or this:

```javascript
function Example(props) {
  // You can use Hooks here!
  return <div />;
}
```

Hooks don’t work inside classes. But you can use them instead of writing classes.

#### Declaring a State Variable

In a React class, we initialize the `count` state to `0` by setting `this.state` to `{ count: 0 }` in the constructor:

```javascript
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }
```

In a function component, we have no `this`, so we can't assign or read `this.state`. Instead, we call the `useState` Hook directly inside our component:

```javascript
import { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);
```

What does calling `useState` do? 

  - It declares a "state variable". 
  - `useState` is a new way to use the exact same capabilities that `this.state` provides in a class.
  - Normally, variables "disappear" when the function exits but state variables are preserved by React.

What do we pass to `useState` as an argument? 

  - The only argument to the `useState()` Hook is the initial state.
  - Unlike with classes, the state doesn't have to be an object. We can keep a number or a string if that's all we need.
  - In the example above, we just want a number for how many times the user clicked, so pass 0 as initial state for our variable.
  - If we wanted to store two different values in state, we would call `useState()` twice.

What does `useState` return?
  
  - It returns a pair of values: the current state and a function that updates it.
  - This is why we write `const [count, setCount] = useState()`. This is similar to `this.state.count` and `this.setState` in a class, except you get them in a pair.

Now that we know what the `useState` Hook does, our example should make more sense:

```javascript
import { useState } from 'react';

function Example() {
  // Declare a new state variable, which we'll call "count"
  const [count, setCount] = useState(0);
```

We declare a state variable called `count`, and set it to `0`. React will remember its current value between re-renders, and provide the most recent one to our function. If we want to update the current count, we can call `setCount`.

#### Reading State

When we want to display the current count in a class, we read `this.state.count`:

```javascript
<p>You clicked {this.state.count} times</p>
```
In a function, we can use count directly:

```javascript
<p>You clicked {count} times</p>
```

#### Updating State

In a class, we need to call this.setState() to update the count state:

```javascript
<button onClick={() => this.setState({ count: this.state.count + 1 })}>
  Click me
</button>
```

In a function, we already have setCount and count as variables so we don’t need this:

```javascript
<button onClick={() => setCount(count + 1)}>
  Click me
</button>
```

#### Overview

Let's now review what we learned line by line and check our understanding:

```javascript
 1:  import { useState } from 'react';
 2: 
 3:  function Example() {
 4:    const [count, setCount] = useState(0);
 5:
 6:    return (
 7:      <div>
 8:        <p>You clicked {count} times</p>
 9:        <button onClick={() => setCount(count + 1)}>
10:         Click me
11:        </button>
12:      </div>
13:    );
14:  }
```

- Line 1: We import the `useState` Hook from React (It lets us keep local state in a function component).
- Line 4: Inside the Example component:
  - we declare a new state variable by calling the `useState` Hook. It returns a pair of values, to which we give names. 
  - We're calling our variable `count` because it holds the number of button clicks.
  - We initialize it to zero by passing `0` as the only `useState` argument. The second returned item is itself a function. It lets us update the count so we'll name it setCount.
- Line 9: When the user clicks, we call `setCount` with a new value. React will then re-render the Example component, passing the new count value to it.

#### What Do Square Brackets Mean?

You might have noticed the square brackets when we declare a state variable:

```javascript
const [fruit, setFruit] = useState('orange');
```

This JavaScript syntax is called "[array destructuring](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment#Array_destructuring)
". It means that we're making two new variables `fruit` and `setFruit`, where `fruit` is set to the first value returned by `useState`, and `setFruit` is the second. It is equivalent to this code:

```javascript
var fruitStateVariable = useState('banana'); // Returns a pair
var fruit = fruitStateVariable[0]; // First item in a pair
var setFruit = fruitStateVariable[1]; // Second item in a pair
```

When we declare a state variable with `useState`, it returns a pair of an array with two items. The first item is the current value, and the second is a function that lets us update it. Using `[0]` and `[1]` to access them is a bit confusing because they have a specific meaning. This is why we use array destructuring instead.

#### Using Multiple State Variables

Declaring state variables as a pair of `[something, setSomething]` is also handy because it lets us give different names to different state variables if we want to use more than one:

```javascript
function ExampleWithManyStates() {
  // Declare multiple state variables
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('orange');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
```

In the above component, we have age, fruit, and todos as local variables, and we can update them individually:

```javascript
function handleOrangeClick() {
  // Similar to this.setState({ fruit: 'banana' })
  setFruit('banana');
}
```

### 4. Using the Effect Hook

The Effect Hook lets you perform side effects in function components:

```javascript
import { useState, useEffect } from 'react';

function Example() {
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
```

This example is based on the counter example from the previous page, but we added a new feature to it: we set the document title to a custom message including the number of clicks.

Data fetching, setting up a subscription, and manually changing the DOM in React components are all of side effects.

#### Using Effects Without Cleanup

Sometimes, we want to run some additional code after React has updated the DOM. Network requests, manual DOM mutations, and logging are common examples of effects that don't require a cleanup. We say that because we can run them and immediately forget about them. Let's compare how classes and Hooks let us express such side effects.

**Example Using Classes**

In React class components, the render method itself shouldn't cause side effects. It would be too early we typically want to perform our effects after React has updated the DOM.

This is why in React classes, we put side effects into `componentDidMount` and `componentDidUpdate`. Coming back to our example, here is a React counter class component that updates the document title right after React makes changes to the DOM:

```javascript
class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  componentDidMount() {
    document.title = `You clicked ${this.state.count} times`;
  }

  componentDidUpdate() {
    document.title = `You clicked ${this.state.count} times`;
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count} times</p>
        <button onClick={() => this.setState({ count: this.state.count + 1 })}>
          Click me
        </button>
      </div>
    );
  }
}
```

Note: We have to duplicate the code between these two lifecycle methods in class.

This is because in many cases we want to perform the same side effect regardless of whether the component just mounted, or if it has been updated. Conceptually, we want it to happen after every render. But React class components don't have a method like this. We could extract a separate method but we would still have to call it in two places.

**Example Using Hooks**

We've already seen this example at the top of this page, but let's take a closer look at it:

```javascript
import { useState, useEffect } from 'react';

function Example() {
  const [count, setCount] = useState(0);

  useEffect(() => {
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
```

What does useEffect do?

By using this Hook, you tell React that your component needs to do something after render. React will remember the function you passed (we'll refer to it as our "effect"), and call it later after performing the DOM updates. In this effect, we set the document title, but we could also perform data fetching or call some other imperative API.

Why is useEffect called inside a component?

Placing useEffect inside the component lets us access the count state variable (or any props) right from the effect. We don’t need a special API to read it — it's already in the function scope. Hooks embrace JavaScript closures and avoid introducing React-specific APIs where JavaScript already provides a solution.


Does useEffect run after every render?

By default, it runs both after the first render and after every update. (We will later talk about how to customize this.) Instead of thinking in terms of "mounting" and "updating", you might find it easier to think that effects happen "after render". React guarantees the DOM has been updated by the time it runs the effects.




---
