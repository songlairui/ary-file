import Vue from 'vue';
import {
  Input,
  Icon,
  Layout,
  Breadcrumb,
  Menu,
  Divider,
  List,
  Row,
  Col,
  Button,
  Checkbox,
  message
} from 'ant-design-vue';

[
  Input,
  Icon,
  Layout,
  Breadcrumb,
  Menu,
  Divider,
  List,
  Row,
  Col,
  Button,
  Checkbox
].forEach(inst => {
  Vue.use(inst);
});

Vue.prototype.$message = message;
