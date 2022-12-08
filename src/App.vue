<template>
  <div id="app-header">
    <h1>{{location ? location.name : "Loading..."}}</h1>
    <div class="nav">
      <router-link to="/containers">Containers</router-link> >
      <router-link to="/items">Items</router-link>
    </div>
  </div>

  <router-view />

</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  name: 'App',
  async created() {
    this.loadLocation('7a8aa9e5-b603-4b3e-8bcc-8f3c4154c24f');
  },
  computed: {
    ...mapGetters(['location']),
  },
  methods: {
    ...mapActions(['loadLocation']),
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 0 1rem;
  max-width: 40rem;
  margin: 0 auto;
}

#app-header {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
  margin-top: 1rem;
}

h1, h2, h3, h4, h5, h6 {
  margin: 0;
}
</style>
