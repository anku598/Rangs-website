<template>
  <div class="section-start custom-section-padding">
    <div class="concern">
      <div
        v-for="(row, rdx) in compData.rows"
        class="row"
        :key="'r' + rdx"
      >
        <ConcernItem
          v-for="(item, idx) in row"
          :size="row.length"
          :comp-data="item"
          :sm-controller="smController"
          :key="'i' + idx + 'r' + rdx"
        />

      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import ConcernItem from './ConcernItem.vue';

@Component({
  name: 'ConcernCarousel',
  components: {
    ConcernItem,
  },
})
export default class ConcernCarousel extends Vue {
  @Prop() public compData: any | null;
  @Prop() public smController: any | null;
}
</script>
