import React, {useEffect, useState} from "react";
import Loading from "../assets/icons/clock.svg"
import Header from "../components/Header";
import {checkReq} from "../api/api";
import ConnectionErr from "../components/Connection_Err";
import {useDispatch} from "react-redux";
import {Logout, setSpinner} from "../redux/actions/actions";
import {withRouter} from "react-router-dom"
import {GAmodalView, GAview} from "../index";
import ReactGA from "react-ga";


function Waiting(props) {

    useEffect(()=>{
        GAview(window.location.pathname + window.location.search);
        GAmodalView("Request Demo")
    },[])

    ReactGA.event({
        category: 'User',
        action: 'Sent message'
    });

    const dispatch=useDispatch()

    const[message,setMessage]=useState()

    const orderId=localStorage.getItem('order_id')

    useEffect(()=>{
        checkReq(orderId)
            .then(res => {
                if (!res.data.error) {
                    if (res.data.status == '200') {
                        if (res.data.msg=='Unauthorized Access!') {
                            clearInterval(Interval)
                            dispatch(Logout())
                            props.history.push('/')
                        }
                        else {
                            if (!res.data.response.status) {
                                return
                            } else {
                                clearInterval(Interval)
                                dispatch(setSpinner(true))
                                setTimeout(()=>{
                                    dispatch(setSpinner(false))
                                    props.history.push('/final')
                                },1000)
                            }
                        }
                    }
                } else if (res.data.error) {
                    clearInterval(Interval)
                    setMessage(res.data.error)
                    if(res.data.error==='این سفارش قبلا تایید شده است'){
                        setTimeout(()=>{
                            dispatch(setSpinner(true))
                            setTimeout(()=>{
                                dispatch(setSpinner(false))
                                props.history.push('/')
                            },1000)
                        },2000)
                    }
                }
            })
            .catch(err => {
                clearInterval(Interval)
                setMessage('مشکل در برقراری ارتباط')
            })
            const Interval=setInterval(()=> {
                checkReq(orderId)
                    .then(res => {
                        if (!res.data.error) {
                            if (res.data.status == '200') {
                                if (res.data.msg=='Unauthorized Access!') {
                                    clearInterval(Interval)
                                    dispatch(Logout())
                                    props.history.push('/')
                                }
                                else {
                                    if (!res.data.response.status) {
                                        return
                                    } else {
                                        clearInterval(Interval)
                                        dispatch(setSpinner(true))
                                        setTimeout(()=>{
                                            dispatch(setSpinner(false))
                                            props.history.push('/final')
                                        },1000)
                                    }
                                }
                            }
                        } else if (res.data.error) {
                            clearInterval(Interval)
                            setMessage(res.data.error)
                        }
                    })
                    .catch(err => {
                        clearInterval(Interval)
                        setMessage('مشکل در برقراری ارتباط')
                    })
            },5000)
        return () => clearInterval(Interval);
    },[])

    const goToBrands=()=>{
        dispatch(setSpinner(true))
        clearInterval()
        localStorage.removeItem('products')
        setTimeout(()=>{
            dispatch(setSpinner(false))
            props.history.push('/')
        },1000)
    }

    return(

        <React.Fragment>

            <Header title={'در حال پردازش درخواست ...'}/>

            <div className="container pt-3">

                <ConnectionErr message={message}/>

                <div className="row">
                    <div className="col-12">
                        <div className="Clock-Sand d-flex justify-content-center align-items-center">
                            <div className="d-flex flex-column justify-content-center align-items-center">
                                <div className="mb-4 mb-md-0">
                                    <img src={Loading} className="Clock-Spinner"></img>
                                </div>

                                <div>
                                    <p className="Final-Message">
                                        لطفا منتظر بمانید
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex row justify-content-center mt-4 mt-md-0">
                    <div className="col-10 Custom-Width mb-2 mb-md-0">
                        <div className="row d-flex">
                            <button className="Back-Btn w-100 shadow-sm" onClick={goToBrands}>ثبت سفارش برای خودروی دیگر</button>
                        </div>
                    </div>
                </div>
            </div>

        </React.Fragment>
    )
}

export default withRouter(Waiting);