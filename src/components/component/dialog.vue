<template>
    <div id="dialog">
      <el-dialog title="导入客户" :visible.sync="leading" @close="close" @open="open">
        <el-steps :active="dialog_active" align-center>
          <el-step title="上传客户数据"></el-step>
          <el-step title="确认导入数据"></el-step>
          <el-step title="编辑导入任务"></el-step>
        </el-steps>
        <div v-show="dialog_active==0">
          <div class="upfiles">
            <input type="file"  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel" @change="upfiles">
            <div>
              <p>上传客户数据文档</p>
            </div>
          </div>
          <div class="note">
            请先<a :href="this.$preix+'/templets/callTaskImportTemplet.xlsx'">下载客户资源模板</a>，按照格式填写数据并上传。<br>
            请注意：<br>
            • 不要修改模板格式，以免数据读取失败；<br>
            • 同一呼叫任务内手机号相同的客户信息将会被覆盖；<br>
            • 单次导入数据不要超过1000条；
          </div>
        </div>
        <div  v-show="dialog_active==1&&leading_complete==0">
          <div v-loading="loading"></div>
          <el-button type="primary"  class="dialog_next" :disabled="leading_state">继续</el-button>
        </div>
        <div  v-show="dialog_active==1&&leading_complete==1">
          <div class="data_num">{{data_complete}}</div>
          <el-button type="primary"  class="dialog_next" @click="continueOperate">继续</el-button>
        </div>
        <div  v-show="dialog_active==2&&mission_edit==0">
          <div v-loading="confirm_loading"></div>
          <div class="mission" :style="{margin:'5% 0'}" v-show="!confirm_loading">
            <p>任务名称</p>
            <el-select id="taskName" style="width:300px;" v-model="mission_value" placeholder="请输入任务名称，若名称不存在视为创建新任务" size="mini" :filterable='true' :allow-create='true' :default-first-option='true' :disabled="data!=null"
                       @focus="queryCallTaskNameList" @keyup.native="queryCallTaskNameList" @change="checkedTags(mission_value)">
              <el-option v-for="item in mission_list" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
          <br>
          <div class="mission" :style="{margin:'0 0 10%'}" v-show="!confirm_loading">
            <p>关联客户标签</p>
            <el-checkbox-group v-model="tagIds" size="mini" name="mission_tag">
              <el-checkbox :label="item.id" border v-for="item in taglist" :key="item.id" :style="{'margin':'6px 4px','background-color': '#f8f8f8'}">{{item.tagName}}</el-checkbox>
            </el-checkbox-group>
          </div>
          <el-button type="primary" v-show="!confirm_loading"  class="dialog_next" @click="mission_confirm">确认信息</el-button>
        </div>
        <div  v-show="dialog_active==3">
          <div class="data_num"><i class="el-icon-success"></i><br>{{result[0]}}<br>{{result[1]}}</div>
          <el-button type="primary" class="dialog_next" @click="complete">完成</el-button>
        </div>
      </el-dialog>
    </div>

</template>
<style scoped>

    .upfiles{
      position: relative;
      border-bottom: 1px solid #e4e4e4;
    }
    .upfiles>input{
      opacity: 0;
      width: 116px;
      height: 34px;
      position: absolute;
      transform: translateX(-50%);
      z-index: 2;
    }
    .upfiles>div{
      width: 100%;
      position: relative;
    }
    .upfiles>div>p{
      padding: 10px 8px;
      background-color: #7496F2;
      color: #fff;
      -webkit-border-radius: 3px;
      -moz-border-radius: 3px;
      border-radius: 3px;
      width: 116px;
      margin: 50px auto;
    }
    .note{
      text-align: left;
      font-size: 12px;
      box-sizing: border-box;
      display: inline-block;
      margin-top:15px;
      line-height: 20px;
    }
    .loading{
      height: 100px;
    }
    .dialog_next{
      padding: 2% 15%;
    }
    .data_num{
      font-size: 16px;
      margin:10% auto;
      text-align: center;
       width: fit-content;
    }
    .mission{
      overflow: hidden;
    }
    .mission>p{
      float: left;
      width: 25%;
      text-align: right;
      margin: 0;
    }
    .el-icon-success{
      font-size: 72px;
      line-height: 41px;
      margin-bottom: 41px;
    }
</style>
<script>
    export default {
        name: "Dialog",
        data:function () {
            return {
              dialog_active:0,
              test:true,
              loading:true,
              leading_complete:0,
              leading_state:false,
              mission_edit:0,
              data_complete:'',
              mission_value:"",
              mission_list:[],
              taglist:[],
              tagIds:[],
              result:[],
              confirm_loading:false,
              uptime:0
            }
        },
        props:["leading","data"],
        methods:{
          queryCallTaskNameList : function () {
            var nameList = document.getElementById("taskName").value;
            this.$ajax.post(this.$preix+'/new/calltask/queryCallTaskNameList',{"nameLike": nameList})
              .then( (res) => {
                if(res.data.code==200 && res.data.rows){
                  this.mission_list = res.data.rows;
                }
              });
          },
          continueOperate : function () {
            this.dialog_active = 2;
            if(this.data){
              this.checkedTags(this.data.id);
            }
          },
          //自动选中关联标签
          checkedTags : function (taskId) {
            console.log("taskId:",taskId);
            this.$ajax.post(this.$preix+'/new/calltask/queryCallTaskTagListByTask',{"id":taskId})
              .then( (res) => {
                if(res.data.code==200){
                  var tags = res.data.info.tags;
                  if(tags){
                    this.tagIds = [];
                    for(var i=0; i<tags.length; i++){
                      var tag = tags[i];
                      if(tag.linked){
                        this.tagIds.push(tag.id);
                      }
                    }
                  }
                }
              });
          },
          //上传模板
            upfiles:function (e) {
              var _this=this;
              if(this.uptime!=0){
                return;
              }
              this.uptime==1;
              this.dialog_active=1;
              let formdata = new FormData();
              formdata.append('file',event.target.files[0]);
              this.$ajax.post(this.$preix+'/new/calltask/importCallTaskClientsCheck',formdata,{headers: { 'Content-Type': 'application/x-www-form-urlencoded' }})
              .then( (res) => {
                  if(res.data.code==200){
                    this.data_complete=res.data.message;
                    this.leading_complete=1;
                  }else{
                    this.$message({
                        showClose: true,
                        message: res.data.message,
                        type: 'warning'
                    });
                    setTimeout(function(){
                      _this.reload();
                    },1500)
                  }
              });
            },
            //确认信息
            mission_confirm:function () {
              if(this.mission_value==''){
                this.$message({
                    showClose: true,
                    message: '请输入或选择任务',
                    type: 'warning'
                });
                document.getElementById("taskName").focus();
                return false;
              }
              this.confirm_loading=true;
              var taskName = document.getElementById("taskName").value;
              this.$ajax.post(this.$preix+'/new/calltask/insertCallTask',{"taskTag":{"tagIds":this.tagIds,"taskName":taskName}})
              .then( (res) => {
                  if(res.data.code==200){
                    
                  }else{
                    this.$message({
                    showClose: true,
                    message: res.data.message,
                    type: 'error'
                });
                  }
              });
            },
            //关闭弹窗
            close:function(){
              this.reload();
              this.$emit('reset');
              this.dialog_active=0;
              this.leading_complete=0;
              this.mission_edit=0;
              this.uptime=0;
            },
            complete(){
              this.reload();
            },
            open(){
              //任务列表数据
              if(this.data!=null){
                this.mission_value=this.data.name;
              }
            }
        },
        mounted(){
          var _this=this;
              eventBus.$on('lead_mes',function(val){
                _this.result=val.content.split('</br>');
                _this.confirm_loading=false;
                _this.dialog_active=3;
              });
              //标签数据
              this.$ajax.post(this.$preix+'/new/tag/findTagList')
              .then( (res) => {
                  if(res.data.code==200){
                    console.log(res);
                      this.taglist=res.data.info;
                  }
              });
        },
        inject:['reload']
    }
</script>


