## Synopsis

A simple utility function which can aid in testing by allowing you to trace and/or stub method calls on an object.

## Motivation
When it comes to writing test code, sometimes you need to know if an object, e.g. a database or logger instance has been called by the function under test. Libraries such as Sinon are usefull for spying on single methods, e.g. `sinon.spy(object, "method")`; however, they fall short when it comes to spying on all methods of an object.

## A simple method call tracer:
```
const obj = {
  property: 10,
  multiply: (x, y) => x * y,
  square: (x) => x * x
};
const tracer = traceMethodCalls({ obj });
tracer.proxy.multiply(1, 2);
tracer.proxy.square(2);
assert.equal(tracer.callCount(), 2);
```

The proxy maintains the original object's functionality and merely increments a counter before forwarding the method call.

## Stubbing an object
Unit testing oftens requires passing mocked and stubbed objects into the constructor. For example an object's constructor may require an object representing a database api and connection; however we would not want to pass a real database connection during testing for a simple unit test. The tracer can block calls and return a void promise instead. 
```
const tracer = traceMethodCalls({ obj, stubMethod:true });
tracer.proxy.multiply(1, 2)
  .then(value => {
    assert.equal(value, undefined);
    assert.equal(tracer.callCount(), 1);
  });
```
Alternatively you can make the tracer return a rejected promise by passing `throws: false` -- this can be useful for testing failed api calls, e.g. a database error.


## Installation
```
npm install --save-dev proxy_stub_tracer
```
```
import traceMethodCalls from 'proxy_stub_tracer'
```

## Requirements
This utility relies on ES6 proxies. If you are writing NodeJS code, then you will need to use Node 6.0+.

## Tests

```
npm test
```

## Contributors
Djamel Hassaine

## License

MIT license
