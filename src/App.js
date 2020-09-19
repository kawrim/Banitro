import React, {useEffect, useState} from 'react';
import {withRouter, Route, Switch} from "react-router-dom"
import Brands from "./pages/Brands";
import Models from "./pages/Models";
import Search from "./pages/Search";
import Finalize from "./pages/Finalize";
import Confirm from "./pages/Confirm";
import Shipping from "./pages/Shipping";
import Waiting from "./pages/Waiting";
import PieceOptions from "./pages/PieceOptions";
import Authorize from "./pages/Authorize";
import Profile from "./pages/Profile";
import Reports from "./pages/Reports";
import NotFound from "./pages/404";
import IsAuthenticated from "./middleware/isAuthenticatd";
import PrivateRoute from "./middleware/PrivateRoute";
import {messaging} from "./init-fcm";
import Success from "./pages/Success";
import {useDispatch, useSelector} from "react-redux";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faArrowDown, faArrowUp, faEllipsisV,
    faExternalLinkSquareAlt,
    faFile,
    faHome,
    faPhone,
    faSignOutAlt,
    faUser
} from "@fortawesome/free-solid-svg-icons";

import firebase from "firebase";
import {setFirebase, setSpinner} from "./redux/actions/actions";
import { isIOS,isAndroid} from "react-device-detect";
import Loading from "./assets/icons/clock_spinner.svg";
import ios_add_2 from "./assets/imgs/ios_add_to_home_1.png"
import ios_add_1 from "./assets/imgs/ios_add_to_home_2.png"
import android_add from "./assets/imgs/android_add_to_home_2.jpg"
import ios_share from "./assets/imgs/ios_share_2.png"
import logo from "./assets/imgs/logo.png";
import {initGA} from "./index";


function App (props) {

    const dispatch=useDispatch()
    const Spinner=useSelector(state=>state.utils.spinner)
    const [registered,setRegistered]=useState(false)
    const path=window.location.pathname


    const goToProfile=()=>{
        dispatch(setSpinner(true))
        setTimeout(()=>{
            dispatch(setSpinner(false))
            props.history.push('/profile')
        },1000)
    }

    const goToHome=()=>{
        dispatch(setSpinner(true))
        setTimeout(()=>{
            dispatch(setSpinner(false))
            props.history.push('/brands')
        },1000)
    }

    const goToReports=()=>{
        dispatch(setSpinner(true))
        setTimeout(()=>{
            dispatch(setSpinner(false))
            props.history.push('/reports')
        },1000)
    }


     useEffect(()=>{

         if (window.matchMedia('(display-mode:standalone)').matches){
             setRegistered(true)
         }

         if (firebase.messaging.isSupported()){
             messaging.requestPermission()
                 .then(async function() {
                     const firebase_token = await messaging.getToken();
                     // localStorage.setItem('google_token',firebase_token)
                     // setFireToken(firebase_token)
                     dispatch(setFirebase(firebase_token))
                     // console.log(firebase_token)
                 })
                 .catch(function(err) {
                     console.log("Unable to get permission to notify.", err);
                 });
             navigator.serviceWorker.addEventListener("message"
                 , (message) => console.log(message)
             );
         }

    },[setFirebase])

    useEffect(()=>{
        initGA()
    },[])

    const handleRegister=()=>{
        localStorage.setItem('register',true)
        setRegistered(true)
    }

    useEffect(()=>{
        if (localStorage.getItem('register')){
            setRegistered(true)
        }
    },[registered])


    // console.log(registered)


    return (
        <React.Fragment>

            {/*{*/}
            {/*    isAndroid?*/}
            {/*        <h1>you're andriod</h1>*/}
            {/*    :*/}
            {/*        isIOS?*/}
            {/*            <h1>You're ios</h1>*/}
            {/*    :*/}
            {/*            'Its something else'*/}
            {/*}*/}

            <div className="App position-relative shadow-sm">

                {
                    Spinner?
                        <div className="Loading-Spinner">
                            {/*<div className="spinner-border text-info" role="status">*/}
                            {/*    <span className="sr-only">Loading...</span>*/}
                            {/*</div>*/}
                            <div className="mb-4 mb-md-0">
                                <img src={Loading} className="Clock-Spinner" alt="spinner"></img>
                            </div>
                        </div>
                    :

                        ''
                }

                <Switch>
                    <IsAuthenticated exact path='/' component={Authorize}/>
                    <IsAuthenticated path='/authorize' component={Authorize}/>
                    <PrivateRoute path='/brands' component={Brands}/>
                    <PrivateRoute path='/profile' component={Profile}/>
                    <PrivateRoute path='/reports' component={Reports}/>
                    <PrivateRoute path='/final' component={Finalize}/>
                    <PrivateRoute path='/wait' component={Waiting}/>
                    <PrivateRoute path='/success' component={Success}/>
                    <PrivateRoute exact path='/:brandId' component={Models}/>
                    <PrivateRoute exact path='/:brandId/:modelId/:yearId' component={Search}/>
                    <PrivateRoute exact path='/:brandId/:modelId/:yearId/:pieceId' component={PieceOptions}/>
                    <PrivateRoute exact path='/:brandId/:modelId/:yearId/:pieceId/confirm' component={Confirm}/>
                    <PrivateRoute exact path='/:brandId/:modelId/:yearId/:pieceId/shipping' component={Shipping}/>
                    {/*<Route path='*' component={NotFound}/>*/}
                </Switch>


                {
                    registered ?
                        ''
                    :
                        isIOS?
                            <div className="IOS">
                                <div className="row">
                                    <div className="col-12">
                                        <div className="d-flex mx-auto w-50 justify-content-center align-items-center text-center">
                                            <div className="w-100 h-100 mx-auto text-center">
                                                <img className="Brand-Title" src={logo}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 Add-To-Title mt-4">
                                        <p>
                                            وب اپلیکیشن
                                            <span> بانیترو </span>
                                            را به صفحه اصلی موبایل خود اضافه کنید
                                        </p>
                                    </div>
                                    <div className="col-12 Add-To-Steps">
                                        <ol className="p-0">
                                            <li>
                                                در نوار پایین روی دکمه
                                                <span className="ml-0"> share </span>
                                                <img src={ios_share} style={{width:'20px',height:'20px',marginLeft:'5px'}}/>
                                                تپ کنید.
                                            </li>
                                            <li>
                                                <p>
                                                    در منوی باز شده گزینه
                                                    <span>
                                                       "Add to home screen"
                                                    </span>
                                                    را تپ کنید.
                                                </p>
                                            </li>
                                            <div className="Add-To-Img" style={{backgroundImage: `url(${ios_add_1})`}}>

                                            </div>
                                            <li className="mt-3">
                                                <p>
                                                    در مرحله بعد در قسمت بالا روی
                                                    <span>
                                                       "Add"
                                                    </span>
                                                    تپ کنید.
                                                </p>
                                            </li>
                                            <div className="Add-To-Img" style={{backgroundImage: `url(${ios_add_2})`}}>

                                            </div>
                                        </ol>
                                    </div>
                                    <div className="col-12 text-center mt-3">
                                        <button className="Dismiss-Btn" onClick={handleRegister}>باشه</button>
                                    </div>
                                    <div className="col-12 Arrow-Section text-center mt-3">
                                        <p className="text-center">
                                            از نوار پایین مراحل را شروع کنید.
                                        </p>
                                        <FontAwesomeIcon icon={faArrowDown}/>
                                    </div>
                                </div>
                            </div>
                        :
                        isAndroid?
                            <div className="Android">
                                <div className="row">
                                    <div className="col-12 Arrow-Section">
                                        <FontAwesomeIcon icon={faArrowUp}/>
                                        <p>
                                            از نوار بالا سمت راست مراحل را شروع کنید.
                                        </p>
                                    </div>
                                    <div className="col-12 my-3">
                                        <div className="d-flex mx-auto w-50 justify-content-center align-items-center text-center">
                                            <div className="w-100 h-100 mx-auto text-center">
                                                <img className="Brand-Title" src={logo}/>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12 Add-To-Title mt-4">
                                        <p>
                                            وب اپلیکیشن
                                            <span> بانیترو </span>
                                            را به صفحه اصلی موبایل خود اضافه کنید
                                        </p>
                                    </div>
                                    <div className="col-12 Add-To-Steps mt-2">
                                        <ol className="px-2">
                                            <li>
                                                از گوشه بالا سمت راست روی دکمه
                                                <span className="ml-1 mr-2">
                                                     <FontAwesomeIcon icon={faEllipsisV}/>
                                                </span>
                                                تپ کنید .
                                            </li>
                                            <li>
                                                <p>
                                                    در منوی باز شده گزینه
                                                    <span>
                                                       "Add to home screen"
                                                    </span>
                                                    را تپ کنید.
                                                </p>
                                            </li>
                                            <div className="Add-To-Img" style={{backgroundImage: `url(${android_add})`}}>

                                            </div>
                                            <li className="mt-3">
                                                <p>
                                                    در مرحله بعد روی
                                                    <span>
                                                       "Add"
                                                    </span>
                                                    تپ کنید .
                                                </p>
                                            </li>
                                            <li>
                                                <p>
                                                در دو صفحه باز شده بعدی نام اپلیکیشن و آیکون بانیترو را با تپ کردن روی دکمه
                                                <span>
                                                   "Add"
                                                </span>
                                                    تایید کنید .
                                                </p>
                                            </li>
                                        </ol>
                                    </div>
                                    <div className="col-12 text-center mt-4">
                                        <button className="Dismiss-Btn" onClick={handleRegister}>باشه</button>
                                    </div>
                                </div>
                            </div>
                        :
                            ''
                }


                {/*{*/}
                {/*    registered?*/}
                {/*        ''*/}
                {/*    :*/}

                {/*    <div className="alert alert-dismissible fade show Add-To-Home-Screen" role="alert">*/}
                {/*        در نوار پایین با انتخاب دکمه*/}
                {/*        <FontAwesomeIcon icon={faSignOutAlt} rotation={270}/>*/}
                {/*        گزینه*/}
                {/*        <span className="Text">Add To Home Screen</span>*/}
                {/*        را انتخاب کنید.*/}
                {/*        <button type="button" className="close" data-dismiss="alert" aria-label="Close">*/}
                {/*            <span aria-hidden="true">&times;</span>*/}
                {/*        </button>*/}
                {/*    </div>*/}
                {/*}*/}

                {
                    path==='/authorize' || path==='/'?
                        ''
                    :
                        <div className="Bottom-Menu">
                            <a href='tel:02191303101' className="text-decoration-none">
                                <div>
                                    <FontAwesomeIcon icon={faPhone}/>
                                    <span>
                                        تماس با ما
                                    </span>
                                </div>
                            </a>

                            <div onClick={goToHome}>
                                <FontAwesomeIcon icon={faHome}/>
                                <span>
                                    خانه
                                </span>
                            </div>

                            <div onClick={goToReports}>
                                <FontAwesomeIcon icon={faFile}/>
                                <span>
                                    گزارشات
                                </span>
                            </div>

                            <div onClick={goToProfile}>
                                <FontAwesomeIcon icon={faUser}/>
                                <span>
                                    پروفایل
                                </span>
                            </div>

                        </div>
                }


            </div>
        </React.Fragment>

    );
}
export default withRouter(App)
