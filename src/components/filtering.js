import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
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
        });;

    return (data, state, action) => {
        // Обработка очистки поля
        if (action && action.type === 'clear') {
            const button = document.querySelector(`button[data-field="${action.payload.field}"]`);
            if (button) {
                const parent = button.parentElement;
                const input = parent.querySelector('input');
                if (input) {
                    input.value = '';
                }
                state[action.payload.field] = '';
            }
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    }
}