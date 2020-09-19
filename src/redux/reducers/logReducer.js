
const logReducer=(state=false,action)=>{
    switch (action.type) {
        case 'LOGIN':
              return true;
        case 'LOGOUT':
            localStorage.removeItem('private_token')
            return false;
        default :
            return state
    }
}

export default logReducer;