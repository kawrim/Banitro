import React from "react";
import {withRouter} from "react-router-dom"
import {useDispatch} from "react-redux";
import {setSpinner} from "../redux/actions/actions";


function Brand(props) {
    // console.log(props)

    const dispatch=useDispatch()

    const goToSecond=()=>{
        dispatch(setSpinner(true))
        setTimeout(()=>{
            dispatch(setSpinner(false))
            props.history.push(`/${props.cat_id}`)
        },1000)
    }

    return(
        <div className="Brand-Div col-4">
            <div className="Brand-Logo shadow-sm" onClick={goToSecond} style={{backgroundImage: `url(${props.cat_img_path})`}}>

            </div>
            <p>
                {props.cat_name}
            </p>
        </div>
    )
}
export default withRouter(Brand);