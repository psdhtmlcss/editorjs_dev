import { Icon, editButtonSetting } from './const';

export const createBlockSettingsButtonTemplate = () => (
  `<div class="ce-popover__item btn-${editButtonSetting.name}">
      <div class="ce-popover__item-icon">${editButtonSetting.icon}</div>
      <div class="ce-popover__item-label">${editButtonSetting.label}</div>
    </div>`
);

export const createWrapperTemplate = () => {
  const wrapper = document.createElement('div');
  wrapper.classList.add('accordion-wrapper', 'mb-5');
  return wrapper;
};

export const createContentBlockTemplate = (id) => {
  const contentBlock = document.createElement('div');
  contentBlock.classList.add('accordion');
  contentBlock.id = id;
  return contentBlock;
};

export const createEditBlockTemplate = () => {
  const editBlock = document.createElement('div');
  editBlock.classList.add('accordion-edit-block', 'd-none');
  return editBlock;
};

export const createEditBlockInputTemplate = (count, name = '') => (
  `<div class="item-edit-block mb-3">
    <h4>Accordion item ${count + 1}</h4>
    <div class="mb-3">
      <label class="form-label">Heading</label>
      <div class="input-group">
        <input type="text" class="form-control tab-input" data-index="${count}" tabindex="${count}" placeholder="Enter the tab name" value="${name}">
        <button class="btn btn-outline-secondary btn-delete-tab" tabindex="${count}" data-index="${count}" data-bs-toggle="tooltip" data-bs-title="Удалить вкладку и ее содержимое">${Icon.DELETE}</button>
      </div>
    </div>
  </div>`
);

export const createEditButtonsWrapper = () => {
  const wrapper = document.createElement('div');
  const addButton = document.createElement('button');
  const saveButton = document.createElement('button');
  addButton.type = 'button';
  addButton.classList.add('btn', 'btn-outline-dark', 'btn-add-item');
  addButton.textContent = 'Add item';
  saveButton.type = 'button';
  saveButton.classList.add('btn', 'btn-primary', 'btn-save-items');
  saveButton.textContent = 'Save items';
  wrapper.classList.add('d-flex', 'justify-content-between', 'd-none');
  wrapper.append(addButton, saveButton);
  
  return wrapper;
};

export const createAccordionItemTemplate = (count, id, heading = '') => (
  `<div class="accordion-item" data-item-index="${count}">
    <h2 class="accordion-header">
      <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#${id}-content-${count}" aria-expanded="true" aria-controls="${id}-content-${count}">
        ${heading}
      </button>
    </h2>
    <div id="${id}-content-${count}" class="accordion-collapse collapse" data-bs-parent="#${id}">
      <div class="accordion-body" id="${id}-body-${count}"></div>
    </div>
  </div>`
);

export const createItemHeadingTemplate = (count, id, heading = '') => (
  `<h2 class="accordion-header">
    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#${id}-content-${count}" aria-expanded="true" aria-controls="${id}-content-${count}">
      ${heading}
    </button>
  </h2>`
);

export const createItemContentTemplate = (count, id, content='') => (
  `<div id="${id}-content-${count}" class="accordion-collapse collapse show" data-bs-parent="#${id}">
    <div class="accordion-body">${content}</div>
  </div>`
);