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
      :tree-props="{children: 'Children', hasChildren: 'hasChildren'}"
      border
      style="width: 100%;box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)"
    >
      <el-table-column type="index" width="80" label="序号"></el-table-column>
      <el-table-column prop="Name" label="菜单名称" width="130" align="center"></el-table-column>
      <el-table-column label="操作" width="280" align="center">
        <template scope="scope">
          <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
          <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
          <el-button
            size="small"
            @click="handlePowerEdit(scope.$index, scope.row)"
            v-if="scope.row.Children ==null || scope.row.Children.length==0"
          >编辑页面权限</el-button>
        </template>
      </el-table-column>
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
      <el-table-column
        prop="CreateTime"
        label="创建时间"
        width="140"
        align="center"
        :formatter="formatCreateTime"
      ></el-table-column>
      <el-table-column prop="Modifier" label="修改者" width="100" align="center"></el-table-column>
      <el-table-column prop="ModifyTime" label="修改时间" width="140" align="center"></el-table-column>
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
          <el-button type="primary" @click.native="dialogFormSubmit">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <!--编辑、新增界面 end-->

    <!-- 编辑页面权限 start @author:Karl @date:2019-12-12 14:20:53-->
    <div class="dialog">
      <el-dialog
        :title="dialogPowerForm.dialogTitle"
        :visible.sync="dialogPowerForm.dialogVisible"
        :close-on-click-modal="false"
        width="80%"
      >
        <el-row type="flex" justify="space-around">
          <el-col :span="8">
            <div class="power-Group">
              <div>
                <el-button type @click="newRow">新增一行</el-button>
                <!-- <el-button type @click="delRow">删除</el-button> -->
              </div>
              <el-table
                :data="getPowerGroupData.filter(item=>item.Status==1)"
                border
                @cell-click="beginEdit"
                @cell-mouse-leave="endEdit"
                :row-class-name="initIndex"
                ref="powerGroupTable"
              >
                <el-table-column label="权限组ID" prop="SysPowerGroup.ID" align="center"></el-table-column>
                <el-table-column label="操作" width="100" align="center">
                  <template scope="scope">
                    <el-button
                      type="danger"
                      size="small"
                      @click.stop="delRow(scope.$index, scope.row)"
                    >删除</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="权限组名称" align="center">
                  <template slot-scope="scope">
                    <div v-if="edit.rowIndex==scope.$index">
                      <el-input v-model="scope.row.SysPowerGroup.Name" placeholder="请输入"></el-input>
                    </div>
                    <div v-else>{{scope.row.SysPowerGroup.Name}}</div>
                    <!-- {{scope.row}} -->
                  </template>
                </el-table-column>
                <el-table-column label="排序" align="center">
                  <template slot-scope="scope">
                    <div v-if="edit.rowIndex==scope.$index">
                      <el-input v-model="scope.row.SysPowerGroup.OrderNo" placeholder="请输入"></el-input>
                    </div>
                    <div v-else>{{scope.row.SysPowerGroup.OrderNo}}</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
          <el-col :span="14">
            <div>
              <el-button type @click="newRow('powers')">新增一行</el-button>
              <!-- <el-button type @click="delRow">删除</el-button> -->
              <span
                class="current-power-group-span"
              >当前权限组：{{currentPowerGroup.SysPowerGroup!=null?currentPowerGroup.SysPowerGroup.Name:""}}</span>
            </div>
            <div class="powers">
              <el-table
                :data="currentPowerGroup.SysPowerGroup!=null? getPowerGroupData.filter(item=>item.SysPowerGroupID==currentPowerGroup.SysPowerGroup.ID)[0].SysPowers.filter(item=>item.Status==1):[]"
                border
                @cell-click="beginPowersEdit"
                @cell-mouse-leave="endPowersEdit"
                :row-class-name="initIndex"
                ref="powersTable"
              >
                <el-table-column label="权限ID" prop="ID" align="center"></el-table-column>
                <el-table-column label="操作" width="100" align="center">
                  <template scope="scope">
                    <el-button
                      type="danger"
                      size="small"
                      @click="delRow(scope.$index, scope.row,'powers')"
                    >删除</el-button>
                  </template>
                </el-table-column>
                <el-table-column label="权限名称" prop="Name" align="center">
                  <template slot-scope="scope">
                    <div v-if="editPowers.rowIndex==scope.$index">
                      <el-input v-model="scope.row.Name" placeholder="请输入"></el-input>
                    </div>
                    <div v-else>{{scope.row.Name}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="权限api" prop="ApiUrl" align="center">
                  <template slot-scope="scope">
                    <div v-if="editPowers.rowIndex==scope.$index">
                      <el-input v-model="scope.row.ApiUrl" placeholder="请输入"></el-input>
                    </div>
                    <div v-else>{{scope.row.ApiUrl}}</div>
                  </template>
                </el-table-column>
                <el-table-column label="是否公开api" prop="IsOpen" align="center">
                  <template slot-scope="scope">
                    <div v-if="editPowers.rowIndex==scope.$index">
                      <el-switch
                        style="display: block"
                        v-model="scope.row.IsOpen"
                        active-color="#13ce66"
                        inactive-color="#ff4949"
                        active-text="是"
                        inactive-text="否"
                      ></el-switch>
                    </div>
                    <div v-else>{{scope.row.IsOpen==true?'是':'否'}}</div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
        </el-row>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="dialogPowerForm.dialogFormVisible=false">取消</el-button>
          <el-button type="primary" @click.native="dialogPowerFormSubmit">提交</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 编辑页面权限 end @author:Karl @date:2019-12-12 14:21:24-->
  </div>
</template>

<script>
//import { validUsername } from "@/utils/validate";
import util from "@/utils/date";
import { getNodeById, getGuidGenerator } from "@/utils/util";

import {
  addOne,
  getPageData,
  delOne,
  getOneByID,
  updateOne,
  getMenuTree
} from "@/api/system/sys-menu";

import {
  getMenuPowerGroups,
  updateMenuPowerGroups
} from "@/api/system/sys-menu-power-group";

export default {
  name: "SysMenu",
  //组件
  components: {},
  //数据
  data() {
    return {
      //查询条件
      filters: {},
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
        ParentArray: [], //父集合，用于级联

        MenuId: "",
        Name: "",
        Url: "",
        PathUrl: "",
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

      ///权限弹出层 start
      currentMenuID: "", //当前菜单ID
      dialogPowerForm: {
        dialogTitle: "页面权限编辑",
        dialogVisible: false
      },
      getPowerGroupData: [
        {
          //获取的情况
          ID: "",
          SysMenuID: "",
          SysPowerGroupID: "",
          //SysMenu: {},
          SysPowerGroup: {
            ID: "",
            Name: "",
            OrderNo: ""
          },
          SysPowers: [
            {
              ID: "",
              SysPowerGroupID: "",
              Name: "",
              ApiUrl: "",
              IsOpen: ""
            }
          ]
        }
      ],
      // powerGroupData: [
      //   {
      //     ID: "",
      //     Name: "",
      //     OrderNo: ""
      //   }
      // ],
      edit: { columnIndex: -1, rowIndex: -1 }, //当前双击编辑的行与列
      currentPowerGroup: {}, //当前显示详情权限的权限组

      // powersData: [
      //   // {
      //   //   ID:"",
      //   //   Name: "",
      //   //   ApiUrl: "",
      //   //   IsOpen: ""
      //   // }
      // ],

      editPowers: { columnIndex: -1, rowIndex: -1 } //当前双击编辑的行与列

      ///权限弹出层 end
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
      getMenuTree()
        .then(res => {
          console.log(res.data);
          console.log(res.data.Children);
          that.menusTree = [res.data];
          that.tableData = res.data.Children;
        })
        .catch();
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
        ParentArray: [],

        MenuId: "",
        Name: "",
        Url: "",
        PathUrl: "",
        Description: "",
        Icon: "",
        OrderNo: "",
        IsShow: true
      };
    },
    //打开 编辑 弹出层
    handleEdit(index, row) {
      debugger;
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
            that.dialogFormData.ParentArray = row.ParentArray;
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
        debugger;
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

    ///权限弹出层 start
    ///给每个行加一个数据
    initIndex(obj) {
      // if (this.index) {
      obj.row.elementIdex = obj.rowIndex;
      // }
      return "";
    },
    handlePowerEdit(index, row) {
      this.dialogPowerForm.dialogVisible = true;
      this.currentMenuID = row.ID; //当前菜单ID
      this.currentPowerGroup = {};
      //查询数据
      this.initPowerGroupData(row.ID);
    },
    //查询菜单对应的权限组
    initPowerGroupData(ID) {
      var that = this;

      getMenuPowerGroups(ID)
        .then(res => {
          console.log(res);
          if (res.data && res.data.length > 0) {
            that.getPowerGroupData = res.data;
            console.log(res.data[0]);
            //debugger;
            that.currentPowerGroup = res.data[0];
          } else {
            //that.powerGroupData=[]
            that.getPowerGroupData = [];
          }
        })
        .catch();
    },
    beginEdit(row, column, cell, event) {
      if (row.hasOwnProperty("elementIdex")) {
        if (this.edit.rowIndex == row.elementIdex) {
          return;
        }
      }

      this.currentPowerGroup = row;
      console.log(this.currentPowerGroup);
      this.edit.rowIndex = row.elementIdex;
    },
    endEdit(row, column, cell, event) {
      //if (!this.enableEdit) return;
      this.edit.rowIndex = -1;
    },

    beginPowersEdit(row, column, cell, event) {
      if (row.hasOwnProperty("elementIdex")) {
        if (this.edit.rowIndex == row.elementIdex) {
          return;
        }
      }

      this.editPowers.rowIndex = row.elementIdex;
    },
    endPowersEdit(row, column, cell, event) {
      //if (!this.enableEdit) return;
      this.editPowers.rowIndex = -1;
    },

    //新增一行
    newRow(value) {
      var that = this;
      if (value == "powers") {
        // this.powersData.push({
        //   ID: getGuidGenerator(),
        //   Name: "",
        //   ApiUrl: "",
        //   IsOpen: false
        // });

        if (that.currentPowerGroup.SysPowerGroup == null) {
          that.$message({
            type: "error",
            message: "请先选择权限组"
          });
        } else {
          console.log(that.currentPowerGroup);
          that.getPowerGroupData
            .filter(
              item =>
                item.SysPowerGroupID == that.currentPowerGroup.SysPowerGroup.ID
            )[0]
            .SysPowers.push({
              ID: getGuidGenerator(),
              SysPowerGroupID: that.currentPowerGroup.SysPowerGroup.ID,
              Name: "",
              ApiUrl: "",
              IsOpen: false,
              Status: 1
            });
        }
      } else {
        // this.powerGroupData.push({
        //   ID: getGuidGenerator(),
        //   Name: "",
        //   OrderNo: ""
        // });
        var sysPowerGroupID = getGuidGenerator();

        that.getPowerGroupData.push({
          ID: "", //可不要
          SysMenuID: that.currentMenuID,
          SysPowerGroupID: sysPowerGroupID, //可不要
          //SysMenu: {}, //可不要
          Status: 1,
          SysPowerGroup: {
            ID: sysPowerGroupID,
            Name: "",
            OrderNo: "",
            Status: 1
          },
          SysPowers: [
            {
              ID: getGuidGenerator(),
              SysPowerGroupID: sysPowerGroupID,
              Name: "",
              ApiUrl: "",
              IsOpen: false,
              Status: 1
            }
          ]
        });
      }
    },
    delRow(index, row, value) {
      var that = this;

      if (value == "powers") {
        //遍历
        that.getPowerGroupData.filter(item=>item.SysPowerGroupID==that.currentPowerGroup.SysPowerGroup.ID)[0].SysPowers.forEach(item => {
          if (row.ID == item.ID) {
            item.Status = 2;
          }
        });

      } else {
        //遍历
        //var copyGetPowerGroupData=that.getPowerGroupData.concat();
        that.getPowerGroupData.forEach(item => {
          if (row.SysPowerGroup.ID == item.SysPowerGroup.ID) {
            item.Status = 2;
          }
        });

        //如果删除的是与右边当前权限组一致的，则将currentPowerGroup 顶到最上面一个
        if (row.SysPowerGroup.ID == that.currentPowerGroup.SysPowerGroup.ID) {
          var filterPowerGroupData = that.getPowerGroupData.filter(
            item => item.Status == 1
          );
          if (filterPowerGroupData.length > 0) {
            that.currentPowerGroup = that.getPowerGroupData.filter(
              item => item.Status == 1
            )[0];
          } else {
            that.currentPowerGroup = {};
          }
        }
      }
    },

    //更新权限提交数据
    dialogPowerFormSubmit() {
      var that = this;

      //验证 循环判断数据是否完善
      var result = true;
      var resultMsg = "";

      if (that.getPowerGroupData.length == 0) {
        result = false;
        resultMsg = "提交数据为空";
      }

      that.getPowerGroupData.forEach(item => {
        if (!item.SysMenuID) {
          resultMsg = "数据中不包含菜单ID";
          return false;
        }
        if (!item.SysPowerGroup || !item.SysPowerGroup.ID) {
          resultMsg = "数据中不包含权限组数据";
          return false;
        }
        if (!item.SysPowers || !item.SysPowers.ID) {
          resultMsg = "数据中不包含权限组对应权限数据";
          return false;
        }
      });
      if (!result) {
        that.$message({
          type: "error",
          message: resultMsg
        });

        return false;
      }
debugger;
      //筛选数据
      var data =this.getPowerGroupData.filter(item=>item.SysPowerGroup.Name&&item.SysPowerGroup.OrderNo);

      //筛选power 数据

debugger;
      //提交数据
      updateMenuPowerGroups(data)
        .then(res => {
          debugger;
        })
        .catch();
    }

    ///权限弹出层 end
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
<style scoped lang="scss">
.current-power-group-span {
  margin-left: 20px;
  color: red;
}

.power-Group {
  ::v-deep.el-dialog__body .current-power-group-span {
    margin-left: 20px;
    color: red;
  }
}
</style>