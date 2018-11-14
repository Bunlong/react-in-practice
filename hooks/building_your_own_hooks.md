### 5. Building Your Own Hooks

Building your own Hooks lets you extract component logic into reusable functions.

When we were learning about using the Effect Hook, we saw this component from a chat application that displays a message indicating whether a friend is online or offline:

```javascript
import { useState, useEffect } from 'react';

function FriendStatus(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

Now let's say that our chat application also has a contact list, and we want to render names of online users with a green color.

```javascript
import { useState, useEffect } from 'react';

function FriendListItem(props) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

W'd like to share this logic between `FriendStatus` and `FriendListItem`.

#### Extracting a Custom Hook

When we want to share logic between two JavaScript functions, we would extract it to a third function. Both components and Hooks are functions, so this works for them too.

A custom Hook is a JavaScript function whose name starts with "`use`". 

For example, `useFriendStatus` below is our first custom Hook:

```javascript
import { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

There's nothing new inside of it, the logic is copied from the components above. Just like in a component, make sure to only call other Hooks unconditionally at the top level of your custom Hook.

We can decide what it takes as arguments, and what, if anything, it should return. In other words, it's just like a normal function. Its name should always start with `use` so that you can tell at a glance that the rules of Hooks apply to it.

The purpose of our `useFriendStatus` Hook is to subscribe us to a friend's status. This is why it takes `friendID` as an argument, and returns whether this friend is online:

```javascript
function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);
  
  // ...

  return isOnline;
}
```

Okay, now let's see how we can use our custom Hook.

#### Using a Custom Hook

In the beginning, our stated goal was to remove the duplicated logic from the `FriendStatus` and `FriendListItem` components. Both of them want to know whether a friend is online.

We've extracted this logic to a `useFriendStatus` hook, we can just use it:

```javascript
function FriendStatus(props) {
  const isOnline = useFriendStatus(props.friend.id);

  if (isOnline === null) {
    return 'Loading...';
  }
  return isOnline ? 'Online' : 'Offline';
}
```

```javascript
function FriendListItem(props) {
  const isOnline = useFriendStatus(props.friend.id);

  return (
    <li style={{ color: isOnline ? 'green' : 'black' }}>
      {props.friend.name}
    </li>
  );
}
```

Note:

Do I have to name my custom Hooks starting with "`use`"?

Without `use`, we wouldn't be able to automatically check for violations of rules of Hooks because we couldn't tell if a certain function contains calls to Hooks inside of it.

Do two components using the same Hook share state?

No, custom Hooks are a mechanism to reuse stateful logic (such as setting up a subscription and remembering the current value), but every time you use a custom Hook, all state and effects inside of it are fully isolated.

How does a custom Hook get isolated state?

Each call to a Hook gets isolated state. Because we call `useFriendStatus` directly, from React's point of view our component just calls `useState` and `useEffect`. And as we learned earlier, we can call `useState` and `useEffect` many times in one component, and they will be completely independent.

#### Pass Information Between Hooks

Since Hooks are functions, so we can pass information between them.

We'll use another component from our hypothetical chat example. This is a chat message recipient picker that displays whether the currently selected friend is online:

```javascript
const friendList = [
  { id: 1, name: 'Brian' },
  { id: 2, name: 'Ryan' },
  { id: 3, name: 'Rosa' },
];

function ChatRecipientPicker() {
  const [recipientID, setRecipientID] = useState(1);
  const isRecipientOnline = useFriendStatus(recipientID);

  return (
    <>
      <Circle color={isRecipientOnline ? 'green' : 'red'} />
      <select
        value={recipientID}
        onChange={e => setRecipientID(Number(e.target.value))}
      >
        {friendList.map(friend => (
          <option key={friend.id} value={friend.id}>
            {friend.name}
          </option>
        ))}
      </select>
    </>
  );
}
```

We keep the currently chosen friend ID in the `recipientID` state variable, and update it if the user chooses a different friend in the `<select>` picker.

Because the `useState` Hook call gives us the latest value of the `recipientID` state variable, we can pass it to our custom `useFriendStatus` Hook as an argument:

```javascript
const [recipientID, setRecipientID] = useState(1);
const isRecipientOnline = useFriendStatus(recipientID);
```

This lets us know whether the currently selected friend is online. If we pick a different friend and update the `recipientID` state variable, our `useFriendStatus` Hook will unsubscribe from the previously selected friend, and subscribe to the status of the newly selected one.

#### useYourImagination()

Custom Hooks offer the flexibility of sharing logic that wasn't possible in React components before.

You can write custom Hooks that cover a wide range of use cases like form handling, animation, declarative subscriptions, timers, and probably many more. What's more, you can build Hooks that are just as easy to use as React's built-in features.

Try to resist adding abstraction too early. Now that function components can do more, it's likely that the average function component in your codebase will become longer. This is normal — don’t feel like you have to immediately split it into Hooks. But we also encourage you to start spotting cases where a custom Hook could hide complex logic behind a simple interface, or help untangle a messy component.

A custom Hook could hide complex logic behind a simple interface, or help untangle a messy component.

For example, maybe you have a complex component that contains a lot of local state that is managed in an ad-hoc way. `useState` doesn't make centralizing the update logic any easier so might you prefer to write it as a Redux reducer:

```javascript
function todosReducer(state, action) {
  switch (action.type) {
    case 'add':
      return [...state, {
        text: action.text,
        completed: false
      }];
    // ... other actions ...
    default:
      return state;
  }
}
```

Reducers are very convenient to test in isolation, and scale to express complex update logic. 

So what if we could write a `useReducer` Hook that lets us manage the local state of our component with a reducer? A simplified version of it might look like this:

```javascript
function useReducer(reducer, initialState) {
  const [state, setState] = useState(initialState);

  function dispatch(action) {
    const nextState = reducer(state, action);
    setState(nextState);
  }

  return [state, dispatch];
}
```

Now we could use it in our component, and let the reducer drive its state management:

```javascript
function Todos() {
  const [todos, dispatch] = useReducer(todosReducer, []);

  function handleAddClick(text) {
    dispatch({ type: 'add', text });
  }

  // ...
}
```

The need to manage local state with a reducer in a complex component is common enough that we've built the useReducer Hook right into React. 
