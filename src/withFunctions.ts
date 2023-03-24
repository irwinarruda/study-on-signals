let ctx = undefined as any;

type Accessor<T> = [() => T, (newValue: T) => void];

function useState<T extends any>(initialValue?: T) {
  let subscribers = new Set<any>();
  let value = initialValue;
  function getter() {
    if (ctx) {
      subscribers.add(ctx);
    }
    return value;
  }
  function setter(newValue: T) {
    value = newValue;
    subscribers.forEach((subscriber) => subscriber());
  }
  return [getter, setter] as Accessor<T>;
}

function useEffect(callback: () => void) {
  function execute() {
    ctx = execute;
    callback();
    ctx = undefined;
  }
  execute();
}

function mount(template: () => string, events?: any[]) {
  useEffect(() => {
    document.body.innerHTML = template();
    for (let event of events || []) {
      const { ref, ...restEvents } = event;
      for (let [eventName, callback] of Object.entries(restEvents)) {
        document
          .querySelector(ref)!
          .addEventListener(
            eventName.toLowerCase().replace("on", ""),
            callback
          );
      }
    }
  });
}

function Component() {
  const [count, setCount] = useState(0);
  const doubleCount = () => count() * 2;

  function onIncrement() {
    setCount(count() + 1);
  }

  function onDecrement() {
    setCount(count() - 1);
  }

  setInterval(() => {
    setCount(count() + 1);
  }, 1000);

  return mount(
    () => `
      <div>
        <h1>Count: ${doubleCount()}</h1>
        <button id="decrement">Decrement</button>
        <button id="increment">Increment</button>
      </div>
    `,
    [
      { ref: "#increment", onClick: onIncrement },
      { ref: "#decrement", onClick: onDecrement },
    ]
  );
}
Component();
