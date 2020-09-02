<template>
  <component v-bind="linkProps(to)">
    <slot></slot>
  </component>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
  name: 'AppLink',
})
export default class AppLink extends Vue {
  @Prop() public to!: string;

  public linkProps(url: string) {
    if (url.match(/^(http(s)?|ftp):\/\//)) {
      return {
        is: 'a',
        href: url,
      };
    }
    return {
      is: 'router-link',
      to: url,
    };
  }
}
</script>
