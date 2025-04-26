import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Modal, TextInput, Button, Title } from 'react-native-paper';
import { useData } from '../../context/DataContext';

const AddProductModal = ({ visible, onClose }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const { addProduct } = useData();

  const handleSubmit = async () => {
    if (!name || !price || !stock) return;

    try {
      await addProduct({
        name,
        price: parseFloat(price),
        stock: parseInt(stock)
      });
      onClose();
      setName('');
      setPrice('');
      setStock('');
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  return (
    <Modal visible={visible} onDismiss={onClose}>
      <View style={styles.modalContainer}>
        <Title style={styles.title}>Add New Product</Title>
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
          onPress={handleSubmit}
          style={styles.button}
        >
          Add Product
        </Button>
      </View>
    </Modal>
  );
};

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

export default AddProductModal;