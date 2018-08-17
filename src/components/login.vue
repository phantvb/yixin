<template>
    <div class="loginWrap">
        <div class="loginTop">
              <!-- 这里是头部log和name -->
              <img src="../assets/images/log.jpg" alt="" class="logImg">
        </div>
        <div class="logincontent">
            <!-- 这里是中间登陆背景图和登陆框 -->
            <img src="../assets/images/bg.png" alt="" class="loginBg">
            <div class="loginBox">
                <div v-if="loginShow" class="loginWrapper">
                    <div class="bigger">
                        <i class="el-icon-service iconLoing"></i>
                        欢迎登陆
                    </div>
                    <form @submit.prevent="loginSubmit">
                        <!-- 用户名 -->
                        <div class="loginForm">
                           <el-input placeholder="用户名" suffix-icon="el-icon-edit" v-model="formName.userName"></el-input>
                        </div>
                        <!-- 密码 -->
                        <div class="loginForm">
                           <el-input type="password" placeholder="密码" suffix-icon="el-icon-view" v-model="formName.userPassWord"></el-input>
                        </div>
                        <div v-if="verShow" class="loginForm">
                            <!-- 验证码输入框 -->
                            <div class="verify">
                                <el-input placeholder="验证码" v-model="formName.flag"></el-input>
                            </div>
                            <!-- 验证码图片 -->
                            <img :src="verifyImg" alt="" class="verifyImg" @click="verifyChange">
                        </div>
                        <div class="verifyText">
                           <!-- 此处为验证提示信息 -->
                           {{yzInfo}}
                        </div>
                        <div class="loginForms">
                            <el-checkbox @change="changeCheck()" v-model="formName.checked">记住密码</el-checkbox>
                            <span class="pass" @click="retrievePassword()">找回密码</span>
                        </div>
                        <!-- 登陆按钮 -->
                        <div class="">
                            <button type="submit" class="btnLoginSubmit">{{ loginBtn }}</button>
                        </div>
                    </form>
                </div>
                <div v-if="passWord" class="forgetPassword">
                    <div class="bigger">
                        <i class="el-icon-service iconLoing"></i>
                        找回密码
                    </div>
                    <form @submit.prevent="loginEmils">
                        <!-- 邮箱 -->
                        <div class="loginForm">
                           <el-input placeholder="请输入管理员注册邮箱号" suffix-icon="el-icon-view" v-model="formNames.emil"></el-input>
                        </div>
                        <div class="loginForm">
                            <!-- 验证码输入框 -->
                            <div class="verify">
                                <el-input placeholder="验证码" v-model="formNames.flags"></el-input>
                            </div>
                            <!-- 验证码图片 -->
                            <img :src="verifyImg" alt="" class="verifyImg" @click="verifyChange">
                        </div>
                        <div class="verifyText">
                           <!-- 此处为验证提示信息 -->
                           {{errInfo}}
                        </div>
                        <!-- 发送邮件按钮 -->
                        <div class="">
                            <button type="submit" class="btnLoginSubmit">{{ loginEmil }}</button>
                        </div>
                    </form>
                    <div class="goLogin" @click="goLogin">
                        <i class="el-icon-back"></i><span>前往登陆</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="loginBottom">
            <!-- 这里是系统尾注 -->
            <span>浙江翼信科技有限公司©2013-2017  浙B2-20130234号</span>
        </div>
        <!-- 找回密码发送成功提示弹窗 -->
        <el-dialog title="提示" :visible.sync="dialogVisible" width="30%">
            <span>找回密码邮件已成功发送，请注意查收！</span>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogVisible = false">知道了</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { Message } from 'element-ui' 	// 组件
import base64encode from '../components/js/md5.js'
import { isRegisterUserName,isPasswd,isEmail } from "./js/validate.js";   // 验证函数
export default {
    name:'login',
    data(){
        return {
            state:1,
            verShow:false,
            loginShow:true,
            passWord:false,
            resetPass:false,
            formName: {//表单中的参数
                userName:'',
                userPassWord:'',
                checked: '',
                flag: ''
            },
            dialogVisible:false,
            formNames: {//表单中的参数
                emil:'',
                flags: ''
            },
            formPass: {//表单中的参数
                newPassWord:'',
                PassWord: ''
            },
            loginBtn:'登 录',
            loginEmil:'发送邮件',
            loginRight:'确定',
            yzInfo:'',
            errInfo:'',
            passCunt:{
                nub:0
            },
            verifyImg:null
        }
    },
    created(){
        //判断之前是否有记住密码
        this.getUserInfo();
    },
    mounted(){
        this.verifyImg=this.$preix+'/new/verifyCode?ts='+new Date().getTime();
        this.$ajax.post(this.$preix+'/new/getFailNum',{})
          .then( (res) => {
              var failNum = res.data.info;
              if(failNum >= 3){
                this.verShow = true;
              }
          });
    },
    methods: {
        msgErrorShow(msg){
            Message({
                message: msg,
                type: "error"
            });
        },
        verifyChange(){
            this.verifyImg=this.$preix+'/new/verifyCode?ts='+new Date().getTime();
        },
        //判断之前是否有记住密码
        getUserInfo(){
            let UserInfo = JSON.parse(localStorage.getItem("userNamePass"));
            if(UserInfo){
              this.formName.userName = UserInfo.name;
              this.formName.userPassWord = UserInfo.passWord;
              this.formName.checked = true;
            }
        },
        //记住密码状态变化
        changeCheck(){
           if(this.formName.checked == true){
              let userNamePass = {
                  name:this.formName.userName,
                  passWord:this.formName.userPassWord
              }
              window.localStorage.setItem("userNamePass",JSON.stringify(userNamePass));
           }else{
              window.localStorage.removeItem("userNamePass");
           }
        },
        //登陆
        loginSubmit(){
            var self = this;
            if(self.formName.userName ==''){
                this.yzInfo = '请输入登陆账号';
				        return false;
            }
            if(self.formName.userPassWord == ''){
                this.yzInfo = '请输入登陆密码';
				        return false;
            }
            this.loginBtn = "登录中...";
            let parameter = {
                "name" : this.formName.userName,
                "password" : base64encode.md5(this.formName.userPassWord),
                "verifyCode" : this.formName.flag
            }
            this.$ajax.post(this.$preix+'/new/loginValidate',parameter)
                .then( (res) => {
                    if(res.data.code==200){
                        let loginName={"loginName" : res.data.rows[0].shortName?res.data.rows[0].shortName:res.data.rows[0].loginName};
                        window.sessionStorage.setItem("loginName",JSON.stringify(loginName));
                        if(window.sessionStorage){
                            let userInfoLst = res.data.rows;
                            window.sessionStorage.setItem("userInfoLst",JSON.stringify(userInfoLst));
                        }else{
                            this.msgErrorShow("浏览器不支持本地存储功能，建议您使用chrome浏览器效果更佳！");
                        }
                        this.changeCheck();
                        if(res.data.rows[0].type==1){
                            this.$router.push({ path: '/operation/manager'})
                        }else if(res.data.rows[0].type==2){
                            this.$router.push({ path: '/manager/index'})
                        }else{
                            this.$router.push({ path: '/staff/index'})
                        }
                    }else{
                        this.passCunt.nub++;
                        if(this.passCunt.nub>=3){
                          this.verShow = true;
                        }else{
                          this.verShow = false;
                        }
                        this.msgErrorShow(res.data.message);
                        this.loginBtn = "登录";
                    }
            })
        },
        //点击找回密码打开找回密码显示框
        retrievePassword(){
            this.loginShow = false;
            this.passWord = true;
            this.verifyChange();
        },
        //发送邮件
        loginEmils(){
            if(this.formNames.emil ==''){
                this.errInfo = '请输入注册邮箱号';
				        return false;
            }
            if(!isEmail(this.formNames.emil)){
                this.errInfo = '输入邮箱有误，请重新输入';
				        return false;
            }
            if(this.formNames.flags.length!=4) {
                this.errInfo = '验证码错误，请重新输入';
                return false;
            }
            let parameter = {
                "email" : this.formNames.emil,
                "verifyCode" : this.formNames.flags
            }
            this.$ajax.post(this.$preix+'/new/forgetStep1',parameter)
                .then( (res) => {
                    if(res.data.code==200){
                        console.log(res);
                        this.dialogVisible = true;
                    }else{
                       // 发送失败
                       this.msgErrorShow(res.data.message);
                    }
            })
        },
        // 从找回密码前往登陆
        goLogin(){
            this.passWord = false;
            this.loginShow = true;
        },
        //从重置密码前往登陆
        goLogins(){
            this.resetPass = false;
            this.loginShow = true;
        }
    }
}
</script>

<style scoped>
/* login头部样式 */
.loginTop{
    height: 120px;
    background: white;
    position: relative;
}
.logImg{
    height: 60px;
    position: absolute;
    top: 35px;
    left: 300px;
}
/* login背景样式 */
.loginBg{
    width: 100%;
    height: 100%;
}
/* login中间内容样式 */
.logincontent{
    height: 550px;
    position: relative;
}
/* 表单验证提示信息样式 */
.verifyText,.verifyTexts{
    font-size: 12px;
    color: red;
}
/* login登陆框样式 */
.loginBox{
   width: 375px;
   background: white;
   box-sizing: border-box;
   position: absolute;
   top: 80px;
   right: 150px;
}
/* login登陆状态样式 */
.loginWrapper{
   box-sizing: border-box;
   padding: 40px;
}
/* login icon样式 */
.iconLoing{
    color: green;
}
/* login 欢迎语样式 */
.bigger{
    border: 0;
    width: 100%;
    height: 40px;
    border-bottom: 1px solid #ccc;
    text-align: left;
    font-size: 18px;
    margin-bottom: 20px;
}
.pass{
    cursor: pointer;
}
/* login输入框样式 */
.loginForm,.loginForms{
   margin-bottom: 10px;
   height: 40px;
   display: flex;
   align-items: center;
}
.loginForms{
    justify-content: space-between;
}
/* login 验证输入框样式 */
.verify{
    width: 40%;
    margin-right: 20px;
}
/* login 验证码图片样式 */
.verifyImg{
    /* border:1px solid red; */
    width: 30%;
    height: 80%;
}
/* 登陆和发送邮件按钮样式 */
.btnLoginSubmit{
   border: 0;
   width: 100%;
   height:40px;
   font-size: 16px;
   color: #fff;
   cursor: pointer;
   background:#84abf8;
   background:-webkit-linear-gradient(left, #84abf8, #84abf8);
   background:-o-linear-gradient(left, #84abf8, #84abf8);
   background:linear-gradient(to right, #84abf8, #84abf8);
   /* -ms-filter: "progid:DXImageTransform.Microsoft.gradient(startColorstr='#84abf8', endColorstr='#84abf8')"; */
}
/* 找回密码框样式 */
.forgetPassword{
   box-sizing: border-box;
   padding: 40px;
}
/* 前往登陆按钮样式 */
.goLogin{
   text-align: left;
   line-height: 30px;
   margin-top: 20px;
   cursor: pointer;
}
/* 重置密码框样式 */
.resetPassword{
   box-sizing: border-box;
   padding: 40px;
}
/* 获取到的邮箱信息样式 */
.emilInfo{
   text-align: left;
   line-height: 30px;
   font-size: 14px;
}
/* login 底部尾注样式 */
.loginBottom{
    height: 60px;
    background: white;
    font-size: 12px;
    line-height: 60px;
}
</style>
