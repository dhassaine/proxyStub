/*
export default function traceMethodCalls(obj) {
  let numberOfTimesCalled = 0;
  const handler = {
    get(target, key) {
      if (typeof target[key] !== 'function') {
        return target[key];
      }

      return (...args) => (
        numberOfTimesCalled++ ,
        target[key].apply(target, args)
      );
    }
  };

  return {
    proxy: new Proxy(obj, handler),
    callCount: () => numberOfTimesCalled
  };
}
*/

export default function traceMethodCalls({obj, stubMethod = false, throws=false}) {
  let numberOfTimesCalled = 0;
  let lastPropertyAccessed = void 0;

  const handler = {
    get(target, key) {
      if (typeof target[key] !== 'function') {
        return target[key];
      }

      return (...args) => {
        numberOfTimesCalled++;
        lastPropertyAccessed = key;
        if (!stubMethod) {
          return target[key].apply(target, args);
        } else {
          return throws ? Promise.reject() : Promise.resolve();
        }
      };
    }
  };

  return {
    proxy: new Proxy(obj, handler),
    callCount: () => numberOfTimesCalled,
    lastPropertyAccessed: () => lastPropertyAccessed
  };
}