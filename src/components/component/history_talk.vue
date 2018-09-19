<template>
    <div class="container">
        <div class="head" style="padding-left:1.7%">历史通话记录<i class="el-icon-d-arrow-right" @click="close"></i></div>
        <div id="line" style="padding-left:1.7%" v-if="!head"></div>
        <div class="body" style="padding-left:1.7%" v-if="head">
            <div class="mes2">
                <p>{{taskMes.userName}}</p>
                <p>{{taskMes.userNumber}}</p>
            </div>
            <div class="mes" v-show="taskMes.userGender||taskMes.userJob||taskMes.userCompany||taskMes.userEmail||taskMes.desc">
                <p v-if="taskMes.userGender">性别：{{taskMes.userGender==0?'男':'女'}}</p>
                <p v-if="taskMes.userJob">职业：{{taskMes.userJob}}</p>
                <p v-if="taskMes.userCompany">公司：{{taskMes.userCompany}}</p>
                <p v-if="taskMes.userEmail">邮箱：{{taskMes.userEmail}}</p>
                <p v-if="taskMes.desc">意向：{{taskMes.desc}}</p>
            </div>
        </div>
        <div class="history">
            <span class="black" v-if="head" style="float:left;font-size:16px;">历史通话记录&#12288;</span><span class='grey' style="float:left;margin-top: 2px;">总联系{{details.totalContactNum?details.totalContactNum:0}}次，有效联系<span class="light-blue">{{details.effectiveContactNum?details.effectiveContactNum:0}}</span>次</span>
            <div class="line"></div>
            <div class="record" ref="record">
                <div class="record_list black" v-for="(item,index) in details.details" :key="index">
                    <p class="grey record_list_title">{{item.callEndTime}}<span>&#12288;<span class="black">{{item.shortName}}</span>&#12288;<span style="font-size:12px;">{{item.callReault==22?'呼叫':'通话'}}</span>&#12288;<span class="black">{{item.callReault==22?item.callReaultString:item.callDuration}}</span></span></p>

                    <div class="line_content">
                        <div style="overflow: hidden;">
                            <p class="grey" v-if="item.userResultStr">客户状态&#12288;<span class="blue">{{item.userResultStr}}</span></p>
                            <p class="grey" :style="{'float':'right'}">下次联系时间&#12288;<span class="blue">{{item.nextContactTime?item.nextContactTime.substr(0,item.nextContactTime.length-3):'无'}}</span></p>
                        </div>

                        <div class="history_talk_tag" v-if="item.taglist">
                            <el-button type="primary" style="background-color:#ECF2FF;border-color:#7496F2;color:#7496F2;" size="mini" v-for="(_item,index) in item.taglist" :key="index">{{_item}}</el-button>
                        </div>
                        <p class="grey" v-if="item.desc">详情备注&#12288;<span class="black">{{item.desc}}</span></p>

                        <p class="grey" :style="{'width':'100%'}" v-if="item.recordFilePath"><span style="float:left;margin-top:2px;">通话录音</span>&#12288;
                            <a-player class="Aplay history_aplay" :music_url="baseUrl+item.recordFilePath+'?callSessionId='+item.callSeesionId+'&sessionId='+session" :name='"music_hitory"+index' size='mini'></a-player>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .Aplay{
        display: inline-block;
        width: 234px;
        padding: 2px 10px;
        background-color: rgba(0,0,0,0.02);
        border: 1px solid #7496F2;
        border-radius: 16px;
    }
    .history_talk_tag{
        margin-top: 20px;
        margin-bottom: 10px;
    }
    #line{
        width: 100%;
        height: 1px;
        background-color: #e4e4e4;
    }
    .blue{
        font-size: 14px;
    }
    div{

        font-size: 13px;
    }
    .container{
        width: 450px;
        overflow: hidden;
        height: 100vh;
        min-width: 400px;
        z-index: 9999;
    }
    .head{
        margin: 10px 0;
        font-size: 16px;
        font-weight: 700;
    }
    .body{
        border-top: 1px solid #F0F2F5;
        border-bottom: 1px solid #F0F2F5;
    }
    .el-icon-d-arrow-right{
        float: left;
    }
    .mes2{
        overflow: hidden;
        margin: 10px;
        text-align: left;
    }
    .mes{
        overflow: hidden;
        padding: 10px 0;
        text-align: left;
        border-top: 1px solid #F0F2F5;
    }
    .mes p{
        float: left;
        margin:0 10px;
    }
    .history{
        position: relative;
        left: 1.7%;
        margin-top: 12px;
    }
    .line{
        width: 1px;
        background-color: #7496F2 ;
        height: 100vh;
        position: absolute;
        top: 36px;
        left: 8px;
    }
    .record{
        width: 400px;
        min-width: 400px;
        position: absolute;
        top: 36px;
        left: 0;
        padding-left: 18px;
        box-sizing: border-box;
        margin: 4px 0;
        background: transparent;
        overflow-y: auto;
        max-height: 90vh;
    }
    .record p{
        margin: 4px 0;
    }
    .record_list{
        position: relative;
        text-align: left;
        padding-left: 8px;
        padding-right: 8px;
        margin-bottom: 16px;
    }
    .record_list::before{
        content: '';
        position: absolute;
        top: 4px;
        left: -16px;
        width: 15px;
        height: 15px;
        box-sizing: border-box;
        border: 1px solid #7496F2;
        border-radius: 100%;
        background-color: #fff;
    }
    .record_list_title{
        display: inline-block;
        background-color: #ECF2FF ;
        border-radius: 16px;
        padding: 2px 8px;
    }
    .record::-webkit-scrollbar-track
    {
        background-color: #F5F5F5;
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.22);
    }
    /*定义滚动条高宽及背景*/
    .record::-webkit-scrollbar
    {
        width: 4px;
        background-color: rgba(153, 153, 153, 0.8);
    }
    /*定义滚动条*/
    .record::-webkit-scrollbar-thumb
    {
    background-color: #8b8b8b;
    border-radius: 1px;
    }
    .line_content{
        overflow: hidden;
        border-radius: 4px;
        box-sizing: border-box;
        padding: 7px;
        margin: 8px 0;
    }
    .line_content p{
        float: left;
    }
</style>
<script>
import VueAplayer from './a_player.vue'
export default {
    name:'history_talk',
    data:function(){
        return {
            name:'未知客户',
            phone:'13933337767',
            sex:'女',
            job:'设计师',
            company:'网易(杭州)网络有限公司',
            email:'hzfuwenjuan@corp.nete',
            think:'待添加',
            baseUrl:null,
            session:null
        }
    },
    components: {
        'a-player': VueAplayer
    },
    props:['head','details','taskMes'],
    methods:{
        enter(){
          this.$emit('enter')
        },
        close(){
            this.$emit('close')
        }
    },
    mounted(){
        this.$ajax.post(this.$preix+'/new/callstatistics/getIccStaticContextPath').then(res=>{
            if(res.data.code){
                this.baseUrl=res.data.info.iccStaticContextPath;
                this.session=res.data.info.sessionId;
            }
        });
        //监听滚动
        this.$refs.record.addEventListener('scroll', () => {
          var scrollTop = this.$refs.record.scrollTop;
          var scrollHeight = this.$refs.record.scrollHeight;
          var divHeight = this.$refs.record.offsetHeight
          //判断是否到底
          if(scrollTop >= (scrollHeight - divHeight)){
            this.enter();
          }
        }, false)
    }
}
</script>

