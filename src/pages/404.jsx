import React from "react";
import Header from "../components/Header";
import Loading from "../assets/icons/clock.svg";


function NotFound(props) {

    // setTimeout(()=>{
    //     props.history.push('/brands')
    // },2000)

    return(
        <React.Fragment>

            <Header title={'یافت نشد'}/>

            <div className="container-fluid">
                <div className="row">
                    <div className="col-12 mt-3">
                        <div className="d-flex mt-5 justify-content-center align-items-center">
                            <div className="d-flex mt-5 flex-column justify-content-center align-items-center">
                                <div className="mb-4">
                                    {/*<img src={Loading} className="Clock-Spinner"></img>*/}
                                </div>

                                <div>
                                    <p className="Final-Message text-center">
                                        404
                                    </p>
                                    <p className="Final-Message">
                                        صفحه مورد نظر یافت نشد ...
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </React.Fragment>
    )
}

export default NotFound;