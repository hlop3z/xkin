// router.ts
export type RouteHandler = (ctx: RoutingContext) => void;
export type Middleware = (ctx: RoutingContext, next: () => Promise<void>) => any;

export interface Route {
  path: string;
  handler?: RouteHandler;
  middleware?: Middleware[];
  meta?: Record<string, any>;
}

export interface RoutingContext {
  fullURL: string;
  pathname: string;
  query: Record<string, string>;
  params: Record<string, string>;
  meta: Record<string, any>;
  isRedirect: boolean;
  redirect: (path: string, persist?: boolean) => void;
  setNext: (path?: string | null, persist?: boolean) => void;
  getNext: (clear?: boolean) => string | null;
}

function normalizePath(path: string, { prefix = false, suffix = false } = {}) {
  if (typeof path !== "string") throw new TypeError("Path must be a string");

  // Remove leading and trailing slashes
  let normalized = path.replace(/^\/+|\/+$/g, "").replace(/\/+/g, "/");

  // Add prefix or suffix if specified
  if (prefix) normalized = "/" + normalized;
  if (suffix) normalized += "/";

  return normalized;
}

function fixURL(value: string, prefix = true): string {
  return normalizePath(value, { prefix: prefix, suffix: false });
}

/**
 * Remove all properties with `null` or `undefined` values from the object
 * @param {object} obj - The object to clean
 * @returns {object} - The cleaned object
 */
export function cleanObject(obj: Record<string, any>) {
  const cleanedObject: any = {};

  for (const key in obj) {
    const value = obj[key];

    // Exclude null, undefined, "null", and "undefined" values
    if (
      value !== null &&
      value !== undefined &&
      String(value) !== "null" &&
      String(value) !== "undefined"
    ) {
      cleanedObject[key] = value;
    }
  }

  return cleanedObject;
}

/**
 * Creates search parameters from the provided object.
 * @param {any} params - The object containing search parameters.
 * @returns {string} - The search parameters as a string.
 */
export function createSearchParams(params: any): string {
  const query = cleanObject({ ...params });
  const keys: string[] = Object.keys(query || {});
  if (keys.length > 0) {
    const queryString = new URLSearchParams(query).toString();
    return "?" + queryString;
  }
  return "";
}

export function compileRoute(path: string): { keys: string[]; regex: RegExp } {
  const keys: string[] = [];
  const regexStr =
    "^" +
    path
      // Optional named param, with optional slash
      .replace(/\/:([a-zA-Z_]\w*)\?/g, (_, key) => {
        keys.push(key);
        return "(?:/([^/]+))?"; // group optional param and slash
      })
      // Named catch-all wildcard
      .replace(/\/:([a-zA-Z_]\w*)\*/g, (_, key) => {
        keys.push(key);
        return "(?:/(.*))?"; // entire segment optional
      })
      // Required named param
      .replace(/\/:([a-zA-Z_]\w*)/g, (_, key) => {
        keys.push(key);
        return "/([^/]+)";
      })
      // Anonymous wildcard
      .replace(/\/\*/g, "(?:/(.*))?"); // optional segment
  const regex = new RegExp(regexStr + "$");
  return { keys, regex };
}

export function parseURL(url: string) {
  const u = new URL(url, location.origin);
  return {
    pathname: u.pathname,
    searchParams: u.searchParams,
    hash: u.hash,
  };
}

export function matchRoute(path: string, routes: Route[]) {
  for (const route of routes) {
    const { keys, regex } = compileRoute(route.path);
    const match = path.match(regex);
    if (!match) continue;
    const params: Record<string, any> = {};
    keys.forEach((key, i) => {
      params[key] = match[i + 1] ?? null;
    });
    if (route.path.endsWith("*")) {
      const size = route.path.replace("/*", "").replace("*", "").split("/").length;
      params["_"] = path.split("/").slice(size).join("/") || null;
    }
    return { route, params };
  }
  return null;
}

export function getCurrentURL(full: boolean = false, history: boolean = true): string {
  if (!history) {
    const hash = location.hash.slice(1) || "/";
    return full ? hash + location.search : hash;
  }
  const url = location.pathname + location.search;
  return full ? url : location.pathname;
}

export function navigate(
  path: string,
  {
    replace = false,
    q = {},
  }: { replace?: boolean; q?: Record<string, string | number | boolean | null> } = {},
  {
    base = "",
    history = true,
    resolver = null,
  }: { base?: string; history?: boolean; resolver?: null | (() => void) }
): void {
  if (/^https?:\/\//.test(path)) throw new Error("navigate() only supports relative paths");
  const url = fixURL(path, false);
  const method = replace ? "replaceState" : "pushState";
  let search = "";
  if (q) {
    search = createSearchParams(q);
  }
  window.history[method](null, "", base + (!history ? "#/" : "") + url + search);
  if (resolver && typeof resolver === "function") {
    resolver();
  }
}

class Router {
  private routes: Route[];
  private history: boolean;
  private base: string;
  private globalMiddleware: Middleware[];
  private current: RoutingContext | null;
  private deferred: string | null;

  constructor({
    routes = [],
    history = true,
    base = "",
  }: {
    routes?: Route[];
    history?: boolean;
    base?: string;
  } = {}) {
    this.routes = routes.map((route) => {
      if (route.path !== "*") {
        route.path = fixURL(route.path);
      }
      if (route.path === "") route.path = "/";
      return route;
    });
    this.history = history;
    this.base = base;
    this.globalMiddleware = [];
    this.current = null;
    this.deferred = null;

    window.addEventListener(!this.history ? "hashchange" : "popstate", () => this.resolve());
    this.resolve();
  }

  use(middleware: Middleware): void {
    this.globalMiddleware.push(middleware);
  }

  private runMiddlewareChain(middleware: Middleware[], context: RoutingContext) {
    let i = 0;
    const next = (): Promise<void> => {
      if (i >= middleware.length) return Promise.resolve();
      const mw: any = middleware[i++];
      return Promise.resolve(mw(context, next));
    };
    return next();
  }

  go(
    path: string,
    { replace = false, q = {} }: { replace?: boolean; q?: Record<string, any> } = {}
  ) {
    navigate(
      path,
      { replace, q },
      { base: this.base, history: this.history, resolver: () => this.resolve() }
    );
  }

  private isSameRoute(prev: RoutingContext | null, next: RoutingContext): boolean {
    return (
      !!prev &&
      prev.pathname === next.pathname &&
      JSON.stringify(prev.query) === JSON.stringify(next.query) &&
      JSON.stringify(prev.params) === JSON.stringify(next.params)
    );
  }

  private getCurrentURL(full: boolean = false): string {
    return getCurrentURL(full, this.history);
  }

  private matchRoute(path: string) {
    return matchRoute(path, this.routes);
  }

  private handle404(context: RoutingContext) {
    const fallback = this.routes.find((r) => r.path === "*");
    fallback?.handler?.(context);
  }

  setNext(path: string | null = null, persist = false) {
    const target = path || this.getCurrentURL(true);
    this.deferred = target;
    if (persist) sessionStorage.setItem("router:deferred", target);
  }

  getNext(clear = true) {
    const target = this.deferred || sessionStorage.getItem("router:deferred");
    if (clear) {
      this.deferred = null;
      sessionStorage.removeItem("router:deferred");
    }
    return target;
  }

  resolve(path = this.getCurrentURL(true)) {
    const url = fixURL(path);
    const { pathname, searchParams } = parseURL(url);
    const match = this.matchRoute(pathname);

    const sharedAttrs: RoutingContext = {
      isRedirect: false,
      fullURL: url,
      pathname,
      query: Object.fromEntries(searchParams),
      params: {},
      meta: {},
      redirect: (p, persist: boolean = true) => [
        (context.isRedirect = true),
        sharedAttrs.setNext(null, persist),
        this.go(p, { replace: false }),
      ],
      setNext: (p = null, persist = false) => this.setNext(p, persist),
      getNext: (clear = true) => this.getNext(clear),
    };

    if (!match) {
      return this.handle404(sharedAttrs);
    }

    const context: RoutingContext = {
      ...sharedAttrs,
      params: match.params,
      meta: match.route.meta || {},
    };

    if (this.isSameRoute(this.current, context) || context.isRedirect) return;

    this.runMiddlewareChain([...this.globalMiddleware, ...(match.route.middleware || [])], context)
      .then(() => {
        if (!context.isRedirect) {
          this.current = context;
          match.route.handler?.(context);
        }
        context.isRedirect = false;
      })
      .catch((e) => {
        if (typeof e === "string") this.go(e);
      });
  }
}

export default (...args: ConstructorParameters<typeof Router>) => new Router(...args);
