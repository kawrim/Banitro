import React, {useEffect, useState} from "react";
import {Link,useParams,withRouter} from "react-router-dom";
import backImg from "../assets/imgs/1gt7khaasdokgsgo48.jpg";
import Header from "../components/Header";
import ConnectionErr from "../components/Connection_Err";
import {useDispatch} from "react-redux";
import {setSpinner} from "../redux/actions/actions";
import {GAmodalView, GAview} from "../index";
import ReactGA from "react-ga";

function Confirm(props) {

    useEffect(()=>{
        GAview(window.location.pathname + window.location.search);
        GAmodalView("Request Demo")
    },[])

    ReactGA.event({
        category: 'User',
        action: 'Sent message'
    });

    const dispatch=useDispatch()

    const {brandId,modelId,yearId,pieceId}=useParams()

    // console.log(JSON.parse(localStorage.getItem('brands')))

    const Brandss=JSON.parse(localStorage.getItem('brands'))
    const FilteredBrand=Brandss.find(item=>item.cat_id==brandId)
    const BrandName=FilteredBrand.cat_name
    const selectedModel=FilteredBrand.cat_models.find(item=>item.cat_id==modelId)
    const ModelImg=selectedModel.cat_img_path
    const ModelName=selectedModel.cat_name

    const Piece=JSON.parse(localStorage.getItem('selected_piece'))

    // console.log(Piece)

    const goToShipping=()=>{
        dispatch(setSpinner(true))
        setTimeout(()=>{
            dispatch(setSpinner(false))
            props.history.push(`/${brandId}/${modelId}/${yearId}/${pieceId}/shipping`)
        },1000)
    }

    const goToSearch=()=>{
        dispatch(setSpinner(true))
        setTimeout(()=>{
            dispatch(setSpinner(false))
            props.history.push(`/${brandId}/${modelId}/${yearId}`)
        },1000)
    }

    const Products=JSON.parse(localStorage.getItem('products'))

    const handleRemove=(item)=>{
        const i=Products.findIndex((_item)=>_item==item)
        // console.log(i)
        Products.splice(i,1)
        localStorage.setItem('products',JSON.stringify(Products))
        props.history.push(`/${brandId}/${modelId}/${yearId}/${pieceId}/confirm`)
        if(Products){
            if (Products.length==0){
                dispatch(setSpinner(true))
                setTimeout(()=>{
                    dispatch(setSpinner(false))
                    props.history.push(`/${brandId}/${modelId}/${yearId}`)
                },1000)
            }
        }
        else {
            dispatch(setSpinner(true))
            setTimeout(()=>{
                dispatch(setSpinner(false))
                props.history.push(`/${brandId}/${modelId}/${yearId}`)
            },1000)
        }
    }

    useEffect(()=>{
        if(Products){
            if (Products.length==0){
                dispatch(setSpinner(true))
                setTimeout(()=>{
                    dispatch(setSpinner(false))
                    props.history.push(`/${brandId}/${modelId}/${yearId}`)
                },1000)
            }
        }
        else {
            dispatch(setSpinner(true))
            setTimeout(()=>{
                dispatch(setSpinner(false))
                props.history.push(`/${brandId}/${modelId}/${yearId}`)
            },1000)
        }
    },[])


    // console.log(Products)

    // console.log(props)

    const [message,setMessage]=useState()

    return(
        <React.Fragment>

            <Header title={'لیست قطعات شما'}/>

            <div className="container mt-4">

                <ConnectionErr message={message}/>

                <div className="d-flex row justify-content-center my-4">


                    <div className="Car-Piece-Item shadow col-10 Custom-Width">
                        <div className="row">
                            <div className="col-12 Car-Piece-Img border-bottom">
                                <div className="row mb-2">
                                    <div className="col-6 Car-Model-Piece Font-14 d-flex align-items-center justify-content-center">
                                        {BrandName} {ModelName}
                                    </div>
                                    <div className="col-6">
                                        <img className="Car-Piece-Img" src={ModelImg}/>
                                    </div>
                                </div>
                            </div>
                            <hr/>
                            <div className="col-12">
                                <div className="row">
                                    <ol className="Pieces-List">

                                        {   Products?
                                                Products.map((item,idx)=>(
                                                    <li key={idx}>
                                                        <div className="col-10 mt-3">
                                                            <button type="button" className="close" onClick={()=>handleRemove(item)} data-dismiss="alert" aria-label="Close">
                                                                <span aria-hidden="true">&times;</span>
                                                            </button>
                                                            <span className="Piece-List-item-Title">
                                                                {item.piece_name}
                                                            </span>
                                                            <span className="Piece-List-item-Serial">
                                                                {item.serial?`(${item.serial})`:''}
                                                            </span>
                                                            <p className="d-flex mt-2 align-items-center">
                                                                <span className="Piece-List-item-Kind">
                                                                    {
                                                                        item.questions?
                                                                            Object.values(item.questions).map(item=>(
                                                                                `${item} -  `
                                                                            )
                                                                        )
                                                                            :
                                                                        ''
                                                                    }
                                                                </span>
                                                                <span className="Piece-List-item-Count">
                                                                    {item.number} عدد
                                                                </span>
                                                            </p>
                                                        </div>
                                                    </li>
                                                ))
                                            :
                                                ''
                                        }

                                    </ol>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-10 Custom-Width mt-3 mb-4">
                        <div className="row d-flex">
                            <button className="Piece-Confirm-Btn mr-0 shadow-sm" onClick={goToShipping}>تایید لیست</button>
                            <button className="Back-Btn shadow-sm" onClick={goToSearch}>افزودن قطعه</button>
                        </div>
                    </div>

                </div>
            </div>
        </React.Fragment>
    )
}

export default withRouter(Confirm);