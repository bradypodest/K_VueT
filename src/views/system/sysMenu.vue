<template>
  <div class="app-container">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <!-- 在 el-form 上加上 @submit.native.prevent 这个则会阻止表单回车提交。 -->
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-form-item>
          <el-button type="primary" @click="getTableData">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table
      :data="tableData"
      row-key="ID"
      default-expand-all
      :tree-props="{children: 'Children', hasChildren: 'hasChildren'}"
      border
      style="width: 100%;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"
      >
      <el-table-column type="index" width="80" label="序号"></el-table-column>
      <el-table-column prop="Name" label="菜单名称" width="100" align="center"></el-table-column>
      <el-table-column prop="Url" label="菜单链接地址" width="140" align="center"></el-table-column>
      <el-table-column prop="PathUrl" label="菜单页面地址" width="140" align="center"></el-table-column>
      <el-table-column prop="Description" label="描述" align="center" min-width="180"></el-table-column>
      <el-table-column prop="Icon" label="图标" width="100" align="center">
        <template slot-scope="scope" v-if="scope.row.Icon">
          <svg-icon :icon-class="scope.row.Icon" />
        </template>
      </el-table-column>
      <el-table-column prop="IsShow" label="是否显示" align="center" width="80">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.IsShow? 'success' : 'danger'"
            disable-transitions
          >{{scope.row.IsShow ? "是":"否"}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="Creator" label="创建者" width="100" align="center"></el-table-column>
      <el-table-column prop="CreateTime" label="创建时间" width="140" align="center" :formatter="formatCreateTime" ></el-table-column>
      <el-table-column prop="Modifier" label="修改者" width="100" align="center"></el-table-column>
      <el-table-column prop="ModifyTime" label="修改时间" width="140" align="center"></el-table-column>
       <el-table-column label="操作" width="150" align="center">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

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
          ref="dialogform"
          label-position="right"
        >
          <el-row type="flex" justify="center">
            <el-col :span="14">
              <el-form-item label="菜单Id" prop="MenuId">
                <el-input v-model="dialogFormData.MenuId" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="菜单名称" prop="Name">
                <el-input v-model="dialogFormData.Name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="菜单连接地址" prop="Url">
                <el-input v-model="dialogFormData.Url" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="菜单页面地址" prop="PathUrl">
                <el-input v-model="dialogFormData.PathUrl" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="菜单描述" prop="Description">
                <el-input v-model="dialogFormData.Description" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="菜单图标" prop="Icon">
                <el-input v-model="dialogFormData.Icon" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="菜单排序号" prop="OrderNo">
                <el-input v-model="dialogFormData.OrderNo" auto-complete="off"></el-input>
              </el-form-item>

              <el-form-item label="是否显示" prop="IsShow">
                <el-select v-model="dialogFormData.IsShow" placeholder="请选择状态" style="width:100%">
                  <el-option label="是" :value="true"></el-option>
                  <el-option label="否" :value="false"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="父节点" prop="ParentArray">
                <el-cascader
                  style="width: 100%"
                  v-model="dialogFormData.ParentArray"
                  :options="menusTree"
                  :props="propsRules"
                  filterable
                  change-on-select
                ></el-cascader>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="dialogForm.dialogFormVisible=false">取消</el-button>
          <el-button
            type="primary"
            @click.native="dialogFormSubmit"
          >提交</el-button>
        </div>
      </el-dialog>
    </div>
    <!--编辑、新增界面 end-->
  </div>
</template>

<script>
//import { validUsername } from "@/utils/validate";
import util from "@/utils/date";
import { getNodeById } from "@/utils/util";

import {
  addOne,
  getPageData,
  delOne,
  getOneByID,
  updateOne,
  getMenuTree
} from "@/api/system/sys-menu";

export default {
  //组件
  components: {},
  //数据
  data() {
    return {
      //查询条件
      filters: {
      },
      //列表数据
      tableData: [],
      //是否出现加载图标（现阶段使用axios封装的）
      listLoading: false,

      menusTree: "", //权限树
      //级联控件的属性
      propsRules: {
        value: "ID",
        label: "Name",
        children: "Children"
      },

      ///弹出层相关  start
      //弹出层
      dialogForm: {
        dialogFormTitle: "新增",
        dialogFormVisible: false,
        dialogFormType: "add" //当前打开弹出层类型：是新增(add)，还是编辑(edit)
      },
      //弹出层中form数据
      dialogFormData: {
        ID: "",
        ParentId: "",
        ParentArray:[], //父集合，用于级联

        MenuId:'',
        Name: "",
        Url: "",
        PathUrl:"",
        Description: "",
        Icon: "",
        OrderNo: "",
        IsShow: true
      },
      //弹出层中form表达验证规则
      dialogFormRules: {
        MenuId: [{ required: true, message: "请输入菜单Id", trigger: "blur" }],
        Name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }]
      },
      ///弹出层相关  end
    };
  },

  //方法
  methods: {
    //初始化
    init() {
      this.getTableData(); //获取表数据   树
    },
    //获取table数据
    getTableData() {
      var that = this;

      // //菜单树
      getMenuTree().then(res=>{
        console.log(res.data);
        console.log(res.data.Children);
        that.menusTree=[res.data];        
        that.tableData = res.data.Children;
      }).catch();
    },
    //转化时间
    formatCreateTime: function(row, column) {
      return !row.CreateTime || row.CreateTime == ""
        ? ""
        : util.formatDate.format(new Date(row.CreateTime), "yyyy-MM-dd hh:mm");
    },

    //打开 新增 弹出层
    handleAdd() {
      console.log("点击新增");

      //清空弹出层表内内容
      this.$nextTick(() => {
        this.$refs.dialogform & this.$refs.dialogform.resetFields();
      });
      this.dialogForm.dialogFormTitle = "新增菜单";
      this.dialogForm.dialogFormVisible = true;
      this.dialogForm.dialogFormType = "add"; //当前打开弹出层类型：是新增(add)，还是编辑(edit)

      //初始化add时 ，对弹出层表单设置数据
      this.dialogFormData = {
        //iD:'',
        ParentId: "",
        PidArr: [], //父集合，用于级联
        ParentArray:[],

        MenuId:'',
        Name: "",
        Url: "",
        PathUrl:"",
        Description: "",
        Icon: "",
        OrderNo: "",
        IsShow: true
      };
    },
    //打开 编辑 弹出层
    handleEdit(index, row) {
      var that = this;
      console.log("点击编辑");

      //清空表内内容
      this.$nextTick(() => {
        this.$refs.dialogform & this.$refs.dialogform.resetFields();
      });

      this.dialogForm.dialogFormTitle = "编辑[" + row.Name + "]菜单";
      this.dialogForm.dialogFormVisible = true;
      this.dialogForm.dialogFormType = "edit"; //当前打开弹出层类型：是新增(add)，还是编辑(edit)

      //获取数据
      getOneByID(row.ID)
        .then(res => {
          if (res.success) {
            that.$message({
              type: "success",
              message: "获取成功!"
            });

            that.dialogFormData = res.data;
            that.dialogFormData.ParentArray=row.ParentArray;
          }
        })
        .catch();
    },
    //删除
    handleDel(index, row) {
      var that = this;
      console.log("删除" + index);
      console.log(row);
      debugger;

      that
        .$confirm("此操作将删除该[" + row.Name + "]菜单, 是否继续?", "提示", {
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
      this.$refs.dialogform.validate(valid => {
        if (!valid) {
          that.$message({
            showClose: true,
            message: "表单验证不通过！",
            type: "error"
          });
          return false;
        }

        var data = that.dialogFormData;
        debugger
        data.ParentId = that.dialogFormData.ParentArray.pop();

        //判断是新增还是编辑
        if (that.dialogForm.dialogFormType == "add") {
          //新增-- api 访问
          addOne(data)
            .then(res => {
              //that.dialogFormSubLoading = false;
              debugger;
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