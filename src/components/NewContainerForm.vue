<template>
  <n-form ref="formRef" :model="formValue" :rules="rules">
    <n-form-item label="Name" path="name">
      <n-input v-model:value="formValue.name" placeholder="New Container" />
    </n-form-item>
    <n-form-item label="Parent Container" path="parent">
      <container-select
        placeholder="Parent Container"
        :value="formValue.parent"
        @selectOption="(val) => (formValue.parent = val)"
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
  parent: "",
});
const rules = ref({
  name: {
    required: true,
    trigger: "input",
    validator: (rule, value) => {
      if (!value) {
        return Error("Container name required");
      }
      return value.includes("/") ? Error("Cannot Include '/' character") : true;
    },
  },
  parent: {
    required: false,
    trigger: "blur",
  },
});

function handleValidateClick(e) {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      console.log("valid");
      addNewContainer();
    } else {
      console.warn("errors", errors);
    }
  });
}

async function addNewContainer() {
  await store.dispatch("addContainer", {
    name: formValue.value.name,
    parentContainerId: formValue.value.parent || undefined,
  });
  formValue.value.name = "";
  formValue.value.parent = "";
  emit('formSubmitted');
}
</script>
