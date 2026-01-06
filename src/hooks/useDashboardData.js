import { useMemo } from 'react';

export const useDashboardData = (data, filter) => {
    return useMemo(() => {
        const now = new Date();
        const filteredDocs = data.filter(item => {
            const itemDate = new Date(item.date);
            if (filter === 'Yearly') return itemDate.getFullYear() === now.getFullYear();
            if (filter === 'Monthly') {
                return itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
            }
            if (filter === 'Weekly') {
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(now.getDate() - 7);
                return itemDate >= oneWeekAgo && itemDate <= now;
            }
            return true;
        });

        let income = 0;
        let expense = 0;

        filteredDocs.forEach(item => {
            const amount = parseFloat(item.amount) || 0;
            item.category === 0 ? (income += amount) : (expense += amount);
        });

        return {
            income,
            expense,
            balance: income - expense,
            filtered: filteredDocs.sort((a, b) => new Date(b.date) - new Date(a.date))
        };
    }, [data, filter]);
};