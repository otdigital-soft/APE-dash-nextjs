import { monthsSimple } from '@/lib/utils'
import { faker } from '@faker-js/faker'

export const chartColorOptions = ['#CD9D43', '#826AF9', '#20CB27', '#DD4444', '#CA43CD', '#8843CD']
export const singleLine = (labels = monthsSimple) => {
  return [
    {
      data: labels.map(() => faker.number.int({ min: 1, max: 10 })),
      borderColor: '#CD9D43',
      pointBackgroundColor: 'transparent',
      pointBorderColor: 'transparent',
      pointRadius: 10,
      lineTension: 0.5
    }
  ]
}

export const multiLine = (legends: string[], labels = monthsSimple, colors = chartColorOptions) => {
  return legends.map((legend, i) => {
    return {
      label: legend,
      data: labels.map(() => faker.number.int({ min: 1, max: 5 })),
      borderColor: colors[i],
      pointBackgroundColor: 'transparent',
      pointBorderColor: 'transparent',
      pointRadius: 10,
      lineTension: 0.5
    }
  })
}
