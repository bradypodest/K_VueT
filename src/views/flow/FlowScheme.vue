<!--
 *Creater：Karl
 *
 *describe: FlowScheme  vue主页面 | 代码由框架生成 | 业务请在@/extension/Flow/FlowScheme.js此处编写
 *builder:  admin
 *build datetime: 2020/10/17 21:43:17
 -->
    <template>
        <div>
            <kte-view-grid 
                :table="table"
                :extend="extend"
                :columnsOptions="columnsOptions"
                :editFormData="editFormData"
                :editFormOptions="editFormOptions"
                :searchFormData="searchFormData"
                :searchFormOptions="searchFormOptions"
                :details=details>
            </kte-view-grid>
        </div>
    </template>

<script>
    import extend from "@/extension/Flow/FlowScheme.js";
    import KteViewGrid from "@/components/basic/KteViewGrid.vue";
    var vueParam = {
        components: {
            KteViewGrid
        },
        data() {
            return {
                table: {
                    key: 'ID',//该表的主键//排序字段(默认为ID)
                    footer: "Foots",//
                    cnName: ' 工作流模板信息',//表中文名
                    name: 'FlowScheme',//表名
                    url: "/FlowScheme/",//(后台控制器)
                    sortName: "CreateTime"//后台排序字段(默认为CreateTime)
                },
                extend: extend,
                //注意：hidden:true必须要有，不然表结构 改变选择时容易出现bug
                columnsOptions: [
                                 {field:'ID',title:'ID',type:'string',width:120,hidden:true,readonly:true,align:'center',},
                                 {field:'SchemeCode',title:'流程编号',type:'string',width:120,hidden:false,align:'center',},
                                 {field:'SchemeName',title:'流程名称',type:'string',width:220,hidden:false,link:true,align:'center',},
                                 {field:'SchemeType',title:'流程分类',type:'int',bind:{ key:'SchemeType',data:[]},width:90,hidden:false,align:'center',},
                                 {field:'SchemeVersion',title:'流程内容版本',type:'string',width:120,hidden:true,align:'center',},
                                 {field:'SchemeCanUser',title:'流程模板使用者',type:'string',width:220,hidden:true,align:'center',},
                                 {field:'SchemeContent',title:'流程内容',type:'string',width:90,hidden:true,align:'center',},
                                 {field:'FormDesignId',title:'表单ID',type:'string',bind:{ key:'FromDesign',data:[]},width:220,hidden:false,align:'center',},
                                 {field:'FormType',title:'表单类型',type:'int',width:90,hidden:true,align:'center',},
                                 {field:'AuthorizeType',title:'模板权限',type:'int',bind:{ key:'FlowPowerType',data:[]},width:90,hidden:true,align:'center',},
                                 {field:'OrderNo',title:'排序',type:'int',width:90,hidden:false,align:'center',},
                                 {field:'Enable',title:'是否启动',type:'int',width:90,hidden:false,align:'center',},
                                 {field:'Remark',title:'描述/备注',type:'string',width:300,hidden:false,align:'center',},
                                 {field:'RefID',title:'父ID',type:'string',width:220,hidden:true,align:'center',},
                                 {field:'CreateID',title:'CreateID',type:'string',width:80,hidden:true,align:'center',},
                                 {field:'Creator',title:'创建人',type:'string',width:130,hidden:false,readonly:true,align:'center',},
                                 {field:'CreateTime',title:'创建时间',type:'datetime',width:90,hidden:false,readonly:true,align:'center',},
                                 {field:'ModifyID',title:'ModifyID',type:'string',width:80,hidden:true,align:'center',},
                                 {field:'Modifier',title:'修改人',type:'string',width:130,hidden:true,readonly:true,align:'center',},
                                 {field:'ModifyTime',title:'修改时间',type:'datetime',width:90,hidden:true,readonly:true,align:'center',},
                                 {field:'Status',title:'Status',type:'int',width:90,hidden:true,align:'center',},
                                 {field:'DeleteTime',title:'DeleteTime',type:'datetime',width:90,hidden:true,align:'center',},
                                 {field:'Deleter',title:'Deleter',type:'string',width:180,hidden:true,align:'center',},
                                 {field:'DeleterID',title:'DeleterID',type:'string',width:120,hidden:true,align:'center',},
                                 ],//主table列
                editFormOptions: [[{"title":"流程编号","field":"SchemeCode","required":true,"type":"text","disabled":false,"colSize":6,"dataKey":"","range":false},{"title":"流程名称","field":"SchemeName","required":true,"type":"text","disabled":false,"colSize":6,"dataKey":"","range":false}],[{"title":"流程分类","field":"SchemeType","required":true,"type":"select","disabled":false,"colSize":6,"dataKey":"SchemeType","range":false},{"title":"流程内容版本","field":"SchemeVersion","required":false,"type":"decimal","disabled":false,"colSize":6,"dataKey":"","range":false}],[{"title":"表单ID","field":"FormDesignId","required":true,"type":"select","disabled":false,"colSize":6,"dataKey":"FromDesign","range":false},{"title":"模板权限","field":"AuthorizeType","required":true,"type":"select","disabled":false,"colSize":6,"dataKey":"FlowPowerType","range":false}],[{"title":"排序","field":"OrderNo","required":false,"type":"number","disabled":false,"colSize":6,"dataKey":"","range":false},{"title":"是否启动","field":"Enable","required":true,"type":"switch","disabled":false,"colSize":6,"dataKey":"","range":false}],[{"title":"描述/备注","field":"Remark","required":false,"type":"textarea","disabled":false,"colSize":12,"dataKey":"","range":false}],[{"title":"创建人","field":"Creator","required":false,"type":"text","disabled":true,"colSize":6,"dataKey":"","range":false},{"title":"创建时间","field":"CreateTime","required":false,"type":"datetime","disabled":true,"colSize":6,"dataKey":"","range":false}],[{"title":"修改人","field":"Modifier","required":false,"type":"text","disabled":true,"colSize":6,"dataKey":"","range":false},{"title":"修改时间","field":"ModifyTime","required":false,"type":"datetime","disabled":true,"colSize":6,"dataKey":"","range":false},],
                //[{"title":"流程内容","field":"SchemeContent","required":false,"type":"textarea","disabled":true,"colSize":6,"dataKey":"","range":false,}]
                ],//编辑弹框参数
                editFormData: {"SchemeCode":"","SchemeName":"","SchemeType":"","SchemeVersion":"","FormDesignId":"","AuthorizeType":"","OrderNo":"","Enable":"","Remark":"","Creator":"","CreateTime":"","Modifier":"","ModifyTime":"","SchemeContent":""},//编辑弹框数据
                searchFormOptions: [[{"title":"流程编号","field":"SchemeCode","required":false,"type":"like","disabled":false,"colSize":6,"dataKey":"","range":false},{"title":"流程名称","field":"SchemeName","required":false,"type":"like","disabled":false,"colSize":6,"dataKey":"","range":false},{"title":"流程分类","field":"SchemeType","required":false,"type":"select","disabled":false,"colSize":6,"dataKey":"SchemeType","range":false}]],//查询form表单的参数
                searchFormData: {"SchemeCode":"","SchemeName":"","SchemeType":""},//查询form表单的数据
                details: [],//子表
            };
        },
    };

    export default vueParam;
</script>
