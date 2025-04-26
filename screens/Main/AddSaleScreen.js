import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Button, TextInput, Text, useTheme, Checkbox } from 'react-native-paper';
import { writeBatch, doc, increment } from 'firebase/firestore';
import { db } from '../../config/firebase'; // Import db from firebase config

import { useData } from '../../context/DataContext';

const AddSaleScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const { products, addSale, loading } = useData();

  const [customerName, setCustomerName] = useState('');
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const newTotal = selectedProducts.reduce((sum, product) => {
      return sum + (product.price * product.quantity);
    }, 0);
    setTotal(newTotal.toFixed(2));
  }, [selectedProducts]);

  const handleProductSelection = (product) => {
    setSelectedProducts(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.filter(p => p.id !== product.id);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleQuantityChange = (productId, quantity) => {
    setSelectedProducts(prev => 
      prev.map(p => 
        p.id === productId ? { ...p, quantity: Math.max(1, quantity) } : p
      )
    );
  };

  const handleAddSale = async () => {
    try {
      // Update stock based on new sale quantities
      const batch = writeBatch(db);
      selectedProducts.forEach(product => {
        const productRef = doc(db, 'products', product.id);
        batch.update(productRef, {
          stock: increment(-product.quantity)
        });
      });
      await batch.commit();

      const saleData = {
        customerName,
        products: selectedProducts.map(p => ({
          id: p.id,
          name: p.name,
          quantity: p.quantity,
          price: p.price
        })),
        total: parseFloat(total),
        date: new Date(date).toISOString(),
      };

      await addSale(saleData);
      navigation.goBack();
    } catch (error) {
      console.error("Error adding sale:", error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={{ color: colors.primary, fontSize: 24 }}>Add Sale</Text>
      
      <TextInput
        label="Customer Name"
        value={customerName}
        onChangeText={setCustomerName}
        style={styles.input}
      />

      <Text style={styles.sectionTitle}>Select Products:</Text>
      {loading ? (
        <Text>Loading products...</Text>
      ) : (
        <FlatList
          data={products || []}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.productItem}>
              <Checkbox
                status={selectedProducts.some(p => p.id === item.id) ? 'checked' : 'unchecked'}
                onPress={() => handleProductSelection(item)}
              />
              <Text style={styles.productName}>{item.name}</Text>
              {selectedProducts.some(p => p.id === item.id) && (
                <TextInput
                  style={styles.quantityInput}
                  keyboardType="numeric"
                  value={selectedProducts.find(p => p.id === item.id)?.quantity.toString()}
                  onChangeText={text => handleQuantityChange(item.id, parseInt(text) || 1)}
                />
              )}
            </View>
          )}
        />
      )}

      <Text style={styles.totalText}>Total: ₹{total}</Text>

      <TextInput
        label="Date"
        value={date}
        onChangeText={setDate}
        style={styles.input}
        mode="outlined"
      />

      <Button mode="contained" onPress={handleAddSale} style={styles.button}>
        Add Sale
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  productName: {
    flex: 1,
    marginLeft: 8,
  },
  quantityInput: {
    width: 60,
    marginLeft: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'right',
  },
});

export default AddSaleScreen;
