// Menu lateral do painel, na mesma ordem do site
export const structure = (S) =>
  S.list()
    .title('Site')
    .items([
      S.documentTypeListItem('artwork').title('Obras'),
      S.documentTypeListItem('exhibition').title('Exposições'),
      S.documentTypeListItem('essay').title('Textos e poemas'),
      S.divider(),
      S.documentTypeListItem('person').title('Colaboradores'),
      S.documentTypeListItem('material').title('Materiais'),
      S.divider(),
      S.listItem().title('Sobre').id('about').child(S.document().schemaType('about').documentId('about')),
      S.listItem().title('Configurações').id('settings').child(S.document().schemaType('settings').documentId('settings')),
    ])
