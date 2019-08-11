import Vue from 'vue'
import Router from 'vue-router'
// import Login from './components/Login.vue'
const Login = () => import(/* webpackChunkName:"login_home_welcome" */ './components/Login.vue')
// import Home from './components/Home.vue'
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ './components/Home.vue')
// import Welcome from './components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ './components/Welcome.vue')
// import Users from './components/user/Users.vue'
const Users = () => import(/* webpackChunkName:"user" */ './components/user/Users.vue')
// import Roles from './components/jurisdiction/Roles.vue'
const Roles = () => import(/* webpackChunkName:"power" */ './components/jurisdiction/Roles.vue')
// import Rights from './components/jurisdiction/Rights.vue'
const Rights = () => import(/* webpackChunkName:"power" */ './components/jurisdiction/Rights.vue')
// import List from './components/goods/List.vue'
const List = () => import(/* webpackChunkName:"goods" */ './components/goods/List.vue')
// import Categories from './components/goods/Categories.vue'
const Categories = () => import(/* webpackChunkName:"goods" */ './components/goods/Categories.vue')
// import Params from './components/goods/Params.vue'
const Params = () => import(/* webpackChunkName:"goods" */ './components/goods/Params.vue')
// import Add from './components/goods/Add.vue'
const Add = () => import(/* webpackChunkName:"goods" */ './components/goods/Add.vue')
// import Orders from './components/orders/Orders.vue'  
const Orders = () => import(/* webpackChunkName:"Orders" */ './components/orders/Orders.vue')
// import Reports from './components/reports/Reports.vue'  
const Reports = () => import(/* webpackChunkName:"Orders" */ './components/reports/Reports.vue')  
Vue.use(Router)

const router = new Router({
    routes: [{
        path: '/',
        redirect: 'login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home,
        children: [{
            path: '/home',
            redirect: '/welcome'
        },
        {
            path: '/welcome',
            component: Welcome
        },
        {
            path: '/users',
            component: Users
        },
        {
            path: '/roles',
            component: Roles
        },
        {
            path: '/rights',
            component: Rights
        },
        {
            path: '/goods',
            component: List
        },
        {
            path: '/categories',
            component: Categories
        },
        {
            path: '/params',
            component: Params
        },
        {
            path: '/goods/add',
            component: Add
        },
        {
            path: '/orders',
            component: Orders
        },
        {
            path: '/reports',
            component: Reports
        }
        ]
    }
    ]
})

router.beforeEach((to, from, next) => {
    var tokenstr = window.sessionStorage.getItem('token')
    if (to.path == '/login' && !tokenstr) return next()
    if (!tokenstr) return next('/login')
    if (to.path == '/login') return next('/home')

    next()
})
export default router
