<template>
  <div class="container">
    <div class="nav">帐号信息设置</div>
    <div class="head">
      <div class="mes3">
        <div class="mes">
          <div class="grey">帐号名称：
            <div class="father">
              <span class="black">{{loginName}}</span>
            </div>
          </div>
          <div class="grey">帐号类型：
            <div class="father">
              <span class="black" v-show="type==0">超级管理员</span>
              <span class="black" v-show="type==1">运维管理员</span>
              <span class="black" v-show="type==2">企业管理员</span>
              <span class="black" v-show="type==3">坐席</span>
            </div>
          </div>
          <div class="grey">密码：
            <div class="">
              <span class="black">******</span>
              <el-button type="text" @click="dialogVisible = true">修改</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="修改密码"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose">
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="原密码">
          <el-input v-model="form.oldPassword"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="再次输入新密码">
          <el-input v-model="form.password2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="updateAccountPassword()">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>
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
              alert("修改成功");
            }else{
              alert(data.message);
              /*this.$message({
                showClose: true,
                message: res.data.message,
                type: 'warning'
              });*/
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
