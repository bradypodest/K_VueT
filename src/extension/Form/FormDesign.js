/*
 *Creater：Karl
 *
 *describe: FormDesign  vue 扩展js页面 | 代码由框架生成 | 业务请在此处编写
 *builder:  admin
 *build datetime: 2020/10/15 22:26:01
*/
//此处是对表单的方法，组件，权限操作按钮等进行任意扩展(方法扩展可参照 testOrderTwo.js)
import FormBuild from  '@/views/form/FormBuild.vue'
import FormBuildEle from  '@/views/form/ele/FormBuild.vue'
import FormBuildGen from  '@/views/form/formGen/FormBuild.vue'
import FormBuildRender from  '@/views/form/render/FormBuild.vue'
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
  text: "ccccccc",
  buttons: {
    view: [
      {
        name: "设计表单render",
        icon: "",
        value: "Edit",
        class: '',
        type: "info",
        index: 2,
        onClick: function () {
          this.OpenDesignFormPageRender();
        }
      },
      {
        name: "预览表单render",
        icon: "",
        value: "Edit",
        class: '',
        type: "success",
        index: 2,
        onClick: function () {
          let rows = this.$refs.table.getSelected();
          if (rows.length == 0) {
            return this.$message.error("请选择要预览的表单!");
          }
          if (rows.length > 1) {
            this.$message.warning("已选择多个，将默认选择第一个勾选的!");
          }
debugger
          this.$ASC.Show({
            customClass: "dialog-large  dialog-custom-class",////弹窗样式,dialog-full 全屏弹窗 ,dialog-large 大弹窗,
            title: "["+rows[0].FormName+"]--预览表单" ,// 标题
            isShowFoorter: false,//是否需要底部按钮
            closeOnClickModal: false,//是否点击空白背景关闭
            templateType: "TEMPLATE",//组件类型:"URL"或"TEMPLATE"
            template:FormBuildRender,
            templateProps: {//模板参数:模板内使用props接收
              formDesignId: rows[0].ID,
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
        }
      },


      {
        name: "预览表单gen",
        icon: "",
        value: "Edit",
        class: '',
        type: "success",
        index: 1,
        onClick: function () {
          let rows = this.$refs.table.getSelected();
          if (rows.length == 0) {
            return this.$message.error("请选择要预览的表单!");
          }
          if (rows.length > 1) {
            this.$message.warning("已选择多个，将默认选择第一个勾选的!");
          }
debugger
          this.$ASC.Show({
            customClass: "dialog-full dialog-custom-class",////弹窗样式,dialog-full 全屏弹窗 ,dialog-large 大弹窗,
            title: "["+rows[0].FormName+"]--预览表单" ,// 标题
            isShowFoorter: false,//是否需要底部按钮
            closeOnClickModal: false,//是否点击空白背景关闭
            templateType: "TEMPLATE",//组件类型:"URL"或"TEMPLATE"
            template:FormBuildGen,
            templateProps: {//模板参数:模板内使用props接收
              formDesignId: rows[0].ID,
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
        }
      },

      {
        name: "设计表单ele",
        icon: "",
        value: "Edit",
        class: '',
        type: "info",
        index: 2,
        onClick: function () {
          this.OpenDesignFormPageEle();
        }
      },
      {
        name: "预览表单ele",
        icon: "",
        value: "Edit",
        class: '',
        type: "success",
        index: 2,
        onClick: function () {
          let rows = this.$refs.table.getSelected();
          if (rows.length == 0) {
            return this.$message.error("请选择要预览的表单!");
          }
          if (rows.length > 1) {
            this.$message.warning("已选择多个，将默认选择第一个勾选的!");
          }
debugger
          this.$ASC.Show({
            customClass: "dialog-large  dialog-custom-class",////弹窗样式,dialog-full 全屏弹窗 ,dialog-large 大弹窗,
            title: "["+rows[0].FormName+"]--预览表单" ,// 标题
            isShowFoorter: false,//是否需要底部按钮
            closeOnClickModal: false,//是否点击空白背景关闭
            templateType: "TEMPLATE",//组件类型:"URL"或"TEMPLATE"
            template:FormBuildEle,
            templateProps: {//模板参数:模板内使用props接收
              formDesignId: rows[0].ID,
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
        }
      },

      {
        name: "设计表单",
        icon: "",
        value: "Edit",
        class: '',
        type: "info",
        index: 4,
        onClick: function () {
          this.OpenDesignFormPage();
        }
      },
      {
        name: "预览表单",
        icon: "",
        value: "Edit",
        class: '',
        type: "success",
        index: 3,
        onClick: function () {
          let rows = this.$refs.table.getSelected();
          if (rows.length == 0) {
            return this.$message.error("请选择要预览的表单!");
          }
          if (rows.length > 1) {
            this.$message.warning("已选择多个，将默认选择第一个勾选的!");
          }
debugger
          this.$ASC.Show({
            customClass: "dialog-large  dialog-custom-class",////弹窗样式,dialog-full 全屏弹窗 ,dialog-large 大弹窗,
            title: "["+rows[0].FormName+"]--预览表单" ,// 标题
            isShowFoorter: false,//是否需要底部按钮
            closeOnClickModal: false,//是否点击空白背景关闭
            templateType: "TEMPLATE",//组件类型:"URL"或"TEMPLATE"
            template:FormBuild,
            templateProps: {//模板参数:模板内使用props接收
              formDesignId: rows[0].ID,
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
        }
      }
    ],
    box: [],
    detail: [
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
    OpenDesignFormPage() {
      let rows = this.$refs.table.getSelected();
      if (rows.length == 0) {
        return this.$message.error("请选择要设计的表单!");
      }
      if (rows.length > 1) {
        this.$message.warning("已选择多个，将默认选择第一个勾选的!");
      }
      debugger;
      this.$message.error("跳转到设计表单页面");
      let routeData = this.$router.resolve({
        name: "FormDesign",
        query: {
          formDesignId: rows[0].ID,
          formDesignName: rows[0].FormName
        }
      });
      //window.open(routeData.href, '_blank');
      this.PUBLICTOOL.OpenWindowBlank(routeData.href, res => {
        //this.$refs.table.
        this.search();
      });
    },
    OpenDesignFormPageEle() {
      let rows = this.$refs.table.getSelected();
      if (rows.length == 0) {
        return this.$message.error("请选择要设计的表单!");
      }
      if (rows.length > 1) {
        this.$message.warning("已选择多个，将默认选择第一个勾选的!");
      }
      debugger;
      this.$message.error("跳转到设计表单页面");
      let routeData = this.$router.resolve({
        name: "FormDesignEle",
        query: {
          formDesignId: rows[0].ID,
          formDesignName: rows[0].FormName
        }
      });
      //window.open(routeData.href, '_blank');
      this.PUBLICTOOL.OpenWindowBlank(routeData.href, res => {
        //this.$refs.table.
        this.search();
      });
    },
    OpenDesignFormPageRender() {
      let rows = this.$refs.table.getSelected();
      if (rows.length == 0) {
        return this.$message.error("请选择要设计的表单!");
      }
      if (rows.length > 1) {
        this.$message.warning("已选择多个，将默认选择第一个勾选的!");
      }
      debugger;
      this.$message.error("跳转到设计表单页面");
      let routeData = this.$router.resolve({
        name: "FormDesignRender",
        query: {
          formDesignId: rows[0].ID,
          formDesignName: rows[0].FormName
        }
      });
      //window.open(routeData.href, '_blank');
      this.PUBLICTOOL.OpenWindowBlank(routeData.href, res => {
        //this.$refs.table.
        this.search();
      });
    },


    onInit() {

    }
  }
};
export default extension;