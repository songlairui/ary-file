<template>
  <div class="home">
    <FileSelect></FileSelect>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import FileSelect from '@/components/FileSelect.vue'; // @ is an alias to /src

@Component({
  components: { FileSelect }
})
export default class Home extends Vue {
  file = '';
  folder: string = '123';
  debug() {
    console.info(this.file);
  }
}
</script>
