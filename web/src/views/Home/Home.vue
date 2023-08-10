<script setup lang="ts">
import { reactive, ref } from 'vue';
// import { Editor, Viewer } from '@bytemd/react'
import OperationSet from "./components/OperationSet.vue"
import {MdPreview,MdCatalog } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import '@/styles/github-heading.scss'
const scrollElement = document.documentElement;
const text = ref('');
const state = reactive({
  text: '',
  theme: 'githubHeadling'
});


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
  <OperationSet />
  <p class="text-center sm:hidden text-xs bg-white text-slate-400 m-0 block h-8 leading-8  italic">
    tip: 在 PC 端可直接打印本简历为 pdf 文件.
  </p>
  <main class="bg-white  container mx-auto p-4 lg:p-10 md:w-[944px] lg:w-[1024px] h-full sm:mb-12 sm:mt-12 shadow-xl">
    <MdCatalog
      class="fixed top-12 bottom-12 py-4 ml-4 overflow-auto  rounded-lg hidden 2xl:block left-0 bg-white w-72 border"
      editorId="printMe"
      :scrollElement="scrollElement"
    />
    <MdPreview
      class="md-preview border border-red-700"
      editorId="printMe"
      id="printMe"
      :previewTheme="state.theme"
      v-model="text"
    />
  </main>
</template>

<style lang="scss" scoped>
.md-preview :deep(.md-editor-preview-wrapper) {
  padding: 0;
}

@media (min-width: 640px) {
  .md-preview :deep(.md-editor-preview-wrapper) {
    padding: 0 4rem;
  }

}
</style>
