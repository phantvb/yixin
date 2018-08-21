<template>
    <div :style="{'position':'relative'}">
        <div id="mask">
            <div>
                <p><i class="el-icon-noMission"></i></p>
            </div>
        </div>
    </div>
</template>
<style scoped>
    div{
        height: 100%;
    }
    #mask{
        position:absolute;
        left:0;
        top:0;
        width:100%;
        height: 100%;
        z-index:99;
        background-color: #fff;
        pointer-events: all;
        box-sizing: border-box;
        line-height: 100vh;
        /* transform:translate3d(10px,10px,0); */
    }
    #mask .button{
        display: block;
    }
</style>

<script>
export default {
    name:"index"
}
</script>
