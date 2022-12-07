<template>
  <h2>Container</h2>
  <NewContainerForm />

  <h2>Containers</h2>
  <ContainerList />
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import ContainerList from "../components/ContainerList.vue";
import NewContainerForm from "../components/NewContainerForm.vue";

export default {
  name: "ContainerForm",
  components: { ContainerList, NewContainerForm },
  data() {
    return {
      newContainerName: "",
      parentContainerId: "",
      loading: false,
      formValue: {
        name: "",
        parent: "",
      },
      rules: {
        name: {
          required: true,
          message: "Please input new container name",
          trigger: "blur",
        },
        parent: {
          required: false,
          message: "Please input your age",
          trigger: ["input", "blur"],
        },
      },
    };
  },
  computed: {
    ...mapGetters(["containers"]),
  },
  methods: {
    ...mapActions(["addContainer", "deleteContainer"]),
    async addNewContainer() {
      this.loading = true;
      await this.addContainer({
        name: this.newContainerName,
        parentContainerId: this.parentContainerId,
      });
      this.resetForm();
      this.loading = false;
    },
    resetForm() {
      this.newContainerName = "";
      this.parentContainerId = "";
    },
    handleValidateClick(e) {
      e.preventDefault();
      console.log(this.$refs.formRef.value);
      this.$refs.formRef.focus();
      this.$refs.formRef.value?.validate((errors) => {
        if (!errors) {
          console.info("Valid");
        } else {
          console.log(errors);
        }
      });
    },
  },
};
</script>

<style>
.form {
  gap: 1rem;
}

button {
  display: inline-block;
}
</style>
