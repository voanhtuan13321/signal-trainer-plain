import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { readFile } from "node:fs/promises";

/**
 * Tiny static server for local ES module development.
 *
 * GitHub Pages serves the production app over HTTPS, but local `file://` opens
 * cannot import ES modules consistently across browsers.
 */
const root = process.cwd();
const rootWithSeparator = `${root}${sep}`;
const port = Number(process.env.PORT || 8000);
const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml"
};

/**
 * Resolve a URL to a repository-local file path.
 *
 * @param {string} requestUrl Incoming HTTP request URL.
 * @returns {string | null} Absolute file path, or null for blocked traversal.
 */
function resolveRequestPath(requestUrl) {
  const url = new URL(requestUrl, `http://localhost:${port}`);
  const pathname = url.pathname === "/" ? "/index.html" : url.pathname;
  const filePath = resolve(join(root, normalize(pathname)));

  // Keep the dev server scoped to this repository even when URLs contain `..`.
  if (filePath !== root && !filePath.startsWith(rootWithSeparator)) {
    return null;
  }

  return filePath;
}

createServer(async (request, response) => {
  const filePath = resolveRequestPath(request.url || "/");

  if (!filePath) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  try {
    const body = await readFile(filePath);

    response.writeHead(200, {
      "Content-Type": contentTypes[extname(filePath)] || "application/octet-stream"
    });
    response.end(body);
  } catch {
    response.writeHead(404);
    response.end("Not found");
  }
}).listen(port, () => {
  console.log(`Signal Trainer dev server: http://localhost:${port}`);
});
