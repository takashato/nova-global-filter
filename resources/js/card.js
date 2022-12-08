Nova.booting((Vue, router, store) => {
  Vue.component("BasePartitionMetric", require("./components/Base/BasePartitionMetric").default);
  Vue.component("PartitionMetric", require("./components/PartitionMetric").default);
  Vue.component("TrendMetric", require("./components/TrendMetric.vue").default);
  Vue.component("ValueMetric", require("./components/ValueMetric.vue").default);
  Vue.component("TableMetric", require("./components/TableMetric.vue").default);
  Vue.component("MetricTableRow", require("./components/MetricTableRow.vue").default);
  Vue.component("NovaGlobalFilter", require("./components/GlobalFilter.vue").default);
  // Vue.component('LoadingCard', require('./components/LoadingCard.vue').default)
  window.Vue.use = () => {
  };
  Vue.component("MonthPickerInput", require("vue-month-picker").MonthPickerInput);
});
