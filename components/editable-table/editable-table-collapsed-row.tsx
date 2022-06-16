import useStyles from './editable-table-collapsed-row.style'
import { IconButton, TableCell, TableRow, Tooltip } from '@material-ui/core'
import { TableDataRow } from '../../types/common'
import { EditableTableCell } from './editable-table-cell'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'

interface EditableTableCollapsedRowProps {
  colSpan: number
  rowId: number
  tableRow: TableDataRow
  setExpanded: (expanded: boolean) => void
  onDelete: () => void
}

export const EditableTableCollapsedRow = ({
  colSpan,
  rowId,
  tableRow,
  setExpanded,
  onDelete,
}: EditableTableCollapsedRowProps) => {
  const classes = useStyles()

  return (
    <TableRow className={classes.row}>
      {tableRow.isNew ? (
        <>
          <TableCell
            style={{
              // background: 'brown',
              border: 'none',
              width: 8,
            }}
          />
          <TableCell align="right" colSpan={colSpan} className={classes.newRow}>
            <Tooltip title="Add data point">
              <IconButton
                size="small"
                aria-label="expand"
                onClick={() => setExpanded(true)}
              >
                <AddIcon fontSize="small" color="primary" />
              </IconButton>
            </Tooltip>
          </TableCell>
          <TableCell className={classes.emptyCell} />
        </>
      ) : (
        <>
          <TableCell className={classes.emptyCell} />
          <TableCell className={classes.cell}>{rowId}</TableCell>
          {tableRow.dataPoints.map((item, itemIndex) => (
            <>
              <EditableTableCell
                key={'editablecell' + itemIndex}
                value={item.value}
                isEditMode={false}
                options={item.options}
                tooltip={item.tooltip}
              />
            </>
          ))}
          <TableCell className={classes.editCell}>
            <div className={classes.buttonContainer}>
              <Tooltip title="Edit">
                <IconButton
                  size="small"
                  aria-label="expand"
                  onClick={() => setExpanded(true)}
                >
                  <EditIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  aria-label="delete"
                  onClick={() => onDelete()}
                >
                  <DeleteIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            </div>
          </TableCell>
          <TableCell className={classes.emptyCell} />
        </>
      )}
    </TableRow>
  )
}
