<template>
    <div class="container">
        <div class="part2">
            <div class="part2_tit">
                <el-input
                    placeholder="按坐席昵称或帐号搜索"
                    prefix-icon="el-icon-search"
                    v-model="search" class="search" size="mini">
                </el-input>
                <el-button type="primary" class="button" :style="{float:'left'}" @click="mission_search">搜索</el-button>
                <div class="time">
                    <p class="grey">查询时间</p>
                    <el-date-picker
                    @change="date_change"
                    v-model="leading_date"
                    :picker-options="pickerOptions"
                    type="daterange"
                    range-separator="-"
                    :start-placeholder="leading_record[0]" :style="{'float':'left'}"
                    :end-placeholder="leading_record[1]" size="mini" prefix-icon="date_icon el-icon-date" class="date_picker" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
            </div>
            <div style="position:relative">
                <noMission v-show="tableData != null && tableData.length == 0" @my_mounter="my_mounter"></noMission>
                <el-table :data="tableData" style="width: 100%;" empty-text=" " :default-sort = "{prop: 'date', order: 'descending'}" class="table">
                <el-table-column prop="shortName" label="坐席昵称" class-name="line2"  :show-overflow-tooltip=true min-width="100"> </el-table-column>
                <el-table-column prop="loginName" label="坐席帐号" class-name="line3" :show-overflow-tooltip=true min-width="100"> </el-table-column>
                <el-table-column prop="callTotal" label="总呼叫次数" class-name="line4" :show-overflow-tooltip=true min-width="110"> </el-table-column>
                <el-table-column prop="callTalkedTotal" label="总呼通次数" class-name="line5" :show-overflow-tooltip=true min-width="110"> </el-table-column>
                <el-table-column prop="callNumTotal" label="总呼叫人数" class-name="line6" :show-overflow-tooltip=true min-width="110"> </el-table-column>
                <el-table-column prop="callTalkedNumTotal" label="总呼通人数" class-name="line7" :show-overflow-tooltip=true min-width="110"> </el-table-column>
                <el-table-column prop="callDurationTotal" label="总呼叫时长(min)" class-name="line8" :show-overflow-tooltip=true min-width="130"> </el-table-column>
                <el-table-column prop="callTalkedDurationTotal" label="平均呼叫时长(min)" class-name="line8" :show-overflow-tooltip=true min-width="150"> </el-table-column>
                <el-table-column prop="p_caozuo" class-name="line11" label="操作"  min-width="60">
                    <template slot-scope="scope">
                        <router-link :to="{path:'./call_detail', query: { id: scope.row.seatAccountId,days:leading_record }}">
                        <el-button
                        size="mini" type="text">呼叫详单</el-button>
                        </router-link>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination layout="prev, pager, next" :page-size="10" :total="page_count" @current-change='page_change'>
            </el-pagination>
            </div>

        </div>

    </div>
</template>
<style scoped>
    .container{
        position: relative;
    }
    .part2_tit{
        margin: 20px 0;
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
    .time{
        float: left;
        overflow: hidden;
        margin: 0px 16px;
    }
    .time>p{
        float: left;
        padding: 4px 2px;
    }
    .time>p.grey{
        margin: 0 14px;
    }
    .tag{
        background-color: rgba(153, 153, 153, 1);
        color: #fff;
        font-size: 12px;
        border-radius: 0;
        height: 26px;
        line-height: 26px;
    }
    .date_picker{
        position: relative;
    }

    .table{
        font-size: 14px;
        margin-bottom: 10px;
    }
    .custom-tree-node{
        font-size: 12px;
        color: #444;
        font-weight: 400;
        padding-right: 18px;
    }
    #history{
        position: absolute;
        right: 0;
        top: 0;
        background-color: #fff;
        box-shadow:-2px 0 5px #ccc;
    }
</style>

<script>
import md5 from '../js/md5.js'
import noMission from '../component/noMission.vue'
export default {
    name:'call_count',
    data:function(){
        return {
            search:'',
            leading_date:null,
            tableData: null,
            label_list:[],
            tag_list:[],
            page_count:1,
            leading_record:null,
            pageNum:1,
            orderWay:null,
            orderField:null,
            pickerOptions:{
                disabledDate:(time)=>{
                    return time.getTime()>new Date().getTime()||time.getTime()<new Date(new Date().getTime() - 30*24*60*60*1000).getTime()
                }
            },
        }
    },
    components:{noMission},
    methods:{
        //时间改变
        date_change(){
            this.leading_record=this.leading_date;
            var data={'pageSize':10,beginDay:this.leading_date?this.leading_date[0]+' 00:00:00':null,endDay:this.leading_date?this.leading_date[1]+' 23:59:59':null,'requireTotalCount':true,'shortOrLoginName':this.search};
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.init(data);
        },
        //格式化时间到秒
        date_init(date){
            let year=date.getFullYear();
            let month=(date.getMonth()+1)<10?("0"+(date.getMonth()+1)):(date.getMonth()+1);
            let day=date.getDate()<10?("0"+date.getDate()):date.getDate();
            return year+'-'+month+'-'+day+' 00:00:00';
        },
        //格式化时间到天
        date_init_ymd(date){
            let year=date.getFullYear();
            let month=(date.getMonth()+1)<10?("0"+(date.getMonth()+1)):(date.getMonth()+1);
            let day=date.getDate()<10?("0"+date.getDate()):date.getDate();
            return year+'年'+month+'月'+day+'日';
        },
        init(data){
            this.$ajax.post(this.$preix+'/new/callstatistics/findCallStatisticsList',data
            ).then( res=>{
                if(res.data.code==200){
                    this.tableData=res.data.rows;
                    if(res.data.totalCount){
                        this.page_count=res.data.totalCount;
                    }
                }
            });
        },
        //条件搜索
        mission_search(){
            this.leading_record=this.leading_date;
            var data={'pageSize':10,beginDay:this.leading_date[0]+' 00:00:00',endDay:this.leading_date[1]+' 23:59:59','requireTotalCount':true,'shortOrLoginName':this.search};
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.init(data);
        },
        //页码改变
        page_change(val){
            this.pageNum=val;
            var data={'pageSize':10,beginDay:this.leading_date[0]+' 00:00:00',endDay:this.leading_date[1]+' 23:59:59','shortOrLoginName':this.search,'pageNum':val,"orderWay":this.orderWay,'orderField':this.orderField};
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.init(data);
        },
        //排序搜索
        sort_change({column, prop, order} ){
            this.orderWay=order.split('ending')[0];
            this.orderField=prop;
            var data={'pageSize':10,beginDay:this.leading_date[0]+' 00:00:00',endDay:this.leading_date[1]+' 23:59:59','shortOrLoginName':this.search,'pageNum':val,"orderWay":this.orderWay,'orderField':this.orderField};
            //删除空属性
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.init(data);
        },
        my_mounter(){
          this.search = '';
          this.leading_date = null;
          this.leading_record=[this.date_init_ymd(new Date()),this.date_init_ymd(new Date())];
          var data={'pageSize':10,beginDay:this.date_init(new Date()),endDay:this.date_init(new Date()),'requireTotalCount':true,'shortOrLoginName':this.search};
          for (let key in data){
            if(data[key]==''){
              delete data[key];
            }
          }
          this.init(data);
        }
    },
    mounted(){
        this.my_mounter();
    }
}
</script>
