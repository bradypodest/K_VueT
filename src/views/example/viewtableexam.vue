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
import extend from "@/extension/example/viewtableexam.js";
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
          cnName: '用户角色',//表中文名
          name: 'SysRole',//表名(代码生成器的别名)
          url: "/SysRole/",//(后台控制器)
          sortName: "CreateTime"//后台排序字段
      },
      extend: extend,
      //注意：hidden:true必须要有，不然表结构 改变选择时容易出现bug
      columnsOptions: [{field:'ID',title:'ID',type:'string',width:90,hidden:true,readonly:true,require:true,align:'left'},
                {field:'RoleID',title:'角色ID',type:'string',width:90,require:true,align:'center',sortable:true,hidden:false},
                {field:'Name',title:'角色名称',type:'string',link:true,width:150,require:true,hidden:false},
                {field:'Description',title:'描述',type:'string',width:200,require:true,align:'left',hidden:false},
                {field:'Creator',title:'创建者',type:'int',width:90,readonly:true,require:true,align:'left',click:(row,column,event)=>{console.log(row);console.log(column);console.log(event);this.$message.success(column)},hidden:false},
                {field:'CreateTime',title:'创建时间',type:'datetime',readonly:true,width:90,require:true,align:'left',hidden:false},
                {field:'Modifier',title:'修改者',type:'string',width:120,align:'left',sortable:true,hidden:false},
                {field:'ModifyTime',title:'修改时间',type:'datetime',width:90,align:'left',hidden:false}
                ],
      editFormOptions:[[{"title":"角色ID","required":true,"field":"RoleID","type":"string"},
                        {"title":"角色名称","required":true,"field":"Name"},
                        ],
                      [{"title":"描述","field":"Description", "colSize":8,"type":"textarea"}],
                      [{"title":"创建人","field":"Creator","disabled":true},
                        {"title":"创建时间","field":"CreateTime","disabled":true,type:"datetime"}],//是时间类型的要填写，否则按普通的处理
                      [ {"title":"修改者","field":"Modifier","disabled":true}, 
                        {"title":"修改时间","field":"ModifyTime","disabled":true,type:"datetime"}
                      ]],
      editFormData:{"RoleID":"","Name":"","Description":"","Creator":"","CreateTime":"","Modifier":"","ModifyTime":""},
                
              
    }
  },
};
export default vueParam;
</script>

<style>

</style>
