/**
 * Resolve a location hash into a route path and the matching body class.
 * Unknown paths map to `route-not-found` instead of leaking raw hash text.
 */
export function resolveRoute(hash, routes) {
  const path = (hash.replace(/^#/, "") || "/").split("?")[0];
  if (!Object.hasOwn(routes, path)) {
    return { path, known: false, className: "route-not-found" };
  }
  return { path, known: true, className: path === "/" ? "route-home" : `route-${path.slice(1)}` };
}

/** Remove every `route-*` class so none accumulate across navigations. */
export function clearRouteClasses(element) {
  [...element.classList]
    .filter((name) => name.startsWith("route-"))
    .forEach((name) => element.classList.remove(name));
}
