declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}
declare module '*.graphql' {
  import { DocumentNode } from 'graphql';

  const value: DocumentNode;
  export default value;
}
declare module 'vue-infinite-scroll' {}
declare module 'vue-virtual-scroller' {
  const RecycleScroller: any;
  export { RecycleScroller };
}
