<script setup lang="ts">
import { decryptData, encryptData } from "@/utils";
import { notify } from "notiwind";
import { computed, onMounted, ref } from "vue";
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
const formData = ref({
  ADMIN_PASSWD: "",
  PASSWD: "",
  PASSINPUTPAGE_BG: "circuit-board",
  PASSWD_INPUT_LABEL: "请输入密码:",
  SUCCESS_TITLE: "成功",
  SUCCESS_CONTENT: "密码正确!",
  ERROR_TITLE: "错误！",
  ERROR_CONTENT: "请验证密码输入!",
  FONT_FAMILY: "font-sans",
  FONT_WEIGHT: "font-normal",
  THEME: "default",
  DISABLE_TRANSITION: false,
});

async function fetchInitialData() {
  try {
    const response = await fetch("/api/getRootSettings");
    if (response.ok) {
      const data = await response.json();
      formData.value = {
        ...formData.value,
        ...data,
        ADMIN_PASSWD: decryptData(data.ADMIN_PASSWD),
        PASSWD: decryptData(data.PASSWD),
      };
    } else {
      console.error("获取初始数据失败");
    }
  } catch (error) {
    console.error("错误:", error);
  }
}

async function handleSubmit() {
  try {
    const response = await fetch("/api/updateSettings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...formData.value,
        ADMIN_PASSWD: encryptData(formData.value.ADMIN_PASSWD),
        PASSWD: encryptData(formData.value.PASSWD),
      }),
    });

    if (response.ok) {
      notify(
        {
          group: "foo",
          title: "成功",
          text: "设置更新成功",
        },
        2000
      );
    } else {
      notify(
        {
          group: "error",
          title: "失败",
          text: "更新设置失败",
        },
        2000
      );
    }
  } catch (error) {
    notify(
      {
        group: "error",
        title: "错误",
        text: "未知错误",
      },
      2000
    );
    console.error("错误:", error);
  }
}

onMounted(fetchInitialData);
fetch("/api/getPasswd")
  .then((response) => response.json())
  .then((data) => {
    adminPasswd.value = decryptData(data.ADMIN_PASSWD);
  })
  .catch((error) => {
    console.error("Fetch error:", error);
  });
</script>
<template>
  <div
    v-if="visible"
    class="min-h-screen flex items-center justify-center bg-black bg-opacity-90 p-6"
  >
    <div class="max-w-3xl w-full bg-gray-600/5 p-6 rounded-lg shadow-lg">
      <h2 class="text-2xl font-semibold text-gray-100 mb-4">更新设置</h2>
      <form @submit.prevent="handleSubmit" class="grid grid-cols-2 gap-x-4">
        <div class="mb-4">
          <label
            for="adminPasswd"
            class="block text-sm font-medium text-gray-300 mb-1"
            >管理员密码</label
          >
          <input
            v-model="formData.ADMIN_PASSWD"
            id="adminPasswd"
            type="password"
            placeholder="请输入 /admin 的密码"
            class="w-full px-3 py-2 bg-black/50 border border-gray-700/50 rounded focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-200"
            required
          />
        </div>

        <div class="mb-4">
          <label
            for="passwd"
            class="block text-sm font-medium text-gray-300 mb-1"
            >简历首页密码</label
          >
          <input
            v-model="formData.PASSWD"
            id="passwd"
            type="password"
            placeholder="可选，留空视作没有密码"
            class="w-full px-3 py-2 bg-black/50 border border-gray-700/50 rounded focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-200"
          />
        </div>

        <div class="mb-4">
          <label
            for="bgSelect"
            class="block text-sm font-medium text-gray-300 mb-1"
            >背景图</label
          >
          <select
            v-model="formData.PASSINPUTPAGE_BG"
            id="bgSelect"
            class="w-full px-3 py-2 bg-black/50 border border-gray-700/50 rounded focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-200"
          >
            <option value="food">Food</option>
            <option value="circuit-board">Circuit Board</option>
            <option value="wave">Wave</option>
            <option value="foliage">Foliage</option>
            <option value="square">Square</option>
          </select>
        </div>

        <div class="mb-4">
          <label
            for="passwdInputLabel"
            class="block text-sm font-medium text-gray-300 mb-1"
            >密码输入框提示</label
          >
          <input
            v-model="formData.PASSWD_INPUT_LABEL"
            id="passwdInputLabel"
            type="text"
            placeholder="请输入密码:"
            class="w-full px-3 py-2 bg-black/50 border border-gray-700/50 rounded focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-200"
          />
        </div>

        <div class="mb-4">
          <label
            for="successTitle"
            class="block text-sm font-medium text-gray-300 mb-1"
            >成功提示标题</label
          >
          <input
            v-model="formData.SUCCESS_TITLE"
            id="successTitle"
            type="text"
            placeholder="成功"
            class="w-full px-3 py-2 bg-black/50 border border-gray-700/50 rounded focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-200"
          />
        </div>

        <div class="mb-4">
          <label
            for="successContent"
            class="block text-sm font-medium text-gray-300 mb-1"
            >成功提示内容</label
          >
          <input
            v-model="formData.SUCCESS_CONTENT"
            id="successContent"
            type="text"
            placeholder="密码正确!"
            class="w-full px-3 py-2 bg-black/50 border border-gray-700/50 rounded focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-200"
          />
        </div>

        <div class="mb-4">
          <label
            for="errorTitle"
            class="block text-sm font-medium text-gray-300 mb-1"
            >错误提示标题</label
          >
          <input
            v-model="formData.ERROR_TITLE"
            id="errorTitle"
            type="text"
            placeholder="错误！"
            class="w-full px-3 py-2 bg-black/50 border border-gray-700/50 rounded focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-200"
          />
        </div>

        <div class="mb-4">
          <label
            for="errorContent"
            class="block text-sm font-medium text-gray-300 mb-1"
            >错误提示内容</label
          >
          <input
            v-model="formData.ERROR_CONTENT"
            id="errorContent"
            type="text"
            placeholder="请验证密码输入!"
            class="w-full px-3 py-2 bg-black/50 border border-gray-700/50 rounded focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-200"
          />
        </div>

        <div class="mb-4">
          <label
            for="fontFamily"
            class="block text-sm font-medium text-gray-300 mb-1"
            >字体</label
          >
          <select
            v-model="formData.FONT_FAMILY"
            id="fontFamily"
            class="w-full px-3 py-2 bg-black/50 border border-gray-700/50 rounded focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-200"
          >
            <option value="font-mono">Mono</option>
            <option value="font-sans">Sans</option>
            <option value="font-serif">Serif</option>
          </select>
        </div>

        <div class="mb-4">
          <label
            for="fontWeight"
            class="block text-sm font-medium text-gray-300 mb-1"
            >字体粗细</label
          >
          <select
            v-model="formData.FONT_WEIGHT"
            id="fontWeight"
            class="w-full px-3 py-2 bg-black/50 border border-gray-700/50 rounded focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-200"
          >
            <option value="font-thin">Thin</option>
            <option value="font-normal">Normal</option>
            <option value="font-medium">Medium</option>
            <option value="font-semibold">Semibold</option>
            <option value="font-bold">Bold</option>
          </select>
        </div>

        <div class="mb-4">
          <label
            for="theme"
            class="block text-sm font-medium text-gray-300 mb-1"
            >主题</label
          >
          <select
            v-model="formData.THEME"
            id="theme"
            class="w-full px-3 py-2 bg-black/50 border border-gray-700/50 rounded focus:outline-none focus:ring-2 focus:ring-gray-600 text-gray-200"
          >
            <option value="default">Default</option>
            <!-- 可以在这里添加更多主题选项 -->
          </select>
        </div>

        <div class="mb-4 flex items-center">
          <input
            v-model="formData.DISABLE_TRANSITION"
            id="disableTransition"
            type="checkbox"
            class="mr-2"
          />
          <label
            for="disableTransition"
            class="block text-sm font-medium text-gray-300"
            >禁用过渡动画（禁用简历页面，的简历蒙层过渡效果）</label
          >
        </div>

        <button
          type="submit"
          class="w-full py-2 bg-black/50 hover:bg-black/90 text-white font-bold rounded focus:outline-none focus:ring-2 focus:ring-gray-600"
        >
          更新设置
        </button>
      </form>
    </div>
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
