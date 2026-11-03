// Busca todo o conteúdo do site na hora do build.
// Com SANITY_PROJECT_ID definido, lê do Sanity; sem ele, usa o conteúdo inicial (src/data/seed.mjs),
// o que permite rodar e testar o site sem conta nenhuma.
import { createClient } from '@sanity/client';
import { docs as seedDocs } from '../data/seed.mjs';

const env = (k) => import.meta.env[k] || process.env[k] || '';
const projectId = env('USE_SEED') ? '' : (env('SANITY_PROJECT_ID') || 'eo5i0cv6');
const dataset = env('SANITY_DATASET') || 'production';

const IMG = `{ "src": asset->url, "w": asset->metadata.dimensions.width, "h": asset->metadata.dimensions.height, alt, caption }`;
const PEOPLE = `{ "id": _id, name, link }`;
const TEXT = `{ "id": _id, title, kind, author, year, body, link }`;

const QUERY = `{
  "works": *[_type == "artwork" && hidden != true] | order(year desc, order asc, _createdAt desc) {
    "id": _id, "slug": slug.current, title, year, series, technique, dimensions, photoCredit,
    "images": images[] ${IMG},
    "materials": materials[]-> { "id": _id, name },
    "exhibitions": exhibitions[]-> { "slug": slug.current, title, year, showInCvOnly },
    "audio": audio[] { language, title, transcript, "src": file.asset->url, "text": text[]-> ${PEOPLE}, "voice": voice[]-> ${PEOPLE}, "music": music[]-> ${PEOPLE} },
    "texts": *[_type == "essay" && artwork._ref == ^._id] | order(year desc) ${TEXT}
  },
  "exhibitions": *[_type == "exhibition"] | order(year desc, startDate desc, _createdAt desc) {
    "id": _id, "slug": slug.current, title, kind, year, venue, city, note, startDate, endDate, photoCredit, link, showInCvOnly,
    "images": images[] ${IMG},
    "chosen": works[]->slug.current,
    "linked": *[_type == "artwork" && references(^._id)] | order(year desc, order asc).slug.current,
    "texts": *[_type == "essay" && exhibition._ref == ^._id] | order(year desc) ${TEXT}
  },
  "about": *[_id == "about"][0] { bio, cv, "portrait": portrait ${IMG}, portraitCredit, "cvPdf": cvPdf.asset->url },
  "settings": *[_id == "settings"][0] {
    email, instagram, galleries, description, "shareImage": shareImage ${IMG},
    "homeWorks": homeWorks[]->slug.current
  }
}`;

// ------------------------------------------------------------ conteúdo inicial (sem Sanity)
function fromSeed() {
  const byId = Object.fromEntries(seedDocs.map((d) => [d._id, d]));
  const of = (t) => seedDocs.filter((d) => d._type === t);
  const s = (d) => d?.slug?.current;
  const im = (i) => i && { src: `/seed/${i._seed}`, w: i.w, h: i.h, alt: i.alt, caption: i.caption };
  const deref = (r) => (r ? byId[r._ref] : null);
  const ppl = (a) => (a || []).map(deref).filter(Boolean).map((d) => ({ id: d._id, name: d.name, link: d.link }));
  const txt = (d) => ({ id: d._id, title: d.title, kind: d.kind, author: d.author, year: d.year, body: d.body, link: d.link });

  const works = of('artwork')
    .filter((d) => !d.hidden)
    .sort((a, b) => b.year - a.year || (a.order ?? 99) - (b.order ?? 99))
    .map((d) => ({
      id: d._id, slug: s(d), title: d.title, year: d.year, series: d.series, technique: d.technique, dimensions: d.dimensions, photoCredit: d.photoCredit,
      images: (d.images || []).map(im),
      materials: (d.materials || []).map(deref).filter(Boolean).map((m) => ({ id: m._id, name: m.name })),
      exhibitions: (d.exhibitions || []).map(deref).filter(Boolean).map((e) => ({ slug: s(e), title: e.title, year: e.year, showInCvOnly: e.showInCvOnly })),
      audio: (d.audio || []).map((t) => ({ language: t.language, title: t.title, transcript: t.transcript, src: `/seed/${t.file._seedFile}`, text: ppl(t.text), voice: ppl(t.voice), music: ppl(t.music) })),
      texts: of('essay').filter((e) => e.artwork?._ref === d._id).map(txt),
    }));
  const exhibitions = of('exhibition')
    .sort((a, b) => b.year - a.year)
    .map((d) => ({
      id: d._id, slug: s(d), title: d.title, kind: d.kind, year: d.year, venue: d.venue, city: d.city, note: d.note,
      startDate: d.startDate, endDate: d.endDate, photoCredit: d.photoCredit, link: d.link, showInCvOnly: d.showInCvOnly,
      images: (d.images || []).map(im),
      chosen: (d.works || []).map((r) => s(byId[r._ref])),
      linked: of('artwork').filter((w) => (w.exhibitions || []).some((r) => r._ref === d._id)).map(s),
      texts: of('essay').filter((e) => e.exhibition?._ref === d._id).map(txt),
    }));
  const a = byId.about, st = byId.settings;
  return {
    works, exhibitions,
    about: { bio: a.bio, cv: a.cv, portrait: im(a.portrait), portraitCredit: a.portraitCredit },
    settings: {
      email: st.email, instagram: st.instagram, galleries: st.galleries, description: st.description,
      homeWorks: (st.homeWorks || []).map((r) => s(byId[r._ref])),
    },
  };
}

// Liga exposições às obras completas (com fotos e áudio), na ordem escolhida no painel
function link(data) {
  const bySlug = Object.fromEntries(data.works.map((w) => [w.slug, w]));
  for (const e of data.exhibitions) {
    const slugs = e.chosen?.length ? e.chosen : e.linked || [];
    e.works = [...new Set(slugs)].map((sl) => bySlug[sl]).filter(Boolean);
    e.texts ||= [];
  }
  const home = (data.settings?.homeWorks || []).map((sl) => bySlug[sl]).filter(Boolean);
  data.home = (home.length ? home : data.works).filter((w) => w.images?.length);
  return data;
}

let cache;
export async function getContent() {
  if (cache) return cache;
  if (!projectId) {
    cache = link(fromSeed());
  } else {
    const client = createClient({ projectId, dataset, apiVersion: '2025-01-01', useCdn: false, perspective: 'published' });
    const data = await client.fetch(QUERY);
    data.about ||= { bio: null, cv: [] };
    data.settings ||= {};
    for (const k of ['works', 'exhibitions']) {
      data[k] = (data[k] || []).map((d) => ({ ...d, images: (d.images || []).filter((i) => i && i.src) }));
    }
    for (const w of data.works) {
      w.audio = (w.audio || []).filter((t) => t?.src).map((t) => ({ ...t, text: t.text || [], voice: t.voice || [], music: t.music || [] }));
      w.materials ||= []; w.exhibitions ||= []; w.texts ||= [];
    }
    cache = link(data);
  }
  return cache;
}
