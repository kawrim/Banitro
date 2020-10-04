import React, {useEffect, useState} from "react";
import backImg from "../assets/imgs/1gt7khaasdokgsgo48.jpg";
import Header from "../components/Header";
import {withRouter} from "react-router-dom"
import ConnectionErr from "../components/Connection_Err";
import {cancelReq, checkReq, finalDataReq, finalReq, setToken} from "../api/api";
import {Logout, setCancelOrder, setSpinner, setSuccessOrder, updateNotify} from "../redux/actions/actions";
import {useDispatch} from "react-redux";
import {showPrice} from "../components/functions";
import {GAmodalView, GAview} from "../index";
import ReactGA from "react-ga";
import $ from "jquery";
import {keys} from "@material-ui/core/styles/createBreakpoints";
import Badge from "@material-ui/core/Badge";

function Finalize(props) {

    useEffect(()=>{
        GAview(window.location.pathname + window.location.search);
        GAmodalView("Request Demo")
    },[])

    ReactGA.event({
        category: 'User',
        action: 'Sent message'
    });

    const [suggest, setSuggest] = useState()

    const [totallprice, setTotallprice] = useState()
    const [discountprice, setDiscountprice] = useState()
    const [shippingCost, setShippingCost] = useState()

    var empty = false

    const dispatch = useDispatch()

    const OrderId = localStorage.getItem('order_id')
    // console.log(OrderId)

    const [selected, setSelected] = useState({})

    const [index,setIndex]=useState(null)

    useEffect(() => {
        dispatch(setSpinner(true))
        // setToken()
        checkReq(OrderId)
            .then(res => {
                if (res.data.response.status) {
                    finalDataReq(OrderId)
                        .then(res => {
                            dispatch(setSpinner(false))
                            // console.log(res)
                            if (!res.data.error) {
                                if (res.data.status == '200') {
                                    if (res.data.msg) {
                                        dispatch(Logout())
                                        props.history.push('/')
                                    } else {
                                        dispatch(updateNotify())
                                        setSuggest(res.data.response)
                                    }
                                }
                            } else if (res.data.error) {
                                setMessage(res.data.error)
                            }
                        })
                        .catch(err => {
                            dispatch(setSpinner(false))
                            setMessage('خطا در برقراری ارتباط')
                        })
                } else {
                    dispatch(setSpinner(false))
                    props.history.push('/wait')
                }
            })
            .catch(err => {
                dispatch(setSpinner(false))
                setMessage('خطا در برقراری ارتباط')
                props.history.push('/brands')
            })
    }, [])

    let sumition = 0;
    const handleOption = (e) => {
        const {name, value} = e.target;
        // price = e.target.getAttribute('data-price')
        var radioElements = document.getElementsByClassName('option_radio');
        var i;
        for (i = 0; i < radioElements.length; i++) {
            if (radioElements[i].checked)
                sumition += parseFloat(radioElements[i].getAttribute('data-price'))
        }
        document.getElementById('calc-box').classList.remove("d-none");
        setTotallprice(sumition)
        setDiscountprice(suggest.discount)

        setShippingCost(suggest.shippingCost)

        setSelected({
            ...selected,
            [name]: value
        })
    }


    const handleRemove=()=>{
        const pro=suggest.suggestion.find((_piece)=>_piece===index)
        const i=suggest.suggestion.findIndex((_piece)=>_piece===index)

        let TempArr=[];
        TempArr=suggest.suggestion
        TempArr.splice(i,1)
        setSuggest({
            ...suggest,
            suggestion:TempArr
        })

        let TempSelected=[];
        TempSelected=selected;
        const I=Object.keys(selected).find(item => item === pro.product_id)
        const SugId=selected[pro.product_id]


        if(totallprice&&pro.suggests.find(item=>item.sug_id===SugId)){
            const SugPrice=pro.suggests.find(item=>item.sug_id===SugId).sug_price
            setTotallprice(cost=>cost-SugPrice)
        }
        delete TempSelected[I]
        setSelected(TempSelected)
    };

    const checkModal=(piece)=>{
        $('#Delete-modal').modal('show')
        setIndex(piece)
    };

    const handleSubmit = (e) => {
        dispatch(setSpinner(true))
        e.preventDefault()
        /*suggest.suggestion.map(piece => {
            if (selected[piece.product_id] == null) {
                empty = true
            }
        })*/
        if (empty) {
            dispatch(setSpinner(false))
            setMessage('گزینه های مورد نظر خود را انتخاب نمایید')
            return
        } else {
            setMessage('')
            // setToken()
            let body = new FormData()
            body.append('order_id', OrderId)
            body.append('totall', totallprice)
            body.append('shippingPrice', shippingCost)
            body.append('final_price', (totallprice > 250000) ? (Number(totallprice) - Number(discountprice) + Number(shippingCost)) : (Number(totallprice) + Number(shippingCost)))
            body.append('discount', (totallprice > 250000) ? (discountprice) : 0)
            body.append('selected', JSON.stringify(selected))
            finalReq(body)
                .then(res => {
                    dispatch(setSpinner(false))
                    if (res.data.error) {
                        setMessage(res.data.error)
                    } else {
                        if (res.data.msg == 'Unauthorized Access!') {
                            dispatch(Logout())
                            props.history.push('/')
                        } else {
                            dispatch(setSuccessOrder(true))
                            props.history.push('/success')
                        }
                    }
                })
                .catch(err => {
                    dispatch(setSpinner(false))
                    setMessage('خطا در برقراری ارتباط')
                })
        }
    }

    const handleCancel=()=>{
        $('#Cancel-modal').modal('show')
    }

    const cancelOrder=()=>{
        dispatch(setSpinner(true))
        let body=new FormData()
        body.append('order_id',OrderId)
        cancelReq(body)
            .then(res=>{
                dispatch(setSpinner(false))
                dispatch(setCancelOrder(true))
                props.history.push('/success')
            })
            .catch(err=>{
                dispatch(setSpinner(false))
            })
    }

    const [message, setMessage] = useState()


    return (

        <React.Fragment>
            <Header title={'تایید نهایی قطعات'}/>
            <div className="container mt-4">
                <ConnectionErr message={message}/>


                <div className="col-12">

                    <div className="modal fade Modal-Man-Date" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" id="Delete-modal">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="Modal-Header">
                                    توجه !
                                </div>
                                <div className="Modal-Body flex-column px-4">
                                    <p className="text-center">
                                        آیا از حذف این قطعه اطمینان دارید؟
                                    </p>
                                </div>
                                <div className="Modal-Footer text-center">
                                    <button type="button" className="Man-Date-Confirm-Btn mb-1"
                                            data-dismiss="modal" onClick={handleRemove}>بله
                                    </button>
                                    <button type="button" className="Man-Date-Confirm-Btn mt-1"
                                            data-dismiss="modal">انصراف
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal fade Modal-Man-Date" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" id="Cancel-modal">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="Modal-Header">
                                    توجه !
                                </div>
                                <div className="Modal-Body flex-column px-4">
                                    <p className="text-center">
                                        آیا از حذف سفارش خود اطمینان دارید؟
                                    </p>
                                </div>
                                <div className="Modal-Footer text-center">
                                    <button type="button" className="Man-Date-Confirm-Btn mb-1"
                                            data-dismiss="modal" onClick={cancelOrder}>بله
                                    </button>
                                    <button type="button" className="Man-Date-Confirm-Btn mt-1"
                                            data-dismiss="modal">انصراف
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>



                <div className="d-flex row justify-content-center my-4">

                    <div className="Car-Piece-Item shadow-sm col-10 Custom-Width">
                        <div className="row">
                            <button type="button" onClick={handleCancel} className="close shadow-sm Delete-Order-Badge" data-dismiss="alert" aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            <div className="col-12 Car-Piece-Img border-bottom">
                                <div className="row mb-2">

                                    {
                                        suggest ?
                                            <React.Fragment>
                                                <div className="col-6 Car-Model-Piece Font-14 d-flex align-items-center justify-content-center">
                                                    {suggest.car_brand_name} {suggest.car_model_name}
                                                </div>
                                                <div className="col-6 pt-2">
                                                    <img alt={suggest.car_brand_name} className="Car-Piece-Img" src={suggest.car_model_pic}/>
                                                </div>
                                            </React.Fragment>
                                            :
                                            ''
                                    }

                                </div>
                            </div>
                            <hr/>

                            {
                                suggest?
                                    suggest.type==='price'?
                                        <div className="col-12">
                                            <div className="row">

                                                <ol className="Pieces-List">

                                                    {suggest?
                                                        suggest.suggestion.map(piece => (
                                                        <li key={piece.product_id}>
                                                        <div className="col-10 p-0 mt-3">
                                                        <button type="button" className="close" onClick={()=>checkModal(piece)} data-dismiss="alert" aria-label="Close">
                                                            <span aria-hidden="true">&times;</span>
                                                        </button>
                                                        <span className="Piece-List-item-Title">
                                                        {piece.product_name}
                                                        </span>
                                                        <span className="Piece-List-item-Serial">
                                                        {piece.product_code ? `(${piece.product_code})` : ''}
                                                        </span>
                                                        </div>
                                                        <div className="">

                                                        {
                                                            piece.suggests.map((sug, idy) => (
                                                                <div key={idy} className="custom-control my-3 custom-radio d-flex align-items-center">
                                                                    {(sug.sug_price != null) ?
                                                                        <input required="required" name={piece.product_id} data-price={sug.sug_price} id={`sug${sug.sug_id}`} value={sug.sug_id} type="radio" onChange={(e) => handleOption(e)} className="custom-control-input Piece-Degree-Radio option_radio"/>
                                                                        :
                                                                        ' '
                                                                    }
                                                                    <label className={`${(sug.sug_price != null) ? 'custom-control-label' : ''} Piece-Degree-Radio-label`} htmlFor={`sug${sug.sug_id}`}>
                                                                        {(sug.sug_price != null) ? (showPrice(sug.sug_price) + ' ' + sug.sug_currency) : ('موجود نیست')}
                                                                    </label>
                                                                    <span className="Piece-Degree-Label">
                                                                           {sug.sug_description ? `(${sug.sug_description})` : ''}
                                                                        </span>
                                                                </div>
                                                            ))
                                                        }

                                                        </div>
                                                        {/*<p className="Piece-Degree-Description">*/}
                                                        {/*    توضیحات : {piece.description}*/}
                                                        {/*</p>*/}
                                                        </li>
                                                        ))
                                                        :
                                                        ''
                                                    }

                                                </ol>
                                            </div>
                                        </div>
                                    :
                                        <div className="col-12">
                                            <div className="col-12 pb-3 pt-2 mt-3">
                                                <p style={{fontSize:'12pt',textAlign:"center"}}>
                                                    {suggest.suggestion}
                                                </p>
                                            </div>
                                        </div>
                                    :
                                ''
                            }

                        </div>
                    </div>



                    <div id="calc-box" className="Car-Piece-Item shadow-sm col-10 Custom-Width">
                        <div className="row">
                            <hr/>
                            <div className="col-12">
                                <div className="row pt-4 px-4 pb-1">
                                    <span>جمع کل: </span>
                                    <span className="Piece-List-item-Title pr-2">{showPrice((totallprice ? totallprice : '0'))}</span>
                                    <span className="pr-1"> تومان </span>
                                </div>

                                <div className="row pt-2 px-4 pb-1">
                                    <span>تخفیف: </span>
                                    <span className="Piece-List-item-Title pr-2">{(totallprice > 250000) ? showPrice((discountprice ? `${discountprice}` : '0')) : '0'}</span>
                                    <span className="pr-1"> تومان </span>
                                </div>

                                {
                                    (shippingCost != null) ?
                                        <div className="row pt-2 px-4 pb-4">
                                            <span>هزینه ارسال (حدودی): </span>
                                            <span className="Piece-List-item-Title pr-2">{(shippingCost) ? showPrice(shippingCost) : '0'}</span>
                                            <span className="pr-1"> تومان </span>
                                        </div>
                                        :
                                        ''
                                }

                                <div className="row pt-2 px-4 pb-4">
                                    <span>مبلغ قابل پرداخت: </span>
                                    <span className="Piece-List-item-Title pr-2">{totallprice?showPrice((totallprice > 250000) ? (Number(totallprice) - Number(discountprice) + Number(shippingCost)) : (Number(totallprice) + Number(shippingCost))):'0'}</span>
                                    <span className="pr-1"> تومان </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-10 Custom-Width mt-3 mb-2">
                        <div className="row d-flex">
                            <button className="Piece-Confirm-Btn mr-0 shadow-sm" onClick={handleSubmit}>خرید میکنم</button>
                            <a className="Back-Btn Call-Link shadow-sm" href='tel:+2191303101'>تماس</a>
                        </div>
                    </div>

                </div>
            </div>
        </React.Fragment>
    )
}

export default withRouter(Finalize);