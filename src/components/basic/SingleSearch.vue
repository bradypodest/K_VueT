<template>
  <div>
    <!-- <Select
      clearable
      v-if="singleSearch.type=='drop'||singleSearch.type=='dropList'||
              singleSearch.type=='select'||singleSearch.type=='selectList'"
      v-model="searchFormFileds[singleSearch.field]"
      :placeholder="'请选择'+singleSearch.title"
    >
      <Option
        v-for="(kv,kvIndex) in singleSearch.data"
        :key="kvIndex"
        :value="kv.key||''"
      >{{kv.value}}</Option>
    </Select> -->

    <!-- <DatePicker
      clearable
      v-else-if="singleSearch.type=='date'||singleSearch.type=='datetime'"
      :type="singleSearch.type+'range'"
      :format="singleSearch.type=='date'? 'yyyy-MM-dd':'yyyy-MM-dd HH:mm:ss'"
      :placeholder="singleSearch.title"
      v-model="searchFormFileds[singleSearch.field]"
    ></DatePicker> -->

    <el-input
      clearable
     
      v-model="searchFormData[singleSearch.field]"
      :placeholder="singleSearch.title"
      @on-keypress="tiggerPress"
    />
  </div>
</template>
<script>
export default {
  props: {
    singleSearch: {
      type: Object,
      default: {}
      /* 参数都是来自于 searchFromOptions 的第一个的数据
      {
        dataKey:  //数据源字典编号(菜单->系统->下拉框绑定中的字典编号)
        dicNo:
        field:'Name' , //字段名称
        title:'名称',//中文显示
        type:'select',//控件类型 渲染的标签类型,可选值,mail、text、textarea、img、checkbox、number、decimal、date、datetime、phone、switch、select、selectList(多选下拉框)、cascader
        data:[] //默认数据 可以手动绑定格式[{key:1,value:'是'}]
      }
      */
    },
    searchFormData: {
      type: Object,
      default: {}
    },
    tiggerPress: {
      type: Function,
      default: () => {}
    }
  }
};
</script>