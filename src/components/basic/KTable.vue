<!-- 列表自定义组件 -->
<!-- Karl-->
<!-- 20200507-->
<!--
  show-summary  表格尾部展示合计行
  summary-method  合计方法
  selection-change 选择项发生变化时 有选择框时
  row-click  当某一行被点击时会触发该事件
  cell-mouse-leave	当单元格 hover 退出时会触发该事件
  sort-change	(与下方的 sortable 为 custom时配合使用)当表格的排序条件发生变化的时候会触发该事件	
   tooltip-effect="dark"   待了解
   row-class-name 属性来为 Table 中的某一行添加 class，表明该行处于某种状态。 方法参数({row, rowIndex}) =>{}
-->
<template>
  <div>
    <!-- table -->
    <div class="k-table">
      <div class="mask" v-show="loading"></div>
      <div class="message" v-show="loading">加载中.....</div>
      <el-table
        ref="table"
        class="v-table"
        tooltip-effect="dark"
        border
        style="width: 100%"
        :show-summary="summary"
        :summary-method="(columns,row)=>{return this.summaryData;}"
        @selection-change="selectionChange"
        @row-click="rowClick"
        @cell-mouse-leave="rowEndEdit"
        @sort-change="sortChange"
        :height="realHeight"
        :max-height="realMaxHeight"
        :data="url?rowData:tableData"
        :row-class-name="initIndex"
      >
        <!-- 多选框 -->
        <el-table-column v-if="showCheckbox" type="selection" width="55"></el-table-column>
        <!-- -->
        <!-- fixed 列是否固定在左侧或者右侧，true 表示固定在左侧
            sortable	对应列是否可以排序，如果设置为 'custom'，则代表用户希望远程排序，需要监听 Table 的 sort-change 事件
        -->
        <el-table-column
          v-for="(column,cindex) in filterColumns()"
          :key="cindex"
          :prop="column.field"
          :label="column.title"
          :min-width="column.width"
          :formatter="formatter"
          :fixed="column.fixed"
          :sortable="column.sort||cindex==0?'custom':false"
        >
          <template slot-scope="scope">
            <!-- 是否有编辑的参数 -->
            <div v-if="column.edit" class="edit-el">
              <!-- 编辑状态 -->
              <div v-if="column.edit.keep||edit.rowIndex==scope.$index" class="e-item">
                <div>
                  <!-- 日期选择器 -->
                  <el-date-picker
                    :translate="true"
                    v-if="column.edit.type=='date'||column.edit.type=='datetime'"
                    :type="column.edit.type"
                    :format="column.edit.type=='date'? 'yyyy-MM-dd':'yyyy-MM-dd HH:mm:ss'"
                    :placeholder="column.title"
                    @change="(time)=>{scope.row[column.field]=time; return time}"
                    v-model="scope.row[column.field]"
                  >
                    <!-- 当是范围时间选择框时，v-model绑定的就是数组，第一个是开，第二个是结束 -->
                  </el-date-picker>
                  <!-- switch -->
                  <el-switch
                    v-else-if="column.edit.type=='switch'"
                    :active-value="typeof scope.row[column.field]=='boolean' ? true:1"
                    :inactive-value="typeof scope.row[column.field]=='boolean' ? false:0"
                    v-model="scope.row[column.field]"
                    @on-change="(value)=>{column.onChange&&column.onChange(column,scope.row,url?rowData:tableData,value);}"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="是"
                    inactive-text="否"
                  ></el-switch>
                  <!-- 下拉框 -->
                  <el-select
                    :transfer="true"
                    v-else-if="column.edit.type=='select'"
                    v-model="scope.row[column.field]"
                    :filterable="(column.filter||getSelectedOptions(column).length>10)?true:false"
                    :placeholder="'请选择'+column.title"
                    @change="column.onChange&&column.onChange(column,scope.row,url?rowData:tableData)"
                    clearable
                  >
                    <el-option
                      v-for="(kv,kvIndex) in getSelectedOptions(column)"
                      :key="kvIndex"
                      :label="kv.value===undefined?'':kv.key"
                      :value="kv.key"
                    ></el-option>
                  </el-select>
                  <!-- input -->
                  <el-input
                    v-else
                    clearable
                    v-model="scope.row[column.field]"
                    :placeholder="'请输入'+column.title"
                    @change="(event)=>{onChange	(scope,scope.row[column.field],event,column);}"
                  ></el-input>
                </div>
              </div>
              <!-- 不是编辑状态 -->
              <template v-else>
                <div v-if="column.formatter" v-html="column.formatter(scope.row,column)"></div>
                <div v-else>{{formatter(scope.row,column,true)}}</div>
              </template>
            </div>
            <!-- 没有编辑功能 直接渲染标签 -->
            <div v-else>
              <a
                v-if="column.link"
                href="javascript:void(0)"
                @click="link(scope.row,column)"
                v-text="scope.row[column.field]"
              ></a>
              <img
                v-else-if="column.type=='img'"
                v-for="(file,vIndex ) in  getFilePath(scope.row[column.field])"
                :key="vIndex"
                :onerror="defaultImg"
                @click="viewImg(scope.row,column,file.path)"
                class="table-img"
                :src="file.path"
              >
              <!-- 文件的等待验证修改 -->
              <a
                v-else-if="column.type=='file'||column.type=='excel'"
                style="margin-right: 15px;"
                class="t-file"
                v-for="(file,vIndex ) in  getFilePath(scope.row[column.field])"
                :key="vIndex"
                @click="dowloadFile(file)"
              >{{file.name}}</a>
              <!--  时间，待修改 ，改为普通的就好 -->
              <el-tag v-else-if="column.type=='date'">{{formatterDate(scope.row,column)}}</el-tag>

              <!-- 有自定义转换方法 -->
              <div
                v-else-if="column.formatter"
                @click="formatterClick(scope.row,column)"
                v-html="column.formatter(scope.row,column)"
              ></div>
              <!-- 有自定义点击单元格方法 -->
              <div
                v-else-if="column.click"
                @click="formatterClick(scope.row,column)"
              >{{scope.row[column.field]}}</div>
              <!-- 是否有绑定的数据源 -->
              <Tag
                v-else-if="(column.bind)"
                :color="getColor(scope.row,column)"
              >{{formatter(scope.row,column,true)}}</Tag>
              <div v-else>{{formatter(scope.row,column,true)}}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          v-if="(!doubleEdit)"
          :min-width="100"
          label="操作"
          fixed="right"
        >
          <template slot-scope="scope">
            <Button type="info" size="small" @click="beginWithButtonEdit(scope)" ghost>编辑</Button>
            <Button type="info" size="small" @click="endWithButtonEdit(scope)" ghost>完成</Button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 分页 -->
    <div class="block pagination">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paginations.page"
        :page-sizes="[30, 60, 100,300,500]"
        :page-size="paginations.size"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paginations.total"
      ></el-pagination>
    </div>
  </div>
</template>
<script>
var $vue;
import request from '@/utils/request'
export default {
  components: {},
  props: {
    tableData: {
      //表数据源,配置了url就不用传这个参数了
      type: Array,
      default: () => {
        return [];
      }
    },
    url: {
      type: String,
      default: ""
    },
    defaultLoadPage: {
      //传入了url，是否默认加载表格数据
      type: Boolean,
      default: true
    },
    columns: {
      type: Array,
      default: []
      //[ {
      //   field: "columnType",
      //   title: "数据类型",
      //   width: 120,
      //   hidden:false,
      //   edit: { type: "text", status: false, data: [], key: "" }
      // }] //列的的数据格式edit格式： type类型(text,date,datetime,select,switch),status是否默认为编辑状态
      //data如果是select这里data应该有数据源，如果没有数据请设置key字典编号
    },
    height: {
      type: Number,
      default: 0
    },
    maxHeight: {
      type: Number,
      default: 0
    },
    //设置linkView属性后，可不用配置click与formatter方法，直接使用linkView处理点击事件
    linkView: {
      type: Function,
      default: function() {
        return 1;
      }
    },
    pagination: {
      type: Object,
      default: function() {
        return { total: 0, size: 0, sortName: "" };
      }
    },
    paginationHide: {
      //是否隐藏分页数据
      type: Boolean,
      default: true
    },
    color: {
      //待研究
      type: Boolean,
      default: true
    },
    index: {
      //待看
      //是否创建索引号,如果需要表格编辑功能，这里需要设置为true
      type: Boolean,
      default: false
    },
    allowEmpty: {
      //表格数据为空时是否默认为--
      type: Boolean,
      default: true
    },
    loadKey: {
      //是否自动从后台加载数据源,如【审核状态】字段是的值是数字，但要显示对应的文字，1=审核中，2=审核通过
      type: Boolean,
      default: false
    },
    single: {
      type: Boolean, //是否单选
      default: false
    },
    doubleEdit: {
      type: Boolean, //是否双击启用编辑功能
      default: false
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
    showCheckbox: {
      //是否显示checkbox
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      visiblyColumns: [], //可见字段
      key: "", //当前字段
      realHeight: 0, //高度
      realMaxHeight: 0,
      enableEdit: false, //是否启表格用编辑功能
      empty: this.allowEmpty ? "" : "--",
      defaultImg: 'this.src="' + require("@/assets/imgs/error.png") + '"',
      loading: false, //待修改
      footer: {},
      total: 0,

      formatConfig: {},
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
      columnNames: [],
      rowData: [],

      paginations: {
        sort: "",
        order: "desc",
        Foots: "",
        total: 0,
        size: 0,
        Wheres: [], //查询条件，格式为[{ name: "字段", value: "xx" }]
        page: 1,
        rows: 30
      },

      errorFiled: "",
      edit: { columnIndex: -1, rowIndex: -1 }, //当前双击编辑的行与列坐标
      editStatus: {},
      summary: false, //是否显示合计
      //目前只支持从后台返回的summaryData数据
      summaryData: [],
      summaryIndex: {},
      remoteColumns: [] //需要每次刷新或分页后从后台加载字典数据源的列配置
    };
  },
  methods: {
    //双击row
    rowClick(row, column) {
      if (!this.doubleEdit) {
        return;
      }
      this.rowBeginEdit(row, column);
    },
    //下载文件  待修改
    dowloadFile(file) {
      // this.base.dowloadFile(
      //   file.path,
      //   file.name,
      //   {
      //     Authorization: this.$store.getters.getToken()
      //   },
      //   this.http.ipAddress
      // );
    },
    //获取文件路径
    getFilePath(pathSring) {
      //获取表的图片与文件显示
      if (!pathSring) return "";
      let filePath = pathSring.replace(/\\/g, "/").split(",");
      let fileInfo = [];
      for (let index = 0; index < filePath.length; index++) {
        let file = filePath[index];
        if (file.indexOf(".") != -1) {
          let splitFile = file.split("/");
          if (splitFile.length > 0) {
            fileInfo.push({
              name: splitFile[splitFile.length - 1],
              path: this.PUBLICTOOL.isUrl(file) ? file : this.IPADDRESS + file
            });
          }
        }
      }
      return fileInfo;
    },
    //重置table
    reset() {
      if (this.tableData && this.tableData.length > 0) {
        this.tableData.splice(0);
      }
      if (this.rowData && this.rowData.length > 0) {
        this.rowData.splice(0);
      }
      if (!this.paginationHide) {
        this.paginations.page = 1;
        this.paginations.rows = 30;
        if (this.paginations.wheres && this.paginations.wheres.length > 0) {
          this.paginations.wheres.splice(0);
        }
      }
      this.errorFiled = "";
      this.edit.columnIndex = -1;
      this.edit.rowIndex = -1;
    },
    //获取table高度
    getHeight() {
      //没有定义高度与最大高度，使用table默认值
      if (!this.height && !this.maxHeight) {
        return null;
      }
      //定义了最大高度则不使用高度
      if (this.maxHeight) {
        return null;
      }
      //使用当前定义的高度
      return this.height;
    },
    getMaxHeight() {
      //没有定义高度与最大高度，使用table默认值
      if (!this.height && !this.maxHeight) {
        return null;
      }
      //定义了最大高度使用最大高度
      if (this.maxHeight) {
        return this.maxHeight;
      }
      //不使用最大高度
      return null;
    },
    //获取绑定在data上的options数组
    getSelectedOptions(column) {
      if (column.bind && column.bind.data && column.bind.data.length > 0) {
        return column.bind.data;
      }
      return [];
    },
    //执行单元格自定义点击事件
    formatterClick(row, column, event) {
      column.click && column.click(row, column, event);
    },
    initIndex(obj) {
      if (this.index) {
        obj.row.elementIdex = obj.rowIndex;
      }
      return "";
    },
    toggleEdit(event) {},
    //设置 行编辑状态
    setEditStatus(status) {
      this.columns.forEach(x => {
        if (x.hasOwnProperty("edit")) {
          this.$set(x.edit, "status", status);
        }
      });
    },
    //通过button按钮启用编辑
    beginWithButtonEdit(scope) {
      //url?rowData:tableData
      this.rowBeginEdit(scope.row, this.columns[scope.$index]);
    },
    //通过button结束编辑
    endWithButtonEdit(scope) {
      if (this.edit.rowIndex == -1) return;

      if (
        !this.endEditBefore(scope.row, this.columns[scope.$index], scope.$index)
      )
        return;

      for (let index = 0; index < this.columns.length; index++) {
        let column = this.columns[index];
        if (!column.hidden && (column.required || column.require)) {
          if (!this.validateColum(column, scope.row)) return;
        }
      }
      this.edit.rowIndex = -1;
      if (
        !this.endEditAfter(scope.row, this.columns[scope.$index], scope.$index)
      )
        return;
    },
    //行开始编辑
    rowBeginEdit(row, column) {
      if (this.edit.rowIndex != -1) {
        return;
      }
      if (!this.enableEdit) return;
      //编辑前
      if (!this.beginEdit(row, column, row.elementIdex)) return;
      if (row.hasOwnProperty("elementIdex")) {
        if (this.edit.rowIndex == row.elementIdex) {
          return;
        }
        this.edit.rowIndex = row.elementIdex;
      }
    },
    //验证 单元格数据
    validateColum(option, data) {
      if (option.hidden || option.bind) return true;
      let val = data[option.field];
      if (option.require || option.required) {
        if (val != "0" && (val == "" || val == undefined)) {
          if (!this.errorFiled) {
            //  event.focus();
            this.$Message.error(option.title + "不能为空");
          }
          return false;
        }
      }
      if (!option.edit) {
        return true;
      }
      let editType = option.edit.type;
      //验证数字
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

      //验证字符串
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
    //行 结束编辑
    rowEndEdit(row, column, event) {
      if (!this.enableEdit) {
        if (!this.errorFiled) {
          this.edit.rowIndex = -1;
        }
        return;
      }
      if (!this.doubleEdit && event) {
        return;
      }
      //结束编辑前
      if (!this.endEditBefore(row, column, this.edit.rowIndex)) return;

      if (
        this.edit.rowIndex != -1 &&
        (!this.errorFiled || this.errorFiled == column.property)
      ) {
        let data = (this.url ? this.rowData : this.tableData)[
          this.edit.rowIndex
        ];
        let option = this.columns.find(x => {
          return x.field == column.property;
        });
        if (!option || !option.edit) {
          return;
        }
        if (
          option.edit.type == "datetime" ||
          option.edit.type == "date" ||
          option.edit.type == "select"
        ) {
          if (this.edit.rowIndex == row.elementIdex) {
            return;
          }
        }
        if (!this.validateColum(option, data)) {
          this.errorFiled = option.field;
          return false;
        } else {
          this.errorFiled = "";
        }
      }
      if (this.errorFiled) {
        return;
      }
      if (!this.endEditAfter(row, column, this.edit.rowIndex)) return;
      //  this.errorFiled = "";
      this.edit.rowIndex = -1;
      //this.edit.columnIndex=-1;
    },
    //删除行
    delRow() {
      let rows = this.getSelected();
      if (rows.length == 0) return this.$Message.error("请选择要删除的行!");

      let data = this.url ? this.rowData : this.tableData;
      let indexArr = this.getSelectedIndex();
      if (indexArr.length == 0) {
        return this.$Message.error("删除操作必须设置kTable的属性index='true'");
      }
      // if (indexArr.length == 0 || !this.key) {
      //   return this.$message.error(
      //     "请设置index=true属性或指columns的字段为key"
      //   );
      // }
      if (indexArr.length == 0) {
        // let keyValues=[]
        // rows.forEach(x=>{
        //   if (x[this.key]) {
        //   }
        //   keyValues.push(x[this.key])
        // })
        // data.find(x=>)
      } else {
        for (let i = data.length - 1; i >= 0; i--) {
          if (indexArr.indexOf(i) != -1) {
            data.splice(i, 1);
          }
        }
      }
      this.edit.rowIndex = -1;
      return rows;
    },
    //添加行
    addRow(row) {
      if (!row) {
        row = {};
      }
      this.columns.forEach(x => {
        if (x.edit && x.edit.type == "switch") {
          if (!row.hasOwnProperty(x.field)) {
            row[x.field] = x.type == "bool" ? false : 0;
          }
        }
      });
      if (!this.url) {
        this.tableData.push(row);
        return;
      }
      this.rowData.push(row);
    },
    //浏览图片
    viewImg(row, column, url) {
      this.PUBLICTOOL.previewImg(url, this.IPADDRESS);
      // window.open(row[column.field]);
    },
    link(row, column) {
      this.$props.linkView(row, column);
    },
    //获取table 多选框勾选的
    getSelected() {
      return this.$refs.table.selection;
    },
    //获取table 多选框勾选的序列号
    getSelectedIndex() {
      if (!this.index) {
        //只有设置了属性index才有索引行
        return [];
      }
      let indexArr = this.$refs.table.selection.map(x => {
        return x.elementIdex;
      });
      return indexArr ? indexArr : [];
    },
    //获取字典数据 待修改
    GetTableDictionary(rows) {
      //分页或刷新或重新绑定数据源
      if (this.remoteColumns.length == 0 || !rows || rows.length == 0) return;
      let remoteInfo = {};
      for (let index = 0; index < this.remoteColumns.length; index++) {
        const column = this.remoteColumns[index];
        //  column.bind.data.splice(0);
        let key = column.bind.key;
        let data = [];
        rows.forEach(row => {
          if (data.indexOf(row[column.field]) == -1) {
            data.push(row[column.field]);
          }
        });
        if (data.length > 0) {
          remoteInfo[key] = data;
        }
      }
      if (remoteInfo.length == 0) return;
      //ha= Object.assign([], ha, hb)
      // this.http
      //   .post("/api/Sys_Dictionary/GetTableDictionary", remoteInfo)
      //   .then(dic => {
      //     dic.forEach(x => {
      //       this.remoteColumns.forEach(column => {
      //         if (column.bind.key == x.key) {
      //           column.bind.data = Object.assign([], column.bind.data, x.data);
      //           //column.bind.data.push(...x.data);
      //         }
      //       });
      //     });
      //   });
    },
    load(query, isResetPage) {
      //isResetPage重置分页数据
      if (!this.url) return;
      if (isResetPage) {
        this.resetPage();
      }
      let param = {
        page: this.paginations.page,
        rows: this.paginations.rows,
        sort: this.paginations.sort,
        order: this.paginations.order,
        wheres: [] //查询条件，格式为[{ name: "字段", value: "xx" }]
      };
      let status = true;
      //合并查询信息(包查询分页、排序、查询条件等)
      if (query) {
        param = Object.assign(param, query);
      }
      /*查询前处理(如果需要查询条件，实现组件方法loadBefore方法即可:
        loadBefore=(param, callBack)=>{
          param.wheres = [{ name: "PhoneNo", value: "13419098211" }];
          callBack(true);
        })
      */
      this.$emit("loadBefore", param, result => {
        status = result;
      });
      if (!status) return;

      if (param.wheres && param.wheres instanceof Array) {
        param.wheres = JSON.stringify(param.wheres);
      }
      this.loading = true;
debugger;
      var data = {
        pageIndex: this.paginations.page,
        pageSize: this.paginations.size>0?this.paginations.size:30,
        order: "", //"CreateTime desc"
        wheres: ""
      };
      request({
        url: this.url,
        method: "post",
        data: data
      })
        .then(data => {
          this.loading = false;
          
          if (data.success) {
            this.$message({
              type: "success",
              message: "查询数据成功!"
            });
           //查询返回结果后处理
          this.$emit("loadAfter", data.data || [], result => {
            status = result;
          });
          if (!status) return;

          this.rowData = data.data || [];
          this.paginations.total = data.dataCount;
          //合计
          //this.getSummaries(data);
          }
        })
        .catch();

      //待修改
      // this.http.post(this.url, param).then(
      //   data => {
      //     this.loading = false;
      //     //查询返回结果后处理
      //     this.$emit("loadAfter", data.rows || [], result => {
      //       status = result;
      //     });
      //     if (!status) return;
      //     this.GetTableDictionary(data.rows);
      //     this.rowData = data.rows || [];
      //     this.paginations.total = data.total;
      //     //合计
      //     this.getSummaries(data);
      //   },
      //   error => {
      //     this.loading = false;
      //     // this.$Message.error(error || "网络异常");
      //   }
      // );
    },
    //获取统计
    getSummaries(data) {
      if (!this.summary || !data.summary) return;
      this.summaryData.splice(0);
      //如果有checkbox，应该算作是第一行
      if (this.ck) {
        this.summaryData.push(0);
      }
      this.columns.forEach(col => {
        if (!col.hidden) {
          if (data.summary.hasOwnProperty(col.field)) {
            this.summaryData.push(data.summary[col.field]);
          } else {
            this.summaryData.push("");
          }
        }
      });
      if (this.summaryData.length > 0 && this.summaryData[0] == "") {
        this.summaryData[0] = "合计";
      }
    },
    getInputChangeSummaries() {},
    //获取显示的字段，hidden=false
    filterColumns() {
      return this.columns.filter(x => {
        return !x.hidden;
      });
    },
    //处理分页 每页个数 改变
    handleSizeChange(val) {
      this.paginations.rows = val;
      this.load();
    },
    //处理 跳转页
    handleCurrentChange(val) {
      this.paginations.page = val;
      this.load();
    },
    //排序改变时
    sortChange(sort) {
      this.paginations.sort = sort.prop;
      this.paginations.order = sort.order == "ascending" ? "asc" : "desc";
      this.load();
    },
    //重置查询分页 参数
    resetPage() {
      this.paginations.rows = 30;
      this.paginations.page = 1;
    },
    //选择行事件,只有单选才触发  每点击多选框时
    selectionChange(selection) {
      // console.log(selection);

      if (this.single && selection.length == 1) {
        this.$emit("rowChange", selection[0]); //
      }
      if (this.single && selection.length > 1) {
        this.$refs.table.toggleRowSelection(selection[0]);
      }
      // this.rowChange(selection[0]);
    },
    //tag标签 根据值确定显示的颜色
    getColor(row, column) {
      let val = row[column.field];

      // if (val == "" || val == null || val == undefined) {
      //  return "none";
      // }
      if (column.getColor && typeof column.getColor == "function") {
        let _color = column.getColor(row, column);
        if (_color) {
          return _color;
        }
      }
      if (!val && val != "0") {
        return this.defaultColor;
      }
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

    //格式化日期
    formatterDate(row, column) {
      return (row[column.field] || "").substr(0, 10);
    },
    //格式化
    formatter(row, column, template) {
      if (!template) return row[column.property];
      let val = row[column.field];
      //是否值
      if (column.edit && column.edit.type == "switch") {
        return val ? "是" : "否";
      }
      if (!column.bind || !column.bind.data) {
        return row[column.field];
      }
      if (!val && val != 0) return val;
      //编辑多选table显示
      if (
        (column.bind.type == "selectList" || column.bind.type == "checkbox") &&
        typeof val == "string" &&
        val.indexOf(",") != -1
      ) {
        return this.getSelectFormatter(column, val);
      }
      let source = column.bind.data.filter(x => {
        return x.key != "" && x.key == val;
      });
      if (source && source.length > 0) val = source[0].value;
      return val;
    },
    getSelectFormatter(column, val) {
      //编辑多选table显示
      let valArr = val.split(",");
      for (let index = 0; index < valArr.length; index++) {
        column.bind.data.forEach(x => {
          if (x.key != "" && x.key == valArr[index]) {
            valArr[index] = x.value;
          }
        });
      }
      return valArr.join(",");
    },
    onChange(scope, val, event, column) {
      let row = scope.row;
      if (row.onChange && !row.onChange(row, val, event)) {
        return;
      }
      //输入框求和实时计算
      this.getInputSummaries(scope, val, event, column);
    },
    //input输入实时求和
    getInputSummaries(scope, val, event, column) {
      //column列设置了summary属性的才计算值
      if (!column.summary) return;
      let sum = 0;
      let _index = 0;
      (this.url ? this.rowData : this.tableData).forEach((x, index) => {
        if (x.hasOwnProperty(column.field) && !isNaN(x[column.field])) {
          _index = index;
          sum += x[column.field] * 1;
        }
      });
      this.$set(this.summaryData, this.summaryIndex[column.field] - 1, sum);
    }
  },
  created() {
    //待修改
    this.realHeight = this.getHeight();
    this.realMaxHeight = this.getMaxHeight();

    //从后台加下拉框的[是否启用的]数据源
    let keys = [];
    let columnBind = [];
    this.summaryData.push("合计");
    this.columns.forEach((x, _index) => {
      if (!x.hidden) {
        this.summaryIndex[x.field] = _index;
        this.summaryData.push("");
      }
      //求和
      if (x.summary && !this.summary) {
        //强制开启选择框
        this.ck = true;
        this.summary = true;
      }
      if (x.bind && x.bind.key && (!x.bind.data || x.bind.data.length == 0)) {
        //写入远程
        if (!x.bind.data) x.bind.data = [];
        if (x.bind.remote) {
          this.remoteColumns.push(x);
        } else if (this.loadKey) {
          keys.push(x.bind.key);
          x.bind.valueTyoe = x.type;
          columnBind.push(x.bind);
        }
      }
    });
    if (keys.length > 0) {
      this.http.post("/api/Sys_Dictionary/GetVueDictionary", keys).then(dic => {
        dic.forEach(x => {
          columnBind.forEach(c => {
            //转换数据源的类型与列的类型一致(2020.04.04)
            if (c.valueTyoe == "int" || c.valueTyoe == "sbyte") {
              x.data.forEach(d => {
                d.key = ~~d.key;
              });
            }
            if (c.key == x.dicNo) c.data.push(...x.data);
          });
        });
      });
    }

    this.paginations.sort = this.pagination.sortName;
    this.enableEdit = this.columns.some(x => {
      return x.hasOwnProperty("edit");
    });
    let keyColumn = this.columns.find(x => {
      return x.isKey;
    });
    if (keyColumn) {
      this.key = keyColumn.field;
    }
    //如果下拉框，判断bind或edit.data是否有数据源，妱果没有则获取数据源bind
    $vue = this;
    // this.$emit
    this.defaultLoadPage && this.load();
  }
};
</script>
<style lang="less" scoped>
.k-table {
  position: relative;
  .mask {
    opacity: 0.2;
    position: absolute;
    width: 100%;
    height: 100%;
    background: #d0d0d0;
    z-index: 100;
  }
  .message {
    text-align: center;
    color: #635c5c;
    font-size: 15px;
    font-weight: 600;
    background: #eee;
    transform: translateY(-50%);
    top: 50%;
    position: absolute;
    z-index: 200;
    left: 0;
    right: 0;
    width: 150px;
    margin: 0 auto;
    line-height: 40px;
    border-radius: 4px;
    border: 1px solid #a09e9e;
  }
  .e-item {
    display: flex;
    > div:first-child {
      flex: 1;
    }
  }
}
</style>

<style scoped>
/*表头错行 .el-table th.gutter{
    display: table-cell!important;
} */
.pagination {
  text-align: right;
  /* margin-top: 8px; */
  padding: 2px 28px;
  border: 1px solid #eee;
  border-top: 0px;
}
.v-table >>> .el-table__header th {
  padding: 1.5px !important;

  background-color: #f8f8f9 !important;
  font-size: 13px;
}
.v-table >>> .el-table__body .cell {
  word-break: inherit !important;
  white-space: nowrap !important;
}
.v-table >>> .el-table__body td {
  padding: 7px 0 !important;
}

.v-table >>> .el-table__footer td {
  padding: 5px 0 !important;
}
.vol-table >>> .el-table th > .cell {
  white-space: inherit !important;
}
.k-table >>> .el-table__body-wrapper::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.k-table >>> .el-table__body-wrapper::-webkit-scrollbar-thumb {
  border-radius: 5px;
  background: #ddd;
}
.k-table .table-img {
  height: 40px;
  border-radius: 5px;
  margin-right: 10px;
  width: 40px;
  object-fit: cover;
}
.k-table .table-img:hover {
  cursor: pointer;
}
.v-table >>> .ivu-tag-default {
  border: none !important;
  background: none !important;
}
/* .spin-icon-load{
        animation: ani-demo-spin 1s linear infinite;
    }
    @keyframes ani-demo-spin {
        from { transform: rotate(0deg);}
        50%  { transform: rotate(180deg);}
        to   { transform: rotate(360deg);}
    }
    .message{
        height: 50px;
        position: relative;
        border: 1px solid #eee;
    } */
</style>

