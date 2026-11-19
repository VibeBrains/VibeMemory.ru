import { describe, expect, test } from 'bun:test'
import { localLicense, plans } from '../src/config/pricing'

/*
 * Тарифы и локальная версия: цены на лендинге — обещание продавца банку,
 * поэтому список ступеней и ключевые цены закреплены тестом
 */

describe('plans', () => {
  test('девять тарифов от бесплатных 50 МБ до 5 ГБ', () => {
    expect(plans.map((plan) => plan.id)).toEqual([
      'free',
      'mb200',
      'mb300',
      'mb500',
      'gb1',
      'gb2',
      'gb3',
      'gb4',
      'gb5',
    ])
  })

  test('цена 4 ГБ — 1400 ₽ за команду в месяц', () => {
    const gb4 = plans.find((plan) => plan.size === 4 && plan.unit === 'gb')
    expect(gb4?.priceRub).toBe(1400)
  })

  test('метка выгодной ступени стоит только у 500 МБ, 3 ГБ и 5 ГБ', () => {
    expect(plans.filter((plan) => plan.best === true).map((plan) => plan.id)).toEqual(['mb500', 'gb3', 'gb5'])
  })
})

describe('localLicense', () => {
  test('локальная версия продаётся разово, обновления и устройства берутся из этих чисел', () => {
    expect(localLicense).toEqual({ priceRub: 15000, updatesMonths: 12, devices: 3 })
  })
})
