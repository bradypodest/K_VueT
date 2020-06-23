<!--
 *Creater：Karl
 *
 *describe: SysDictionary  vue主页面 | 代码由框架生成 | 业务请在@/extension/Dic/SysDictionary.js此处编写
 *builder:  admin
 *build datetime: 2020/6/23 16:00:56
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
    import extend from "@/extension/Dic/SysDictionary.js";
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
                    cnName: '字典',//表中文名
                    name: 'SysDictionary',//表名
                    url: "/SysDictionary/",//(后台控制器)
                    sortName: "CreateTime"//后台排序字段(默认为CreateTime)
                },
                extend: extend,
                //注意：hidden:true必须要有，不然表结构 改变选择时容易出现bug
                columnsOptions: [
                                 {field:'ID',title:'',type:'string',width:180,hidden:true,readonly:true,align:'center',},
                                 {field:'DicNo',title:'编号',type:'string',width:180,hidden:false,align:'center',},
                                 {field:'DicName',title:'名称',type:'string',width:180,hidden:false,align:'center',},
                                 {field:'Enable',title:'是否启动',type:'int',width:90,hidden:false,align:'center',},
                                 {field:'OrderNo',title:'排序',type:'int',width:90,hidden:false,align:'center',},
                                //  {field:'DbSql',title:'sql语句',type:'string',width:90,hidden:true,align:'center',},
                                 {field:'Remark',title:'备注',type:'string',width:220,hidden:true,align:'center',},
                                //  {field:'RefID',title:'父ID',type:'string',width:180,hidden:true,align:'center',},
                                //  {field:'CreateID',title:'创建人ID',type:'string',width:80,hidden:true,align:'center',},
                                 {field:'Creator',title:'创建人',type:'string',width:130,hidden:false,readonly:true,align:'center',},
                                 {field:'CreateTime',title:'创建时间',type:'datetime',width:90,hidden:false,readonly:true,align:'center',},
                                //  {field:'ModifyID',title:'修改人ID',type:'string',width:80,hidden:true,align:'center',},
                                 {field:'Modifier',title:'修改人',type:'string',width:130,hidden:false,readonly:true,align:'center',},
                                 {field:'ModifyTime',title:'修改时间',type:'datetime',width:90,hidden:false,readonly:true,align:'center',},
                                //  {field:'Status',title:'状态',type:'int',width:90,hidden:true,align:'center',},
                                //  {field:'DeleteTime',title:'删除时间',type:'datetime',width:90,hidden:true,align:'center',},
                                //  {field:'Deleter',title:'删除人',type:'string',width:220,hidden:true,align:'center',},
                                //  {field:'DeleterID',title:'删除人ID',type:'string',width:180,hidden:true,align:'center',},
                                 ],//主table列
                editFormOptions: [
                    [
                        {"title":"编号","field":"DicNo","required":true,"type":"text","disabled":false,"colSize":6,"dataSource":"","range":false},
                        {"title":"名称","field":"DicName","required":true,"type":"text","disabled":false,"colSize":6,"dataSource":"","range":false},
                       
                    ],[
                        {"title":"排序","field":"OrderNo","required":false,"type":"number","disabled":false,"colSize":6,"dataSource":"","range":false},
                        {"title":"是否启动","field":"Enable","required":true,"type":"switch","disabled":false,"colSize":6,"dataSource":"","range":false},
                        
                    ],[
                        {"title":"sql语句","field":"DbSql","required":false,"type":"textarea","disabled":false,"colSize":6,"dataSource":"","range":false},
                        {"title":"备注","field":"Remark","required":false,"type":"textarea","disabled":false,"colSize":6,"dataSource":"","range":false}
                    ],[
                        {"title":"父ID","field":"RefID","required":true,"type":"text","disabled":false,"colSize":6,"dataSource":"","range":false}
                    ],[
                        {"title":"创建人","field":"Creator","type":"text","disabled":true,"colSize":6,"dataSource":"","range":false},
                        {"title":"创建时间","field":"CreateTime","type":"datetime","disabled":true,"colSize":6,"dataSource":"","range":false}
                    ],[
                        {"title":"修改人","field":"Modifier","type":"text","disabled":true,"colSize":6,"dataSource":"","range":false},
                        {"title":"修改时间","field":"ModifyTime","type":"datetime","disabled":true,"colSize":6,"dataSource":"","range":false}
                    ]],//编辑弹框参数
                editFormData: {"DicNo":"","DicName":"","Enable":"","OrderNo":"","DbSql":"","Remark":"","RefID":"","Creator":"","CreateTime":"","Modifier":"","ModifyTime":""},//编辑弹框数据
                searchFormOptions: [
                    [
                        {"title":"编号","field":"DicNo","required":false,"type":"like","disabled":false,"colSize":4,"dataSource":"",},
                        {"title":"名称","field":"DicName","required":false,"type":"like","disabled":false,"colSize":4,"dataSource":"",},
                        {"title":"是否启动","field":"Enable","required":false,"type":"text","disabled":false,"colSize":4,"dataSource":"",}
                    ],[
                        {"title":"创建时间","field":"CreateTime","required":false,"type":"datetime","disabled":false,"colSize":4,"dataSource":"","range":true}
                    ]],//查询form表单的参数
                searchFormData: {"DicNo":"","DicName":"","Enable":"","CreateTime":""},//查询form表单的数据
                details: [
                            {
                                tableName:"SysDictionaryList",
                                cnName:"字典明细",
                                columnsOptions: [
                                                {field:'ID',title:'ID',type:'string',width:90,hidden:true,align:'left'},
                                                {field:'RefID',title:'父ID',type:'string',width:90,hidden:true,require:true,align:'left'},
                                                {field:'DicName',title:'数据名称',type:'string',width:90,edit:{type:'text'},hidden:false,require:true,align:'left'},
                                                {field:'DicValue',title:'数据值',type:'string',width:90,edit:{type:'text'},require:true,align:'left'},
                                                {field:'Enable',title:'是否启动',type:'string',width:100,edit:{type:'switch'},require:true,align:'left'},
                                                {field:'OrderNo',title:'排序',type:'string',width:100,edit:{type:'number'},align:'left'},
                                               
                                                {field:'Remark',title:'备注',type:'string',width:120,edit:{type:'textarea'},align:'left'},
                                                //{field:'CreateID',title:'CreateID',type:'int',width:80,hidden:true,align:'left'},
                                                {field:'Creator',title:'创建人',type:'string',width:130,align:'left'},
                                                {field:'CreateTime',title:'创建时间',type:'datetime',width:90,align:'left',sortable:true},
                                                //{field:'ModifyID',title:'ModifyID',type:'int',width:80,hidden:true,align:'left'},
                                                {field:'Modifier',title:'修改人',type:'string',width:100,align:'left'},
                                                {field:'ModifyTime',title:'修改时间',type:'datetime',width:90,align:'left',sortable:true}
                                                ],
                                sortName: "CreateTime",
                                key:"ID"
                            },
                ],//子表
            };
        },
    };

    export default vueParam;
</script>
