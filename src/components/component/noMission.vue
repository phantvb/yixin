<template>
    <div id="mask" :style="{'height':size=='mini'?'200px':'400px'}">
        <div>
            <p style="text-align:center"><i :class="size=='mini'?'el-icon-noMission':'el-icon-noMission-mini'"></i></p>
            <el-button size="mini" type="primary" class="button" @click="my_mounter">清除筛选条件</el-button>
        </div>
    </div>
</template>
<style scoped>
    #mask{
        position:absolute;
        left:0;
        top:0;
        width:100%;
        z-index:99;
        background-color: #fff;
        pointer-events: all;
        box-sizing: border-box;
        /* transform:translate3d(10px,10px,0); */
    }
    #mask .button{
        display: block;
        margin: 10px auto;
    }
</style>
<script>
export default {
    name:'noMission',
    methods:{
      my_mounter(){
        this.$emit('my_mounter')
      }
    },
    props:['size']
}
</script>
