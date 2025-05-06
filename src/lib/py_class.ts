// Define property helpers
/**
 * Defines the structure for property definitions within a PyClass.
 * It allows defining custom getter and setter functions for properties.
 *
 * @template TSelf The type of the instance to which the property belongs.
 * @template TKey The type of the property key (defaults to string).
 */
type PyPropertyDefinition<TSelf extends object, TKey extends keyof any = string> = {
  /**
   * Optional getter function for the property.
   * @param self The instance from which to retrieve the property value.
   * @returns The value of the property.
   */
  get?: (self: Instance<TSelf>) => any;
  /**
   * Optional setter function for the property.
   * @param self The instance on which to set the property value.
   * @param value The new value to set for the property.
   */
  set?: (self: Instance<TSelf>, value: any) => void;
};

/**
 * Defines a record of property definitions for a given instance type.
 * Each key in the record corresponds to a property name, and the value
 * is a `PyPropertyDefinition` object.
 *
 * @template TSelf The type of the instance containing these properties.
 */
type PyPropertiesDefinition<TSelf extends object> = Record<string, PyPropertyDefinition<TSelf>>;

/**
 * Defines a record of static methods for a class.
 * Each key in the record corresponds to the static method name,
 * and the value is the static method function.
 */
type PyStaticMethodsDefinition = Record<string, (...args: any[]) => any>;

/**
 * Defines the type for a class method.
 * Class methods have access to the class constructor itself via the `this` context.
 *
 * @template TClass The type of the class constructor.
 */
type PyClassMethod<TClass extends Function> = (this: TClass, ...args: any[]) => any;

/**
 * Defines a record of class methods for a class.
 * Each key in the record corresponds to the class method name,
 * and the value is a `PyClassMethod` function.
 *
 * @template TClass The type of the class constructor (defaults to any Function).
 */
type PyClassMethodsDefinition<TClass extends Function = any> = Record<
  string,
  PyClassMethod<TClass>
>;

/**
 * Defines an array of strings representing the allowed instance attributes
 * when using slots. Any attribute not in this array will be disallowed
 * after instance creation.
 */
type PySlotsDefinition = string[];

/**
 * Defines the type for the `__new__` method, which is responsible for
 * creating and returning a new instance of the class.
 *
 * @template TSelf The type of the instance being created.
 */
type PyNewMethod<TSelf extends object> = (cls: Class<TSelf>, ...args: any[]) => TSelf;

/**
 * Defines the type for the `__super__` method, which allows calling
 * methods of parent classes in the method resolution order (MRO).
 */
type PySuperMethod = (methodName: string, ...params: any[]) => any;

/**
 * Defines the type for the `__init__` method, the instance constructor
 * which is called after the instance is created.
 *
 * @template TSelf The type of the instance being initialized.
 */
type PyInitMethod<TSelf extends object> = (self: Instance<TSelf>, ...args: any[]) => void;
type PyMethod<TSelf extends object> = (self: Instance<TSelf>, ...args: any[]) => any;

/**
 * Defines the type for the `__str__` method, which should return a
 * string representation of the instance.
 *
 * @template TSelf The type of the instance.
 */
type PyStrMethod<TSelf extends object> = (self: TSelf) => string;

/**
 * Defines the type for the `__int__` method, which should return an
 * integer representation of the instance.
 *
 * @template TSelf The type of the instance.
 */
type PyIntMethod<TSelf extends object> = (self: TSelf) => number;

/**
 * Defines the structure for the class definition object.
 * This object contains all the special methods, properties,
 * static methods, class methods, and slots for a new class.
 *
 * @template TSelf The type of the instance of the class being defined.
 * @template TStatic The type of the static methods for the class (defaults to an empty record).
 * @template TClass The type of the class methods for the class (defaults to an empty record).
 */
type PyClassDefinition<
  TSelf extends object,
  TStatic extends PyStaticMethodsDefinition = {},
  TClass extends PyClassMethodsDefinition<any> = {},
> = {
  /**
   * The `__new__` method for custom instance creation.
   */
  __new__?: PyNewMethod<TSelf>;
  /**
   * The `__init__` method for instance initialization.
   */
  __init__?: PyInitMethod<TSelf>;
  /**
   * The `__str__` method for string representation.
   */
  __str__?: PyStrMethod<TSelf>;
  /**
   * The `__int__` method for integer representation.
   */
  __int__?: PyIntMethod<TSelf>;
  /**
   * The `__properties__` definition for instance properties.
   */
  __properties__?: PyPropertiesDefinition<TSelf>;
  /**
   * The `__static__` definition for static methods.
   */
  __static__?: TStatic;
  /**
   * The `__class__` definition for class methods.
   */
  __class__?: TClass;
  /**
   * The `__slots__` definition for restricting instance attributes.
   */
  __slots__?: PySlotsDefinition;
  /**
   * Index signature to allow other properties in the definition object.
   */
  [key: string]: any;
};
/**
 * Represents an instance of a dynamically created Python-like class.
 * It includes a `__class__` property indicating the class name
 * and a `__super__` method for calling parent class methods.
 *
 * @template T The base type of the instance.
 */
export type Instance<T extends object> = T & {
  /**
   * The name of the class of the instance.
   */
  __class__: string;
  /**
   * A function to call methods of the superclass.
   * @param methodName The name of the method to call in the superclass.
   * @param params Arguments to pass to the superclass method.
   * @returns The result of the superclass method call.
   * @throws Error if the method is not found in the superclass hierarchy.
   */
  __super__: PySuperMethod;
  [K: string]: typeof K extends `_${string}` ? any : any;
};

/**
 * Represents the constructor of a dynamically created Python-like class.
 * It extends the `Function` interface and includes static properties
 * related to the class definition, name, base classes, and method
 * resolution order (MRO).
 *
 * @template TInstance The type of the instances created by this class.
 */
export interface Class<TInstance extends object> extends Function {
  /**
   * Creates a new instance of the class.
   * @param args Arguments passed to the constructor (`__init__` method).
   * @returns A new instance of the class.
   */
  new (...args: any[]): Instance<TInstance>;
  /**
   * The definition object used to create the class.
   */
  __definition__?: Record<string, any>;
  /**
   * The name of the class.
   */
  __className__?: string;
  /**
   * An array of the base classes from which this class inherits.
   */
  __bases__?: Class<any>[];
  /**
   * The method resolution order (MRO) for this class.
   */
  __mro__?: Class<any>[];
}

export function newClass<
  TInstance extends object,
  TStatic extends PyStaticMethodsDefinition = {},
  TClass extends PyClassMethodsDefinition<Class<TInstance>> = {},
>(
  name: string = "PyObject",
  definition: PyClassDefinition<TInstance, TStatic, TClass>,
  ...bases: Class<any>[]
): Class<Instance<TInstance>> & TStatic & TClass {
  // extract special bits
  const classMethods = definition.__class__ ?? ({} as TClass);
  const staticMethods = definition.__static__ ?? ({} as TStatic);
  const propertyDefs =
    definition.__properties__ ?? ({} as PyPropertiesDefinition<Instance<TInstance>>);
  const useSlots = Array.isArray(definition.__slots__);
  const slots = definition.__slots__ as string[] | undefined;

  // everything else becomes an “instance member”
  const instanceMembers = Object.fromEntries(
    Object.entries(definition).filter(
      ([k]) => !k.startsWith("__") || ["__init__", "__str__", "__int__"].includes(k)
    )
  );

  // Python’s C3 linearization
  const linearize = (cls: Class<any>, parents: Class<any>[]) => {
    const merge = (...seqs: Class<any>[][]): Class<any>[] => {
      const result: Class<any>[] = [];
      while (seqs.some((s) => s.length)) {
        for (const seq of seqs) {
          const cand = seq[0];
          if (cand && seqs.every((s) => s.indexOf(cand) <= 0)) {
            result.push(cand);
            seqs.forEach((s) => s[0] === cand && s.shift());
            break;
          }
        }
      }
      return result;
    };
    const parentMros = parents.map((b) => b.__mro__ ?? [b]);
    return [cls, ...merge(...parentMros, parents.slice())];
  };

  // the actual constructor
  const ClassConstructor = function (
    this: Instance<TInstance>,
    ...args: any[]
  ): Instance<TInstance> {
    const cls = ClassConstructor as any as Class<Instance<TInstance>>;
    const mro = cls.__mro__!;
    const def = definition as any;

    // —— 1) __new__ ——
    let instance =
      typeof def.__new__ === "function"
        ? def.__new__(cls, ...args)
        : Object.create(ClassConstructor.prototype);

    if (!instance) {
      // fallback if __new__ returned undefined or null
      instance = Object.create(ClassConstructor.prototype);
    }
    if (typeof instance !== "object") {
      throw new TypeError("__new__ must return an object or undefined");
    }

    // —— 2) set up common bits on the raw instance ——
    instance.__class__ = name;
    instance.__super__ = function (methodName: string, ...params: any[]) {
      const ctx = (this as any)._superContext || cls;
      const idx = mro.indexOf(ctx);
      for (let j = idx + 1; j < mro.length; j++) {
        const base: any = mro[j];
        const method = base.__definition__?.[methodName];
        if (typeof method === "function") {
          (this as any)._superContext = base;
          const result = method(this, ...params);
          delete (this as any)._superContext;
          return result;
        }
      }
      throw new Error(`__super__(): method '${methodName}' not found`);
    };

    // —— 3) inherit from bases ——
    for (const B of bases) {
      for (const [k, v] of Object.entries(B.__definition__ ?? {})) {
        if (!(k in instance) && !(k in instanceMembers)) {
          (instance as any)[k] = typeof v === "function" ? (...a: any[]) => v(instance, ...a) : v;
        }
      }
    }

    // —— 4) own members ——
    for (const [k, v] of Object.entries(instanceMembers)) {
      (instance as any)[k] = typeof v === "function" ? (...a: any[]) => v(instance, ...a) : v;
    }

    // —— 5) properties ——
    for (const [k, { get, set }] of Object.entries(propertyDefs)) {
      Object.defineProperty(instance, k, {
        get: get ? () => get(instance) : undefined,
        set: set ? (val) => set(instance, val) : undefined,
        enumerable: true,
        configurable: true,
      });
    }

    // —— 6) slots ——
    if (useSlots && slots) {
      for (const key of Object.keys(instance)) {
        if (!slots.includes(key) && key !== "__class__" && key !== "__super__") {
          delete (instance as any)[key];
        }
      }
      Object.preventExtensions(instance);
    }

    // —— 7) __init__ ——
    if (typeof def.__init__ === "function") {
      def.__init__(instance, ...args);
    }

    // —— 8) proxy wrapper for __str__/__int__ ——
    return new Proxy(instance, {
      get(target, prop, recv) {
        if (prop === Symbol.toPrimitive) {
          return (hint: string) => {
            if (hint === "string" && typeof target.__str__ === "function") {
              return target.__str__(target);
            }
            if (hint === "number" && typeof target.__int__ === "function") {
              return target.__int__(target);
            }
            // default fallback:
            const entries = Object.entries(target)
              .filter(([k, v]) => typeof v !== "function" && !k.startsWith("_"))
              .map(([k, v]) => `${k}: ${JSON.stringify(v)}`)
              .join(", ");
            return `${target.__class__}({ ${entries} })`;
          };
        }
        return Reflect.get(target, prop, recv);
      },
    });
  } as any as Class<Instance<TInstance>> & TStatic & TClass;

  // ——— 9) wire up class-level members ———

  // 9a) assign any extra definition keys (e.g. your `_instance`) onto the constructor
  for (const [k, v] of Object.entries(definition)) {
    if (!k.startsWith("__")) {
      (ClassConstructor as any)[k] = v;
    }
  }

  // 9b) static and class methods
  for (const [k, fn] of Object.entries(classMethods)) {
    (ClassConstructor as any)[k] = fn.bind(ClassConstructor);
  }
  for (const [k, fn] of Object.entries(staticMethods)) {
    (ClassConstructor as any)[k] = fn;
  }

  // 9c) metadata
  (ClassConstructor as any).__definition__ = { ...instanceMembers };
  (ClassConstructor as any).__className__ = name;
  (ClassConstructor as any).__bases__ = bases;
  (ClassConstructor as any).__mro__ = linearize(ClassConstructor as any, bases);

  return ClassConstructor;
}

export function newSingleton<
  T extends object,
  TStatic extends PyStaticMethodsDefinition = {},
  TClass extends PyClassMethodsDefinition<Class<T>> = {},
>(
  name: string,
  definition: Omit<PyClassDefinition<T, TStatic, TClass>, "__new__">,
  ...bases: Class<any>[]
): (...args: any) => Instance<T> {
  // Inject a Python-like __new__ for singleton behavior
  const fullDef: PyClassDefinition<T, TStatic, TClass> = {
    ...definition,
  };

  // Create the class
  const cls = newClass<Instance<T>, TStatic, TClass>(name, fullDef as any, ...bases);

  // Getter that calls the constructor and returns the singleton
  function getInstance(...args: any): Instance<T> {
    if (!(cls as any)._instance) {
      (cls as any)._instance = new (cls as any)(...args);
    }
    return (cls as any)._instance;
  }

  return getInstance;
}

export default {
  /**
   * A factory function that creates a new Python-like class with the specified
   * name, definition, and base classes. It sets up inheritance, methods,
   * static methods, class methods, properties, and slots.
   *
   * @template TInstance The type of the instances that will be created by this class.
   * @template TStatic The type of the static methods to be added to the class constructor.
   * @template TClass The type of the class methods to be added to the class constructor's prototype.
   * @param name The name of the new class (defaults to "PyObject").
   * @param definition The `PyClassDefinition` object containing the class's members.
   * @param bases A rest parameter array of base classes to inherit from.
   * @returns The newly created class constructor with its associated static and class methods.
   */
  class: newClass,

  /**
   * Creates a Python-style singleton class along with a getter.
   *
   * @template T The shape of the instance's own fields.
   * @template TStatic Static methods definition.
   * @template TClass Class methods definition.
   *
   * @param name The name of the class.
   * @param definition The PyClassDefinition WITHOUT __new__; __new__ is auto-inserted.
   * @param bases Optional base classes.
   *
   * @returns An instance:
   *  - getInstance: Function that returns the single instance.
   */
  singleton: newSingleton,
};
