import React, {useEffect, useState} from "react";
import Header from "../components/Header";
import ConnectionErr from "../components/Connection_Err";
import {reportReq} from "../api/api";
import ReportCard from "../components/ReportCard";
import {useDispatch, useSelector} from "react-redux";
import {Logout, setSpinner} from "../redux/actions/actions";
import {withRouter} from "react-router-dom"
import {GAmodalView, GAview} from "../index";
import ReactGA from "react-ga";
import FormatListBulletedIcon from "@material-ui/core/SvgIcon/SvgIcon";
import Badge from "@material-ui/core/Badge";
function Reports(props) {

    const dispatch=useDispatch()
    const notifyCount=useSelector(state=>state.utils.notifyCount)

    useEffect(()=>{
        GAview(window.location.pathname + window.location.search);
        GAmodalView("Request Demo")
    },[])

    ReactGA.event({
        category: 'User',
        action: 'Sent message'
    });

    const [Data,setData]=useState({})

    useEffect(()=>{

        // setToken()
        dispatch(setSpinner(true))
        reportReq()
            .then(res=>{
                dispatch(setSpinner(false))
                if(res.data.error){
                    setMessage(res.data.error)
                }
                else{
                    if(res.data.msg=='Unauthorized Access!'){
                        dispatch(Logout())
                        props.history.push('/')
                    }
                    else{
                        // console.log(res)
                        localStorage.setItem('inProgress',JSON.stringify(res.data.response.inprogress))
                        setData({
                            inProg:res.data.response.inprogress
                        })
                        // localStorage.setItem('onWay',res.data.response.onway)
                        // localStorage.setItem('successful',res.data.response.successful)
                    }
                }
            })
            .catch(err=>{
                dispatch(setSpinner(false))
                setMessage('خطا در برقراری ارتباط')
            })

    },[])


    const Ongoing=localStorage.getItem('onWay')
    const Successful=localStorage.getItem('successful')
    const InProgress=localStorage.getItem('inProgress')
    const [message,setMessage]=useState();

    const goToProfile=()=>{
        dispatch(setSpinner(true))
        setTimeout(()=>{
            dispatch(setSpinner(false))
            props.history.push('/profile')
        },1000)
    }

    return(
        <React.Fragment>

            <Header title={'سفارشات من'}/>

            <div className="container mt-4">

                <ConnectionErr message={message}/>

                <div className="d-flex row justify-content-center my-4">
                    <div className="Reports-Card shadow-sm col-10">
                        <ul className="nav nav-tabs" id="myTab" role="tablist">
                            <li className="nav-item w-50">
                                <a className="nav-link active" id="home-tab" data-toggle="tab" href="#Done-Orders"
                                   role="tab" aria-controls="home" aria-selected="true">انجام شده
                                </a>
                            </li>
                            <li className="nav-item w-50 position-relative">
                                {
                                    notifyCount?
                                        <div className="Notify-Badge">
                                            {notifyCount}
                                        </div>
                                    :
                                        ''
                                }

                                <a className="nav-link" id="profile-tab" data-toggle="tab" href="#Ongoing-Orders"
                                   role="tab" aria-controls="profile" aria-selected="false">
                                    در حال انجام
                                </a>
                            </li>
                        </ul>

                        <div className="tab-pane px-0 fade show active" id="Done-Orders" role="tabpanel" aria-labelledby="done-tab">
                            {/*<div className="row mb-3">*/}
                            {/*    <div className="col-6 pr-5">*/}
                            {/*        برند و مدل*/}
                            {/*    </div>*/}
                            {/*    <div className="col-6 pl-5 text-left">*/}
                            {/*        تاریخ ثبت*/}
                            {/*    </div>*/}
                            {/*</div>*/}
                            {/*<hr/>*/}
                            {/*<div id="Reports">*/}

                                <div className="col-12 mt-5 Coming-Soon d-flex align-items-center justify-content-center">
                                    به زودی ...
                                </div>

                            {/*</div>*/}
                        </div>

                        <div className="tab-pane fade" id="Ongoing-Orders" role="tabpanel" aria-labelledby="ongoing-tab">

                            {
                                Data.inProg?
                                    Data.inProg.map((order,idx)=>(
                                        <ReportCard id={idx} key={idx} {...order}/>
                                    ))
                                        :
                                    ''
                            }

                        </div>

                    </div>

                    <div className="col-10 mx-auto mt-3 mb-4">
                        <div className="row d-flex">
                            <button type="submit" onClick={goToProfile} className="Piece-Confirm-Btn w-100 shadow-sm">بازگشت</button>
                        </div>
                    </div>

                </div>
            </div>

        </React.Fragment>

    )
}
export default withRouter(Reports);