<template>
  <div class="header">
    <n-h2>
      <n-text type="primary"> Items </n-text>
    </n-h2>
    <span></span>
    <n-input v-model:value="query" placeholder="search items" clearable>
      <template #prefix>
        <n-icon :component="Search12Regular" />
      </template>
    </n-input>
  </div>
  <n-button @click="showModal = true" class="new-item-button" circle type="primary" size="large">
    <template #icon>
      <n-icon><Add16Filled /></n-icon>
    </template>
  </n-button>
  <n-modal v-model:show="showModal" class="modal">
    <put-item-form @formSubmitted="showModal = false" :item="editItem" />
  </n-modal>
  <item-table :query="query" @editItem="(id) => (editItemId = id)" />
</template>

<script lang="ts">
import { mapGetters } from "vuex";
import PutItemForm from "../components/PutItemForm.vue";
import { NModal, NIcon, NInput, NButton, NH2, NText } from "naive-ui";
import { defineComponent, markRaw } from "vue";
import { Search12Regular, Add16Filled } from "@vicons/fluent";
import ItemTable from "../components/ItemTable.vue";
import { Item } from "@/models";

export default defineComponent({
  name: "ItemForm",
  components: { PutItemForm, NModal, NIcon, NInput, NButton, NH2, NText, ItemTable, Add16Filled },
  data() {
    return {
      query: "",
      showModal: false,
      editItemId: "",
      Search12Regular: markRaw(Search12Regular),
    };
  },
  watch: {
    showModal(val) {
      if (!val) {
        this.editItemId = "";
      }
    },
    editItem(val) {
      if (val) {
        this.showModal = true;
      }
    },
  },
  computed: {
    ...mapGetters(["items"]),
    editItem() {
      return this.editItemId ? this.items.find((item: Item) => item.id === this.editItemId) : null;
    },
  },
  methods: {},
});
</script>

<style scoped>
.modal {
  margin: auto;
  width: calc(100vw - 2rem);
  max-width: 30rem;
}

.header {
  line-height: 1rem;
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-gap: 1rem;
  margin-bottom: 1rem;
  align-items: center;
}

.new-item-button {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  z-index: 999;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}
</style>
