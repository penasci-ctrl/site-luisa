// Conteúdo inicial do site, no mesmo formato dos documentos do Sanity, migrado do site antigo (HTML estático).
// Serve para duas coisas: (1) o site funciona localmente sem Sanity configurado;
// (2) `npm run import:seed` sobe tudo isto (com as fotos e áudios de public/seed) para o Sanity, uma vez.
// Depois da importação, o conteúdo passa a ser editado só no painel.
import texts from './seed-texts.json' with { type: 'json' };

let k = 0;
const key = () => `k${(k++).toString(36)}`;
const L = (pt, en) => ({ pt, ...(en ? { en } : {}) });
const p = (text) => ({ _type: 'block', _key: key(), style: 'normal', markDefs: [], children: [{ _type: 'span', _key: key(), text, marks: [] }] });
const img = (file, w, h, alt) => ({ _type: 'altImage', _key: key(), _seed: file, w, h, alt });
const ref = (id) => ({ _type: 'reference', _ref: id, _key: key() });
const slug = (s) => ({ _type: 'slug', current: s });
const sl = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// ---------------------------------------------------------------- Colaboradores
const NAMES = [
  'Luisa Alcântara', 'Pedro Köberle', 'Georgica Pettus', 'Marina Woisky', 'Pietro Pinzani', 'Ottavia Delfanti',
  'Fernando Dias de Souza', 'Ulli Nalin', 'Pedro Nascimento', 'João Zocchio', 'Bunny Talent', 'Antonio Farinaci',
  'Tolis Vossos', 'Euripedes Alcântara', 'Emanuel Bomfim', 'Jackie X', 'Marcos Brias', 'Carl Schloos', 'Ahmed Khedr',
  'Isaac Fujita Howell', 'Alice George', 'Nara Shin', 'Manoel Borba', 'Charles Montejo', 'Caroline Barreto',
  'Jessica Timlin', 'Agustina Jarpa', 'Alexandre Corrêa', 'Matheus Yehudi', 'Sofia Pappi', 'Monica Hollander',
];
const P = (name) => `person-${sl(name)}`;
const people = (...names) => names.map((n) => ref(P(n)));
const persons = NAMES.map((name) => ({ _id: P(name), _type: 'person', name }));

// ---------------------------------------------------------------- Materiais
const MAT = {
  oil: ['Óleo', 'Oil'], enamel: ['Esmalte', 'Enamel'], tar: ['Piche', 'Tar'], spackle: ['Massa corrida', 'Spackle'],
  flocking: ['Flocagem', 'Flocking'], sealant: ['Selante betuminoso', 'Tar sealant'], mdf: ['MDF', 'MDF'],
  wood: ['Madeira', 'Wood'], panel: ['Painel', 'Panel'], canvas: ['Tela', 'Canvas'], linen: ['Linho', 'Linen'],
  pvc: ['PVC', 'PVC board'], audio: ['Áudio', 'Audio'],
};
const materials = Object.entries(MAT).map(([id, [pt, en]]) => ({ _id: `material-${id}`, _type: 'material', name: L(pt, en) }));
const mats = (...ids) => ids.map((id) => ref(`material-${id}`));

// ---------------------------------------------------------------- Faixas de áudio
const track = (language, file, { title, text = [], voice = [], music = [] } = {}) => ({
  _type: 'audioTrack', _key: key(), language, ...(title ? { title } : {}),
  file: { _type: 'file', _seedFile: file },
  text: people(...text), voice: people(...voice), music: people(...music),
});
const LA = 'Luisa Alcântara', PK = 'Pedro Köberle';

// ---------------------------------------------------------------- Obras
const EXH_STALKER = 'exh-stalker';
const artworks = [
  {
    _id: 'artwork-prym', _type: 'artwork', title: L('A Vida e a Morte de Nathaniel Prym', 'The Life and Death of Nathaniel Prym'),
    slug: slug('the-life-and-death-of-nathaniel-prym'), year: 2025, order: 1,
    technique: L('Flocagem, esmalte, piche, massa corrida sobre MDF / óleo sobre linho; dispositivo de audioguia', 'Flocking, enamel, tar, spackle on MDF / oil on linen; audio guide device'),
    materials: mats('flocking', 'enamel', 'tar', 'spackle', 'mdf', 'oil', 'linen', 'audio'),
    images: [
      img('prym/prym_1.jpeg', 1600, 1259, 'Painel preto com um esqueleto pintado deitado na faixa de cima e uma rosa laranja na parte de baixo'),
      img('prym/prym_2.jpeg', 1600, 1066, 'Detalhe do esqueleto deitado, pintado a óleo em tons de sépia'),
      img('prym/prym_3.jpeg', 1600, 1067, 'Detalhe da rosa laranja sobre a superfície preta com relevos'),
      img('prym/prym_4.jpeg', 1600, 1067, 'Detalhe dos relevos de galhos sobre o preto, cortados por uma linha azul'),
    ],
    audio: [
      track('en', 'prym/E001.mp3', { title: 'The Life and Death of Nathaniel Prym', text: [PK, LA], voice: [PK] }),
      track('pt', 'prym/P001.mp3', { title: 'No Campo da Saudade', text: ['Marina Woisky'], voice: ['Marina Woisky'] }),
      track('it', 'prym/I001.mp3', { title: 'Legami Maledetti', text: ['Ottavia Delfanti', LA], voice: ['Pietro Pinzani', 'Ottavia Delfanti'] }),
      track('pt', 'prym/P002.mp3', { title: 'Drácula Vampiro', text: ['Fernando Dias de Souza'], voice: ['Fernando Dias de Souza'] }),
      track('de', 'prym/G001.mp3', { title: 'Schluchzchor', text: ['João Zocchio', LA], voice: ['Ulli Nalin', 'Pedro Nascimento', 'Marina Woisky'] }),
    ],
  },
  {
    _id: 'artwork-i-believe', _type: 'artwork', title: L('Eu Acredito em Deus e Você Também Deveria', 'I Believe in God and So Should You'),
    slug: slug('i-believe-in-god-and-so-should-you'), year: 2025, order: 2,
    technique: L('Piche, flocagem, esmalte e massa corrida sobre madeira / óleo sobre tela; áudio multicanal de 2 minutos em inglês, português e grego; placa de PVC', 'Tar, flocking, enamel and spackle on wood / oil on canvas; 2-minute multichannel audio in English, Portuguese and Greek; PVC board'),
    materials: mats('tar', 'flocking', 'enamel', 'spackle', 'wood', 'oil', 'canvas', 'audio', 'pvc'),
    dimensions: L('244 × 300 cm [96 × 118 in]'),
    images: [
      img('i_believe/i_believe_1.jpg', 800, 1200, 'Estrutura preta em forma de cruz na parede branca, com um retrato de mulher ruiva pintado no centro'),
      img('i_believe/i_believe_2.jpg', 800, 533, 'Detalhe do retrato a óleo de uma mulher ruiva, com luz atrás da cabeça'),
      img('i_believe/i_believe_3.jpg', 800, 533, 'Detalhe da superfície preta com relevos de galhos e flores'),
      img('i_believe/i_believe_4.jpg', 800, 534, 'A obra na parede, com uma pessoa ao lado para dar a escala'),
    ],
    audio: [
      track('en', 'i_believe/E000.mp3', { text: [LA], voice: ['Bunny Talent'] }),
      track('pt', 'i_believe/P000.mp3', { text: [LA], voice: ['Antonio Farinaci'] }),
      track('el', 'i_believe/G000.mp3', { text: [LA], voice: ['Tolis Vossos'] }),
    ],
  },
  {
    _id: 'artwork-stalker-i', _type: 'artwork', title: L('Stalker I: A Guerra das Rosas', 'Stalker I: The War of the Roses'),
    slug: slug('stalker-i'), year: 2024, series: 'Stalker', order: 1,
    technique: L('Massa corrida, piche, selante betuminoso à base de água, esmalte e flocagem sobre painel / óleo sobre tela', 'Spackle, tar, water-based tar sealant, enamel and flocking on panel / oil on canvas'),
    materials: mats('spackle', 'tar', 'sealant', 'enamel', 'flocking', 'panel', 'oil', 'canvas', 'audio'),
    dimensions: L('163 × 233 cm [64 1/4 × 91 3/4 in]'),
    exhibitions: [ref(EXH_STALKER)],
    images: [
      img('stalker_i/stalker_i_1.jpg', 800, 577, 'Painel preto com relevos de rosas à esquerda e, à direita, a pintura de uma mulher ruiva deitada sob uma colcha estampada'),
      img('stalker_i/stalker_i_2.jpg', 800, 533, 'Detalhe da pintura: mulher ruiva acordando assustada na cama'),
      img('stalker_i/stalker_i_3.jpg', 800, 533, 'Detalhe dos relevos de rosas e galhos na superfície preta, com um traço rosa'),
    ],
    audio: [
      track('pt', 'stalker_i/portuguese_.mp3', { text: ['Euripedes Alcântara'], voice: ['Emanuel Bomfim'] }),
      track('en', 'stalker_i/en.mp3', { text: [LA, PK], voice: ['Jackie X'] }),
      track('de', 'stalker_i/alemao_carl.mp3', { text: ['Marcos Brias'], voice: ['Carl Schloos'] }),
      track('fr', 'stalker_i/frances_ahmed.mp3', { text: [LA, PK], voice: ['Ahmed Khedr'] }),
      track('ja', 'stalker_i/japanese_isaac.mp3', { text: ['Isaac Fujita Howell'], voice: ['Isaac Fujita Howell'] }),
    ],
  },
  {
    _id: 'artwork-stalker-ii', _type: 'artwork', title: L('Stalker II: Puzzle'),
    slug: slug('stalker-ii'), year: 2025, series: 'Stalker', order: 2,
    technique: L('Óleo sobre tela, esmalte, piche, massa corrida sobre MDF', 'Oil on canvas, enamel, tar, spackle on MDF'),
    materials: mats('oil', 'canvas', 'enamel', 'tar', 'spackle', 'mdf', 'audio'),
    dimensions: L('122 × 122 cm cada [48 × 48 in cada]', '122 × 122 cm each [48 × 48 in each]'),
    exhibitions: [ref(EXH_STALKER)],
    images: [
      img('stalker_ii/stalker_ii_1.jpg', 2400, 1600, 'Quatro painéis pretos quadrados na parede, com pequenas janelas pintadas que mostram partes de uma mulher'),
      img('stalker_ii/stalker_ii_2.jpg', 1400, 934, 'Um dos painéis pretos, com três janelas pintadas: um rosto de mulher, uma mão e um torso'),
      img('stalker_ii/stalker_ii_3.jpg', 889, 593, 'Painel horizontal com a pintura em close de um torso feminino'),
    ],
    audio: [
      track('pt', 'stalker_ii/s2_portugues.mp3', { text: [LA], voice: ['Alice George'] }),
      track('en', 'stalker_ii/s2_english.mp3', { text: [LA], voice: ['Bunny Talent'] }),
      track('ar', 'stalker_ii/s2_arabe.mp3', { text: ['Ahmed Khedr'], voice: ['Ahmed Khedr'] }),
      track('ko', 'stalker_ii/s2_coreano.mp3', { text: ['Nara Shin'], voice: ['Nara Shin'] }),
      track('fr', 'stalker_ii/s2_frances.mp3', { text: [LA], voice: ['Ottavia Delfanti'] }),
      // arquivo existia no site antigo, mas sem link nem créditos: conferir com a Luisa
      track('es', 'stalker_ii/s2_espanhol.mp3', {}),
    ],
  },
  {
    _id: 'artwork-stalker-iii', _type: 'artwork', title: L('Stalker III: Dança de Salão', 'Stalker III: Ballroom Dancing'),
    slug: slug('stalker-iii'), year: 2025, series: 'Stalker', order: 3,
    technique: L('Óleo sobre tela, flocagem, esmalte, piche, massa corrida sobre MDF', 'Oil on canvas, flocking, enamel, tar, spackle on MDF'),
    materials: mats('oil', 'canvas', 'flocking', 'enamel', 'tar', 'spackle', 'mdf', 'audio'),
    dimensions: L('60 × 180 cm [23 5/8 × 70 7/8 in]'),
    exhibitions: [ref(EXH_STALKER)],
    images: [
      img('stalker_iii/stalker_iii_1.jpg', 2400, 1600, 'Painel horizontal roxo-escuro na parede branca, com um círculo lilás perto da borda direita'),
      img('stalker_iii/stalker_iii_2.jpg', 1400, 933, 'Detalhe do círculo lilás com uma rosa branca pintada, e galhos escuros em relevo'),
      img('stalker_iii/stalker_iii_3.jpg', 1400, 933, 'Detalhe da superfície flocada roxo-escura, atravessada por um traço verde'),
    ],
    audio: [
      track('pt', 'stalker_iii/s3_portugues.mp3', { text: [PK, 'Georgica Pettus'], voice: ['Manoel Borba'] }),
      track('en', 'stalker_iii/s3_english.mp3', { text: [PK, 'Georgica Pettus'], voice: ['Bunny Talent'] }),
      track('es', 'stalker_iii/s3_espanol.mp3', { text: [PK, 'Georgica Pettus'], voice: ['Bunny Talent'] }),
      track('fr', 'stalker_iii/s3_frances.mp3', { text: [PK, 'Georgica Pettus'], voice: ['Charles Montejo'] }),
    ],
  },
  {
    _id: 'artwork-stalker-iv', _type: 'artwork', title: L('Stalker IV: Ladrilho', 'Stalker IV: Tile Piece'),
    slug: slug('stalker-iv'), year: 2025, series: 'Stalker', order: 4,
    technique: L('Dispositivo de audioguia, áudio de 4 minutos', 'Audio guide device, 4-minute audio'),
    materials: mats('audio'),
    exhibitions: [ref(EXH_STALKER)],
    images: [
      img('stalker_iv/stalker_iv_1.jpg', 1400, 933, 'Três aparelhos de audioguia com fones pendurados numa parede branca, iluminados por spots'),
      img('stalker_iv/stalker_iv_2.jpg', 1400, 933, 'Duas placas de metal com as instruções do audioguia e o desenho de um galho'),
    ],
    audio: [
      track('pt', 'stalker_iv/s4_portugues.mp3', { text: [PK, LA], voice: ['Caroline Barreto'] }),
      track('en', 'stalker_iv/s4_english.mp3', { text: [PK, LA], voice: ['Jessica Timlin'] }),
      track('es', 'stalker_iv/s4_espanol.mp3', { text: [PK, LA], voice: ['Agustina Jarpa'] }),
      track('fr', 'stalker_iv/s4_frances.mp3', { text: [PK, LA], voice: ['Alexandre Corrêa'] }),
    ],
  },
  {
    _id: 'artwork-stalker-v', _type: 'artwork', title: L('Stalker V'),
    slug: slug('stalker-v'), year: 2025, series: 'Stalker', order: 5,
    technique: L('Esmalte, piche, massa corrida sobre MDF', 'Enamel, tar, spackle on MDF'),
    materials: mats('enamel', 'tar', 'spackle', 'mdf', 'audio'),
    dimensions: L('183 × 233 cm [72 × 91 3/4 in]'),
    exhibitions: [ref(EXH_STALKER)],
    images: [
      img('stalker_v/stalker_v_1.jpg', 1400, 933, 'Painel branco com relevos na parede, com um pequeno retângulo preto perto do alto'),
      img('stalker_v/stalker_v_2.jpg', 1400, 933, 'Detalhe do retângulo preto sobre a superfície branca com relevos'),
      img('stalker_v/stalker_v_3.jpg', 1400, 933, 'Detalhe dos relevos brancos de rosas e galhos'),
    ],
    audio: [
      track('pt', 'stalker_v/s5_portugues.mp3', { music: ['João Zocchio'], voice: ['Manoel Borba'] }),
      track('en', 'stalker_v/s5_english.mp3', { music: ['João Zocchio'], voice: ['Matheus Yehudi'] }),
      track('es', 'stalker_v/s5_espanol.mp3', { music: ['João Zocchio'], voice: ['Sofia Pappi'] }),
      track('fr', 'stalker_v/s5_francais.mp3', { music: ['João Zocchio'], voice: ['Monica Hollander'] }),
    ],
  },
  {
    // No site antigo estava sem fotos, sem áudio e com a ficha em branco: fica escondida até a Luisa completar
    _id: 'artwork-rish', _type: 'artwork', title: L('Rish (Cool Painting Number 1)'),
    slug: slug('rish'), year: 2025, order: 6, hidden: true, images: [],
  },
];

// ---------------------------------------------------------------- Exposições (do CV do site antigo)
const SP = L('São Paulo'), NY = L('Nova York', 'New York'), BK = L('Brooklyn');
const exh = (id, title, kind, year, venue, city, extra = {}) => ({
  _id: `exh-${id}`, _type: 'exhibition', title: typeof title === 'string' ? L(title) : title, slug: slug(id), kind, year, venue, city,
  showInCvOnly: true, ...extra,
});
const exhibitions = [
  exh('stalker', 'Stalker', 'solo', 2025, 'Yehudi Hollander-Pappi', SP, {
    showInCvOnly: false, link: 'https://yehudihollanderpappi.com',
    images: [img('stalker_iv/stalker_iv_1.jpg', 1400, 933, 'Vista da exposição Stalker: três aparelhos de audioguia com fones na parede branca, iluminados por spots')],
    works: ['artwork-stalker-i', 'artwork-stalker-ii', 'artwork-stalker-iii', 'artwork-stalker-iv', 'artwork-stalker-v'].map(ref),
  }),
  exh('supernova-1572', 'Supernova 1572', 'group', 2025, 'Yehudi Hollander-Pappi', SP),
  exh('paga', L('Pagã, de Regina Parra', 'Pagã by Regina Parra'), 'group', 2023, 'Pinacoteca', SP, { note: L('participação especial', 'special participation') }),
  exh('soft-machine', 'Soft Machine', 'group', 2022, 'IRL NYC', BK),
  exh('art-shop', 'Art Shop', 'group', 2021, 'IRL NYC', BK),
  exh('real-corporate-people', 'Real Corporate People', 'group', 2020, 'Spring Break Art Show', NY, { note: L('com Georgica Pettus', 'with Georgica Pettus') }),
  exh('archive-ii', 'Archive II', 'group', 2020, 'Saint Maison Gallery', L('Tóquio', 'Tokyo')),
  exh('no-kid', 'No Kid', 'group', 2020, 'PCH Projects', NY),
  exh('yard-sale', 'Yard Sale', 'group', 2020, 'Serving The People', NY),
  exh('you-really-hurt-me', 'You Really Hurt Me', 'solo', 2019, 'Serving The People on Artsy.net', NY),
  exh('stp-group-show', 'STP Group Show', 'group', 2019, 'Milk Studios', NY),
  exh('stp-auction', 'STP Auction', 'group', 2019, 'Paddle8.com', NY),
  exh('group-show-zip', 'Group Show', 'group', 2019, 'ZIP', NY),
  exh('kitten-juice', 'Kitten Juice', 'solo', 2017, '277 Church', NY),
  exh('open-studios', 'Open Studios', 'group', 2017, 'Mana Contemporary', L('New Jersey')),
  exh('joseph', 'Joseph', 'group', 2017, 'Hester Street Gallery', NY),
];

// ---------------------------------------------------------------- Textos
const essays = [
  {
    _id: 'essay-stalker-woisky', _type: 'essay', title: L('Stalker'), kind: 'critical', author: texts.woisky.author_pt, year: 2025,
    body: { pt: texts.woisky.pt.map(p), en: texts.woisky.en.map(p) }, exhibition: ref(EXH_STALKER),
  },
  {
    _id: 'essay-stalker-raimondi', _type: 'essay', title: L('Stalker'), kind: 'critical', author: texts.raimondi.author_pt, year: 2025,
    body: { pt: texts.raimondi.pt.map(p), en: texts.raimondi.en.map(p) }, exhibition: ref(EXH_STALKER),
  },
  {
    _id: 'essay-ballroom-dancing', _type: 'essay', title: L('Dança de Salão', 'Ballroom Dancing'), kind: 'poem',
    author: 'Georgica Pettus, Pedro Köberle, Luisa Alcântara', year: 2025,
    body: { pt: texts.poem.pt.map(p), en: texts.poem.en.map(p) }, artwork: ref('artwork-stalker-iii'),
  },
];
for (const e of essays) { delete e.exhibition?._key; delete e.artwork?._key; }

// ---------------------------------------------------------------- Sobre e Configurações
const about = {
  _id: 'about', _type: 'about',
  bio: {
    pt: [p('Luisa Alcântara (São Paulo, 1992) vive e trabalha em São Paulo.')],
    en: [p('Luisa Alcântara (b. 1992, São Paulo, Brazil) lives and works in São Paulo.')],
  },
  cv: [
    {
      _type: 'cvSection', _key: key(), title: L('Formação', 'Education'),
      entries: [
        { _type: 'cvEntry', _key: key(), year: '2011–2016', text: L('Pratt Institute, Brooklyn, NY — BFA em Pintura', 'Pratt Institute, Brooklyn, NY — BFA Painting') },
        { _type: 'cvEntry', _key: key(), year: '2011–2016', text: L('The New School, Nova York — BFA em História da Arte', 'The New School, New York, NY — BFA Art History') },
      ],
    },
  ],
};

const settings = {
  _id: 'settings', _type: 'settings',
  email: 'luisamalcantara@gmail.com',
  instagram: 'https://instagram.com/kittenjuice/',
  galleries: [{ _type: 'gallery', _key: key(), name: 'Yehudi Hollander-Pappi', city: L('São Paulo'), url: 'https://yehudihollanderpappi.com' }],
  homeWorks: ['artwork-stalker-i', 'artwork-stalker-ii', 'artwork-stalker-iii', 'artwork-i-believe', 'artwork-stalker-v', 'artwork-prym', 'artwork-stalker-iv'].map(ref),
  description: L(
    'Luisa Alcântara (São Paulo, 1992): pinturas, relevos e audioguias. Representada por Yehudi Hollander-Pappi.',
    'Luisa Alcântara (b. 1992, São Paulo): paintings, reliefs and audio guides. Represented by Yehudi Hollander-Pappi.'
  ),
};

export const docs = [...persons, ...materials, ...artworks, ...exhibitions, ...essays, about, settings];
