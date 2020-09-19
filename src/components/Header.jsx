import React from "react";
import info from "../assets/icons/information (1).svg"
import phone1 from "../assets/icons/phone1.svg"
import logo from "../assets/imgs/logo.png"
import complete_logo from "../assets/imgs/complete_logo.png"
import user from "../assets/icons/user-circle-regular.svg"
import {useDispatch} from "react-redux";
import {setSpinner} from "../redux/actions/actions";
import {withRouter} from "react-router-dom"


function Header(props) {

    const dispatch = useDispatch()
    const path = window.location.pathname
    // console.log(path)
    const goToProfile = () => {
        dispatch(setSpinner(true))
        setTimeout(() => {
            dispatch(setSpinner(false))
            props.history.push('/profile')
        }, 1000)
    }

    return (
        <div className="container-fluid Header">
            <div className="row">
                <div className="col-12 d-flex justify-content-around align-items-center mt-3">
                    {/*<div className="d-flex flex-column justify-content-center align-items-center">*/}
                    {/*    <a href='tel:+2133124568' className="text-center Header-Icon-Div">*/}
                    {/*        <img src={phone1} className="Header-Icon"/>*/}
                    {/*    </a>*/}
                    {/*    <p className="mt-2 mb-0 Header-Icon-Text">تماس با ما</p>*/}
                    {/*</div>*/}
                    <div className="d-flex w-50 justify-content-center align-items-center text-center">
                        <div className="w-100 h-100 text-center">
                            {path==='/authorize' || path==='/' ?
                                <img className="Brand-Title" src={complete_logo}/>
                                :
                                <img className="Brand-Title" src={logo}/>
                            }
                            {/*<img className="Brand-Title" src={logo}/>*/}
                        </div>
                    </div>
                    {/*<div className="d-flex flex-column justify-content-center align-items-center">*/}
                    {/*{
                            path==='/authorize'||path==='/profile'|| path==='/register'||path==='/'?
                                <React.Fragment>
                                    <a className="text-center Header-Icon-Div" data-toggle="modal" data-target="#InfoModal">
                                        <img src={info} className="Header-Icon"/>
                                    </a>
                                    <p className="mt-2 mb-0 Header-Icon-Text">راهنمایی</p>
                                </React.Fragment>
                            :
                                <React.Fragment>
                                    <a onClick={goToProfile}  className="text-center Header-Icon-Div">
                                        <img src={user} className="Header-Icon"/>
                                    </a>
                                    <p className="mt-2 mb-0 Header-Icon-Text">پروفایل</p>
                                </React.Fragment>
                        }*/}
                    {/*</div>*/}
                </div>
                <div className="col-10 mx-auto Header-Title-Div">
                    <p className="Header-Title">
                        {props.title}
                    </p>
                </div>

                <div className="col-10">
                    <div className="modal fade Modal-Man-Date" id="InfoModal">
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-body">
                                    <p style={{fontSize: '13pt'}}>این اطلاعات شرکت ماست</p>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" style={{
                                        paddingRight: '1.4rem',
                                        paddingLeft: '1.4rem',
                                        fontSize: '13pt'
                                    }} className="btn btn-primary mx-auto" data-dismiss="modal">خب
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default withRouter(Header);