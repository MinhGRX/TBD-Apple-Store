import Homepage from "../Pages/homepage";
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
    },
    {
        path: 'home',
        component: Homepage,
        title: 'Homepage'
    }
];

export default MainRoutes;