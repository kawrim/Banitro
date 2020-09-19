import React from "react";
import {withRouter} from "react-router-dom"
import {useDispatch} from "react-redux";
import {setSpinner} from "../redux/actions/actions";

function ReportCard(props) {

    const dispatch=useDispatch()
    // console.log(props)
    const BgColor=()=>{
        if (props.status==='successful'){
            return 'green'
        }
        else if(props.status==='inprogress'){
            return 'yellow'
        }
        else if(props.status==='ongoing'){
            return 'orange'
        }
    }
    const goToWaiting=()=>{
        dispatch(setSpinner(true))
        localStorage.setItem('order_id',props.order_id)
        setTimeout(()=>{
            dispatch(setSpinner(false))
            props.history.push('/wait')
        },1000)
    }

    return(
        <div className="card shadow-sm mb-2">
            <div className="card-header px-1" style={{backgroundColor:'#f8f8f8'}}>
                <h5 className="mb-0">
                    <a className="Report-Collapse-Link" style={{backgroundColor:'#f8f8f8'}} data-toggle="collapse" data-target={`#r-${props.id}`} aria-expanded="true" aria-controls="collapseOne">
                        <div>
                            <span className="ml-auto">سفارش: {props.order_id}</span>
                            <span className="mr-auto"> {props.order_time}</span>
                        </div>
                        <div className="Report-Collapse-Status">
                            <span>
                                {
                                    props.is_suggested?
                                        <span style={{color:'#e41313'}}>در انتظار تایید</span>
                                        :
                                        'در انتظار قیمت'
                                }
                            </span>
                            <span className="mr-auto">در حال بررسی</span>
                        </div>
                    </a>
                </h5>
            </div>

            <div id={`r-${props.id}`} className="collapse text-center" aria-labelledby="headingTwo">
                <div className="card-body">
                    <div className="row">
                        <ol className="Reports-List">

                            {
                                props.products?
                                props.products.map((product,idx)=>(
                                    <li key={idx}>
                                        <div className="col-10 mt-1">
                                            <span className="Piece-List-item-Title">
                                                {product.product_name}
                                            </span>
                                            {/*<span className="Piece-List-item-Serial">*/}
                                            {/*    (12345678)*/}
                                            {/*</span>*/}
                                            <p className="d-flex mt-2 align-items-center">
                                                {/*<span className="Piece-List-item-Kind">*/}
                                                {/*    سمت چپ*/}
                                                {/*</span>*/}
                                                <span className="Piece-List-item-Count">
                                                    {product.product_number} عدد
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
                <button className="Report-Order-Pursue-Btn shadow-sm" onClick={goToWaiting}>پیگیری سفارش</button>
            </div>
        </div>
    )
}

export default withRouter(ReportCard);