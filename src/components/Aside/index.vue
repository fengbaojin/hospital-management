<template>
  <el-menu style="min-height: 100%; overflow-x: hidden"
           background-color="rgb(48, 65, 86)"
           text-color="#fff"
           :default-active="activePath"
           active-text-color="#ffd04b"
           :collapse-transition="false"
           :collapse="isCollapse"
           router
  >
    <div style="height: 60px; line-height: 60px; text-align: center">
      <b style="color: white; margin-left: 5px" v-show="logoTextShow">医药管理系统</b>
      <b style="color: white; margin-left: 5px" v-if="!logoTextShow">后台</b>
    </div>    

    <div v-for="item in menus" :key="item.menuId">
        <div v-if="item.path">
          <el-menu-item :index="item.path">
            <i :class="item.icon"></i>
            <span slot="title">{{ item.name }}</span>
          </el-menu-item>
        </div>
        <div v-else>
          <el-submenu :index="item.menuId + ''">
            <template slot="title">
              <i :class="item.icon"></i>
              <span slot="title">{{ item.name }}</span>
            </template>
            <div  v-for="subItem in item.children" :key="subItem.menuId">
              <el-menu-item :index="subItem.path">
                <i :class="subItem.icon"></i>
                <span slot="title">{{ subItem.name }}</span>
              </el-menu-item>
            </div>
          </el-submenu>
        </div>
    </div>
    
  </el-menu>
</template>

<script>
export default {
  name: "Aside",
  props: {
    isCollapse: Boolean,
    logoTextShow: Boolean
  },
  data() {
    return {
      menus: localStorage.getItem("menus") ? JSON.parse(localStorage.getItem("menus")) : [],
      activePath: localStorage.getItem("currentPath") == "" ? "/home" : localStorage.getItem("currentPath")
    }
  },
  computed: {
    noChildren() {
      console.log(this.menus);
       return this.menus.filter(item => !item.children)
    },
    hasChildren() {
      return this.menus.filter(item => item.children)
    }
  },
  methods: {
  }
}
</script>

<style>
.el-menu-item.is-active {
  background-color: rgb(38, 52, 69) !important;
}
.el-menu-item:hover {
  background-color: rgb(38, 52, 69) !important;
}

.el-submenu__title:hover {
  background-color: rgb(38, 52, 69) !important;
}
/*解决收缩菜单文字不消失问题*/
.el-menu--collapse span {
  visibility: hidden;
}
</style>
