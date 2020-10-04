export const setBrands=(brands)=>{
    return{
        type:'BRANDS',
        payload:brands
    }
}
export const Login=()=>{
    return{
        type:'LOGIN'
    }
}
export const Logout=()=>{
    return{
        type:'LOGOUT'
    }
}
export const setSpinner=(payload)=>{
    return{
        type:'SPINNER',
        payload:payload
    }
}
export const setFirebase=(payload)=>{
    return{
        type:'FIREBASE',
        payload:payload
    }
}
export const setNotifyCount=(count)=>{
    return{
        type:'NOTIFY_COUNT',
        payload:count
    }
}
export const updateNotify=()=>{
    return{
        type:'UPDATE_NOTIFY'
    }
}
export const setPopUp=(payload)=>{
    return{
        type:'SET_POPUP',
        payload:payload
    }
}
export const setCancelOrder=(payload)=>{
    return{
        type:'CANCEL_ORDER',
        payload:payload
    }
}
export const setSuccessOrder=(payload)=>{
    return{
        type:'SUCCESS_ORDER',
        payload:payload
    }
}