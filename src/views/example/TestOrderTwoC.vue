<!--
 *Creater：Karl
 *
 *describe: TestOrderTwo  vue主页面 | 代码由框架生成 | 业务请在@/extension/Test/TestOrderTwo.js此处编写
 *builder:  admin
 *build datetime: 2020-07-08 18:44:21
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
      :details="details"
    ></kte-view-grid>
  </div>
</template>

<script>
import extend from "@/extension/Test/TestOrderTwo.js";
import KteViewGrid from "@/components/basic/KteViewGrid.vue";
var vueParam = {
  components: {
    KteViewGrid
  },
  data() {
    return {
      table: {
        key: "ID", //该表的主键//排序字段(默认为ID)
        footer: "Foots", //
        cnName: "测试订单Two", //表中文名
        name: "TestOrderTwo", //表名
        url: "/TestOrderTwo/", //(后台控制器)
        sortName: "CreateTime" //后台排序字段(默认为CreateTime)
      },
      extend: extend,
      //注意：hidden:true必须要有，不然表结构 改变选择时容易出现bug
      columnsOptions: [
        {
          field: "ID",
          title: "ID",
          type: "string",
          width: 120,
          hidden: true,
          readonly: true,
          align: "center"
        },
        {
          field: "OrderNo",
          title: "订单号",
          type: "string",
          width: 90,
          hidden: false,
          lookRole: "Admin",
          link: true,
          align: "center"
        },
        {
          field: "OrderDescribe",
          title: "订单描述",
          type: "string",
          width: 220,
          hidden: false,
          lookRole: "TestJeez",
          align: "center"
        },
        {
          field: "Qty",
          title: "数量",
          type: "int",
          width: 90,
          hidden: false,
          align: "center"
        },
        {
          field: "Remakes",
          title: "Remakes",
          type: "string",
          width: 220,
          hidden: false,
          align: "center"
        },
        {
          field: "CreateID",
          title: "CreateID",
          type: "string",
          width: 80,
          hidden: true,
          align: "center"
        },
        {
          field: "Creator",
          title: "创建人",
          type: "string",
          width: 130,
          hidden: false,
          align: "center"
        },
        {
          field: "CreateTime",
          title: "创建时间",
          type: "datetime",
          width: 90,
          hidden: false,
          align: "center"
        },
        {
          field: "ModifyID",
          title: "ModifyID",
          type: "string",
          width: 80,
          hidden: true,
          align: "center"
        },
        {
          field: "Modifier",
          title: "Modifier",
          type: "string",
          width: 130,
          hidden: false,
          align: "center"
        },
        {
          field: "ModifyTime",
          title: "修改时间",
          type: "datetime",
          width: 90,
          hidden: false,
          align: "center"
        },
        {
          field: "Status",
          title: "Status",
          type: "int",
          width: 90,
          hidden: true,
          align: "center"
        },
        {
          field: "DeleteTime",
          title: "DeleteTime",
          type: "datetime",
          width: 90,
          hidden: true,
          align: "center"
        },
        {
          field: "Deleter",
          title: "Deleter",
          type: "string",
          width: 180,
          hidden: true,
          align: "center"
        },
        {
          field: "DeleterID",
          title: "DeleterID",
          type: "string",
          width: 120,
          hidden: true,
          align: "center"
        }
      ], //主table列
      editFormOptions: [
        [
          {
            title: "订单号",
            field: "OrderNo",
            required: true,
            type: "text",
            disabled: false,
            colSize: 6,
            dataKey: "",
            range: false
          },
          {
            title: "数量",
            field: "Qty",
            required: true,
            type: "number",
            disabled: false,
            colSize: 6,
            dataKey: "",
            range: false
          }
        ]
      ], //编辑弹框参数
      editFormData: { OrderNo: "", Qty: "", OrderDescribe: "" }, //编辑弹框数据
      searchFormOptions: [
        [
          {
            title: "订单号",
            field: "OrderNo",
            required: false,
            type: "text",
            disabled: false,
            colSize: 6,
            dataKey: "",
            range: false
          },
          {
            title: "创建时间",
            field: "CreateTime",
            required: false,
            type: "datetime",
            disabled: false,
            colSize: 0,
            dataKey: "",
            range: true
          }
        ]
      ], //查询form表单的参数
      searchFormData: { OrderNo: "", CreateTime: "" }, //查询form表单的数据
      details: [
        {
          tableName: "TestOrderDetail",
          cnName: "测试详情",
          sortName: "CreateTime",
          columnsOptions: [
            {
              field: "Weight",
              title: "重量",
              type: "float",
              width: "90",
              hidden: false,
              edit: { type: "decimal" },
              require: true,
              align: "center"
            },
            {
              field: "ID",
              title: "ID",
              type: "string",
              width: "120",
              hidden: true,
              require: true,
              align: "center"
            },
            {
              field: "CreateTime",
              title: "创建时间",
              type: "DateTime",
              width: "90",
              hidden: false,
              require: true,
              align: "center"
            },
            {
              field: "Creator",
              title: "创建人",
              type: "string",
              width: "130",
              hidden: false,
              require: true,
              align: "center"
            },
            {
              field: "Status",
              title: "",
              type: "int",
              width: "90",
              hidden: false,
              require: true,
              align: "center"
            },
            {
              field: "Qty",
              title: "",
              type: "int",
              width: "90",
              hidden: false,
              require: true,
              align: "center"
            },
            {
              field: "Modifier",
              title: "修改人",
              type: "string",
              width: "130",
              hidden: false,
              align: "center"
            },
            {
              field: "GoodsName",
              title: "产品名称",
              type: "string",
              width: "90",
              hidden: false,
              edit: { type: "text" },
              require: true,
              lookRole: "Admin",
              align: "center"
            },
            {
              field: "Deleter",
              title: "",
              type: "string",
              width: "180",
              hidden: false,
              align: "center"
            },
            {
              field: "DeleteTime",
              title: "",
              type: "DateTime",
              width: "90",
              hidden: false,
              align: "center"
            },
            {
              field: "ModifyID",
              title: "",
              type: "string",
              width: "80",
              hidden: true,
              align: "center"
            },
            {
              field: "RefID",
              title: "关联父ID",
              type: "string",
              width: "90",
              hidden: false,
              require: true,
              align: "center"
            },
            {
              field: "ModifyTime",
              title: "修改时间",
              type: "DateTime",
              width: "90",
              hidden: false,
              align: "center"
            },
            {
              field: "DeleterID",
              title: "",
              type: "string",
              width: "120",
              hidden: false,
              align: "center"
            },
            {
              field: "CreateID",
              title: "",
              type: "string",
              width: "80",
              hidden: true,
              require: true,
              align: "center"
            },
            {
              field: "GoodsBatch",
              title: "产品批号",
              type: "string",
              width: "90",
              hidden: false,
              edit: { type: "text" },
              require: true,
              bind: { key: "AllDic", data: [] },
              align: "center"
            },
            {
              field: "Remarks",
              title: "备注",
              type: "string",
              width: "220",
              hidden: false,
              edit: { type: "textarea" },
              align: "center"
            }
          ],
          key: "ID"
        },
        {
          tableName: "TestOrderDetailTwo",
          cnName: "测试详情Two",
          sortName: "CreateTime",
          columnsOptions: [
            {
              field: "GoodsCode",
              title: "产品编码",
              type: "string",
              width: "90",
              hidden: false,
              edit: { type: "select" },
              require: true,
              bind: { key: "AllRole", data: [] },
              align: "center"
            },
            {
              field: "DeleteTime",
              title: "",
              type: "DateTime",
              width: "90",
              hidden: true,
              align: "center"
            },
            {
              field: "GoodsName",
              title: "产品名称",
              type: "string",
              width: "90",
              hidden: false,
              edit: { type: "text" },
              require: true,
              lookRole: "TestJeez",
              align: "center"
            },
            {
              field: "CreateID",
              title: "",
              type: "string",
              width: "80",
              hidden: true,
              require: true,
              align: "center"
            },
            {
              field: "ModifyID",
              title: "",
              type: "string",
              width: "80",
              hidden: true,
              align: "center"
            },
            {
              field: "DeleterID",
              title: "",
              type: "string",
              width: "120",
              hidden: true,
              align: "center"
            },
            {
              field: "GoodsBatch",
              title: "产品批号",
              type: "string",
              width: "90",
              hidden: false,
              edit: { type: "text" },
              require: true,
              bind: { key: "AllDic", data: [] },
              align: "center"
            },
            {
              field: "RefID",
              title: "关联父ID",
              type: "string",
              width: "90",
              hidden: false,
              require: true,
              align: "center"
            },
            {
              field: "Status",
              title: "",
              type: "int",
              width: "90",
              hidden: false,
              require: true,
              align: "center"
            },
            {
              field: "Creator",
              title: "创建人",
              type: "string",
              width: "130",
              hidden: false,
              require: true,
              align: "center"
            },
            {
              field: "Remarks",
              title: "备注",
              type: "string",
              width: "220",
              hidden: false,
              edit: { type: "textarea" },
              align: "center"
            },
            {
              field: "Modifier",
              title: "",
              type: "string",
              width: "130",
              hidden: false,
              align: "center"
            },
            {
              field: "Qty",
              title: "数量",
              type: "int",
              width: "90",
              hidden: false,
              edit: { type: "number" },
              require: true,
              align: "center"
            },
            {
              field: "Deleter",
              title: "",
              type: "string",
              width: "180",
              hidden: true,
              align: "center"
            },
            {
              field: "ModifyTime",
              title: "修改时间",
              type: "DateTime",
              width: "90",
              hidden: false,
              align: "center"
            },
            {
              field: "ID",
              title: "",
              type: "string",
              width: "120",
              hidden: true,
              require: true,
              align: "center"
            },
            {
              field: "CreateTime",
              title: "创建时间",
              type: "DateTime",
              width: "90",
              hidden: false,
              require: true,
              align: "center"
            },
            {
              field: "Weight",
              title: "重量",
              type: "float",
              width: "90",
              hidden: false,
              edit: { type: "decimal" },
              require: true,
              align: "center"
            }
          ],
          key: "ID"
        }
      ] //子表
    };
  }
};

export default vueParam;
</script>
