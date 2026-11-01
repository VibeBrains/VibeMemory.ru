import type { Lang } from '@vibebrains/site-kit/languages'
import ru from '../locales/ru.json'
import en from '../locales/en.json'
import type { Key } from '../i18n'

/**
 * The public changelog: record metadata plus the catalog keys that hold its texts
 * One source for the landing cards, the archive and record pages of both languages,
 * and the /changelog/index.json contract the CLI reads
 * Records are listed newest first; a new record is a new key set here and in the catalogs
 */

interface RecordKeys {
  title: Key
  summary: Key
  details: Key
}

/** Catalog keys of every public record, keyed by the release version */
export const changelogKeys: Record<string, RecordKeys> = {
  '0.14.2': { title: 'changelog.0.14.2.title', summary: 'changelog.0.14.2.summary', details: 'changelog.0.14.2.details' },
  '0.14.1': { title: 'changelog.0.14.1.title', summary: 'changelog.0.14.1.summary', details: 'changelog.0.14.1.details' },
  '0.14.0': { title: 'changelog.0.14.0.title', summary: 'changelog.0.14.0.summary', details: 'changelog.0.14.0.details' },
  '0.13.5': { title: 'changelog.0.13.5.title', summary: 'changelog.0.13.5.summary', details: 'changelog.0.13.5.details' },
  '0.13.4': { title: 'changelog.0.13.4.title', summary: 'changelog.0.13.4.summary', details: 'changelog.0.13.4.details' },
  '0.13.3': { title: 'changelog.0.13.3.title', summary: 'changelog.0.13.3.summary', details: 'changelog.0.13.3.details' },
  '0.13.2': { title: 'changelog.0.13.2.title', summary: 'changelog.0.13.2.summary', details: 'changelog.0.13.2.details' },
  '0.13.1': { title: 'changelog.0.13.1.title', summary: 'changelog.0.13.1.summary', details: 'changelog.0.13.1.details' },
}

/** Public records with their release days, newest first */
const ORDER: readonly { id: string; date: string }[] = [
  { id: '0.14.2', date: '2026-11-01' },
  { id: '0.14.1', date: '2026-10-30' },
  { id: '0.14.0', date: '2026-10-30' },
  { id: '0.13.5', date: '2026-10-27' },
  { id: '0.13.4', date: '2026-10-26' },
  { id: '0.13.3', date: '2026-10-25' },
  { id: '0.13.2', date: '2026-10-25' },
  { id: '0.13.1', date: '2026-10-23' },
]

export interface RecordTexts {
  title: string
  summary: string
  details: string[]
}

export interface ChangelogRecord {
  /** Semver of the release */
  id: string
  /** Release day, ISO */
  date: string
  /** Address of the record's own page; the base language owns the root */
  url: string
  ru: RecordTexts
  en: RecordTexts
}

const texts = (catalog: Record<Key, string>, keys: RecordKeys): RecordTexts => ({
  title: catalog[keys.title],
  summary: catalog[keys.summary],
  details: catalog[keys.details].split('\n'),
})

/** Every public record, newest first */
export const changelogRecords: ChangelogRecord[] = ORDER.map(({ id, date }) => ({
  id,
  date,
  url: `/changelog/${id}/`,
  ru: texts(ru, changelogKeys[id]),
  en: texts(en, changelogKeys[id]),
}))

/** Page address of the archive in one of the site languages */
export const changelogArchivePath = (lang: Lang): string => (lang === 'en' ? '/en/changelog/' : '/changelog/')

/** Page address of a record in one of the site languages */
export const recordPath = (lang: Lang, id: string): string =>
  lang === 'en' ? `/en/changelog/${id}/` : `/changelog/${id}/`
