import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Home from './components/Home.vue'
import Users from './components/user/Users.vue'
import Roles from './components/jurisdiction/Roles.vue'
import Welcome from './components/Welcome.vue'

Vue.use(Router)

const router= new Router({
  routes: [
	  {path:'/',redirect:'login'},
    {path:'/login',component:Login },
	{path:'/home',component:Home ,children:[
		{path:'/home',redirect:'/welcome' },
		{path:'/welcome',component:Welcome },
		{path:'/users',component:Users },
		{path:'/roles',component:Roles }
	]}
  ]
})

router.beforeEach((to,from,next)=>{
	var tokenstr=window.sessionStorage.getItem('token')
	if(to.path=='/login'&&!tokenstr) return next()
	if(!tokenstr) return next('/login')
	if(to.path=='/login') return next('/home')
	
	next()
})
export default router 