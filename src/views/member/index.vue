<template>
    <div>

        <!-- 搜索框 -->
    <!-- :inline="true" 表单一行显示 -->
    <!-- :model="searchMap" 绑定到这个参数上 -->
    <el-form ref="searchForm" :inline="true" :model="searchMap" style="margin-top: 20px">
        <!-- 重置会看 el-form-item 组件元素的 prop 上是否指定了字段名，指定了才会重置生效 -->
        <el-form-item prop="member_card">
          <!--prop需要在data里指定，不指定会出现重置不了的问题， placeholder背景文案 -->
          <el-input v-model="searchMap.member_card" placeholder="会员卡号" style="width: 200px"></el-input>
        </el-form-item>
        <!-- prop重置用 -->
        <el-form-item prop="member_name">
          <el-input v-model="searchMap.member_name" placeholder="会员名字" style="width: 200px"></el-input>
        </el-form-item>
        <el-form-item prop="pay_type">
          <el-select v-model="searchMap.pay_type" placeholder="支付类型" style="width: 110px">
            <!-- 不要忘记 payTypeOptions 绑定到data中 -->
            <!-- for循环。label就是看到的中文，value提交到后台的值，也就是1，2，3，4 -->
            <el-option
              v-for="option in payTypeOptions"
              :key="option.pay_type"
              :label="option.name"
              :value="option.pay_type"
            ></el-option>
          </el-select>
        </el-form-item>
  
        <!-- 日期搜索框 -->
        <el-form-item prop="member_birthday">
          <!-- value-format 是指定绑定值的格式 -->
          <el-date-picker
            style="width: 200px"
            value-format="yyyy-MM-dd"
            v-model="searchMap.member_birthday"
            type="date"
            placeholder="出生日期"
          ></el-date-picker>
        </el-form-item>
        <!-- 日期搜索框结束 -->
  
        <el-form-item>
          <el-button type="primary" @click="fetchData">查询</el-button>
          <el-button type="primary" @click="handleAdd">新增</el-button>
          <!-- searchForm 为搜索框上面 ref 绑定的属性,resetForm 要在methods里面定义-->
          <el-button @click="resetForm('searchForm')">重置</el-button> 
        </el-form-item>
      </el-form>
      <!-- 搜索框结束 -->



      <!-- 列表页面
      :data绑定渲染的数据，data 里我们定义的上list
      border 表格边框，表头最上面的那个边框
      height 表格高度
    -->
    <el-table :data="list" height="480" border style="width: 100%">
        <!-- type='index'获取索引值，从1开始，label显示的标题，prop接口返回数据的字段名，width列宽，不写就自动 -->
        <el-table-column type="index" label="序号" width="50"></el-table-column>
        <el-table-column prop="member_card" label="会员卡号" width="180"></el-table-column>
        <el-table-column prop="member_name" label="会员姓名"></el-table-column>
        <el-table-column prop="member_birthday" label="会员生日" width="100"></el-table-column>
        <el-table-column prop="phone_number" label="手机号码" width="120"></el-table-column>
        <el-table-column prop="card_money" label="可用积分"></el-table-column>
        <el-table-column prop="Available_integral" label="开卡余额"></el-table-column>

        <!-- 支付类型开始 -->
        <el-table-column prop="pay_type" label="支付类型">
            <template slot-scope="scope">
                <!-- 使用过滤器,scope.row.pay_type为接口返回的pay_type的值，后面的是作用在哪个过滤器上面，这里作用在 payTypeFilter 上面-->
                <span>{{scope.row.pay_type | payTypeFilter }}</span>
              </template>
        </el-table-column>
        <!-- 支付类型结束 -->

        <el-table-column prop="member_address" label="会员地址" width='180'></el-table-column>

        <!-- 操作开始，scope 可以获取行数据 ，scope.row.id 获取该行数据的 id值-->
        <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit( scope.row.id)">编辑</el-button>
          <!-- 根据后端返回该行的id进行编辑和删除 -->
          <el-button size="mini" type="danger" @click="handleDelete( scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
      <!-- 操作结束 -->

    </el-table>
      <!-- 列表页面结束 -->

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


         <!-- 新增弹出新增窗口 
        title 窗口的标题
        :visible.sync 当它true的时候，窗口会被弹出
    -->
    <!-- :rules="rules"校验，需要在校验的字段上指定prop -->
    <!-- 这里都要绑定prop，并且在data里声明，要不然弹框里的数据不会清空或者不能输入 -->
    <!-- :closeOnClickModal=false 点击空白区域不关闭弹框，默认为true -->
    <!-- pojo 就是提交的数据 -->
    <el-dialog title="新增会员" :closeOnClickModal=false :visible.sync="dialogFormVisible" width="500px">
      <!-- 设置弹出框的样式 label-position="right" 右对齐 -->
      <el-form
        :rules="rules"
        ref="pojoForm"
        label-width="100px"
        label-position="right"
        style="width: 400px;"
        :model="pojo"
      >
        <el-form-item label="会员卡号"  prop="member_card">
          <el-input v-model="pojo.member_card" placeholder="请输入会员卡号"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名"  prop="member_name">
          <el-input v-model="pojo.member_name" placeholder="请输入会员姓名"></el-input>
        </el-form-item>
        <el-form-item label="会员生日" prop="member_birthday">
          <!-- value-format 是指定绑定值的格式 -->
          <el-date-picker
            style="width: 200px"
            value-format="yyyy-MM-dd"
            v-model="pojo.member_birthday"
            type="date"
            placeholder="会员生日"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone_number">
          <el-input v-model="pojo.phone_number" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="开卡金额"  prop="card_money">
          <el-input v-model="pojo.card_money" placeholder="请输入开卡金额"></el-input>
        </el-form-item>
        <el-form-item label="可用积分" prop="Available_integral">
          <el-input v-model="pojo.Available_integral" placeholder="请输入可用积分"></el-input>
        </el-form-item>
        <el-form-item label="支付类型" prop="pay_type">
          <el-select v-model="pojo.pay_type" placeholder="支付类型" style="width: 110px">
            <!-- 不要忘记 payTypeOptions 绑定到data中 -->
            <el-option
              v-for="option in payTypeOptions"
              :key="option.pay_type"
              :label="option.name"
              :value="option.pay_type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" prop="member_address">
          <el-input type="textarea" v-model="pojo.member_address" placeholder="请输入会员地址"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <!-- pojoForm 为el-form 的ref属性值 -->
        <el-button type="primary" @click="addData('pojoForm')">确 定</el-button>
        <!-- 当pojo.id === null时，调用新增接口addData，当不为null，表示有id，则调更新接口updateData -->
        <!-- <el-button type="primary" @click="pojo.id === null ? addData('pojoForm'): updateData('pojoForm')">确 定</el-button> -->
		

        
      </div>
    </el-dialog>
    <!-- 新增会员弹出窗口结束 -->


    <!-- 编辑弹出新增窗口  -->
    <el-dialog title="编辑会员" :closeOnClickModal=false :visible.sync="dialogFormVisibleedit" width="500px">
      <!-- 设置弹出框的样式 label-position="right" 右对齐 -->
      <el-form
        :rules="rules"
        ref="pojoFormEdit"
        label-width="100px"
        label-position="right"
        style="width: 400px;"
        :model="pojoedit"
      >
        <el-form-item label="会员卡号"  prop="member_card">
          <el-input v-model="pojoedit.member_card" placeholder="请输入会员卡号"></el-input>
        </el-form-item>
        <el-form-item label="会员姓名"  prop="member_name">
          <el-input v-model="pojoedit.member_name" placeholder="请输入会员姓名"></el-input>
        </el-form-item>
        <el-form-item label="会员生日" prop="member_birthday">
          <!-- value-format 是指定绑定值的格式 -->
          <el-date-picker
            style="width: 200px"
            value-format="yyyy-MM-dd"
            v-model="pojoedit.member_birthday"
            type="date"
            placeholder="会员生日"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="手机号码" prop="phone_number">
          <el-input v-model="pojoedit.phone_number" placeholder="请输入手机号码"></el-input>
        </el-form-item>
        <el-form-item label="开卡金额"  prop="card_money">
          <el-input v-model="pojoedit.card_money" placeholder="请输入开卡金额"></el-input>
        </el-form-item>
        <el-form-item label="可用积分" prop="Available_integral">
          <el-input v-model="pojoedit.Available_integral" placeholder="请输入可用积分"></el-input>
        </el-form-item>
        <el-form-item label="支付类型" prop="pay_type">
          <el-select v-model="pojoedit.pay_type" placeholder="支付类型" style="width: 110px">
            <!-- 不要忘记 payTypeOptions 绑定到data中 -->
            <el-option
              v-for="option in payTypeOptions"
              :key="option.pay_type"
              :label="option.name"
              :value="option.pay_type"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="会员地址" prop="member_address">
          <el-input type="textarea" v-model="pojoedit.member_address" placeholder="请输入会员地址"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleedit = false">取 消</el-button>
        <!-- pojoFormEdit 为el-form 的ref属性值 -->
        <el-button type="primary" @click="updateData('pojoFormEdit')">确 定</el-button>

        
      </div>
    </el-dialog>
    <!-- 编辑会员弹出窗口结束 -->

    </div>
</template>

<script>
import memberApi from "@/api/member"
// 支付类型，不能写在data里面，会报错，定义好了在下面写个 filters 方法
// 然后在列表页面使用过滤器，接口返回的pay_type是数字，不是字符串
const payTypeOptions = [
  { pay_type: 1, name: "现金" },
  { pay_type: 2, name: "微信" },
  { pay_type: 3, name: "支付宝" },
  { pay_type: 4, name: "银行卡" }
];

export default{
    data(){
        return {
            list: [],  // 数据传给list,列表渲染的数据
            total: 0, // 总记录数，在接口返回数据后赋值给total
            currenPage: 1, // 当前页码
            pageSize: 10, // 每页显示的数据条数
            searchMap: {
                // 条件查询绑定的条件值,搜索字段有四个
                member_card: "",
                member_name: "",
                pay_type: "",
                member_birthday: ""
            },
            payTypeOptions, // 这里要申明，要不然搜索框里使用的时候会报错
            dialogFormVisible: false, //控制对话框，默认不弹出
            dialogFormVisibleedit: false, // 控制编辑对话框
            pojo: {
              // 提交的数据，不写有时候会导致输入框输入不了
              
              member_card: "",
              member_name: "",
              member_birthday: "",
              phone_number: "",
              card_money: 0, // 输入框里的默认值
              Available_integral: 0,
              pay_type: "",
              member_address: ""
            },
            pojoedit: {
              // 编辑的数据，不写有时候会导致输入框输入不了
              
              member_card: "",
              member_name: "",
              member_birthday: "",
              phone_number: "",
              card_money: "",
              Available_integral: "",
              pay_type: "",
              member_address: ""
            },
            rules: {
              // 校验规则，blur 失去焦点的时候验证，change 输入值改变的时候验证
              member_card: [{ required: true, message: "卡号不能为空", trigger: "blur" }],
              member_name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
              pay_type: [
                { required: true, message: "支付类型不能为空", trigger: "change" }
              ],
              member_birthday:[{required: true, message: "会员生日不能为空", trigger: "change"}]
            }
          
        }
    },

    created() {
        // 调接口请求数据，将调接口定义一个方法，在created里调用这个方法
        
        this.fetchData()
    },

    methods: {
        fetchData(){
            // 获取token
            const token = localStorage.getItem('zz-token')
            console.log(token)
            // this.pageSize,this.currenPage 分页的条数和页码，要this.
            memberApi.getList(token,this.pageSize,this.currenPage,this.searchMap).then( response=>{
                const res = response.data
                this.total = res.total  // 将接口返回的total 覆盖 data里的total
                this.list = res.data  // 将返回数据的data赋值给list
                // console.log(res)
            })

        },
        
      // 编辑提交数据
      editData(id) {
        console.log("编辑", id);

        // 获取token
        const token = localStorage.getItem('zz-token')
        memberApi.getById(id,token).then(response => {
          const res = response.data;
          if (res.success) {
            this.pojoedit = res.data;  // 将数据赋值给pojo显示在输入框里
            console.log(this.pojoedit);  
          }
        });
      },
      // 删除会员
      handleDelete(id) {
        console.log('删除', id)
              this.$confirm('该操作将永久性删除数据，请谨慎操作。', '提示', {
                  confirmButtonText: '确认',
                  cancelButtonText: '取消',
              }).then(() => {
                  // 确认
                  console.log('确认')
                  // 获取token
                  const token = localStorage.getItem('zz-token')
                  memberApi.deleteById(id,token).then(response => {
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

        // 弹出新增窗口
      handleAdd() {
        console.log('新增')
        // this.pojo = {}
        this.dialogFormVisible = true;
        this.$nextTick(() => {
          // this.$nextTick()它是一个异步事件，当渲染结束 之后 ，它的回调函数才会被执行
          // 弹出窗口打开之后 ，需要加载Dom, 就需要花费一点时间，我们就应该等待它加载完dom之后，再进行调用resetFields方法，重置表单和清除样式
          // pojoForm 为 ref 对应的值
          this.$refs["pojoForm"].resetFields();
        });
        },
    // 提交新增数据,formName就是传过来的pojoForm
    addData(formName) {
      // console.log('数据',formName)
      this.$refs[formName].validate(valid => {
        if (valid) {
          //提交表单
          console.log("addData");
          const token = localStorage.getItem('zz-token')
          // pojo才是提交到后台的数据，不是formName
          memberApi.add(this.pojo,token).then(response => {
            const res = response.data;
            if (res.success) {
              // 新增成功，提示语
              this.$message({
                message: res.msg,
                type: "success"
              })
              //新增成功，刷新列表数据
              this.fetchData();
              this.dialogFormVisible = false; // 关闭窗口
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

       // 打开编辑窗口
       handleEdit(id) {
        console.log("编辑", id);
        this.dialogFormVisibleedit = true;
        // 获取token
        const token = localStorage.getItem('zz-token')
        memberApi.getById(id,token).then(response => {
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
              memberApi.update(this.pojoedit,token).then(response => {
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
        
    },
    filters: {
    // 过滤器，转换支付类型，type为1，2，3，4
    payTypeFilter(pay_type) {
      const payObj = payTypeOptions.find(obj => {
          // obj 就是上面的一个对象，type和上面对象的type进行对比，在返回
        return obj.pay_type === pay_type;
      });
      // payObj 有值，返回 payObj.name
      return payObj ? payObj.name : null; // 没找到类型返回null，找到了返回payObj.name
    }
  }
}
</script>