import React, {useEffect, useState} from "react";
import backImg from "../assets/imgs/1gt7khaasdokgsgo48.jpg";
import Header from "../components/Header";
import {brandsReq, setAccept, setAcceptEnc, setConnection, setToken} from "../api/api";
import {Logout, setBrands, setSpinner} from "../redux/actions/actions";
import {useDispatch, useSelector} from "react-redux";
import Brand from "../components/Brand";
import ConnectionErr from "../components/Connection_Err";
import { GAview} from "../index";
import ReactGA from "react-ga";

function Brands(props) {

    useEffect(()=>{
        GAview(window.location.pathname + window.location.search);
        // GAmodalView("Request Demo")
    },[])

    ReactGA.event({
        category: 'User',
        action: 'Sent message'
    });

    const [message,setMessage]=useState()

    const dispatch=useDispatch();

    // localStorage.clear()
    useEffect(()=>{
        dispatch(setSpinner(true))
        brandsReq()
            .then(res=>{
                dispatch(setSpinner(false))

                if(!res.data.error){
                    if (res.data.msg==='Unauthorized Access!'){
                        dispatch(Logout())
                        props.history.push('/')
                    }
                    else if(res.data.status=='200'){
                        localStorage.setItem('brands',JSON.stringify(res.data.response))
                        dispatch(setBrands(res.data.response));
                    }
                }

            })
            .catch(err=>{
                dispatch(setSpinner(false))
                setMessage('خطا در برقراری ارتباط')
            })

    },[])
    // console.log(localStorage.getItem('brands'))

    const BrandLocal=JSON.parse(localStorage.getItem('brands'))
    // console.log(BrandLocal)
    const BrandState=useSelector(state=>state.utils.brands)
    // console.log(BrandState)
    // console.log(Brands)

    return(
        <React.Fragment>

            <Header title={'سازنده (مثلا چری سازنده تیگو)'}/>


            <div className="container mt-4">

                <ConnectionErr message={message}/>

                <div className="row">

                    {
                        BrandLocal==null?
                            // alert('1')
                           BrandState.map(item=>(
                                   <Brand {...item} key={item.cat_id}/>
                               )
                           )
                                :
                                // alert('2')
                            BrandLocal.map(item=>(
                                    <Brand {...item} key={item.cat_id}/>
                                )
                            )
                    }

                </div>

            </div>

        </React.Fragment>
    )
}
export default Brands;