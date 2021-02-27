import {makeStyles} from "@material-ui/core/styles";
import {useEffect, useState} from "react";
import {
    Button,
    Container, FormControl, Grid, Input, InputLabel,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer, TableFooter,
    TableHead, TablePagination,
    TableRow,
    TextField
} from "@material-ui/core";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import httpclient from "../httpclient";
import {receivePeople} from "../actions/person";
import {connect} from "react-redux";
import {useHistory} from "react-router-dom";
import {receiveSignals} from "../actions/signals";

const styles = makeStyles(theme => ({
    row: {
        '&:hover': {
            cursor: 'pointer',
            background: '#AAA'
        }
    },
    tableHeadRow: {
        fontWeight: 'bolder'
    },
    container: {
        padding: '25px',
        marginBottom: '25px'
    }
}));

const Signals = props => {
    const classes = styles();
    const { signals } = props;
    const history = useHistory();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        props.fetchSignals();
    }, []);

    const handlePageChange = (_, newPage) => setPage(newPage);

    const handleRowsPerPageChange = event => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
    };

    const handleManageSignal = signalId => history.push(`/signals/${signalId}`);

    const handleChangeName = event => setName(event.target.value);

    const handleChangeDescription = event => setDescription(event.target.value);

    const handleCreateSignal = () => props.createSignal({description: description, name: name}, () => props.fetchSignals());

    return (
        <div>
            <Grid container component={Paper} className={classes.container}>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="name">Name</InputLabel>
                        <Input
                            id="name"
                            value={name}
                            onChange={handleChangeName}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <InputLabel htmlFor="description">Description</InputLabel>
                        <Input
                            id="description"
                            value={description}
                            onChange={handleChangeDescription}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleCreateSignal}>Create</Button>
                </Grid>
            </Grid>

            <TableContainer component={Paper} className={classes.container}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell className={classes.tableHeadRow}>ID</TableCell>
                            <TableCell className={classes.tableHeadRow}>Name</TableCell>
                            <TableCell className={classes.tableHeadRow}>Description</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {signals ? (rowsPerPage > 0 ? signals.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : signals)
                            .map(signal => (
                                <TableRow
                                    key={signal.id.toString()}
                                    className={classes.row}
                                    onClick={handleManageSignal.bind(null, signal.id)}
                                >
                                    <TableCell>{signal.id}</TableCell>
                                    <TableCell>{signal.name}</TableCell>
                                    <TableCell>{signal.description}</TableCell>
                                </TableRow>
                            )) : null}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={4}
                                count={signals.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                SelectProps={{
                                    inputProps: { 'aria-label': 'rows per page' },
                                    native: true,
                                }}
                                onChangePage={handlePageChange}
                                onChangeRowsPerPage={handleRowsPerPageChange}
                                ActionsComponent={TablePaginationActions}
                            />
                        </TableRow>
                    </TableFooter>
                </Table>
            </TableContainer>
        </div>
    );
};

const mapStateToProps = state => ({
    signals: state.signals
});

const mapDispatchToProps = dispatch => ({
    fetchSignals: () => {
        httpclient.fetch('/api/signals')
            .then(resp => resp.json())
            .then(signals => dispatch(receiveSignals(signals)));
    },

    createSignal: (signal, callback) => {
        let request = httpclient.fetch('/api/signals', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(signal)
        });
        if (callback) request.then(callback);
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Signals);