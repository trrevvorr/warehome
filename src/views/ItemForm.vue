<template>
  <h2>Item</h2>
  <div class="form">
    <label for="item-name-input">Name</label>
    <input id="item-name-input" type="text" v-model="newItemName" />
    <label for="item-container-select">Container</label>
    <select id="item-container-select" v-model="containerId">
      <option v-for="container in containers" :key="container.id" :value="container.id">
        {{ container.ancestors.asString + container.name }}
      </option>
    </select>
    <span></span>
    <div>
      <button @click="resetForm">Reset</button>
      <button @click="addNewItem" :disabled="!newItemName || loading">Create Item</button>
    </div>
  </div>

  <h3>Items</h3>
  <ul class="item-list">
    <li v-for="item in items" :key="item.id">
      <router-link class="item-name" :to="('/items/' + item.id)">{{item.name}}</router-link>
      <span>{{ item.container && (item.container.ancestors.asString + item.container.name) }}</span>
      <button @click="deleteItem(item.id)">Delete</button>
    </li>
  </ul>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  name: "ItemForm",
  components: {},
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
      await this.addItem({name: this.newItemName, containerId: this.containerId});
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
  grid-template-columns: 1fr 2fr auto;
  gap: 1rem;
}
</style>
