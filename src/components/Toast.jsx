import React, { useEffect, useState } from "react";
import {withRouter} from "react-router-dom"
import { SnackbarProvider, useSnackbar } from "notistack";
import {notifReq} from "../api/api";
import {Button} from "@material-ui/core";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import {useDispatch, useSelector} from "react-redux";
import {setNotifyCount, setPopUp, setSpinner} from "../redux/actions/actions";

function Toast (props) {

    const [foreGround,setForeGround]=useState(true)

    document.addEventListener('visibilitychange', () => {
        // console.log(document.visibilityState);
        if (document.visibilityState==='hidden'){
            setForeGround(false)
        }
        else
        {
            setForeGround(true)
        }
    });

    const updateNotify=useSelector(state=>state.utils.updateNotify)
    const [notif,setNotif]=useState()
    const dispatch=useDispatch()

    const goToPriceList=(orderId)=>{
        notif.data.map(item=>closeSnackbar())
        dispatch(setSpinner(true))
        localStorage.setItem('order_id', orderId)
        setTimeout(()=>{
            dispatch(setSpinner(false))
            props.history.push('/wait')
        },2000)
    }

    const action = (key,k) => (

        <React.Fragment>
            {/*<IconButton size="small" aria-label="close" color="inherit" onClick={()=> { this.props.closeSnackbar(key) }}>*/}
            {/*    <CloseIcon fontSize="small" />*/}
            {/*</IconButton>*/}
            <Button variant="text" color="inherit" onClick={() => { goToPriceList(key)}}>
                مشاهده
            </Button>
            {/*<Button onClick={() => { this.props.closeSnackbar(key) }}>*/}
            {/*    'Dismiss'*/}
            {/*</Button>*/}
        </React.Fragment>
    );

    useEffect(()=>{
        if (foreGround){
            notifReq()
                .then(res=>{
                    setNotif(res.data.response)
                    dispatch(setNotifyCount(res.data.response.count))
                    if (res.data.response.has_popup){
                        dispatch(setPopUp(res.data.response.popup))
                    }
                })
                .catch(err=>{
                    // console.log(err)
                })
        }
    },[foreGround])

    useEffect(()=>{
        if (updateNotify){
            notifReq()
                .then(res=>{
                    dispatch(setNotifyCount(res.data.response.count))
                })
                .catch(err=>{
                    // console.log(err)
                })
        }
    },[updateNotify])

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();

    useEffect(()=>{
        if (notif){
            notif.data.map((item) => enqueueSnackbar(` 
            قیمت    
            ${item.car.name}
           ارسال شد! `,
                {
                    variant:'success',
                    action:action(item.order_id),
                    autoHideDuration:5000,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center',
                    },
                }));
        }
    },[notif])

    return <div></div>;
};


export default withRouter(Toast)