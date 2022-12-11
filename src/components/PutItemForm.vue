<template>
  <n-card
    :title="`${isNew ? 'New' : 'Edit'} Item`"
    :bordered="false"
    role="dialog"
    aria-modal="true"
  >
    <n-form
      ref="formRef"
      :model="formValue"
      :rules="rules"
      :disabled="deleteLoading || saveLoading"
    >
      <n-form-item label="Name" path="name">
        <n-input v-model:value="formValue.name" placeholder="Item Name" />
      </n-form-item>
      <n-form-item label="Container" path="container">
        <container-select
          placeholder="Container"
          :value="formValue.container"
          @selectOption="(val) => (formValue.container = val)"
          :disabled="deleteLoading || saveLoading"
        />
      </n-form-item>
      <n-form-item>
        <n-space align="center">
          <n-button
            :loading="deleteLoading"
            v-if="!isNew"
            type="error"
            @click="handleConfirmDelete"
          >
            Delete
          </n-button>
          <n-button :loading="saveLoading" @click="handleValidateClick" type="primary">
            Save
          </n-button>
          <n-checkbox v-if="isNew" v-model:checked="keepOpen"> Add More </n-checkbox>
        </n-space>
      </n-form-item>
    </n-form>
  </n-card>
</template>

<script setup>
// n-form validation seems to require composition API for refs

import { ref, defineEmits, defineProps, computed } from "vue";
import { NForm, NFormItem, NInput, NButton, NCheckbox, NCard, NSpace } from "naive-ui";
import ContainerSelect from "./ContainerSelect.vue";
import { useStore } from "vuex";
import { useDialog } from "naive-ui";

const store = useStore();
const emit = defineEmits(["formSubmitted"]);

const props = defineProps({
  item: Object,
});

const keepOpen = ref(false);
const deleteLoading = ref(false);
const saveLoading = ref(false);
const dialog = useDialog();
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
  saveLoading.value = true;
  await store.dispatch(isNew.value ? "addItem" : "updateItem", {
    id: props.item?.id,
    name: formValue.value.name.trim(),
    containerId: formValue.value.container || undefined,
  });

  if (isNew.value) {
    formValue.value.name = "";
    formValue.value.container = "";
  }
  saveLoading.value = false;
  if (!keepOpen.value) {
    emit("formSubmitted");
  }
}

function handleConfirmDelete() {
  dialog.error({
    title: "Confirm Delete",
    content: `Are you sure you want to delete ${props.item.name}?`,
    positiveText: "Delete",
    negativeText: "Cancel",
    onPositiveClick: () => {
      handleDelete();
    },
    onNegativeClick: () => {},
  });
}

async function handleDelete() {
  deleteLoading.value = true;
  await store.dispatch("deleteItem", props.item.id);
  deleteLoading.value = false;
  emit("formSubmitted");
}
</script>
