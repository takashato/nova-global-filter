<template>
  <BasePartitionMetric
    :title="card.name"
    :help-text="card.helpText"
    :help-width="card.helpWidth"
    :chart-data="chartData"
    :loading="loading"
    :custom-total="customTotal"
  />
</template>

<script>
import Partitionmetric from "@/components/Metrics/PartitionMetric";
import FilterBehavior from "./FilterBehavior";
import  {minimum}  from "@/util";

export default {
  extends: Partitionmetric,
  mixins: [FilterBehavior],
  methods: {
    fetch() {
      this.loading = true;

      minimum(
        Nova.request().get(this.metricEndpoint, this.filterPayload())
      ).then(
        ({
          data: {
            value: { value, customTotal }
          }
        }) => {
          this.chartData = value;
          this.loading = false;
          this.customTotal = customTotal;
        }
      );
    }
  }
};
</script>