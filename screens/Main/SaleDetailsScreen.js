import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { useTheme, Card, Text } from 'react-native-paper';

const SaleDetailsScreen = ({ route }) => {
  const { colors } = useTheme();
  const { sale = {} } = route.params;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={{ color: colors.primary, marginBottom: 16 }}>
            Sale Details
          </Text>
          
          <Text style={[styles.label, { color: colors.text }]}>Date:</Text>
          <Text style={{ color: colors.text, marginBottom: 8 }}>
            {sale?.date ? new Date(sale.date).toLocaleDateString() : 'No date'}

          </Text>

          <Text style={[styles.label, { color: colors.text }]}>Customer:</Text>
          <Text style={{ color: colors.text, marginBottom: 8 }}>
            {sale?.customerName || 'No customer name'}
          </Text>

          <Text style={[styles.label, { color: colors.text }]}>Items:</Text>
          {(sale?.products || []).map((product, index) => (
            <Text key={index} style={{ color: colors.text }}>
              • {product.name} (Qty: {product.quantity || 1})
            </Text>
          ))}


          <Text style={[styles.total, { color: colors.primary }]}>
            Total: ₹{(sale?.total || 0).toFixed(2)}
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    marginTop: 30,
  },
  label: {
    fontWeight: 'bold',
    marginTop: 8,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
});

export default SaleDetailsScreen;
