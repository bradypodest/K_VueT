<!--  表单组件  -->
<!--  Karl  -->
<!--  2020-05-11  -->
<template>
  <el-form 
    ref="formInput"
    :style="{width:width>0?(width+'px'):'100%'}"
    :model="formData"
    :label-width="labelWidth"
    label-position="right"
    >
    <slot name="header"></slot>
    <el-row type="flex" class="row-bg" justify="space-around"
      v-for="(row,rindex) in formOptions" :key="rindex"
      >
      <el-col v-for="(item,index) in row" :key="index">
        <el-form-item 
          :prop="item.fieldName"
          :label="item.title?(item.title+':'):''"
          :rules="getRule(item,formData)"
          >

          <div v-if="isReadonlyImgFile(item,formData)">
            <!-- 文件图片 -->
            <div v-if="item.type=='img' || item.columnType=='img'" class="form-imgs">
              <div
                class="img-item"
                v-for="(img,imgIndex) in formData[item.fieldName]"
                :key="imgIndex"
              >
                <img :src="getSrc(img.path)" :onerror="errorImg" @click="previewImg(img.path)" />
              </div>
            </div>
            <!-- 不是图片的文件 -->
            <div v-else>
               <div
                class="form-file-list"
                v-for="(file,fileIndex) in formData[item.field]"
                :key="fileIndex"
              >
                <a @click="dowloadFile(formFileds[item.field][fileIndex])">{{file.name}}</a>
              </div>
            </div>
          </div>
          <label v-else-if="item.disabled||item.readonly"  class="readonly-input">
             sssssssssssssssssssss待完成
          </label>
        </el-form-item>
      </el-col>
    </el-row>
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
        //"fieldName":"OrderType",//字段英文名称（就是后台传递到前端） 与表单字段都必须相同
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
        //"colSize":"",//每行列的宽度，可选值:12,8,6,如果是12标签会占100%宽度   算法：item.colSize?item.colSize*2:24/span         span 是你准备分为几行
        //},
      //  {"title":"运单号","required":true,"fieldName":"TranNo"},
      //  {"title":"销售数量","required":true,"fieldName":"Qty","type":"number"}],
      // [{"title":"备注","fieldName":"Remark","colSize":8,"type":"textarea"},
      //  {"title":"销售订单号","required":true,"fieldName":"SellNo"}],
      // [{"title":"创建人","fieldName":"Creator","disabled":true},
      //  {"title":"创建时间","fieldName":"CreateDate","disabled":true},
      //  {"title":"修改时间","fieldName":"ModifyDate","disabled":true}]
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

    ///根据表单设置参数,获取对应的校验规格
    getRule(item, formFileds) {
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
                  formFileds[rule.field] = 0;
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
    //是否是只读图片
    isReadonlyImgFile(item, formFileds) {
      if ((item.disabled || item.readonly) && this.isFile(item, formFileds)) {
        return true;
      }
      return false;
    },
    //是否为图片文件等格式并对字段的转换成数组：[{name:'1.jpg',path:'127.0.0.1/ff/1.jpg'}]
    isFile(item, formFileds) {
      if (
        item.type == "img" ||
        item.columnType == "img" ||
        item.type == "excel" ||
        item.type == "file"
      ) {
        this.convertFileToArray(item, formFileds);
        return true;
      }
      return false;
    },
    //转化文件为数组
    convertFileToArray(item, formFileds) {
      if (!item.maxFile) {
        item.maxFile = 1; //默认只能上传一个文件，可以在onInit中设置
      }

      let fileInfo = formFileds[item.field];
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
        formFileds[item.field] = [];
        return;
      }
      //将以逗号隔开的文件分割成数组127.0.0.1/aa/1.jpg,将127.0.0.1/aa/2.jpg
      if (typeof fileInfo == "string") {
        if (fileInfo.trim() === "") {
          formFileds[item.field] = [];
          return;
        }
        //如果文件路径是字符串，则使用，拆分
        fileInfo = fileInfo.replace(/\\/g, "/");
        let files = fileInfo.split(",");
        formFileds[item.field] = [];
        for (let index = 0; index < files.length; index++) {
          let file = files[index];
          let splitFile = file.split("/");
          formFileds[item.field].push({
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
  }
  
}
</script>
