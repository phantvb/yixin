<template>
    <div class="container" @click="hiddenSel">
        <div class="nav">外呼任务跟踪</div>
        <div :style="{'position':'relative'}">
            <div v-show="blank" id="mask">
                <div>
                    <i class="el-icon-noMission"></i>
                    <el-button type="primary"  class="button" @click="lead_in">导入客户</el-button>
                </div>
            </div>
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
                <img src="../../../static/icon/legend_staff.png" alt="" style="height:1vw;" v-show="checkedlist.length>0">
            </div>
            <div class="part1_nav">
                <p class="grey">选择展示任务</p>
                <el-checkbox-group v-model="checkedlist" :min="1" class="ul" :style="{'text-align':'left','padding':'0 8px','background-color':'#FBFBFB'}" @change="show_mission">
                    <el-checkbox v-for="(item) in position" :label="item.taskId" :key="item.taskId" class="li">{{item.taskName}}</el-checkbox>
                </el-checkbox-group>
            </div>
        </div>
        <div class="part2">
            <div class="part2_tit">
                <el-button type="primary"  class="button" @click="lead_in">导入客户</el-button>
                <el-button type="primary" class="button" :style="{float:'right'}" @click="missoin_search">搜索</el-button>
                <el-input
                    placeholder="按任务名称搜索"
                    prefix-icon="el-icon-search"
                    v-model="search" class="search" size="mini">
                </el-input>
                <Dialog v-bind:leading="leading" @reset="reset" :data="lead_data"></Dialog>
            </div>
            <div class="zhankai" v-if="search_state==false">
                <el-button class="button" @click="search_change(true)">收起</el-button>
                <div>
                    <p class="grey">可见状态</p>
                    <p class="black" :class="{see_active:see_state==''}" @click="see_change('')">全部</p>
                    <p class="black" :class="{see_active:see_state=='1'}" @click="see_change('1')">所有人可见</p>
                    <p class="black" :class="{see_active:see_state=='0'}" @click="see_change('0')">仅管理员可见</p>
                </div>
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
                    <el-tag type="info" class="tag" v-show="see_state=='1'">所有人可见</el-tag>
                    <el-tag type="info" class="tag" v-show="see_state=='0'">仅管理员可见</el-tag>
                    <el-tag type="info" class="tag" v-show="see_state==''">可见状态：全部</el-tag>
                    <el-tag type="info" class="tag" v-if="search_date!=null&&search_date.length>0">{{'创建时间： '+search_date[0]+'~'+search_date[1]}}</el-tag>
                </div>
            </div>
            <el-table :data="tableData" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" class="table" @sort-change="sort_change">
                <el-table-column label="任务名称" class-name="line1" label-class-name="line1_tit" :show-overflow-tooltip=true min-width="120">
                    <template slot-scope="scope">
                        <router-link :to="{path:'./detail', query: { id: scope.row.id , taskName : scope.row.name }}">
                            {{scope.row.name}}
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column prop="numberTotal" label="总客户" class-name="line2" sortable='custom'  :show-overflow-tooltip=true min-width="85"> </el-table-column>
                <el-table-column label="已分配" class-name="line3" :show-overflow-tooltip=true >
                    <template slot-scope="scope">
                        {{scope.row.numberTotal-scope.row.unallocatedNum}}
                    </template>
                </el-table-column>
                <el-table-column prop="calledNum" label="已呼" class-name="line4" sortable='custom' :show-overflow-tooltip=true> </el-table-column>
                <el-table-column prop="successNum" label="成功" class-name="line5" sortable='custom' :show-overflow-tooltip=true> </el-table-column>
                <el-table-column prop="failureNum" label="失败" class-name="line6" sortable='custom' :show-overflow-tooltip=true> </el-table-column>
                <el-table-column prop="processingNum" label="跟进" class-name="line7" sortable='custom' :show-overflow-tooltip=true> </el-table-column>
                <el-table-column prop="tags" label="关联客户标签" class-name="line8" :show-overflow-tooltip=true min-width="160">
                    <template slot-scope="scope">
                        <p><span v-for="(item,index) in scope.row.tags" :key="index" v-show="!scope.row.showSel" @click="scope.row.showSel=!scope.row.showSel">{{item.tagName?item.tagName:item}};</span></p>
                        <span v-show="!scope.row.showSel" @click="scope.row.showSel=!scope.row.showSel" v-if="scope.row.tags.length==0">暂无关联标签，点击修改</span>
                        <el-select  size="mini" v-model="scope.row.tags" multiple collapse-tags placeholder="请选择" v-show="scope.row.showSel" @change="updateSel(scope.$index, scope.row)" popper-class="sel" @focus="scope.row.tags=[]">
                            <el-option v-for="item in allTagList" :key="item.id" :label="item.tagName" :value="item.tagName">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column prop="create" label="创建时间" class-name="line9" :show-overflow-tooltip=true min-width="120" sortable='custom'> </el-table-column>
                <el-table-column prop="visibleState" label="可见状态" class-name="line10" :show-overflow-tooltip=true min-width="100">
                    <template slot-scope="scope">
                        <div class="father">
                            <p v-show="scope.row.visibleState==0">仅管理员可见</p>
                            <p v-show="scope.row.visibleState==1">所有人可见</p>
                            <select v-model="scope.row.visibleState" @change="state_select(scope.row,scope.row.visibleState)">
                                <option value="1">所有人可见</option>
                                <option value="0">仅管理员可见</option>
                            </select>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="p_caozuo" class-name="line11" label="操作"  min-width="160">
                    <template slot-scope="scope">
                        <el-button
                        size="mini" type="text"
                        @click="handlefp(scope.$index, scope.row)" :disabled="scope.row.unallocatedNum==0">分配客户</el-button>&#12288;|
                        <el-button
                        size="mini"
                        type="text"
                        @click="handlefr(scope.$index, scope.row)">导入客户</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination layout="prev, pager, next" :page-size="10" :total="page_count" @current-change='page_change'>
            </el-pagination>
        </div>
        </div>

        <assign v-bind:assign="assign" :total='p_assign' @reset="reset" :taskId="taskId"></assign>
    </div>
</template>
<style scoped>
    .container{
        position: relative;
    }
    #mask{
        position:absolute;
        left:0;
        top:0;
        width:100%;
        height: 80vh;
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
    }
    .part1_nav .grey{
        text-align:left;
        padding:0 8px;
        margin: 0;
        font-size: 14px;
        color: #666;
    }
    .part2_tit{
        margin: 0 0 10px;
        overflow: hidden;
    }
    .search{
        float: right;
        width: 200px;
        font-size: 12px;
    }
    .part2_tit .button{
        float: left;
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
let echarts = require('echarts/lib/echarts')
  // 引入饼图组件
  require('echarts/lib/chart/pie')
  // 引入提示框和图例组件
  require('echarts/lib/component/tooltip')
  require('echarts/lib/component/legend')
  require('echarts/lib/component/title')
  require('echarts/lib/component/graphic')
  import Dialog from "../component/dialog.vue"
  import assign from "../component/dialog_assign.vue"
export default {
    name:'missoin_follow',
    data:function(){
        return {
            missoin_data:[],
            position:[],
            checkedlist:[,],
            search:'',
            search_state:false,
            see_state:'',
            search_date:null,
            leading:false,
            assign:false,
            p_assign:'',
            tableData: [],
            page_count:1,
            taskId:null,
            pageNum:1,
            orderWay:null,
            orderField:null,
            lead_data:null,
            blank:false,
            allTagList:[],
            upTagTimer:null
        }
    },
    components:{
      Dialog,assign
    },
    methods:{
        hiddenSel(){
            // this.tableData.map(item=>{
            //     item.showSel=false;
            // })
        },
        //画饼图
        drawPie:function(item,clear){
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
                    let obj={'id_num':i,clear:true};
                    this.drawPie(obj);
                }

            }
        },
        //修改关联客户标签
        updateSel(index,row){
            row.showSel=false;
            var arr=[];
            var _this=this;
            row.tags.map((item,index)=>{
                for(var i=0;i<this.allTagList.length;i++){
                    if(item==this.allTagList[i].tagName){
                        arr.push(this.allTagList[i].id);
                    }
                }
            })
            this.$ajax.post(this.$preix+'/new/calltask/updateCallTask',{'taskId':row.id,'tagIds':arr})
            .then( (res) => {
                clearTimeout(this.upTagTimer);
                if(res.data.code==200){
                    _this.upTagTimer=setTimeout(function(){
                        _this.$message({
                            showClose: true,
                            message: '修改成功',
                            type: 'success'
                        });
                    },1000)
                }
            })
            .catch(res=>{
                this.$message({
                    showClose: true,
                    message: res.data.message?res.data.message:'修改失败哦',
                    type: 'warning'
                });
            })
        },
        see_change:function(value){
            this.see_state=value;
            this.missoin_search();
        },
        date_change(){
            this.missoin_search();
        },
        search_change:function(value){
            this.search_state=value;
        },
        //打开导入客户弹窗
        lead_in:function(){
            this.lead_data=null;
            this.leading = true;
            this.assign=false;
        },
        //打开分配客户弹窗
        handlefp:function(index,row){
            this.assign=true;
            this.leading=false;
            this.p_assign=row.unallocatedNum;
            this.taskId=row.id;
        },
        //导入客户给指定任务
        handlefr:function(index,row){
            console.log(index,row);
            this.lead_data=row;
            this.leading = true;
            this.assign=false;
        },
        //关闭弹窗
        reset:function(){
            this.assign=false;
            this.leading=false;
        },
        show_mission(){
            if(this.checkedlist.length>5){
                this.checkedlist.shift();
            }
            //选择展示任务
            this.$ajax.post(this.$preix+'/new/calltask/queryIndexCallTaskList',
                this.checkedlist
            ).then((res)=>{
                this.missoin_init(res.data.info?res.data.info:[]);
            })
        },
        //页码改变
        page_change(val){
            this.pageNum=val;
            var data={startTime:this.search_date!=null?this.search_date[0]+' 00:00:00':'',endTime:this.search_date!=null?this.search_date[1]+' 23:59:59':'',nameLike:this.search,visibleState:this.see_state,pageNum:val,"orderWay":this.orderWay,'orderField':this.orderField};
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.$ajax.post(this.$preix+'/new/calltask/queryCallTaskList',data)
            .then( (res) => {
                if(res.data.code==200){
                    res.data.rows.map(item=>item.showSel=false);
                    this.tableData=res.data.rows;
                }
            })
        },
        //条件搜索
        missoin_search:function(){
            var data={startTime:this.search_date!=null?this.search_date[0]+' 00:00:00':'',endTime:this.search_date!=null?this.search_date[1]+' 23:59:59':'',nameLike:this.search,visibleState:this.see_state,requireTotalCount:true};
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.$ajax.post(this.$preix+'/new/calltask/queryCallTaskList',data)
            .then( (res) => {
                if(res.data.code==200){
                    res.data.rows.map(item=>item.showSel=false);
                    this.tableData=res.data.rows;
                    this.page_count=res.data.totalCount;
                }
            })
        },
        //排序搜索
        sort_change({column, prop, order} ){
            this.orderWay=order.split('ending')[0];
            this.orderField=prop;
            var data={
                startTime:this.search_date!=null?this.search_date[0]+' 00:00:00':'',endTime:this.search_date!=null?this.search_date[1]+' 23:59:59':'',nameLike:this.search,visibleState:this.see_state,"orderWay":order.split('ending')[0],'orderField':prop,'pageNum':this.pageNum
            };
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.$ajax.post(this.$preix+'/new/calltask/queryCallTaskList',data)
            .then( (res) => {
                res.data.rows.map(item=>item.showSel=false);
                this.tableData=res.data.rows;
            })
        },
        state_select(row,state){
            this.$ajax.post(this.$preix+'/new/calltask/updateCallTask',{'taskId':row.id,'visibleState':state})
            .then( (res) => {
                if(res.data.code==200){
                    this.$message({
                        showClose: true,
                        message: '修改成功',
                        type: 'success'
                    });
                }
            })
            .catch(res=>{
                this.$message({
                    showClose: true,
                    message: '修改失败哦',
                    type: 'warning'
                });
            })
        }
    },
    mounted:function(){
        //标签数据
        this.$ajax.post(this.$preix+'/new/tag/findTagList')
          .then( (res) => {
            if(res.data.code==200){
              console.log(res);
              this.allTagList=res.data.info;
          }
        });
        //左侧饼图数据
        this.$ajax.post(this.$preix+'/new/calltask/queryIndexCallTaskList')
        .then( (res) => {
            if(res.data.code==200){
                var arr=[];
                res.data.info.map(item=>{
                    arr.push(item.taskId);
                })
                this.checkedlist=arr;
                this.missoin_init(res.data.info);
            }
        });
        //右侧任务多选列表
        this.$ajax.post(this.$preix+'/new/calltask/queryRightCallTaskList',{'pageSize':200})
        .then( (res) => {
            if(res.data.code==200){
                this.position=res.data.rows;
            }
        });
        //下方任务列表
        this.orderWay='desc';
        this.orderField='create';
        this.$ajax.post(this.$preix+'/new/calltask/queryCallTaskList',{requireTotalCount:true,"orderField":'create',"orderWay":'desc'})
        .then( (res) => {
            if(res.data.code==200){
                this.page_count=res.data.totalCount;
                res.data.rows.map(item=>item.showSel=false);
                this.tableData=res.data.rows;
                if(res.data.rows.length<1){
                    this.blank=true;
                }
            }
        })
    }
}
</script>

