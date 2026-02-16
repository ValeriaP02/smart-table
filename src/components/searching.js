import { rules, createComparison } from "../lib/compare.js";

export function initSearching(elements, searchSettings) {
    // @todo: #5.1 — настроить компаратор
    const compare = createComparison(rules.skipEmptyTargetValues,
        {
            ...rules.searchMultipleFields(
                searchSettings.searchField,
                searchSettings.searchFields,
                searchSettings.caseSensitive
            )
        }
    );

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        if (action?.dataset.action === 'clear') {
            const fieldName = action.dataset.field;
            const inputElement = action.parentNode.querySelector(`[data-field="${fieldName}"]`);
            if (inputElement) {
                inputElement.value = '';
                state[fieldName] = '';
            }
        }
        return data;
    }
}
