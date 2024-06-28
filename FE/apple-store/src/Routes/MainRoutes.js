import Homepage from "../UI-Component/homepage";
import SignIn from "../UI-Component/SignIn";
import SignUp from "../UI-Component/SignUp";

const MainRoutes = [
    {
        path: 'sign-in',
        component: SignIn,
        title: 'Sign In'
    },
    {
        path: 'sign-up',
        component: SignUp,
        title: 'Register'
    },
    {
        path: 'homepage',
        component: Homepage,
        title: 'Homepage'
    }
];

export default MainRoutes;