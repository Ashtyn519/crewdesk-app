import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const C = { bg: '#04080F', card: '#0A1020', border: '#1A2540', amber: '#F59E0B', text: '#FFFFFF', muted: '#64748B', green: '#10B981', rose: '#EF4444', blue: '#3B82F6', purple: '#A78BFA' };

const PRIORITIES = { high: { label: 'High', color: C.rose }, medium: { label: 'Medium', color: C.amber }, low: { label: 'Low', color: C.green } };

const initProjects = [
  { id: 1, name: 'Neon Nights', client: 'Netflix UK', budget: '£48,000', spent: '£31,200', progress: 65, status: 'active', priority: 'high', crew: 8, deadline: 'Apr 15' },
  { id: 2, name: 'City Lights', client: 'BBC Studios', budget: '£32,000', spent: '£28,800', progress: 90, status: 'active', priority: 'high', crew: 5, deadline: 'Mar 28' },
  { id: 3, name: 'Apex Documentary', client: 'BFI', budget: '£22,000', spent: '£8,800', progress: 40, status: 'active', priority: 'medium', crew: 4, deadline: 'May 10' },
  { id: 4, name: 'Midnight Run', client: 'ITV', budget: '£15,000', spent: '£12,000', progress: 80, status: 'active', priority: 'low', crew: 3, deadline: 'Apr 5' },
  { id: 5, name: 'Rise & Fall', client: 'Channel 4', budget: '£28,000', spent: '£28,000', progress: 100, status: 'complete', priority: 'medium', crew: 6, deadline: 'Delivered' },
];

type Project = typeof initProjects[0];

export default function ProjectsScreen() {
  const [projects, setProjects] = useState(initProjects);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState({ name: '', client: '', budget: '' });

  const filtered = projects.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  function openNew() { setEditing(null); setForm({ name: '', client: '', budget: '' }); setShowModal(true); }
  function openEdit(p: Project) { setEditing(p); setForm({ name: p.name, client: p.client, budget: p.budget }); setShowModal(true); }

  function save() {
    if (!form.name || !form.client) { Alert.alert('Error', 'Name and client are required.'); return; }
    if (editing) {
      setProjects(ps => ps.map(p => p.id === editing.id ? { ...p, ...form } : p));
    } else {
      setProjects(ps => [...ps, { id: Date.now(), ...form, spent: '£0', progress: 0, status: 'active', priority: 'medium', crew: 0, deadline: 'TBD' }]);
    }
    setShowModal(false);
  }

  function deleteProject(id: number) {
    Alert.alert('Delete Project', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => setProjects(ps => ps.filter(p => p.id !== id)) },
    ]);
  }

  return (
    <SafeAreaView style={styles.root}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Projects</Text>
        <TouchableOpacity style={styles.addBtn} onPress={openNew}>
          <Ionicons name="add" size={20} color="#04080F" />
          <Text style={styles.addText}>New</Text>
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchRow}>
        <Ionicons name="search" size={16} color={C.muted} style={{ marginRight: 8 }} />
        <TextInput style={styles.searchInput} placeholder="Search projects..." placeholderTextColor={C.muted} value={search} onChangeText={setSearch} />
      </View>

      {/* Filter tabs */}
      <View style={styles.filterRow}>
        {['all', 'active', 'complete'].map(f => (
          <TouchableOpacity key={f} style={[styles.filterBtn, filter === f && styles.filterActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f.charAt(0).toUpperCase() + f.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 32 }}>
        {filtered.map(p => {
          const pri = PRIORITIES[p.priority as keyof typeof PRIORITIES];
          return (
            <TouchableOpacity key={p.id} style={styles.card} onPress={() => openEdit(p)}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.projName}>{p.name}</Text>
                  <Text style={styles.projClient}>{p.client}</Text>
                </View>
                <View style={[styles.priBadge, { backgroundColor: pri.color + '20' }]}>
                  <Text style={[styles.priText, { color: pri.color }]}>{pri.label}</Text>
                </View>
              </View>
              <View style={styles.progressRow}>
                <View style={styles.progressBg}>
                  <View style={[styles.progressFill, { width: p.progress + '%', backgroundColor: p.progress === 100 ? C.green : C.amber }]} />
                </View>
                <Text style={styles.progressPct}>{p.progress}%</Text>
              </View>
              <View style={styles.cardMeta}>
                <View style={styles.metaItem}><Ionicons name="cash-outline" size={13} color={C.muted} /><Text style={styles.metaText}>{p.budget}</Text></View>
                <View style={styles.metaItem}><Ionicons name="people-outline" size={13} color={C.muted} /><Text style={styles.metaText}>{p.crew} crew</Text></View>
                <View style={styles.metaItem}><Ionicons name="calendar-outline" size={13} color={C.muted} /><Text style={styles.metaText}>{p.deadline}</Text></View>
                <TouchableOpacity onPress={() => deleteProject(p.id)} style={styles.deleteBtn}>
                  <Ionicons name="trash-outline" size={14} color={C.rose} />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Modal */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editing ? 'Edit Project' : 'New Project'}</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}><Ionicons name="close" size={22} color={C.muted} /></TouchableOpacity>
            </View>
            <Text style={styles.fieldLabel}>Project Name</Text>
            <TextInput style={styles.field} placeholder="e.g. Neon Nights" placeholderTextColor={C.muted} value={form.name} onChangeText={v => setForm(f => ({ ...f, name: v }))} />
            <Text style={styles.fieldLabel}>Client</Text>
            <TextInput style={styles.field} placeholder="e.g. Netflix UK" placeholderTextColor={C.muted} value={form.client} onChangeText={v => setForm(f => ({ ...f, client: v }))} />
            <Text style={styles.fieldLabel}>Budget</Text>
            <TextInput style={styles.field} placeholder="e.g. £25,000" placeholderTextColor={C.muted} value={form.budget} onChangeText={v => setForm(f => ({ ...f, budget: v }))} />
            <TouchableOpacity style={styles.saveBtn} onPress={save}>
              <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.saveGrad}>
                <Text style={styles.saveText}>{editing ? 'Save Changes' : 'Create Project'}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { color: C.text, fontSize: 26, fontWeight: '800' },
  addBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: C.amber, paddingHorizontal: 14, paddingVertical: 9, borderRadius: 12 },
  addText: { color: '#04080F', fontWeight: '700', fontSize: 14 },
  searchRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: C.card, borderRadius: 12, marginHorizontal: 20, marginBottom: 12, paddingHorizontal: 14, paddingVertical: 12, borderWidth: 1, borderColor: C.border },
  searchInput: { flex: 1, color: C.text, fontSize: 14 },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 20, marginBottom: 4 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  filterActive: { backgroundColor: C.amber + '20', borderColor: C.amber },
  filterText: { color: C.muted, fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: C.amber },
  card: { backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  projName: { color: C.text, fontSize: 15, fontWeight: '700' },
  projClient: { color: C.muted, fontSize: 13, marginTop: 2 },
  priBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  priText: { fontSize: 11, fontWeight: '700' },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 },
  progressBg: { flex: 1, height: 5, backgroundColor: C.border, borderRadius: 4, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 4 },
  progressPct: { color: C.muted, fontSize: 12, fontWeight: '600', width: 34, textAlign: 'right' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { color: C.muted, fontSize: 12 },
  deleteBtn: { marginLeft: 'auto' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#0A1020', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalTitle: { color: C.text, fontSize: 18, fontWeight: '700' },
  fieldLabel: { color: '#94A3B8', fontSize: 12, fontWeight: '600', marginBottom: 8 },
  field: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: C.text, fontSize: 14, marginBottom: 16 },
  saveBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 8 },
  saveGrad: { alignItems: 'center', paddingVertical: 16 },
  saveText: { color: '#04080F', fontWeight: '700', fontSize: 15 },
});
