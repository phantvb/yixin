<template>
    <el-dialog :title="title[type].tit" :visible.sync="show" @close="close" center id="dialog_worker_dialog">
        <div :style="{'text-align':'left'}">{{title[type].con}}</div>
        <div class="con">
            <ul>
                <li v-for="(item,index) in messages" :key="item.id">
                    <div :class="checkall?'list':'list_noborder'">
                        <div style="float:left;">
                            <p>坐席账号：{{item.loginName}}</p>
                            <p>坐席昵称：{{item.shortName}}</p>
                            <p>坐席密码：{{item.password2}}</p>
                        </div>
                        <el-button size="mini" class="copy" v-show="checkall==true" @click="copy(index)" style="float:right;">复制信息</el-button>
                        <div class="mask" v-show="copy_success==index">
                            <i class="el-icon-success"></i>坐席信息已复制
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="mini" style="width:165px;margin-right:20px;" @click="show=false">&#12288;关闭&#12288;</el-button>
            <el-button size="mini" style="width:165px;" @click="copyall" v-show="checkall==true" type="primary">复制全部</el-button>
            <el-button size="mini" style="width:165px;" @click="copy(0)" v-show="!checkall" type="primary">复制信息</el-button>
        </span>
      </el-dialog>
</template>
<style scoped>
    .con{
        overflow-x: hidden;
        overflow-y: scroll;
        max-height: 40vh;
    }
    .con>ul{
        box-sizing: border-box;
    }
    .con::-webkit-scrollbar-track
    {
        background-color: #F5F5F5;
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.22);
    }
    /*定义滚动条高宽及背景*/
    .con::-webkit-scrollbar
    {
        width: 3px;
        background-color: rgba(153, 153, 153, 0.8);
    }
    /*定义滚动条*/
    .con::-webkit-scrollbar-thumb
    {
        background-color: #8b8b8b;
        border-radius: 1px;
    }
    ul{
        padding: 0;
    }
    li{
        overflow: hidden;
        margin: 10px 0;
    }
    .list_noborder{
        border-radius: 4px;
        width: 350px;
        float: left;
        position: relative;
        overflow: hidden;
    }
    .list{
        border: 1px solid #D8D8D8;
        border-radius: 4px;
        width: 350px;
        float: left;
        position: relative;
        overflow: hidden;
    }
    .list p{
        margin:8px 10px;
    }
    .copy{
        float: left;
        min-width: 98px;
        margin: 30px 21px;
    }
    .mask{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, 0.5);
        text-align: center;
        line-height: 84px;
    }
</style>
<script>
export default {
    name:"dialog_worker",
    data:function(){
        return{
            title:[{
                tit:'复制信息',con:'复制坐席信息给销售人员，让他开始工作吧！'
            },{
                tit:'重置密码',con:'坐席密码已重置，您可以复制新的坐席信息给销售人员'
            }],
            copy_success:-1
        }
    },
    props:["message","type","show","checkall"],
    computed:{
        messages:function(){
            return this.message;
        }
    },
    methods:{
        close:function(){
            this.copy_success=-1;
            this.show=false;
            this.$emit("close");
        },
        copy:function(index){
            let message='坐席账号：'+this.message[index].loginName+'\n坐席昵称：'+this.message[index].shortName+'\n坐席密码：'+this.message[index].password2;
            let _index=index;
            let _this=this;
            this.$copyText(message).then(function (e) {
                _this.copy_success=index;
            }, function (e) {
                alert('Can not copy')
            })
        },
        copyall:function(){
            let message='';
            for(let i=0;i<this.message.length;i++){
                message+='坐席账号：'+this.message[i].loginName+'\n坐席昵称：'+this.message[i].shortName+'\n坐席密码：'+this.message[i].password2+'\n';
            }
            let _this=this;
            this.$copyText(message).then(function (e) {
                console.log('copy完成')
            }, function (e) {
                alert('Can not copy')
            })
        }
    }
}
</script>
