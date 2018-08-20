<template>
  <div class="container">
    <div class="nav">帐号信息设置</div>
    <div id="form">
      <el-form ref="form" :model="form" label-width="100px">
        <el-form-item label="帐号名称：" :style="{'text-align':'left'}">
          <span class="black">{{loginName}}</span>
        </el-form-item>
        <el-form-item label="帐号类型：" :style="{'text-align':'left'}">
          <span class="black" v-show="type==0">超级管理员</span>
          <span class="black" v-show="type==1">运维管理员</span>
          <span class="black" v-show="type==2">企业管理员</span>
          <span class="black" v-show="type==3">坐席</span>
        </el-form-item>
        <el-form-item label="密码：" :style="{'text-align':'left'}">
          <span class="black">******</span>
          <el-button :style="{'float':'right'}" type="primary" icon="el-icon-edit" @click="dialogVisible = true"></el-button>
        </el-form-item>
      </el-form>
    </div>
    
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose" @open="open">
      <el-form ref="form" :model="form" label-width="120px">
        <el-form-item label="原密码">
          <el-input type="password" v-model="form.oldPassword" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="再次输入新密码">
          <el-input type="password" v-model="form.password2" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateAccountPassword()">确认修改</el-button>
  </span>
    </el-dialog>
  </div>
</template>
<style scoped>
  .nav{
    line-height: 30px;
    text-align: left;
    background-color: #fff;
    padding: 0 10px;
    margin-bottom: 10px;
    box-sizing: border-box;
  }
  #form{
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #fff;
    box-sizing: border-box;
    padding-right: 50vw;
  }
</style>
<script>
  export default {
    name:'userInfo',
    data:function(){
      return {
        loginName: null,
        type: null,
        dialogVisible: false,
        form:{
          oldPassword : null,
          password : null,
          password2 : null
        }
      };
    },
    methods: {
      open(){
        this.form.oldPassword=null;
        this.form.Password=null;
        this.form.Password2=null;
      },
      updateAccountPassword(){
        var pattern = /\S{6,32}/;
        if (!pattern.test(this.form.password)) {
          alert("密码必须由6-32位字符组成！");
          return;
        }
        if(this.form.password != this.form.password2){
          alert("2次密码输入不一致！");
          return;
        }
        this.$ajax.post(this.$preix+'/new/account/updatePassword',{"oldPassword":this.form.oldPassword,"password":this.form.password,"password2":this.form.password2})
          .then( (res) => {
            var data = res.data;
            if(data.code==200){
              this.dialogVisible=false;
              this.$message({
                showClose: true,
                message: data.message,
                type: 'success'
              });
            }else{
              this.$message({
                showClose: true,
                message: data.message,
                type: 'warning'
              });
            }
          })
      },
      handleClose(done) {
        this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
      }
    },
    mounted(){
      this.$ajax.post(this.$preix+'/new/account/getUserInfo',{})
        .then( (res) => {
          var data = res.data;
          if(data.code==200){
            var info = data.info;
              this.loginName = info.loginName;
              this.type = info.type;
          }else{
            /*this.$message({
              showClose: true,
              message: res.data.message,
              type: 'warning'
            });*/
          }
        })
    }
  }
</script>
