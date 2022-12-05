<template>
  <h2>Area</h2>
  <div class="form">
    <label for="area-name-input">Name</label>
    <input id="area-name-input" type="text" v-model="newAreaName" />
    <span></span>
    <button @click="addNewArea" :disabled="(!newAreaName || loading)">Create Area</button>
  </div>

  <h3>Areas</h3>
  <ul class="area-list">
    <li v-for="area in areas" :key="area.id">
      <span>{{ area.name }}</span>
      <button @click="deleteArea(area.id)">Delete</button>
    </li>
  </ul>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  name: 'AreaForm',
  components: {},
  data() {
    return {
      newAreaName: '',
      loading: false,
    }
  },
  computed: {
    ...mapGetters(['areas', 'containers']),
  },
  methods: {
    ...mapActions(['addArea', 'deleteArea']),
    async addNewArea() {
      this.loading = true;
      await this.addArea(this.newAreaName);
      this.newAreaName = '';
      this.loading = false;
    }
  }
}
</script>

<style>
.form {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1rem;
  max-width: 20rem;
}

.area-list li {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
}
</style>
