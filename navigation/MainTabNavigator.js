import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DashboardScreen from '../screens/Main/DashboardScreen';
import ChatbotScreen from '../screens/Main/ChatbotScreen';

import ProductsScreen from '../screens/Main/ProductsScreen';
import ProfileScreen from '../screens/Main/ProfileScreen';

import SalesStackNavigator from './SalesStackNavigator';


const Tab = createBottomTabNavigator();
 
// Default export
const MainTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({ 
      tabBarIcon: ({ color, size }) => {
        const icons = {
          Dashboard: 'dashboard',
          Products: 'inventory',
          Profile: 'person',
          Sales: 'shopping-cart',
          Chatbot:'chat',

          
        };
        return <Icon name={icons[route.name]} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#2E7D32',
      tabBarInactiveTintColor: '#757575',
      tabBarStyle: {
        backgroundColor: '#FFFDE7',
        borderTopWidth: 0,
        elevation: 8,
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Products" component={ProductsScreen} />
    <Tab.Screen name="Sales" component={SalesStackNavigator} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
    <Tab.Screen name="Chatbot" component={ChatbotScreen} />


  </Tab.Navigator>
);

export default MainTabNavigator;
