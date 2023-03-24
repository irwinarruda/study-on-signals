function renderBody(template: () => string, events?: any[]) {
  createEffect(() => {
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

function SolidApp() {
  const [count, setCount] = createSignal(0);
  function onIncrement() {
    setCount(count() + 1);
  }
  function onDecrement() {
    setCount(count() - 1);
  }
  return renderBody(
    () => `
      <div>
        <h1>Count: ${count()}</h1>
        <button id="decrement">Decrement</button>
        <button id="increment">Increment</button>
      </div>`,
    [
      { ref: "#increment", onClick: onIncrement },
      { ref: "#decrement", onClick: onDecrement },
    ]
  );
}
SolidApp();
