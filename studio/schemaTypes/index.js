import { localeString, localeText, localeBlock, altImage } from './locale'
import { artwork, audioTrack } from './artwork'
import { exhibition } from './exhibition'
import { text } from './text'
import { person, material } from './taxonomy'
import { about } from './about'
import { settings } from './settings'

export const SINGLETONS = ['about', 'settings']

export const schemaTypes = [
  localeString, localeText, localeBlock, altImage, audioTrack,
  artwork, exhibition, text, person, material, about, settings,
]
