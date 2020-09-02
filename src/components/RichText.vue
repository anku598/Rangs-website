<template>
  <div class="section-start mb-0">
    <div class="rg-career-requirements-area">
      <div class="row">
        <div class="col-lg-12">
          <div class="rg-career-responsibilities">
            <h2>{{compData.header}}</h2>
            <div v-html="compData.text"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
  name: 'RichText',
})
export default class RichText extends Vue {
  @Prop() public compData: any | null;
}
</script>
