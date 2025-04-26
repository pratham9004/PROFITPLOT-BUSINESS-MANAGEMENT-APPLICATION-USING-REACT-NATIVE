import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, TextInput, Button, Title } from 'react-native-paper';
import { useData } from '../../context/DataContext';

const EditProductModal = ({ visible, onClose, product }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const { updateProduct } = useData();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(product.price.toString());
      setStock(product.stock.toString());
    }
  }, [product]);

  const handleUpdate = async () => {
    if (!name || !price || !stock) return;

    try {
      await updateProduct(product.id, {
        name,
        price: parseFloat(price),
        stock: parseInt(stock)
      });
      onClose();
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <Modal visible={visible} onDismiss={onClose}>
      <View style={styles.modalContainer}>
        <Title style={styles.title}>Edit Product</Title>
        <TextInput
          label="Product Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Price"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
        />
        <TextInput
          label="Stock Quantity"
          value={stock}
          onChangeText={setStock}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
        />
        <Button 
          mode="contained" 
          onPress={handleUpdate}
          style={styles.button}
        >
          Update Product
        </Button>
      </View>
    </Modal>
  );
};

// Use same styles as AddProductModal
const styles = StyleSheet.create({
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 8,
  },
  title: {
    color: '#2E7D32',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#2E7D32',
  },
});

export default EditProductModal;