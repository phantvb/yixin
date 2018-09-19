<template>
    <div>
        <div class="title nav2 drop">
          <el-dropdown trigger="click" @command='handleloginout'>
            <span class="el-dropdown-link">
              {{identity}}<i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <router-link :to="{path:'/'+parent+'/userInfo'}">
                <el-dropdown-item>账号设置</el-dropdown-item>
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
            <el-dropdown trigger="click" class="id1" placement="top-end" @visible-change='visible' @command='handlecommand' :hide-on-click="false">
                <div @click="handlecommand">
                    <el-badge :value="notify" :max="99" v-show="notify>0">
                    <i class="el-icon-menu"></i>
                    </el-badge>
                    <i class="el-icon-menu"  v-show="notify==0"></i>
                </div>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item :class="{unsee:item.status==0}" :command='item' v-for="item in notifylist" :key="item.mesId" :divided="true">
                        <div v-html="item.content" class="item"></div>
                        <div :style="{'text-align':'right'}">{{item.create_str}}</div>
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
        
    </div>
    
</template>
<style scoped>
/* .item{
    min-width: 200px;
} */
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
            notifylist:[{
                content:'&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;&#12288;'
            }],
            notify:0
		};
    },
    props:['parent'],
    methods:{
        visible(visible){
        if(visible){
            this.$ajax.post(this.$preix+'/new/notify/query-msg-intro',{"pageNum" : 1,"pageSize" : 10,"requireTotalCount" : true}).then(res=>{
                    if(res.data.code==200){
                        res.data.rows.map(item=>{
                            item.create_str=md5.time_init(new Date(item.create));
                        })
                        this.notifylist=res.data.rows;
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
        let UserInfo = JSON.parse(window.sessionStorage.getItem("loginName"));
        this.identity=UserInfo.loginName;
        this.connect();
    },
    beforeDestroy(){
        this.disconnect();
    }
}
</script>

