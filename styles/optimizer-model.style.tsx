import { makeStyles } from "@material-ui/core";
import { grey } from "@material-ui/core/colors";

export const useStyles = makeStyles(theme => ({
  customCardContent: {
    padding: 0,
    '&:last-child': {
      paddingBottom: 0,  
    }
  },
  editBox: {
    background: grey[100],
  }
}));

export default useStyles