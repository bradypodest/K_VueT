import { getUserMenuTree } from '@/api/system/sys-menu'
import router, { constantRoutes } from '@/router';
import _import from '@/router/import';

/* Layout */
import Layout from '@/layout'

// 初始化数据
const state = {
    home: '',
    tree: [],
    routes: [],
}

export function filterRouterTwo(state,route){
    var routeItem=null;
    if (route.IsShow) {
        if (route.ParentArray.length == 1) {//默认对应的父亲节点就只有一个

            routeItem = {
                path: route.Url,
                name: route.MenuId,
                component: Layout,
                meta: { title: route.Name, icon: route.Icon },
                children: []
            };
        }
        else {
            routeItem= {
                    path: route.Url,
                    name: route.MenuId,
                    component: _import(`${route.PathUrl}`),
                    meta: { title: route.Name, icon: route.Icon },
                    children: [],
                };
        }


        if (route.Children && route.Children.length > 0) {
            //filterRouter(state, route.Children, routeItem);
            route.Children.forEach(item => {
                var returnRouteItem=filterRouterTwo(state,item)
                if(returnRouteItem!=null){
                    routeItem.children.push(returnRouteItem); 
                }
            });

           return routeItem;

        } else {
           return routeItem;
        }
    }else{
        return routeItem;
    }

}


//var routeItem={};
export function filterRouter(state, tree, routeItem) {
    if (tree && tree.length > 0) {

        tree.forEach((route, index) => {
            var o=filterRouterTwo(state,route)
            debugger
            if(o!=null){
                constantRoutes.push(o)
            }
            
        });
    }
}

function groupAddRouter(state) {
    constantRoutes.push({ path: '*', redirect: '/404', hidden: true }); // 保证* 404在最后
    return constantRoutes;
}


// 改变state 中的值的方法
const mutations = {
    SET_SYS_MENU_ROUTERS: (state, sys_menu_routers) => {
        state.sys_menu_routers = sys_menu_routers
        state.routes = constantRoutes.concat(accessedRoutes)
    },
    SET_ROUTES: (state, tree) => {
        state.tree = tree;
        const Routers = groupAddRouter(state);
        debugger;
        state.routes = Routers;
    }
}

const actions = {
    getUserMenu({ commit, state }, token) {
        return new Promise((resolve, reject) => {
            getUserMenuTree(token).then(response => {
                const { data } = response
                console.log(data);
               
                if (!data) {
                    reject('获取用户菜单失败!')
                } else {
                    //过滤路由
                    filterRouter(state, data.Children, null);
                }
                commit('SET_ROUTES', data.Children)
                resolve(state.routes)
            }).catch(error => {
                reject(error)
            })
        })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
