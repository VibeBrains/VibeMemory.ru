/** Storage unit a plan is sold in; the label comes from the catalog */
export type SizeUnit = 'mb' | 'gb'

export interface Plan {
  readonly id: string
  readonly size: number
  readonly unit: SizeUnit
  /** Monthly price for the whole team in rubles; 0 is the free plan */
  readonly priceRub: number
  /** Лучшая цена за объём рядом с соседями: карточка получает метку «Выгодно» */
  readonly best?: true
}

/** Price is per team per month; the number of people in a team is not limited */
export const plans: readonly Plan[] = [
  { id: 'free', size: 50, unit: 'mb', priceRub: 0 },
  { id: 'mb200', size: 200, unit: 'mb', priceRub: 100 },
  { id: 'mb300', size: 300, unit: 'mb', priceRub: 150 },
  // 500 МБ выгоднее соседних 300 МБ и 1 ГБ в пересчёте на мегабайт
  { id: 'mb500', size: 500, unit: 'mb', priceRub: 200, best: true },
  { id: 'gb1', size: 1, unit: 'gb', priceRub: 350 },
  { id: 'gb2', size: 2, unit: 'gb', priceRub: 700 },
  // 3 ГБ выгоднее соседних 2 и 4 ГБ в пересчёте на гигабайт
  { id: 'gb3', size: 3, unit: 'gb', priceRub: 800, best: true },
  { id: 'gb4', size: 4, unit: 'gb', priceRub: 1400 },
  // 5 ГБ выгоднее соседних 4 ГБ в пересчёте на гигабайт
  { id: 'gb5', size: 5, unit: 'gb', priceRub: 1500, best: true },
]

/**
 * Локальная версия продаётся разово, а не по подписке: числа живут здесь, чтобы тексты не расходились с ценой
 * Обновления приходят ограниченное время, купленная версия после этого продолжает работать
 */
export const localLicense = {
  priceRub: 15000,
  updatesMonths: 12,
  devices: 3,
} as const

/**
 * A measured project of the owner's store (26.09.2026): what its memory and its sessions weigh on the server, sessions
 * as git keeps them — compressed. The page shows it so a team knows the price of the sessions switch before it flips it
 */
export const weightExample = { memoryMb: 0.9, sessionsMb: 300 } as const
