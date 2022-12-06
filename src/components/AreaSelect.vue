<template>
  <n-select
    filterable
    :options="options"
    clearable
    :value="value"
    @update:value="handleChange"
    :disabled="disabled"
  />
</template>

<script>
import { NSelect } from "naive-ui";
import { mapGetters } from "vuex";

export default {
  name: "AreaSelect",
  components: { NSelect },
  emits: ["selectOption"],
  props: {
    value: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["areas"]),
    options() {
      return this.areas.map((area) => ({
        label: area.name,
        value: area.id,
      }));
    },
  },
  methods: {
    handleChange(value) {
      this.$emit("selectOption", value);
    },
  },
};
</script>

<style scoped></style>
