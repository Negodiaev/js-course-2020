export default class ColumnChart {
  $element;
  $subElements = {};

  constructor(data, options = {}) {
    this.data = data;
    this.options = options;

    this.render();
  }

  getColumnBody(data) {
    return data
      .map(({ value }) => {
        return `<div data-tooltip="${value}%" style="--value: ${value}"></div>`;
      })
      .join('');
  }

  getLink() {
    const { link } = this.options;

    return link ? `<a class="column-chart__link" href="${link}">View all</a>` : '';
  }

  get template() {
    return `
      <div class="column-chart__header">
        <div class="column-chart__title">
          Total ${this.options.label}
          ${this.getLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.options.value}</div>
          <div data-element="body" class="column-chart__chart">
            ${this.getColumnBody(this.data)}
          </div>
        </div>
      </div>
    `;
  }
  render() {
    this.$element = document.createElement('div');
    this.$element.className = 'column-chart';
    this.$element.innerHTML = this.template;
    this.$subElements = this.getSubElements(this.$element);
  }

  getSubElements($element) {
    const elements = $element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  updateData(headerData, bodyData) {
    this.$subElements.header.textContent = headerData;
    this.$subElements.body.innerHTML = this.getColumnBody(bodyData);
  }

  destroy() {
    this.$element.remove();
    this.$element = null;
    this.$subElements = null;
  }
}
