import {
  useSelector,
  useExperiment,
} from '@boostv/process-optimizer-frontend-core'
import { TitleCard } from '@boostv/process-optimizer-frontend-ui'
import { Suggestions } from '@boostv/process-optimizer-frontend-ui'
import { SingleDataPoint } from '@boostv/process-optimizer-frontend-ui'
import { Tooltip, IconButton, Hidden, Box } from '@mui/material'
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap'
import { useGlobal } from '@sample/context/global'
import { isUIBig } from '@sample/utility/ui-util'
import useStyles from './experimentation-guide.style'
import { NextExperiments } from '@boostv/process-optimizer-frontend-ui'
import { InitializationProgress } from '@boostv/process-optimizer-frontend-ui'
import { selectIsInitializing } from '@boostv/process-optimizer-frontend-core'

interface ResultDataProps {
  nextValues: string[][]
  headers: string[]
  expectedMinimum?: any[][]
  onMouseEnterExpand?: () => void
  onMouseLeaveExpand?: () => void
}

export const ExperimentationGuide = (props: ResultDataProps) => {
  const {
    nextValues,
    headers,
    expectedMinimum,
    onMouseEnterExpand,
    onMouseLeaveExpand,
  } = props
  const { classes } = useStyles()
  const {
    state: { uiSizes },
    dispatch,
  } = useGlobal()
  const {
    state: { experiment },
    dispatch: dispatchExperiment,
  } = useExperiment()

  const isInitializing = useSelector(selectIsInitializing)
  const summary = isInitializing ? (
    <InitializationProgress
      experiment={experiment}
      onInitialPointsChange={initialPoints =>
        dispatchExperiment({
          type: 'updateConfiguration',
          payload: { ...experiment.optimizerConfig, initialPoints },
        })
      }
    />
  ) : expectedMinimum && expectedMinimum.length > 0 ? (
    <Box pt={2} pl={2} pr={2} className={classes.extrasContainer}>
      <SingleDataPoint
        title="Expected minimum"
        headers={headers}
        dataPoint={expectedMinimum ?? []}
      />
    </Box>
  ) : (
    <div>Please run experiment</div>
  )
  return (
    <TitleCard
      padding={0}
      title={
        <>
          Experimentation guide
          <Hidden xlDown>
            <Tooltip
              title={
                (isUIBig(uiSizes, 'result-data') ? 'Collapse' : 'Expand') +
                " 'Result data' and 'Data points'"
              }
            >
              <IconButton
                size="small"
                className={classes.titleButton}
                onClick={() =>
                  dispatch({
                    type: 'toggleUISize',
                    payload: 'result-data',
                  })
                }
                onMouseEnter={() => onMouseEnterExpand?.()}
                onMouseLeave={() => onMouseLeaveExpand?.()}
              >
                <ZoomOutMapIcon
                  fontSize="small"
                  className={classes.titleIcon}
                />
              </IconButton>
            </Tooltip>
          </Hidden>
        </>
      }
    >
      <Box p={2}>
        {!isInitializing && (
          <NextExperiments
            experiment={experiment}
            onSuggestionChange={suggestionCount =>
              dispatchExperiment({
                type: 'updateSuggestionCount',
                payload: suggestionCount,
              })
            }
            onXiChange={xi =>
              dispatchExperiment({
                type: 'updateConfiguration',
                payload: {
                  ...experiment.optimizerConfig,
                  xi,
                },
              })
            }
          />
        )}
        {!nextValues ||
          (nextValues.length === 0 && (
            <div>Please run experiment to calculate suggestions</div>
          ))}
        <Suggestions values={nextValues} headers={headers} />
      </Box>
      {summary}
    </TitleCard>
  )
}