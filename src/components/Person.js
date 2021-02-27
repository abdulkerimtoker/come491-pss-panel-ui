import {useEffect, useState} from "react";
import httpclient from "../httpclient";
import {receivePerson, receivePersonModuleAccess, receivePersonPictures} from "../actions/person";
import {connect} from "react-redux";
import {
    Button,
    Divider,
    FormControl,
    FormHelperText,
    Grid,
    Input,
    InputLabel,
    Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField,
    Typography
} from "@material-ui/core";
import {useParams} from "react-router";
import {Alert, Autocomplete} from "@material-ui/lab";
import TransitionsModal from "./Modal";
import {showAlert} from "../alerter";
import {AlertVariants, displayAlert} from "../actions/alert";
import {makeStyles} from "@material-ui/core/styles";
import {receiveModules} from "../actions/module";

const styles = makeStyles(theme => ({
    container: {
        padding: '25px',
        marginBottom: '25px'
    },
    divider: {
        marginTop: '25px'
    },
    tableHeadRow: {
        fontWeight: 'bolder'
    }
}));

const Person = props => {
    const { fetchedPerson, pictures, modules, moduleAccessList } = props;
    const { id } = useParams();
    const classes = styles();
    const [person, setPerson] = useState(null);
    const [picture, setPicture] = useState(null);
    const [_module, setModule] = useState(null);

    useEffect(() => {
        props.fetchPerson(id);
        props.fetchPersonPictures(id);
        props.fetchModuleAccessList(id);
    }, [id]);

    useEffect(() => {
        props.fetchModules();
    }, []);

    useEffect(() => {
        if (fetchedPerson) setPerson(Object.assign({}, fetchedPerson));
    }, [fetchedPerson]);

    const handleChangeField = (field, event) => setPerson(Object.assign({}, person, {[field]: event.target.value}));

    const handleSaveChanges = () => props.updatePerson(person);

    const handleChangePicture = event => {
        let file = event.target.files ? event.target.files[0] : null;
        setPicture(file);
    };

    const handleUploadPicture = () => {
        if (picture) {
            props.uploadPicture(id, picture, () => {
                showAlert(AlertVariants.SUCCESS, 'Picture was uploaded successfully');
                props.fetchPersonPictures(id);
            });
        }
    };

    const handleDeletePicture = pictureId => {
        props.deletePicture(pictureId, () => {
            props.fetchPersonPictures(id);
        });
    };

    const handleChangeModule = (_, value) => setModule(value);

    const handleGrantAccess = () => props.grantModuleAccess(id, _module.id, () => props.fetchModuleAccessList(id));

    const handleRevokeAccess = access => props.revokeModuleAccess(id, access.module.id, () => props.fetchModuleAccessList(id));

    return (
        <div>
            {person &&
            <Grid container component={Paper} className={classes.container}>
                <Grid item xs={12}>
                    <Typography variant="h5">Manage {person.name}</Typography>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth margin="dense">
                        <InputLabel htmlFor="person-name">Name</InputLabel>
                        <Input
                            id="person-name"
                            type="text"
                            name="name"
                            value={person.name}
                            onChange={handleChangeField.bind(null, 'name')}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth margin="dense">
                        <InputLabel htmlFor="person-desc">Description</InputLabel>
                        <Input
                            id="person-desc"
                            type="text"
                            name="name"
                            value={person.description}
                            onChange={handleChangeField.bind(null, 'description')}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleSaveChanges}>Save Changes</Button>
                </Grid>
            </Grid>
            }

            <Grid container component={Paper} className={classes.container}>
                <Grid item xs={12}>
                    <Typography variant="h5">Assign a Picture</Typography>
                </Grid>
                <Grid item xs={12}>
                    <Input type="file" onChange={handleChangePicture} />
                    <Button variant="contained" color="primary" onClick={handleUploadPicture}>Upload</Button>
                </Grid>
            </Grid>

            {pictures &&
            <TableContainer component={Paper} className={classes.container}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={2}>
                                <Typography variant="h5">Assigned Pictures</Typography>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {pictures.map(picture =>
                            <TableRow key={picture.id.toString()}>
                                <TableCell>
                                    <img src={`/api/pictures/${picture.id}`} width="192" />
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained" color="secondary"
                                        onClick={handleDeletePicture.bind(null, picture.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            }

            <Grid container component={Paper} className={classes.container}>
                <Grid item xs={12}>
                    <Typography variant="h5">Grant Access to a Module</Typography>
                </Grid>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <FormHelperText>Module</FormHelperText>
                        <Autocomplete
                            options={modules ? modules : []}
                            value={_module}
                            getOptionLabel={_module => `${_module.id} - ${_module.name}`}
                            getOptionSelected={(option, value) => option.id === value.id}
                            onChange={handleChangeModule}
                            renderInput={params => <TextField {...params} />}
                        />
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleGrantAccess}>Grant</Button>
                </Grid>
            </Grid>

            {moduleAccessList &&
            <TableContainer component={Paper} className={classes.container}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell colSpan={2}>
                                <Typography variant="h5">Access to Modules</Typography>
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className={classes.tableHeadRow}>Module</TableCell>
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {moduleAccessList.map(access =>
                            <TableRow key={`${access.module.id}-${access.person.id}`}>
                                <TableCell>{access.module.name}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained" color="secondary"
                                        onClick={handleRevokeAccess.bind(null, access)}>
                                        Revoke
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            }
        </div>
    );
};

const mapStateToProps = state => ({
    fetchedPerson: state.person,
    pictures: state.personPictures,
    moduleAccessList: state.personModuleAccess,
    modules: state.modules
});

const mapDispatchToProps = dispatch => ({
    fetchPerson: id => {
        httpclient.fetch(`/api/people/${id}`)
            .then(resp => resp.json())
            .then(person => dispatch(receivePerson(person)));
    },

    updatePerson: person => {
        httpclient.fetch(`/api/people/${person.id}`, {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(person)
        }).then(resp => {
            if (resp.status === 200) showAlert(AlertVariants.SUCCESS, 'success!!');
        });
    },

    fetchPersonPictures: personId => {
        httpclient.fetch(`/api/people/${personId}/pictures`)
            .then(resp => resp.json())
            .then(pictures => dispatch(receivePersonPictures(pictures)));
    },

    uploadPicture: (personId, picture, callback) => {
        let form = new FormData();
        form.append('file', picture, 'picture');
        let request = httpclient.fetch(`/api/people/${personId}/pictures`, {
            method: 'POST',
            body: form
        });
        if (callback) request.then(callback);
    },

    deletePicture: (pictureId, callback) => {
        let request = httpclient.fetch(`/api/pictures/${pictureId}`, {method: 'DELETE'});
        if (callback) request.then(callback);
    },

    fetchModules: () => {
        httpclient.fetch('/api/modules')
            .then(resp => resp.json())
            .then(modules => dispatch(receiveModules(modules)));
    },

    fetchModuleAccessList: personId => {
        httpclient.fetch(`/api/people/${personId}/modules`)
            .then(resp => resp.json())
            .then(moduleAccess => dispatch(receivePersonModuleAccess(moduleAccess)));
    },

    grantModuleAccess: (personId, moduleId, callback) => {
        let request = httpclient.fetch(`/api/people/${personId}/modules/${moduleId}`, {method: 'POST'});
        if (callback) request.then(callback);
    },

    revokeModuleAccess: (personId, moduleId, callback) => {
        let request = httpclient.fetch(`/api/people/${personId}/modules/${moduleId}`, {method: 'DELETE'});
        if (callback) request.then(callback);
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(Person);