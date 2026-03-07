
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput,
  FlatList, Modal, Alert, Animated, RefreshControl, StatusBar,
  KeyboardAvoidingView, Platform, Dimensions, SectionList,
} from 'react-native';

const { width: SW, height: SH } = Dimensions.get('window');

// ─── DESIGN TOKENS ──────────────────────────────────────────────────────────
const C = {
  bg:      '#080C14',
  surface: '#0F1521',
  card:    '#141C2B',
  border:  '#1E2A3D',
  muted:   '#2A3A55',
  text:    '#F0F4FF',
  sub:     '#7A8FAF',
  gold:    '#F5A623',
  goldD:   '#C47E0F',
  teal:    '#00D4B4',
  tealD:   '#009E87',
  red:     '#FF5C5C',
  green:   '#4ADE80',
  purple:  '#A78BFA',
  blue:    '#3B82F6',
  orange:  '#FB923C',
  pink:    '#F472B6',
  goldBg:  'rgba(245,166,35,0.10)',
  tealBg:  'rgba(0,212,180,0.10)',
  redBg:   'rgba(255,92,92,0.10)',
  greenBg: 'rgba(74,222,128,0.10)',
  purpleBg:'rgba(167,139,250,0.10)',
  blueBg:  'rgba(59,130,246,0.10)',
};

const ACCENT_OPTIONS = [C.gold, C.teal, C.purple, C.blue, C.pink, C.orange, C.red, C.green];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmtGBP = (n) => {
  if (n >= 1_000_000) return 'GBP' + (n / 1_000_000).toFixed(1) + 'm';
  if (n >= 1_000)     return 'GBP' + (n / 1_000).toFixed(0) + 'k';
  return 'GBP' + n.toLocaleString();
};
const fmtDate = (d) => {
  if (!d) return '';
  const parts = d.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return parts[2] + ' ' + (months[parseInt(parts[1],10)-1] || '') + ' ' + parts[0];
};
const today = () => new Date().toISOString().split('T')[0];
const uid = () => Math.random().toString(36).slice(2,9);
const clamp = (v,min,max) => Math.max(min, Math.min(max, v));

// ─── INITIAL DATA ─────────────────────────────────────────────────────────────
const INIT_PROJECTS = [
  { id:'p1', name:'Midnight Runner', type:'Feature Film', client:'Apex Studios', budget:480000, spent:312000, status:'active', accent:C.gold, crew:['c1','c2','c4'], startDate:'2026-01-10', endDate:'2026-08-30', location:'London, UK', notes:'Primary production phase. Weekly rushes review.' },
  { id:'p2', name:'Nova Campaign', type:'Brand Campaign', client:'Nova Beverages', budget:95000, spent:61200, status:'active', accent:C.teal, crew:['c3','c5'], startDate:'2026-02-01', endDate:'2026-04-15', location:'Manchester, UK', notes:'Social-first. Deliverables: 3 hero films + cutdowns.' },
  { id:'p3', name:'Altitude', type:'Documentary', client:'Sky Docs', budget:220000, spent:220000, status:'completed', accent:C.purple, crew:['c2','c6'], startDate:'2025-05-01', endDate:'2025-12-20', location:'Scotland, UK', notes:'Delivered on time. Post-production complete.' },
  { id:'p4', name:'The Last Signal', type:'Short Film', client:'BFI', budget:40000, spent:8500, status:'pending', accent:C.blue, crew:['c1','c3'], startDate:'2026-05-01', endDate:'2026-07-15', location:'Bristol, UK', notes:'Awaiting location permits and final cast confirmation.' },
];

const INIT_CREW = [
  { id:'c1', name:'Sophia Marlowe', role:'Director', email:'sophia@crewdesk.co', phone:'+44 7700 900001', rate:1200, rateUnit:'day', status:'active', projects:['p1','p4'], avatar:'SM', skills:['Direction','Creative Vision','Script Development'], bio:'Award-winning director with 12 years in film and advertising.' },
  { id:'c2', name:'Marcus Webb', role:'DOP', email:'marcus@crewdesk.co', phone:'+44 7700 900002', rate:950, rateUnit:'day', status:'active', projects:['p1','p3'], avatar:'MW', skills:['Cinematography','Lighting','Camera Operating'], bio:'BAFTA-nominated director of photography.' },
  { id:'c3', name:'Priya Nair', role:'Producer', email:'priya@crewdesk.co', phone:'+44 7700 900003', rate:800, rateUnit:'day', status:'active', projects:['p2','p4'], avatar:'PN', skills:['Production Management','Budgeting','Scheduling'], bio:'Experienced producer across commercials and long-form.' },
  { id:'c4', name:'James Fletcher', role:'1st AD', email:'james@crewdesk.co', phone:'+44 7700 900004', rate:700, rateUnit:'day', status:'active', projects:['p1'], avatar:'JF', skills:['Scheduling','Set Management','Safety'], bio:'Detail-focused AD keeping productions on track.' },
  { id:'c5', name:'Aisha Okafor', role:'Art Director', email:'aisha@crewdesk.co', phone:'+44 7700 900005', rate:650, rateUnit:'day', status:'active', projects:['p2'], avatar:'AO', skills:['Art Direction','Set Design','Props'], bio:'Bold aesthetic sensibility across brand and narrative.' },
  { id:'c6', name:'Tom Bradshaw', role:'Editor', email:'tom@crewdesk.co', phone:'+44 7700 900006', rate:750, rateUnit:'day', status:'freelance', projects:['p3'], avatar:'TB', skills:['Offline Editing','Colour Grade','Sound Design'], bio:'Post specialist with credits on BAFTA-winning documentaries.' },
];

const INIT_SHIFTS = [
  { id:'s1', projectId:'p1', title:'Shoot Day 12 - Ext. Warehouse', date:'2026-03-10', callTime:'06:00', wrapTime:'20:00', location:'Bermondsey SE1', crew:['c1','c2','c4'], status:'confirmed', notes:'Golden hour final shot at 19:30.' },
  { id:'s2', projectId:'p1', title:'Shoot Day 13 - Int. Office Set', date:'2026-03-11', callTime:'07:30', wrapTime:'18:00', location:'Shepperton Studios', crew:['c1','c2','c4'], status:'confirmed', notes:'Studio base. Catering on set.' },
  { id:'s3', projectId:'p2', title:'Brand Film Shoot', date:'2026-03-15', callTime:'08:00', wrapTime:'17:00', location:'Media City, Manchester', crew:['c3','c5'], status:'tentative', notes:'Talent confirmed. Weather dependent.' },
  { id:'s4', projectId:'p4', title:'Pre-Production Meeting', date:'2026-04-01', callTime:'10:00', wrapTime:'13:00', location:'Zoom / Remote', crew:['c1','c3'], status:'confirmed', notes:'Location scouting review and casting shortlist.' },
];

const INIT_INVOICES = [
  { id:'i1', projectId:'p1', number:'INV-2026-001', client:'Apex Studios', amount:120000, status:'paid', issueDate:'2026-01-15', dueDate:'2026-02-14', paidDate:'2026-02-10', notes:'Production milestone 1 of 4.' },
  { id:'i2', projectId:'p1', number:'INV-2026-002', client:'Apex Studios', amount:120000, status:'paid', issueDate:'2026-02-15', dueDate:'2026-03-16', paidDate:'2026-03-12', notes:'Production milestone 2 of 4.' },
  { id:'i3', projectId:'p2', number:'INV-2026-003', client:'Nova Beverages', amount:47500, status:'overdue', issueDate:'2026-02-01', dueDate:'2026-03-01', paidDate:null, notes:'50% of campaign fee.' },
  { id:'i4', projectId:'p1', number:'INV-2026-004', client:'Apex Studios', amount:120000, status:'sent', issueDate:'2026-03-01', dueDate:'2026-03-31', paidDate:null, notes:'Production milestone 3 of 4.' },
  { id:'i5', projectId:'p4', number:'INV-2026-005', client:'BFI', amount:20000, status:'draft', issueDate:'2026-03-05', dueDate:'2026-04-04', paidDate:null, notes:'Development fee.' },
  { id:'i6', projectId:'p3', number:'INV-2025-019', client:'Sky Docs', amount:220000, status:'paid', issueDate:'2025-12-22', dueDate:'2026-01-21', paidDate:'2026-01-18', notes:'Final delivery invoice.' },
];

const INIT_MESSAGES = [
  { id:'m1', projectId:'p1', from:'Sophia Marlowe', fromId:'c1', avatar:'SM', text:'Rushes from day 12 looking incredible. The warehouse light is exactly what we wanted.', ts:'2026-03-08T09:14:00Z', read:true, replies:[] },
  { id:'m2', projectId:'p1', from:'Marcus Webb', fromId:'c2', avatar:'MW', text:'Agreed. I want to push the look even further on day 13 - trying a colder key to contrast the interiors.', ts:'2026-03-08T09:22:00Z', read:true, replies:[] },
  { id:'m3', projectId:'p2', from:'Priya Nair', fromId:'c3', avatar:'PN', text:'Manchester recce confirmed. Sending over the location pack this afternoon.', ts:'2026-03-07T14:05:00Z', read:false, replies:[] },
  { id:'m4', projectId:'p1', from:'James Fletcher', fromId:'c4', avatar:'JF', text:'Call sheet for day 13 is out. Please confirm receipt.', ts:'2026-03-08T11:00:00Z', read:false, replies:[] },
  { id:'m5', projectId:'p2', from:'Aisha Okafor', fromId:'c5', avatar:'AO', text:'Props list finalised. Sourcing the hero bottle display from a specialist props house.', ts:'2026-03-06T16:30:00Z', read:true, replies:[] },
];


// ─── STORE ────────────────────────────────────────────────────────────────────
const useStore = () => {
  const [projects, setProjects]   = useState(INIT_PROJECTS);
  const [crew,     setCrew]       = useState(INIT_CREW);
  const [shifts,   setShifts]     = useState(INIT_SHIFTS);
  const [invoices, setInvoices]   = useState(INIT_INVOICES);
  const [messages, setMessages]   = useState(INIT_MESSAGES);

  const addProject    = (p) => setProjects(ps => [{ ...p, id: uid(), crew:[] }, ...ps]);
  const updateProject = (p) => setProjects(ps => ps.map(x => x.id === p.id ? p : x));
  const deleteProject = (id) => setProjects(ps => ps.filter(x => x.id !== id));

  const addCrew    = (c) => setCrew(cs => [{ ...c, id: uid(), projects:[] }, ...cs]);
  const updateCrew = (c) => setCrew(cs => cs.map(x => x.id === c.id ? c : x));
  const deleteCrew = (id) => setCrew(cs => cs.filter(x => x.id !== id));

  const assignCrewToProject = (crewId, projectId) => {
    setCrew(cs => cs.map(c => c.id === crewId ? { ...c, projects: [...new Set([...c.projects, projectId])] } : c));
    setProjects(ps => ps.map(p => p.id === projectId ? { ...p, crew: [...new Set([...p.crew, crewId])] } : p));
  };
  const removeCrewFromProject = (crewId, projectId) => {
    setCrew(cs => cs.map(c => c.id === crewId ? { ...c, projects: c.projects.filter(x => x !== projectId) } : c));
    setProjects(ps => ps.map(p => p.id === projectId ? { ...p, crew: p.crew.filter(x => x !== crewId) } : p));
  };

  const addShift    = (s) => setShifts(ss => [{ ...s, id: uid() }, ...ss]);
  const updateShift = (s) => setShifts(ss => ss.map(x => x.id === s.id ? s : x));
  const deleteShift = (id) => setShifts(ss => ss.filter(x => x.id !== id));

  const addInvoice    = (i) => setInvoices(is => [{ ...i, id: uid() }, ...is]);
  const updateInvoice = (i) => setInvoices(is => is.map(x => x.id === i.id ? i : x));
  const deleteInvoice = (id) => setInvoices(is => is.filter(x => x.id !== id));

  const addMessage  = (m) => setMessages(ms => [{ ...m, id: uid(), ts: new Date().toISOString(), read: false, replies:[] }, ...ms]);
  const markRead    = (id) => setMessages(ms => ms.map(m => m.id === id ? { ...m, read: true } : m));
  const deleteMsg   = (id) => setMessages(ms => ms.filter(x => x.id !== id));

  return {
    projects, crew, shifts, invoices, messages,
    addProject, updateProject, deleteProject,
    addCrew, updateCrew, deleteCrew,
    assignCrewToProject, removeCrewFromProject,
    addShift, updateShift, deleteShift,
    addInvoice, updateInvoice, deleteInvoice,
    addMessage, markRead, deleteMsg,
  };
};

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────
const PressCard = ({ onPress, style, children }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const glow  = useRef(new Animated.Value(0)).current;
  const onIn  = () => Animated.parallel([
    Animated.spring(scale, { toValue:0.97, useNativeDriver:true, speed:40, bounciness:4 }),
    Animated.timing(glow,  { toValue:1,    useNativeDriver:false, duration:120 }),
  ]).start();
  const onOut = () => Animated.parallel([
    Animated.spring(scale, { toValue:1,    useNativeDriver:true, speed:30, bounciness:6 }),
    Animated.timing(glow,  { toValue:0,    useNativeDriver:false, duration:200 }),
  ]).start();
  const borderColor = glow.interpolate({ inputRange:[0,1], outputRange:[C.border, C.gold + '55'] });
  return (
    <TouchableOpacity activeOpacity={1} onPressIn={onIn} onPressOut={onOut} onPress={onPress}>
      <Animated.View style={[{ transform:[{scale}], borderColor, borderWidth:1, borderRadius:16, overflow:'hidden' }, style]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

const Badge = ({ label, color = C.gold, bg }) => (
  <View style={{ backgroundColor: bg || color + '22', borderRadius:20, paddingHorizontal:10, paddingVertical:3 }}>
    <Text style={{ color, fontSize:11, fontWeight:'700', textTransform:'uppercase', letterSpacing:0.6 }}>{label}</Text>
  </View>
);

const StatusPicker = ({ value, options, onChange, style }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={style}>
    {options.map(opt => (
      <TouchableOpacity key={opt.value} onPress={() => onChange(opt.value)}
        style={{ marginRight:8, paddingHorizontal:14, paddingVertical:7, borderRadius:20,
          backgroundColor: value === opt.value ? opt.color : C.muted,
          borderWidth:1, borderColor: value === opt.value ? opt.color : 'transparent' }}>
        <Text style={{ color: value === opt.value ? C.bg : C.sub, fontSize:12, fontWeight:'700' }}>{opt.label}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>
);

const Avatar = ({ initials, color = C.gold, size = 36 }) => (
  <View style={{ width:size, height:size, borderRadius:size/2, backgroundColor:color+'33',
    borderWidth:2, borderColor:color, alignItems:'center', justifyContent:'center' }}>
    <Text style={{ color, fontSize: size * 0.33, fontWeight:'800' }}>{initials}</Text>
  </View>
);

const AvatarStack = ({ ids, crew, limit = 4 }) => {
  const shown = ids.slice(0, limit);
  const extra = ids.length - limit;
  return (
    <View style={{ flexDirection:'row', alignItems:'center' }}>
      {shown.map((id, i) => {
        const m = crew.find(c => c.id === id);
        if (!m) return null;
        const col = ACCENT_OPTIONS[i % ACCENT_OPTIONS.length];
        return (
          <View key={id} style={{ marginLeft: i === 0 ? 0 : -10, borderWidth:2, borderColor:C.surface, borderRadius:18 }}>
            <Avatar initials={m.avatar} color={col} size={28} />
          </View>
        );
      })}
      {extra > 0 && (
        <View style={{ marginLeft:-10, width:28, height:28, borderRadius:14, backgroundColor:C.muted,
          borderWidth:2, borderColor:C.surface, alignItems:'center', justifyContent:'center' }}>
          <Text style={{ color:C.sub, fontSize:10, fontWeight:'700' }}>+{extra}</Text>
        </View>
      )}
    </View>
  );
};

const SearchBar = ({ value, onChange, placeholder }) => (
  <View style={{ flexDirection:'row', alignItems:'center', backgroundColor:C.card,
    borderRadius:12, borderWidth:1, borderColor:C.border, paddingHorizontal:14, marginBottom:12 }}>
    <Text style={{ color:C.sub, fontSize:16, marginRight:8 }}>?</Text>
    <TextInput value={value} onChangeText={onChange} placeholder={placeholder || 'Search...'}
      placeholderTextColor={C.sub} style={{ flex:1, color:C.text, fontSize:14, paddingVertical:10 }} />
    {value.length > 0 && (
      <TouchableOpacity onPress={() => onChange('')}>
        <Text style={{ color:C.sub, fontSize:18, paddingLeft:8 }}>x</Text>
      </TouchableOpacity>
    )}
  </View>
);

const SectionHdr = ({ title, action, actionLabel }) => (
  <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
    <Text style={{ color:C.sub, fontSize:11, fontWeight:'700', textTransform:'uppercase', letterSpacing:1.2 }}>{title}</Text>
    {action && <TouchableOpacity onPress={action}><Text style={{ color:C.gold, fontSize:12, fontWeight:'700' }}>{actionLabel || 'See all'}</Text></TouchableOpacity>}
  </View>
);

const Empty = ({ icon, title, sub, action, actionLabel }) => (
  <View style={{ alignItems:'center', paddingVertical:48 }}>
    <Text style={{ fontSize:42, marginBottom:12 }}>{icon}</Text>
    <Text style={{ color:C.text, fontSize:18, fontWeight:'700', marginBottom:6, textAlign:'center' }}>{title}</Text>
    <Text style={{ color:C.sub, fontSize:14, textAlign:'center', maxWidth:240, lineHeight:21, marginBottom:action?20:0 }}>{sub}</Text>
    {action && (
      <TouchableOpacity onPress={action} style={{ backgroundColor:C.gold, borderRadius:22, paddingHorizontal:22, paddingVertical:10 }}>
        <Text style={{ color:C.bg, fontWeight:'800', fontSize:14 }}>{actionLabel}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const Sheet = ({ visible, onClose, title, children }) => (
  <Modal visible={visible} animationType="slide" transparent>
    <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{ flex:1 }}>
      <View style={{ flex:1, backgroundColor:'rgba(0,0,0,0.7)', justifyContent:'flex-end' }}>
        <View style={{ backgroundColor:C.surface, borderTopLeftRadius:24, borderTopRightRadius:24,
          maxHeight: SH * 0.92, paddingBottom:32 }}>
          <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between',
            paddingHorizontal:20, paddingVertical:16, borderBottomWidth:1, borderBottomColor:C.border }}>
            <Text style={{ color:C.text, fontSize:17, fontWeight:'800' }}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={{ backgroundColor:C.muted, width:32, height:32,
              borderRadius:16, alignItems:'center', justifyContent:'center' }}>
              <Text style={{ color:C.sub, fontSize:16, fontWeight:'700' }}>x</Text>
            </TouchableOpacity>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ padding:20 }}>
            {children}
          </ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  </Modal>
);

const Field = ({ label, children }) => (
  <View style={{ marginBottom:16 }}>
    <Text style={{ color:C.sub, fontSize:11, fontWeight:'700', textTransform:'uppercase',
      letterSpacing:0.8, marginBottom:6 }}>{label}</Text>
    {children}
  </View>
);

const TInput = ({ value, onChangeText, placeholder, multiline, keyboardType }) => (
  <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder}
    placeholderTextColor={C.sub} multiline={multiline} keyboardType={keyboardType}
    style={{ backgroundColor:C.card, borderRadius:10, borderWidth:1, borderColor:C.border,
      color:C.text, padding:12, fontSize:14, minHeight: multiline ? 80 : undefined, textAlignVertical: multiline ? 'top' : undefined }} />
);

const Btn = ({ label, onPress, color = C.gold, style }) => (
  <TouchableOpacity onPress={onPress} style={[{ backgroundColor:color, borderRadius:14,
    paddingVertical:14, alignItems:'center' }, style]}>
    <Text style={{ color: color === C.gold ? C.bg : C.text, fontWeight:'800', fontSize:15 }}>{label}</Text>
  </TouchableOpacity>
);

const GhostBtn = ({ label, onPress, color = C.gold, style }) => (
  <TouchableOpacity onPress={onPress} style={[{ borderRadius:14, paddingVertical:12,
    alignItems:'center', borderWidth:1.5, borderColor:color }, style]}>
    <Text style={{ color, fontWeight:'700', fontSize:14 }}>{label}</Text>
  </TouchableOpacity>
);

const ProgressBar = ({ value, total, color = C.gold, height = 6 }) => {
  const pct = total > 0 ? clamp(value / total, 0, 1) : 0;
  return (
    <View style={{ height, backgroundColor:C.muted, borderRadius:height/2, overflow:'hidden' }}>
      <View style={{ width: (pct * 100) + '%', height:'100%', backgroundColor:color, borderRadius:height/2 }} />
    </View>
  );
};

const AnimBar = ({ value, max, color = C.gold, label, subLabel, delay = 0 }) => {
  const anim = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(anim, { toValue:1, duration:700, delay, useNativeDriver:false }).start();
  }, []);
  const pct = max > 0 ? clamp(value / max, 0, 1) : 0;
  const w = anim.interpolate({ inputRange:[0,1], outputRange:['0%', (pct*100)+'%'] });
  return (
    <View style={{ marginBottom:14 }}>
      <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:5 }}>
        <Text style={{ color:C.text, fontSize:13, fontWeight:'600' }}>{label}</Text>
        <Text style={{ color:color, fontSize:13, fontWeight:'700' }}>{subLabel}</Text>
      </View>
      <View style={{ height:10, backgroundColor:C.muted, borderRadius:5, overflow:'hidden' }}>
        <Animated.View style={{ width:w, height:'100%', backgroundColor:color, borderRadius:5 }} />
      </View>
    </View>
  );
};

const Divider = ({ style }) => <View style={[{ height:1, backgroundColor:C.border }, style]} />;

const StatTile = ({ label, value, color = C.gold, sub, onPress }) => (
  <TouchableOpacity onPress={onPress} style={{ flex:1, backgroundColor:C.card, borderRadius:14,
    padding:14, borderWidth:1, borderColor:C.border, alignItems:'flex-start' }}>
    <Text style={{ color:color, fontSize:22, fontWeight:'900', marginBottom:2 }}>{value}</Text>
    <Text style={{ color:C.text, fontSize:12, fontWeight:'700', marginBottom:2 }}>{label}</Text>
    {sub && <Text style={{ color:C.sub, fontSize:11 }}>{sub}</Text>}
  </TouchableOpacity>
);

const ColourPicker = ({ value, onChange }) => (
  <View style={{ flexDirection:'row', flexWrap:'wrap' }}>
    {ACCENT_OPTIONS.map(col => (
      <TouchableOpacity key={col} onPress={() => onChange(col)}
        style={{ width:36, height:36, borderRadius:18, backgroundColor:col, margin:4,
          borderWidth: value===col ? 3 : 0, borderColor:C.text,
          alignItems:'center', justifyContent:'center' }}>
        {value===col && <View style={{ width:10, height:10, borderRadius:5, backgroundColor:C.text }} />}
      </TouchableOpacity>
    ))}
  </View>
);


// ─── HOME SCREEN ─────────────────────────────────────────────────────────────
const HomeScreen = ({ store, navigate }) => {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(() => { setRefreshing(true); setTimeout(() => setRefreshing(false), 1000); }, []);

  const { projects, crew, invoices, shifts } = store;
  const totalBudget = projects.reduce((s, p) => s + p.budget, 0);
  const totalSpent  = projects.reduce((s, p) => s + p.spent, 0);
  const burnPct     = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0;
  const activeProj  = projects.filter(p => p.status === 'active').length;
  const overdue     = invoices.filter(i => i.status === 'overdue').length;
  const unreadMsgs  = store.messages.filter(m => !m.read).length;

  const upcoming = [...shifts]
    .filter(s => s.date >= today())
    .sort((a,b) => a.date.localeCompare(b.date))
    .slice(0, 3);

  const recentInv = [...invoices]
    .sort((a,b) => b.issueDate.localeCompare(a.issueDate))
    .slice(0, 3);

  return (
    <ScrollView style={{ flex:1, backgroundColor:C.bg }}
      contentContainerStyle={{ paddingTop:56, paddingBottom:120 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.gold} />}>
      <StatusBar barStyle="light-content" />

      <View style={{ paddingHorizontal:20, marginBottom:24 }}>
        <Text style={{ color:C.sub, fontSize:13, fontWeight:'600', letterSpacing:0.5 }}>CREWDESK</Text>
        <Text style={{ color:C.text, fontSize:28, fontWeight:'900', marginTop:2 }}>Command Centre</Text>
        <Text style={{ color:C.sub, fontSize:14, marginTop:4 }}>
          {activeProj} active {activeProj === 1 ? 'project' : 'projects'} in production
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal:20, marginBottom:24 }}>
        <StatTile label="Active" value={activeProj} color={C.teal} sub="projects" onPress={() => navigate('Projects')} style={{ marginRight:10 }} />
        <StatTile label="Crew" value={crew.length} color={C.purple} sub="members" onPress={() => navigate('Crew')} style={{ marginRight:10 }} />
        <StatTile label="Upcoming" value={upcoming.length} color={C.blue} sub="shoot days" onPress={() => navigate('Schedule')} style={{ marginRight:10 }} />
        {overdue > 0 && <StatTile label="Overdue" value={overdue} color={C.red} sub="invoices" onPress={() => navigate('Invoices')} style={{ marginRight:10 }} />}
        {unreadMsgs > 0 && <StatTile label="Unread" value={unreadMsgs} color={C.gold} sub="messages" onPress={() => navigate('Messages')} />}
      </ScrollView>

      <View style={{ marginHorizontal:20, marginBottom:24 }}>
        <PressCard onPress={() => navigate('Reports')} style={{ backgroundColor:C.card, padding:20 }}>
          <View style={{ flexDirection:'row', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
            <View>
              <Text style={{ color:C.sub, fontSize:11, fontWeight:'700', textTransform:'uppercase', letterSpacing:1 }}>Portfolio Burn</Text>
              <Text style={{ color:C.text, fontSize:22, fontWeight:'900', marginTop:4 }}>{fmtGBP(totalSpent)}</Text>
              <Text style={{ color:C.sub, fontSize:13, marginTop:2 }}>of {fmtGBP(totalBudget)} total budget</Text>
            </View>
            <Text style={{ color: burnPct > 80 ? C.red : burnPct > 60 ? C.gold : C.green, fontSize:44, fontWeight:'900', lineHeight:48 }}>{burnPct}%</Text>
          </View>
          <ProgressBar value={totalSpent} total={totalBudget}
            color={ burnPct > 80 ? C.red : burnPct > 60 ? C.gold : C.green } height={8} />
        </PressCard>
      </View>

      <View style={{ paddingHorizontal:20, marginBottom:20 }}>
        <SectionHdr title="Active Projects" action={() => navigate('Projects')} actionLabel="All projects" />
        {projects.filter(p => p.status === 'active').map(p => {
          const pct = p.budget > 0 ? Math.round((p.spent / p.budget) * 100) : 0;
          return (
            <PressCard key={p.id} onPress={() => navigate('Projects')} style={{ backgroundColor:C.card, padding:16, marginBottom:10 }}>
              <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                <View style={{ flex:1 }}>
                  <Text style={{ color:C.text, fontSize:15, fontWeight:'800' }}>{p.name}</Text>
                  <Text style={{ color:C.sub, fontSize:12, marginTop:2 }}>{p.type} - {p.client}</Text>
                </View>
                <View style={{ width:8, height:8, borderRadius:4, backgroundColor:p.accent, marginLeft:12 }} />
              </View>
              <ProgressBar value={p.spent} total={p.budget} color={pct>80?C.red:p.accent} height={5} />
              <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop:8, alignItems:'center' }}>
                <AvatarStack ids={p.crew} crew={crew} />
                <Text style={{ color:C.sub, fontSize:12 }}>{fmtGBP(p.spent)} / {fmtGBP(p.budget)}</Text>
              </View>
            </PressCard>
          );
        })}
      </View>

      {upcoming.length > 0 && (
        <View style={{ paddingHorizontal:20, marginBottom:20 }}>
          <SectionHdr title="Next Up" action={() => navigate('Schedule')} actionLabel="Full schedule" />
          {upcoming.map(s => {
            const proj = projects.find(p => p.id === s.projectId);
            return (
              <PressCard key={s.id} onPress={() => navigate('Schedule')}
                style={{ backgroundColor:C.card, padding:14, marginBottom:8 }}>
                <View style={{ flexDirection:'row', alignItems:'center' }}>
                  <View style={{ width:3, borderRadius:2, alignSelf:'stretch', backgroundColor: proj ? proj.accent : C.gold, marginRight:12 }} />
                  <View style={{ flex:1 }}>
                    <Text style={{ color:C.text, fontSize:14, fontWeight:'700' }}>{s.title}</Text>
                    <Text style={{ color:C.sub, fontSize:12, marginTop:2 }}>{fmtDate(s.date)} - {s.callTime} call</Text>
                    <Text style={{ color:C.sub, fontSize:12 }}>{s.location}</Text>
                  </View>
                  <Badge label={s.status} color={ s.status==='confirmed' ? C.green : C.gold } />
                </View>
              </PressCard>
            );
          })}
        </View>
      )}

      <View style={{ paddingHorizontal:20, marginBottom:20 }}>
        <SectionHdr title="Recent Invoices" action={() => navigate('Invoices')} actionLabel="All invoices" />
        {recentInv.map(inv => {
          const col = inv.status==='paid' ? C.green : inv.status==='overdue' ? C.red : inv.status==='sent' ? C.blue : C.sub;
          return (
            <PressCard key={inv.id} onPress={() => navigate('Invoices')}
              style={{ backgroundColor:C.card, padding:14, marginBottom:8 }}>
              <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
                <View>
                  <Text style={{ color:C.text, fontSize:14, fontWeight:'700' }}>{inv.number}</Text>
                  <Text style={{ color:C.sub, fontSize:12, marginTop:2 }}>{inv.client} - {fmtDate(inv.issueDate)}</Text>
                </View>
                <View style={{ alignItems:'flex-end' }}>
                  <Text style={{ color:C.text, fontSize:15, fontWeight:'800' }}>{fmtGBP(inv.amount)}</Text>
                  <Badge label={inv.status} color={col} style={{ marginTop:4 }} />
                </View>
              </View>
            </PressCard>
          );
        })}
      </View>
    </ScrollView>
  );
};


// ─── PROJECTS SCREEN ─────────────────────────────────────────────────────────
const PROJECT_STATUS_OPTIONS = [
  { value:'all',       label:'All',       color:C.sub },
  { value:'active',    label:'Active',    color:C.teal },
  { value:'pending',   label:'Pending',   color:C.gold },
  { value:'completed', label:'Completed', color:C.green },
];
const PROJ_STATUSES = [
  { value:'active',    label:'Active',    color:C.teal },
  { value:'pending',   label:'Pending',   color:C.gold },
  { value:'completed', label:'Completed', color:C.green },
  { value:'on-hold',   label:'On Hold',   color:C.orange },
];
const emptyProj = () => ({ name:'', type:'', client:'', budget:'', spent:'', status:'active', accent:C.gold, location:'', notes:'', startDate:'', endDate:'' });

const ProjectsScreen = ({ store }) => {
  const { projects, crew, addProject, updateProject, deleteProject, assignCrewToProject, removeCrewFromProject } = store;
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sheet, setSheet]   = useState(null);
  const [form, setForm]     = useState(emptyProj());
  const [crewSheet, setCrewSheet] = useState(null);

  const visible = projects.filter(p => {
    const matchFilter = filter === 'all' || p.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.client.toLowerCase().includes(q) || p.type.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const openAdd  = () => { setForm(emptyProj()); setSheet('add'); };
  const openEdit = (p) => { setForm({ ...p, budget: String(p.budget), spent: String(p.spent) }); setSheet(p); };
  const closeSheet = () => setSheet(null);

  const save = () => {
    if (!form.name.trim()) { Alert.alert('Required', 'Project name is required'); return; }
    const data = { ...form, budget: Number(form.budget)||0, spent: Number(form.spent)||0 };
    if (sheet === 'add') addProject(data);
    else updateProject({ ...sheet, ...data });
    closeSheet();
  };

  const del = (p) => {
    Alert.alert('Delete Project', 'Remove ' + p.name + '? This cannot be undone.', [
      { text:'Cancel', style:'cancel' },
      { text:'Delete', style:'destructive', onPress: () => deleteProject(p.id) },
    ]);
  };

  const statusCol = (s) => ({ active:C.teal, pending:C.gold, completed:C.green, 'on-hold':C.orange }[s] || C.sub);

  return (
    <View style={{ flex:1, backgroundColor:C.bg }}>
      <View style={{ paddingTop:56, paddingHorizontal:20, paddingBottom:12 }}>
        <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <Text style={{ color:C.text, fontSize:26, fontWeight:'900' }}>Projects</Text>
          <TouchableOpacity onPress={openAdd} style={{ backgroundColor:C.gold, borderRadius:22,
            paddingHorizontal:16, paddingVertical:8 }}>
            <Text style={{ color:C.bg, fontWeight:'800', fontSize:13 }}>+ New</Text>
          </TouchableOpacity>
        </View>
        <SearchBar value={search} onChange={setSearch} placeholder="Search projects..." />
        <StatusPicker value={filter} options={PROJECT_STATUS_OPTIONS} onChange={setFilter} style={{ marginBottom:4 }} />
      </View>

      <FlatList data={visible} keyExtractor={i => i.id} contentContainerStyle={{ paddingHorizontal:20, paddingBottom:120 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<Empty icon="[P]" title="No projects found" sub="Try adjusting your search or add a new project." action={openAdd} actionLabel="Add Project" />}
        renderItem={({ item:p }) => {
          const pct = p.budget > 0 ? Math.round((p.spent/p.budget)*100) : 0;
          const col = statusCol(p.status);
          return (
            <PressCard onPress={() => openEdit(p)} style={{ backgroundColor:C.card, marginBottom:12 }}>
              <View style={{ padding:16 }}>
                <View style={{ flexDirection:'row', alignItems:'flex-start', justifyContent:'space-between', marginBottom:10 }}>
                  <View style={{ flex:1, marginRight:12 }}>
                    <View style={{ flexDirection:'row', alignItems:'center', marginBottom:4 }}>
                      <View style={{ width:10, height:10, borderRadius:5, backgroundColor:p.accent, marginRight:8 }} />
                      <Text style={{ color:C.text, fontSize:16, fontWeight:'800' }}>{p.name}</Text>
                    </View>
                    <Text style={{ color:C.sub, fontSize:13 }}>{p.type}</Text>
                    <Text style={{ color:C.sub, fontSize:12, marginTop:2 }}>{p.client}</Text>
                  </View>
                  <Badge label={p.status} color={col} />
                </View>
                <ProgressBar value={p.spent} total={p.budget} color={pct>80?C.red:p.accent} height={6} />
                <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop:8, alignItems:'center' }}>
                  <AvatarStack ids={p.crew} crew={crew} limit={5} />
                  <Text style={{ color:C.sub, fontSize:12 }}>{fmtGBP(p.spent)} / {fmtGBP(p.budget)}</Text>
                </View>
                {p.location ? <Text style={{ color:C.muted, fontSize:11, marginTop:6 }}>{p.location}</Text> : null}
              </View>
              <Divider />
              <View style={{ flexDirection:'row' }}>
                <TouchableOpacity onPress={() => setCrewSheet(p.id)} style={{ flex:1, paddingVertical:11, alignItems:'center' }}>
                  <Text style={{ color:C.teal, fontSize:12, fontWeight:'700' }}>Manage Crew</Text>
                </TouchableOpacity>
                <View style={{ width:1, backgroundColor:C.border }} />
                <TouchableOpacity onPress={() => openEdit(p)} style={{ flex:1, paddingVertical:11, alignItems:'center' }}>
                  <Text style={{ color:C.gold, fontSize:12, fontWeight:'700' }}>Edit</Text>
                </TouchableOpacity>
                <View style={{ width:1, backgroundColor:C.border }} />
                <TouchableOpacity onPress={() => del(p)} style={{ flex:1, paddingVertical:11, alignItems:'center' }}>
                  <Text style={{ color:C.red, fontSize:12, fontWeight:'700' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </PressCard>
          );
        }}
      />

      <Sheet visible={!!sheet} onClose={closeSheet} title={sheet === 'add' ? 'New Project' : 'Edit Project'}>
        <Field label="Project Name"><TInput value={form.name} onChangeText={v => setForm(f=>({...f,name:v}))} placeholder="e.g. Midnight Runner" /></Field>
        <Field label="Type"><TInput value={form.type} onChangeText={v => setForm(f=>({...f,type:v}))} placeholder="e.g. Feature Film" /></Field>
        <Field label="Client"><TInput value={form.client} onChangeText={v => setForm(f=>({...f,client:v}))} placeholder="e.g. Apex Studios" /></Field>
        <Field label="Location"><TInput value={form.location} onChangeText={v => setForm(f=>({...f,location:v}))} placeholder="e.g. London, UK" /></Field>
        <View style={{ flexDirection:'row', marginBottom:16 }}>
          <View style={{ flex:1, marginRight:8 }}>
            <Field label="Total Budget (GBP)"><TInput value={form.budget} onChangeText={v => setForm(f=>({...f,budget:v}))} placeholder="0" keyboardType="numeric" /></Field>
          </View>
          <View style={{ flex:1 }}>
            <Field label="Spent (GBP)"><TInput value={form.spent} onChangeText={v => setForm(f=>({...f,spent:v}))} placeholder="0" keyboardType="numeric" /></Field>
          </View>
        </View>
        <Field label="Start Date"><TInput value={form.startDate} onChangeText={v => setForm(f=>({...f,startDate:v}))} placeholder="YYYY-MM-DD" /></Field>
        <Field label="End Date"><TInput value={form.endDate} onChangeText={v => setForm(f=>({...f,endDate:v}))} placeholder="YYYY-MM-DD" /></Field>
        <Field label="Status"><StatusPicker value={form.status} options={PROJ_STATUSES} onChange={v => setForm(f=>({...f,status:v}))} /></Field>
        <Field label="Accent Colour"><ColourPicker value={form.accent} onChange={v => setForm(f=>({...f,accent:v}))} /></Field>
        <Field label="Notes"><TInput value={form.notes} onChangeText={v => setForm(f=>({...f,notes:v}))} placeholder="Production notes..." multiline /></Field>
        <Btn label="Save Project" onPress={save} style={{ marginTop:8 }} />
        {sheet !== 'add' && <GhostBtn label="Delete Project" onPress={() => { closeSheet(); del(sheet); }} color={C.red} style={{ marginTop:10 }} />}
      </Sheet>

      <Sheet visible={!!crewSheet} onClose={() => setCrewSheet(null)} title="Manage Crew">
        {crewSheet && crew.map(c => {
          const proj = projects.find(p => p.id === crewSheet);
          const assigned = proj && proj.crew.includes(c.id);
          return (
            <View key={c.id} style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between',
              paddingVertical:12, borderBottomWidth:1, borderBottomColor:C.border }}>
              <View style={{ flexDirection:'row', alignItems:'center' }}>
                <Avatar initials={c.avatar} color={C.gold} size={36} />
                <View style={{ marginLeft:10 }}>
                  <Text style={{ color:C.text, fontSize:14, fontWeight:'700' }}>{c.name}</Text>
                  <Text style={{ color:C.sub, fontSize:12 }}>{c.role}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => {
                if (assigned) removeCrewFromProject(c.id, crewSheet);
                else assignCrewToProject(c.id, crewSheet);
              }} style={{ backgroundColor: assigned ? C.redBg : C.tealBg,
                borderRadius:20, paddingHorizontal:14, paddingVertical:6,
                borderWidth:1, borderColor: assigned ? C.red : C.teal }}>
                <Text style={{ color: assigned ? C.red : C.teal, fontSize:12, fontWeight:'700' }}>
                  {assigned ? 'Remove' : 'Add'}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
        <Btn label="Done" onPress={() => setCrewSheet(null)} style={{ marginTop:16 }} />
      </Sheet>
    </View>
  );
};


// ─── CREW SCREEN ─────────────────────────────────────────────────────────────
const CREW_STATUSES = [
  { value:'active',   label:'Active',   color:C.green },
  { value:'freelance',label:'Freelance',color:C.teal },
  { value:'inactive', label:'Inactive', color:C.sub },
];
const CREW_FILTER_OPTIONS = [
  { value:'all',      label:'All',      color:C.sub },
  { value:'active',   label:'Active',   color:C.green },
  { value:'freelance',label:'Freelance',color:C.teal },
  { value:'inactive', label:'Inactive', color:C.sub },
];
const emptyCrew = () => ({ name:'', role:'', email:'', phone:'', rate:'', rateUnit:'day', status:'active', bio:'', skills:'' });

const CrewScreen = ({ store }) => {
  const { crew, projects, addCrew, updateCrew, deleteCrew } = store;
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sheet, setSheet]   = useState(null);
  const [form, setForm]     = useState(emptyCrew());

  const visible = crew.filter(c => {
    const matchFilter = filter === 'all' || c.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || c.name.toLowerCase().includes(q) || c.role.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const openAdd  = () => { setForm(emptyCrew()); setSheet('add'); };
  const openEdit = (c) => { setForm({ ...c, rate: String(c.rate), skills: (c.skills||[]).join(', ') }); setSheet(c); };
  const closeSheet = () => setSheet(null);

  const save = () => {
    if (!form.name.trim()) { Alert.alert('Required', 'Name is required'); return; }
    const data = { ...form, rate: Number(form.rate)||0, skills: form.skills.split(',').map(s=>s.trim()).filter(Boolean) };
    if (sheet === 'add') addCrew(data);
    else updateCrew({ ...sheet, ...data });
    closeSheet();
  };

  const del = (c) => {
    Alert.alert('Remove Crew Member', 'Remove ' + c.name + '?', [
      { text:'Cancel', style:'cancel' },
      { text:'Remove', style:'destructive', onPress: () => deleteCrew(c.id) },
    ]);
  };

  const statusColor = (s) => ({ active:C.green, freelance:C.teal, inactive:C.sub }[s] || C.sub);

  return (
    <View style={{ flex:1, backgroundColor:C.bg }}>
      <View style={{ paddingTop:56, paddingHorizontal:20, paddingBottom:12 }}>
        <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <Text style={{ color:C.text, fontSize:26, fontWeight:'900' }}>Crew</Text>
          <TouchableOpacity onPress={openAdd} style={{ backgroundColor:C.purple, borderRadius:22, paddingHorizontal:16, paddingVertical:8 }}>
            <Text style={{ color:C.text, fontWeight:'800', fontSize:13 }}>+ Add</Text>
          </TouchableOpacity>
        </View>
        <SearchBar value={search} onChange={setSearch} placeholder="Search crew..." />
        <StatusPicker value={filter} options={CREW_FILTER_OPTIONS} onChange={setFilter} style={{ marginBottom:4 }} />
      </View>

      <FlatList data={visible} keyExtractor={i => i.id} contentContainerStyle={{ paddingHorizontal:20, paddingBottom:120 }}
        ListEmptyComponent={<Empty icon="[C]" title="No crew members" sub="Add your first crew member to get started." action={openAdd} actionLabel="Add Crew" />}
        renderItem={({ item:c }) => {
          const memberProjects = projects.filter(p => p.crew.includes(c.id));
          return (
            <PressCard onPress={() => openEdit(c)} style={{ backgroundColor:C.card, marginBottom:10 }}>
              <View style={{ padding:16 }}>
                <View style={{ flexDirection:'row', alignItems:'flex-start' }}>
                  <Avatar initials={c.avatar || c.name.slice(0,2).toUpperCase()} color={statusColor(c.status)} size={48} />
                  <View style={{ flex:1, marginLeft:14 }}>
                    <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
                      <Text style={{ color:C.text, fontSize:16, fontWeight:'800' }}>{c.name}</Text>
                      <Badge label={c.status} color={statusColor(c.status)} />
                    </View>
                    <Text style={{ color:C.sub, fontSize:13, marginTop:2 }}>{c.role}</Text>
                    <Text style={{ color:C.sub, fontSize:12, marginTop:2 }}>{c.email}</Text>
                    <View style={{ flexDirection:'row', alignItems:'center', marginTop:6 }}>
                      <Text style={{ color:C.gold, fontSize:13, fontWeight:'700' }}>
                        {fmtGBP(c.rate)} / {c.rateUnit}
                      </Text>
                      {memberProjects.length > 0 && (
                        <Text style={{ color:C.sub, fontSize:12, marginLeft:12 }}>
                          {memberProjects.length} {memberProjects.length === 1 ? 'project' : 'projects'}
                        </Text>
                      )}
                    </View>
                  </View>
                </View>
                {(c.skills||[]).length > 0 && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop:10 }}>
                    {(c.skills||[]).map((sk,i) => (
                      <View key={i} style={{ backgroundColor:C.muted, borderRadius:20, paddingHorizontal:10, paddingVertical:4, marginRight:6 }}>
                        <Text style={{ color:C.sub, fontSize:11, fontWeight:'600' }}>{sk}</Text>
                      </View>
                    ))}
                  </ScrollView>
                )}
                {memberProjects.length > 0 && (
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop:8 }}>
                    {memberProjects.map(p => (
                      <View key={p.id} style={{ flexDirection:'row', alignItems:'center', backgroundColor:p.accent+'22',
                        borderRadius:20, paddingHorizontal:10, paddingVertical:4, marginRight:6,
                        borderWidth:1, borderColor:p.accent+'44' }}>
                        <View style={{ width:6, height:6, borderRadius:3, backgroundColor:p.accent, marginRight:6 }} />
                        <Text style={{ color:p.accent, fontSize:11, fontWeight:'600' }}>{p.name}</Text>
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>
              <Divider />
              <View style={{ flexDirection:'row' }}>
                <TouchableOpacity onPress={() => openEdit(c)} style={{ flex:1, paddingVertical:11, alignItems:'center' }}>
                  <Text style={{ color:C.gold, fontSize:12, fontWeight:'700' }}>Edit</Text>
                </TouchableOpacity>
                <View style={{ width:1, backgroundColor:C.border }} />
                <TouchableOpacity onPress={() => del(c)} style={{ flex:1, paddingVertical:11, alignItems:'center' }}>
                  <Text style={{ color:C.red, fontSize:12, fontWeight:'700' }}>Remove</Text>
                </TouchableOpacity>
              </View>
            </PressCard>
          );
        }}
      />

      <Sheet visible={!!sheet} onClose={closeSheet} title={sheet === 'add' ? 'New Crew Member' : 'Edit Crew Member'}>
        <Field label="Full Name"><TInput value={form.name} onChangeText={v => setForm(f=>({...f,name:v}))} placeholder="e.g. Sophia Marlowe" /></Field>
        <Field label="Role / Department"><TInput value={form.role} onChangeText={v => setForm(f=>({...f,role:v}))} placeholder="e.g. Director" /></Field>
        <Field label="Email"><TInput value={form.email} onChangeText={v => setForm(f=>({...f,email:v}))} placeholder="name@email.com" /></Field>
        <Field label="Phone"><TInput value={form.phone} onChangeText={v => setForm(f=>({...f,phone:v}))} placeholder="+44..." /></Field>
        <View style={{ flexDirection:'row', marginBottom:16 }}>
          <View style={{ flex:2, marginRight:8 }}>
            <Field label="Day Rate (GBP)"><TInput value={form.rate} onChangeText={v => setForm(f=>({...f,rate:v}))} placeholder="0" keyboardType="numeric" /></Field>
          </View>
          <View style={{ flex:1 }}>
            <Field label="Unit">
              <View style={{ flexDirection:'row' }}>
                {['day','hour','week'].map(u => (
                  <TouchableOpacity key={u} onPress={() => setForm(f=>({...f,rateUnit:u}))}
                    style={{ flex:1, paddingVertical:8, borderRadius:8, marginRight:4,
                      backgroundColor: form.rateUnit===u ? C.gold : C.muted, alignItems:'center' }}>
                    <Text style={{ color: form.rateUnit===u ? C.bg : C.sub, fontSize:11, fontWeight:'700' }}>{u}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </Field>
          </View>
        </View>
        <Field label="Skills (comma separated)"><TInput value={form.skills} onChangeText={v => setForm(f=>({...f,skills:v}))} placeholder="Direction, Lighting, Camera..." /></Field>
        <Field label="Status"><StatusPicker value={form.status} options={CREW_STATUSES} onChange={v => setForm(f=>({...f,status:v}))} /></Field>
        <Field label="Bio"><TInput value={form.bio} onChangeText={v => setForm(f=>({...f,bio:v}))} placeholder="Short bio..." multiline /></Field>
        <Btn label="Save" onPress={save} style={{ marginTop:8 }} />
        {sheet !== 'add' && <GhostBtn label="Remove from Crew" onPress={() => { closeSheet(); del(sheet); }} color={C.red} style={{ marginTop:10 }} />}
      </Sheet>
    </View>
  );
};


// ─── SCHEDULE SCREEN ─────────────────────────────────────────────────────────
const SHIFT_STATUSES = [
  { value:'confirmed', label:'Confirmed', color:C.green },
  { value:'tentative', label:'Tentative', color:C.gold },
  { value:'cancelled', label:'Cancelled', color:C.red },
];
const SHIFT_FILTER_OPTIONS = [
  { value:'all',       label:'All',       color:C.sub },
  { value:'upcoming',  label:'Upcoming',  color:C.teal },
  { value:'confirmed', label:'Confirmed', color:C.green },
  { value:'tentative', label:'Tentative', color:C.gold },
];
const emptyShift = () => ({ projectId:'', title:'', date:'', callTime:'', wrapTime:'', location:'', status:'confirmed', notes:'', crew:[] });

const ScheduleScreen = ({ store }) => {
  const { shifts, projects, crew, addShift, updateShift, deleteShift } = store;
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sheet, setSheet]   = useState(null);
  const [form, setForm]     = useState(emptyShift());

  const sorted = [...shifts].sort((a,b) => a.date.localeCompare(b.date));
  const visible = sorted.filter(s => {
    if (filter === 'upcoming' && s.date < today()) return false;
    if (filter === 'confirmed' && s.status !== 'confirmed') return false;
    if (filter === 'tentative' && s.status !== 'tentative') return false;
    const q = search.toLowerCase();
    if (!q) return true;
    return s.title.toLowerCase().includes(q) || s.location.toLowerCase().includes(q);
  });

  const openAdd  = () => { setForm(emptyShift()); setSheet('add'); };
  const openEdit = (s) => { setForm({...s}); setSheet(s); };
  const closeSheet = () => setSheet(null);

  const save = () => {
    if (!form.title.trim()) { Alert.alert('Required', 'Title is required'); return; }
    if (sheet === 'add') addShift(form);
    else updateShift({ ...sheet, ...form });
    closeSheet();
  };
  const del = (s) => {
    Alert.alert('Delete Shift', 'Remove this shift?', [
      { text:'Cancel', style:'cancel' },
      { text:'Delete', style:'destructive', onPress: () => deleteShift(s.id) },
    ]);
  };
  const statusColor = (s) => ({ confirmed:C.green, tentative:C.gold, cancelled:C.red }[s] || C.sub);

  return (
    <View style={{ flex:1, backgroundColor:C.bg }}>
      <View style={{ paddingTop:56, paddingHorizontal:20, paddingBottom:12 }}>
        <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <Text style={{ color:C.text, fontSize:26, fontWeight:'900' }}>Schedule</Text>
          <TouchableOpacity onPress={openAdd} style={{ backgroundColor:C.blue, borderRadius:22, paddingHorizontal:16, paddingVertical:8 }}>
            <Text style={{ color:C.text, fontWeight:'800', fontSize:13 }}>+ Shift</Text>
          </TouchableOpacity>
        </View>
        <SearchBar value={search} onChange={setSearch} placeholder="Search shifts..." />
        <StatusPicker value={filter} options={SHIFT_FILTER_OPTIONS} onChange={setFilter} style={{ marginBottom:4 }} />
      </View>

      <FlatList data={visible} keyExtractor={i => i.id}
        contentContainerStyle={{ paddingHorizontal:20, paddingBottom:120 }}
        ListEmptyComponent={<Empty icon="[S]" title="No shifts" sub="Schedule your first shoot day or meeting." action={openAdd} actionLabel="Add Shift" />}
        renderItem={({ item:s }) => {
          const proj = projects.find(p => p.id === s.projectId);
          const sc = statusColor(s.status);
          const isPast = s.date < today();
          return (
            <PressCard onPress={() => openEdit(s)} style={{ backgroundColor: isPast ? C.surface : C.card, marginBottom:10, opacity: isPast ? 0.7 : 1 }}>
              <View style={{ padding:16 }}>
                <View style={{ flexDirection:'row', alignItems:'flex-start', justifyContent:'space-between' }}>
                  <View style={{ flex:1 }}>
                    <Text style={{ color:C.text, fontSize:15, fontWeight:'800', marginBottom:4 }}>{s.title}</Text>
                    <Text style={{ color: proj ? proj.accent : C.gold, fontSize:12, fontWeight:'700' }}>
                      {proj ? proj.name : 'No project'}
                    </Text>
                    <Text style={{ color:C.sub, fontSize:12, marginTop:4 }}>{fmtDate(s.date)}</Text>
                    <Text style={{ color:C.sub, fontSize:12 }}>
                      {s.callTime ? 'Call ' + s.callTime : ''}{s.wrapTime ? '  Wrap ' + s.wrapTime : ''}
                    </Text>
                    {s.location ? <Text style={{ color:C.sub, fontSize:12, marginTop:2 }}>{s.location}</Text> : null}
                  </View>
                  <Badge label={s.status} color={sc} />
                </View>
                {s.crew.length > 0 && (
                  <View style={{ marginTop:10 }}>
                    <AvatarStack ids={s.crew} crew={crew} limit={6} />
                  </View>
                )}
                {s.notes ? <Text style={{ color:C.sub, fontSize:12, marginTop:8, fontStyle:'italic' }}>{s.notes}</Text> : null}
              </View>
              <Divider />
              <View style={{ flexDirection:'row' }}>
                <TouchableOpacity onPress={() => openEdit(s)} style={{ flex:1, paddingVertical:11, alignItems:'center' }}>
                  <Text style={{ color:C.gold, fontSize:12, fontWeight:'700' }}>Edit</Text>
                </TouchableOpacity>
                <View style={{ width:1, backgroundColor:C.border }} />
                <TouchableOpacity onPress={() => del(s)} style={{ flex:1, paddingVertical:11, alignItems:'center' }}>
                  <Text style={{ color:C.red, fontSize:12, fontWeight:'700' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </PressCard>
          );
        }}
      />

      <Sheet visible={!!sheet} onClose={closeSheet} title={sheet === 'add' ? 'New Shift' : 'Edit Shift'}>
        <Field label="Title"><TInput value={form.title} onChangeText={v => setForm(f=>({...f,title:v}))} placeholder="e.g. Shoot Day 12 - Ext. Warehouse" /></Field>
        <Field label="Project">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {projects.map(p => (
              <TouchableOpacity key={p.id} onPress={() => setForm(f=>({...f,projectId:p.id}))}
                style={{ marginRight:8, paddingHorizontal:12, paddingVertical:6, borderRadius:20,
                  backgroundColor: form.projectId===p.id ? p.accent : C.muted,
                  borderWidth:1, borderColor: form.projectId===p.id ? p.accent : 'transparent' }}>
                <Text style={{ color: form.projectId===p.id ? C.bg : C.sub, fontSize:12, fontWeight:'700' }}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Field>
        <Field label="Date"><TInput value={form.date} onChangeText={v => setForm(f=>({...f,date:v}))} placeholder="YYYY-MM-DD" /></Field>
        <View style={{ flexDirection:'row', marginBottom:16 }}>
          <View style={{ flex:1, marginRight:8 }}>
            <Field label="Call Time"><TInput value={form.callTime} onChangeText={v => setForm(f=>({...f,callTime:v}))} placeholder="06:00" /></Field>
          </View>
          <View style={{ flex:1 }}>
            <Field label="Wrap Time"><TInput value={form.wrapTime} onChangeText={v => setForm(f=>({...f,wrapTime:v}))} placeholder="20:00" /></Field>
          </View>
        </View>
        <Field label="Location"><TInput value={form.location} onChangeText={v => setForm(f=>({...f,location:v}))} placeholder="e.g. Shepperton Studios" /></Field>
        <Field label="Status"><StatusPicker value={form.status} options={SHIFT_STATUSES} onChange={v => setForm(f=>({...f,status:v}))} /></Field>
        <Field label="Assign Crew">
          <View style={{ flexDirection:'row', flexWrap:'wrap' }}>
            {crew.map(c => {
              const sel = form.crew.includes(c.id);
              return (
                <TouchableOpacity key={c.id} onPress={() => {
                  setForm(f => ({ ...f, crew: sel ? f.crew.filter(x=>x!==c.id) : [...f.crew, c.id] }));
                }} style={{ flexDirection:'row', alignItems:'center', marginRight:8, marginBottom:8,
                  paddingHorizontal:10, paddingVertical:6, borderRadius:20,
                  backgroundColor: sel ? C.tealBg : C.muted,
                  borderWidth:1, borderColor: sel ? C.teal : 'transparent' }}>
                  <Avatar initials={c.avatar || c.name.slice(0,2)} color={sel ? C.teal : C.sub} size={18} />
                  <Text style={{ color: sel ? C.teal : C.sub, fontSize:12, fontWeight:'600', marginLeft:6 }}>{c.name.split(' ')[0]}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </Field>
        <Field label="Notes"><TInput value={form.notes} onChangeText={v => setForm(f=>({...f,notes:v}))} placeholder="Important notes for the crew..." multiline /></Field>
        <Btn label="Save Shift" onPress={save} style={{ marginTop:8 }} />
        {sheet !== 'add' && <GhostBtn label="Delete Shift" onPress={() => { closeSheet(); del(sheet); }} color={C.red} style={{ marginTop:10 }} />}
      </Sheet>
    </View>
  );
};


// ─── MESSAGES SCREEN ─────────────────────────────────────────────────────────
const MessagesScreen = ({ store }) => {
  const { messages, projects, crew, addMessage, markRead, deleteMsg } = store;
  const [search, setSearch] = useState('');
  const [filterProj, setFilterProj] = useState('all');
  const [compose, setCompose] = useState(false);
  const [msgText, setMsgText] = useState('');
  const [msgProj, setMsgProj] = useState('');
  const [msgFrom, setMsgFrom] = useState('');

  const visible = messages.filter(m => {
    if (filterProj !== 'all' && m.projectId !== filterProj) return false;
    if (!search) return true;
    const q = search.toLowerCase();
    return m.text.toLowerCase().includes(q) || m.from.toLowerCase().includes(q);
  }).sort((a,b) => b.ts.localeCompare(a.ts));

  const unread = messages.filter(m => !m.read).length;

  const send = () => {
    if (!msgText.trim()) { Alert.alert('Required', 'Message text is required'); return; }
    const sender = crew.find(c => c.id === msgFrom);
    addMessage({
      projectId: msgProj,
      from: sender ? sender.name : 'You',
      fromId: msgFrom,
      avatar: sender ? sender.avatar : 'ME',
      text: msgText.trim(),
    });
    setMsgText(''); setMsgProj(''); setMsgFrom('');
    setCompose(false);
  };

  const delMsg = (m) => {
    Alert.alert('Delete Message', 'Remove this message?', [
      { text:'Cancel', style:'cancel' },
      { text:'Delete', style:'destructive', onPress: () => deleteMsg(m.id) },
    ]);
  };

  const fmtTs = (ts) => {
    const d = new Date(ts);
    const now = new Date();
    const diff = Math.floor((now - d) / 60000);
    if (diff < 1) return 'Just now';
    if (diff < 60) return diff + 'm ago';
    if (diff < 1440) return Math.floor(diff/60) + 'h ago';
    return fmtDate(ts.split('T')[0]);
  };

  const projFilterOptions = [
    { value:'all', label:'All', color:C.sub },
    ...projects.map(p => ({ value:p.id, label:p.name, color:p.accent })),
  ];

  return (
    <View style={{ flex:1, backgroundColor:C.bg }}>
      <View style={{ paddingTop:56, paddingHorizontal:20, paddingBottom:12 }}>
        <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <View style={{ flexDirection:'row', alignItems:'center' }}>
            <Text style={{ color:C.text, fontSize:26, fontWeight:'900' }}>Messages</Text>
            {unread > 0 && (
              <View style={{ marginLeft:10, backgroundColor:C.red, borderRadius:12,
                paddingHorizontal:8, paddingVertical:2 }}>
                <Text style={{ color:C.text, fontSize:12, fontWeight:'800' }}>{unread}</Text>
              </View>
            )}
          </View>
          <TouchableOpacity onPress={() => setCompose(true)} style={{ backgroundColor:C.teal, borderRadius:22, paddingHorizontal:16, paddingVertical:8 }}>
            <Text style={{ color:C.bg, fontWeight:'800', fontSize:13 }}>+ New</Text>
          </TouchableOpacity>
        </View>
        <SearchBar value={search} onChange={setSearch} placeholder="Search messages..." />
        <StatusPicker value={filterProj} options={projFilterOptions} onChange={setFilterProj} style={{ marginBottom:4 }} />
      </View>

      <FlatList data={visible} keyExtractor={i => i.id}
        contentContainerStyle={{ paddingHorizontal:20, paddingBottom:120 }}
        ListEmptyComponent={<Empty icon="[M]" title="No messages" sub="Send the first message to your crew." action={() => setCompose(true)} actionLabel="Send Message" />}
        renderItem={({ item:m }) => {
          const proj = projects.find(p => p.id === m.projectId);
          return (
            <TouchableOpacity onPress={() => markRead(m.id)}
              style={{ backgroundColor: m.read ? C.card : C.surface, borderRadius:14,
                borderWidth:1, borderColor: m.read ? C.border : C.gold + '44',
                padding:14, marginBottom:8 }}>
              <View style={{ flexDirection:'row', alignItems:'flex-start' }}>
                <View style={{ position:'relative' }}>
                  <Avatar initials={m.avatar} color={proj ? proj.accent : C.gold} size={40} />
                  {!m.read && (
                    <View style={{ position:'absolute', top:-2, right:-2, width:10, height:10,
                      borderRadius:5, backgroundColor:C.red, borderWidth:2, borderColor:C.bg }} />
                  )}
                </View>
                <View style={{ flex:1, marginLeft:12 }}>
                  <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:3 }}>
                    <Text style={{ color:C.text, fontSize:14, fontWeight: m.read ? '600' : '800' }}>{m.from}</Text>
                    <Text style={{ color:C.sub, fontSize:11 }}>{fmtTs(m.ts)}</Text>
                  </View>
                  {proj && (
                    <View style={{ flexDirection:'row', alignItems:'center', marginBottom:4 }}>
                      <View style={{ width:6, height:6, borderRadius:3, backgroundColor:proj.accent, marginRight:5 }} />
                      <Text style={{ color:proj.accent, fontSize:11, fontWeight:'600' }}>{proj.name}</Text>
                    </View>
                  )}
                  <Text style={{ color: m.read ? C.sub : C.text, fontSize:13, lineHeight:18 }} numberOfLines={2}>{m.text}</Text>
                </View>
              </View>
              <View style={{ flexDirection:'row', justifyContent:'flex-end', marginTop:8 }}>
                {!m.read && (
                  <TouchableOpacity onPress={() => markRead(m.id)} style={{ marginRight:12 }}>
                    <Text style={{ color:C.teal, fontSize:12, fontWeight:'700' }}>Mark read</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={() => delMsg(m)}>
                  <Text style={{ color:C.red, fontSize:12, fontWeight:'700' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />

      <Sheet visible={compose} onClose={() => setCompose(false)} title="New Message">
        <Field label="From (Crew Member)">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {crew.map(c => (
              <TouchableOpacity key={c.id} onPress={() => setMsgFrom(c.id)}
                style={{ marginRight:8, paddingHorizontal:10, paddingVertical:6, borderRadius:20,
                  backgroundColor: msgFrom===c.id ? C.teal : C.muted,
                  borderWidth:1, borderColor: msgFrom===c.id ? C.teal : 'transparent',
                  flexDirection:'row', alignItems:'center' }}>
                <Avatar initials={c.avatar} color={msgFrom===c.id ? C.bg : C.sub} size={18} />
                <Text style={{ color: msgFrom===c.id ? C.bg : C.sub, fontSize:12, fontWeight:'700', marginLeft:5 }}>{c.name.split(' ')[0]}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Field>
        <Field label="Project">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity onPress={() => setMsgProj('')}
              style={{ marginRight:8, paddingHorizontal:12, paddingVertical:6, borderRadius:20,
                backgroundColor: msgProj==='' ? C.muted : C.surface, borderWidth:1, borderColor: msgProj==='' ? C.sub : 'transparent' }}>
              <Text style={{ color: msgProj==='' ? C.text : C.sub, fontSize:12, fontWeight:'700' }}>General</Text>
            </TouchableOpacity>
            {projects.map(p => (
              <TouchableOpacity key={p.id} onPress={() => setMsgProj(p.id)}
                style={{ marginRight:8, paddingHorizontal:12, paddingVertical:6, borderRadius:20,
                  backgroundColor: msgProj===p.id ? p.accent : C.muted,
                  borderWidth:1, borderColor: msgProj===p.id ? p.accent : 'transparent' }}>
                <Text style={{ color: msgProj===p.id ? C.bg : C.sub, fontSize:12, fontWeight:'700' }}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Field>
        <Field label="Message">
          <TInput value={msgText} onChangeText={setMsgText} placeholder="Type your message..." multiline />
        </Field>
        <Btn label="Send Message" onPress={send} color={C.teal} style={{ marginTop:8 }} />
      </Sheet>
    </View>
  );
};


// ─── INVOICES SCREEN ─────────────────────────────────────────────────────────
const INV_STATUSES = [
  { value:'draft',   label:'Draft',   color:C.sub },
  { value:'sent',    label:'Sent',    color:C.blue },
  { value:'paid',    label:'Paid',    color:C.green },
  { value:'overdue', label:'Overdue', color:C.red },
];
const INV_FILTER_OPTIONS = [
  { value:'all',     label:'All',     color:C.sub },
  { value:'draft',   label:'Draft',   color:C.sub },
  { value:'sent',    label:'Sent',    color:C.blue },
  { value:'paid',    label:'Paid',    color:C.green },
  { value:'overdue', label:'Overdue', color:C.red },
];
const emptyInv = () => ({
  number:'INV-' + new Date().getFullYear() + '-' + String(Date.now()).slice(-3),
  projectId:'', client:'', amount:'', status:'draft',
  issueDate: today(), dueDate:'', paidDate:'', notes:'',
});

const InvoicesScreen = ({ store }) => {
  const { invoices, projects, addInvoice, updateInvoice, deleteInvoice } = store;
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [sheet, setSheet]   = useState(null);
  const [form, setForm]     = useState(emptyInv());

  const totals = {
    paid:    invoices.filter(i=>i.status==='paid').reduce((s,i)=>s+i.amount,0),
    sent:    invoices.filter(i=>i.status==='sent').reduce((s,i)=>s+i.amount,0),
    overdue: invoices.filter(i=>i.status==='overdue').reduce((s,i)=>s+i.amount,0),
    draft:   invoices.filter(i=>i.status==='draft').reduce((s,i)=>s+i.amount,0),
  };
  const totalAll = Object.values(totals).reduce((s,v)=>s+v,0);
  const collectionRate = totalAll > 0 ? Math.round((totals.paid / totalAll) * 100) : 0;

  const visible = invoices.filter(i => {
    if (filter !== 'all' && i.status !== filter) return false;
    const q = search.toLowerCase();
    if (!q) return true;
    return i.number.toLowerCase().includes(q) || i.client.toLowerCase().includes(q);
  }).sort((a,b) => b.issueDate.localeCompare(a.issueDate));

  const openAdd  = () => { setForm(emptyInv()); setSheet('add'); };
  const openEdit = (i) => { setForm({ ...i, amount: String(i.amount) }); setSheet(i); };
  const closeSheet = () => setSheet(null);

  const save = () => {
    if (!form.number.trim()) { Alert.alert('Required', 'Invoice number is required'); return; }
    const data = { ...form, amount: Number(form.amount)||0 };
    if (sheet === 'add') addInvoice(data);
    else updateInvoice({ ...sheet, ...data });
    closeSheet();
  };
  const del = (i) => {
    Alert.alert('Delete Invoice', 'Delete ' + i.number + '?', [
      { text:'Cancel', style:'cancel' },
      { text:'Delete', style:'destructive', onPress: () => deleteInvoice(i.id) },
    ]);
  };

  const statusColor = (s) => ({ draft:C.sub, sent:C.blue, paid:C.green, overdue:C.red }[s] || C.sub);
  const markAs = (inv, status) => updateInvoice({ ...inv, status, paidDate: status==='paid' ? today() : inv.paidDate });

  return (
    <View style={{ flex:1, backgroundColor:C.bg }}>
      <View style={{ paddingTop:56, paddingHorizontal:20, paddingBottom:12 }}>
        <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
          <Text style={{ color:C.text, fontSize:26, fontWeight:'900' }}>Invoices</Text>
          <TouchableOpacity onPress={openAdd} style={{ backgroundColor:C.green, borderRadius:22, paddingHorizontal:16, paddingVertical:8 }}>
            <Text style={{ color:C.bg, fontWeight:'800', fontSize:13 }}>+ New</Text>
          </TouchableOpacity>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:14 }}>
          <View style={{ backgroundColor:C.card, borderRadius:14, padding:14, marginRight:10, borderWidth:1, borderColor:C.border, minWidth:120 }}>
            <Text style={{ color:C.green, fontSize:18, fontWeight:'900' }}>{fmtGBP(totals.paid)}</Text>
            <Text style={{ color:C.sub, fontSize:11, marginTop:2 }}>Paid</Text>
          </View>
          <View style={{ backgroundColor:C.card, borderRadius:14, padding:14, marginRight:10, borderWidth:1, borderColor:C.border, minWidth:120 }}>
            <Text style={{ color:C.blue, fontSize:18, fontWeight:'900' }}>{fmtGBP(totals.sent)}</Text>
            <Text style={{ color:C.sub, fontSize:11, marginTop:2 }}>Outstanding</Text>
          </View>
          <View style={{ backgroundColor:C.card, borderRadius:14, padding:14, marginRight:10, borderWidth:1, borderColor:C.border, minWidth:120 }}>
            <Text style={{ color:C.red, fontSize:18, fontWeight:'900' }}>{fmtGBP(totals.overdue)}</Text>
            <Text style={{ color:C.sub, fontSize:11, marginTop:2 }}>Overdue</Text>
          </View>
          <View style={{ backgroundColor:C.card, borderRadius:14, padding:14, borderWidth:1, borderColor:C.border, minWidth:120 }}>
            <Text style={{ color:C.gold, fontSize:18, fontWeight:'900' }}>{collectionRate}%</Text>
            <Text style={{ color:C.sub, fontSize:11, marginTop:2 }}>Collected</Text>
          </View>
        </ScrollView>

        <View style={{ marginBottom:14 }}>
          <ProgressBar value={totals.paid} total={totalAll} color={C.green} height={6} />
        </View>

        <SearchBar value={search} onChange={setSearch} placeholder="Search invoices..." />
        <StatusPicker value={filter} options={INV_FILTER_OPTIONS} onChange={setFilter} style={{ marginBottom:4 }} />
      </View>

      <FlatList data={visible} keyExtractor={i => i.id}
        contentContainerStyle={{ paddingHorizontal:20, paddingBottom:120 }}
        ListEmptyComponent={<Empty icon="[I]" title="No invoices" sub="Create your first invoice to start tracking payments." action={openAdd} actionLabel="New Invoice" />}
        renderItem={({ item:inv }) => {
          const col = statusColor(inv.status);
          const proj = projects.find(p => p.id === inv.projectId);
          return (
            <PressCard onPress={() => openEdit(inv)} style={{ backgroundColor:C.card, marginBottom:10 }}>
              <View style={{ padding:16 }}>
                <View style={{ flexDirection:'row', alignItems:'flex-start', justifyContent:'space-between', marginBottom:8 }}>
                  <View style={{ flex:1 }}>
                    <Text style={{ color:C.text, fontSize:15, fontWeight:'800' }}>{inv.number}</Text>
                    <Text style={{ color:C.sub, fontSize:13, marginTop:2 }}>{inv.client}</Text>
                    {proj && <Text style={{ color:proj.accent, fontSize:11, marginTop:2 }}>{proj.name}</Text>}
                    <Text style={{ color:C.sub, fontSize:12, marginTop:4 }}>
                      Issued: {fmtDate(inv.issueDate)}{inv.dueDate ? '  Due: ' + fmtDate(inv.dueDate) : ''}
                    </Text>
                    {inv.status === 'paid' && inv.paidDate && (
                      <Text style={{ color:C.green, fontSize:12, marginTop:2 }}>Paid: {fmtDate(inv.paidDate)}</Text>
                    )}
                  </View>
                  <View style={{ alignItems:'flex-end' }}>
                    <Text style={{ color:C.text, fontSize:20, fontWeight:'900' }}>{fmtGBP(inv.amount)}</Text>
                    <Badge label={inv.status} color={col} />
                  </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop:4 }}>
                  {inv.status !== 'sent' && inv.status !== 'paid' && (
                    <TouchableOpacity onPress={() => markAs(inv, 'sent')}
                      style={{ backgroundColor:C.blueBg, borderRadius:20, paddingHorizontal:12, paddingVertical:5,
                        marginRight:8, borderWidth:1, borderColor:C.blue }}>
                      <Text style={{ color:C.blue, fontSize:11, fontWeight:'700' }}>Mark Sent</Text>
                    </TouchableOpacity>
                  )}
                  {inv.status !== 'paid' && (
                    <TouchableOpacity onPress={() => markAs(inv, 'paid')}
                      style={{ backgroundColor:C.greenBg, borderRadius:20, paddingHorizontal:12, paddingVertical:5,
                        marginRight:8, borderWidth:1, borderColor:C.green }}>
                      <Text style={{ color:C.green, fontSize:11, fontWeight:'700' }}>Mark Paid</Text>
                    </TouchableOpacity>
                  )}
                  {inv.status !== 'overdue' && inv.status !== 'paid' && (
                    <TouchableOpacity onPress={() => markAs(inv, 'overdue')}
                      style={{ backgroundColor:C.redBg, borderRadius:20, paddingHorizontal:12, paddingVertical:5,
                        marginRight:8, borderWidth:1, borderColor:C.red }}>
                      <Text style={{ color:C.red, fontSize:11, fontWeight:'700' }}>Flag Overdue</Text>
                    </TouchableOpacity>
                  )}
                </ScrollView>
              </View>
              <Divider />
              <View style={{ flexDirection:'row' }}>
                <TouchableOpacity onPress={() => openEdit(inv)} style={{ flex:1, paddingVertical:11, alignItems:'center' }}>
                  <Text style={{ color:C.gold, fontSize:12, fontWeight:'700' }}>Edit</Text>
                </TouchableOpacity>
                <View style={{ width:1, backgroundColor:C.border }} />
                <TouchableOpacity onPress={() => del(inv)} style={{ flex:1, paddingVertical:11, alignItems:'center' }}>
                  <Text style={{ color:C.red, fontSize:12, fontWeight:'700' }}>Delete</Text>
                </TouchableOpacity>
              </View>
            </PressCard>
          );
        }}
      />

      <Sheet visible={!!sheet} onClose={closeSheet} title={sheet === 'add' ? 'New Invoice' : 'Edit Invoice'}>
        <Field label="Invoice Number"><TInput value={form.number} onChangeText={v => setForm(f=>({...f,number:v}))} placeholder="INV-2026-001" /></Field>
        <Field label="Client"><TInput value={form.client} onChangeText={v => setForm(f=>({...f,client:v}))} placeholder="Client name" /></Field>
        <Field label="Project">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity onPress={() => setForm(f=>({...f,projectId:''}))}
              style={{ marginRight:8, paddingHorizontal:12, paddingVertical:6, borderRadius:20,
                backgroundColor: form.projectId==='' ? C.muted : C.surface,
                borderWidth:1, borderColor: form.projectId==='' ? C.sub : 'transparent' }}>
              <Text style={{ color: form.projectId==='' ? C.text : C.sub, fontSize:12, fontWeight:'700' }}>None</Text>
            </TouchableOpacity>
            {projects.map(p => (
              <TouchableOpacity key={p.id} onPress={() => setForm(f=>({...f,projectId:p.id, client:p.client}))}
                style={{ marginRight:8, paddingHorizontal:12, paddingVertical:6, borderRadius:20,
                  backgroundColor: form.projectId===p.id ? p.accent : C.muted,
                  borderWidth:1, borderColor: form.projectId===p.id ? p.accent : 'transparent' }}>
                <Text style={{ color: form.projectId===p.id ? C.bg : C.sub, fontSize:12, fontWeight:'700' }}>{p.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Field>
        <Field label="Amount (GBP)"><TInput value={form.amount} onChangeText={v => setForm(f=>({...f,amount:v}))} placeholder="0" keyboardType="numeric" /></Field>
        <Field label="Issue Date"><TInput value={form.issueDate} onChangeText={v => setForm(f=>({...f,issueDate:v}))} placeholder="YYYY-MM-DD" /></Field>
        <Field label="Due Date"><TInput value={form.dueDate} onChangeText={v => setForm(f=>({...f,dueDate:v}))} placeholder="YYYY-MM-DD" /></Field>
        <Field label="Status"><StatusPicker value={form.status} options={INV_STATUSES} onChange={v => setForm(f=>({...f,status:v}))} /></Field>
        <Field label="Notes"><TInput value={form.notes} onChangeText={v => setForm(f=>({...f,notes:v}))} placeholder="Payment notes..." multiline /></Field>
        <Btn label="Save Invoice" onPress={save} style={{ marginTop:8 }} />
        {sheet !== 'add' && <GhostBtn label="Delete Invoice" onPress={() => { closeSheet(); del(sheet); }} color={C.red} style={{ marginTop:10 }} />}
      </Sheet>
    </View>
  );
};


// ─── REPORTS SCREEN ──────────────────────────────────────────────────────────
const ReportsScreen = ({ store }) => {
  const { projects, invoices, crew, shifts } = store;

  const totalBudget = projects.reduce((s,p)=>s+p.budget,0);
  const totalSpent  = projects.reduce((s,p)=>s+p.spent,0);
  const totalInv    = invoices.reduce((s,i)=>s+i.amount,0);
  const totalPaid   = invoices.filter(i=>i.status==='paid').reduce((s,i)=>s+i.amount,0);
  const totalOverdue = invoices.filter(i=>i.status==='overdue').reduce((s,i)=>s+i.amount,0);
  const activeProj  = projects.filter(p=>p.status==='active').length;
  const completedProj = projects.filter(p=>p.status==='completed').length;
  const activeCrewCount = crew.filter(c=>c.status!=='inactive').length;
  const upcomingShifts = shifts.filter(s=>s.date >= today()).length;

  return (
    <ScrollView style={{ flex:1, backgroundColor:C.bg }}
      contentContainerStyle={{ paddingTop:56, paddingBottom:120 }}>
      <View style={{ paddingHorizontal:20, marginBottom:24 }}>
        <Text style={{ color:C.text, fontSize:26, fontWeight:'900', marginBottom:4 }}>Reports</Text>
        <Text style={{ color:C.sub, fontSize:14 }}>Portfolio performance at a glance</Text>
      </View>

      <View style={{ paddingHorizontal:20, marginBottom:24 }}>
        <SectionHdr title="Financial Overview" />
        <View style={{ backgroundColor:C.card, borderRadius:16, padding:20, borderWidth:1, borderColor:C.border }}>
          <View style={{ flexDirection:'row', marginBottom:20 }}>
            <View style={{ flex:1 }}>
              <Text style={{ color:C.sub, fontSize:11, fontWeight:'700', textTransform:'uppercase', letterSpacing:0.8 }}>Total Budget</Text>
              <Text style={{ color:C.text, fontSize:24, fontWeight:'900', marginTop:4 }}>{fmtGBP(totalBudget)}</Text>
            </View>
            <View style={{ flex:1 }}>
              <Text style={{ color:C.sub, fontSize:11, fontWeight:'700', textTransform:'uppercase', letterSpacing:0.8 }}>Total Spent</Text>
              <Text style={{ color: totalSpent/totalBudget > 0.8 ? C.red : C.gold, fontSize:24, fontWeight:'900', marginTop:4 }}>{fmtGBP(totalSpent)}</Text>
            </View>
          </View>
          <ProgressBar value={totalSpent} total={totalBudget} color={totalSpent/totalBudget>0.8?C.red:C.gold} height={10} />
          <Text style={{ color:C.sub, fontSize:12, marginTop:8, textAlign:'right' }}>
            {totalBudget > 0 ? Math.round((totalSpent/totalBudget)*100) : 0}% of portfolio budget consumed
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal:20, marginBottom:24 }}>
        <SectionHdr title="Invoice Summary" />
        <View style={{ backgroundColor:C.card, borderRadius:16, padding:20, borderWidth:1, borderColor:C.border }}>
          <View style={{ flexDirection:'row', marginBottom:16 }}>
            <View style={{ flex:1 }}>
              <Text style={{ color:C.green, fontSize:22, fontWeight:'900' }}>{fmtGBP(totalPaid)}</Text>
              <Text style={{ color:C.sub, fontSize:12, marginTop:2 }}>Collected</Text>
            </View>
            <View style={{ flex:1 }}>
              <Text style={{ color:C.red, fontSize:22, fontWeight:'900' }}>{fmtGBP(totalOverdue)}</Text>
              <Text style={{ color:C.sub, fontSize:12, marginTop:2 }}>Overdue</Text>
            </View>
            <View style={{ flex:1 }}>
              <Text style={{ color:C.gold, fontSize:22, fontWeight:'900' }}>
                {totalInv > 0 ? Math.round((totalPaid/totalInv)*100) : 0}%
              </Text>
              <Text style={{ color:C.sub, fontSize:12, marginTop:2 }}>Rate</Text>
            </View>
          </View>
          <ProgressBar value={totalPaid} total={totalInv} color={C.green} height={8} />
        </View>
      </View>

      <View style={{ paddingHorizontal:20, marginBottom:24 }}>
        <SectionHdr title="Project Budget Breakdown" />
        <View style={{ backgroundColor:C.card, borderRadius:16, padding:20, borderWidth:1, borderColor:C.border }}>
          {projects.map((p, i) => (
            <AnimBar key={p.id} value={p.spent} max={p.budget} color={p.accent}
              label={p.name}
              subLabel={fmtGBP(p.spent) + ' / ' + fmtGBP(p.budget)}
              delay={i * 100} />
          ))}
        </View>
      </View>

      <View style={{ paddingHorizontal:20, marginBottom:24 }}>
        <SectionHdr title="Revenue by Project" />
        <View style={{ backgroundColor:C.card, borderRadius:16, padding:20, borderWidth:1, borderColor:C.border }}>
          {projects.map((p, i) => {
            const projInv = invoices.filter(inv => inv.projectId === p.id).reduce((s,inv)=>s+inv.amount,0);
            return (
              <AnimBar key={p.id} value={projInv} max={totalInv || 1} color={p.accent}
                label={p.name}
                subLabel={fmtGBP(projInv)}
                delay={i * 80 + 200} />
            );
          })}
        </View>
      </View>

      <View style={{ paddingHorizontal:20, marginBottom:24 }}>
        <SectionHdr title="Portfolio Stats" />
        <View style={{ flexDirection:'row', marginBottom:10 }}>
          <View style={{ flex:1, backgroundColor:C.card, borderRadius:14, padding:16, marginRight:10, borderWidth:1, borderColor:C.border }}>
            <Text style={{ color:C.teal, fontSize:28, fontWeight:'900' }}>{activeProj}</Text>
            <Text style={{ color:C.text, fontSize:12, fontWeight:'700', marginTop:4 }}>Active</Text>
            <Text style={{ color:C.sub, fontSize:11 }}>projects</Text>
          </View>
          <View style={{ flex:1, backgroundColor:C.card, borderRadius:14, padding:16, borderWidth:1, borderColor:C.border }}>
            <Text style={{ color:C.green, fontSize:28, fontWeight:'900' }}>{completedProj}</Text>
            <Text style={{ color:C.text, fontSize:12, fontWeight:'700', marginTop:4 }}>Completed</Text>
            <Text style={{ color:C.sub, fontSize:11 }}>projects</Text>
          </View>
        </View>
        <View style={{ flexDirection:'row' }}>
          <View style={{ flex:1, backgroundColor:C.card, borderRadius:14, padding:16, marginRight:10, borderWidth:1, borderColor:C.border }}>
            <Text style={{ color:C.purple, fontSize:28, fontWeight:'900' }}>{activeCrewCount}</Text>
            <Text style={{ color:C.text, fontSize:12, fontWeight:'700', marginTop:4 }}>Active crew</Text>
            <Text style={{ color:C.sub, fontSize:11 }}>across all projects</Text>
          </View>
          <View style={{ flex:1, backgroundColor:C.card, borderRadius:14, padding:16, borderWidth:1, borderColor:C.border }}>
            <Text style={{ color:C.blue, fontSize:28, fontWeight:'900' }}>{upcomingShifts}</Text>
            <Text style={{ color:C.text, fontSize:12, fontWeight:'700', marginTop:4 }}>Upcoming</Text>
            <Text style={{ color:C.sub, fontSize:11 }}>shoot days</Text>
          </View>
        </View>
      </View>

      <View style={{ paddingHorizontal:20, marginBottom:24 }}>
        <SectionHdr title="Crew Rates" />
        <View style={{ backgroundColor:C.card, borderRadius:16, padding:20, borderWidth:1, borderColor:C.border }}>
          {crew.map((c, i) => (
            <AnimBar key={c.id} value={c.rate} max={Math.max(...crew.map(x=>x.rate), 1)}
              color={ACCENT_OPTIONS[i % ACCENT_OPTIONS.length]}
              label={c.name + ' - ' + c.role}
              subLabel={fmtGBP(c.rate) + '/' + c.rateUnit}
              delay={i * 80 + 400} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

// ─── MORE / SETTINGS SCREEN ──────────────────────────────────────────────────
const MoreScreen = ({ store, navigate }) => {
  const { projects, crew, invoices, messages } = store;
  const totalBudget = projects.reduce((s,p)=>s+p.budget,0);
  const totalPaid   = invoices.filter(i=>i.status==='paid').reduce((s,i)=>s+i.amount,0);

  const MenuItem = ({ icon, label, sub, onPress, color = C.gold }) => (
    <TouchableOpacity onPress={onPress} style={{ flexDirection:'row', alignItems:'center',
      backgroundColor:C.card, borderRadius:14, padding:16, marginBottom:8,
      borderWidth:1, borderColor:C.border }}>
      <View style={{ width:40, height:40, borderRadius:12, backgroundColor:color+'22',
        alignItems:'center', justifyContent:'center', marginRight:14 }}>
        <Text style={{ fontSize:18 }}>{icon}</Text>
      </View>
      <View style={{ flex:1 }}>
        <Text style={{ color:C.text, fontSize:15, fontWeight:'700' }}>{label}</Text>
        {sub && <Text style={{ color:C.sub, fontSize:12, marginTop:2 }}>{sub}</Text>}
      </View>
      <Text style={{ color:C.sub, fontSize:18 }}>{'>'}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={{ flex:1, backgroundColor:C.bg }}
      contentContainerStyle={{ paddingTop:56, paddingHorizontal:20, paddingBottom:120 }}>
      <Text style={{ color:C.text, fontSize:26, fontWeight:'900', marginBottom:4 }}>More</Text>
      <Text style={{ color:C.sub, fontSize:14, marginBottom:24 }}>Settings and account</Text>

      <View style={{ backgroundColor:C.card, borderRadius:20, padding:20, marginBottom:24,
        borderWidth:1, borderColor:C.border }}>
        <View style={{ flexDirection:'row', alignItems:'center', marginBottom:16 }}>
          <View style={{ width:52, height:52, borderRadius:16, backgroundColor:C.goldBg,
            alignItems:'center', justifyContent:'center', marginRight:14,
            borderWidth:2, borderColor:C.gold }}>
            <Text style={{ color:C.gold, fontSize:22, fontWeight:'900' }}>CD</Text>
          </View>
          <View>
            <Text style={{ color:C.text, fontSize:18, fontWeight:'900' }}>CrewDesk</Text>
            <Text style={{ color:C.sub, fontSize:13 }}>Professional Crew Management</Text>
          </View>
        </View>
        <View style={{ flexDirection:'row' }}>
          <View style={{ flex:1 }}>
            <Text style={{ color:C.gold, fontSize:18, fontWeight:'900' }}>{projects.length}</Text>
            <Text style={{ color:C.sub, fontSize:11, marginTop:2 }}>Projects</Text>
          </View>
          <View style={{ flex:1 }}>
            <Text style={{ color:C.purple, fontSize:18, fontWeight:'900' }}>{crew.length}</Text>
            <Text style={{ color:C.sub, fontSize:11, marginTop:2 }}>Crew</Text>
          </View>
          <View style={{ flex:1 }}>
            <Text style={{ color:C.green, fontSize:18, fontWeight:'900' }}>{fmtGBP(totalPaid)}</Text>
            <Text style={{ color:C.sub, fontSize:11, marginTop:2 }}>Collected</Text>
          </View>
          <View style={{ flex:1 }}>
            <Text style={{ color:C.teal, fontSize:18, fontWeight:'900' }}>{fmtGBP(totalBudget)}</Text>
            <Text style={{ color:C.sub, fontSize:11, marginTop:2 }}>Budget</Text>
          </View>
        </View>
      </View>

      <Text style={{ color:C.sub, fontSize:11, fontWeight:'700', textTransform:'uppercase',
        letterSpacing:1, marginBottom:10 }}>Quick Actions</Text>
      <MenuItem icon="[P]" label="Projects" sub={projects.length + ' projects in portfolio'} onPress={() => navigate('Projects')} color={C.teal} />
      <MenuItem icon="[C]" label="Crew" sub={crew.length + ' crew members'} onPress={() => navigate('Crew')} color={C.purple} />
      <MenuItem icon="[S]" label="Schedule" sub="View upcoming shoot days" onPress={() => navigate('Schedule')} color={C.blue} />
      <MenuItem icon="[I]" label="Invoices" sub="Track payments and billing" onPress={() => navigate('Invoices')} color={C.green} />
      <MenuItem icon="[R]" label="Reports" sub="Portfolio analytics" onPress={() => navigate('Reports')} color={C.gold} />

      <Text style={{ color:C.sub, fontSize:11, fontWeight:'700', textTransform:'uppercase',
        letterSpacing:1, marginTop:16, marginBottom:10 }}>App</Text>
      <View style={{ backgroundColor:C.card, borderRadius:14, padding:16, borderWidth:1, borderColor:C.border, marginBottom:8 }}>
        <Text style={{ color:C.text, fontSize:14, fontWeight:'700', marginBottom:4 }}>Version</Text>
        <Text style={{ color:C.sub, fontSize:13 }}>CrewDesk v7.0 - Production Ready</Text>
      </View>
      <View style={{ backgroundColor:C.card, borderRadius:14, padding:16, borderWidth:1, borderColor:C.border }}>
        <Text style={{ color:C.text, fontSize:14, fontWeight:'700', marginBottom:4 }}>Design System</Text>
        <Text style={{ color:C.sub, fontSize:13 }}>Midnight Navy x Amber Gold x Electric Teal</Text>
        <View style={{ flexDirection:'row', marginTop:10 }}>
          {[C.gold, C.teal, C.purple, C.blue, C.green, C.red, C.orange, C.pink].map(col => (
            <View key={col} style={{ width:20, height:20, borderRadius:10, backgroundColor:col, marginRight:6 }} />
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

// ─── TAB BAR + APP ROOT ───────────────────────────────────────────────────────
const TABS = [
  { key:'Home',     label:'Home',     color:C.gold   },
  { key:'Projects', label:'Projects', color:C.teal   },
  { key:'Crew',     label:'Crew',     color:C.purple },
  { key:'Schedule', label:'Schedule', color:C.blue   },
  { key:'Messages', label:'Messages', color:C.orange },
  { key:'Invoices', label:'Invoices', color:C.green  },
  { key:'Reports',  label:'Reports',  color:C.pink   },
  { key:'More',     label:'More',     color:C.sub    },
];

const TabBar = ({ active, setActive, unreadMsgs }) => {
  const scrollRef = useRef(null);
  const activeIdx = TABS.findIndex(t => t.key === active);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ x: Math.max(0, activeIdx * 72 - 100), animated:true });
    }
  }, [active]);

  return (
    <View style={{ position:'absolute', bottom:0, left:0, right:0,
      backgroundColor:C.surface, borderTopWidth:1, borderTopColor:C.border,
      paddingBottom: Platform.OS === 'ios' ? 24 : 8 }}>
      <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal:8, paddingTop:8, paddingBottom:4 }}>
        {TABS.map((tab) => {
          const isActive = active === tab.key;
          return (
            <TouchableOpacity key={tab.key} onPress={() => setActive(tab.key)}
              style={{ alignItems:'center', paddingHorizontal:14, paddingVertical:6,
                minWidth:64, borderRadius:16,
                backgroundColor: isActive ? tab.color + '18' : 'transparent' }}>
              {isActive && (
                <View style={{ position:'absolute', top:0, left:20, right:20, height:3,
                  backgroundColor:tab.color, borderRadius:2 }} />
              )}
              <View style={{ position:'relative' }}>
                <Text style={{ color: isActive ? tab.color : C.sub,
                  fontSize:11, fontWeight: isActive ? '800' : '500',
                  letterSpacing:0.2, marginTop:4 }}>{tab.label}</Text>
                {tab.key === 'Messages' && unreadMsgs > 0 && (
                  <View style={{ position:'absolute', top:-4, right:-12, backgroundColor:C.red,
                    borderRadius:8, minWidth:16, height:16, alignItems:'center', justifyContent:'center',
                    borderWidth:1.5, borderColor:C.surface }}>
                    <Text style={{ color:C.text, fontSize:9, fontWeight:'800' }}>{unreadMsgs}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default function App() {
  const store = useStore();
  const [active, setActive] = useState('Home');
  const unreadMsgs = store.messages.filter(m => !m.read).length;

  const navigate = (screen) => setActive(screen);

  const renderScreen = () => {
    switch (active) {
      case 'Home':     return <HomeScreen     store={store} navigate={navigate} />;
      case 'Projects': return <ProjectsScreen store={store} />;
      case 'Crew':     return <CrewScreen     store={store} />;
      case 'Schedule': return <ScheduleScreen store={store} />;
      case 'Messages': return <MessagesScreen store={store} />;
      case 'Invoices': return <InvoicesScreen store={store} />;
      case 'Reports':  return <ReportsScreen  store={store} />;
      case 'More':     return <MoreScreen     store={store} navigate={navigate} />;
      default:         return <HomeScreen     store={store} navigate={navigate} />;
    }
  };

  return (
    <View style={{ flex:1, backgroundColor:C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      {renderScreen()}
      <TabBar active={active} setActive={setActive} unreadMsgs={unreadMsgs} />
    </View>
  );
}
