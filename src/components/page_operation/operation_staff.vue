<template>
    <div class="container">
        <div class="part1">
            <div class="part1_tit">
                <div id="operate">
                    <el-button type="primary" size="mini" class="button" @click="selectreset">批量重置密码</el-button>
                    <p>选中&nbsp;<span class="blue">{{multipleSelection.length}}</span>&nbsp;个坐席</p>
                </div>
                <el-button type="primary" class="button" :style="{float:'right'}" @click="findSeat">搜索</el-button>
                <el-input
                    placeholder="按坐席昵称或帐号搜索"
                    prefix-icon="el-icon-search"
                    v-model="search" class="search" size="mini">
                </el-input>
            </div>
            <div class="zhankai" v-if="search_state==false">
                <el-button plain class="button" @click="search_change(true)">收起</el-button>
                <div>
                    <p class="grey">客户状态</p>
                    <p class="black" :class="{worker_active:worker_state==''}" @click="worker_change('')">全部</p>
                    <p class="black" :class="{worker_active:worker_state=='3'}" @click="worker_change('3')">停用</p>
                    <p class="black" :class="{worker_active:worker_state=='2'}" @click="worker_change('2')">冻结</p>
                    <p class="black" :class="{worker_active:worker_state=='1'}" @click="worker_change('1')">激活</p>
                </div>
                <div>
                    <p class="grey">创建时间</p>
                    <el-date-picker
                    v-model="search_date"
                    @change="date_change"
                    type="daterange"
                    range-separator="-"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期" size="mini" prefix-icon="date_icon el-icon-date" class="date_picker" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd">
                    </el-date-picker>
                </div>
            </div>
            <div class="zhankai" v-if="search_state">
                <el-button plain class="button" @click="search_change(false)">展开</el-button>
                <div>
                    <p class="grey">筛选条件</p>
                    <p class="black worker_active" v-show="worker_state==''">全部</p>
                    <p class="black worker_active" v-show="worker_state==3">停用</p>
                    <p class="black worker_active" v-show="worker_state==2">冻结</p>
                    <p class="black worker_active" v-show="worker_state==1">激活</p>
                    <p size="mini" type="primary" class="worker_active black" v-if="search_date!=null&&search_date.length>0">{{'创建时间： '+search_date[0]+'~'+search_date[1]}}</p>
                </div>
            </div>
            <div style="position:relative">
              <noMission v-show="tableData != null && tableData.length == 0" @my_mounter="my_mounter"></noMission>
              <el-table :data="tableData" style="width: 100%" empty-text=" " @sort-change="sort_change" class="table" @selection-change="handleSelectionChange" header-row-class-name="table_head">
                  <el-table-column type="selection" width="55"></el-table-column>
                  <el-table-column prop="loginName" label="坐席帐号" class-name="line1" label-class-name="line1_tit" sortable='custom' :show-overflow-tooltip=true min-width="120">
                      <template slot-scope="scope">
                          <p :style="{'color':'#3399ff'}" @click="handleDetail(scope.$index, scope.row)">
                              {{scope.row.loginName}}
                          </p>
                      </template>
                  </el-table-column>
                  <el-table-column prop="shortName" label="坐席昵称" class-name="line2" sortable='custom' :show-overflow-tooltip=true min-width="100">
                      <template slot-scope="scope">
                          <div class="father">
                              <p>{{scope.row.shortName}}</p>
                              <input type="text" @blur="upSeat(scope.$index, scope.row,'shortName')" v-model="scope.row.shortName">
                          </div>
                      </template>
                  </el-table-column>
                  <el-table-column prop="state" label="坐席状态" class-name="line3" sortable='custom' :show-overflow-tooltip=true min-width="100">
                      <template slot-scope="scope">
                          <div class="father">
                              <p v-show="scope.row.state==1">已激活</p>
                              <p v-show="scope.row.state==2">已冻结</p>
                              <p v-show="scope.row.state==3">已停用</p>
                              <select v-model="scope.row.state" @change="state_select(scope.row,scope.row.state)" v-if="scope.row.state==3 && accountType==2">
                                  <option value="3">停用</option>
                              </select>
                              <select v-model="scope.row.state" @change="state_select(scope.row,scope.row.state)" v-if="scope.row.state!=3 && accountType==2">
                                <option value="2">冻结</option>
                                <option value="1">激活</option>
                              </select>
                              <select v-model="scope.row.state" @change="state_select(scope.row,scope.row.state)" v-if="accountType!=2">
                                <option value="3">停用</option>
                                <option value="2">冻结</option>
                                <option value="1">激活</option>
                              </select>
                          </div>
                      </template>
                  </el-table-column>
                  <el-table-column prop="create" label="创建时间" class-name="line4" sortable='custom' :show-overflow-tooltip=true  min-width="120"> </el-table-column>
                  <el-table-column prop="recentCallTime" label="最近通话" class-name="line5" :show-overflow-tooltip=true  min-width="120"> </el-table-column>
                  <el-table-column prop="desc" label="备注" class-name="line6" :show-overflow-tooltip=true>
                      <template slot-scope="scope">
                          <div class="father">
                              <p>{{scope.row.desc}}</p>
                              <input type="text" @blur="upSeat(scope.$index, scope.row,'desc')" v-model="scope.row.desc">
                          </div>
                      </template>
                  </el-table-column>

                  <el-table-column prop="p_caozuo" class-name="line11" label="操作"  min-width="160">
                      <template slot-scope="scope">
                          <el-button
                          size="mini" type="text"
                          @click="handlereset(scope.$index, scope.row)">重置密码</el-button>
                      </template>
                  </el-table-column>
              </el-table>
              <el-pagination layout="prev, pager, next" :page-size="10" :total="page_count" @current-change='page_change'>
              </el-pagination>
            </div>
            <Dialog :message='message' :type='dialog_type' :show="dialog_show" :checkall="checkbox" @close='close'></Dialog>
            <el-dialog title="详情" :visible.sync="see" center>
                <div class="con">
                    <el-form :model="Form" :rules="rules" ref="Form" label-width="120px" class="demo-ruleForm" size="mini">
                        <el-form-item label="帐号" prop="loginName">
                            <el-input v-model="Form.loginName" :disabled="true"></el-input>
                        </el-form-item>
                        <el-form-item label="昵称" prop="shortName">
                            <el-input v-model="Form.shortName"></el-input>
                        </el-form-item>
                        <el-form-item label="帐号状态" prop="state">
                            <el-select v-model="Form.state" placeholder="请选择帐号状态" v-if="Form.state==3 && accountType==2">
                              <el-option label="停用" :value="3"></el-option>
                            </el-select>
                            <el-select v-model="Form.state" placeholder="请选择帐号状态" v-if="Form.state!=3 && accountType==2">
                                <el-option label="激活" :value="1"></el-option>
                                <el-option label="冻结" :value="2"></el-option>
                            </el-select>
                            <el-select v-model="Form.state" placeholder="请选择帐号状态" v-if="accountType!=2">
                              <el-option label="激活" :value="1"></el-option>
                              <el-option label="冻结" :value="2"></el-option>
                              <el-option label="停用" :value="3"></el-option>
                            </el-select>
                        </el-form-item>
                        <ul>
                            <li v-if="accountType != 2">
                              <p class="black">合作商ID：</p>
                              <div class="grey">{{Form.partnerAccountId}}</div>
                            </li>
                            <li v-if="accountType != 2">
                                <p class="black">id：</p>
                                <div class="grey">{{Form.id}}</div>
                            </li>
                            <li>
                                <p class="black">创建日期：</p>
                                <div class="grey">{{Form.create}}</div>
                            </li>
                            <li>
                                <p class="black">更新日期：</p>
                                <div class="grey">{{Form.update}}</div>
                            </li>
                          <li v-if="accountType != 2">
                            <p class="black">realm：</p>
                            <div class="grey">{{Form.realm}}</div>
                          </li>
                          <li>
                            <p class="black">呼叫间隔(秒)：</p>
                            <div class="grey">{{Form.sessiontimers}}</div>
                          </li>
                          <li v-if="accountType != 2">
                            <p class="black">socket：</p>
                            <div class="grey">{{Form.socket}}</div>
                          </li>
                          <li v-if="accountType != 2">
                            <p class="black">uri：</p>
                            <div class="grey">{{Form.uri}}</div>
                          </li>
                          <li v-if="accountType != 2">
                            <p class="black">wsProt：</p>
                            <div class="grey">{{Form.wsProt}}</div>
                          </li>
                        </ul>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="see=false">&#12288;取消&#12288;</el-button>
                    <el-button type="primary" @click="submitForm('Form')">&#12288;提交&#12288;</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<style scoped>
    .blue{
        font-size: 16px;
    }
    ul{
        margin: 0;
        padding-top: 18px;
        border-top: 1px solid #e4e4e4;
    }
    li{
        margin-bottom: 18px;
    }
    li>p{
        width: 120px;
        text-align: right;
        float: left;
        margin: 0;
    }
    li>div{
        margin-left: 120px;
    }
    .part1_tit{
        margin: 20px 0;
        overflow: hidden;
    }
    .search{
        float: right;
        width: 200px;
        font-size: 12px;
    }
    .part1_tit .button{
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

    #operate{
        overflow: hidden;
        float: left;
    }
    #operate p{
        float: left;
        margin:0px 8px;
        line-height: 29px;
    }
    #operate .button{
        float: left;
        margin:0px 8px;
    }
</style>

<script>
import Dialog from "../component/dialog_worker.vue"
import jsonfy from "../jsonfy.js"
import noMission from '../component/noMission.vue'
export default {
    name:'operation_staff',
    data:function(){
        return {
            worker_state:'',
            search_state:false,
            search_date:null,
            search:'',
            tableData:null,
            multipleSelection: [],
            message:[],
            dialog_type:'0',
            dialog_show:false,
            checkbox:false,
            page_count:1,
            pageNum:1,
            orderWay:null,
            orderField:null,
            see:false,
            accountType:null,
            Form: {
                loginName: null,
                shortName: null,
                state: null
            },
            rules: {
                loginName: [
                    { required: true, message: '请输入帐号', trigger: 'blur' }
                ],
                shortName: [
                    { required: true, message: '请输入昵称', trigger: 'blur' }
                ],
                state: [
                    { required: true, message: '请选择状态', trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        handleDetail(index,row){
            this.$ajax.post(this.$preix+'/new/account/seatDetailView',{'id':row.id}).then(res=>{
              if(res.data.code==200){
                this.Form=res.data.info;
              }
            });
            this.see=true;
        },
        worker_change:function(value){
            this.dialog_show=false;
            this.worker_state=value;
            this.findSeat();
        },
        date_change(){
            this.findSeat();
        },
        search_change:function(value){
            this.search_state=value;
        },
        close(){
            this.dialog_show=false;
        },
        //
        handlereset(index, row,e){
            this.message=[];
            this.$ajax.post(this.$preix+'/new/account/batchUpdateSeat',[{'id':row.id,'password':'reset','shortName':row.shortName,'loginName':row.loginName}])
            .then( (res) => {
                if(res.data.code==200){
                    this.message=res.data.info;
                    this.dialog_type=1;
                    this.checkbox=false;
                    this.dialog_show=true;
                }
            })
        },
        selectreset:function(){
            if(this.multipleSelection.length>0){
                var data=[];
                for(let i=0;i<this.multipleSelection.length;i++){
                    data.push({'id':this.multipleSelection[i].id,'shortName':this.multipleSelection[i].shortName,'password':'reset','loginName':this.multipleSelection[i].loginName})
                }
                this.$ajax.post(this.$preix+'/new/account/batchUpdateSeat',data)
                .then( (res) => {
                    if(res.data.code==200){
                        this.message=res.data.info;
                        this.dialog_type=1;
                        this.checkbox=true;
                        this.dialog_show=true;
                    }
                })
            }
        },
        handleSelectionChange:function(val){
            this.multipleSelection = val;
            this.dialog_show=false;
        },
        reset:function(){
            this.dialog_show=false;
        },
        seat_init(data){
            this.$ajax.post(this.$preix+'/new/account/findSeatList',data)
            .then( (res) => {
                if(res.data.code==200){
                    this.tableData=res.data.rows;
                    if(res.data.totalCount){
                        this.page_count=res.data.totalCount;
                    }
                }
            })
        },
        //条件搜索
        findSeat:function(){
            var data={
                'state':this.worker_state,'startTime':this.search_date!=null?this.search_date[0]+' 23:59:59':"",'endTime':this.search_date!=null?this.search_date[1]+' 23:59:59':"",'requireTotalCount':true,'loginOrShortName':this.search,'partnerAccountId':this.$route.query.partnerAccountId
            };
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.seat_init(data);
        },
        //排序搜索
        sort_change({column, prop, order} ){
            this.orderWay=order.split('ending')[0];
            this.orderField=prop;
            var data={'state':this.worker_state,'startTime':this.search_date!=null?this.search_date[0]+' 23:59:59':"",'endTime':this.search_date!=null?this.search_date[1]+' 23:59:59':"",'requireTotalCount':true,'fullNameOrEmail':this.search,'pageNum':this.pageNum,"orderWay":this.orderWay,'orderField':this.orderField,'partnerAccountId':this.$route.query.partnerAccountId};
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
            var data={'state':this.worker_state,'startTime':this.search_date!=null?this.search_date[0]+' 23:59:59':"",'endTime':this.search_date!=null?this.search_date[1]+' 23:59:59':"",'requireTotalCount':true,'fullNameOrEmail':this.search,'pageNum':this.pageNum,"orderWay":this.orderWay,'orderField':this.orderField,'partnerAccountId':this.$route.query.partnerAccountId};
            for (let key in data){
                if(data[key]==''){
                    delete data[key];
                }
            }
            this.seat_init(data);
        },
        upSeat:function(index,row,item){
            var item=item;
            var changeitem=row[item];
            var data={
                'id':row.id
            };
            jsonfy.jsonfy(data,item,changeitem);
            this.$ajax.post(this.$preix+'/new/account/updateSeat',data)
            .then( (res) => {
                if(res.data.code==200){
                  this.$message({message: '修改成功',type: 'success'});
                }else {
                  this.$message({message: res.data.message,type: 'error'});
                }
            })
            .catch(res=>{
                alert('修改失败哦')
            })
        },
        state_select(row,state){
            this.$ajax.post(this.$preix+'/new/account/updateSeat',{'id':row.id,'state':state})
            .then( (res) => {
              if(res.data.code==200){
                this.$message({message: '修改成功',type: 'success'});
              }else {
                this.$message({message: res.data.message,type: 'error'});
              }
            })
            .catch(res=>{
                alert('修改失败哦')
            })
        },
        submitForm(formName){
            console.log(this.$refs[formName]);
            var _this=this;
            var data=this.Form;
            for(let key in data){
                if(data[key]==null||data[key]==''){
                    delete data[key]
                }
            }
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.$ajax.post(this.$preix+'/new/account/updateSeat',data)
                    .then( (res) => {
                        if(res.data.code==200){
                            _this.reload()
                        }
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        my_mounter(){
          this.worker_state = '';
          this.search_date = null;
          var partnerAccountId=this.$route.query.partnerAccountId;
          if(partnerAccountId){
            this.seat_init({requireTotalCount:true,orderField:'create',orderWay:'desc',partnerAccountId:partnerAccountId});
          }else{
            this.orderWay='desc';
            this.orderField='create';
            this.seat_init({requireTotalCount:true,orderField:'create',orderWay:'desc'});
          }
          this.accountType = JSON.parse(window.sessionStorage.getItem("userInfoLst"))[0].type;
        }
    },
    components:{
        Dialog,
        noMission
    },
    mounted:function(){
        this.my_mounter();
    },
    inject:['reload']
}
</script>
