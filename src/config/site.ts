/** Cabinet origin: every call to action leads there */
export const CABINET_URL = 'https://app.vibememory.ru'

/** Outbound links of the landing, one source for header, sections and footer */
export const links = {
  start: `${CABINET_URL}/start`,
  signIn: `${CABINET_URL}/sign-in`,
  download: `${CABINET_URL}/download`,
  terms: `${CABINET_URL}/terms`,
  policy: `${CABINET_URL}/policy`,
} as const

/** The command the cabinet prints for connecting an agent, without the agent id that ends it */
export const CONNECT_COMMAND_PREFIX = `vibememory connect --cabinet ${CABINET_URL} --agent`

/** localStorage key that remembers the language the visitor picked explicitly */
export const LANG_STORAGE_KEY = 'vibememory.lang'
