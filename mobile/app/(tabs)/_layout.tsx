import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const C = { bg: '#04080F', card: '#060C18', border: '#1A2540', amber: '#F59E0B', muted: '#475569' };

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

function TabIcon({ name, focused }: { name: IoniconName; focused: boolean }) {
  return <Ionicons name={focused ? name : (name + '-outline') as IoniconName} size={22} color={focused ? C.amber : C.muted} />;
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: C.card,
          borderTopColor: C.border,
          borderTopWidth: 1,
          height: 80,
          paddingBottom: 16,
          paddingTop: 10,
        },
        tabBarActiveTintColor: C.amber,
        tabBarInactiveTintColor: C.muted,
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard', tabBarIcon: ({ focused }) => <TabIcon name="grid" focused={focused} /> }} />
      <Tabs.Screen name="projects" options={{ title: 'Projects', tabBarIcon: ({ focused }) => <TabIcon name="folder" focused={focused} /> }} />
      <Tabs.Screen name="crew" options={{ title: 'Crew', tabBarIcon: ({ focused }) => <TabIcon name="people" focused={focused} /> }} />
      <Tabs.Screen name="invoices" options={{ title: 'Invoices', tabBarIcon: ({ focused }) => <TabIcon name="receipt" focused={focused} /> }} />
      <Tabs.Screen name="messages" options={{ title: 'Messages', tabBarIcon: ({ focused }) => <TabIcon name="chatbubbles" focused={focused} /> }} />
      <Tabs.Screen name="settings" options={{ title: 'More', tabBarIcon: ({ focused }) => <TabIcon name="menu" focused={focused} /> }} />
    </Tabs>
  );
}
