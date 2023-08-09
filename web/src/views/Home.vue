<script setup lang="ts">
import { reactive, ref } from 'vue';
// import { Editor, Viewer } from '@bytemd/react'
import {MdPreview,MdCatalog } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import '@/styles/github-heading.scss'
const scrollElement = document.documentElement;
const text = ref('');
const state = reactive({
  text: '',
  theme: 'githubHeadling'
});


const onGetCatalog = (list) => {
};



fetch('/api/get')
  .then(response => response.json())
  .then(data => {
    text.value = data.content;
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
</script>

<template>
  <div
    class="bg-white container mx-auto px-5 py-5 lg:px-20 lg:w-3/5 h-full m-5 border"
  >
    <nav class="flex justify-end gap-5">
      <a
        id="mobile-lookup"
        class="link-button relative flex flex-col items-center"
        href="javascript:void(0)"
      >
        <span class="flex items-center">
          移动端查看
          <svg
            t="1660479955746"
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3319"
            width="20"
            height="20"
          >
            <path
              d="M736 0H288C235.2 0 192 43.2 192 96v832c0 52.8 43.2 96 96 96h448c52.8 0 96-43.2 96-96V96c0-52.8-43.2-96-96-96zM384 48h256v32h-256v-32zM512 960a64 64 0 1 1-0.032-127.968A64 64 0 0 1 512 960z m256-192H256V128h512v640z"
              p-id="3320"
            ></path>
          </svg>
        </span>
        <div
          class="qr-code border w-56 p-3 absolute z-50 bg-white mt-12 flex flex-col items-center"
        >
          <div
            class="w-5 h-5 bg-white rotate-45 border absolute z-49 top-[-9px] border-b-0 border-r-0"
          ></div>
          <img src="@/assets/qr.png" class="aspect-square" alt="" />
        </div>
      </a>

      <a href="javascript:void(0)" class="link-button" v-print="'#printMe'">
        <span class="flex items-center">
          PDF打印下载
          <svg
            class="icon"
            t="1660469788691"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2384"
            width="24"
            height="24"
          >
            <path
              d="M820 436h-40c-4.4 0-8 3.6-8 8v40c0 4.4 3.6 8 8 8h40c4.4 0 8-3.6 8-8v-40c0-4.4-3.6-8-8-8z"
              p-id="2385"
            ></path>
            <path
              d="M852 332H732V120c0-4.4-3.6-8-8-8H300c-4.4 0-8 3.6-8 8v212H172c-44.2 0-80 35.8-80 80v328c0 17.7 14.3 32 32 32h168v132c0 4.4 3.6 8 8 8h424c4.4 0 8-3.6 8-8V772h168c17.7 0 32-14.3 32-32V412c0-44.2-35.8-80-80-80zM360 180h304v152H360V180z m304 664H360V568h304v276z m200-140H732V500H292v204H160V412c0-6.6 5.4-12 12-12h680c6.6 0 12 5.4 12 12v292z"
              p-id="2386"
            ></path>
          </svg>
        </span>
      </a>
    </nav>
  </div>
  <main
    class="bg-white container mx-auto p-2 lg:p-10 lg:w-3/5 h-full mb-48 shadow-xl"
  >
    <MdCatalog class="fixed top-0 mt-28 hidden 2xl:block left-0 bg-white w-80" editorId='printMe' :scrollElement="scrollElement"/>
    <MdPreview class="md-preview" editorId='printMe' id="printMe" @onGetCatalog="onGetCatalog" :previewTheme="state.theme" v-model="text" />
  </main>
</template>

<style lang="scss" scoped>
.icon:hover,
.link-button:hover {
  color: rgb(81, 81, 255);
  fill: rgb(81, 81, 255);
}

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
.md-preview :deep(.md-editor-preview-wrapper){
  padding: 4rem;
  
}
</style>
