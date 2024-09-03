<script setup lang="ts">
import metaRender from '@/mdPlugins/metaRender';
import '@/styles/github-heading.scss';
import mdfm from "markdown-it-front-matter";
import { MdCatalog, MdPreview, config } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import { notify } from 'notiwind';
import Qrcode from "qrcode";
import { nextTick, onMounted, reactive, ref } from 'vue';
import OperationSet from "./components/OperationSet.vue";
const { VITE_PASSWD, VITE_PASSWD_INPUT_LABEL, VITE_SUCCESS_TITLE, VITE_SUCCESS_CONTENT, VITE_ERROR_TITLE, VITE_ERROR_CONTENT, VITE_PASSINPUTPAGE_BG } = import.meta.env
// 指定 背景的纹理
const background = VITE_PASSINPUTPAGE_BG || 'circuit-board'
const mdPreviewRef = ref()
const scrollElement = document.documentElement;
const state = reactive({
  text: '',
  hidden: VITE_PASSWD?.trim() ? true : false,
  passwd: '',
  theme: 'githubHeadling'
});
config({
  markdownItConfig(mdit) {
    mdit.use(mdfm, (fm:string)=>{    
      mdit.use(metaRender, fm);
    });
  }
});

const handleEnter = () => {
  if (state.passwd.trim() === VITE_PASSWD) {
    state.hidden = false;
    nextTick(generateQr)
    notify(
      {
        group: 'foo',
        title: VITE_SUCCESS_TITLE || '成功',
        text: VITE_SUCCESS_CONTENT || '密码正确!',
      },
      2000,
    );
  } else {
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

onMounted(() => {
  if (!state.hidden){
    generateQr()
  }
})
const generateQr = () => {
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  if(isMobile) return 
  const mdPreviewDom = mdPreviewRef.value.$el
  const firstChild = mdPreviewDom.firstChild
  const canvasEl = document.createElement('canvas');
  const canvasInnerWrap = document.createElement('div');
  canvasInnerWrap.appendChild(canvasEl)

  const canvasWrap = document.createElement('div');
  // canvas 本身必须用div包裹，否则打印位置会和其他内容颠倒
  canvasWrap.appendChild(canvasInnerWrap)


  const textNode = document.createElement('span')
  textNode.textContent = '扫码以查看在线简历'
  textNode.style.cssText = `
  font-size:10px;
  font-weight:bold;
  text-align:center;
  display:grid;
  `
  canvasWrap.appendChild(textNode)
  canvasWrap.style.cssText = `
  position:absolute;
  top:3.75em;
  right:4rem;
  `

  Qrcode.toCanvas(canvasEl, window.location.href, {
    width: 100,
    margin: 1
  }, function (error) {
    if (error) console.error(error)
  })
  mdPreviewDom.insertBefore(canvasWrap, firstChild)
}

// 埋个标识，用以标记用户访问证明，离开页面时告诉服务器，以记录该用户访问时长
const cacheUUID = (uuid: string) => {
  sessionStorage.setItem('access_id', uuid)
}
fetch('/api/get')
  .then(response => response.json())
  .then(data => {
    state.text = data.content;
    if (data.uuid) cacheUUID(data.uuid)
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
</script>

<template>
  <div v-if="state.hidden" :class="`z-0 bg-white absolute inset-0 text-black  ${background}`">
    <div
      class="filter-mask absolute inset-0 flex flex-col justify-center items-center backdrop-blur-sm backdrop-opacity-80">
      {{ VITE_PASSWD_INPUT_LABEL || '请输入密码:' }}
      <input autocomplete="off" autofocus v-model="state.passwd" @keyup.enter="handleEnter" class="border-2 p-2 m-2 rounded-lg text-black "
        type="password" />
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
        editorId="bind-md-log-and-preview" :scrollElement="scrollElement" />
      <MdPreview ref="mdPreviewRef" class="md-preview border border-red-700" editorId="bind-md-log-and-preview"
        id="printMe" :previewTheme="state.theme" v-model="state.text" />
    </main>
  </template>

  <footer class=" text-gray-500 text-center whitespace-nowrap my-4 text-sm">Page powered by <a target="_blank" class="font-semibold underline underline-offset-2 hover:text-black" href="https://github.com/jaycethanks/resume-online"> <svg class="inline" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24"><path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"/></svg>resume-online</a></footer>
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
