import Axios from "axios";

const axiosAgent = Axios.create({
    baseURL: 'https://support.banitro.com'
    // baseURL: 'http://localhost/banitro-back'
});

const Token = localStorage.getItem('private_token')

export const setToken = () => axiosAgent.defaults.headers.common['Authorization'] = Token
export const SetToken = (stateTok) => axiosAgent.defaults.headers.common['Authorization'] = stateTok


// export const testReq=()=>axiosAgent.get('/api/banner/');
export const checkReq = (orderId) => axiosAgent.get('/api/v1/suggest_check', {params: {order_id: orderId}});
export const finalDataReq = (orderId) => axiosAgent.get('/api/v1/get_suggest', {params: {order_id: orderId}});
export const reportReq = () => axiosAgent.get('/api/v1/history');
export const profileReq = () => axiosAgent.get('/api/v1/profile');
export const profileEditReq = (body) => axiosAgent.post('/api/v1/profile/edit', body);
export const brandsReq = () => axiosAgent.get('/api/v1/cars');
export const searchReq = (body) => axiosAgent.post('/api/v1/search', body);
export const sendCodeReq = (body) => axiosAgent.post('/api/v1/otp', body);
export const orderSubmitReq = (body) => axiosAgent.post('/api/v1/order_submit', body);
export const finalReq = (body) => axiosAgent.post('/api/v1/set', body);
export const regLoginReq = (body) => axiosAgent.post('/api/v1/loginregister', body);


export const cancelReq = (body) => axiosAgent.post('/api/v1/cancel', body);
export const isPwaReq = () => axiosAgent.post('/api/v1/is_pwa');
export const notifReq = () => axiosAgent.get('/api/v1/notif');
