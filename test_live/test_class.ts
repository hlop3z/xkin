// @ts-nocheck
import type { Instance, Class } from "../lib/py_class";
import { object } from "../main";

// === Base Class Example ===

type BaseInstance = { baseName: string };

// Basic base class with a single property
const Base = object.class<BaseInstance>("Base", {
  __init__(self, { baseName }) {
    self.baseName = baseName;
  },
});

// === Inheritance Example: Animal and Dog ===

type AnimalInstance = {
  baseName: string;
  species: string;
  speak(): string;
};

// Animal extends Base and adds a species and speak method
const Animal = object.class<AnimalInstance>(
  "Animal",
  {
    __init__(self, { species, baseName }) {
      self.__super__("__init__", { baseName });
      self.species = species;
    },
    speak(self: any) {
      return `${self.species} sound`;
    },
  },
  Base
);

type DogInstance = {
  baseName: string;
  species: string;
  name: string;
  speak(): string;
};

// Dog extends Animal and overrides speak
const Dog = object.class<DogInstance>(
  "Dog",
  {
    __init__(self, { name }) {
      self.__super__("__init__", { species: "Canine", baseName: "Animal" });
      self.name = name;
    },
    speak(self: any) {
      return `${self.name} says Woof!`;
    },
  },
  Animal
);

const dog = new Dog({ name: "Buddy" });
console.log(`${dog}`); // Dog string representation
console.log(dog.species); // Canine

// === Counter with Properties, Static and Class Methods ===

type CounterInstance = {
  value: number;
  getValue(): string;
  increment(): void;
};

type CounterStatic = {
  resetAll(): void;
};

type CounterClass = {
  fromInitial(value: number): CounterInstance;
};

// Counter class with slots, properties, static and class methods
type self = Instance<CounterInstance>;
type cls = Class<CounterInstance>;
const Counter = object.class<CounterInstance, CounterStatic, CounterClass>("Counter", {
  __init__(self) {
    self._value = 0;
  },
  __str__(self) {
    return `Counter(value=${self.value})`;
  },
  // Static Properties
  __static__: {
    resetAll() {
      console.log("All counters reset!");
    },
  },
  // Class Methods
  __class__: {
    fromInitial(this: cls, initialValue) {
      const instance = new this();
      instance.value = initialValue;
      return instance;
    },
  },
  // Instance Fields
  increment(self: self) {
    self._value += 1;
  },
  getValue(self: self) {
    return self._value;
  },
  // Instance Properties
  __properties__: {
    value: {
      get: (self) => self._value,
      set: (self, val: number) => {
        if (typeof val !== "number") throw new TypeError("Must be a number");
        self._value = val;
      },
    },
  },
});

const c1 = new Counter();
c1.increment();
console.log(c1.value); // 1
c1.value = 42;
console.log(c1.getValue()); // 42

const c2 = Counter.fromInitial(100);
console.log(`${c2}`); // Counter(value=100)

Counter.resetAll();

// === Singleton Support ===

type SingletonInstance = { id: number };

// Singleton ensures only one instance is created
const Singleton = object.singleton<SingletonInstance>("Singleton", {
  // Initialize or increment an ID
  __init__(self: any, { id }: any) {
    self.id = id;
  },
});

const a = Singleton({ id: 1 });
const b = Singleton();

console.log(a === b); // true
console.log(a.id, b.id); // 1 1
console.log(`${a}`);
