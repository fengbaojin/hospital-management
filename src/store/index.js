import Vue from 'vue'
import Vuex from 'vuex'
import router, {resetRouter} from "@/router";

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    currentPathName: ''
  },
  mutations: {
    setPath (state) {
      state.currentPathName = localStorage.getItem("currentPathName")
    },
    logout() {
        localStorage.clear();
        // 清空缓存
        router.push("/login")

        // 重置路由
        resetRouter() 
    }
  },
  actions: {
  }, 
  modules: {
  }
})
