import { useState, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const C = { bg: '#04080F', card: '#0A1020', border: '#1A2540', amber: '#F59E0B', text: '#FFFFFF', muted: '#64748B', green: '#10B981', blue: '#3B82F6' };

const initThreads = [
  { id: 1, name: 'Sarah Chen', role: 'UI Designer', lastMsg: 'Design assets ready for Monday handoff', time: '2m', unread: 3, online: true },
  { id: 2, name: 'James O'Brien', role: 'Developer', lastMsg: 'Dev build deployed to staging', time: '18m', unread: 0, online: true },
  { id: 3, name: 'Apex Solutions', role: 'Client', lastMsg: 'Invoice received, processing payment', time: '1h', unread: 1, online: false },
  { id: 4, name: 'Maya Patel', role: 'Strategist', lastMsg: 'Brand guidelines approved, looks great!', time: '3h', unread: 0, online: false },
  { id: 5, name: 'Spark Retail', role: 'Client', lastMsg: 'Can we push the deadline by 2 days?', time: 'Yesterday', unread: 2, online: false },
];

const initMessages: Record<number, { id: number; text: string; mine: boolean; time: string }[]> = {
  1: [
    { id: 1, text: 'Hi! Confirming the design assets for Monday handoff', mine: false, time: '9:00 AM' },
    { id: 2, text: 'Great, Figma file + specs confirmed', mine: true, time: '9:05 AM' },
    { id: 3, text: 'Design assets delivered, all looking good', mine: false, time: '9:10 AM' },
  ],
  2: [
    { id: 1, text: 'Staging build is live, all tests passing', mine: false, time: '8:30 AM' },
    { id: 2, text: 'Great work. Let\'s review at standups tomorrow', mine: true, time: '8:35 AM' },
    { id: 3, text: 'Sprint ready, ready to deploy', mine: false, time: '8:40 AM' },
  ],
};

export default function MessagesScreen() {
  const [threads, setThreads] = useState(initThreads);
  const [messages, setMessages] = useState(initMessages);
  const [activeThread, setActiveThread] = useState<number | null>(null);
  const [input, setInput] = useState('');
  const scrollRef = useRef<ScrollView>(null);

  function openThread(id: number) {
    setActiveThread(id);
    setThreads(ts => ts.map(t => t.id === id ? { ...t, unread: 0 } : t));
  }

  function send() {
    if (!input.trim() || !activeThread) return;
    const msg = { id: Date.now(), text: input.trim(), mine: true, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(m => ({ ...m, [activeThread]: [...(m[activeThread] || []), msg] }));
    setInput('');
    setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
  }

  const activeThreadData = threads.find(t => t.id === activeThread);
  const threadMessages = activeThread ? (messages[activeThread] || []) : [];

  if (activeThread && activeThreadData) {
    return (
      <SafeAreaView style={styles.root}>
        <View style={styles.chatHeader}>
          <TouchableOpacity onPress={() => setActiveThread(null)} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={C.text} />
          </TouchableOpacity>
          <LinearGradient colors={[C.amber + '30', C.amber + '10']} style={styles.chatAvatar}>
            <Text style={styles.avatarText}>{activeThreadData.name.split(' ').map(n => n[0]).join('')}</Text>
          </LinearGradient>
          <View style={{ flex: 1 }}>
            <Text style={styles.chatName}>{activeThreadData.name}</Text>
            <Text style={styles.chatRole}>{activeThreadData.role} {activeThreadData.online ? '· Online' : ''}</Text>
          </View>
          {activeThreadData.online && <View style={styles.onlineDot} />}
        </View>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={0}>
          <ScrollView ref={scrollRef} style={styles.chatScroll} contentContainerStyle={{ padding: 16, gap: 8 }}>
            {threadMessages.map(msg => (
              <View key={msg.id} style={[styles.bubble, msg.mine ? styles.bubbleMine : styles.bubbleTheirs]}>
                {msg.mine
                  ? <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.bubbleInner}><Text style={styles.bubbleMineText}>{msg.text}</Text><Text style={[styles.bubbleTime, { color: 'rgba(0,0,0,0.4)' }]}>{msg.time}</Text></LinearGradient>
                  : <View style={[styles.bubbleInner, { backgroundColor: C.card }]}><Text style={styles.bubbleTheirText}>{msg.text}</Text><Text style={styles.bubbleTime}>{msg.time}</Text></View>
                }
              </View>
            ))}
          </ScrollView>
          <View style={styles.inputRow}>
            <TextInput style={styles.msgInput} placeholder="Type a message..." placeholderTextColor={C.muted} value={input} onChangeText={setInput} multiline returnKeyType="send" onSubmitEditing={send} />
            <TouchableOpacity style={[styles.sendBtn, { opacity: input.trim() ? 1 : 0.5 }]} onPress={send} disabled={!input.trim()}>
              <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.sendGrad}>
                <Ionicons name="send" size={16} color="#04080F" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadCount}>{threads.reduce((s, t) => s + t.unread, 0)}</Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        {threads.map((t, i) => (
          <TouchableOpacity key={t.id} style={[styles.threadRow, i < threads.length - 1 && styles.threadBorder]} onPress={() => openThread(t.id)}>
            <View style={{ position: 'relative' }}>
              <LinearGradient colors={[C.amber + '30', C.amber + '10']} style={styles.threadAvatar}>
                <Text style={styles.avatarText}>{t.name.split(' ').map(n => n[0]).join('')}</Text>
              </LinearGradient>
              {t.online && <View style={styles.onlineDotSmall} />}
            </View>
            <View style={{ flex: 1, gap: 2 }}>
              <Text style={styles.threadName}>{t.name}</Text>
              <Text style={styles.threadMsg} numberOfLines={1}>{t.lastMsg}</Text>
            </View>
            <View style={{ alignItems: 'flex-end', gap: 4 }}>
              <Text style={styles.threadTime}>{t.time}</Text>
              {t.unread > 0 && <View style={styles.badge}><Text style={styles.badgeText}>{t.unread}</Text></View>}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { color: C.text, fontSize: 26, fontWeight: '800' },
  unreadBadge: { backgroundColor: C.amber, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 20 },
  unreadCount: { color: '#04080F', fontWeight: '800', fontSize: 12 },
  threadRow: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingHorizontal: 20, paddingVertical: 14 },
  threadBorder: { borderBottomWidth: 1, borderBottomColor: C.border },
  threadAvatar: { width: 46, height: 46, borderRadius: 23, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: C.amber, fontWeight: '800', fontSize: 14 },
  onlineDotSmall: { position: 'absolute', bottom: 1, right: 1, width: 10, height: 10, borderRadius: 5, backgroundColor: C.green, borderWidth: 2, borderColor: C.bg },
  threadName: { color: C.text, fontSize: 15, fontWeight: '600' },
  threadMsg: { color: C.muted, fontSize: 13 },
  threadTime: { color: C.muted, fontSize: 12 },
  badge: { backgroundColor: C.amber, width: 20, height: 20, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  badgeText: { color: '#04080F', fontSize: 11, fontWeight: '800' },
  chatHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderBottomWidth: 1, borderBottomColor: C.border },
  backBtn: { padding: 4 },
  chatAvatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  chatName: { color: C.text, fontSize: 16, fontWeight: '700' },
  chatRole: { color: C.muted, fontSize: 12 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.green },
  chatScroll: { flex: 1 },
  bubble: { maxWidth: '80%' },
  bubbleMine: { alignSelf: 'flex-end' },
  bubbleTheirs: { alignSelf: 'flex-start' },
  bubbleInner: { borderRadius: 18, paddingHorizontal: 14, paddingVertical: 10 },
  bubbleMineText: { color: '#04080F', fontSize: 14, fontWeight: '500' },
  bubbleTheirText: { color: C.text, fontSize: 14 },
  bubbleTime: { color: C.muted, fontSize: 10, marginTop: 4, textAlign: 'right' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, padding: 12, borderTopWidth: 1, borderTopColor: C.border },
  msgInput: { flex: 1, backgroundColor: C.card, borderWidth: 1, borderColor: C.border, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 12, color: C.text, fontSize: 14, maxHeight: 100 },
  sendBtn: { borderRadius: 22, overflow: 'hidden' },
  sendGrad: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
});
