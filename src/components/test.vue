<template>
    <div :style="{'width':'200px'}">
      <Aplayer v-for="item in nameList" :name='item' :key="item"></Aplayer>
    </div>
</template>
    
<script>
import Aplayer from './component/a_player.vue';
export default {
	name: 'test',
	data() {
		return {
      nameList:[
        'music1',
        'music2',
        'music3',
        'music4'
      ]
    };
	},
	components: { Aplayer },
	methods: {

  },
};
</script>