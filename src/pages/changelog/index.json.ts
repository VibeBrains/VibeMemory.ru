import type { APIRoute } from 'astro'
import { changelogRecords } from '../../changelog/records'

/**
 * The public changelog as static JSON: the one contract the CLI reads,
 * so the release list is available without scraping HTML
 * The records are the same source the landing, the archive and the record pages render
 */
export const GET: APIRoute = () =>
  new Response(`${JSON.stringify({ records: changelogRecords }, null, 2)}\n`, {
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
