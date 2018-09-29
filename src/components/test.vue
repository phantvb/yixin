<template>
<div>
  <el-tree :data="navs" :props="defaultProps" node-key="id" ref="tree" highlight-current> </el-tree>
　　<el-button @click="setCheckedNodes">展开所有菜单</el-button>
　　<el-button @click="setCheckedKeys">收起所有菜单</el-button>
</div>
　　
</template>
<script>
export default { 
　　data() {
　　　　return {
　　　　　　navs:[{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2',
            children: [{
             id: 11,
              label: '三级 3-2-1'
            }, {
              id: 12,
              label: '三级 3-2-2'
            }, {
              id: 13,
              label: '三级 3-2-3'
            }]
          }]
        }],   //所有菜单 
　　　　　　 defaultProps: {
          id:'id',
          children: 'children',
          label: 'label'
        },
 
　　　　　　defaultExpand:true,  //默认展开所有节点
　　　　}
　　},
　　methods: {
　　　　setCheckedKeys() {　　
　　　　　　this.defaultExpand=false;
            console.log(this.$refs.tree,this.$refs.tree.store._getAllNodes())
　　　　　　for(var i=0;i<this.$refs.tree.store._getAllNodes().length;i++){
　　　　　　　　this.$refs.tree.store._getAllNodes()[i].expanded=false;
　　　　　　}
　　　　},
　　　　setCheckedNodes() {
　　　　　　this.defaultExpand=true; //展开所有节点
　　　　　　for(var i=0;i<this.$refs.tree.store._getAllNodes().length;i++){
　　　　　　　　this.$refs.tree.store._getAllNodes()[i].expanded=this.defaultExpand;
　　　　　　}
　　　　}
　　}
}
</script>