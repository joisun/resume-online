<script setup lang="ts">
import { decryptData } from "@/utils";
import dayjs from "dayjs";
import "md-editor-v3/lib/style.css";
import { computed, ref } from "vue";
const { VITE_ROOT_PASSWD } = import.meta.env;

let passwdInput = ref("");
let adminPasswd = ref<string | null>(null);

let visible = computed(() => {
  if (adminPasswd.value === null) return false;
  return (
    passwdInput.value.trim() === adminPasswd.value ||
    passwdInput.value.trim() === VITE_ROOT_PASSWD
  );
});
let list = ref<{ leave_time: string; created_time: string; id: string }[]>([]);
let spin = ref(false);

fetch("/api/getPasswd")
  .then((response) => response.json())
  .then((data) => {
    adminPasswd.value = decryptData(data.ADMIN_PASSWD);
  })
  .catch((error) => {
    console.error("Fetch error:", error);
  });

const sendRequest = () => {
  spin.value = true;
  fetch("/api/getVisitors")
    .then((response) => response.json())
    .then((data) => {
      list.value = data;
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    })
    .finally(() => {
      setTimeout(() => {
        spin.value = false;
      }, 500);
    });
};
sendRequest();
const handleRefresh = () => {
  sendRequest();
};
</script>
<template>
  <div class="about w-auto sm:mx-auto my-4 border mx-4 text-sm" v-if="visible">
    <div
      class="refresh absolute right-4 top-4 cursor-pointer"
      :class="{ 'animate-spin': spin }"
      title="点击刷新"
      @click="handleRefresh"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
      >
        <path
          fill="none"
          stroke="currentColor"
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="1.5"
          d="m15.167 1l.598 1.118c.404.755.606 1.133.472 1.295c-.133.162-.573.031-1.454-.23A9.8 9.8 0 0 0 12 2.78c-5.247 0-9.5 4.128-9.5 9.22a8.97 8.97 0 0 0 1.27 4.61M8.834 23l-.598-1.118c-.404-.756-.606-1.134-.472-1.295c.133-.162.573-.032 1.454.23c.88.261 1.815.402 2.783.402c5.247 0 9.5-4.128 9.5-9.22a8.97 8.97 0 0 0-1.27-4.609"
          color="currentColor"
        />
      </svg>
    </div>

    <table class="w-full mx-auto sm:w-auto text-sm">
      <thead>
        <tr>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="r in list"
          :key="r.id"
          class="flex flex-col border p-2 border-gray-300 sm:table-row sm:border-none"
        >
          <td class="sm:p-2 p-0" v-for="(v, k) in r">
            <template v-if="k === 'id'" />

            <p v-else-if="['created_time', 'leave_time'].includes(k)">
              <span class="font-semibold mr-1">{{
                k == "created_time" ? "访问时间" : "离开时间"
              }}</span>
              <span>{{
                v ? dayjs(v).format("YYYY-MM-DD HH:mm:ss") : "-"
              }}</span>
            </p>
            <p v-else class="text-blue-500">
              <span class="font-semibold mr-1 text-blue-800">{{ k }}</span>
              <span>{{ v ? v : "-" }}</span>
            </p>
          </td>
          <td class="sm:p-2 p-0">
            <p>
              <span class="font-semibold mr-1 text-red-500">页面停留</span>
              <span class="text-red-800">{{
                r.leave_time
                  ? `${dayjs(r.leave_time).diff(
                      r.created_time,
                      "second"
                    )}秒（${dayjs(r.leave_time).diff(
                      r.created_time,
                      "minute"
                    )}分钟）`
                  : "可能正在访问..."
              }}</span>
            </p>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div
    v-else
    class="w-full h-full z-0 bg-black absolute top-0 bottom-0 left-0 right-0 text-white flex justify-center items-center"
  >
    输入密码:
    <input
      autocomplete="off"
      autofocus
      v-model="passwdInput"
      class="border-0 p-2 m-2 rounded-lg text-black"
      type="password"
    />
  </div>
</template>
