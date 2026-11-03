import { defineCliConfig } from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'eo5i0cv6',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // endereço do painel: https://luisaalcantara.sanity.studio
  studioHost: 'luisaalcantara',
  deployment: { appId: 'j6g871neen86w69il0xqxa02' },
})
