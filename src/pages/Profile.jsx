import React, {useEffect, useState} from "react";
import TextField from '@material-ui/core/TextField';
import Button from "@material-ui/core/Button"
import {makeStyles} from '@material-ui/core/styles';
import Header from "../components/Header";
import {mustFilled, phoneValidate} from "../components/functions";
import {createMuiTheme, ThemeProvider} from '@material-ui/core/styles';
import jssRTL from "jss-rtl";
import RTL from "../components/Jss";
import ConnectionErr from "../components/Connection_Err";
import {profileEditReq, profileReq, setToken} from "../api/api";
import {useDispatch} from "react-redux";
import {Logout, setSpinner} from "../redux/actions/actions";
import {withRouter} from "react-router-dom"
import SuccessMsg from "../components/SuccessMsg";
import {GAmodalView, GAview} from "../index";
import ReactGA from "react-ga";


const useStyles = makeStyles((theme) => ({
    root: {
        '& .MuiTextField-root': {
            margin: theme.spacing(.5),
            width: '30ch',
            direction: 'rtl'
        },
    },
}));

function Profile(props) {

    useEffect(()=>{
        GAview(window.location.pathname + window.location.search);
        GAmodalView("Request Demo")
    },[])

    ReactGA.event({
        category: 'User',
        action: 'Sent message'
    });

    const dispatch = useDispatch()

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


    const [profile, setProfile] = useState()
    // console.log(profile)

    const classes = useStyles();

    const [errors, setErrors] = useState()

    const [message, setMessage] = useState()

    const [success, setSuccess] = useState()

    const [btnEdit, toggleEdit] = useState(true)

    const goToBrands = (e) => {
        e.preventDefault()
        dispatch(setSpinner(true))
        setTimeout(() => {
            dispatch(setSpinner(false))
            props.history.push('/brands')
        }, 1000)
    }

    const goToReports = (e) => {
        e.preventDefault()
        dispatch(setSpinner(true))
        setTimeout(() => {
            dispatch(setSpinner(false))
            props.history.push('/reports')
        }, 1000)
    }

    const handleSubmit = (e) => {
        setSuccess('')
        e.preventDefault()

        let body = new FormData()
        body.append('name', profile.name)
        body.append('phonenumber', profile.phonenumber)
        body.append('workshop', profile.workshop)


        body.append('address', profile.address)

        dispatch(setSpinner(true))
        profileEditReq(body)
            .then(res => {
                dispatch(setSpinner(false))
                if (res.data.error) {
                    setMessage(res.data.error)
                } else {
                    if (res.data.msg === 'Unauthorized Access!') {
                        dispatch(Logout())
                        props.history.push('/')
                    } else {
                        setMessage('')
                        setSuccess(res.data.response.message)
                    }
                }
            })
            .catch(err => {
                dispatch(setSpinner(false))
                setMessage('خطا در برقراری ارتباط')
            })
        toggleEdit(true)
    }

    const handleEdit = (e) => {
        e.preventDefault()
        setSuccess('')
        toggleEdit(false)
    }

    const handleLogout = (e) => {
        e.preventDefault()
        dispatch(setSpinner(true))
        setTimeout(() => {
            dispatch(setSpinner(false))
            dispatch(Logout())
            props.history.push('/')
        }, 1000)
    }

    const handleChange = (e) => {
        const {name, value} = e.target;
        setProfile({
            ...profile,
            [name]: value
        })
    }

    const theme = createMuiTheme({
        direction: 'rtl',
        flip: false,
        textAlign: 'right',// Both here and <body dir="rtl">
    });


    return (

        <React.Fragment>

            <Header title={'اطلاعات کاربر'}/>

            <form className={`container my-4 ${classes.root}`} noValidate autoComplete="off">

                <ConnectionErr message={message}/>
                <SuccessMsg message={success}/>

                <div className="d-flex row justify-content-center my-4">

                    <div className="col-10 mx-auto mb-4">
                        <div className="row d-flex">
                            <button className="Back-Btn mr-0 shadow-sm" onClick={goToBrands}>سفارش جدید</button>
                            <button className="Back-Btn shadow-sm" onClick={goToReports}>گزارشات</button>
                        </div>
                    </div>

                    <div className="Car-Piece-Item shadow-sm col-10">

                        <div className="row pt-3">

                            {
                                profile &&
                                Object.keys(profile).map(key =>
                                    <div className="col-12 mt-1" key={key}>

                                        {key === 'address' ?
                                            <React.Fragment>
                                                <label className="Profile-Input-Label" htmlFor={key}>آدرس</label>
                                                <textarea id={key} disabled={!!btnEdit} value={profile[key]} name={key} onChange={(e) => handleChange(e)} className='Profile-Input'/>
                                            </React.Fragment>
                                            :
                                            key === 'workshop' ?
                                                <React.Fragment>
                                                    <label className="Profile-Input-Label" htmlFor={key}>نام فروشگاه</label>
                                                    <input name={key} disabled={!!btnEdit} value={profile[key]} type='text' onChange={(e) => handleChange(e)} className='Profile-Input'/>
                                                </React.Fragment>
                                                :
                                                key === 'name' ?
                                                    <React.Fragment>
                                                        <label className="Profile-Input-Label" htmlFor={key}>نام و نام خانوادگی</label>
                                                        <input name={key} disabled={!!btnEdit} value={profile[key]} type='text' onChange={(e) => handleChange(e)} className='Profile-Input'/>
                                                    </React.Fragment>
                                                    :
                                                    key === 'phonenumber' ?
                                                        <React.Fragment>
                                                            <label className="Profile-Input-Label" htmlFor={key}>شماره موبایل</label>
                                                            <input name={key} disabled={!!btnEdit} value={profile[key]} type='tel' onChange={(e) => handleChange(e)} className='Profile-Input'/>
                                                        </React.Fragment>
                                                        :
                                                        key === 'referral_code' ?
                                                            <React.Fragment>
                                                                <label className="Profile-Input-Label" htmlFor={key}>کد معرف</label>
                                                                <input name={key} disabled value={profile[key]} type='text' onChange={(e) => handleChange(e)} className='Profile-Input'/>
                                                            </React.Fragment>
                                                            :
                                                            ''
                                        }

                                        <div className="invalid-feedback d-block">
                                            {/*{errors[name]}*/}
                                        </div>

                                    </div>
                                )}
                        </div>

                    </div>

                    {
                        btnEdit ?
                            <div className="col-10 mx-auto mt-3 mb-3">
                                <div className="row d-flex">
                                    <button onClick={handleEdit} className="Back-Btn w-100 shadow-sm">ویرایش اطلاعات</button>
                                </div>
                            </div>
                            :
                            <div className="col-10 mx-auto mt-3 mb-3">
                                <div className="row d-flex">
                                    <button onClick={handleSubmit} className="Piece-Confirm-Btn w-100 shadow-sm">ذخیره اطلاعات</button>
                                </div>
                            </div>

                    }

                    <div className="col-10 mx-auto mb-4">
                        <div className="row d-flex">
                            <button onClick={handleLogout} className="Logout-Btn w-100 shadow-sm">خروج از حساب کاربری</button>
                        </div>
                    </div>


                </div>
            </form>
        </React.Fragment>
    )
}

export default withRouter(Profile);