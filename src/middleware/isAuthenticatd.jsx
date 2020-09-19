import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import {connect} from 'react-redux'

const mapStateToProps = state => {
    return {
        Log: state.log
    }
}

// const Logged=localStorage.getItem('logged')

// const Log=useSelector(state=>state.log)

function IsAuthenticated({component: Component, ...props}) {
    const { Log } = props
    return (
        <Route
            render={(props) => (
                !Log ?
                    <Component {...props}/>
                    : <Redirect
                        to={{
                            pathname: '/brands',
                            state: { from: props.location }
                        }}
                    />
            )}
            {...props}
        />
    )
}

export default connect(mapStateToProps)(IsAuthenticated)
