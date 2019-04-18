import Vue from 'vue';
import {
  message,
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
  Card,
  Affix
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
  Checkbox,
  Card,
  Affix
].forEach(inst => {
  Vue.use(inst);
});

Vue.prototype.$message = message;
