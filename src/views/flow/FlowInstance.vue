<!--
 *Creater：Karl
 *
 *describe: FlowInstance  vue主页面 | 代码由框架生成 | 业务请在@/extension/Flow/FlowInstance.js此处编写
 *builder:  admin
 *build datetime: 2020/10/18 19:50:52
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
    import extend from "@/extension/Flow/FlowInstance.js";
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
                    cnName: '工作流流程实例',//表中文名
                    name: 'FlowInstance',//表名
                    url: "/FlowInstance/",//(后台控制器)
                    sortName: "CreateTime"//后台排序字段(默认为CreateTime)
                },
                extend: extend,
                //注意：hidden:true必须要有，不然表结构 改变选择时容易出现bug
                columnsOptions: [
                                 {field:'ID',title:'ID',type:'string',width:120,hidden:true,readonly:true,align:'center',},
                                 {field:'Code',title:'实例编号',type:'string',width:220,hidden:false,align:'center',},
                                 {field:'Name',title:'名称',type:'string',width:220,hidden:false,link:true,align:'center',},
                                 {field:'FlowLevel',title:'等级',type:'int',width:90,hidden:false,align:'center',},
                                 {field:'ActivityId',title:'当前节点ID',type:'string',width:120,hidden:true,align:'center',},
                                 {field:'ActivityType',title:'当前节点类型（0会签节点）',type:'int',width:90,hidden:true,align:'center',},
                                 {field:'ActivityName',title:'当前节点名称',type:'string',width:220,hidden:false,align:'center',},
                                 {field:'PreviousId',title:'前一个节点ID',type:'string',width:120,hidden:false,align:'center',},
                                 {field:'SchemeId',title:'流程设计ID',type:'string',width:120,hidden:true,align:'center',},
                                 {field:'SchemeContent',title:'流程设计模板内容',type:'string',width:90,hidden:true,align:'center',},
                                 {field:'SchemeType',title:'流程类型',type:'int',width:90,hidden:true,align:'center',},
                                 {field:'FormDesignId',title:'表单设计ID',type:'string',width:120,hidden:true,align:'center',},
                                 {field:'FormData',title:'表单数据',type:'string',width:90,hidden:true,align:'center',},
                                 {field:'FormType',title:'表单类型',type:'int',width:90,hidden:true,align:'center',},
                                 {field:'FormContentData',title:'表单中的控件属性描述',type:'string',width:90,hidden:true,align:'center',},
                                 {field:'FormContentParse',title:'表单控件位置模板',type:'string',width:90,hidden:true,align:'center',},
                                 {field:'Enable',title:'是否启动/有效/暂停',type:'int',width:90,hidden:true,align:'center',},
                                 {field:'Remark',title:'备注/描述',type:'string',width:220,hidden:false,align:'center',},
                                 {field:'IsFinish',title:'是否完成',type:'int',bind:{ key:'YesOrNo',data:[]},width:90,hidden:false,align:'center',},
                                 {field:'MakerList',title:'执行人',type:'string',width:90,hidden:true,align:'center',},
                                 {field:'RefID',title:'父ID',type:'string',width:220,hidden:true,align:'center',},
                                 {field:'CreateID',title:'CreateID',type:'string',width:80,hidden:true,align:'center',},
                                 {field:'Creator',title:'创建人',type:'string',width:130,hidden:false,align:'center',},
                                 {field:'CreateTime',title:'创建时间',type:'datetime',width:90,hidden:false,align:'center',},
                                 {field:'ModifyID',title:'ModifyID',type:'string',width:80,hidden:true,align:'center',},
                                 {field:'Modifier',title:'修改人',type:'string',width:130,hidden:true,align:'center',},
                                 {field:'ModifyTime',title:'修改时间',type:'datetime',width:90,hidden:true,align:'center',},
                                 {field:'Status',title:'Status',type:'int',width:90,hidden:true,align:'center',},
                                 {field:'DeleteTime',title:'DeleteTime',type:'datetime',width:90,hidden:true,align:'center',},
                                 {field:'Deleter',title:'Deleter',type:'string',width:180,hidden:true,align:'center',},
                                 {field:'DeleterID',title:'DeleterID',type:'string',width:120,hidden:true,align:'center',},
                                 ],//主table列
                editFormOptions: [[{"title":"实例编号","field":"Code","required":true,"type":"text","disabled":false,"colSize":6,"dataKey":"","range":false},{"title":"名称","field":"Name","required":true,"type":"text","disabled":false,"colSize":6,"dataKey":"","range":false}],[{"title":"等级","field":"FlowLevel","required":false,"type":"number","disabled":false,"colSize":6,"dataKey":"","range":false},{"title":"备注/描述","field":"Remark","required":false,"type":"textarea","disabled":false,"colSize":6,"dataKey":"","range":false}]],//编辑弹框参数
                editFormData: {"ActivityId":"","Code":"","Name":"","FlowLevel":"","Remark":""},//编辑弹框数据
                searchFormOptions: [[{"title":"实例编号","field":"Code","required":false,"type":"like","disabled":false,"colSize":6,"dataKey":"","range":false},{"title":"名称","field":"Name","required":false,"type":"like","disabled":false,"colSize":6,"dataKey":"","range":false},{"title":"等级","field":"FlowLevel","required":false,"type":"number","disabled":false,"colSize":6,"dataKey":"","range":false}],[{"title":"当前节点名称","field":"ActivityName","required":false,"type":"text","disabled":false,"colSize":0,"dataKey":"","range":false},{"title":"是否完成","field":"IsFinish","required":false,"type":"select","disabled":false,"colSize":0,"dataKey":"YesOrNo","range":false}]],//查询form表单的参数
                searchFormData: {"Code":"","Name":"","FlowLevel":"","ActivityName":"","IsFinish":""},//查询form表单的数据
                details: [],//子表
            };
        },
    };

    export default vueParam;
</script>
