import { initReveal } from '@vibebrains/site-kit/scripts/reveal'
import { initLangMemory } from '@vibebrains/site-kit/scripts/langMemory'
import { LANG_STORAGE_KEY } from '../config/site'
import { initConnect } from './connect'
import { initSessionDemo } from './sessionDemo'

initReveal()
initLangMemory(LANG_STORAGE_KEY)
initConnect()
initSessionDemo()
