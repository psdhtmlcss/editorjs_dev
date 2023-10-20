import { Icon, editButtonSetting, errorMessage } from './const';
import * as t from './createTemplates';
import { nanoid } from 'nanoid';
import { tabValidate } from './validate';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';
import './style.css';

const editorTools = {
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

export default class Tabs {
  constructor({ data, api }) {
    this.data = {
      tabNames: data.tabNames || [],
      tabsContent: data.tabsContent || [],
    };
    this._api = api;
    this._id = nanoid();
    this._wrapper = undefined;
    this._editBlock = undefined;
    this._editTabsButtonsWrapper = undefined;
    this._addTabButton = undefined;
    this._saveTabsButton = undefined;
    this._count = 0;
    this._editor = {};
    this._createInputs = this._createInputs.bind(this);
    this._onAddButtonClick = this._onAddButtonClick.bind(this);
    this._onSaveTabsButtonClick = this._onSaveTabsButtonClick.bind(this);
    this._showEditBlock = this._showEditBlock.bind(this);
    this._hideTabs = this._hideTabs.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this._onChangeInput = this._onChangeInput.bind(this);
  }
  // Отрисовка кнопки в меню
  static get toolbox() {
    return {
      title: 'Tabs',
      icon: Icon.TOOLBOX
    }
  }

  // Отрисовка кнопок в меню для редактирования блоков
  renderSettings() {
    const wrapper = document.createElement('div');
    const editButton = t.createBlockSettingsButtonTemplate(editButtonSetting.icon, editButtonSetting.label, editButtonSetting.name);

    wrapper.insertAdjacentHTML('afterbegin', editButton);
    const editButtonElement = wrapper.querySelector('.btn-edit');
    editButtonElement.addEventListener('click', this._showEditBlock);

    return wrapper;
  }

  // Отрисовка полей для нового контента
  render() {
    this._wrapper = t.createBlockWrapperTemplate();
    this._editBlock = t.createEditBlockWrapperTemplate();
    this._editTabsButtonsWrapper = t.createButtonsWrapperTemplate();
    this._addTabButton = this._editTabsButtonsWrapper.querySelector('.btn-add-tab');
    this._saveTabsButton = this._editTabsButtonsWrapper.querySelector('.btn-save-tabs');
    this._addTabButton.addEventListener('click', this._onAddButtonClick);
    this._saveTabsButton.addEventListener('click', this._onSaveTabsButtonClick);
    if (this.data && this.data.tabNames.length) {
      this._createTabs();
      this._createTabContent();
      this.data.tabNames.forEach((item) => {
        const inputs = t.createInputsTemplate(this._count, item);
        this._editBlock.insertAdjacentHTML('beforeend', inputs);
        this._count = this._count + 1;
      })
      this._editBlock.classList.add('d-none');
      this._wrapper.append(this._editBlock);
      this._wrapper.append(this._editTabsButtonsWrapper);
      this._setHandlers();

      return this._wrapper;
    }
    
    this._wrapper.append(this._editBlock);
    this._createNewTab();
    this._hideTabs();
    this._createInputs();
    this._editTabsButtonsWrapper.classList.remove('d-none');
    this._wrapper.append(this._editTabsButtonsWrapper);

    return this._wrapper;

  }

  // Сохранение данных
  save(blockContent) {
    const inputs = Array.from(blockContent.querySelectorAll('input.tab-input'));
    const tabNames = [];
    const tabsContent = [];

    inputs.forEach((item) => {
      tabNames.push(item.value);
      this._editor[`editor_${item.dataset.index}`].save().then((outputData) => {
        tabsContent.push(outputData);
      })
    })

    return Object.assign(this.data, {
      tabNames: tabNames,
      tabsContent: tabsContent
    })
  }

  validate(savedData){
    if (tabValidate(savedData.tabNames)) {
      return true;
    }
    alert(errorMessage);
    return false;
  }

  _getCurrentBlockIndex() {
    return this._api.blocks.getCurrentBlockIndex();
  }

  _createNewTab() {
    let navTabs = this._wrapper.querySelector('.nav-tabs');
    if (navTabs) {
      const tabContent = this._wrapper.querySelector('.tab-content');
      navTabs.insertAdjacentHTML('beforeend', t.createNavTabsItemTemplate('', this._count, this._id));
      tabContent.insertAdjacentHTML('beforeend', t.createTabContentItemTemplate(this._count, this._id));
      this._editor[`editor_${this._count}`] = new EditorJS({
        holder: `${this._id}-content-${this._count}`,
        tools: editorTools,
        data: {}
      })
    } else {
      navTabs = t.createNavTabsWrapperTemplate();
      const tabContent = t.createTabsContentWrapperTemplate();
      navTabs.insertAdjacentHTML('beforeend', t.createNavTabsItemTemplate('', this._count, this._id));
      tabContent.insertAdjacentHTML('beforeend', t.createTabContentItemTemplate(this._count, this._id));
      this._editor[`editor_${this._count}`] = new EditorJS({
        holder: `${this._id}-content-${this._count}`,
        tools: editorTools,
        data: {}
      })
      this._wrapper.append(navTabs, tabContent);
    }
  }

  _createTabs() {
    const ul = t.createNavTabsWrapperTemplate();
    this.data.tabNames.forEach((item, index) => {
      ul.insertAdjacentHTML('beforeend', t.createNavTabsItemTemplate(item, index, this._id));
    })

    this._wrapper.append(ul);
  }

  _createTabContent() {
    const tabContentWrapper = t.createTabsContentWrapperTemplate();
    this.data.tabsContent.forEach((item, index) => {
      tabContentWrapper.insertAdjacentHTML('beforeend', t.createTabContentItemTemplate(index, this._id));
      this._editor[`editor_${index}`] = new EditorJS({
        holder: `${this._id}-content-${index}`,
        tools: editorTools,
        data: this.data.tabsContent[index]
      })
    })

    this._wrapper.append(tabContentWrapper);
  }

  _createInputs() {
    const inputs = t.createInputsTemplate(this._count);
    this._editBlock.insertAdjacentHTML('beforeend', inputs);
    this._count = this._count + 1;
    this._setHandlers();
  }

  _showEditBlock() {
    this._editBlock.classList.remove('d-none');
    this._editTabsButtonsWrapper.classList.remove('d-none');
    this._api.toolbar.close();
    this._hideTabs();
  }

  _hideEditBlock() {
    this._editBlock.classList.add('d-none');
    this._editTabsButtonsWrapper.classList.add('d-none');
  }

  _showTabs() {
    this._wrapper.querySelector('.nav-tabs').classList.remove('d-none');
    this._wrapper.querySelector('.tab-content').classList.remove('d-none');
    this._hideEditBlock();
  }

  _hideTabs() {
    this._wrapper.querySelector('.nav-tabs').classList.add('d-none');
    this._wrapper.querySelector('.tab-content').classList.add('d-none');
  }

  _setHandlers() {
    const buttons = Array.from(this._editBlock.querySelectorAll('.btn-delete-tab'));
    const inputs = Array.from(this._editBlock.querySelectorAll('.tab-input'));
    buttons.forEach((button) => {
      button.removeEventListener('click', this._onDeleteButtonClick);
      button.addEventListener('click', this._onDeleteButtonClick);
    })
    inputs.forEach((input) => {
      input.removeEventListener('input', this._onChangeInput);
      input.addEventListener('input', this._onChangeInput);
    })
  }

  _checkTabsCount() {
    const tabsCount = this._editBlock.querySelectorAll('.tab-edit-block');
    return tabsCount.length;
  }

  _checkEmptyInputs() {
    const inputs = Array.from(this._editBlock.querySelectorAll('input.form-control'));
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
    this.data.tabNames.splice(evt.currentTarget.dataset.index, 1);
    this.data.tabsContent.splice(evt.currentTarget.dataset.index, 1);
    evt.currentTarget.removeEventListener('click', this._onDeleteButtonClick);
    evt.currentTarget.parentElement.parentElement.parentElement.remove();
    this._editor[`editor_${evt.currentTarget.dataset.index}`].destroy();
    this._wrapper.querySelector(`.nav-item[data-tab-id="${this._id}-tab-${evt.currentTarget.dataset.index}"]`).remove();
    this._wrapper.querySelector(`.tab-pane[id="${this._id}-content-${evt.currentTarget.dataset.index}"]`).remove();
    if (this._checkTabsCount() === 0) {
      this._api.blocks.delete(this._getCurrentBlockIndex());
    }
  }

  _onChangeInput(evt) {
    const tab = this._wrapper.querySelector(`.nav-item[data-tab-id="${this._id}-tab-${evt.currentTarget.dataset.index}"] button`);
    tab.textContent = evt.currentTarget.value;
    evt.currentTarget.classList.remove('is-invalid');
  }

  _onAddButtonClick(evt) {
    evt.preventDefault();
    if (this._checkEmptyInputs()) {
      this._createNewTab();
      this._createInputs();
    }
  }

  _onSaveTabsButtonClick(evt) {
    evt.preventDefault();
    if (this._checkEmptyInputs()) {
      const inputs = Array.from(this._editBlock.querySelectorAll('input.form-control'));
      this.data.tabNames = [];
      inputs.forEach((input) => {
        this.data.tabNames.push(input.value);
      })
      this._showTabs();
    }
  }
}