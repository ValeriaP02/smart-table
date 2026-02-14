import './fonts/ys-display/fonts.css'
import './style.css'

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";

import { initPagination } from './components/pagination.js';
import { initSorting } from './components/sorting.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';
// @todo: подключение

// Исходные данные используемые в render()
const { data, ...indexes } = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage); // приведём количество страниц к числу
    const page = parseInt(state.page ?? 1); // номер страницы по умолчанию 1 и тоже число

    const totalFrom = state.totalFrom ? parseFloat(state.totalFrom) : null;
    const totalTo = state.totalTo ? parseFloat(state.totalTo) : null;

    return {
        ...state,
        rowsPerPage,
        page,
        totalFrom,
        totalTo
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    let state = collectState(); // состояние полей из таблицы
    let result = [...data]; // копируем для последующего изменения

    // @todo: использование
    // 1. поиск
    result = applySearching(result, state, action);

    // 2. фильтрация
    result = applyFiltering(result, state, action);

    // 3. сортировка
    result = applySorting(result, state, action);

    // 4. пагинация
    result = applyPagination(result, state, action);

    // 5. вывод в таблицу
    sampleTable.render(result);
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],
    after: ['pagination']
}, render);

// @todo: инициализация
const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
);

const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const applyFiltering = initFiltering(sampleTable.filter.elements, {
    searchBySeller: indexes.sellers
});

const applySearching = initSearching(sampleTable.search.elements, {
    searchField: 'searchValue',
    rules: [
        { rule: 'skipEmptyTargetValues' },
        { rule: 'searchMultipleFields', searchField: ['date', 'customer', 'seller'], exclude: false }
    ]
});

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();
