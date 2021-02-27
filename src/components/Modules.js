import {makeStyles} from "@material-ui/core/styles";
import {useParams} from "react-router";
import {useEffect, useState} from "react";
import httpclient from "../httpclient";
import {receiveModules} from "../actions/module";
import {connect} from "react-redux";
import {useHistory} from "react-router-dom";
import {
    Button,
    FormControl, FormHelperText,
    Grid, Input, InputLabel,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow, TextField
} from "@material-ui/core";
import TablePaginationActions from "@material-ui/core/TablePagination/TablePaginationActions";
import {receiveSignals} from "../actions/signals";
import {Autocomplete} from "@material-ui/lab";

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
    },
    divider: {
        marginTop: '25px'
    },
    headerCell: {
        fontWeight: 'bold'
    },
    container: {
        padding: '25px',
        marginBottom: '25px'
    }
}));

const Modules = props => {
    const { modules, signals } = props;
    const classes = styles();
    const history = useHistory();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [signal, setSignal] = useState(null);

    useEffect(() => {
        props.fetchModules();
        props.fetchSignals();
    }, []);

    const handlePageChange = (_, newPage) => setPage(newPage);

    const handleRowsPerPageChange = event => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
    }

    const handleManageModule = moduleId => history.push(`/modules/${moduleId}`);

    const handleChangeName = event => setName(event.target.value);

    const handleChangeDescription = event => setDescription(event.target.value);

    const handleChangeSignal = (_, value) => setSignal(value);

    const handleCreateModule = () => props.createModule(
        {description: description, name: name, signal: signal},
        () => props.fetchModules()
    );

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
                    <FormHelperText>Signal</FormHelperText>
                    <Autocomplete
                        options={signals ? signals : []}
                        value={signal}
                        getOptionLabel={signal => `${signal.id} - ${signal.name}`}
                        getOptionSelected={(option, value) => option.id === value.id}
                        onChange={handleChangeSignal}
                        renderInput={params => <TextField {...params} />}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleCreateModule}>Create</Button>
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
                        {modules ? (rowsPerPage > 0 ? modules.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : modules)
                            .map(_module => (
                                <TableRow
                                    key={_module.id.toString()}
                                    className={classes.row}
                                    onClick={handleManageModule.bind(null, _module.id)}
                                >
                                    <TableCell>{_module.id}</TableCell>
                                    <TableCell>{_module.name}</TableCell>
                                    <TableCell>{_module.description}</TableCell>
                                </TableRow>
                            )) : null}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={4}
                                count={modules.length}
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
    modules: state.modules,
    signals: state.signals
});

const mapDispatchToProps = dispatch => ({
    fetchModules: () => {
        httpclient.fetch('/api/modules')
            .then(resp => resp.json())
            .then(modules => dispatch(receiveModules(modules)));
    },

    fetchSignals: () => {
        httpclient.fetch('/api/signals')
            .then(resp => resp.json())
            .then(signals => dispatch(receiveSignals(signals)));
    },

    createModule: (module, callback) => {
        let request = httpclient.fetch('/api/modules', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(module)
        });
        if (callback) request.then(callback);
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Modules);