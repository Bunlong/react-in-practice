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
