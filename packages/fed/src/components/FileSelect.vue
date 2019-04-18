<template>
  <div class="file-select">
    <a-row>
      <a-col :span="8">
        <a-button type="primary" @click="snap">Snap</a-button>
        <a-divider type="vertical"></a-divider>
        <a-checkbox :checked="showHidden" @change="changeHidden">{{ showHidden ? '' : '不' }}显示隐藏文件</a-checkbox>
        <a-divider type="vertical"></a-divider>
        <a-button type="primary" @click="up">向上</a-button>
      </a-col>
      <a-col :span="6">{{ dir }}</a-col>
      <a-col :span="6">
        <a-input placeholder="filter" v-model="filter"></a-input>
      </a-col>
    </a-row>

    <a-list :dataSource="dataToShow">
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-list-item-meta :description="item.name">
          <a slot="title" @click="pick(item)">
            <a-icon type="folder" theme="twoTone" twoToneColor="#52c41a" v-if="item.isDir"/>
            <a-icon type="file" v-else/>
            {{item.name}}
          </a>
        </a-list-item-meta>
        <div>{{item.isDir}}</div>
      </a-list-item>
      <a-spin v-if="loading" class="demo-loading"/>
    </a-list>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import infiniteScroll from 'vue-infinite-scroll';
import { QueryResult } from 'vue-apollo/types/vue-apollo';

const LS = require('../graphql/Ls.gql');

interface Result {
  ls: FsItem[];
}
interface FsItem {
  name: string;
  isDir: boolean;
}

@Component({
  directives: { infiniteScroll }
})
export default class FileSelect extends Vue {
  @Prop() private msg!: string;
  dir: string = localStorage.getItem('home') || '.';

  loading = false;
  busy = false;
  data: FsItem[] = [];
  filter: string = '';
  showHidden: boolean = false;

  get dataToShow() {
    return this.data.filter(
      item => item.name.toLowerCase().indexOf(this.filter.toLowerCase()) > -1
    );
  }

  async getData(replace?: boolean) {
    const { data }: QueryResult<Result> = await this.$apollo.query({
      query: LS,
      variables: {
        showHidden: this.showHidden,
        dir: this.dir,
        first: 0,
        limit: 100
      }
    });
    if (replace) {
      this.data = [...data.ls];
    } else {
      this.data.push(...data.ls);
    }
  }

  handleInfiniteOnLoad() {
    const data = this.data;
    if (data.length > 100) {
      this.$message.warning('Infinite List loaded all');
      this.busy = true;
      return;
    }
  }
  created() {
    this.getData();
  }
  pick(item: FsItem) {
    if (!item.isDir) {
      return;
    }
    this.filter = '';
    this.dir += `/${item.name}`;
    this.getData(true);
  }
  snap() {
    localStorage.setItem('home', this.dir);
  }
  up() {
    const arr = this.dir.split('/');
    arr.pop();
    this.dir = arr.join('/') || '.';
    this.getData(true);
  }
  changeHidden() {
    this.showHidden = !this.showHidden;
    this.getData(true);
  }
}
</script>
