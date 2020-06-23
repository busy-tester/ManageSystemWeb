<template>
    <div>
         <!-- 搜索框 -->
    <!-- :inline="true" 表单一行显示 -->
    <!-- :model="searchMap" 绑定到这个参数上 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px">
        <!-- 重置会看 el-form-item 组件元素的 prop 上是否指定了字段名，指定了才会重置生效 -->
        <el-form-item prop="supplier_name">
          <!-- placeholder背景文案 -->
          <el-input v-model="searchMap.supplier_name" placeholder="供应商名称" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item prop="contacts">

          <el-input v-model="searchMap.contacts"   placeholder="联系人" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item prop="contacts_iphone">
          <el-input v-model="searchMap.contacts_iphone"  placeholder="联系电话" style="width: 200px"></el-input>
        </el-form-item>
      
  
        <el-form-item>
          <el-button type="primary" @click="fetchData">查询</el-button>
          <el-button type="primary"  @click="handleAdd">新增</el-button>
          <el-button  @click="resetForm('searchForm')">重置</el-button> 
        </el-form-item>
      </el-form>
      <!-- 搜索框结束 -->  



      <!-- 列表页面
      :data绑定渲染的数据，data 里我们定义的上list
      border 表格边框，表头最上面的那个边框
      height 表格高度
    -->
    <el-table  
    :data="list"
     height="380"
     border 
     style="width: 100%">
      <!-- type='index'获取索引值，从1开始，label显示的标题，prop数据字段名，width列宽 -->
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column prop="supplier_name" label="供应商名称" width="180"></el-table-column>
      <el-table-column prop="contacts" label="联系人" width='200'></el-table-column>
      <el-table-column prop="contacts_iphone" label="联系电话" width="180"></el-table-column>
      <el-table-column prop="remarks" label="备注" ></el-table-column>

      <!-- 操作 -->
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit( scope.row.id)">编辑</el-button>
          <!-- 根据后端返回该行的id进行编辑和删除 -->
          <el-button size="mini" type="danger" @click="handleDelete( scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 列表数据结束 -->


       <!-- 弹出供应商新增窗口 
        title 窗口的标题
        :visible.sync 当它true的时候，窗口会被弹出
    -->
    <!-- :rules="rules"校验，需要在校验的字段上指定prop -->
    <!-- 这里都要绑定prop，并且在data里声明，要不然弹框里的数据不会清空或者不能输入 -->
    <el-dialog title="添加供应商" :closeOnClickModal=false :visible.sync="dialogFormVisible" width="500px">
        <el-form
          :rules="rules"
          ref="pojoForm"
          label-width="100px"
          label-position="right"
          style="width: 400px;"
          :model="pojo"
        >
          <el-form-item label="供应商名称" prop="supplier_name">
            <el-input v-model="pojo.supplier_name" placeholder="请输入供应商名称"></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="contacts">
            <el-input v-model="pojo.contacts" placeholder="请输入联系人"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="contacts_iphone">
            <el-input v-model="pojo.contacts_iphone" placeholder="请输入联系电话"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input type="textarea" v-model="pojo.remarks" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addData('pojoForm')">确 定</el-button>
          
        </div>
      </el-dialog>
      <!-- 弹出新增供应商窗口结束 -->


       <!-- 弹出编辑供应商新增窗口 
        title 窗口的标题
        :visible.sync 当它true的时候，窗口会被弹出
    -->
    <!-- :rules="rules"校验，需要在校验的字段上指定prop -->
    <!-- 这里都要绑定prop，并且在data里声明，要不然弹框里的数据不会清空或者不能输入 -->
    <el-dialog title="编辑供应商" :closeOnClickModal=false :visible.sync="dialogFormVisibleedit" width="500px">
        <el-form
          :rules="rules"
          ref="pojoFormEdit"
          label-width="100px"
          label-position="right"
          style="width: 400px;"
          :model="pojoedit"
        >
          <el-form-item label="供应商名称" prop="supplier_name">
            <el-input v-model="pojoedit.supplier_name" placeholder="请输入供应商名称"></el-input>
          </el-form-item>
          <el-form-item label="联系人" prop="contacts">
            <el-input v-model="pojoedit.contacts" placeholder="请输入联系人"></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="contacts_iphone">
            <el-input v-model="pojoedit.contacts_iphone" placeholder="请输入联系电话"></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remarks">
            <el-input type="textarea" v-model="pojoedit.remarks" placeholder="请输入备注"></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisibleedit = false">取 消</el-button>
          <el-button type="primary" @click="updateData('pojoFormEdit')">确 定</el-button>
          
        </div>
      </el-dialog>
      <!-- 弹出编辑窗口结束 -->


     <!-- 分页 -->
     <!--
         handleSizeChange 改变每页多少条调用这个方法，会传选择的条数过去
         handleCurrentChange 点击页码调用这个方法，会传点击的页码过去
          current-page当前的页码，data里定义的1，默认第一页
          page-sizes 选择项，每页显示多少条
          page-size 每页显示多少条，data里定义
          layout="total, sizes, prev, pager, next, jumper"
          total 总共多少条，去掉后不显示，sizes选择项，prev上一页的箭头，pager页码，next下一页的箭头，jumper前往多少页
        -->
        <el-pagination
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange"
        :current-page="currenPage"
        :page-sizes="[10, 15, 20, 30]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        ></el-pagination>
         <!-- 分页结束 -->



    </div>
</template>
<script>
import supplierApi from '@/api/supplier'  // 导入供应商接口
export default{
    data(){
        return{
            list: [], // 数据传给list,列表渲染的数据
            currenPage: 1, // 当前页码
            pageSize: 10, // 每页显示的数据条数
            total: 0, // 总条数
            searchMap:{  // 条件查询绑定的字段
                supplier_name:'',
                contacts:'',
                contacts_iphone:''
                    },  
            dialogFormVisible: false, // 新增弹出框默认为 false
            dialogFormVisibleedit: false, // 控制编辑对话框
            pojo:{   // 提交的数据，不写会导致输入不了的问题
                id: null,
                supplier_name:'',
                contacts:'',
                contacts_iphone: '',
                remarks:''
            },
            pojoedit: {
              // 编辑的数据，不写有时候会导致输入框输入不了
              
              supplier_name: "",
              contacts: "",
              contacts_iphone: "",
              remarks: "",
            },
            rules:{ // 验证规则
                supplier_name:[{required: true, message:'供应商不能为空',trigger:'blur'}],
                contacts:[{required: true, message:'联系人不能为空',trigger:'blur'}]
            } 
        }
    },

    created(){  // 调接口请求数据，将调接口定义一个方法，在created里调用这个方法
        this.fetchData()
    },
    methods: {
        fetchData(){  // 获取数据
            // 获取token
            const token = localStorage.getItem('zz-token')
            // this.pageSize,this.currenPage 分页的条数和页码，要this.
            supplierApi.getList(token,this.pageSize,this.currenPage,this.searchMap).then( response=>{
                const res = response.data
                this.total = res.total  // 将接口返回的total 覆盖 data里的total
                this.list = res.data  // 将返回数据的data赋值给list 
            })
        },
       // 打开编辑窗口
       handleEdit(id) {
        console.log("编辑", id);
        this.dialogFormVisibleedit = true;
        // 获取token
        const token = localStorage.getItem('zz-token')
        supplierApi.getById(id,token).then(response => {
          const res = response.data;
          if (res.success) {
            this.pojoedit = res.data;  // 将数据赋值给pojoedit显示在输入框里
            console.log(this.pojoedit);  
          }
        });
      },

      // 更新接口
      updateData(formName) {
          console.log("updateData");
          this.$refs[formName].validate(valid => {
            if (valid) {
              const token = localStorage.getItem('zz-token')
              // 提交更新
              supplierApi.update(this.pojoedit,token).then(response => {
                const res = response.data;
                if (res.success) {
                  // 刷新列表
                  this.fetchData();
                  this.dialogFormVisibleedit = false; // 关闭弹窗
                  // 提示修改成功
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
      // 删除会员
      handleDelete(id) {
        console.log('删除', id)
              this.$confirm('该操作将删除供应商和对应的商品数据，确认删除吗？。', '提示', {
                  confirmButtonText: '确认',
                  cancelButtonText: '取消',
              }).then(() => {
                  // 确认
                  console.log('确认')
                  // 获取token
                  const token = localStorage.getItem('zz-token')
                  supplierApi.deleteById(id,token).then(response => {
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
        // 当每页显示条数改变后被触发，val是最新的每页显示条数
        handleSizeChange(val) {
            this.pageSize = val;
            this.fetchData();
        },
        // 当页码改变后被触发，val是最新的页码
        handleCurrentChange(val) {
            this.currenPage = val;
            this.fetchData();
          },
        // 重置功能,element ui 提供的功能
        resetForm(formName) {
          // 重置要看 el-form-item 组件元素的 prop 上是否指定了字段名，指定了才会重置生效
            this.$refs[formName].resetFields();
            this.fetchData();
          },
        // 弹出新增窗口
        handleAdd() {
        
            // this.pojo = {}
            this.dialogFormVisible = true;
            this.$nextTick(() => {
                // this.$nextTick()它是一个异步事件，当渲染结束 之后 ，它的回调函数才会被执行
                // 弹出窗口打开之后 ，需要加载Dom, 就需要花费一点时间，我们就应该等待它加载完dom之后，再进行调用resetFields方法，重置表单和清除样式
                this.$refs["pojoForm"].resetFields();
            });
        },
        // 新增数据
        addData(formName){
        // console.log('数据',formName)
            this.$refs[formName].validate(valid =>{
            if(valid){
                // 校验通过，提交表单

                // 获取token
                const token = localStorage.getItem('zz-token')
                // pojo才是提交到后台的数据，不是formName
                supplierApi.add(token,this.pojo).then(response=>{
                const res = response.data
                if (res.success){
                    this.fetchData()
                    this.dialogFormVisible = false

                    // 成功弹出提示
                    this.$message({
                        message: res.msg,
                        type: 'success'
                        })
                }else{
                    this.$message({
                        message: res.msg,
                        type: 'warning'
                        })
                }
                })
            }else{
                return false
            }
            })
        },

    }
}
</script>