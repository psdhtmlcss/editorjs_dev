'use strict';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import SimpleImage from './simple-image/simple-image.js';
import Tabs from './tabs/tabs.js';
import Accordion from './accordion/accordion.js';
import Table from 'editorjs-table';

const saveButton = document.querySelector('button');

const editor = new EditorJS({
  holder: 'editorjs',
  autofocus: true,
  tools: {
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
    image: {
      class: SimpleImage,
      inlineToolbar: ['link']
    },
    tabs: {
      class: Tabs,
    },
    accordion: {
      class: Accordion,
    },
    table: {
      class: Table,
      inlineToolbar: true,
      config: {
        rows: 2,
        cols: 3,
      },
    }
  },
  data: {
    time: 1552744582955,
    blocks: [
      {
        type: "accordion",
        data: {
          tabNames: ["Heading 1", "Heading 2", "Heading 3"],
          tabsContent: [
            // Первая вкладка
            {
              time: 1552744582955,
              blocks: [
                {
                  "type": "heading",
                  "data": {
                     "text": "Heading level 2",
                     "level": 2
                    }
               },
               {
                "type": "paragraph",
                "data": {
                   "text": "Hey. Meet the new Editor. On this page you can see it in action — try to edit this text. Source code of the page contains the example of connection and configuration."
                  }
                },
                {
                  "type": "paragraph",
                  "data": {
                     "text": "On this page you can see it in action — try to edit this text."
                    }
                },
                {
                  "type": "list",
                  "data": {
                     "style": "unordered",
                     "items": [
                        "It is a block-styled editor",
                        "It returns clean data output in JSON",
                        "Designed to be extendable and pluggable with a simple API"
                     ]
                  }
                },
              ]
            },
            // Вторая вкладка
            {
              time: 1552744582955,
              blocks: [
                {
                  "type": "heading",
                  "data": {
                     "text": "Test test test",
                     "level": 2
                    }
               },
               {
                "type": "paragraph",
                "data": {
                   "text": "Hey. Meet the new Editor. On this page you can see it in action — try to edit this text. Source code of the page contains the example of connection and configuration."
                  }
                },
                {
                  "type": "list",
                  "data": {
                     "style": "ordered",
                     "items": [
                        "It is a block-styled editor",
                        "It returns clean data output in JSON",
                        "Designed to be extendable and pluggable with a simple API",
                        "Designed to be extendable and pluggable with a simple API",
                        "Designed to be extendable and pluggable with a simple API",
                        "Designed to be extendable and pluggable with a simple API",
                        "Designed to be extendable and pluggable with a simple API",
                     ]
                  }
                },

              ]
            },
            // Третья вкладка
            {
              time: 1552744582955,
              blocks: []
            }
          ]
        }
      },
      // {
      //   type: "tabs",
      //   data: {
      //     tabNames: ["Tab one", "Tab two", "Tab three"],
      //     tabsContent: [
      //       // Первая вкладка
      //       {
      //         time: 1552744582955,
      //         blocks: [
      //           {
      //             "type": "heading",
      //             "data": {
      //                "text": "Heading level 2",
      //                "level": 2
      //               }
      //          },
      //          {
      //           "type": "paragraph",
      //           "data": {
      //              "text": "Hey. Meet the new Editor. On this page you can see it in action — try to edit this text. Source code of the page contains the example of connection and configuration."
      //             }
      //           },
      //           {
      //             "type": "paragraph",
      //             "data": {
      //                "text": "On this page you can see it in action — try to edit this text."
      //               }
      //           },
      //           {
      //             "type": "list",
      //             "data": {
      //                "style": "unordered",
      //                "items": [
      //                   "It is a block-styled editor",
      //                   "It returns clean data output in JSON",
      //                   "Designed to be extendable and pluggable with a simple API"
      //                ]
      //             }
      //           },
      //         ]
      //       },
      //       // Вторая вкладка
      //       {
      //         time: 1552744582955,
      //         blocks: [
      //           {
      //             "type": "heading",
      //             "data": {
      //                "text": "Test test test",
      //                "level": 2
      //               }
      //          },
      //          {
      //           "type": "paragraph",
      //           "data": {
      //              "text": "Hey. Meet the new Editor. On this page you can see it in action — try to edit this text. Source code of the page contains the example of connection and configuration."
      //             }
      //           },
      //           {
      //             "type": "list",
      //             "data": {
      //                "style": "ordered",
      //                "items": [
      //                   "It is a block-styled editor",
      //                   "It returns clean data output in JSON",
      //                   "Designed to be extendable and pluggable with a simple API",
      //                   "Designed to be extendable and pluggable with a simple API",
      //                   "Designed to be extendable and pluggable with a simple API",
      //                   "Designed to be extendable and pluggable with a simple API",
      //                   "Designed to be extendable and pluggable with a simple API",
      //                ]
      //             }
      //           },

      //         ]
      //       },
      //       // Третья вкладка
      //       {
      //         time: 1552744582955,
      //         blocks: []
      //       }
      //     ]
      //   }
      // },
      // {
      //   "type" : "table",
      //   "data" : {
      //       "content" : [ ["Kine", "1 pcs", "100$"], ["Pigs", "3 pcs", "200$"], ["Chickens", "12 pcs", "150$"] ]
      //     }
      // },
      // {
      //   "type": "heading",
      //   "data": {
      //      "text": "Heading level 222",
      //      "level": 2
      //     }
      // },
      // {
      //   "type": "paragraph",
      //   "data": {
      //    "text": "Hey. Meet the new Editor. On this page you can see it in action — try to edit this text. Source code of the page contains the example of connection and configuration."
      //   }
      // },
      // {
      //   "type": "paragraph",
      //   "data": {
      //      "text": "On this page you can see it in action — try to edit this text."
      //     }
      // },
      // {
      //   "type": "list",
      //   "data": {
      //      "style": "unordered",
      //      "items": [
      //         "It is a block-styled editor",
      //         "It returns clean data output in JSON",
      //         "Designed to be extendable and pluggable with a simple API"
      //      ]
      //   }
      // },
    ],
    version: "2.11.10"
  }
});

const onSaveButtonClick = (evt) => {
  evt.preventDefault();
  editor.save().then((outputData) => {
    console.log('Article data: ', outputData);
  }).catch((error) => {
    console.log('Saving failed: ', error)
  });
}

saveButton.addEventListener('click', onSaveButtonClick);