import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SalesScreen from '../screens/Main/SalesScreen';
import AddSaleScreen from '../screens/Main/AddSaleScreen';
import EditSaleScreen from '../screens/Main/EditSaleScreen';
import SaleDetailsScreen from '../screens/Main/SaleDetailsScreen';


const Stack = createNativeStackNavigator();

const SalesStackNavigator = () => {
  console.log('SalesStackNavigator is rendered'); // Log to confirm rendering
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SalesMain" component={SalesScreen} />
      <Stack.Screen name="AddSale" component={AddSaleScreen} />
      <Stack.Screen name="EditSale" component={EditSaleScreen} />
      <Stack.Screen name="SaleDetails" component={SaleDetailsScreen} />

    </Stack.Navigator>
  );
};

export default SalesStackNavigator;
