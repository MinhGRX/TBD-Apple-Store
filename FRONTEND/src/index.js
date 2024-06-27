import { createRoot } from 'react-dom/client';

// third party
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { GoogleOAuthProvider } from '@react-oauth/google';
// project imports
import * as serviceWorker from 'serviceWorker';
import App from 'App';
import { store } from 'store';
// style + assets
import 'assets/scss/style.scss';
import config from './config';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-toastify/dist/ReactToastify.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../src/scss/Router.scss';

// ==============================|| REACT DOM RENDER  ||============================== //

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <Provider store={store}>
    <GoogleOAuthProvider clientId="922646833014-ii1jccpqe21t52j71imk8hudn14sh9mr.apps.googleusercontent.com">
      <BrowserRouter basename={config.basename}>
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();