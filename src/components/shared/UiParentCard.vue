<script>
export default {
  name: "UiParentCard",
  props: {
    title: {
      type: String,
      required: true,
    },
  },
};
</script>

<template>
  <v-card variant="flat">
    <v-card-item>
      <div class="d-sm-flex align-center justify-space-between">
        <v-card-title>{{ props.title }}</v-card-title>
        <slot name="action" />
      </div>
    </v-card-item>
    <v-divider />
    <v-card-text>
      <slot />
    </v-card-text>
  </v-card>
</template>
