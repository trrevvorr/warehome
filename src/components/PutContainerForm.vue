<template>
  <n-card
    :title="`${isNew ? 'New' : 'Edit'} Container`"
    :bordered="false"
    role="dialog"
    aria-modal="true"
  >
    <n-form ref="formRef" :model="formValue" :rules="rules">
      <n-form-item label="Name" path="name">
        <n-input v-model:value="formValue.name" placeholder="Container Name" />
      </n-form-item>
      <n-form-item label="Parent Container" path="parent">
        <container-select
          placeholder="Parent Container"
          :value="formValue.parent"
          @selectOption="(val) => (formValue.parent = val)"
        />
      </n-form-item>
      <n-form-item>
        <n-space>
          <span v-if="!isNew">
            <n-tooltip
              v-if="
                store.getters.getChildrenForContainer(container).length > 0 ||
                (items && items.length > 0)
              "
            >
              <template #trigger>
                <n-button disabled type="error" tag="div"> Delete </n-button>
              </template>
              Cannot delete container with children or items
            </n-tooltip>
            <n-button v-else type="error" @click="handleConfirmDelete"> Delete </n-button>
          </span>
          <n-button @click="handleValidateClick" type="primary"> Save </n-button>
        </n-space>
      </n-form-item>
    </n-form>
  </n-card>
</template>

<script setup lang="ts">
// n-form validation seems to require composition API for refs

import { ref, defineEmits, defineProps, computed, Ref } from "vue";
import { NForm, NFormItem, NInput, NButton, NCard, NTooltip, NSpace, FormRules } from "naive-ui";
import ContainerSelect from "./ContainerSelect.vue";
import { useStore } from "vuex";
import { useDialog } from "naive-ui";
import { Container, Item } from "@/models";

const store = useStore();
const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (e: "formSubmitted"): void;
}>();
const props = defineProps<{
  container: Container;
}>();

const dialog = useDialog();
const formRef = ref(null) as Ref<any>;
const formValue = ref({
  name: props.container?.name || "",
  parent: props.container?.parentContainerID || "",
});
const isNew = computed(() => !props.container);
const items = ref(
  props.container &&
    store.getters.items.filter((item: Item) => item.containerID === props.container.id)
);
const rules: Ref<FormRules> = ref({
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
} as FormRules);

function handleValidateClick(e: MouseEvent) {
  e.preventDefault();
  if (formRef.value) {
    formRef.value.validate((errors: Error[]) => {
      if (!errors) {
        addNewContainer();
      } else {
        console.warn("errors", errors);
      }
    });
  }
}

async function addNewContainer() {
  await store.dispatch(isNew.value ? "addContainer" : "updateContainer", {
    id: props.container?.id,
    name: formValue.value.name,
    parentContainerId: formValue.value.parent || undefined,
  });

  if (isNew.value) {
    formValue.value.name = "";
    formValue.value.parent = "";
  }
  emit("formSubmitted");
}

function handleConfirmDelete() {
  dialog.error({
    title: "Confirm Delete",
    content: `Are you sure you want to delete ${props.container.name}?`,
    positiveText: "Delete",
    negativeText: "Cancel",
    onPositiveClick: () => {
      handleDelete();
    },
    onNegativeClick: () => {},
  });
}

async function handleDelete() {
  await store.dispatch("deleteContainer", props.container.id);
  emit("formSubmitted");
}
</script>
