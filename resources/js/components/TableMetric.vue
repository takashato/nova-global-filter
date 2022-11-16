<template>
  <LoadingCard :loading="loading" class="pt-4">
    <div class="h-6 flex items-center px-6 mb-4">
      <h3 class="mr-3 leading-tight text-sm font-bold">{{ card.name }}</h3>
      <HelpTextTooltip :text="card.helpText" :width="card.helpWidth" />
    </div>

    <div class="mb-5 pb-4">
      <div class="overflow-y-scroll overflow-x-auto relative" style="height: 200px;">
        <table class="w-full table-default">
          <tbody
            class="border-t border-b border-gray-100 dark:border-gray-700 divide-y divide-gray-100 dark:divide-gray-700"
          >
          <MetricTableRow v-for="row in value" :row="row" />
          </tbody>
        </table>
      </div>
    </div>
  </LoadingCard>
</template>


<script>
import TableMetric from "@/components/Metrics/TableMetric";
import FilterBehavior from "./FilterBehavior";
import  {minimum}  from "@/util";

export default {
  extends: TableMetric,
  mixins: [FilterBehavior],
  methods: {
    fetch() {
      this.loading = true;

      minimum(Nova.request().get(this.metricEndpoint, this.filterPayload())).then(
        ({ data: { value } }) => {
          this.value = value
          this.loading = false
        }
      )
    }
  }
};
</script>