import { Icon, editButtonSetting } from './const';
import * as t from './createTemplates';
import { nanoid } from 'nanoid';
import { tabValidate } from './validate';

export default class Tabs {
  constructor({ data, api }) {
    this.data = {
      tabNames: data.tabNames || [],
      tabsContent: data.tabsContent || [],
    };
    this.api = api;
    this.wrapper = undefined;
    this.editBlock = undefined;
    this.addTabButton = undefined;
    this.count = 1;
    this._createInputs = this._createInputs.bind(this);
    this._onAddButtonClick = this._onAddButtonClick.bind(this);
    this._showEditBlock = this._showEditBlock.bind(this);
    this._hideTabs = this._hideTabs.bind(this);
    this._onDeleteButtonClick = this._onDeleteButtonClick.bind(this);
    this.id = nanoid();
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
    this.addTabButton = t.createAddTabButtonTemplate();
    this.addTabButton.addEventListener('click', this._onAddButtonClick);
    if (this.data && this.data.tabNames.length) {
      this._createTabs();
      this._createTabContent();
      this.data.tabNames.forEach((item, index) => {
        const inputs = t.createInputsTemplate(this.count, item, this.data.tabsContent[index]);
        this.editBlock.insertAdjacentHTML('beforeend', inputs);
        this.count = this.count + 1;
      })
      this.editBlock.classList.add('d-none');
      this.wrapper.append(this.editBlock);
      this.wrapper.append(this.addTabButton);
      this._setHandlers();

      return this.wrapper;
    }
    
    this.wrapper.append(this.editBlock);
    this._createInputs();
    this.addTabButton.classList.remove('d-none');
    this.wrapper.append(this.addTabButton);

    return this.wrapper;

  }

  getCurrentBlockIndex() {
    return this.api.blocks.getCurrentBlockIndex();
  }

  // Сохранение данных
  save(blockContent) {
    const inputs = Array.from(blockContent.querySelectorAll('input'));
    const textareas = Array.from(blockContent.querySelectorAll('textarea'));
    const tabNames = [];
    const tabsContent = [];

    inputs.forEach((item) => {
      tabNames.push(item.value);
    })

    textareas.forEach((item) => {
      tabsContent.push(item.value);
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
    this.addTabButton.classList.remove('d-none');
    this.api.toolbar.close();
    this._hideTabs();
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
    this.count = 1;
    this._saveData();
    this.editBlock.innerHTML = '';
    this.data.tabNames.splice(evt.currentTarget.dataset.index, 1);
    this.data.tabsContent.splice(evt.currentTarget.dataset.index, 1);
    this.data.tabNames.forEach((item, index) => {
      const inputs = t.createInputsTemplate(this.count, item, this.data.tabsContent[index]);
      this.editBlock.insertAdjacentHTML('beforeend', inputs);
      this.count = this.count + 1;
    })
    this._setHandlers();
    if (this._checkTabsCount() === 0) {
      this.api.blocks.delete(this.getCurrentBlockIndex());
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

  _saveData() {
    const inputs = Array.from(this.editBlock.querySelectorAll('input.form-control'));

    this.data.tabNames = [];

    inputs.forEach((item) => {
      if (item.value.trim()) {
        this.data.tabNames.push(item.value);
      }
    });
  }
}