<template>
  <n-card
    :title="`${isNew ? 'New' : 'Edit'} Container`"
    :bordered="false"
    role="dialog"
    aria-modal="true"
  >
    <n-tabs type="line" animated v-show="isNew">
      <n-tab-pane name="single" tab="Single" display-directive="show">
        <put-container-form :container="container" @closeForm="emitFormSubmitted" />
      </n-tab-pane>
      <n-tab-pane name="multiple" tab="Multiple" display-directive="show">
        <batch-create-container-form :container="container" @closeForm="emitFormSubmitted" />
      </n-tab-pane>
    </n-tabs>
    <put-container-form v-show="!isNew" :container="container" @closeForm="emitFormSubmitted" />
  </n-card>
</template>

<script setup lang="ts">
import { defineProps, computed, defineEmits } from "vue";
import { NCard, NTabs, NTabPane } from "naive-ui";
import PutContainerForm from "./PutContainerForm.vue";
import BatchCreateContainerForm from "./BatchCreateContainerForm.vue";
import { Container } from "@/models";

const emit = defineEmits<{
  // eslint-disable-next-line no-unused-vars
  (e: "formSubmitted"): void;
}>();

const props = defineProps<{
  container: Container;
}>();
const isNew = computed(() => !props.container);

function emitFormSubmitted() {
  emit("formSubmitted");
}
</script>
