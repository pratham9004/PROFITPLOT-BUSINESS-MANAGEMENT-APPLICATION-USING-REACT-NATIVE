import React from 'react';
import { View, StyleSheet } from 'react-native';
import { List, IconButton } from 'react-native-paper';

const ProductItem = ({ product, onDelete, onEdit }) => {
  return (
    <List.Item
      title={product.name}
      description={`Price: ₹${product.price} | Stock: ${product.stock}`}


      style={styles.container}
      titleStyle={styles.title}
      descriptionStyle={styles.description}
      onPress={() => {
        console.log('Navigating to ProductDetail with ID:', product.id); // Log the product ID
        // Navigation to ProductDetail has been removed
      }} 

      right={() => (
        <View style={styles.actions}>
          <IconButton
            icon="pencil"
            iconColor="#2E7D32"
            size={20}
            onPress={() => onEdit(product)}
          />
          <IconButton
            icon="delete"
            iconColor="#B00020"
            size={20}
            onPress={() => onDelete(product.id)}
          />
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    marginBottom: 8,
    borderRadius: 8,
    elevation: 2,
  },
  title: {
    color: '#2E7D32',
    fontWeight: 'bold',
  },
  description: {
    color: '#757575',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default ProductItem; // Default export
