<template>
    <div class="container" id="manager_label">
        <div :style="{'position':'relative'}">
            <div id="mask" v-show="tableData.length===0">
                <div>
                    <p><i class="el-icon-noMission"></i></p>
                    <el-button size="mini" type="primary" class="button" @click="add">新增客户标签组</el-button>
                    <div>
                        <el-tooltip class="item" effect="dark"  placement="bottom">
                            <div slot="content" :style="{'min-width':'200px'}">客户标签可以与外呼任务关联，让坐席在与客户沟通时快速标记用户，以便后续的客户分类与跟进。</div>
                            <el-button type="text" :style="{'color':'#999'}" size="mini"><i class="el-icon-question"></i>什么是客户标签组</el-button>
                        </el-tooltip>
                    </div>
                </div>
            </div>
            <el-alert title="最多只能设置10个标签" type="warning" center show-icon v-show="warn"></el-alert>
            <div class="part2">
                <div class="part2_tit">
                    <el-button type="primary" class="button" :style="{float:'left'}" @click="add">新增客户标签组</el-button>
                    <el-button plain class="button" :style="{'float':'left'}" @click="DialogVisible=true">效果预览</el-button>
                    <el-tooltip class="item" effect="dark"  placement="right">
                        <div slot="content" :style="{'min-width':'200px'}">客户标签可以与外呼任务关联，让坐席在与客户沟通时快速标记用户，以便后续的客户分类与跟进。</div>
                        <el-button type="text" :style="{'float':'right','color':'#999'}" size="mini"><i class="el-icon-question"></i>什么是客户标签组</el-button>
                    </el-tooltip>
                </div>
                <el-table :data="tableData" style="width: 100%" :default-sort = "{prop: 'date', order: 'descending'}" class="table">
                    <el-table-column prop="tagName" label="标签组名称" class-name="line2" sortable  :show-overflow-tooltip=true min-width="100"> </el-table-column>
                    <el-table-column label="可选值" class-name="line3" :show-overflow-tooltip=true min-width="300">
                        <template slot-scope="scope">
                            {{scope.row.tags.join(';')}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="tagDefaultValue" label="默认值" class-name="line4" :show-overflow-tooltip=true min-width="100"> </el-table-column>
                    <el-table-column prop="create" label="创建时间" class-name="line5" sortable :show-overflow-tooltip=true min-width="100"> </el-table-column>
                    <el-table-column prop="p_caozuo" class-name="line11" label="操作"  min-width="130">
                        <template slot-scope="scope">
                            <el-button
                            size="mini" type="text"
                            @click="handlech(scope.$index, scope.row)">修改标签组</el-button>&#12288;|
                            <el-button
                            size="mini" type="text"
                            @click="handlede(scope.$index, scope.row)">删除标签组</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <tag :see="add_tag" @reset="reset" @update="update" :data="chdata"></tag>
            <el-dialog title="标签预览" :visible.sync="DialogVisible" width="60%" center>
                <div class="summary">
                    <p class="black tit">通话小结</p>
                    <div>
                        <div class="state">
                            <p class="grey">跟进状态</p>
                            <p class="black see see_actived">发展成功</p>
                            <p class="black see">持续跟进</p>
                            <p class="black see">发展失败</p>
                        </div>
                    </div>
                    <div class="summary_tag">
                        <p class="grey" :style="{'float':'left','margin':'0 7px','line-height':'26px'}">客户标签组</p>
                        <el-dropdown :hide-on-click="false" v-for="(item,index) in tableData" :key="index" :style="{'float':'left','line-height':'26px','margin': '0 6px'}">
                            <span class="el-dropdown-link">
                                {{item.tagName}}<i class="el-icon-arrow-down el-icon--right"></i>
                            </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item v-for="(_item,_index) in item.tags" :key="_index" :command="{'index':index,'value':_item}">{{_item}}</el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                    </div>
                    <div class="note">
                        <p class="grey" :style="{'float':'left','margin':'0 7px','line-height':'26px'}">详情备注</p>
                        <el-input :style="{'width':'80%','float':'left'}"
                        type="textarea"
                        :rows="2"
                        placeholder="请输入内容">
                        </el-input>
                    </div>
                    <div class="submit">
                        <p class="grey">提交小结后将自动呼叫下一位客户</p>
                        <el-button type="info" size="mini" :style="{'background':'#7496F2','border-color':'#fff'}">提交小结</el-button>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button size="mini" style="width:165px;" @click="DialogVisible = false">关 闭</el-button>
                </span>
            </el-dialog>
        </div>
        
    </div>
</template>
<style scoped>
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
    .summary{
        overflow: hidden;
        background-color: #fff;
        margin-right: 2%;
        padding: 16px;
    }
    .summary .tit{
        font-weight: 700;
        text-align: left;
    }
    .summary .state,.summary .tag{
        overflow: hidden;
        padding: 8px 0;
    }
    .summary_tag{
        overflow: hidden;
    }
    .state p {
        float: left;
        line-height: 28px;
        margin: 0px 4px;
    }
    .note{
        padding: 8px 0;
        overflow: hidden;
    }
    .submit{
        padding: 8px 0;
        text-align: right;
    }
    .submit p{
        display: inline-block;
    }
    .container{
        position: relative;
    }
    .part2_tit{
        margin: 20px 0;
        overflow: hidden;
    }
    .part2_tit .button{
        float: right;
        padding: 6px 14px;
        font-size: 12px;
        margin: 0 14px;
    }
    .table{
        font-size: 14px;
        margin-bottom: 10px;
    }
    .see{
        background: #CDCDCD;
        color: #fff;
        border-radius: 3px;
        padding: 0 4px;
    }
    .see_actived{
        background-color: #7496F2;
        border-color:#7496F2;
        color:#fff;
    }
</style>

<script>
import md5 from '../js/md5.js'
import tag from '../component/dialog_tag.vue'
export default {
    name:'labels',
    data:function(){
        return {
            search:'',
            leading_date:[],
            add_tag:false,
            //初始化时占个位，防止闪现新建标签，加tags防止报错
            tableData: [{tags:[]}],
            chdata:[],
            DialogVisible:false,
            warn:false
        }
    },
    components:{tag},
    methods:{
        //修改标签
        handlech:function(index,row){
            //绑定数据到<tag></tag>,并显示
            this.chdata=row;
            this.add_tag=true;
        },
        //删除标签
        handlede:function(index,row){
            this.$ajax.post(this.$preix+'/new/tag/delTag',{'id':row.id})
            .then( (res) => {
                if(res.data.code==200){
                    this.tag_init();
                }
            });
        },
        //新增标签
        add:function(){
            if(this.tableData.length>9){
                this.warn=true;
                return
            }
            this.add_tag=true;
        },
        //初始化标签数据
        tag_init:function(data){
            this.$ajax.post(this.$preix+'/new/tag/findTagList',data)
            .then( (res) => {
                if(res.data.code==200){
                    for(let i=0;i<res.data.info.length;i++){
                        res.data.info[i].tags=res.data.info[i].tagValue.split(';');
                    }
                    this.tableData=res.data.info;
                }
            });
        },
        //编辑标签弹窗关闭的回调，清空里面的数据，可能多余了
        reset:function(){
            this.chdata=[];
            this.add_tag=false;
        },
        //编辑标签弹窗修改成功的回调
        update:function(){
            this.tag_init();
        }
    },
    mounted(){
        // var data={
        //     'name':'qy1','password':md5.md5('123456'),'password2':'123456'
        // };
        // this.$ajax.post('https://10.240.80.72:8443/icc-interface/new/loginValidate',
        //     data
        // ).then(res=>{
        //     this.tag_init();
        // })
        this.tag_init();
    }
}
</script>
