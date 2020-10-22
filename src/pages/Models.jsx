import React, {useEffect, useState} from "react";
import Header from "../components/Header";
import {useParams} from "react-router-dom"
import {useDispatch} from "react-redux";
import Model from "../components/Model";
import { GAview} from "../index";
import ReactGA from "react-ga";


function Models(props) {

    useEffect(()=>{
        GAview(window.location.pathname + window.location.search);
        // GAmodalView("Request Demo")
    },[])

    ReactGA.event({
        category: 'User',
        action: 'Sent message'
    });

    const dispatch = useDispatch()

    useEffect(() => {
        // dispatch(setSpinner(true))
        // setTimeout(()=>{
        //     dispatch(setSpinner(false))
        // },1000)
    })

    const {brandId} = useParams();

    // const Brands=useSelector(state=>state.brand.brands)
    const Brands = JSON.parse(localStorage.getItem('brands'))

    const Brand = Brands.find(item => item.cat_id == brandId)


    // useEffect(()=>{
    //     if (Brand){
    //
    //     }
    //     else{
    //         props.history.push('/')
    //     }
    // },[])

    // console.log(Brand)

    // const Years=JSON.parse(model.cat_years.meta_value)

    // const {Years}=JSON.parse(Brands.cat_models.cat_years.meta_value)

    const [year, setYear] = useState({
        // year:`${Years[0]}`
    })

    const handleYear = (e) => {
        const {name, value} = e.target;
        setYear({
            [name]: value
        })
    }

    const goToThird = () => {
        // props.history.push(`/${brandId}/${model.cat_name}/${year.year}`)
    }

    return (
        <React.Fragment>

            <Header title={'انتخاب مدل'}/>

            <div className="container mt-2 mb-3">
                <div className="row">

                    {Brand.cat_models ?
                        Brand.cat_models.map(model =>
                            (

                                <Model key={model.cat_name} {...model} />

                            )
                        )
                        :
                        ''
                    }

                </div>
            </div>
        </React.Fragment>
    )
}

export default Models;