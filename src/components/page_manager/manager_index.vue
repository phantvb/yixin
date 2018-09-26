<template>
    <div class="container">
        <div class="part1">
            <p>通话资源及坐席概况</p>
            <ul>
                <li>
                    <p class="grey">剩余通话资源</p>
                    <p class="grey"><span class="blue">{{time.remin}}</span>分钟</p>
                    </li>
                <li>
                    <p class="grey">企业坐席</p>
                    <p class="grey"><span class="blue">{{worker.num}}</span>人/{{worker.all}}人</p>
                    <el-progress :percentage="worker_scale" :show-text='false' :color="worker_scale>20?'#7496F2':'#EF5679'"></el-progress>
                </li>
            </ul>
        </div>
        <div class="part2">
            <div class="p2_tit">
                <p>外呼任务完成情况</p>
                <router-link :to="{path:'/manager/follow'}">
                <p class="grey">查看完整数据<i class="el-icon-d-arrow-right"></i></p>
                </router-link>
            </div>
            <div class="svg_empty" v-show="callTaskCode==500002">
                <router-link :to="{path:'/manager/follow'}">
                <div>
                    选择展示任务
                </div>
                </router-link>
            </div>
            <div class="svg" v-show="callTaskCode!=500002"></div>
            <div class="svg" v-show="callTaskCode!=500002"></div>
            <div class="svg" v-show="callTaskCode!=500002"></div>
            <div class="svg" v-show="callTaskCode!=500002"></div>
            <div class="svg" v-show="callTaskCode!=500002"></div>
            <img src="../../../static/icon/legend_manager.png" alt="" style="height:1vw;" v-show="callTaskCode!=500002">
        </div>
        <div class="part3">
            <div class="p3_tit">
                <p>坐席呼叫统计</p>
                <el-radio-group v-model="time_past" class="p3_radio" @change="change">
                    <el-radio :label="2" selected>今天</el-radio>
                    <el-radio :label="1">昨天</el-radio>
                    <el-radio :label="7">过去7天</el-radio>
                    <el-radio :label="30">过去30天</el-radio>
                </el-radio-group>
                <router-link :to="{path:'/manager/call_count'}">
                <p class="grey">查看完整数据<i class="el-icon-d-arrow-right"></i></p>
                </router-link>
            </div>
            <div class="svg_work"></div>
            <div class="svg_work"></div>
        </div>
    </div>
</template>
<style scoped>
    .blue{
        font-size: 24px;
    }
    .part1,.part2,.part3{
        text-align: left;
        padding-left: 5vw;
        border-bottom: 1px solid #eee;
        overflow: hidden;
    }
    .part1 li{
        width: 50%;
        float: left;
        padding-right: 5vw;
        box-sizing: border-box;
    }
    .part2{
        max-height: 290px;
        text-align: center;
    }
    .p2_tit{
        overflow: hidden;
    }
    .p2_tit>p:nth-child(1){
        float: left;
    }
    .p2_tit>a>p{
        float: right;
    }
    .p3_tit{
        overflow: hidden;
    }
    .p3_radio{
        float: left;
        margin: 20.67px 20px;
        font-size: 14px;
    }
    .p3_tit>p:nth-child(1){
        float: left;
    }
    .p3_tit>a>p.grey{
        float: right;
    }
    .svg{
        width: 20%;
        height: 230px;
        float: left;
    }
    .svg_work{
        width: 49%;
        height: 400px;
        float: left;
    }
</style>

<script>
let echarts = require('echarts/lib/echarts');
// 引入饼图组件
require('echarts/lib/chart/pie')
require('echarts/lib/chart/bar')
// 引入提示框和图例组件
require('echarts/lib/component/tooltip')
require('echarts/lib/component/legend')
require('echarts/lib/component/title')
  require('echarts/lib/component/graphic')
export default {
    name:'manager_index',
    data:function(){
        return {
            time:{remin:'300',all:'1000'},
            worker:{num:'8',all:'10'},
            mission_data:[],
            worker_data:[],
            time_past:2,
            callTaskCode:null
        }
    },
    mounted() {
        this.$ajax.post(this.$preix+'/new/getIndexData'
        ).then( res=>{
        if(res.data.code==200){
                this.time.remin=res.data.info.companySituationDto.remainingCallTime;
                this.worker.num=res.data.info.companySituationDto.activeSeatNum;
                this.worker.all=res.data.info.companySituationDto.seatNum;
            }
        });
        this.$ajax.post(this.$preix+'/new/calltask/queryIndexCallTaskList',[]
        ).then( res=>{
            this.callTaskCode=res.data.code;
            if(res.data.code==200){
                this.mission_init(res.data.info)
            }
        });
        this.init(this.time_past);
    },
    computed:{
        //计算属性，计算剩余时间和坐席的比例
        time_scale:function(){
            return (this.time.remin/this.time.all)*100
        },
        worker_scale:function(){
            return (this.worker.num/this.worker.all)*100
        }
    },
    methods:{
        //画饼图
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
                title:{
                    text:item.id,
                    top:'0px',
                    left:'center',
                    textStyle:{
                        fontSize:14,
                        color:'#333'
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
        //画第一张柱图
        drawLine:function(item){
            var myChart = echarts.init(document.getElementsByClassName('svg_work')[0]);
            var compare = function (obj1, obj2) {
                var val1 = obj1.talkedDuration;
                var val2 = obj2.talkedDuration;
                if (val1 < val2) {
                    return 1;
                } else if (val1 > val2) {
                    return -1;
                } else {
                    return 0;
                }            
            }
            item.sort(compare);
            var arr_person=[];
            var arr_time=[];
            for(let i=0;i<item.length;i++){
                arr_person.push(item[i].shortName)
                arr_time.push(item[i].talkedDuration)
            }
            var option = {
                title: {
                    text: '坐席呼叫时长(min)',
                    bottom:'0px',
                    left:'left',
                    textStyle:{
                        fontSize:12,
                        color:'#999',
                        fontWeight:'100'
                    }
                },
                barWidth:'5%',
                barMinHeight :'12px',
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '10%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: [0, 0.01],
                    splitLine:{show: false},
                    data: arr_person
                },
                yAxis: {
                    type: 'value',
                    splitLine:{
                        lineStyle:{
                            type:'dashed'
                        },
                        show:true
                    }
                },
                series: [
                    {
                        type: 'bar',
                        color:'#7496F2',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:'#7496F2'
                            }
                        },
                        data: arr_time
                    }
                ]
            };
            myChart.setOption(option);
        },
        //画第二张柱图
        drawLines:function(item){
            var myChart = echarts.init(document.getElementsByClassName('svg_work')[1]);
            var compare = function (obj1, obj2) {
                var val1 = obj1.failureNum+obj1.progressingNum+obj1.shortName;
                var val2 = obj2.failureNum+obj2.progressingNum+obj2.shortName;
                if (val1 < val2) {
                    return 1;
                } else if (val1 > val2) {
                    return -1;
                } else {
                    return 0;
                }            
            } 
            item.sort(compare);
            var arr_person=[];
            var arr_success=[];
            var arr_fail=[];
            var arr_doing=[];
            for(let i=0;i<item.length;i++){
                arr_person.push(item[i].shortName)
                arr_success.push(item[i].successNum)
                arr_fail.push(item[i].failureNum)
                arr_doing.push(item[i].progressingNum)
            }
            var option = {
                title: {
                    text: '坐席通话人数',
                    bottom:'0px',
                    left:'left',
                    textStyle:{
                        fontSize:12,
                        color:'#999',
                        fontWeight:'100'
                    }
                },
                barWidth:'5%',
                barMinHeight :'12px',
                legend: {
                    data:['发展成功', '发展失败','继续跟进'],
                    bottom:0,
                    left:'right',
                    itemWidth:15,
                    itenHeight:15,
                    pageTextStyle:{
                        fontSize:12,
                        color:'#999',
                        fontWeight:'100'
                    }
                },
                calculable : true,
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '10%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: [0, 0.01],
                    splitLine:{show: false}, 
                    data: arr_person
                },
                yAxis: {
                    type: 'value',
                    splitLine:{
                        lineStyle:{
                            type:'dashed'
                        },
                        show:true
                    }
                },
                series: [
                    {
                        type: 'bar',
                        name:'发展成功',
                        color: '#83CA0D',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:'#83CA0D'
                            }
                        },
                        data: arr_success
                    },
                    {
                        type: 'bar',
                        name:'发展失败',
                        color: '#EF5679', 
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:'#EF5679'
                            }
                        },
                        data: arr_fail
                    },{
                        type: 'bar',
                        name:'继续跟进',
                        color:'#7496F2',
                        stack: '总量',
                        label: {
                            normal: {
                                show: true,
                                position: 'insideRight'
                            }
                        },
                        itemStyle:{
                            normal:{
                                color:'#7496F2'
                            }
                        },
                        data: arr_doing
                    }
                ]
            };
            myChart.setOption(option);
        },
        //单选统计时间
        change:function(){
            this.init(this.time_past);
        },
        //到时候配合ui图做处理，柱图数据
        worker_time_init:function(item){
            this.drawLine(item)
        },
        //到时候配合ui图做处理，柱图数据
        worker_person_init:function(value){
            this.drawLines(value)
        },
        //处理饼图数据
        mission_init:function(item){
            for(let i=0;i<5;i++){
                if(i<item.length){
                    var process=item[i].numberTotal!=0?Math.floor((item[i].failureNum+item[i].successNum)*100/item[i].numberTotal):0;
                    let obj={'id_num':i,'process':process,'id':item[i].taskName,'key':item[i].taskId,'showLegend':i==0,data:[{'name':'发展成功','value':item[i].successNum},{'name':'发展失败','value':item[i].failureNum},{'name':'继续跟进','value':item[i].processingNum},{'name':'未分配','value':item[i].unallocatedNum}]}
                    this.drawPie(obj);
                }else{
                    item.showLegend=false;
                    let obj={'id_num':i,'showLegend':i==0};
                    this.drawPie(obj);
                }
            }
        },
        //格式化时间
        date_init(date){
            let year=date.getFullYear();
            let month=(date.getMonth()+1)<10?("0"+(date.getMonth()+1)):(date.getMonth()+1);
            let day=date.getDate()<10?("0"+date.getDate()):date.getDate();
            return year+'-'+month+'-'+day+' 00:00:00';
        },
        init(num_pass){
            //今天
            if(num_pass==2){
                var beginTime=this.date_init(new Date(new Date().getTime() - 0*24*60*60*1000));
                var endTime=this.date_init(new Date(new Date().getTime() - 0*24*60*60*1000));
            }else{
                var beginTime=this.date_init(new Date(new Date().getTime() - num_pass*24*60*60*1000));
                var endTime=this.date_init(new Date(new Date().getTime() - 1*24*60*60*1000));
            }
            this.$ajax.post(this.$preix+'/new/callstatistics/querySeatsTalkedDurationChart',{'pageSize':10,beginTime:beginTime,endTime:endTime,'requireTotalCount':true}
            ).then( res=>{
                if(res.data.code==200){
                    this.worker_time_init(res.data.rows.length>0?res.data.rows:[{"shortName":"请选择", "talkedDuration":0}]);
                }
            });
            this.$ajax.post(this.$preix+'/new/callstatistics/querySeatsCalledNumTotalChart',{'pageSize':10,beginTime:beginTime,endTime:endTime,'requireTotalCount':true}
            ).then( res=>{
                if(res.data.code==200){
                    this.worker_person_init(res.data.rows.length>0?res.data.rows:[{"shortName":"请选择", "progressingNum":0}]);
                }
            });
        }
    }
}
</script>

