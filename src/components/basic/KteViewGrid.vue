<!-- 页面列表组件 -->
<!-- Karl-->
<!-- 20200519-->

<template>
  <div class="layout-container">
    <!-- 导出url  start -->
    <!-- <a :href="exportHref" ref="export"></a> -->
    <!-- 导出url  end -->

    <!-- 表 数据结构  start-->
    <kv-dialog 
      :isShow.sync="dataStructDialog"
      :height="520" :width="dataStructWidth" 
      :title="table.cnName+'数据结构'">
      <div slot=content>
        <kt-table 
         :paginationHide=true         
         :columnsOptions="dataStructColumns"
         :tableData="dataStructData"
         :showCheckbox=false 
         :endEditAfter="changeTableFieldIsShow"        
         >
        </kt-table>
      </div>
    </kv-dialog>
    <!-- 表 数据结构  end-->

    <!-- 审核  start   能不能考虑下反审核-->
    <!-- 审核 end -->

    <!-- 导入execl start -->
    <!-- 导入execl end-->

    <!-- 新增，编辑 start -->
    <kv-dialog
      v-if="dialogInit"
      :isShow.sync="dialogModel"
      :title="table.cnName+(getCurrentAction())"
      :width="dialogOptions.width"
      :height="dialogOptions.height"
      :paddinglr="16"
      :paddingtb="5"
      >
        <div class="iview-com" slot="content">
          <!-- 明细头部自定义组件  -->
          <modelHeader ref="modelHeader" class="model-header" @parentCall="parentCall"></modelHeader>

          <div class="item form-item"> 
            <div class="form-text v-text">
              <span class="title">
                <i class="el-icon-edit"></i>
                {{table.cnName}}
              </span>
            </div>
            <kt-form 
             ref="form"
             :labelWidth="dialogOptions.labelWidth"
             :formOptions="editFormOptions"
             :formData="editFormData"
             >
            </kt-form>
          </div>

          <!--明细body自定义组件-->
          <modelBody class="model-body" ref="modelBody" @parentCall="parentCall"></modelBody>

          <!-- 子表 start -->
          <div v-if="details&&details.length>0&&details[0].columnsOptions&&details[0].columnsOptions.length>0" class="grid-detail table-item item">
             <el-tabs v-model="activeDetailName" type="card" @tab-click="handleDetailClick">
              <el-tab-pane
                v-for="(detail,dIndex) in detailsOptions"
                :key="dIndex"
                :label="detail.cnName"
                :name="detail.tableName"
               >
                <span slot="label"><i lass="el-icon-s-grid"></i>{{detail.cnName}}</span>
                <!-- 工具栏  start-->
                  <div class="toolbar">
                    <!-- <div class="title form-text">
                      <span>
                        <i class="el-icon-s-grid" />
                        {{detail.cnName}}
                      </span>
                    </div> -->
                    <!--明细表格按钮-->
                    <div class="btns">
                      <el-button
                        v-for="(btn,bIndex) in detailsOptions.filter(x=>{return x.tableName==detail.tableName})[0].buttons   "
                        :key="bIndex"
                        v-show="!btn.hasOwnProperty('hidden')||!btn.hidden"
                        @click="onClick(btn.onClick)"
                        :type="btn.type"
                        ghost
                        :icon="btn.icon"
                        size="small"
                      >{{btn.name}}</el-button>
                    </div>
                  </div>
                <!-- 工具栏 end-->
                <!-- 子表表格 start -->
                  <!-- :maxHeight="tableMaxHeight" -->
                  <!-- :beginEdit="detailOptions.beginEdit"
                      :endEditBefore="detailOptions.endEditBefore"
                      :endEditAfter="detailOptions.endEditAfter" -->
                  <kt-table
                    :ref="detail.tableName"
                    :single="detail.single"
                    @loadBefore="loadInternalDetailTableBefore"
                    @loadAfter="loadDetailTableAfter"
                    @rowChange="detailRowOnChange"

                    :tableData="[]"
                    :columnsOptions="detail.columnsOptions"
                    :pagination="detail.pagination"
                    :maxHeight="detail.maxHeight"
                  
                    :url="detail.url"
                    :defaultLoadPage="detail.defaultLoadPage"
                    
                    :summaryData="detail.summaryData"

                    :beginEdit="detail.beginEdit"
                    :endEditBefore="detail.endEditBefore"
                    :endEditAfter="detail.endEditAfter"
                  >
                  </kt-table>
                <!-- 子表表格 end -->

              </el-tab-pane>
            </el-tabs>
          </div>
          <!-- 字表  end-->
          <!--明细footer自定义组件-->
          <modelFooter ref="modelFooter" class="model-footer" @parentCall="parentCall"></modelFooter>
        </div>
        <div slot="footer">
            <el-button v-for="(btn,bIndex) in dialogButtons" 
              :key="bIndex"
              :type="btn.type"
              v-show="!btn.hidden"
              :disabled="btn.disabled"
              @click="onClick(btn.onClick)"
              :icon="btn.icon"
              >
              {{btn.name}}
            </el-button>


            <!-- <Button
              v-for="(btn,bIndex) in dialogButtons"
              :key="bIndex"
              :type="btn.type"
              v-show="!btn.hasOwnProperty('hidden')||!btn.hidden"
              :disabled="btn.hasOwnProperty('disabled')&&!!btn.disabled"
              @click="onClick(btn.onClick)"
            >
              <Icon :type="btn.icon" />
              {{btn.name}}
            </Button>
            <Button type="info" @click="boxModel=false">
              <Icon type="md-close" />关闭
            </Button> -->
        </div>
    </kv-dialog>
    <!-- 新增，编辑 end -->

    <!-- 头部自定义组件 扩展点 start -->
    <!-- 在子组件里用$emit向父组件触发一个事件，父组件监听这个事件就行了  https://www.cnblogs.com/jin-zhe/p/9523782.html -->
    <!-- 触发父组件的方法 ：可见 ViewGridConfig/methods.js中的方法 -->
    <gridHeader ref="gridHeader" @parentCall="parentCall"></gridHeader>
    <!-- 头部自定义组件 扩展点 end -->

    <!-- 主界面查询与table表单布局 start -->
    <div class="view-container">
      <!-- 主界面头 介绍 和 操作按钮 start -->
      <div class="view-header">
        <!-- 文字介绍 -->
        <div class="desc-text" v-if="table.cnName.length>0">
          <i class="el-icon-s-grid"></i>
          <span>{{table.cnName}}</span>
        </div>
        <!-- 备注 -->
        <div class="remarks">
          <a class="text" :title="extend.text">{{extend.text}}</a>
        </div>
        <!--快速查询字段 (一个字段))-->
        <div class="search-line"></div>
        <!-- 操作按钮 start -->
        <div class="btn-group">
          <el-button
            v-for="(btn,bIndex) in splitButtons"
            :key="bIndex"
            :type="btn.type"
            :class="btn.class"
            @click="onClick(btn.onClick)"
            size="small"
          >
            <!-- <Icon :type="btn.icon" /> -->
            <i :class="btn.icon"></i>
            {{btn.name}}
          </el-button>
          <el-dropdown  @command="changeDropdown"  v-if="buttons.length> maxBtnLength">
            <el-button type="primary" ghost size="small">
              更多
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :command="item.name"
                v-for="(item,dIndex) in buttons.slice(maxBtnLength,buttons.length)"
                :key="dIndex"
                :icon="item.icon"
              >
                <!-- <Icon :type="item.icon"></Icon> -->
                {{item.name}}
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <!-- 操作按钮 end -->
      </div>
      <!-- 主界面头 介绍 和 操作按钮 end-->

      <!-- 详细查询条件 start 最好做成下推的样式 -->
      <el-collapse-transition>
        <div class="search-form" v-show="searchFormShow">
           <kt-form 
             ref="searchForm"
             :labelWidth="searchFormOptions.labelWidth"
             :formOptions="searchFormOptions"
             :formData="searchFormData"
             >
             <div class="form-closex" slot="footer">
              <el-button size="small" type="primary" ghost @click="search()">
                <i class="el-icon-search"></i> 查询
              </el-button>
              <!-- <Icon type="md-close-circle" color="color" size="20" /> -->
              <!-- <el-button size="small" type="info" ghost @click="resetSearch">
                <i class="el-icon-refresh-right"></i>重置
              </el-button> -->
              <el-button size="small" type="warning" ghost @click="searchFormShow=!searchFormShow">
                <i class="el-icon-circle-close"></i>关闭
              </el-button>
            </div>
            </kt-form>
        </div>
      
      </el-collapse-transition>
      <!-- 详细查询条件 end -->

      <!--body自定义组件-->
      <gridBody ref="gridBody" @parentCall="parentCall"></gridBody>

      <!-- table 表格 start -->
      <div class="grid-container">
        <kt-table 
          ref="table"
          :single="single"
          @loadBefore="loadTableBefore"
          @loadAfter="loadTableAfter"
          @rowChange="rowOnChange"

          :tableData="[]"
          :columnsOptions="columnsOptions"
          :pagination="pagination"
          :maxHeight="tableMaxHeight"
         
          :url="url"
          :defaultLoadPage="defaultLoadPage"
          
          :summaryData="summaryData"
         >
         <!--  :linkView="linkData"  未处理 -->
        </kt-table>
      </div>
      <!-- table 表格 end -->

      <!--footer自定义组件-->
      <gridFooter ref="gridFooter" @parentCall="parentCall"></gridFooter>
    </div>
    <!-- 主界面查询与table表单布局 end -->

  </div>
  
</template>

<script>
import request from '@/utils/request'

//一些基础的操作 对应的后台的api后缀方法，如查询页面的url则是    api+_const.PAGE
//其中api是   this.table.url  (如"/SysRole/"")
//增删改查导入导出等对应的action
const _const = {
  //EDIT: "Update",// 主表 更新
  EDIT: "UpdateT",// 主表 更新
  //ADD: "Add",  //主表 新增
    ADD: "AddT",  //主表 新增
  //VIEW: "view",
  VIEW: "GetOneByID",//主表 一行数据查询
  //PAGE: "GetPageData",//主表 查询
  PAGE: "GetPageDataT",//主表 查询
  DEL: "Delete",//主表 删除数据
  
  DETAIL:"GetDetailPageData",
  // AUDIT: "audit",
  // EXPORT: "Export", //导出操作返回加密后的路径
  // DOWNLOAD: "DownLoadFile", //导出文件
  // DOWNLOADTEMPLATE: "DownLoadTemplate", //下载导入模板
  // IMPORT: "Import", //导入(导入表的Excel功能)
  // UPLOAD: "Upload" //上传文件
};

const comName = [
  "gridHeader",
  "gridBody",
  "gridFooter",
  "modelHeader",
  "modelBody",
  "modelFooter"
];
import Empty from "@/components/basic/Empty.vue";
let _components = {
  gridHeader: Empty,
  gridBody: Empty,
  gridFooter: Empty,
  modelHeader: Empty,
  //弹出框(修改、编辑、查看)header、content、footer对应位置扩充的组件
  // modelHeader: {
  //   template: ""//'<Alert type="success">静态页面发布目前主要用于的是移动端</Alert>'
  // },
  // gridHeader: function(resolve, reject) {
  //   setTimeout(function() {
  //     // 向 `resolve` 回调传递组件定义
  //     resolve({
  //       template: ""
  //     });
  //   }, 1000);
  // },
  modelBody: Empty,
  modelFooter: Empty
};
var $viewGridVue, $this;
import KtTable from "@/components/basic/KtTable.vue";

var vueParam= {
  components:{
    ..._components,
    KtTable,
    KvDialog:() => import("@/components/basic/KvDialog.vue"),
    KtForm:() => import("@/components/basic/KtForm.vue"),
  },
  props:{
    table: {//表的配置信息：主键、排序等（可看成页面信息）
      type: Object,
      default: () => {
        return {};
      }
      //   {
      //     key: 'Order_Id',//该表的主键//排序字段
      //     footer: "Foots",//
      //     cnName: '销售订单',//表中文名
      //     name: 'SellOrder',//表名(代码生成器的别名)
      //     url: "/SellOrder/",(后台控制器)
      //     sortName: "CreateDate"//后台排序字段
      //  },
    },

    extend: {//表的扩展方法与组件都合并到此属性中
      type: Object,
      default: () => {
        return {};
        /*
          {
            text:"table扩展文字",
            components:{//动态扩充组件或组件路径
              //如表单header、content、footer对应位置扩充的组件 , 如果有，以这个为最终的组件
              gridHeader:() => import("./SellOrderComponents/GridHeaderExtend.vue"),//{ template: "<div>扩展组xx件</div>" },
            },
            buttons:{//根据需要自行实现扩展按钮
              view:[//kt-ViewGrid查询界面按钮
                {
                  name: "点我",
                  icon: 'md-create',
                  value: 'Edit',
                  class: '',
                  type: 'error',
                  index: 1,//显示的位置
                  onClick: function () { //扩展按钮执行事件
                      //this可以获取所有属性，包括this.$refs.gridHeader/gridBody等获取扩展组件对象
                      this.$message("测试扩展按钮");
                      //this.$refs.gridHeader.model = true;
                      // this.getServiceDate();  如这个可以调用下方的扩展方法
                  }
                }
              ],
              dialog:{//新建、编辑弹出框按钮:与上面一致
              },
              detail:{//新建、编辑弹出框明细表table表按钮: 与上面一致                
              }
            },
            methods:{//扩展方法
              getServiceDate() {
                  this.http.post("/api/SellOrder/getServiceDate", {}, '正在调用后台数据').then(date => {
                      this.$message.error("从后台获取的服务器时间是：" + date);
                  })
              },
              //也可以重写插口方法，如   onInit() 插口            
            }
          }
        */
      }
    },

    columnsOptions: {//主表的配置信息 ：可参考kttable组件的参数
      type: Array,
      default: () => {
        return [];
      }
    },

    searchFormData:{//查询form数据
      type: Object,
      default: () => {
        return {};
      }
    },
    searchFormOptions:{
      type: Array,
        default: () => {
          return [];
        }
    },

    editFormData: {//新建、编辑字段(key/value)  可参考ktForm组件的参数
      type: Object,
      default: () => {
        return {};
      }
    },
    editFormOptions: {//新建、编辑配置信息   可参考ktForm组件的参数
      type: Array,
      default: () => {
        return [];
      }
    },


    details: {//从表明细配置   多个子
      type: Array,
      default: () => {
        return [];
      }
    },
  },
  data(){
    return {
      _inited: false, //是否已经初始化   //在钩子activated
      activatedLoad: false, //页面触发actived时是否刷新页面数据
      

    //一些固定的主界面按钮 静态数据 start
      buttonsDefault : [{
        name: "查 询",//按钮的name最好不要重复
        value: 'Search',
        icon: 'el-icon-search',
        class: 'dropdown',
        type: 'primary',
        onClick: function () {
            this.search();
        }
        }, 
        {
            name: "刷 新",
            icon: 'el-icon-refresh',
            class: '',
            type: 'success',
            onClick: function () {
                this.refresh();
            }
        },
        {
            name: "新 建",
            icon: 'el-icon-plus',
            value: 'Add',
            class: '',
            type: 'warning',
            onClick: function () {
                this.add();
            }
        },
        {
            name: "编 辑",
            icon: 'el-icon-edit',
            value: 'Update',
            class: '',
            type: 'warning',
            onClick: function () {
                this.edit();
            }
        },  
        {
          name: "删 除",
          icon: 'el-icon-close',
          class: '',
          value: 'Delete',
          type: 'warning',
          onClick: function () {
              this.del();
          }
        }, 
        // {
        //     name: "审 核",
        //     icon: 'md-create',
        //     class: '',
        //     value: 'Audit',
        //     type: 'error',
        //     onClick: function () {
        //         this.audit();
        //     }
        // },
        // {
        //     name: "导 入",
        //     icon: 'md-color-fill',
        //     class: '',
        //     value: 'Import',
        //     onClick: function () {
        //         this.import();
        //     }
        // }, 
        // {
        //     name: "导 出",
        //     icon: 'md-share-alt',
        //     class: '',
        //     value: 'Export',
        //     onClick: function () {
        //         this.export();
        //     }
        // }, 
        {
            name: "数据结构",
            icon: 'ios-cog',
            class: '',
            value: '',
            onClick: function () {
                this.openViewColumns();
            }
        }
      ],
    //一些固定的主界面按钮 静态数据 end

    //表结构 弹出框 start
      dataStructDialog:false,
      dataStructWidth: 800,
      dataStructColumns:[], //查看表结构的列数据  //数据来源于主table的数据 
      dataStructData: [], //查看表结构信息  //数据来源于主table的数据
    //表结构 弹出框 end

    //主 按钮组 start
      searchFormShow: false, //高级查询(界面查询后的下拉框点击触发)

      maxBtnLength:3,//按钮显示最大个数，其他的都放在 “更多”下拉框中

      splitButtons: [],//在buttons的基础上拆分出来显示的按钮
      buttons: [], //查询界面按钮  如需要其他操作按钮，可在表对应的.js中添加(如:Sys_User.js中buttons添加其他按钮)
    //主 按钮组 end

    //主表 start
      single:false,
      //height:800,
      tableMaxHeight:590,
      pagination: { sortName: "" }, 
      //paginationHide:false
      url:"",//之后会生成
      summaryData:{
         isSummary:false
      },
      defaultLoadPage:true,//是否一进页面就加载数据
    //主表 end

    //新增 ，编辑 弹出框 Start
      dialogButtons:[],
      //this.extendBtn(this.buttonsDefault,this.extend.buttons.view);
      dialogButtonsDefault:[
                    {
                      name: "保 存",
                      icon: "el-icon-check",
                      type: "primary",
                      hidden:false,
                      onClick() {
                        this.save();
                      }
                    },
                    {
                      name: "重 置",
                      icon: "el-icon-refresh-right",
                      type: "warning",
                      onClick() {

                        this.resetEdit();
                      }
                    },
                    // {
                    //   name: "取 消",
                    //   icon: "el-icon-refresh-right",
                    //   type: "info",
                    //   onClick() {

                    //     //this.resetEdit();

                    //   }
                    // },
                  ],

      dialogInit: false,//是否初始化
      dialogModel:false,//是否显示弹出框
      currentReadonly: false, //当前用户没有编辑或新建权限时，表单只读(可用于判断用户是否有编辑或新建权限)
      currentAction:null,//当前操作动作
      currentRow:[],//当前点击的主表行

      hasDetail: false, //是否有从表(明细)表格数据,可根据props中是否传递detail参数来判断
      dialogOptions:{//弹出框的配置
        labelWidth:"110px",
        //width:"1050px",
        width: 1200,
        height:520,
        saveClose:true,//saveClose新建或编辑成功后是否关闭弹出框  为以后可以做扩展，现状态是保存之后就关闭弹出框
      },

      keyValueType: { _dinit: false },
    //新增 ，编辑 弹出框 end

    //弹出框 的 子表 start
      detailButtonsDefault:[
        {
          name: "添加行",
          icon: "el-icon-plus",
          type: "primary",
          hidden:false,
          onClick() {
            this.addRow();
          }
        },
        {
          name: "删除行",
          icon: "el-icon-delete",
          type: "primary",
          hidden:false,
          onClick() {
            this.delRow();
          }
        },
        {
          name: "刷新",
          icon: "el-icon-refresh-right",
          type: "primary",
          hidden:false,
          onClick() {
            //this.delRow();
            //如果子表还在编辑中
            if(this.$refs[this.activeDetailName][0].currentEditRow.rowIndex != -1){
              this.$message.warning(this.detail.cnName+"表格正在编辑中，无法刷新!")
              return;
            }
          }
        }
      ],

      detailsOptions:[],
            /*
              [
                {
                  cnName:"",//从表名称
                  key:"",//从表主键名
                  data:[],//数据
                  columnsOptions:[],//列信息
                  url: "", //从表加载数据的url

                  pagination: { total: 0, size: 8, sortName: "" }, //从表分页配置数据
                  maxHeight:300, //最好几个子表都一样

                  buttons:[],//按钮
                  edit: true, //明细是否可以编辑
                  single: false, //明细表是否单选
                  load: true,

                  defaultLoadPage:true,//是否一进table页面就加载数据
                  delKeys: [], //当编辑时删除当前明细的行主键值
                  currentReadonly: false, //当前用户没有编辑或新建权限时，表单只读(可用于判断用户是否有编辑或新建权限)
                  //开启编辑时
                  beginEdit: (row, column, index) => {
                    return true;
                  },
                  //结束编辑前
                  endEditBefore: (row, column, index) => {
                    return true;
                  },
                  //结束编辑后
                  endEditAfter: (row, column, index) => {
                    return true;
                  }
                }
              ]
            */
      activeDetailName:"",
    //弹出框 的 子表 end
    }
  },
  methods:{
    //当添加扩展组件gridHeader/gridBody/gridFooter及明细modelHeader/modelBody/modelFooter时，
    
    //如果要获取父级Vue对象,请使用此方法进行回调
    parentCall(fun) {
      if (typeof fun != 'function') {
        return console.log('扩展组件需要传入一个回调方法才能获取父级Vue对象')
      }
      fun(this);
    },
    
    mergeComponents() {//合并组件
      if (this.extend.components) {
        for (const key in this.extend.components) {
          if (this.extend.components[key]) {
            this.$options.components[key] = this.extend.components[key];//vue的实例属性$options是用来获取定义在data外的数据和方法的
          } else {
            this.$options.components[key] = Empty;
          }
        }
      }
    },
    refresh(isNoResetPage){//刷新当前页面
       this.search(isNoResetPage);
    },

  //表结构 弹窗 的一些扩展方法 start
    changeTableFieldIsShow(row,column,index){//更改table主表 列是否隐藏不显示
      console.log(row);
      console.log(column);
      console.log(index)

      var that=this;
      
      if(row.hidden==that.columnsOptions[index].hidden){

      }else{
        that.columnsOptions[index].hidden=row.hidden;
      }
    },
  //表结构 弹窗 的一些扩展方法 end

  //一些基础方法 ，如查询 ，新增，编辑，保存 查看表结构  Start
    search(isNoResetPage){// 主表 查询
    debugger;
        this.$refs.table.load(null, !isNoResetPage?true:false);//调用ref为 table的主kttable组件的load方法 
    },
    openViewColumns() {//查看表结构
      var that=this;
      if (that.dataStructColumns.length == 0) {
        //that.dataStructColumns=[];

        that.dataStructColumns.push(
          ...[
            { title: "名称", field: "title" },
            { title: "字段", field: "field" },
            { title: "类型", field: "type" },
            { title: "是否隐藏", field: "hidden",type:"tag",
                edit:{
                  type:"switch"
                },
                // onChange:(column,row,tableData,value)=>{
                //   debugger
                //     //将对应的tabledata中的值修改
                //    console.log(column);
                //    console.log(row);
                //    console.log(tableData);
                //    console.log(value);
                // }
              },
            { title: "绑定数据源", field: "bind" }
          ]
        );
        debugger
        that.columnsOptions.forEach(x => {
          that.dataStructData.push({
            "title": x.title,
            field: x.field,
            type: x.type,
            //hidden: x.hidden ? "否" : "是",
            hidden: x.hidden,
            bind: x.bind ? x.bind.dicNo : "--",
            // cellClassName: {
            //   title: "table-info-cell-title"
            // }
          });
        });
      }
      that.dataStructDialog = true;
    },
    
    add() {//新建   打开新增弹出框
      this.currentAction = _const.ADD;
      this.currentRow = {};
      this.initDialog();
      if (this.hasDetail) {
        this.$refs.detail &&
          //  this.$refs.detail.rowData &&
          this.$refs.detail.reset();
      }
      let obj = {};
      //如果有switch标签，默认都设置为是
      debugger;
      this.editFormOptions.forEach(x => {
        x.forEach(item => {
          if (item.type == 'switch') {
            obj[item.field] = true;
          }
        })
      })
      this.resetEditForm(obj);
      //  this.resetEditForm();
      this.dialogModel = true;
      //点击新建按钮弹出框后，可以在此处写逻辑，如，从后台获取数据
      this.modelOpenProcess();
      console.log(this.editFormData);
      console.log(this.editFormOptions);
      // this.modelOpenAfter();
    },
    //新增，编辑相关方法 start
      initDialog() { //初始化新建、编辑的弹出框
        this.modelOpenBefore(this.currentRow);
        if (!this.dialogInit) {
          this.dialogInit = true;
          this.dialogModel = true;
          // this.detailUrl = this.url;
        }
      },
      getCurrentAction() {
        if (this.currentReadonly) {
          return '';
        }
        return "--" + (this.currentAction == _const.ADD ? "新增" : "编辑");
      },
      resetEditForm(sourceObj) {
        // if (this.hasDetail && this.$refs.detail) {
        //   // this.$refs.detail.rowData.splice(0);
        //   this.$refs.detail.reset();
        // }
        this.resetForm("form", sourceObj);
      },
      // resetForm(formName, sourceObj) {//第一版
        
      //   //重置表单数据
      //   if (this.$refs[formName]) {
      //     this.$refs[formName].reset();
      //   }

      //   if (!sourceObj) return;
      //   let form = formName == "searchForm"
      //     ? this.searchFormData
      //     : this.editFormData;
      //   //获取数据源的data类型，否则如果数据源data的key是数字，重置的值是字符串就无法绑定值
      //   if (!this.keyValueType._dinit) {
      //     this.getKeyValueType(this.editFormOptions);
      //     this.getKeyValueType(this.searchFormOptions);
      //     this.keyValueType._dinit = true;
      //   }
      //   for (const key in form) {
      //     if (sourceObj.hasOwnProperty(key)) {
      //       let newVal = sourceObj[key];
      //       if (this.keyValueType['_b_' + key] == 'selectList') {
      //         if (newVal != "" && newVal != undefined && typeof newVal == 'string') {
      //           newVal = newVal.split(',');
      //         }
      //       } else if (this.keyValueType.hasOwnProperty(key)
      //         && typeof (this.keyValueType[key]) == 'number'
      //         && newVal * 1 == newVal) {
      //         newVal = newVal * 1;
      //       } else {
      //         if (newVal == null || newVal == undefined) {
      //           newVal = '';
      //         } else {
      //           newVal += "";
      //         }
      //       }
      //       form[key] = newVal;
      //     } else {
      //       form[key] = form[key] instanceof Array ? [] : "";
      //     }
      //   }
      // },
      resetForm(formName, sourceObj) {
        //重置表单数据
        if (this.$refs[formName]) {
          this.$refs[formName].reset();
        }

        if (!sourceObj) return;
        debugger
        let form, keyLeft;
        if (formName == "searchForm") {
          form = this.searchFormData;
          keyLeft = 's' + '_b_';
        } else {
          form = this.editFormData;
          keyLeft = 'e' + '_b_';
        }
        //获取数据源的data类型，否则如果数据源data的key是数字，重置的值是字符串就无法绑定值
        if (!this.keyValueType._dinit) {
          this.getKeyValueType(this.editFormOptions, true);
          this.getKeyValueType(this.searchFormOptions, false);
          this.keyValueType._dinit = true;
        }
        for (const key in form) {
          if (sourceObj.hasOwnProperty(key)) {
            let newVal = sourceObj[key];
            let kv_type = this.keyValueType[keyLeft + key];
            if (kv_type == 'selectList'
              || kv_type == 'checkbox') {
              if (newVal != "" && newVal != undefined && typeof newVal == 'string') {
                newVal = newVal.split(',');
              } else if (kv_type == 'checkbox') {
                newVal = [];
              }
            } else if (this.keyValueType.hasOwnProperty(key)
              && typeof (this.keyValueType[key]) == 'number'
              && newVal * 1 == newVal) {
              newVal = newVal * 1;
            } else {
              if (newVal == null || newVal == undefined) {
                newVal = '';
              } else {
                newVal += "";
              }
            }
            form[key] = newVal;
          } else {
            form[key] = form[key] instanceof Array ? [] : "";
          }
        }
      },

      getKeyValueType(formData) {
        try {
          formData.forEach(item => {
            item.forEach(x => {
              if (this.keyValueType.hasOwnProperty('_b_' + x.field)) {
                return true;
              }
              let data;
              if (x.type == 'switch') {
                this.keyValueType[x.field] = 1;
              }
              else if (x.bind && x.bind.data) {
                data = x.bind.data;
              } else if (x.data) {
                if (x.data instanceof Array) {
                  data = x.data;
                } else if (x.data.data && x.data.data instanceof Array) {
                  data = x.data.data;
                }
              }
              if (data && data.length > 0 && !this.keyValueType.hasOwnProperty(x.field)) {
                this.keyValueType[x.field] = data[0].key;
                this.keyValueType['_b_' + x.field] = x.type;
              }
            })
          })
        } catch (error) {
          console.log(error.message)
        }
      },
      modelOpenProcess(row) {
        this.$nextTick(() => {

          // 判断是否需要流水号
          console.log("model后")

          this.initCreateSerialNumber();
          this.modelOpenAfter(row);
        })
        return;
        // if (!this.$refs.form) {
        //     let timeOut = setTimeout(x => {
        //         this.modelOpenAfter(row);
        //     }, 500)
        //     return;
        // }
        // this.modelOpenAfter(row);
      },

      initCreateSerialNumber(){//初始化需要生成流水号的值:用于新增
        this.editFormOptions.forEach(x=>{
          x.forEach(y=>{
            //当有valueUrl且对应没有数据时，则获取对应url的值:反正编辑有值，也可以再加个判断action
            if(y.valueUrl&& !this.editFormData[y.field]){
              request({
                url:y.valueUrl,
                method:"get",
                params: { RandomParameter:new Date().getTime() }//加入时间随机参数
              }).then(res=>{
                if (res.success) {
                  // this.$message({
                  //   type: "success",
                  //   message: "删除成功!"
                  // });

                  this.editFormData[y.field]=res.data;
                  x.disabled=true;
                }
              }).catch();
            }
          })
        });
      },

      setEditForm(row) {
        // if (this.remoteColumns.length == 0 || !rows || rows.length == 0) return;
        //let remoteColumns = this.$refs.table.remoteColumns;
        // remoteColumns.forEach(column => {
        //   this.editFormOptions.forEach(option => {
        //     option.forEach(x => {
        //       if (x.field == column.field) {
        //         x.data.data = Object.assign([], x.data, column.bind.data);
        //       }
        //     })
        //   });
        // });
        //重置编辑表单数据
        debugger;
        this.editFormData[this.table.key] = row[this.table.key];

        this.resetEditForm(row);
        this.currentAction = _const.EDIT;
        this.dialogModel = true;
      },
    //新增，编辑相关方法 end

    edit() {//编辑 打开编辑弹出框

      let rows = this.$refs.table.getSelected();
      if (rows.length == 0) {
        return this.$message.error("请选择要编辑的行!");
      }

      this.currentAction = _const.EDIT;
      //记录当前编辑的行
      this.currentRow = rows[0];
      //初始化弹出框
      this.initDialog();
      //重置表单 子表
      this.resetDetailTable();//从表方法  待修改

      //
      if (rows.length > 1) {
        this.$nextTick(() => {
          //this.modelOpenAfter(row);
           this.$message.warning("已选择多个，将默认第一个!");
        })
      }

      //设置当前的数据到表单上
      this.setEditForm(rows[0]);
      //设置远程查询表单的默认key/value
      //this.getRemoteFormDefaultKeyValue();
      //点击编辑按钮弹出框后，可以在此处写逻辑，如，从后台获取数据
      this.modelOpenProcess(rows[0]);

      

       
      
      // this.modelOpenAfter(rows[0]);
    },


    save() {//点击 弹出框的保存
      //新增或编辑时保存
      // if (!this.$refs.form.validate()) return;
      this.$refs.form.validate(result => {
        if (result) {
          this.saveExecute();
        }
      })
    },
    saveExecute() { //执行保存
      let editFormData = {};
      ////上传文件以逗号隔开
      // for (const key in this.editFormData) {
      //   if (this.uploadfiled &&
      //     this.uploadfiled.length > 0
      //     && this.uploadfiled.indexOf(key) != -1
      //     && this.editFormFileds[key] instanceof Array) {
      //     let allPath = this.editFormFileds[key].map(x => {
      //       return x.path;
      //     })
      //     editFormFileds[key] = allPath.join(',');
      //   } else {
      //     editFormFileds[key] = this.editFormFileds[key];
      //   }
      // }

      // else {
           editFormData = this.editFormData;
      // }
      //将数组转换成string
      for (const key in editFormData) {
        if (editFormData[key] instanceof Array) {
          editFormData[key] = editFormData[key].join(',');
        }
      }

      let formData = {
        MainData: editFormData,
        //DetailData: [{OrderID:this.editFormData["ID"],GoodsName:"测试api2",GoodsBatch:"20200603002",Qty:18,Weight:12.5,Remarks:"测试一波"},],
        DetailData: null,
        DelKeys: null
      };

      //获取明细数据(前台数据明细未做校验，待完.后台已经校验)
      if (this.hasDetail) {

        //如果子表还在编辑中
        if(this.$refs[this.activeDetailName][0].currentEditRow.rowIndex != -1){
          this.$message.warning(this.detail.cnName+"还在编辑中，无法保存!")
          return;
        }

        formData.DetailData = this.$refs.detail.rowData;
        // formData.detailData = [];
        // this.$refs.detail.rowData.forEach(x={
          

        // })
      }
      if (this.detailOptions.delKeys.length > 0) {
        formData.DelKeys = this.detailOptions.delKeys;
      }
      //保存前拦截
      if (this.currentAction == _const.ADD) {
        if (!this.addBefore(formData)) return;
      } else {
        if (!this.updateBefore(formData)) return;
      }
      let url = this.getUrl(this.currentAction);

      //待修改 : data 数据需要修改
      var that=this;
      if(that.currentAction == _const.ADD || that.currentAction == _const.EDIT){
        return request({
          url: url,
          //url: this.table.url+"UpdateExT",
          method: 'post',
          //data: editFormData
            data: formData
        }).then(res=>{
          debugger
          if(res.success){
            that.$message({
              type: "success",
              message: "保存成功!"
            });

            if (that.currentAction == _const.ADD) {
              if (!that.addAfter(res)) return;
            } else {
              if (!that.updateAfter(res)) return;
            }

            //如果保存成功后需要关闭编辑框，直接返回不处理后面
            if (that.dialogOptions.saveClose) {
              that.dialogModel = false;
              if (that.currentAction == _const.ADD) {
                that.refresh(false);//新增则重置分页参数  isNoResetPage为true 则不重置， 
              }else {
                that.refresh(true);//编辑则不重置分页参数
              }
              
              return;
            }

            //下面代码是页面在保存成功之后 不关闭弹出框的情况代码 
            // let resultRow;
            // if (typeof x.data == "string" && x.data != "") {
            //   resultRow = JSON.parse(x.data);
            // } else {
            //   resultRow = x.data;
            // }

            // if (this.currentAction == this.const.ADD) {
            //   //  this.currentRow=x.data;
            //   this.editFormFileds[this.table.key] = "";
            //   this.currentAction = this.const.EDIT;
            //   this.currentRow = resultRow.data;
            // }
            // this.resetEditForm(resultRow.data);
            // // console.log(resultRow);
            // if (this.hasDetail) {
            //   this.detailOptions.delKeys = [];
            //   if (resultRow.list) {
            //     this.$refs.detail.rowData.push(...resultRow.list)
            //   }
            // }
            // this.refresh();
          } 

        });
      }
      
    },
    del() {//删除数据   仅仅只能删除一个
      let rows = this.$refs.table.getSelected();
      if (rows.length == 0) return this.$error("请选择要删除的行!");

      //多选择的主键ID
      let delKeys = rows.map(x => {
        return x[this.table.key];
      });
      if (!delKeys || delKeys.length == 0)
        return this.$message.error("没有获取要删除的行数据!");

      //
      if(delKeys.length>1){
        this.$message.warning("本按钮仅只能删除一行数据，如需多删除，请选择批量删除按钮！");
        return false;
      }

      //删除前
      if (!this.delBefore(delKeys, rows)) {
        return;
      }
      let tigger = false;

      this.$confirm("此操作将删除该[" + (rows[0].Name?rows[0].Name:"ID为"+delKeys[0]) + "]的"+ this.table.cnName +", 是否继续?","删除提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
      }).then(()=>{
        request({
          url: this.getUrl(_const.DEL),
          method:'get',
          params:{id:delKeys[0]}
        }).then(res=>{
          if (res.success) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });

                //删除后
                if (!this.delAfter(res)) {
                  return;
                }
                this.refresh();
              }
        }).catch();
      });

    },
    resetEdit() { //重置编辑的数据

      //如果子表还在编辑中
      if(this.$refs[this.activeDetailName][0].currentEditRow.rowIndex != -1){
        this.$message.warning(this.detail.cnName+"还在编辑中，无法重置!")
        return;
      }

      let isEdit = this.currentAction != _const.ADD;
      let objKey = {};
      //编辑状态下,不需要重置主键,创建时间创建人    // 编辑下到底是恢复到原数据，还是信息数据都为空？待解决
      if (isEdit) {
        objKey[this.table.key] = this.editFormData[this.table.key];

        this.GLOBAL.ignoreResetFields.forEach(x => {//忽略的不重置的字段
          objKey[x]=this.editFormData[x]
        });
        
      }
      //重置之前
      if (!this[isEdit ? 'resetUpdateFormBefore' : 'resetAddFormBefore']()) {
        return;
      }
      this.resetEditForm(objKey);
      //重置之后
      if (!this[isEdit ? 'resetUpdateFormAfter' : 'resetAddFormAfter']()) {
        return;
      }
    },
  //一些基础方法 ，如查询 ，新增，编辑，查看表结构  end

  // 初始化  当前rul,  按钮组 Start
    initParam(){
      this.url = this.getUrl(_const.PAGE);//生成查询列表url

      this.initButtons();//主按钮

      this.initDialogButtons();

      this.splitButtons = this.getSplitButtons(); //拆分按钮  //生成ViewGrid界面的操作按钮及更多选项

      //子表数据
      if(this.details&&this.details.length>0){
        this.activeDetailName=this.details[0].tableName;
        this.details.forEach(item => {
          this.addDetailToDetailsOptions(item);//初始化 data数据的 detailsOptions 参数
          this.initDetailButtons(item);//子表按钮
          //this.initDetailParam(item);//子表参数
        });

        this.hasDetail=true;
      }
    
      this.initDialogHeightWidth();//初始化弹出框高宽

    },
    addDetailToDetailsOptions(detail){//添加数据到  data数据的 detailsOptions 参数中
      this.detailsOptions.push(
                                {
                                  tableName:detail.tableName,
                                  cnName:detail.cnName,//从表名称
                                  key:detail.key,//从表主键名
                                  //data:[],//数据
                                  columnsOptions:detail.columnsOptions,//列信息
                                  url: "/"+detail.tableName+"/"+_const.PAGE, //从表加载数据的url :根据 从表名来生成url

                                  pagination: { total: 0, size: 8, sortName: "" }, //从表分页配置数据
                                  maxHeight:300, //最好几个子表都一样

                                  buttons:[],//按钮
                                  edit: true, //明细是否可以编辑
                                  single: false, //明细表是否单选
                                  load: true,

                                  defaultLoadPage:true,//是否一进table页面就加载数据
                                  delKeys: [], //当编辑时删除当前明细的行主键值
                                  currentReadonly: false, //当前用户没有编辑或新建权限时，表单只读(可用于判断用户是否有编辑或新建权限)
                                  //开启编辑时
                                  beginEdit: (row, column, index) => {
                                    return true;
                                  },
                                  //结束编辑前
                                  endEditBefore: (row, column, index) => {
                                    return true;
                                  },
                                  //结束编辑后
                                  endEditAfter: (row, column, index) => {
                                    return true;
                                  }
                                }
      );
    },

    // initDetailParam(){
    //   this.detailOptions.columnsOptions = this.detail.columnsOptions;
    //   this.detailOptions.pagination.sortName =  this.detail.sortName;;
    //   this.detailOptions.pagination.size=this.GLOBAL.paginations[0];

    //   this.detailOptions.cnName = this.detail.cnName;
    //   this.detailOptions.key = this.detail.key;
    //   this.detailOptions.url = this.detail.url?this.detail.url: this.getUrl("GetDetailPageData");
    // },
    getUrl(action) {//是否忽略前缀/  获取操作的url
      return  this.table.url + action;
      //return "/SysRole/" + "Add"
    },
    initButtons(){//初始化主按钮    
      //获取角色权限配置下的 对应页面的按钮(查询,新增,修改,删除,以及扩展下的按钮))
      if (this.extend.buttons.view) {
        this.buttons=this.extendBtn(this.buttonsDefault,this.extend.buttons.view);
      }else{
        this.buttons=this.buttonsDefault;
      }
      //筛选出配置在对应页面的权限表中的按钮： 待修改
      
      
    },
    //将页面view 默认按钮与扩展按钮合并
    extendBtn(btns, source) {//btns权限按钮，source为扩展按钮
      if (!btns || !(source && source instanceof Array)) { return; }
      //source通过在表的扩展js文件中buttons对应按钮的属性index决定按钮所放位置
      source.forEach((x) => {
        //通过按钮的Index属性，放到指定的位置
        btns.splice(x.index == undefined ? btns.length : x.index, 0, x);
      })
      return btns;
    },
    initDialogButtons(){//初始化弹出框按钮  初始化新增，编辑按钮 , 详情按钮
      //初始化新增，编辑按钮
      if(this.extend.buttons.dialog){
        this.dialogButtons=this.extendBtn(this.dialogButtonsDefault,this.extend.buttons.dialog);
      }else{
         this.dialogButtons=this.dialogButtonsDefault;
      }
       //判断当前操作，如是新增操作，则弹出框无 审核按钮


      //判断筛选出权限按钮


    },
    initDetailButtons(detail){//初始化详细表按钮 
      var tableNameBtns=this.extend.buttons.detail.filter(x=>{return x.tableName==detail.tableName});
      var btns=[];
      if(tableNameBtns)
      {
        btns=tableNameBtns[0].btns;
      }

      //初始化新增，编辑按钮
      if(btns&&btns.length>0){
        this.detailsOptions.filter(x=>{return x.tableName==detail.tableName})[0].buttons=this.extendBtn(this.detailButtonsDefault,btns);

        //this.detailOptions.buttons=this.extendBtn(this.detailButtonsDefault,this.extend.buttons.detail);
      }else{
         this.detailsOptions.filter(x=>{return x.tableName==detail.tableName})[0].buttons==this.detailButtonsDefault;
      }
      //判断当前操作，如是新增操作，则无 刷新按钮
      if(this.currentAction==_const.ADD){
        for(var i=0;i<this.detailsOptions.filter(x=>{return x.tableName==detail.tableName})[0].buttons.length;i++){
          if(this.detailsOptions.filter(x=>{return x.tableName==detail.tableName})[0].buttons[i].name=="刷新"){
            this.detailsOptions.filter(x=>{return x.tableName==detail.tableName})[0].buttons[i].hidden=true;
          }
        }
      }

      //判断筛选出权限按钮


    },
    getSplitButtons(){//获取到拆分按钮 （及页面只显示最大的按钮数的按钮）
      let searchIndex = this.buttons.findIndex(x => { return x.value == 'Search'; });
      //添加高级查询  ：如果主页面按钮中有查询按钮，则要有显示 多条件查询框页面的 按钮
      if (searchIndex != -1) {
        //splice() 方法向/从数组中添加/删除项目，然后返回被删除的项目
        this.buttons.splice(searchIndex + 1, 0, {
          //icon:this.searchFormShowButtonIcon,
          icon:'el-icon-arrow-down',
          //icon: !this.searchFormShow? 'el-icon-arrow-down' : 'el-icon-arrow-up',
          class: 'r-dropdown',
          name: "",
          type: this.buttons[searchIndex].type,
          onClick: () => {
            this.searchFormShow = !this.searchFormShow;
          }
        });
      }

      this.maxBtnLength += (searchIndex == -1 ? 0 : 1);
      if (this.buttons.length <= this.maxBtnLength) return this.buttons;

      let btns = this.buttons.slice(0, this.maxBtnLength);
      btns[this.maxBtnLength - 1].last = true;
      return btns;
    },
    initDialogHeightWidth(){//初始化弹出框高度和宽度  待修改
      let clientHeight = document.documentElement.clientHeight;//当前屏幕高度
      let clientWidth = document.documentElement.clientWidth;//当前屏幕宽度

       //屏幕高度至少350px
      clientHeight = clientHeight < 350 ? 350 : clientHeight;

      //有子表的页面加大默认高度
      if(this.details && this.details.length>0 && this.details[0].columnsOptions&& this.details[0].columnsOptions.length>0){
         this.dialogOptions.height=760;
      }

      if (this.dialogOptions.height) {
        //如果高度与宽度超过了获取到的可见高宽度，则设为默认的90%高宽
        if (this.dialogOptions.height >= clientHeight * 0.7) {
          this.dialogOptions.height = clientHeight * 0.7
        }
      }

      if (this.dialogOptions.width) {
        //如果高度与宽度超过了获取到的可见高宽度，则设为默认的90%高宽
        if (this.dialogOptions.width >= clientWidth * 0.7) {
          this.dialogOptions.width = clientWidth * 0.7
        }
      }
    },
  // 初始化  当前rul,  按钮组  end

  //主按钮 点击 “更多” 按钮 相关 start
    onClick(click) {//主按钮 点击
      click.apply(this);
    },
    //点击“更多”下拉菜单的菜单，调用对应的this.buttons点击事件
    changeDropdown(btnName) {
      debugger
      let button = this.buttons.filter(x => {
        return x.name == btnName;
      });
      if (button && button.length > 0) {
        button[0].onClick.apply(this);
      }
    },
  //“更多” 按钮 相关 end

  //主table 相关 start
    loadTableBefore(param, callBack) {//查询前设置查询条件及分页信息
      let query = this.getSearchParameters();//获取查询参数
      if (query) {
        param = Object.assign(param, query);
      }
      let status = this.searchBefore(param);//插口
      callBack(status);
    },
    getSearchParameters(){
       let query = { wheres: [] };

       for (const key in this.searchFormData) {
        let value = this.searchFormData[key];
        if (this.emptyValue(value)) continue;
        if (typeof value == 'number') {
          value = value + '';
        }
        let displayType = this.getSearchItem(key);
        if (typeof value == "string" || ["date", "datetime"].indexOf(displayType) == -1) {
          query.wheres.push({
            name: key,
            value: typeof value == "string" || !value ? value : value.join(','),
            displayType: displayType
          });
          continue;
        }
        for (let index = 0; index < value.length; index++) {//时间类型
          query.wheres.push({
            name: key,
            value: value[index],
            displayType: (() => {
              if (["date", "datetime"].indexOf(displayType) != -1) {
                return index ? "lessorequal" : "thanorequal";
              }
              return displayType;
            })()
          });
        }
      }
      return query;
    },
    emptyValue(value) {
      return (value === null || value === undefined || value === "");
    },
    getSearchItem(field) {//获取查询的参数
      let data;
      for (let index = 0; index < this.searchFormOptions.length; index++) {
        if (data) return data.type;
        const item = this.searchFormOptions[index];
        data = item.find(x => {
          return x.field == field;
        });
      }
      return data.type;
    },
    loadTableAfter(data, callBack) {//查询后
      let status = this.searchAfter(data);//插口
      callBack(status);
    },
    rowOnChange(row) {//选择行事件,只有单选才触发
      this.rowChange(row);
    },
    rowChange(row) {//选中行事件
    },
  //主table 相关 end

  //插口方法 start
    onInit() { //对应created
        console.log('Create执行前')
    },
    onInited() { //对应created，在onInit与onInited中间会初始化界面数据对象
        console.log('Create执行后')
    },
    mounted() {
        console.log('mounted');
    },
    searchBefore(param) { //查询ViewGird表数据前,param查询参数
        console.log('表' + this.table.cnName + '触发loadTableBefore');
        return true;
    },
    searchAfter(param, result) { //查询ViewGird表数据后param查询参数,result回返查询的结果
        console.log('表' + this.table.cnName + '触发loadTableAfter');
        return true;
    },
    searchDetailBefore(param) {//查询从表表数据前,param查询参数
        console.log(this.detailOptions.cnName + '触发loadDetailTableBefore');
        return true;
    },
    searchDetailAfter(param, data) {//查询从表后param查询参数,result回返查询的结果
        console.log(this.detailOptions.cnName + '触发loadDetailTableAfter');
        return true;
    },
    delBefore(ids, rows) { //查询界面的表删除前 ids为删除的id数组,,rows删除的行
        return true;
    },
    delAfter(result) {//查询界面的表删除后
        return true;
    },
    delDetailRow(rows) { //弹出框删除明细表的行数据(只是对table操作，并没有操作后台)
        return true;
    },
    addBefore(formData) { //新建保存前formData为对象，包括明细表
        return true;
    },
    addAfter(result) {//新建保存后result返回的状态及表单对象
        return true;
    },
    updateBefore(formData) { //编辑保存前formData为对象，包括明细表、删除行的Id
        return true;
    },
    updateAfter(result) {//编辑保存后result返回的状态及表单对象
        return true;
    },
    auditBefore(ids, rows) {//审核前
        return true;
    },
    auditAfter(result, rows) {// 审核后
        return true;
    },
    resetAddFormBefore() { //重置新建表单前的内容
        return true;
    },
    resetAddFormAfter() { //重置新建表单后的内容
        return true;
    },
    resetUpdateFormBefore() { //重置编辑表单前的内容
        return true;
    },
    resetUpdateFormAfter() { //重置编辑表单后的内容
        return true;
    },
    modelmodelOpenBefore(row) { //点击编辑/新建按钮弹出框前，可以在此处写逻辑，如，从后台获取数据

    },
    modelOpenAfter(row) {  //点击编辑/新建按钮弹出框后，可以在此处写逻辑，如，从后台获取数据

    },
    importAfter(data) { //导入excel后刷新table表格数据
        this.search();
    },
    reloadDicSource() { //重新加载字典绑定的数据源
        this.initDicKeys();
    },
  //插口方法 end

  //子表 相关方法 start
    handleDetailClick(tab, event){
        console.log(tab, event);
    },
     //查询从表前先做内部处理
    loadInternalDetailTableBefore(param, callBack) {//加载明细表数据之前,需要设定查询的主表的ID
        //每次只要加载明细表格数据就重置删除明细的值
        this.detailsOptions.forEach(item => {

            if(item.tableName==this.activeDetailName)
              item.delKeys=[];
        });

        console.log("详细相关参数："+this.detailsOptions);

        let key = this.table.key;
        if (this.currentRow && this.currentRow.hasOwnProperty(key)) {
            param.value = this.currentRow[key];//将主表的ID  赋值给查询参数
        }
        return this.loadDetailTableBefore(param, callBack);
    },
    loadDetailTableBefore(param, callBack) {//明细查询前
      //新建时禁止加载明细
      if (this.currentAction == _const.ADD) {
        callBack(false);
        return false;
      }
      let status = this.searchDetailBefore(param);//插口方法
      callBack(status);
    },
    loadDetailTableAfter(data, callBack) {//明细查询后
      let status = this.searchDetailAfter(data);//插口方法
      callBack(status);
    },

    detailRowOnChange(row) {
        this.detailRowChange(row);
    },
    detailRowChange(row) {//选中行事件

    },
    resetDetailTable(row) {//编辑和查看明细时重置从表数据
        // if (!this.detailOptions.columnsOptions || this.detailOptions.columnsOptions.length == 0) {
        //     return;
        // }
        if(!this.hasDetail) return;//这里不知道需不需要修改

        let key = this.table.key;
        let query = { value: row ? row[key] : this.currentRow[key] }
 

        //检测dateilsoptions 里面是否有 新增的数据 ， 删除的数据
        var hasDelOrDelDetail= this.detailsOptions.filter((x)=>{
          var hasAdd=false; 
          if(this.$refs[x.tableName]&&this.$refs[x.tableName][0].rowData.length>0){
            this.$refs[x.tableName][0].rowData.forEach(item => {
              if(item[x.key]){
                debugger
                hasAdd=true;
              }
            });
          }

          return x.delKeys&&x.delKeys.length>0&&hasAdd;
        })[0];
        debugger;
        if(hasDelOrDelDetail){
          this.$message.warning("检测到有新增和删除的数据")
          //return;
        }

        if (this.$refs[this.activeDetailName][0]) {
            this.$refs[this.activeDetailName][0].reset();
            debugger
            this.$refs[this.activeDetailName][0].load(query,true);
        }
    },
    //重置加载从表数据
    refreshRow() {
        this.resetDetailTable();
    },
    addRow() {

      debugger
        //如果子表还在编辑中
        if(this.$refs[this.activeDetailName][0].currentEditRow.rowIndex != -1){
          

          this.$message.warning(this.findActiveDetail().cnName+"表格正在编辑中，无法新增任何行!")
          return;
        }

        this.$refs[this.activeDetailName][0].addRow({});
        //  this.detailOptions.columns.push({});
    },
    findActiveDetail(){//找到对应的详细表的数据
      var detail= this.detailsOptions.filter((x)=>{
        return x.tableName==this.activeDetailName;
      })[0];
      debugger;
      return detail;
    },

    delRow() {
        //如果子表还在编辑中
        if(this.$refs[this.activeDetailName][0].currentEditRow.rowIndex != -1){
          this.$message.warning(this.findActiveDetail().cnName+"表格正在编辑中，无法删除任何行!")
          return;
        }

        let rows = this.$refs[this.activeDetailName][0].getSelected();
        if (!rows || rows.length == 0) {
            return this.$message.error("请选择要删除的行!");
        }
        if (!this.delDetailRow(rows)) {//插口方法
            return false;
        }

        this.$confirm("是否删除表格选择的数据?点击[保存]之后，数据才会正式删除","删除提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(()=>{
          rows = this.$refs[this.activeDetailName][0].delRow();
          let key = this.findActiveDetail().key;

          //记录删除的行数据
          rows.forEach(x => {
              if (x.hasOwnProperty(key) && x[key]) {
                  this.findActiveDetail().delKeys.push(x[key]);
              }
          })
        });

    }
  //子表 相关方法 end
  },
//生命周期钩子 start
  beforeCreate() {},
  created(){
     //在其他方法中如果拿不到this，请使用$viewGridVue或$this
    $viewGridVue = this;
    $this = this;

    //合并扩展组件
    this.mergeComponents();
    //合并自定义业务扩展方法     重点
    if (this.extend.methods) {
      for (const key in this.extend.methods) {
        this[key] = this.extend.methods[key];
      }
    }

    //如果没有指定排序字段，则用主键作为默认排序字段
    this.pagination.sortName = this.table.sortName || this.table.key;

    //this.initDialogButtons(); //初始化弹出框与明细表格按钮  //dong?

    //插口onInit
    this.onInit(); //初始化前，如果需要做其他处理在扩展方法中覆盖此方法
    //初始编辑框等数据
    //this.initDialogHeightWidth(); //初始化弹出框的高度与宽度
    this.initParam();//初始化一些参数

    //this.initDicKeys(); //初始下框数据源

    //插口 onInited
    this.onInited(); //初始化后，如果需要做其他处理在扩展方法中覆盖此方法

  },
  beforeMount() {},
  mounted() {
    //插口 mounted
    this.mounted();
  },
  //生命周期钩子 activated：在使用了keep-alive后有actived钩子：触发顺序在mounted钩子后
  activated() {
    if (!this._inited) {
      this._inited = true;
      return;
    }

    if (this.activatedLoad) {
      this.refresh(); //刷新
    }

    //合并扩展组件、弹出框新建编辑页面自定义扩展组件或组件路径
    this.mergeComponents();
  },
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {}
//生命周期钩子 end
};


//import props from "./ViewGridConfig/props.js";
//合并属性
//vueParam.props = Object.assign(vueParam.props, props);
//console.log(props);
//合并方法
vueParam.methods = Object.assign(
  vueParam.methods,
  //methods,
  vueParam.props.extend.methods
);

export default vueParam;
//import "@/assets/css/ViewContainer.less";
import "@/assets/css/ViewGrid.less";
</script>

<style scoped>
/* .view-container .view-header .remarks{
    width: 170px;
    display: flex;
    align-items: center;
    
    margin-left: 10px;
    font-size: 12px;
    margin-top: 10px;
} */
/* justify-content: center; */
</style>
