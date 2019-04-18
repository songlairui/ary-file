import { List, Button, Popover, Popconfirm } from 'ant-design-vue';

import QUERY_WORKING_DIRS from '../graphql/WorkingDirs.gql';
import DELETE_WORKING_DIR from '../graphql/DeleteWorkingDir.gql';

export default {
  data() {
    return {
      workingDirs: []
    };
  },
  methods: {
    async fetchDirs() {
      const {
        data: { workingDirs }
      } = await this.$apollo.query({
        query: QUERY_WORKING_DIRS
      });
      this.workingDirs = workingDirs;
    },
    async delete(path) {
      await this.$apollo.mutate({
        mutation: DELETE_WORKING_DIR,
        variables: {
          input: { path }
        },
        update: (store, { data: { deleteWorkingDir } }) => {
          const data = store.readQuery({ query: QUERY_WORKING_DIRS });
          data.workingDirs = data.workingDirs.filter(
            item => item.path !== deleteWorkingDir.path
          );
          store.writeQuery({ query: QUERY_WORKING_DIRS, data });
        }
      });
      await this.fetchDirs();
      this.$message.info(`已删除${path}`);
    },
    pick(item) {
      localStorage.setItem('home', item.path);
      this.$router.push({ path: '/' });
    }
  },
  async created() {
    await this.fetchDirs();
  },

  render() {
    return (
      <List
        dataSource={this.workingDirs}
        itemLayout="horizontal"
        renderItem={(item, idx) => (
          <List.Item>
            <Popconfirm
              title="确定删除?"
              trigger="hover"
              onConfirm={() => this.delete(item.path)}
            >
              <Button type="danger" shape="circle" icon="delete" />
            </Popconfirm>
            <List.Item.Meta>
              <Button slot="title" onClick={this.pick.bind(this, item)} block>
                {item.path}
              </Button>
            </List.Item.Meta>
          </List.Item>
        )}
      />
    );
  }
};
