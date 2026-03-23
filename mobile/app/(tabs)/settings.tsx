import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch, Alert, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';

const C = { bg: '#04080F', card: '#0A1020', border: '#1A2540', amber: '#F59E0B', text: '#FFFFFF', muted: '#64748B', green: '#10B981', rose: '#EF4444' };

export default function SettingsScreen() {
  const [userEmail, setUserEmail] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setUserEmail(data.user.email);
    });
  }, []);

  async function signOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: async () => {
        await supabase.auth.signOut();
        router.replace('/(auth)/login');
      }},
    ]);
  }

  const sections = [
    {
      title: 'Account',
      items: [
        { icon: 'person-circle', label: 'Profile', sub: userEmail, action: () => {} },
        { icon: 'shield-checkmark', label: 'Security', sub: 'Password & 2FA', action: () => {} },
        { icon: 'card', label: 'Subscription', sub: 'Pro Plan · Active', action: () => {} },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { icon: 'notifications', label: 'Push Notifications', toggle: true, value: notifications, onChange: setNotifications },
        { icon: 'mail', label: 'Email Alerts', toggle: true, value: emailAlerts, onChange: setEmailAlerts },
        { icon: 'cash', label: 'Currency', sub: 'GBP (£)', action: () => {} },
      ],
    },
    {
      title: 'Integrations',
      items: [
        { icon: 'logo-google', label: 'Google Calendar', sub: 'Not connected', action: () => {} },
        { icon: 'bar-chart', label: 'Xero Accounting', sub: 'Not connected', action: () => {} },
        { icon: 'cloud-upload', label: 'Dropbox', sub: 'Not connected', action: () => {} },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: 'help-circle', label: 'Help Centre', action: () => Linking.openURL('https://crewdeskapp.vercel.app') },
        { icon: 'chatbubble-ellipses', label: 'Contact Support', action: () => {} },
        { icon: 'star', label: 'Rate the App', action: () => {} },
        { icon: 'document-text', label: 'Privacy Policy', action: () => {} },
      ],
    },
  ];

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        <Text style={styles.title}>Settings</Text>

        {/* Profile Card */}
        <LinearGradient colors={[C.amber + '15', C.amber + '05']} style={styles.profileCard}>
          <LinearGradient colors={[C.amber + '40', C.amber + '20']} style={styles.profileAvatar}>
            <Text style={styles.profileAvatarText}>{userEmail.charAt(0).toUpperCase()}</Text>
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>{userEmail.split('@')[0]}</Text>
            <Text style={styles.profileEmail}>{userEmail}</Text>
            <View style={styles.proBadge}><Text style={styles.proText}>Pro Plan</Text></View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={C.muted} />
        </LinearGradient>

        {sections.map(section => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionCard}>
              {section.items.map((item, i) => (
                <TouchableOpacity key={item.label} style={[styles.row, i < section.items.length - 1 && styles.rowBorder]} onPress={(item as any).action} activeOpacity={(item as any).toggle ? 1 : 0.6}>
                  <View style={styles.rowIcon}>
                    <Ionicons name={(item as any).icon} size={18} color={C.amber} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowLabel}>{item.label}</Text>
                    {(item as any).sub && <Text style={styles.rowSub}>{(item as any).sub}</Text>}
                  </View>
                  {(item as any).toggle
                    ? <Switch value={(item as any).value} onValueChange={(item as any).onChange} trackColor={{ false: C.border, true: C.amber + '60' }} thumbColor={(item as any).value ? C.amber : C.muted} />
                    : <Ionicons name="chevron-forward" size={16} color={C.muted} />
                  }
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutBtn} onPress={signOut}>
          <Ionicons name="log-out-outline" size={18} color={C.rose} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={styles.version}>CrewDesk v1.0.0 · Built for business</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  title: { color: C.text, fontSize: 26, fontWeight: '800', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  profileCard: { flexDirection: 'row', alignItems: 'center', gap: 14, marginHorizontal: 20, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: C.amber + '30', marginBottom: 8 },
  profileAvatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  profileAvatarText: { color: C.amber, fontWeight: '800', fontSize: 20 },
  profileName: { color: C.text, fontSize: 16, fontWeight: '700' },
  profileEmail: { color: C.muted, fontSize: 13, marginTop: 1 },
  proBadge: { backgroundColor: C.amber + '20', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 20, alignSelf: 'flex-start', marginTop: 6 },
  proText: { color: C.amber, fontSize: 11, fontWeight: '700' },
  section: { paddingHorizontal: 20, marginTop: 16 },
  sectionTitle: { color: C.muted, fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  sectionCard: { backgroundColor: C.card, borderRadius: 16, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14 },
  rowBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  rowIcon: { width: 34, height: 34, borderRadius: 10, backgroundColor: C.amber + '15', alignItems: 'center', justifyContent: 'center' },
  rowLabel: { color: C.text, fontSize: 14, fontWeight: '500' },
  rowSub: { color: C.muted, fontSize: 12, marginTop: 1 },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, margin: 20, padding: 14, backgroundColor: C.rose + '10', borderRadius: 14, borderWidth: 1, borderColor: C.rose + '30' },
  signOutText: { color: C.rose, fontWeight: '700', fontSize: 15 },
  version: { color: C.muted, fontSize: 12, textAlign: 'center', paddingBottom: 8 },
});
