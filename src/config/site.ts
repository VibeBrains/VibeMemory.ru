/** Cabinet origin: every call to action leads there */
export const CABINET_URL = 'https://app.vibememory.ru'

/** Outbound links of the landing, one source for header, sections and footer */
export const links = {
  start: `${CABINET_URL}/start`,
  signIn: `${CABINET_URL}/sign-in`,
  download: `${CABINET_URL}/download`,
  terms: `${CABINET_URL}/terms`,
  policy: `${CABINET_URL}/policy`,
  // the owner's own agents that speak the memory natively: their releases, where a visitor gets them
  vibeideReleases: 'https://github.com/VibeBrains/VibeIDE/releases',
  vibeideaReleases: 'https://github.com/VibeBrains/VibeIDEA/releases',
} as const

/** The command the cabinet prints for connecting an agent, without the agent id that ends it */
export const CONNECT_COMMAND_PREFIX = `vibememory connect --cabinet ${CABINET_URL} --agent`

/** The command that opens the page of the machine's own projects and memory map */
export const LOCAL_UI_COMMAND = 'vibememory ui'

/**
 * Yandex Metrika: the counter number; empty means the site loads nothing and shows no cookie banner
 * Goals are listed in docs/manuals/metrikaGoals.md
 */
export const metrika = {
  counterId: '' as string,
  /** First-party cookie with the visitor's decision, one year */
  cookie: 'vibememory_cookies',
} as const

/** localStorage key that remembers the language the visitor picked explicitly */
export const LANG_STORAGE_KEY = 'vibememory.lang'
