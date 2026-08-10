<template>
  <v-row class="page-breadcrumb mb-1 mt-1">
    <v-col cols="12">
      <v-card
        variant="flat"
        class="px-4 py-3"
        :class="{ 'elevation-1': elevated }"
      >
        <v-row no-gutters class="align-center">
          <!-- Title Section -->
          <v-col
            :cols="showBreadcrumbs ? 12 : 12"
            :md="showBreadcrumbs ? 5 : 12"
            class="mb-2 mb-md-0"
          >
            <div class="d-flex align-center">
              <!-- Optional Icon -->
              <v-icon
                v-if="icon"
                :icon="icon"
                :color="iconColor"
                class="me-2"
                :size="iconSize"
              />
              <!-- Title with optional subtitle -->
              <div>
                <span :class="titleClass" class="text-truncate" :title="title">
                  {{ title }}
                </span>
                <p
                  v-if="subtitle"
                  class="text-caption text-medium-emphasis ma-0 text-truncate"
                  :title="subtitle"
                >
                  {{ subtitle }}
                </p>
              </div>
            </div>
          </v-col>

          <!-- Breadcrumbs Section -->
          <v-col v-if="showBreadcrumbs" md="7" sm="12" cols="12">
            <v-breadcrumbs
              :items="processedBreadcrumbs"
              class="text-h6 justify-md-end pa-1"
              :class="breadcrumbClass"
              :density="density"
              :max-items="maxItems"
            >
              <!-- Custom divider -->
              <template v-slot:divider>
                <div class="d-flex align-center">
                  <component
                    :is="dividerIcon"
                    :size="dividerSize"
                    :class="dividerClass"
                  />
                </div>
              </template>

              <!-- Home button prepend -->
              <template v-slot:prepend>
                <v-tooltip
                  v-if="showHomeButton"
                  :text="homeTooltip"
                  location="bottom"
                >
                  <template v-slot:activator="{ props }">
                    <v-btn
                      v-bind="props"
                      :to="homePath"
                      :size="homeButtonSize"
                      class="ma-2"
                      :color="homeButtonColor"
                      :icon="homeIcon"
                      :variant="homeButtonVariant"
                      :disabled="isHomePage"
                      @click="onHomeClick"
                    />
                  </template>
                </v-tooltip>
                <div v-if="showHomeButton" class="d-flex align-center">
                  <component
                    :is="dividerIcon"
                    :size="dividerSize"
                    :class="dividerClass"
                  />
                </div>
              </template>

              <!-- Custom item rendering -->
              <template v-slot:item="{ item, index }">
                <span
                  v-if="!item.href && !item.to"
                  :class="[
                    'breadcrumb-item',
                    { 'text-primary': item.active },
                    { 'text-medium-emphasis': !item.active },
                  ]"
                  :title="item.title"
                >
                  {{ item.title }}
                </span>
                <v-btn
                  v-else
                  :to="item.to"
                  :href="item.href"
                  variant="text"
                  size="small"
                  class="breadcrumb-link px-1"
                  :class="{ 'text-primary': item.active }"
                  @click="onBreadcrumbClick(item, index)"
                >
                  {{ item.title }}
                </v-btn>
              </template>
            </v-breadcrumbs>
          </v-col>

          <!-- Action buttons slot -->
          <v-col v-if="$slots.actions" cols="12" class="mt-2">
            <div class="d-flex justify-end">
              <slot name="actions" />
            </div>
          </v-col>
        </v-row>
      </v-card>
    </v-col>
  </v-row>
</template>

<script>
import { ChevronRightIcon, HomeIcon, SlashIcon } from "vue-tabler-icons";

export default {
  name: "EnhancedBreadcrumb",

  components: {
    ChevronRightIcon,
    HomeIcon,
    SlashIcon,
  },

  props: {
    // Core props
    title: {
      type: String,
      required: true,
    },
    subtitle: {
      type: String,
      default: "",
    },
    breadcrumbs: {
      type: Array,
      default: () => [],
    },

    // Appearance props
    icon: {
      type: String,
      default: "",
    },
    iconColor: {
      type: String,
      default: "primary",
    },
    iconSize: {
      type: [String, Number],
      default: "default",
    },
    elevated: {
      type: Boolean,
      default: false,
    },
    titleClass: {
      type: String,
      default: "text-h5",
    },
    breadcrumbClass: {
      type: String,
      default: "",
    },

    // Breadcrumb behavior
    showBreadcrumbs: {
      type: Boolean,
      default: true,
    },
    maxItems: {
      type: Number,
      default: 4,
    },
    density: {
      type: String,
      default: "default",
      validator: (value) =>
        ["default", "comfortable", "compact"].includes(value),
    },

    // Home button props
    showHomeButton: {
      type: Boolean,
      default: true,
    },
    homePath: {
      type: String,
      default: "/",
    },
    homeIcon: {
      type: String,
      default: "mdi-home",
    },
    homeButtonSize: {
      type: String,
      default: "medium",
    },
    homeButtonColor: {
      type: String,
      default: "primary",
    },
    homeButtonVariant: {
      type: String,
      default: "text",
    },
    homeTooltip: {
      type: String,
      default: "Go to Home",
    },

    // Divider props
    dividerIcon: {
      type: [String, Object],
      default: () => ChevronRightIcon,
    },
    dividerSize: {
      type: [String, Number],
      default: "17",
    },
    dividerClass: {
      type: String,
      default: "",
    },
  },

  emits: ["breadcrumb-click", "home-click"],

  computed: {
    processedBreadcrumbs() {
      return this.breadcrumbs.map((item, index) => {
        // Handle different breadcrumb formats
        if (typeof item === "string") {
          return {
            title: item,
            active: index === this.breadcrumbs.length - 1,
          };
        }

        return {
          ...item,
          active:
            item.active !== undefined
              ? item.active
              : index === this.breadcrumbs.length - 1,
        };
      });
    },

    isHomePage() {
      return this.$route?.path === this.homePath;
    },
  },

  methods: {
    onBreadcrumbClick(item, index) {
      this.$emit("breadcrumb-click", { item, index });
    },

    onHomeClick() {
      this.$emit("home-click");
    },
  },
};
</script>

<style lang="scss" scoped>
.page-breadcrumb {
  .v-toolbar {
    background: transparent;
  }

  .breadcrumb-item {
    font-size: 0.875rem;
    max-width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .breadcrumb-link {
    max-width: 150px;
    text-transform: none;

    &:hover {
      text-decoration: underline;
    }
  }

  // Responsive adjustments
  @media (max-width: 960px) {
    .v-breadcrumbs {
      justify-content: flex-start !important;
    }
  }

  // Animation for elevation changes
  .v-card {
    transition: box-shadow 0.3s ease;
  }
}

// Dark theme adjustments
.v-theme--dark {
  .page-breadcrumb {
    .breadcrumb-item {
      &.text-medium-emphasis {
        opacity: 0.7;
      }
    }
  }
}
</style>
