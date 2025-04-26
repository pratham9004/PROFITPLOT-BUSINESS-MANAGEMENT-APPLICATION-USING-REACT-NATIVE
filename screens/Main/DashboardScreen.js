import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme } from 'react-native-paper';

import { useData } from '../../context/DataContext';
import MetricCard from '../../components/MetricCard';
import ChartComponent from '../../components/ChartComponent';

const ReportsScreen = () => {
  const { colors } = useTheme();
  const { sales = [] } = useData();
  const [metrics, setMetrics] = useState({
    totalSales: 0,
    averageSale: 0,
    totalTransactions: 0,
    topProduct: 'N/A',
  });

  useEffect(() => {
    if (sales.length > 0) {
      const total = sales.reduce((sum, sale) => sum + (sale?.total || 0), 0);
      const average = total / sales.length;

      const productSales = sales.reduce((acc, sale) => {
        sale?.items?.forEach(item => {
          acc[item.id] = (acc[item.id] || 0) + (item.price * item.quantity || 0);
        });
        return acc;
      }, {});

      const topProductKey = Object.keys(productSales).reduce((a, b) => 
        productSales[a] > productSales[b] ? a : b, 'N/A'
      );

      const topProduct = topProductKey !== 'N/A' && productData[topProductKey] ? productData[topProductKey].name : 'N/A';

      console.log('Product Sales:', productSales); // Debugging statement
      console.log('Top Product Key:', topProductKey); // Debugging statement
      console.log('Top Product:', topProduct); // Debugging statement

      setMetrics({
        totalSales: total.toFixed(2),
        averageSale: average.toFixed(2),
        totalTransactions: sales.length,
        topProduct: topProduct,
      });
    }
  }, [sales]);

  const salesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: sales && Array.isArray(sales) && sales.length > 0 ? 
        sales.map(sale => sale?.total || 0) :
        [0, 0, 0, 0, 0, 0, 0],
      label: 'Sales'
    }]
  };

  const productData = sales.reduce((acc, sale) => {
    if (sale?.products) {
      sale.products.forEach(product => {
        acc[product.name] = (acc[product.name] || 0) + (product.quantity || 1);
      });
    }
    return acc;
  }, {});

  const pieData = Object.keys(productData || {}).map((product, index) => {
    const color = `hsl(${(index * 360 / Object.keys(productData).length)}, 70%, 50%)`;
    return {
      name: product,
      value: productData[product] || 0,
      color: color,
      legendFontColor: colors.text,
      legendFontSize: 15
    };
  }) || [];

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.metricsContainer}>
        <MetricCard 
          title="Total Sales" 
          value={`₹${metrics.totalSales}`} 
        />
        <MetricCard 
          title="Avg. Sale" 
          value={`₹${metrics.averageSale}`} 
        />
        <MetricCard 
          title="Transactions" 
          value={metrics.totalTransactions} 
        />

      </View>

      <ChartComponent
        type="line"
        data={salesData}
        title="Weekly Sales Trend"
      />

      <ChartComponent
        type="pie"
        data={pieData}
        title="Product Sales Distribution"
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 20,
  },
  metricsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});

export default ReportsScreen;
