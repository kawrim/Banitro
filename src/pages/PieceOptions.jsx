import React, {useState, useEffect} from "react";
import backImg from "../assets/imgs/1gt7khaasdokgsgo48.jpg";
import "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faAngleDown,
    faAngleUp,
    faMinusCircle,
} from "@fortawesome/free-solid-svg-icons";
import {faPlusCircle} from "@fortawesome/free-solid-svg-icons/faPlusCircle";
import Header from "../components/Header";
import EmptyImg from "../assets/icons/emptyImg.svg";
import {useParams, withRouter} from "react-router-dom";
import ConnectionErr from "../components/Connection_Err";
import {useDispatch} from "react-redux";
import {setSpinner} from "../redux/actions/actions";
import $ from "jquery"
import {GAmodalView, GAview} from "../index";
import ReactGA from "react-ga";

function PieceOptions(props) {

    useEffect(()=>{
        GAview(window.location.pathname + window.location.search);
        GAmodalView("Request Demo")
    },[])

    ReactGA.event({
        category: 'User',
        action: 'Sent message'
    });


    const dispatch = useDispatch()

    const {brandId, yearId, modelId, pieceId} = useParams();

    const Item = JSON.parse(localStorage.getItem("selected_piece"));

    // console.log(Item)

    // console.log(JSON.parse(Item.meta_value))

    const Questions = JSON.parse(Item.meta_value);

    // console.log(Questions);

    const goBack = () => {
        dispatch(setSpinner(true))
        setTimeout(() => {
            dispatch(setSpinner(false))
            props.history.push(`/${brandId}/${modelId}/${yearId}`);
        }, 1000)
    };

    const handlePlus = () => {
        setProduct({
            ...Product,
            number: Product.number + 1,
        });
    };

    const handleMinus = () => {
        if (Product.number > 1) {
            setProduct({
                ...Product,
                number: Product.number - 1,
            });
        }
    };

    const [message, setMessage] = useState();

    const [Product, setProduct] = useState({
        id: pieceId,
        brand: brandId,
        model: modelId,
        year: yearId,
        number: 1,
        questions: {},
        piece_name: Item.name,
        serial: Item.code
    })

    var Products = JSON.parse(localStorage.getItem('products'))
    var products = []
    var finalProduct = Product

    const [selected, setSelected] = useState({});

    const handleChange = (e) => {
        const {name, value} = e.target;
        setSelected({
            ...selected,
            [name]: value,
        });
    };

    var isEmp = false
    var isRig = false
    const [inBasketBrand, setInBasketBrand] = useState()
    const [inBasketModel, setInBasketModel] = useState()
    const [inBasketYear, setInBasketYear] = useState()
    const [inBasketPiece, setInBasketPiece] = useState()
    const [inBasketModal, setInBasketModal] = useState(false)

    const goToConfirm = () => {
        dispatch(setSpinner(true))

        setTimeout(() => {
            if (Questions) {
                // console.log('question exists')
                Questions.map((question) => {
                    if (selected[question.q] == null) {
                        // console.log('foundEmpt')
                        dispatch(setSpinner(false))
                        isEmp = true
                    }
                })
                if (isEmp) {
                    // console.log('is Emp triggered')
                    dispatch(setSpinner(false))
                    setMessage("لطفا نوع محصول مورد نظر را انتخاب کنید");
                    return
                } else {
                    dispatch(setSpinner(false))
                    setMessage(null);
                    Products ? (products = Products) : (products = []);
                    if (!products.length == 0 || !products === []) {
                        // console.log('isnt empty')
                        products.map(({model, brand}) => {
                            if (Product.brand !== brand || Product.model !== model) {
                                // console.log('rig found')
                                isRig = true
                            }
                        });
                        if (isRig) {
                            // console.log('isRig triggered')
                            setMessage('در ثبت اطلاعات محصول مشکلی پیش آمد')
                            setInBasketBrand(products[0].brand)
                            setInBasketModel(products[0].model)
                            setInBasketYear(products[0].year)
                            setInBasketPiece(products[0].id)
                            setInBasketModal(true)
                            $('#Basket-Exist').modal('show')
                            return
                        } else {
                            // console.log('no rig found')
                            const dup = products.find(item => item.id == Product.id)
                            const i = products.findIndex(item => item.id == Product.id)
                            // console.log(dup)
                            // console.log(i)

                            if (dup) {
                                // console.log('is dup triggered')
                                // products.splice(i,1)

                                finalProduct = {
                                    ...finalProduct,
                                    questions: selected,
                                }
                                products.push(finalProduct);

                                localStorage.setItem("products", JSON.stringify(products));
                                props.history.push(`/${brandId}/${modelId}/${yearId}/${pieceId}/confirm`);
                            } else {
                                finalProduct = {
                                    ...finalProduct,
                                    questions: selected,
                                }
                                products.push(finalProduct);
                                localStorage.setItem("products", JSON.stringify(products));
                                props.history.push(`/${brandId}/${modelId}/${yearId}/${pieceId}/confirm`);
                            }
                        }
                    } else {
                        // console.log('storage was empty')
                        finalProduct = {
                            ...finalProduct,
                            questions: selected,
                        };
                        products.push(finalProduct);
                        localStorage.setItem("products", JSON.stringify(products));
                        props.history.push(`/${brandId}/${modelId}/${yearId}/${pieceId}/confirm`);
                    }
                }
                ;
            } else {
                // console.log('question not exist')
                dispatch(setSpinner(false))
                Products ? (products = Products) : products = []

                if (!products.length == 0 || !products === []) {
                    // console.log('product not empty')

                    products.map(({model, brand}) => {
                        // console.log('map is called')
                        if (Product.brand !== brand || Product.model !== model) {
                            // console.log('rig found')
                            isRig = true
                        }
                    })

                    if (isRig) {
                        // console.log('isRig triggered')
                        setMessage('در ثبت اطلاعات محصول مشکلی پیش آمد')
                        setInBasketBrand(products[0].brand)
                        setInBasketModel(products[0].model)
                        setInBasketYear(products[0].year)
                        setInBasketPiece(products[0].id)
                        setInBasketModal(true)
                        $('#Basket-Exist').modal('show')
                        return
                    } else {
                        // console.log('isRig didnt trigger')
                        const dup = products.find(item => item.id == Product.id)
                        const i = products.findIndex(item => item.id == Product.id)
                        // console.log(dup)
                        // console.log(i)

                        if (dup) {
                            // console.log('dup found')
                            // products.splice(i,1)
                            // dup.number+=Product.id
                            // products.push(dup)
                            finalProduct = {
                                ...finalProduct,
                                questions: selected,
                            }
                            products.push(finalProduct);

                            localStorage.setItem('products', JSON.stringify(products))
                            props.history.push(`/${brandId}/${modelId}/${yearId}/${pieceId}/confirm`)
                        } else {
                            // console.log('dup not found')
                            finalProduct = {
                                ...finalProduct,
                                questions: selected,
                            }
                            products.push(finalProduct);

                            localStorage.setItem("products", JSON.stringify(products));

                            props.history.push(`/${brandId}/${modelId}/${yearId}/${pieceId}/confirm`)
                        }
                    }
                } else {
                    // console.log('storage doesnt exist')

                    products.push(Product)

                    localStorage.setItem('products', JSON.stringify(products))

                    props.history.push(`/${brandId}/${modelId}/${yearId}/${pieceId}/confirm`)
                }
            }
        }, 1000)
    };

    const goToPreviousBasket = () => {
        setMessage('')
        dispatch(setSpinner(true))
        setTimeout(() => {
            dispatch(setSpinner(false))
            props.history.push(`/${inBasketBrand}/${inBasketModel}/${inBasketYear}/${inBasketPiece}/confirm`);
        }, 1000)
    }

    const [GoToNewBasket, setGoToNewBasket] = useState(false)
    const [update, setUpdate] = useState(false)

    const handleNewOrder = () => {
        setGoToNewBasket(true)
        console.log(GoToNewBasket)
    }
    const goToNewBasket = () => {
        goToConfirm()
    }

    useEffect(() => {
        if (GoToNewBasket) {
            localStorage.removeItem('products')
            setUpdate(true)
            if (update) {
                goToNewBasket()
            }
        }
    }, [GoToNewBasket, update])

    const [angleUp, setAngle] = useState(true);

    const handleAngle = () => {
        setAngle(!angleUp);
    };


    useEffect(() => {
        let state = {};
        Questions &&
        Questions.map((question) => {
            state[question.q] = null;
        });
        setSelected(state);
    }, []);


    return (
        <React.Fragment>
            <Header title={"قطعه مورد نظر"}/>

            <div className="container pt-3">
                <ConnectionErr message={message}/>

                <div className="col-12">

                    <div className="modal fade Modal-Man-Date" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" id="Basket-Exist">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="Modal-Header">
                                    توجه !
                                </div>
                                <div className="Modal-Body flex-column px-4">
                                    <p className="text-center">
                                        سبد خرید قبلی شما برای خودروی قبلی هنوز تکمیل نشده است ،
                                        آیا می خواهید سفارش جدیدی ثبت کنید ؟
                                    </p>
                                </div>
                                <div className="Modal-Footer text-center">
                                    <button type="button" className="Man-Date-Confirm-Btn mb-1"
                                            data-dismiss="modal" onClick={handleNewOrder}>سفارش جدید
                                    </button>
                                    <button type="button" className="Man-Date-Confirm-Btn mt-1"
                                            data-dismiss="modal" onClick={goToPreviousBasket}>تکمیل سفارش قبلی
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="d-flex row justify-content-center mb-2">
                    <div className="col-10 Custom-Width Piece-Choose shadow">
                        <div className="row mt-4 mb-3">
                            <div className="col-6 Car-Piece-Title">{Item.name}</div>
                            <div className="col-6 Car-Piece-Serial">{Item.code ? `(${Item.code})` : ''}</div>
                        </div>
                        <hr className="my-2"/>

                        {
                            Item.img ?
                                <div className="col-12 Piece-Choose-Image" style={{backgroundImage: `url(${Item.img})`}}>

                                </div>
                                :
                                <div className="col-12">
                                    <div className="row">
                                        <div
                                            className="col-12 Piece-Choose-Empty-Img"
                                            style={{backgroundImage: `url(${EmptyImg})`}}
                                        ></div>
                                        <div className="col-12 Piece-Choose-Empty-Text">
                                            تصویر وجود ندارد
                                        </div>
                                    </div>
                                </div>
                        }

                        <hr className="my-2"/>
                        <div className="col-12 p-0">
                            <div className="accordion" id="accordionExample">
                                {Questions &&
                                Questions.map((question, idx) => (
                                    <div className="" key={question.q}>
                                        <div className="">
                                            <a
                                                href={`#q-${idx}`}
                                                className="btn btn-link d-flex justify-content-around"
                                                onClick={handleAngle}
                                                data-toggle="collapse"
                                            >
                                                <span className="Piece-Choose-Accrdn-Title">
                                                    {question.q}
                                                </span>
                                                <FontAwesomeIcon
                                                    icon={angleUp ? faAngleUp : faAngleDown}
                                                    className="fa-pull-left mr-auto Piece-Choose-Accrdn-Angle"
                                                    data-toggle="collapse"
                                                    aria-expanded="true"
                                                    aria-controls="collapseOne"
                                                />
                                            </a>
                                        </div>

                                        <div
                                            id={`q-${idx}`}
                                            className="collapse show"
                                        >
                                            <div className="py-0">
                                                {question.a.map((answer) => (
                                                    <div
                                                        className="custom-control my-3 custom-radio"
                                                        key={answer}
                                                    >
                                                        <input
                                                            name={question.q}
                                                            value={answer}
                                                            checked={selected[question.q] === answer}
                                                            type="radio"
                                                            id={answer}
                                                            onChange={(e) => handleChange(e)}
                                                            className="custom-control-input Piece-Choose-Radio"
                                                        />
                                                        <label
                                                            className="custom-control-label Piece-Choose-Radio-label"
                                                            htmlFor={answer}
                                                        >
                                                            {answer}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <hr className="mt-5"/>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="col-12 p-0 mb-3 mx-auto">
                            <div className="row">
                                <div className="Piece-Choose-Radio-label col-3">تعداد</div>
                                <div className="col-7 d-flex Piece-Counter">
                                    <FontAwesomeIcon
                                        onClick={handlePlus}
                                        className="Piece-Counter-Btn"
                                        icon={faPlusCircle}
                                    />
                                    <input
                                        value={Product.number}
                                        readOnly
                                        placeholder={Product.number}
                                        className="Piece-Counter-Count-Input"
                                    ></input>
                                    <FontAwesomeIcon
                                        onClick={handleMinus}
                                        className="Piece-Counter-Btn"
                                        icon={faMinusCircle}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="d-flex row justify-content-center mb-5">
                    <div className="col-10 Custom-Width">
                        <div className="row d-flex">
                            <button className="Piece-Confirm-Btn shadow-sm mr-0" onClick={goToConfirm}>
                                تایید قطعه
                            </button>
                            <button className="Back-Btn shadow-sm" onClick={goBack}>
                                برگشت
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default withRouter(PieceOptions);
