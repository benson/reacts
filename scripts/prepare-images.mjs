import {createRequire} from 'node:module';
import {readFile,writeFile,copyFile,mkdir} from 'node:fs/promises';
const require=createRequire(import.meta.url);
const sharp=require(process.env.SHARP_PATH || 'sharp');
const records=JSON.parse(await readFile(process.argv[2],'utf8'));
await mkdir('originals',{recursive:true}); await mkdir('images',{recursive:true});
const existing=JSON.parse(await readFile('collection.json','utf8'));
const collection=[];
const ids=new Set(existing.map(item=>item.id));
for(const item of records){if(ids.has(item.id)) throw new Error(`Duplicate image: ${item.id}`);ids.add(item.id);}
for(const item of records){
  await copyFile(item.source,`originals/${item.id}.png`);
  await sharp(item.source).resize({width:1280,withoutEnlargement:true}).jpeg({quality:91}).toFile(`images/${item.id}.jpg`);
  await sharp(item.source).resize(640,640,{fit:'inside',withoutEnlargement:true}).webp({quality:82}).toFile(`images/${item.id}-thumb.webp`);
  collection.push({id:item.id,title:item.title,alt:item.scene,tags:[...new Set(item.tags)],image:`images/${item.id}.jpg`,thumbnail:`images/${item.id}-thumb.webp`});
}
await writeFile('collection.json',JSON.stringify([...collection,...existing],null,2)+'\n');console.log(`Added ${collection.length} images; ${existing.length + collection.length} total`);
