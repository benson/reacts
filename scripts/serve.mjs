import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
import {resolve,extname,sep} from 'node:path';
const root = resolve('.');
const types={'.html':'text/html','.css':'text/css','.js':'text/javascript','.json':'application/json','.jpg':'image/jpeg','.webp':'image/webp'};
createServer(async(req,res)=>{try{const path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(path!==root&&!path.startsWith(root+sep)){res.writeHead(403).end();return;}const file=path===root?resolve(root,'index.html'):path;res.setHeader('Content-Type',types[extname(file)]||'application/octet-stream');res.end(await readFile(file));}catch{res.writeHead(404).end('Not found');}}).listen(4187,'127.0.0.1',()=>console.log('http://127.0.0.1:4187'));
