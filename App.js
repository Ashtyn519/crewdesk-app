import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  SafeAreaView, StatusBar, Switch, Alert, FlatList
} from 'react-native';

// ─────────────────────────────────────────────
// DESIGN SYSTEM — DEPT® × Newsprint × TurboTax
// Editorial bold, clean white, warm accents
// ─────────────────────────────────────────────
const C = {
  // Backgrounds
  bg:        '#FAFAF8',
  bgWarm:    '#F5F3EF',
  bgInk:     '#0E0E0E',
  surface:   '#FFFFFF',
  surfaceAlt:'#F0EEE9',

  // Ink & Type
  ink:       '#0E0E0E',
  inkSoft:   '#2A2A2A',
  inkMid:    '#555550',
  inkLight:  '#8A8A85',
  inkGhost:  '#C4C4BC',

  // Borders
  line:      '#E4E2DC',
  lineSoft:  '#EDEBE6',

  // Accents
  punch:     '#FF4D00',   // DEPT® orange
  punchSoft: '#FFF0EB',
  electric:  '#0057FF',   // electric blue
  electricSoft:'#EBF0FF',
  lime:      '#C8F000',   // DEPT® lime
  limeSoft:  '#F5FFD6',
  sage:      '#2D6A4F',
  sageSoft:  '#E8F5EE',
  amber:     '#FF8C00',
  amberSoft: '#FFF4E0',
  rose:      '#E8003D',
  roseSoft:  '#FFE8EE',

  // Status
  green:     '#00875A',
  greenSoft: '#E3FBF2',
  red:       '#E8003D',
  redSoft:   '#FFE8EE',
  yellow:    '#FF8C00',
  yellowSoft:'#FFF4E0',
  blue:      '#0057FF',
  blueSoft:  '#EBF0FF',
  purple:    '#6B00FF',
  purpleSoft:'#F0E8FF',
};

// ─────────────────────────────────────────────
// STORE — Centralised data & state management
// ─────────────────────────────────────────────
const useStore = () => {
  const [projects, setProjects] = useState([
    { id:1, title:'Nike Summer Campaign', client:'Nike EMEA', status:'Active', color:'#FF4D00', crew:8, due:'Mar 15', budget:24000, spent:16800, progress:0.70, lead:'Alex Morgan', desc:'Full campaign shoot for Nike EMEA summer collection. 4-day shoot in Barcelona.' },
    { id:2, title:'BBC Documentary Series', client:'BBC Studios', status:'Pending', color:'#0057FF', crew:12, due:'Apr 2', budget:85000, spent:12000, progress:0.14, lead:'Jordan Kim', desc:'6-part documentary series on ocean conservation.' },
    { id:3, title:'Adidas Product Shoot', client:'Adidas UK', status:'Active', color:'#00875A', crew:5, due:'Mar 22', budget:18000, spent:9000, progress:0.50, lead:'Sam Rivera', desc:'Hero product shots for Adidas SS26 catalogue.' },
    { id:4, title:'Netflix Series BTS', client:'Netflix', status:'Active', color:'#E8003D', crew:15, due:'May 10', budget:120000, spent:45000, progress:0.38, lead:'Morgan Patel', desc:'Behind-the-scenes content for Netflix original series.' },
    { id:5, title:'Apple Launch Event', client:'Apple Inc', status:'At Risk', color:'#6B00FF', crew:20, due:'Mar 8', budget:200000, spent:185000, progress:0.93, lead:'Quinn Davis', desc:'Global product launch event coverage.' },
  ]);

  const [crew, setCrew] = useState([
    { id:1, name:'Alex Morgan', role:'Director', dept:'Production', status:'Available', rate:850, rating:4.9, projects:3, phone:'+44 7700 900001', email:'alex@crewdesk.io', bio:'Award-winning director with 12 years of commercial experience.', color:'#FF4D00' },
    { id:2, name:'Jordan Kim', role:'Director of Photography', dept:'Camera', status:'On Set', rate:750, rating:4.8, projects:2, phone:'+44 7700 900002', email:'jordan@crewdesk.io', bio:'Cinematographer specialising in documentary and commercial work.', color:'#0057FF' },
    { id:3, name:'Sam Rivera', role:'Gaffer', dept:'Lighting', status:'Available', rate:620, rating:4.7, projects:4, phone:'+44 7700 900003', email:'sam@crewdesk.io', bio:'Senior gaffer with expertise in both studio and location lighting.', color:'#00875A' },
    { id:4, name:'Taylor Walsh', role:'Sound Engineer', dept:'Audio', status:'Travelling', rate:580, rating:4.6, projects:2, phone:'+44 7700 900004', email:'taylor@crewdesk.io', bio:'Location sound recordist and post-production audio engineer.', color:'#FF8C00' },
    { id:5, name:'Morgan Patel', role:'Art Director', dept:'Art', status:'On Set', rate:700, rating:4.9, projects:5, phone:'+44 7700 900005', email:'morgan@crewdesk.io', bio:'Creative art director with background in fashion and lifestyle.', color:'#6B00FF' },
    { id:6, name:'Casey Chen', role:'Editor', dept:'Post', status:'Available', rate:680, rating:4.7, projects:1, phone:'+44 7700 900006', email:'casey@crewdesk.io', bio:'Offline and online editor, Avid and Premiere certified.', color:'#E8003D' },
    { id:7, name:'Riley Johnson', role:'Production Assistant', dept:'Production', status:'Available', rate:380, rating:4.5, projects:6, phone:'+44 7700 900007', email:'riley@crewdesk.io', bio:'Experienced PA with strong organisation and logistics skills.', color:'#C8F000' },
    { id:8, name:'Quinn Davis', role:'Colorist', dept:'Post', status:'Travelling', rate:720, rating:4.8, projects:3, phone:'+44 7700 900008', email:'quinn@crewdesk.io', bio:'Senior colorist with credits on feature films and major campaigns.', color:'#0057FF' },
  ]);

  const [shifts, setShifts] = useState([
    { id:1, project:'Nike Campaign', role:'Director', crewId:1, day:'Mon', start:'07:00', end:'18:00', color:'#FF4D00', location:'Barcelona Studio' },
    { id:2, project:'Nike Campaign', role:'DOP', crewId:2, day:'Mon', start:'06:30', end:'18:00', color:'#0057FF', location:'Barcelona Studio' },
    { id:3, project:'BBC Docs', role:'Sound Engineer', crewId:4, day:'Tue', start:'08:00', end:'20:00', color:'#00875A', location:'Remote - Scotland' },
    { id:4, project:'Netflix BTS', role:'Art Director', crewId:5, day:'Wed', start:'09:00', end:'19:00', color:'#E8003D', location:'Pinewood Studios' },
    { id:5, project:'Apple Event', role:'Colorist', crewId:8, day:'Thu', start:'10:00', end:'22:00', color:'#6B00FF', location:'Apple HQ' },
    { id:6, project:'Adidas Shoot', role:'Gaffer', crewId:3, day:'Fri', start:'07:00', end:'17:00', color:'#00875A', location:'Shoreditch Studio' },
  ]);

  const [invoices, setInvoices] = useState([
    { id:1, number:'INV-2401', client:'Nike EMEA', project:'Nike Summer Campaign', amount:18000, status:'Paid', due:'Feb 28', date:'Feb 1', notes:'50% deposit payment' },
    { id:2, number:'INV-2402', client:'BBC Studios', project:'BBC Documentary Series', amount:42500, status:'Sent', due:'Mar 20', date:'Feb 15', notes:'Phase 1 production invoice' },
    { id:3, number:'INV-2403', client:'Adidas UK', project:'Adidas Product Shoot', amount:9000, status:'Overdue', due:'Mar 1', date:'Feb 1', notes:'Pre-production costs' },
    { id:4, number:'INV-2404', client:'Netflix', project:'Netflix Series BTS', amount:60000, status:'Draft', due:'Apr 1', date:'Mar 1', notes:'Full production invoice' },
    { id:5, number:'INV-2405', client:'Apple Inc', project:'Apple Launch Event', amount:100000, status:'Paid', due:'Mar 5', date:'Feb 20', notes:'Final payment' },
  ]);

  const [messages, setMessages] = useState([
    { id:1, name:'Alex Morgan', role:'Director', avatar:'AM', lastMsg:'Call sheet for tomorrow is ready', time:'2m', unread:3, online:true, color:'#FF4D00' },
    { id:2, name:'Jordan Kim', role:'DOP', avatar:'JK', lastMsg:'Can we push the 6am call to 7?', time:'14m', unread:1, online:true, color:'#0057FF' },
    { id:3, name:'Sam Rivera', role:'Gaffer', avatar:'SR', lastMsg:'All lighting rigs are confirmed', time:'1h', unread:0, online:false, color:'#00875A' },
    { id:4, name:'Morgan Patel', role:'Art Director', avatar:'MP', lastMsg:'Wardrobe options sent to your email', time:'2h', unread:0, online:true, color:'#6B00FF' },
    { id:5, name:'Casey Chen', role:'Editor', avatar:'CC', lastMsg:'Rough cut is ready for review', time:'3h', unread:0, online:false, color:'#E8003D' },
  ]);

  const [chatHistory, setChatHistory] = useState({
    1: [
      { id:1, sender:'1', text:'Hey, call sheet for tomorrow is ready. Can you approve it?', time:'10:30' },
      { id:2, sender:'me', text:'Looking at it now, give me 5 mins', time:'10:32' },
      { id:3, sender:'1', text:'Also the catering order needs confirmation by 3pm', time:'10:33' },
    ],
    2: [
      { id:1, sender:'2', text:'Can we push the 6am call to 7? Traffic is going to be a nightmare', time:'09:15' },
    ],
  });

  const [notifications, setNotifications] = useState([
    { id:1, type:'alert', icon:'⚠️', title:'Apple Event budget exceeded', body:'You are 93% through your budget with 7% of shoot remaining.', time:'Just now', action:'Review Budget', color:'#FF4D00' },
    { id:2, type:'invoice', icon:'💰', title:'Payment received', body:'Nike EMEA paid INV-2401 — £18,000 landed in your account.', time:'1h ago', action:'View Invoice', color:'#00875A' },
    { id:3, type:'crew', icon:'👤', title:'Crew confirmed', body:'Alex Morgan confirmed for Nike Campaign shoot on Monday.', time:'2h ago', action:'View Schedule', color:'#0057FF' },
    { id:4, type:'overdue', icon:'🔔', title:'Invoice overdue', body:'INV-2403 to Adidas UK is now 4 days past due.', time:'3h ago', action:'Send Reminder', color:'#E8003D' },
    { id:5, type:'message', icon:'💬', title:'3 unread messages', body:'Alex Morgan sent you new messages about the call sheet.', time:'Yesterday', action:'Open Chat', color:'#6B00FF' },
  ]);

  const [settings, setSettings] = useState({ notifications: true, darkMode: false, biometric: false, emailDigest: true });
  const [currentUser] = useState({ name: 'Alex Morgan', role: 'Production Manager', initials: 'AM', color: '#FF4D00' });

  // Project CRUD
  const addProject = (p) => setProjects(prev => [p, ...prev]);
  const updateProject = (p) => setProjects(prev => prev.map(x => x.id === p.id ? p : x));
  const deleteProject = (id) => setProjects(prev => prev.filter(x => x.id !== id));

  // Crew CRUD
  const addCrew = (c) => setCrew(prev => [c, ...prev]);
  const updateCrew = (c) => setCrew(prev => prev.map(x => x.id === c.id ? c : x));
  const deleteCrew = (id) => setCrew(prev => prev.filter(x => x.id !== id));

  // Shift CRUD
  const addShift = (s) => setShifts(prev => [s, ...prev]);
  const updateShift = (s) => setShifts(prev => prev.map(x => x.id === s.id ? s : x));
  const deleteShift = (id) => setShifts(prev => prev.filter(x => x.id !== id));

  // Invoice CRUD
  const addInvoice = (i) => setInvoices(prev => [i, ...prev]);
  const updateInvoice = (i) => setInvoices(prev => prev.map(x => x.id === i.id ? i : x));
  const deleteInvoice = (id) => setInvoices(prev => prev.filter(x => x.id !== id));

  // Chat
  const addChatMessage = (convoId, msg) => {
    setChatHistory(prev => ({ ...prev, [convoId]: [...(prev[convoId] || []), msg] }));
    setMessages(prev => prev.map(m => m.id === convoId ? {
      ...m, lastMsg: msg.text, time: msg.time,
      unread: msg.sender !== 'me' ? (m.unread || 0) + 1 : 0,
    } : m));
  };

  // Notifications
  const dismissNotification = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  return {
    projects, addProject, updateProject, deleteProject,
    crew, setCrew, addCrew, updateCrew, deleteCrew,
    shifts, addShift, updateShift, deleteShift,
    invoices, addInvoice, updateInvoice, deleteInvoice,
    messages, setMessages,
    chatHistory, addChatMessage,
    notifications, dismissNotification,
    settings, setSettings,
    currentUser,
  };
};


// ─────────────────────────────────────────────
// SHARED UI COMPONENTS
// ─────────────────────────────────────────────

// Status pill — DEPT style: no border, background fill, tight padding
function StatusPill({ label, color, bg }) {
  return (
    <View style={{ backgroundColor: bg || C.surfaceAlt, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' }}>
      <Text style={{ color: color || C.inkMid, fontSize: 11, fontWeight: '700', letterSpacing: 0.3 }}>{label}</Text>
    </View>
  );
}

// Avatar — bold initial with colour
function Avatar({ initials, color, size }) {
  const s = size || 40;
  return (
    <View style={{ width: s, height: s, borderRadius: s / 2, backgroundColor: color || C.ink, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#fff', fontSize: s * 0.35, fontWeight: '800', letterSpacing: -0.5 }}>{initials}</Text>
    </View>
  );
}

// Online dot
function OnlineDot({ online }) {
  if (!online) return null;
  return <View style={{ position: 'absolute', bottom: 1, right: 1, width: 9, height: 9, borderRadius: 5, backgroundColor: C.green, borderWidth: 1.5, borderColor: C.surface }} />;
}

// Section header — editorial style
function SectionLabel({ title, action, onAction }) {
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', paddingHorizontal: 20, paddingTop: 28, paddingBottom: 10 }}>
      <Text style={{ fontSize: 11, fontWeight: '800', letterSpacing: 1.5, color: C.inkLight, textTransform: 'uppercase' }}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text style={{ fontSize: 12, fontWeight: '600', color: C.electric }}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// Page header — DEPT editorial bold
function PageHeader({ title, subtitle, right, left }) {
  return (
    <View style={{ backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.line }}>
      {left || right ? (
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 }}>
          <View style={{ flex: 1 }}>{left}</View>
          <View>{right}</View>
        </View>
      ) : null}
      <View style={{ paddingHorizontal: 20, paddingBottom: 16, paddingTop: left || right ? 4 : 16 }}>
        <Text style={{ fontSize: 28, fontWeight: '800', color: C.ink, letterSpacing: -0.8, lineHeight: 32 }}>{title}</Text>
        {subtitle ? <Text style={{ fontSize: 13, color: C.inkLight, marginTop: 4, fontWeight: '500' }}>{subtitle}</Text> : null}
      </View>
    </View>
  );
}

// Input field — clean, newspaper editorial style
function Input({ label, value, onChangeText, placeholder, multiline, keyboardType, style }) {
  return (
    <View style={[{ marginBottom: 16 }, style]}>
      {label ? <Text style={{ fontSize: 11, fontWeight: '800', color: C.inkLight, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 6 }}>{label}</Text> : null}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || ''}
        placeholderTextColor={C.inkGhost}
        multiline={multiline}
        keyboardType={keyboardType || 'default'}
        style={{
          backgroundColor: C.surface,
          borderWidth: 1.5,
          borderColor: C.line,
          borderRadius: 10,
          padding: 14,
          color: C.ink,
          fontSize: 15,
          fontWeight: '500',
          minHeight: multiline ? 80 : 48,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
      />
    </View>
  );
}

// Primary button — DEPT style: black pill
function BtnPrimary({ label, onPress, color, textColor, small }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={{
      backgroundColor: color || C.ink,
      borderRadius: 100,
      paddingHorizontal: small ? 16 : 24,
      paddingVertical: small ? 9 : 14,
      alignItems: 'center',
    }}>
      <Text style={{ color: textColor || '#fff', fontSize: small ? 12 : 15, fontWeight: '800', letterSpacing: 0.2 }}>{label}</Text>
    </TouchableOpacity>
  );
}

// Ghost button — outlined pill
function BtnGhost({ label, onPress, color, small }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{
      borderWidth: 1.5,
      borderColor: color || C.line,
      borderRadius: 100,
      paddingHorizontal: small ? 14 : 20,
      paddingVertical: small ? 8 : 12,
      alignItems: 'center',
    }}>
      <Text style={{ color: color || C.inkMid, fontSize: small ? 12 : 14, fontWeight: '700' }}>{label}</Text>
    </TouchableOpacity>
  );
}

// Empty state
function EmptyState({ icon, title, body }) {
  return (
    <View style={{ alignItems: 'center', paddingVertical: 60, paddingHorizontal: 40 }}>
      <Text style={{ fontSize: 40, marginBottom: 14 }}>{icon}</Text>
      <Text style={{ fontSize: 18, fontWeight: '800', color: C.ink, textAlign: 'center', marginBottom: 8 }}>{title}</Text>
      {body ? <Text style={{ fontSize: 14, color: C.inkLight, textAlign: 'center', lineHeight: 20 }}>{body}</Text> : null}
    </View>
  );
}

// Progress bar
function ProgressBar({ value, color, height }) {
  const h = height || 4;
  return (
    <View style={{ height: h, backgroundColor: C.line, borderRadius: h }}>
      <View style={{ height: h, width: Math.round(value * 100) + '%', backgroundColor: color || C.electric, borderRadius: h }} />
    </View>
  );
}

// TurboTax-style notification card
function NotifCard({ notif, onDismiss, onAction }) {
  return (
    <View style={{
      backgroundColor: C.surface,
      borderRadius: 16,
      marginHorizontal: 16,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: C.line,
      overflow: 'hidden',
    }}>
      <View style={{ width: 4, position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: notif.color || C.punch, borderRadius: 2 }} />
      <View style={{ padding: 14, paddingLeft: 18 }}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1 }}>
            <Text style={{ fontSize: 20, marginRight: 10, marginTop: 1 }}>{notif.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: '800', color: C.ink, marginBottom: 3 }}>{notif.title}</Text>
              <Text style={{ fontSize: 13, color: C.inkMid, lineHeight: 18 }}>{notif.body}</Text>
              {notif.action && (
                <TouchableOpacity onPress={onAction} style={{ marginTop: 10 }}>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: notif.color || C.electric }}>{notif.action} →</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
          <TouchableOpacity onPress={onDismiss} style={{ paddingLeft: 8 }}>
            <Text style={{ fontSize: 16, color: C.inkGhost, fontWeight: '600' }}>×</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

// Helper: project status config
function statusConfig(s) {
  const map = {
    'Active':   { color: C.green,  bg: C.greenSoft,  label: 'Active' },
    'Pending':  { color: C.blue,   bg: C.blueSoft,   label: 'Pending' },
    'At Risk':  { color: C.red,    bg: C.redSoft,    label: 'At Risk' },
    'Complete': { color: C.inkMid, bg: C.surfaceAlt, label: 'Complete' },
    'Overdue':  { color: C.red,    bg: C.redSoft,    label: 'Overdue' },
    'Paid':     { color: C.green,  bg: C.greenSoft,  label: 'Paid' },
    'Sent':     { color: C.blue,   bg: C.blueSoft,   label: 'Sent' },
    'Draft':    { color: C.inkMid, bg: C.surfaceAlt, label: 'Draft' },
    'Available':{ color: C.green,  bg: C.greenSoft,  label: 'Available' },
    'On Set':   { color: C.punch,  bg: C.punchSoft,  label: 'On Set' },
    'Travelling':{ color: C.amber, bg: C.amberSoft,  label: 'Travelling' },
  };
  return map[s] || { color: C.inkMid, bg: C.surfaceAlt, label: s };
}

function fmtMoney(n) {
  return '£' + Number(n).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}


// ─────────────────────────────────────────────
// HOME SCREEN
// ─────────────────────────────────────────────
function HomeScreen({ store, onNav }) {
  const { projects, crew, invoices, notifications, dismissNotification, currentUser } = store;
  const [showNotifs, setShowNotifs] = React.useState(false);

  const activeProjects = projects.filter(p => p.status === 'Active').length;
  const availCrew = crew.filter(c => c.status === 'Available').length;
  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((a, i) => a + i.amount, 0);
  const overdueInvoices = invoices.filter(i => i.status === 'Overdue').length;
  const unreadNotifs = notifications.length;
  const atRiskProjects = projects.filter(p => p.status === 'At Risk');

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = currentUser.name.split(' ')[0];

  if (showNotifs) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <PageHeader
          title="Notifications"
          subtitle={unreadNotifs + ' updates'}
          left={
            <TouchableOpacity onPress={() => setShowNotifs(false)}>
              <Text style={{ fontSize: 13, fontWeight: '700', color: C.electric }}>← Back</Text>
            </TouchableOpacity>
          }
        />
        <ScrollView contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}>
          {notifications.length === 0 && <EmptyState icon="🎉" title="All clear!" body="No notifications right now." />}
          {notifications.map(n => (
            <NotifCard
              key={n.id}
              notif={n}
              onDismiss={() => dismissNotification(n.id)}
              onAction={() => { dismissNotification(n.id); setShowNotifs(false); }}
            />
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.line, paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 12, fontWeight: '700', color: C.inkLight, letterSpacing: 1, textTransform: 'uppercase' }}>{greeting}</Text>
            <Text style={{ fontSize: 26, fontWeight: '800', color: C.ink, letterSpacing: -0.7, marginTop: 2 }}>{firstName} 👋</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity onPress={() => setShowNotifs(true)} style={{ position: 'relative', marginRight: 12 }}>
              <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: C.surfaceAlt, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 18 }}>🔔</Text>
              </View>
              {unreadNotifs > 0 && (
                <View style={{ position: 'absolute', top: -2, right: -2, backgroundColor: C.punch, borderRadius: 10, minWidth: 18, height: 18, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4, borderWidth: 2, borderColor: C.surface }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: '800' }}>{unreadNotifs}</Text>
                </View>
              )}
            </TouchableOpacity>
            <Avatar initials={currentUser.initials} color={currentUser.color} size={40} />
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* KPI Strip */}
        <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 8 }}>
            {[
              { label: 'Active Jobs', val: String(activeProjects), icon: '🎬', color: C.electric, bg: C.electricSoft },
              { label: 'Available Crew', val: String(availCrew), icon: '👥', color: C.green, bg: C.greenSoft },
              { label: 'Revenue', val: fmtMoney(totalRevenue), icon: '💰', color: C.sage, bg: C.sageSoft },
              { label: 'Overdue', val: String(overdueInvoices), icon: '⏰', color: C.red, bg: C.redSoft },
            ].map(k => (
              <View key={k.label} style={{ backgroundColor: k.bg, borderRadius: 16, padding: 14, marginRight: 10, minWidth: 120 }}>
                <Text style={{ fontSize: 22 }}>{k.icon}</Text>
                <Text style={{ fontSize: 22, fontWeight: '800', color: k.color, marginTop: 6, letterSpacing: -0.5 }}>{k.val}</Text>
                <Text style={{ fontSize: 11, fontWeight: '700', color: k.color, marginTop: 2, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 0.5 }}>{k.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* At Risk Alert — TurboTax style */}
        {atRiskProjects.length > 0 && (
          <View style={{ marginHorizontal: 16, marginTop: 16, backgroundColor: C.redSoft, borderRadius: 14, padding: 14, borderLeftWidth: 4, borderLeftColor: C.red }}>
            <Text style={{ fontSize: 13, fontWeight: '800', color: C.red, marginBottom: 4 }}>⚠️ Attention needed</Text>
            {atRiskProjects.map(p => (
              <TouchableOpacity key={p.id} onPress={() => onNav('projects')} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Text style={{ fontSize: 13, color: C.red, flex: 1 }}>{p.title} — {Math.round(p.progress * 100)}% budget used</Text>
                <Text style={{ fontSize: 12, color: C.red, fontWeight: '700' }}>View →</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Notifications preview — TurboTax style */}
        {notifications.slice(0, 2).length > 0 && (
          <View style={{ marginTop: 16 }}>
            <SectionLabel title="Updates" action={unreadNotifs > 2 ? 'See all ' + unreadNotifs : 'See all'} onAction={() => setShowNotifs(true)} />
            {notifications.slice(0, 2).map(n => (
              <NotifCard key={n.id} notif={n} onDismiss={() => dismissNotification(n.id)} onAction={() => setShowNotifs(true)} />
            ))}
          </View>
        )}

        {/* Active Projects */}
        <SectionLabel title="Active Projects" action="All projects" onAction={() => onNav('projects')} />
        {projects.filter(p => p.status === 'Active').slice(0, 3).map(p => {
          const sc = statusConfig(p.status);
          return (
            <TouchableOpacity key={p.id} onPress={() => onNav('projects')} activeOpacity={0.75} style={{
              backgroundColor: C.surface,
              marginHorizontal: 16,
              marginBottom: 10,
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: C.line,
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: C.ink, letterSpacing: -0.3 }} numberOfLines={1}>{p.title}</Text>
                  <Text style={{ fontSize: 12, color: C.inkLight, marginTop: 2 }}>{p.client}</Text>
                </View>
                <StatusPill label={p.status} color={sc.color} bg={sc.bg} />
              </View>
              <ProgressBar value={p.progress} color={p.color} height={5} />
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
                <Text style={{ fontSize: 12, color: C.inkLight }}>{p.crew} crew · Due {p.due}</Text>
                <Text style={{ fontSize: 12, fontWeight: '700', color: C.inkMid }}>{Math.round(p.progress * 100)}%</Text>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* On-Deck Crew */}
        <SectionLabel title="Available Now" action="All crew" onAction={() => onNav('crew')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          {crew.filter(c => c.status === 'Available').map(c => (
            <TouchableOpacity key={c.id} onPress={() => onNav('crew')} activeOpacity={0.75} style={{
              backgroundColor: C.surface,
              borderRadius: 14,
              padding: 14,
              marginRight: 10,
              width: 130,
              borderWidth: 1,
              borderColor: C.line,
              alignItems: 'center',
            }}>
              <View style={{ position: 'relative', marginBottom: 8 }}>
                <Avatar initials={c.name.split(' ').map(n => n[0]).join('')} color={c.color} size={48} />
                <OnlineDot online={c.status === 'Available'} />
              </View>
              <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink, textAlign: 'center' }} numberOfLines={1}>{c.name.split(' ')[0]}</Text>
              <Text style={{ fontSize: 11, color: C.inkLight, textAlign: 'center', marginTop: 2 }} numberOfLines={1}>{c.role}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Quick Actions */}
        <SectionLabel title="Quick Actions" />
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, flexWrap: 'wrap' }}>
          {[
            { label: 'New Project', icon: '🎬', tab: 'projects', color: C.electricSoft },
            { label: 'Add Crew', icon: '👤', tab: 'crew', color: C.sageSoft },
            { label: 'Schedule', icon: '📅', tab: 'schedule', color: C.amberSoft },
            { label: 'New Invoice', icon: '🧾', tab: 'invoices', color: C.punchSoft },
            { label: 'Messages', icon: '💬', tab: 'messages', color: C.purpleSoft },
            { label: 'Reports', icon: '📊', tab: 'reports', color: C.greenSoft },
          ].map((a, i) => (
            <TouchableOpacity key={a.label} onPress={() => onNav(a.tab)} activeOpacity={0.75} style={{
              width: '30%',
              marginRight: i % 3 === 2 ? 0 : '5%',
              marginBottom: 10,
              backgroundColor: a.color,
              borderRadius: 14,
              padding: 14,
              alignItems: 'center',
            }}>
              <Text style={{ fontSize: 22, marginBottom: 6 }}>{a.icon}</Text>
              <Text style={{ fontSize: 11, fontWeight: '700', color: C.ink, textAlign: 'center' }}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}


// ─────────────────────────────────────────────
// PROJECTS SCREEN — full CRUD
// ─────────────────────────────────────────────
function ProjectForm({ project, onSave, onClose }) {
  const isEdit = !!project;
  const colors = [C.punch, C.electric, C.green, C.purple, C.amber, C.rose, C.sage, C.lime];
  const [title, setTitle] = React.useState(project ? project.title : '');
  const [client, setClient] = React.useState(project ? project.client : '');
  const [status, setStatus] = React.useState(project ? project.status : 'Active');
  const [due, setDue] = React.useState(project ? project.due : '');
  const [budget, setBudget] = React.useState(project ? String(project.budget) : '');
  const [lead, setLead] = React.useState(project ? project.lead : '');
  const [desc, setDesc] = React.useState(project ? project.desc : '');
  const [color, setColor] = React.useState(project ? project.color : colors[0]);
  const statuses = ['Active', 'Pending', 'At Risk', 'Complete'];

  const save = () => {
    if (!title.trim() || !client.trim()) { Alert.alert('Required', 'Title and client name are required.'); return; }
    onSave({ id: project ? project.id : Date.now(), title: title.trim(), client: client.trim(), status, due: due || 'TBD', budget: parseFloat(budget) || 0, spent: project ? project.spent : 0, progress: project ? project.progress : 0, lead: lead || 'Unassigned', desc: desc.trim(), crew: project ? project.crew : 0, color });
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <PageHeader
        title={isEdit ? 'Edit Project' : 'New Project'}
        subtitle={isEdit ? project.client : 'Fill in the details below'}
        left={<TouchableOpacity onPress={onClose}><Text style={{ fontSize: 13, fontWeight: '700', color: C.inkLight }}>Cancel</Text></TouchableOpacity>}
        right={<BtnPrimary label="Save" onPress={save} small />}
      />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
        <Input label="Project Title *" value={title} onChangeText={setTitle} placeholder="e.g. Nike Summer Campaign" />
        <Input label="Client Name *" value={client} onChangeText={setClient} placeholder="e.g. Nike EMEA" />
        <Input label="Lead / Director" value={lead} onChangeText={setLead} placeholder="e.g. Alex Morgan" />
        <Input label="Due Date" value={due} onChangeText={setDue} placeholder="e.g. Mar 15" />
        <Input label="Budget (£)" value={budget} onChangeText={setBudget} placeholder="e.g. 24000" keyboardType="decimal-pad" />
        <Input label="Description" value={desc} onChangeText={setDesc} placeholder="Project brief..." multiline />
        <Text style={{ fontSize: 11, fontWeight: '800', color: C.inkLight, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>STATUS</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
          {statuses.map(s => {
            const sc = statusConfig(s);
            return (
              <TouchableOpacity key={s} onPress={() => setStatus(s)} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, marginBottom: 8, backgroundColor: status === s ? sc.color : C.surfaceAlt }}>
                <Text style={{ color: status === s ? '#fff' : C.inkMid, fontSize: 13, fontWeight: '700' }}>{s}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={{ fontSize: 11, fontWeight: '800', color: C.inkLight, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>COLOUR</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 10 }}>
          {colors.map(col => (
            <TouchableOpacity key={col} onPress={() => setColor(col)} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: col, marginRight: 10, marginBottom: 10, alignItems: 'center', justifyContent: 'center', borderWidth: color === col ? 3 : 0, borderColor: C.ink }}>
              {color === col && <Text style={{ color: '#fff', fontSize: 14 }}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function ProjectDetail({ project, onEdit, onDelete, onClose }) {
  const sc = statusConfig(project.status);
  const pctBudget = project.budget > 0 ? project.spent / project.budget : 0;
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ backgroundColor: project.color, padding: 20, paddingTop: 16 }}>
        <TouchableOpacity onPress={onClose} style={{ marginBottom: 12 }}>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '700' }}>← Back</Text>
        </TouchableOpacity>
        <StatusPill label={project.status} color="#fff" bg="rgba(255,255,255,0.25)" />
        <Text style={{ fontSize: 26, fontWeight: '800', color: '#fff', marginTop: 10, letterSpacing: -0.5, lineHeight: 30 }}>{project.title}</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>{project.client}</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
        {/* Budget card */}
        <View style={{ backgroundColor: C.surface, borderRadius: 16, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: C.line }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
            <View>
              <Text style={{ fontSize: 11, fontWeight: '700', color: C.inkLight, letterSpacing: 1, textTransform: 'uppercase' }}>Spent</Text>
              <Text style={{ fontSize: 22, fontWeight: '800', color: pctBudget > 0.9 ? C.red : C.ink, marginTop: 2 }}>{fmtMoney(project.spent)}</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 11, fontWeight: '700', color: C.inkLight, letterSpacing: 1, textTransform: 'uppercase' }}>Budget</Text>
              <Text style={{ fontSize: 22, fontWeight: '800', color: C.ink, marginTop: 2 }}>{fmtMoney(project.budget)}</Text>
            </View>
          </View>
          <ProgressBar value={pctBudget} color={pctBudget > 0.9 ? C.red : project.color} height={6} />
          <Text style={{ fontSize: 12, color: C.inkLight, marginTop: 6, textAlign: 'right' }}>{Math.round(pctBudget * 100)}% used</Text>
        </View>
        {/* Details */}
        <View style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.line, overflow: 'hidden', marginBottom: 14 }}>
          {[
            { label: 'Lead', val: project.lead },
            { label: 'Due Date', val: project.due },
            { label: 'Crew Size', val: project.crew + ' people' },
            { label: 'Progress', val: Math.round(project.progress * 100) + '%' },
          ].map((row, i) => (
            <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 14, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: C.line }}>
              <Text style={{ fontSize: 14, color: C.inkLight, fontWeight: '500' }}>{row.label}</Text>
              <Text style={{ fontSize: 14, color: C.ink, fontWeight: '700' }}>{row.val}</Text>
            </View>
          ))}
        </View>
        {project.desc ? (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: C.inkLight, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>DESCRIPTION</Text>
            <Text style={{ fontSize: 14, color: C.inkMid, lineHeight: 21 }}>{project.desc}</Text>
          </View>
        ) : null}
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, marginRight: 10 }}><BtnPrimary label="Edit Project" onPress={onEdit} /></View>
          <BtnGhost label="Delete" onPress={onDelete} color={C.red} />
        </View>
      </ScrollView>
    </View>
  );
}

function ProjectsScreen({ store, onNav }) {
  const { projects, addProject, updateProject, deleteProject } = store;
  const [filter, setFilter] = React.useState('All');
  const [showForm, setShowForm] = React.useState(false);
  const [editProject, setEditProject] = React.useState(null);
  const [detailProject, setDetailProject] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const filters = ['All', 'Active', 'Pending', 'At Risk', 'Complete'];

  const filtered = projects.filter(p => {
    const mf = filter === 'All' || p.status === filter;
    const ms = search === '' || p.title.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  const handleSave = (p) => {
    if (editProject) updateProject(p); else addProject(p);
    setShowForm(false); setEditProject(null);
  };

  const handleDelete = (p) => {
    Alert.alert('Delete Project', 'Remove ' + p.title + '? This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => { deleteProject(p.id); setDetailProject(null); } },
    ]);
  };

  if (showForm || editProject) return <ProjectForm project={editProject} onSave={handleSave} onClose={() => { setShowForm(false); setEditProject(null); }} />;
  if (detailProject) return <ProjectDetail project={detailProject} onEdit={() => { setEditProject(detailProject); setDetailProject(null); }} onDelete={() => handleDelete(detailProject)} onClose={() => setDetailProject(null)} />;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <PageHeader
        title="Projects"
        subtitle={filtered.length + ' projects'}
        right={
          <TouchableOpacity onPress={() => setShowForm(true)} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20, lineHeight: 24, fontWeight: '300' }}>+</Text>
          </TouchableOpacity>
        }
      />
      <View style={{ backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.line, paddingHorizontal: 16, paddingVertical: 10 }}>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search projects..."
          placeholderTextColor={C.inkGhost}
          style={{ backgroundColor: C.bgWarm, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: C.ink, fontWeight: '500' }}
        />
      </View>
      <View style={{ backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.line }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10 }}>
          {filters.map(f => {
            const sc = statusConfig(f);
            return (
              <TouchableOpacity key={f} onPress={() => setFilter(f)} style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, marginRight: 8, backgroundColor: filter === f ? C.ink : C.bgWarm }}>
                <Text style={{ color: filter === f ? '#fff' : C.inkMid, fontSize: 13, fontWeight: '700' }}>{f}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {filtered.length === 0 && <EmptyState icon="🎬" title="No projects found" body="Try a different filter or create a new project." />}
        {filtered.map(p => {
          const sc = statusConfig(p.status);
          return (
            <TouchableOpacity key={p.id} onPress={() => setDetailProject(p)} activeOpacity={0.75} style={{ backgroundColor: C.surface, borderRadius: 18, marginBottom: 12, borderWidth: 1, borderColor: C.line, overflow: 'hidden' }}>
              <View style={{ height: 5, backgroundColor: p.color }} />
              <View style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: C.ink, letterSpacing: -0.3 }}>{p.title}</Text>
                    <Text style={{ fontSize: 12, color: C.inkLight, marginTop: 3 }}>{p.client} · Due {p.due}</Text>
                  </View>
                  <StatusPill label={p.status} color={sc.color} bg={sc.bg} />
                </View>
                <ProgressBar value={p.progress} color={p.color} height={5} />
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: C.inkLight }}>{p.crew} crew · {fmtMoney(p.spent)} of {fmtMoney(p.budget)}</Text>
                  </View>
                  <Text style={{ fontSize: 12, fontWeight: '800', color: C.inkMid }}>{Math.round(p.progress * 100)}%</Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}


// ─────────────────────────────────────────────
// CREW SCREEN — full CRUD
// ─────────────────────────────────────────────
function CrewForm({ member, onSave, onClose }) {
  const isEdit = !!member;
  const colors = [C.punch, C.electric, C.green, C.purple, C.amber, C.rose, C.sage];
  const [name, setName] = React.useState(member ? member.name : '');
  const [role, setRole] = React.useState(member ? member.role : '');
  const [dept, setDept] = React.useState(member ? member.dept : '');
  const [rate, setRate] = React.useState(member ? String(member.rate) : '');
  const [email, setEmail] = React.useState(member ? member.email : '');
  const [phone, setPhone] = React.useState(member ? member.phone : '');
  const [bio, setBio] = React.useState(member ? member.bio : '');
  const [status, setStatus] = React.useState(member ? member.status : 'Available');
  const [color, setColor] = React.useState(member ? member.color : colors[0]);
  const statuses = ['Available', 'On Set', 'Travelling'];

  const save = () => {
    if (!name.trim() || !role.trim()) { Alert.alert('Required', 'Name and role are required.'); return; }
    onSave({ id: member ? member.id : Date.now(), name: name.trim(), role: role.trim(), dept: dept || 'General', rate: parseFloat(rate) || 0, email: email.trim(), phone: phone.trim(), bio: bio.trim(), status, color, rating: member ? member.rating : 5.0, projects: member ? member.projects : 0 });
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <PageHeader
        title={isEdit ? 'Edit Crew Member' : 'Add Crew Member'}
        subtitle={isEdit ? member.role : 'Fill in the details below'}
        left={<TouchableOpacity onPress={onClose}><Text style={{ fontSize: 13, fontWeight: '700', color: C.inkLight }}>Cancel</Text></TouchableOpacity>}
        right={<BtnPrimary label="Save" onPress={save} small />}
      />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
        <Input label="Full Name *" value={name} onChangeText={setName} placeholder="e.g. Alex Morgan" />
        <Input label="Role *" value={role} onChangeText={setRole} placeholder="e.g. Director of Photography" />
        <Input label="Department" value={dept} onChangeText={setDept} placeholder="e.g. Camera" />
        <Input label="Day Rate (£)" value={rate} onChangeText={setRate} placeholder="e.g. 750" keyboardType="decimal-pad" />
        <Input label="Email" value={email} onChangeText={setEmail} placeholder="name@email.com" keyboardType="email-address" />
        <Input label="Phone" value={phone} onChangeText={setPhone} placeholder="+44 7700 900000" keyboardType="phone-pad" />
        <Input label="Bio" value={bio} onChangeText={setBio} placeholder="Brief description..." multiline />
        <Text style={{ fontSize: 11, fontWeight: '800', color: C.inkLight, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>STATUS</Text>
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          {statuses.map(s => {
            const sc = statusConfig(s);
            return (
              <TouchableOpacity key={s} onPress={() => setStatus(s)} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, backgroundColor: status === s ? sc.color : C.surfaceAlt }}>
                <Text style={{ color: status === s ? '#fff' : C.inkMid, fontSize: 13, fontWeight: '700' }}>{s}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <Text style={{ fontSize: 11, fontWeight: '800', color: C.inkLight, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>COLOUR</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {colors.map(col => (
            <TouchableOpacity key={col} onPress={() => setColor(col)} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: col, marginRight: 10, marginBottom: 10, alignItems: 'center', justifyContent: 'center', borderWidth: color === col ? 3 : 0, borderColor: C.ink }}>
              {color === col && <Text style={{ color: '#fff', fontSize: 14 }}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function CrewDetail({ member, onEdit, onDelete, onClose, onMessage }) {
  const sc = statusConfig(member.status);
  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <View style={{ backgroundColor: member.color, padding: 20, paddingTop: 16, alignItems: 'center' }}>
        <TouchableOpacity onPress={onClose} style={{ alignSelf: 'flex-start', marginBottom: 16 }}>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 13, fontWeight: '700' }}>← Back</Text>
        </TouchableOpacity>
        <Avatar initials={member.name.split(' ').map(n => n[0]).join('')} color="rgba(255,255,255,0.25)" size={72} />
        <Text style={{ fontSize: 22, fontWeight: '800', color: '#fff', marginTop: 12, letterSpacing: -0.5 }}>{member.name}</Text>
        <Text style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 4 }}>{member.role}</Text>
        <StatusPill label={member.status} color="#fff" bg="rgba(255,255,255,0.2)" />
      </View>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
        <View style={{ flexDirection: 'row', marginBottom: 14 }}>
          <View style={{ flex: 1, marginRight: 8 }}><BtnPrimary label="Message" onPress={onMessage} color={member.color} /></View>
          <View style={{ flex: 1 }}><BtnGhost label="Edit" onPress={onEdit} /></View>
        </View>
        <View style={{ backgroundColor: C.surface, borderRadius: 16, borderWidth: 1, borderColor: C.line, overflow: 'hidden', marginBottom: 14 }}>
          {[
            { label: 'Department', val: member.dept },
            { label: 'Day Rate', val: fmtMoney(member.rate) },
            { label: 'Rating', val: '★ ' + member.rating + ' / 5.0' },
            { label: 'Projects', val: member.projects + ' completed' },
            { label: 'Email', val: member.email },
            { label: 'Phone', val: member.phone },
          ].map((row, i) => (
            <View key={row.label} style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 14, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: C.line }}>
              <Text style={{ fontSize: 14, color: C.inkLight }}>{row.label}</Text>
              <Text style={{ fontSize: 14, color: C.ink, fontWeight: '700', flex: 1, textAlign: 'right' }} numberOfLines={1}>{row.val}</Text>
            </View>
          ))}
        </View>
        {member.bio ? (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ fontSize: 11, fontWeight: '800', color: C.inkLight, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 8 }}>BIO</Text>
            <Text style={{ fontSize: 14, color: C.inkMid, lineHeight: 21 }}>{member.bio}</Text>
          </View>
        ) : null}
        <BtnGhost label="Remove from roster" onPress={onDelete} color={C.red} />
      </ScrollView>
    </View>
  );
}

function CrewScreen({ store, onNav }) {
  const { crew, addCrew, updateCrew, deleteCrew } = store;
  const [filter, setFilter] = React.useState('All');
  const [search, setSearch] = React.useState('');
  const [showForm, setShowForm] = React.useState(false);
  const [editMember, setEditMember] = React.useState(null);
  const [detailMember, setDetailMember] = React.useState(null);
  const filters = ['All', 'Available', 'On Set', 'Travelling'];

  const filtered = crew.filter(c => {
    const mf = filter === 'All' || c.status === filter;
    const ms = search === '' || c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  const handleSave = (c) => {
    if (editMember) updateCrew(c); else addCrew(c);
    setShowForm(false); setEditMember(null);
  };

  const handleDelete = (c) => {
    Alert.alert('Remove Crew Member', 'Remove ' + c.name + ' from the roster?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => { deleteCrew(c.id); setDetailMember(null); } },
    ]);
  };

  if (showForm || editMember) return <CrewForm member={editMember} onSave={handleSave} onClose={() => { setShowForm(false); setEditMember(null); }} />;
  if (detailMember) return <CrewDetail member={detailMember} onEdit={() => { setEditMember(detailMember); setDetailMember(null); }} onDelete={() => handleDelete(detailMember)} onClose={() => setDetailMember(null)} onMessage={() => { setDetailMember(null); onNav('messages'); }} />;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <PageHeader
        title="Crew"
        subtitle={filtered.length + ' members'}
        right={
          <TouchableOpacity onPress={() => setShowForm(true)} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20, lineHeight: 24, fontWeight: '300' }}>+</Text>
          </TouchableOpacity>
        }
      />
      <View style={{ backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.line, paddingHorizontal: 16, paddingVertical: 10 }}>
        <TextInput value={search} onChangeText={setSearch} placeholder="Search crew..." placeholderTextColor={C.inkGhost} style={{ backgroundColor: C.bgWarm, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: C.ink, fontWeight: '500' }} />
      </View>
      <View style={{ backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.line }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 10 }}>
          {filters.map(f => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, marginRight: 8, backgroundColor: filter === f ? C.ink : C.bgWarm }}>
              <Text style={{ color: filter === f ? '#fff' : C.inkMid, fontSize: 13, fontWeight: '700' }}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {filtered.length === 0 && <EmptyState icon="👥" title="No crew found" body="Add crew members to your roster." />}
        {filtered.map(c => {
          const sc = statusConfig(c.status);
          return (
            <TouchableOpacity key={c.id} onPress={() => setDetailMember(c)} activeOpacity={0.75} style={{ backgroundColor: C.surface, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: C.line, padding: 14, flexDirection: 'row', alignItems: 'center' }}>
              <View style={{ position: 'relative', marginRight: 14 }}>
                <Avatar initials={c.name.split(' ').map(n => n[0]).join('')} color={c.color} size={50} />
                <OnlineDot online={c.status === 'Available'} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                  <Text style={{ fontSize: 15, fontWeight: '800', color: C.ink }}>{c.name}</Text>
                  <StatusPill label={c.status} color={sc.color} bg={sc.bg} />
                </View>
                <Text style={{ fontSize: 13, color: C.inkLight }}>{c.role} · {c.dept}</Text>
                <Text style={{ fontSize: 12, color: C.inkLight, marginTop: 3 }}>{fmtMoney(c.rate)}/day · ★ {c.rating}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}


// ─────────────────────────────────────────────
// SCHEDULE SCREEN — weekly calendar + CRUD
// ─────────────────────────────────────────────
function ShiftForm({ shift, crew, projects, onSave, onClose }) {
  const isEdit = !!shift;
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const [selCrew, setSelCrew] = React.useState(shift ? shift.crewId : null);
  const [selProject, setSelProject] = React.useState(shift ? shift.project : (projects[0] ? projects[0].title : ''));
  const [selRole, setSelRole] = React.useState(shift ? shift.role : '');
  const [selDay, setSelDay] = React.useState(shift ? shift.day : 'Mon');
  const [start, setStart] = React.useState(shift ? shift.start : '08:00');
  const [end, setEnd] = React.useState(shift ? shift.end : '18:00');
  const [location, setLocation] = React.useState(shift ? shift.location : '');

  const chosenCrew = crew.find(c => c.id === selCrew);

  const save = () => {
    if (!selCrew || !selProject) { Alert.alert('Required', 'Please select a crew member and project.'); return; }
    onSave({ id: shift ? shift.id : Date.now(), crewId: selCrew, project: selProject, role: selRole || (chosenCrew ? chosenCrew.role : 'Crew'), day: selDay, start, end, location, color: chosenCrew ? chosenCrew.color : C.electric });
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <PageHeader
        title={isEdit ? 'Edit Shift' : 'New Shift'}
        subtitle="Schedule a crew member"
        left={<TouchableOpacity onPress={onClose}><Text style={{ fontSize: 13, fontWeight: '700', color: C.inkLight }}>Cancel</Text></TouchableOpacity>}
        right={<BtnPrimary label="Save" onPress={save} small />}
      />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
        <Text style={{ fontSize: 11, fontWeight: '800', color: C.inkLight, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>DAY</Text>
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          {days.map(d => (
            <TouchableOpacity key={d} onPress={() => setSelDay(d)} style={{ flex: 1, paddingVertical: 10, borderRadius: 10, marginRight: 4, backgroundColor: selDay === d ? C.ink : C.surfaceAlt, alignItems: 'center' }}>
              <Text style={{ color: selDay === d ? '#fff' : C.inkMid, fontSize: 11, fontWeight: '700' }}>{d}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={{ fontSize: 11, fontWeight: '800', color: C.inkLight, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>CREW MEMBER</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {crew.map(c => (
            <TouchableOpacity key={c.id} onPress={() => setSelCrew(c.id)} style={{ alignItems: 'center', marginRight: 14 }}>
              <View style={{ borderWidth: selCrew === c.id ? 3 : 0, borderColor: c.color, borderRadius: 30, marginBottom: 5 }}>
                <Avatar initials={c.name.split(' ').map(n => n[0]).join('')} color={selCrew === c.id ? c.color : C.surfaceAlt} size={52} />
              </View>
              <Text style={{ fontSize: 10, fontWeight: selCrew === c.id ? '800' : '500', color: selCrew === c.id ? C.ink : C.inkLight, textAlign: 'center' }} numberOfLines={1}>{c.name.split(' ')[0]}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Text style={{ fontSize: 11, fontWeight: '800', color: C.inkLight, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>PROJECT</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {projects.map(p => (
            <TouchableOpacity key={p.id} onPress={() => setSelProject(p.title)} style={{ paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, marginRight: 8, backgroundColor: selProject === p.title ? C.ink : C.surfaceAlt }}>
              <Text style={{ color: selProject === p.title ? '#fff' : C.inkMid, fontSize: 13, fontWeight: '700' }} numberOfLines={1}>{p.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Input label="Role on shoot" value={selRole} onChangeText={setSelRole} placeholder={chosenCrew ? chosenCrew.role : 'e.g. Director'} />
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, marginRight: 10 }}><Input label="Start Time" value={start} onChangeText={setStart} placeholder="08:00" /></View>
          <View style={{ flex: 1 }}><Input label="End Time" value={end} onChangeText={setEnd} placeholder="18:00" /></View>
        </View>
        <Input label="Location" value={location} onChangeText={setLocation} placeholder="e.g. Pinewood Studios" />
      </ScrollView>
    </View>
  );
}

function ScheduleScreen({ store, onNav }) {
  const { shifts, crew, projects, addShift, updateShift, deleteShift } = store;
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const dayLabels = { Mon:'Monday', Tue:'Tuesday', Wed:'Wednesday', Thu:'Thursday', Fri:'Friday', Sat:'Saturday', Sun:'Sunday' };
  const [activeDay, setActiveDay] = React.useState('Mon');
  const [showForm, setShowForm] = React.useState(false);
  const [editShift, setEditShift] = React.useState(null);

  const todayShifts = shifts.filter(s => s.day === activeDay);

  const handleSave = (s) => {
    if (editShift) updateShift(s); else addShift(s);
    setShowForm(false); setEditShift(null);
  };

  const handleDelete = (s) => {
    Alert.alert('Remove Shift', 'Remove this shift?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => deleteShift(s.id) },
    ]);
  };

  if (showForm || editShift) return <ShiftForm shift={editShift} crew={crew} projects={projects} onSave={handleSave} onClose={() => { setShowForm(false); setEditShift(null); }} />;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <PageHeader
        title="Schedule"
        subtitle={todayShifts.length + ' shifts ' + dayLabels[activeDay]}
        right={
          <TouchableOpacity onPress={() => setShowForm(true)} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20, lineHeight: 24, fontWeight: '300' }}>+</Text>
          </TouchableOpacity>
        }
      />
      {/* Day picker strip */}
      <View style={{ backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.line, paddingVertical: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16 }}>
          {days.map(d => {
            const count = shifts.filter(s => s.day === d).length;
            const isActive = activeDay === d;
            return (
              <TouchableOpacity key={d} onPress={() => setActiveDay(d)} style={{ alignItems: 'center', marginRight: 16, paddingVertical: 6, paddingHorizontal: 12, borderRadius: 12, backgroundColor: isActive ? C.ink : 'transparent' }}>
                <Text style={{ fontSize: 12, fontWeight: '800', color: isActive ? '#fff' : C.inkLight, letterSpacing: 0.5 }}>{d}</Text>
                {count > 0 && (
                  <View style={{ marginTop: 4, width: 6, height: 6, borderRadius: 3, backgroundColor: isActive ? C.lime : C.inkGhost }} />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {todayShifts.length === 0 && <EmptyState icon="📅" title={"Nothing on " + dayLabels[activeDay]} body="Tap + to schedule a crew member." />}
        {todayShifts.map(s => {
          const member = crew.find(c => c.id === s.crewId);
          return (
            <View key={s.id} style={{ backgroundColor: C.surface, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: C.line, overflow: 'hidden', flexDirection: 'row' }}>
              <View style={{ width: 5, backgroundColor: s.color || C.electric }} />
              <View style={{ flex: 1, padding: 14 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                    {member && (
                      <View style={{ marginRight: 10 }}>
                        <Avatar initials={member.name.split(' ').map(n => n[0]).join('')} color={s.color || C.electric} size={36} />
                      </View>
                    )}
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 15, fontWeight: '800', color: C.ink }}>{member ? member.name : 'Unknown'}</Text>
                      <Text style={{ fontSize: 12, color: C.inkLight, marginTop: 2 }}>{s.role} · {s.project}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={() => setEditShift(s)} style={{ padding: 6 }}>
                      <Text style={{ fontSize: 14, color: C.inkLight }}>✏️</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleDelete(s)} style={{ padding: 6 }}>
                      <Text style={{ fontSize: 14, color: C.inkLight }}>🗑</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: C.bgWarm, borderRadius: 8, padding: 10 }}>
                  <Text style={{ fontSize: 13, fontWeight: '700', color: C.ink }}>{s.start} – {s.end}</Text>
                  {s.location ? <Text style={{ fontSize: 12, color: C.inkLight }} numberOfLines={1}>{s.location}</Text> : null}
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}


// ─────────────────────────────────────────────
// MESSAGES SCREEN — real iMessage-style chat
// ─────────────────────────────────────────────
function MessagesScreen({ store, onNav }) {
  const { messages, setMessages, chatHistory, addChatMessage, crew } = store;
  const [activeConvo, setActiveConvo] = React.useState(null);
  const [inputText, setInputText] = React.useState('');
  const [search, setSearch] = React.useState('');
  const scrollRef = React.useRef(null);

  const filtered = messages.filter(m =>
    search === '' || m.name.toLowerCase().includes(search.toLowerCase())
  );

  const openConvo = (m) => {
    setActiveConvo(m);
    setMessages(messages.map(msg => msg.id === m.id ? { ...msg, unread: 0 } : msg));
  };

  const handleSend = () => {
    if (!inputText.trim() || !activeConvo) return;
    const newMsg = { id: Date.now(), sender: 'me', text: inputText.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    addChatMessage(activeConvo.id, newMsg);
    setInputText('');
    setTimeout(() => scrollRef.current && scrollRef.current.scrollToEnd({ animated: true }), 100);
    const replies = ['Got it, on it!', 'Will do.', 'Sounds good.', 'Copy that.', 'Confirmed.', 'I\'ll check and come back to you.'];
    setTimeout(() => {
      const reply = { id: Date.now() + 1, sender: String(activeConvo.id), text: replies[Math.floor(Math.random() * replies.length)], time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      addChatMessage(activeConvo.id, reply);
    }, 1400);
  };

  const history = activeConvo ? (chatHistory[activeConvo.id] || []) : [];

  if (activeConvo) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <View style={{ backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.line, padding: 16, flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={() => setActiveConvo(null)} style={{ marginRight: 14 }}>
            <Text style={{ fontSize: 22, color: C.ink }}>←</Text>
          </TouchableOpacity>
          <View style={{ position: 'relative', marginRight: 12 }}>
            <Avatar initials={activeConvo.avatar} color={activeConvo.color} size={40} />
            <OnlineDot online={activeConvo.online} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '800', color: C.ink }}>{activeConvo.name}</Text>
            <Text style={{ fontSize: 12, color: activeConvo.online ? C.green : C.inkLight }}>{activeConvo.online ? 'Online' : activeConvo.role}</Text>
          </View>
        </View>

        <ScrollView ref={scrollRef} style={{ flex: 1, backgroundColor: C.bg }} contentContainerStyle={{ padding: 16, paddingBottom: 8 }} onContentSizeChange={() => scrollRef.current && scrollRef.current.scrollToEnd({ animated: false })}>
          {history.length === 0 && <EmptyState icon="💬" title={'Message ' + activeConvo.name} body="Start the conversation." />}
          {history.map((msg, i) => {
            const isMe = msg.sender === 'me';
            return (
              <View key={msg.id || i} style={{ flexDirection: 'row', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: 8, alignItems: 'flex-end' }}>
                {!isMe && (
                  <View style={{ marginRight: 8, marginBottom: 4 }}>
                    <Avatar initials={activeConvo.avatar} color={activeConvo.color} size={28} />
                  </View>
                )}
                <View style={{ maxWidth: '72%' }}>
                  <View style={{
                    backgroundColor: isMe ? C.ink : C.surface,
                    borderRadius: 18,
                    borderBottomRightRadius: isMe ? 4 : 18,
                    borderBottomLeftRadius: isMe ? 18 : 4,
                    paddingHorizontal: 14,
                    paddingVertical: 10,
                    borderWidth: isMe ? 0 : 1,
                    borderColor: C.line,
                  }}>
                    <Text style={{ color: isMe ? '#fff' : C.ink, fontSize: 14, lineHeight: 20, fontWeight: '500' }}>{msg.text}</Text>
                  </View>
                  <Text style={{ color: C.inkGhost, fontSize: 10, marginTop: 3, textAlign: isMe ? 'right' : 'left', paddingHorizontal: 4 }}>{msg.time}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 12, paddingBottom: 20, backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.line }}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder={'Message ' + activeConvo.name.split(' ')[0] + '...'}
            placeholderTextColor={C.inkGhost}
            style={{ flex: 1, backgroundColor: C.bgWarm, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 10, color: C.ink, fontSize: 14, fontWeight: '500', marginRight: 10, borderWidth: 1, borderColor: C.line }}
            onSubmitEditing={handleSend}
            returnKeyType="send"
          />
          <TouchableOpacity onPress={handleSend} activeOpacity={0.8} style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: inputText.trim() ? C.ink : C.line, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 18 }}>↑</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const totalUnread = messages.reduce((a, m) => a + (m.unread || 0), 0);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <PageHeader
        title="Messages"
        subtitle={totalUnread > 0 ? totalUnread + ' unread' : 'All read'}
        right={
          <TouchableOpacity
            onPress={() => {
              const opts = crew.slice(0, 6).map(function(c) {
                return { text: c.name, onPress: function() {
                  const existing = messages.find(function(m) { return m.id === c.id; });
                  if (existing) { openConvo(existing); }
                  else {
                    const nc = { id: c.id, name: c.name, role: c.role, avatar: c.name.split(' ').map(function(n){return n[0];}).join(''), color: c.color || C.electric, lastMsg: '', time: 'Now', unread: 0, online: false };
                    setMessages([nc, ...messages]);
                    setTimeout(function(){ openConvo(nc); }, 100);
                  }
                }};
              });
              Alert.alert('New Message', 'Select a crew member', [...opts, { text: 'Cancel', style: 'cancel' }]);
            }}
            style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: '#fff', fontSize: 20, lineHeight: 24, fontWeight: '300' }}>+</Text>
          </TouchableOpacity>
        }
      />
      <View style={{ backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.line, paddingHorizontal: 16, paddingVertical: 10 }}>
        <TextInput value={search} onChangeText={setSearch} placeholder="Search messages..." placeholderTextColor={C.inkGhost} style={{ backgroundColor: C.bgWarm, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: C.ink, fontWeight: '500' }} />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {filtered.length === 0 && <EmptyState icon="💬" title="No conversations" body="Start a conversation with your crew." />}
        {filtered.map(m => (
          <TouchableOpacity key={m.id} onPress={() => openConvo(m)} activeOpacity={0.7} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.lineSoft, backgroundColor: m.unread > 0 ? C.electricSoft : C.surface }}>
            <View style={{ position: 'relative', marginRight: 12 }}>
              <Avatar initials={m.avatar} color={m.color} size={48} />
              <OnlineDot online={m.online} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <Text style={{ color: C.ink, fontSize: 15, fontWeight: m.unread > 0 ? '800' : '600' }}>{m.name}</Text>
                <Text style={{ color: C.inkGhost, fontSize: 11 }}>{m.time}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: m.unread > 0 ? C.inkMid : C.inkLight, fontSize: 13, flex: 1, marginRight: 8, fontWeight: m.unread > 0 ? '600' : '400' }} numberOfLines={1}>{m.lastMsg || 'Start a conversation'}</Text>
                {m.unread > 0 && (
                  <View style={{ backgroundColor: C.electric, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 6 }}>
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '800' }}>{m.unread}</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}


// ─────────────────────────────────────────────
// INVOICES SCREEN — full CRUD + status actions
// ─────────────────────────────────────────────
function InvoiceForm({ invoice, projects, onSave, onClose }) {
  const isEdit = !!invoice;
  const [client, setClient] = React.useState(invoice ? invoice.client : '');
  const [project, setProject] = React.useState(invoice ? invoice.project : (projects[0] ? projects[0].title : ''));
  const [amount, setAmount] = React.useState(invoice ? String(invoice.amount) : '');
  const [status, setStatus] = React.useState(invoice ? invoice.status : 'Draft');
  const [due, setDue] = React.useState(invoice ? invoice.due : '');
  const [notes, setNotes] = React.useState(invoice ? invoice.notes || '' : '');
  const statuses = ['Draft', 'Sent', 'Paid', 'Overdue'];

  const save = () => {
    if (!client.trim() || !amount.trim()) { Alert.alert('Required', 'Client name and amount are required.'); return; }
    onSave({ id: invoice ? invoice.id : Date.now(), number: invoice ? invoice.number : 'INV-' + String(Date.now()).slice(-4), client: client.trim(), project: project || 'General', amount: parseFloat(amount) || 0, status, due: due || 'TBD', date: invoice ? invoice.date : new Date().toLocaleDateString(), notes: notes.trim() });
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <PageHeader
        title={isEdit ? 'Edit Invoice' : 'New Invoice'}
        subtitle={isEdit ? invoice.number : 'Fill in the details'}
        left={<TouchableOpacity onPress={onClose}><Text style={{ fontSize: 13, fontWeight: '700', color: C.inkLight }}>Cancel</Text></TouchableOpacity>}
        right={<BtnPrimary label="Save" onPress={save} small />}
      />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 80 }}>
        <Input label="Client Name *" value={client} onChangeText={setClient} placeholder="e.g. Nike EMEA" />
        <Text style={{ fontSize: 11, fontWeight: '800', color: C.inkLight, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>PROJECT</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
          {projects.map(p => (
            <TouchableOpacity key={p.id} onPress={() => setProject(p.title)} style={{ paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, marginRight: 8, backgroundColor: project === p.title ? C.ink : C.surfaceAlt }}>
              <Text style={{ color: project === p.title ? '#fff' : C.inkMid, fontSize: 13, fontWeight: '700' }} numberOfLines={1}>{p.title}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Input label="Amount (£) *" value={amount} onChangeText={setAmount} placeholder="0.00" keyboardType="decimal-pad" />
        <Input label="Due Date" value={due} onChangeText={setDue} placeholder="e.g. Mar 30" />
        <Input label="Notes" value={notes} onChangeText={setNotes} placeholder="Optional notes..." multiline />
        <Text style={{ fontSize: 11, fontWeight: '800', color: C.inkLight, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 10 }}>STATUS</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {statuses.map(s => {
            const sc = statusConfig(s);
            return (
              <TouchableOpacity key={s} onPress={() => setStatus(s)} style={{ paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, marginRight: 8, marginBottom: 8, backgroundColor: status === s ? sc.color : C.surfaceAlt }}>
                <Text style={{ color: status === s ? '#fff' : C.inkMid, fontSize: 13, fontWeight: '700' }}>{s}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

function InvoicesScreen({ store, onNav }) {
  const { invoices, projects, addInvoice, updateInvoice, deleteInvoice } = store;
  const [filter, setFilter] = React.useState('All');
  const [showForm, setShowForm] = React.useState(false);
  const [editInvoice, setEditInvoice] = React.useState(null);
  const [search, setSearch] = React.useState('');

  const filtered = invoices.filter(i => {
    const mf = filter === 'All' || i.status === filter;
    const ms = search === '' || i.client.toLowerCase().includes(search.toLowerCase()) || i.number.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  const totalPaid = invoices.filter(i => i.status === 'Paid').reduce((a, i) => a + i.amount, 0);
  const totalPending = invoices.filter(i => i.status === 'Sent').reduce((a, i) => a + i.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === 'Overdue').reduce((a, i) => a + i.amount, 0);

  const handleSave = (inv) => {
    if (editInvoice) updateInvoice(inv); else addInvoice(inv);
    setShowForm(false); setEditInvoice(null);
  };

  const handleDelete = (inv) => {
    Alert.alert('Delete Invoice', 'Remove ' + inv.number + '?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteInvoice(inv.id) },
    ]);
  };

  if (showForm || editInvoice) return <InvoiceForm invoice={editInvoice} projects={projects} onSave={handleSave} onClose={() => { setShowForm(false); setEditInvoice(null); }} />;

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <PageHeader
        title="Invoices"
        subtitle={fmtMoney(totalPaid) + ' collected'}
        right={
          <TouchableOpacity onPress={() => setShowForm(true)} style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.ink, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: '#fff', fontSize: 20, lineHeight: 24, fontWeight: '300' }}>+</Text>
          </TouchableOpacity>
        }
      />
      {/* Summary strip — TurboTax style */}
      <View style={{ backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.line }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12 }}>
          {[
            { label: 'Collected', val: fmtMoney(totalPaid), color: C.green, bg: C.greenSoft },
            { label: 'Outstanding', val: fmtMoney(totalPending), color: C.blue, bg: C.blueSoft },
            { label: 'Overdue', val: fmtMoney(totalOverdue), color: C.red, bg: C.redSoft },
          ].map(s => (
            <View key={s.label} style={{ backgroundColor: s.bg, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 10, marginRight: 10, alignItems: 'center', minWidth: 110 }}>
              <Text style={{ fontSize: 17, fontWeight: '800', color: s.color }}>{s.val}</Text>
              <Text style={{ fontSize: 11, fontWeight: '700', color: s.color, opacity: 0.7, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 }}>{s.label}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={{ paddingHorizontal: 16, paddingBottom: 10 }}>
          <TextInput value={search} onChangeText={setSearch} placeholder="Search invoices..." placeholderTextColor={C.inkGhost} style={{ backgroundColor: C.bgWarm, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: C.ink, fontWeight: '500' }} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 10 }}>
          {['All','Draft','Sent','Paid','Overdue'].map(f => (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} style={{ paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, marginRight: 8, backgroundColor: filter === f ? C.ink : C.bgWarm }}>
              <Text style={{ color: filter === f ? '#fff' : C.inkMid, fontSize: 13, fontWeight: '700' }}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {filtered.length === 0 && <EmptyState icon="🧾" title="No invoices found" body="Create your first invoice above." />}
        {filtered.map(inv => {
          const sc = statusConfig(inv.status);
          return (
            <View key={inv.id} style={{ backgroundColor: C.surface, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: inv.status === 'Overdue' ? C.redSoft : C.line, overflow: 'hidden' }}>
              <View style={{ height: 4, backgroundColor: sc.color }} />
              <View style={{ padding: 16 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '800', color: C.ink }}>{inv.client}</Text>
                    <Text style={{ fontSize: 12, color: C.inkLight, marginTop: 3 }}>{inv.number} · {inv.project}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 20, fontWeight: '800', color: C.ink }}>{fmtMoney(inv.amount)}</Text>
                    <StatusPill label={inv.status} color={sc.color} bg={sc.bg} />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', backgroundColor: C.bgWarm, borderRadius: 8, padding: 10, marginBottom: 12 }}>
                  <Text style={{ fontSize: 12, color: C.inkMid }}>Issued: {inv.date}</Text>
                  <Text style={{ fontSize: 12, fontWeight: '700', color: inv.status === 'Overdue' ? C.red : C.inkMid }}>Due: {inv.due}</Text>
                </View>
                {inv.notes ? <Text style={{ fontSize: 12, color: C.inkLight, marginBottom: 12, fontStyle: 'italic' }}>{inv.notes}</Text> : null}
                <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: C.line, paddingTop: 12 }}>
                  {inv.status === 'Draft' && <TouchableOpacity onPress={() => updateInvoice({ ...inv, status: 'Sent' })} style={{ flex: 1, alignItems: 'center' }}><Text style={{ fontSize: 13, fontWeight: '700', color: C.electric }}>Send Invoice</Text></TouchableOpacity>}
                  {inv.status === 'Sent' && <TouchableOpacity onPress={() => updateInvoice({ ...inv, status: 'Paid' })} style={{ flex: 1, alignItems: 'center' }}><Text style={{ fontSize: 13, fontWeight: '700', color: C.green }}>Mark Paid ✓</Text></TouchableOpacity>}
                  {inv.status === 'Overdue' && <TouchableOpacity onPress={() => Alert.alert('Reminder Sent', 'Payment reminder sent to ' + inv.client + '.')} style={{ flex: 1, alignItems: 'center' }}><Text style={{ fontSize: 13, fontWeight: '700', color: C.red }}>Send Reminder</Text></TouchableOpacity>}
                  {inv.status === 'Paid' && <View style={{ flex: 1 }}><Text style={{ fontSize: 13, fontWeight: '700', color: C.green, textAlign: 'center' }}>✓ Paid</Text></View>}
                  <TouchableOpacity onPress={() => setEditInvoice(inv)} style={{ flex: 1, alignItems: 'center' }}><Text style={{ fontSize: 13, fontWeight: '700', color: C.inkLight }}>Edit</Text></TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDelete(inv)} style={{ flex: 1, alignItems: 'center' }}><Text style={{ fontSize: 13, fontWeight: '700', color: C.red }}>Delete</Text></TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}


// ─────────────────────────────────────────────
// REPORTS SCREEN
// ─────────────────────────────────────────────
function ReportsScreen({ store, onNav }) {
  const { projects, invoices, crew } = store;
  const [period, setPeriod] = React.useState('Month');

  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((a, i) => a + i.amount, 0);
  const totalPending = invoices.filter(i => i.status !== 'Paid').reduce((a, i) => a + i.amount, 0);
  const activeProjects = projects.filter(p => p.status === 'Active').length;
  const availCrew = crew.filter(c => c.status === 'Available').length;

  const barData = [
    { label: 'Oct', val: 28000 },
    { label: 'Nov', val: 41000 },
    { label: 'Dec', val: 35000 },
    { label: 'Jan', val: 52000 },
    { label: 'Feb', val: 48000 },
    { label: 'Mar', val: Math.max(totalRevenue, 62000) },
  ];
  const maxVal = Math.max(...barData.map(d => d.val));

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <PageHeader title="Reports" subtitle="Business overview" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* Period selector */}
        <View style={{ flexDirection: 'row', backgroundColor: C.surface, borderRadius: 14, padding: 4, marginBottom: 20, borderWidth: 1, borderColor: C.line }}>
          {['Week','Month','Quarter','Year'].map(p => (
            <TouchableOpacity key={p} onPress={() => setPeriod(p)} style={{ flex: 1, paddingVertical: 9, borderRadius: 10, backgroundColor: period === p ? C.ink : 'transparent', alignItems: 'center' }}>
              <Text style={{ color: period === p ? '#fff' : C.inkMid, fontSize: 13, fontWeight: '700' }}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* KPI Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 6 }}>
          {[
            { label: 'Revenue', val: fmtMoney(totalRevenue), icon: '💰', color: C.green, bg: C.greenSoft },
            { label: 'Pending', val: fmtMoney(totalPending), icon: '⏳', color: C.blue, bg: C.blueSoft },
            { label: 'Active Jobs', val: String(activeProjects), icon: '🎬', color: C.punch, bg: C.punchSoft },
            { label: 'Available', val: String(availCrew), icon: '👥', color: C.purple, bg: C.purpleSoft },
          ].map((k, i) => (
            <View key={k.label} style={{ width: '48%', backgroundColor: k.bg, borderRadius: 16, padding: 16, marginBottom: 10, marginRight: i % 2 === 0 ? '4%' : 0 }}>
              <Text style={{ fontSize: 24, marginBottom: 8 }}>{k.icon}</Text>
              <Text style={{ fontSize: 24, fontWeight: '800', color: k.color, letterSpacing: -0.5 }}>{k.val}</Text>
              <Text style={{ fontSize: 11, fontWeight: '700', color: k.color, marginTop: 4, opacity: 0.7, textTransform: 'uppercase', letterSpacing: 0.5 }}>{k.label}</Text>
            </View>
          ))}
        </View>

        {/* Revenue Chart */}
        <View style={{ backgroundColor: C.surface, borderRadius: 18, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: C.line }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <View>
              <Text style={{ fontSize: 16, fontWeight: '800', color: C.ink }}>Revenue Trend</Text>
              <Text style={{ fontSize: 12, color: C.inkLight, marginTop: 2 }}>Last 6 months</Text>
            </View>
            <Text style={{ fontSize: 20, fontWeight: '800', color: C.green }}>{fmtMoney(totalRevenue)}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 90, marginBottom: 10 }}>
            {barData.map((d, i) => {
              const barH = Math.max(8, (d.val / maxVal) * 80);
              const isLast = i === barData.length - 1;
              return (
                <View key={d.label} style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-end' }}>
                  <View style={{ width: '60%', height: barH, backgroundColor: isLast ? C.ink : C.line, borderRadius: 4, marginBottom: 6 }} />
                  <Text style={{ color: isLast ? C.ink : C.inkGhost, fontSize: 10, fontWeight: isLast ? '800' : '500' }}>{d.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Project Status Breakdown */}
        <View style={{ backgroundColor: C.surface, borderRadius: 18, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: C.line }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: C.ink, marginBottom: 16 }}>Project Status</Text>
          {['Active','Pending','At Risk','Complete'].map(s => {
            const count = projects.filter(p => p.status === s).length;
            const pct = projects.length > 0 ? count / projects.length : 0;
            const sc = statusConfig(s);
            return (
              <View key={s} style={{ marginBottom: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text style={{ fontSize: 13, fontWeight: '600', color: C.ink }}>{s}</Text>
                  <Text style={{ fontSize: 13, fontWeight: '800', color: sc.color }}>{count}</Text>
                </View>
                <ProgressBar value={pct} color={sc.color} height={6} />
              </View>
            );
          })}
        </View>

        {/* Top Projects by Budget */}
        <View style={{ backgroundColor: C.surface, borderRadius: 18, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: C.line }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: C.ink, marginBottom: 16 }}>Budget Utilisation</Text>
          {projects.slice(0, 4).map(p => (
            <View key={p.id} style={{ marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: C.ink, flex: 1, marginRight: 10 }} numberOfLines={1}>{p.title}</Text>
                <Text style={{ fontSize: 13, fontWeight: '800', color: p.progress > 0.9 ? C.red : C.inkMid }}>{Math.round(p.progress * 100)}%</Text>
              </View>
              <ProgressBar value={p.progress} color={p.progress > 0.9 ? C.red : p.color} height={6} />
            </View>
          ))}
        </View>

        {/* Invoice Summary */}
        <View style={{ backgroundColor: C.surface, borderRadius: 18, padding: 18, borderWidth: 1, borderColor: C.line }}>
          <Text style={{ fontSize: 16, fontWeight: '800', color: C.ink, marginBottom: 16 }}>Invoice Summary</Text>
          {['Paid','Sent','Draft','Overdue'].map(s => {
            const total = invoices.filter(i => i.status === s).reduce((a, i) => a + i.amount, 0);
            const count = invoices.filter(i => i.status === s).length;
            const sc = statusConfig(s);
            return (
              <View key={s} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: C.lineSoft }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: sc.color, marginRight: 10 }} />
                  <Text style={{ fontSize: 14, color: C.ink, fontWeight: '600' }}>{s}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 14, fontWeight: '800', color: sc.color }}>{fmtMoney(total)}</Text>
                  <Text style={{ fontSize: 11, color: C.inkLight }}>{count} invoice{count !== 1 ? 's' : ''}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────
// MORE / SETTINGS SCREEN
// ─────────────────────────────────────────────
function MoreScreen({ store, onNav }) {
  const { settings, setSettings, currentUser } = store;
  const [notifOn, setNotifOn] = React.useState(settings.notifications);
  const [emailOn, setEmailOn] = React.useState(settings.emailDigest);
  const [biometricOn, setBiometricOn] = React.useState(settings.biometric);

  const toggle = (key, val, setter) => {
    setter(val);
    setSettings({ ...settings, [key]: val });
  };

  const Row = ({ icon, label, sublabel, right, onPress, danger }) => (
    <TouchableOpacity onPress={onPress || (() => {})} activeOpacity={onPress ? 0.7 : 1} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: C.line }}>
      <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: danger ? C.redSoft : C.bgWarm, alignItems: 'center', justifyContent: 'center', marginRight: 14 }}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 15, fontWeight: '700', color: danger ? C.red : C.ink }}>{label}</Text>
        {sublabel ? <Text style={{ fontSize: 12, color: C.inkLight, marginTop: 2 }}>{sublabel}</Text> : null}
      </View>
      {right !== undefined ? right : (onPress ? <Text style={{ color: C.inkGhost, fontSize: 18, fontWeight: '300' }}>›</Text> : null)}
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <PageHeader title="More" subtitle="Settings & account" />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile card */}
        <View style={{ margin: 16, backgroundColor: C.surface, borderRadius: 18, padding: 18, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: C.line }}>
          <Avatar initials={currentUser.initials} color={currentUser.color} size={56} />
          <View style={{ flex: 1, marginLeft: 14 }}>
            <Text style={{ fontSize: 18, fontWeight: '800', color: C.ink }}>{currentUser.name}</Text>
            <Text style={{ fontSize: 13, color: C.inkLight, marginTop: 2 }}>{currentUser.role}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.green, marginRight: 6 }} />
              <Text style={{ fontSize: 11, fontWeight: '700', color: C.green }}>Active</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => Alert.alert('Edit Profile', 'Profile editing coming soon.')}>
            <Text style={{ fontSize: 13, fontWeight: '700', color: C.electric }}>Edit</Text>
          </TouchableOpacity>
        </View>

        <Text style={{ fontSize: 11, fontWeight: '800', color: C.inkLight, letterSpacing: 1.5, textTransform: 'uppercase', paddingHorizontal: 20, paddingTop: 8, paddingBottom: 6 }}>NOTIFICATIONS</Text>
        <View style={{ backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.line }}>
          <Row icon="🔔" label="Push Notifications" sublabel="Shifts, messages & alerts" right={<Switch value={notifOn} onValueChange={v => toggle('notifications', v, setNotifOn)} trackColor={{ false: C.line, true: C.ink }} thumbColor="#fff" />} />
          <Row icon="📧" label="Email Digest" sublabel="Daily summary" right={<Switch value={emailOn} onValueChange={v => toggle('emailDigest', v, setEmailOn)} trackColor={{ false: C.line, true: C.ink }} thumbColor="#fff" />} />
          <Row icon="🔐" label="Biometric Lock" sublabel="Face ID / Fingerprint" right={<Switch value={biometricOn} onValueChange={v => toggle('biometric', v, setBiometricOn)} trackColor={{ false: C.line, true: C.ink }} thumbColor="#fff" />} />
        </View>

        <Text style={{ fontSize: 11, fontWeight: '800', color: C.inkLight, letterSpacing: 1.5, textTransform: 'uppercase', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 6 }}>WORKSPACE</Text>
        <View style={{ backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.line }}>
          <Row icon="🏢" label="Company Settings" sublabel="Name, logo, timezone" onPress={() => Alert.alert('Company Settings', 'Manage your workspace.')} />
          <Row icon="🔗" label="Integrations" sublabel="Slack, QuickBooks, Google" onPress={() => Alert.alert('Integrations', 'Connect your tools.')} />
          <Row icon="💾" label="Export Data" sublabel="CSV & PDF reports" onPress={() => Alert.alert('Export', 'Choose your export format.')} />
        </View>

        <Text style={{ fontSize: 11, fontWeight: '800', color: C.inkLight, letterSpacing: 1.5, textTransform: 'uppercase', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 6 }}>SUPPORT</Text>
        <View style={{ backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.line }}>
          <Row icon="📚" label="Help Centre" onPress={() => Alert.alert('Help Centre', 'Documentation and guides.')} />
          <Row icon="💬" label="Contact Support" onPress={() => Alert.alert('Support', 'support@crewdesk.app')} />
          <Row icon="⭐" label="Rate CrewDesk" onPress={() => Alert.alert('Thank you!', 'We appreciate your support.')} />
          <Row icon="📱" label="Version" sublabel="v3.0.0" right={<Text style={{ fontSize: 12, color: C.inkLight }}>Latest</Text>} />
        </View>

        <View style={{ height: 1, backgroundColor: C.line, marginTop: 20 }} />
        <View style={{ backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.line }}>
          <Row icon="🚪" label="Sign Out" danger onPress={() => Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: () => Alert.alert('Signed out', 'See you soon!') },
          ])} />
        </View>
      </ScrollView>
    </View>
  );
}


// ─────────────────────────────────────────────
// TAB BAR + SECONDARY NAV
// ─────────────────────────────────────────────
const PRIMARY_TABS = [
  { key:'home',      label:'Home',     icon:'⚡' },
  { key:'projects',  label:'Projects', icon:'🎬' },
  { key:'crew',      label:'Crew',     icon:'👥' },
  { key:'schedule',  label:'Schedule', icon:'📅' },
  { key:'messages',  label:'Messages', icon:'💬' },
];

const SECONDARY_TABS = [
  { key:'invoices',  label:'Invoices', icon:'🧾' },
  { key:'reports',   label:'Reports',  icon:'📊' },
  { key:'more',      label:'More',     icon:'⚙️' },
];

function TabBar({ active, onTab, unreadMessages }) {
  return (
    <View style={{ backgroundColor: C.surface, borderTopWidth: 1, borderTopColor: C.line, paddingBottom: 8, paddingTop: 8, flexDirection: 'row' }}>
      {PRIMARY_TABS.map(t => {
        const isActive = active === t.key;
        const badge = t.key === 'messages' && unreadMessages > 0;
        return (
          <TouchableOpacity key={t.key} onPress={() => onTab(t.key)} style={{ flex: 1, alignItems: 'center', paddingVertical: 4 }} activeOpacity={0.7}>
            <View style={{ position: 'relative' }}>
              <Text style={{ fontSize: 22, opacity: isActive ? 1 : 0.4 }}>{t.icon}</Text>
              {badge && (
                <View style={{ position: 'absolute', top: -3, right: -5, backgroundColor: C.punch, borderRadius: 8, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3, borderWidth: 1.5, borderColor: C.surface }}>
                  <Text style={{ color: '#fff', fontSize: 9, fontWeight: '800' }}>{unreadMessages}</Text>
                </View>
              )}
            </View>
            <Text style={{ color: isActive ? C.ink : C.inkGhost, fontSize: 10, marginTop: 3, fontWeight: isActive ? '800' : '500', letterSpacing: 0.2 }}>{t.label}</Text>
            {isActive && <View style={{ width: 20, height: 2.5, backgroundColor: C.ink, borderRadius: 2, marginTop: 2 }} />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function SecondaryBar({ active, onTab }) {
  return (
    <View style={{ backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.line }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        {SECONDARY_TABS.map(t => {
          const isActive = active === t.key;
          return (
            <TouchableOpacity key={t.key} onPress={() => onTab(t.key)} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginRight: 8, backgroundColor: isActive ? C.ink : C.bgWarm }} activeOpacity={0.7}>
              <Text style={{ fontSize: 15, marginRight: 6 }}>{t.icon}</Text>
              <Text style={{ color: isActive ? '#fff' : C.inkMid, fontSize: 13, fontWeight: '700' }}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────
export default function App() {
  const store = useStore();
  const [activeTab, setActiveTab] = React.useState('home');
  const unreadMessages = store.messages.reduce((a, m) => a + (m.unread || 0), 0);
  const isSecondary = ['invoices','reports','more'].includes(activeTab);

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':     return <HomeScreen     store={store} onNav={setActiveTab} />;
      case 'projects': return <ProjectsScreen store={store} onNav={setActiveTab} />;
      case 'crew':     return <CrewScreen     store={store} onNav={setActiveTab} />;
      case 'schedule': return <ScheduleScreen store={store} onNav={setActiveTab} />;
      case 'messages': return <MessagesScreen store={store} onNav={setActiveTab} />;
      case 'invoices': return <InvoicesScreen store={store} onNav={setActiveTab} />;
      case 'reports':  return <ReportsScreen  store={store} onNav={setActiveTab} />;
      case 'more':     return <MoreScreen     store={store} onNav={setActiveTab} />;
      default:         return <HomeScreen     store={store} onNav={setActiveTab} />;
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.surface }}>
      <StatusBar barStyle="dark-content" backgroundColor={C.surface} />
      {isSecondary && <SecondaryBar active={activeTab} onTab={setActiveTab} />}
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        {renderScreen()}
      </View>
      <TabBar active={activeTab} onTab={setActiveTab} unreadMessages={unreadMessages} />
    </SafeAreaView>
  );
}
