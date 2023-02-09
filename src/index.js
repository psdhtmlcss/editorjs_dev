'use strict';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import SimpleImage from './simple-image/simple-image.js';
import Tabs from './tabs/tabs.js';

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
    tabs: Tabs,
  },
  data: {
    time: 1552744582955,
    blocks: [
      {
        type: "tabs",
        data: {
          tabNames: ['Tab one', 'Tab two', 'Tab three'],
          tabsContent: [
            'Tab content one',
            'Tab content two',
            'Tab content three'
          ]
        }
      },
      {
        type: "tabs",
        data: {
          tabNames: ['Tab one', 'Tab two', 'Tab three'],
          tabsContent: [
            'Tab content one',
            'Tab content two',
            'Tab content three'
          ]
        }
      },
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
    ],
    version: "2.11.10"
  }
});

const onSaveButtonClick = (evt) => {
  evt.preventDefault();
  editor.save().then((outputData) => {
    console.log('Article data: ', outputData)
  }).catch((error) => {
    console.log('Saving failed: ', error)
  });
}

saveButton.addEventListener('click', onSaveButtonClick);