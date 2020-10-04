import React from 'react'
import { Route, Redirect } from 'react-router-dom'
import { useSelector } from 'react-redux'

function ShowOnce({component: Component, ...props}) {
    const cancel=useSelector(state=>state.utils.cancelOrder);
    const success=useSelector(state=>state.utils.successOrder);
    return (
        <Route
            render={(props) => (
                cancel||success ?
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
export default ShowOnce;