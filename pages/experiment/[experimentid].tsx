import { useRouter } from 'next/router'
import useSwr from "swr";
import { Card, CardContent, Grid, TextareaAutosize, TextField, Typography } from '@material-ui/core'
import Layout from '../../components/layout'
import { useStyles } from '../../styles/experiment.style';
import { useForm } from "react-hook-form";
import VariableCategorical from '../../components/variable-categorical';
import Variablevalue from '../../components/variable-value';

const fetcher = async (url: string) => (await fetch(url)).json();

type Inputs = {
  name: string,
  description: string,
};

export default function Experiment() {
  const router = useRouter()
  const { experimentid } = router.query
  const { data: experiment, error } = useSwr(`/api/experiment/${experimentid}`, fetcher);
  const classes = useStyles();
  const { register, handleSubmit, watch, errors } = useForm<Inputs>();
  const onSubmit = async (data: Inputs) => fetch(`/api/experiment/${experimentid}`, {method: 'PUT', body: JSON.stringify(data)})

  if (error) return <div>Failed to load experiment</div>;
  if (!experiment) return <div>Loading...</div>;

  return (
    <Layout>
      <Card className={classes.experimentContainer}>
        <CardContent>

          <Grid container spacing={3}>
            <Grid item xs={4}>
              <Typography variant="h4" gutterBottom>
                Experiment {experiment.id} - {experiment.name} 
              </Typography>
              <form onSubmit={handleSubmit(onSubmit)}>
                <TextField name="name" label="Name" required inputRef={register}/>
                <br/>
                <br/>
                <TextField
                  name="description"
                  label="Description"
                  required
                  inputRef={register}
                />
                <br />
                <br />
                <input type="submit" />
              </form>
              <VariableCategorical onAdded={(data) => {console.log('var cat data', data)}}/>
              <Variablevalue onAdded={(data) => {console.log('var val data', data)}}/>
            </Grid>
            <Grid item xs={4}>
              Model for optimizer
            </Grid>
            <Grid item xs={4}>
              Configure optimizer
            </Grid>

          </Grid>

        </CardContent>
      </Card>
    </Layout>
  )
}