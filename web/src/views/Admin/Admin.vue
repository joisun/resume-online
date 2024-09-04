<script setup lang="ts">
import metaRender from "@/mdPlugins/metaRender";
import { decryptData } from "@/utils";
import mdfm from "markdown-it-front-matter";
import { MdEditor, config } from "md-editor-v3";
import "md-editor-v3/lib/style.css";
import { notify } from "notiwind";
import { computed, ref } from "vue";
const { VITE_ROOT_PASSWD } = import.meta.env;

let text = ref("");
let passwdInput = ref("");
let adminPasswd = ref<null | string>(null);
let visible = computed(() => {
  if (adminPasswd.value === null) return false;
  return (
    passwdInput.value.trim() === adminPasswd.value ||
    passwdInput.value.trim() === VITE_ROOT_PASSWD
  );
});

config({
  markdownItConfig(mdit) {
    mdit.use(mdfm, (fm: string) => {
      mdit.use(metaRender, fm);
    });
  },
});

fetch("/api/get")
  .then((response) => response.json())
  .then((data) => {
    text.value = data.content;
  })
  .catch((error) => {
    console.error("Fetch error:", error);
  });
fetch("/api/getPasswd")
  .then((response) => response.json())
  .then((data) => {
    adminPasswd.value = decryptData(data.ADMIN_PASSWD);
  })
  .catch((error) => {
    console.error("Fetch error:", error);
  });
const handleSave = () => {
  fetch("/api/save", {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      context: text.value,
      created_at : new Date()
    }),
  })
    .then((response) => {
      if (response.ok) {
        notify(
          {
            group: "foo",
            title: "Success",
            text: "保存成功!",
          },
          500
        );
      } else {
        throw new Error("Network response was not ok");
      }
    })
    .catch((error) => {
      console.error("Fetch error:", error);
    });
};
</script>

<template>
  <div class="about w-full h-screen border border-red-700" v-if="visible">
    <md-editor class="!h-full" v-model="text" @onSave="handleSave"></md-editor>
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
