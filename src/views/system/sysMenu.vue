<template>
  <div class="app-container">
    <!--工具条-->
    <el-col :span="24" class="toolbar" style="padding-bottom: 0px;" >
      <!-- 在 el-form 上加上 @submit.native.prevent 这个则会阻止表单回车提交。 -->
      <el-form :inline="true" :model="filters" @submit.native.prevent >
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
    <el-table
      :data="tableData"
      highlight-current-row
      v-loading="listLoading"
      @selection-change="selsChange"
      style="width: 100%;"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" width="80" label="序号"></el-table-column>
      <el-table-column prop="Name" label="菜单名称" width></el-table-column>
      <el-table-column prop="Url" label="菜单链接地址" width></el-table-column>
      <el-table-column prop="Description" label="描述" width="300"></el-table-column>
      <el-table-column prop="Icon" label="菜单图标" width></el-table-column>
      <el-table-column prop="IsShow" label="是否显示" width>
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.IsShow=='true'  ? 'success' : 'danger'"
            disable-transitions
          >{{scope.row.Enabled ? "是":"否"}}</el-tag>
        </template>
      </el-table-column>

      <el-table-column prop="Creator" label="创建者" width></el-table-column>
      <el-table-column prop="CreateTime" label="创建时间" width></el-table-column>
      <el-table-column prop="Modifier" label="修改者" width></el-table-column>
      <el-table-column prop="ModifyTime" label="修改时间" width></el-table-column>

      <el-table-column label="操作" width="150">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!--编辑、新增界面 start-->
    <el-dialog
      :title="dialogForm.dialogFormTitle"
      :visible.sync="dialogForm.dialogFormVisible"
      :dialogFormType="dialogForm.dialogFormType"
      :close-on-click-modal="false"
    >
      <el-form
        :model="dialogFormData"
        label-width="80px"
        :rules="dialogFormDataRules"
        ref="dialogform"
      >
        <el-form-item label="菜单名称" prop="Name">
          <el-input v-model="dialogFormData.Name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单连接地址" prop="Url">
          <el-input v-model="dialogFormData.Url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单描述" prop="Description">
          <el-input v-model="dialogFormData.Description" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="Icon">
          <el-input v-model="dialogFormData.Icon" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="菜单排序号" prop="Icon">
          <el-input v-model="dialogFormData.OrderNo" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item label="是否显示" prop="IsShow">
          <el-select v-model="dialogFormData.IsShow" placeholder="请选择状态">
            <el-option label="是" value="true"></el-option>
            <el-option label="否" value="false"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="父节点" prop="ParentId">
            <el-input v-model="dialogFormData.ParentId" auto-complete="off"></el-input><!-- 以后更改 -->
        </el-form-item>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click.native="dialogForm.dialogFormVisible">取消</el-button>
        <el-button
          type="primary"
          @click.native="dialogFormSubmit"
          :loading="dialogFormSubLoading"
        >提交</el-button>
      </div>
    </el-dialog>
    <!--编辑、新增界面 end-->
  </div>
</template>

<script>
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
      //是否出现加载图标（现阶段使用axios封装的）
      listLoading: false,

      ///弹出层相关  start
      //弹出层
      dialogForm: {
        dialogFormTitle: "新增",
        dialogFormVisible: false,
        dialogFormType: "add" //当前打开弹出层类型：是新增(add)，还是编辑(edit)
      },
      //弹出层中form数据
      dialogFormData: {},
      //弹出层中form表达验证规则
      dialogFormDataRules: {},
      //弹出层提交按钮是否加载
      dialogFormSubLoading: false
      ///弹出层相关  end
    };
  },

  //方法
  methods: {
    //获取table数据
    getTableData() {},
    //全选或单选
    selsChange(sels) {
      console.log(sels);
    },
    //新增
    handleAdd() {
      console.log("点击新增");

        //清空表内内容
        debugger
        this.$refs.dialogform&this.$refs.dialogform.resetFields();

        this.dialogForm.dialogFormTitle="新增菜单",
        this.dialogForm.dialogFormVisible=true,
        this.dialogForm.dialogFormType= "add" //当前打开弹出层类型：是新增(add)，还是编辑(edit)



    },
    //编辑
    handleEdit(index,row) {
      console.log("点击编辑");

       //清空表内内容
        this.$refs.dialogform&this.$refs.dialogform.resetFields();

        this.dialogForm.dialogFormTitle="编辑"+"0000000000000"+"菜单",
        this.dialogForm.dialogFormVisible=true,
        this.dialogForm.dialogFormType= "edit" //当前打开弹出层类型：是新增(add)，还是编辑(edit)

        //获取数据

    },
    //删除
    handleDel(index, row) {
      console.log("删除" + index);
      console.log(row);
    },

    ///弹出层相关  --start
    //弹出层form提交
    dialogFormSubmit() {}
    ///弹出层相关 --end
  },
  //页面挂载之后执行方法
  mounted() {},
  //计算属性
  computed: {},
  //监听器
  watch: {}
};
</script>