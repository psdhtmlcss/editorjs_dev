export default class SimpleImage {
  constructor({ data, api }) {
    this.data = {
      url: data.url || '',
      caption: data.caption || '',
      withBorder: data.withBorder !==undefined ? data.withBorder : false,
      withBorderRadius: data.withBorderRadius !==undefined ? data.withBorderRadius : false,
      stretched: data.stretched !== undefined ? data.stretched : false
    };
    this.api = api;
    this.wrapper = undefined;
    this.settings = [
      {
        name: 'withBorder',
        className: 'border',
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232h-2.4v-2.138h2.4v-2.28h2.25v.237h1.15-1.15zM1.9 8.455v-3.42c0-1.154.985-2.09 2.2-2.09h4.2v2.137H4.15v3.373H1.9zm0 2.137h2.25v3.325H8.3v2.138H4.1c-1.215 0-2.2-.936-2.2-2.09v-3.373zm15.05-2.137H14.7V5.082h-4.15V2.945h4.2c1.215 0 2.2.936 2.2 2.09v3.42z"/></svg>`
      },
      {
        name: 'withBorderRadius',
        className: 'rounded-2',
        icon: `<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M15.8 10.592v2.043h2.35v2.138H15.8v2.232h-2.25v-2.232h-2.4v-2.138h2.4v-2.28h2.25v.237h1.15-1.15zM1.9 8.455v-3.42c0-1.154.985-2.09 2.2-2.09h4.2v2.137H4.15v3.373H1.9zm0 2.137h2.25v3.325H8.3v2.138H4.1c-1.215 0-2.2-.936-2.2-2.09v-3.373zm15.05-2.137H14.7V5.082h-4.15V2.945h4.2c1.215 0 2.2.936 2.2 2.09v3.42z"/></svg>`
      },
      {
        name: 'stretched',
        className: 'img-fluid',
        icon: `<svg width="17" height="10" viewBox="0 0 17 10" xmlns="http://www.w3.org/2000/svg"><path d="M13.568 5.925H4.056l1.703 1.703a1.125 1.125 0 0 1-1.59 1.591L.962 6.014A1.069 1.069 0 0 1 .588 4.26L4.38.469a1.069 1.069 0 0 1 1.512 1.511L4.084 3.787h9.606l-1.85-1.85a1.069 1.069 0 1 1 1.512-1.51l3.792 3.791a1.069 1.069 0 0 1-.475 1.788L13.514 9.16a1.125 1.125 0 0 1-1.59-1.591l1.644-1.644z"/></svg>`
      }
    ];
  }

  static get toolbox() {
    return {
      title: 'Image',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20"><path d="M5.021 16.167q-.521 0-.854-.344-.334-.344-.334-.844V5.021q0-.5.334-.844.333-.344.854-.344h9.958q.521 0 .854.344.334.344.334.844v9.958q0 .5-.334.844-.333.344-.854.344Zm0-.667h9.958q.209 0 .365-.156t.156-.365V5.021q0-.209-.156-.365t-.365-.156H5.021q-.209 0-.365.156t-.156.365v9.958q0 .209.156.365t.365.156Zm1.729-1.917h6.625l-2.229-2.979-1.938 2.438-1.083-1.271ZM4.5 15.5V4.5 15.5Z"/></svg>`
    }
  }

  render() {
    this.wrapper = document.createElement('div');
    const input =  document.createElement('input');

    this.wrapper.classList.add('simple-image', 'mb-3');

    if (this.data && this.data.url) {
      this._createImage(this.data.url, this.data.caption);
      return this.wrapper;
    }

    input.classList.add('form-control');
    input.placeholder = 'Paste an image URL';
    input.value = this.data && this.data.url ? this.data.url : '';

    input.addEventListener('paste', (evt) => {
      this._createImage(evt.clipboardData.getData('text'));
    })

    this.wrapper.append(input);

    return this.wrapper;
  }

  save(blockContent) {
    const image = blockContent.querySelector('img');
    const caption = blockContent.querySelector('input');

    return Object.assign(this.data, {
      url: image.src,
      caption: caption.value || ''
    })
  }

  validate(savedData) {
    if (!savedData.url.trim()) {
      return false;
    }

    return true;
  }

  renderSettings() {

    const wrapper = document.createElement('div');

    this.settings.forEach(tune => {
      let button = document.createElement('div');

      button.classList.add(this.api.styles.settingsButton);
      button.classList.toggle(this.api.styles.settingsButtonActive, this.data[tune.name]);
      button.innerHTML = tune.icon;
      wrapper.append(button);

      button.addEventListener('click', () => {
        this._toggleTune(tune.name);
        button.classList.toggle('cdx-settings-button--active');
      })
    })

    return wrapper;
  }

  _createImage(url, captionText) {
    const image = document.createElement('img');
    const caption = document.createElement('input');

    image.src = url;
    caption.classList.add('form-control', 'mt-3');
    // caption.contentEditable = true;
    caption.value= captionText || '';

    this.wrapper.innerHTML = '';
    this.wrapper.append(image);
    this.wrapper.append(caption);

    this._acceptTuneView();

  }

  /**
   * @private
   * Click on the Settings Button
   * @param {string} tune — tune name from this.settings
   */

  _toggleTune(tune) {
    this.data[tune] = !this.data[tune];
    const img = this.wrapper.querySelector('img');
    const currentOption = this.settings.find(item => item.name === tune);
    img.classList.toggle(currentOption.className);
  }

  /**
   * Add specified class corresponds with activated tunes
   * @private
   */

  _acceptTuneView() {
    const img = this.wrapper.querySelector('img');
    this.settings.forEach(tune => {
      img.classList.toggle(tune.className, !!this.data[tune.name]);


      if (tune.name === 'stretched') {
        this.api.blocks.stretchBlock(this.api.blocks.getCurrentBlockIndex(), !!this.data.stretched);
      }
    })
  }
}