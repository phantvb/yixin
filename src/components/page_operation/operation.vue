<template>
  <el-container>
    <el-header>
      <el-row height="auto" class="header">
        <div class="nav title">猎客呼叫中心</div>
        <notify></notify>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="auto">
        <el-row class="tac">
          <el-col :span="24">
            <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" background-color="#4B4D50" text-color="#fff" active-text-color="#ffd04b">
              <router-link :to="{path:'/operation/index'}">
                <el-menu-item index="1" class="el-submenu__title">
                  <i class="el-icon-index"></i>
                  <span slot="title">首页&#12288;&#12288;&#12288;&#12288;</span>
                </el-menu-item>
              </router-link>
              <el-submenu index="2">
                <template slot="title">
                  <i class="el-icon-waihu"></i>
                  <span>帐号管理&#12288;&#12288;</span>
                </template>
                <el-menu-item-group>
                  <router-link :to="{path:'/operation/manager'}">
                    <el-menu-item index="2-1">管理员帐号&#12288;</el-menu-item>
                  </router-link>
                  <router-link :to="{path:'/operation/staff'}">
                    <el-menu-item index="2-2">坐席帐号&#12288;&#12288;</el-menu-item>
                  </router-link>
                </el-menu-item-group>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title">
                  <i class="el-icon-shezhi"></i>
                  <span>设置&#12288;&#12288;&#12288;&#12288;</span>
                </template>
                <el-menu-item-group>
                  <router-link :to="{path:'/operation/userInfo'}">
                    <el-menu-item index="3-1">个人信息&#12288;&#12288;</el-menu-item>
                  </router-link>
                </el-menu-item-group>
              </el-submenu>
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-main>
        <router-view class="content" v-if="alive"></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<style scoped>
.item{
  padding: 0!important;
  width: 170px!important;
  min-width: 170px;
}
.tac {
	width: 170px;
  height: 100vh;
  z-index: 2;
}
.header .nav{
  width: 170px;
  float: left;
  background-color: #7496F2;
  color:#fff;
  font-size: 20px;
  padding-bottom: 1px;
}
.title{
  line-height: 53px;
}

.hello{
  width: 100vw;
  min-width: 860px;
  overflow: auto;
  position: relative;
}
a{
  text-decoration: none;
}
.content{
  background-color: #F2F4F5;
}
</style>

<script>
import notify from '../component/notify.vue';
import md5 from '../js/md5.js';
export default {
	name: 'manager',
	data() {
		return {
      alive:true,
      stompClient:null
		};
  },
  components:{notify},
	methods: {
		handleOpen(key, keyPath) {
			console.log(key, keyPath);
		},
		handleClose(key, keyPath) {
			console.log(key, keyPath);
    },
    reload(){
      this.alive=false;
      this.$nextTick(function(){
        this.alive=true;
      })
    },
    test(){
      location.href=this.$preix+'/new/logout'
    },
    getCookie(c_name){
        if (document.cookie.length > 0) {
            var arrCookie=document.cookie.split("; ");
            for(var i=0;i<arrCookie.length;i++){
                var arr=arrCookie[i].split("=");
                //找到名称为userId的cookie，并返回它的值
                if(c_name==arr[0]){
                    return arr[1];
                }
            }
        }
    }
  },
	provide(){
    return {
      reload:this.reload
    }
  },
  mounted(){
    console.log(window.sessionStorage);
    
    // var data={
    //     'name':'qy1','password':md5.md5('224139'),'password2':'123456'
    // };
    // this.$ajax.post('https://10.240.80.72:8443/icc-interface/new/loginValidate',
    //     data
    // );
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
