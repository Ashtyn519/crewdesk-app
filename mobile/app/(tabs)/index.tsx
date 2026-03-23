import { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { supabase } from '../../lib/supabase';

const C = { bg: '#04080F', card: '#0A1020', border: '#1A2540', amber: '#F59E0B', text: '#FFFFFF', muted: '#64748B', green: '#10B981', rose: '#EF4444', blue: '#3B82F6', purple: '#A78BFA' };
const { width } = Dimensions.get('window');

const kpis = [
  { label: 'Revenue', value: '£48,200', change: '+23.4%', up: true, color: C.amber, icon: 'cash' },
  { label: 'Projects', value: '12', change: '+3 this month', up: true, color: C.blue, icon: 'folder' },
  { label: 'Crew', value: '28', change: '+5 new', up: true, color: C.purple, icon: 'people' },
  { label: 'Invoices Due', value: '£7,840', change: '3 outstanding', up: false, color: C.rose, icon: 'receipt' },
];

const activity = [
  { icon: 'send', text: 'Invoice #INV-2024 sent to Neon Films', time: '2m ago', color: C.amber },
  { icon: 'checkmark-circle', text: 'Sarah Chen accepted crew invitation', time: '18m ago', color: C.green },
  { icon: 'document-text', text: 'Contract for City Lights signed', time: '1h ago', color: C.blue },
  { icon: 'add-circle', text: 'New project Apex Documentary created', time: '3h ago', color: C.purple },
  { icon: 'cash', text: 'Payment £3,200 received from BFI', time: '5h ago', color: C.green },
];

const quickActions = [
  { label: 'New Project', icon: 'folder-open', color: C.blue, route: '/(tabs)/projects' },
  { label: 'Create Invoice', icon: 'receipt', color: C.amber, route: '/(tabs)/invoices' },
  { label: 'Add Crew', icon: 'person-add', color: C.purple, route: '/(tabs)/crew' },
  { label: 'Message', icon: 'chatbubble', color: C.green, route: '/(tabs)/messages' },
];

const deadlines = [
  { project: 'Neon Nights', task: 'Final cut delivery', due: 'Tomorrow', urgent: true },
  { project: 'City Lights', task: 'Contract signing', due: 'Mar 28', urgent: true },
  { project: 'Apex Documentary', task: 'Rough cut review', due: 'Apr 1', urgent: false },
];

export default function DashboardScreen() {
  const [greeting, setGreeting] = useState('Good morning');
  const [userName, setUserName] = useState('there');

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 12 && h < 18) setGreeting('Good afternoon');
    else if (h >= 18) setGreeting('Good evening');
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) setUserName(data.user.email.split('@')[0]);
    });
  }, []);

  return (
    <SafeAreaView style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>{greeting}, {userName} 👋</Text>
            <Text style={styles.sub}>Here's your workforce overview</Text>
          </View>
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Live</Text>
          </View>
        </View>

        {/* KPI Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.kpiScroll} contentContainerStyle={{ gap: 12, paddingRight: 20 }}>
          {kpis.map((k) => (
            <LinearGradient key={k.label} colors={[k.color + '20', k.color + '05']} style={styles.kpiCard}>
              <View style={[styles.kpiIconBox, { backgroundColor: k.color + '20' }]}>
                <Ionicons name={k.icon as any} size={18} color={k.color} />
              </View>
              <Text style={[styles.kpiValue, { color: k.color }]}>{k.value}</Text>
              <Text style={styles.kpiLabel}>{k.label}</Text>
              <Text style={[styles.kpiChange, { color: k.up ? C.green : C.rose }]}>{k.up ? '↑' : '↓'} {k.change}</Text>
            </LinearGradient>
          ))}
        </ScrollView>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((a) => (
            <TouchableOpacity key={a.label} style={styles.actionCard} onPress={() => router.push(a.route as any)}>
              <View style={[styles.actionIcon, { backgroundColor: a.color + '15' }]}>
                <Ionicons name={a.icon as any} size={22} color={a.color} />
              </View>
              <Text style={styles.actionLabel}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Deadlines */}
        <Text style={styles.sectionTitle}>Upcoming Deadlines</Text>
        <View style={styles.card}>
          {deadlines.map((d, i) => (
            <View key={i} style={[styles.deadlineRow, i < deadlines.length - 1 && styles.deadlineBorder]}>
              <View style={{ flex: 1 }}>
                <Text style={styles.deadlineProject}>{d.project}</Text>
                <Text style={styles.deadlineTask}>{d.task}</Text>
              </View>
              <View style={[styles.dueBadge, { backgroundColor: d.urgent ? C.rose + '20' : C.muted + '20' }]}>
                <Text style={[styles.dueText, { color: d.urgent ? C.rose : C.muted }]}>{d.due}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Activity Feed */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.card}>
          {activity.map((a, i) => (
            <View key={i} style={[styles.activityRow, i < activity.length - 1 && styles.deadlineBorder]}>
              <View style={[styles.activityIcon, { backgroundColor: a.color + '15' }]}>
                <Ionicons name={a.icon as any} size={16} color={a.color} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.activityText}>{a.text}</Text>
                <Text style={styles.activityTime}>{a.time}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 20 },
  greeting: { color: C.text, fontSize: 22, fontWeight: '700' },
  sub: { color: C.muted, fontSize: 13, marginTop: 2 },
  statusBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.green + '15', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: C.green },
  statusText: { color: C.green, fontSize: 12, fontWeight: '600' },
  kpiScroll: { paddingLeft: 20, marginBottom: 8 },
  kpiCard: { width: (width - 60) / 2.2, padding: 16, borderRadius: 16, borderWidth: 1, borderColor: C.border },
  kpiIconBox: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  kpiValue: { fontSize: 22, fontWeight: '800', marginBottom: 2 },
  kpiLabel: { color: C.muted, fontSize: 12, marginBottom: 6 },
  kpiChange: { fontSize: 11, fontWeight: '600' },
  sectionTitle: { color: C.text, fontSize: 15, fontWeight: '700', marginHorizontal: 20, marginTop: 24, marginBottom: 12 },
  actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, paddingHorizontal: 20 },
  actionCard: { width: (width - 60) / 2, backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border, alignItems: 'center', gap: 10 },
  actionIcon: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  actionLabel: { color: C.text, fontSize: 13, fontWeight: '600' },
  card: { backgroundColor: C.card, borderRadius: 16, marginHorizontal: 20, borderWidth: 1, borderColor: C.border, overflow: 'hidden' },
  deadlineRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  deadlineBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  deadlineProject: { color: C.text, fontSize: 13, fontWeight: '600' },
  deadlineTask: { color: C.muted, fontSize: 12, marginTop: 2 },
  dueBadge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  dueText: { fontSize: 11, fontWeight: '600' },
  activityRow: { flexDirection: 'row', alignItems: 'center', padding: 14, gap: 12 },
  activityIcon: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  activityText: { color: C.text, fontSize: 13, fontWeight: '500' },
  activityTime: { color: C.muted, fontSize: 11, marginTop: 2 },
});
