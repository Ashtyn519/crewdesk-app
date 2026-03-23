import { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const C = { bg: '#04080F', card: '#0A1020', border: '#1A2540', amber: '#F59E0B', text: '#FFFFFF', muted: '#64748B', green: '#10B981', rose: '#EF4444', blue: '#3B82F6', purple: '#A78BFA' };

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  paid: { bg: C.green + '20', text: C.green },
  sent: { bg: C.blue + '20', text: C.blue },
  draft: { bg: C.muted + '20', text: C.muted },
  overdue: { bg: C.rose + '20', text: C.rose },
};

const initInvoices = [
  { id: 1, number: 'INV-2024', client: 'Neon Films', amount: '£12,400', vat: '£2,480', total: '£14,880', status: 'paid', date: 'Mar 15', project: 'Neon Nights' },
  { id: 2, number: 'INV-2025', client: 'BBC Studios', amount: '£8,200', vat: '£1,640', total: '£9,840', status: 'sent', date: 'Mar 20', project: 'City Lights' },
  { id: 3, number: 'INV-2026', client: 'BFI', amount: '£5,600', vat: '£1,120', total: '£6,720', status: 'draft', date: 'Mar 22', project: 'Apex Documentary' },
  { id: 4, number: 'INV-2023', client: 'ITV', amount: '£9,800', vat: '£1,960', total: '£11,760', status: 'overdue', date: 'Feb 28', project: 'Midnight Run' },
];

type Invoice = typeof initInvoices[0];

export default function InvoicesScreen() {
  const [invoices, setInvoices] = useState(initInvoices);
  const [filter, setFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ client: '', amount: '', project: '' });

  const filtered = filter === 'all' ? invoices : invoices.filter(i => i.status === filter);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + parseFloat(i.amount.replace(/[£,]/g, '')), 0);
  const totalPending = invoices.filter(i => ['sent', 'draft'].includes(i.status)).reduce((s, i) => s + parseFloat(i.amount.replace(/[£,]/g, '')), 0);

  function markPaid(id: number) {
    setInvoices(inv => inv.map(i => i.id === id ? { ...i, status: 'paid' } : i));
  }

  function save() {
    if (!form.client || !form.amount) { Alert.alert('Error', 'Client and amount required.'); return; }
    const amt = parseFloat(form.amount.replace(/[£,]/g, ''));
    const vat = amt * 0.2;
    setInvoices(inv => [...inv, {
      id: Date.now(),
      number: 'INV-' + (2030 + inv.length),
      client: form.client,
      amount: '£' + amt.toLocaleString(),
      vat: '£' + vat.toLocaleString(),
      total: '£' + (amt + vat).toLocaleString(),
      status: 'draft',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }),
      project: form.project || '-',
    }]);
    setShowModal(false);
    setForm({ client: '', amount: '', project: '' });
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Invoices</Text>
        <TouchableOpacity style={styles.addBtn} onPress={() => setShowModal(true)}>
          <Ionicons name="add" size={20} color="#04080F" />
          <Text style={styles.addText}>New</Text>
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={styles.summaryRow}>
        <LinearGradient colors={[C.green + '20', C.green + '05']} style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Paid</Text>
          <Text style={[styles.summaryValue, { color: C.green }]}>£{totalPaid.toLocaleString()}</Text>
        </LinearGradient>
        <LinearGradient colors={[C.amber + '20', C.amber + '05']} style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Pending</Text>
          <Text style={[styles.summaryValue, { color: C.amber }]}>£{totalPending.toLocaleString()}</Text>
        </LinearGradient>
      </View>

      {/* Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={{ gap: 8, paddingRight: 20 }}>
        {['all', 'paid', 'sent', 'draft', 'overdue'].map(f => (
          <TouchableOpacity key={f} style={[styles.filterBtn, filter === f && styles.filterActive]} onPress={() => setFilter(f)}>
            <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f.charAt(0).toUpperCase() + f.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 12, paddingBottom: 32 }}>
        {filtered.map(inv => {
          const sc = STATUS_COLORS[inv.status];
          return (
            <View key={inv.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.invNum}>{inv.number}</Text>
                  <Text style={styles.invClient}>{inv.client}</Text>
                  <Text style={styles.invProject}>{inv.project}</Text>
                </View>
                <View style={{ alignItems: 'flex-end', gap: 6 }}>
                  <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                    <Text style={[styles.statusText, { color: sc.text }]}>{inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}</Text>
                  </View>
                  <Text style={styles.invTotal}>{inv.total}</Text>
                  <Text style={styles.invDate}>{inv.date}</Text>
                </View>
              </View>
              <View style={styles.amtRow}>
                <Text style={styles.amtLabel}>Subtotal <Text style={styles.amtVal}>{inv.amount}</Text></Text>
                <Text style={styles.amtLabel}>VAT 20% <Text style={styles.amtVal}>{inv.vat}</Text></Text>
                {inv.status !== 'paid' && (
                  <TouchableOpacity style={styles.paidBtn} onPress={() => markPaid(inv.id)}>
                    <Text style={styles.paidText}>Mark Paid</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Invoice</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}><Ionicons name="close" size={22} color={C.muted} /></TouchableOpacity>
            </View>
            {[{ label: 'Client', key: 'client', placeholder: 'e.g. Netflix UK' }, { label: 'Amount (£)', key: 'amount', placeholder: 'e.g. 5000' }, { label: 'Project', key: 'project', placeholder: 'e.g. Neon Nights' }].map(f => (
              <View key={f.key}>
                <Text style={styles.fieldLabel}>{f.label}</Text>
                <TextInput style={styles.field} placeholder={f.placeholder} placeholderTextColor={C.muted} value={(form as any)[f.key]} onChangeText={v => setForm(ff => ({ ...ff, [f.key]: v }))} keyboardType={f.key === 'amount' ? 'numeric' : 'default'} />
              </View>
            ))}
            <TouchableOpacity style={styles.saveBtn} onPress={save}>
              <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.saveGrad}>
                <Text style={styles.saveText}>Create Invoice</Text>
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
  summaryRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginBottom: 12 },
  summaryCard: { flex: 1, padding: 14, borderRadius: 14, borderWidth: 1, borderColor: C.border },
  summaryLabel: { color: C.muted, fontSize: 12, marginBottom: 4 },
  summaryValue: { fontSize: 20, fontWeight: '800' },
  filterScroll: { paddingLeft: 20, marginBottom: 4 },
  filterBtn: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: C.card, borderWidth: 1, borderColor: C.border },
  filterActive: { backgroundColor: C.amber + '20', borderColor: C.amber },
  filterText: { color: C.muted, fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: C.amber },
  card: { backgroundColor: C.card, borderRadius: 16, padding: 16, borderWidth: 1, borderColor: C.border },
  cardTop: { flexDirection: 'row', marginBottom: 12 },
  invNum: { color: C.text, fontSize: 14, fontWeight: '700' },
  invClient: { color: C.muted, fontSize: 13, marginTop: 2 },
  invProject: { color: C.muted, fontSize: 12, marginTop: 1 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  statusText: { fontSize: 11, fontWeight: '700' },
  invTotal: { color: C.text, fontSize: 16, fontWeight: '800' },
  invDate: { color: C.muted, fontSize: 12 },
  amtRow: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  amtLabel: { color: C.muted, fontSize: 12 },
  amtVal: { color: C.text, fontWeight: '600' },
  paidBtn: { backgroundColor: C.green + '20', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, marginLeft: 'auto' },
  paidText: { color: C.green, fontSize: 12, fontWeight: '700' },
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
