<template>
  <div
    v-if="hidden"
    class="w-full h-full z-50 bg-black absolute top-0 bottom-0 left-0 right-0 text-white flex justify-center items-center"
  >
    输入密码:
    <input
      autofocus
      v-model="passwd"
      @keyup.enter="handleEnter"
      class="border-0 p-2 m-2 rounded-lg text-black"
      type="password"
    />
  </div>
  <div class="about w-full h-screen border border-red-700" v-if="!hidden">
    <md-editor class="!h-full" v-model="text" @onSave="handleSave" >
   
    </md-editor>
  </div>
</template>
<script setup lang="ts">
import { ref, inject, toRaw } from 'vue';
import { notify } from 'notiwind';
import axios from 'axios';
import {MdEditor,NormalToolbar } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
let text = ref('');
let hidden = ref(true);
let passwd = ref('');
const handleEnter = () => {
  if (passwd.value.trim() === '1234') {
    hidden.value = false;
    notify(
      {
        group: 'foo',
        title: 'Success',
        text: '密码正确!',
      },
      500,
    );
  }
};

// axios({
//   method: 'get',
//   url: '/api/get',
// }).then((res) => {
//   text.value = res.data.content;
// });

fetch('/api/get')
  .then(response => response.json())
  .then(data => {
    text.value = data.content;
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
const handleSave = () => {
  // axios({
  //   method: 'post',
  //   url: '/api/save',
  //   data: {
  //     context: text.value,
  //   },
  // }).then((res) => {
  //   notify(
  //     {
  //       group: 'foo',
  //       title: 'Success',
  //       text: '保存成功!',
  //     },
  //     500,
  //   );
  // });
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
