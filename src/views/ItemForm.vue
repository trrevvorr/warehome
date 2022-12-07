<template>
  <h2>Item</h2>
  <NewItemForm />

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
import ContainerLink from "../components/ContainerLink.vue";
import NewItemForm from "../components/NewItemForm.vue";

export default {
  name: "ItemForm",
  components: { ContainerLink, NewItemForm },
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
