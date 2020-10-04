
const INITIAL_STATE={
    questions:[],
    brands:[],
    token:'',
    spinner:false,
    firebase:'',
    notifyCount:0,
    updateNotify:0,
    popUp:null,
    cancelOrder:false,
    successOrder:false,

}

const utilsReducer=(state=INITIAL_STATE,action)=>{
    switch (action.type) {
        case 'BRANDS' :
            return Object.assign({},state,{
                brands:action.payload
            });
        case 'QUESTIONS':
            return Object.assign({},state,{
                questions:action.payload
            });
        case 'TOKEN':
            return Object.assign({},state,{
                token:action.payload
            });
        case 'SPINNER':
            return Object.assign({},state,{
                spinner:action.payload
            });
        case 'FIREBASE':
            return Object.assign({},state,{
                firebase:action.payload
            });
        case 'NOTIFY_COUNT':
            return Object.assign({},state,{
                notifyCount:action.payload
            });
        case 'UPDATE_NOTIFY':
            return Object.assign({},state,{
                updateNotify:state+1
            });
        case 'SET_POPUP':
            return Object.assign({},state,{
                popUp:action.payload
            });
        case 'CANCEL_ORDER':
            return Object.assign({},state,{
                cancelOrder:action.payload
            });
        case 'SUCCESS_ORDER':
            return Object.assign({},state,{
                successOrder:action.payload
            });
        default :
            return state
    }
}

export default utilsReducer;