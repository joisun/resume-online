<script setup lang="ts">
import { reactive, ref } from 'vue';
// import { Editor, Viewer } from '@bytemd/react'
import OperationSet from "./components/OperationSet.vue"
import {MdPreview,MdCatalog } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import '@/styles/github-heading.scss'
import { notify } from 'notiwind';
const { VITE_PASSWD,VITE_PASSWD_INPUT_LABEL, VITE_SUCCESS_TITLE, VITE_SUCCESS_CONTENT, VITE_ERROR_TITLE, VITE_ERROR_CONTENT,VITE_PASSINPUTPAGE_BG} = import.meta.env
// 指定 背景的纹理
const background = VITE_PASSINPUTPAGE_BG || 'circuit-board'

const scrollElement = document.documentElement;
const state = reactive({
  text: '',
  hidden:VITE_PASSWD?.trim() ? true : false,
  passwd:'',
  theme: 'githubHeadling'
});

const handleEnter = () => {
  if (state.passwd.trim() === VITE_PASSWD) {
    state.hidden = false;
    notify(
      {
        group: 'foo',
        title: VITE_SUCCESS_TITLE || '成功',
        text: VITE_SUCCESS_CONTENT || '密码正确!',
      },
      2000,
    );
  }else{
    console.log("trigger")
    notify(
      {
        group: 'error',
        title: VITE_ERROR_TITLE || '错误！',
        text: VITE_ERROR_CONTENT || '请验证密码输入!',
      },
      2000,
    );
  }
};

// 埋个标识，用以标记用户访问证明，离开页面时告诉服务器，以记录该用户访问时长
const cacheUUID = (uuid)=>{
  sessionStorage.setItem('access_id', uuid)
}


fetch('/api/get')
  .then(response => response.json())
  .then(data => {
    state.text = data.content;
    if(data.uuid) cacheUUID(data.uuid)
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });


</script>

<template>
  <div
    v-if="state.hidden"
    :class="`z-0 bg-white absolute inset-0 text-black  ${background}`"
  >
  <div class="filter-mask absolute inset-0 flex flex-col justify-center items-center backdrop-blur-sm backdrop-opacity-80">
    {{VITE_PASSWD_INPUT_LABEL || '请输入密码:'}}
    <input
    autofocus
    v-model="state.passwd"
    @keyup.enter="handleEnter"
    class="border-2 p-2 m-2 rounded-lg text-black "
    type="password"
    />
  </div>
  </div>

  <template v-else>
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
        v-model="state.text"
      />
    </main>
  </template>
</template>

<style lang="scss" scoped>
@import url('./seamlessSvgPatterns.css');
.md-preview :deep(.md-editor-preview-wrapper) {
  padding: 0;
}

@media (min-width: 640px) {
  .md-preview :deep(.md-editor-preview-wrapper) {
    padding: 0 4rem;
  }

}
</style>
