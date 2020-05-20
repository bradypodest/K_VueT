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
      :height="450" :width="dataStructWidth" 
      :title="table.cnName+'数据结构'">
      <div slot=content>
        <kt-table 
         :paginationHide=true         
         :columnsOptions="dataStructColumns"
         :tableData="dataStructData"
         :showCheckbox=false         
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
          <el-dropdown trigger="click" @on-click="changeDropdown" v-if="buttons.length> maxBtnLength">
            <el-button type="primary" ghost size="small">
              更多
              <i class="el-icon-arrow-down el-icon--right"></i>
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                :name="item.name"
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
      <div class="search-box">
      </div>
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
          :height="height"
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
//一些基础的操作 对应的后台的api后缀方法，如查询页面的url则是    api+this._const.PAGE
//其中api是   this.table.url  (如"/SysRole/"")
const _const = {
  EDIT: "Update",// 主表 更新
  ADD: "Add",  //主表 新增
  //VIEW: "view",
  VIEW: "GetOneByID",//主表 一行数据查询
  PAGE: "GetPageData",//主表 查询
  DEL: "Delete",//主表 删除数据
  
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
              box:{//新建、编辑弹出框按钮:与上面一致
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
  },
  data(){
    return {
      _inited: false, //是否已经初始化   //在钩子activated
      activatedLoad: false, //页面触发actived时是否刷新页面数据

    //一些固定的按钮 start
      buttonsDefault : [{
        name: "查 询",
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
      // {
      //     name: "数据结构",
      //     icon: 'ios-cog',
      //     class: '',
      //     value: '',
      //     onClick: function () {
      //         this.openViewColumns();
      //     }
      // }
      ],
    //一些固定的按钮 end

    //表结构 弹出框 start
      dataStructDialog:false,
      dataStructWidth:"600",
      dataStructColumns:[], //查看表结构的列数据  //数据来源于主table的数据 
      dataStructData: [], //查看表结构信息  //数据来源于主table的数据
    //表结构 弹出框 end

    //主 按钮组 start
      searchBoxShow: false, //高级查询(界面查询后的下拉框点击触发)
      maxBtnLength:3,//按钮显示最大个数，其他的都放在 “更多”下拉框中

      splitButtons: [],//在buttons的基础上拆分出来显示的按钮
      buttons: [], //查询界面按钮  如需要其他操作按钮，可在表对应的.js中添加(如:Sys_User.js中buttons添加其他按钮)
    //主 按钮组 end

    //主表 start
      single:false,
      height:0,
      tableMaxHeight:0,
      pagination: { total: 0, size: 30, sortName: "" }, 
      //paginationHide:false
      url:"",//之后会生成
      summaryData:{
         isSummary:false
      },
      defaultLoadPage:true,//是否一进页面就加载数据
    //主表 end
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
    refresh(){//刷新当前页面
       this.search();
    },

  //一些基础方法 ，如查询  Start
    search(){// 主表 查询
      this.$refs.table.load(null, true);//调用ref为 table的主kttable组件的load方法 
    },
  //一些基础方法 ，如查询  end

  // 初始化  当前rul,  按钮组 Start
    initParam(){
      this.url = this.getUrl(_const.PAGE);//生成查询列表url

      this.initButtons();

      this.initDialogButtons();

      this.splitButtons = this.getSplitButtons(); //拆分按钮  //生成ViewGrid界面的操作按钮及更多选项
    },
    getUrl(action) {//是否忽略前缀/  获取操作的url
      return  this.table.url + action;
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
      //判断当前操作，如是新增操作，则弹出框无 审核按钮
      //判断筛选出权限按钮


    },
    getSplitButtons(){//获取到拆分按钮 （及页面只显示最大的按钮数的按钮）
      let searchIndex = this.buttons.findIndex(x => { return x.value == 'Search'; });
      //添加高级查询  ：如果主页面按钮中有查询按钮，则要有显示 多条件查询框页面的 按钮
      if (searchIndex != -1) {
        //splice() 方法向/从数组中添加/删除项目，然后返回被删除的项目
        this.buttons.splice(searchIndex + 1, 0, {
          icon: 'el-icon-arrow-down',
          class: 'r-dropdown',
          name: "",
          type: this.buttons[searchIndex].type,
          onClick: () => {
            this.searchBoxShow = !this.searchBoxShow;
          }
        });
      }

      this.maxBtnLength += (searchIndex == -1 ? 0 : 1);
      if (this.buttons.length <= this.maxBtnLength) return this.buttons;

      let btns = this.buttons.slice(0, this.maxBtnLength);
      btns[this.maxBtnLength - 1].last = true;
      return btns;
    },
  // 初始化  当前rul,  按钮组  end

  //主按钮 点击 “更多” 按钮 相关 start
    onClick(click) {//主按钮 点击
      click.apply(this);
    },
    //点击“更多”下拉菜单的菜单，调用对应的this.buttons点击事件
    changeDropdown(btnName, v1) {
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
      //let query = this.getSearchParameters();//获取查询参数
      // if (query) {
      //   param = Object.assign(param, query);
      // }
      let status = this.searchBefore(param);//插口
      callBack(status);
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
    modelOpenBefore(row) { //点击编辑/新建按钮弹出框前，可以在此处写逻辑，如，从后台获取数据

    },
    modelOpenAfter(row) {  //点击编辑/新建按钮弹出框后，可以在此处写逻辑，如，从后台获取数据

    },
    importAfter(data) { //导入excel后刷新table表格数据
        this.search();
    },
    reloadDicSource() { //重新加载字典绑定的数据源
        this.initDicKeys();
    }
  //插口方法 end
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

    //this.initBoxButtons(); //初始化弹出框与明细表格按钮  //dong?

    //插口onInit
    this.onInit(); //初始化前，如果需要做其他处理在扩展方法中覆盖此方法
    //初始编辑框等数据
    //this.initBoxHeightWidth(); //初始化弹出框的高度与宽度
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
