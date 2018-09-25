<template>
    <div id="mask">
        <div>
            <p><i class="el-icon-noMission"></i></p>
            <el-button size="mini" type="primary" class="button">清除筛选条件</el-button>
        </div>
    </div>
</template>
<style scoped>
    #mask{
        position:absolute;
        left:0;
        top:0;
        width:100%;
        height: 400px;
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
    name:'noMission'
}
</script>
