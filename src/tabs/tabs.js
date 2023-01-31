import { Icon, editButtonSetting } from './const';
import * as t from './createTemplates';

export default class Tabs {
  constructor({ data, api }) {
    this.data = {
      tabNames: data.tabNames || [],
      tabsContent: data.tabsContent || []
    };
    this.api = api;
    this.wrapper = undefined;
    this.editBlock = undefined;
    this.addTabButton = undefined;
    this.count = 1;
    this._createInputs = this._createInputs.bind(this);
    this._showEditBlock = this._showEditBlock.bind(this);
    this._hideTabs = this._hideTabs.bind(this);
    this.id = 'tab654654';
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
    this.addTabButton.addEventListener('click', this._createInputs);
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
      return this.wrapper;
    }

    this._createInputs();
    this.wrapper.append(this.editBlock);
    this.addTabButton.classList.remove('d-none');
    this.wrapper.append(this.addTabButton);

    return this.wrapper;

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
}