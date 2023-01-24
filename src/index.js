'use strict';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import SimpleImage from './simple-image/simple-image.js';

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
    }
  },
  data: {
    time: 1552744582955,
    blocks: [
      {
        type: "image",
        data: {
          url: "https://cdn.stocksnap.io/img-thumbs/960w/abstract-background_VCJK4NBK4W.jpg",
          caption: "Some image",
          withBorder: false,
          withBorderRadius: true,
          stretched: true
        }
      }
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