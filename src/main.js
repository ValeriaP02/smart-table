import './fonts/ys-display/fonts.css'
import './style.css'

import { data as sourceData } from "./data/dataset_1.js";

import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";

import { initTable } from "./components/table.js";
import { initSorting } from './components/sorting.js';
import { initPagination } from './components/pagination.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';

// @todo: подключение

const api = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));

    const rowsPerPage = parseInt(state.rowsPerPage);
    const page = parseInt(state.page ?? 1);
    const total = [null, null];

    const totalFrom = Number(state.totalFrom);
    if (state.totalFrom !== '' && !isNaN(totalFrom))
        total[0] = totalFrom;

    const totalTo = Number(state.totalTo);
    if (state.totalTo !== '' && !isNaN(totalTo))
        total[1] = totalTo;

    return {
        ...state,
        rowsPerPage,
        page,
        total
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
async function render(action) {
    let state = collectState();
    let query = {};

    // @todo: использование
    query = applySearching(query, state, action);    // Поиск
    query = applyFiltering(query, state, action);    // Фильтрация
    query = applySorting(query, state, action);      // Сортировка 
    query = applyPagination(query, state, action);   // Пагинация

    const { total, items } = await api.getRecords(query);

    updatePagination(total, query); // перерисовываем пагинатор
    sampleTable.render(items);
    console.log('Рендерим таблицу с items:', items);

    console.log('Запрос к API:', query);
}

const sampleTable = initTable(
    {
        tableTemplate: 'table',
        rowTemplate: 'row',
        before: ['search', 'header', 'filter'],
        after: ['pagination']
    },
    render
);

// @todo: инициализация
const { applyPagination, updatePagination } = initPagination(
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

const { applyFiltering, updateIndexes } = initFiltering(sampleTable.filter.elements);

const applySearching = initSearching('search');

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

async function init() {
    const indexes = await api.getIndexes();

    updateIndexes(sampleTable.filter.elements, {
        searchBySeller: indexes.sellers
    });
}

init().then(render);
