<template>
  <div class="component-menu-warp">
    <el-collapse v-model="menu" class="collapse-menu">
      <el-collapse-item
        v-for="(item, index) in componentList"
        :key="index"
        :title="item.title"
        :name="item.title"
      >
        <template v-if="item.list && item.list.length > 0">
          <draggable
            class="component-list"
            v-bind="dragOptions"
            :component-data="getComponentData"
            @end="onEnd"
          >
            <div
              v-for="(tag) in item.list"
              :key="tag.id"
              class="item"
              :data-component-id="tag.id"
            >
              <span class="name">{{ tag.title }}</span>
              <i :class="tag.icon"></i>
            </div>
          </draggable>
        </template>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
// import { mapGetters } from "vuex";
//import {mapGetters} from '@/store'
import draggable from "vuedraggable";
export default {
  components: {
    draggable
  },
  data() {
    return {
      menu: ["地址信息", "商品标签信息", "构图元素"],

      //componentList:[],
    };
  },
  computed: {
     //...mapGetters(['componentList']),
    componentList(){
      debugger
      console.log("componentList");
      console.log(this.$store.getters.componentList)
      return this.$store.getters.componentList
    },
    dragOptions() {
      return {
        sort: false,
        group: {
          name: "component",
          pull: "clone",
          put: false
        }
      };
    },
    getComponentData() {
      return {
        // on: {
        //   change(a, b, c) {
        //   },
        //   input(a, b, c) {
        //   }
        // },
        // attr: {},
        // value: '',
      };
    }
  },
  methods: {
    onEnd(evt) {
      // doing
    }
  },
  created(){
    //this.componentList= this.$store.getters.componentList ;
  }
};
</script>

<style lang="scss">
@import "./src/styles/variables";
.component-menu-warp {
  .collapse-menu {
    .el-collapse-item__header {
      background-color: $lightBackground;
      padding: 0 15px;
      transition: 0.3s ease all;
      &:hover {
        color: $skyBlue;
      }
    }
    .component-list {
      padding: 15px;
      .item {
        cursor: pointer;
        padding: 8px;
        border: 1px solid $border;
        margin-bottom: 10px;
        border-radius: 2px;
        color: $generalFontColor;
        transition: 0.3s ease all;
        display: flex;
        align-items: center;
        box-shadow: 0 0 4px rgba(0, 21, 41, 0.13);
        justify-content: space-between;
        &:hover {
          color: $skyBlue;
          border: 1px solid $skyBlue;
          i {
            color: $skyBlue;
          }
        }
        i {
          font-size: 16px;
          color: $info;
        }
      }
    }
  }
}
</style>
