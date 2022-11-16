<template>
  <LoadingCard :loading="loading" class="px-6 py-4">
    <h3 class="h-6 flex mb-3 text-sm font-bold">
      {{ title }}

      <span
        v-if="customTotal"
        class="ml-auto font-semibold text-gray-400 text-xs"
      >
        {{ customTotal }}
      </span>
      <span
        v-else
        class="ml-auto font-semibold text-gray-400 text-xs"
      >
        ({{ formattedTotal }} {{ __("total") }})
      </span>
    </h3>

    <HelpTextTooltip :text="helpText" :width="helpWidth" />

    <div class="min-h-[90px]">
      <div class="overflow-hidden overflow-y-auto max-h-[90px]">
        <ul>
          <li
            v-for="item in formattedItems"
            :key="item.color"
            class="text-xs leading-normal"
          >
            <span
              class="inline-block rounded-full w-2 h-2 mr-2"
              :style="{
                backgroundColor: item.color,
              }"
            />{{ item.label }} ({{ item.value }} - {{ item.percentage }}%)
          </li>
        </ul>
      </div>

      <div
        ref="chart"
        class="right-[20px]"
        :class="chartClasses"
        style="width: 90px; height: 90px; bottom: 30px; top: calc(50% + 15px)"
      />
    </div>
  </LoadingCard>
</template>

<script>
import BasePartitionMetric from "@/components/Metrics/Base/BasePartitionMetric";

export default {
  extends: BasePartitionMetric,
  name: "BasePartitionMetric",

  props: {
    customTotal: String
  }
};
</script>

<style scoped>

</style>