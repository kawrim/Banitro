import React, {useState} from "react";
import {useParams} from "react-router-dom"

function Modal(props) {

    const {brandId}=useParams()

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

    // console.log(props.cat_name)

    const goToThird=()=>{
        props.history.push(`/${brandId}/${props.cat_name}/${year.year}`)
    }

    return(
        <div className="col-10">
            <div className="modal Modal-Man-Date" id={props.id}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="Modal-Header">
                            سال ساخت
                        </div>
                        <div className="Modal-Body">
                            <select name="year" onChange={(e)=>handleYear(e)} className="custom-select w-75">
                                {
                                    Years.map(item=>(
                                        <option>{item}</option>
                                    ))
                                }

                            </select>
                        </div>
                        <div className="Modal-Footer text-center">
                            <button type="button" className="Man-Date-Confirm-Btn" data-dismiss="modal" onClick={goToThird}>تایید سال ساخت</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default Modal;