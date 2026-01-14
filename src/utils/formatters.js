export const formatMoney = (amount) => {
    return `Rs ${parseFloat(amount)}`;
};

export const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    const now = new Date();
    const diff = now - d; // Difference in milliseconds
    
    // 1. Today: Relative Time
    if (diff > 0 && diff < 86400000 && d.getDate() === now.getDate()) {
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins} min ago`;
        return `${Math.floor(mins / 60)} hr ago`;
    }

    // 2. Yesterday
    // const yesterday = new Date();
    // yesterday.setDate(now.getDate() - 1);
    // if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';

    // 3. Past Dates: Dec 24 or Dec 24, 2023
    return d.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: d.getFullYear() === now.getFullYear() ? undefined : 'numeric',
    });
};