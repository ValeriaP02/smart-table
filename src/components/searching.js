import { createComparison, rules } from "../lib/compare.js";

export function initSearching(elements, config) {
    return (data, state, action) => {
        const searchValue = state[config.searchField]?.trim().toLowerCase();
        
        if (!searchValue) {
            return data; // Если поиск пустой, возвращаем все данные
        }

        // Прямая фильтрация с частичным поиском по всем указанным полям
        const searchFields = config.rules.find(r => r.rule === 'searchMultipleFields').searchField;
        
        return data.filter(row => {
            return searchFields.some(field => {
                const fieldValue = String(row[field] || '').toLowerCase();
                return fieldValue.includes(searchValue);
            });
        });
    };
}
