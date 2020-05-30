<!-- 列表自定义组件 -->
<!-- Karl-->
<!-- 20200515-->

<template>
  <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
    <div class="kt-table">
      <el-table 
       ref="table"
       class="v-table"
       border
       :max-height="realMaxHeight"
       :data="url?rowData:tableData"
       style="width: 100%;"

       @selection-change="selectionChange"
       :show-summary="summaryData.isSummary"
       :summary-method="getSummaries"
       >
       <!-- 多选框 -->
       <el-table-column v-if="showCheckbox" type="selection" width="55" align="center"></el-table-column>
       <el-table-column 
        v-for="(column,cindex) in filterColumns()"
        :key="cindex"
        :prop="column.field"
        :label="column.title"
        :min-width="column.width"
        :formatter="localFormatter"
        :fixed="column.fixed"
        :header-align="column.align||'center'"
        :align="column.align||'center'"
        :show-overflow-tooltip="true"
        >
       
       <template slot-scope="scope">
        <div v-if="column.edit&&currentEditRow.rowIndex==scope.$index" class="edit-el">
          <!-- 编辑 且有编辑功能-->
          <div v-if="column.edit">
            <el-date-picker 
              v-if="column.edit.type=='date'||column.edit.type=='datetime'"
              :type="column.edit.type"
              :format="column.edit.type=='date'? 'yyyy-MM-dd':'yyyy-MM-dd HH:mm:ss'"
              :placeholder="column.title"
              @change="(time)=>{scope.row[column.field]=time; return time}"
              v-model="scope.row[column.field]"
              ::picker-options="column.edit.pickerOptions"
            >
            </el-date-picker>
            <el-switch 
              size="small"
              v-else-if="column.edit.type=='switch'"
              :active-value="typeof scope.row[column.field]=='boolean' ? true:1"
              :inactive-value="typeof scope.row[column.field]=='boolean' ? false:0"
              v-model="scope.row[column.field]"
              @on-change="(value)=>{column.onChange&&column.onChange(column,scope.row,url?rowData:tableData,value);}"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="是"
              inactive-text="否"
             >
             <!-- 待修改颜色 -->
            </el-switch>
            <!-- 下拉框  -->
            <el-select 
              :transfer="true"
              v-else-if="column.edit.type=='select'"
              v-model="scope.row[column.field]"
              :filterable="(column.filter||getSelectedOptions(column).length>10)?true:false"
              :placeholder="'请选择'+column.title"
              @change="(value)=>{column.onChange&&column.onChange(column,scope.row,url?rowData:tableData,value)}"
              clearable
             >
             <el-option
              v-for="(kv,kvIndex) in getSelectedOptions(column)"
              :key="kvIndex"
              :label="kv.value===undefined?'':kv.value"
              :value="kv.key"
             ></el-option>
            </el-select>
             <el-input
              v-else-if="column.edit.type=='text'||column.edit.type=='string'"
              clearable
              v-model="scope.row[column.field]"
              :placeholder="'请输入'+column.title"              
            ></el-input>
            <!-- @change="(event)=>{onChange	(scope,scope.row[column.field],event,column);}" -->


          </div>
          <!-- 编辑 且无编辑功能-->
          <div v-else>
            <div v-if="column.formatter" v-html="column.formatter(scope.row,column)"></div>
            <div v-else>{{localFormatter(scope.row,column,true)}}</div>
          </div>
        </div>
        <!-- 不编辑 -->
        <div v-else
           @click.native="customClick(scope.row,column)"
        >
          <div v-if="column.type=='img'">
            <el-image 
              class="table-img"
              v-for="(fileUrl,vIndex ) in  getFilePath(scope.row[column.field])"
              :key="vIndex"
              :src="fileUrl" 
              :preview-src-list="getFilePath(scope.row[column.field])">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
          </div>
          <el-tag v-else-if="column.type=='tag'"
            :color="getColor(scope.row,column)"
            :disable-transitions=true
           >
           {{localFormatter(scope.row,column,true)}}
          </el-tag>
          <div
            v-else-if="column.formatter"
            v-html="column.formatter(scope.row,column)"
          ></div>
          <div v-else>{{localFormatter(scope.row,column,true)}}</div>
        </div>
       </template>
       </el-table-column>
       <el-table-column
          v-if="isShowEditButton"
          :min-width="120"
          label="操作"
          fixed="right"
          align="center"
        >
          <template slot-scope="scope">
            <el-button v-if="currentEditRow.rowIndex!=scope.$index" type="info" size="small" @click="beginWithButtonEdit(scope)" >编辑</el-button>
            <el-button v-if="currentEditRow.rowIndex==scope.$index" type="info" size="small" @click="endWithButtonEdit(scope)" >完成</el-button>
            <el-button v-if="currentEditRow.rowIndex==scope.$index" type="info" size="small" @click="cancelWithButtonEdit(scope)" >取消</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="block pagination" v-if="!paginationHide">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paginations.page"
        :page-sizes="GLOBAL.paginations.pageSizes"
        :page-size="paginations.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paginations.total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
import request from '@/utils/request'
import dateUtil from '@/utils/date'
export default {
  components:{},
  props:{
    paginationHide: {
      type: Boolean,
      default: false
    },
    // height: {
    //   type: Number,
    //   default: 0
    // },
    maxHeight: {
      type: Number,
      default: 600
    },

    url: {
      type: String,
      default: ""
    },
    tableData: {//表数据源,配置了url就不用传这个参数了      
      type: Array,
      default: () => {
        return [];
      }
    },
    showCheckbox: {      //是否显示checkbox
      type: Boolean,
      default: true
    },
    single: {
      type: Boolean, //是否单选
      default: false
    },

    //表字段参数
    columnsOptions:{
      type: Array,
      default: []
      /*
        [
          field:"Name",//字段名，数据库传递，英文
          title:"名字",//显示名称
          type:"text",// 标签显示类型 img,tag,    text,date,datetime,select,switch,
          width:"100",//px
          fixed:"true", //列是否固定在左侧或者右侧，true 表示固定在左侧
          align:"center",//单元格内容和表头文字位置 ：left/center/right 
          hidden:false,//是否隐藏 空也是不隐藏
          require:true,//是否必须，防止编辑之后设为空
          edit:{ 
              type: "text", //text,date,datetime,select,switch， (number,decimal,int)
              status: false, //status是否可以为编辑状态,好像可以不用
              min:2,//最小（ 数类型时）
              max:10,,//最大 （数类型时）
              pickerOptions: {//快捷输入时间  edit.type为datatime时可用
                          shortcuts: [{
                            text: '今天',
                            onClick(picker) {
                              picker.$emit('pick', new Date());
                            }
                          }, {
                            text: '昨天',
                            onClick(picker) {
                              const date = new Date();
                              date.setTime(date.getTime() - 3600 * 1000 * 24);
                              picker.$emit('pick', date);
                            }
                          }, {
                            text: '一周前',
                            onClick(picker) {
                              const date = new Date();
                              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                              picker.$emit('pick', date);
                            }
                          }]
                        },
          },
          bind:{
            data: [],//data如果是select这里data应该有数据源 [{ key: 0, value: "冬瓜" }, { key: 1, value: "西瓜" }],
            key: "" ,//字典编号，（待加入功能）
          },
          //编辑状态下的 值变化事件
          onChange:(column,//当前列字段的表字段参数(columnsOptions[field])
            row,//当前行数据， scope.row
            tableData,//表格数据  url?rowData:tableData
            value,//当前选择的值
          ),
          formatter:(row, column, cellValue)=>{return ""},//自定义格式化数据方法
          click:(row,column,event)=>{},//单元格点击事件
          getColor:(row,column)=>{},//自定义tag颜色
        ]
      */
    },
    pagination: {
      type: Object,
      default: function() {
        //return { total: 0, size: 30, sortName: "" };
        return {};
      }
    },
    //是否一进页面就加载数据
    defaultLoadPage: {//传入了url，是否默认加载表格数据      
      type: Boolean,
      default: true
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
    },
    summaryData:{
      type: Object,
      default: function() {
        return {
          isSummary:false
          //summaryFun:(columns,data){return [];}//自定义合计方法
          }
        }
    }
  },
  data(){
    return {
      rowData: [],//url访问后台后，数据存放点
      currentEditRow:{//当前编辑行
        rowIndex: -1,//当前编辑行的索引
        rowData: {},//数据
      },

      formatConfig: {},//已配置字段的颜色
      //可以抽离的参数 s
      defaultColor: "default",
      colors: [
        "success",
        "primary",
        "error",
        "warning",
        "magenta",
        "red",
        "volcano",
        "orange",
        "gold",
        "green",
        "cyan",
        "blue",
        "geekblue",
        "#FFA2D3",
        "default"
      ],
      rule: {
        phone: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
        decimal: /(^[\-0-9][0-9]*(.[0-9]+)?)$/,
        number: /(^[\-0-9][0-9]*([0-9]+)?)$/
      },
      //可以抽离的参数 e

      paginations: {
        sort: "",
        order: "desc",
        total: 0,
        size: 30,
        page: 1,
        foots: "",
        wheres: [], //查询条件，格式为[{ name: "字段", value: "xx" }]
        
      },
      isShowEditButton: true,
      realMaxHeight:null
    }
  },
  methods:{
    //获取显示的字段，hidden=false
    filterColumns() {
      return this.columnsOptions.filter(x => {
        // if(x.hidden=='undefined'){
        //   return true;
        // }
        // if(typeof x.hidden=='boolean'){
        //   return !x.hidden;
        // }else if(typeof x.hidden=='number'){
        //   return x.hidden==0;
        // }else{
        //   return true;//默认是显示的
        // }

        return !x.hidden;
      });
    },
    //本组件的格式化
    localFormatter(row, column, template) {
      let val=row[column.field];
      if (column.edit && column.edit.type == "switch") {
        return val ? "是" : "否";
      }
      if(val && column.type=='date'){
        //return new Date(val).Format("yyyy-MM-dd");
        return dateUtil.formatDate.format(new Date(val), "yyyy-MM-dd")
        //return (row[column.field] || "").substr(0, 10);
      }
      if(val && column.type=='datetime'){
        //return new Date(val).Format("yyyy-MM-dd HH:mm:ss");
        return dateUtil.formatDate.format(new Date(val), "yyyy-MM-dd hh:mm:ss")
        //return (row[column.field] || "").substr(0, 10);
      }

      if (!column.bind || !column.bind.data) {
        return row[column.field];
      }
      
      //如果绑定了值，则选择框  ,指的是 [{ key: 0, value: "冬瓜" }, { key: 1, value: "西瓜" }]这种数据
      let trueVal="";
      if(column.bind.data&&column.bind.data.length>0){
        column.bind.data.forEach(x => {
          if (x.key != "" && x.key == val) {
            trueVal = x.value;
          }
        });

        return trueVal;
      }

      if (!val && val != 0) return val;
    },
    //获取下拉框 绑定在data上的options数组
    getSelectedOptions(column) {
      if (column.bind && column.bind.data && column.bind.data.length > 0) {
        return  column.bind.data;
      }
      return [];
    },

    //获取文件路径
    getFilePath(pathSring) {
      //获取表的图片与文件显示
      if (!pathSring) return "";
      let filePath = pathSring.replace(/\\/g, "/").split(",");//分隔为数组
      
      let fileUrls = [];
      for (let index = 0; index < filePath.length; index++) {
        let file = filePath[index];
        if (file.indexOf(".") != -1) {
          // let splitFile = file.split("/");
          // if (splitFile.length > 0) {
          //   fileUrls.push({
          //     name: splitFile[splitFile.length - 1],
          //     path: this.PUBLICTOOL.isUrl(file) ? file : this.IPADDRESS + file
          //   });
          // }

          fileUrls.push(
             this.PUBLICTOOL.isUrl(file) ? file : this.IPADDRESS + file
          );
        }
      }
      return fileUrls;
    },
    //执行单元格自定义点击事件
    customClick(row, column, event) {
      column.click && column.click(row, column, event);
    },
     //tag标签 根据值确定显示的颜色
    getColor(row, column) {
      let val = row[column.field];

      if (val == "" || val == null || val == undefined) {
       return "none";
      }

      if (column.getColor && typeof column.getColor == "function") {
        let _color = column.getColor(row, column);
        if (_color) {
          return _color;
        }
      }

      if (!val && val != "0") {
        return this.defaultColor;
      }

      // if(typeof val=='number'){
      //     return this.colors[val];
      // }

      if (!this.formatConfig[column.field]) {
        this.formatConfig[column.field] = [val];
        return this.colors[0];
      }
      let index = this.formatConfig[column.field].indexOf(val);
      if (index != -1) {
        return this.colors[index];
      }
      if (this.formatConfig[column.field].length > 15) {
        return this.defaultColor;
      }

      if (index == -1) {
        this.formatConfig[column.field].push(val);
        index = this.formatConfig[column.field].length - 1;
      }
      return this.colors[index];
    },
    //通过button按钮启用编辑
    beginWithButtonEdit(scope) {
      //url?rowData:tableData
      this.rowBeginEdit(scope.row, this.columnsOptions[scope.$index],scope.$index);
    },
     //行开始编辑
    rowBeginEdit(row, column,editIndex) {
      // currentEditRow:{//当前编辑行
      //   rowIndex: null,//当前编辑行的索引
      //   rowData: [],//数据
      // },
      if (this.currentEditRow.rowIndex != -1) {
        return;
      }
      if (!this.isShowEditButton) return;
      //编辑前
      if (!this.beginEdit(row, column, editIndex)) return;//传入的 插口 ，

      this.currentEditRow.rowIndex = editIndex;
      
      this.currentEditRow.rowData=JSON.parse(JSON.stringify(row));//克隆数据
    },
    //通过button结束编辑
    endWithButtonEdit(scope) {
      if (this.currentEditRow.rowIndex == -1) return;

      if (
        !this.endEditBefore(scope.row, this.columnsOptions[scope.$index], scope.$index)
      )
        return;////传入的 插口 

      for (let index = 0; index < this.columnsOptions.length; index++) {
        let column = this.columnsOptions[index];
        // if (!column.hidden && (column.required || column.require)) {
        //   if (!this.validateColum(column, scope.row)) return;
        // }
        if(!column.hidden && column.edit){
           if (!this.validateColum(column, scope.row)) return;
        }
      }
      this.resetCurrentEditRow();
      if (
        !this.endEditAfter(scope.row, this.columnsOptions[scope.$index], scope.$index)
      )
        return;//传入的 插口
    },
    //将 当前编辑行参数 重置
    resetCurrentEditRow(){
      this.currentEditRow.rowIndex = -1;
      this.currentEditRow.rowData={};
    },
    //验证 单元格数据
    validateColum(option, data) {
      if (option.hidden || option.bind) return true;//隐藏或者是下拉绑定数据的直接返回true,不验证了
      let val = data[option.field];
      if (option.require || option.required) {
        if (val != "0" && (val == "" || val == undefined)) {
          //if (!this.errorFiled) {
            //  event.focus();
            this.$Message.error(option.title + "不能为空");
          //}
          return false;
        }
      }
      // if (!option.edit) {
      //   return true;
      // }
      let editType = option.edit.type;
      //验证数字  和 限定大小范围
      if (editType == "int" || editType == "decimal" || editType == "number") {
        if (val == "" || val == undefined) return true;
        if (editType == "decimal") {
          if (!this.rule.decimal.test(val)) {
            this.$Message.error(option.title + "只能是数字");
            return false;
          }
        } else if (!this.rule.decimal.test(val)) {
          this.$Message.error(option.title + "只能是整数");
          return false;
        }
        if (
          option.edit.min != undefined &&
          typeof option.edit.min == "number" &&
          val < option.edit.min
        ) {
          this.$Message.error(option.title + "不能小于" + option.edit.min);
          return false;
        }
        if (
          option.edit.max != undefined &&
          typeof option.edit.max == "number" &&
          val > option.edit.max
        ) {
          this.$Message.error(option.title + "不能大于" + option.edit.min);
          return false;
        }
        return true;
      }

      //验证字符串 和 限定 长度
      if (val && (editType == "text" || editType == "string")) {
        if (
          option.edit.min != undefined &&
          typeof option.edit.min == "number" &&
          val.length < option.edit.min
        ) {
          this.$Message.error(
            option.title + "至少" + option.edit.min + "个字符"
          );
          return false;
        }
        if (
          option.edit.max != undefined &&
          typeof option.edit.max == "number" &&
          val.length > option.edit.max
        ) {
          this.$Message.error(
            option.title + "最多" + option.edit.max + "个字符"
          );
          return false;
        }
        return true;
      }
      return true;
    },
    //通过按钮恢复到之前状态
    cancelWithButtonEdit(scope){
      //scope.row, this.columnsOptions[scope.$index],scope.$index
      if(this.url){
        this.rowData[this.currentEditRow.rowIndex]=JSON.parse(JSON.stringify(this.currentEditRow.rowData));
      }else{
        this.tableData[this.currentEditRow.rowIndex]=JSON.parse(JSON.stringify(this.currentEditRow.rowData));
      }
      //scope.row= this.currentEditRow.rowData;
      this.resetCurrentEditRow();
    },

    //处理分页 每页个数 改变
    handleSizeChange(val) {
      this.paginations.size = val;
      this.paginations.page=1;
      this.load();
    },
    //处理 跳转页
    handleCurrentChange(val) {
      this.paginations.page = val;
      this.load();
    },
    /*
    加载数据
    isResetPage:重置分页数据
    */
    load(query, isResetPage) {
      if (!this.url) return;
      if (isResetPage) {
        this.resetPage();
      }
      let param = {
        pageIndex: this.paginations.page,
        pageSize: this.paginations.size,
        sort: this.paginations.sort,
        //order: this.paginations.order,
        //wheres: [] //查询条件，格式为[{ name: "字段", value: "xx" }]
        order: "",
        wheres: "" //查询条件，格式为[{ name: "字段", value: "xx" }]
      };
      let status = true;
      debugger;
      //合并查询信息(包查询分页、排序、查询条件等)
      if (query) {
        param = Object.assign(param, query);
      }

      // loadBefore 插口代码 s
      this.$emit("loadBefore", param, result => {
        status = result;
      });
      if (!status) return;
      // loadBefore 插口代码 e

      //param.wheres instanceof Array 意思是 wheres 是否是数组
      if (param.wheres && param.wheres instanceof Array) {
        param.wheres = JSON.stringify(param.wheres);
      }

      //this.loading = true;
debugger
      //var url=  this.table.url + action;
      request({
        url: this.url,
        method: "post",
        data: param
      })
      .then(data => {
        //this.loading = false;
        debugger
        if (data.success) {
          this.$message({
            type: "success",
            message: "查询数据成功!"
          });
          //查询返回结果后处理  loadAfter 插口 s
          this.$emit("loadAfter", data.data || [], result => {
            status = result;
          });
          if (!status) return;
          //loadAfter 插口 e
          this.rowData = data.data.data || [];
          this.paginations.total = data.data.dataCount;
          //合计
          //this.getSummaries(data);
        }
      })
      .catch();

      //this.rowData=[{"Status":1,"RoleID":"PhoneAdmin","Name":"手机管理员","Description":"手机管理员q","CreateID":"1","Creator":"admin","CreateTime":"2020-02-01T10:45:02.93","ModifyID":"1","Modifier":"admin","ModifyTime":"2020-03-20T14:00:07.817","ID":"d940bb2d-948c-4e4e-a9e7-9b8d3e523acf","DeleteTime":null,"Deleter":null,"DeleterID":null},{"Status":1,"RoleID":"Admin","Name":"管理员","Description":"管理员","CreateID":"1","Creator":"admin","CreateTime":"2019-12-31T16:44:26.01","ModifyID":null,"Modifier":null,"ModifyTime":null,"ID":"e687b190-ac64-4dcd-b94f-26d7e562e620","DeleteTime":null,"Deleter":null,"DeleterID":null},{"Status":1,"RoleID":"Test","Name":"测试","Description":"测试描述eeeeeewwwqeeew","CreateID":"1","Creator":"admin","CreateTime":"2019-12-31T15:41:12.303","ModifyID":"1","Modifier":"admin","ModifyTime":"2019-12-31T16:09:38.06","ID":"52331972-6010-403b-8e23-c96e33acdcc4","DeleteTime":null,"Deleter":null,"DeleterID":null}];
      //this.paginations.total = 3;
    },
    //重置查询分页 参数
    resetPage() {
      this.paginations.size = this.GLOBAL.paginations.pageSizes[0];
      this.paginations.page = 1;
    },


    // getHeight() {
    //   //没有定义高度与最大高度，使用table默认值
    //   if (!this.height && !this.maxHeight) {
    //     return null;
    //   }
    //   //定义了最大高度则不使用高度
    //   if (this.maxHeight) {
    //     return null;
    //   }
    //   //使用当前定义的高度
    //   return this.height;
    // },
    getMaxHeight() {
      //没有定义高度与最大高度，使用table默认值
      // if (!this.height && !this.maxHeight) {
      //   return null;
      // }
      //定义了最大高度使用最大高度
      if (this.maxHeight) {
        return this.maxHeight;
      }
      //不使用最大高度
      return null;
    },

    //  ellipsis(value) {
    //   if (!value) return "";
    //   if (value.length > 15) {
    //     return value.slice(0, 15) + "...";
    //   }
    //   return value;
    // }

    //选择行事件,只有单选才触发  每点击多选框时
    selectionChange(selection) {
      // console.log(selection);

      if (this.single && selection.length == 1) {
        this.$emit("rowChange", selection[0]); //调用父方法
      }
      if (this.single && selection.length > 1) {
        this.$refs.table.toggleRowSelection(selection[0]);
        //toggleRowSelection	用于多选表格，切换某一行的选中状态，
        //   如果使用了第二个参数，则是设置这一行选中与否（selected 为 true 则选中）
      }
      // this.rowChange(selection[0]);
    },

    ///合计方法
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];

      //let isSummaryFun=false;//是否已经自定义合计方法
      if(this.summaryData.isSummary && this.summaryData.summaryFun){
        sums = this.summaryData.summaryFun(columns,data);
        return sums;
      }

      ///下方是默认的合计 ：第一列是“合计”
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = '合计';
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          sums[index] += ' 元';
        } else {
          //sums[index] = 'N/A';
          sums[index] = '';
        }
      });

      return sums;
    },

    getSelected() {
      return this.$refs.table.selection;//获取到多选的值
    },
  },
  created(){
    //this.realHeight = this.getHeight();
    this.realMaxHeight = this.getMaxHeight();
debugger;
    this.paginations.sort = this.pagination.sortName?this.pagination.sortName:this.paginations.sort;
    //this.paginations.size=this.pagination.size;
    this.paginations.size= this.pagination.size?this.pagination.size: this.GLOBAL.paginations.pageSizes[0];

    //this.isShowEditButton=true;
    this.isShowEditButton = this.columnsOptions.some(x => {
      return x.hasOwnProperty("edit");
    });
    this.defaultLoadPage && this.load(null,false);//加载列表数据
  },
}
</script>
<style scoped>
.pagination {
  text-align: right;
  /* margin-top: 8px; */
  padding: 2px 28px;
  border: 1px solid #eee;
  border-top: 0px;
}
.v-table >>> .el-table__header th {
  /* padding: 1.5px !important;

  background-color: #f8f8f9 !important;
  font-size: 13px; */
  background-color: #f8f8f9 !important;
  font-size: 13px;
}
.v-table >>> .el-table__body .cell {
  word-break: inherit !important;
  white-space: nowrap !important;
}
.v-table >>> .el-table__body td {
  padding: 2px 0 !important;
  height: 48px;
}
/* .kt-table >>>  .el-tooltip__popper{max-width:20%;background:#f5f5f5 !important;
    color: #303133 !important;}
.kt-table >>>  .el-tooltip__popper.is-dark{background:#f5f5f5 !important;
    color: #303133 !important;} */

.v-table >>> .el-table__footer td {
  padding: 5px 0 !important;
}
.kt-table >>> .el-table th > .cell {
  white-space: inherit !important;
}
.kt-table >>> .el-table__body-wrapper::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.kt-table >>> .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #ddd;
}

</style>


