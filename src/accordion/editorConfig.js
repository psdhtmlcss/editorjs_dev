import Header from '@editorjs/header';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';

export const editorTools = {
  heading: {
    class: Header,
    config: {
      placeholder: 'Enter a header',
      levels: [1, 2, 3],
      defaultLevel: 1
    }
  },
  list: {
    class: List,
    inlineToolbar: true,
    config: {
      defaultStyle: 'unordered'
    }
  },
  embed: Embed,
};