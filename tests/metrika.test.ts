import { describe, expect, test } from 'bun:test'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { metrika } from '../src/config/site'

/*
 * Yandex Metrika: with no counter number the pages carry nothing of it,
 * and every goal set in the markup is described in the manual that is used to create the goals in Metrika
 */

const ROOT = join(import.meta.dir, '..')
const PAGES = ['index.html', 'en/index.html'].map((page) => join(ROOT, 'dist', page))
const MANUAL = readFileSync(join(ROOT, 'docs/manuals/metrikaGoals.md'), 'utf8')

describe('metrika', () => {
  test('the site is built before this check', () => {
    expect(PAGES.every((page) => existsSync(page))).toBe(true)
  })

  test('the counter number is empty or digits', () => {
    expect(metrika.counterId).toMatch(/^\d*$/)
  })

  test('without a counter number there is no banner, no tag and no request to Yandex', () => {
    if (metrika.counterId !== '') return
    for (const page of PAGES) {
      const html = readFileSync(page, 'utf8')
      expect(html).not.toContain('data-metrika')
      expect(html).not.toContain('mc.yandex')
      expect(html).not.toContain('data-cookie-accept')
    }
  })

  test('the tag is never linked from the page: only the consent loads it', () => {
    for (const page of PAGES) {
      const html = readFileSync(page, 'utf8')
      expect(html).not.toMatch(/<(?:script|link|img)[^>]+(?:src|href)="[^"]*mc\.yandex/)
    }
  })

  test('every goal in the markup is described in the manual', () => {
    const goals = new Set<string>()
    for (const page of PAGES) {
      for (const match of readFileSync(page, 'utf8').matchAll(/data-goal="([^"]+)"/g)) goals.add(match[1] ?? '')
    }
    expect(goals.size).toBeGreaterThan(0)
    expect([...goals].filter((goal) => !MANUAL.includes(`\`${goal}\``))).toEqual([])
  })
})
