<template>
    <div>


         <!-- 搜索框 -->
    <!-- :inline="true" 表单一行显示 -->
    <!-- :model="searchMap" 绑定到这个参数上 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px">
        <!-- 重置会看 el-form-item 组件元素的 prop 上是否指定了字段名，指定了才会重置生效 -->
        <el-form-item prop="name">
          <!-- placeholder背景文案 -->
          <el-input v-model="searchMap.name" placeholder="商品名称" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item prop="code">

          <el-input v-model="searchMap.code"   placeholder="商品编号" style="width: 200px"></el-input>
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
      <el-table-column prop="name" label="商品名称" width='100'></el-table-column>
      <el-table-column prop="code" label="商品编码" width='200'></el-table-column>
      <el-table-column prop="specs" label="商品规格" width="200"></el-table-column>
      <el-table-column prop="retail_price" label="零售价" width="110"></el-table-column>
      <el-table-column prop="buying_price" label="进货价" width="110"></el-table-column>
      <el-table-column prop="amount" label="库存数量" width="110"></el-table-column>
      <el-table-column prop="supplier_info.name" label="供应商" width="200"></el-table-column> 


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



             <!-- 弹出商品新增窗口 
        title 窗口的标题
        :visible.sync 当它true的时候，窗口会被弹出
    -->
    <!-- :rules="rules"校验，需要在校验的字段上指定prop -->
    <!-- 这里都要绑定prop，并且在data里声明，要不然弹框里的数据不会清空或者不能输入 -->
    <el-dialog title="添加商品" :closeOnClickModal=false :visible.sync="dialogFormVisible" width="500px">
      <el-form
        :rules="rules"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width: 400px;"
        :model="pojo"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="pojo.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品编码" prop="code">
          <el-input v-model="pojo.code" placeholder="请输入商品编码"></el-input>
        </el-form-item>
        <el-form-item label="商品规格" prop="specs">
          <el-input v-model="pojo.specs" placeholder="请输入商品规格"></el-input>
        </el-form-item>
        <el-form-item label="零售价" prop="retail_price">
          <el-input v-model="pojo.retail_price" placeholder="请输入零售价"></el-input>
        </el-form-item>
        <el-form-item label="进货价" prop="buying_price">
          <el-input v-model="pojo.buying_price" placeholder="请输入进货价"></el-input>
        </el-form-item>
        <el-form-item label="库存数量" prop="amount">
          <el-input v-model="pojo.amount" placeholder="请输入库存数量"></el-input>
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addData('pojoForm')">确 定</el-button>
        
      </div>
    </el-dialog>
    <!-- 弹出新增商品口结束 -->




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
import goodsApi from '@/api/goods'  // 导入商品接口

export default{
    data(){
        return{
            list: [], // 数据传给list,列表渲染的数据
            currenPage: 1, // 当前页码
            pageSize: 10, // 每页显示的数据条数
            total: 0,
            dialogFormVisible: false, // 新增弹出框默认为false
            pojo:{  // 提交的数据
              id: null,
              name:"",
              code:"",
              specs:"",
              retail_price:"",
              buying_price:"",
              amount:"",
              supplier:"",

            },
            rules: {  // 验证规则
              name:[{required:true,message:"商品名称不能为空",trigger:'blur'}],
              code:[{required:true,message:"商品编码不能为空",trigger:'blur'}]

            },
            searchMap:{  // 条件查询绑定的字段
                name:"",
                code:"",
                supplier:""
            },

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
            goodsApi.getList(token,this.pageSize,this.currenPage,this.searchMap).then( response=>{
                const res = response.data
                this.total = res.total  // 将接口返回的total 覆盖 data里的total
                this.list = res.data  // 将返回数据的data赋值给list 
            })
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
                goodsApi.add(token,this.pojo).then(response=>{
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

        // 编辑按钮
        handleEdit(id){
            console.log('编辑',id)
        },
        // 删除按钮
        handleDelete(id){
            console.log('删除',id)
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
    }
  }


</script>