import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes, state, data, action) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes)
        .forEach((elementName) => {
            elements[elementName].innerHTML = '';

            const emptyOption = document.createElement('option');
            emptyOption.value = '';
            emptyOption.textContent = '—';
            elements[elementName].appendChild(emptyOption);

            elements[elementName].append(
                ...Object.values(indexes[elementName])
                    .map((name) => {
                        const option = document.createElement('option');
                        option.value = name;
                        option.textContent = name;
                        return option;
                    })
            );
        });

    // @todo: #4.2 — очистка полей фильтров
    if (action && action.type === 'clear') {
        const clearButton = document.querySelector(`button[data-field="${action.payload.field}"]`);
        if (clearButton) {
            const parent = clearButton.parentElement;

            const inputToClear = parent.querySelector('input[data-field]');
            if (inputToClear) {
                inputToClear.value = '';
                state[action.payload.field] = '';
            }

            const selectToClear = parent.querySelector('select[data-field]');
            if (selectToClear) {
                selectToClear.value = '';
                state[action.payload.field] = '';
            }
        }
    }

    // @todo: #4.5 — отфильтровать данные используя компаратор
    return data.filter(row => compare(row, state));
}