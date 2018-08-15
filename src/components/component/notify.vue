<template>
    <el-dropdown trigger="click" class="id1" placement="top-end" @visible-change='visible' @command='handlecommand' :hide-on-click="false">
        <div>
            <el-badge :value="notify" :max="99" v-show="notify>0">
            <i class="el-icon-menu"></i>
            </el-badge>
            <i class="el-icon-menu"  v-show="notify==0"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
            <el-dropdown-item :command='item' v-for="item in notifylist" :key="item.mesId" v-html="item.content"></el-dropdown-item>
        </el-dropdown-menu>
    </el-dropdown>
</template>
<style scoped>
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
export default {
    name:'notify',
    data() {
		return {
            notifylist:[],
            notify:0
		};
    },
    methods:{
        visible(visible){
        if(visible){
            this.$ajax.post(this.$preix+'/new/notify/query-msg-intro',{"pageNum" : 1,"pageSize" : 20,"requireTotalCount" : true}).then(res=>{
                    if(res.data.code==200){
                        this.notifylist=res.data.rows;
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
            var socket = new SockJS(this.$preix+'/ws/icc/websocket');
            this.stompClient = Stomp.over(socket);
            this.stompClient.connect({}, function(frame) {
                console.log('Connected: ' + frame);
                _this.stompClient.subscribe(
                    '/user/topic/ws',
                    function(respnose){
                        console.log(this);
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
            if(result.msgType){
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
        this.connect();
    }
}
</script>

