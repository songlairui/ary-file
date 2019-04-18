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
    <a-divider/>
    <a-list
      :dataSource="dataToShow"
      :grid="{ gutter: 16, xs: 1, sm: 2, md: 4, lg: 4, xl: 6, xxl: 3 }"
    >
      <a-list-item slot="renderItem" slot-scope="item, index">
        <a-card>
          <a-card-meta>
            <div @click="pick(item)" slot="title">
              <a-icon type="folder" theme="twoTone" twoToneColor="#52c41a" v-if="item.isDir"/>
              <a-icon type="file" v-else/>
              {{item.name}}
            </div>
            <span
              slot="description"
            >Vue? Nodejs? Go? React? Rxjs? Graphql? Nestjs? Webpack? Js? Hexo? Vuepress? Gatsby? Android? RN? Flutter? Docker? VPS?</span>
          </a-card-meta>
        </a-card>
      </a-list-item>
      <a-spin v-if="loading" class="demo-loading"/>
    </a-list>
    <a-affix :offsetBottom="10">
      <a-checkbox-group :options="plainOptions"/>
    </a-affix>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import infiniteScroll from 'vue-infinite-scroll';
import { QueryResult } from 'vue-apollo/types/vue-apollo';

import QUERY_WORKING_DIRS from '../graphql/WorkingDirs.gql';
import ADD_WORKING_DIR from '../graphql/AddWorkingDir.gql';

const LS = require('../graphql/Ls.gql');

interface Result {
  ls: FsItem[];
}
interface FsItem {
  name: string;
  isDir: boolean;
}

interface WorkingDir {
  title?: string;
  path: string;
  desc?: string;
  sort?: number;
}

interface dirsResult {
  workingDirs: WorkingDir[];
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
  plainOptions = [
    'Vue',
    'Nodejs',
    'Go',
    'React',
    'Rxjs',
    'Graphql',
    'Nestjs',
    'Webpack',
    'Js',
    'Hexo',
    'Vuepress',
    'Gatsby',
    'Android',
    'RN',
    'Flutter',
    'Docker',
    'VPS'
  ];

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
  async snap() {
    localStorage.setItem('home', this.dir);
    try {
      await this.$apollo.mutate({
        mutation: ADD_WORKING_DIR,
        variables: {
          input: {
            path: this.dir
          }
        },
        update: (store, { data: { addWorkingDir } }) => {
          const data: dirsResult = store.readQuery({
            query: QUERY_WORKING_DIRS
          }) || { workingDirs: [] };
          data.workingDirs.push(addWorkingDir);
          store.writeQuery({ query: QUERY_WORKING_DIRS, data });
        }
      });
      this.$message.info('Favourite Added');
    } catch (error) {
      this.$message.error(error.message);
    }
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
