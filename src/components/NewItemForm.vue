<template>
  <n-form ref="formRef" :model="formValue" :rules="rules">
    <n-form-item label="Name" path="name">
      <n-input v-model:value="formValue.name" placeholder="New Item" />
    </n-form-item>
    <n-form-item label="Container" path="container">
      <container-select
        placeholder="Container"
        :value="formValue.container"
        @selectOption="(val) => (formValue.container = val)"
      />
    </n-form-item>
    <n-form-item>
      <n-button @click="handleValidateClick" type="primary"> Save </n-button>
    </n-form-item>
  </n-form>
</template>

<script setup>
// n-form validation seems to require composition API for refs

import { ref, defineEmits } from "vue";
import { NForm, NFormItem, NInput, NButton } from "naive-ui";
import ContainerSelect from "./ContainerSelect.vue";
import { useStore } from "vuex";
const store = useStore();
const emit = defineEmits(['formSubmitted']);

const formRef = ref(null);
const formValue = ref({
  name: "",
  container: "",
});
const rules = ref({
  name: {
    required: true,
    trigger: "blur",
  },
  container: {
    required: false,
    trigger: "blur",
  },
});

function handleValidateClick(e) {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      addNewItem();
    } else {
      console.warn("errors", errors);
    }
  });
}

async function addNewItem() {
  await store.dispatch("addItem", {
    name: formValue.value.name,
    containerId: formValue.value.container || undefined,
  });
  formValue.value.name = "";
  formValue.value.container = "";
  emit('formSubmitted');
}
</script>
