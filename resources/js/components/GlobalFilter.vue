<template>
  <div v-if="card.filters.length > 0" class="md:col-span-12 overflow-y-visible">
    <div class="mb-4 flex" v-if="card.resettable">
      <h1
        class="text-90 font-normal text-xl md:text-2xl mb-3 items-center mt-6"
      >
        <span>{{ card.title }}</span>
      </h1>
      <div class="justify-end items-center ml-auto mr-0 self-end">
        <button
          class="shadow rounded focus:outline-none ring-primary-200 dark:ring-gray-600 focus:ring bg-primary-500 hover:bg-primary-400 active:bg-primary-600 text-white dark:text-gray-800 inline-flex items-center font-bold px-4 h-9 text-sm flex-shrink-0"
          @click="resetFilters(card.filters)"
        >
          {{ __("Reset") }}
        </button>
      </div>
    </div>
    <div
      v-if="card.filters.length > 0"
      class="bg-30 border-b border-60 rounded-lg shadow h-auto"
    >
      <div
        class="flex-wrap bg-white overflow-visible"
        :class="{ 'flex w-auto': card.inline, 'w-1/3': !card.inline }"
      >
        <div
          v-for="(filter, index) in card.filters"
          class="flex-1"
          :key="index"
        >
          <div class="px-8 py-6">
            <label
              :for="filter.name"
              class="block mb-3 mr-3 text-80 pt-2 leading-tight whitespace-nowrap"
            >{{ filter.name }}</label>
            <input
              v-if="filter.component === 'date-filter'"
              type="date"
              class="w-full form-control form-input form-input-bordered"
              ref="dateTimePicker"
              :id="filter.name"
              dusk="date-filter"
              name="date-filter"
              :value="filter.value || filter.currentValue"
              :class="errorClasses"
              @input.prevent=""
              @change="handleChange(filter, $event)"
            />

            <div
              v-if="filter.component === 'boolean-filter'"
              class="flex flex-wrap"
            >
              <checkbox-with-label
                :class="{
                  'flex mr-3 -mb-2 pb-3 w-auto': card.inline,
                  'w-full mt-2': !card.inline,
                }"
                v-for="option in filter.options"
                :key="option.name"
                :name="option.name"
                :checked="option.checked"
                @input="handleChange(filter, $event)"
              >{{ option.name }}
              </checkbox-with-label
              >
            </div>

            <template v-if="filter.component === 'select-filter'">
              <month-picker-input
                v-if="filter.dependsOn && this.card.filters.find((_filter) => _filter.class === filter.dependsOn)?.currentValue == 'MONTH'"
                class="z-10 w-full"
                :months="[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]"
                date-format="%n/%Y"
                @change="handleChange(filter, $event)"
              ></month-picker-input>
              <select
                :id="filter.name"
                v-else
                @change="handleChange(filter, $event)"
                class="w-full form-control form-select form-input-bordered"
              >
                <option
                  value
                  selected
                  v-if="!filter.currentValue && filter.currentValue !== 0"
                >
                  &mdash;
                </option>
                <option
                  v-if="!filter.dependsOn"
                  v-for="option in filter.options"
                  :key="option.value"
                  :value="option.value"
                  :selected="
                  option.value === filter.value ||
                  option.value === filter.currentValue
                "
                >
                  {{ option.label }}
                </option>
                <option
                  v-else-if="filter.dependsOn && this.card.filters.find((_filter) => _filter.class === filter.dependsOn)?.currentValue"
                  v-for="option in (
                  Object.entries(
                    filter.options.find(
                      (_option) => _option.label == this.card.filters.find(
                        (_filter) => _filter.class == filter.dependsOn
                      ).currentValue
                    )
                  )
                  .filter(([key, value]) => key !== 'label')
                  .map(([key, value]) => ({ value, label: key }))
                )"
                  :key="option.value"
                  :value="option.value"
                  :selected="
                  option.value === filter.value ||
                  option.value === filter.currentValue
                "
                >
                  {{ option.label }}
                </option>
              </select>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Filterable, InteractsWithQueryString } from "@/mixins";

export default {
  mixins: [Filterable, InteractsWithQueryString],
  props: {
    card: {
      type: Object,
      required: true
    }
  },
  data: () => ({
    selectedCheckboxs: {
      type: Object
    }
  }),
  created() {
    Nova.$on("global-filter-request", (filterClasses) => {
      let filters = this.card.filters !== undefined ? this.card.filters : [];

      if (filterClasses && filterClasses.length) {
        filters = filters.filter((filter) =>
          filterClasses.includes(filter.class)
        );
      }
      Nova.$emit("global-filter-response", filters);
    });

    Nova.$on("global-filter-changed", (filterClasses) => {

    });
  },
  methods: {
    handleChange(filter, event) {
      let value = event;
      if (typeof event === "object") {
        if (event.from && event.to) {
          value = JSON.stringify([event.from, event.to]);
        } else {
          value = event.target.value;
        }
      }

      if (filter.component === "boolean-filter") {
        if (event.target.checked) {
          this.selectedCheckboxs[event.target.name] = 1;
        } else {
          delete this.selectedCheckboxs[event.target.name];
        }
        value = this.selectedCheckboxs;
      }

      if (filter.currentValue !== value) {
        filter.currentValue = value;

        const dependedFilter = this.card.filters.find((_filter) => _filter.dependsOn === filter.class);
        if (dependedFilter) {
          const optionList = dependedFilter.options.find((_option) => _option.label == filter.currentValue);
          dependedFilter.currentValue = Object.values(optionList).filter((key) => key !== "label")[1];
          Nova.$emit("global-filter-changed", dependedFilter);
        }

        Nova.$emit("global-filter-changed", filter);
      }
    },
    resetFilters(filters) {
      filters = filters.map(function(filter) {
        filter.currentValue = null;
        return filter;

      });
      Nova.$emit("global-filter-reset", filters);
    }
  }
};
</script>
<style>
.month-picker-input-container {
  width: 100% !important;
}

.month-picker-input {
  width: 100%;
  height: 2.25rem !important;
  padding: 0 2rem 0 0.75rem !important;

  border-color: rgba(var(--colors-gray-300)) !important;
  border-width: 1px !important;

  font-size: .875rem !important;
  line-height: 1.25rem;
}
</style>
