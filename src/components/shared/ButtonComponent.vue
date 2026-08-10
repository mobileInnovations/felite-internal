<template>
  <v-btn
    class="btn btn-component"
    :color="getColor(color)"
    variant="tonal"
    block
    :disabled="disabled"
    :append-icon="icon"
    :type="type"
    @click="handleClick"
  >
    {{ label }}
  </v-btn>
</template>

<script>
export default {
  props: {
    label: { type: String, required: true },
    disabled: { type: Boolean, default: false },
    color: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    type: {
      type: String,
      default: "",
    },
  },
  emits: ["onClick"],
  methods: {
    handleClick() {
      if (this.disabled) return; // Prevent click if disabled
      this.$emit("onClick");
    },

    getColor(color) {
      if (color === "primary") {
        return this.disabled ? "grey" : "primary"; // Change color based on disabled state
      } else if (color === "secondary") {
        return this.disabled ? "grey" : "secondary"; // Change color based on disabled state
      } else if (color === "tertiary") {
        return this.disabled ? "grey" : "tertiary"; // Change color based on disabled state
      } else if (color === "error") {
        return this.disabled ? "grey" : "error"; // Change color based on disabled state
      } else if (color === "warning") {
        return this.disabled ? "grey" : "warning"; // Change color based on disabled state
      } else {
        return "black";
      }
    },
  },
};
</script>

<style lang="css" scoped>
.btn-component {
  margin-top: 10px;
  margin-bottom: 10px;
}
</style>
