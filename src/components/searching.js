import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchElements, options = {}) {
    const { searchField = 'searchValue', searchFields = ['date', 'customer', 'seller'], caseSensitive = false } = options;

    return (data, state, action) => {
        const query = (state[searchField] ?? '').trim();
        if (!query) {
            // Возвращать весь массив при пустом поиске
            return data;
        }

        const queryLower = caseSensitive ? query : query.toLowerCase();

        return data.filter(row => {
            // Собираем все поля в одну строку
            const hay = searchFields
                .map(field => {
                    const value = row?.[field];
                    return value != null ? String(value) : '';
                })
                .join(' ');

            // Для дебага можно вывести hay и query
            // console.log('hay:', hay, 'query:', query);
            const hayLower = caseSensitive ? hay : hay.toLowerCase();

            return hayLower.includes(queryLower);
        });
    }
}