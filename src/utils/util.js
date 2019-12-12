
  /*
 *@functionName:树形数组转换成列表数组
 *@description:
 *@params1:树形数组
 *@params2:子对象，属性名称
 *@return:
 */
export const treeToList = (tree, chilAttr) => {
    var queen = [];
    var out = [];
    var deepCopyTree = JSON.parse(JSON.stringify(tree)); // 深拷贝，不影响元对象
    queen = queen.concat(deepCopyTree);
    while (queen.length) {
        var first = queen.shift();
        if (first[chilAttr]) {
            queen = queen.concat(first[chilAttr]);
            delete first[chilAttr];
        }
        out.push(first);
    }
    return out;
};

/*
 *@functionName:树形数组转换成有顺序列表数组
 *@description:
 *@params1:树形数组
 *@params2:子对象，属性名称
 *@return:
 */
export const treeToOrderList = (tree, chilAttr) => {
    var queen = [];
    var out = [];
    var deepCopyTree = JSON.parse(JSON.stringify(tree)); // 深拷贝，不影响元对象
    queen = queen.concat(deepCopyTree);
    while (queen.length) {
        var first = queen.shift();
        if (first[chilAttr]) {
            queen = first[chilAttr].concat(queen);
            // queen = queen.concat(first[chilAttr]);
            delete first[chilAttr];
        }
        out.push(first);
    }
    return out;
};
/*
 *@functionName:列表数组转换成树形数组
 *@description:
 *@params1:列表数组
 *@params2:父id，属性名称
 *@params2:生成的子属性名称
 *@return:
 */
export const listToTree = (list, parentAttr, chilAttr) => {
    var map = {};
    var node;
    var tree = [];
    var i;
    var deepCopyList = JSON.parse(JSON.stringify(list)); // 深拷贝，不影响元对象
    for (i = 0; i < deepCopyList.length; i++) {
        map[deepCopyList[i].id] = deepCopyList[i];
        deepCopyList[i][chilAttr] = [];
    }
    for (i = 0; i < deepCopyList.length; i += 1) {
        node = deepCopyList[i];
        if (node[parentAttr]) {
            map[node[parentAttr]][chilAttr].push(node);
        } else {
            tree.push(node);
        }
    }
    return tree;
};

/*
 *@functionName:遍历树结构的节点
 *@description:
 *@params1:node 某个节点
 *@params2:beforeIn 找到节点的回调函数（进去递归之前）
 *@params3:afterIn 从递归出来之后
 *@return:
 */
export const recurseNode = (node, beforeIn, afterIn) => {
    if (node && typeof beforeIn == 'function') beforeIn(node);
    if (node.Children && node.Children.length > 0) {
        node.Children.forEach(chil => {
            recurseNode(chil, beforeIn, afterIn);
        });
    }
    if (typeof afterIn == 'function') afterIn(node);
};
/*
 *@functionName:获取树形数组的特定节点(同时返回父节点：新的数组，操作该数组无法更改到绑定的父节点)
 *@description:
 *@params1:tree 树形数组
 *@params2:id 节点id
 *@return: node: 找到的节点, parents: 该节点的所有父节点, children: 该节点下的所有子节点
 */
export const getNodeById = (trees, ID, callback) => {
    var parents = [];
    var children = [];
    try {
        for (let i = 0; i < trees.length; i++) {
            recurseNode(
                trees[i],
                beforeIn => {
                    debugger
                    if (beforeIn.ID == ID) {
                        throw beforeIn; // 目标，抛异常，结束
                    } else {
                        parents.push(beforeIn); // 非目标，则假设该节点是父节点
                    }
                },
                afterIn => {
                    parents.pop(); // 从递归出来，或当前不是目标，则移除最后一个假设的父节点
                }
            );
        }
    } catch (node) {
        debugger;
        recurseNode(node, beforeIn => {
            if (beforeIn.ID != node.ID) children.push(beforeIn);
        });
        callback(node, parents, children);
    }
};
/*
 *@functionName:查找树形数组中，满足条件中的所有记录
 *@description:
 *@params1:trees 树形数组
 *@params2:func(node) 查找方法，判断某个节点是否满足条件，满足返回true
 *@return:
 */
export const getNodesByFunc = (trees, func) => {
    var nodes = [];
    for (let i = 0; i < trees.length; i++) {
        recurseNode(
            trees[i],
            beforeIn => {
                if (func(beforeIn)) nodes.push(beforeIn);
            },
            afterIn => {}
        );
    }
    return nodes;
};


//生成随机guid数
export const getGuidGenerator=()=> { 
    var S4 = function() { 
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1); 
    }; 
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4()); 
}