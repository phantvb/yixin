<template>
    <div ref="content">
       <el-row> 
            <el-col :span="size=='mini'?2:4" style="text-align: center"> 
                <el-popover placement="top-start" trigger="hover"> 
                    <div style="text-align: center"> 
                        <el-progress color="#67C23A" type="circle" :percentage="music.volume"></el-progress><br> <el-button @click="changeVolume(-10)" icon="el-icon-minus" circle></el-button> 
                        <el-button @click="changeVolume(10)" icon="el-icon-plus" circle></el-button>
                    </div> 
                    <el-button size="mini" @click="play" id="play" slot="reference" :icon="music.isPlay?'el-icon-refresh':'el-icon-caret-right'" circle>
                    </el-button> 
                </el-popover> 
            </el-col> 
            <el-col :span="11" style="padding-left:6px;" v-show="cWidth>240"> 
                <el-slider :format-tooltip="formatTime" :max="music.maxTime" @change="changeTime" v-model="music.currentTime" style="width: 100%;margin:-0.0625rem 0;"></el-slider> 
            </el-col> 
            <el-col :span="cWidth>240?6:20" class="time" style="color:#909399;font-size: 13px"> {{formatTime(music.currentTime?music.currentTime:0)}}/{{formatTime(music.maxTime?music.maxTime:0)}} </el-col> 
        </el-row> 
        <audio :ref="name" loop> 
        <source :src="music_url" type="audio/mpeg" @change="change">  
        </audio> 
    </div> 
</template>
    
<script>
export default {
    name: 'Aplayer',
    data(){ return { music:{ isPlay:false, currentTime:0, maxTime:0, volume:100 },timer:null,cWidth:null,s_url:'http://sc1.111ttt.cn:8282/2018/1/03m/13/396131232171.m4a?tflag=1519095601&pin=6cd414115fdb9a950d827487b16b5f97#.mp3' } },
	mounted(){
        var _this=this;
        this.$nextTick(()=>{
            this.listenMusic();
            this.timer=setInterval(this.listenMusic,1000)
        });
        eventBus.$on('music_play',(currentName)=>{
            if(!_this.$refs[_this.name]){ return } 
            else if(_this.$refs[_this.name]&&_this.name!=currentName){
                _this.$refs[_this.name].pause()
            }
        });
        console.log('change');
        this.cWidth=this.$refs.content.clientWidth;
    },
    props:['name','music_url','size'],
	methods: {
        change(){
            console.log('change')
        },
		listenMusic(){ 
            if(!this.$refs[this.name]){ return } 
            if(this.$refs[this.name].readyState){ this.music.maxTime = this.$refs[this.name].duration }
            if(this.$refs[this.name].paused){
                clearInterval(this.timer);
            } 
            this.music.isPlay=!this.$refs[this.name].paused 
            this.music.currentTime = this.$refs[this.name].currentTime 
        },
		play(){ 
            if(this.$refs[this.name].paused){ 
                this.$refs[this.name].play();
                eventBus.$emit('music_play',this.name);
                this.timer=setInterval(this.listenMusic,1000)
            }
            else{ this.$refs[this.name].pause(); clearInterval(this.timer);} 
            this.music.isPlay=!this.$refs[this.name].paused 
            this.$nextTick(()=>{ document.getElementById('play').blur() }) 
        },
		changeTime(time){
            this.$refs[this.name].currentTime = this.music.currentTime;
        },
		changeVolume(v){ 
            this.music.volume += v 
            if(this.music.volume>100){ this.music.volume = 100 } 
            if(this.music.volume<0){ this.music.volume = 0 } 
            this.$refs[this.name].volume = this.music.volume/100 
        },
		formatTime(time){ 
            let it = parseInt(time) 
            let m = parseInt(it/60) 
            let s = parseInt(it%60) 
            return (m<10?"0":"")+parseInt(it/60)+":"+(s<10?"0":"")+parseInt(it%60) 
        }
    }
};
</script>