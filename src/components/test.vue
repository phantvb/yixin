<template>
    <div>
            <!-- <div v-for="(item,index) in Lists" :key="index">
    <p>距离结束&nbsp;{{timeList2[index].h}}小时&nbsp;{{timeList2[index].m}}分&nbsp;{{timeList2[index].s}}秒</p>
        
            </div> -->
        <div>{{test_time}}</div>
    </div>
</template>
    
<script>
export default {
  name:'test',
  data:function(){
      return {
          Lists:[],
          timeList:[],
          timeList2:[],
          test_time:null
      }
  },
  mounted(){
      this.test();   
  },
  methods:{
    test(){
        if(time.getTime()>new Date().getTime()){
            if (time.getFullYear()>new Date().getFullYear()){
                return (""+time.getFullYear()).substring(2)+'年'+(time.getMonth()+1)+'月'+time.getDate()+'日';
            }else if(time.getFullYear()==new Date().getFullYear()&&1*24*60*60*1000<(time.getTime()-new Date().getTime())){
                return (time.getMonth()+1)+'月'+time.getDate()+'日'+' '+(time.getHours()<10?'0'+time.getHours():time.getHours())+':'+(time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes());
            }else if(time.getFullYear()==new Date().getFullYear()&&time.getMonth()==new Date().getMonth()&&time.getDate()==new Date().getDate()+1){
                return '明天'+(time.getHours()<10?'0'+time.getHours():time.getHours())+':'+(time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes());
            }else if(time.getFullYear()==new Date().getFullYear()&&time.getMonth()==new Date().getMonth()&&time.getDate()==new Date().getDate()&&1*60*60*1000<(time.getTime()-new Date().getTime())){
                return (time.getHours()<10?'0'+time.getHours():time.getHours())+':'+(time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes());
            }else if(time.getFullYear()==new Date().getFullYear()&&time.getMonth()==new Date().getMonth()&&time.getDate()==new Date().getDate()&&(time.getTime()-new Date().getTime())>60*1000){
                return Math.floor((time.getTime()-new Date().getTime())/60000)+'分钟后';
            }else if(time.getFullYear()==new Date().getFullYear()&&time.getMonth()==new Date().getMonth()&&time.getDate()==new Date().getDate()&&(time.getTime()-new Date().getTime())<60*1000){
                return '1分钟内';
            }
        }else{
            if(time.getFullYear()==new Date().getFullYear()&&time.getMonth()==new Date().getMonth()&&time.getDate()==new Date().getDate()&&(new Date().getTime()-time.getTime())<60*1000){
                return '刚刚';
            }else if(time.getFullYear()==new Date().getFullYear()&&time.getMonth()==new Date().getMonth()&&time.getDate()==new Date().getDate()&&60*60*1000>(new Date().getTime()-time.getTime())>60*1000){
                return Math.ceil((new Date().getTime()-time.getTime())/60000)+'分钟前';
            }else if(time.getFullYear()==new Date().getFullYear()&&time.getMonth()==new Date().getMonth()&&time.getDate()==new Date().getDate()&&1*60*60*1000<((new Date().getTime()-time.getTime()))){
                return (time.getHours()<10?'0'+time.getHours():time.getHours())+':'+(time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes());
            }else if(time.getFullYear()==new Date().getFullYear()&&time.getMonth()==new Date().getMonth()&&time.getDate()==(new Date().getDate()-1)){
                return '昨天'+(time.getHours()<10?'0'+time.getHours():time.getHours())+':'+(time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes());
            }else if(time.getFullYear()==new Date().getFullYear()&&(new Date().getTime()-time.getTime())>1*24*60*60*1000){
                return (time.getMonth()+1)+'月'+time.getDate()+'日'+' '+(time.getHours()<10?'0'+time.getHours():time.getHours())+':'+(time.getMinutes()<10?'0'+time.getMinutes():time.getMinutes());
            }else if(time.getFullYear()<new Date().getFullYear()){
                return (""+time.getFullYear()).substring(2)+'年'+(time.getMonth()+1)+'月'+time.getDate()+'日';
            }
        }
    }
  }
}
</script>