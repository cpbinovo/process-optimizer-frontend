import { initialState } from '@/context/experiment/store'
import {
  CategoricalVariableType,
  DataEntry,
  ExperimentType,
  ScoreVariableType,
  ValueVariableType,
} from '@/types/common'
import {
  calculateSpace,
  calculateData,
  dataPointsToCSV,
  csvToDataPoints,
} from './converters'

describe('converters', () => {
  const sampleDataPoints: DataEntry[] = [
    [
      { name: 'Sukker', value: 23 },
      { name: 'Peber', value: 982 },
      { name: 'Hvedemel', value: 632 },
      { name: 'Kunde', value: 'Mus' },
      { name: 'score', value: 0.1 },
    ],
    [
      { name: 'Sukker', value: 15 },
      { name: 'Peber', value: 123 },
      { name: 'Hvedemel', value: 324 },
      { name: 'Kunde', value: 'Ræv' },
      { name: 'score', value: 0.2 },
    ],
  ].map((data, idx) => ({ meta: { enabled: true, id: idx + 1 }, data }))
  const sampleMultiObjectiveDataPoints: DataEntry[] = [
    [
      { name: 'Sukker', value: 23 },
      { name: 'Peber', value: 982 },
      { name: 'Hvedemel', value: 632 },
      { name: 'Kunde', value: 'Mus' },
      { name: 'score', value: 0.1 },
      { name: 'score2', value: 0.3 },
    ],
    [
      { name: 'Sukker', value: 15 },
      { name: 'Peber', value: 123 },
      { name: 'Hvedemel', value: 324 },
      { name: 'Kunde', value: 'Ræv' },
      { name: 'score', value: 0.2 },
      { name: 'score2', value: 0.4 },
    ],
  ].map((data, idx) => ({ meta: { enabled: true, id: idx + 1 }, data }))
  const sampleExperiment: ExperimentType = {
    ...initialState.experiment,
    id: '123',
    info: {
      ...initialState.experiment.info,
      name: 'Cookies',
      description: "Bager haremus' peberkager",
    },
    categoricalVariables: [
      { name: 'Kunde', description: '', options: ['Mus', 'Ræv'] },
    ],
    valueVariables: [
      { type: 'discrete', name: 'Sukker', description: '', min: 0, max: 1000 },
      { type: 'discrete', name: 'Peber', description: '', min: 0, max: 1000 },
      {
        type: 'continuous',
        name: 'Hvedemel',
        description: '',
        min: 0.0,
        max: 1000.8,
      },
      { type: 'discrete', name: 'Mælk', description: '', min: 1, max: 999 },
    ],
    optimizerConfig: {
      baseEstimator: 'GP',
      acqFunc: 'gp_hedge',
      initialPoints: 2,
      kappa: 1.96,
      xi: 0.012,
    },
  }

  describe('calculateSpace', () => {
    it('should convert space to proper output format', () => {
      const space = calculateSpace(sampleExperiment)
      expect(space).toContainEqual({
        type: 'discrete',
        from: 0,
        name: 'Sukker',
        to: 1000,
      })
      expect(space).toContainEqual({
        type: 'continuous',
        from: 0,
        name: 'Hvedemel',
        to: 1000.8,
      })
    })

    it('should ignore decimal part of discrete variables', () => {
      const experimentWithDiscreteVariablesWithDecimalParts: ExperimentType = {
        ...sampleExperiment,
        valueVariables: [
          {
            type: 'discrete',
            name: 'DiscreteWithDecimal',
            description: '',
            min: 1.2,
            max: 5.4,
          },
        ],
      }
      const space = calculateSpace(
        experimentWithDiscreteVariablesWithDecimalParts
      )
      expect(space).toContainEqual({
        type: 'discrete',
        from: 1,
        name: 'DiscreteWithDecimal',
        to: 5,
      })
    })

    it('should retain the correct order of variables', () => {
      const space = calculateSpace(sampleExperiment)
      expect(space[0]?.name).toEqual('Sukker')
      expect(space[1]?.name).toEqual('Peber')
      expect(space[2]?.name).toEqual('Hvedemel')
      expect(space[3]?.name).toEqual('Mælk')
      expect(space[4]?.name).toEqual('Kunde')
    })
  })

  describe('calculateData', () => {
    it('should format data in proper output format', () => {
      const expectedData = [
        { xi: [23, 982, 632, 'Mus'], yi: [0.1] },
        { xi: [15, 123, 324, 'Ræv'], yi: [0.2] },
      ]
      const actualData = calculateData(
        sampleExperiment.categoricalVariables,
        sampleExperiment.valueVariables,
        sampleExperiment.scoreVariables,
        sampleDataPoints
      )
      expect(actualData).toEqual(expectedData)
    })

    it('should skip disabled data entries', () => {
      const expectedData = [
        { xi: [23, 982, 632, 'Mus'], yi: [0.1] },
        { xi: [15, 123, 324, 'Ræv'], yi: [0.2] },
      ]
      const actualData = calculateData(
        sampleExperiment.categoricalVariables,
        sampleExperiment.valueVariables,
        sampleExperiment.scoreVariables,
        sampleDataPoints.concat({
          meta: { enabled: false, id: sampleDataPoints.length },
          data: sampleDataPoints[0]?.data ?? [],
        })
      )
      expect(actualData).toEqual(expectedData)
    })

    it('should include enabled score values', () => {
      const expectedData = [
        { xi: [23, 982, 632, 'Mus'], yi: [0.1, 0.3] },
        { xi: [15, 123, 324, 'Ræv'], yi: [0.2, 0.4] },
      ]
      const actualData = calculateData(
        sampleExperiment.categoricalVariables,
        sampleExperiment.valueVariables,
        [
          { name: 'score', description: '', enabled: true },
          { name: 'score2', description: '', enabled: true },
        ],
        sampleMultiObjectiveDataPoints
      )
      expect(actualData).toEqual(expectedData)
    })

    it('should skip disabled score values', () => {
      const expectedData = [
        { xi: [23, 982, 632, 'Mus'], yi: [0.1] },
        { xi: [15, 123, 324, 'Ræv'], yi: [0.2] },
      ]
      const actualData = calculateData(
        sampleExperiment.categoricalVariables,
        sampleExperiment.valueVariables,
        [
          { name: 'score', description: '', enabled: true },
          { name: 'score2', description: '', enabled: false },
        ],
        sampleMultiObjectiveDataPoints
      )
      expect(actualData).toEqual(expectedData)
    })
  })

  describe('dataPointsToCSV', () => {
    it('should accept empty data set', () => {
      const input: DataEntry[] = []
      const expected = ''
      const actual = dataPointsToCSV(input)
      expect(actual).toEqual(expected)
    })

    it('should convert known value', () => {
      const input: DataEntry[] = [
        {
          meta: {
            enabled: true,
            id: 1,
          },
          data: [
            {
              name: 'Sukker',
              value: 28,
            },
            {
              name: 'Peber',
              value: 982,
            },
            {
              name: 'Hvedemel',
              value: 632,
            },
            {
              name: 'Kunde',
              value: 'Mus',
            },
            {
              name: 'score',
              value: [1],
            },
          ],
        },
        {
          meta: {
            enabled: false,
            id: 3,
          },
          data: [
            {
              name: 'Sukker',
              value: '15',
            },
            {
              name: 'Peber',
              value: '986',
            },
            {
              name: 'Hvedemel',
              value: '5',
            },
            {
              name: 'Kunde',
              value: 'Mus',
            },
            {
              name: 'score',
              value: '2',
            },
          ],
        },
      ]
      const expected =
        'id;Sukker;Peber;Hvedemel;Kunde;score;enabled\n1;28;982;632;Mus;1;true\n3;15;986;5;Mus;2;false'
      const actual = dataPointsToCSV(input)
      expect(actual).toEqual(expected)
    })

    it('should not sort lines according to meta.id', () => {
      const input: DataEntry[] = [
        {
          meta: {
            enabled: true,
            id: 3,
          },
          data: [
            {
              name: 'Sukker',
              value: 282,
            },
            {
              name: 'score',
              value: [2],
            },
          ],
        },
        {
          meta: {
            enabled: true,
            id: 1,
          },
          data: [
            {
              name: 'Sukker',
              value: 280,
            },
            {
              name: 'score',
              value: [0],
            },
          ],
        },
        {
          meta: {
            enabled: true,
            id: 2,
          },
          data: [
            {
              name: 'Sukker',
              value: '281',
            },
            {
              name: 'score',
              value: '1',
            },
          ],
        },
      ]
      const expected =
        'id;Sukker;score;enabled\n3;282;2;true\n1;280;0;true\n2;281;1;true'
      const actual = dataPointsToCSV(input)
      expect(actual).toEqual(expected)
    })
  })

  describe('csvToDataPoints', () => {
    const categorialVariables: CategoricalVariableType[] = [
      {
        name: 'Kunde',
        description: '',
        options: ['Mus', 'Ræv'],
      },
    ]
    const valueVariables: ValueVariableType[] = [
      {
        name: 'Sukker',
        description: '',
        min: 0,
        max: 1000,
        type: 'discrete',
      },
      {
        name: 'Peber',
        description: '',
        min: 0,
        max: 1000,
        type: 'continuous',
      },
      {
        name: 'Hvedemel',
        description: '',
        min: 0,
        max: 1000,
        type: 'continuous',
      },
    ]
    const scoreVariables: ScoreVariableType[] = [
      { name: 'score', description: '', enabled: true },
    ]

    const sampleDataPoints: DataEntry[] = [
      {
        meta: { enabled: true, id: 1 },
        data: [
          {
            name: 'Sukker',
            value: 28,
          },
          {
            name: 'Peber',
            value: 982,
          },
          {
            name: 'Hvedemel',
            value: 632,
          },
          {
            name: 'Kunde',
            value: 'Mus',
          },
          {
            name: 'score',
            value: 1,
          },
        ],
      },
      {
        meta: { enabled: false, id: 2 },
        data: [
          {
            name: 'Sukker',
            value: 15,
          },
          {
            name: 'Peber',
            value: 986,
          },
          {
            name: 'Hvedemel',
            value: 5,
          },
          {
            name: 'Kunde',
            value: 'Mus',
          },
          {
            name: 'score',
            value: 2,
          },
        ],
      },
    ]

    it('should accept empty data string', () => {
      const input = ''
      const expected: DataEntry[] = []
      const actual = csvToDataPoints(input, [], [], [])
      expect(actual).toEqual(expected)
    })

    it('should convert known value', () => {
      const input =
        'id;Sukker;Peber;Hvedemel;Kunde;score;enabled\n1;28;982;632;Mus;1;true\n2;15;986;5;Mus;2;false'
      const expected = sampleDataPoints
      const actual = csvToDataPoints(
        input,
        valueVariables,
        categorialVariables,
        scoreVariables
      )
      expect(actual).toEqual(expected)
    })

    it('should use ID column from CSV', () => {
      const input =
        'id;Sukker;Peber;Hvedemel;Kunde;score;enabled\n42;28;982;632;Mus;1;true\n16;15;986;5;Mus;2;false'
      const ids = [42, 16]
      const expected = sampleDataPoints.map((dp, idx) => ({
        ...dp,
        meta: { ...dp.meta, id: ids[idx] },
      }))
      const actual = csvToDataPoints(
        input,
        valueVariables,
        categorialVariables,
        scoreVariables
      )
      expect(actual).toEqual(expected)
    })

    it('should fail if duplicate ids are supplied', () => {
      const input =
        'id;Sukker;Peber;Hvedemel;Kunde;score;enabled\n2;28;982;632;Mus;1;true\n2;15;986;5;Mus;2;false'
      expect(() =>
        csvToDataPoints(
          input,
          valueVariables,
          categorialVariables,
          scoreVariables
        )
      ).toThrowErrorMatchingSnapshot()
    })

    it('should work with no meta data columns (ID is generated based on line order)', () => {
      const input =
        'Sukker;Peber;Hvedemel;Kunde;score\n28;982;632;Mus;1\n15;986;5;Mus;2'
      const expected = sampleDataPoints.map((dp, idx) => ({
        ...dp,
        meta: { enabled: true, id: idx + 1 },
      }))
      const actual = csvToDataPoints(
        input,
        valueVariables,
        categorialVariables,
        scoreVariables
      )
      expect(actual).toEqual(expected)
    })

    it('should accept shuffled columns', () => {
      const input =
        'Sukker;score;id;Hvedemel;enabled;Peber;Kunde\n28;1;1;632;true;982;Mus\n15;2;2;5;false;986;Mus'
      const expected = sampleDataPoints
      const actual = csvToDataPoints(
        input,
        valueVariables,
        categorialVariables,
        scoreVariables
      )
      expect(actual).toEqual(expected)
    })

    it('should fail if header is missing', () => {
      const input = 'Sukker;Hvedemel;Kunde;score\n28;632;Mus;1\n15;5;Mus;2'
      expect(() =>
        csvToDataPoints(
          input,
          valueVariables,
          categorialVariables,
          scoreVariables
        )
      ).toThrowErrorMatchingSnapshot()
    })

    it('should not fail if there are extra headers', () => {
      const input =
        'Sukker;Peber;Hvedemel;Halm;Kunde;score\n28;982;632;007;Mus;1\n15;986;5;008;Mus;2'
      const expected = sampleDataPoints.map(d => d.data)
      const actual = csvToDataPoints(
        input,
        valueVariables,
        categorialVariables,
        scoreVariables
      ).map(d => d.data)
      expect(actual).toEqual(expected)
    })

    it('should add extra headers to meta', () => {
      const input =
        'Sukker;Peber;Hvedemel;Halm;Kunde;score;enabled\n28;982;632;008;Mus;1;true\n15;986;5;008;Mus;2;false'
      const expected = sampleDataPoints.map(d => ({
        ...d,
        meta: { ...d.meta, halm: '008' },
      }))
      const actual = csvToDataPoints(
        input,
        valueVariables,
        categorialVariables,
        scoreVariables
      )
      expect(actual).toEqual(expected)
    })

    it('should parse optional meta data field (description)', () => {
      const input =
        'id;Sukker;Peber;Hvedemel;Kunde;score;enabled;description\n1;28;982;632;Mus;1;true;I am a description\n2;15;986;5;Mus;2;false;I am also a description'
      const actual = csvToDataPoints(
        input,
        valueVariables,
        categorialVariables,
        scoreVariables
      )
      expect(actual.length).toEqual(2)
      expect(actual[0]?.meta.description).toEqual('I am a description')
      expect(actual[1]?.meta.description).toEqual('I am also a description')
    })
  })
})
