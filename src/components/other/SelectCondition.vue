<!-- 选择条件 -->
<template>
  <div>
    <el-select v-model="compare.fieldName" placeholder="请选择">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-select v-model="compare.operation" placeholder="请选择">
      <el-option
        v-for="item in operation"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-input v-model="compare.value" placeholder="请输入"></el-input>
    <slot>
    </slot>
  </div>
</template>
<script>
export default {
  props: {
    compare: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      fieldNameOptions: [
        {
          value: "选项1",
          label: "黄金糕",
        },
        {
          value: "选项2",
          label: "双皮奶",
        },
        {
          value: "选项3",
          label: "蚵仔煎",
        },
        {
          value: "选项4",
          label: "龙须面",
        },
        {
          value: "选项5",
          label: "北京烤鸭",
        },
      ],

      options: [
        {
          value: "1",
          label: ">",
        },
        {
          value: "2",
          label: ">=",
        },
        {
          value: "3",
          label: "<",
        },
        {
          value: "4",
          label: "<=",
        },
        {
          value: "5",
          label: "=",
        },
        {
          value: "6",
          label: "!=",
        },
      ],

      
    };
  },
};
</script>
