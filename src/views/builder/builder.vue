<template>
  <div class="builder-container">
    <!-- 代码生成 tableinfo 弹出框  s-->
    <kv-dialog
      :isShow.sync="dialogAddModel"
      title="新建配置table信息"
      :width="600"
      :height="520"
      :paddinglr="16"
      :paddingtb="5"
      >
       <div class="iview-com" slot="content">
          <div class="item form-item"> 
            <!-- <div class="form-text v-text">
              <span class="title">
                <i class="el-icon-edit"></i>
               新建配置table信息
              </span>
            </div> -->
            <kt-form 
             ref="initTableForm"
             labelWidth="120px"
             :formOptions="builderData.dialogAddOptions"
             :formData="builderData.dialogAddData"
             >
            </kt-form>
          </div>
       </div>
       <div slot="footer">
            <el-button
              type="primary"
              @click="initTableInfo(false)"
              >
              确认
            </el-button>
        </div>
    </kv-dialog>
    <!-- 代码生成 tableinfo 弹出框  e -->

    <!-- 主界面 -左  s-->

    <!-- 主界面 -左  e-->

    <!-- 主界面 -右  s -->
    <div class="builder-content">
      <div class="coder-item">
        <div class="view-header">
          <!-- 文字介绍 -->
          <div class="desc-text">
            <i class="el-icon-s-grid"></i>
            <span>代码生成器</span>
          </div>
          <!-- 备注 -->
          <div class="remarks">
            <a class="text" title="不懂的请起立">不懂的请起立</a>
          </div>
          <div class="header-empty"></div>
          <!-- 操作按钮 start -->
          <div class="btn-group">
            <el-button type="primary" icon="el-icon-message" @click="dialogAddModel=!dialogAddModel" size="small">新建</el-button>
            <el-button type="primary" icon="el-icon-message" @click="saveInfoAndColumns" size="small">保存</el-button>
            <el-button type="primary" icon="el-icon-message" @click="createModel" size="small">生成Model</el-button>
            <el-button type="primary" icon="el-icon-message" @click="createBusiness" size="small">生成业务层</el-button>
            <el-button type="primary" icon="el-icon-message" @click="createVuePage" size="small">生成vue页面</el-button>
          </div>
          <!-- 操作按钮 end -->
        </div>
        <div class="view-container">
          <kt-form
            ref="form"
            :formOptions="builderData.form.options"
            :formData="builderData.form.data"
          ></kt-form>
        </div>
      </div>
      <el-divider style="margin: 2px 0;height: 2px;"></el-divider>
      <div class="coder-item" style="    margin-top: 12px;">
        <div class="view-header">
          <!-- 文字介绍 -->
          <div class="desc-text">
            <i class="el-icon-s-grid"></i>
            <span>代码生成器之table列参数</span>
          </div>
          <!-- 备注 -->
          <div class="remarks">
            <a class="text" title="不懂的请起立">不懂的请起立</a>
          </div>
          <div class="header-empty"></div>
          <!-- 操作按钮 start -->
          <div class="btn-group">
            <el-button type="primary" icon="el-icon-message" @click="saveTableColumns" size="small">保存</el-button>
          </div>
        </div>
        <div class="view-container">
          <kt-table
                  ref="table"
                  :paginationHide="true"
                  :tableData="tableData"
                  :columnsOptions="builderData.tableColumns"
                  :maxHeight="400"
                  :showCheckbox="false"
                  :defaultSort="{prop:'OrderNo',order:'descending'}"
          ></kt-table>
        </div>
      </div>
    </div>
    <!-- 主界面 -右  e -->
  </div>
</template>
<script>
import request from '@/utils/request';
//import builderData from "./builderData.js";
//静态 数据
  let _const={
    initTableInfo:"LoadTableInfo",
    saveTableColumns:"saveTableColumns",
    createModel:"CreateModel",
    createBusiness:"CreateBusiness",
    createVuePage:"CreateVuePage",
    saveTableInfoAndColumns:"SaveTableInfoAndColumns"
  };

  let columnType = [
    { key: 1, value: "img" },
    { key: 2, value: "excel" },
    { key: 3, value: "file" }
  ];

  let dataType = [
    { key: "text", value: "text" },
    { key: "textarea", value: "textarea" },
    { key: "switch", value: "switch" },
    // { "key": "dropList", "value": "dropList" },
    { key: "select", value: "select" },
    { key: "selectList", value: "selectList" },
    { key: "date", value: "date" },
    { key: "datetime", value: "datetime" },
    { key: "checkbox", value: "checkbox" },
    { key: "mail", value: "mail" },
    { key: "number", value: "number" },
    { key: "decimal", value: "decimal" },
    { key: "phone", value: "phone" },
    { key: "img", value: "img" },
    { key: "excel", value: "excel" },
    { key: "file", value: "file" }
  ];

  let searchDataType = [
    { key: "text", value: "text" },
    { key: "like", value: "like" },
    { key: "textarea", value: "textarea" },
    { key: "switch", value: "switch" },
    { key: "select", value: "select" },
    { key: "selectList", value: "selectList" },
    { key: "date", value: "date" },
    { key: "datetime", value: "datetime" },
    { key: "checkbox", value: "checkbox" },
    { key: "mail", value: "mail" },
    { key: "number", value: "number" },
    { key: "decimal", value: "decimal" },
    { key: "phone", value: "phone" }
  ];
//静态数据

export default {
  components: {
    KtTable: () => import("@/components/basic/KtTable.vue"),
    KvDialog: () => import("@/components/basic/KvDialog.vue"),
    KtForm: () => import("@/components/basic/KtForm.vue")
  },
  data() {
    return {
      builderData: {
        dialogAddData:{
          RefID:"",
          namespace:"",
          cNName:"",
          tableName:"",
          folderName:""
        },
        dialogAddOptions: [
          [{ title: "父级ID",  placeholder: "父级ID  没有时设置为0",  field: "RefID", required: true, type: "string" ,colSize:12}],
          [
            {
              title: "项目命名空间",
              field: "namespace",
              placeholder: "项目命令空间(类库名)",
              type: "string",
              required: true,
              colSize:12
            }
          ],
          [{ title: "表中文名", field: "cNName", required: true,colSize:12 }],
          [{ title: "实际表名", field: "tableName", required: true,colSize:12 }],
          [
            {
              title: "项目文件夹",
              placeholder: "生成文件所在类库中的文件夹名(文件夹可以不存在)",
              field: "folderName",
              required: true,
              colSize:12
            }
          ]
        ],

        form: {
          data: {
            ID: "",
            RefID: "0",
            Namespace: "",
            CnName: "",
            TableName: "",
            FolderName: "",
            DetailCnName: "",
            DetailName: "",
            SortName: "",
            VuePath: ""
          },
          options: [
            [
              {
                title: "ID",
                field: "ID",
                readonly: true,
                disabled: true,
                type: "string"
              },
              {
                title: "父级ID",
                field: "RefID",
                placeholder: "父级ID  没有时设置为0",
                required: true,
                type: "string"
                
              },
              {
                title: "命名空间",
                placeholder: "项目命令空间(类库名),最好不要包含表名",
                field: "Namespace",
                type: "string",
                required: true
              }
            ],
            [
              { title: "表中文名", field: "CnName", required: true },
              {
                title: "表名",
                placeholder: "默认与实际表名相同",
                field: "TableName",
                required: true
              },
              {
                title: "项目文件夹",
                placeholder: "生成文件所在类库中的文件夹名(文件夹可以不存在)",
                field: "FolderName",
                required: true
              }
            ],
            [
              {
                title: "子表名",
                placeholder: "多个子表用逗号隔开",
                field: "DetailName"
              },
              {
                title: "子表中文名",
                placeholder: "多个子表用逗号隔开",
                field: "DetailCnName"
              },
              {
                title: "排序字段",
                placeholder: "现阶段会默认为createTime",
                field: "SortName",
                placeholder: "默认是 CreateTime"
              }
            ],[
              // [ //待完
              //     { "title": "开启用户权限数据", "field": "enable", bind: { data: [{ key: 1, value: '是', key: 0, value: '否' }] }, type: 'switch', colSize: 2 },
              //     { "title": "提示", "required": true, "field": "userPermissionDesc", colSize: 10, "placeholder": "非自增主键需要输入排序字段",readonly:true }
              // ],
              {
                title: "Vue视图路径",
                field: "VuePath",
                type: "textarea",
                placeholder:
                  "Vue项目所在绝对路径,到views文件夹,如：E:/app/src/views",
                colSize: 12
              }
            ]
            // [
            //     { "title": "富文本编辑字段", "field": "richtitle", "displayType": "title" },
            //     { "title": "文件上传字段", "field": "uploadField", "displayType": "title" },
            //     { "title": "文件上传数量限制", "field": "uploadMaxCount", "displayType": "title", columnType: 'int' }
            // ],
            // [
            //     { "title": "Vue视图绝对路径", "field": "vuePath", "displayType": "title", colSize: 12, placeholder: 'Vue项目所在绝对路径,到views文件夹,如：E:/app/src/views' },
            // ]
          ]
        },

        tableColumns: [
          {
            field: "ID",
            title: "行ID",
            width: 120,
            align: "center",
            edit: { type: "text" },
            hidden: true
          },
          {
            field: "RefID",
            title: "父表ID",
            width: 120,
           align: "center",
            edit:  { type: "text" },
            hidden: true
          },
          {
            field: "ColumnCnName",
            title: "列显示名称",
            fixed: true,
            width: 120,
            align: "center",
            edit: { type: "text" }
          },
          {
            field: "ColumnName",
            title: "列名",
            fixed: true,
            width: 120,
            align: "center",
            edit: { type: "text" }
          },
          {
            field: "IsKey",
            title: "主键",
            width: 90,
            align: "center",
            edit: { type: "switch" }//这个就可以table 显示时候是 “是” 还是“否”
          },
          // {
          //   field: "isImage",
          //   title: "table列显示类型",
          //   hidden: false,
          //   width: 130,
          //   align: "center",
          //   edit: { type: "select" },
          //   bind: { data: columnType }
          // },
          {
            field: "SearchRowNo",
            title: "查询行",
            width: 90,
            align: "center",
            edit: { type: "text" }
          },
          {
            field: "SearchColNo",
            title: "查询列",
            width: 90,
            align: "center",
            edit: { type: "text" }
          },
          {
            field: "SearchType",
            title: "查询类型",
            width: 150,
            align: "center",
            edit: { type: "select" },
            bind: { data: searchDataType }
          },
          {
            field: "EditRowNo",
            title: "编辑行",
            width: 90,
            align: "numberbox",
            edit: { type: "text" }
          },
          {
            field: "EditColNo",
            title: "编辑列",
            width: 90,
            align: "numberbox",
            edit: { type: "text" }
          },
          {
            field: "EditType",
            title: "编辑类型",
            width: 150,
            align: "center",
            edit: { type: "select" },
            bind: { data: dataType }
          },
          {
            field: "ColSize",
            title: "编辑列标签宽度colSize",
            width: 90,
            align: "center",
            edit: { type: "text" }
          },

          // {
          //   field: "dropNo",
          //   title: "数据源",
          //   width: 120,
          //   align: "center",
          //   bind: { data: [] },
          //   edit: { type: "select", data: [] }
          // },
          {
            field: "OrderNo",
            title: "列显示排序",
            width: 120,
            align: "center",
            edit: { type: "text" }
          },
          {
            field: "Maxlength",
            title: "字段最大长度",
            width: 130,
            align: "center",
            edit: { type: "text" }
          },
          {
            field: "ColumnType",
            title: "数据类型",
            width: 120,
            align: "center",
            edit: { type: "text" }
          },
          {
            field: "IsNull",
            title: "可为空",
            width: 120,
            align: "center",
            edit: { type: "switch" }
          },
          {
            field: "IsReadDataset",
            title: "是否只读",
            width: 120,
            align: "center",
            edit: { type: "switch" }
          },
          {
            field: "IsColumnData",
            title: "数据列",
            width: 120,
            align: "center",
            edit: { type: "switch" }
          },
          {
            field: "IsDisplay",
            title: "是否显示",
            width: 120,
            align: "center",
            edit: { type: "switch" }
          },
          {
            field: "ColumnWidth",
            title: "table列宽度",
            width: 120,
            align: "center",
            edit: { type: "text" }
          },
         
          // { field: 'import', title: '导入列', hidden: true, width: 100, align: 'left', edit: { type: "switch" } },
          // { field: 'apiInPut', title: 'Api输入列(待实现)', width: 100, align: 'left', edit: { type: "switch" } },
          // { field: 'apiIsNull', title: 'Api输入列可为空(待实现)', width: 130, align: 'left', edit: { type: "switch" } },
          // { field: 'apiOutPut', title: 'Api输出列(待实现)', width: 100, align: 'left', edit: { type: "switch" } },
          // { field: 'columnformat', title: '显示格式', width: 120, align: 'left', editor: 'text', editor: 'textarea' },
          // { field: 'script', title: '脚本', width: 120, align: 'left', editor: 'textarea' },
          // { field: 'creator', title: '创建人', width: 120, align: 'left' },
          { field: "CreateTime", title: "创建时间", width: 120, align: "left" }
          // { field: 'modifier', title: '修改人', width: 120, align: 'left' },
          // { field: 'modifyDate', title: '修改时间', width: 120, align: 'left' }
        ],
      },
      tableData:[],
      dialogAddModel:false,
    };
  },
  methods: {
    initTableInfo(isInit) {
      //初始化tableInfo  //新建
      //var param=this.builderData.dialogAddData;
      let param;
      debugger;
      if(isInit){
        // param =
        //   "parentId=0" +
        //   "&tableName=SysUser" +
        //   "&cNName=用户" +
        //   "&nameSpace=KARL.Core.SysUser" +
        //   "&folderName=SysUser" +
        //   "&isTreeLoad=false";
        param =
          "parentId=0" +
          "&tableName=TestSysUser" +
          "&cNName=测试用户" +
          "&nameSpace=KARL.Core.Test" +
          "&folderName=TestSysUser" +
          "&isTreeLoad=false";
      }else{
        param =
                  "parentId=" +
                  this.builderData.dialogAddData.RefID +
                  "&tableName=" +
                  this.builderData.dialogAddData.tableName +
                  "&cNName=" +
                  this.builderData.dialogAddData.cNName +
                  "&nameSpace=" +
                  this.builderData.dialogAddData.namespace +
                  "&folderName=" +
                  this.builderData.dialogAddData.folderName +
                  "&isTreeLoad=false";
      }
      

      request({
        url: '/Builder/'+_const.initTableInfo+"?"+param,
        method: "post",
      })
      .then(data => {
        //this.loading = false;
        debugger
        if (data.success) {
          this.$message({
            type: "success",
            message: "获取表格配置成功!"
          });
          
          console.log(data.data);
          this.builderData.form.data=data.data;
          this.tableData=data.data.TableColumns;


          //合计
          //this.getSummaries(data);
        }
      })
      .catch();
    },
    saveTableColumns() {
      // if (!this.layOutOptins.fileds.tableName)
      //   return this.$Message.error("请选模块");

      var param=this.tableData; 

      request({
        url: '/Builder/'+_const.saveTableColumns,
        method: "post",
        data:param
      })
      .then(data => {
        //this.loading = false;
        debugger
        if (data.success) {
          this.$message({
            type: "success",
            message: data.msg
          });
          
        }
      })
      .catch();
    },

    createModel(){
      var param=this.builderData.form.data;
      param.TableColumns=this.tableData;
      request({
        url: '/Builder/'+_const.createModel,
        method: "post",
        data:param
      })
      .then(data => {
        //this.loading = false;
        debugger
        if (data.success) {
          this.$message({
            type: "success",
            message: data.msg
          });
          
        }
      })
      .catch();
    },
    createBusiness(){

      var param=this.builderData.form.data;
      param.TableColumns=this.tableData;
      request({
        url: '/Builder/'+_const.createBusiness,
        method: "post",
        data:param
      })
      .then(data => {
        //this.loading = false;
        debugger
        if (data.success) {
          this.$message({
            type: "success",
            message: data.msg
          });
          
        }
      })
      .catch();
    },
    createVuePage(){

      var param=this.builderData.form.data;
      param.TableColumns=this.tableData;
      request({
        url: '/Builder/'+_const.createVuePage,
        method: "post",
        data:param
      })
      .then(data => {
        //this.loading = false;
        debugger
        if (data.success) {
          this.$message({
            type: "success",
            message: data.msg
          });
          
        }
      })
      .catch();
    },
    saveInfoAndColumns()
    {
      var param=this.builderData.form.data;
      param.TableColumns=this.tableData;
      request({
        url: '/Builder/'+_const.saveTableInfoAndColumns,
        method: "post",
        data:param
      })
      .then(data => {
        //this.loading = false;
        debugger
        if (data.success) {
          this.$message({
            type: "success",
            message: data.msg
          });
          
        }
      })
      .catch();

    }
  },
  //生命周期钩子 start
  beforeCreate() {},
  created() {
    
    //this.initTableInfo(true);
  },
  beforeMount() {},
  mounted() {},
  //生命周期钩子 activated：在使用了keep-alive后有actived钩子：触发顺序在mounted钩子后
  activated() {},
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {}
  //生命周期钩子 end
};
</script>

<style lang="less">
.builder-container {
  padding: 15px;
  background: white;
}

.view-header {
  width: 100%;
  height: 45px;
  position: relative;
  padding-bottom: 11px;
  display: -webkit-flex;
  display: flex;
  .header-empty {
    flex: 1;
    margin-left: 50px;
    display: flex;
    text-align: right;
  }
  .btn-group {
    white-space: nowrap;
    button {
      margin-left: 13px;
      // padding: 5px 16px;
      //height: 31px;
    }
  }
  .desc-text {
    margin-top: 5px;
    font-weight: bold;
    margin-bottom: 3px;
    font-size: 15px;
    color: #607d8b;
    white-space: nowrap;
    border-bottom: 2px solid #009688;
  }
  .desc-text i {
    font-size: 20px;
    bottom: 2px;
    position: relative;
  }

  .remarks {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    position: relative;
    top: 12px;
    left: 10px;
  }
}
</style>


