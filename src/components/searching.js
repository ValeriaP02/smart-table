import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchElements, config) {
    // #5.1 — настройка компаратора
    const searchRules = [
        rules.skipEmptyTargetValues,
        rules.searchMultipleFields(
            config.searchField,
            config.rules.find(r => r.rule === 'searchMultipleFields').searchField,
            config.rules.find(r => r.rule === 'searchMultipleFields').exclude
        )
    ];
    const searchComparator = createComparison(searchRules); return (data, state, action) => {
        // #5.2 — применение компаратора
        const searchValue = state[config.searchField.dataset.field];
        if (searchValue && searchValue.trim()) {
            return data.filter(row => searchComparator(row, state));
        }
        return data;
    }
}