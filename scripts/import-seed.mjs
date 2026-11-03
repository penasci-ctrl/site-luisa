// Sobe o conteúdo inicial (src/data/seed.mjs + fotos e áudios de public/seed) para o Sanity.
// Rodar UMA vez, logo depois de criar o projeto no Sanity:
//   SANITY_PROJECT_ID=xxxx SANITY_WRITE_TOKEN=yyyy npm run import:seed
// Rodar de novo é seguro: os documentos são sobrescritos pelo mesmo _id (as edições feitas no painel nesses documentos se perdem).
import { createClient } from '@sanity/client';
import { readFile } from 'node:fs/promises';
import { basename } from 'node:path';
import { docs } from '../src/data/seed.mjs';

const projectId = process.env.SANITY_PROJECT_ID;
const dataset = process.env.SANITY_DATASET || 'production';
const token = process.env.SANITY_WRITE_TOKEN;
if (!projectId || !token) {
  console.error('Defina SANITY_PROJECT_ID e SANITY_WRITE_TOKEN (token com permissão Editor, criado em sanity.io/manage → API → Tokens).');
  process.exit(1);
}
const client = createClient({ projectId, dataset, token, apiVersion: '2025-01-01', useCdn: false });

const uploaded = new Map();
async function upload(file, type) {
  if (uploaded.has(file)) return uploaded.get(file);
  const buf = await readFile(new URL(`../public/seed/${file}`, import.meta.url));
  const asset = await client.assets.upload(type, buf, { filename: basename(file) });
  console.log(`  ↑ ${file}`);
  uploaded.set(file, asset._id);
  return asset._id;
}

// troca {_seed: 'x.jpg', w, h} por imagem e {_seedFile: 'x.mp3'} por arquivo do Sanity, em qualquer profundidade
async function convert(value) {
  if (Array.isArray(value)) {
    const out = [];
    for (const v of value) out.push(await convert(v)); // em série: não sobrecarrega o envio
    return out;
  }
  if (value && typeof value === 'object') {
    if (value._seed) {
      const { _seed, w, h, ...rest } = value;
      return { ...rest, asset: { _type: 'reference', _ref: await upload(_seed, 'image') } };
    }
    if (value._seedFile) {
      const { _seedFile, ...rest } = value;
      return { ...rest, asset: { _type: 'reference', _ref: await upload(_seedFile, 'file') } };
    }
    const out = {};
    for (const [k, v] of Object.entries(value)) out[k] = await convert(v);
    return out;
  }
  return value;
}

const tx = client.transaction();
for (const d of docs) tx.createOrReplace(await convert(d));
await tx.commit();
console.log(`Pronto: ${docs.length} documentos no dataset "${dataset}".`);
