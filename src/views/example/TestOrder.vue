<!-- 测试ktviewtable组件 -->
<!-- Karl -->
<!-- 20200520 -->
<template>
   <div >
     <kt-view-grid
        :table="table"
        :extend="extend"
        :columnsOptions="columnsOptions"
        :editFormData="editFormData"
        :editFormOptions="editFormOptions"
      >
     </kt-view-grid>
   </div>
</template>

<script>
import extend from "@/extension/example/testOrder.js";
import KtViewGrid  from "@/components/basic/KtViewGrid.vue";
var vueParam = {
  components:{
    KtViewGrid
  },
  data(){
    return {
      table: {
          key: 'ID',//该表的主键//排序字段
          footer: "Foots",//
          cnName: '订单',//表中文名
          name: 'TestOrder',//表名(代码生成器的别名)
          url: "/TestOrder/",//(后台控制器)
          sortName: "CreateTime"//后台排序字段
      },
      extend: extend,
      //注意：hidden:true必须要有，不然表结构 改变选择时容易出现bug
      columnsOptions: [{field:'ID',title:'ID',type:'string',width:90,hidden:true,readonly:true,require:true,align:'left'},
                {field:'OrderNo',title:'订单号',type:'string',width:90,require:true,align:'center',sortable:true,hidden:false},
                {field:'Qty',title:'订单数量',type:'string',link:true,width:150,require:true,hidden:false},
                {field:'Remakes',title:'备注',type:'string',width:200,require:true,align:'left',hidden:false},
                {field:'Creator',title:'创建者',type:'int',width:90,readonly:true,require:true,align:'left',click:(row,column,event)=>{console.log(row);console.log(column);console.log(event);this.$message.success(column)},hidden:false},
                {field:'CreateTime',title:'创建时间',type:'datetime',readonly:true,width:90,require:true,align:'left',hidden:false},
                {field:'Modifier',title:'修改者',type:'string',width:120,align:'left',sortable:true,hidden:false},
                {field:'ModifyTime',title:'修改时间',type:'datetime',width:90,align:'left',hidden:false}
                ],
      editFormOptions:[[{"title":"订单号","required":true,"field":"OrderNo","type":"string","createSerialNumberUrl":"/TestOrder/GetOneOrderNo"},
                        {"title":"订单数量","required":true,"field":"Qty"},
                        ],
                      [{"title":"备注","field":"Remakes", "colSize":8,"type":"textarea"}],
                      [{"title":"创建人","field":"Creator","disabled":true},
                        {"title":"创建时间","field":"CreateTime","disabled":true,type:"datetime"}],//是时间类型的要填写，否则按普通的处理
                      [ {"title":"修改者","field":"Modifier","disabled":true}, 
                        {"title":"修改时间","field":"ModifyTime","disabled":true,type:"datetime"}
                      ]],
      editFormData:{"OrderNo":"","Qty":"","Remakes":"","Creator":"","CreateTime":"","Modifier":"","ModifyTime":""},
                
              
    }
  },
};
export default vueParam;
</script>

<style>

</style>
