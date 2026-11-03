import { defineType, defineField } from 'sanity'

export const text = defineType({
  name: 'essay',
  title: 'Texto',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Título', type: 'localeString', validation: (r) => r.required() }),
    defineField({
      name: 'kind',
      title: 'Tipo',
      type: 'string',
      options: {
        list: [
          { title: 'Texto crítico / curatorial', value: 'critical' },
          { title: 'Poema ou texto da obra', value: 'poem' },
          { title: 'Texto da artista', value: 'by' },
        ],
        layout: 'radio',
      },
      initialValue: 'critical',
      validation: (r) => r.required(),
    }),
    defineField({ name: 'author', title: 'Autor(es)', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'year', title: 'Ano', type: 'number', validation: (r) => r.required().integer() }),
    defineField({ name: 'body', title: 'Texto completo', description: 'Em poemas, cada Enter vira uma linha nova.', type: 'localeBlock' }),
    defineField({ name: 'exhibition', title: 'Aparece na exposição', type: 'reference', to: [{ type: 'exhibition' }] }),
    defineField({ name: 'artwork', title: 'Aparece na obra', type: 'reference', to: [{ type: 'artwork' }] }),
    defineField({ name: 'link', title: 'Link para o original (opcional)', type: 'url' }),
  ],
  orderings: [{ title: 'Ano (mais recente)', name: 'yearDesc', by: [{ field: 'year', direction: 'desc' }] }],
  preview: {
    select: { title: 'title.pt', author: 'author', year: 'year' },
    prepare: ({ title, author, year }) => ({ title, subtitle: [author, year].filter(Boolean).join(' · ') }),
  },
})
