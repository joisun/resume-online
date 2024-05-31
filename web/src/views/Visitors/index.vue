<template>
  <div v-if="hidden"
    class="w-full h-full z-0 bg-black absolute top-0 bottom-0 left-0 right-0 text-white flex justify-center items-center">
    输入密码:
    <input autofocus v-model="passwd" @keyup.enter="handleEnter" class="border-0 p-2 m-2 rounded-lg text-black"
      type="password" />
  </div>
  <div class="about w-auto sm:mx-auto  my-4 border mx-4 text-sm" v-if="!hidden">
    <table class="w-full mx-auto sm:w-auto text-sm">
      <thead>
        <tr>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="r in list" :key="r.id" class="flex flex-col border p-2 border-gray-300 sm:table-row sm:border-none">
          <td class="sm:p-2 p-0" v-for="(v, k) in r">
            <template v-if="k === 'id'" />

            <p v-else-if="['created_time', 'leave_time'].includes(k)">
              <span class="font-semibold mr-1">{{ k == 'created_time' ? '访问时间' : '离开时间' }}</span>
              <span>{{ v ? dayjs(v).format('YYYY-MM-DD HH:mm:ss') : '-' }}</span>
            </p>
            <p v-else class="text-blue-500">
              <span class="font-semibold mr-1 text-blue-800">{{ k }}</span>
              <span>{{ v ? v : '-' }}</span>
            </p>
          </td>
          <td class="sm:p-2 p-0">
            <p>
              <span class="font-semibold mr-1 text-red-500">页面停留</span>
              <span class="text-red-800">{{ r.leave_time ? `${dayjs(r.leave_time).diff(r.created_time,
                'second')}秒（${dayjs(r.leave_time).diff(r.created_time, 'minute')}分钟）` : '可能正在访问...' }}</span>
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { notify } from 'notiwind';
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import dayjs from "dayjs"
console.log('dayjs', dayjs)
let text = ref('');
let hidden = ref(true);
let passwd = ref('');
let list = ref([])
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


fetch('/api/getVisitors')
  .then(response => response.json())
  .then(data => {
    list.value = data;
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });

</script>
