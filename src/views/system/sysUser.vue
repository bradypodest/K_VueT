<template>
  <div class="app-container">
    <!--工具条-->
    <!-- 在 el-form 上加上 @submit.native.prevent 这个则会阻止表单回车提交。 -->
    <div class="filters">
      <el-form  :model="filtersData" @submit.native.prevent>
        <el-row>
          <!-- 查询条件  Strat-->
          <el-col v-for="(item) in tableOptions.searchForm" :key="item.prop" :span="item.col">
            <el-form-item :label="item.label+':'" :label-width="item.lb_width">
              <el-input
                v-if="item.type == 'text'"
                type="text"
                :size="item.inp_size"
                :placeholder="item.inp_holder"
                v-model="filtersData[item.prop]"
              ></el-input>
              <el-select
                v-if="item.type == 'select'"
                :size="item.inp_size"
                :placeholder="item.inp_holder"
                v-model="filtersData[item.prop]"
              >
                <!-- 常规的数组 如[{key:0,value:"全部"}] -->
                <el-option
                  v-for="sel in ((item.isSel)?item.data:[] )"
                  :key="sel.key"
                  :label="sel.value"
                  :value="sel.key"
                ></el-option>
                <!-- 不常规的数组 如[{0:"全部"}] -->
                <el-option
                  v-for="(v,k) in ((!item.isSel)?item.data:[])"
                  :key="k"
                  :label="v"
                  :value="k"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <!-- 查询条件  end-->

          <el-col :span="6" :offset="1">
            <el-form-item>
              <el-button type="primary" @click="getTableData">查询</el-button>
              <el-button type="primary" @click="handleAdd">新增</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>
    <!--列表 start-->
    <div>
      <el-table
        stripe
        border
        :data="tableData"
        highlight-current-row
        v-loading="listLoading"
        @selection-change="selsChange"
        style="width: 100%;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"
      >
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column type="index" width="80" label="序号"></el-table-column>

        <!-- 循环开始数据内容  第二版本-->
        <el-table-column
          v-for="col in tableOptions.columns.filter(function(item) { return item.isShow==true})"
          :key="col.prop"
          :prop="col.prop"
          :label="col.label"
          :width="col.width"
          :align="col.align"
        >
          <!-- <template slot-scope="scope" v-show="col.isTag">
          <el-tag
            :type="scope.row.IsShow ? 'success' : 'danger'"
            disable-transitions
          >{{scope.row.IsShow ? "是":"否"}}</el-tag>
          </template>-->
        </el-table-column>

        <!-- 特殊的只能特殊处理 ：现在还没找到处理办法 -->
        <!-- <el-table-column prop="IsShow" label="是否显示" width align="center">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.IsShow? 'success' : 'danger'"
              disable-transitions
            >{{scope.row.IsShow ? "是":"否"}}</el-tag>
          </template>
        </el-table-column>-->

        <el-table-column label="操作" width="150" align="center">
          <template scope="scope">
            <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-row type="flex">
        <el-col :xs="6" :sm="9" :md="12" :lg="16">
          <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="paginations.pageIndex"
            :page-sizes="paginations.pageSizes"
            :page-size="paginations.pageSize"
            :layout="paginations.layout"
            :total="paginations.total"
          ></el-pagination>
        </el-col>
      </el-row>
    </div>
    <!--列表 end-->

    <!--编辑、新增界面 start-->
    <div class="dialog">
      <el-dialog
        :title="dialogForm.dialogFormTitle"
        :visible.sync="dialogForm.dialogFormVisible"
        :dialogFormType="dialogForm.dialogFormType"
        :close-on-click-modal="false"
        width="50%"
      >
        <el-form
          :model="dialogFormData"
          label-width="110px"
          :rules="dialogFormRules"
          ref="dialogForm"
          label-position="right"
        >
          <el-row type="flex" justify="center">
            <el-col :span="14">
              <el-form-item
                v-for="(item) in dialogFormOptions"
                :key="item.prop"
                :label="item.label+':'"
                :prop="item.prop"
              >
                <el-input
                  v-if="item.type == 'text'"
                  type="text"
                  :size="item.inp_size"
                  :placeholder="item.inp_holder"
                  v-model="dialogFormData[item.prop]"
                ></el-input>
                <el-select
                  v-if="item.type == 'select'"
                  :size="item.inp_size"
                  :placeholder="item.inp_holder"
                  v-model="dialogFormData[item.prop]"
                  style="width:100%"
                  clearable
                >
                  <!-- 常规的数组 如[{key:0,value:"全部"}] -->
                  <el-option
                    v-for="sel in ((item.isSel)?item.data:[] )"
                    :key="sel.key"
                    :label="sel.value"
                    :value="sel.key"
                  ></el-option>
                  <!-- 不常规的数组 如[{0:"全部"}] -->
                  <el-option
                    v-for="(v,k) in ((!item.isSel)?item.data:[])"
                    :key="k"
                    :label="v"
                    :value="k"
                  ></el-option>
                </el-select>
              </el-form-item>

              <!-- 特殊控件 --特殊处理-->
              <!-- <el-form-item label="父节点" prop="ParentId">
                <el-input v-model="dialogFormData.ParentId" auto-complete="off"></el-input>
              </el-form-item> -->
              <!-- 以后更改 -->

            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click.native="dialogForm.dialogFormVisible=false">取消</el-button>
          <el-button type="primary" @click.native="dialogFormSubmit">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <!--编辑、新增界面 end-->
  </div>
</template>

<script>
//import { validUsername } from "@/utils/validate";
import util from "@/utils/date";

import {
  addOne,
  getPageData,
  delOne,
  getOneByID,
  updateOne
} from "@/api/system/sys-user";

export default {
  //组件
  components: {},
  //数据
  data() {
    return {
      //table 相关  --start
      //查询条件 数据
      filtersData: {
        LinkUrl: ""
      },
      //表格数据
      tableData: [],

      // 表格列名称, 名称 等信息
      tableOptions: {
        columns: [
          {
            prop: "", // 列元素
            label: "", // 列名称
            width: "", // 列宽度
            align: "center", // 对齐方式
            isShow: true //是否展示
          }
        ], // 列名称
        searchForm: [], //查询条件的参数
        addBtnName: "" //新增按钮名称
      },

      //是否出现加载图标（现阶段使用axios封装的）
      listLoading: false,

      //分页
      paginations: {
        total: 400,
        pageIndex: 1,
        // pageSize: this.GLOBAL.pageSize,
        // pageSizes: this.GLOBAL.pageSizes,
        // layout: this.GLOBAL.pageLayout
        pageSize: 2,
        pageSizes: [2, 50, 100, 200],
        layout: "total, sizes, prev, pager, next, jumper"
      },
      //table 相关  --end

      ///弹出层相关  start

      //弹出层 样式
      dialogForm: {
        dialogFormTitle: "新增",
        dialogFormVisible: false,
        dialogFormType: "add" //当前打开弹出层类型：是新增(add)，还是编辑(edit)
      },
      //弹出层编辑元素
      dialogFormOptions: {},
      //弹出层中form数据
      dialogFormData: {},
      //弹出层中form表达验证规则
      dialogFormRules: {}
      ///弹出层相关  end
    };
  },

  //方法
  methods: {
    //初始化
    init() {
      this.getFiltersData(); //获取设置查询条件数据
      this.getTableOptions(); //获取列

       //获取到对应的弹出层  dialogFormOptions
      this.getDialogFormOptions();
      //获取到对应的弹出层  dialogFormDataRules
      this.getDialogFormRules();


      this.getTableData(); //获取表数据

      //获取一些参数，如下拉的什么
    },
    //获取设置默认查询条件数据
    getFiltersData() {
      var that = this;

      that.filtersData = {
        UserName: "",
        Status: 0
      };
    },
    //获取表格列属性  ：tableOptions
    getTableOptions() {
      var that = this;
      that.tableOptions = {
        //查询参数
        searchForm: [
          {
            col: 3, //el-col占比
            val: "", //值 （现在废弃）
            type: "text", //控件类型：text为input控件，select为下拉框,   以后扩展
            data: null, //如果为下拉框，下拉框的数据
            prop: "UserName", //标记
            label: "用户名", //label值
            lb_width: "70px", //label长度
            in_size: "small", //控件大小
            inp_holder: "用户名" //提示信息
          },
          {
            col: 3, //el-col占比
            val: "", //值 （现在废弃）
            type: "select", //控件类型：text为input控件，select为下拉框,   以后扩展
            //data: [{key:0,value:'全部'},{key:1,value:'正常'},{key:3,value:'禁用'},], //如果为下拉框，下拉框的数据：  以后后台将这些枚举生成一个json文件，，先打算用写死的
            data: that.ENUMVAL["BaseExtendEntity.StatusE"],
            prop: "Status", //标记
            label: "状态", //label值
            lb_width: "70px", //label长度
            in_size: "small", //控件大小
            inp_holder: "状态", //提示信息
            isSel: true //true 为正常数组
          }
        ],

        //列
        columns: [
          {
            prop: "UserName", // 列元素
            label: "用户名", // 列名称
            width: "100", // 列宽度
            align: "center", // 居中
            isShow: true
          },
          {
            prop: "HeadPicUrl",
            label: "头像",
            width: "100", //没设则是动态的
            align: "center",
            isShow: true
          },
          {
            prop: "Sex",
            label: '性别',
            width: "80",
            align: "center",
            isShow: true
          },
          {
            prop: "Age",
            label: "年龄",
            width: "80",
            align: "center",
            isShow: true
            //isTag: true
          },
          {
            prop: "Address",
            label: "地址",
            //width: "80",//没设则是动态的
            align: "center",
            isShow: true
            //isTag: true
          },
          {
            prop: "Mobile",
            label: "电话",
            width: "80",
            align: "center",
            isShow: true
            //isTag: true
          },
          {
            prop: "Email",
            label: "邮箱",
            width: "80",
            align: "center",
            isShow: true
            //isTag: true
          },
          {
            prop: "Remark",
            label: "备注",
            width: "200",
            align: "center",
            isShow: true
            //isTag: true
          },

          //常规参数
          {
            prop: "Creator",
            label: "创建者",
            width: "100",
            align: "center",
            isShow: true
          },
          {
            prop: "CreateTime",
            label: "创建时间",
            width: "100",
            align: "center",
            isShow: true,
            isTime: true
          },
          {
            prop: "Modifier",
            label: "修改者",
            width: "100",
            align: "center",
            isShow: true
          },
          {
            prop: "ModifyTime",
            label: "修改时间",
            width: "100",
            align: "center",
            isShow: true
          }
        ],

        addBtnName: "新增用户"
      };
    },
    //获取table数据
    getTableData() {
      var that = this;

      //准备数据   这里待修改
      var data = {
        pageIndex: that.paginations.pageIndex,
        pageSize: that.paginations.pageSize,
        order: "", //"CreateTime desc"
        wheres: ""
      };

      getPageData(data)
        .then(res => {
          if (res.success) {
            that.$message({
              type: "success",
              message: "查询数据成功!"
            });
            that.tableData = res.data.data;
            that.paginations.total = res.data.dataCount;
          }
        })
        .catch();
    },

    //转化时间
    formatCreateTime: function(row, column) {
      return !row.CreateTime || row.CreateTime == ""
        ? ""
        : util.formatDate.format(new Date(row.CreateTime), "yyyy-MM-dd hh:mm");
    },
    //全选或单选
    selsChange(sels) {
      console.log(sels);
    },

    //获取设置 弹出层编辑元素
    getDialogFormOptions() {
      var that = this;

      that.dialogFormOptions = [
        {
          //val: '', //值 (废弃)
          type: "text", //控件类型：text为input控件，select为下拉框,
          data: null, //如果为下拉框，下拉框的数据
          prop: "UserName", //标记
          label: "用户名", //label值
          lb_width: "100px", //label长度
          in_size: "small", //控件大小
          inp_holder: "请输入账号" //提示信息
        },
        {
          //val: '', //值 (废弃)
          type: "text", //控件类型：text为input控件，select为下拉框,
          data: null, //如果为下拉框，下拉框的数据
          prop: "UserPwd", //标记
          label: "密码", //label值
          lb_width: "100px", //label长度
          in_size: "small", //控件大小
          inp_holder: "请输入密码" //提示信息
        },
        {
          //val: '', //值 (废弃)
          type: "text", //控件类型：text为input控件，select为下拉框,
          data: null, //如果为下拉框，下拉框的数据
          prop: "RoleName", //标记
          label: "角色", //label值
          lb_width: "100px", //label长度
          in_size: "small", //控件大小
          inp_holder: "请输入角色" //提示信息
        },
        {
          //val: '', //值 (废弃)
          type: "text", //控件类型：text为input控件，select为下拉框,
          data: null, //如果为下拉框，下拉框的数据
          prop: "HeadPicUrl", //标记
          label: "头像", //label值
          lb_width: "100px", //label长度
          in_size: "small", //控件大小
          inp_holder: "请输入头像" //提示信息
        },
        {
          //val: '', //值 (废弃)
          type: "text", //控件类型：text为input控件，select为下拉框,
          data: null, //如果为下拉框，下拉框的数据
          prop: "Sex", //标记
          label: "性别", //label值
          lb_width: "100px", //label长度
          in_size: "small", //控件大小
          inp_holder: "请输入性别" //提示信息
        },
        {
          //val: '', //值 (废弃)
          type: "text", //控件类型：text为input控件，select为下拉框,
          data: null, //如果为下拉框，下拉框的数据
          prop: "Age", //标记
          label: "年龄", //label值
          lb_width: "100px", //label长度
          in_size: "small", //控件大小
          inp_holder: "请输入年龄" //提示信息
        },
        {
          //val: '', //值 (废弃)
          type: "text", //控件类型：text为input控件，select为下拉框,
          data: null, //如果为下拉框，下拉框的数据
          prop: "Address", //标记
          label: "地址", //label值
          lb_width: "100px", //label长度
          in_size: "small", //控件大小
          inp_holder: "请输入地址" //提示信息
        },
        {
          //val: '', //值 (废弃)
          type: "text", //控件类型：text为input控件，select为下拉框,
          data: null, //如果为下拉框，下拉框的数据
          prop: "Mobile", //标记
          label: "电话", //label值
          lb_width: "100px", //label长度
          in_size: "small", //控件大小
          inp_holder: "请输入电话" //提示信息
        },
        {
          //val: '', //值 (废弃)
          type: "text", //控件类型：text为input控件，select为下拉框,
          data: null, //如果为下拉框，下拉框的数据
          prop: "Email", //标记
          label: "邮箱", //label值
          lb_width: "100px", //label长度
          in_size: "small", //控件大小
          inp_holder: "请输入邮箱" //提示信息
        },
        {
          //val: '', //值 (废弃)
          type: "text", //控件类型：text为input控件，select为下拉框,
          data: null, //如果为下拉框，下拉框的数据
          prop: "Remark", //标记
          label: "备注", //label值
          lb_width: "100px", //label长度
          in_size: "small", //控件大小
          inp_holder: "请输入备注" //提示信息
        }
      ];
    },
    //获取设置 弹出层编辑规则
    getDialogFormRules() {
      var that = this;

      that.dialogFormDataRules = {
        UserName: [
          { required: true, message: "请输入用户名", trigger: "blur" }
        ],
        UserPwd: [{ required: true, message: "请输入密码", trigger: "blur" }]
        // deptType: [
        //   { required: true, message: "请选择科室类型", trigger: "change" }
        // ],
        // deptStatus: [
        //   { required: true, message: "请选择使用状态", trigger: "change" }
        // ]
      };
    },
    setDialogFormData(){
      var that=this;
      that.dialogFormData={
        UserName:"",
        UserPwd:'',
        RoleId:'',
        RoleName:'',
        HeadPicUrl:'',
        Sex:'',
        Age:'',
        Birth:'',
        Address:'',
        Mobile:'',
        Email:'',
        Remark:"",
      }
    },

    //打开 新增 弹出层
    handleAdd() {
      console.log("点击新增");

      // //获取到对应的弹出层  dialogFormOptions
      // this.getDialogFormOptions();
      // //获取到对应的弹出层  dialogFormDataRules
      // this.getDialogFormRules();

      //清空弹出层表内内容
      this.$nextTick(() => {
        this.$refs.dialogForm & this.$refs.dialogForm.resetFields();
      });
      this.dialogForm.dialogFormTitle = "新增菜单";
      this.dialogForm.dialogFormVisible = true;
      this.dialogForm.dialogFormType = "add"; //当前打开弹出层类型：是新增(add)，还是编辑(edit)

      //初始化add时 ，对弹出层表单设置数据
      //设置弹出层 默认参数
      this.setDialogFormData();
    },
    //打开 编辑 弹出层
    handleEdit(index, row) {
      var that = this;
      console.log("点击编辑");

      //清空表内内容
      this.$nextTick(() => {
        this.$refs.dialogForm & this.$refs.dialogForm.resetFields();
      });

      (this.dialogForm.dialogFormTitle = "编辑[" + row.Name + "]菜单"),
        (this.dialogForm.dialogFormVisible = true),
        (this.dialogForm.dialogFormType = "edit"); //当前打开弹出层类型：是新增(add)，还是编辑(edit)

      //获取数据
      getOneByID(row.ID)
        .then(res => {
          if (res.success) {
            that.$message({
              type: "success",
              message: "获取成功!"
            });

            that.dialogFormData = res.data;
          }
        })
        .catch();
    },
    //删除
    handleDel(index, row) {
      var that = this;
      console.log("删除" + index);
      console.log(row);

      that
        .$confirm("此操作将删除该[" + row.UserName + "]用户, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
        .then(() => {
          delOne(row.ID)
            .then(res => {
              if (res.success) {
                that.$message({
                  type: "success",
                  message: "删除成功!"
                });

                that.getTableData();
              }
            })
            .catch();
        });
    },

    ///弹出层相关  --start
    //弹出层form提交
    dialogFormSubmit() {
      var that = this;

      //验证
      this.$refs.dialogForm.validate(valid => {
        if (!valid) {
          that.$message({
            showClose: true,
            message: "表单验证不通过！",
            type: "error"
          });
          return false;
        }

        var data = that.dialogFormData;

        //判断是新增还是编辑
        if (that.dialogForm.dialogFormType == "add") {
          //新增-- api 访问
          addOne(data)
            .then(res => {
              if (res.success) {
                that.$message({
                  type: "success",
                  message: "保存成功!"
                });

                that.getTableData();
                that.closeDialog();
              }
            })
            .catch();
        } else {
          //编辑保存 --api 访问
          updateOne(data)
            .then(res => {
              if (res.success) {
                that.$message({
                  type: "success",
                  message: "保存成功!"
                });

                that.getTableData();
                that.closeDialog();
              }
            })
            .catch();
        }
      });
    },
    //关闭弹出层
    closeDialog() {
      this.dialogForm.dialogFormVisible = false;
    },
    ///弹出层相关 --end


    //分页  start
    handleSizeChange(pageSize) {
      this.paginations.pageSize = pageSize;
      this.getTableData(); //重新查询table
    },
    //改变当前页
    handleCurrentChange(page) {
      this.paginations.pageIndex = page;
      this.getTableData(); //重新查询table
    }
    //分页  end
  },
  //页面挂载之后执行方法
  mounted() {
    this.init();
  },
  //计算属性
  computed: {},
  //监听器
  watch: {}
};
</script>