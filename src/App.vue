<template>
  <div id="app" :style="{'min-width':'1000px'}">
    <router-view/>
  </div>
</template>
<script>
export default {
  name: "App",
  mounted(){
    window.onload=function(){
      var scale=64+(document.body.scrollWidth-1200)/360;
      scale=(scale>72?72:scale);
      document.documentElement.style.fontSize=scale+'px';
    };
    window.onresize=function(){
      var scale=64+(document.body.scrollWidth-1200)/360;
      scale=(scale>72?72:scale);
      document.documentElement.style.fontSize=scale+'px';
    };
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 0 auto;
}
body{
  margin: 0;
}
</style>
