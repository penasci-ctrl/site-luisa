import { defineType, defineField } from 'sanity'

// Pessoas que participam das obras (texto, voz, música). Alimenta o filtro "Colaborador" do Index.
export const person = defineType({
  name: 'person',
  title: 'Colaborador',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Nome', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'link', title: 'Site ou Instagram (opcional)', type: 'url' }),
  ],
  orderings: [{ title: 'Nome', name: 'nameAsc', by: [{ field: 'name', direction: 'asc' }] }],
  preview: { select: { title: 'name' } },
})

// Materiais e suportes (óleo, piche, MDF…). Alimenta o filtro "Técnica" do Index.
export const material = defineType({
  name: 'material',
  title: 'Material',
  type: 'document',
  fields: [defineField({ name: 'name', title: 'Nome', type: 'localeString', validation: (r) => r.required() })],
  orderings: [{ title: 'Nome', name: 'nameAsc', by: [{ field: 'name.pt', direction: 'asc' }] }],
  preview: { select: { title: 'name.pt', subtitle: 'name.en' } },
})
