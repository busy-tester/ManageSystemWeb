<template>
    <div>
  
      <!-- 搜索框 -->
      <!-- :inline="true" 表单一行显示 -->
      <!-- :model="searchMap" 绑定到这个参数上 -->
      <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px">
        <!-- 重置会看 el-form-item 组件元素的 prop 上是否指定了字段名，指定了才会重置生效 -->
        <el-form-item prop="account">
          <!--prop需要在data里指定，不指定会出现重置不了的问题， placeholder背景文案 -->
          <el-input v-model="searchMap.account" placeholder="账号" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item prop="name">
          <el-input v-model="searchMap.name" placeholder="姓名" style="width: 200px"></el-input>
        </el-form-item>
  
        <el-form-item>
          <el-button type="primary" @click="fetchData">查询</el-button>
          <el-button type="primary" @click="handleAdd">新增</el-button>
          <el-button @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- 搜索框结束 -->
  
  
      <!-- 列表页面
        :data绑定渲染的数据
        border 表格边框
        height 表格高度
      -->
      <el-table :data="list" height="380" border style="width: 100%">
        <!-- type='index'获取索引值，从1开始，label显示的标题，prop数据字段名，width列宽 -->
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="account" label="账号" width="180"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="age" label="年龄" width="100"></el-table-column>
        <el-table-column prop="iphone" label="电话" width="120"></el-table-column>
        <el-table-column prop="salary" label="薪酬"></el-table-column>
        <el-table-column prop="entry_time" label="入职时间"></el-table-column>
  
        <!-- 操作 -->
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit( scope.row.id)">编辑</el-button>
            <!-- 根据后端返回该行的id进行编辑和删除 -->
            <el-button size="mini" type="danger" @click="handleDelete( scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 列表页面结束 -->
  
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currenPage"
        :page-sizes="[10,15, 20, 30]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
      <!-- 分页结束 --> 
  
  
      <!-- 弹出新增窗口 
          title 窗口的标题
          :visible.sync 当它true的时候，窗口会被弹出
      -->
      <!-- :rules="rules"校验，需要在校验的字段上指定prop -->
      <!-- 这里都要绑定prop，并且在data里声明，要不然弹框里的数据不会清空或者不能输入 -->
      <!-- :closeOnClickModal=false 点击空白区域不关闭弹框，默认为true -->
      <el-dialog title="新增员工" :closeOnClickModal=false :visible.sync="dialogFormVisible" width="500px">
        <el-form
          :rules="rules"
          ref="pojoForm"
          label-width="100px"
          label-position="right"
          style="width: 400px;"
          :model="pojo"
        >
          <el-form-item label="账号"  prop="account">
            <el-input v-model="pojo.account" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item label="姓名"  prop="name">
            <el-input v-model="pojo.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="年龄"  prop="age">
            <el-input v-model="pojo.age" placeholder="请输入年龄"></el-input>
          </el-form-item>
          <el-form-item label="电话"  prop="iphone">
            <el-input v-model="pojo.iphone" placeholder="请输入电话"></el-input>
          </el-form-item>
          <el-form-item label="薪酬"  prop="salary">
            <el-input v-model="pojo.salary" placeholder="请输入薪酬"></el-input>
          </el-form-item>
          <el-form-item label="入职时间" prop="entry_time">
            <!-- value-format 是指定绑定值的格式 -->
            <el-date-picker
              style="width: 200px"
              value-format="yyyy-MM-dd"
              v-model="pojo.entry_time"
              type="date"
              placeholder="入职时间"
            ></el-date-picker>
          </el-form-item>
        
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addData('pojoForm')">确 定</el-button>
    
          
        </div>
      </el-dialog>
      <!-- 新增弹出窗口结束 -->



    <!-- 弹出编辑窗口 
          title 窗口的标题
          :visible.sync 当它true的时候，窗口会被弹出
      -->
      <!-- :rules="rules"校验，需要在校验的字段上指定prop -->
      <!-- 这里都要绑定prop，并且在data里声明，要不然弹框里的数据不会清空或者不能输入 -->
      <!-- :closeOnClickModal=false 点击空白区域不关闭弹框，默认为true -->
      <el-dialog title="编辑员工" :closeOnClickModal=false :visible.sync="dialogFormVisibleedit" width="500px">
        <el-form
          :rules="rules"
          ref="pojoFormEdit"
          label-width="100px"
          label-position="right"
          style="width: 400px;"
          :model="pojoedit"
        >
          <el-form-item label="账号"  prop="account">
            <el-input v-model="pojoedit.account" placeholder="请输入账号"></el-input>
          </el-form-item>
          <el-form-item label="姓名"  prop="name">
            <el-input v-model="pojoedit.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="年龄"  prop="age">
            <el-input v-model="pojoedit.age" placeholder="请输入年龄"></el-input>
          </el-form-item>
          <el-form-item label="电话"  prop="iphone">
            <el-input v-model="pojoedit.iphone" placeholder="请输入电话"></el-input>
          </el-form-item>
          <el-form-item label="薪酬"  prop="salary">
            <el-input v-model="pojoedit.salary" placeholder="请输入薪酬"></el-input>
          </el-form-item>
          <el-form-item label="入职时间" prop="entry_time">
            <!-- value-format 是指定绑定值的格式 -->
            <el-date-picker
              style="width: 200px"
              value-format="yyyy-MM-dd"
              v-model="pojoedit.entry_time"
              type="date"
              placeholder="入职时间"
            ></el-date-picker>
          </el-form-item>
        
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleedit = false">取 消</el-button>
          <el-button type="primary" @click="updateData('pojoFormEdit')">确 定</el-button>
         
          
        </div>
      </el-dialog>
      <!-- 编辑弹出窗口结束 -->


    </div>
  </template>
  
  
  <script>
  import StaffApi from '@/api/staff'
  export default {
      data(){
        return{
        list: [], // 列表渲染的数据
        total: 0, // 总记录数
        currenPage: 1, // 当前页码
        pageSize: 10, // 每页显示的数据条数
        dialogFormVisible: false, //控制新增对话框，默认不弹出
        dialogFormVisibleedit: false, //控制编辑对话框，默认不弹出
        searchMap: {
          // 条件查询绑定的条件值,搜索字段有2个
          account: '',
          name: ''
        },
        pojo: {
          // 提交的数据，不写有时候会导致输入框输入不了
          id: null,
          account: '',
          name: '',
          age: '',
          iphone: '',
          salary: '',
          entry_time: ''
        },       
        pojoedit: {
          // 提交的数据，不写有时候会导致输入框输入不了
          id: null,
          account: '',
          name: '',
          age: '',
          iphone: '',
          salary: '',
          entry_time: ''
        },
        rules: {
          // 校验规则
          account: [{ required: true, message: "账号不能为空", trigger: "blur" }],
          name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
        },
        }
      },
      created(){
      // 调接口请求数据，将调接口定义一个方法，在created里调用这个方法
        this.fetchData()
      },
      methods:{
        fetchData(){
            // 获取token
            const token = localStorage.getItem('zz-token')
            StaffApi.getList(token,this.pageSize,this.currenPage,this.searchMap).then(response=>{
                // console.log(response.data)
                const res = response.data
                this.list = res.data
                this.total = res.total
          })
        },
        // 当每页显示条数改变后被触发，val是最新的每页显示条数
        handleSizeChange(val){
          this.pageSize = val;
          this.fetchData();
        },
        handleCurrentChange(val){
          this.currenPage = val
          this.fetchData();
        },
        // 弹出新增窗口
        handleAdd(){
        console.log(this.pojo);
        // this.pojo = {}
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          // this.$nextTick()它是一个异步事件，当渲染结束 之后 ，它的回调函数才会被执行
          // 弹出窗口打开之后 ，需要加载Dom, 就需要花费一点时间，我们就应该等待它加载完dom之后，再进行调用resetFields方法，重置表单和清除样式
          this.$refs["pojoForm"].resetFields();
        });
        },

        // 重置功能,element ui 提供的功能
        resetForm(formName){
           this.$refs[formName].resetFields();
           this.fetchData();
        },
      // 提交新增数据,formName就是传过来的pojoForm
      addData(formName) {
        // console.log('数据',formName)
        this.$refs[formName].validate(valid => {
          if (valid) {
            //提交表单
            // 获取token
            const token = localStorage.getItem('zz-token')
            console.log("addData");
            // pojo才是提交到后台的数据，不是formName
            StaffApi.add(token,this.pojo).then(response => {
              const res = response.data;
              if (res.success) {
                //新增成功，刷新列表数据
                this.fetchData();
                this.dialogFormVisible = false; // 关闭窗口
                this.$message({
                    message: res.msg,
                    type: 'success'
                  });
              } else {
                // 失败，来点提示信息
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            });
          } else {  // 没有校验通过，返回false
            return false;
          }
        });
      },
      // 更新接口
      updateData(formName) {
        console.log("updateData");
        this.$refs[formName].validate(valid => {
          if (valid) {
            // 获取token
            const token = localStorage.getItem('zz-token')

            // 提交更新
            StaffApi.update(token,this.pojoedit).then(response => {
              const res = response.data;
              if (res.success) {
                // 刷新列表
                this.fetchData();
                this.dialogFormVisibleedit = false; // 关闭弹窗
                this.$message({
                  message: res.msg,
                  type: "success"
                });
              } else {
                this.$message({
                  message: res.msg,
                  type: "warning"
                });
              }
            });
          } else {  // 没有校验通过，返回false
            return false;
          }
        });
      },
      // 打开编辑窗口
      handleEdit(id) {
        console.log("编辑", id);
        this.dialogFormVisibleedit = true; // 要打开编辑窗口
        // 获取token
        const token = localStorage.getItem('zz-token')
        StaffApi.getById(id,token).then(response => {
          const res = response.data;
          if (res.success) {
            this.pojoedit = res.data;  // 将数据赋值给pojo显示在输入框里
            console.log('编辑',this.pojo);  
          }
        });
      },

      // 删除员工
      handleDelete(id) {
        console.log('删除', id)
              this.$confirm('确认删除这条记录吗？', '提示', {
                  confirmButtonText: '确认',
                  cancelButtonText: '取消',
              }).then(() => {
                  // 确认
                  console.log('确认')
                // 获取token
                const token = localStorage.getItem('zz-token')
                StaffApi.deleteById(id,token).then(response => {
                      // console.log(response)
                      const res = response.data
                      // 删除成功或失败的提示信息
                      this.$message({
                          message: res.msg,
                          type: res.success ? 'success': 'error'
                      })
                      if(res.success) {
                          // 删除成功，刷新列表数据
                          this.fetchData()
                      }
                  })
              }).catch(() => {
                  // 取消，不用理会
                  console.log('取消')
              })
      },
      },
      }
  </script>