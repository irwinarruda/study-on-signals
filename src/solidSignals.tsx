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

function safeAssign(ob: any, ...o: any[]) {
  for (let obj of o) {
    if (typeof obj !== "undefined")
      Object.defineProperties(ob, Object.getOwnPropertyDescriptors(obj));
  }
  return ob;
}

function objectKey(key: string): string {
  return `__${key}`;
}

function variableKey(key: string): string {
  return `$$${key}`;
}

function hydrateKey(): string {
  return `$$hydrate`;
}

class SSSMaybeNull {
  public child: any;
  constructor(child: any) {
    this.child = child;
  }
}

class SSSModel {
  private currentSignals: any[] = [];
  private currentComputed: any[] = [];
  private currentActions: any[] = [];
  constructor(initialSignals: any, initialComputed: any, initialActions: any) {
    this.currentSignals = initialSignals;
    this.currentActions = {
      ...initialActions,
      [hydrateKey()](data: any) {
        for (const key of Object.keys(initialSignals as any)) {
          (this as any)[key] = data[key];
        }
      },
    };
  }

  public actions(actionsList: any) {
    this.currentActions = { ...this.currentActions, ...actionsList };
    return this;
  }

  public computed(viewsList: any) {
    this.currentComputed = safeAssign(this.currentComputed, viewsList);
    return this;
  }

  public create(initialData: any) {
    const signalData = {} as any;
    for (const [name, instance] of Object.entries(this.currentSignals)) {
      if (instance instanceof SSSMaybeNull) {
        if (instance.child instanceof SSSModel) {
          if (initialData[name] === null || initialData[name] === undefined) {
            signalData[objectKey(name)] = createSignal(null);
          } else {
            signalData[objectKey(name)] = createSignal(
              instance.child.create(initialData[name])
            );
          }
          Object.defineProperty(signalData, name, {
            get() {
              return this[objectKey(name)][0]();
            },
            set(updatedData) {
              if (updatedData === null || updatedData === undefined) {
                this[objectKey(name)][1](null);
              } else {
                if (this[objectKey(name)][0]() === null) {
                  this[objectKey(name)][1](instance.child.create(updatedData));
                } else {
                  this[objectKey(name)][0]()[hydrateKey()](updatedData);
                }
              }
            },
          });
        }
      } else if (instance instanceof SSSModel) {
        signalData[objectKey(name)] = instance.create(initialData[name]);
        Object.defineProperty(signalData, name, {
          get() {
            return this[objectKey(name)];
          },
          set(updatedData) {
            this[objectKey(name)][hydrateKey()](updatedData);
          },
        });
      } else {
        signalData[objectKey(name)] = createSignal(initialData[name]);
        Object.defineProperty(signalData, name, {
          get() {
            return this[objectKey(name)][0]();
          },
          set(updatedData) {
            this[objectKey(name)][1](updatedData);
          },
        });
      }
    }
    for (const key of Object.keys(this.currentActions)) {
      signalData[key] = this.currentActions[key as any];
    }

    Object.defineProperties(
      signalData,
      Object.getOwnPropertyDescriptors(this.currentComputed as any)
    );

    return signalData;
  }
}

const types = {
  maybeNull: (child: any) => new SSSMaybeNull(child),
  model: (initialData: any) => new SSSModel(initialData, {}, {}),
  number: Number(),
};

const Counter = types.model({
  nums: types.maybeNull(
    types
      .model({
        num1: types.number,
        num2: types.number,
      })
      .computed({
        get sum() {
          return this.num1 + this.num2;
        },
        get multiply() {
          return this.num1 * this.num2;
        },
      })
      .actions({
        increment() {
          this.num1++;
          this.num2++;
        },
        decrement() {
          this.num1--;
          this.num2--;
        },
      })
  ),
});

const counterStore = Counter.create({
  nums: null,
});

console.log("counterStore", counterStore);

function SolidApp() {
  (window as any).counterStore = counterStore;
  function onIncrement() {
    counterStore.nums?.increment();
  }
  function onDecrement() {
    counterStore.nums?.decrement();
  }
  function onCreate() {
    counterStore.nums = { num1: 0, num2: 0 };
  }
  return renderBody(
    () => `
      <div>
        <h1>Count: ${counterStore.nums?.num1}</h1>
        <button id="decrement">Decrement</button>
        <button id="increment">Increment</button>
        <button id="create">Create</button>
      </div>`,
    [
      { ref: "#increment", onClick: onIncrement },
      { ref: "#decrement", onClick: onDecrement },
      { ref: "#create", onClick: onCreate },
    ]
  );
}
SolidApp();
