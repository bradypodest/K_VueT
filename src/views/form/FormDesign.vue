<!--
 *Creater：Karl
 *
 *describe: FormDesign  vue主页面 | 代码由框架生成 | 业务请在@/extension/Form/FormDesign.js此处编写
 *builder:  admin
 *build datetime: 2020/10/15 22:31:55
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
    import extend from "@/extension/Form/FormDesign.js";
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
                    cnName: '表单设计',//表中文名
                    name: 'FormDesign',//表名
                    url: "/FormDesign/",//(后台控制器)
                    sortName: "CreateTime"//后台排序字段(默认为CreateTime)
                },
                extend: extend,
                //注意：hidden:true必须要有，不然表结构 改变选择时容易出现bug
                columnsOptions: [
                                 {field:'ID',title:'ID',type:'string',width:120,hidden:true,readonly:true,align:'center',},
                                 {field:'FormName',title:'表单名称',type:'string',width:300,hidden:false,link:true,align:'center',},
                                 {field:'FormType',title:'表单类型',type:'int',bind:{ key:'FormType',data:[]},width:150,hidden:false,align:'center',},
                                 {field:'WebId',title:'系统页面标识',type:'string',width:120,hidden:true,align:'center',},
                                 {field:'FieIds',title:'字段个数',type:'int',width:90,hidden:false,align:'center',},
                                 {field:'ContentData',title:'表单中的控件属性描述',type:'string',width:350,hidden:false,align:'center',},
                                 {field:'HtmlContent',title:'表单Html代码',type:'string',width:90,hidden:true,readonly:true,align:'center',},
                                 {field:'JsonContent',title:'Json表单代码',type:'string',width:90,hidden:true,readonly:true,align:'center',},
                                 {field:'Enable',title:'是否启用',type:'int',bind:{ key:'YesOrNo',data:[]},width:90,hidden:false,align:'center',},
                                 {field:'OrderNo',title:'排序',type:'int',width:90,hidden:true,align:'center',},
                                 {field:'Remark',title:'备注',type:'string',width:350,hidden:false,align:'center',},
                                 {field:'RefID',title:'父Id',type:'string',width:220,hidden:true,align:'center',},
                                 {field:'CreateID',title:'CreateID',type:'string',width:80,hidden:true,align:'center',},
                                 {field:'Creator',title:'创建人',type:'string',width:130,hidden:false,readonly:true,align:'center',},
                                 {field:'CreateTime',title:'创建时间',type:'datetime',width:90,hidden:false,readonly:true,align:'center',},
                                 {field:'ModifyID',title:'ModifyID',type:'string',width:80,hidden:true,readonly:true,align:'center',},
                                 {field:'Modifier',title:'修改人',type:'string',width:130,hidden:true,readonly:true,align:'center',},
                                 {field:'ModifyTime',title:'修改时间',type:'datetime',width:90,hidden:true,readonly:true,align:'center',},
                                 {field:'Status',title:'Status',type:'int',width:90,hidden:true,align:'center',},
                                 {field:'DeleteTime',title:'DeleteTime',type:'datetime',width:90,hidden:true,align:'center',},
                                 {field:'Deleter',title:'Deleter',type:'string',width:180,hidden:true,align:'center',},
                                 {field:'DeleterID',title:'DeleterID',type:'string',width:120,hidden:true,align:'center',},
                                 ],//主table列
                editFormOptions: [[{"title":"表单名称","field":"FormName","required":true,"type":"text","disabled":false,"colSize":6,"dataKey":"","range":false},{"title":"表单类型","field":"FormType","required":true,"type":"select","disabled":false,"colSize":6,"dataKey":"FormType","range":false}],[{"title":"字段个数","field":"FieIds","required":false,"type":"number","disabled":false,"colSize":6,"dataKey":"","range":false},{"title":"是否启用","field":"Enable","required":true,"type":"switch","disabled":false,"colSize":6,"dataKey":"YesOrNo","range":false}],[{"title":"表单中的控件属性描述","field":"ContentData","required":false,"type":"textarea","disabled":false,"colSize":12,"dataKey":"","range":false}],[{"title":"表单Html代码","field":"HtmlContent","required":false,"type":"textarea","disabled":true,"colSize":12,"dataKey":"","range":false}],[{"title":"Json表单代码","field":"JsonContent","required":false,"type":"textarea","disabled":true,"colSize":12,"dataKey":"","range":false}],[{"title":"备注","field":"Remark","required":false,"type":"textarea","disabled":false,"colSize":12,"dataKey":"","range":false}],
                [{"title":"创建人","field":"Creator","required":false,"type":"text","disabled":true,"colSize":6,"dataKey":"","range":false},{"title":"创建时间","field":"CreateTime","required":false,"type":"datetime","disabled":true,"colSize":6,"dataKey":"","range":false}],
                [{"title":"修改人","field":"Modifier","required":false,"type":"text","disabled":true,"colSize":6,"dataKey":"","range":false},{"title":"修改时间","field":"ModifyTime","required":false,"type":"datetime","disabled":true,"colSize":6,"dataKey":"","range":false}]],//编辑弹框参数
                editFormData: {"FormName":"","FormType":"","FieIds":"","Enable":"","ContentData":"","HtmlContent":"","JsonContent":"","Remark":"","Creator":"","CreateTime":"","Modifier":"","ModifyTime":""},//编辑弹框数据
                searchFormOptions: [[{"title":"表单名称","field":"FormName","required":false,"type":"like","disabled":false,"colSize":6,"dataKey":"","range":false},{"title":"表单类型","field":"FormType","required":false,"type":"select","disabled":false,"colSize":6,"dataKey":"FormType","range":false},{"title":"是否启用","field":"Enable","required":false,"type":"select","disabled":false,"colSize":6,"dataKey":"YesOrNo","range":false}]],//查询form表单的参数
                searchFormData: {"FormName":"","FormType":"","Enable":""},//查询form表单的数据
                details: [],//子表
            };
        },
    };

    export default vueParam;
</script>
