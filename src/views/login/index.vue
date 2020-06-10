<template>
    <div class="login-container">
      <!-- :rules 绑定的规则 -->
      <el-form ref="form" :rules="rules" :model="form" label-width="80px" class="login-form">
        <h2 class="login-title">管理系统</h2>
        <el-form-item label="账号" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="submitForm('form')">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </template>
    <script>
import { login,getUserInfo } from "@/api/login";
  export default {
    data() {
      return {
        form: {
          username: "",
          password: ""
        },
        rules: {
          username: [
            {required: true, message: "用户名不能为空", trigger: 'blur'},
            {min: 3, max: 10, message: "用户名3-10位", trigger: 'blur'}
          ],
          password: [
            {required: true, message: "密码不能为空", trigger: 'blur'},
            {min: 5, max: 15, message: "密码5-15位", trigger: 'blur'}
          ]
      }
      };
    },
    methods: {
      submitForm(formName) {
          this.$refs[formName].validate(valid => {
            // console.log(valid) 验证通过为true，有一个不通过就是false
            if (valid) {
              // 通过的逻辑
              login(this.form.username, this.form.password).then(response => {
                const res = response.data;
                console.log(res)
                if (res.success) {
                  // 保存token
                  localStorage.setItem("zz-token", res.data.token);

                  // 获取用户信息
                  const token = localStorage.getItem('zz-token')
                  
                  // 请求头携带token传给后端
                  getUserInfo(token).then(response =>{
                    const res = response.data;
                    console.log(res)
                  })
                  

                  // 前往首页
                  this.$router.push("/");
                }else{
                  this.$message({
                    message:res.msg,
                    type:"warning"
                  })
                }
              })
              
            } else {
              console.log('验证失败');
              return false;
            }
          });
      }
    }
  };
  </script>

  <style scoped>
  .login-form {
    width: 350px;
    margin: 160px auto; /* 上下间距160px，左右自动居中*/
    background-color: rgb(255, 255, 255, 0.8); /* 透明背景色 */
    padding: 30px;
    border-radius: 20px; /* 圆角 */
  }

  /* 背景 */
  .login-container {
    position: absolute;
    width: 100%;
    height: 100%;
    background: url("../../assets/login.png");
  }

  /* 标题 */
  .login-title {
    color: #303133;
    text-align: center;
  }
  </style> --> 