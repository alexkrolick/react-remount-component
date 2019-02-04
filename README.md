# react-remount-component

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [The Problem](#the-problem)
- [This Solution](#this-solution)
- [Usage](#usage)
  - [Class Component](#class-component)
  - [Function Component](#function-component)
- [React RFC](#react-rfc)
- [License](#license)
- [Contributing](#contributing)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## The Problem

You want a React component to reset state when certain props change. Without this library you can do this:

- Class components: implement `getDerivedStateFromProps` and `componentDidUpdate` to track and respond to props changes
- Function components: use a state hook with a cache of previous props to manually call the `set` function of related state hooks
- Either: rely on consumers to pass a `key`. This can't be enforced and removes control over internal state from the library.

## This Solution

`react-remount-component` is a higher-order component that takes a comparison function for new props and previous props. Returning `true` from the comparison remounts the component.

Currently, the HOC generates a random key for the wrapped component when a reset is requested. This is an implementation detail that may change in the future.

## Usage

### Class Component

_**See [usage.test.js](./usage.test.js)**_

```jsx
class UserCard extends React.Component {
  state = {
    expanded: false,
  };

  render() {
    const { user } = this.props;
    return (
      <div className="user-card">
        <Name name={user.name} />
        <button onClick={() => this.setState({ expanded: true })}>
          Details
        </button>
        {this.state.expanded && (
          <React.Fragment>
            <Date date={user.birthdate} />
            <Avatar user={user} />
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default withRemount(UserCard, (props, prevProps) => {
  const prevUserId = prevProps.user && prevProps.user.id;
  const nextUserId = props.user && props.user.id;

  if (nextUserId !== prevUserId) {
    return true; // remount!
  }

  return false; // don't remount otherwise
});
```

### Function Component

```jsx
function UserCard(props) {
  const { user } = props;
  const [isExpanded, setExpanded] = React.useState(false);
  return (
    <div className="user-card">
      <div>Name: {user.name}</div>
      <div>
        <button onClick={() => setExpanded({ expanded: true })}>
          See Details
        </button>
      </div>
      {isExpanded && (
        <React.Fragment>
          <div>Birthday: {user.birthDate}</div>
          <div>Favorite Color: {user.favoriteColor}</div>
        </React.Fragment>
      )}
    </div>
  );
}

export default withRemount(UserCard, (props, prevProps) => {
  const prevUserId = prevProps.user && prevProps.user.id;
  const nextUserId = props.user && props.user.id;

  if (nextUserId !== prevUserId) {
    return true; // remount!
  }

  return false; // don't remount otherwise
});
```

## React RFC

https://github.com/reactjs/rfcs/pull/62

## License

[MIT](./LICENSE)

## Contributing

[Code of Conduct](./CODE_OF_CONDUCT)
