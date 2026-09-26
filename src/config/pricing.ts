/** Storage unit a plan is sold in; the label comes from the catalog */
export type SizeUnit = 'mb' | 'gb'

export interface Plan {
  readonly id: string
  readonly size: number
  readonly unit: SizeUnit
  /** Monthly price for the whole team in rubles; 0 is the free plan */
  readonly priceRub: number
}

/** Price is per team per month; the number of people in a team is not limited */
export const plans: readonly Plan[] = [
  { id: 'free', size: 50, unit: 'mb', priceRub: 0 },
  { id: 'mb200', size: 200, unit: 'mb', priceRub: 100 },
  { id: 'mb300', size: 300, unit: 'mb', priceRub: 150 },
  { id: 'mb500', size: 500, unit: 'mb', priceRub: 200 },
  { id: 'gb1', size: 1, unit: 'gb', priceRub: 350 },
]
