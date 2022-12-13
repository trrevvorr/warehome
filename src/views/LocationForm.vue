<template>
  <div class="header">
    <n-h2>
      <n-text type="primary"> Locations </n-text>
    </n-h2>
    <span></span>
    <n-input v-model:value="query" placeholder="search locations" clearable>
      <template #prefix>
        <n-icon :component="Search12Regular" />
      </template>
    </n-input>
  </div>
  <n-button
    @click="showModal = true"
    class="new-location-button"
    circle
    type="primary"
    size="large"
  >
    <template #icon>
      <n-icon><Add16Filled /></n-icon>
    </template>
  </n-button>
  <n-modal v-model:show="showModal" class="modal">
    <put-location-form @formSubmitted="showModal = false" :location="editLocation" />
  </n-modal>
  <location-table
    :query="query"
    @editLocation="(id: string) => (editLocationId = id)"
    @activateLocation="changeLocation"
  />
</template>

<script lang="ts">
import { mapActions, mapGetters } from "vuex";
import PutLocationForm from "../components/PutLocationForm.vue";
import { NModal, NIcon, NInput, NButton, NH2, NText } from "naive-ui";
import { defineComponent, markRaw } from "vue";
import { Search12Regular, Add16Filled } from "@vicons/fluent";
import LocationTable from "../components/LocationTable.vue";
import { Location } from "@/models";

export default defineComponent({
  name: "LocationForm",
  components: {
    PutLocationForm,
    NModal,
    NIcon,
    NInput,
    NButton,
    NH2,
    NText,
    LocationTable,
    Add16Filled,
  },
  data() {
    return {
      query: "",
      showModal: false,
      editLocationId: "",
      Search12Regular: markRaw(Search12Regular),
    };
  },
  watch: {
    showModal(val) {
      if (!val) {
        this.editLocationId = "";
      }
    },
    editLocation(val) {
      if (val) {
        this.showModal = true;
      }
    },
  },
  computed: {
    ...mapGetters(["locations", "location"]),
    editLocation() {
      return this.editLocationId
        ? this.locations.find((location: Location) => location.id === this.editLocationId)
        : null;
    },
  },
  methods: {
    ...mapActions(["changeLocation"]),
  },
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
  align-locations: center;
}

.new-location-button {
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  z-index: 999;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
}
</style>
