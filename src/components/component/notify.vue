<template>
    <div id="notify">
        <div class="title nav2 drop">
          <el-dropdown trigger="click" @command='handleloginout'>
            <span class="el-dropdown-link">
              {{identity}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <router-link :to="{path:'/'+parent+'/userInfo'}">
                <el-dropdown-item>帐号设置</el-dropdown-item>
              </router-link>
              <el-dropdown-item command="loginout">
                  登出
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
        <div class="notify nav2">
          <!-- <el-badge :value="notify" @click.native="notify_show=!notify_show">
            <i class="el-icon-menu"></i>
          </el-badge>
          <div class="notify_mes" >

          </div> -->
            <el-dropdown trigger="click" placement="top-end" @command='handlecommand' :hide-on-click="false">
                <div @click="handlecommand">
                    <el-badge :value="notify" :max="99" v-show="notify>0">
                    <i class="el-icon-menu"></i>
                    </el-badge>
                    <i class="el-icon-menu"  v-show="notify==0"></i>
                </div>
                <el-dropdown-menu slot="dropdown" style="padding:0">
                    <el-dropdown-item style="text-align:center;font-size:14px;color:#7496f2">
                        通知
                    </el-dropdown-item>
                    <div id="notify_drop">
                        <el-dropdown-item :class="{unsee:item.status==0}" :command='item' v-for="item in notifylist" :key="item.mesId" :divided="true" style="overflow:hidden;margin:0;width:336px">
                            <div style="float:left;width:29%;text-align: center;;">
                                <i :class="item.msgType==4?'el-icon-notify2':'el-icon-notify1'"></i>
                            </div>
                            <div style="float:right;width:70%;">
                                <div v-html="item.content" class="item"></div>
                                <div :style="{'text-align':'left','font-size':'10px','line-height':'10px','margin-bottom':'10px','color':'rgba(0,0,0,0.45)'}">{{item.create_str}}</div>
                            </div>
                        </el-dropdown-item>
                    </div>
                    <el-dropdown-item style="height:20px;border-top:1px solid #e8e8e8" command='more'>
                        <i class="el-icon-notify_drop"></i>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        
    </div>
    
</template>
<style scoped>
.item{
    font-size: 12px;
    line-height: 16px;
    margin:18px 0 9px;
}
.notify{
  margin: 15px 0;
  position: relative;
  min-width: 500px;
  text-align: right;
}
.title{
  line-height: 53px;
}
.drop{
  padding: 0 30px 0 18px;
}
.nav2{
  width: auto;
  float: right;
}
.unsee{
    background-color: #ECF2FF ;
    border-radius: 3px;
    padding: 5px;
}
.el-icon-menu:before {
    content: '';
    width: 20px;
    height: 20px;
    margin: 0px 4px;
    display: block;
    background: url('../../../static/icon/menu.png');
    background-size: 20px 20px;
    transform: translateY(3px);
}
</style>

<script>
import md5 from '../js/md5.js'
export default {
    name:'notify',
    data() {
		return {
            identity:null,
            notifylist:[],
            notify:0,
            pageNum:1
        };
    },
    props:['parent'],
    methods:{
        visible(visible){
        if(visible){
            this.$ajax.post(this.$preix+'/new/notify/query-msg-intro',{"pageNum" : this.pageNum,"pageSize" : 10,"requireTotalCount" : true}).then(res=>{
                    if(res.data.code==200){
                        res.data.rows.map(item=>{
                            item.create_str=md5.time_init(new Date(item.create));
                        })
                        this.notifylist=this.notifylist.concat(res.data.rows);
                        this.pageNum++;
                    }
                })
            }
        },
        handleloginout(command){
            console.log(command)
            if(command=='loginout'){
                this.$ajax.post(this.$preix+'/new/logout').then(res=>{
                    if(res.data.code==200){
                        this.$router.push({ path: '/login'})
                    }
                })
            }
        },
        handlecommand(command){
            if(command=='more'){
                this.visible(true);
            }
            this.$ajax.post(this.$preix+'/new/notify/mark-msg-readed').then(res=>{
                if(res.data.code==200){
                    this.notify=0;
                }
            })
        },
        connect () {
            var _this=this;
            // websocket的连接地址，此值等于WebSocketMessageBrokerConfigurer中registry.addEndpoint("/icc/websocket").withSockJS()配置的地址
            var socket = new SockJS(this.$preix+'/ws/icc/websocket', null, { transports: 'websocket' });
            this.stompClient = Stomp.over(socket);
            this.stompClient.connect({}, function(frame) {
                console.log('Connected: ' + frame);
                _this.stompClient.subscribe(
                    '/user/topic/ws',
                    function(respnose){
                        _this.showResponse(JSON.parse(respnose.body));
                    }
                );
            });
        },
        disconnect () {
            if (this.stompClient != null) {
                this.stompClient.disconnect();
                
            console.log('关闭websocket')
            }
            console.log("Disconnected");
        },
        showResponse:function (result) {
            if(result.msgType==5){
                eventBus.$emit('lead_mes',result);
            }else{
                this.notify++;
            }
        }
    },
    mounted(){
        this.$ajax.post(this.$preix+'/new/notify/query-unread-msg-num').then(res=>{
            if(res.data.code==200){
                this.notify=res.data.info;
            }
        });
        this.visible(true);
        let UserInfo = JSON.parse(window.sessionStorage.getItem("loginName"));
        this.identity=UserInfo.loginName;
        this.connect();
    },
    beforeDestroy(){
        this.disconnect();
    }
}
</script>

