///废弃

/// ViewGrid组件的对外参数
let props = {
  table: {//表的配置信息：主键、排序等（可看成页面信息）
    type: Object,
    default: () => {
      return {};
    }
    //   {
    //     key: 'Order_Id',//该表的主键//排序字段
    //     footer: "Foots",//
    //     cnName: '销售订单',//表中文名
    //     name: 'SellOrder',//表名(代码生成器的别名)
    //     url: "/SellOrder/",(后台控制器)
    //     sortName: "CreateDate"//后台排序字段
    //  },
  },

  extend: {//表的扩展方法与组件都合并到此属性中
    type: Object,
    default: () => {
      return {};
      /*
        {
          text:"table扩展文字",
          components:{//动态扩充组件或组件路径
             //如表单header、content、footer对应位置扩充的组件 , 如果有，以这个为最终的组件
             gridHeader:() => import("./SellOrderComponents/GridHeaderExtend.vue"),//{ template: "<div>扩展组xx件</div>" },
          },
          buttons:{//根据需要自行实现扩展按钮
            view:[//kt-ViewGrid查询界面按钮
              {
                name: "点我",
                icon: 'md-create',
                value: 'Edit',
                class: '',
                type: 'error',
                index: 1,//显示的位置
                onClick: function () { //扩展按钮执行事件
                    //this可以获取所有属性，包括this.$refs.gridHeader/gridBody等获取扩展组件对象
                    this.$message("测试扩展按钮");
                    //this.$refs.gridHeader.model = true;
                    // this.getServiceDate();  如这个可以调用下方的扩展方法
                }
              }
            ],
            box:{//新建、编辑弹出框按钮:与上面一致
            },
            detail:{//新建、编辑弹出框明细表table表按钮: 与上面一致                
            }
          },
          methods:{//扩展方法
            getServiceDate() {
                this.http.post("/api/SellOrder/getServiceDate", {}, '正在调用后台数据').then(date => {
                    this.$message.error("从后台获取的服务器时间是：" + date);
                })
            },
            //也可以重写插口方法，如   onInit() 插口            
          }
        }
      */
    }
  },

  columnsOptions: {//主表的配置信息 ：可参考kttable组件的参数
    type: Array,
    default: () => {
      return [];
    }
  },
}

export default props;