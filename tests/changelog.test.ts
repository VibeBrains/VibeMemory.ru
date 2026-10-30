import { describe, expect, test } from 'bun:test'
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join } from 'node:path'
import type { Lang } from '@vibebrains/site-kit/languages'
import ru from '../src/locales/ru.json'
import en from '../src/locales/en.json'
import {
  changelogArchivePath,
  changelogKeys,
  changelogRecords,
  recordPath,
  type ChangelogRecord,
} from '../src/changelog/records'

/*
 * The public changelog: the static JSON contract of the CLI, the pages built from the same records,
 * the landing section with the three latest records, and no link to the closed code repository
 */

const ROOT = join(import.meta.dir, '..')
const DIST = join(ROOT, 'dist')

const EXPECTED_IDS = ['0.14.1', '0.14.0', '0.13.5', '0.13.4', '0.13.3', '0.13.2', '0.13.1']
const LANGS: readonly Lang[] = ['ru', 'en']

const readDist = (path: string): string => readFileSync(join(DIST, path), 'utf8')

/** Page address as a built file under dist/ */
const distFile = (urlPath: string): string => join(urlPath, 'index.html')

/** Text nodes are escaped in HTML; catalog lines are matched the same way */
const escapeHtml = (text: string): string =>
  text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

interface ContractRecord {
  id: string
  date: string
  url: string
  ru: { title: string; summary: string; details: string[] }
  en: { title: string; summary: string; details: string[] }
}

const contract = (): { records: ContractRecord[] } =>
  JSON.parse(readDist(join('changelog', 'index.json'))) as { records: ContractRecord[] }

const catalogTexts = (record: ChangelogRecord, lang: Lang) => {
  const catalog = lang === 'en' ? en : ru
  const keys = changelogKeys[record.id]
  return {
    title: catalog[keys.title],
    summary: catalog[keys.summary],
    details: catalog[keys.details].split('\n'),
  }
}

describe('json contract', () => {
  test('the site is built before this check', () => {
    expect(existsSync(join(DIST, 'changelog', 'index.json'))).toBe(true)
  })

  test('records are the three public releases, newest first', () => {
    const { records } = contract()
    expect(records.map((record) => record.id)).toEqual(EXPECTED_IDS)
    expect(changelogRecords.map((record) => record.id)).toEqual(EXPECTED_IDS)
    for (const record of records) {
      expect(record.id).toMatch(/^\d+\.\d+\.\d+$/)
      expect(record.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(record.url).toBe(`/changelog/${record.id}/`)
    }
    const dates = records.map((record) => record.date)
    expect(dates).toEqual([...dates].sort().reverse())
  })

  test('texts are the same as the catalogs, the single source of the pages', () => {
    for (const json of contract().records) {
      const record = changelogRecords.find((entry) => entry.id === json.id)!
      for (const lang of LANGS) {
        expect(json[lang]).toEqual(catalogTexts(record, lang))
      }
    }
  })

  test('details are full user-facing points, not a stub', () => {
    for (const record of contract().records) {
      for (const lang of LANGS) {
        expect(record[lang].details.length).toBeGreaterThanOrEqual(3)
      }
    }
  })
})

describe('pages', () => {
  const pages = [
    distFile(changelogArchivePath('ru')),
    distFile(changelogArchivePath('en')),
    ...changelogRecords.flatMap((record) =>
      LANGS.map((lang) => distFile(recordPath(lang, record.id))),
    ),
  ]

  test('the archive and every record exist in both languages', () => {
    for (const page of pages) {
      expect(existsSync(join(DIST, page)), page).toBe(true)
    }
  })

  test('a record page carries the same texts as the contract', () => {
    for (const record of changelogRecords) {
      for (const lang of LANGS) {
        const html = readDist(distFile(recordPath(lang, record.id)))
        const texts = catalogTexts(record, lang)
        expect(html).toContain(escapeHtml(texts.title))
        for (const line of texts.summary.split('\n')) {
          expect(html).toContain(escapeHtml(line))
        }
        for (const line of texts.details) {
          expect(html).toContain(escapeHtml(line))
        }
      }
    }
  })

  test('an archive lists every record and links each to its page', () => {
    for (const lang of LANGS) {
      const html = readDist(distFile(changelogArchivePath(lang)))
      const links = [...html.matchAll(/href="(\/(?:en\/)?changelog\/([^"/]+))\//g)].map((match) => match[2])
      expect(links).toEqual(changelogRecords.map((record) => record.id))
      for (const record of changelogRecords) {
        expect(html).toContain(escapeHtml(catalogTexts(record, lang).title))
      }
    }
  })

  test('every page names its own language version', () => {
    for (const record of changelogRecords) {
      for (const lang of LANGS) {
        const html = readDist(distFile(recordPath(lang, record.id)))
        const other = lang === 'en' ? 'ru' : 'en'
        expect(html).toContain(`<html lang="${lang}"`)
        expect(html).toContain(`hreflang="${other}"`)
      }
    }
  })
})

describe('landing', () => {
  test('exactly the three latest records link to their pages', () => {
    const latest = EXPECTED_IDS.slice(0, 3)
    for (const lang of LANGS) {
      const html = readDist(distFile(lang === 'en' ? '/en/' : '/'))
      const links = [...html.matchAll(/href="(\/(?:en\/)?changelog\/([^"/]+))\//g)].map((match) => match[2])
      expect(links).toEqual(latest)
    }
  })

  test('the more button leads to the archive', () => {
    for (const lang of LANGS) {
      const html = readDist(distFile(lang === 'en' ? '/en/' : '/'))
      expect(html).toContain(`href="${changelogArchivePath(lang)}"`)
    }
  })
})

describe('no closed repository', () => {
  test('no built page or the JSON links to the VibeMemory code repository', () => {
    const files: string[] = []
    const walk = (dir: string): void => {
      for (const name of readdirSync(dir)) {
        const path = join(dir, name)
        if (statSync(path).isDirectory()) walk(path)
        else if (/\.(html|json)$/.test(name)) files.push(path)
      }
    }
    walk(DIST)
    expect(files.length).toBeGreaterThan(0)
    for (const file of files) {
      expect(readFileSync(file, 'utf8')).not.toContain('github.com/VibeBrains/VibeMemory')
    }
  })
})
