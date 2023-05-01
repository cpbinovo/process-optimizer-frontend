import { ExperimentType } from 'common'
import { emptyExperiment } from './store'
import { validationReducer } from './validation-reducer'

const exp: ExperimentType = {
  ...emptyExperiment,
  dataPoints: [
    {
      meta: {
        id: 1,
        enabled: true,
        valid: true,
      },
      data: [
        {
          type: 'numeric',
          name: 'Water',
          value: 100,
        },
      ],
    },
    {
      meta: {
        id: 2,
        enabled: true,
        valid: true,
      },
      data: [
        {
          type: 'numeric',
          name: 'Water',
          value: 100,
        },
      ],
    },
  ],
}

describe('validationReducer', () => {
  it('should not invalidate data points with no violations', () => {
    const validatedExperiment = validationReducer(exp, {
      dataPointsUndefined: [],
      duplicateVariableNames: [],
      lowerBoundary: [],
      upperBoundary: [],
      duplicateDataPointIds: [],
      categoricalValues: [],
      dataPointsNumericType: [],
    })
    expect(validatedExperiment.dataPoints[0]?.meta.valid).toBeTruthy()
    expect(validatedExperiment.dataPoints[1]?.meta.valid).toBeTruthy()
  })

  it('should invalidate data points with undefined properties', () => {
    const validatedExperiment = validationReducer(exp, {
      dataPointsUndefined: [1],
      duplicateVariableNames: [],
      lowerBoundary: [],
      upperBoundary: [],
      duplicateDataPointIds: [],
      categoricalValues: [],
      dataPointsNumericType: [],
    })
    expect(validatedExperiment.dataPoints[0]?.meta.valid).toBeFalsy()
    expect(validatedExperiment.dataPoints[1]?.meta.valid).toBeTruthy()
  })

  it('should invalidate data points with lower boundary violations', () => {
    const validatedExperiment = validationReducer(exp, {
      dataPointsUndefined: [],
      duplicateVariableNames: [],
      lowerBoundary: [1],
      upperBoundary: [],
      duplicateDataPointIds: [],
      categoricalValues: [],
      dataPointsNumericType: [],
    })
    expect(validatedExperiment.dataPoints[0]?.meta.valid).toBeFalsy()
    expect(validatedExperiment.dataPoints[1]?.meta.valid).toBeTruthy()
  })

  it('should invalidate data points with upper boundary violations', () => {
    const validatedExperiment = validationReducer(exp, {
      dataPointsUndefined: [],
      duplicateVariableNames: [],
      lowerBoundary: [],
      upperBoundary: [1],
      duplicateDataPointIds: [],
      categoricalValues: [],
      dataPointsNumericType: [],
    })
    expect(validatedExperiment.dataPoints[0]?.meta.valid).toBeFalsy()
    expect(validatedExperiment.dataPoints[1]?.meta.valid).toBeTruthy()
  })

  it('should invalidate data points with duplicate ids', () => {
    const validatedExperiment = validationReducer(
      {
        ...exp,
        dataPoints: [
          {
            meta: {
              id: 1,
              enabled: true,
              valid: true,
            },
            data: [
              {
                type: 'numeric',
                name: 'Water',
                value: 100,
              },
            ],
          },
          {
            meta: {
              id: 1,
              enabled: true,
              valid: true,
            },
            data: [
              {
                type: 'numeric',
                name: 'Water',
                value: 100,
              },
            ],
          },
        ],
      },
      {
        dataPointsUndefined: [],
        duplicateVariableNames: [],
        lowerBoundary: [],
        upperBoundary: [],
        duplicateDataPointIds: [1],
        categoricalValues: [],
        dataPointsNumericType: [],
      }
    )
    expect(validatedExperiment.dataPoints[0]?.meta.valid).toBeFalsy()
    expect(validatedExperiment.dataPoints[1]?.meta.valid).toBeFalsy()
  })

  it('should invalidate all data points when there are duplicate variable names', () => {
    const validatedExperiment = validationReducer(exp, {
      dataPointsUndefined: [],
      duplicateVariableNames: [],
      lowerBoundary: [],
      upperBoundary: [],
      duplicateDataPointIds: [1, 2],
      categoricalValues: [],
      dataPointsNumericType: [],
    })
    expect(validatedExperiment.dataPoints[0]?.meta.valid).toBeFalsy()
    expect(validatedExperiment.dataPoints[1]?.meta.valid).toBeFalsy()
  })

  it('should invalidate data points with no corresponding categorical option', () => {
    const validatedExperiment = validationReducer(exp, {
      dataPointsUndefined: [],
      duplicateVariableNames: [],
      lowerBoundary: [],
      upperBoundary: [],
      duplicateDataPointIds: [],
      categoricalValues: [1],
      dataPointsNumericType: [],
    })
    expect(validatedExperiment.dataPoints[0]?.meta.valid).toBeFalsy()
    expect(validatedExperiment.dataPoints[1]?.meta.valid).toBeTruthy()
  })

  it('should invalidate discrete data points with continuous values', () => {
    const validatedExperiment = validationReducer(exp, {
      dataPointsUndefined: [],
      duplicateVariableNames: [],
      lowerBoundary: [],
      upperBoundary: [],
      duplicateDataPointIds: [],
      categoricalValues: [],
      dataPointsNumericType: [1],
    })
    expect(validatedExperiment.dataPoints[0]?.meta.valid).toBeFalsy()
    expect(validatedExperiment.dataPoints[1]?.meta.valid).toBeTruthy()
  })
})
