
const INITIAL_STATE={
    questions:[],
    brands:[],
    token:'',
    spinner:false,
    firebase:''

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
        default :
            return state
    }
}

export default utilsReducer;