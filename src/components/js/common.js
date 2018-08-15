function connect () {
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
};
function disconnect () {
    if (this.stompClient != null) {
        this.stompClient.disconnect();
        
    console.log('关闭websocket')
    }
    console.log("Disconnected");
};
export default{
    connect:connect,
    disconnect:disconnect
}