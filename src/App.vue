<template>
  <div id="app-header">
    <h1>{{location ? location.name : "Loading..."}}</h1>
    <div class="nav">
      <n-radio-group :value="$route.name" :on-update:value="val => $router.push({name: val})" name="routegroup">
      <n-radio-button
        v-for="route in routes"
        :key="route.value"
        :value="route.value"
        :label="route.label"
      />
    </n-radio-group>
    </div>
  </div>

  <router-view />

</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import { NRadioButton, NRadioGroup } from 'naive-ui';

export default {
  name: 'App',
  components: {
    NRadioButton,
    NRadioGroup,
  },
  data() {
    return {
      routes: [
        { label: 'Containers', value: 'containers' },
        { label: 'Items', value: 'items' },
      ],
    };
  },
  created() {
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
