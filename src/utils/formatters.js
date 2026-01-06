export const formatMoney = (amount) => {
    return `Rs ${parseFloat(amount)}`;
};

export const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    const currentYear = new Date().getFullYear();
    const transactionYear = d.getFullYear();

    // Default options: Dec 24
    const options = { month: 'short', day: 'numeric' };

    // If the year is different, add the year: Dec 24, 2023
    if (transactionYear !== currentYear) {
        options.year = 'numeric';
    }

    return d.toLocaleDateString('en-In', options);
};
