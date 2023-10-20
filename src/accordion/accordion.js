import { Icon, errorMessage } from './const';
import EditorJS from '@editorjs/editorjs';
import * as t from './createTemplates';
import { nanoid } from 'nanoid';
import { tabValidate } from './validate';
import './style.css'


import { editorTools } from './editorConfig';

export default class Accordion {
  constructor({data, api}) {
    this._data = {
      aNames: data.tabNames || [],
      aContent: data.tabsContent || [],
    };
    this._api = api;
    this._id = nanoid();
    this._editButtonSettings = undefined;
    this._wrapper = undefined;
    this._contentBlock = undefined;
    this._editBlock = undefined;
    this._editButtonsWrapper = undefined;
    this._addItemButton = undefined;
    this._saveItemsButton = undefined;
    this._count = 0;
    this._editor = {};

    this._showEditBlock = this._showEditBlock.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onAddItemButtonClick = this._onAddItemButtonClick.bind(this);
    this._onSaveItemsButtonClick = this._onSaveItemsButtonClick.bind(this);
    this._onEditInputChange = this._onEditInputChange.bind(this);
  }

  // Отрисовка кнопки в меню
  static get toolbox() {
    return {
      title: 'Accordion',
      icon: Icon.TOOLBOX
    }
  }

  // Отрисовка кнопок в меню для редактирования блоков
  renderSettings() {
    const wrapper = document.createElement('div');
    const editButtonElement = t.createBlockSettingsButtonTemplate();
    wrapper.insertAdjacentHTML('beforeend', editButtonElement);
    this._editButtonSettings = wrapper.querySelector('.btn-edit');
    this._editButtonSettings.addEventListener('click', this._showEditBlock);

    return wrapper;
  }

  // Отрисовка данных
  render() {
    this._wrapper = t.createWrapperTemplate();
    this._contentBlock = t.createContentBlockTemplate(this._id);
    this._editBlock = t.createEditBlockTemplate();
    this._editButtonsWrapper = t.createEditButtonsWrapper();
    this._addItemButton = this._editButtonsWrapper.querySelector('.btn-add-item');
    this._saveItemsButton = this._editButtonsWrapper.querySelector('.btn-save-items');

    this._addItemButton.addEventListener('click', this._onAddItemButtonClick);
    this._saveItemsButton.addEventListener('click', this._onSaveItemsButtonClick);

    this._wrapper.append(this._contentBlock);
    this._wrapper.append(this._editBlock);
    this._wrapper.append(this._editButtonsWrapper);

    if (this._data && this._data.aNames.length) {
      this._data.aNames.forEach((item) => {
        this._addNewItem(this._count, this._id, item);
      })
      
      return this._wrapper;
    }

    this._addNewItem(this._count, this._id);
    this._contentBlock.classList.add('d-none');
    this._editBlock.classList.remove('d-none');
    this._editButtonsWrapper.classList.remove('d-none');

    return this._wrapper;
  }

  // Сохранение данных
  save(blockContent) {
    const inputs = Array.from(blockContent.querySelectorAll('.tab-input'));
    const aNames = [];
    const aContent = [];

    inputs.forEach((item) => {
      aNames.push(item.value);
      this._editor[`editor_${item.dataset.index}`].save().then((outputData) => {
        aContent.push(outputData);
      })
    })

    return Object.assign(this._data, {
      aNames: aNames,
      aContent: aContent
    })
  }

  _addNewItem(count, id, item = '') {
    const contentItem = t.createAccordionItemTemplate(count, id, item);
    const editItem = t.createEditBlockInputTemplate(count, item);
    this._contentBlock.insertAdjacentHTML('beforeend', contentItem);
    this._editBlock.insertAdjacentHTML('beforeend', editItem);
    this._setHandlers();
    this._editor[`editor_${this._count}`] = new EditorJS({
      holder: `${id}-body-${count}`,
      tools: editorTools,
      data: this._data.aNames.length ? this._data.aContent[count] : {}
    })
    this._setHandlers();
    this._count += 1;
  }

  _showEditBlock() {
    this._contentBlock.classList.add('d-none');
    this._editBlock.classList.remove('d-none');
    this._editButtonsWrapper.classList.remove('d-none');
    this._api.toolbar.close();
  }

  _showContentBlock() {
    this._contentBlock.classList.remove('d-none');
    this._editBlock.classList.add('d-none');
    this._editButtonsWrapper.classList.add('d-none');
  }

  _setHandlers() {
    const buttons = Array.from(this._editBlock.querySelectorAll('.btn-delete-tab'));
    const inputs = Array.from(this._editBlock.querySelectorAll('.tab-input'));
    buttons.forEach((button) => {
      button.removeEventListener('click', this._onDeleteButtonClick);
      button.addEventListener('click', this._onDeleteButtonClick);
    })
    inputs.forEach((input) => {
      input.removeEventListener('input', this._onEditInputChange);
      input.addEventListener('input', this._onEditInputChange);
    })
  }

  _getCurrentBlockIndex() {
    return this._api.blocks.getCurrentBlockIndex();
  }

  _checkEditItemsCount() {
    const editItems = this._editBlock.querySelectorAll('.item-edit-block');
    return editItems.length;
  }

  _checkEditInputs() {
    const inputs = Array.from(this._editBlock.querySelectorAll('.tab-input'));
    const tabNames = [];

    inputs.forEach((item) => {
      if (!item.value.trim()) {
        item.classList.add('is-invalid');
      }
      tabNames.push(item.value.trim());
    })

    if (tabValidate(tabNames)) {
      return true;
    } else {
      alert(errorMessage);
      return false;
    }
  }

  _onDeleteButtonClick(evt) {
    evt.preventDefault();
    this._data.aNames.splice(evt.currentTarget.dataset.index, 1);
    this._data.aContent.splice(evt.currentTarget.dataset.index, 1);
    evt.currentTarget.removeEventListener('click', this._onDeleteButtonClick);
    evt.currentTarget.parentElement.parentElement.parentElement.remove();
    this._editor[`editor_${evt.currentTarget.dataset.index}`].destroy();
    this._wrapper.querySelector(`.accordion-item[data-item-index="${evt.currentTarget.dataset.index}"]`).remove();
    
    if (this._checkEditItemsCount() === 0) {
      this._api.blocks.delete(this._getCurrentBlockIndex());
    }
  }

  _onAddItemButtonClick(evt) {
    evt.preventDefault();
    if (this._checkEditInputs()) {
      this._addNewItem(this._count, this._id);
    }
  }

  _onEditInputChange(evt) {
    const tab = this._wrapper.querySelector(`.accordion-item[data-item-index="${evt.currentTarget.dataset.index}"] .accordion-button`);
    tab.textContent = evt.currentTarget.value;
    evt.currentTarget.classList.remove('is-invalid');
  }

  _onSaveItemsButtonClick(evt) {
    evt.preventDefault();
    if (this._checkEditInputs()) {
      const inputs = Array.from(this._editBlock.querySelectorAll('.tab-input'));
      this._data.aNames = [];
      inputs.forEach((input) => {
        this._data.aNames.push(input.value);
      })
      this._showContentBlock();
    }
  }
}