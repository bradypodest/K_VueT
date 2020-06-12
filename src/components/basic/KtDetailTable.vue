/// 详细子表 table   （废弃）
/// Karl  
/// 20200612
<template>
  <div>
    <!-- 工具栏  start-->
    <div class="toolbar">
      <div class="title form-text">
        <span>
          <i class="el-icon-s-grid" />
          {{detail.cnName}}
        </span>
      </div>
      <!--明细表格按钮-->
      <div class="btns">
        <el-button
          v-for="(btn,bIndex) in buttons"
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
    ref="detail"

      :single="detailOptions.single"
      @loadBefore="loadInternalDetailTableBefore"
      @loadAfter="loadDetailTableAfter"
      @rowChange="detailRowOnChange"

      :tableData="[]"
      :columnsOptions="detailOptions.columnsOptions"
      :pagination="detailOptions.pagination"
      :maxHeight="detailOptions.maxHeight"
    
      :url="detailOptions.url"
      :defaultLoadPage="detailOptions.defaultLoadPage"
      
      :summaryData="detailOptions.summaryData"

      :beginEdit="detailOptions.beginEdit"
      :endEditBefore="detailOptions.endEditBefore"
      :endEditAfter="detailOptions.endEditAfter"
    >
    </kt-table>
    <!-- 子表表格 end -->
  </div>
</template>

<script>
import request from '@/utils/request'
export default {
    components:{
      KtTable:() => ({ component: import("@/components/basic/KtTable.vue"), loading: AsyncLoading }),
    },
    props: {
      detail:{
        type:Object,
        default:()=>{
          return {}
          /*
            {
              tableName:"TestOrderDetail",//表名，或者也叫实体类名
              cnName:"订单明细",//表中文名称
              columnsOptions:[],//可参考 kttable组件 的 columns 参数
                                //[ {
                                //   field: "columnType",
                                //   title: "数据类型",
                                //   width: 120,
                                //   hidden:false,
                                //   edit: { type: "text", status: false, data: [], key: "" }
                                // }] //列的的数据格式edit格式： type类型(text,date,datetime,select,switch),status是否默认为编辑状态
                                //data如果是select这里data应该有数据源，如果没有数据请设置key字典编号
              sortName:"CreateTime",
              key:"ID"
            }
          */
        }
      },

      extendButtons:{
        type:Array,
        default:[]
        /*
          [//ViewGrid查询界面按钮
                {
                    name: "点我2",
                    icon: 'md-create',
                    value: 'Edit',
                    class: '',
                    type: 'success',
                    index: 1,//显示的位置
                    onClick: function () {
                        this.$message.error("扩展的明细table按钮,可设置index值指定显示位置");
                        this.$emit('fatherMethod');//如果要调用父组件的方法，就只能这样了
                    }
                }]
        */
      },
      powerButtons:{//权限按钮
        type:Array,
        default: () => {
          return [];
        }
      },

      detailData:{//数据类
        type:Array,
        default: () => {
          return [];
        }
      },

      url: {
        type: String,
        default: ""
      },
      
      maxHeight: {
        type: Number,
        default: 0
      },
      beginEdit: {
        //编辑开始
        type: Function,
        default: function(row, column, index) {
          return true;
        }
      },
      endEditBefore: {
        //结束编辑前
        type: Function,
        default: function(row, column, index) {
          return true;
        }
      },
      endEditAfter: {
        //结束编辑前
        type: Function,
        default: function(row, column, index) {
          return true;
        }
      }
    },
    data() {
      return {
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
                if(this.$refs.detail.currentEditRow.rowIndex != -1){
                  this.$message.warning(this.detail.cnName+"表格正在编辑中，无法刷新!")
                  return;
                }
              }
            }
          ],

          cnName:"",//从表名称
          key:"",//从表主键名
          data:[],//数据
          columnsOptions:[],//列信息
          url: "", //从表加载数据的url

          pagination: { total: 0, size: 8, sortName: "" }, //从表分页配置数据
          maxHeight:300,

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
        //弹出框 的 子表 end
      }
        
    },
    methods:{
      initParam(){//初始化一些参数
        this.initDetailButtons();//子表按钮
        this.initDetailParam();
      },
      initDetailButtons(){
        if(this.extendButtons&& this.extendButtons.length>0){
          this.buttons=this.extendBtn(this.detailButtonsDefault,this.extendButtons);
        }else{
           this.buttons=this.detailButtonsDefault;
        }

        //判断筛选出权限按钮
        //this.buttons= this.buttons.filter(function (val) { return this.powerButtons.indexOf(val) > -1 })

      },
      extendBtn(btns, source) {//btns按钮，source为扩展按钮
        if (!btns || !(source && source instanceof Array)) { return; }
        //source通过在表的扩展js文件中buttons对应按钮的属性index决定按钮所放位置
        source.forEach((x) => {
          //通过按钮的Index属性，放到指定的位置
          btns.splice(x.index == undefined ? btns.length : x.index, 0, x);
        })
        return btns;
      },
      initDetailParam(){//初始化参数

      },
    },
  //生命周期钩子 start
    beforeCreate() {},
    created(){
     this.initParam();//初始化一些参数
    },
    beforeMount() {},
    mounted() {},
    beforeUpdate() {},
    updated() {},
    beforeDestroy() {},
    destroyed() {}
  //生命周期钩子 end
}
</script>

