/*
 *Creater：Karl
 *
 *describe: FlowInstance  vue 扩展js页面 | 代码由框架生成 | 业务请在此处编写
 *builder:  admin
 *build datetime: 2020/10/18 19:50:52
*/
//此处是对表单的方法，组件，权限操作按钮等进行任意扩展(方法扩展可参照 testOrderTwo.js)
import FlowProcess from '@/views/flow/flowCom/FlowProcess.vue'
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
                name: "新的申请",
                icon: "",
                value: "NewFlowInstance",
                class: '',
                type: "success",
                index: 1,
                onClick: function () {
                  this.OpenNewFlowPage();
                }
              },
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
      OpenNewFlowPage() {
        this.$message.error("跳转到新增流程页面");
        let routeData = this.$router.resolve({
          name: "NewFlowInstance",
          query: {
          }
        });
        //window.open(routeData.href, '_blank');
        this.PUBLICTOOL.OpenWindowBlank(routeData.href, res => {
          //this.$refs.table.
          this.search();
        });
      },
      OpenLinkPage(row,column){
          this.$ASC.Show({
            customClass: "dialog-large  dialog-custom-class",////弹窗样式,dialog-full 全屏弹窗 ,dialog-large 大弹窗,
            title: "["+row.Code+"--"+ row.Name+"]--流程进度" ,// 标题
            isShowFoorter: false,//是否需要底部按钮
            closeOnClickModal: false,//是否点击空白背景关闭
            templateType: "TEMPLATE",//组件类型:"URL"或"TEMPLATE"
            template:FlowProcess,
            templateProps: {//模板参数:模板内使用props接收
              //formDesignId: row.ID,
              // pid: pId,
              // flag: flag
            }
          })
            .then(async (val) => {//点击确定后,//val 是组件返回的值
              // ...
              //this.$refs.datagrid.LoadData()
            }).catch((val) => {//点击取消或关闭
              //this.$refs.datagrid.LoadData()
            });
      },
       onInit() {
        
       }
    }
};
export default extension;