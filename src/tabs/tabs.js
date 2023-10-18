import { Icon, editButtonSetting } from './const';
import * as t from './createTemplates';
import { nanoid } from 'nanoid';
import { tabValidate } from './validate';
import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import Embed from '@editorjs/embed';

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
    this.api = api;
    this.id = nanoid();
    this.wrapper = undefined;
    this.editBlock = undefined;
    this.editTabsButtonsWrapper = undefined;
    this.addTabButton = undefined;
    this.saveTabsButton = undefined;
    this.count = 1;
    this._editor = {};
    this._createInputs = this._createInputs.bind(this);
    this._onAddButtonClick = this._onAddButtonClick.bind(this);
    this._onSaveTabsButtonClick = this._onSaveTabsButtonClick.bind(this);
    this._showEditBlock = this._showEditBlock.bind(this);
    this._hideTabs = this._hideTabs.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    console.log('data', this.data);
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
    this.wrapper = t.createBlockWrapperTemplate();
    this.editBlock = t.createEditBlockWrapperTemplate();
    this.editTabsButtonsWrapper = t.createButtonsWrapperTemplate();
    this.addTabButton = this.editTabsButtonsWrapper.querySelector('.btn-add-tab');
    this.saveTabsButton = this.editTabsButtonsWrapper.querySelector('.btn-save-tabs');
    this.addTabButton.addEventListener('click', this._onAddButtonClick);
    this.saveTabsButton.addEventListener('click', this._onSaveTabsButtonClick);
    if (this.data && this.data.tabNames.length) {
      this._createTabs();
      this._createTabContent();
      this.data.tabNames.forEach((item) => {
        const inputs = t.createInputsTemplate(this.count, item);
        this.editBlock.insertAdjacentHTML('beforeend', inputs);
        this.count = this.count + 1;
      })
      this.editBlock.classList.add('d-none');
      this.wrapper.append(this.editBlock);
      this.wrapper.append(this.editTabsButtonsWrapper);
      this._setHandlers();

      return this.wrapper;
    }
    
    this.wrapper.append(this.editBlock);
    this._createInputs();
    this.editTabsButtonsWrapper.classList.remove('d-none');
    this.wrapper.append(this.editTabsButtonsWrapper);

    return this.wrapper;

  }

  getCurrentBlockIndex() {
    return this.api.blocks.getCurrentBlockIndex();
  }

  // Сохранение данных
  save(blockContent) {
    console.log('bloc content', blockContent);
    const inputs = Array.from(blockContent.querySelectorAll('input.tab-input'));
    console.log('inputs', inputs);
    const tabNames = [];
    const tabsContent = [];

    inputs.forEach((item, index) => {
      tabNames.push(item.value);
      this._editor[`editor_${index}`].save().then((outputData) => {
        tabsContent.push(outputData);
      })
    })

    return Object.assign(this.data, {
      tabNames: tabNames,
      tabsContent: tabsContent
    })
  }

  validate(savedData){
    console.log('savedDatat', savedData);
    if (tabValidate(savedData.tabNames)) {
      return true;
    }
    alert('Название вкладки обязательно к заполнению');
    return false;
  }

  _createTabs() {
    const ul = t.createNavTabsWrapperTemplate();
    this.data.tabNames.forEach((item, index) => {
      ul.insertAdjacentHTML('beforeend', t.createNavTabsItemTemplate(item, index, this.id));
    })

    this.wrapper.append(ul);
  }

  _createTabContent() {
    const tabContentWrapper = t.createTabsContentWrapperTemplate();
    this.data.tabsContent.forEach((item, index) => {
      tabContentWrapper.insertAdjacentHTML('beforeend', t.createTabContentItemTemplate(item, index, this.id));
      this._editor[`editor_${index}`] = new EditorJS({
        holder: `${this.id}-content-${index}`,
        tools: editorTools,
        data: this.data.tabsContent[index]
      })
      console.log(this._editor[`editor_${index}`]);
    })

    this.wrapper.append(tabContentWrapper);
  }

  _createInputs() {
    const inputs = t.createInputsTemplate(this.count);
    this.editBlock.insertAdjacentHTML('beforeend', inputs);
    this.count = this.count + 1;
    this._setHandlers();
  }

  _showEditBlock() {
    this.editBlock.classList.remove('d-none');
    this.editTabsButtonsWrapper.classList.remove('d-none');
    this.api.toolbar.close();
    this._hideTabs();
  }

  _hideEditBlock() {
    this.editBlock.classList.add('d-none');
    this.editTabsButtonsWrapper.classList.add('d-none');
  }

  _showTabs() {
    this.wrapper.querySelector('.nav-tabs').classList.remove('d-none');
    this.wrapper.querySelector('.tab-content').classList.remove('d-none');
    this._hideEditBlock();
  }

  _hideTabs() {
    this.wrapper.querySelector('.nav-tabs').classList.add('d-none');
    this.wrapper.querySelector('.tab-content').classList.add('d-none');
  }

  _setHandlers() {
    const buttons = Array.from(this.wrapper.querySelectorAll('.btn-delete-tab'));
    buttons.forEach((button) => {
      button.removeEventListener('click', this._onDeleteButtonClick);
      button.addEventListener('click', this._onDeleteButtonClick);
    })
  }

  _onDeleteButtonClick(evt) {
    evt.preventDefault();
    // this.count = 1;
    if (this._checkTabsCount() === 0) {
      this.api.blocks.delete(this.getCurrentBlockIndex());
    } else {
      // this._saveData();
      // this.editBlock.innerHTML = '';
      this.data.tabNames.splice(evt.currentTarget.dataset.index, 1);
      this.data.tabsContent.splice(evt.currentTarget.dataset.index, 1);
      evt.currentTarget.removeEventListener('click', this._onDeleteButtonClick);
      evt.currentTarget.parentElement.parentElement.parentElement.remove();
      this._editor[`editor_${evt.currentTarget.dataset.index}`].destroy();
      this.wrapper.querySelector(`.nav-item[data-tab-id="${this.id}-tab-${evt.currentTarget.dataset.index}"]`).remove();
      this.wrapper.querySelector(`.tab-pane#${this.id}-content-${evt.currentTarget.dataset.index}`).remove();
      // this.data.tabNames.forEach((item) => {
      //   const inputs = t.createInputsTemplate(this.count, item);
      //   this.editBlock.insertAdjacentHTML('beforeend', inputs);
      //   this.count = this.count + 1;
      // })
      // this._setHandlers();
      console.log('after delete data', this.data);
    }
  }

  _checkTabsCount() {
    const tabsCount = this.editBlock.querySelectorAll('.tab-edit-block');
    return tabsCount.length;
  }

  _checkEmptyInputs() {
    const inputs = Array.from(this.editBlock.querySelectorAll('input.form-control'));
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
      alert('Название вкладки обязательно к заполнению');
      return false;
    }
  }

  _onAddButtonClick(evt) {
    evt.preventDefault();
    if (this._checkEmptyInputs()) {
      this._createInputs();
    }
  }

  _onSaveTabsButtonClick(evt) {
    evt.preventDefault();
    this._showTabs();
  }

  _saveData() {
    const inputs = Array.from(this.editBlock.querySelectorAll('input.tab-input'));

    this.data.tabNames = [];

    inputs.forEach((item) => {
      if (item.value.trim()) {
        this.data.tabNames.push(item.value);
      }
    });
  }
}