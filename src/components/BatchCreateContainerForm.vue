<template>
  <n-form
    ref="formRef"
    :model="formValue"
    :rules="rules"
    id="batch-create-container-form"
    :disabled="saveLoading"
  >
    <fieldset>
      <legend>Name</legend>
      <div class="name-input">
        <n-form-item label="Prefix" path="preix">
          <n-input v-model:value="formValue.prefix" placeholder="Prefix" />
        </n-form-item>
        <n-form-item label="Range" path="range">
          <n-input
            class="range-input"
            pair
            separator="→"
            :allow-input="onlyAllowNumber"
            :placeholder="['1', '3']"
            v-model:value="formValue.range"
            :input-props="{ type: 'number' }"
          />
        </n-form-item>
        <n-form-item label="Suffix" path="suffix">
          <n-input v-model:value="formValue.suffix" placeholder="Suffix" />
        </n-form-item>
      </div>
      <div class="name-preview">
        <span>Preview</span>
        <div class="preview-items">
          <n-tag
            :bordered="false"
            class="preview-item"
            v-for="name in names.slice(0, 3)"
            :key="name"
            >{{ name }}</n-tag
          >
          <n-tag :bordered="false" class="preview-item" v-if="names.length > 3">...</n-tag>
          <n-text depth="3" v-if="names.length === 0">No names to preview</n-text>
        </div>
      </div>
    </fieldset>
    <br />

    <n-form-item label="Parent Container" path="parent">
      <container-select
        placeholder="Parent Container"
        :value="formValue.parent"
        @selectOption="(val) => (formValue.parent = val)"
        :disabled="saveLoading"
      />
    </n-form-item>
    <n-form-item>
      <n-space align="center">
        <n-button :loading="saveLoading" @click="handleValidateClick" type="primary">
          Save
        </n-button>
        <n-checkbox v-model:checked="keepOpen"> Add More </n-checkbox>
      </n-space>
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
// n-form validation seems to require composition API for refs

import { ref, defineEmits, Ref, computed } from "vue";
import {
  NForm,
  NFormItem,
  NInput,
  NButton,
  NSpace,
  FormRules,
  NCheckbox,
  NTag,
  NText,
} from "naive-ui";
import ContainerSelect from "./ContainerSelect.vue";
import { useStore } from "vuex";

const store = useStore();
const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (e: "closeForm"): void;
}>();

const keepOpen = ref(false);
const saveLoading = ref(false);
const formRef = ref(null) as Ref<any>;
const formValue = ref({
  prefix: "",
  suffix: "",
  range: ["", ""] as [string, string],
  parent: "",
});
const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value);

const names = computed(() => {
  try {
    validateRange(formValue.value.range);
    const names: string[] = [];
    const firstValue = parseInt(formValue.value.range[0]);
    const secondValue = parseInt(formValue.value.range[1]);

    for (let i = firstValue; i <= secondValue; i++) {
      names.push(formValue.value.prefix + i + formValue.value.suffix);
    }
    return names;
  } catch (e) {
    return [];
  }
});

const rules: Ref<FormRules> = ref({
  prefix: {
    required: false,
    trigger: "input",
    validator: (rule, value) => {
      return value.includes("/") ? Error("Cannot Include '/' character") : true;
    },
  },
  suffix: {
    required: false,
    trigger: "input",
    validator: (rule, value) => {
      return value.includes("/") ? Error("Cannot Include '/' character") : true;
    },
  },
  range: {
    required: true,
    trigger: "input",
    validator: (rule, value) => validateRange(value),
  },
  parent: {
    required: true,
    trigger: "blur",
  },
} as FormRules);

function validateRange(range: [string, string]) {
  if (range[0] === "" || range[1] === "") {
    return Error("Range is required");
  }

  const firstValue = parseInt(range[0]);
  const secondValue = parseInt(range[1]);
  if (firstValue > secondValue) {
    return Error("Range is invalid");
  } else if (secondValue - firstValue >= 100) {
    return Error("Limited to 100 at a time");
  } else {
    return true;
  }
}

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
  saveLoading.value = true;

  await Promise.allSettled(
    names.value.map((name) =>
      store.dispatch("addContainer", {
        name,
        parentContainerId: formValue.value.parent || undefined,
      })
    )
  );

  formValue.value.prefix = "";
  formValue.value.suffix = "";
  formValue.value.range = ["", ""];
  formValue.value.parent = "";
  saveLoading.value = false;
  if (!keepOpen.value) {
    emit("closeForm");
  }
}
</script>

<style>
#batch-create-container-form .name-input {
  display: grid;
  grid-template-columns: 1fr minmax(7rem, 1fr) 1fr;
  grid-gap: 0.5rem;
  align-items: start;
}
#batch-create-container-form .range-input input::-webkit-outer-spin-button,
#batch-create-container-form .range-input input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

#batch-create-container-form .preview-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

#batch-create-container-form fieldset {
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 5px;
}
</style>
