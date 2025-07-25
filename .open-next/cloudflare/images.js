var define_IMAGES_LOCAL_PATTERNS_default = [];
var define_IMAGES_REMOTE_PATTERNS_default = [{ protocol: "https", hostname: "^(?:^(?:media\\.retroachievements\\.org)$)$", pathname: "^(?:(?!(?:^|\\/)\\.{1,2}(?:\\/|$))(?:(?:(?!(?:^|\\/)\\.{1,2}(?:\\/|$)).)*?)\\/?)$" }];
async function fetchImage(fetcher, imageUrl, ctx) {
  if (!imageUrl || imageUrl.length > 3072 || imageUrl.startsWith("//")) {
    return getUrlErrorResponse();
  }
  if (imageUrl.startsWith("/")) {
    let pathname;
    let url2;
    try {
      url2 = new URL(imageUrl, "http://n");
      pathname = decodeURIComponent(url2.pathname);
    } catch {
      return getUrlErrorResponse();
    }
    if (/\/_next\/image($|\/)/.test(pathname)) {
      return getUrlErrorResponse();
    }
    if (define_IMAGES_LOCAL_PATTERNS_default.length > 0 && !define_IMAGES_LOCAL_PATTERNS_default.some((p) => matchLocalPattern(p, url2))) {
      return getUrlErrorResponse();
    }
    return fetcher?.fetch(`http://assets.local${imageUrl}`);
  }
  let url;
  try {
    url = new URL(imageUrl);
  } catch {
    return getUrlErrorResponse();
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return getUrlErrorResponse();
  }
  if (!define_IMAGES_REMOTE_PATTERNS_default.some((p) => matchRemotePattern(p, url))) {
    return getUrlErrorResponse();
  }
  const imgResponse = await fetch(imageUrl, { cf: { cacheEverything: true } });
  if (!imgResponse.body) {
    return imgResponse;
  }
  const buffer = new ArrayBuffer(32);
  try {
    let contentType;
    const [body1, body2] = imgResponse.body.tee();
    const reader = body2.getReader({ mode: "byob" });
    const { value } = await reader.read(new Uint8Array(buffer));
    ctx.waitUntil(reader.cancel());
    if (value) {
      contentType = detectContentType(value);
    }
    if (!contentType) {
      const header = imgResponse.headers.get("content-type") ?? "";
      if (header.startsWith("image/") && !header.includes(",")) {
        contentType = header;
      }
    }
    if (contentType && !(contentType === SVG && true)) {
      const headers = new Headers(imgResponse.headers);
      headers.set("content-type", contentType);
      headers.set("content-disposition", "attachment");
      headers.set("content-security-policy", "script-src 'none'; frame-src 'none'; sandbox;");
      return new Response(body1, { ...imgResponse, headers });
    }
    return new Response('"url" parameter is valid but image type is not allowed', {
      status: 400
    });
  } catch {
    return new Response('"url" parameter is valid but upstream response is invalid', {
      status: 400
    });
  }
}
function matchRemotePattern(pattern, url) {
  if (pattern.protocol !== void 0 && pattern.protocol.replace(/:$/, "") !== url.protocol.replace(/:$/, "")) {
    return false;
  }
  if (pattern.port !== void 0 && pattern.port !== url.port) {
    return false;
  }
  if (pattern.hostname === void 0 || !new RegExp(pattern.hostname).test(url.hostname)) {
    return false;
  }
  if (pattern.search !== void 0 && pattern.search !== url.search) {
    return false;
  }
  return new RegExp(pattern.pathname).test(url.pathname);
}
function matchLocalPattern(pattern, url) {
  if (pattern.search !== void 0 && pattern.search !== url.search) {
    return false;
  }
  return new RegExp(pattern.pathname).test(url.pathname);
}
function getUrlErrorResponse() {
  return new Response(`"url" parameter is not allowed`, { status: 400 });
}
const AVIF = "image/avif";
const WEBP = "image/webp";
const PNG = "image/png";
const JPEG = "image/jpeg";
const GIF = "image/gif";
const SVG = "image/svg+xml";
const ICO = "image/x-icon";
const ICNS = "image/x-icns";
const TIFF = "image/tiff";
const BMP = "image/bmp";
function detectContentType(buffer) {
  if ([255, 216, 255].every((b, i) => buffer[i] === b)) {
    return JPEG;
  }
  if ([137, 80, 78, 71, 13, 10, 26, 10].every((b, i) => buffer[i] === b)) {
    return PNG;
  }
  if ([71, 73, 70, 56].every((b, i) => buffer[i] === b)) {
    return GIF;
  }
  if ([82, 73, 70, 70, 0, 0, 0, 0, 87, 69, 66, 80].every((b, i) => !b || buffer[i] === b)) {
    return WEBP;
  }
  if ([60, 63, 120, 109, 108].every((b, i) => buffer[i] === b)) {
    return SVG;
  }
  if ([60, 115, 118, 103].every((b, i) => buffer[i] === b)) {
    return SVG;
  }
  if ([0, 0, 0, 0, 102, 116, 121, 112, 97, 118, 105, 102].every((b, i) => !b || buffer[i] === b)) {
    return AVIF;
  }
  if ([0, 0, 1, 0].every((b, i) => buffer[i] === b)) {
    return ICO;
  }
  if ([105, 99, 110, 115].every((b, i) => buffer[i] === b)) {
    return ICNS;
  }
  if ([73, 73, 42, 0].every((b, i) => buffer[i] === b)) {
    return TIFF;
  }
  if ([66, 77].every((b, i) => buffer[i] === b)) {
    return BMP;
  }
}
export {
  detectContentType,
  fetchImage,
  matchLocalPattern,
  matchRemotePattern
};
