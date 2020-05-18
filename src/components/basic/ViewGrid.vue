<!-- 页面列表组件 -->
<!-- Karl-->
<!-- 20200507-->
<template>
  <div class="layout-container">
    <!-- 导入url  start -->
    <a :href="exportHref" ref="export"></a>
    <!-- 导入url  end -->

    <!-- 表 数据结构  start-->
    <!-- 表 数据结构  end-->

    <!-- 审核  start   能不能考虑下反审核-->
    <!-- 审核 end -->

    <!-- 导入execl start -->
    <!-- 导入execl end-->

    <!-- 手动选择那些列显示 Start   还可以设置前几列固定 -->
    <!-- 手动选择那些列显示 end -->

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
        <div class="“remarks”">
          <a class="text" :title="extend.text">{{extend.text}}</a>
        </div>
        <!--快速查询字段 (一个字段))-->
        <div class="search-one"></div>
        <!-- 操作按钮 start -->
        <div class="btn-group"></div>
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
          :paginationHide="false"
          :url="url"
          :defaultLoadPage="load"
          :linkView="linkData"  
          :summary="summary"
         >
         <!--  linkView  与 summary 未处理 -->
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
var $viewGridVue, $this;
const _const = {
  EDIT: "update",
  ADD: "Add",
  VIEW: "view",
  PAGE: "getPageData",
  AUDIT: "audit",
  DEL: "del",
  EXPORT: "Export", //导出操作返回加密后的路径
  DOWNLOAD: "DownLoadFile", //导出文件
  DOWNLOADTEMPLATE: "DownLoadTemplate", //下载导入模板
  IMPORT: "Import", //导入(导入表的Excel功能)
  UPLOAD: "Upload" //上传文件
};
//扩展页面上的自定义组件：可以在表对应的.js中添加
const comName = [
  "gridHeader",
  "gridBody",
  "gridFooter",
  //上面是列表 组件插口 ，下面是弹出框新增，编辑组件插口
  "modelHeader",
  "modelBody",
  "modelFooter"
];
import Empty from "@/components/basic/Empty.vue"; //先用一个空的自定义组件占位置
let _components = {
  //可以在对应的.js中重新进行赋值
  gridHeader: Empty,
  gridBody: Empty,
  gridFooter: Empty,

  modelHeader: Empty,
  modelBody: Empty,
  modelFooter: Empty
};

import KTable from "@/components/basic/KTable.vue";
//自定义组件参数
var vueParam = {
  //viewgrid自定义组件中包含的组件
  components: {
    ..._components,
    KTable: KTable, //列表组件
    UploadExcel: () => import("@/components/basic/UploadExcel.vue") //导入exect 组件
  },
  //对外参数
  props: {},
  data() {
    return {
      _inited: false, //是否已经初始化
      single: false, //表是否单选
      const: _const, //增删改查导入导出等对应的action
      boxInit: false, //新建或编辑的弹出框初化状态，默认不做初始化，点击新建或编辑才初始化弹出框
      searchBoxShow: false, //高级查询(界面查询后的下拉框点击触发)
      singleSearch: {}, //快速查询字段
      exportHref: "",
      currentAction: _const.ADD, //当新建或编辑时，记录当前的状态:如当前操作是新建
      currentRow: {}, //当前编辑或查看数据的行
      closable: false,
      boxModel: false, //弹出新建、编辑框
      width: 700, //弹出框查看表数据结构
      labelWidth: 100, //高级查询的标签宽度
      viewModel: false, //查看表结构的弹出框
      viewColumns: [], //查看表结构的列数据
      viewData: [], //查看表结构信息
      maxBtnLength: 3, //界面按钮最多显示的个数，超过的数量都显示在更多中
      buttons: [], //查询界面按钮  如需要其他操作按钮，可在表对应的.js中添加(如:Sys_User.js中buttons添加其他按钮)
      splitButtons: [],
      uploadfiled: [], //上传文件图片的字段
      boxButtons: [], //弹出框按钮 如需要其他操作按钮，可在表对应的.js中添加
      dicKeys: [], //当前界面所有的下拉框字典编号及数据源
      hasKeyField: [], //有字典数据源的字段
      keyValueType: { _dinit: false },
      url: "", //界面表查询的数据源的url
      hasDetail: false, //是否有从表(明细)表格数据
      initActivated: false,
      load: true, //是否默认加载表数据
      activatedLoad: false, //页面触发actived时是否刷新页面数据
      summary: false, //查询界面table是否显示合计
      //需要从远程绑定数据源的字典编号,如果字典数据源的查询结果较多，请在onInit中将字典编号添加进来
      //只对自定sql有效
      remoteKeys: [],
      // detailUrl: "",
      //弹出框从表(明细)对象
      detailOptions: {
        //从表配置
        buttons: [], //弹出框从表表格操作按钮,目前有删除行，添加行，刷新操作，如需要其他操作按钮，可在表对应的.js中添加
        cnName: "", //从表名称
        key: "", //从表主键名
        data: [], //数据源
        columns: [], //从表列信息
        edit: true, //明细是否可以编辑
        single: false, //明细表是否单选
        load: true,
        delKeys: [], //当编辑时删除当前明细的行主键值
        url: "", //从表加载数据的url
        pagination: { total: 0, size: 100, sortName: "" }, //从表分页配置数据
        height: 0, //默认从表高度
        doubleEdit: true, //使用双击编辑
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
      },
      auditParam: {
        //审核对象
        rows: 0, //当前选中审核的行数
        model: false, //审核弹出框
        status: -1, //审核结果
        reason: "", //审核原因
        //审核选项(可自行再添加)
        data: [
          { text: "通过", status: 1 },
          { text: "拒绝", status: 2 }
        ]
      },
      upload: {
        //导入上传excel对象
        excel: false, //导入的弹出框是否显示
        url: "", //导入的路径,如果没有值，则不渲染导入功能
        template: {
          //下载模板对象
          url: "", //下载模板路径
          fileName: "" //模板下载的中文名
        },
        init: false //是否有导入权限，有才渲染导入组件
      },
      height: 0, //表高度
      tableHeight: 0, //查询页面table的高度
      tableMaxHeight: 0, //查询页面table的最大高度
      pagination: { total: 0, size: 30, sortName: "" }, //从分页配置数据
      boxOptions: {
        saveClose: true,
        labelWidth: 100,
        height: 0,
        width: 0,
        summary: false //弹出框明细table是否显示合计
      } //saveClose新建或编辑成功后是否关闭弹出框//弹出框的标签宽度labelWidth
      
    };
  },
  //方法
  methods: {
    //其他方法放在ViewGridConfig文件夹下的methods.js
    ///合并自定义组件   ：不是很懂
    mergeComponents() {
      if (this.extend.components) {
        for (const key in this.extend.components) {
          if (this.extend.components[key]) {
            this.$options.components[key] = this.extend.components[key];
          } else {
            this.$options.components[key] = Empty;
          }
        }
      }
    }
  },
  /////生命周期钩子 start
  beforeCreate() {},
  created() {
    //在其他方法中如果拿不到this，请使用$viewGridVue或$this
    $viewGridVue = this;
    $this = this;
    //合并扩展组件
    this.mergeComponents();

    //合并自定义业务扩展方法
    if (this.extend.methods) {
      for (const key in this.extend.methods) {
        this[key] = this.extend.methods[key]; //这里不懂
      }
    }

    //如果没有指定排序字段，则用主键作为默认排序字段
    this.pagination.sortName = this.table.sortName || this.table.key;

    this.initBoxButtons(); //初始化弹出框与明细表格按钮  //dong?

    //插口onInit
    this.onInit(); //初始化前，如果需要做其他处理在扩展方法中覆盖此方法
    //初始编辑框等数据
    this.initBoxHeightWidth(); //初始化弹出框的高度与宽度

    this.initDicKeys(); //初始下框数据源//初始化字典数据

    //插口 onInited
    this.onInited(); //初始化后，如果需要做其他处理在扩展方法中覆盖此方法
    this.splitButtons = this.getButtons(); //拆分按钮  //生成ViewGrid界面的操作按钮及更多选项
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
  /////生命周期钩子 end
};

///下面是合并

import props from "./ViewGridConfig/props.js";
//合并属性
vueParam.props = Object.assign(vueParam.props, props); //Object.assign会将后面的参数覆盖前面的数组参数，合并
// const target = { a: 1, b: 2 };
// const source = { b: 4, c: 5 };
// const returnedTarget = Object.assign(target, source);
//则 target      为 { a: 1, b: 4, c: 5 }
//returnedTarget 为 { a: 1, b: 4, c: 5 }

import methods from "./ViewGridConfig/methods.js";
//合并方法
vueParam.methods = Object.assign(
  vueParam.methods,
  methods,
  props.extend.methods //用户重新复写或者添加的方法
);

export default vueParam; //这里就是组件向外公布的
import "@/assets/css/ViewContainer.less";
import "@/assets/css/ViewGrid.less";
</script>
<style scoped>
.btn-group >>> .ivu-select-dropdown {
  padding: 0px !important;
  right: 3px;
}
.btn-group >>> .ivu-select-dropdown .ivu-dropdown-menu {
  min-width: 100px;
  right: -2px;
  position: absolute;
  background: white;
  width: 130px;
  border-radius: 5px;
  border: 1px solid #e7e5e5;
}
.vertical-center-modal >>> .srcoll-content {
  padding: 0;
}
.view-model-content {
  background: #eee;
}
</style>
