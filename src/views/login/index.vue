<template>
  <div class="wrapper">
    <div style="margin: 200px auto; background-color: #fff; width: 350px; height: 300px; padding: 20px; border-radius: 10px">
      <div style="margin: 20px 0; text-align: center; font-size: 24px"><b>医药管理系统</b></div>
      <el-form :model="user" :rules="rules" ref="userForm">
        <el-form-item prop="username">
          <el-input size="medium" style="margin: 10px 0" prefix-icon="el-icon-user" v-model="user.username"  placeholder="请输入用户名" autoComplete="on"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input size="medium" style="margin: 10px 0" prefix-icon="el-icon-lock" show-password v-model="user.password" placeholder="请输入密码" autoComplete="on"></el-input>
        </el-form-item>
        <el-form-item>
          <!-- <el-button type="warning" size="small"  autocomplete="off" @click="$router.push('/register')">注册</el-button> -->
          <el-button type="primary" size="small" style="width: 100%" autocomplete="off" @click="login">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import {setRoute} from "@/router";
import { login } from '@/api/APILogin'

export default {
  name: "login",
  data() {
    return {
      user: {},
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
      }
    }
  },
  methods: {
    login() {
      this.$refs['userForm'].validate((valid) => {
        if (valid) {  // 表单校验合法
          login(this.user).then(res => {
            if(res.code === 0) {
              localStorage.setItem("user", JSON.stringify(res.data))  // 存储用户信息到浏览器
              localStorage.setItem("menus", JSON.stringify(res.data.menus))  // 存储用户信息到浏览器
               
              // // 动态设置当前用户的路由
              setRoute()
              this.$router.push("/")
              this.$message.success("登录成功")
              console.log(this.$router.options.routes);
            } else {
              this.$message.error(res.error_description)
            }
          })
        }
      });
    }
  }
}
</script>

<style>
  .wrapper {
    height: 100vh;
    background-image: linear-gradient(to bottom right, #aae6d2 , #436983);
    overflow: hidden;
  }
</style>
