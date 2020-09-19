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