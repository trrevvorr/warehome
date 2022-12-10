<template>
  <div class="container-view" v-if="container">
    <div class="header">
      <span>
        <h2>{{ container.name }}</h2>
        <span class="subtitle">Container</span>
      </span>
      <n-tooltip
        v-if="getChildrenForContainer(container).length > 0 || (items && items.length > 0)"
      >
        <template #trigger>
          <n-button disabled type="error" tag="div"> Delete </n-button>
        </template>
        Cannot delete container with children or items
      </n-tooltip>
      <n-button v-else type="error" @click="deleteContainer(container.id)"> Delete </n-button>
    </div>

    <div class="label">Parent Container</div>
    <ContainerLink v-if="parentContainer" :container="parentContainer" />
    <div v-else class="subtitle">None</div>

    <div class="label">Child Containers</div>
    <ul v-if="getChildrenForContainer(container).length">
      <li v-for="child in getChildrenForContainer(container)" :key="child.id">
        <ContainerLink :container="child" :displayAncestors="false" />
      </li>
    </ul>
    <div v-else class="subtitle">None</div>

    <div class="label">Items</div>
    <ul v-if="items && items.length">
      <li v-for="item in items" :key="item.id">
        <router-link class="item-name" :to="'/items/' + item.id">{{ item.name }}</router-link>
      </li>
    </ul>
    <div v-else class="subtitle">None</div>
  </div>
  <n-alert v-else title="Not Found" type="info">
    Container does not exist. <router-link to="/containers">View all containers</router-link>
  </n-alert>
</template>

<script lang="ts">
import { mapGetters, mapActions } from "vuex";
import { DataStore } from "@aws-amplify/datastore";
import { Container, Item } from "@/models";
import ContainerLink from "@/components/ContainerLink.vue";
import { NButton, NTooltip, NAlert } from "naive-ui";
import { defineComponent } from "vue";

export default defineComponent({
  name: "ContainerView",
  components: { ContainerLink, NButton, NTooltip, NAlert },
  props: {
    containerId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      items: [] as Item[],
    };
  },
  computed: {
    ...mapGetters(["containers", "getChildrenForContainer"]),
    container() {
      return this.containers.find((c: Container) => c.id === this.containerId);
    },
    parentContainer() {
      return (
        this.container.parentContainerID &&
        this.containers.find((c: Container) => c.id === this.container.parentContainerID)
      );
    },
  },
  watch: {
    containerId() {
      this.updateItems();
    },
  },
  created() {
    this.updateItems();
  },
  methods: {
    ...mapActions(["deleteContainer"]),
    async updateItems() {
      const container = await DataStore.query(Container, this.containerId);
      this.items = container ? await container.Items.toArray() : [];
    },
  },
});
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

.attributes {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-gap: 1rem;
}
.label {
  margin-top: 1rem;
  font-weight: bold;
}
</style>
