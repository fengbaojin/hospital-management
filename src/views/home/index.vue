<template>
   <div class="dashboard-editor-container">
    <div class=" clearfix">
      <div class="info-container">
        <!-- <span class="display_name">冯宝津</span> -->
      </div>
    </div>
    <div>
      <img class="emptyGif" :src="emptyGif">
    </div>
  </div>
</template>

<script>
export default {
  name:"home",
  data() {
    return{
      emptyGif: 'https://wpimg.wallstcn.com/0e03b7da-db9e-4819-ba10-9016ddfdaed3'
    }
  },
}
</script>

<style>
.emptyGif {
		display: block;
		width: 100%;
		height: 820px;
	}
</style>
