<template>
  <div class="item-view" v-if="item">
    <div class="header">
      <span>
        <h2>{{ item.name }}</h2>
        <span class="subtitle">Item</span>
      </span>
      <button @click="deleteItem(item.id)">
        Delete
      </button>
    </div>

      <div class="label">Container</div>
      <ContainerLink :container="item.container" />
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ContainerLink from "../components/ContainerLink.vue";

export default {
  name: "ItemView",
  components: { ContainerLink },
  props: {
    itemId: {
      type: String,
      required: true,
    },
  },
  computed: {
    ...mapGetters(["items"]),
    item() {
      return this.items.find((c) => c.id === this.itemId);
    },
  },
  methods: {
    ...mapActions(["deleteItem"]),
  },
};
</script>

<style>
.header {
  display: grid;
  grid-template-columns: 1fr auto;
  margin-bottom: 2rem;
}

h2 {
  line-height: 0rem;
}

.subtitle {
  color: gray;
}

.label {
  margin-top: 1rem;
  font-weight: bold;
}
</style>
