import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, TextInput, Text, useTheme, Checkbox } from 'react-native-paper';
import { useData } from '../../context/DataContext';
import { writeBatch, doc, increment } from 'firebase/firestore';
import { db } from '../../config/firebase';


import { SafeAreaView } from 'react-native-safe-area-context';

const EditSaleScreen = ({ route, navigation }) => {
  const { colors } = useTheme();
  const { updateSale, products, updateProductStock } = useData(); // Fetch products and update function from context
  const { sale } = route.params;
  
  const [customerName, setCustomerName] = useState(sale.customerName || '');
  const [selectedProducts, setSelectedProducts] = useState(sale.items || []);
  const [total, setTotal] = useState(sale.total ? sale.total.toString() : ''); 
  const [date, setDate] = useState(sale.date ? sale.date.split('T')[0] : '');

  useEffect(() => {
    const newTotal = selectedProducts.reduce((sum, product) => {
      const productDetails = products.find(p => p.id === product.id);
      return sum + (productDetails ? productDetails.price * product.quantity : 0);
    }, 0);
    setTotal(newTotal.toFixed(2));
  }, [selectedProducts, products]);

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

  const handleUpdateSale = async () => {
    if (!customerName || !selectedProducts.length || !total || !date) {
      console.error("Invalid data: ", { customerName, selectedProducts, total, date });
      return; // Prevent update if any required field is missing
    }
    
    try {
      const saleData = {
        customerName,
        items: selectedProducts.map(p => ({
          id: p.id,
          name: p.name,
          quantity: p.quantity,
          price: p.price
        })),
        total: parseFloat(total),
        date: new Date(date).toISOString(),
      };
      console.log("Updating sale with data: ", saleData); // Log the data being sent
      await updateSale(sale.id, saleData);

      // Calculate stock changes
      const batch = writeBatch(db);
      const originalProducts = sale.items || [];
      
      // Create a map of original quantities for quick lookup
      const originalQuantities = new Map();
      originalProducts.forEach(p => {
        originalQuantities.set(p.id, p.quantity);
      });

      // Process each selected product
      for (const product of selectedProducts) {
        const productRef = doc(db, 'products', product.id);
        const originalQty = originalQuantities.get(product.id) || 0;
        const quantityChange = originalQty - product.quantity;
        
        // Only update if there's a change
        if (quantityChange !== 0) {
          batch.update(productRef, {
            stock: increment(quantityChange)
          });

        }
      }
      
      await batch.commit();


      navigation.goBack();



    } catch (error) {
      console.error("Error updating sale:", error);
      Alert.alert(
        "Update Failed",
        error.message || "An error occurred while updating the sale"
      );
    }

  };

  return ( 
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={{ color: colors.primary, fontSize: 24 }}>Edit Sale</Text>
      <TextInput
        label="Customer Name"
        value={customerName}
        onChangeText={setCustomerName}
        style={styles.input}
      />
      <Text style={styles.sectionTitle}>Select Products:</Text>
      {products.map(product => (
        <View style={styles.productItem} key={product.id}>
          <Checkbox
            status={selectedProducts.some(p => p.id === product.id) ? 'checked' : 'unchecked'}
            onPress={() => handleProductSelection(product)}
          />
          <Text style={styles.productName}>{product.name}</Text>
          {selectedProducts.some(p => p.id === product.id) && (
            <TextInput
              style={styles.quantityInput}
              keyboardType="numeric"
              value={selectedProducts.find(p => p.id === product.id)?.quantity.toString()}
              onChangeText={text => handleQuantityChange(product.id, parseInt(text) || 1)}
            />
          )}
        </View>
      ))}
      <Text style={styles.totalText}>Total: ₹{total}</Text>

      <TextInput
        label="Date"
        value={date}
        onChangeText={setDate}
        style={styles.input}
        mode="outlined"
      />
      <Button mode="contained" onPress={handleUpdateSale} style={styles.button}>
        Update Sale
      </Button>
    </SafeAreaView>
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

export default EditSaleScreen;
