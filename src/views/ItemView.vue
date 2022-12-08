<template>
  <div class="item-view" v-if="item">
    <div class="header">
      <span>
        <h2>{{ item.name }}</h2>
        <span class="subtitle">Item</span>
      </span>
      <n-button type="error" @click="deleteItem(item.id)"> Delete </n-button>
    </div>

      <div class="label">Container</div>
      <ContainerLink v-if="item.container" :container="item.container" />
      <div v-else class="subtitle">None</div>
  </div>
  <n-alert v-else title="Not Found" type="info">
    Item does not exist. <router-link to="/items">View all items</router-link>
  </n-alert>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import ContainerLink from "../components/ContainerLink.vue";
import { NButton, NAlert } from 'naive-ui';


export default {
  name: "ItemView",
  components: { ContainerLink, NButton, NAlert },
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

<style scoped>
.header {
  display: grid;
  grid-template-columns: 1fr auto;
  margin-bottom: 2rem;
}

.subtitle {
  color: gray;
}

.label {
  margin-top: 1rem;
  font-weight: bold;
}
</style>
