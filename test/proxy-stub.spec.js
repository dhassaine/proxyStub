import {assert} from 'chai';
import traceMethodCalls from '../src/proxy-stub';

function makeBasicObj() {
  return {
    property: 10,
    multiply: (x, y) => x * y,
    square: (x) => x * x
  };
}

describe('traceMethodCalls', function () {
  context('no stubs -- allow call through to original object', function () {
    context('basic javascript object', function () {
      let tracer;

      beforeEach(function () {
        const obj = makeBasicObj();
        tracer = traceMethodCalls({ obj });
      });

      it('performs no-op pass through for non function properties and does not increase call count', function () {
        const property = tracer.proxy.property;
        const callcount = tracer.callCount();
        assert.equal(property, 10);
        assert.equal(callcount, 0);
      });

      it('increments call count on accessed function properties', function () {
        assert.equal(tracer.callCount(), 0);
        tracer.proxy.multiply(1, 2);
        tracer.proxy.square(2);
        assert.equal(tracer.callCount(), 2);
      });
    });

    context('class using "this"', function () {
      it('setups up context correctly', function () {
        const obj = new Rectangle(5, 10);
        const tracer = traceMethodCalls({ obj });
        const area = tracer.proxy.area();
        assert.equal(area, 50);
        assert.equal(tracer.callCount(), 1);
      });

      it('changes to context are reflected', function () {
        const obj = new Rectangle(5, 10);
        const tracer = traceMethodCalls({ obj });
        obj.width = 10;
        const area = tracer.proxy.area();
        assert.equal(area, 100);
        assert.equal(tracer.callCount(), 1);
      });
    });
  });

  context('stub methods i.e. fake them', function () {
    context('basic javascript object', function () {
      let tracer;

      beforeEach(function () {
        const obj = makeBasicObj();
        tracer = traceMethodCalls({ obj, stubMethod:true });
      });

      it('performs no-op pass through for non function properties and does not increase call count', function () {
        const property = tracer.proxy.property;
        const callcount = tracer.callCount();
        assert.equal(property, 10);
        assert.equal(callcount, 0);
      });

      it('increments call count on accessed function properties and returns void promise', function () {
        assert.equal(tracer.callCount(), 0);
        return tracer.proxy.multiply(1, 2)
        .then(value => {
          assert.equal(value, undefined);
          assert.equal(tracer.callCount(), 1);
        });        
      });
    });

  });
});

class Rectangle {
  constructor(width, height) {
    this.width = width;
    this.height = height;
  }

  setWidth(value) {
    this.width = value;
  }

  area() {
    return this.width * this.height;
  }
}