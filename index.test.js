import React from "react";
import { render, cleanup } from "react-testing-library";
import withRemount from "./index";

afterEach(cleanup);

test("sanity check: normal component does not remount on rerender", () => {
  let mountCount = 0;

  class RemountThis extends React.Component {
    componentDidMount() {
      mountCount++;
    }
    render() {
      return null;
    }
  }

  const { rerender } = render(<RemountThis />);
  expect(mountCount).toEqual(1);
  rerender(<RemountThis />);
  expect(mountCount).toEqual(1);
});

test("remounts component when comparison function returns true", () => {
  let mountCount = 0;

  class RemountThis extends React.Component {
    componentDidMount() {
      mountCount++;
    }
    render() {
      return null;
    }
  }
  const WithRemountComponent = withRemount(RemountThis, () => true);

  const { rerender } = render(<WithRemountComponent />);
  expect(mountCount).toEqual(1);
  rerender(<WithRemountComponent />);
  expect(mountCount).toEqual(2);
});

test("does not remount component when comparison function returns false", () => {
  let mountCount = 0;

  class RemountThis extends React.Component {
    componentDidMount() {
      mountCount++;
    }
    render() {
      return null;
    }
  }
  const WithRemountComponent = withRemount(RemountThis, () => false);

  const { rerender } = render(<WithRemountComponent />);
  expect(mountCount).toEqual(1);
  rerender(<WithRemountComponent />);
  expect(mountCount).toEqual(1);
});

test("passes next props and previous props to comparison function", () => {
  const shouldComponentRemount = jest.fn((nextProps, prevProps) => {
    if (prevProps.id !== nextProps.id) return true;
  });
  class RemountThis extends React.Component {
    render() {
      return null;
    }
  }
  const WithRemountComponent = withRemount(RemountThis, shouldComponentRemount);

  const { rerender } = render(<WithRemountComponent id={1} />);
  expect(shouldComponentRemount).toHaveBeenCalledWith({ id: 1, ref: null }, {});

  rerender(<WithRemountComponent id={2} />);
  expect(shouldComponentRemount).toHaveBeenCalledWith(
    { id: 2, ref: null },
    { id: 1, ref: null }
  );
});

test("forwards ref to wrapped component", () => {
  class Div extends React.Component {
    render() {
      return <div>Something</div>;
    }
  }
  const WithRemountComponent = withRemount(Div, () => true);

  let ref = React.createRef();
  expect(ref.current).toBeNull();
  render(<WithRemountComponent ref={ref} />);
  expect(ref.current).not.toBeNull();
});

test("HOC errors if not passed a function", () => {
  expect.assertions(1);
  const notAFunction = "true";
  class Div extends React.Component {
    render() {
      return <div>Something</div>;
    }
  }
  try {
    withRemount(Div, notAFunction);
  } catch (err) {
    expect(err).toBeDefined();
  }
});
