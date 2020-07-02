<template>
  <div class="login-container">
    <!-- :rules 绑定的规则 -->
    <el-form ref="form" :rules="rules" :model="form" label-width="80px" class="login-form">
      <h2 class="login-title">管理系统</h2>
      <el-form-item label="账号" prop="username">
        <el-input v-model="form.username"></el-input>
      </el-form-item>
      <el-form-item label="密码"  prop="password">
        <!-- show-password 密码输入框 -->
        <el-input show-password v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form.email"></el-input>
      </el-form-item>
       <el-form-item label="昵称" prop="nick_name">
        <el-input v-model="form.nick_name"></el-input>
      </el-form-item>
      
      <div class="account">
        <el-link type="info" :underline="false">已有账号?</el-link>
        <router-link to="/login">
          <el-link type="primary" >立即登录</el-link>
        </router-link>
      </div>

      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">注册</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
  <script>
import { register } from "@/api/register";
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
        email: "",
        nick_name: ""
      },
      rules: {
        username: [
          {required: true, message: "用户名不能为空", trigger: 'blur'},
          {min: 3, max: 10, message: "用户名3-10位", trigger: 'blur'}
        ],
        password: [
          {required: true, message: "密码不能为空", trigger: 'blur'},
          {min: 5, max: 15, message: "密码5-15位", trigger: 'blur'}
        ],
        email: [
          {required: true, message: "邮箱不能为空", trigger: 'blur'},
        ],
        nick_name: [
              {required: true, message: "昵称不能为空", trigger: 'blur'},
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
            register(this.form.username, this.form.password,this.form.email,this.form.nick_name).then(response => {
              const res = response.data;
              console.log(res)
              if (res.success) {

                
                  this.$message({
                      message: res.msg,
                      type:"success"
                  })
                

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
  margin: 100px auto; /* 上下间距160px，左右自动居中*/
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
  background-size: cover;  /* 让图片撑满整个屏幕 */
}

/* 标题 */
.login-title {
  color: #303133;
  text-align: center;
}

.account {
  padding-left: 80px;
  margin-top: -6px;
  margin-bottom: 13px;
}
</style> --> 