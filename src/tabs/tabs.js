import { Icon, editButtonSetting, TypeData } from './const';
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
    this._createTabs();
    this._createTabContent();

    if (this.data && this.data.tabNames.length) {
      this.data.tabsContent.forEach((item, index) => {
        this._renderData(item, index);
      })
    }

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
    if (this.data && this.data.tabNames.length) {
      this.data.tabNames.forEach((item, index) => {
        ul.insertAdjacentHTML('beforeend', t.createNavTabsItemTemplate(item, index, this.id));
      })
    } else {
      ul.insertAdjacentHTML('beforeend', t.createNavTabsItemTemplate('Tab one', 0, this.id));
    }
    

    this.wrapper.append(ul);
  }

  _createTabContent() {
    const tabContentWrapper = t.createTabsContentWrapperTemplate();
    if (this.data && this.data.tabNames.length) {
      this.data.tabsContent.forEach((item, index) => {
        tabContentWrapper.insertAdjacentHTML('beforeend', t.createTabContentItemTemplate(index, this.id));
      })
    } else {
      tabContentWrapper.insertAdjacentHTML('beforeend', t.createTabContentItemTemplate(0, this.id));
    }
    this.wrapper.append(tabContentWrapper);
  }

  _renderData(data, tabIndex) {
    data.forEach((item) => {
      switch(item.type) {
        case TypeData.TEXT:
          this._renderTextBlock(item.data, tabIndex);
          break;
        case TypeData.IMAGE:
          this._renderImageBlock(item.data, tabIndex);
          break;
        case TypeData.TABLE:
          this._renderTableBlock(item.data, tabIndex);
          break;
      }
    })
  }

  _renderTextBlock(data, tabIndex) {
    console.log('data', data);
    console.log('tabIndex', tabIndex);
    const blockWrapper = document.createElement('div');
    blockWrapper.classList.add('text-block');
    blockWrapper.append(data);
    const tab = this._checkTabs()[tabIndex];
    console.log('куда вставлять', tab);
    tab.append(blockWrapper);
  }

  _renderImageBlock(data, tabIndex) {
    console.log('Данные картинки', data);
    console.log('tabIndex', tabIndex);
    const tab = this._checkTabs()[tabIndex];
    const imageWrapper = document.createElement('div');
    const img = document.createElement('img');
    const url = document.createElement('input');
    imageWrapper.classList.add('image-block');
    img.alt = data.alt;
    img.src = data.url;
    img.classList.add('img-fluid');
    url.classList.add('form-control');
    url.value = data.url;
    imageWrapper.append(img);
    imageWrapper.append(url);
    tab.append(imageWrapper);
  }

  _renderTableBlock(data, tabIndex) {
    console.log('Данные таблицы', data);
    console.log('tabIndex', tabIndex);
    const tab = this._checkTabs()[tabIndex];
    const table = document.createElement('table');
    const tbody = document.createElement('tbody');
    table.classList.add('table');
    data.forEach((item) => {
      const row = document.createElement('tr');
      item.forEach((item) => {
        const cell = document.createElement('td');
        cell.textContent = item;
        cell.contenteditable = true;
        row.append(cell);
      })
      tbody.append(row);
    })
    table.append(tbody);
    tab.append(table);
  }

  _checkTabs() {
    const tabs = Array.from(this.wrapper.querySelectorAll('.tab-pane'));
    return tabs;
  }
}