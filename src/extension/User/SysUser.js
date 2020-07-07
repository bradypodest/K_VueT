/*
 *Creater：Karl
 *
 *describe: SysUser  vue 扩展js页面 | 代码由框架生成 | 业务请在此处编写
 *builder:  string
 *build datetime: 2020-07-07 13:43:14
*/
//此处是对表单的方法，组件，权限操作按钮等进行任意扩展(方法扩展可参照 testOrderTwo.js)
let extension = {
    components: {//动态扩充组件或组件路径
        //表单header、content、footer对应位置扩充的组件
        //gridHeader:'',//{ template: "<div>扩展组xx件</div>" },
        //gridBody: '',
        //gridFooter: '',
        //弹出框(修改、编辑、查看)header、content、footer对应位置扩充的组件
        //modelHeader: '',
        //modelBody: '',
        //modelFooter: ''
    },
    text:"ccccccc",
    buttons: {
            view: [],
            box:[],
            detail:[
                /*  多子表
                    {
                    tableName:"TestOrderDetail",
                    btns:[ //ViewGrid查询界面按钮
                        {
                            name: "点我2",
                            icon: 'md-create',
                            value: 'Edit',
                            class: '',
                            type: 'success',
                            index: 1,//显示的位置
                            onClick: function () {
                                this.$message.error("扩展的明细table按钮,可设置index值指定显示位置");
                            }
                        }
                    ]
                 },
                */

              ]
    },//扩展的按钮
    methods: {//事件扩展  一些插口方法都可以重写
       
       onInit() {
          //给角色 编辑数据 加 选择事件
          var that=this;
          this.editFormOptions.forEach(x => {
              x.forEach(y=>{
                debugger
                if(y.field=="RoleId"){
                  y.onChange=(roleData,nowHang)=>{
                    debugger
                      if(!roleData) return;

                      var selectRole= y.data.filter(z=>z.key==roleData);
                      if(!selectRole) return;
                      //找到editdata里面的
                      if(selectRole&&selectRole.length>0)
                        this.editFormData["RoleName"]=selectRole[0].value;
                  }
              }

              })
              
          });
       }
    }
};
export default extension;