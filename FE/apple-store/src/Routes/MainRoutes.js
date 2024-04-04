import Login from "../Pages/login";
import Register from "../Pages/register";

const MainRoutes = [
    {
        path: 'sign-in',
        component: Login,
        title: 'Sign In'
    },
    {
        path: 'sign-up',
        component: Register,
        title: 'Register'
    }
];

export default MainRoutes;