<!-- 打印设计 列表组件 （废弃） -->
<!-- Karl-->
<!-- 20200713-->

<template>
  <div class="layout-container">
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
          ></kt-form>
        </div>

        <!--明细body自定义组件-->
        <modelBody class="model-body" ref="modelBody" @parentCall="parentCall"></modelBody>





        <!--明细footer自定义组件-->
        <modelFooter ref="modelFooter" class="model-footer" @parentCall="parentCall"></modelFooter>
      </div>
      <div slot="footer">
        <el-button
          v-for="(btn,bIndex) in dialogButtons"
          :key="bIndex"
          :type="btn.type"
          v-show="!btn.hidden"
          :disabled="btn.disabled"
          @click="onClick(btn.onClick)"
          :icon="btn.icon"
        >{{btn.name}}</el-button>

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
        </Button>-->
      </div>
    </kv-dialog>
    <!-- 新增，编辑 end -->

    <!-- 主界面查询与table表单布局 start -->
    <div class="view-container">
      <!-- 主界面头 介绍 和 操作按钮 start -->
      <div class="view-header">
        <!-- 文字介绍 -->
        <div class="desc-text">
          <i class="el-icon-s-grid"></i>
          <span>打印模板</span>
        </div>
        <!-- 备注 -->
        <div class="remarks">
          <!-- <a class="text" :title="extend.text?extend.text:''"></a> -->
        </div>
        <!--快速查询字段 (一个字段))  废弃，现起到隔板的作用-->
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
          <el-dropdown @command="changeDropdown" v-if="buttons.length> maxBtnLength">
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
              </el-button>-->
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

          @rowChange="rowOnChange"
          :tableData="[]"
          :columnsOptions="columnsOptions"
          :pagination="pagination"
          :maxHeight="tableMaxHeight"
          :url="url"
          :defaultLoadPage="defaultLoadPage"
          :linkView="linkData"
        ></kt-table>
      </div>
      <!-- table 表格 end -->

      <!--footer自定义组件-->
      <gridFooter ref="gridFooter" @parentCall="parentCall"></gridFooter>
    </div>
    <!-- 主界面查询与table表单布局 end -->
  </div>
</template>

<script>
//一些基础的操作 对应的后台的api后缀方法，如查询页面的url则是    api+_const.PAGE
//其中api是   this.table.url  (如"/SysRole/"")
//增删改查导入导出等对应的action
const _const = {
  //EDIT: "Update",// 主表 更新
  EDIT: "UpdateTE", // 主表 更新
  //ADD: "Add",  //主表 新增
  ADD: "AddTE", //主表 新增
  //VIEW: "view",
  VIEW: "GetOneByID", //主表 一行数据查询
  //PAGE: "GetPageData",//主表 查询
  PAGE: "GetPageDataT", //主表 查询
  DEL: "Delete", //主表 删除数据

  DETAIL: "GetDetailPageData"
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


export default {
  components: {
    ..._components,
    KtTable,
    KvDialog:() => import("@/components/basic/KvDialog.vue"),
    KtForm:() => import("@/components/basic/KtForm.vue"),
  },
  data() {
    return {
      activatedLoad: false, //页面触发actived时是否刷新页面数据
      _inited: false, //是否已经初始化   //在钩子activated

      //一些固定的主界面按钮 静态数据 start
        buttonsDefault: [
        {
          name: "查 询", //按钮的name最好不要重复
          value: "Search",
          icon: "el-icon-search",
          class: "dropdown",
          type: "primary",
          onClick: function() {
            this.search();
          }
        },
        {
          name: "刷 新",
          icon: "el-icon-refresh",
          class: "",
          type: "success",
          onClick: function() {
            this.refresh();
          }
        },
        {
          name: "新 建",
          icon: "el-icon-plus",
          value: "Add",
          class: "",
          type: "warning",
          onClick: function() {
            this.add();
          }
        },
        {
          name: "编 辑",
          icon: "el-icon-edit",
          value: "Update",
          class: "",
          type: "warning",
          onClick: function() {
            this.edit();
          }
        },
        {
          name: "删 除",
          icon: "el-icon-close",
          class: "",
          value: "Delete",
          type: "warning",
          onClick: function() {
            this.del();
          }
        }
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
      //一些固定的主界面按钮 静态数据 end

      //主 按钮组 start
        searchFormShow: false, //高级查询(界面查询后的下拉框点击触发)

        maxBtnLength: 3, //按钮显示最大个数，其他的都放在 “更多”下拉框中

        splitButtons: [], //在buttons的基础上拆分出来显示的按钮
        buttons: [], //查询界面按钮
      //主 按钮组 end

      //主表 start
        single: false,
        //height:800,
        tableMaxHeight: 590,
        pagination: { sortName: "" },
        //paginationHide:false
        url: "", //之后会生成
        defaultLoadPage: true, //是否一进页面就加载数据

        columnsOptions:[],



      //主表 end

      //新增 ，编辑 弹出框 Start
        dialogButtons: [],
        //this.extendBtn(this.buttonsDefault,this.extend.buttons.view);
        dialogButtonsDefault: [
          {
            name: "保 存",
            icon: "el-icon-check",
            type: "primary",
            hidden: false,
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
          }
          // {
          //   name: "取 消",
          //   icon: "el-icon-refresh-right",
          //   type: "info",
          //   onClick() {

          //     //this.resetEdit();

          //   }
          // },
        ],

        dialogInit: false, //是否初始化
        dialogModel: false, //是否显示弹出框
        currentReadonly: false, //当前用户没有编辑或新建权限时，表单只读(可用于判断用户是否有编辑或新建权限)
        currentAction: null, //当前操作动作
        currentRow: [], //当前点击的主表行

        dialogOptions: {
          //弹出框的配置
          labelWidth: "110px",
          //width:"1050px",
          width: 1200,
          height: 520,
          saveClose: true //saveClose新建或编辑成功后是否关闭弹出框  为以后可以做扩展，现状态是保存之后就关闭弹出框
        },

        keyValueType: { _dinit: false } //重置表单时使用
      //新增 ，编辑 弹出框 end

    };
  },
  methods: {
  // 初始化  当前rul,  按钮组 Start
    initParam() {
      this.url = this.getUrl(_const.PAGE); //生成查询列表url

      this.initButtons(); //主按钮

      this.initDialogButtons();

      this.splitButtons = this.getSplitButtons(); //拆分按钮  //生成ViewGrid界面的操作按钮及更多选项

      this.initDialogHeightWidth(); //初始化弹出框高宽  //打算改成全屏
    },
    getUrl(action) {
      //是否忽略前缀/  获取操作的url
      return "/PrintDesign/" + action;
      //return "/SysRole/" + "Add"
    },
    initButtons() {
      //初始化主按钮
      //获取角色权限配置下的 对应页面的按钮(查询,新增,修改,删除,以及扩展下的按钮))
      this.buttons = this.buttonsDefault;
      //筛选出配置在对应页面的权限表中的按钮： 待修改
    },
    initDialogButtons() {
      //初始化弹出框按钮  初始化新增，编辑按钮 , 详情按钮
      //初始化新增，编辑按钮
      this.dialogButtons = this.dialogButtonsDefault;
      //判断当前操作，如是新增操作，则弹出框无 审核按钮

      //判断筛选出权限按钮
    },
    getSplitButtons() {
      //获取到拆分按钮 （及页面只显示最大的按钮数的按钮）
      let searchIndex = this.buttons.findIndex(x => {
        return x.value == "Search";
      });
      //添加高级查询  ：如果主页面按钮中有查询按钮，则要有显示 多条件查询框页面的 按钮
      if (searchIndex != -1) {
        //splice() 方法向/从数组中添加/删除项目，然后返回被删除的项目
        this.buttons.splice(searchIndex + 1, 0, {
          //icon:this.searchFormShowButtonIcon,
          icon: "el-icon-arrow-down",
          //icon: !this.searchFormShow? 'el-icon-arrow-down' : 'el-icon-arrow-up',
          class: "r-dropdown",
          name: "",
          type: this.buttons[searchIndex].type,
          onClick: () => {
            this.searchFormShow = !this.searchFormShow;
          }
        });
      }

      this.maxBtnLength += searchIndex == -1 ? 0 : 1;
      if (this.buttons.length <= this.maxBtnLength) return this.buttons;

      let btns = this.buttons.slice(0, this.maxBtnLength);
      btns[this.maxBtnLength - 1].last = true;
      return btns;
    },
    initDialogHeightWidth() {
      //初始化弹出框高度和宽度  待修改
      let clientHeight = document.documentElement.clientHeight; //当前屏幕高度
      let clientWidth = document.documentElement.clientWidth; //当前屏幕宽度

      //屏幕高度至少350px
      clientHeight = clientHeight < 350 ? 350 : clientHeight;

      //   //有子表的页面加大默认高度
      //   if(this.details && this.details.length>0 && this.details[0].columnsOptions&& this.details[0].columnsOptions.length>0){
      //      this.dialogOptions.height=760;
      //   }

      this.dialogOptions.height = clientHeight * 0.9;
      this.dialogOptions.width = clientWidth * 0.9;

      //   if (this.dialogOptions.height) {
      //     //如果高度与宽度超过了获取到的可见高宽度，则设为默认的90%高宽
      //     if (this.dialogOptions.height >= clientHeight * 0.9) {
      //       this.dialogOptions.height = clientHeight * 0.9
      //     }
      //   }

      //   if (this.dialogOptions.width) {
      //     //如果高度与宽度超过了获取到的可见高宽度，则设为默认的90%高宽
      //     if (this.dialogOptions.width >= clientWidth * 0.7) {
      //       this.dialogOptions.width = clientWidth * 0.7
      //     }
      //   }
    },
  // 初始化  当前rul,  按钮组  end

  //新增，编辑相关方法 start
      initDialog() { //初始化新建、编辑的弹出框
        this.modelOpenBefore(this.currentRow);
        if (!this.dialogInit) {
          this.dialogInit = true;
          this.dialogModel = true;
          // this.detailUrl = this.url;
        }

        //判断当前操作，如是新增操作，则无 刷新按钮
        if(this.currentAction==_const.ADD){
          this.detailsOptions.forEach(detail => {
            for(var i=0;i<this.detailsOptions.filter(x=>{return x.tableName==detail.tableName})[0].buttons.length;i++){
              if(this.detailsOptions.filter(x=>{return x.tableName==detail.tableName})[0].buttons[i].name=="刷新"){
                  this.detailsOptions.filter(x=>{return x.tableName==detail.tableName})[0].buttons[i].hidden=true;
              }
            }
          });
        }else{
           this.detailsOptions.forEach(detail => {
            for(var i=0;i<this.detailsOptions.filter(x=>{return x.tableName==detail.tableName})[0].buttons.length;i++){
              if(this.detailsOptions.filter(x=>{return x.tableName==detail.tableName})[0].buttons[i].name=="刷新"){
                  this.detailsOptions.filter(x=>{return x.tableName==detail.tableName})[0].buttons[i].hidden=false;
              }
            }
          });
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

      setEditForm(row) {
        //重置编辑表单数据
        this.editFormData[this.table.key] = row[this.table.key];

        this.resetEditForm(row);
        this.currentAction = _const.EDIT;
        this.dialogModel = true;
      },
  //新增，编辑相关方法 end

  

  //主table 相关 start
    getSearchParameters(){//获取查询参数
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
    rowOnChange(row) {//选择行事件,只有单选才触发
      this.rowChange(row);
    },
    rowChange(row) {//选中行事件
    },

    linkData(row, column) {   //点击table单元格快捷链接 显示编辑数据
      this.currentAction = _const.EDIT;
      this.currentRow = row;
      //初始化弹出框
      this.initDialog();



      //设置当前的数据到表单上
      this.setEditForm(row);
    },
  //主table 相关 end


  },
  //生命周期钩子 start
  beforeCreate() {},
  created() {
    //如果没有指定排序字段，则用主键作为默认排序字段
    this.pagination.sortName = this.table.sortName || this.table.key;

    this.initParam(); //初始化一些参数
  },
  beforeMount() {},
  mounted() {},
  //生命周期钩子 activated：在使用了keep-alive后有actived钩子：触发顺序在mounted钩子后
  activated() {
    if (!this._inited) {
      this._inited = true;
      return;
    }

    if (this.activatedLoad) {
      this.refresh(); //刷新
    }
  },
  beforeUpdate() {},
  updated() {},
  beforeDestroy() {},
  destroyed() {}
  //生命周期钩子 end
};
</script>