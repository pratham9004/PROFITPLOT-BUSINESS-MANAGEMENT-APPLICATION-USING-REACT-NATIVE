import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Searchbar, FAB } from 'react-native-paper';
import ProductItem from '../../components/ProductItem';
import AddProductModal from './AddProductModal';
import EditProductModal from './EditProductModal';
import { useData } from '../../context/DataContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProductsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddModalVisible, setAddModalVisible] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { products, deleteProduct } = useData();

  const handleEdit = (product) => {
    setSelectedProduct(product);
    setEditModalVisible(true);
  };

  const filteredProducts = products.filter(product =>
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <Searchbar
        placeholder="Search products..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.search}
      />

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ProductItem 
            product={item} 
            onDelete={deleteProduct}
            onEdit={handleEdit}
            navigation={navigation} // Pass navigation prop
          />
        )}
        contentContainerStyle={styles.list}
      />

      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => setAddModalVisible(true)}
        color="white"
      />

      <AddProductModal
        visible={isAddModalVisible}
        onClose={() => setAddModalVisible(false)}
      />

      <EditProductModal
        visible={isEditModalVisible}
        onClose={() => setEditModalVisible(false)}
        product={selectedProduct}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFFDE7',
  },
  search: {
    marginBottom: 16,
    backgroundColor: 'white',
  },
  list: {
    paddingBottom: 16,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2E7D32',
  },
});

export default ProductsScreen;
