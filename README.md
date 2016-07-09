## Synopsis

A simple utility function which can aid in testing by allowing you to trace and/or stub method calls on an object.

## A simple method call tracer:
```
const obj = {
  property: 10,
  multiply: (x, y) => x * y,
  square: (x) => x * x
};
tracer = traceMethodCalls({ obj });
tracer.proxy.multiply(1, 2);
tracer.proxy.square(2);
assert.equal(tracer.callCount(), 2);
```

## Stubbing an object

```
tracer.proxy.multiply(1, 2)
  .then(value => {
    assert.equal(value, undefined);
    assert.equal(tracer.callCount(), 1);
  });
```

## Motivation
When it comes to writing test code, sometimes you need to know if an object, e.g. a database or logger instance has been called by the function under test. Libraries such as Sinon are usefull for spying on single methods, e.g. `sinon.spy(object, "method")`; however, they fall short when it comes to spying on all methods of an object.

## Installation

```
npm install
npm test
```
```
import traceMethodCalls from './proxy-stub'
```

## Requirements
This utility relies on ES6 proxies. If you are writing NodeJS code, then you will need to use Node 6.0+.

## API Reference

Depending on the size of the project, if it is small and simple enough the reference docs can be added to the README. For medium size to larger projects it is important to at least provide a link to where the API reference docs live.

## Tests

```
npm test
```

## Contributors
Djamel Hassaine

## License

MIT license
