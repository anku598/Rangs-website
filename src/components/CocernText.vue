<template>
  <div class="concern-details text-center">
    <p>{{compData}}</p>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
  name: 'ConcernText',
})
export default class ConcernText extends Vue {
  @Prop() public compData!: string | null;
}
</script>
