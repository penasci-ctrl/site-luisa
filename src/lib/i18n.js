import { toHTML } from '@portabletext/to-html';

export const LANGS = ['pt', 'en'];

// Rotas: português na raiz, inglês em /en/
export const langPaths = () => [{ params: { lang: undefined }, props: { lang: 'pt' } }, { params: { lang: 'en' }, props: { lang: 'en' } }];

export const href = (lang, path = '/') => {
  const clean = path === '/' ? '/' : `/${path.replace(/^\/+|\/+$/g, '')}/`;
  return lang === 'en' ? (clean === '/' ? '/en/' : `/en${clean}`) : clean;
};

// Campo bilíngue: mostra o inglês quando existe, senão o português
export const t = (field, lang) => {
  if (field == null) return '';
  if (typeof field !== 'object') return field;
  return (lang === 'en' && field.en) || field.pt || '';
};

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

export const tBlocks = (field, lang) => {
  if (!field) return '';
  const blocks = (lang === 'en' && field.en?.length ? field.en : field.pt) || [];
  return toHTML(blocks, {
    components: {
      marks: {
        link: ({ children, value }) => `<a class="ln" href="${esc(value?.href || '#')}" target="_blank" rel="noopener">${children}</a>`,
      },
    },
  });
};

// Texto puro (para descrições do Google)
export const tPlain = (field, lang) => {
  const blocks = (lang === 'en' && field?.en?.length ? field.en : field?.pt) || [];
  return blocks.map((b) => (b.children || []).map((c) => c.text).join('')).join(' ');
};

// Línguas dos audioguias: sigla no botão e nome completo para leitores de tela
export const AUDIO_LANGS = {
  pt: ['PT', 'Português'], en: ['EN', 'English'], es: ['ES', 'Español'], fr: ['FR', 'Français'], de: ['DE', 'Deutsch'],
  it: ['IT', 'Italiano'], ja: ['JA', '日本語'], ko: ['KO', '한국어'], ar: ['AR', 'العربية'], el: ['EL', 'Ελληνικά'],
  zh: ['ZH', '中文'], ru: ['RU', 'Русский'], other: ['—', '—'],
};

export const names = (arr) => (arr || []).map((p) => p.name).join(', ');

export const UI = {
  pt: {
    works: 'Obras', exhibitions: 'Exposições', about: 'Sobre', index: 'Index', menu: 'Menu',
    email: 'E-mail', instagram: 'Instagram', rights: 'Todos os direitos reservados',
    allExhibitions: 'Todas as exposições', all: 'Todas', solo: 'Individuais', group: 'Coletivas', soloOne: 'Exposição individual', groupOne: 'Exposição coletiva',
    overview: 'Visão geral', list: 'Lista',
    audio: 'Audioguia', play: 'Ouvir', pause: 'Pausar', transcript: 'Transcrição',
    text: 'Texto', voice: 'Voz', music: 'Música', textBy: 'Texto', poem: 'Poema',
    installView: 'Vista da exposição', photos: 'Fotos', back: 'Voltar', next: 'Próxima',
    series: 'Série', exhibition: 'Exposição', visit: 'Site da galeria',
    filterBy: 'Filtrar por', active: 'Ativos:', clear: 'Limpar tudo', none: 'Nenhuma obra com esses filtros.',
    year: 'Ano', technique: 'Técnica', language: 'Língua', collaborator: 'Colaborador', noSeries: 'Sem série',
    represented: 'Representada por', contact: 'Contato', cvPdf: 'CV (PDF)', soloList: 'Exposições individuais', groupList: 'Exposições coletivas',
    notFound: 'Página não encontrada.', backHome: 'Voltar para Obras',
  },
  en: {
    works: 'Works', exhibitions: 'Exhibitions', about: 'About', index: 'Index', menu: 'Menu',
    email: 'E-mail', instagram: 'Instagram', rights: 'All Rights Reserved',
    allExhibitions: 'All exhibitions', all: 'All', solo: 'Solo', group: 'Group', soloOne: 'Solo exhibition', groupOne: 'Group exhibition',
    overview: 'Overview', list: 'List',
    audio: 'Audio guide', play: 'Play', pause: 'Pause', transcript: 'Transcript',
    text: 'Text', voice: 'Voice', music: 'Music', textBy: 'Text', poem: 'Poem',
    installView: 'Installation view', photos: 'Photos', back: 'Back', next: 'Next',
    series: 'Series', exhibition: 'Exhibition', visit: 'Gallery website',
    filterBy: 'Filter by', active: 'Active:', clear: 'Clear all', none: 'No works match these filters.',
    year: 'Year', technique: 'Technique', language: 'Language', collaborator: 'Collaborator', noSeries: 'No series',
    represented: 'Represented by', contact: 'Contact', cvPdf: 'CV (PDF)', soloList: 'Solo exhibitions', groupList: 'Group exhibitions',
    notFound: 'Page not found.', backHome: 'Back to Works',
  },
};
