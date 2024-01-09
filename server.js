const fastify = require('fastify')({logger: {transport: {target: "@fastify/one-line-logger"}}});
const path = require('node:path');
const fs = require('node:fs');
fastify.register(require('@fastify/static'),{ 
    root: path.join(__dirname)+"/public",
    prefix: '/',
    decorateReply: true
})
//route for home page
fastify.get('/', (request, reply) => {
    reply.headers({'Content-Type':'text/HTML','Cache-Control':'max-age=0,public'});
    reply.sendFile("index.html");
})
fastify.get('/:page', (request, reply) => {
    const currentPage = request.params.page;
    console.log(currentPage)
    const validePage = ["horaire","itineraire","carrieres","contact","info-traffic","itineraire","plan","visite",""];
    if(!currentPage){
        reply.headers({'Content-Type':'text/HTML','Cache-Control':'max-age=0,public'});
        reply.code(404);
        reply.sendFile("page/404.html");
        return;
    }
    reply.headers({'Content-Type':'text/HTML','Cache-Control':'max-age=0,public'});
    reply.sendFile(`${validePage.includes(currentPage)?'page/'+currentPage+'.html':'index.html'}`);
})
//routes to handle font, js, css and img assets
fastify.get('/assets/:type/:file', (request, reply) => {
    let file = request.params.file;
    let type = request.params.type;
    const validType = ["js","img","css","font"];
    if(!validType.includes(type)&&
    !fs.existsSync(`public/assets/${type}/${file}`)&&
    !fs.existsSync(`public/assets/${type}/${file.replace(".js",".min.js")}`)&&
    !fs.existsSync(`public/assets/${type}/${file.replace(".css",".min.css")}`)){
        reply.headers({'Content-Type':'text/HTML','Cache-Control':'max-age=0,public'});
        reply.code(404);
        reply.sendFile("page/404.html");
        return;
    }
    const contentType = type=="font"?"application/x-font-ttf":
    type=="js"?"application/javascript":
    type=="css"?"text/css":
    type=="img"
    ?file.endsWith("ico")?"image/x-icon"
    :file.endsWith("png")?"image/png"
    :file.endsWith("svg")?"image/sgv+xml"
    :file.endsWith("webp")?"image/webp"
    :file.endsWith("jpg")?"image/jpg"
    :"":"";
    const cacheAge = type=="font"?"0":type=="img"?"0":type=="js"?"7890000":type=="css"?"7890000":"0";
    file = fs.existsSync(`public/assets/css/${file.replace('.css','.min.css')}`) ?
    file.replace('.css','.min.css') :
    fs.existsSync(`public/assets/js/${file.replace('.js','.min.js')}`) ?
    file.replace('.js','.min.js') : file;
    if(contentType==""){
        reply.headers({'Content-Type':'text/HTML','Cache-Control':'max-age=0,public'});
        reply.code(404);
        reply.sendFile("page/404.html");
        return;
    }
    reply.headers({'Content-Type':contentType,'Cache-Control':`max-age=${cacheAge},public`});
    reply.sendFile(`assets/${type}/${file}`);
})
fastify.setNotFoundHandler((request, reply) => {
    reply.headers({'Content-Type':'text/HTML','Cache-Control':'max-age=0,public'});
    reply.sendFile("page/404.html");
})

fastify.listen({ port : 3000 }, (err, address) => {
    if (err) throw err;
    console.log(`listening to ${address}`);
})