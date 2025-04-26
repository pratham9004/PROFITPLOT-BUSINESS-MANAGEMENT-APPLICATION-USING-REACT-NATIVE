import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, useTheme, IconButton } from 'react-native-paper';
import { useData } from '../context/DataContext';
import { useNavigation } from '@react-navigation/native';

const SaleItem = ({ sale, onPress }) => {
  const { colors } = useTheme();
  const { deleteSale } = useData();
  const navigation = useNavigation();

  const handlePress = () => {
    if (onPress) {
      onPress(sale);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSale(sale.id);
    } catch (error) {
      console.error('Error deleting sale:', error);
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditSale', { sale });
  };

  return (
    <Card style={styles.card} onPress={handlePress}>
      <Card.Content>
        <Text style={[styles.date, { color: colors.text }]}>
          {new Date(sale.date).toLocaleDateString()}
        </Text>
        <Text style={{ color: colors.text, marginBottom: 4 }}>
          {sale.customerName || 'Sale'}
        </Text>
        <View style={styles.details}>
          <Text style={{ color: colors.text }}>
          Items: {sale?.products?.reduce((sum, p) => sum + (p.quantity || 1), 0) || 0}



          </Text>
          <Text style={[styles.total, { color: colors.primary }]}>
          ₹{(sale?.total || 0).toFixed(2)}

          </Text>
        </View>
        <View style={styles.actions}>
          <IconButton
            icon="pencil"
            size={20}
            onPress={handleEdit}
            iconColor={colors.primary}
          />
          <IconButton
            icon="delete"
            size={20}
            onPress={handleDelete}
            iconColor={colors.error}
          />
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    marginBottom: 4,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  total: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 8,
  },
});

export default SaleItem;
