<template>
  <!-- logo和文字 -->
  <div class="header">
    <a href="#/">   <!-- 点击进入首页 -->
      <img class="logo" src="@/assets/Logo1.png" width="25px" />
      <span class="company">邹邹管理系统</span>
    </a>
  <!-- logo和文字结束 -->


  <!--  下拉菜单-->
<el-dropdown @command="handleCommand"><!--  绑定指令,在methods里定义-->
    <span class="el-dropdown-link">
      您好，{{ nick_name }}
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <el-dropdown-menu slot="dropdown">
        <!-- icon是修改图标 ，command是点击后传给方法的值-->
      <el-dropdown-item icon="el-icon-edit" command="edit">>修改密码</el-dropdown-item>

      <el-dropdown-item icon="el-icon-s-operation" command="quit">>退出登录</el-dropdown-item>
      
    </el-dropdown-menu>
</el-dropdown>
  <!--  下拉菜单结束-->


      <!-- 修改密码弹出框开始 -->
    <!-- status-icon验证通过打√，失败打× -->
    <el-dialog title="修改密码" :closeOnClickModal=false :visible.sync="dialogFormVisible" width="400px">
      <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="原始密码" prop="oldPass">
            <el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="pass">
            <el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="checkPass">
            <el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
            <!-- 重置输入框 -->
            <el-button @click="$refs['ruleForm'].resetFields()">重置</el-button>
          </el-form-item>
      </el-form>
  </el-dialog>
  <!-- 修改密码弹出框结束 -->


    

  </div>

</template>

<script>
  import {logout} from '@/api/login' // 导入退出系统接口
  import passwordApi from '@/api/password' // 修改密码
  export default {
    data(){
      // 在return上面进行声明自定义校验

      // 获取token
      const token = localStorage.getItem('zz-token')
      // rule 校验规则 ， value就是输入的值
      const validateOldPass = (rule, value,callback)=>{
          // console.log(, value)
          passwordApi.checkPwd(token, value).then(response=>{
            const res = response.data
            if (res.success){
              // 验证通过，使用element的回调函数
              callback()
            }else{
              // 显示错误信息。msg为接口返回的信息
              callback(new Error(res.msg))
            }
          })
        }
      // 校验密码是否一致
      const validatePass = (rule, value, callback)=>{
          // value就是确认密码，this.ruleForm.pass是新密码
          // value !==this.ruleForm.pass 如果两个密码不想等
          if(value !==this.ruleForm.pass){
            callback(new Error('两次密码不一致'))
          }else{
            // 两次密码相同
            callback()
          }
        }
      // 在return上面进行声明自定义校验，不能以逗号结束

      return{
            // 获取用户昵称
            nick_name:localStorage.getItem('user_info') ,
            dialogFormVisible: false,  // 修改密码弹出框
            rules:{  // 校验规则
              oldPass: [
                    { required: true, message: "原密码不能为空", trigger: "blur" },
                    //  validator自定义校验，会调用validateOldPass
                    {validator: validateOldPass, trigger: 'blur'}
                      ],
              pass: [
                      { required: true, message: "新密码为5-15位", trigger: "blur" ,min: 5, max: 15}],
              checkPass: [
                    { required: true, message: "确认密码不能为空", trigger: "blur" },
                    //   validator自定义校验，会调用validatePass，值改变时就验证
                    {validator: validatePass, trigger: 'change'},
                    {validator: validatePass, trigger: 'blur'}
                              ]
            },  
            ruleForm:{  // 防止输入不了
              oldPass:"",
              pass:"",
              checkPass:""
            }
      }
   
 
    },
    methods: {
      handleCommand(command){
        switch (command) {
          case 'edit':
            // 修改密码
            console.log('修改密码')
            this.handlepwd()
            break
          case 'quit':
            // 退出登录
            this.handleLogout()
            break;
          default:
            break;
  
        }
      },
      // 退出系统
      handleLogout(){
            // 获取token
            const token = localStorage.getItem('zz-token')

            // 调用退出登录接口
          logout(token).then(response=>{
            const res = response.data
            if (res.success){
              // 退出成功，清除本地数据
              localStorage.removeItem('zz-token')
              localStorage.removeItem('user_info')
               // 回到登录页面，重新登录
               this.$router.push('/login')
            }else{
               // 退出失败
               this.$message({
                    showClose: true, // 可以关闭
                    message: res.message,
                    type: 'warning'

                });
            }
          })
      },
      // 修改密码
      handlepwd(){
        // 打开窗口
        this.dialogFormVisible = true
         // 清除数据
         this.$nextTick(()=>{
            this.$refs['ruleForm'].resetFields()
          })
      },
      // 修改密码
      submitForm(formName){
        this.$refs[formName].validate(valid =>{
          if(valid){
              // 获取token
              const token = localStorage.getItem('zz-token')
              // this.ruleForm.checkPass 密码要这样取
              passwordApi.updatePwd(token,this.ruleForm.checkPass).then(response=>{
                  const res = response.data
                  // 不管失败还是成功，都进行提示
                  this.$message({
                    message: res.msg,
                    type: res.success ? 'success' : 'warning'
                  })
                if(res.success){
                      // 更新成功，退出登录，回到登录页面
                     this.handleLogout()
                      // 关闭修改密码窗口
                      this.dialogFormVisible = false
                }
              })
            
          }else{
            // 校验不通过
            return false
          }
        })

      }
  }
}
</script>

<style scoped>
/* logo */
.logo {
  vertical-align: middle; /* 居中 */
  padding: 0px 10px 0px 40px; /* 上右下左 */
}

/* 文字 */
.company {
  position: absolute;
  color: white;
}

/* 下拉菜单 */
.el-dropdown{
    float: right; /* 浮动在右边 */
    margin-right: 40px; /* 靠右40px */
}
/* 系统管理 */
.el-dropdown-link{
    color: white;
    cursor: pointer; /* 鼠标放上去是手的形状 */
}
</style>