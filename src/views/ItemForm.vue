<template>
  <h2>Item</h2>
  <div class="form">
    <label for="item-name-input">Name</label>
    <input id="item-name-input" type="text" v-model="newItemName" />
    <label for="item-container-select">Container</label>
    <container-select :value="containerId" @selectOption="(val) => (containerId = val)" />
    <span></span>
    <div>
      <button @click="addNewItem" :disabled="!newItemName || loading">Create Item</button>
    </div>
  </div>

  <h3>Items</h3>
  <ul class="item-list">
    <li v-for="item in items" :key="item.id">
      <router-link class="item-name" :to="'/items/' + item.id">{{ item.name }}</router-link>
      <container-link v-if="item.container" :container="item.container" />
    </li>
  </ul>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ContainerSelect from "../components/ContainerSelect.vue";
import ContainerLink from "../components/ContainerLink.vue";

export default {
  name: "ItemForm",
  components: { ContainerSelect, ContainerLink },
  data() {
    return {
      newItemName: "",
      containerId: "",
      loading: false,
    };
  },
  computed: {
    ...mapGetters(["items", "containers"]),
  },
  methods: {
    ...mapActions(["addItem", "deleteItem"]),
    async addNewItem() {
      this.loading = true;
      await this.addItem({ name: this.newItemName, containerId: this.containerId });
      this.resetForm();
      this.loading = false;
    },
    resetForm() {
      this.newItemName = "";
      this.containerId = "";
    },
  },
};
</script>

<style>
.form {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  max-width: 20rem;
}

.item-list li {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
}
</style>
