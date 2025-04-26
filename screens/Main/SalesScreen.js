import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { useTheme, Button, Card, Text } from 'react-native-paper';
import SaleItem from '../../components/SaleItem';
import { useData } from '../../context/DataContext';
import { useNavigation } from '@react-navigation/native';


const SalesScreen = () => {
  const { colors } = useTheme();
  const { sales, fetchSales } = useData();
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  useEffect(() => {
    const unsubscribe = fetchSales();
    console.log('Subscribed to sales updates');
    return () => {
      if (unsubscribe) {
        unsubscribe();
        console.log('Unsubscribed from sales updates');
      }
    };
  }, []);

  useEffect(() => {
    console.log('Sales updated:', sales.length, 'items');
    console.log('Sales data:', JSON.stringify(sales, null, 2));
    setLastUpdate(Date.now());
  }, [sales]);





  const navigation = useNavigation();
  
  const handleAddSale = () => {
    navigation.navigate('AddSale');
  };


  const totalSales = sales.reduce((sum, sale) => sum + (sale?.total || 0), 0);
  const totalItems = sales.reduce((sum, sale) => {
    if (sale?.products) {
      return sum + sale.products.reduce((productSum, product) => productSum + (product.quantity || 1), 0);
    }
    return sum;
  }, 0);

  console.log('Rendering sales screen with:', sales.length, 'sales');
  console.log('Current sales state:', JSON.stringify(sales, null, 2));






  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={styles.statsCard}>
        <Card.Content>
          <Text variant="titleLarge" style={{ color: colors.primary }}>
            Sales Summary
          </Text>
          <Text variant="bodyMedium" style={{ color: colors.text }}>
            Total Sales: ₹{totalSales.toFixed(2)}
          </Text>
          <Text variant="bodyMedium" style={{ color: colors.text }}>
            Transactions: {sales.length}
          </Text>
          <Text variant="bodyMedium" style={{ color: colors.text }}>
            Total Items Sold: {totalItems} (Total Products: {sales.reduce((sum, sale) => sum + (sale?.products?.length || 0), 0)})

          </Text>


        </Card.Content>
      </Card>

      <Button 
        mode="contained" 
        onPress={handleAddSale}
        style={styles.addButton}
        icon="plus"
      >
        Add Sale
      </Button>

      {sales.map((sale) => (
        <SaleItem 
          key={sale.id} 
          sale={sale}
          onPress={(sale) => navigation.navigate('SaleDetails', { sale })}
        />
      ))}


    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 25,
  },
  statsCard: {
    marginBottom: 16,
  },
  addButton: {
    marginBottom: 16,
  },
});


export default SalesScreen;
