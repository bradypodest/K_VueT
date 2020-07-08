<!--
 *Creater：Karl
 *
 *describe: SysUser  vue主页面 | 代码由框架生成 | 业务请在@/extension/User/SysUser.js此处编写
 *builder:  string
 *build datetime: 2020-07-07 14:59:18
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
    import extend from "@/extension/User/SysUser.js";
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
                    cnName: '用户',//表中文名
                    name: 'SysUser',//表名
                    url: "/SysUser/",//(后台控制器)
                    sortName: "CreateTime"//后台排序字段(默认为CreateTime)
                },
                extend: extend,
                //注意：hidden:true必须要有，不然表结构 改变选择时容易出现bug
                columnsOptions: [
                                 {field:'ID',title:'ID',type:'string',width:120,hidden:true,readonly:true,align:'center',},
                                 {field:'UserName',title:'用户名',type:'string',width:120,hidden:false,align:'center',lookRole:'Admin'},
                                //  {field:'UserPwd',title:'用户密码',type:'string',width:180,hidden:false,align:'center',},
                                 {field:'RoleId',title:'角色ID',type:'string',width:120,hidden:false,align:'center',},//这里没有使用生成页面的代码
                                 {field:'RoleName',title:'角色名称',type:'string',width:180,hidden:false,align:'center',},
                                 {field:'LastLoginDate',title:'LastLoginDate',type:'datetime',width:90,hidden:true,align:'center',},
                                 {field:'LastModifyPwdDate',title:'LastModifyPwdDate',type:'datetime',width:90,hidden:true,align:'center',},
                                 {field:'ErrorCount',title:'ErrorCount',type:'int',width:90,hidden:true,align:'center',},
                                 {field:'LastLoginFailDate',title:'LastLoginFailDate',type:'datetime',width:90,hidden:true,align:'center',},
                                 {field:'HeadPicUrl',title:'头像',type:'string',width:180,hidden:false,align:'center',},
                                 {field:'Sex',title:'性别',type:'string',width:120,hidden:true,bind:{key:'Gender',data:[]} ,align:'center',},
                                 {field:'Age',title:'年龄',type:'int',width:90,hidden:true,align:'center',},
                                 {field:'Birth',title:'出生日期',type:'datetime',width:90,hidden:false,align:'center',},
                                 {field:'Address',title:'地址',type:'string',width:220,hidden:false,align:'center',},
                                 {field:'Mobile',title:'电话',type:'string',width:120,hidden:false,align:'center',},
                                 {field:'Email',title:'邮箱',type:'string',width:120,hidden:true,align:'center',},
                                 {field:'Remark',title:'备注',type:'string',width:220,hidden:false,align:'center',},
                                 {field:'CreateID',title:'CreateID',type:'string',width:80,hidden:true,align:'center',},
                                 {field:'Creator',title:'创建人',type:'string',width:130,hidden:false,align:'center',},
                                 {field:'CreateTime',title:'创建时间',type:'datetime',width:90,hidden:false,align:'center',},
                                 {field:'ModifyID',title:'ModifyID',type:'string',width:80,hidden:true,align:'center',},
                                 {field:'Modifier',title:'修改人',type:'string',width:130,hidden:false,align:'center',},
                                 {field:'ModifyTime',title:'修改时间',type:'datetime',width:90,hidden:false,align:'center',},
                                 {field:'Status',title:'Status',type:'int',width:90,hidden:true,align:'center',},
                                 {field:'DeleteTime',title:'DeleteTime',type:'datetime',width:90,hidden:true,align:'center',},
                                 {field:'Deleter',title:'Deleter',type:'string',width:180,hidden:true,align:'center',},
                                 {field:'DeleterID',title:'DeleterID',type:'string',width:120,hidden:true,align:'center',},
                                 ],//主table列
                editFormOptions: [
                    [
                        {"title":"用户名","field":"UserName","required":true,"type":"text","disabled":false,"colSize":12,"range":false}
                    ],[
                        {"title":"用户密码","field":"UserPwd","required":true,"type":"text","disabled":false,"colSize":12,"range":false}
                    ],[
                        {"title":"角色ID","field":"RoleId","required":false,"type":"select","disabled":false,"colSize":12,"range":false,dataKey:"AllRole"}
                    ],[
                        {"title":"头像","field":"HeadPicUrl","required":false,"type":"text","disabled":false,"colSize":12,"range":false}
                    ],[
                        {"title":"性别","field":"Sex","required":false,"type":"select",dataKey:"Gender", "disabled":false,"colSize":12,"range":false}
                    ],[
                        {"title":"年龄","field":"Age","required":false,"type":"text","disabled":false,"colSize":12,"range":false}
                    ],[
                        {"title":"出生日期","field":"Birth","required":false,"type":"datetime","disabled":false,"colSize":12,"range":false}
                    ],[
                        {"title":"地址","field":"Address","required":false,"type":"textarea","disabled":false,"colSize":12,"range":false}
                    ],[
                        {"title":"电话","field":"Mobile","required":false,"type":"phone","disabled":false,"colSize":12,"range":false}
                    ],[
                        {"title":"邮箱","field":"Email","required":false,"type":"mail","disabled":false,"colSize":12,"range":false}
                    ],[
                        {"title":"备注","field":"Remark","required":false,"type":"textarea","disabled":false,"colSize":12,"range":false}
                    ]],//编辑弹框参数
                editFormData: {"UserName":"","UserPwd":"","RoleId":"","RoleName":"","HeadPicUrl":"","Sex":"","Age":"","Birth":"","Address":"","Mobile":"","Email":"","Remark":""},//编辑弹框数据
                searchFormOptions: [
                    [
                        {"title":"用户名","field":"UserName","required":false,"type":"text","disabled":false,"colSize":12,"range":false},
                        {"title":"性别","field":"Sex","required":false,"type":"select","disabled":false,"colSize":12,"range":false,dataKey:"Gender"},
                        {"title":"电话","field":"Mobile","required":false,"type":"like","disabled":false,"colSize":12,"range":false}
                    ],[
                        {"title":"出生日期","field":"Birth","required":false,"type":"datetime","disabled":false,"colSize":4,"range":true}
                    ]],//查询form表单的参数
                searchFormData: {"UserName":"","Sex":"","Mobile":"","Birth":""},//查询form表单的数据
                details: [],//子表
            };
        },
    };

    export default vueParam;
</script>
