import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const C = { bg: '#04080F', card: '#0A1020', border: '#1A2540', amber: '#F59E0B', text: '#FFFFFF', muted: '#64748B', green: '#10B981', rose: '#EF4444', blue: '#3B82F6', purple: '#A78BFA' };

const DEPTS = ['All', 'Design', 'Development', 'Marketing', 'Strategy', 'Finance', 'Operations'];

const initFreelancers = [
  { id: 1, name: 'Sarah Chen', role: 'Senior UI Designer', dept: 'Design', rate: '£650/day', rating: 5, available: true, skills: ['Figma', 'Design Systems', 'Prototyping'] },
  { id: 2, name: 'James O\u2019Brien', role: 'Full-Stack Developer', dept: 'Development', rate: '£550/day', rating: 5, available: true, skills: ['React', 'Node.js', 'TypeScript'] },
  { id: 3, name: 'Maya Patel', role: 'Brand Strategist', dept: 'Marketing', rate: '£500/day', rating: 4, available: false, skills: ['Brand Identity', 'Positioning', 'Content Strategy'] },
  { id: 4, name: 'Tom Williams', role: 'Product Manager', dept: 'Strategy', rate: '£700/day', rating: 5, available: true, skills: ['Roadmapping', 'Agile', 'Stakeholder Mgmt'] },
  { id: 5, name: 'Emma Clarke', role: 'Financial Consultant', dept: 'Finance', rate: '£650/day', rating: 4, available: false, skills: ['Forecasting', 'Reporting', 'Excel'] },
  { id: 6, name: 'Alex Kim', role: 'Data Analyst', dept: 'Operations', rate: '£500/day', rating: 5, available: true, skills: ['Python', 'Tableau', 'SQL'] },
];

type Freelancer = typeof initFreelancers[0];

export default function FreelancersScreen() {
  const [freelancers, setFreelancers] = useState(initFreelancers);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', role: '', dept: 'Design', rate: '' });
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filtered = freelancers.filter(c => {
    const matchS = c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase());
    const matchD = dept === 'All' || c.dept === dept;
    return matchS && matchD;
  });

  function save() {
    if (!form.name || !form.role) { Alert.alert('Error', 'Name and role required.'); return; }
    setFreelancers(c => [...c, { id: Date.now(), ...form, rating: 4, available: true, skills: [] }]);
    setShowModal(false);
    setForm({ name: '', role: '', dept: 'Design', rate: '' });
  }

  function toggleAvail(id: number) {
    setFreelancers(c => c.map(m => m.id === id ? { ...m, available: !m.available } : m));
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Freelancers</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
          <Ionicons name="add" size={20} color="#04080F" />
          <Text style={styles.addText}>Add</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.searchRow}>
        <Ionicons name="search" size={16} color={C.muted} style={{ marginRight: 8 }} />
        <TextInput style={styles.searchInput} placeholder="Search freelancers..." placeholderTextColor={C.muted} value={search} onChangeText={setSearch} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.deptScroll} contentContainerStyle={{ gap: 8, paddingRight: 20 }}>
        {DEPTS.map(d => (
          <TouchableOpacity key={d} style={[styles.deptBtn, dept === d && styles.deptActive]} onPress={() => setDept(d)}>
            <Text style={[styles.deptText, dept === d && styles.deptTextActive]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 32 }}>
        {filtered.map(m => (
          <TouchableOpacity key={m.id} style={styles.card} onPress={() => setExpandedId(expandedId === m.id ? null : m.id)}>
            <View style={styles.cardTop}>
              <LinearGradient colors={[C.amber + '30', C.amber + '10']} style={styles.avatar}>
                <Text style={styles.avatarText}>{m.name.split(' ').map(n => n[0]).join('')}</Text>
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={styles.crewName}>{m.name}</Text>
                <Text style={styles.crewRole}>{m.role} · {m.dept}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 6 }}>
                <TouchableOpacity style={[styles.availBadge, { backgroundColor: m.available ? C.green + '20' : C.rose + '20' }]} onPress={() => toggleAvail(m.id)}>
                  <Text style={[styles.availText, { color: m.available ? C.green : C.rose }]}>{m.available ? 'Available' : 'Engaged'}</Text>
                </TouchableOpacity>
                <Text style={styles.rateText}>{m.rate}</Text>
              </View>
            </View>
            <View style={styles.stars}>
              {Array.from({ length: 5 }).map((_, i) => (
                <Ionicons key={i} name={i < m.rating ? 'star' : 'star-outline'} size={13} color={C.amber} />
              ))}
            </View>
            {expandedId === m.id && m.skills.length > 0 && (
              <View style={styles.skills}>
                {m.skills.map(s => (
                  <View key={s} style={styles.skillBadge}><Text style={styles.skillText}>{s}</Text></View>
                ))}
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Freelancer</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}><Ionicons name="close" size={22} color={C.muted} /></TouchableOpacity>
            </View>
            {[{ label: 'Full Name', key: 'name', placeholder: 'e.g. Sarah Chen' }, { label: 'Role', key: 'role', placeholder: 'e.g. Senior UI Designer' }, { label: 'Day Rate', key: 'rate', placeholder: 'e.g. £650/day' }].map(f => (
              <View key={f.key}>
                <Text style={styles.fieldLabel}>{f.label}</Text>
                <TextInput style={styles.field} placeholder={f.placeholder} placeholderTextColor={C.muted} value={(form as any)[f.key]} onChangeText={v => setForm(ff => ({ ...ff, [f.key]: v }))} />
              </View>
            ))}
            <TouchableOpacity style={styles.saveBtn} onPress={save}>
              <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.saveGrad}>
                <Text style={styles.saveText}>Add Freelancer</Text>
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
  deptScroll: { paddingLeft: 20, marginBottom: 4 },
  deptBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  deptActive: { backgroundColor: C.amber + '20', borderColor: C.amber },
  deptText: { color: C.muted, fontSize: 13, fontWeight: '600' },
  deptTextActive: { color: C.amber },
  card: { backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 8 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: C.amber, fontWeight: '800', fontSize: 14 },
  crewName: { color: C.text, fontSize: 15, fontWeight: '700' },
  crewRole: { color: C.muted, fontSize: 12, marginTop: 2 },
  availBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  availText: { fontSize: 11, fontWeight: '700' },
  rateText: { color: C.muted, fontSize: 12 },
  stars: { flexDirection: 'row', gap: 2 },
  skills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  skillBadge: { backgroundColor: C.border, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  skillText: { color: C.muted, fontSize: 11 },
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
