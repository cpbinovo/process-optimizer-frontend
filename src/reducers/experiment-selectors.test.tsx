import { initialState, State } from '../store'
import { selectId, selectIsInitializing } from './experiment-selectors'

describe('Experiment selectors', () => {
  let state: State
  beforeEach(() => {
    state = JSON.parse(JSON.stringify(initialState))
  })

  it('should select ID', () => {
    state.experiment.id = '123'
    expect(selectId(state)).toEqual('123')
  })

  describe('selectIsInitializing', () => {
    it('should return true if dataPoints.length < number of points', () => {
      state.experiment.dataPoints = []
      state.experiment.optimizerConfig.initialPoints = 3
      expect(selectIsInitializing(state)).toBeTruthy()
    })

    it('should return true if number of points is zero', () => {
      state.experiment.optimizerConfig.initialPoints = 0
      expect(selectIsInitializing(state)).toBeTruthy()
    })

    it('should return false if dataPoints.length >= number of points', () => {
      state.experiment.dataPoints = [[], [], []]
      state.experiment.optimizerConfig.initialPoints = 3
      expect(selectIsInitializing(state)).toBeFalsy()
    })
  })
})
