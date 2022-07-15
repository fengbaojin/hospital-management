import Vue from 'vue'
import VueRouter from 'vue-router'
import store from "@/store";
import Main from '../components/Main.vue'

Vue.use(VueRouter)

const routes = [ 
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 提供一个重置路由的方法
export const resetRouter = () => {
  router.matcher = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
  })
}


export const setRoute = () => {
	const storeMenus = JSON.parse(localStorage.getItem("menus"));
	if(storeMenus){
		const manageRoute = {
			path: "/",
			component: Main,
			redirect: '/home',
			hidden: true,
			children: [
				{
					path: 'person', 
					name: 'person', 
					component: () => import('../views/user/person/index.vue')
				},
				{
					path: 'password', 
					name: 'password', 
					component: () => import('../views/user/password/index.vue')
				}
			]
		}
        storeMenus.forEach(item => {
           if(item.path) {
			  let itemMenu = { path: item.path.replace("/", ""), name: item.path.replace("/", ""), meta: {title:item.name}, component: () => import('../views/' + item.pagePath + '/index.vue')}
			  manageRoute.children.push(itemMenu)
		   } else if(item.children.length) {
               item.children.forEach(children => {
				   if(children.path){
					let childrenMenu = { path: children.path.replace("/", ""), name: children.path.replace("/", ""), meta: {title: children.name}, component: () => import('../views/' + children.pagePath + '/index.vue')}
					manageRoute.children.push(childrenMenu)
				   }
			   })
		   }
		})
		console.log(storeMenus)
		router.addRoute(manageRoute)
	}


}

setRoute()


router.beforeEach((to, from, next) => {
  localStorage.setItem("currentPathName", to.meta.title)  // 设置当前的路由名称
  localStorage.setItem("currentPath", to.path)  // 设置当前的路由path
  store.commit("setPath")
  // 未找到路由的情况
  if (!to.matched.length) {
    const storeMenus = localStorage.getItem("menus")
    if (storeMenus) {
      next("/404")
    } else {
      // 跳回登录页面
      next("/login")
    }
  }
  // 其他的情况都放行
  next()

})


export default router
