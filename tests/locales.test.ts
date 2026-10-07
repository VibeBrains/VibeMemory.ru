import { join } from 'node:path'
import { localeGate } from '@vibebrains/site-kit/gate'
import ru from '../src/locales/ru.json'
import en from '../src/locales/en.json'
import { agents, connectableAgents } from '../src/config/agents'
import { CONNECT_COMMAND_PREFIX } from '../src/config/site'

localeGate({
  root: join(import.meta.dir, '..'),
  catalogs: { ru, en },
  // Data that is the same in every language and is not interface text: product names and the words of the command
  data: [
    ...agents.map((agent) => agent.name),
    ...connectableAgents.map((agent) => agent.id),
    ...CONNECT_COMMAND_PREFIX.split(' '),
  ],
  // Avatar initials and agent monograms are derived from catalog handles and product names
  singleCapitals: true,
})
