const fastify = require("fastify")({
  logger: { transport: { target: "@fastify/one-line-logger" } },
});
const path = require("node:path");
const fs = require("node:fs");
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname) + "/public",
  prefix: "/",
  decorateReply: true,
});
fastify.register(require("@fastify/rate-limit"), {
  max: 10,
  timeWindow: 60000,
  ban: 2,
});

//route for home page
fastify.get("/", (request, reply) => {
  reply.headers({"Content-Type": "text/HTML","Cache-Control": "max-age=0,public"});
  reply.sendFile("page/index.html");
});

//routes to handle html page
fastify.get("/:pages", (request, reply) => {
  const currentPage = request.params.pages;
  if (!fs.existsSync(`public/page/${currentPage}.html`)) {
    reply.headers({"Content-Type": "text/HTML","Cache-Control": "max-age=0,public"});
    reply.code(404);
    reply.sendFile("page/404.html");
    return;
  }
  reply.headers({"Content-Type": "text/HTML","Cache-Control": "max-age=0,public"});
  reply.sendFile(`page/${currentPage}.html`);
});

//routes to handle font, js, css and img assets
fastify.get("/assets/:type/:file", (request, reply) => {
  let file = request.params.file;
  let type = request.params.type;
  const validType = ["js", "img", "css", "font"];
  if (!validType.includes(type) &&
    !fs.existsSync(`public/assets/${type}/${file}`) &&
    !fs.existsSync(`public/assets/${type}/${file.replace(".js", ".min.js")}`) &&
    !fs.existsSync(`public/assets/${type}/${file.replace(".css", ".min.css")}`)) {
    reply.headers({"Content-Type": "text/HTML","Cache-Control": "max-age=0,public"});
    reply.code(404);
    reply.sendFile("page/404.html");
    return;
  }
  const contentType =
    type == "font" ? "application/x-font-ttf"
    : type == "js" ? "application/javascript"
    : type == "css" ? "text/css"
    : type == "img" ? (
      file.endsWith("ico") ? "image/x-icon"
    : file.endsWith("png") ? "image/png"
    : file.endsWith("svg") ? "image/sgv+xml"
    : file.endsWith("webp") ? "image/webp"
    : file.endsWith("jpg") ? "image/jpg"
    : "") : "";
  const cacheAge =
      type == "font" ? "0"//todo switch to 7890000
    : type == "img" ? "0"//todo switch to 7890000
    : type == "js" ? "0"//todo switch to 7890000
    : type == "css" ? "0"//todo switch to 7890000
    : "0";
  file = fs.existsSync(`public/assets/css/${file.replace(".css", ".min.css")}`) ? file.replace(".css", ".min.css")
    : fs.existsSync(`public/assets/js/${file.replace(".js", ".min.js")}`) ? file.replace(".js", ".min.js")
    : file;
  if (contentType == "") {
    reply.headers({"Content-Type": "text/HTML","Cache-Control": "max-age=0,public"});
    reply.code(404);
    reply.sendFile("page/404.html");
    return;
  }
  reply.headers({"Content-Type": contentType,"Cache-Control": `max-age=${cacheAge},public`});
  reply.sendFile(`assets/${type}/${file}`);
});

fastify.setNotFoundHandler((request, reply) => {
  reply.headers({"Content-Type": "text/HTML","Cache-Control": "max-age=0,public"});
  reply.sendFile("page/404.html");
});

fastify.listen({ port: 3000, host:'127.0.0.1' }, (err, address) => {
  if (err) throw err;
  console.log(`listening to ${address}`);
});
