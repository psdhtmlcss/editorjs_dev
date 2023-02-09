import { Icon } from './const';

export const createBlockSettingsButtonTemplate = (icon, label, className) => (
  `<div class="ce-popover__item btn-${className}">
      <div class="ce-popover__item-icon">${icon}</div>
      <div class="ce-popover__item-label">${label}</div>
  </div>`
);

export const createInputsTemplate = (count, name = '', content = '') => (
  `<div class="tab-edit-block mb-3">
    <h4>Tab ${count}</h4>
    <div class="mb-3">
      <label class="form-label">Tab name</label>
      <div class="input-group">
        <input type="text" class="form-control" placeholder="Enter the tab name" value="${name}">
        <button class="btn btn-outline-secondary btn-delete-tab" data-index="${count - 1}" data-bs-toggle="tooltip" data-bs-title="Удалить вкладку и ее содержимое">${Icon.DELETE}</button>
      </div>
    </div>
    <div>
      <label>Tab content</label>
      <textarea class="form-control" placeholder="Enter a tab content">${content}</textarea>
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

export const createAddTabButtonTemplate = () => {
  const button = document.createElement('button');
  button.type = 'button';
  button.classList.add('btn', 'btn-primary', 'btn-add-tab', 'd-none');
  button.textContent = 'Add tab';
  
  return button;
};

export const createNavTabsWrapperTemplate = () => {
  const ul = document.createElement('ul');
  ul.classList.add('nav', 'nav-tabs', 'mb-3');

  return ul;
};

export const createNavTabsItemTemplate = (item, index, id) => (
  `<li class="nav-item">
    <button class="nav-link ${index === 0 ? 'active' : ''}" data-bs-toggle="tab" data-bs-target="#${id}-tab-${index}" type="button" role="tab">${item}</button>
  </li>`
);

export const createTabsContentWrapperTemplate = () => {
  const tabContentWrapper = document.createElement('div');
  tabContentWrapper.classList.add('tab-content');

  return tabContentWrapper;
};

export const createTabContentItemTemplate = (item, index, id) => (
  `<div class="tab-pane fade ${index === 0 ? 'show active' : ''}" id="${id}-tab-${index}" role="tabpanel">${item}</div>`
);