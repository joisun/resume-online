<script setup lang="ts">
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { notify } from 'notiwind';
import { ref } from 'vue';
let text = ref('');
let hidden = ref(true);
let passwd = ref('');
const handleEnter = () => {
  if (!import.meta.env.VITE_ADMIN_PASSWD) {
    notify(
      {
        group: 'error',
        title: '编辑页面密码不可缺省',
        text: '检查你的环境变量中的 VITE_ADMIN_PASSWD 字段是否有设定',
      },
      2000,
    );
    return
  }
  if (passwd.value.trim() === import.meta.env.VITE_ADMIN_PASSWD) {
    hidden.value = false;
    notify(
      {
        group: 'foo',
        title: 'Success',
        text: '密码正确!',
      },
      500,
    );
  } else {
    console.log("trigger")
    notify(
      {
        group: 'error',
        title: '君子坦蛋蛋，小人藏鸡鸡！',
        text: '再错我报警了啊！！！',
      },
      2000,
    );
  }
};



fetch('/api/get')
  .then(response => response.json())
  .then(data => {
    text.value = data.content;
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
const handleSave = () => {
  fetch('/api/save', {
    method: 'post',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      context: text.value
    })
  })
    .then(response => {
      if (response.ok) {
        notify(
          {
            group: 'foo',
            title: 'Success',
            text: '保存成功!',
          },
          500,
        );
      } else {
        throw new Error('Network response was not ok');
      }
    })
    .catch(error => {
      console.error('Fetch error:', error);
    });
};
</script>

<template>
  <div v-if="hidden"
    class="w-full h-full z-0 bg-black absolute top-0 bottom-0 left-0 right-0 text-white flex justify-center items-center">
    输入密码:
    <input autofocus v-model="passwd" @keyup.enter="handleEnter" class="border-0 p-2 m-2 rounded-lg text-black"
      type="password" />
  </div>
  <div class="about w-full h-screen border border-red-700" v-if="!hidden">
    <md-editor class="!h-full" v-model="text" @onSave="handleSave"></md-editor>
  </div>
</template>
