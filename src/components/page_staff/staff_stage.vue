<template>
    <div class="container" v-on:click.capture="hide" :class="{relative:call_hidden==true}">
        <!-- 蒙层 -->
        <div class="mask" v-show="call_state!=0" @click="mask_toast">
            <div></div>
            <div :style="{'width':'65px','height':'100%'}"></div>
        </div>
        <div id="mask" v-show="call_state==5">
            <div :style="{'font-size':'18px'}">
                <p><i class="el-icon-success" :style="{'font-size':'20px'}"></i>提交成功，即将自动呼叫下一位客户</p>
                <span @click="stopCall">停止自动呼叫</span>
            </div>
        </div>
        <!-- 自定义右键菜单 -->
        <div v-show="contextmenu.state" class="contextmenu" :style="{'position':'absolute','left':contextmenu.left+'px','top':contextmenu.top+'px','z-index':'3','width':'150px','line-height':'30px','background':'#fff','border':'1px solid #ccc','border-radio':'3px','box-shadow':'0px 0px 4px #ccc','cursor':'pointer'}" @click="remove">移除该项</div>
        <div class="aside">
            <div class="mask" :style="{'width':'100%','height':'100%'}" v-show="call_state!=0" @click="mask_toast">
                <div :style="{'width':'50%','height':'100%'}"></div>
                <div :style="{'width':'50%','height':'100%','left':'50%','top':'53px'}"></div>
            </div>
            <div class="tit staff_stage_tit">
                <el-button type="info" size="mini" icon="el-icon-sort" :style="{'float':'left','margin':'8px 5%','border-color':'#fff'}" @click="online_change" :class="{call_active:online_state==0}"><span v-show="online_state==0">在线</span><span v-show="online_state==0.5">......</span><span v-show="online_state==1">离线</span></el-button>
                <div id="auto_call">
                    <button type="button" class="el-button el-button--info el-button--mini" style="float: right; margin: 8px 5%; border-color: rgb(255, 255, 255);" :class="{active_blue:call_auto==true}"><span  @click="call_auto=!call_auto">{{call_auto==true?'自动呼叫':'手动呼叫'}}</span><i @click="call_set=!call_set" class="el-icon-arrow-down el-icon--right"></i></button>
                    <div v-show="call_set" @click.stop="call_set=true">
                        <p class="black">每隔&nbsp;<el-input-number v-model="call_during" controls-position="right" :min="1" :max="10" size="mini"></el-input-number>&nbsp;秒自动呼叫下一位</p>
                    </div>
                </div>
                <el-input size="small" :style="{'width':'90%'}" class="search"
                    placeholder="输入客户姓名或手机号后回车搜索"
                    prefix-icon="el-icon-search"
                    v-model="search"  @keyup.enter.native="search_task()">
                </el-input>
                <ul>
                    <li @click="TaskList_init" :class="{active:task_state==0}">待呼叫</li>
                    <li @click="BookedList_init({'requireTotalCount':true,'pageSize':'300'})" :class="{active:task_state==1}"><el-badge is-dot :value="booknum" :max="99" v-show="booknum>0">
                    <div class="tit" :style="{'padding-top':'0px'}">已预约</div>
                    </el-badge><div class="tit" :style="{'padding-top':'0px'}" v-show="booknum==0">已预约</div></li>
                    <!-- <li :class="{active:task_state==2}" @click="task_state=2">来电</li> -->
                </ul>
            </div>
            <div class="con">
                <p v-if="task_state==0&&TaskBySeat_data.length==0&&DialPlanIntroWithPage_data.length==0">
                    <i class="el-icon-noMission"></i>
                    <span :style="{'display':'block'}">暂无数据</span>
                </p>
                <el-tree :highlight-current="true" class="staff" :data="TaskBySeat_data" :props="defaultProps" accordion @node-click="handleNodeClick" v-show="task_state==0&&TaskBySeat_data.length!=0" node-key="id">
                    <div class="custom-tree-node detail_init" slot-scope="{ node, data }" @click="detail_init(data,1,node)" :ref="data.taskClientId+data.taskId">
                        <!-- 呼叫结果 默认值0：未开始 10：正常通话 11：转给其他坐席 12：转值班电话 21：没坐席接听 22：未接通 -->
                        <p>{{ node.label}}</p>
                        <span>{{data.lastCalledTime}}</span>
                        <span>{{data.callResult==0?'':''}}</span>
                        <span>{{data.callResult==10?'通话':''}}</span>
                        <span>{{data.callResult==11?'被转移':''}}</span>
                        <span>{{data.callResult==21?'未接听':''}}</span>
                        <span>{{data.callResult==22?'未接通':''}}</span>
                        <span>{{data.depName}}{{data.areaName}}</span>
                    </div>
                </el-tree>
                <el-tree :highlight-current="true" class="staff" :data="DialPlanIntroWithPage_data" :props="defaultProps" accordion @node-click="handleNodeClick" v-show="task_state==0&&DialPlanIntroWithPage_data.length!=0" node-key="id">
                    <div class="custom-tree-node detail_init" slot-scope="{ node, data }" @click="detail_init(data,2,node)" @contextmenu='prevent($event,data)' :ref="data.taskClientId+data.id">
                        <!-- 呼叫结果 默认值0：未开始 10：正常通话 11：转给其他坐席 12：转值班电话 21：没坐席接听 22：未接通 -->
                        <p>{{ node.label}}</p>
                        <span>{{data.lastCalledTime}}</span>
                        <span>{{data.callResult==0?'':''}}</span>
                        <span>{{data.callResult==10?'通话':''}}</span>
                        <span>{{data.callResult==11?'被转移':''}}</span>
                        <span>{{data.callResult==21?'未接听':''}}</span>
                        <span>{{data.callResult==22?'未接通':''}}</span>
                        <span>{{data.depName}}{{data.areaName}}</span>
                    </div>
                </el-tree>
                <div id="book" ref="bookTree">
                    <p v-if="task_state==1&&booklist.length==0">
                        <i class="el-icon-noMission"></i>
                        <span :style="{'display':'block'}">暂无数据</span>
                    </p>
                    <div class="custom-tree-node node" v-show="task_state==1&&item.taskClientId" v-for="(item,index) in booklist" :key="index" @click="detail_init(item,3)" :ref="item.taskClientId+item.taskId">
                        <p>{{item.userName}}</p>
                        <span>{{item.lastCalledTime}}</span>
                        <span :class="(new Date(item.nextContactTime).getTime()-30*60*1000)<new Date().getTime()?'red':''">{{item.nextContactTime_str}}</span>
                        <span>{{item.depName}}{{item.areaName}}</span>
                    </div>
                </div>

            </div>
            <ul class="foot" @click="see=true">
                <li class="grey"><i class="el-icon-plus"></i>新增临时任务</li>
            </ul>
        </div>
        <div class="body">
            <div id="hidden" v-show="call_hidden">
                <div>
                    <i class="el-icon-share" :style="{'font-size':'80px'}"></i>
                    <p>{{call_hidden_time==0?'未选择客户':'当前外呼任务自动呼叫已完成，请重新选择'}}</p>
                </div>
            </div>
            <div class="head">
                <div class="mes2">
                    <div id="call_father">
                        <br><br>
                        <div class="father">
                            <p class="black" :style="{'font-weight':'700'}">{{name}}</p>
                            <!-- <el-tooltip class="item" effect="dark"  placement="right" @click.native="test" v-show="name_change">
                                <div slot="content" :style="{'min-width':'200px'}">{{name}}</div>
                                <p class="black" :style="{'font-weight':'700'}">{{name}}</p>
                            </el-tooltip> -->
                            <!-- <input type="text" v-model="name" @blur="upSeat" v-show="!name_change"> -->
                            <input type="text" v-model="name" @blur="upSeat">
                        </div>
                        <p class="black">{{phone}}</p>
                    </div>
                    
                    <div id="call">
                        <div class="call_state high_hover"  v-show="call_state==0" @click="startCall">
                            <i class="el-icon-phone call_icon" id="call_icon"></i>
                            <span v-show="call_auto_init" :style="{'display':'inline-block','padding-right':'15px'}">{{call_during_copy}}秒后开始呼叫</span>
                        </div>
                        <div v-show="call_state==1">
                            <div class="call_state" :style="{'padding':'0 15px'}">
                                <i class="el-icon-phone-outline call_icon"></i>
                                <span>正在呼叫</span>
                            </div>
                            <i class="el-icon-callend call_icon" @click="sipTerminate"></i>
                            <i :class="phone_use?'el-icon-service':'el-icon-unservice'" class="call_icon" @click="meteMicrophone"></i>
                        </div>
                        <div v-show="call_state==2">
                            <div class="call_state" :style="{'padding':'0 15px'}">
                                <i class="el-icon-phone-outline call_icon"></i>
                                <span>&nbsp;呼叫中&nbsp;</span>
                            </div>
                            <i class="el-icon-callend call_icon" @click="sipTerminate"></i>
                            <i :class="phone_use?'el-icon-service':'el-icon-unservice'" class="call_icon" @click="meteMicrophone"></i>
                        </div>
                        <div v-show="call_state==3">
                            <div class="call_state" :style="{'padding':'0 15px'}">
                                <span>&nbsp;通话中&nbsp;</span> <span :style="{'font-size':'12px'}">{{timestr}}</span>
                            </div>
                            <i class="el-icon-callend call_icon" @click="sipTerminate"></i>
                            <i :class="phone_use?'el-icon-service':'el-icon-unservice'" class="call_icon" @click="meteMicrophone"></i>
                        </div>
                        <div v-show="call_state==4">
                            <div class="call_state" :style="{'padding':'0 15px'}">
                                <i class="el-icon-phone call_icon call_icon_center"></i>
                                <span>&nbsp;刚刚 通话 {{timestr2?timestr2:'0秒'}}&nbsp;</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mes3" style="height:110px;">
                    <div class="mes">
                        <div class="grey"><span style="float:left">性别：</span>
                            <div class="father" style="float:left">
                                <span class="black" v-show="sex==undefined">不详</span>
                                <span class="black" v-show="sex==0">男</span>
                                <span class="black" v-show="sex==1">女</span>
                                <select v-model="sex" @change="upSeat">
                                    <option value="0">男</option>
                                    <option value="1">女</option>
                                </select>
                            </div>
                        </div>
                        <div class="grey"><span style="float:left">职业：</span>
                            <div class="father" style="float:left">
                                <span class="black">{{job?job:'不详（点击补充）'}}</span>
                                <input type="text" v-model="job" @blur="upSeat" onfocus="this.select()">
                            </div>
                        </div>
                        <div class="grey"><span style="float:left">意向：</span>
                            <div class="father" style="float:left">
                                <span class="black">{{think?think:'不详（点击补充）'}}</span>
                                <input type="text" v-model="think" @blur="upSeat" onfocus="this.select()">
                            </div>
                        </div>
                    </div>
                    <div class="mes">
                        <div class="grey"><span style="float:left">邮箱：</span>
                            <div class="father" style="float:left">
                                <span class="black">{{email?email:'不详（点击补充）'}}</span>
                                <input type="text" v-model="email" @blur="upSeat" onfocus="this.select()">
                            </div>
                        </div>
                        <div class="grey"><span style="float:left">公司：</span>
                            <div class="father" style="float:left">
                                <span class="black">{{company?company:'不详（点击补充）'}}</span>
                                <input type="text" v-model="company" @blur="upSeat" onfocus="this.select()">
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <div class="summary">
                <p class="black tit">通话小结 <span class="grey" v-show="taskName_str
                " :style="{'font-weight':'400'}">{{'('+taskName_str+')'}}</span></p>
                <div>
                    <div class="state">
                        <p class="grey">跟进状态</p>
                        <p class="grey see" v-for=" item in worker_list" :key="item.key" :class="{see_active:worker_state==item.key}" @click="worker_change(item.key)">{{item.value}}</p>
                        <div class="grey">下次联系时间：<el-date-picker v-model="time_next" type="datetime" placeholder="无" size="mini" prefix-icon="date_icon el-icon-date" class="date_picker" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker></div>
                    </div>
                </div>
                <div class="summary_tag">
                    <p class="grey" :style="{'float':'left','margin':'0 7px','line-height':'26px'}">客户标签</p>
                    <el-dropdown v-for="(item,index) in history.summaryDto.tags" :key="index"  @command="handleCommand" :style="{'float':'left','line-height':'26px'}">
                        <span class="el-dropdown-link">
                            {{item.value?item.value:item.tagName}}<i class="el-icon-arrow-down el-icon--right"></i>
                        </span>
                        <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item v-for="(_item,_index) in item.taglist" :key="_index" :command="{'index':index,'value':_item}">{{_item}}</el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
                <div class="note">
                    <p class="grey" :style="{'float':'left','margin':'0 7px','line-height':'26px'}">详情备注</p>
                    <el-input :style="{'width':'80%','float':'left'}"
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="note">
                    </el-input>
                </div>
                <div class="submit">
                    <p class="grey" v-show="call_auto" style="margin:0">提交小结后将自动呼叫下一位客户</p>
                    <el-button :type="call_state==4?'primary':'info'" size="mini" :style="{'border-color':'#fff'}" @click="update">提交小结</el-button>
                </div>
            </div>
            <div class="history">
                <div :style="{'overflow':'hidden'}">
                    <p class="black tit" :style="{'float':'left'}">历史通话记录&#12288;<span class='grey'>总联系{{history.historyDto?history.historyDto.totalContactNum:0}}次，有效联系<span class="light-blue">{{history.historyDto?history.historyDto.effectiveContactNum:0}}</span>次</span></p>
                <p class="grey curson" :style="{'float':'right'}" @click="enter(history.summaryDto)">查看更多<i class="el-icon-d-arrow-right"></i></p>
                </div>
                <p class="grey" id="talk" v-if="history.historyDto&&history.historyDto.totalContactNum!=0"><span style="float:left;">{{history.historyDto.details[0].callEndTime}}&#12288;&#12288;<span class="black">{{history.historyDto.details[0].shortName}}</span> {{history.historyDto.details[0].callReaultString}} {{history.historyDto.details[0].callDuration}}</span>&#12288;<a-player id="Aplay" :music_url="baseUrl+recordFilePath+'?callSessionId='+callSeesionId+'&sessionId='+session" name="music_hitory" size='mini' v-if="a_play"></a-player></p>
                <div v-if="history.historyDto">
                    <div class="state">
                        <p class="grey">客户状态</p>
                        <p class="blue">{{history.historyDto.details[0].userResultStr}}</p>
                        <!-- <p class="black">{{history.custom_state}}</p> -->
                        <div class="grey" :style="{'margin-left':'45%'}" v-if="history.historyDto.details[0].nextContactTime"><p :style="{'float':'left'}">下次联系时间：</p><p class="blue">{{history.historyDto.details[0].nextContactTime}}</p></div>
                    </div>
                </div>
                <div class="history_tag" v-if="history.summaryDto.tags.length>0&&history.summaryDto.tags.taglist!=[]">
                    <el-button type="info" size="mini" v-for="item in history.summaryDto.tags.taglist" :key="item" :style="{'background':'#ECF2FF','border-color':'#7496F2','color':'#7496F2'}">{{item}}</el-button>
                </div>
                <div class="note" v-if="history.historyDto&&history.historyDto.details[0].desc">
                    <p class="grey" :style="{'float':'left','margin':'0 7px','line-height':'26px'}">详情备注</p>
                    <p :style="{'margin':'3px 7px','text-align':'left'}">{{history.historyDto.details[0].desc}}</p>
                </div>
            </div>
        </div>
        <DialogAdd v-bind:see="see" @reset="reset"></DialogAdd>
        <transition name="slide">
            <history id="history" v-if="show" :head='false' :details='history_detail' @close="history_close" :taskMes="history_taskId"></history>
        </transition>
    </div>
</template>
<style scoped>
    .slide-enter-active {
    animation: slide-in 0.5s;
    }
    .slide-leave-active {
    animation: slide-in 0.5s reverse;
    }
    @keyframes slide-in {
    0% {
        transform: translateX(100%);
    }
    100% {
        transform: translateX(0%);
    }
    }
    .el-dropdown-link {
    cursor: pointer;
    font-size: 12px;
    margin:0 8px;
    }
    .el-icon-arrow-down {
    font-size: 12px;
    }
</style>
<style scoped>
    .el-icon-noMission{
        transform: scale(0.5);
    }
    #Aplay{
        min-width: 300px;
        display: inline-block;
    }
    .active_blue{
        background-color:#7496F2;
    }
    .red{
        color:#e3170d!important;
    }
    .call_active{
        background-color:#4CD864;
    }
    .high_hover:hover{
        transform: scale(1.1);
        box-shadow: 0px 0px 2px #39c;
    }
    #auto_call{
        position: relative;
    }
    #auto_call>div{
        position: absolute;
        top:37px;
        right:13px;
        z-index: 2;
        background-color: #fff;
        border: 1px solid #e4e4e4;
        border-radius: 4px;
        padding: 10px 10px 0px;
        text-align:left;
    }
    #mask{
        position: fixed;;
        left:0;
        top:0;
        width:100vw;
        height: 100vh;
        background-color:rgba(255,255,255,0.5);
        z-index:99;
        pointer-events: all;
    }
    #mask>div>p{
        font-size:16px;
        color: rgb(35,235,185);
    }
    #mask>div>span{
        text-decoration: underline;
        color:#7496F2;
    }
    .mask{
        position:absolute;
        left:0;
        top:0;
        width:100vw;
        height: 100vh;
        z-index:99;
        pointer-events: none;
    }
    .mask div{
        position:absolute;
        left:0;
        top:0;
        width:100vw;
        height: 60px;
        pointer-events: all;
    }
    .custom-tree-node{
        text-align: left;
    }
    .custom-tree-node p{

    }
    .custom-tree-node span{
        color: #999;
        font-size: 12px;
    }
    div{
        font-size: 13px;
    }
    .date_picker{
        position: relative;
    }
    .container{
        overflow: hidden;
        background: #F2F4F5;
        padding:10px;
    }
    .relative{
        position:relative;
    }
    .aside{
        float: left;
        width: 25%;
        height: -webkit-fill-available;
        position: relative;
        border: 1px solid #ccc;
        background: #fff;
        box-sizing: border-box;
        overflow: hidden;
    }
    .staff{
        position: unset;
    }
    .aside .con{
        min-height: 60vh;
        box-sizing: border-box;
        padding: 0 6px;
        max-height: 80vh;
    }
    .aside .tit{
        padding-top: 8px;
    }
    .tit ul{
        width: 100%;
        margin: 0;
    }
    .tit ul li{
        width: 49%;
        float: left;
        padding: 12px 0;
        cursor: pointer;
        box-sizing:border-box;
    }
    .tit ul li.active{
        color:#7496F2;
        border-bottom:1px solid #7496F2;
    }
    .aside .foot{
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        margin: 0;
        cursor: default;
        background:#fff;
        padding-bottom:60px;
    }
    .aside .foot li{
        width: 49%;
        float: left;
        margin: 8px 0;
        color: #7496F2;
    }
    .body{
        padding-left: 25.8%;
        box-sizing: border-box;
    }
    .body .head,.body .summary{
        overflow: hidden;
    }
    .body .summary{
        background-color: #fff;
        margin-right: 2%;
        padding: 16px;
    }
    .body .history{
        padding: 16px;
        background-color: #fff;
        margin-top: 12px;
        margin-right: 2%;
        text-align: left;
    }
    .mes3{
        overflow: hidden;
        text-align: left;
        float: left;
        width: 55%;
        margin: 0px 0.8% 10px;
        background-color: #fff;
        padding: 0 2%;
        box-sizing:border-box;
    }
    .mes2{
        overflow: hidden;
        text-align: left;
        height: 110px;
        float: left;
        width: 43%;
        margin: 0px 0 10px 0;
        background-color: #fff;
    }
    .mes2>p{
        padding:0 10px;
        margin: 12px 0;
    }
    .mes2>div.father>p{
        padding:0 10px;
        width: 12vw;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .father>span{
        width: 12vw;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .mes2>div.father>input{
        transform:translateX(10px);
        width:12vw;
    }
    .father>input,.father>select{
        width:12vw!important;
    }
    #call{
        float: right;
        padding: 0 2%;
    }
    .call_state{
        box-sizing:border-box;
    }
    .call_state .call_icon{
        font-size: 23px;
        line-height:45px;
        float: left;
        margin:4px 4px;
    }
    .call_state .call_icon_center{
        margin:11px 4px;
    }
    #call_icon{
        margin:11px;
    }
    .call_icon{
        font-size: 23px;
        line-height:45px;
        float: left;
        margin: 31px 4px;
    }
    .call_state{
        overflow: hidden;
        color: #fff;
        min-width: 47px;
        background-color: rgba(0, 204, 102, 1);
        border-radius: 47px;
        text-align: center;
        display: inline-block;
        margin: 31px 10px;
        float: left;
    }
    .call_state span{
        line-height:45px;
        float: left;
    }
    .node{
        padding:10px;
        cursor: pointer;
        background-color:#fff;
    }
    .mes{
        overflow: hidden;
        padding: 10px 0;
        text-align: left;
        width: 50%;
        float: left;
    }
    .mes>div{
        margin:10px 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .father{
        display: inline-block;
    }
    .father:hover input,.father:hover select{
        width: auto;
    }
    #call_father{
        float: left;
        padding-left:10px;
        width:8vw;
    }
    .summary .tit{
        font-weight: 700;
        text-align: left;
    }
    body .tit{
        font-size:16px;
    }
    .see{
        background-color: #fff;
        border-radius: 3px;
        padding: 0 4px;
        border:1px solid #D8D8D8;
        cursor: pointer;
    }
    .see_active{
        background-color: #7496F2;
        border-color:#7496F2;
        color:#fff;
    }
    .summary .state,.summary .summary_tag{
        overflow: hidden;
        padding: 8px 0;
    }
    .history .state,.history .history_tag{
        overflow: hidden;
        padding: 8px 0;
        text-align: left;
    }
    .note{
        padding: 8px 0;
        overflow: hidden;
    }
    .state p{
        float: left;
        line-height: 28px;
        margin:0px 4px;
        font-size:14px;
    }
    .state p.black{
        cursor: pointer;
    }
    .submit{
        padding: 8px 0;
        text-align: right;
    }
    .submit p{
        display: inline-block;
    }
    #talk{
        text-align: left;
        background-color: #fff;
        border:1px solid #7496F2;
        padding: 4px 8px;
        display: inline-block;
        border-radius: 16px;
        overflow: hidden;
    }
    #history{
        position: fixed;
        right: 0;
        top: 0;
        background-color: #fff;
        box-shadow:-2px 0 5px #ccc;
    }
    #hidden{
        position: absolute;
        width:74.2%;
        height: 100%;
        background-color:#fff;
        top:10px;
        left:25.8%;
        z-index:9;
    }
    #hidden>div{
        position: absolute;
        left:50%;
        top:50%;
        transform:translate3D(-50%,-50%,0)
    }
    #book{
        max-height:70vh;
        overflow-y:auto;
    }
    #book::-webkit-scrollbar-track
    {
        background-color: #F5F5F5;
        -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.22);
    }
    /*定义滚动条高宽及背景*/
    #book::-webkit-scrollbar
    {
        width: 4px;
        background-color: rgba(153, 153, 153, 0.8);
    }
    /*定义滚动条*/
    #book::-webkit-scrollbar-thumb
    {
        background-color: #8b8b8b;
        border-radius: 1px;
    }
</style>
<style>
.staff .el-tree-node{
    float:unset;
}
.staff .el-tree-node__children{
    max-height: 50vh;
    overflow-y: auto;
}
.staff .el-tree-node__children::-webkit-scrollbar-track
{
    background-color: #F5F5F5;
    -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.22);
}
/*定义滚动条高宽及背景*/
.staff .el-tree-node__children::-webkit-scrollbar
{
    width: 4px;
    background-color: rgba(153, 153, 153, 0.8);
}
/*定义滚动条*/
.staff .el-tree-node__children::-webkit-scrollbar-thumb
{
    background-color: #8b8b8b;
    border-radius: 1px;
}
.search>input{
    background: #fff;
}
</style>

<script>
import DialogAdd from "../component/dialog_add.vue"
import history from '../component/history_talk.vue'
import jquery from  '../js/jquery.js'
import sockjs from '../js/sockjs.js'
import stomp from '../js/stomp.js'
import jssip from '../js/jssip-3.0.27.js'
import md5 from '../js/md5.js'
import VueAplayer from '../component/a_player.vue'
export default {
    name:'Staff_stage',
    data:function(){
        return {
            a_play:true,
            name_change:true,
            show:false,
            see:false,
            search:'',
            call_state:0,
            call_success:0,
            activeIndex:'1',
            worker_list:[{'key':'2','value':'发展成功'},{'key':'1','value':'持续跟进'},{'key':'3','value':'发展失败'}],
            TaskBySeat_data: [],
            DialPlanIntroWithPage_data:[],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            name:'',
            phone:'',
            sex:'',
            job:'',
            company:'',
            email:'',
            think:'',
            worker_state:2,
            time_next:'',
            tag_data: [],
            label_list:[],
            tag_list:[],
            note:'',
            history:{
                historyDto:{
                    effectiveContactNum:0,
                    totalContactNum:0,
                    details:[
                        {
                            answerType:0,callDuration:null,callEndTime:null,callReault:22,callReaultString:null,callSeesionId:null,callStartTime:"2018-05-03 11:03:55",contactType:10,id:null,loginName:null,number:null,partnerAccountId:null,seatAccountId:null,shortName:null,taskClientId:null,taskId:null,userResult:1,userResultStr:"继续跟进"
                        }
                    ]
                },
                summaryDto:{
                    tags:[{
                        "tagName":"213",
                        "tagOrder":2,
                        "tagValue":"aaa;v",
                        "taglist":[]
                    }],
                    taskClientId:"8bcd3b7d-3b74-4099-9abe-a421b9aaab27",
                    taskId:"da59b508-2443-42ca-af8d-33373d28b511",
                    taskName:"发大水发发嘎嘎水果蛋糕",
                    userResult:1
                }
            },
            contextmenu:{state:false,left:'',top:'',target:''},
            tags:[],
            history_detail:[],
            taskClientId:'',
            taskId:'',
            partnerAccountId:null,
            id:'',
            booklist:[{
                "areaName" : "string",
                "callResult" : 0,
                "classStr" : "string",
                "depName" : "string",
                "id" : "string",
                "nextContactTime" : "string",
                "nextContactTimeStr" : "string",
                "progress" : 0,
                "taskClientId" : "string",
                "taskId" : "string",
                "userName" : "string",
                "userNumber" : "string"
            }],
            task_state:0,
            planData:{},
            online_state:1,
            left:{taskClientId:null,
            taskListId:null,taskId:null},
            right:{taskClientId:null,
            taskListId:null,taskId:null},
            ua:null,
            from_name:null,
            timer:'00:00:00',
            n:0,
            stompClient:null,
            incomingSession:null,
            callIccSessionId:null,
            timestr:'',
            timestr2:'',
            active_data:null,
            call_set:false,
            call_during:5,
            call_during_copy:5,
            call_remin:2,
            call_auto:false,
            call_auto_init:false,
            call_timer:null,
            time_error:null,
            call_hidden:true,
            call_hidden_time:0,
            phone_use:true,
            history_taskId:null,
            baseUrl:null,
            session:null,
            recordFilePath:null,
            callSeesionId:null,
            taskName_str:null,
            curret:null
        }
    },
    components:{
      DialogAdd,history,'a-player': VueAplayer
    },
    mounted() {
        if(this.$route.query.taskClientId){
            this.BookedList_init({'requireTotalCount':true,'pageSize':'300'});
        }
        //录音基础url
        this.$ajax.post(this.$preix+'/new/callstatistics/getIccStaticContextPath').then(res=>{
            if(res.data.code){
                this.baseUrl=res.data.info.iccStaticContextPath;
                this.session=res.data.info.sessionId;
            }
        })
        //缩小导航菜单
        //this.$emit("close");
        //提前加载完预约列表
        this.$ajax.post(this.$preix+'/new/seatWorkbench/queryBookedTaskListBySeat',{'requireTotalCount':true,'pageSize':'300'})
        .then( (res) => {
            if(res.status==200){
                if(res.data.rows[0]!={}){
                    res.data.rows.map(item=>{
                        if(new Date(item.nextContactTime).getTime()<new Date().getTime()){
                            item.nextContactTime_str="已逾期"
                        }else{
                            item.nextContactTime_str=md5.time_init(new Date(item.nextContactTime));
                        }
                    })
                }
                this.booklist=res.data.rows;
            }
        });
        this.TaskList_init({});
        this.call_init(this.hasGetUserMedia());
        this.connect();
    },
    beforeDestroy(){
        if(this.ua != null){
            console.log("uaClose...");
            this.ua.stop();
        }
        this.disconnect();
    },
    computed:{
        booknum:function (){
            var num=0;
            this.booklist.map(item=>{
                if((new Date(item.nextContactTime).getTime()-new Date().getTime())<1000*60*30){
                    num++;
                }
            })
            return num;
        }
    },
    methods:{
        test(){
            this.name_change=false;
        },
        mask_toast(){
            this.$message({
                showClose: true,
                message: '请先提交小结后再进行其他操作',
                type: 'warning'
            });
        },
        uaInit:function (workbenchRst) {
            var _this=this;
            var fsDto = workbenchRst.fsDto;
            this.from_name = fsDto.name;
            var password = fsDto.password;
            var realm = fsDto.realm;
            var register = true;
            if(0 == fsDto.register){
                register = false;
            }
            var wsProt = fsDto.wsProt;
            var sessionTimers = fsDto.sessionTimers;

            var uri = "sip:"+this.from_name+"@"+realm;
            var freeswitchProtocol = workbenchRst.freeswitchProtocol;
            var wsURL = freeswitchProtocol+"://"+realm+":"+wsProt;
            var socket = new JsSIP.WebSocketInterface(wsURL);
            var configuration = {
                sockets: [socket],
                uri: uri,
                password: password,
                register: register,
                session_timers: sessionTimers,
                register_expires: 3600
            };
            this.ua = new JsSIP.UA(configuration);
            //JsSIP.debug.enable('JsSIP:*');JsSIP.debug.disable('JsSIP:*');

            //WebSocket连接事件
            this.ua.on('connected',function(data){
                console.log("onConnected- ",data);
                if(register){
                    _this.ua.unregister({
                        all: true
                    });
                    _this.ua.register();
                }
            });
            //WebSocket连接事件
            this.ua.on('disconnected',function(data){

                console.log("onDisconnected- ",data);
            });
            //注册事件
            this.ua.on('registered',function(data){
                console.log("onRegistered- ",data);
                _this.online_state=0;
            });
            //注册断开事件
            this.ua.on('unregistered',function(data){
                console.log("onUnregistered- ",data);
                _this.online_state=1;
            });

            /*新的传入或传出呼叫事件*/
            this.ua.on('newRTCSession', function (data) {
                console.log('incoming or outgoing call event :', data);
                if (data.originator == 'remote') {
                    setTimeout(function (){
                        _this.incomingSession = data.session;
                        var requestData = data.request.data;
                        requestData = requestData.substring(requestData.indexOf("icc_session_id"),requestData.length);
                        var iccSessionId = requestData.substr(requestData.indexOf(":")+2,36);
                        iccSessionId = $.trim(iccSessionId);
                        console.log("iccSessionId- ",iccSessionId);
                        console.log("callIccSessionId- ",_this.callIccSessionId);
                        if(_this.callIccSessionId == iccSessionId){//双呼
                            //$("#sessionId").val(callIccSessionId);
                            _this.sipAnswer(_this.incomingSession);
                        }
                    },2000);
                }
                data.session.on('newInfo',function(data){
                    console.log("onNewInfo -",data);
                });
                data.session.on('sending',function(data){
                    console.log("onSending -",data);
                });
                data.session.on('update',function(data){
                    console.log("onUpdate -",data);
                });
                data.session.on('connecting',function(data){
                    console.log("onConnecting -",data);
                });
                data.session.on('addstream',function(data){
                    console.log("onAddstream -",data);
                });
                data.session.on('accepted', function(data){
                    console.info('onAccepted - ', data);
                });
                data.session.on('confirmed', function(data){
                    console.info('onConfirmed - ', data);
                });
                data.session.on('sdp', function(data){
                    console.info('onSDP, type - ', data.type, ' sdp - ', data.sdp);
                    data.sdp = data.sdp.replace('UDP/TLS/RTP/SAVPF', 'RTP/SAVPF');
                    //console.info('onSDP, changed sdp - ', data.sdp);
                });
                data.session.on('progress', function(data){
                    console.info('onProgress - ', data);
                });
                //对等连接时设置远程流接收音频
                data.session.on('peerconnection', function(data){
                    console.info('onPeerconnection - ', data.peerconnection);
                    data.peerconnection.onaddstream = function(ev){
                        console.info('onaddstream from remote - ', ev);
                        $("#audioView").attr('src', URL.createObjectURL(ev.stream));
                    };
                });
                //通话结束
                data.session.on('ended',function(data){
                    console.info("onEnded-",data);
                    _this.sipTerminateEvent();
                });
                //通话连接失败
                data.session.on('failed',function(data){
                    console.info("onFailed-",data);
                    _this.call_state=0;
                    _this.stopTimer();
                });
            });

            this.ua.start();
        },
        //判断当前浏览器是否支持
        hasGetUserMedia:function() {
            return !(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia || navigator.msGetUserMedia);
        },
        //接听
        sipAnswer:function (incomingSession) {
            incomingSession.answer({
                'mediaConstraints': {
                    'audio': true, 'video': false
                }
            });
            this.call_state=2;
            //$("#currentCallState").val(2);
        },
        call_init:function(hasGetUserMedia) {
            var _this=this;
            if(hasGetUserMedia){
                this.$message({
                    showClose: true,
                    message: '当前浏览器不支持，请更换其他浏览器(推荐Google Chrome浏览器)',
                    type: 'warning'
                });
                return;
            }
            this.$ajax.post(this.$preix+'/new/seatWorkbench/getWorkbenchRst')
            .then( (res) => {
                if(res.data.code != 200){
                    return;
                }else{
                    this.uaInit(res.data.info);

                }
            });

        },
        connect:function () {
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
        disconnect:function () {
            if (this.stompClient != null) {
                this.stompClient.disconnect();

            console.log('关闭websocket')
            }
            console.log("Disconnected");
        },
        showResponse:function (result) {
            if(result.channelType == 2 && result.directType == 3003){
                //$("#currentCallState").val(3);
                this.call_state=3;
                this.startTimer();
                console.log("客户已接起");
            }else if(result.directType == 3006){
                console.log("已挂断");
            }
        },
        //检查麦克风
        checkMicrophone:function (){
            navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function(mediaStream){
                console.log("麦克风正常")
            }).catch(function(error) {
                console.log("麦克风未接入")
            });
        },
        //通话计时
        startTimer:function () {
            var _this=this;
            _this.n=0;
            this.timer=setInterval(function () {
                _this.n++;
                var h = parseInt(_this.n/60/60);
                var m= parseInt(_this.n/60)%60;
                var s=_this.n%60;
                _this.timestr2=_this.toDub(m)+'分'+_this.toDub(s)+'秒';
                return _this.timestr=_this.toDub(h)+":"+_this.toDub(m)+":"+_this.toDub(s);
            },1000);
        },
        stopTimer:function () {
            clearInterval(this.timer);
            this.n=0;
        },
        //挂断事件
        sipTerminateEvent:function () {
            this.call_state=4;
            this.stopTimer();
        },
        //补零
        toDub:function (n){
            return n<10?"0"+n:""+n;
        },
        //挂断电话
        sipTerminate:function () {
            if(this.incomingSession == null || this.incomingSession.isEnded()){
                console.log("当前没有通话正在进行中");
                return;
            }
            this.incomingSession.terminate();
        },
        //静音和取消静音
        meteMicrophone:function () {
            if(this.incomingSession == null || this.incomingSession.isEnded()){
                console.log("当前没有通话正在进行中");
                return;
            }
            var muteObj = this.incomingSession.isMuted();
            if(muteObj.audio){
                this.incomingSession.unmute();
                this.phone_use=true;
                console.log("已取消静音");
            }else{
                this.incomingSession.mute();
                this.phone_use=false;
                console.log("已静音");
            }
        },
        //搜索任务名
        search_task(){
            if(this.task_state==0){
                let data={'nameOrNumber':this.search};
                this.TaskList_init(data);
            }else{
                let data={'nameOrNumber':this.search,'requireTotalCount':true};
                this.BookedList_init(data);
            }

        },
        //初始化呼叫列表
        TaskList_init(data){
            if(this.booklist.length==0){
                this.TaskBySeat_data=[];
                this.DialPlanIntroWithPage_data=[]; 
            }
            data.pageSize = 50;
            //初始化数据
            this.task_state=0;
            this.TaskBySeat_init(data);
            this.DialPlanIntroWithPage_init(data);
        },
        //初始化预约列表
        BookedList_init(data){
            if(this.TaskBySeat_data.length==0&&this.DialPlanIntroWithPage_data.length==0){
                this.booklist=[];
            }
            this.booklist=[];
            this.call_auto=false;
            this.$ajax.post(this.$preix+'/new/seatWorkbench/queryBookedTaskListBySeat',data)
            .then( (res) => {
                if(res.status==200){
                    this.task_state=1;
                    if(res.data.rows[0]!={}){
                        res.data.rows.map(item=>{
                            if(new Date(item.nextContactTime).getTime()<new Date().getTime()){
                                item.nextContactTime_str="已逾期"
                            }else{
                                item.nextContactTime_str=md5.time_init(new Date(item.nextContactTime));
                            }
                        })
                    }
                    this.booklist=res.data.rows;
                }
            });
        },
        //获取客户详情
        detail_init(item,type,node){
            if(this.active_data&&this.active_data.type==2){
                if(this.$refs[this.active_data.taskClientId+this.active_data.id]&&this.$refs[this.active_data.taskClientId+this.active_data.id].style&&this.$refs[this.active_data.taskClientId+this.active_data.id].style.backgroundColor=='rgb(204, 255, 255)'){
                    this.$refs[this.active_data.taskClientId+this.active_data.id].style.backgroundColor='#fff';
                }
            }else{
                if(this.active_data&&this.$refs[this.active_data.taskClientId+this.active_data.taskId]&&this.$refs[this.active_data.taskClientId+this.active_data.taskId][0]&&this.$refs[this.active_data.taskClientId+this.active_data.taskId][0].style.backgroundColor=='rgb(204, 255, 255)'){
                    this.$refs[this.active_data.taskClientId+this.active_data.taskId][0].style.backgroundColor='#fff';
                }else if(this.active_data&&this.$refs[this.active_data.taskClientId+this.active_data.taskId]&&this.$refs[this.active_data.taskClientId+this.active_data.taskId].style&&this.$refs[this.active_data.taskClientId+this.active_data.taskId].style.backgroundColor=='rgb(204, 255, 255)'){
                    this.$refs[this.active_data.taskClientId+this.active_data.taskId].style.backgroundColor='#fff';
                }
            }
            var _this=this;
            this.a_play=false;
            this.tags=[];
            this.show=false;
            this.time_next='';
            this.call_auto_init=false;
            this.call_state=0;
            this.worker_state=1;
            clearTimeout(this.call_error);
            this.callIccSessionId=null;
            //防止点到以及菜单
            if(item.children){
                return;
            }
            this.call_hidden=false;
            this.call_hidden_time=1;
            this.active_data=item;
            this.active_data.type=type;
            this.right.taskListId=item.id;
            this.right.taskId=item.taskId;
            this.left.taskClientId=item.taskClientId;
            if(type==1){
                if(this.$refs[item.taskClientId+item.taskId].style.backgroundColor=='rgb(204, 255, 255)'){
                    this.$refs[item.taskClientId+item.taskId].style.backgroundColor='#fff';
                }else{
                    this.$refs[item.taskClientId+item.taskId].style.backgroundColor='#ccffff';
                }
                this.left.taskListId=null;
                this.left.taskId=item.taskId;
            }else if(type==2){
                if(this.$refs[item.taskClientId+item.id].style.backgroundColor=='rgb(204, 255, 255)'){
                    this.$refs[item.taskClientId+item.id].style.backgroundColor='#fff';
                }else{
                    this.$refs[item.taskClientId+item.id].style.backgroundColor='#ccffff';
                }
                this.left.taskId=null;
                this.left.taskListId=item.id;
            }else{
                if(this.$refs[item.taskClientId+item.taskId][0].style.backgroundColor=='rgb(204, 255, 255)'){
                    this.$refs[item.taskClientId+item.taskId][0].style.backgroundColor='#fff';
                }else{
                    this.$refs[item.taskClientId+item.taskId][0].style.backgroundColor='#ccffff';
                }
                this.left.taskListId=null;
                this.left.taskId=item.taskId;
            }
            this.$ajax.post(this.$preix+'/new/seatWorkbench/getCallTaskClientDetail',{'taskClientId':item.taskClientId})
            .then( (res) => {
                if(res.data.code==200){
                    this.history_taskId=res.data.info;
                    this.name=res.data.info.userName?res.data.info.userName:'';
                    this.phone=res.data.info.userNumber?res.data.info.userNumber:'';
                    this.sex=res.data.info.userGender;
                    this.job=res.data.info.userJob?res.data.info.userJob:'';
                    this.company=res.data.info.userCompany?res.data.info.userCompany:'';
                    this.email=res.data.info.userEmail?res.data.info.userEmail:'';
                    this.think=res.data.info.desc?res.data.info.desc:'';
                    this.taskClientId=item.taskClientId;
                    this.taskId=item.taskId;
                    this.partnerAccountId=res.data.info.partnerAccountId;
                    this.taskName_str=res.data.info.taskName;
                }
            });
            this.$ajax.post(this.$preix+'/new/seatWorkbench/findSummaryAndHistoryDetail',{'taskClientId':item.taskClientId,'taskId':item.taskId})
            .then( (res) => {
                if(res.status==200){
                    this.a_play=true;
                    if(res.data.summaryDto.tags!=undefined){
                        res.data.summaryDto.tags.taglist=[];
                        for(var i=0;i<res.data.summaryDto.tags.length;i++){
                            res.data.summaryDto.tags[i].taglist=res.data.summaryDto.tags[i].tagValue.split(';');
                            res.data.summaryDto.tags[i].lastTagValue?res.data.summaryDto.tags.taglist=res.data.summaryDto.tags.taglist.concat(res.data.summaryDto.tags[i].lastTagValue.split(';')):'';
                            res.data.summaryDto.tags[i].tagDefaultValue?res.data.summaryDto.tags[i].value=res.data.summaryDto.tags[i].tagDefaultValue:'';
                            res.data.summaryDto.tags[i].lastTagValue?res.data.summaryDto.tags[i].value=res.data.summaryDto.tags[i].lastTagValue:'';
                            // res.data.summaryDto.tags[i].tagDefaultValue?_this.tags[i].value=res.data.summaryDto.tags[i].tagDefaultValue:'';
                            // res.data.summaryDto.tags[i].lastTagValue?_this.tags[i].value=res.data.summaryDto.tags[i].lastTagValue:'';
                        }
                    }
                    if(res.data.historyDto&&res.data.historyDto.details){
                        this.note=res.data.historyDto.details[0].desc;
                        this.recordFilePath=res.data.historyDto.details[0].recordFilePath;
                        this.callSeesionId=res.data.historyDto.details[0].callSeesionId;

                    }else{
                        this.note='';
                    }
                    this.history=res.data;
                }
            });
        },
        //设置呼叫任务计划
        TaskBySeat_init(data){
            var arr=[];
            var _this=this;
            this.$ajax.post(this.$preix+'/new/seatWorkbench/queryTaskIntroBySeat',data
            ).then( res=>{
            if(res.data.code==200){
                    let _this=this;
                    var arr=[]
                    for(let i=0;i<res.data.rows.length;i++){
                        let obj={};
                        let id=res.data.rows[i].taskId;
                        obj.taskId=res.data.rows[i].taskId;
                        obj.processingNum=res.data.rows[i].processingNum
                        obj.taskName=res.data.rows[i].taskName;
                        obj.label=res.data.rows[i].taskName+'('+obj.processingNum+')';
                        var param = {};
                        param.taskId = res.data.rows[i].taskId;
                        data?param.nameOrNumber=data.nameOrNumber:'';
                        this.$ajax.post(this.$preix+'/new/seatWorkbench/queryProcClientWithTaskBySeat',param
                        ).then( res=>{
                            if(res.data.code==200&&res.data.rows[0]!=null){
                                res.data.rows.map(item=>{item.label=item.userName;item.taskId=id;item.id=item.taskClientId});
                                //res.data.rows.map(item=>item.taskId=id);
                                obj.children=res.data.rows;
                                //_this.TaskBySeat_data[i]=obj;
                                _this.$set(arr,i,obj);
                            }
                        });
                    }
                    _this.TaskBySeat_data=arr;
                }
            })
        },
        //新增呼叫计划列表
        DialPlanIntroWithPage_init(data){
            var arr=[];
            this.$ajax.post(this.$preix+'/new/seatWorkbench/queryDialPlanIntroWithPage',data
            ).then( res=>{
            if(res.data.code==200){
                    let _this=this;
                    for(let i=0;i<res.data.rows.length;i++){
                        let obj={};
                        obj.taskName=res.data.rows[i].name;
                        obj.processingNum=res.data.rows[i].numberTotal;
                        obj.label=res.data.rows[i].name+'('+obj.processingNum+')';
                        obj.id=res.data.rows[i].id;
                        obj.dialplanId=res.data.rows[i].id;
                        var param = {};
                        param.dialplanId = res.data.rows[i].id;
                        data?param.nameOrNumber=data.nameOrNumber:'';
                        this.$ajax.post(this.$preix+'/new/seatWorkbench/queryTaskListByDialPlan',param
                        ).then( res=>{
                            if(res.data.code==200&&res.data.rows[0]!=null){
                                res.data.rows.map(item=>{
                                    item.label=item.userName;
                                    item.id=item.id;
                                });
                                obj.children=res.data.rows;
                                _this.$set(arr,i,obj);
                            }
                        });
                    }
                    _this.DialPlanIntroWithPage_data=arr;
                }
            })
        },
        worker_change:function(value){
            this.worker_state=value;
        },
        handleNodeClick(data) {
            this.label_list[data.group]=data.id;
            this.tag_list[data.group]=data.label;
        },
        //右键菜单
        prevent:function(e,data,note){
            this.planData=data;
            if(note==1&&data.children){
                return
            }
            e.preventDefault();
            this.contextmenu.state=true;
            this.contextmenu.left=e.clientX-$('.content').eq(0).offset().left;
            this.contextmenu.top=e.clientY+document.documentElement.scrollTop-$('.content').eq(0).offset().top;
            this.contextmenu.target=e.target;
            // if(e.target.getAttribute('class').indexOf('el-tree-node__content')!=-1){
            //     e.preventDefault();
            //     this.contextmenu.state=true;
            //     this.contextmenu.left=e.clientX;
            //     this.contextmenu.top=e.clientY+document.documentElement.scrollTop;
            //     this.contextmenu.target=e.target;
            // }else{
            //     this.contextmenu.state=false;
            // }
        },
        hide(){
            this.contextmenu.state=false;
            this.call_set=false;
        },
        //删除呼叫任务
        remove(){
            console.log(this.planData)
            if(this.planData.children!=undefined){
                let Id=this.planData.dialplanId;
                this.$ajax.post(this.$preix+'/new/seatWorkbench/deleteDialplan',{'id':Id}
                ).then( res=>{
                    if(res.data.code==200){
                        this.reload();
                    }
                })
            }else{
                let Id=this.planData.id;
                this.$ajax.post(this.$preix+'/new/seatWorkbench/deleteTaskList',{'id':Id}
                ).then( res=>{
                    if(res.data.code==200){
                        this.reload();
                    }
                })
            }
        },
        //记录客户标签
        handleCommand(command) {
            this.$set(this.history.summaryDto.tags[command.index], 'value',command.value);
            this.tags[command.index]={'value':command.value};
        },
        //关闭弹窗
        reset:function(){
            this.see=false;
        },
        //设置历史记录信息
        enter(item){
            this.show=true;
            this.$ajax.post(this.$preix+'/new/seatWorkbench/queryResultHistoryEntity',{'taskId':item.taskId,'taskClientId':item.taskClientId}
            ).then( res=>{
                if(res.status==200){
                    res.data.info.details.map(item=>{
                        item.taglist=[];
                        if(item.tags){
                            for(var i=0;i<item.tags.length;i++){
                                if(item.tags[i].lastTagValue!=undefined){
                                    item.taglist=item.taglist.concat(item.tags[i].lastTagValue.split(';'));
                                }
                            }
                        }
                    })
                    this.history_detail=res.data.info;
                }
            });
        },
        //关闭历史记录
        history_close(){
            this.show=false;
        },
        //提交小结
        update(){
            if(this.callIccSessionId&&this.call_state==4){
                let data={'desc':this.note,'nextContactTime':this.time_next,'taskId':this.right.taskId,'taskClientId':this.left.taskClientId,'userResult':this.worker_state,'taskListId':this.right.taskListId,'sessionId':this.callIccSessionId}
                // for(let i=0;i<this.tags.length;i++){
                //     if(this.tags[i]!=null||this.tags[i]!=undefined){
                //         var str='customTag'+(i+1);
                //         data[str]=this.tags[i].value;
                //     }
                // }
                for(let i=0;i<this.history.summaryDto.tags.length;i++){
                    if(this.history.summaryDto.tags[i]!=null||this.history.summaryDto.tags[i]!=undefined){
                        var str='customTag'+this.history.summaryDto.tags[i].tagOrder;
                        data[str]=this.history.summaryDto.tags[i].value;
                    }
                }
                for (let key in data){
                    if(data[key]==''||data[key]==null){
                        delete data[key];
                    }
                }
                var _this=this;
                this.$ajax.post(this.$preix+'/new/seatWorkbench/updateCallTag',data
                ).then( res=>{
                    if(res.data.code!=200){
                        alert(res.data.message);
                    }else{
                        console.log('提交小结');
                        _this.call_state=0;
                        _this.update_TaskBySeat_data();
                        _this.update_DialPlanIntroWithPage_data();
                        if(this.booklist.length>0&&this.booklist[0].taskClientId!='string'){
                            let i=this.booklist.indexOf(_this.active_data);
                            this.booklist.map((items,index)=>{
                                if(i==index&&i!=(_this.booklist.length-1)){
                                    if(_this.time_next==''){
                                        _this.booklist.splice(index,1,{});
                                        _this.detail_init(_this.booklist[index+1],3,items);
                                    }else if(_this.time_next!=''){
                                        _this.detail_init(_this.booklist[index+1],3,items);
                                    }
                                    if(_this.call_auto){
                                        _this.call_state=5;
                                        _this.call_auto_init=true;
                                        _this.call_timer=setTimeout(function(){
                                            _this.call_state=0;
                                            _this.startCallTimeOut();
                                        },_this.call_remin*1000)
                                    }
                                }else if(i==index&&i==(_this.booklist.length-1)){
                                    console.log('到底了');
                                    if(_this.time_next==''){
                                        _this.booklist.splice(index,1);
                                        _this.call_hidden=true;
                                    }else if(_this.time_next!=''){
                                        _this.call_hidden=true;
                                    }
                                }
                            });
                        }
                    }
                });
            }
        },
        update_TaskBySeat_data(){
            var _this=this;
            this.TaskBySeat_data.map((items,index)=>{
                let i=items.children.indexOf(_this.active_data);
                if(i!=-1){
                    var iLen=items.children.length;
                    if(_this.time_next!=''){
                        items.processingNum--;
                        items.label=items.taskName+'('+items.processingNum+')';
                        items.children.splice(i,1);
                        _this.update_DialPlanIntroWithPage_data_detail(_this.active_data.taskClientId);
                        items.children[i]?_this.detail_init(items.children[i],1,items):'';
                    }else{
                        if(_this.worker_state!='1'){
                            items.processingNum--;
                            items.label=items.taskName+'('+items.processingNum+')';
                            items.children.splice(i,1);
                            items.children[i]?_this.detail_init(items.children[i],1,items):'';
                        }else{
                            items.children[i+1]?_this.detail_init(items.children[i+1],1,items):'';
                        }
                    };
                    
                    if(i == (iLen-1)){
                        _this.call_hidden=true;
                    }else{
                        if(_this.call_auto){
                            _this.call_state=5;
                            _this.call_auto_init=true;
                            _this.call_timer=setTimeout(function(){
                                _this.call_state=0;
                                _this.startCallTimeOut();
                            },_this.call_remin*1000);
                        }
                    }
                    if(items.children.length==0){
                        _this.TaskBySeat_data.splice(index,1);
                    }
                }
            })
        },
        update_TaskBySeat_data_detail(active_data){
            var _this=this;
            this.TaskBySeat_data.map((item,index)=>{
                if(item.taskId==active_data.taskId){
                    item.children.map((_item,_index)=>{
                        if(active_data.taskClientId==_item.taskClientId){
                            item.processingNum--;
                            item.label=item.taskName+'('+item.processingNum+')';
                            item.children.splice(_index,1);
                            if(item.children.length == 0){
                                _this.DialPlanIntroWithPage_data.splice(index,1);
                            }
                            if(item.children.length==0){
                                _this.TaskBySeat_data.splice(index,1);
                            }
                        }
                    })
                }
                
            })
        },
        update_DialPlanIntroWithPage_data(){
            var _this=this;
            this.DialPlanIntroWithPage_data.map((items,index)=>{
                var i=items.children.indexOf(_this.active_data);
                var iLen=items.children.length;
                if(i != -1){
                    items.processingNum--;
                    items.label=items.taskName+'('+items.processingNum+')';
                    items.children.splice(i,1);
                    if(_this.worker_state!='1'||_this.time_next!=''){
                        _this.update_TaskBySeat_data_detail(_this.active_data);
                    };
                    if(i < items.children.length){
                        _this.detail_init(items.children[i],2,items);
                        if(_this.call_auto==true){
                            _this.call_state=5;
                            _this.call_auto_init=true;
                            _this.call_timer=setTimeout(function(){
                                _this.call_state=0;
                                _this.startCallTimeOut();
                            },_this.call_remin*1000)
                        }
                    }
                    if(i == (iLen-1)){
                        _this.call_hidden=true;
                    }
                    if(items.children.length == 0){
                        _this.DialPlanIntroWithPage_data.splice(index,1);
                    }
                }
            });
        },
        update_DialPlanIntroWithPage_data_detail(taskClientId){
            var _this=this;
            this.DialPlanIntroWithPage_data.map((item,index)=>{
                item.children.map((_item,_index)=>{
                    if(taskClientId==_item.taskClientId){
                        item.processingNum--;
                        item.label=item.taskName+'('+item.processingNum+')';
                        item.children.splice(_index,1);
                        if(item.children.length == 0){
                            _this.DialPlanIntroWithPage_data.splice(index,1);
                        }
                        if(item.children.length == 0){
                            _this.DialPlanIntroWithPage_data.splice(index,1);
                        }
                    }
                })
            })
        },
        online_change(){
            if(this.online_state==0){
                this.online_state=0.5;
                this.ua.unregister({
                    all: true
                });
            }else{
                this.online_state=0.5;
                this.ua.register();
            }
        },
        startCall(){
            var _this=this;
            clearTimeout(this.time_error);
            //mask
            //开始拨号
            if(!this.ua.isRegistered()){
                alert("freeswitch连接异常！");
                return;
            }
            navigator.mediaDevices.getUserMedia({ audio: true, video: false }).then(function(mediaStream) {
                if(_this.call_state == 0){
                    console.log("正在呼叫。。。");
                    //_this.call_state=0.5;
                    _this.call_state=1;
                    var data={"taskClientId":_this.left.taskClientId,"taskListId":_this.left.taskListId,"from":_this.from_name,'taskId':_this.left.taskId};
                    for(let key in data){
                        if(data[key]==null){
                            delete data[key];
                        }
                    }
                    _this.$ajax.post(_this.$preix+'/new/seatWorkbench/seatDirectCall',data)
                    .then( (res) => {
                        if(res.data.code == 200){
                            _this.callIccSessionId = res.data.info.sessionId;
                            _this.call_error=setTimeout(function(){
                                if(_this.call_state==1){
                                    _this.$message({
                                        showClose: true,
                                        message: '通话异常，已为你重置本次通话',
                                        type: 'warning'
                                    });
                                    //alert('通话异常，已为你重置本次通话');
                                    _this.callIccSessionId=null;
                                    _this.call_state=0;
                                }
                            },8000)
                        }else{
                            console.log("退回开始呼叫");
                            _this.$message({
                                showClose: true,
                                message: res.data.message,
                                type: 'warning'
                            });
                            this.$message
                            _this.call_state=0;
                        }
                    });
                }else{
                    console.log("在本次呼叫完成并提交联系小结前，请勿执行其他操作！");
                }
            }).catch(function(error) {
                _this.$message({
                    showClose: true,
                    message: '麦克风无权限',
                    type: 'warning'
                });
            });
        },
        //停止自动呼叫
        stopCall(){
            this.call_auto_init=false;
            this.call_state=0;
            clearTimeout(this.call_timer);
            this.call_auto=false;
        },
        //修改基本信息
        upSeat(){
            this.name_change=true;
            var data={"desc" : this.think,"id" : this.left.taskClientId,"userCompany" : this.company,"userEmail" : this.email,"userGender" : this.sex,"userJob" : this.job,"userName" : this.name,"partnerAccountId":this.partnerAccountId}
            this.$ajax.post(this.$preix+'/new/seatWorkbench/updateCallTaskClient',data).then(res=>{
                if(res.data.code==200){
                    this.$message({
                    showClose: true,
                    message: '修改成功',
                    type: 'success'
                });
                }
            })
        },
        startCallTimeOut(){
            this.call_during_copy=parseInt(this.call_during);
            var _this=this;
            var timer=setInterval(function(){
                _this.call_during_copy=_this.call_during_copy-1;
                if(_this.call_during_copy<1){
                    _this.startCall();
                    _this.call_auto_init=false;
                    clearInterval(timer);
                }
            },1000)
        }
    },
    inject:['reload']
}
</script>

