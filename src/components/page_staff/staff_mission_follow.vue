<template>
    <div class="container">
        <div class="nav">外呼任务跟踪</div>
        <div class="part1">
            <div class="part1_show">
                <div class="svg_empty_right" v-show="checkedlist.length==0">
                    <div>
                        选择右侧任务
                    </div>
                </div>
                <div class="svg" v-show="checkedlist.length>0"></div>
                <div class="svg" v-show="checkedlist.length>0"></div>
                <div class="svg" v-show="checkedlist.length>0"></div>
                <div class="svg" v-show="checkedlist.length>0"></div>
                <div class="svg" v-show="checkedlist.length>0"></div>
                <img src="../../../static/icon/legend_staff.png" alt="" style="height:12px;" v-show="checkedlist.length>0">
            </div>
            <div class="part1_nav">
                <p class="grey">选择展示任务</p>
                <el-checkbox-group v-model="checkedlist" :min="1" class="ul" :style="{'text-align':'left','margin':'10px auto','padding':'0 8px','overflow-x': 'hidden'}" @change="show_mission">
                    <el-checkbox v-for="(item) in position" :label="item.taskId" :key="item.taskId" class="li">{{item.taskName}}</el-checkbox>
                </el-checkbox-group>
            </div>
        </div>
        <div class="part2">
            <div class="part2_tit">
                <el-input
                    placeholder="按任务名称搜索"
                    prefix-icon="el-icon-search"
                    v-model="search" class="search" size="mini">
                </el-input>
                <el-button type="primary" class="button" :style="{float:'left'}" @click="missoin_search">搜索</el-button>
            </div>
            <div class="zhankai" v-if="search_state==false">
                <el-button class="button" @click="search_change(true)">收起</el-button>

                <div>
                    <p class="grey">创建时间</p>
                    <el-date-picker v-model="search_date" @change="date_change" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" size="mini"  prefix-icon="date_icon el-icon-date" class="date_picker" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
            </div>
            <div class="zhankai" v-if="search_state">
                <el-button plain class="button" @click="search_change(false)">展开</el-button>
                <div>
                    <p class="grey">筛选条件</p>
                    <el-tag type="info" class="tag" v-if="search_date!=null&&search_date.length>0">{{'创建时间： '+search_date[0]+'~'+search_date[1]}}</el-tag>
                </div>
            </div>
            <div style="position:relative">
              <noMission v-show="tableData != null && tableData.length == 0" @my_mounter="my_mounter"></noMission>
              <el-table :data="tableData" style="width: 100%" empty-text=" " :default-sort = "{prop: 'date', order: 'descending'}" class="table" @sort-change="sort_change">
                  <el-table-column label="任务名称" class-name="line1" label-class-name="line1_tit" :show-overflow-tooltip=true min-width="120">
                      <template slot-scope="scope">
                          <router-link :to="{path:'./detail', query: { id: scope.row.taskId , taskName : scope.row.name }}">
                              {{scope.row.name}}
                          </router-link>
                      </template>
                  </el-table-column>
                  <el-table-column prop="allocatedNum" label="总客户" class-name="line2" sortable='custom'  :show-overflow-tooltip=true> </el-table-column>
                  <el-table-column prop="calledNum" label="已呼" class-name="line4" sortable='custom' :show-overflow-tooltip=true> </el-table-column>
                  <el-table-column prop="successNum" label="成功" class-name="line5" sortable='custom' :show-overflow-tooltip=true> </el-table-column>
                  <el-table-column prop="failureNum" label="失败" class-name="line6" sortable='custom' :show-overflow-tooltip=true> </el-table-column>
                  <el-table-column prop="processingNum" label="跟进" class-name="line7" sortable='custom' :show-overflow-tooltip=true> </el-table-column>
                  <el-table-column prop="tags" label="关联客户标签" class-name="line8" :show-overflow-tooltip=true min-width="150">
                      <template slot-scope="scope">
                          <span v-for="(item,index) in scope.row.tags" :key="index">{{item.tagName}};</span>
                      </template>
                  </el-table-column>
                  <el-table-column prop="create" label="创建时间" class-name="line9" sortable='custom' :show-overflow-tooltip=true min-width="120"> </el-table-column>
              </el-table>
              <el-pagination layout="prev, pager, next" :page-size="10" :total="page_count" @current-change='page_change'>
              </el-pagination>
            </div>
        </div>
    </div>
</template>
<style scoped>
    .nav{
        line-height: 30px;
        text-align: left;
        background-color: #fff;
        padding: 0 10px;
        margin-bottom: 10px;
        box-sizing: border-box;
    }
    .part1{
        padding:17px 30px 10px;
        border-bottom: 1px solid #eee;
        overflow: hidden;
    }
    .part1>div{
        float: left;
    }
    .part1_show{
        width: 80%;
        float: left;
    }
    .part1_button{
        padding: 4px 12px;
        font-size: 12px;
        float: right;
        margin: 14px 10px 5px 0;
    }
    .svg{
        width: 20%;
        height: 180px;
        float: left;
    }
    .part1_nav{
        width: 20%;
        float: left;
        box-sizing: border-box;
        border: 1px solid #d4d4d4;
    }
    .part1_nav .grey{
        text-align:center;
        padding:8px 39px;
        margin: 0;
        border-bottom: 1px solid #d4d4d4;
        font-size: 14px;
        color: #333;
    }
    .part2_tit{
        margin: 0 0 10px;
        overflow: hidden;
    }
    .search{
        float: left;
        width: 200px;
        font-size: 12px;
    }
    .part2_tit .button{
        float: right;
        padding: 6px 14px;
        font-size: 12px;
        margin: 0 14px;
    }
    .date_picker{
        position: relative;
    }
    .table{
        font-size: 14px;
        margin-bottom: 10px;
    }

</style>

<script>
  import noMission from '../component/noMission.vue'
let echarts = require('echarts/lib/echarts')
  // 引入饼图组件
  require('echarts/lib/chart/pie')
  // 引入提示框和图例组件
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/legend')
  require('echarts/lib/component/title')
  require('echarts/lib/component/graphic')
export default {
    name:'staff_follow',
    data:function(){
        return {
            missoin_data:[],
            position:[],
            checkedlist:[,],
            search:'',
            search_state:false,
            search_date:null,
            tableData: null,
            page_count:1,
            pageNum:1,
            orderWay:null,
            orderField:null,
            indexlist:[]
        }
    },
    components:{noMission},
    methods:{
        //画饼图
        drawPie:function(item){
            var myChart = echarts.init(document.getElementsByClassName('svg')[item.id_num]);
            var option = {
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b}: {c} ({d}%)"
                },
                legend: {
                    x: 'left',
                    data:['发展成功','发展失败','未分配','继续跟进'],
                    show:item.showLegend,
                    orient:'vertical',
                    top:'14%',
                    icon:'circle'
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
                        text: item.process!==undefined?('完成'+item.process+'%'):null,
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
                        color:'#999'
                    }
                },
                series: [
                    {
                        name:'客户状态',
                        type:'pie',
                        radius: ['40px', '62px'],
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
        //初始化饼图数据
        missoin_init:function(item){
            for(let i=0;i<5;i++){
                if(i<item.length){
                    var process=item[i].numberTotal!=0?Math.floor((item[i].failureNum+item[i].successNum)*100/item[i].numberTotal):0;
                    let obj={'id_num':i,'process':process,'id':item[i].taskName,'key':item[i].taskId,data:[{'name':'发展成功','value':item[i].successNum},{'name':'发展失败','value':item[i].failureNum},{'name':'继续跟进','value':item[i].processingNum},{'name':'未分配','value':item[i].unallocatedNum}]}
                    this.drawPie(obj);
                }else{
                    let obj={'id_num':i};
                    this.drawPie(obj);
                }

            }
        },
        search_change:function(value){
            this.search_state=value;
        },
        date_change(){
            this.missoin_search();
        },
        show_mission(){
            if(this.checkedlist.length>5){
                this.checkedlist.shift();
            }
            //选择展示任务
            this.$ajax.post(this.$preix+'/new/calltask/queryTaskOnwallChartBySeat',
                this.checkedlist
            ).then((res)=>{
                if(res.data.code==200){
                    this.missoin_init(res.data.info);
                }
            })
        },
        //关闭弹窗
        reset:function(){
            this.assign=false;
            this.leading=false;
        },
        //排序搜索
        sort_change({column, prop, order} ){
            this.orderWay=order.split('ending')[0];
            this.orderField=prop;
            var data={startTime:this.search_date!=null?this.search_date[0]+' 00:00:00':'',endTime:this.search_date!=null?this.search_date[1]+' 23:59:59':'',nameLike:this.search,requireTotalCount:true,pageNum:val,"orderWay":this.orderWay,'orderField':this.orderField};
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.seat_init(data);
        },
        //页码改变
        page_change(val){
            this.pageNum=val;
            var data={startTime:this.search_date!=null?this.search_date[0]+' 00:00:00':'',endTime:this.search_date!=null?this.search_date[1]+' 23:59:59':'',nameLike:this.search,requireTotalCount:true,pageNum:val,"orderWay":this.orderWay,'orderField':this.orderField};
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.seat_init(data);
        },
        //条件搜索
        missoin_search:function(){
            var data={startTime:this.search_date!=null?this.search_date[0]+' 00:00:00':'',endTime:this.search_date!=null?this.search_date[1]+' 23:59:59':'',nameLike:this.search,requireTotalCount:true};
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.seat_init(data);
        },
        //下方任务列表
        seat_init(data){
            this.$ajax.post(this.$preix+'/new/seatCallTask/findSeatCallTaskList',data)
            .then( (res) => {
                if(res.data.code==200){
                    if(res.data.totalCount){
                        this.page_count=res.data.totalCount;
                    }
                    this.tableData=res.data.rows;
                }
            })
        },
        my_mounter(){
          this.search = '';
          this.search_date = null;
            //下方任务列表
            this.seat_init({requireTotalCount:true,'pageNum':1});
        }
    },
    mounted:function(){
        var _this=this;
        //右侧任务多选列表
        this.$ajax.post(this.$preix+'/new/calltask/queryTaskIntroOnWallBySeat',{"pageNum" : 1,"pageSize" : 200})
        .then( (res) => {
            if(res.data.code==200){
                this.position=res.data.rows;
            }
        });
        //左侧饼图数据
        this.$ajax.post(this.$preix+'/new/calltask/queryTaskOnwallChartBySeat')
        .then( (res) => {
            if(res.data.code==200){
                var arr=[];
                res.data.info.map(item=>{
                    arr.push(item.taskId);
                })
                this.checkedlist=arr;
                _this.missoin_init(res.data.info);
            }
        });
        this.my_mounter();
    }
}
</script>

