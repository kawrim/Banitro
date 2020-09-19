import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";
import Loading from "../assets/icons/clock.svg"
import Header from "../components/Header";
import ConnectionErr from "../components/Connection_Err";
import {useDispatch} from "react-redux";
import {setSpinner} from "../redux/actions/actions";
import {withRouter} from "react-router-dom"
import {GAmodalView, GAview} from "../index";
import ReactGA from "react-ga";


function Success(props) {

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
        setTimeout(()=>{
            dispatch(setSpinner(true))
            setTimeout(()=>{
                dispatch(setSpinner(false))
                props.history.push('/')
            },1000)
        },3000)
    },[])

    const goToBrands=()=>{
        dispatch(setSpinner(true))
        setTimeout(()=>{
            dispatch(setSpinner(false))
            props.history.push('/')
        },1000)
    }

    return(

        <React.Fragment>

            <Header title={'در حال پردازش درخواست ...'}/>

            <div className="container">

                <ConnectionErr message={message}/>

                <div className="row">
                    <div className="col-12">
                        <div className="Clock-Sand d-flex justify-content-center align-items-center">
                            <div className="d-flex flex-column justify-content-center align-items-center">
                                <div className="mb-4 mb-md-0">
                                    <FontAwesomeIcon icon={faCheckCircle} className="Success-Icon"></FontAwesomeIcon>
                                </div>

                                <div>
                                    <p className="Success-Text">
                                        سفارش شما با موفقیت ثبت شد
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex row justify-content-center mt-4 mt-md-0">
                    <div className="col-10 Custom-Width mb-2 mb-md-0">
                        <div className="row d-flex">
                            <button className="Back-Btn w-100" onClick={goToBrands}>ثبت سفارش برای خودروی دیگر</button>
                        </div>
                    </div>
                </div>
            </div>

        </React.Fragment>
    )
}

export default withRouter(Success);