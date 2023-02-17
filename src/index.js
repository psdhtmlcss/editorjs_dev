'use strict';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import SimpleImage from './simple-image/simple-image.js';
import Tabs from './tabs/tabs.js';
import Table from 'editorjs-table';

// const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
// console.log(tooltipTriggerList);
// const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl));
// console.log(tooltipList);

const saveButton = document.querySelector('button');

const editor = new EditorJS({
  holder: 'editorjs',
  autofocus: true,
  tools: {
    header: {
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
      // {
      //   type: "image",
      //   data: {
      //     url: "https://cdn.stocksnap.io/img-thumbs/960w/abstract-background_VCJK4NBK4W.jpg",
      //     caption: "Some image",
      //     withBorder: false,
      //     withBorderRadius: true,
      //     stretched: false
      //   }
      // },
      {
        type: "tabs",
        data: {
          tabNames: ['Tab one', 'Tab two', 'Tab three'],
          tabsContent: [ 
            [
              {
                type: "text",
                data: "Simple text"
              },
              {
                type: "image",
                data: {
                  url: "https://cdn.stocksnap.io/img-thumbs/960w/abstract-background_VCJK4NBK4W.jpg",
                  alt: "Image description"
                }
              },
              {
                type: "table",
                data: [ ["Kine", "1 pcs", "100$"], ["Pigs", "3 pcs", "200$"], ["Chickens", "12 pcs", "150$"] ]
              }
            ],
            [
              {
                type: "text",
                data: "Simple text 1234654"
              }
            ],
            [
              {
                type: "text",
                data: "Simple text 5555555"
              }
            ]
          ]
        }
      },
      // {
      //   "type" : "table",
      //   "data" : {
      //       "content" : [ ["Kine", "1 pcs", "100$"], ["Pigs", "3 pcs", "200$"], ["Chickens", "12 pcs", "150$"] ]
      //     }
      // }
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