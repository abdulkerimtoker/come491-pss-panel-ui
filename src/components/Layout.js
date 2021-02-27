import React, {useEffect, useState} from 'react';

import {Route, Switch, useHistory} from "react-router-dom";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import {withStyles} from "@material-ui/core/styles";
import MenuIcon from "@material-ui/icons/Menu";
import CssBaseline from "@material-ui/core/CssBaseline";
import Drawer from "@material-ui/core/Drawer";
import clsx from "clsx";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import PeopleIcon from '@material-ui/icons/People';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import withTheme from "@material-ui/core/styles/withTheme";
import { withRouter } from "react-router-dom";
import PowerIcon from '@material-ui/icons/PowerSettingsNew';
import {makeStyles, useTheme} from "@material-ui/core";
import httpclient from "../httpclient";
import {connect} from "react-redux";
import People from "./People";
import Person from "./Person";
import TransitionAlert from "./TransitionAlert";
import Signals from "./Signals";
import Signal from "./Signal";
import Modules from "./Modules";
import Module from "./Module";
import Predict from "./Predict";
import {store} from "../store";
import {logOut} from "../actions/security";

const drawerWidth = 240;

const styles = makeStyles(theme => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    contentDrawerOpen: {
        width: `calc(100% - ${drawerWidth}px)`
    },
    contentDrawerClosed: {
        width: `calc(100% - ${theme.spacing(7) + 1}px)`
    }
}));

const MainLayout = props => {
    const classes = styles();
    const theme = useTheme();
    const history = useHistory();
    const [open, setOpen] = useState(true);

    useEffect(() => {
        props.fetchAssignedPermissions();
    }, [props]);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const goToLink = link => {
        history.push(link);
    };

    const logOutt = () => {
        localStorage.removeItem('JWT');
        store.dispatch(logOut());
    };

    return (
        <div className={classes.root}>
            <CssBaseline />
            <AppBar
                position="fixed"
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                })}
            >
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>PSS Panel</Typography>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                })}
                classes={{
                    paper: clsx({
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    <ListItem button key="welcome">
                        <ListItemText primary={open ? 'Welcome' : ''} />
                    </ListItem>
                    <Divider />
                    <ListItem button key="people" onClick={goToLink.bind(null, '/people')}>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="People" />
                    </ListItem>
                    <ListItem button key="signals" onClick={goToLink.bind(null, '/signals')}>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Signals" />
                    </ListItem>
                    <ListItem button key="modules" onClick={goToLink.bind(null, '/modules')}>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Modules" />
                    </ListItem>
                    <ListItem button key="modules" onClick={goToLink.bind(null, '/predict')}>
                        <ListItemIcon>
                            <PeopleIcon />
                        </ListItemIcon>
                        <ListItemText primary="Predict" />
                    </ListItem>
                    <Divider />
                    <ListItem button key="logout" onClick={logOutt}>
                        <ListItemIcon>
                            <PowerIcon />
                        </ListItemIcon>
                        <ListItemText primary="Log out"/>
                    </ListItem>
                </List>
            </Drawer>
            <main
                className={clsx(classes.content, {
                    [classes.contentDrawerOpen]: open,
                    [classes.contentDrawerClosed]: !open
                })}
            >
                <div className={classes.toolbar} />
                <Switch>
                    <Route path="/people/:id" component={Person} />
                    <Route path="/people" component={People} />
                    <Route path="/signals/:id" component={Signal} />
                    <Route path="/signals" component={Signals} />
                    <Route path="/modules/:id" component={Module} />
                    <Route path="/modules" component={Modules} />
                    <Route path="/predict" component={Predict} />
                </Switch>

            </main>
            <TransitionAlert />
        </div>
    );
}

const mapStateToProps = state => ({
    assignedPermissions: state.assignedPermissions
});

const mapDispatchToProps = dispatch => ({
    fetchAssignedPermissions: () => {
        httpclient.fetch('/api/users/current/permissions');
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(MainLayout);