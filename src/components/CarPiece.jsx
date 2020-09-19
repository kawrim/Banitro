import React from "react";
import backImg from "../assets/imgs/1gt7khaasdokgsgo48.jpg";
import {useParams,withRouter} from "react-router-dom";
import {useDispatch} from "react-redux";
import {setSpinner} from "../redux/actions/actions";
import EmptyImg from "../assets/icons/emptyImg.svg";

function CarPiece(props) {

    const {brandId,modelId,yearId}=useParams();

    const dispatch=useDispatch()

    const goToPieceInfo=()=>{
        dispatch(setSpinner(true))
        setTimeout(()=>{
            localStorage.setItem('selected_piece',JSON.stringify(props))
            props.history.push(`/${brandId}/${modelId}/${yearId}/${props.id}`)
            dispatch(setSpinner(false))
        },1000)
    }


    return(

        <div className="Car-Piece-Item shadow-sm col-10" onClick={goToPieceInfo}>
            <div className="row mt-2">
                <div className="col-12 Car-Piece-Img">
                    <div className="row">
                        <div className="col-6 Car-Piece-Serial">
                            {props.code?`(${props.code})`:''}
                        </div>
                        <div className="col-6 text-center">
                            <img className={props.img?"Car-Piece-Img":"Search-Empty-Img"} style={{width:props.img?'70%':''}} src={props.img?props.img:EmptyImg}/>
                        </div>
                        <div className="col-6 mt-2 mb-4 Car-Piece-Title">
                            {props.name?props.name:''}
                        </div>
                        <div className="col-6 mt-2 mb-4 Car-Model-Piece">
                            {props.car_model_name?props.car_model_name:''}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default withRouter(CarPiece);