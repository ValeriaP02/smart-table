import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchElements, options = {}) {
    const { searchField = 'searchValue', searchFields = ['date', 'customer', 'seller'], caseSensitive = false } = options;

    return (data, state, action) => {
        const query = state[searchField];
        if (!query || query.trim() === '') {
            return data; 
        }

        const queryLower = caseSensitive ? query : query.toLowerCase();

        return data.filter(row => {
            return searchFields.some(field => {
                const value = row[field];
                if (!value) return false;
                const valueStr = caseSensitive ? String(value) : String(value).toLowerCase();
                return valueStr.includes(queryLower);
            });
        });
    }
}