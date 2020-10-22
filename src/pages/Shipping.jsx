import React, {useEffect, useState} from "react";
import {useParams, withRouter} from "react-router-dom"
import Header from "../components/Header";
import {mustFilled, phoneValidate} from "../components/functions";
import {orderSubmitReq, profileEditReq, profileReq} from "../api/api";
import ConnectionErr from "../components/Connection_Err";
import {Logout, setSpinner} from "../redux/actions/actions";
import {useDispatch} from "react-redux";
import { GAview} from "../index";
import ReactGA from "react-ga";

function Shipping(props) {

    useEffect(()=>{
        GAview(window.location.pathname + window.location.search);
        // GAmodalView("Request Demo")
    },[])

    ReactGA.event({
        category: 'User',
        action: 'Sent message'
    });

    const dispatch = useDispatch()

    const [profile, setProfile] = useState()

    const {brandId, modelId, yearId} = useParams()

    const Products = JSON.parse(localStorage.getItem('products'))

    useEffect(() => {
        // setToken()
        dispatch(setSpinner(true))
        profileReq()
            .then(res => {
                if (res.data.status == '200') {
                    if (res.data.error) {
                        setMessage(res.data.error)
                    } else if (res.data.msg == 'Unauthorized Access!') {
                        dispatch(Logout())
                    } else {
                        dispatch(setSpinner(false))
                        setProfile(res.data.response)
                    }
                } else {
                    setMessage('خطا')
                }

            })
            .catch(err => {
                dispatch(setSpinner(false))
                setMessage('خطا در برقراری ارتباط')
            })
    }, [])

    const Fields = [
        {
            name: 'name',
            label: 'نام و نام خانوادگی',
            type: 'text',
            placeholder: 'نام و نام خانوادگی',
            Class: 'Info-Input'
        },
        {
            name: 'address',
            label: 'آدرس',
            type: 'text',
            placeholder: 'لطفا آدرس خود را وارد نمایید',
            Class: 'Info-Textarea'
        },
    ]

    const [values, setValues] = useState({
        car_brand: brandId,
        car_model: modelId,
        car_year: yearId,
        products: Products
    })

    const SubmitProduct = (e) => {
        e.preventDefault()
        Fields.map(({name}) => validation(name))
        if (Object.entries(errors).length !== 0 && errors.constructor === Object) return
        else {
            dispatch(setSpinner(true))
            let body = new FormData()
            body.append('user_name', profile.name)
            body.append('user_address', profile.address)
            body.append('car_brand', brandId)
            body.append('car_model', modelId)
            body.append('car_year', yearId)
            body.append('products', JSON.stringify(Products))
            // setToken()
            orderSubmitReq(body)
                .then(res => {
                    dispatch(setSpinner(false))
                    // console.log(res)
                    if (!res.data.error) {
                        if (res.data.status == '200') {
                            if (res.data.msg) {
                                dispatch(Logout())
                                props.history.push('/')
                            } else {
                                localStorage.removeItem('products')
                                localStorage.setItem('order_id', res.data.response.order_id)
                                props.history.push('/wait')
                            }
                        }
                    } else if (res.data.error) {
                        setMessage(res.data.error)
                    }
                })
                .catch(err => {
                    dispatch(setSpinner(false))
                    // console.log(err)
                    setMessage('خطا در برقراری ارتباط')
                })
        }
    }

    const [errors, setErrors] = useState({})
    const [message, setMessage] = useState()

    const handleChange = (e) => {
        const {name, value} = e.target;
        // setValues({
        //     ...values,
        //     [name]:value
        // })
        setProfile({
            ...profile,
            [name]: value
        })
    }

    const validation = (name) => {

        let hasError
        let newErrors = errors
        hasError = mustFilled(profile[name].trim())
        if (hasError)
            newErrors[name] = hasError
        else
            delete newErrors[name]
        setErrors(Object.assign({}, newErrors))
    }

    const onBlur = (name) => validation(name)

    const onKeyPress = (e) => {
        if (e.which === 13) {
            SubmitProduct(e)
        }
    }


    return (
        <React.Fragment>

            <Header title={'اطلاعات گیرنده'}/>

            <form className="container mt-4" noValidate>

                <ConnectionErr message={message}/>

                <div className="d-flex row justify-content-center my-4">
                    <div className="Car-Piece-Item shadow-sm col-10 Custom-Width">

                        <div className="row py-3">

                            {
                                Fields.map(({name, label, type, Class, placeholder}) =>
                                    <div className="col-12 mt-2" key={name}>

                                        <p className="mb-1 d-flex">
                                            <span className="ml-auto">
                                              {label}
                                            </span>
                                        </p>

                                        {
                                            name === 'address' ?
                                                <textarea name={name} value={profile ? profile[name] : ''} required onKeyPress={onKeyPress} onBlur={() => onBlur(name)} onChange={(e) => handleChange(e)} placeholder={placeholder} className={Class}/>
                                                :
                                                <input name={name} type={type} value={profile ? profile[name] : ''} required onBlur={() => onBlur(name)} onChange={(e) => handleChange(e)} placeholder={placeholder} className={Class}/>
                                        }

                                        <React.Fragment>
                                            <div className="invalid-feedback mb-2 d-block">
                                                {errors[name]}
                                            </div>
                                        </React.Fragment>

                                    </div>
                                )
                            }
                        </div>

                    </div>

                    <div className="col-10 Custom-Width mx-auto mt-3 mb-4">
                        <div className="row d-flex">
                            <button type="submit" onClick={SubmitProduct} className="Piece-Confirm-Btn w-100 shadow-sm">ثبت نهایی سفارش</button>
                        </div>
                    </div>

                </div>
            </form>
        </React.Fragment>
    )
}

export default withRouter(Shipping);