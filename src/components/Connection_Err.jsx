import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import {Alert} from "@material-ui/lab";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    },
}));


export default function ConnectionErr(props) {

    // console.log(props)

    const classes = useStyles();

    return(
        <div className={`mb-2 ${classes.root} Error-Message`}>
            {
                props.message?

                    <Alert severity="error">{props.message}</Alert>
                    :
                    ''
            }
        </div>
    )
}
