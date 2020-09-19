import React, {useState} from "react";
import {useParams,withRouter} from "react-router-dom"
import {useDispatch} from "react-redux";
import {setSpinner} from "../redux/actions/actions";
import EmptyImg from "../assets/icons/emptyImg.svg"

function Model(props) {

    const dispatch=useDispatch()

    const {brandId}=useParams();

    const Years=JSON.parse(props.cat_years.meta_value)

    const[year,setYear]=useState({
        year:`${Years[0]}`
    })

    const handleYear=(e)=>{
        const {name,value}=e.target;
        setYear({
            [name]:value
        })
    }

    const goToSearch=(e)=>{
        // e.preventDefault()
        dispatch(setSpinner(true))
        setTimeout(()=>{
            dispatch(setSpinner(false))
            props.history.push(`/${brandId}/${props.cat_id}/${year.year}`)
        },2000)
    }


    return(
        <React.Fragment>

            <div className="container">
                <a href="#" className="col-10 text-center shadow-sm mx-auto Car-Model-Item" data-toggle="modal" data-target={`#m-${props.cat_id}`}>
                    <div className="Car-Model-Img" style={props.cat_img_path?{backgroundImage: `url(${props.cat_img_path})`}:{backgroundImage: `url(${EmptyImg})`}}>

                    </div>
                    <p className="Car-Model-Title">
                        {props.cat_name}
                    </p>
                </a>
            </div>

            <div className="col-12" id="Year-Modal">
                <div className="modal fade Modal-Man-Date" id={`m-${props.cat_id}`} tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="Modal-Header">
                                سال ساخت
                            </div>
                            <div className="Modal-Body">
                                <select name="year" onChange={(e) => handleYear(e)}
                                        className="custom-select w-75">
                                    {
                                        JSON.parse(props.cat_years.meta_value).map((year,idx)=>(
                                            <option key={idx}>{year}</option>
                                        ))
                                    }
                                </select>
                            </div>
                            <div className="Modal-Footer text-center">
                                <button type="button" className="Man-Date-Confirm-Btn"
                                       data-dismiss="modal"  onClick={goToSearch}>تایید سال ساخت
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </React.Fragment>
    )
}

export default withRouter(Model)