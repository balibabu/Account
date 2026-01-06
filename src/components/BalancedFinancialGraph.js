import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-gifted-charts';

const { width } = Dimensions.get('window');

const BalancedFinancialGraph = ({ data }) => {
    // const [activeLine, setActiveLine] = useState('all');



    const chartData = useMemo(() => {
        let cumIncome = 0;
        let cumExpense = 0; // We will treat this as negative for the graph

        const incomeData = [];
        const expenseData = [];
        const netData = [];
        const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

        sortedData.forEach((item, index) => {
            if (item.category === 0) cumIncome += item.amount;
            else cumExpense -= item.amount; // Accumulate as negative

            const dateLabel = new Date(item.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

            incomeData.push({ value: cumIncome, label: index % 2 === 0 ? dateLabel : '' });
            expenseData.push({ value: cumExpense });
            netData.push({ value: cumIncome + cumExpense }); // Income (pos) + Expense (neg) = Net
        });

        // Find the max absolute value to balance the Y-axis
        const allValues = [...incomeData, ...expenseData, ...netData].map(d => Math.abs(d.value));
        const maxVal = Math.max(...allValues, 100);

        return { incomeData, expenseData, netData, maxVal };
    }, [data]);

    return (
        <View style={styles.container}>

            <LineChart
                dataSet={[
                    {
                        data: chartData.incomeData,
                        color: '#22c55e', // Green
                        thickness: 3,
                    },
                    {
                        data: chartData.expenseData,
                        color: '#ef4444', // Red
                        thickness: 3,
                    },
                    {
                        data: chartData.netData,
                        color: '#3b82f6', // Blue
                        thickness: 4,
                    },
                ]}
                isAnimated                  // Animates the first time it loads
                animationDuration={1500}     // Makes the drawing slow and elegant
                animateOnDataChange         // Smooth transition when you filter/change data
                onDataChangeAnimationDuration={400}
                animationType="timing"

                // Crucial props for centered X-Axis:
                maxValue={chartData.maxVal}
                mostNegativeValue={-chartData.maxVal}
                noOfSections={3} // 3 sections above 0
                noOfSectionsBelowXAxis={3} // 3 sections below 0

                height={320}
                width={width - 80}
                spacing={60}
                initialSpacing={20}
                xAxisThickness={2}
                xAxisColor={'#333'} // This line will now be in the middle
                yAxisColor={'#ccc'}
                yAxisTextStyle={{ color: '#666', fontSize: 10 }}
                rulesType="solid"
                rulesColor="#eeeeee"
                pointerConfig={{
                    pointerStackChildrenProviders: [
                        (item) => <View style={styles.pointerDot} />, // Custom dot on the line
                    ],
                    showPointerStrip: true,
                    pointerStripUptoDataPoint: true,
                    pointerStripColor: 'lightgray',
                    pointerStripWidth: 2,
                    strokeDashArray: [5, 5], // Makes the vertical line dashed
                    radius: 6,
                    pointerLabelComponent: (items) => {
                        // 'items' is an array containing the data point for each line at this X-index
                        return (
                            <View style={styles.tooltipContainer}>
                                <Text style={styles.tooltipDate}>{items[0].label}</Text>

                                <View style={styles.tooltipRow}>
                                    <Text style={{ color: '#22c55e' }}>Inc: </Text>
                                    <Text style={styles.tooltipValue}>${items[0].value}</Text>
                                </View>

                                <View style={styles.tooltipRow}>
                                    <Text style={{ color: '#ef4444' }}>Exp: </Text>
                                    <Text style={styles.tooltipValue}>${Math.abs(items[1].value)}</Text>
                                </View>

                                <View style={styles.tooltipRow}>
                                    <Text style={{ color: '#3b82f6' }}>Net: </Text>
                                    <Text style={styles.tooltipValue}>${items[2].value}</Text>
                                </View>
                            </View>
                        );
                    },
                    pointerLabelWidth: 120,
                    pointerLabelHeight: 90,
                    activatePointersOnLongPress: false, // Set to true if you want it only on long press
                    autoAdjustPointerLabelPosition: true,
                }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff', alignItems: 'center' },
    header: { fontSize: 20, fontWeight: '700', marginVertical: 20, color: '#1a1a1a' },
    selector: { flexDirection: 'row', gap: 10, marginBottom: 30 },
    chip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd' },
    chipActive: { backgroundColor: '#333', borderColor: '#333' },
    chipText: { fontSize: 12, fontWeight: '600', color: '#666' },
    pointerLabel: { backgroundColor: '#fff', padding: 8, borderRadius: 4, borderWidth: 1, borderColor: '#ccc' },
    tooltipContainer: {
        backgroundColor: '#333',
        padding: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    tooltipDate: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    tooltipRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 2,
    },
    tooltipValue: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 12,
    },
    pointerDot: {
        height: 12,
        width: 12,
        backgroundColor: 'white',
        borderWidth: 3,
        borderColor: '#3b82f6',
        borderRadius: 6,
    }
});

export default BalancedFinancialGraph;