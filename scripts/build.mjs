import {mkdir,copyFile,cp,readFile,stat} from 'node:fs/promises';
const items = JSON.parse(await readFile('collection.json','utf8'));
if(items.length !== 21 || new Set(items.map(x=>x.id)).size !== 21) throw new Error('Expected 21 unique reactions');
for(const item of items) for(const file of [item.image,item.thumbnail]) if(!(await stat(file)).size) throw new Error(`Missing image: ${file}`);
await mkdir('dist',{recursive:true});
for(const file of ['index.html','styles.css','app.js','collection.json','CNAME']) await copyFile(file,`dist/${file}`);
await cp('images','dist/images',{recursive:true});
console.log(`Built ${items.length} reactions`);
