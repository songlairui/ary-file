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
    async delete(path) {
      await this.$apollo.mutate({
        mutation: DELETE_WORKING_DIR,
        variables: {
          input: { path }
        }
      });
      this.$message.info(`已删除${path}`);
    }
  },
  async created() {
    const {
      data: { workingDirs }
    } = await this.$apollo.query({
      query: QUERY_WORKING_DIRS
    });
    this.workingDirs = workingDirs;
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
              onConfirm={() => this.delete(item.path)}
            >
              <Button type="danger" shape="circle" icon="delete" />
            </Popconfirm>
            <List.Item.Meta description={item.path}>
              <a slot="title">{item.title}</a>
            </List.Item.Meta>
          </List.Item>
        )}
      />
    );
  }
};
