import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import "bootstrap/dist/css/bootstrap.css"
import "bootstrap/dist/js/bootstrap.min"
import {Provider} from "react-redux"
import {BrowserRouter as Router} from "react-router-dom";
import {createStore} from "redux";
import App from './App';
import * as serviceWorker from './serviceWorker';
import rootReducer from "./redux/reducers/rootReducer";
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import { StylesProvider, jssPreset } from '@material-ui/core/styles';
import {create} from "jss"
import rtl from "jss-rtl"
import {setToken} from "./api/api";
import {initializeApp} from "firebase"
import TagManager from 'react-gtm-module'
import ReactGA from 'react-ga';
import {SnackbarProvider} from "notistack";

const User_id=localStorage.getItem('id');
const User_token=localStorage.getItem('token');

export const initGA=()=>{
    ReactGA.initialize('UA-178271629-1', {
        debug: false,
        titleCase: false,
        gaOptions: {
            userId: User_id,
            siteSpeedSampleRate: 100
        }
    });
}
export const GAview=(page)=>{
    ReactGA.pageview(page);
}
export const GAmodalView=(modal)=>{
    ReactGA.modalview(modal);
}


const tagManagerArgs = {
    gtmId: 'GTM-MRD6K3Z',
    preview: 'env-00',
    dataLayer: {
        userId: User_id,
        userProject: User_token
    }
}
TagManager.initialize(tagManagerArgs)


const store=createStore(
    rootReducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)
const jss = create({ plugins: [...jssPreset().plugins, rtl()] });
const theme = createMuiTheme({
    direction: 'rtl',
});

const token = localStorage.getItem('private_token');
if (token) {
    store.dispatch({ type: 'LOGIN' });
}



    setToken();

    ReactDOM.render(
      <React.StrictMode>
          <StylesProvider jss={jss}>
              <ThemeProvider theme={theme}>
                  <Provider store={store}>
                      <Router>
                         <App />
                      </Router>
                  </Provider>
              </ThemeProvider>
          </StylesProvider>
      </React.StrictMode>,
      document.getElementById('root')
    );


serviceWorker.register();

// initializeApp()

if ("serviceWorker" in navigator) {
    navigator.serviceWorker
        .register("./firebase-messaging-sw.js")
        .then(function(registration) {
            // console.log("Registration successful, scope is:", registration.scope);
        })
        .catch(function(err) {
            // console.log("Service worker registration failed, error:", err);
        });
}