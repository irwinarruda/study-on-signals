let context = [] as any[];

function $createSignal<T extends any>(initialValue: T) {
  const subscribers = new Set<any>();
  let val = initialValue;
  return {
    get value() {
      const newSubscriber = context[context.length - 2];
      if (newSubscriber) {
        subscribers.add(newSubscriber);
      }
      return val;
    },
    set value(newValue: T) {
      val = newValue;
      for (let subscriber of subscribers.values()) {
        subscriber();
      }
    },
  };
}

function $createEffect(fn: () => void, id: number) {
  const obj = {
    [`execute${id}`]() {
      try {
        context.push(obj[`execute${id}`]);
        console.log("context before function", context);
        fn();
        context = context.filter((item) => item === obj[`execute${id}`]);
        console.log("context after filter", context);
      } catch (err) {
        console.log("err", err);
      }
    },
  };
  obj[`execute${id}`]();
}

function $createMemo<T extends any>(fn: () => T) {
  return {
    get value() {
      return fn();
    },
  };
}

function $render(template: string, events: any[]) {
  document.body.innerHTML = template;
  for (let event of events) {
    const { ref, ...rest } = event;
    for (let [name, callback] of Object.entries(rest)) {
      document
        .querySelector(ref)!
        .addEventListener(name.toLowerCase().replace("on", ""), callback);
    }
  }
}

function App() {
  const count = $createSignal(1);
  const doubledCount = $createMemo(() => count.value * 3);

  function onIncrement() {
    count.value++;
  }

  function onDecrement() {
    count.value--;
  }

  $createEffect(() => {
    count.value;
  }, 2);
  $createEffect(() => {
    count.value;
  }, 3);
  $createEffect(() => {
    count.value;
  }, 4);
  $createEffect(() => {
    count.value;
  }, 5);
  $createEffect(() => {
    count.value;
  }, 6);
  $createEffect(() => {
    count.value;
  }, 7);

  $createEffect(() => {
    $render(
      `
        <div>
            <h2>The count is: ${doubledCount.value}<h1>
            <button id="decrement">Decrement</button>
            <button id="increment">Increment</button>
        </div>
      `,
      [
        { ref: "#decrement", onClick: onDecrement },
        { ref: "#increment", onClick: onIncrement },
      ]
    );
  }, 11);
}
App();
