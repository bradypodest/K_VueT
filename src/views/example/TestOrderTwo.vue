<!-- 测试kteviewtable组件   父子（子多）  -->
<!-- Karl -->
<!-- 20200520 -->
<template>
   <div >
     <kte-view-grid
        :table="table"
        :extend="extend"
        :columnsOptions="columnsOptions"
        :editFormData="editFormData"
        :editFormOptions="editFormOptions"
        :searchFormData="searchFormData"
        :searchFormOptions="searchFormOptions"

        :details=details
      >
     </kte-view-grid>
   </div>
</template>

<script>
import extend from "@/extension/example/testOrderTwo.js";
import KteViewGrid  from "@/components/basic/KteViewGrid.vue";
var vueParam = {
  components:{
    KteViewGrid
  },
  data(){
    return {
      table: {
          key: 'ID',//该表的主键//排序字段
          footer: "Foots",//
          cnName: '订单',//表中文名
          name: 'TestOrderTwo',//表名(代码生成器的别名)
          url: "/TestOrderTwo/",//(后台控制器)
          sortName: "CreateTime"//后台排序字段
      },
      extend: extend,
      //注意：hidden:true必须要有，不然表结构 改变选择时容易出现bug
      columnsOptions: [{field:'ID',title:'ID',type:'string',width:90,hidden:true,readonly:true,require:true,align:'left'},
                {field:'OrderNo',title:'订单号',type:'string',width:90,require:true,align:'center',sortable:true,hidden:false,link:true},
                {field:'OrderDescribe',title:'订单描述',type:'string',width:90,require:true,align:'center',sortable:true,hidden:false},
                {field:'Qty',title:'订单数量',type:'number',width:150,require:true,hidden:false},
                {field:'Remakes',title:'备注',type:'string',width:200,require:true,align:'left',hidden:false},
                {field:'Status',title:'状态',type:'string',width:90,require:true,hidden:false,bind:{ key:'YesOrNo',data:[]}},//switch 还不能使用，等待字典
                {field:'Creator',title:'创建者',type:'int',width:90,readonly:true,require:true,align:'left',click:(row,column,event)=>{console.log(row);console.log(column);console.log(event);this.$message.success(column)},hidden:false},
                {field:'CreateTime',title:'创建时间',type:'datetime',readonly:true,width:100,require:true,align:'left',hidden:false},
                {field:'Modifier',title:'修改者',type:'string',width:120,align:'left',sortable:true,hidden:false},
                {field:'ModifyTime',title:'修改时间',type:'datetime',width:100,align:'left',hidden:false}
                ],
      editFormOptions:[[{"title":"订单号","required":true,"field":"OrderNo","type":"string","valueUrl":"/TestOrder/GetOneOrderNo"},
                        {"title":"订单数量","required":true,"field":"Qty",type:'number'},
                        ],
                        [{"title":"订单描述","required":true,"field":"OrderDescribe","type":"string"}
                        //,{"title":"状态","field":"Status",type:'switch'}
                        ,{"title":"状态","field":"Status",type:'select',dataKey:"YesOrNo"}
                        ],
                      [{"title":"备注","field":"Remakes", "colSize":8,"type":"textarea"}],
                      [{"title":"创建人","field":"Creator","disabled":true},
                        {"title":"创建时间","field":"CreateTime","disabled":true,type:"datetime"}],//是时间类型的要填写，否则按普通的处理
                      [ {"title":"修改者","field":"Modifier","disabled":true}, 
                        {"title":"修改时间","field":"ModifyTime","disabled":true,type:"datetime"}
                      ]],
      editFormData:{"OrderNo":"","Qty":"","OrderDescribe":"","Status":"","Remakes":"","Creator":"","CreateTime":"","Modifier":"","ModifyTime":""},
                // {"title":"创建人","field":"Creator"},
      searchFormData: {"OrderNo":"","Qty":"","Remakes":"","Creator":"","CreateTime":"","ModifyTime":""},
      searchFormOptions:[[{"title":"订单号","field":"OrderNo","type":"like"},{"title":"数量","field":"Qty"},{"title":"备注","field":"Remakes"}],
                         [{"title":"创建人","field":"Creator"},{"title":"创建时间","field":"CreateTime","type":"datetime","range":true},{"title":"修改时间","field":"ModifyTime","type":"datetime","range":true}],
                        ],
      details:[
        {
          tableName:"TestOrderDetail",
          cnName:"订单明细",
          columnsOptions: [{field:'ID',title:'ID',type:'string',width:90,hidden:true,require:true,align:'left'},
                        {field:'OrderID',title:'订单Id',type:'string',width:90,hidden:true,readonly:true,require:true,align:'left',fixed:'left'},
                        {field:'GoodsName',title:'商品名称',type:'string',width:150,edit:{type:'text'},require:true,align:'left',sortable:true,fixed:'left'},
                        {field:'GoodsBatch',title:'商品批次',type:'string',width:100,edit:{type:'text'},require:true,align:'left'},
                        {field:'Qty',title:'数量',type:'int',width:90,edit:{type:'number'},require:true,align:'left'},
                        {field:'Weight',title:'重量',type:'decimal',width:90,edit:{type:'decimal'},align:'left'},
                        {field:'Remarks',title:'备注',type:'string',width:120,edit:{type:'text'},align:'left'},
                        {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                        {field:'Creator',title:'创建人',type:'string',width:130,align:'left'},
                        //{field:'CreateTime',title:'创建时间',type:'datetime',width:90,align:'left',sortable:true},
                        {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                        {field:'Modifier',title:'修改人',type:'string',width:100,align:'left'},
                        //{field:'ModifyTime',title:'修改时间',type:'datetime',width:90,align:'left',sortable:true}
                        ],
          sortName: "CreateTime",
          key:"ID"
        },
        {
          tableName:"TestOrderDetailTwo",
          cnName:"订单明细Two",
          columnsOptions: [{field:'ID',title:'ID',type:'string',width:90,hidden:true,require:true,align:'left'},
                        {field:'OrderID',title:'订单Id',type:'string',width:90,hidden:true,readonly:true,require:true,align:'left',fixed:'left'},
                        {field:'GoodsName',title:'商品名称',type:'string',width:150,edit:{type:'text'},require:true,align:'left',sortable:true,fixed:'left'},
                        {field:'GoodsCode',title:'商品编码',type:'string',width:150,edit:{type:'text'},require:true,align:'left'},
                        {field:'GoodsBatch',title:'商品批次',type:'string',width:100,edit:{type:'text'},require:true,align:'left'},
                        {field:'Qty',title:'数量',type:'int',width:90,edit:{type:'number'},require:true,align:'left'},
                        {field:'Weight',title:'重量',type:'decimal',width:90,edit:{type:'decimal'},align:'left'},
                        {field:'Remarks',title:'备注',type:'string',width:120,edit:{type:'text'},align:'left'},
                        {field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                        {field:'Creator',title:'创建人',type:'string',width:130,align:'left'},
                        //{field:'CreateTime',title:'创建时间',type:'datetime',width:90,align:'left',sortable:true},
                        {field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                        {field:'Modifier',title:'修改人',type:'string',width:100,align:'left'},
                        //{field:'ModifyTime',title:'修改时间',type:'datetime',width:90,align:'left',sortable:true}
                        ],
          sortName: "CreateTime",
          key:"ID"
        }        
      ]  
    }
    
  },
};
export default vueParam;
</script>

<style>

</style>
