const React = require('react');

const MockIcon = (props) => React.createElement('svg', { ...props });

module.exports = new Proxy(
  {},
  {
    get() {
      return MockIcon;
    },
  }
);
