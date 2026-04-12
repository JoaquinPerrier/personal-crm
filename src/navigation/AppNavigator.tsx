import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

import ContactsScreen from '../screens/ContactsScreen';
import ContactDetailScreen from '../screens/ContactDetailScreen';
import RemindersScreen from '../screens/RemindersScreen';
import NotesScreen from '../screens/NotesScreen';

const ContactsStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function ContactsStackNavigator() {
  return (
    <ContactsStack.Navigator screenOptions={{ headerShown: false }}>
      <ContactsStack.Screen name="ContactsList" component={ContactsScreen} />
      <ContactsStack.Screen name="ContactDetail" component={ContactDetailScreen} />
    </ContactsStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'people';
          if (route.name === 'Contactos') iconName = focused ? 'people' : 'people-outline';
          else if (route.name === 'Notas') iconName = focused ? 'document-text' : 'document-text-outline';
          else if (route.name === 'Recordatorios') iconName = focused ? 'alarm' : 'alarm-outline';
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
        },
      })}
    >
      <Tab.Screen name="Contactos" component={ContactsStackNavigator} />
      <Tab.Screen name="Notas" component={NotesScreen} />
      <Tab.Screen name="Recordatorios" component={RemindersScreen} />
    </Tab.Navigator>
  );
}
