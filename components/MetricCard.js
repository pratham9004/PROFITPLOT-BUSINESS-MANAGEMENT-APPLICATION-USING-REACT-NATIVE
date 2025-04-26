import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';

const MetricCard = ({ title, value, icon }) => {
  const { colors } = useTheme();

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        {icon && React.cloneElement(icon, { 
          size: 24, 
          color: colors.primary 
        })}
        <Text variant="titleMedium" style={[styles.title, { color: colors.text }]}>
          {title}
        </Text>
        <Text variant="headlineSmall" style={[styles.value, { color: colors.primary }]}>
          {value}
        </Text>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 8,
    minWidth: 150,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  title: {
    marginBottom: 4,
    textAlign: 'center',
  },
  value: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default MetricCard;
