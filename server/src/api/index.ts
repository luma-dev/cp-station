import { implRouter } from '@swingride/core';
import folders from './folders';
import templates_providers from './templates_providers';

export default implRouter({
  $: {
    templates_providers,
    folders,
  },
});
