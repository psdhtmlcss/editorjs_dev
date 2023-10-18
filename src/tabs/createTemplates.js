import { Icon } from './const';

export const createBlockSettingsButtonTemplate = (icon, label, className) => (
  `<div class="ce-popover__item btn-${className}">
      <div class="ce-popover__item-icon">${icon}</div>
      <div class="ce-popover__item-label">${label}</div>
  </div>`
);

export const createInputsTemplate = (count, name = '') => (
  `<div class="tab-edit-block mb-3">
    <h4>Tab ${count}</h4>
    <div class="mb-3">
      <label class="form-label">Tab name</label>
      <div class="input-group">
        <input type="text" class="form-control tab-input" tabindex="${count - 1}" placeholder="Enter the tab name" value="${name}">
        <button class="btn btn-outline-secondary btn-delete-tab" tabindex="${count}" data-index="${count - 1}" data-bs-toggle="tooltip" data-bs-title="Удалить вкладку и ее содержимое">${Icon.DELETE}</button>
      </div>
    </div>
  </div>`
);

export const createBlockWrapperTemplate = () => {
  const wrapper = document.createElement('div');
  wrapper.classList.add('tabs-block-wrapper', 'mb-5');

  return wrapper;
};

export const createEditBlockWrapperTemplate = () => {
  const editBlock = document.createElement('div');
  editBlock.classList.add('tabs-edit-block', 'mb-3');

  return editBlock;
};

export const createButtonsWrapperTemplate = () => {
  const buttonsWrapper = document.createElement('div');
  const addButton = document.createElement('button');
  const saveButton = document.createElement('button');
  addButton.type = 'button';
  addButton.classList.add('btn', 'btn-outline-dark', 'btn-add-tab');
  addButton.textContent = 'Add tab';
  saveButton.type = 'button';
  saveButton.classList.add('btn', 'btn-primary', 'btn-save-tabs');
  saveButton.textContent = 'Save tabs';
  buttonsWrapper.classList.add('d-flex', 'justify-content-between', 'd-none');
  buttonsWrapper.append(addButton, saveButton);
  
  return buttonsWrapper;
};

export const createNavTabsWrapperTemplate = () => {
  const ul = document.createElement('ul');
  ul.classList.add('nav', 'nav-tabs', 'mb-3');

  return ul;
};

export const createNavTabsItemTemplate = (item, index, id) => (
  `<li class="nav-item" data-tab-id="${id}-tab-${index}">
    <button class="nav-link ${index === 0 ? 'active' : ''}" data-bs-toggle="tab" data-bs-target="#${id}-content-${index}" type="button" role="tab">${item}</button>
  </li>`
);

export const createTabsContentWrapperTemplate = () => {
  const tabContentWrapper = document.createElement('div');
  tabContentWrapper.classList.add('tab-content');

  return tabContentWrapper;
};

export const createTabContentItemTemplate = (item, index, id) => (
  `<div class="tab-pane fade ${index === 0 ? 'show active' : ''}" id="${id}-content-${index}" role="tabpanel"></div>`
);