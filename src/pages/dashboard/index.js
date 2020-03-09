import { generateRandomNumber, getDiffDays, getFakeDate } from '../../utils/index.js';
import RangePicker from '../../components/range-picker/index.js';
import ColumnChart from '../../components/column-chart/index.js';
import InfinityTable from '../../components/infinity-table/index.js';
import data from '../../products-data.js';

const rangePicker = new RangePicker({
  from: new Date(2020, 1, 3),
  to: new Date(2020, 2, 20)
});

document.getElementById('range-picker-root').append(rangePicker.$element);

rangePicker.$element.addEventListener('date-select', event => {
  const { from, to } = event.detail;
  const diffDays = getDiffDays(from, to);

  ordersColumnChart.updateData(generateRandomNumber(10, 30), getFakeDate(diffDays));
  salesColumnChart.updateData(generateRandomNumber(10, 30), getFakeDate(diffDays));
  customersColumnChart.updateData(generateRandomNumber(10, 30), getFakeDate(diffDays));
});

const { from, to } = rangePicker.selected;
const initialRangeSize = getDiffDays(from, to);

const ordersColumnChart = new ColumnChart(getFakeDate(initialRangeSize), {
  label: 'orders',
  value: 344,
  link: '#'
});

ordersColumnChart.$element.classList.add('dashboard__chart_orders');

const salesColumnChart = new ColumnChart(getFakeDate(initialRangeSize), {
  label: 'sales',
  value: '$243,437'
});

salesColumnChart.$element.classList.add('dashboard__chart_sales');

const customersColumnChart = new ColumnChart(getFakeDate(initialRangeSize), {
  label: 'customers',
  value: 321
});

customersColumnChart.$element.classList.add('dashboard__chart_customers');

document
  .getElementById('charts-root')
  .append(ordersColumnChart.$element, salesColumnChart.$element, customersColumnChart.$element);

const step = 10;
let start = 0;
let end = step;

const infinityTable = new InfinityTable(data.slice(0, end));
const { $element } = infinityTable;

document.getElementById('sortable-table-root').append($element);

$element.addEventListener('load-data', () => {
  start = end;
  end += step;

  infinityTable.addRows(data.slice(start, end));
});

document.getElementById('sortable-table-root').append(infinityTable.$element);
