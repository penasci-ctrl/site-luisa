import { defineType, defineField, defineArrayMember } from 'sanity'

// Línguas dos audioguias. A mesma lista está em src/lib/i18n.js (rótulos no site).
export const LANGUAGES = [
  { title: 'Português', value: 'pt' },
  { title: 'English', value: 'en' },
  { title: 'Español', value: 'es' },
  { title: 'Français', value: 'fr' },
  { title: 'Deutsch', value: 'de' },
  { title: 'Italiano', value: 'it' },
  { title: '日本語 (japonês)', value: 'ja' },
  { title: '한국어 (coreano)', value: 'ko' },
  { title: 'العربية (árabe)', value: 'ar' },
  { title: 'Ελληνικά (grego)', value: 'el' },
  { title: '中文 (chinês)', value: 'zh' },
  { title: 'Русский (russo)', value: 'ru' },
  { title: 'Outra', value: 'other' },
]

const people = (name, title) =>
  defineField({
    name,
    title,
    type: 'array',
    of: [defineArrayMember({ type: 'reference', to: [{ type: 'person' }], options: { disableNew: false } })],
    description: 'Escolha da lista ou crie a pessoa na hora. Cada nome existe uma vez só, o que mantém o filtro do Index certo.',
  })

// Uma faixa do audioguia: uma língua, um arquivo, quem escreveu e quem deu a voz
export const audioTrack = defineType({
  name: 'audioTrack',
  title: 'Faixa do audioguia',
  type: 'object',
  fields: [
    defineField({ name: 'language', title: 'Língua', type: 'string', options: { list: LANGUAGES }, validation: (r) => r.required() }),
    defineField({ name: 'title', title: 'Título da faixa (opcional)', description: 'Ex.: No Campo da Saudade. Se ficar vazio, o site mostra só a língua.', type: 'string' }),
    defineField({ name: 'file', title: 'Arquivo de áudio (.mp3)', type: 'file', options: { accept: 'audio/*' }, validation: (r) => r.required() }),
    people('text', 'Texto'),
    people('voice', 'Voz'),
    people('music', 'Música'),
    defineField({ name: 'transcript', title: 'Transcrição (opcional)', description: 'O texto falado. Ajuda quem não pode ouvir e o Google.', type: 'text', rows: 6 }),
  ],
  preview: {
    select: { language: 'language', title: 'title', voice: 'voice.0.name' },
    prepare: ({ language, title, voice }) => ({
      title: [LANGUAGES.find((l) => l.value === language)?.title || language, title].filter(Boolean).join(' — '),
      subtitle: voice ? `Voz: ${voice}` : '',
    }),
  },
})

export const artwork = defineType({
  name: 'artwork',
  title: 'Obra',
  type: 'document',
  groups: [
    { name: 'main', title: 'Obra', default: true },
    { name: 'audio', title: 'Audioguia' },
    { name: 'more', title: 'Mais' },
  ],
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'localeString', group: 'main', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Endereço',
      description: 'Clique em Generate. Ex.: stalker-i',
      type: 'slug',
      group: 'main',
      options: { source: (doc) => doc.title?.en || doc.title?.pt, maxLength: 80 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'year', title: 'Ano', type: 'number', group: 'main', validation: (r) => r.required().integer().min(2000).max(2100) }),
    defineField({ name: 'series', title: 'Série', description: 'Ex.: Stalker. Escreva igual em todas as obras da série.', type: 'string', group: 'main' }),
    defineField({
      name: 'images',
      title: 'Fotos',
      description: 'A primeira é a capa (aparece na página Obras e no Index).',
      type: 'array',
      of: [{ type: 'altImage' }],
      options: { layout: 'grid' },
      group: 'main',
      validation: (r) => r.required().min(1),
    }),
    defineField({ name: 'technique', title: 'Técnica (como aparece na legenda)', type: 'localeString', group: 'main' }),
    defineField({
      name: 'materials',
      title: 'Materiais (para o filtro do Index)',
      description: 'Escolha da lista ou crie um novo.',
      type: 'array',
      of: [defineArrayMember({ type: 'reference', to: [{ type: 'material' }] })],
      group: 'main',
    }),
    defineField({ name: 'dimensions', title: 'Dimensões', description: 'Ex.: 163 × 233 cm [64 1/4 × 91 3/4 in]', type: 'localeString', group: 'main' }),
    defineField({
      name: 'exhibitions',
      title: 'Exposições em que esteve',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'exhibition' }] }],
      group: 'main',
    }),
    defineField({
      name: 'audio',
      title: 'Faixas do audioguia',
      description: 'Uma faixa por língua. A primeira é a que toca por padrão.',
      type: 'array',
      of: [{ type: 'audioTrack' }],
      group: 'audio',
    }),
    defineField({ name: 'photoCredit', title: 'Crédito das fotos', type: 'string', group: 'more' }),
    defineField({ name: 'order', title: 'Ordem dentro do ano', description: 'Menor aparece primeiro. Pode deixar vazio.', type: 'number', group: 'more' }),
    defineField({ name: 'hidden', title: 'Esconder do site', type: 'boolean', initialValue: false, group: 'more' }),
  ],
  orderings: [{ title: 'Ano (mais recente)', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }, { field: 'order', direction: 'asc' }] }],
  preview: {
    select: { title: 'title.pt', year: 'year', hidden: 'hidden', media: 'images.0' },
    prepare: ({ title, year, hidden, media }) => ({ title, subtitle: [year, hidden && 'escondida'].filter(Boolean).join(' · '), media }),
  },
})
