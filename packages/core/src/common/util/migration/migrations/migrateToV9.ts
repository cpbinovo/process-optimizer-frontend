import { ExperimentType } from 'common/types'
import { ExperimentTypeV8 } from './migrateToV8'

export const migrateToV9 = (json: ExperimentTypeV8): ExperimentType => {
  return {
    ...json,
    info: { ...json.info, dataFormatVersion: '9' },
    results: {
      ...json.results,
      next: formatNext(json.results.next),
    },
  }
}

export const formatNext = (
  next: (string | number)[] | (string | number)[][]
): (string | number)[][] => {
  const isNestedArray =
    Array.isArray(next) && next[0] !== undefined && Array.isArray(next[0])
  return isNestedArray
    ? (next as (string | number)[][])
    : ([next] as (string | number)[][])
}
