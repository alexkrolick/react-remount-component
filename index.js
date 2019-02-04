import React from "react";

/**
 * withRemount Higher Order Component
 * @param {React.Component} WrappedComponent component to wrap
 * @param {(props, prevProps) => boolean} shouldComponentRemount comparison function
 * @returns {React.Component} component with remount logic
 */
const withRemount = (WrappedComponent, shouldComponentRemount) => {
  if (typeof shouldComponentRemount !== "function")
    throw new Error(
      "second argument must be a function, got: " +
        typeof shouldComponentRemount
    );
  class WrapperComponent extends React.Component {
    static getDerivedStateFromProps(props, { prevProps, key }) {
      const forwardedProps = getForwardedProps(props);
      return {
        prevProps: forwardedProps,
        key: shouldComponentRemount(forwardedProps, prevProps)
          ? generateKey()
          : key,
      };
    }

    static displayName = `withRemount(${WrappedComponent.displayName ||
      WrappedComponent.name})`;

    state = {
      key: generateKey(),
      prevProps: {},
    };

    render() {
      return (
        <WrappedComponent
          {...getForwardedProps(this.props)}
          key={this.state.key}
        />
      );
    }
  }

  return React.forwardRef((props, ref) => {
    return <WrapperComponent {...props} forwardedRef={ref} />;
  });
};

/**
 * Generate a random key
 * @returns {string} new key
 */
function generateKey() {
  return `${Math.random()}`;
}

function getForwardedProps(props) {
  return Object.entries(props).reduce((result, [key, value]) => {
    const setKey = key === "forwardedRef" ? "ref" : key;
    result[setKey] = value;
    return result;
  }, {});
}

export default withRemount;
