import { Box, Button, TextField } from '@material-ui/core'
import { useForm } from 'react-hook-form';
import useStyles from '../styles/value-variable.style';
import { ValueVariableType } from '../types/common';

type ValueVariableProps = {
  isDisabled: boolean
  type: 'discrete' | 'continuous'
  onAdded: (data: ValueVariableType) => void
}

export default function ValueVariable(props: ValueVariableProps) {
  const { type, isDisabled, onAdded } = props
  const classes = useStyles()

  const { register, handleSubmit, reset, watch, errors } = useForm<ValueVariableType>();
  const onSubmit = async (data: ValueVariableType) => {
    onAdded(data)
    reset()
  }

  return (
      <>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            fullWidth
            margin="dense"
            name="name" 
            label="Name" 
            inputRef={register}
            />
          <TextField
            fullWidth
            margin="dense"
            name="description"
            label="Description"
            inputRef={register}
          />
          <Box mb={2} className={classes.narrowInputContainer}>
            <Box className={classes.narrowInput} pr={1}>
              <TextField
                fullWidth
                margin="dense"
                name="minVal"
                label="minVal"
                inputRef={register}
              />
            </Box>
            <Box className={classes.narrowInput}>
              <TextField
                fullWidth
                margin="dense"
                name="maxVal"
                label="maxVal"
                inputRef={register}
              />
            </Box>
          </Box>
          <Button size="small" disabled={isDisabled} variant="outlined" type="submit">Add variable</Button>
        </form>
      </>
  )
}