import SortableTable, { header } from '../sortable-table/index.js';

export default class InfinityTable {
  $element;
  table;
  data = [];
  loading = false;

  onWindowScroll = () => {
    const { bottom } = this.$element.getBoundingClientRect();

    if (bottom < document.documentElement.clientHeight) {
      this.loading = true;
      this.dispatchEvent();
    }
  };

  constructor(data) {
    this.data = data;

    this.render();
    this.initEventListeners();
  }

  render() {
    this.$element = document.createElement('div');
    this.table = new SortableTable(header, {
      data: this.data
    });

    this.$element.append(this.table.$element);
  }

  addRows(data) {
    this.table.addRows(data);
    this.loading = false;
  }

  dispatchEvent() {
    this.$element.dispatchEvent(
      new CustomEvent('load-data', {
        bubbles: true
      })
    );
  }

  initEventListeners() {
    document.addEventListener('scroll', this.onWindowScroll);
  }

  remove() {
    this.$element.remove();
    document.removeEventListener('scroll', this.onWindowScroll);
  }

  destroy() {
    this.remove();
    this.$element = null;
    this.table = null;
    this.data = [];
    this.loading = false;
  }
}
