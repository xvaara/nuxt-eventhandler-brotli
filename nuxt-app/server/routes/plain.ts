import { promisify } from "node:util";
import { brotliCompress as brotliCompressCb, constants } from "node:zlib";
import { eventHandler } from "h3"

const brotliCompress = promisify(brotliCompressCb);

export default eventHandler(async (event) => {
  const html = `<html><body><h1>Hello from plain.ts!</h1></body></html>`;
  let payload = Buffer.from(html, "utf8");
  const accept = event.node.req.headers["accept-encoding"];
  if (typeof accept === "string" && /\bbr\b/i.test(accept)) {
    payload = await brotliCompress(payload, {
      params: {
        [constants.BROTLI_PARAM_QUALITY]: 4,
      },
    });
    event.node.res.setHeader("Content-Encoding", "br");
  }
  event.node.res.setHeader("Content-Type", "text/html; charset=utf-8");
  return payload;
});