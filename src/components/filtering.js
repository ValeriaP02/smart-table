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

    return function filtering(data, state, action) {
        // @todo: #4.2 — очистка полей фильтров
        if (action && action.dataset && action.dataset.name === 'clear') {
            const parent = action.target.closest('.input-group');
            if (parent) {
                const input = parent.querySelector(`[data-field="${action.dataset.field}"]`);
                if (input) {
                    input.value = '';
                    if (state) state[action.dataset.field] = '';
                }
            }
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        return data.filter(row => {
            if (state.totalFrom != null && parseFloat(row.total) < state.totalFrom) return false;
            if (state.totalTo != null && parseFloat(row.total) > state.totalTo) return false;
            return compare(row, state);
        });
    };
}
