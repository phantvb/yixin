<template>
    <div>
      <div contenteditable='true' id="bookTextarea" @input="test">
      hahaha
    </div>
    </div>
</template>
    
<script>
import Aplayer from './component/a_player.vue';
export default {
	name: 'test',
	data() {
		return {
      textpos:null,
      data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
        children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }
    };
	},
	components: { Aplayer },
	methods: {
    test(e){
      let oTextarea = document.getElementById('bookTextarea');
      oTextarea.focus();  
      if (e.data=='@') {
        this.textpos=window.getSelection().getRangeAt(0)||window.getSelection().getRangeAt(0)
        oTextarea.innerHTML=oTextarea.innerHTML.replace('@','<div class="outnote" ref="pos">!!</div>');
        console.log(document.getElementsByClassName('outnote')[0].offsetLeft)
      }
    },
    insertBook(bookMessage){
      var tc = document.getElementById("bookTextarea");  
    }
  },
};
</script>
<style scopp scoped>
.outnote{
  position: relative;
  display: inline;
}
div#bookTextarea{
  text-align: left;
  border:1px solid #ccc;
  width: 500px;
  height: 300px;
}
textarea{
  float: left;
}
</style>
