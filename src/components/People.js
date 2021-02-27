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

const styles = makeStyles(theme => ({
    row: {
        '&:hover': {
            cursor: 'pointer',
            background: '#AAA'
        }
    },
    searchBox: {
        marginBottom: '10px',
        padding: '20px'
    },
    searchField: {
        width: '100%'
    },
    tableHeadRow: {
        fontWeight: 'bolder'
    },
    container: {
        padding: '25px',
        marginBottom: '25px'
    }
}));

const People = props => {
    const classes = styles();
    const { people } = props;
    const history = useHistory();
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');

    useEffect(() => {
        props.fetchPeople();
    }, []);

    const handlePageChange = (_, newPage) => setPage(newPage);

    const handleRowsPerPageChange = event => {
        setRowsPerPage(parseInt(event.target.value));
        setPage(0);
    }

    const handleManagePerson = personId => history.push(`/people/${personId}`);

    const handleChangeName = event => setName(event.target.value);

    const handleChangeDescription = event => setDescription(event.target.value);

    const handleCreatePerson = () => props.createPerson({description: description, name: name}, () => props.fetchPeople());

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
                    <Button variant="contained" color="primary" onClick={handleCreatePerson}>Create</Button>
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
                        {people ? (rowsPerPage > 0 ? people.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) : people)
                            .map(person => (
                                <TableRow
                                    key={person.id.toString()}
                                    className={classes.row}
                                    onClick={handleManagePerson.bind(null, person.id)}
                                >
                                    <TableCell>{person.id}</TableCell>
                                    <TableCell>{person.name}</TableCell>
                                    <TableCell>{person.description}</TableCell>
                                </TableRow>
                            )) : null}
                    </TableBody>
                    <TableFooter>
                        <TableRow>
                            <TablePagination
                                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                                colSpan={4}
                                count={people.length}
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
    people: state.people
});

const mapDispatchToProps = dispatch => ({
    fetchPeople: () => {
        httpclient.fetch('/api/people')
            .then(resp => resp.json())
            .then(people => dispatch(receivePeople(people)));
    },

    createPerson: (person, callback) => {
        let request = httpclient.fetch('/api/people', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(person)
        });
        if (callback) request.then(callback);
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(People);