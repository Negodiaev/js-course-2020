export const header = [
  {
    id: 'image',
    title: 'Image',
    sortable: false
  },
  {
    id: 'title',
    title: 'Name',
    sortable: true,
    sortType: 'string'
  },
  {
    id: 'quantity',
    title: 'Quantity',
    sortable: true,
    sortType: 'number'
  },
  {
    id: 'price',
    title: 'Price',
    sortable: true,
    sortType: 'number'
  },
  {
    id: 'enabled',
    title: 'Status',
    sortable: true,
    sortType: 'number'
  }
];

export default class SortableTable {
  $element;
  $subElements = {};

  headersConfig = [];
  data = [];

  onSortClick = event => {
    const column = event.target.closest('[data-sortable="true"]');

    if (column) {
      const { id, order } = column.dataset;
      const sortedData = this.sortData(id, order);
      const arrow = column.querySelector('.sortable-table__sort-arrow');

      column.dataset.order = order === 'asc' ? 'desc' : 'asc';

      if (!arrow) {
        column.append(this.$subElements.arrow);
      }

      this.$subElements.body.innerHTML = this.getTableBody(sortedData);
    }
  };

  constructor(
    headersConfig,
    {
      data = [],
      sorted = {
        id: headersConfig.find(item => item.sortable).id,
        order: 'asc'
      }
    } = {}
  ) {
    this.headersConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;

    this.render();
  }

  getTableHeader() {
    return `<div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.headersConfig.map(item => this.getHeaderRow(item)).join('')}
    </div>`;
  }

  getHeaderRow({ id, title, sortable }) {
    const order = this.sorted.id === id ? this.sorted.order : 'asc';

    return `
      <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${order}">
        <span>${title}</span>
        ${this.getHeaderSortingArrow(id)}
      </div>
    `;
  }

  getHeaderSortingArrow(id) {
    const isOrderExist = this.sorted.id === id ? this.sorted.order : '';

    return isOrderExist
      ? `<span data-element="arrow" class="sortable-table__sort-arrow">
          <span class="sort-arrow"></span>
        </span>`
      : '';
  }

  getTableBody(data) {
    return `<div data-element="body" class="sortable-table__body">
      ${this.getTableRows(data)}
    </div>`;
  }

  getTableRows(data) {
    return `${data
      .map(item => {
        const row = new TableRow(item);

        // TODO: added ability to set custom template for row
        // row.template = row.template.replace('sortable-table__row', 'sortable-table__row bold');

        return row.render();
      })
      .join('')}`;
  }

  getTable(data) {
    return `<div class="sortable-table">
      ${this.getTableHeader()}
      ${this.getTableBody(data)}
    </div>`;
  }

  render() {
    const $wrapper = document.createElement('div');
    const sortedData = this.sortData(this.sorted.id);

    $wrapper.innerHTML = this.getTable(sortedData);

    const $element = $wrapper.firstElementChild;

    this.$element = $element;
    this.$subElements = this.getSubElements($element);

    this.initEventListeners();
  }

  sortData(field, order) {
    const arr = [...this.data];
    // TODO: rethink data structure of header config
    const column = this.headersConfig.find(item => item.id === field);
    const { sortType, customSorting } = column;
    const direction = order === 'asc' ? 1 : -1;

    return arr.sort((a, b) => {
      switch (sortType) {
        case 'number':
          return direction * (a[field] - b[field]);
        case 'string':
          return direction * a[field].localeCompare(b[field]);
        case 'custom':
          return direction * customSorting(a, b);
        default:
          return direction * (a[field] - b[field]);
      }
    });
  }

  initEventListeners() {
    this.$subElements.header.addEventListener('pointerdown', this.onSortClick);
  }

  getSubElements($element) {
    const elements = $element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  addRows(data) {
    const rows = document.createElement('div');

    this.data = [...this.data, ...data];
    rows.innerHTML = this.getTableRows(data);

    this.$subElements.body.append(...rows.childNodes);
  }

  remove() {
    this.$element.remove();
  }

  destroy() {
    this.remove();
    this.$element = {};
    this.$subElements = {};
  }
}

class TableRow {
  $element;

  _template = () => `
    <a href="/products/3d-ochki-epson-elpgs03" class="sortable-table__row">
    <div class="sortable-table__cell">
      <img class="sortable-table-image" alt="Image" src="${this.data.images[0]}">
    </div>
    <div class="sortable-table__cell">${this.data.title}</div>
    <div class="sortable-table__cell">${this.data.quantity}</div>
    <div class="sortable-table__cell">${this.data.price}</div>
    <div class="sortable-table__cell">${this.data.enabled}</div>
  </a>`;

  constructor(data) {
    this.data = data;
  }

  render() {
    const $wrapper = document.createElement('div');

    $wrapper.innerHTML = this.template;

    this.$element = $wrapper.firstElementChild;

    return this.$element.outerHTML;
  }

  set template(html) {
    this._template = () => html;
  }

  get template() {
    return this._template();
  }
}
