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
                <div v-if="resetPass" class="resetPassword">
                    <div class="bigger">
                        <i class="el-icon-loginPass iconLoing"></i>
                        重置密码
                    </div>
                    <form @submit.prevent="resetPassWord">
                        <div v-if="zhuceEmil==''" class="verifyTexts">
                           <!-- 此处为验证提示信息 -->
                           {{emilErr}}
                        </div>
                        <div class="emilInfo">
                            <span>注册邮箱：</span><span>{{zhuceEmil}}</span>
                        </div>
                        <!-- 新密码 -->
                        <div class="loginForm">
                           <el-input placeholder="请输入新密码" suffix-icon="el-icon-view" v-model="formPass.newPassWord"></el-input>  
                        </div>
                        <!-- 二次确认密码 -->
                        <div class="loginForm">
                           <el-input placeholder="请再次输入新密码" suffix-icon="el-icon-view" v-model="formPass.PassWord"></el-input>  
                        </div>
                        <div class="loginForm">
                            <!-- 验证码输入框 -->
                            <div class="verify">
                                <el-input placeholder="验证码" v-model="formPass.flag"></el-input>
                            </div>
                            <!-- 验证码图片 -->
                            <img src="https://10.240.80.72:8443/icc-interface/new/verifyCode" alt="" class="verifyImg">
                        </div>
                        <div class="verifyText">
                           <!-- 此处为验证提示信息 -->
                           {{yzInfo}}
                        </div>
                        <!-- 确定按钮 -->
                        <div class="">
                            <button type="submit" class="btnLoginSubmit">{{ loginRight }}</button>
                        </div>
                    </form>
                    <div class="goLogin" @click="goLogins">
                        <i class="el-icon-back"></i><span>前往登陆</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="loginBottom">
            <!-- 这里是系统尾注 -->
            <span>浙江翼信科技有限公司©2013-2017  浙B2-20130234号</span>
        </div>
    </div>
</template>

<script>
import { Message } from 'element-ui' 	// 组件
import base64encode from '../components/js/md5.js'
import { isRegisterUserName,isPasswd,isEmail } from "./js/validate.js";   // 验证函数
export default {
    name:'resetLogin',
    data(){
        return {
            verShow:false,
            resetPass:true,
            formPass: {//表单中的参数
                newPassWord:'',
                PassWord: '',
                flag:''
            },
            loginRight:'确定',
            zhuceEmil:'',
            yzInfo:'',
            emilErr:'',
            tokens:'',
        }
    },
    created(){
        this.getUrl();
    },
    methods: {
        msgErrorShow(msg){
            Message({
                message: msg,
                type: "error"
            });
        },
        // zhuweiwen@yixin.im
        //获取URL里的token
        getUrl(){
            //  this.$route.params.token
            //通过点击邮箱返回的链接，地址中拿到token
             console.log(this.$route.params.token);
             let tokenInfo = window.location.href;
             console.log(tokenInfo.split('=')[1]);
             if(tokenInfo){
                this.tokens = tokenInfo.split('=')[1];
                //  回填在重置密码上方
                let parameter = {
                    "token":this.tokens
                }
                this.$ajax.post(this.$preix+'/new/forgetStep2',parameter)
                    .then( (res) => {
                        if(res.data.code==200){
                            console.log(res);
                            //获取成功
                            this.zhuceEmil = res.data.info
                        }else{
                            // 获取失败
                            this.msgErrorShow(res.data.message);
                            this.emilErr = '重置密码链接已失效！请点击返回登陆页面，重新点击忘记密码，重新获取重置密码链接。'
                        }
                })
             }
             console.log(window.location.href);
        },
        //从重置密码前往登陆
        goLogins(){
            this.$router.push({
                path:'/login'
            })
        },
        //重置密码确定按钮
        resetPassWord(){
           if(!this.formPass.newPassWord){
              this.yzInfo = '请输入新密码'
              return false;
           }
           if(!this.formPass.PassWord){
              this.yzInfo = '请再次输入新密码'
              return false;
           }
           if(this.formPass.newPassWord!=this.formPass.PassWord){
              this.yzInfo = '两次密码不一致，请重新输入'
              return false;
           }
           if(!this.formPass.flag){
              this.yzInfo = '请输入验证码'
              return false;
           }
           if(this.formPass.flag.length!=4){
              this.yzInfo = '验证码错误'
              return false;
           }
           //此处调用接口重置密码
            let parameter = {
               "email":this.zhuceEmil,
               "password":this.formPass.newPassWord,
               "password2":this.formPass.PassWord,
               "verifyCode":this.formPass.flag
            }
            this.$ajax.post(this.$preix+'/new/resetPassword',parameter)
                .then( (res) => {
                    if(res.data.code==200){
                        console.log(res);
                        this.msgErrorShow(res.data.message);
                    }else{
                       // 重置失败
                       this.msgErrorShow(res.data.message);
                       this.zhuceEmil = '';
                       this.emilErr = '重置密码链接已失效！请点击返回登陆页面，重新点击忘记密码，重新获取重置密码链接。'
                    }
            })
        },
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
