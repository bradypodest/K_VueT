<!--  表单组件  -->
<!--  Karl  -->
<!--  2020-05-11  -->
<template>
  <el-form
    ref="formValidate"
    :style="{width:width>0?(width+'px'):'100%'}"
    :model="formData"
    :label-width="labelWidth"
    label-position="right"
  >
    <slot name="header"></slot>
    <el-row
      type="flex"
      class="row-bg"
      justify="space-around"
      v-for="(row,rindex) in formOptions"
      :key="rindex"
    >
      <el-col v-for="(item,index) in row" :key="index">
        <el-form-item
          :prop="item.field"
          :label="item.title?(item.title+':'):''"
          :rules="getRule(item,formData)"
        >
          <!--  v-if  只读文件-->
          <div v-if="isReadonlyImgFile(item,formData)">
            <!-- 文件图片 -->
            <div v-if="item.type=='img' || item.columnType=='img'" class="form-imgs">
              <div
                class="img-item"
                v-for="(img,imgIndex) in formData[item.field]"
                :key="imgIndex"
              >
                <img :src="getSrc(img.path)" :onerror="errorImg" @click="previewImg(img.path)">
              </div>
            </div>
            <!-- 不是图片的文件 -->
            <div v-else>
              <div
                class="form-file-list"
                v-for="(file,fileIndex) in formData[item.field]"
                :key="fileIndex"
              >
                <a @click="dowloadFile(formData[item.field][fileIndex])">{{file.name}}</a>
              </div>
            </div>
          </div>
          <!-- v-else-if   只读-->
          <label
            v-else-if="item.disabled||item.readonly"
            class="readonly-input"
          >{{getText(formData,item)}}</label>
          <!-- （不是文件 且 可操作）或者是（可操作文件） -->
          <div v-else>
            <div>
              <!-- 下拉框 -->
              <div
                v-if="item.type=='select'||item.type=='selectList'||item.type=='drop'||item.type=='dropList'"
               >
                <!-- 远程搜索下拉框 -->
                <el-select
                  v-if="item.remote||item.url"
                  v-model="formData[item.field]"
                  filterable
                  remote
                  @clear="()=>{onClear(item,formData)}"
                  :remote-method="(val)=>{remoteSearch(item,formData,val)}"
                  :loading="item.loading"
                  :placeholder="item.placeholder?item.placeholder:( '请选择'+item.title)"
                  @change="onRemoteChange(item,formData[item.field])"
                  clearable
                >
                  <el-option
                    v-for="(kv,kvIndex) in getData(item)"
                    :key="kvIndex"
                    :label="kv.key||''"
                    :value="kv.value"
                  ></el-option>
                </el-select>
                <!-- 普通不远程搜索下拉框 -->
                <el-select
                  v-else
                  v-model="formData[item.field]"
                  :multiple="(item.type=='select'||item.type=='drop')?false:true"
                  :filterable="(item.filter||item.data.length>10)?true:false"
                  :placeholder="item.placeholder?item.placeholder:( '请选择'+item.title)"
                  @change="onChange(item,formData[item.field])"
                  clearable
                >
                  <el-option
                    v-for="(kv,kvIndex) in getData(item)"
                    :key="kvIndex"
                    :label="kv.key||''"
                    :value="kv.value"
                  ></el-option>
                </el-select>
              </div>

              <!-- switch -->
              <el-switch
                v-else-if="item.type='switch'"
                :active-value="typeof formData[item.field]=='boolean' ? true:1"
                :inactive-value="typeof formData[item.field]=='boolean' ? false:0"
                v-model="formData[item.field]"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-text="是"
                inactive-text="否"
                >
              </el-switch>
              <!-- 时间 -->
              <el-row
                v-else-if="item.type=='date'||item.type=='datetime'||item.columnType=='datetime'"
               >
                <el-col :span="24">
                    <el-date-picker 
                      :type="item.range?(item.type+'range'):item.type"
                      :format="item.type=='date'? 'yyyy-MM-dd':'yyyy-MM-dd HH:mm:ss'"
                      :placeholder="item.placeholder||item.title"
                      range-separator="至"
                      :start-placeholde="item.startPlaceholder||item.title"
                      :end-placeholde="item.endPlaceholder||item.title"
                      @change="(time)=>{formData[item.field]=time; return time}"
                      v-model="formData[item.field]">
                      <!-- 当是范围时间选择框时，v-model绑定的就是数组，第一个是开，第二个是结束 -->
                    </el-date-picker>
                </el-col>
              </el-row>
              <!-- 多选框 -->
              <el-checkbox-group v-else-if="item.type=='checkbox'"
                v-model="formData[item.field]"
               >
               <el-checkbox v-for="(kv,kvIndex) in item.data" :key="kvIndex"
                :label="kv.key"
                >
                {{kv.value}}
               </el-checkbox>
              </el-checkbox-group>
              <!-- 文本域输入框 -->
              <el-input v-else-if="item.type='textarea'"
                v-model="formData[item.field]"
                type="textarea"
                clearable
                :placeholder="item.placeholder?item.placeholder:( '请输入'+item.title)"
                :autosize="{minRows:item.minRows||2,maxRows:item.maxRows||10}"
                @keypress.native="($event)=> onKeypress($event,item)"
                :ref="item.field"
               >
               <!-- @keypress.native 是原生事件在element上 有可能有问题 -->
              </el-input>

              <!-- 密码输入框 -->
              <el-input v-else-if="item.type=='password'"
               type="password"
               v-model="formData[item.field]"
               :placeholder="item.placeholder?item.placeholder:( '请输入'+item.title)"
               @keypress.native="($event)=> onKeypress($event,item)"
               :ref="item.field"
               clearable
               >
              </el-input>
              <!-- 可操作文件  待定  上传文件组件-->

              <!-- 普通的输入框 包含number , int ,decimal ,其他 -->
              <el-input v-else
               v-model="formData[item.field]"
               :placeholder="item.placeholder?item.placeholder:( '请输入'+item.title)"
               @keypress.native="($event)=> onKeypress($event,item)"
               :ref="item.field"
               clearable
               >
              </el-input>
            </div>
            <!-- 额外标签  暂时没想到需要 -->
          </div>
        </el-form-item>
      </el-col>
    </el-row>
     <slot name="footer"></slot>
  </el-form>
</template>
<<script>
export default {
  comments:{},
  props:{
    ///是否加载formOptions字段配置的数据源
    loadKey: {
      type: Boolean,
      default: false
    },
    ///表单宽度   不填则是 100% 
    width: {
      type: Number,
      default: 0
    },
    //表单左边label文字标签的宽度
    labelWidth: {      
      type: Number,
      default: 100
    },
    ///表单的一些设置参数
    //如 [
        //[{"dataKey":"ordertype",  //是否自动绑定select/checkboxt等标签的数据源   字典编号
        //"data":[{ key: 0, value: "冬瓜" }, { key: 1, value: "西瓜" }],  //数据源，可以手动绑定格式[{key:1,value:'是'}],也可以自动绑定,自定绑定需要设置属性loadKey='true'
        //"title":"订单类型",//lable上显示的文字 
        //"readonly":true, // 是否只读 
        //"required":true,//是否必填
        //"field":"OrderType",//字段英文名称（就是后台传递到前端） 与表单字段都必须相同
        //"filter": true,//启用搜索,只对select/selectList生效,默认下拉框数据源超出10个开启搜索
        //"type":"select"//是什么控件（ mail、number、decimal,phone(输入框，只是本组件加入了判断)
                                  // text(输入框) ,textarea(文本框),img(图片),
                                  // checkbox(多选框),
                                  // date、datetime(日期选择框),
                                  // switch(开关),
                                  //   下拉控件（select）,
                                  // selectList(多选下拉框)   ）
        // "range": true, //type是日期时， 设置为true可以选择开始与结束日期
        // "min":1 ,//数字类型标签：最小值,如果是type=number(整数)类型，默认验证最小值是1(decimal最小默认值0.1)，
                    // 其他标签,如：input/textarea设置min就是指的字符的最小长度
        // "max":8,//与上min相反
        //"validator":(rule, val) => { if (val != "123") { return "自定设置必须输入123";   }    return "";  }//自定义规则
        //onKeyPress: $event => { if ($event.keyCode == 13) {} }, //只对input/textarea生效,
        //onChange: (value, option) => {} , //type=select生效 
        //url: "/api/App_Appointment/Upload",//从指定后台url(例：api/xx/xx)远程搜索，(返回的数据格式:[{key:'x',value:'x1'}])，type=select生效
        //remote:true,	开启后台字典远程搜索(后台字典必须配置必须是自定sql)，type=select才会生效
        //minRows:2,//	 textarea标签最小高度  number	2 
        //maxRows:10,//  textarea标签最大高度
        //"placeholder":"",//标签提示文字
        //startPlaceholder:"开始时间",// 只对时间选择器为范围时间时起作用（既参数 range为true 时 ）
        //endPlaceholder:"结束时间",// 同上startPlaceholder 
        //"colSize":"",//每行列的宽度，可选值:12,8,6,如果是12标签会占100%宽度   算法：item.colSize?item.colSize*2:24/span         span 是你准备分为几行
        //},
      //  {"title":"运单号","required":true,"field":"TranNo"},
      //  {"title":"销售数量","required":true,"field":"Qty","type":"number"}],
      // [{"title":"备注","field":"Remark","colSize":8,"type":"textarea"},
      //  {"title":"销售订单号","required":true,"field":"SellNo"}],
      // [{"title":"创建人","field":"Creator","disabled":true},
      //  {"title":"创建时间","field":"CreateDate","disabled":true},
      //  {"title":"修改时间","field":"ModifyDate","disabled":true}]
      //]
    formOptions:{
      type:Array,
      default:[]
    },
    ///表单的数据
    formData:{
      type:object,
      default:{}
    }
  },
  data(){
    return{
      ///本组件内置的规则
      rule: {
        //待抽离
        change: ["checkbox", "select", "date", "datetime", "drop", "radio"],//这些类型的设置为change触发校验
        phone: /^[1][3,4,5,6,7,8,9][0-9]{9}$/,
        decimal: /(^[\-0-9][0-9]*(.[0-9]+)?)$/,
        number: /(^[\-0-9][0-9]*([0-9]+)?)$/
      },
      //是输入框的种类
      inputTypeArr: ["text", "string", "mail", "textarea", "password"],
      //所有的类型
      types: {
        int: "number",
        byte: "number",
        decimal: "number", //"float",
        string: "string",
        bool: "boolean",
        datetime: "datetime",
        date: "date",
        mail: "email"
      },

      //错误图片
      errorImg: 'this.src="' + require("@/assets/imgs/error.png") + '"',
    }
  },
  methods: {
    //初始化表单参数 （基本上就是绑定数据源）
    initFormOptions(init) {
      if (this.loadKey) {
        this.initSource();
      }
      //  this.ruleValidate={};
      this.formOptions.forEach((row, xIndex) => {
        if (row.length > this.span) this.span = row.length;

        row.forEach((item, yIndex) => {
          //目前只支持select单选远程搜索，remote远程从后台字典数据源进行搜索，url从指定的url搜索
          if (item.remote || item.url) {
            // item.remoteData = [];
            item.loading = false;
            item.point = { x: xIndex, y: yIndex };
          }
          //初始化上传文件信息
          this.initUpload(item, init);
          //初始化数据源空对象
          if (item.dataKey) {
            //下拉框都强制设置为字符串类型
            item.columnType = "string";
            if (!item.data) {
              item.data = [];
            }
          }
        });
      });
    },
    /// 绑定数据 start   不懂哦 ，待重构
    initSource() {
      let keys = [],
        binds = [];
      //初始化字典数据源
      this.formOptions.forEach(item => {
        item.forEach(x => {
          if (x.dataKey && (!x.data || x.data.length == 0) && !x.remote) {
            // if (!x.data)
            x.data = [];
            binds.push({ key: x.dataKey, data: x.data });
            if (keys.indexOf(x.dataKey) == -1) {
              keys.push(x.dataKey);
            }
          }
        });
      });

      if (keys.length == 0) return;

      //待抽离 待修改
      this.http.post("/api/Sys_Dictionary/GetVueDictionary", keys).then(dic => {
        this.bindOptions(dic, binds);
      });
    },
    bindOptions(dic, binds) {
      dic.forEach(d => {
        binds.forEach(x => {
          if (x.key != d.dicNo) return true;
          //如果有数据的则不查询
          if (x.data.length > 0) return true;
          if (d.data.length > 0 && !d.data[0].hasOwnProperty("key")) {
            let source = d.data,
              newSource = new Array(source.length);
            for (let index = 0; index < source.length; index++) {
              newSource[index] = {
                key: source["key"] + "",
                value: source["value"]
              };
            }
            x.data.push(...newSource);
          } else {
            x.data.push(...d.data);
          }
        });
      });
    },
    /// 绑定数据 end 
    //待了解
    initUpload(item, init) {
      if (!init) return;
      if (
        item.type == "img" ||
        item.columnType == "img" ||
        item.type == "excel" ||
        item.type == "file"
      ) {
        //只是没设置是否自动上传的，默认都是选择文件后自动上传
        if (!item.hasOwnProperty("autoUpload")) {
          item.autoUpload = true;
        }
        if (!item.hasOwnProperty("fileList")) {
          item.fileList = true;
        }
        if (!item.hasOwnProperty("downLoad")) {
          item.downLoad = true;
        }
        if (!item.removeBefore) {
          item.removeBefore = (index, file, files) => {
            return true;
          };
        }
        if (!item.fileClick) {
          item.fileClick = (index, file, files) => {
            return true;
          };
        }
        if (!item.onChange) {
          item.onChange = files => {
            return true;
          };
        }
        if (!item.uploadAfter) {
          item.uploadAfter = (result, files) => {
            return true;
          };
        }
        if (!item.uploadBefore) {
          //  console.log("111");
          item.uploadBefore = files => {
            return true;
          };
        }
      }
    },

    ///根据表单设置参数,获取对应的校验规格
    getRule(item, formData) {
      //用户设置的自定义方法
      if (item.validator && typeof item.validator == "function") {
        return {
          validator: (rule, val, callback) => {
            //用户自定义的方法，如果返回了值，直接显示返回的值，验证不通过
            let message = item.validator(rule, val);
            if (message) return callback(new Error(message + ""));
            return callback();
          },
          required: item.required,
          trigger: this.rule.change.indexOf(item.type) != -1 ? "change" : "blur"
        };
      }

      //设置数字的最大值民最小值
      if (
        item.type == "number" ||
        item.columnType == "number" ||
        item.columnType == "int" ||
        item.type == "decimal"
      ) {
        //如果是必填项的数字，设置一个默认最大与最值小
        if (item.required && typeof item.min != "number") {
          if (item.type == "decimal") {
            item.min = 0.1;
          } else {
            item.min = 1;
          }
        }

        return {
          required: item.required,
          message: item.title,
          title: item.title,
          trigger: "blur",
          min: item.min,
          max: item.max,
          type: item.columnType || item.type,
          validator: (rule, value, callback) => {
            if (!rule.min && !rule.max) {
              if (rule.required) {
                if (value == "") {
                  formData[rule.field] = 0;
                  return callback();
                }
              }
              if (value == "" || value == undefined) return callback();
            }
            if (rule.type == "number") {
              if (!this.rule.number.test(value)) {
                rule.message = rule.title + "只能是整数";
                return callback(new Error(rule.message));
              }
            } else {
              if (!this.rule.decimal.test(value)) {
                rule.message = rule.title + "只能是数字";
                return callback(new Error(rule.message));
              }
            }
            if (
              rule.min != undefined &&
              typeof rule.min == "number" &&
              value < rule.min
            ) {
              rule.message = rule.title + "不能小于" + rule.min;
              return callback(new Error(rule.message));
            }
            if (
              rule.max != undefined &&
              typeof rule.max == "number" &&
              value > rule.max
            ) {
              rule.message = rule.title + "不能大于" + rule.max;
              return callback(new Error(rule.message));
            }
            return callback();
          }
        };
      }

      //手机验证
      if (item.type == "phone") {
        return {
          validator: this.validatorPhone,
          required: item.required,
          trigger: "blur"
        };
      }

      if (item.type == "password") {
        return {
          validator: this.validatorPwd,
          required: item.required,
          trigger: "blur"
        };
      }

      if (!item.required && item.type != "mail") {
        return {
          required: false
        };
      }

      if (!item.hasOwnProperty("type")) {
        item.type = "text";
      }

      //inputTypeArr:['text','string','mail','textarea'],
      if (this.inputTypeArr.indexOf(item.type) != -1) {
        let message =
          item.title +
          (this.types[item.columnType] == "number"
            ? "请输入一个有效的数字"
            : item.type == "mail"
            ? "必须是一个邮箱地址"
            : "不能为空");
        let type = item.type == "mail" ? "email" : this.types[item.columnType];
        let _rule = {
          required: true,
          message: message,
          trigger: "blur",
          type: type
        };
        if (item.type == "mail") {
          _rule.required = item.required;
          return [
            _rule,
            {
              type: type,
              message: message,
              trigger: "blur"
            }
          ];
        }
        if (item.min) {
          _rule.min = item.min;
          _rule.message = item.title + "至少" + item.min + "个字符!";
        }
        if (item.max) {
          return [
            _rule,
            {
              max: item.max,
              required: true,
              message: item.title + "最多" + item.max + "个字符!",
              trigger: "blur"
            }
          ];
        }
        // if (item.min||item.max) {
        //   return [
        //     _rule,
        //     {
        //       min: item.min||0
        //       max: item.max||,
        //       required: true,
        //       message: item.title + "最多" + item.max + "个字符!",
        //       trigger: "blur"
        //     }
        //   ];
        // }

        return _rule;
      }

      if (item.type == "radio") {
        return {
          required: item.required,
          message: "请选择" + item.title,
          trigger: "change",
          type: "string"
        };
      }
      //日期验证还有点问题
      if (item.type == "date" || item.type == "datetime") {
        return {
          // required: true, type:  this.types[item.columnType], message:"请选择" + item.title, trigger: 'change'
          required: true,
          message: "请选择" + item.title,
          trigger: "change",
          type: item.range ? "array" : "string",
          //  type: this.types[item.columnType],
          validator: (rule, val, callback) => {
            //用户自定义的方法，如果返回了值，直接显示返回的值，验证不通过
            if (!val || (item.range && val.length == 0)) {
              return callback(new Error("请选择日期"));
            }
            console.log(val);
            // if (message) return callback(new Error(message + ""));
            return callback();
          }
        };
      }

      //if (item.type == "checkbox" || item.type == "select") {
      if (
        item.type == "select" ||
        item.type == "selectList" ||
        item.type == "drop"
      ) {
        let _rule = {
          required: true,
          message: "请选择" + item.title,
          min: item.min || 1,
          type: "array",
          trigger: "change",
          type: this.types[item.columnType],
          validator: (rule, value, callback) => {
            if (value == undefined || value == "") {
              return callback(new Error(rule.message));
            }
            return callback();
          }
        };

        //    validator: this.validatorPhone,
        if (!item.max) return _rule;
        return [
          _rule,
          {
            message: "最多只能选择" + item.max + "项" + item.title,
            max: item.max,
            type: "array",
            trigger: "change"
          }
        ];
      }
      return {
        required: false
      };
    },
    /// 自定义验证的一些方法 start
    validatorPhone(rule, value, callback) {
      if (!rule.required && !value && value != "0") {
        return callback();
      }
      if (!this.rule.phone.test((value || "").trim())) {
        return callback(new Error("请输入正确的手机号"));
      }
      callback();
    },
    validatorPwd(rule, value, callback) {
      if (!rule.required && !value && value != "0") {
        return callback();
      }
      if ((value + "").trim().length < 6) {
        return callback(new Error("密码长度不能小于6位"));
      }
      callback();
    },
    /// 自定义验证的一些方法 end

    //是否是只读图片
    isReadonlyImgFile(item, formData) {
      if ((item.disabled || item.readonly) && this.isFile(item, formData)) {
        return true;
      }
      return false;
    },
    //是否为图片文件等格式并对字段的转换成数组：[{name:'1.jpg',path:'127.0.0.1/ff/1.jpg'}]
    isFile(item, formData) {
      if (
        item.type == "img" ||
        item.columnType == "img" ||
        item.type == "excel" ||
        item.type == "file"
      ) {
        this.convertFileToArray(item, formData);
        return true;
      }
      return false;
    },
    //转化文件为数组
    convertFileToArray(item, formData) {
      if (!item.maxFile) {
        item.maxFile = 1; //默认只能上传一个文件，可以在onInit中设置
      }

      let fileInfo = formData[item.field];
      if (fileInfo instanceof Array) {
        fileInfo.forEach(x => {
          //hasOwnProperty 方法 判断自身属性是否存在
          if (x.hasOwnProperty("path")) {
            if (x.path && !this.PUBLICTOOL.isUrl(x.path)) {
              //这里修改后死循环?
              // x.path = this.IPADDRESS + x.path;
            }
          }
        });
        return;
      }
      if (fileInfo === null || fileInfo === undefined) {
        formData[item.field] = [];
        return;
      }
      //将以逗号隔开的文件分割成数组127.0.0.1/aa/1.jpg,将127.0.0.1/aa/2.jpg
      if (typeof fileInfo == "string") {
        if (fileInfo.trim() === "") {
          formData[item.field] = [];
          return;
        }
        //如果文件路径是字符串，则使用，拆分
        fileInfo = fileInfo.replace(/\\/g, "/");
        let files = fileInfo.split(",");
        formData[item.field] = [];
        for (let index = 0; index < files.length; index++) {
          let file = files[index];
          let splitFile = file.split("/");
          formData[item.field].push({
            name: splitFile.length > 0 ? splitFile[splitFile.length - 1] : file,
            path: file //this.PUBLICTOOL.isUrl(file) ? file : this.IPADDRESS + file,
          });
        }
      }
    },
    //预览图片
    previewImg(url) {
      this.PUBLICTOOL.previewImg(url, this.IPADDRESS);
    },
    getSrc(path) {
      if (!path) return;
      if (!this.PUBLICTOOL.isUrl(path) && path.indexOf(".") != -1) {
        return this.IPAddress + path;
      }
      return path;
    },
    //下载文件  ：待修改
    dowloadFile(file) {
      this.PUBLICTOOL.dowloadFile(
        file.path,
        file.name,
        {
          Authorization: this.$store.getters.getToken()
        },
        this.IPADDRESS
      );
    },


    getText(formData, item) {
      //2019.10.24修复表单select组件为只读的属性时没有绑定数据源
      let text = formData[item.field];

      //方法，不知道这个有多少用
      if (typeof text == "function") {
        return text(formData);
      }

      if (
        text === "null" ||
        text === "" ||
        text === null ||
        text === undefined
      ) {
        return "--";
      }

      if (!item.data) return text;
      let data = item.data;
      // if (item.data.data) {
      //   data = item.data.data;
      // } else {
      //   data = item.data;
      // }
      data.forEach(x => {
        if (x.key == text) {
          text = x.value;
        }
      });
      return text;
    },
    onClear(item, formData) {
      //远程select标签清空选项
      item.data.splice(0);
      // console.log(2);
    },

    //远程搜索(打开弹出框时应该禁止搜索)
    remoteSearch(item, formData, val) {
      if (
        val == "" ||
        (item.data.length == 1 &&
          (val == item.data[0].key || val == item.data[0].value))
      )
        return;
      //弹出框或初始化表单时给data设置数组默认值
      let url = item.remote
        ? "/api/Sys_Dictionary/GetSearchDictionary"//待抽离
        : item.url;
        this.$set(item, "loading", true);

        //待开发
      // this.http
      //   .post(url + "?dicNo=" + item.dataKey + "&value=" + val)
      //   .then(dicData => {
      //     this.$set(item, "loading", false);
      //     item.data = dicData;
      //     this.formRules[item.point.x].splice(item.point.y, 1, item);
      //   });
    },
    //搜索下拉框 值改变时触发事件
    onRemoteChange(item, value) {
      //第二次打开时，默认值成了undefined，待查viewgrid中重置代码
      if (value == undefined && item.data.length > 0) {
        this.formData[item.field] = item.data[0].key;
        //  console.log('undefined');
      }
      this.remoteCall = false;
      if (item.onChange && typeof item.onChange == "function") {
        item.onChange(value, item);
      }
    },
    getData(item) {
      return item.data;
    },
    onChange(item, value) {
      //是方法就执行change方法
      if (item.onChange && typeof item.onChange == "function") {
        item.onChange(value, item);
      }
    },
    onKeypress(e,item){
      //if(e.keycode==13){
        //回车事件
       if(item.onKeyPress){
         item.onKeyPress(e)
       }
      //}
    },

    //其他  父调用的方法
    reset(sourceObj) {
      //重置表单时，禁用远程查询
      //  this.remoteCall = false;
      this.$refs["formValidate"].resetFields();
      if (!sourceObj) return;
      for (const key in this.formFileds) {
        if (sourceObj.hasOwnProperty(key)) {
          this.formFileds[key] = sourceObj[key];
        }
      }
      //  this.remoteCall = true;
    },
    validate(callback) {
      //表单验证回调方法callback
      let result = false;
      this.$refs["formValidate"].validate(valid => {
        if (!valid) {
          this.$Message.error("数据验证未通过!");
          result = false;
        } else {
          result = true;
        }
        if (result && typeof callback == "function") {
          callback(valid);
        }
      });
      return result;
    },
  },
  created(){
    //先初始化规则
    this.initFormOptions(true);
  },
  watch: {},
}
</script>
