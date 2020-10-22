import React, {useEffect, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSearch} from "@fortawesome/free-solid-svg-icons";
import {useParams,withRouter} from "react-router-dom";
import backImg from "../assets/imgs/1gt7khaasdokgsgo48.jpg";
import Header from "../components/Header";
import {searchReq} from "../api/api";
import CarPiece from "../components/CarPiece";
import ConnectionErr from "../components/Connection_Err";
import {useDispatch} from "react-redux";
import {Logout, setBrands} from "../redux/actions/actions";
import Loading1 from "../assets/icons/clock.svg";
import { GAview} from "../index";
import ReactGA from "react-ga";
import EmptyImg from "../assets/icons/emptyImg.svg";


function Search(props) {

    useEffect(()=>{
        GAview(window.location.pathname + window.location.search);
        // GAmodalView("Request Demo")
        ReactGA.event({
            category: 'User',
            action: 'Sent message'
        });
    },[])


    const dispatch=useDispatch()
    const{brandId,modelId}=useParams()
    const [values,setValues]=useState({
        search_txt:'',
        brand_id:`${brandId}`,
        model_id:`${modelId}`
        // brand_id:'3',
        // model_id:'20'
    })
    const [spinner,setSpinner]=useState(false)
    const [result,setResult]=useState({
        results:[]
    })
    const [show,setShow]=useState()
    const [message,setMessage]=useState()

    const showResults=()=>{
        if (result.results){
            setShow(true)
        }
        else{
        }
    }
    // console.log(show)

    useEffect(()=>{
        if(!values.search_txt){
            setResult({results:[]})
            setMessage('')
            setSpinner(false)
        }
    },[values.search_txt])

    const handleSearch=(e)=>{
        setSpinner({
            spinner:true
        })
        const {name,value}=e.target;
        setValues({
            ...values,
            search_txt:value,
        });
        // console.log(values.search_txt.length)
        //console.log(e.target.value)
        let body = new FormData()
        body.append('search_query',e.target.value)
        body.append('brand',values.brand_id)
        body.append('model',values.model_id)
        if(values.search_txt.length>=2){
            setTimeout(()=>{
                searchReq(body)
                    .then(res=>{
                        setSpinner(false)
                        if (!res.data.error){
                            if(res.data.msg=='Unauthorized Access!'){
                                dispatch(Logout())
                                props.history.push('/')
                            }
                            else{
                                // console.log(res)
                                setResult({
                                    ...result,
                                    results: res.data.response
                                })
                                setMessage('')
                            }
                        }
                        else{
                            setMessage(res.data.error)
                            setResult({
                                results:null
                            })
                        }
                    })
                    .catch(err=>{
                        setSpinner(false)
                        setMessage('مشکل در برقراری ارتباط')
                    })
                showResults()
            },500)
        }
        // console.log(values.search_results)
        // console.log(spin.spinner)
        // console.log(result.results)
    }

    const Brands=JSON.parse(localStorage.getItem('brands'))
    // console.log(Brands)

    return(
        <React.Fragment>

            <Header title={'قطعه مورد نظر'}/>

            <div className="container mt-3">

                <ConnectionErr message={message}/>

                <form className="d-flex row justify-content-center my-4" autoComplete="off">

                    <div className="col-10 Custom-Width px-0 mt-1 mb-3">
                        <input name="search_txt" onChange={(e)=>handleSearch(e)} type="text" className="Piece-Input-1" placeholder="نام قطعه را وارد نمایید"/>
                        <button onClick={(e)=>e.preventDefault()} className="Search-Button"><FontAwesomeIcon className="faSearch" icon={faSearch}></FontAwesomeIcon></button>
                    </div>

                    {
                        spinner?
                            <div className="Loading-Spinner-Search">
                                {/*<div className="spinner-border text-light" role="status">*/}
                                {/*    <span className="sr-only">Loading...</span>*/}
                                {/*</div>*/}
                                <div className="mb-4 mb-md-0">
                                    <img src={Loading1} className="Clock-Spinner" alt="spinner"></img>
                                </div>
                            </div>
                        :
                            ''
                    }

                    {
                        result.results?

                        result.results.map((item,idx)=>(
                            <React.Fragment key={idx}>

                                <CarPiece {...item}/>

                            </React.Fragment>
                        ))

                        :
                            ''
                    }

                </form>
            </div>
        </React.Fragment>
    )
}

export default withRouter(Search);