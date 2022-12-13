<template>
  <n-card
    :title="`${isNew ? 'New' : 'Edit'} Location`"
    :bordered="false"
    role="dialog"
    aria-modal="true"
  >
    <n-form ref="formRef" :model="formValue" :rules="rules" :disabled="saveLoading">
      <n-form-item label="Name" path="name">
        <n-input v-model:value="formValue.name" placeholder="Location Name" />
      </n-form-item>
      <n-form-item>
        <n-space align="center">
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
import { useStore } from "vuex";

const store = useStore();
const emit = defineEmits(["formSubmitted"]);

const props = defineProps({
  location: Object,
});

const keepOpen = ref(false);
const saveLoading = ref(false);
const formRef = ref(null);
const formValue = ref({
  name: props.location?.name || "",
});
const isNew = computed(() => !props.location);
const rules = ref({
  name: {
    required: true,
    trigger: "blur",
  },
});

function handleValidateClick(e) {
  e.preventDefault();
  formRef.value?.validate((errors) => {
    if (!errors) {
      addNewLocation();
    } else {
      console.warn("errors", errors);
    }
  });
}

async function addNewLocation() {
  saveLoading.value = true;
  await store.dispatch(isNew.value ? "addLocation" : "updateLocation", {
    id: props.location?.id,
    name: formValue.value.name.trim(),
  });

  if (isNew.value) {
    formValue.value.name = "";
  }
  saveLoading.value = false;
  if (!keepOpen.value) {
    emit("formSubmitted");
  }
}
</script>
