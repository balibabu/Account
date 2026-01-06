import { useState, useMemo } from 'react';

export const useTransactionFilters = (data) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);
    const [showFilters, setShowFilters] = useState(false);

    const filteredData = useMemo(() => {
        let result = [...data];
        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            result = result.filter(i => i.description.toLowerCase().includes(q) || String(i.amount).includes(q));
        }
        if (fromDate) {
            const start = new Date(fromDate).setHours(0, 0, 0, 0);
            result = result.filter(i => new Date(i.date).setHours(0, 0, 0, 0) >= start);
        }
        if (toDate) {
            const end = new Date(toDate).setHours(0, 0, 0, 0);
            result = result.filter(i => new Date(i.date).setHours(0, 0, 0, 0) <= end);
        }
        return result;
    }, [searchQuery, fromDate, toDate, data]);

    const resetFilters = () => { setFromDate(null); setToDate(null); };

    return { searchQuery, setSearchQuery, fromDate, setFromDate, toDate, setToDate, showFilters, setShowFilters, filteredData, resetFilters };
};