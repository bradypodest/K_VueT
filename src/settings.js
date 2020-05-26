
//全局设置
module.exports = {

  title: 'K.VUE',

  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showSettings: true,

  /**
   * @type {boolean} true | false
   * @description Whether need tagsView
   */
  tagsView: true,


  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: true,

  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,

  paginations:{//分页设置
    pageSizes:[3, 60, 100,300,500],
  },

  ignoreResetFields:[//忽略的不重置的字段
    "ID",
    "Creator",
    "CreateTime",
    "Modifier",
    "ModifyTime",
    "Status",
  ],
}
