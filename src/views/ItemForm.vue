<template>
  <div class="header">
    <h2>Items</h2>
    <span></span>
    <n-input v-model:value="query" placeholder="search items" clearable>
      <template #prefix>
        <n-icon :component="Search12Regular" />
      </template>
    </n-input>
    <n-button @click="showModal = true">
      <template #icon>
        <n-icon><Add12Regular /></n-icon>
      </template>
    </n-button>
    <n-modal v-model:show="showModal" class="modal">
      <n-card title="New Item" :bordered="false" role="dialog" aria-modal="true">
        <NewItemForm @formSubmitted="showModal = false" />
      </n-card>
    </n-modal>
  </div>
  <item-table :query="query" />
</template>

<script>
import { mapGetters } from "vuex";
import NewItemForm from "../components/NewItemForm.vue";
import { NModal, NCard, NIcon, NInput, NButton } from "naive-ui";
import { markRaw } from "vue";
import { Search12Regular, Add12Regular } from "@vicons/fluent";
import ItemTable from "../components/ItemTable.vue";

export default {
  name: "ItemForm",
  components: { NewItemForm, NModal, NCard, NIcon, NInput, NButton, ItemTable, Add12Regular },
  data() {
    return {
      query: "",
      showModal: false,
      Search12Regular: markRaw(Search12Regular),
    };
  },
  computed: {
    ...mapGetters(["items"]),
  },
  methods: {},
};
</script>

<style scoped>
.modal {
  margin: 1rem;
}

.header {
  line-height: 1rem;
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  grid-gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}
</style>
