import { defineType, defineField } from 'sanity'

export const settings = defineType({
  name: 'settings',
  title: 'Configurações',
  type: 'document',
  groups: [
    { name: 'contact', title: 'Contato', default: true },
    { name: 'home', title: 'Página Obras' },
    { name: 'seo', title: 'Google e compartilhamento' },
  ],
  fields: [
    defineField({ name: 'email', title: 'E-mail', type: 'string', group: 'contact', validation: (r) => r.email() }),
    defineField({ name: 'instagram', title: 'Instagram (link)', type: 'url', group: 'contact' }),
    defineField({
      name: 'galleries',
      title: 'Galerias',
      type: 'array',
      group: 'contact',
      of: [
        {
          type: 'object',
          name: 'gallery',
          fields: [
            defineField({ name: 'name', title: 'Nome', type: 'string', validation: (r) => r.required() }),
            defineField({ name: 'city', title: 'Cidade', type: 'localeString' }),
            defineField({ name: 'url', title: 'Site', type: 'url' }),
          ],
          preview: { select: { title: 'name', subtitle: 'city.pt' } },
        },
      ],
    }),
    defineField({
      name: 'homeWorks',
      title: 'Obras da página inicial, na ordem',
      description: 'Arraste para ordenar. Se ficar vazio, entram todas as obras, da mais recente para a mais antiga.',
      type: 'array',
      group: 'home',
      of: [{ type: 'reference', to: [{ type: 'artwork' }] }],
    }),
    defineField({ name: 'description', title: 'Descrição para o Google', type: 'localeText', group: 'seo' }),
    defineField({ name: 'shareImage', title: 'Imagem de compartilhamento (WhatsApp, redes)', type: 'altImage', group: 'seo' }),
  ],
  preview: { prepare: () => ({ title: 'Configurações' }) },
})
