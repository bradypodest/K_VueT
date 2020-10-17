/*
 *Creater：Karl
 *
 *describe: FormDesign  vue 扩展js页面 | 代码由框架生成 | 业务请在此处编写
 *builder:  admin
 *build datetime: 2020/10/15 22:26:01
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
            view: [
              {
                name:"设计表单",
                icon:"",
                value:"Edit",
                class:'',
                type:"success",
                index:1,
                onClick:function(){
                    this.OpenDesignFormPage();
                }
              }
            ],
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
        OpenDesignFormPage(){
          let rows = this.$refs.table.getSelected();
          if (rows.length == 0) {
            return this.$message.error("请选择要设计的表单!");
          }
          if (rows.length > 1) {
            this.$message.warning("已选择多个，将默认第一个!");
          }
          debugger;
          this.$message.error("跳转到设计表单页面");
          let routeData = this.$router.resolve({
            name: "FormDesign",
            query: {
              formDesignId:rows[0].ID,
              formDesignName:rows[0].FormName
            }
          });
          //window.open(routeData.href, '_blank');
          this.PUBLICTOOL.OpenWindowBlank(routeData.href,res=>{
            //this.$refs.table.
            this.search();
          });
        },


       onInit() {
        
       }
    }
};
export default extension;