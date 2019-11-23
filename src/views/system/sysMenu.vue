<template>
  <div class="app-container">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
      <!-- 在 el-form 上加上 @submit.native.prevent 这个则会阻止表单回车提交。 -->
      <el-form :inline="true" :model="filters" @submit.native.prevent>
        <el-form-item v-if="false">
          <el-input v-model="filters.Name" placeholder="菜单名" disabled></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="getTableData">查询</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <!--列表-->
    <el-table stripe border
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
      <el-table-column prop="IsShow" label="是否显示" width align="center">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.IsShow? 'success' : 'danger'"
            disable-transitions
          >{{scope.row.IsShow ? "是":"否"}}</el-tag>
        </template>
      </el-table-column>

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
          :rules="dialogFormDataRules"
          ref="dialogform"
          label-position="right"
        >
          <el-row type="flex" justify="center">
            <el-col :span="14">
              <el-form-item label="菜单名称" prop="name">
                <el-input v-model="dialogFormData.name" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="菜单连接地址" prop="url">
                <el-input v-model="dialogFormData.url" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="菜单描述" prop="description">
                <el-input v-model="dialogFormData.description" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="菜单图标" prop="icon">
                <el-input v-model="dialogFormData.icon" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="菜单排序号" prop="orderNo">
                <el-input v-model="dialogFormData.orderNo" auto-complete="off"></el-input>
              </el-form-item>

              <el-form-item label="是否显示" prop="isShow">
                <el-select v-model="dialogFormData.isShow" placeholder="请选择状态" style="width:100%">
                  <el-option label="是" :value="true"></el-option>
                  <el-option label="否" :value="false"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="父节点" prop="parentId">
                <el-input v-model="dialogFormData.parentId" auto-complete="off"></el-input>
                <!-- 以后更改 -->
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="dialogForm.dialogFormVisible=false">取消</el-button>
          <el-button
            type="primary"
            @click.native="dialogFormSubmit"
            :loading="dialogFormSubLoading"
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

import { addOne, getPageData } from "@/api/system/sys-menu";

export default {
  //组件
  components: {},
  //数据
  data() {
    return {
      //查询条件
      filters: {
        LinkUrl: ""
      },
      //列表数据
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
        ] // 列名称
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

      ///弹出层相关  start
      //弹出层
      dialogForm: {
        dialogFormTitle: "新增",
        dialogFormVisible: false,
        dialogFormType: "add" //当前打开弹出层类型：是新增(add)，还是编辑(edit)
      },
      //弹出层中form数据
      dialogFormData: {
        iD: "",
        parentId: "",
        name: "",
        url: "",
        description: "",
        icon: "",
        orderNo: "",
        isShow: true
      },
      //弹出层中form表达验证规则
      dialogFormDataRules: {
        name: [{ required: true, message: "请输入菜单名称", trigger: "blur" }]
      },
      //弹出层提交按钮是否加载
      dialogFormSubLoading: false
      ///弹出层相关  end
    };
  },

  //方法
  methods: {
    //初始化
    init() {
      this.getTableOptions(); //获取列

      this.getTableData(); //获取表数据

      //获取一些参数，如下拉的什么
    },
    //获取table数据
    getTableData() {
      var that = this;

      //准备数据
      var data = {
        pageIndex: that.paginations.pageIndex,
        pageSize: that.paginations.pageSize,
        order: "", //"CreateTime desc"
        wheres: ""
      };

      getPageData(data)
        .then(res => {
          debugger;
          if (res.success) {
            that.$message({
              type: "success",
              message: "查询数据成功!"
            });
            that.tableData = res.data.data;
            that.paginations.total=res.data.dataCount

          }
        })
        .catch();
    },
    //获取表格列属性  ：tableOptions
    getTableOptions() {
      this.tableOptions = {
        columns: [
          {
            prop: "Name", // 列元素
            label: "菜单名称", // 列名称
            width: "100", // 列宽度
            align: "center", // 居中
            isShow: true
          },
          {
            prop: "Url",
            label: "菜单链接地址",
            width: "110", // 列宽度
            align: "center",
            isShow: true
          },
          {
            prop: "Description",
            label: "描述",
            //width: '120',//没设则是动态的
            align: "center",
            isShow: true
          },
          {
            prop: "Icon",
            label: "图标",
            width: "80",
            align: "center",
            isShow: true
          },
          {
            prop: "IsShow",
            label: "是否显示",
            width: "80",
            align: "center",
            isShow: false,
            isTag: true
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
            isTime:true
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
        ]
      };
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
    //打开 新增 弹出层
    handleAdd() {
      console.log("点击新增");

      //清空弹出层表内内容
      debugger;
      this.$nextTick(() => {
        this.$refs.dialogform & this.$refs.dialogform.resetFields();
      });
      (this.dialogForm.dialogFormTitle = "新增菜单"),
        (this.dialogForm.dialogFormVisible = true),
        (this.dialogForm.dialogFormType = "add"); //当前打开弹出层类型：是新增(add)，还是编辑(edit)

      //初始化add时 ，对弹出层表单设置数据
      this.dialogFormData = {
        //iD:'',
        parentId: "",
        name: "",
        url: "",
        description: "",
        icon: "",
        orderNo: "",
        isShow: true
      };
    },
    //打开 编辑 弹出层
    handleEdit(index, row) {
      console.log("点击编辑");

      //清空表内内容
      this.$refs.dialogform & this.$refs.dialogform.resetFields();

      (this.dialogForm.dialogFormTitle = "编辑" + "0000000000000" + "菜单"),
        (this.dialogForm.dialogFormVisible = true),
        (this.dialogForm.dialogFormType = "edit"); //当前打开弹出层类型：是新增(add)，还是编辑(edit)

      //获取数据
    },
    //删除
    handleDel(index, row) {
      console.log("删除" + index);
      console.log(row);
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

        //that.dialogFormSubLoading = true;

        var data = that.dialogFormData;

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

                that.closeDialog();
              }
            })
            .catch();
        } else {
          debugger;
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