import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const mapStateToProps = state => {
    return {
        Log: state.log
    }
}

// const Logged=localStorage.getItem('logged')

// const Log=useSelector(state=>state.log)

function PrivateRoute({component: Component, ...props}) {
    const { Log } = props
    return (
        <Route
            render={(props) => (
                Log ?
                    <Component {...props}/>
                    : <Redirect
                        to={{
                            pathname: '/authorize',
                            state: { from: props.location }
                        }}
                    />
            )}
            {...props}
        />
    )
}

export default connect(mapStateToProps)(PrivateRoute)
