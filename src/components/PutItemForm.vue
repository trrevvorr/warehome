<template>
  <n-card
    :title="`${isNew ? 'New' : 'Edit'} Item`"
    :bordered="false"
    role="dialog"
    aria-modal="true"
  >
    <n-form ref="formRef" :model="formValue" :rules="rules">
      <n-form-item label="Name" path="name">
        <n-input v-model:value="formValue.name" placeholder="Item Name" />
      </n-form-item>
      <n-form-item label="Container" path="container">
        <container-select
          placeholder="Container"
          :value="formValue.container"
          @selectOption="(val) => (formValue.container = val)"
        />
      </n-form-item>
      <n-form-item>
        <n-space>
          <n-button v-if="!isNew" type="error" @click="handleDeleteClick"> Delete </n-button>
          <n-button @click="handleValidateClick" type="primary"> Save </n-button>
        </n-space>
      </n-form-item>
    </n-form>
  </n-card>
</template>

<script setup>
// n-form validation seems to require composition API for refs

import { ref, defineEmits, defineProps, computed } from "vue";
import { NForm, NFormItem, NInput, NButton, NCard, NSpace } from "naive-ui";
import ContainerSelect from "./ContainerSelect.vue";
import { useStore } from "vuex";
const store = useStore();
const emit = defineEmits(["formSubmitted"]);

const props = defineProps({
  item: Object,
});

const formRef = ref(null);
const formValue = ref({
  name: props.item?.name || "",
  container: props.item?.containerID || "",
});
const isNew = computed(() => !props.item);
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
  await store.dispatch(isNew.value ? "addItem" : "updateItem", {
    id: props.item?.id,
    name: formValue.value.name.trim(),
    containerId: formValue.value.container || undefined,
  });

  if (isNew.value) {
    formValue.value.name = "";
    formValue.value.container = "";
  }
  emit("formSubmitted");
}

async function handleDeleteClick() {
  await store.dispatch("deleteItem", props.item.id);
  emit("formSubmitted");
}
</script>
