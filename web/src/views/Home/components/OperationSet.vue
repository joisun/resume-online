<script lang="ts" setup>
import Qrcode from "qrcode"
import { onMounted } from "vue"

onMounted(() => {
  Qrcode.toCanvas(document.getElementById('canvas'), window.location.href, {
    width: 180,
    margin: 1
  }, function (error) {
    if (error) console.error(error)
  })
})
const location = window.location.href
</script>
<template>
  <div class="text-gray-400 bottom-20 right-20 fixed lg:flex flex-col gap-8 z-10 hidden ">
    <a class="flex justify-center items-center  link-button w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 hover:text-gray-50 transition-all "
      title="PDF打印下载" href="javascript:void(0)" v-print="{ id: 'printMe', popTitle: `在线简历地址：${location}` }">
      <span class="flex items-center">
        <svg class="icon" t="1660469788691" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
          p-id="2384" width="24" height="24" fill="currentColor">
          <path d="M820 436h-40c-4.4 0-8 3.6-8 8v40c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-40c0-4.4-3.6-8-8-8z"
            p-id="2385"></path>
          <path
            d="M852 332H732V120c0-4.4-3.6-8-8-8H300c-4.4 0-8 3.6-8 8v212H172c-44.2 0-80 35.8-80 80v328c0 17.7 14.3 32 32 32h168v132c0 4.4 3.6 8 8 8h424c4.4 0 8-3.6 8-8V772h168c17.7 0 32-14.3 32-32V412c0-44.2-35.8-80-80-80zM360 180h304v152H360V180z m304 664H360V568h304v276z m200-140H732V500H292v204H160V412c0-6.6 5.4-12 12-12h680c6.6 0 12 5.4 12 12v292z"
            p-id="2386"></path>
        </svg>
      </span>
    </a>
    <!-- <a id="mobile-lookup" title="移动端查看"
      class="flex justify-center items-center relative  link-button  w-12 h-12 rounded-full bg-gray-200 hover:bg-gray-300 hover:text-gray-50 transition-all"
      href="javascript:void(0)">
      <span class="flex items-center ">
        <svg fill="currentColor" t="1660479955746" class="icon" viewBox="0 0 1024 1024" version="1.1"
          xmlns="http://www.w3.org/2000/svg" p-id="3319" width="20" height="20">
          <path
            d="M736 0H288C235.2 0 192 43.2 192 96v832c0 52.8 43.2 96 96 96h448c52.8 0 96-43.2 96-96V96c0-52.8-43.2-96-96-96zM384 48h256v32h-256v-32zM512 960a64 64 0 1 1-0.032-127.968A64 64 0 0 1 512 960z m256-192H256V128h512v640z"
            p-id="3320"></path>
        </svg>
      </span>
      <div class="qr-code rounded-lg p-3 absolute  top-16  bg-white  flex flex-col items-center shadow-lg ">
        <div class="w-5 h-5 bg-white rotate-45 border absolute z-49 top-[-9px] border-b-0 border-r-0"></div>
        <canvas style="width:256px;height:256px" id="canvas" class="aspect-square"></canvas>
      </div>
    </a> -->
  </div>
</template>
<style>
.qr-code {
  scale: 0;
  transform: translateY(-20px);
  transition: all cubic-bezier(0.075, 0.82, 0.165, 1) 0.3s;
}

#mobile-lookup:hover .qr-code {
  transform: translateY(0);

  scale: 1;
}

.qr-code img {
  height: 0;
}

#mobile-lookup:hover img {
  height: 100%;
}
</style>