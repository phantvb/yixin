<template>
    <div class="container">
        <div class="part1">
            <p class="p_tit">今日剩余任务</p>
            <ul>
                <li>
                    <p class="black">{{datas.seatTaskLeftTodayDto.taskNum}}</p>
                    <p class="grey">外呼任务</p>
                </li>
                <li>
                    <p class="black">{{datas.seatTaskLeftTodayDto.toCallUserNum}}</p>
                    <p class="grey">继续跟进人数</p>
                </li>
                <li>
                    <p class="black">{{datas.seatTaskLeftTodayDto.subscribeTodayNum}}</p>
                    <p class="grey">今日已预约</p>
                </li>
                <li :style="{'float':'right'}">
                    <el-button type="primary" size="small" :style="{'margin-top':'1em'}" @click="pushStage">开始呼叫工作</el-button>
                </li>
            </ul>
        </div>
        <div class="part2">
            <p class="p_tit">今日完成情况</p>
            <ul style="margin:0px">
                <li>
                    <el-card shadow="hover">
                        <el-row :gutter="12" style="margin:0">
                            <el-col :span="6" style="border-right:0.015625rem solid #ebeef5">  
                                <i class="el-icon-solution"></i>
                            </el-col>  
                            <el-col :span="9">
                                <span class="black">已呼人数(人)</span>
                            </el-col> 
                            <el-col :span="9" style="text-align:left">  
                                <span class="blue">{{todayCompleteDto?todayCompleteDto.calledNumTotal:0}}</span> 
                            </el-col>  
                        </el-row>
                    </el-card>
                </li>
                <li>
                    <el-card shadow="hover">
                        <el-row :gutter="12" style="margin:0">
                            <el-col :span="6" style="border-right:0.015625rem solid #ebeef5">  
                                <i class="el-icon-fileDone"></i>
                            </el-col>  
                            <el-col :span="9">
                                <span class="black">呼通时长(min)</span>
                            </el-col> 
                            <el-col :span="9" style="text-align:left">  
                                <span class="blue">{{todayCompleteDto?Math.floor(todayCompleteDto.callTalkedDuration/60):0}}</span> 
                            </el-col>  
                        </el-row>
                    </el-card>
                </li>
                <li>
                    <el-card shadow="hover">
                        <el-row :gutter="12" style="margin:0">
                            <el-col :span="6" style="border-right:0.015625rem solid #ebeef5">  
                                <i class="el-icon-fileDone"></i>
                            </el-col>  
                            <el-col :span="9">
                                <span class="black">发展成功(人)</span>
                            </el-col> 
                            <el-col :span="9" style="text-align:left">  
                                <span class="blue">{{todayCompleteDto?todayCompleteDto.successNum:0}}</span> 
                            </el-col>  
                        </el-row>
                    </el-card>
                </li>
                <li>
                    <el-card shadow="hover">
                        <el-row :gutter="12" style="margin:0">
                            <el-col :span="6" style="border-right:0.015625rem solid #ebeef5">  
                                <i class="el-icon-fileException"></i>
                            </el-col>  
                            <el-col :span="9">
                                <span class="black">发展失败(人)</span>
                            </el-col> 
                            <el-col :span="9" style="text-align:left">  
                                <span class="blue">{{todayCompleteDto?todayCompleteDto.failureNum:0}}</span> 
                            </el-col>  
                        </el-row>
                    </el-card>
                </li>
                <li>
                    <el-card shadow="hover">
                        <el-row :gutter="12" style="margin:0">
                            <el-col :span="6" style="border-right:0.015625rem solid #ebeef5">  
                                <i class="el-icon-fileSync"></i>
                            </el-col>  
                            <el-col :span="9">
                                <span class="black">继续跟进(人)</span>
                            </el-col> 
                            <el-col :span="9" style="text-align:left">  
                                <span class="blue">{{todayCompleteDto?todayCompleteDto.progressingNum:0}}</span> 
                            </el-col>  
                        </el-row>
                    </el-card>
                </li>
                <li>
                    <el-card shadow="hover">
                        <el-row :gutter="12" style="margin:0">
                            <el-col :span="6" style="border-right:0.015625rem solid #ebeef5">  
                                <i class="el-icon-fileProtect"></i>
                            </el-col>  
                            <el-col :span="12">
                                <span class="black">成功率(成功/已呼)</span>
                            </el-col> 
                            <el-col :span="6" style="text-align:left">  
                                <span class="blue">{{todayCompleteDto&&todayCompleteDto.calledNumTotal!=0?Math.ceil(todayCompleteDto.successNum/todayCompleteDto.calledNumTotal*100):0}}%</span> 
                            </el-col>  
                        </el-row>
                    </el-card>
                </li>
            </ul>
        </div>
        <div class="part3">
            <div class="p2_tit p_tit">
                <p style="margin:0px;">进行中任务</p>
                <router-link :to="{path:'/staff/follow'}">
                <p class="grey" style="margin:0px">查看完整数据<i class="el-icon-d-arrow-right"></i></p>
                </router-link>
            </div>
            <div class="svg_empty" v-show="callTaskList.length==0">
                <p class="black">未选择</p>
                <router-link :to="{path:'/staff/follow'}">
                    <div>
                        查看完整数据
                    </div>
                </router-link>
            </div>
            <div class="svg" v-show="callTaskList&&callTaskList.length>0"></div>
            <div class="svg" v-show="callTaskList&&callTaskList.length>0"></div>
            <div class="svg" v-show="callTaskList&&callTaskList.length>0"></div>
            <div class="svg" v-show="callTaskList&&callTaskList.length>0"></div>
            <div class="svg" v-show="callTaskList&&callTaskList.length>0"></div>
            <img src="../../../static/icon/legend_staff.png" alt="" style="height:1vw;" v-show="callTaskList&&callTaskList.length>0">
        </div>
    </div>
</template>
<style scoped>
    .part1,.part2,.part3{
        text-align: left;
        padding-left: 5vw;
        overflow: hidden;
        margin: 8px 0;
        border-radius: 4px;
    }
    .part3{
        text-align: center;
    }
    .part1 li{
        width: 16%;
        text-align: center;
        float: left;
        padding-right: 5vw;
        box-sizing: border-box;
    }
    .part2 li{
        width: 33%;
        text-align: center;
        float: left;
        padding-right: 10px;
        margin: 20px 0px;
        box-sizing: border-box;
    }
    .part2 li span{
        line-height: 68px;
    }
    .part2{
        max-height: 290px;
    }
    .grey{
        color: #999;
        font-size: 12px;
    }
    .black{
        color: #444;
        font-size: 18px;
    }
    span.black{
        font-size: 12px;
    }
    .p_tit{
        margin: 0 0 0 -4vw;
        overflow: hidden;
    }
    .p2_tit>p:nth-child(1){
        float: left;
    }
    .p2_tit>a>p{
        float: right;
    }
    .p3_radio{
        float: left;
        margin: 20.67px 20px;
        font-size: 14px;
    }
    .p3_tit>p:nth-child(1){
        float: left;
    }
    .p3_tit>p.grey{
        float: right;
    }
    .svg{
        width: 20%;
        height: 230px;
        float: left;
    }
    .svg_work{
        width: 49%;
        height: 300px;
        float: left;
    }
</style>

<script>
let echarts = require('echarts/lib/echarts');
// 引入饼图组件
require('echarts/lib/chart/pie')
// 引入提示框和图例组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/component/title')
  require('echarts/lib/component/graphic')
export default {
    name:'Staff_index',
    data:function(){
        return {
            mission_data:[],
            datas:{
                "seatTaskLeftTodayDto" : {
                    "subscribeTodayNum" : 0,
                    "taskNum" : 0,
                    "toCallUserNum" : 0
                }
            },
            todayCompleteDto : {
                "callTalkedDuration":0,
                "callTalkedNumToal" : 0,
                "callTalkedTotal" : 0,
                "calledDuration" : 0,
                "calledNumTotal" : 0,
                "calledTotal" : 0,
                "failureNum" : 0,
                "progressingNum" : 0,
                "successNum" : 0
            },
            callTaskList:null
        }
    },
    methods:{
        pushStage(){
            this.$emit('close');
            this.$router.push({ path: '/staff/stage'})
        },
        drawPie:function(item){
            var myChart = echarts.init(document.getElementsByClassName('svg')[item.id_num]);
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                graphic:{  
                    type:'text',  
                    left:'center',  
                    top:'center',  
                    z:2,  
                    zlevel:100,  
                    style: {              
                        x: 0,  
                        y: 0, 
                        text: item.process!==undefined?(item.process+'%'):null,  
                        textAlign: 'center',   
                        textFont : '14px Arial'  ,
                        fill:'#666'
                    }  
                },
                legend: {
                    x: 'left',
                    data:['发展成功','发展失败','未分配','继续跟进'],
                    show:item.showLegend,
                    orient:'vertical',
                    top:'14%',
                    icon:'circle'
                },
                title:{
                    text:item.id,
                    top:'0px',
                    left:'center',
                    textStyle:{
                        fontSize:14,
                        color:'#999'
                    }
                },
                series: [
                    {
                        name:'客户状态',
                        type:'pie',
                        radius: ['50px', '72px'],
                        color: ['#83CA0D', '#EF5679', '#7496F2', '#D4D4D4'],
                        label: {
                            normal: {
                                position: 'center',
                                show:false
                            }
                        },
                        data:item.data
                    }
                ]
            };
            myChart.setOption(option);
        },
        date_init(date){
            let year=date.getFullYear();
            let month=(date.getMonth()+1)<10?("0"+(date.getMonth()+1)):(date.getMonth()+1);
            let day=date.getDate()<10?("0"+date.getDate()):date.getDate();
            return year+'-'+month+'-'+day+' 00:00:00';
        },
        mission_init:function(item){
            for(let i=0;i<5;i++){
                if(i<item.length){
                    var process=item[i].numberTotal!=0?Math.floor((item[i].failureNum+item[i].successNum)*100/item[i].numberTotal):0;
                    let obj={'id_num':i,'process':process,'id':item[i].taskName,'key':item[i].taskId,data:[{'name':'发展成功','value':item[i].successNum},{'name':'发展失败','value':item[i].failureNum},{'name':'继续跟进','value':item[i].processingNum}]}
                    this.drawPie(obj);
                }
            }
        }
    },
    //初始化首页数据
    mounted(){
        var _this=this;
        var beginTime=this.date_init(new Date(new Date().getTime() - 0*24*60*60*1000));
        var endTime=this.date_init(new Date(new Date().getTime() + 0*24*60*60*1000));
        this.$ajax.post(this.$preix+'/new/getIndexData'
        ).then( res=>{
        if(res.data.code==200){
                _this.datas=res.data.info;
            }
        });
        this.$ajax.post(this.$preix+'/new/calltask/queryTaskOnwallChartBySeat',[]
        ).then( res=>{
            if(res.data.code==200){
                _this.callTaskList=res.data.info;
                _this.mission_init(res.data.info);
            }
        });
        this.$ajax.post(this.$preix+'/new/callstatistics/querySeatTaskCompletion',{beginTime:beginTime,endTime:endTime}
        ).then( res=>{
            if(res.data.code==200){
                _this.todayCompleteDto=res.data.info?res.data.info:null;
            }
        });
    }
}
</script>

