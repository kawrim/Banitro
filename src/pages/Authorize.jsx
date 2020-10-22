import React, {useState, useEffect} from "react";
import Header from "../components/Header";
import {mustFilled, phoneValidate} from "../components/functions";
import {regLoginReq, sendCodeReq, SetToken} from "../api/api";
import ConnectionErr from "../components/Connection_Err";
import {withRouter} from "react-router-dom"
import {useDispatch, useSelector} from "react-redux";
import {Login, setSpinner} from "../redux/actions/actions";
import Countdown from "react-countdown"
import SuccessMsg from "../components/SuccessMsg";

import TagManager from 'react-gtm-module'
import ReactGA from "react-ga";
import { GAview} from "../index";


const tagManagerArgs = {
    dataLayer: {
        userId: 'user_id',
        page: 'authorize'
    },
    dataLayerName: 'PageDataLayer'
}

function Authorize(props) {

    TagManager.dataLayer(tagManagerArgs)

    useEffect(()=>{
        GAview(window.location.pathname + window.location.search);
        // GAmodalView("Request Demo")
    },[])

    ReactGA.event({
        category: 'User',
        action: 'Sent message'
    });



    const dispatch = useDispatch();

    const FireBaseToken = useSelector(state => state.utils.firebase)

    const Fields = [
        {
            name: 'phone_number',
            label: 'شماره تماس',
            type: 'tel',
            maxLength: '11',
            size: '11',
            placeholder: '09121234567',
            Class: 'Info-Input'
        },
        {
            name: 'verify_code',
            label: 'کد تایید',
            type: 'tel',
            maxLength: '4',
            size: '4',
            placeholder: 'کد تایید ارسال شده',
            Class: 'Info-Input'
        }, {
            name: 'referral_code',
            label: 'کد معرف',
            type: 'text',
            maxLength: '10',
            size: '10',
            placeholder: 'کد معرف را وارد کنید',
            Class: 'Info-Input'
        }
    ]

    // const firebase_token=localStorage.getItem('google_token')

    const [values, setValues] = useState({
        phone_number: '',
        verify_code: '',
        referral_code: ''
    })
    const [errors, setErrors] = useState({})
    const [errorPhone, setErrorPhone] = useState({})
    const [message, setMessage] = useState()
    const [success, setSuccess] = useState()
    const [timeLeft, setTimeLeft] = useState(59);
    const [timer, setTimer] = useState(false);
    const [resend, setResend] = useState(false)

    const onKeyPress = (name, e) => {
        if (e.which === 13) {
            handleSubmit(e)
            // setMessage('')
            // if (name==='phone_number'){
            //     handleSendCode(e)
            // }
            // else {
            //     handleSubmit(e)
            // }
        }
    }

    const handleChange = (e) => {
        setMessage('')
        setSuccess('')
        const {name, value} = e.target;
        setValues({
            ...values,
            [name]: value
        })
    }

    const validation = (name) => {
        let hasError
        let newErrors = errors
        if (name === 'phone_number') {
            hasError = phoneValidate(values[name])
            setErrorPhone(true)
        } else {
            hasError = mustFilled(values[name].trim())
        }
        if (name === 'referral_code') {
            hasError = null
        }
        if (hasError)
            newErrors[name] = hasError
        else {
            delete newErrors[name];
            setErrorPhone('');
            setMessage('')
        }
        setErrors(Object.assign({}, newErrors))
        setSuccess('')
    }

    const onBlur = (name) => validation(name)

    useEffect(() => {
        if (timer) {
            if (!timeLeft) {
                setTimer(false)
                return
            }
            setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);

        }
        return () => {

        }
    }, [timeLeft, timer]);


    const handleSendCode = (e) => {
        setSuccess('')
        setMessage('')
        e.preventDefault();
        if (errorPhone) {
            setMessage('شماره موبایل نامعتبر می باشد')
            return;
        } else {
            setErrorPhone(false)
            let otp = new FormData();
            otp.append('phonenumber', values.phone_number)

            if (!values.phone_number) {
                // validation(values.phone_number)
                setErrors({
                    phone_number: 'این فیلد نمی تواند خالی باشد'
                })
                setMessage('ورودی های خود را کنترل نمایید')
                return
            } else {
                setMessage(null)
                // setErrors('')

                dispatch(setSpinner(true))
                sendCodeReq(otp)
                    .then(res => {
                        setTimer(false)
                        dispatch(setSpinner(false))
                        if (res.data.error) {
                            setMessage(res.data.error)
                            return
                        } else {
                            if (res.data.response.status) {
                                setTimeLeft(59)
                                setResend(true)
                                setSuccess('کد تایید برای شما ارسال گردید')
                                setTimer(true)
                            }
                        }
                    })
                    .catch(err => {
                        dispatch(setSpinner(false))
                        setMessage('خطا در برقراری ارتباط')
                    })
            }
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setSuccess('')
        clearInterval()
        let Data = new FormData();
        Data.append('phonenumber', values.phone_number);
        Data.append('otp', values.verify_code);
        Data.append('google_token', FireBaseToken)
        Data.append('referral_code', values.referral_code)
        Fields.map(({name}) => validation(name))
        if (Object.entries(errors).length !== 0 && errors.constructor === Object) {
            setMessage('ورودی های خود را کنترل نمایید')
            return;
        } else {
            setMessage(null)
            dispatch(setSpinner(true))
            regLoginReq(Data)
                .then(res => {
                    setMessage('')
                    if (!res.data.error) {
                        localStorage.setItem('private_token', res.data.response.private_token)
                        SetToken(res.data.response.private_token)
                        setTimeout(() => {
                            dispatch(setSpinner(false))
                            dispatch(Login())
                            // props.history.push('/brands')
                        }, 1000)
                    } else {
                        dispatch(setSpinner(false))
                        // alert('wrong code')
                        setMessage(res.data.error)
                    }
                })
                .catch(err => {
                    // console.log(err)
                    dispatch(setSpinner(false))
                    setMessage('خطا در برقراری ارتباط')
                })
        }
    }

    return (

        <React.Fragment>

            {/*<Header title={'ورود'}/>*/}
            <Header/>

            <form onSubmit={handleSubmit} className="container mt-4" noValidate>

                <ConnectionErr message={message}/>
                <SuccessMsg message={success}/>

                <div className="d-flex row justify-content-center my-4">
                    <div className="Car-Piece-Item col-10">
                        <div className="row py-3">

                            {
                                Fields.map(({name, label, type, maxLength, Class, placeholder, size, pattern}) =>
                                    <div className="col-12 mt-2" key={name}>
                                        <p className="mb-1 d-flex">
                                            <span className="ml-auto">
                                              {label}
                                            </span>
                                            {name === 'verify_code' ?
                                                <React.Fragment>
                                                    <span className="mr-auto Timer">
                                                        {
                                                            resend ?
                                                                `00:${timeLeft}`
                                                                :
                                                                ''
                                                        }
                                                        {/*<Countdown date={Date.now() + 10000} />*/}
                                                        {/*{timerComponents.length ? timerComponents : <span>Time's up!</span>}*/}
                                                    </span>
                                                    <span className="text-left">
                                                        <button disabled={timer} onClick={handleSendCode} className="Send-Code-Btn">
                                                           {resend ? 'ارسال مجدد' : 'ارسال کد تایید'}
                                                        </button>
                                                    </span>
                                                </React.Fragment>

                                                : ''}
                                        </p>
                                        <input name={name} type={type} onKeyPress={(e) => onKeyPress(name, e)} value={values[name]} maxLength={maxLength} size={size} required onBlur={() => onBlur(name)} onChange={(e) => handleChange(e)} placeholder={placeholder} className={Class}/>

                                        <React.Fragment>
                                            <div className="invalid-feedback d-block">
                                                {errors[name]}
                                            </div>
                                        </React.Fragment>

                                    </div>
                                )
                            }
                        </div>
                    </div>

                    <div className="col-10 mx-auto mt-3 mb-4">
                        <div className="row d-flex">
                            <button type='submit' onClick={handleSubmit} className="Piece-Confirm-Btn w-100">ثبت کد تایید</button>
                        </div>
                    </div>

                </div>
            </form>

        </React.Fragment>
    )
}

export default withRouter(Authorize);