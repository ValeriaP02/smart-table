import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        if (elements[elementName]) {
            elements[elementName].append(
                ...Object.values(indexes[elementName]).map((name) => {
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    return option;
                })
            );
        }
    });

    // Возвращаем функцию фильтрации
    return function filtering(data, state, action) {
        const compare = createComparison(defaultRules);

        // @todo: #4.2 — очистка полей фильтров
        if (action && action.dataset && action.dataset.name === 'clear') {
            const input = action.target.closest('.input-group')?.querySelector(`[data-field="${action.dataset.field}"]`);
            if (input) {
                input.value = '';
                if (state) state[action.dataset.field] = '';
            }
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => compare(row, state));
    }
}
