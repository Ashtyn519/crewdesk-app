import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Modal,
  SafeAreaView, StatusBar, KeyboardAvoidingView, Platform,
  Dimensions, TouchableHighlight, Alert, Switch, FlatList
} from 'react-native';

const { width: SW, height: SH } = Dimensions.get('window');

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const C = {
  bg: '#060A14',
  bgDeep: '#030608',
  surface: '#0C1120',
  card: '#101828',
  cardRaised: '#141D2E',
  cardHigh: '#192236',
  border: '#1C2B42',
  borderMid: '#243550',
  borderLight: '#2D4166',
  text: '#F0F4FF',
  textSoft: '#C8D5F0',
  muted: '#6879A8',
  dim: '#3D4F70',
  ghost: '#263045',
  accent: '#4D8DF5',
  accentBright: '#6BA3FF',
  accentDeep: '#1E3A6E',
  accentGlow: 'rgba(77,141,245,0.15)',
  gold: '#F4C842',
  goldDeep: 'rgba(244,200,66,0.15)',
  green: '#1FD08A',
  greenDeep: 'rgba(31,208,138,0.15)',
  red: '#F04E4E',
  redDeep: 'rgba(240,78,78,0.15)',
  purple: '#8B5CF6',
  purpleDeep: 'rgba(139,92,246,0.15)',
  orange: '#F97316',
  orangeDeep: 'rgba(249,115,22,0.15)',
  teal: '#14B8A6',
  tealDeep: 'rgba(20,184,166,0.15)',
  pink: '#EC4899',
  pinkDeep: 'rgba(236,72,153,0.15)',
};

// ─── DATA STORE (simulates backend) ──────────────────────────────────────────
const useStore = () => {
  const [projects, setProjects] = useState([
    { id:1, name:'Nike Summer Campaign', client:'Nike EMEA', status:'On Track', statusColor:C.green, crew:8, due:'Mar 15', budget:24000, spent:16800, progress:0.70, lead:'Alex Morgan', desc:'Full campaign shoot for Nike EMEA summer collection. 4-day shoot in Barcelona.' },
    { id:2, name:'BBC Documentary Series', client:'BBC Studios', status:'Pending', statusColor:C.orange, crew:12, due:'Apr 2', budget:85000, spent:12000, progress:0.14, lead:'Jordan Kim', desc:'6-part documentary series on ocean conservation. Remote locations worldwide.' },
    { id:3, name:'Adidas Product Shoot', client:'Adidas UK', status:'In Progress', statusColor:C.accent, crew:5, due:'Mar 22', budget:18000, spent:9000, progress:0.50, lead:'Sam Rivera', desc:'Hero product shots for Adidas SS26 catalogue. Studio-based 2-day shoot.' },
    { id:4, name:'Netflix Series BTS', client:'Netflix', status:'On Track', statusColor:C.green, crew:15, due:'May 10', budget:120000, spent:45000, progress:0.38, lead:'Taylor Walsh', desc:'Behind-the-scenes content for major Netflix original series. On-set access.' },
    { id:5, name:'Apple Launch Event', client:'Apple Inc', status:'At Risk', statusColor:C.red, crew:20, due:'Mar 8', budget:200000, spent:190000, progress:0.95, lead:'Morgan Patel', desc:'Content production for global Apple product launch. Broadcast quality required.' },
  ]);

  const [crew, setCrew] = useState([
    { id:1, name:'Alex Morgan', role:'Director', dept:'Production', status:'Available', rate:850, rating:4.9, projects:3, color:C.accent, phone:'+44 7700 900001', email:'alex@crewdesk.io', bio:'Award-winning director with 12 years of commercial experience.' },
    { id:2, name:'Jordan Kim', role:'Director of Photography', dept:'Camera', status:'On Set', rate:750, rating:4.8, projects:2, color:C.purple, phone:'+44 7700 900002', email:'jordan@crewdesk.io', bio:'Cinematographer specialising in documentary and commercial work.' },
    { id:3, name:'Sam Rivera', role:'Gaffer', dept:'Lighting', status:'Available', rate:620, rating:4.7, projects:4, color:C.green, phone:'+44 7700 900003', email:'sam@crewdesk.io', bio:'Senior gaffer with expertise in both studio and location lighting.' },
    { id:4, name:'Taylor Walsh', role:'Sound Engineer', dept:'Audio', status:'Travelling', rate:580, rating:4.6, projects:2, color:C.gold, phone:'+44 7700 900004', email:'taylor@crewdesk.io', bio:'Location sound recordist and post-production audio engineer.' },
    { id:5, name:'Morgan Patel', role:'Art Director', dept:'Art', status:'On Set', rate:700, rating:4.9, projects:5, color:C.orange, phone:'+44 7700 900005', email:'morgan@crewdesk.io', bio:'Creative art director with background in fashion and lifestyle.' },
    { id:6, name:'Casey Chen', role:'Editor', dept:'Post', status:'Available', rate:680, rating:4.7, projects:1, color:C.teal, phone:'+44 7700 900006', email:'casey@crewdesk.io', bio:'Offline and online editor. Avid and Premiere certified.' },
    { id:7, name:'Riley Johnson', role:'Production Assistant', dept:'Production', status:'Available', rate:380, rating:4.5, projects:6, color:C.pink, phone:'+44 7700 900007', email:'riley@crewdesk.io', bio:'Experienced PA with strong organisation and logistics skills.' },
    { id:8, name:'Quinn Davis', role:'Colorist', dept:'Post', status:'Travelling', rate:720, rating:4.8, projects:3, color:C.accentBright, phone:'+44 7700 900008', email:'quinn@crewdesk.io', bio:'Senior colorist with credits on feature films and major campaigns.' },
  ]);

  const [shifts, setShifts] = useState([
    { id:1, project:'Nike Campaign', role:'Director', crewId:1, day:'Mon', start:'07:00', end:'18:00', color:C.accent, location:'Barcelona Studio' },
    { id:2, project:'Nike Campaign', role:'DOP', crewId:2, day:'Mon', start:'06:30', end:'18:00', color:C.purple, location:'Barcelona Studio' },
    { id:3, project:'BBC Docs', role:'Sound Engineer', crewId:4, day:'Tue', start:'08:00', end:'20:00', color:C.gold, location:'Location TBC' },
    { id:4, project:'Adidas Shoot', role:'Gaffer', crewId:3, day:'Wed', start:'07:00', end:'16:00', color:C.green, location:'London Studio 3' },
    { id:5, project:'Netflix BTS', role:'Art Director', crewId:5, day:'Thu', start:'09:00', end:'21:00', color:C.orange, location:'Pinewood Studios' },
    { id:6, project:'Apple Event', role:'Editor', crewId:6, day:'Fri', start:'10:00', end:'22:00', color:C.teal, location:'Post House, Soho' },
    { id:7, project:'Nike Campaign', role:'Production Assistant', crewId:7, day:'Mon', start:'06:00', end:'19:00', color:C.pink, location:'Barcelona Studio' },
  ]);

  const [invoices, setInvoices] = useState([
    { id:'INV-001', project:'Nike Summer Campaign', client:'Nike EMEA', amount:12400, status:'Paid', due:'Feb 28', issued:'Feb 1', items:[{desc:'Director fee',qty:4,rate:2100},{desc:'Equipment hire',qty:1,rate:4300}] },
    { id:'INV-002', project:'BBC Documentary', client:'BBC Studios', amount:32000, status:'Pending', due:'Mar 15', issued:'Feb 15', items:[{desc:'Production crew',qty:12,rate:2000},{desc:'Location fees',qty:1,rate:8000}] },
    { id:'INV-003', project:'Adidas Shoot', client:'Adidas UK', amount:9000, status:'Overdue', due:'Mar 1', issued:'Feb 10', items:[{desc:'Studio hire',qty:2,rate:3500},{desc:'Crew',qty:5,rate:400}] },
    { id:'INV-004', project:'Netflix BTS', client:'Netflix', amount:45000, status:'Draft', due:'Apr 30', issued:'Mar 1', items:[{desc:'Full crew package',qty:15,rate:3000}] },
    { id:'INV-005', project:'Apple Event', client:'Apple Inc', amount:80000, status:'Paid', due:'Mar 5', issued:'Jan 20', items:[{desc:'Event production',qty:1,rate:80000}] },
  ]);

  const [messages, setMessages] = useState([
    { id:1, name:'Alex Morgan', text:'Confirmed for the Nike shoot tomorrow 7am.', time:'2m ago', unread:2, color:C.accent, online:true },
    { id:2, name:'Jordan Kim', text:'Sending over the shot list now.', time:'18m ago', unread:0, color:C.purple, online:true },
    { id:3, name:'Nike Team', text:'Client approved the revised treatment!', time:'1h ago', unread:5, color:C.green, online:false },
    { id:4, name:'Sam Rivera', text:'Lighting rig is set. Ready when you are.', time:'3h ago', unread:0, color:C.orange, online:true },
    { id:5, name:'Taylor Walsh', text:'Audio equipment sorted. See you at 6.', time:'5h ago', unread:1, color:C.gold, online:false },
  ]);

  const [chatHistory, setChatHistory] = useState({
    1: [
      { id:1, me:false, text:'Hey! Confirmed for the Nike shoot tomorrow 7am.', time:'09:02', status:'read' },
      { id:2, me:true, text:'Perfect. Make sure the rig is ready by 6:45.', time:'09:05', status:'read' },
      { id:3, me:false, text:'Already sorted. Anything else?', time:'09:06', status:'read' },
      { id:4, me:true, text:'Bring the extra 35mm. Client might want options.', time:'09:08', status:'read' },
      { id:5, me:false, text:'On it. See you tomorrow! 🎬', time:'09:09', status:'read' },
    ],
    3: [
      { id:1, me:false, text:'Client approved the revised treatment! 🎉', time:'10:30', status:'read' },
      { id:2, me:true, text:'Amazing! When do they want to kick off?', time:'10:32', status:'read' },
      { id:3, me:false, text:'They are thinking next Monday. Can we confirm crew?', time:'10:33', status:'read' },
      { id:4, me:true, text:'Absolutely. Sending schedule now.', time:'10:35', status:'read' },
    ],
  });

  const [notifications, setNotifications] = useState([
    { id:1, type:'warning', title:'Invoice Overdue', body:'Adidas Shoot INV-003 is 7 days overdue.', time:'5m ago', read:false },
    { id:2, type:'success', title:'Payment Received', body:'£12,400 received from Nike EMEA.', time:'1h ago', read:false },
    { id:3, type:'info', title:'New Crew Request', body:'Quinn Davis requested to join Netflix BTS.', time:'3h ago', read:false },
    { id:4, type:'warning', title:'Schedule Conflict', body:'Jordan Kim has overlapping bookings on Mon.', time:'Yesterday', read:true },
    { id:5, type:'success', title:'Project Approved', body:'BBC Documentary Series has been approved.', time:'Yesterday', read:true },
  ]);

  
  // Time Tracking state
  const [timeEntries, setTimeEntries] = useState([
    { id:1, project:'Nike Summer Campaign', task:'Set lighting rigs', duration:7200, date:new Date().toLocaleDateString() },
    { id:2, project:'BBC Documentary Series', task:'Pre-production review', duration:3600, date:new Date().toLocaleDateString() },
  ]);

  // Settings state
  const [settings, setSettings] = useState({ notifications: true, darkMode: true, biometric: false, emailDigest: true });

  // Current user
  const [currentUser] = useState({ name: 'Alex Morgan', role: 'Production Manager', avatar: '👤' });

  // Helper: add invoice
  const addInvoice = (inv) => setInvoices(prev => [inv, ...prev]);
  const updateInvoice = (inv) => setInvoices(prev => prev.map(i => i.id === inv.id ? inv : i));
  const deleteInvoice = (id) => setInvoices(prev => prev.filter(i => i.id !== id));

  // Helper: add/update/delete project
  const addProject = (p) => setProjects(prev => [p, ...prev]);
  const updateProject = (p) => setProjects(prev => prev.map(x => x.id === p.id ? p : x));
  const deleteProject = (id) => setProjects(prev => prev.filter(x => x.id !== id));

  // Helper: crew
  const addCrew = (c) => setCrew(prev => [c, ...prev]);
  const updateCrew = (c) => setCrew(prev => prev.map(x => x.id === c.id ? c : x));
  const deleteCrew = (id) => setCrew(prev => prev.filter(x => x.id !== id));

  // Helper: shifts
  const addShift = (s) => setShifts(prev => [s, ...prev]);
  const updateShift = (s) => setShifts(prev => prev.map(x => x.id === s.id ? s : x));
  const deleteShift = (id) => setShifts(prev => prev.filter(x => x.id !== id));

  // Helper: time entries
  const addTimeEntry = (e) => setTimeEntries(prev => [e, ...prev]);
  const deleteTimeEntry = (id) => setTimeEntries(prev => prev.filter(e => e.id !== id));

  // Helper: chat
  const addChatMessage = (convoId, msg) => {
    setChatHistory(prev => ({
      ...prev,
      [convoId]: [...(prev[convoId] || []), msg],
    }));
    setMessages(prev => prev.map(m => m.id === convoId ? {
      ...m,
      lastMsg: msg.sender === 'me' ? msg.text : msg.text,
      time: msg.time,
      unread: msg.sender !== 'me' ? (m.unread || 0) + 1 : m.unread,
    } : m));
  };

  // Helper: notifications
  const dismissNotification = (id) => setNotifications(prev => prev.filter(n => n.id !== id));

  // Helper: settings
  const updateSettings = (s) => setSettings(s);

  return {
    projects, setProjects, addProject, updateProject, deleteProject,
    crew, setCrew, addCrew, updateCrew, deleteCrew,
    shifts, setShifts, addShift, updateShift, deleteShift,
    invoices, setInvoices, addInvoice, updateInvoice, deleteInvoice,
    messages, setMessages,
    chatHistory, setChatHistory, addChatMessage,
    notifications, setNotifications, dismissNotification,
    timeEntries, setTimeEntries, addTimeEntry, deleteTimeEntry,
    settings, updateSettings,
    currentUser,
  };
};


// ─── SHARED UI ATOMS ─────────────────────────────────────────────────────────

const Avatar = ({ name='?', size=36, color=C.accent }) => (
  <View style={{ width:size, height:size, borderRadius:size/2, backgroundColor:color+'20',
    alignItems:'center', justifyContent:'center', borderWidth:1.5, borderColor:color+'50' }}>
    <Text style={{ color, fontSize:size*0.38, fontWeight:'800' }}>{name.charAt(0).toUpperCase()}</Text>
  </View>
);

const OnlineDot = ({ online, size=8 }) => online ? (
  <View style={{ width:size, height:size, borderRadius:size/2, backgroundColor:C.green,
    borderWidth:1.5, borderColor:C.card, position:'absolute', bottom:0, right:0 }} />
) : null;

const Badge = ({ label, color, small=false }) => (
  <View style={{ backgroundColor:color+'18', paddingHorizontal:small?7:10,
    paddingVertical:small?3:5, borderRadius:20, borderWidth:1, borderColor:color+'35' }}>
    <Text style={{ color, fontSize:small?9:10, fontWeight:'700', letterSpacing:0.6 }}>
      {label.toUpperCase()}
    </Text>
  </View>
);

const Pill = ({ label, active, color=C.accent, onPress }) => (
  <TouchableOpacity onPress={onPress} style={{
    paddingHorizontal:16, paddingVertical:8, borderRadius:50, marginRight:8,
    backgroundColor: active ? color : C.card,
    borderWidth:1, borderColor: active ? color : C.border,
  }}>
    <Text style={{ color: active ? '#fff' : C.muted, fontWeight:'600', fontSize:12 }}>{label}</Text>
  </TouchableOpacity>
);

const Bar = ({ progress=0, color=C.accent, h=5, animated=false }) => (
  <View style={{ height:h, backgroundColor:C.border, borderRadius:h, overflow:'hidden' }}>
    <View style={{ width:Math.min(Math.max(progress,0),1)*100+'%', height:'100%',
      backgroundColor:color, borderRadius:h }} />
  </View>
);

const Tile = ({ value, label, color, icon }) => (
  <View style={{ flex:1, backgroundColor:C.card, borderRadius:18, padding:15, marginHorizontal:4,
    borderWidth:1, borderColor:C.border }}>
    {icon && <Text style={{ fontSize:18, marginBottom:6 }}>{icon}</Text>}
    <Text style={{ fontSize:22, fontWeight:'900', color, letterSpacing:-0.5 }}>{value}</Text>
    <Text style={{ fontSize:10, color:C.muted, marginTop:3, fontWeight:'600', letterSpacing:0.3 }}>{label.toUpperCase()}</Text>
  </View>
);

const Row = ({ title, action, onAction }) => (
  <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:14, marginTop:8 }}>
    <Text style={{ fontSize:15, fontWeight:'800', color:C.text, letterSpacing:-0.3 }}>{title}</Text>
    {action && <TouchableOpacity onPress={onAction}><Text style={{ fontSize:12, color:C.accent, fontWeight:'700' }}>{action} →</Text></TouchableOpacity>}
  </View>
);

const Card = ({ children, style={}, onPress, noPad=false }) => {
  const Wrap = onPress ? TouchableOpacity : View;
  return (
    <Wrap onPress={onPress} activeOpacity={0.85} style={[{
      backgroundColor:C.card, borderRadius:20, padding:noPad?0:16,
      marginBottom:12, borderWidth:1, borderColor:C.border,
    }, style]}>
      {children}
    </Wrap>
  );
};

const Sep = ({ style={} }) => <View style={[{ height:1, backgroundColor:C.border, marginVertical:12 }, style]} />;

const Input = ({ label, value, onChangeText, placeholder, multiline=false, keyboardType='default', style={} }) => (
  <View style={{ marginBottom:14 }}>
    {label && <Text style={{ fontSize:12, color:C.muted, fontWeight:'700', letterSpacing:0.5, marginBottom:6, textTransform:'uppercase' }}>{label}</Text>}
    <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder}
      placeholderTextColor={C.dim} multiline={multiline} keyboardType={keyboardType}
      style={[{ backgroundColor:C.surface, borderWidth:1, borderColor:C.border, borderRadius:14,
        paddingHorizontal:16, paddingVertical:13, color:C.text, fontSize:14,
      }, multiline && { height:90, textAlignVertical:'top' }, style]}
    />
  </View>
);

const Empty = ({ icon, title, sub, action, onAction }) => (
  <View style={{ alignItems:'center', paddingVertical:50, paddingHorizontal:30 }}>
    <Text style={{ fontSize:44, marginBottom:16 }}>{icon}</Text>
    <Text style={{ fontSize:17, fontWeight:'800', color:C.text, marginBottom:8, textAlign:'center' }}>{title}</Text>
    <Text style={{ fontSize:13, color:C.muted, textAlign:'center', lineHeight:20, marginBottom:action?20:0 }}>{sub}</Text>
    {action && (
      <TouchableOpacity onPress={onAction} style={{ backgroundColor:C.accent, paddingHorizontal:24, paddingVertical:12, borderRadius:50 }}>
        <Text style={{ color:'#fff', fontWeight:'700', fontSize:13 }}>{action}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const HeaderBar = ({ title, onBack, action, onAction, actionColor=C.accent }) => (
  <View style={{ flexDirection:'row', alignItems:'center', paddingBottom:16, borderBottomWidth:1, borderBottomColor:C.border, marginBottom:4 }}>
    {onBack && (
      <TouchableOpacity onPress={onBack} style={{ marginRight:14, width:36, height:36, borderRadius:18,
        backgroundColor:C.surface, alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:C.border }}>
        <Text style={{ color:C.text, fontSize:16, fontWeight:'700' }}>←</Text>
      </TouchableOpacity>
    )}
    <Text style={{ flex:1, fontSize:18, fontWeight:'900', color:C.text, letterSpacing:-0.5 }}>{title}</Text>
    {action && (
      <TouchableOpacity onPress={onAction} style={{ backgroundColor:actionColor+'20', paddingHorizontal:14, paddingVertical:8,
        borderRadius:50, borderWidth:1, borderColor:actionColor+'40' }}>
        <Text style={{ color:actionColor, fontWeight:'700', fontSize:13 }}>{action}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const statusColor = s => s==='Available'?C.green : s==='On Set'?C.accent : s==='Travelling'?C.orange : C.muted;
const invoiceColor = s => s==='Paid'?C.green : s==='Pending'?C.orange : s==='Overdue'?C.red : C.muted;
const nextId = arr => arr.length ? Math.max(...arr.map(x => x.id||0)) + 1 : 1;
const fmt = secs => {
  const h = String(Math.floor(secs/3600)).padStart(2,'0');
  const m = String(Math.floor((secs%3600)/60)).padStart(2,'0');
  const s = String(secs%60).padStart(2,'0');
  return h+':'+m+':'+s;
};


// ─── HOME SCREEN ─────────────────────────────────────────────────────────────
const HomeScreen = ({ store, setTab, setNotifOpen }) => {
  const { projects, crew, notifications } = store;
  const [clockedIn, setClockedIn] = useState(false);
  const [clockTime, setClockTime] = useState(0);
  const [clockProject, setClockProject] = useState(projects[0]?.name || '');
  const timerRef = useRef(null);
  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    if (clockedIn) timerRef.current = setInterval(() => setClockTime(t => t+1), 1000);
    else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [clockedIn]);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const revenue = 28400;
  const activeCount = projects.filter(p => p.status !== 'Pending').length;

  return (
    <ScrollView style={{ flex:1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom:40 }}>
      {/* Header */}
      <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24 }}>
        <View>
          <Text style={{ fontSize:13, color:C.muted, fontWeight:'600', marginBottom:4 }}>CREWDESK PRO</Text>
          <Text style={{ fontSize:26, fontWeight:'900', color:C.text, letterSpacing:-0.8, lineHeight:30 }}>{greeting},</Text>
          <Text style={{ fontSize:26, fontWeight:'900', color:C.accent, letterSpacing:-0.8 }}>Alex 👋</Text>
        </View>
        <TouchableOpacity onPress={() => setNotifOpen(true)} style={{ width:46, height:46, borderRadius:23,
          backgroundColor:C.surface, alignItems:'center', justifyContent:'center',
          borderWidth:1, borderColor:C.border }}>
          <Text style={{ fontSize:20 }}>🔔</Text>
          {unreadCount > 0 && (
            <View style={{ position:'absolute', top:8, right:8, width:16, height:16, borderRadius:8,
              backgroundColor:C.red, alignItems:'center', justifyContent:'center', borderWidth:2, borderColor:C.bg }}>
              <Text style={{ color:'#fff', fontSize:8, fontWeight:'900' }}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Clock Card */}
      <View style={{ backgroundColor: clockedIn ? C.green+'12' : C.surface,
        borderRadius:22, padding:18, marginBottom:16, borderWidth:1,
        borderColor: clockedIn ? C.green+'40' : C.border }}>
        <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
          <View style={{ flex:1 }}>
            <Text style={{ fontSize:11, color: clockedIn ? C.green : C.muted, fontWeight:'700', letterSpacing:1, textTransform:'uppercase', marginBottom:4 }}>
              {clockedIn ? '⏱ ON CLOCK' : 'READY TO START?'}
            </Text>
            <Text style={{ fontSize:36, fontWeight:'900', color: clockedIn ? C.green : C.text, letterSpacing:-2, fontVariant:['tabular-nums'] }}>
              {fmt(clockTime)}
            </Text>
            {clockedIn
              ? <Text style={{ fontSize:12, color:C.muted, marginTop:4 }}>{clockProject}</Text>
              : (
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop:10 }}>
                  {projects.slice(0,4).map(p => (
                    <TouchableOpacity key={p.id} onPress={() => setClockProject(p.name)} style={{
                      paddingHorizontal:12, paddingVertical:6, borderRadius:50, marginRight:8,
                      backgroundColor: clockProject===p.name ? C.accent : C.card,
                      borderWidth:1, borderColor: clockProject===p.name ? C.accent : C.border }}>
                      <Text style={{ color: clockProject===p.name ? '#fff' : C.muted, fontSize:11, fontWeight:'600' }} numberOfLines={1}>
                        {p.name.split(' ').slice(0,2).join(' ')}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              )
            }
          </View>
          <TouchableOpacity
            onPress={() => { setClockedIn(c => !c); if(clockedIn) setClockTime(0); }}
            style={{ marginLeft:16, paddingHorizontal:20, paddingVertical:14, borderRadius:50,
              backgroundColor: clockedIn ? C.red : C.green }}>
            <Text style={{ color:'#fff', fontWeight:'900', fontSize:14 }}>{clockedIn ? '■ Stop' : '▶ Start'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Row */}
      <View style={{ flexDirection:'row', marginBottom:16, marginHorizontal:-4 }}>
        <Tile value={activeCount} label="Live Jobs" color={C.accent} icon="🎬" />
        <Tile value={crew.filter(c=>c.status==='Available').length} label="Available" color={C.green} icon="✅" />
        <Tile value={'£'+Math.round(revenue/1000)+'k'} label="This Month" color={C.gold} icon="💰" />
      </View>

      {/* Quick Actions */}
      <Row title="Quick Actions" />
      <View style={{ flexDirection:'row', flexWrap:'wrap', marginBottom:8 }}>
        {[
          { label:'New Project', icon:'🎯', tab:'Projects', color:C.accent },
          { label:'Add Crew', icon:'👤', tab:'Crew', color:C.purple },
          { label:'Schedule', icon:'📅', tab:'Schedule', color:C.green },
          { label:'Invoice', icon:'💳', tab:'Invoices', color:C.gold },
          { label:'Messages', icon:'💬', tab:'Messages', color:C.teal },
          { label:'Reports', icon:'📊', tab:'More', color:C.orange },
        ].map(a => (
          <TouchableOpacity key={a.label} onPress={() => setTab(a.tab)} style={{
            width:(SW-48)/3 - 2, backgroundColor:C.card, borderRadius:16, padding:14,
            marginRight:6, marginBottom:6, alignItems:'center', borderWidth:1, borderColor:C.border }}>
            <Text style={{ fontSize:24, marginBottom:8 }}>{a.icon}</Text>
            <Text style={{ fontSize:11, color:C.textSoft, fontWeight:'700', textAlign:'center' }}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* At Risk */}
      {projects.filter(p=>p.status==='At Risk').length > 0 && (
        <>
          <Row title="⚠️ Needs Attention" />
          {projects.filter(p=>p.status==='At Risk').map(p => (
            <Card key={p.id} onPress={() => setTab('Projects')} style={{ borderColor:C.red+'40', borderLeftWidth:3, borderLeftColor:C.red }}>
              <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
                <View style={{ flex:1 }}>
                  <Text style={{ fontSize:14, fontWeight:'800', color:C.text, marginBottom:2 }}>{p.name}</Text>
                  <Text style={{ fontSize:12, color:C.muted }}>{p.client} · Due {p.due}</Text>
                </View>
                <Badge label="AT RISK" color={C.red} />
              </View>
              <View style={{ marginTop:12 }}>
                <Bar progress={p.progress} color={C.red} h={6} />
              </View>
              <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop:10 }}>
                <Text style={{ fontSize:11, color:C.dim }}>Budget spent: £{p.spent.toLocaleString()}</Text>
                <Text style={{ fontSize:11, color:C.red, fontWeight:'700' }}>{Math.round(p.progress*100)}% complete</Text>
              </View>
            </Card>
          ))}
        </>
      )}

      {/* Active Projects */}
      <Row title="Active Projects" action="All Projects" onAction={() => setTab('Projects')} />
      {projects.filter(p=>p.status!=='At Risk').slice(0,3).map(p => (
        <Card key={p.id} onPress={() => setTab('Projects')}>
          <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
            <View style={{ flex:1, paddingRight:10 }}>
              <Text style={{ fontSize:14, fontWeight:'800', color:C.text, marginBottom:2 }}>{p.name}</Text>
              <Text style={{ fontSize:12, color:C.muted }}>{p.client}</Text>
            </View>
            <Badge label={p.status} color={p.statusColor} />
          </View>
          <Bar progress={p.progress} color={p.statusColor} h={5} />
          <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop:10 }}>
            <Text style={{ fontSize:11, color:C.dim }}>👥 {p.crew} · 📅 {p.due}</Text>
            <Text style={{ fontSize:12, color:C.gold, fontWeight:'800' }}>£{(p.budget/1000).toFixed(0)}k</Text>
          </View>
        </Card>
      ))}

      {/* On Deck */}
      <Row title="On Deck Today" action="Roster" onAction={() => setTab('Crew')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:8 }}>
        {crew.filter(c=>c.status==='On Set' || c.status==='Available').slice(0,6).map(c => (
          <View key={c.id} style={{ backgroundColor:C.card, borderRadius:18, padding:14,
            marginRight:10, alignItems:'center', width:86, borderWidth:1, borderColor:C.border }}>
            <View style={{ position:'relative' }}>
              <Avatar name={c.name} size={46} color={c.color} />
              <OnlineDot online={c.status==='Available'||c.status==='On Set'} size={10} />
            </View>
            <Text style={{ fontSize:11, color:C.text, fontWeight:'700', marginTop:8, textAlign:'center' }} numberOfLines={1}>{c.name.split(' ')[0]}</Text>
            <Text style={{ fontSize:9, color:c.color, fontWeight:'700', marginTop:2, textAlign:'center' }}>{c.status.toUpperCase()}</Text>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
};


// ─── NOTIFICATIONS MODAL ─────────────────────────────────────────────────────
const NotifModal = ({ open, onClose, store }) => {
  const { notifications, setNotifications } = store;
  const markAll = () => setNotifications(prev => prev.map(n => ({ ...n, read:true })));
  const dismiss = id => setNotifications(prev => prev.filter(n => n.id !== id));
  const typeIcon = t => t==='success'?'✅':t==='warning'?'⚠️':'ℹ️';
  const typeColor = t => t==='success'?C.green:t==='warning'?C.orange:C.accent;
  return (
    <Modal visible={open} animationType="slide" transparent>
      <View style={{ flex:1, backgroundColor:'rgba(6,10,20,0.92)', justifyContent:'flex-end' }}>
        <View style={{ backgroundColor:C.surface, borderTopLeftRadius:28, borderTopRightRadius:28,
          maxHeight:SH*0.8, borderWidth:1, borderColor:C.border }}>
          <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:20, borderBottomWidth:1, borderBottomColor:C.border }}>
            <Text style={{ fontSize:18, fontWeight:'900', color:C.text }}>Notifications</Text>
            <View style={{ flexDirection:'row' }}>
              <TouchableOpacity onPress={markAll} style={{ marginRight:12 }}>
                <Text style={{ color:C.accent, fontWeight:'700', fontSize:13 }}>Mark all read</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose} style={{ width:32, height:32, borderRadius:16,
                backgroundColor:C.card, alignItems:'center', justifyContent:'center', borderWidth:1, borderColor:C.border }}>
                <Text style={{ color:C.muted }}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
          <ScrollView contentContainerStyle={{ padding:16 }}>
            {notifications.length === 0
              ? <Empty icon="🔔" title="All clear!" sub="No notifications right now." />
              : notifications.map(n => (
                <View key={n.id} style={{ flexDirection:'row', alignItems:'flex-start', paddingVertical:14,
                  borderBottomWidth:1, borderBottomColor:C.border, opacity: n.read ? 0.5 : 1 }}>
                  <View style={{ width:36, height:36, borderRadius:18, backgroundColor:typeColor(n.type)+'20',
                    alignItems:'center', justifyContent:'center', marginRight:14, borderWidth:1, borderColor:typeColor(n.type)+'30' }}>
                    <Text>{typeIcon(n.type)}</Text>
                  </View>
                  <View style={{ flex:1 }}>
                    <Text style={{ fontSize:14, fontWeight:'800', color:C.text, marginBottom:2 }}>{n.title}</Text>
                    <Text style={{ fontSize:13, color:C.muted, lineHeight:18 }}>{n.body}</Text>
                    <Text style={{ fontSize:11, color:C.dim, marginTop:4 }}>{n.time}</Text>
                  </View>
                  <TouchableOpacity onPress={() => dismiss(n.id)} style={{ padding:6 }}>
                    <Text style={{ color:C.dim, fontSize:16 }}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))
            }
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// ─── PROJECT FORM MODAL ───────────────────────────────────────────────────────
const ProjectForm = ({ visible, project, onClose, onSave }) => {
  const [form, setForm] = useState({ name:'', client:'', budget:'', due:'', lead:'', status:'Pending', desc:'', ...project });
  useEffect(() => { if (visible) setForm({ name:'', client:'', budget:'', due:'', lead:'', status:'Pending', desc:'', ...project }); }, [visible, project]);
  const set = k => v => setForm(f => ({ ...f, [k]:v }));
  const statuses = ['Pending','In Progress','On Track','At Risk'];
  const handleSave = () => {
    if (!form.name || !form.client) { Alert.alert('Required', 'Project name and client are required.'); return; }
    const statusColor = { 'On Track':C.green, 'In Progress':C.accent, 'Pending':C.orange, 'At Risk':C.red }[form.status] || C.muted;
    onSave({ ...form, statusColor, budget:parseFloat(form.budget)||0, spent:project?.spent||0, progress:project?.progress||0, crew:project?.crew||0 });
  };
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
        <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==='ios'?'padding':'height'}>
          <View style={{ padding:20, borderBottomWidth:1, borderBottomColor:C.border }}>
            <HeaderBar title={project?.id ? 'Edit Project' : 'New Project'} onBack={onClose} action="Save" onAction={handleSave} />
          </View>
          <ScrollView contentContainerStyle={{ padding:20 }}>
            <Input label="Project Name" value={form.name} onChangeText={set('name')} placeholder="e.g. Nike Summer Campaign" />
            <Input label="Client" value={form.client} onChangeText={set('client')} placeholder="e.g. Nike EMEA" />
            <Input label="Lead" value={form.lead} onChangeText={set('lead')} placeholder="e.g. Alex Morgan" />
            <View style={{ flexDirection:'row' }}>
              <View style={{ flex:1, marginRight:8 }}>
                <Input label="Budget (£)" value={form.budget?.toString()} onChangeText={set('budget')} placeholder="0" keyboardType="numeric" />
              </View>
              <View style={{ flex:1 }}>
                <Input label="Due Date" value={form.due} onChangeText={set('due')} placeholder="e.g. Mar 15" />
              </View>
            </View>
            <Text style={{ fontSize:12, color:C.muted, fontWeight:'700', letterSpacing:0.5, marginBottom:8, textTransform:'uppercase' }}>Status</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:16 }}>
              {statuses.map(s => {
                const sc = { 'On Track':C.green, 'In Progress':C.accent, 'Pending':C.orange, 'At Risk':C.red }[s];
                return <Pill key={s} label={s} active={form.status===s} color={sc} onPress={() => set('status')(s)} />;
              })}
            </ScrollView>
            <Input label="Description" value={form.desc} onChangeText={set('desc')} placeholder="Project brief..." multiline />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

// ─── PROJECTS SCREEN ─────────────────────────────────────────────────────────
const ProjectsScreen = ({ store }) => {
  const { projects, setProjects } = store;
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);

  const filters = ['All','On Track','In Progress','Pending','At Risk'];
  const filtered = projects.filter(p => {
    const mf = filter==='All' || p.status===filter;
    const ms = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  const handleSave = form => {
    if (editTarget?.id) {
      setProjects(prev => prev.map(p => p.id===editTarget.id ? { ...p, ...form } : p));
    } else {
      setProjects(prev => [...prev, { ...form, id:nextId(prev), spent:0, progress:0, crew:0 }]);
    }
    setFormOpen(false); setEditTarget(null);
  };

  const handleDelete = id => {
    Alert.alert('Delete Project', 'This cannot be undone.', [
      { text:'Cancel', style:'cancel' },
      { text:'Delete', style:'destructive', onPress:() => { setProjects(prev => prev.filter(p => p.id!==id)); setSelected(null); } }
    ]);
  };

  if (selected) {
    const p = projects.find(x => x.id===selected) || selected;
    return (
      <View style={{ flex:1 }}>
        <HeaderBar title="" onBack={() => setSelected(null)} action="Edit" onAction={() => { setEditTarget(p); setFormOpen(true); }} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom:40 }}>
          <View style={{ marginBottom:20 }}>
            <Badge label={p.status} color={p.statusColor} />
            <Text style={{ fontSize:24, fontWeight:'900', color:C.text, marginTop:12, letterSpacing:-0.5 }}>{p.name}</Text>
            <Text style={{ fontSize:14, color:C.muted, marginTop:4 }}>{p.client}</Text>
          </View>
          <View style={{ flexDirection:'row', marginHorizontal:-4, marginBottom:16 }}>
            <Tile value={'£'+(p.budget/1000).toFixed(0)+'k'} label="Budget" color={C.gold} />
            <Tile value={'£'+(p.spent/1000).toFixed(0)+'k'} label="Spent" color={p.spent/p.budget>0.9?C.red:C.muted} />
            <Tile value={p.crew} label="Crew" color={C.purple} />
          </View>
          <Card style={{ marginBottom:12 }}>
            <Text style={{ fontSize:12, color:C.muted, fontWeight:'700', letterSpacing:0.5, marginBottom:10, textTransform:'uppercase' }}>Progress</Text>
            <Bar progress={p.progress} color={p.statusColor} h={10} />
            <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop:10 }}>
              <Text style={{ fontSize:12, color:C.muted }}>£{p.spent.toLocaleString()} spent</Text>
              <Text style={{ fontSize:18, fontWeight:'900', color:p.statusColor }}>{Math.round(p.progress*100)}%</Text>
            </View>
          </Card>
          <Card>
            {[['Lead', p.lead], ['Due', p.due], ['Status', p.status], ['Remaining', '£'+((p.budget-p.spent)||0).toLocaleString()]].map(([k,v],i) => (
              <View key={k}>
                {i>0 && <Sep />}
                <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
                  <Text style={{ fontSize:12, color:C.muted, fontWeight:'600' }}>{k}</Text>
                  <Text style={{ fontSize:13, color:C.text, fontWeight:'700' }}>{v}</Text>
                </View>
              </View>
            ))}
          </Card>
          {p.desc ? <Card style={{ marginTop:4 }}><Text style={{ fontSize:13, color:C.muted, lineHeight:20 }}>{p.desc}</Text></Card> : null}
          <TouchableOpacity onPress={() => handleDelete(p.id)} style={{ backgroundColor:C.redDeep, padding:15, borderRadius:16,
            alignItems:'center', marginTop:8, borderWidth:1, borderColor:C.red+'30' }}>
            <Text style={{ color:C.red, fontWeight:'800' }}>Delete Project</Text>
          </TouchableOpacity>
        </ScrollView>
        <ProjectForm visible={formOpen} project={editTarget} onClose={() => { setFormOpen(false); setEditTarget(null); }} onSave={handleSave} />
      </View>
    );
  }

  return (
    <View style={{ flex:1 }}>
      <ProjectForm visible={formOpen} project={editTarget} onClose={() => { setFormOpen(false); setEditTarget(null); }} onSave={handleSave} />
      <Input value={search} onChangeText={setSearch} placeholder="Search projects..." style={{ marginBottom:12 }} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:16 }}>
        {filters.map(f => <Pill key={f} label={f} active={filter===f} onPress={() => setFilter(f)} />)}
      </ScrollView>
      <View style={{ flexDirection:'row', marginBottom:16, marginHorizontal:-4 }}>
        {[['All',projects.length,C.text],['Active',projects.filter(p=>p.status!=='Pending').length,C.green],['At Risk',projects.filter(p=>p.status==='At Risk').length,C.red]].map(([l,v,c]) => (
          <Tile key={l} value={v} label={l} color={c} />
        ))}
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom:30 }}>
        {filtered.length===0
          ? <Empty icon="🎬" title="No projects found" sub="Try a different filter or create your first project." action="+ New Project" onAction={() => { setEditTarget(null); setFormOpen(true); }} />
          : filtered.map(p => (
            <Card key={p.id} onPress={() => setSelected(p)}>
              <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <View style={{ flex:1, paddingRight:10 }}>
                  <Text style={{ fontSize:15, fontWeight:'800', color:C.text, marginBottom:3 }}>{p.name}</Text>
                  <Text style={{ fontSize:12, color:C.muted }}>{p.client} · {p.lead}</Text>
                </View>
                <Badge label={p.status} color={p.statusColor} />
              </View>
              <Bar progress={p.progress} color={p.statusColor} h={5} />
              <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop:12 }}>
                <Text style={{ fontSize:11, color:C.dim }}>👥 {p.crew} crew · 📅 {p.due}</Text>
                <Text style={{ fontSize:13, color:C.gold, fontWeight:'900' }}>£{(p.budget/1000).toFixed(0)}k</Text>
              </View>
            </Card>
          ))
        }
      </ScrollView>
    </View>
  );
};


// ─── CREW FORM MODAL ─────────────────────────────────────────────────────────
const CrewForm = ({ visible, member, onClose, onSave }) => {
  const [form, setForm] = useState({ name:'', role:'', dept:'', phone:'', email:'', rate:'', bio:'', status:'Available', ...member });
  useEffect(() => { if(visible) setForm({ name:'', role:'', dept:'', phone:'', email:'', rate:'', bio:'', status:'Available', ...member }); }, [visible, member]);
  const set = k => v => setForm(f => ({ ...f, [k]:v }));
  const depts = ['Production','Camera','Lighting','Audio','Art','Post','Other'];
  const statuses = ['Available','On Set','Travelling'];
  const COLORS = [C.accent,C.purple,C.green,C.gold,C.orange,C.teal,C.pink,C.red];
  const handleSave = () => {
    if (!form.name || !form.role) { Alert.alert('Required','Name and role are required.'); return; }
    onSave({ ...form, rate:parseFloat(form.rate)||0, color:member?.color||COLORS[Math.floor(Math.random()*COLORS.length)], rating:member?.rating||4.5, projects:member?.projects||0 });
  };
  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
        <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==='ios'?'padding':'height'}>
          <View style={{ padding:20, borderBottomWidth:1, borderBottomColor:C.border }}>
            <HeaderBar title={member?.id ? 'Edit Crew Member' : 'Add Crew Member'} onBack={onClose} action="Save" onAction={handleSave} />
          </View>
          <ScrollView contentContainerStyle={{ padding:20 }}>
            <Input label="Full Name" value={form.name} onChangeText={set('name')} placeholder="e.g. Alex Morgan" />
            <Input label="Role / Job Title" value={form.role} onChangeText={set('role')} placeholder="e.g. Director of Photography" />
            <View style={{ flexDirection:'row' }}>
              <View style={{ flex:1, marginRight:8 }}>
                <Input label="Day Rate (£)" value={form.rate?.toString()} onChangeText={set('rate')} placeholder="0" keyboardType="numeric" />
              </View>
              <View style={{ flex:1 }}>
                <Input label="Phone" value={form.phone} onChangeText={set('phone')} placeholder="+44..." keyboardType="phone-pad" />
              </View>
            </View>
            <Input label="Email" value={form.email} onChangeText={set('email')} placeholder="name@example.com" keyboardType="email-address" />
            <Text style={{ fontSize:12, color:C.muted, fontWeight:'700', letterSpacing:0.5, marginBottom:8, textTransform:'uppercase' }}>Department</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:16 }}>
              {depts.map(d => <Pill key={d} label={d} active={form.dept===d} color={C.purple} onPress={() => set('dept')(d)} />)}
            </ScrollView>
            <Text style={{ fontSize:12, color:C.muted, fontWeight:'700', letterSpacing:0.5, marginBottom:8, textTransform:'uppercase' }}>Availability</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:16 }}>
              {statuses.map(s => {
                const sc = { Available:C.green, 'On Set':C.accent, Travelling:C.orange }[s];
                return <Pill key={s} label={s} active={form.status===s} color={sc} onPress={() => set('status')(s)} />;
              })}
            </ScrollView>
            <Input label="Bio" value={form.bio} onChangeText={set('bio')} placeholder="Brief professional bio..." multiline />
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
};

// ─── CREW SCREEN ─────────────────────────────────────────────────────────────
const CrewScreen = ({ store }) => {
  const { crew, setCrew } = store;
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const depts = ['All','Production','Camera','Lighting','Audio','Art','Post'];

  const filtered = crew.filter(c => {
    const md = deptFilter==='All' || c.dept===deptFilter;
    const ms = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase());
    return md && ms;
  });

  const handleSave = form => {
    if (editTarget?.id) setCrew(prev => prev.map(c => c.id===editTarget.id ? { ...c, ...form } : c));
    else setCrew(prev => [...prev, { ...form, id:nextId(prev) }]);
    setFormOpen(false); setEditTarget(null);
  };

  const handleDelete = id => {
    Alert.alert('Remove Crew Member', 'This cannot be undone.', [
      { text:'Cancel', style:'cancel' },
      { text:'Remove', style:'destructive', onPress:() => { setCrew(prev => prev.filter(c => c.id!==id)); setSelected(null); } }
    ]);
  };

  if (selected) {
    const c = crew.find(x => x.id===selected) || {};
    const sc = statusColor(c.status);
    return (
      <View style={{ flex:1 }}>
        <HeaderBar title="" onBack={() => setSelected(null)} action="Edit" onAction={() => { setEditTarget(c); setFormOpen(true); }} />
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom:40 }}>
          <View style={{ alignItems:'center', paddingVertical:28 }}>
            <View style={{ position:'relative' }}>
              <Avatar name={c.name} size={88} color={c.color} />
              <OnlineDot online={c.status==='Available'||c.status==='On Set'} size={16} />
            </View>
            <Text style={{ fontSize:24, fontWeight:'900', color:C.text, marginTop:16, letterSpacing:-0.5 }}>{c.name}</Text>
            <Text style={{ fontSize:14, color:C.muted, marginTop:4 }}>{c.role} · {c.dept}</Text>
            <View style={{ marginTop:12 }}><Badge label={c.status} color={sc} /></View>
          </View>
          <Sep />
          <View style={{ flexDirection:'row', marginHorizontal:-4, marginBottom:16 }}>
            <Tile value={'£'+c.rate} label="Day Rate" color={C.gold} />
            <Tile value={'★ '+c.rating} label="Rating" color={C.green} />
            <Tile value={c.projects} label="Projects" color={C.accent} />
          </View>
          {c.bio ? <Card><Text style={{ fontSize:13, color:C.muted, lineHeight:20 }}>{c.bio}</Text></Card> : null}
          <Card>
            {c.phone && <><View style={{ flexDirection:'row', justifyContent:'space-between' }}><Text style={{ fontSize:12, color:C.muted, fontWeight:'600' }}>Phone</Text><Text style={{ fontSize:13, color:C.text, fontWeight:'700' }}>{c.phone}</Text></View><Sep /></>}
            {c.email && <View style={{ flexDirection:'row', justifyContent:'space-between' }}><Text style={{ fontSize:12, color:C.muted, fontWeight:'600' }}>Email</Text><Text style={{ fontSize:13, color:C.text, fontWeight:'700' }}>{c.email}</Text></View>}
          </Card>
          <View style={{ flexDirection:'row', marginTop:8 }}>
            <TouchableOpacity style={{ flex:1, backgroundColor:C.accent, padding:15, borderRadius:16, alignItems:'center', marginRight:8 }}>
              <Text style={{ color:'#fff', fontWeight:'800' }}>💬 Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex:1, backgroundColor:C.surface, padding:15, borderRadius:16, alignItems:'center', borderWidth:1, borderColor:C.border }}>
              <Text style={{ color:C.text, fontWeight:'800' }}>📅 Schedule</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity onPress={() => handleDelete(c.id)} style={{ backgroundColor:C.redDeep, padding:15, borderRadius:16, alignItems:'center', marginTop:10, borderWidth:1, borderColor:C.red+'30' }}>
            <Text style={{ color:C.red, fontWeight:'800' }}>Remove from Roster</Text>
          </TouchableOpacity>
        </ScrollView>
        <CrewForm visible={formOpen} member={editTarget} onClose={() => { setFormOpen(false); setEditTarget(null); }} onSave={handleSave} />
      </View>
    );
  }

  return (
    <View style={{ flex:1 }}>
      <CrewForm visible={formOpen} member={editTarget} onClose={() => { setFormOpen(false); setEditTarget(null); }} onSave={handleSave} />
      <Input value={search} onChangeText={setSearch} placeholder="Search crew..." style={{ marginBottom:12 }} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:16 }}>
        {depts.map(d => <Pill key={d} label={d} active={deptFilter===d} color={C.purple} onPress={() => setDeptFilter(d)} />)}
      </ScrollView>
      <View style={{ flexDirection:'row', marginHorizontal:-4, marginBottom:16 }}>
        {[['Available',crew.filter(c=>c.status==='Available').length,C.green],['On Set',crew.filter(c=>c.status==='On Set').length,C.accent],['Travelling',crew.filter(c=>c.status==='Travelling').length,C.orange]].map(([l,v,c]) => (
          <Tile key={l} value={v} label={l} color={c} />
        ))}
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom:30 }}>
        {filtered.length===0
          ? <Empty icon="👥" title="No crew found" sub="Add your first crew member to build your roster." action="+ Add Crew" onAction={() => { setEditTarget(null); setFormOpen(true); }} />
          : filtered.map(c => (
            <Card key={c.id} onPress={() => setSelected(c.id)}>
              <View style={{ flexDirection:'row', alignItems:'center' }}>
                <View style={{ position:'relative', marginRight:14 }}>
                  <Avatar name={c.name} size={50} color={c.color} />
                  <OnlineDot online={c.status!=='Travelling'} size={11} />
                </View>
                <View style={{ flex:1 }}>
                  <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:3 }}>
                    <Text style={{ fontSize:15, fontWeight:'800', color:C.text }}>{c.name}</Text>
                    <Badge label={c.status} color={statusColor(c.status)} small />
                  </View>
                  <Text style={{ fontSize:12, color:C.muted, marginBottom:5 }}>{c.role} · {c.dept}</Text>
                  <View style={{ flexDirection:'row', alignItems:'center' }}>
                    <Text style={{ fontSize:11, color:C.gold, fontWeight:'700' }}>★ {c.rating}</Text>
                    <Text style={{ fontSize:11, color:C.dim, marginLeft:10 }}>{c.projects} jobs</Text>
                    <Text style={{ fontSize:11, color:C.accent, marginLeft:10, fontWeight:'700' }}>£{c.rate}/day</Text>
                  </View>
                </View>
              </View>
            </Card>
          ))
        }
      </ScrollView>
    </View>
  );
};


// ─── SCHEDULE SCREEN ─────────────────────────────────────────────────────────
const ScheduleScreen = ({ store }) => {
  const { shifts, setShifts, crew, projects } = store;
  const [selDay, setSelDay] = useState('Mon');
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const dayShifts = shifts.filter(s => s.day===selDay);

  const ShiftForm = ({ visible, shift, onClose, onSave }) => {
    const [form, setForm] = useState({ project:'', role:'', crewId:'', day:selDay, start:'09:00', end:'18:00', location:'', ...shift, crewId:shift?.crewId?.toString()||'' });
    useEffect(() => { if(visible) setForm({ project:'', role:'', crewId:'', day:selDay, start:'09:00', end:'18:00', location:'', ...shift, crewId:shift?.crewId?.toString()||'' }); }, [visible]);
    const set = k => v => setForm(f => ({ ...f, [k]:v }));
    const SHIFT_COLORS = [C.accent,C.purple,C.green,C.gold,C.orange,C.teal,C.pink,C.red];
    const handleSave = () => {
      if (!form.project || !form.role) { Alert.alert('Required','Project and role are required.'); return; }
      const selectedCrew = crew.find(c => c.id===parseInt(form.crewId));
      onSave({ ...form, crewId:parseInt(form.crewId)||null, color:selectedCrew?.color||SHIFT_COLORS[shifts.length%SHIFT_COLORS.length] });
    };
    return (
      <Modal visible={visible} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
          <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==='ios'?'padding':'height'}>
            <View style={{ padding:20, borderBottomWidth:1, borderBottomColor:C.border }}>
              <HeaderBar title={shift?.id ? 'Edit Shift' : 'Add Shift'} onBack={onClose} action="Save" onAction={handleSave} />
            </View>
            <ScrollView contentContainerStyle={{ padding:20 }}>
              <Input label="Project" value={form.project} onChangeText={set('project')} placeholder="Project name" />
              <Input label="Role" value={form.role} onChangeText={set('role')} placeholder="e.g. Director, Gaffer" />
              <Text style={{ fontSize:12, color:C.muted, fontWeight:'700', letterSpacing:0.5, marginBottom:8, textTransform:'uppercase' }}>Crew Member</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:16 }}>
                {crew.map(c => (
                  <TouchableOpacity key={c.id} onPress={() => set('crewId')(c.id.toString())} style={{
                    alignItems:'center', marginRight:12, opacity: form.crewId===c.id.toString() ? 1 : 0.5 }}>
                    <View style={{ borderWidth:2, borderColor: form.crewId===c.id.toString() ? c.color : 'transparent', borderRadius:26, padding:2 }}>
                      <Avatar name={c.name} size={44} color={c.color} />
                    </View>
                    <Text style={{ fontSize:10, color: form.crewId===c.id.toString() ? C.text : C.muted, fontWeight:'700', marginTop:5, textAlign:'center' }}>{c.name.split(' ')[0]}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={{ fontSize:12, color:C.muted, fontWeight:'700', letterSpacing:0.5, marginBottom:8, textTransform:'uppercase' }}>Day</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:16 }}>
                {days.map(d => <Pill key={d} label={d} active={form.day===d} onPress={() => set('day')(d)} />)}
              </ScrollView>
              <View style={{ flexDirection:'row' }}>
                <View style={{ flex:1, marginRight:8 }}>
                  <Input label="Start Time" value={form.start} onChangeText={set('start')} placeholder="09:00" />
                </View>
                <View style={{ flex:1 }}>
                  <Input label="End Time" value={form.end} onChangeText={set('end')} placeholder="18:00" />
                </View>
              </View>
              <Input label="Location" value={form.location} onChangeText={set('location')} placeholder="e.g. Studio A, London" />
            </ScrollView>
          </KeyboardAvoidingView>
        </SafeAreaView>
      </Modal>
    );
  };

  const handleSave = form => {
    if (editTarget?.id) setShifts(prev => prev.map(s => s.id===editTarget.id ? { ...s, ...form } : s));
    else setShifts(prev => [...prev, { ...form, id:nextId(prev) }]);
    setFormOpen(false); setEditTarget(null);
  };

  const deleteShift = id => {
    Alert.alert('Delete Shift', 'Remove this shift?', [
      { text:'Cancel', style:'cancel' },
      { text:'Delete', style:'destructive', onPress:() => setShifts(prev => prev.filter(s => s.id!==id)) }
    ]);
  };

  const dayRate = dayShifts.reduce((a,s) => {
    const c = crew.find(c => c.id===s.crewId);
    return a + (c?.rate||0);
  }, 0);

  return (
    <View style={{ flex:1 }}>
      <ShiftForm visible={formOpen} shift={editTarget} onClose={() => { setFormOpen(false); setEditTarget(null); }} onSave={handleSave} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:20 }}>
        {days.map(d => {
          const has = shifts.some(s => s.day===d);
          const isSel = d===selDay;
          return (
            <TouchableOpacity key={d} onPress={() => setSelDay(d)} style={{
              alignItems:'center', marginRight:10, paddingVertical:12, paddingHorizontal:18,
              borderRadius:18, backgroundColor:isSel?C.accent:C.card, borderWidth:1, borderColor:isSel?C.accent:C.border }}>
              <Text style={{ fontSize:13, fontWeight:'800', color:isSel?'#fff':C.muted, marginBottom:has?6:0 }}>{d}</Text>
              {has && <View style={{ width:5, height:5, borderRadius:3, backgroundColor:isSel?'rgba(255,255,255,0.7)':C.accent }} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <View style={{ flexDirection:'row', marginHorizontal:-4, marginBottom:16 }}>
        <Tile value={dayShifts.length} label="Shifts" color={C.accent} />
        <Tile value={dayShifts.length} label="Crew" color={C.purple} />
        <Tile value={'£'+dayRate.toLocaleString()} label="Day Rate" color={C.gold} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom:80 }}>
        {dayShifts.length===0
          ? <Empty icon="📅" title={"Nothing on " + selDay} sub="No shifts scheduled yet. Add one below." action="+ Add Shift" onAction={() => { setEditTarget(null); setFormOpen(true); }} />
          : dayShifts.map(shift => {
            const c = crew.find(x => x.id===shift.crewId);
            return (
              <Card key={shift.id} style={{ borderLeftWidth:4, borderLeftColor:shift.color }}>
                <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start' }}>
                  <View style={{ flex:1 }}>
                    <Text style={{ fontSize:15, fontWeight:'800', color:C.text, marginBottom:2 }}>{shift.project}</Text>
                    <Text style={{ fontSize:12, color:C.muted, marginBottom:10 }}>{shift.role}{shift.location ? ' · ' + shift.location : ''}</Text>
                    {c && <View style={{ flexDirection:'row', alignItems:'center' }}>
                      <Avatar name={c.name} size={28} color={c.color} />
                      <Text style={{ fontSize:13, color:C.textSoft, marginLeft:8, fontWeight:'700' }}>{c.name}</Text>
                      {c.rate && <Text style={{ fontSize:11, color:C.gold, marginLeft:8, fontWeight:'700' }}>£{c.rate}/day</Text>}
                    </View>}
                  </View>
                  <View style={{ alignItems:'flex-end' }}>
                    <View style={{ backgroundColor:shift.color+'18', paddingHorizontal:12, paddingVertical:7, borderRadius:20, borderWidth:1, borderColor:shift.color+'35', marginBottom:10 }}>
                      <Text style={{ color:shift.color, fontWeight:'800', fontSize:12 }}>{shift.start}–{shift.end}</Text>
                    </View>
                    <View style={{ flexDirection:'row' }}>
                      <TouchableOpacity onPress={() => { setEditTarget(shift); setFormOpen(true); }} style={{ padding:6, marginRight:4 }}>
                        <Text style={{ fontSize:14 }}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteShift(shift.id)} style={{ padding:6 }}>
                        <Text style={{ fontSize:14 }}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Card>
            );
          })
        }
        <Row title="All Upcoming Shifts" />
        {shifts.filter(s=>s.day!==selDay).slice(0,8).map(shift => {
          const c = crew.find(x => x.id===shift.crewId);
          return (
            <View key={shift.id+'-all'} style={{ flexDirection:'row', alignItems:'center', paddingVertical:12, borderBottomWidth:1, borderBottomColor:C.border }}>
              <View style={{ width:8, height:8, borderRadius:4, backgroundColor:shift.color, marginRight:14 }} />
              {c && <Avatar name={c.name} size={32} color={c.color} />}
              <View style={{ flex:1, marginLeft:10 }}>
                <Text style={{ fontSize:13, fontWeight:'700', color:C.text }}>{shift.project}</Text>
                <Text style={{ fontSize:11, color:C.muted }}>{c?.name||'Unassigned'} · {shift.role}</Text>
              </View>
              <View style={{ alignItems:'flex-end' }}>
                <Text style={{ fontSize:12, fontWeight:'700', color:C.muted }}>{shift.day}</Text>
                <Text style={{ fontSize:11, color:C.dim }}>{shift.start}–{shift.end}</Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};


// ─────────────────────────────────────────────
// PART 7: MESSAGES SCREEN
// ─────────────────────────────────────────────
function MessagesScreen({ store, onNav }) {
  const { messages, chatHistory, crew, sendMessage, setMessages } = store;
  const [activeConvo, setActiveConvo] = React.useState(null);
  const [inputText, setInputText] = React.useState('');
  const [search, setSearch] = React.useState('');
  const scrollRef = React.useRef(null);

  const convos = messages.filter(m =>
    search === '' || m.name.toLowerCase().includes(search.toLowerCase())
  );

  const openConvo = (m) => {
    setActiveConvo(m);
    const updated = messages.map(msg => msg.id === m.id ? { ...msg, unread: 0 } : msg);
    setMessages(updated);
  };

  const handleSend = () => {
    if (!inputText.trim() || !activeConvo) return;
    const newMsg = {
      id: Date.now(),
      sender: 'me',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    store.addChatMessage(activeConvo.id, newMsg);
    setInputText('');
    setTimeout(() => scrollRef.current && scrollRef.current.scrollToEnd({ animated: true }), 100);
    // Simulate reply after 1.5s
    setTimeout(() => {
      const replies = [
        'Got it, thanks!',
        'On it!',
        'Will do.',
        'Sounds good.',
        'I\'ll check and get back to you.',
        'Copy that.',
      ];
      const replyMsg = {
        id: Date.now() + 1,
        sender: activeConvo.id,
        text: replies[Math.floor(Math.random() * replies.length)],
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      store.addChatMessage(activeConvo.id, replyMsg);
    }, 1500);
  };

  const history = activeConvo ? (chatHistory[activeConvo.id] || []) : [];

  if (activeConvo) {
    return (
      <View style={{ flex: 1, backgroundColor: C.bg }}>
        <HeaderBar
          title={activeConvo.name}
          subtitle={activeConvo.role}
          left={
            <TouchableOpacity onPress={() => setActiveConvo(null)} style={{ padding: 8 }}>
              <Text style={{ color: C.accent, fontSize: 16 }}>{'← Back'}</Text>
            </TouchableOpacity>
          }
          right={
            <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontSize: 16 }}>{activeConvo.avatar}</Text>
            </View>
          }
        />
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
          onContentSizeChange={() => scrollRef.current && scrollRef.current.scrollToEnd({ animated: false })}
        >
          {history.length === 0 && (
            <Empty icon="💬" label={"Start the conversation with " + activeConvo.name} />
          )}
          {history.map((msg, i) => {
            const isMe = msg.sender === 'me';
            return (
              <View key={msg.id || i} style={{ flexDirection: 'row', justifyContent: isMe ? 'flex-end' : 'flex-start', marginBottom: 10 }}>
                {!isMe && (
                  <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center', marginRight: 8, marginTop: 2 }}>
                    <Text style={{ fontSize: 13 }}>{activeConvo.avatar}</Text>
                  </View>
                )}
                <View style={{ maxWidth: '72%' }}>
                  <View style={{
                    backgroundColor: isMe ? C.accent : C.card,
                    borderRadius: 18,
                    borderBottomRightRadius: isMe ? 4 : 18,
                    borderBottomLeftRadius: isMe ? 18 : 4,
                    paddingHorizontal: 14,
                    paddingVertical: 9,
                  }}>
                    <Text style={{ color: isMe ? '#fff' : C.text, fontSize: 14, lineHeight: 20 }}>{msg.text}</Text>
                  </View>
                  <Text style={{ color: C.muted, fontSize: 10, marginTop: 3, textAlign: isMe ? 'right' : 'left', marginHorizontal: 4 }}>{msg.time}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          padding: 12,
          paddingBottom: 20,
          backgroundColor: C.surface,
          borderTopWidth: 1,
          borderTopColor: C.border,
        }}>
          <TextInput
            value={inputText}
            onChangeText={setInputText}
            placeholder="Message..."
            placeholderTextColor={C.muted}
            style={{
              flex: 1,
              backgroundColor: C.card,
              borderRadius: 22,
              paddingHorizontal: 16,
              paddingVertical: 10,
              color: C.text,
              fontSize: 14,
              marginRight: 10,
            }}
            onSubmitEditing={handleSend}
            returnKeyType="send"
            multiline={false}
          />
          <TouchableOpacity
            onPress={handleSend}
            style={{
              width: 42,
              height: 42,
              borderRadius: 21,
              backgroundColor: inputText.trim() ? C.accent : C.border,
              alignItems: 'center',
              justifyContent: 'center',
            }}
            activeOpacity={0.8}
          >
            <Text style={{ color: '#fff', fontSize: 18 }}>↑</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const totalUnread = messages.reduce((a, m) => a + (m.unread || 0), 0);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <HeaderBar
        title="Messages"
        subtitle={totalUnread > 0 ? totalUnread + ' unread' : 'All caught up'}
        right={
          <TouchableOpacity
            onPress={() => {
              const opts = crew.slice(0, 5).map(function(c) {
                return { text: c.name, onPress: function() {
                  const existing = messages.find(function(m) { return m.id === c.id; });
                  if (existing) { openConvo(existing); }
                  else {
                    const newConvo = { id: c.id, name: c.name, role: c.role, avatar: c.name.charAt(0), lastMsg: '', time: 'Now', unread: 0 };
                    store.setMessages([newConvo, ...messages]);
                    setTimeout(function() { openConvo(newConvo); }, 100);
                  }
                }};
              });
              Alert.alert('New Message', 'Select a crew member to message', [...opts, { text: 'Cancel', style: 'cancel' }]);
            }}
            style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: '#fff', fontSize: 20, lineHeight: 24 }}>+</Text>
          </TouchableOpacity>
        }
      />
      <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        <Input
          placeholder="Search conversations..."
          value={search}
          onChangeText={setSearch}
          style={{ marginBottom: 0 }}
        />
      </View>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {convos.length === 0 && <Empty icon="💬" label="No conversations yet" />}
        {convos.map(m => (
          <TouchableOpacity
            key={m.id}
            onPress={() => openConvo(m)}
            activeOpacity={0.75}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderBottomWidth: 1,
              borderBottomColor: C.border,
              backgroundColor: m.unread > 0 ? 'rgba(77,141,245,0.05)' : 'transparent',
            }}
          >
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: C.card, alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <Text style={{ fontSize: 20 }}>{m.avatar}</Text>
              <OnlineDot online={Math.random() > 0.4} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
                <Text style={{ color: C.text, fontSize: 15, fontWeight: m.unread > 0 ? '700' : '500' }}>{m.name}</Text>
                <Text style={{ color: C.muted, fontSize: 11 }}>{m.time}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: C.sub, fontSize: 13, flex: 1, marginRight: 8 }} numberOfLines={1}>{m.lastMsg || 'No messages yet'}</Text>
                {m.unread > 0 && (
                  <View style={{ backgroundColor: C.accent, borderRadius: 10, minWidth: 20, height: 20, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 5 }}>
                    <Text style={{ color: '#fff', fontSize: 11, fontWeight: '700' }}>{m.unread}</Text>
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
// PART 8: INVOICES SCREEN
// ─────────────────────────────────────────────
function InvoiceForm({ invoice, projects, onSave, onClose }) {
  const isEdit = !!invoice;
  const [client, setClient] = React.useState(invoice ? invoice.client : '');
  const [project, setProject] = React.useState(invoice ? invoice.project : (projects[0] ? projects[0].title : ''));
  const [amount, setAmount] = React.useState(invoice ? String(invoice.amount) : '');
  const [status, setStatus] = React.useState(invoice ? invoice.status : 'Draft');
  const [due, setDue] = React.useState(invoice ? invoice.due : '');
  const [notes, setNotes] = React.useState(invoice ? invoice.notes || '' : '');
  const statusOpts = ['Draft', 'Sent', 'Paid', 'Overdue'];

  const save = () => {
    if (!client.trim() || !amount.trim()) {
      Alert.alert('Missing Info', 'Client name and amount are required.');
      return;
    }
    onSave({
      id: invoice ? invoice.id : Date.now(),
      client: client.trim(),
      project: project || 'General',
      amount: parseFloat(amount) || 0,
      status,
      due: due || 'TBD',
      notes: notes.trim(),
      number: invoice ? invoice.number : 'INV-' + String(Date.now()).slice(-4),
      date: invoice ? invoice.date : new Date().toLocaleDateString(),
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <HeaderBar
        title={isEdit ? 'Edit Invoice' : 'New Invoice'}
        subtitle={isEdit ? invoice.number : 'Create invoice'}
        left={<TouchableOpacity onPress={onClose} style={{ padding: 8 }}><Text style={{ color: C.muted, fontSize: 15 }}>Cancel</Text></TouchableOpacity>}
        right={<TouchableOpacity onPress={save} style={{ padding: 8 }}><Text style={{ color: C.accent, fontSize: 15, fontWeight: '700' }}>Save</Text></TouchableOpacity>}
      />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 80 }}>
        <Input label="Client Name *" value={client} onChangeText={setClient} placeholder="e.g. Netflix Productions" />
        <Input label="Project" value={project} onChangeText={setProject} placeholder="Project name" />
        <Input label="Amount ($) *" value={amount} onChangeText={setAmount} placeholder="0.00" keyboardType="decimal-pad" />
        <Input label="Due Date" value={due} onChangeText={setDue} placeholder="e.g. Dec 31, 2025" />
        <Input label="Notes" value={notes} onChangeText={setNotes} placeholder="Optional notes..." multiline />
        <Text style={{ color: C.sub, fontSize: 12, marginBottom: 8, marginTop: 4 }}>STATUS</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
          {statusOpts.map(s => (
            <TouchableOpacity
              key={s}
              onPress={() => setStatus(s)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 20,
                marginRight: 8,
                marginBottom: 8,
                backgroundColor: status === s ? invoiceStatusColor(s) : C.card,
                borderWidth: status === s ? 0 : 1,
                borderColor: C.border,
              }}
            >
              <Text style={{ color: status === s ? '#fff' : C.sub, fontSize: 13, fontWeight: '600' }}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function invoiceStatusColor(s) {
  if (s === 'Paid') return C.green;
  if (s === 'Overdue') return C.red;
  if (s === 'Sent') return C.accent;
  return C.muted;
}

function InvoicesScreen({ store, onNav }) {
  const { invoices, projects, addInvoice, updateInvoice, deleteInvoice } = store;
  const [filter, setFilter] = React.useState('All');
  const [showForm, setShowForm] = React.useState(false);
  const [editInv, setEditInv] = React.useState(null);
  const [search, setSearch] = React.useState('');
  const filters = ['All', 'Draft', 'Sent', 'Paid', 'Overdue'];

  const filtered = invoices.filter(inv => {
    const matchFilter = filter === 'All' || inv.status === filter;
    const matchSearch = search === '' || inv.client.toLowerCase().includes(search.toLowerCase()) || inv.project.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const total = invoices.reduce((a, i) => a + i.amount, 0);
  const paid = invoices.filter(i => i.status === 'Paid').reduce((a, i) => a + i.amount, 0);
  const pending = invoices.filter(i => i.status === 'Sent').reduce((a, i) => a + i.amount, 0);
  const overdue = invoices.filter(i => i.status === 'Overdue').reduce((a, i) => a + i.amount, 0);

  const fmt = (n) => '$' + n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const handleSave = (inv) => {
    if (editInv) updateInvoice(inv);
    else addInvoice(inv);
    setShowForm(false);
    setEditInv(null);
  };

  const handleDelete = (inv) => {
    Alert.alert('Delete Invoice', 'Remove ' + inv.number + '?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteInvoice(inv.id) },
    ]);
  };

  const sendInvoice = (inv) => {
    Alert.alert('Send Invoice', 'Send ' + inv.number + ' to ' + inv.client + '?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Send', onPress: () => updateInvoice({ ...inv, status: 'Sent' }) },
    ]);
  };

  const markPaid = (inv) => {
    Alert.alert('Mark as Paid', 'Mark ' + inv.number + ' as paid?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Mark Paid', onPress: () => updateInvoice({ ...inv, status: 'Paid' }) },
    ]);
  };

  if (showForm || editInv) {
    return (
      <InvoiceForm
        invoice={editInv}
        projects={projects}
        onSave={handleSave}
        onClose={() => { setShowForm(false); setEditInv(null); }}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <HeaderBar
        title="Invoices"
        subtitle={fmt(total) + ' total'}
        right={
          <TouchableOpacity
            onPress={() => setShowForm(true)}
            style={{ width: 34, height: 34, borderRadius: 17, backgroundColor: C.accent, alignItems: 'center', justifyContent: 'center' }}
          >
            <Text style={{ color: '#fff', fontSize: 20, lineHeight: 24 }}>+</Text>
          </TouchableOpacity>
        }
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Stats Row */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 16, paddingVertical: 12 }}>
          {[
            { label: 'Collected', val: fmt(paid), color: C.green },
            { label: 'Pending', val: fmt(pending), color: C.accent },
            { label: 'Overdue', val: fmt(overdue), color: C.red },
          ].map(s => (
            <View key={s.label} style={{ flex: 1, backgroundColor: C.card, borderRadius: 14, padding: 12, marginRight: 8, alignItems: 'center' }}>
              <Text style={{ color: s.color, fontSize: 16, fontWeight: '700' }}>{s.val}</Text>
              <Text style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Search */}
        <View style={{ paddingHorizontal: 16, marginBottom: 4 }}>
          <Input placeholder="Search invoices..." value={search} onChangeText={setSearch} style={{ marginBottom: 0 }} />
        </View>

        {/* Filter Pills */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingLeft: 16, marginBottom: 12, marginTop: 4 }}>
          {filters.map(f => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 7,
                borderRadius: 20,
                marginRight: 8,
                backgroundColor: filter === f ? C.accent : C.card,
              }}
            >
              <Text style={{ color: filter === f ? '#fff' : C.sub, fontSize: 13, fontWeight: '600' }}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filtered.length === 0 && <Empty icon="🧾" label="No invoices found" />}

        {filtered.map(inv => (
          <View key={inv.id} style={{
            marginHorizontal: 16,
            marginBottom: 12,
            backgroundColor: C.card,
            borderRadius: 18,
            padding: 16,
            borderWidth: 1,
            borderColor: inv.status === 'Overdue' ? 'rgba(255,80,80,0.3)' : C.border,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: C.text, fontSize: 16, fontWeight: '700' }}>{inv.client}</Text>
                <Text style={{ color: C.sub, fontSize: 12, marginTop: 2 }}>{inv.number} · {inv.project}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={{ color: C.text, fontSize: 18, fontWeight: '700' }}>{fmt(inv.amount)}</Text>
                <View style={{ backgroundColor: invoiceStatusColor(inv.status) + '33', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 3, marginTop: 4 }}>
                  <Text style={{ color: invoiceStatusColor(inv.status), fontSize: 11, fontWeight: '700' }}>{inv.status}</Text>
                </View>
              </View>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Text style={{ color: C.muted, fontSize: 12 }}>Due: {inv.due}</Text>
              <Text style={{ color: C.muted, fontSize: 12 }}>Issued: {inv.date}</Text>
            </View>
            {inv.notes ? <Text style={{ color: C.sub, fontSize: 12, marginBottom: 12, fontStyle: 'italic' }}>{inv.notes}</Text> : null}
            <View style={{ flexDirection: 'row', borderTopWidth: 1, borderTopColor: C.border, paddingTop: 10 }}>
              {inv.status === 'Draft' && (
                <TouchableOpacity onPress={() => sendInvoice(inv)} style={{ flex: 1, alignItems: 'center', paddingVertical: 6 }}>
                  <Text style={{ color: C.accent, fontSize: 13, fontWeight: '600' }}>📤 Send</Text>
                </TouchableOpacity>
              )}
              {inv.status === 'Sent' && (
                <TouchableOpacity onPress={() => markPaid(inv)} style={{ flex: 1, alignItems: 'center', paddingVertical: 6 }}>
                  <Text style={{ color: C.green, fontSize: 13, fontWeight: '600' }}>✅ Mark Paid</Text>
                </TouchableOpacity>
              )}
              {inv.status === 'Overdue' && (
                <TouchableOpacity onPress={() => sendInvoice(inv)} style={{ flex: 1, alignItems: 'center', paddingVertical: 6 }}>
                  <Text style={{ color: C.red, fontSize: 13, fontWeight: '600' }}>🔔 Remind</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => setEditInv(inv)} style={{ flex: 1, alignItems: 'center', paddingVertical: 6 }}>
                <Text style={{ color: C.sub, fontSize: 13, fontWeight: '600' }}>✏️ Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(inv)} style={{ flex: 1, alignItems: 'center', paddingVertical: 6 }}>
                <Text style={{ color: C.red, fontSize: 13, fontWeight: '600' }}>🗑 Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}


// ─────────────────────────────────────────────
// PART 9: TIME TRACKING + REPORTS SCREENS
// ─────────────────────────────────────────────

function TimeTrackingScreen({ store, onNav }) {
  const { timeEntries, projects, addTimeEntry, deleteTimeEntry } = store;
  const [running, setRunning] = React.useState(false);
  const [elapsed, setElapsed] = React.useState(0);
  const [startTime, setStartTime] = React.useState(null);
  const [selProject, setSelProject] = React.useState(projects[0] ? projects[0].title : '');
  const [taskNote, setTaskNote] = React.useState('');
  const timerRef = React.useRef(null);

  React.useEffect(() => {
    if (running) {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [running]);

  const fmtTime = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    return (h > 0 ? String(h).padStart(2, '0') + ':' : '') + String(m).padStart(2, '0') + ':' + String(sec).padStart(2, '0');
  };

  const toggleTimer = () => {
    if (running) {
      Alert.alert('Stop Timer', 'Save this time entry?', [
        { text: 'Discard', style: 'destructive', onPress: () => { setRunning(false); setElapsed(0); } },
        { text: 'Save', onPress: () => {
          addTimeEntry({
            id: Date.now(),
            project: selProject,
            task: taskNote || 'General work',
            duration: elapsed,
            date: new Date().toLocaleDateString(),
            start: startTime,
          });
          setRunning(false);
          setElapsed(0);
          setTaskNote('');
        }},
      ]);
    } else {
      setStartTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setRunning(true);
    }
  };

  const totalHours = timeEntries.reduce((a, e) => a + (e.duration || 0), 0);
  const todayEntries = timeEntries.filter(e => e.date === new Date().toLocaleDateString());
  const todayHours = todayEntries.reduce((a, e) => a + (e.duration || 0), 0);

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <HeaderBar title="Time Tracking" subtitle={Math.floor(totalHours / 3600) + 'h total logged'} />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* Timer Card */}
        <View style={{
          backgroundColor: running ? 'rgba(77,141,245,0.12)' : C.card,
          borderRadius: 24,
          padding: 28,
          alignItems: 'center',
          marginBottom: 20,
          borderWidth: 1,
          borderColor: running ? C.accent + '55' : C.border,
        }}>
          <Text style={{ color: C.muted, fontSize: 12, fontWeight: '600', letterSpacing: 1.5, marginBottom: 12, textTransform: 'uppercase' }}>
            {running ? '● Recording' : 'Timer'}
          </Text>
          <Text style={{
            color: running ? C.accent : C.text,
            fontSize: 56,
            fontWeight: '200',
            letterSpacing: 2,
            fontVariant: ['tabular-nums'],
            marginBottom: 20,
          }}>
            {fmtTime(elapsed)}
          </Text>
          <View style={{ width: '100%', marginBottom: 16 }}>
            <Text style={{ color: C.sub, fontSize: 12, marginBottom: 6 }}>PROJECT</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {projects.map(p => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => !running && setSelProject(p.title)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 7,
                    borderRadius: 16,
                    marginRight: 8,
                    backgroundColor: selProject === p.title ? C.accent : C.surface,
                    borderWidth: 1,
                    borderColor: selProject === p.title ? C.accent : C.border,
                  }}
                >
                  <Text style={{ color: selProject === p.title ? '#fff' : C.sub, fontSize: 12, fontWeight: '600' }} numberOfLines={1}>{p.title}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          <TextInput
            value={taskNote}
            onChangeText={setTaskNote}
            placeholder="What are you working on?"
            placeholderTextColor={C.muted}
            editable={!running}
            style={{
              width: '100%',
              backgroundColor: C.surface,
              borderRadius: 12,
              padding: 12,
              color: C.text,
              fontSize: 14,
              marginBottom: 20,
            }}
          />
          <TouchableOpacity
            onPress={toggleTimer}
            activeOpacity={0.85}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: running ? C.red : C.accent,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: running ? C.red : C.accent,
              shadowOpacity: 0.5,
              shadowRadius: 16,
              elevation: 8,
            }}
          >
            <Text style={{ color: '#fff', fontSize: 28 }}>{running ? '⏹' : '▶'}</Text>
          </TouchableOpacity>
        </View>

        {/* Today Stats */}
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          {[
            { label: "Today", val: fmtTime(todayHours), icon: '📅' },
            { label: "This Week", val: fmtTime(Math.min(totalHours, 144000)), icon: '📆' },
            { label: "Entries", val: String(timeEntries.length), icon: '📋' },
          ].map(s => (
            <View key={s.label} style={{ flex: 1, backgroundColor: C.card, borderRadius: 14, padding: 12, marginRight: 8, alignItems: 'center' }}>
              <Text style={{ fontSize: 18, marginBottom: 4 }}>{s.icon}</Text>
              <Text style={{ color: C.text, fontSize: 15, fontWeight: '700' }}>{s.val}</Text>
              <Text style={{ color: C.muted, fontSize: 11, marginTop: 2 }}>{s.label}</Text>
            </View>
          ))}
        </View>

        {/* Log */}
        <Text style={{ color: C.sub, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 10, textTransform: 'uppercase' }}>Recent Entries</Text>
        {timeEntries.length === 0 && <Empty icon="⏱" label="No time logged yet. Start the timer above." />}
        {timeEntries.slice().reverse().map(entry => (
          <View key={entry.id} style={{
            backgroundColor: C.card,
            borderRadius: 14,
            padding: 14,
            marginBottom: 10,
            flexDirection: 'row',
            alignItems: 'center',
          }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.text, fontSize: 14, fontWeight: '600', marginBottom: 3 }}>{entry.task}</Text>
              <Text style={{ color: C.sub, fontSize: 12 }}>{entry.project} · {entry.date}</Text>
            </View>
            <Text style={{ color: C.accent, fontSize: 15, fontWeight: '700', marginRight: 12 }}>{fmtTime(entry.duration || 0)}</Text>
            <TouchableOpacity onPress={() => Alert.alert('Delete Entry', 'Remove this time entry?', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Delete', style: 'destructive', onPress: () => deleteTimeEntry(entry.id) },
            ])}>
              <Text style={{ color: C.muted, fontSize: 18 }}>×</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

function ReportsScreen({ store, onNav }) {
  const { projects, invoices, timeEntries, crew } = store;
  const [period, setPeriod] = React.useState('Month');
  const periods = ['Week', 'Month', 'Quarter', 'Year'];

  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((a, i) => a + i.amount, 0);
  const totalPending = invoices.filter(i => i.status !== 'Paid').reduce((a, i) => a + i.amount, 0);
  const totalHours = Math.floor(timeEntries.reduce((a, e) => a + (e.duration || 0), 0) / 3600);
  const activeProjects = projects.filter(p => p.status === 'Active').length;
  const fmt = (n) => '$' + n.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  // Simple bar chart data
  const barData = [
    { label: 'Jan', val: 18000 },
    { label: 'Feb', val: 24000 },
    { label: 'Mar', val: 21000 },
    { label: 'Apr', val: 32000 },
    { label: 'May', val: 28000 },
    { label: 'Jun', val: totalRevenue > 0 ? totalRevenue : 35000 },
  ];
  const maxVal = Math.max(...barData.map(d => d.val));

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <HeaderBar title="Reports" subtitle="Business analytics" />
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* Period Selector */}
        <View style={{ flexDirection: 'row', backgroundColor: C.card, borderRadius: 16, padding: 4, marginBottom: 20 }}>
          {periods.map(p => (
            <TouchableOpacity
              key={p}
              onPress={() => setPeriod(p)}
              style={{
                flex: 1,
                paddingVertical: 8,
                borderRadius: 12,
                backgroundColor: period === p ? C.accent : 'transparent',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: period === p ? '#fff' : C.sub, fontSize: 13, fontWeight: '600' }}>{p}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* KPI Grid */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
          {[
            { label: 'Revenue', val: fmt(totalRevenue), icon: '💰', color: C.green },
            { label: 'Pending', val: fmt(totalPending), icon: '⏳', color: C.yellow },
            { label: 'Hours', val: totalHours + 'h', icon: '⏱', color: C.accent },
            { label: 'Projects', val: String(activeProjects), icon: '🎬', color: C.purple },
          ].map((k, i) => (
            <View key={k.label} style={{
              width: '48%',
              backgroundColor: C.card,
              borderRadius: 18,
              padding: 16,
              marginBottom: 12,
              marginRight: i % 2 === 0 ? '4%' : 0,
              borderLeftWidth: 3,
              borderLeftColor: k.color,
            }}>
              <Text style={{ fontSize: 24, marginBottom: 8 }}>{k.icon}</Text>
              <Text style={{ color: k.color, fontSize: 22, fontWeight: '700', marginBottom: 4 }}>{k.val}</Text>
              <Text style={{ color: C.muted, fontSize: 12 }}>{k.label}</Text>
            </View>
          ))}
        </View>

        {/* Revenue Bar Chart */}
        <View style={{ backgroundColor: C.card, borderRadius: 18, padding: 16, marginBottom: 20 }}>
          <Text style={{ color: C.text, fontSize: 15, fontWeight: '700', marginBottom: 16 }}>Revenue Trend</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 100, marginBottom: 8 }}>
            {barData.map((d, i) => {
              const barH = Math.max(6, (d.val / maxVal) * 90);
              return (
                <View key={d.label} style={{ flex: 1, alignItems: 'center' }}>
                  <View style={{
                    width: '65%',
                    height: barH,
                    backgroundColor: i === barData.length - 1 ? C.accent : C.accent + '55',
                    borderRadius: 6,
                    marginBottom: 6,
                  }} />
                  <Text style={{ color: C.muted, fontSize: 10 }}>{d.label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* Top Projects */}
        <View style={{ backgroundColor: C.card, borderRadius: 18, padding: 16, marginBottom: 20 }}>
          <Text style={{ color: C.text, fontSize: 15, fontWeight: '700', marginBottom: 14 }}>Top Projects</Text>
          {projects.slice(0, 4).map((p, i) => {
            const pct = Math.floor(60 + Math.random() * 35);
            const colors = [C.green, C.accent, C.yellow, C.purple];
            return (
              <View key={p.id} style={{ marginBottom: 14 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 }}>
                  <Text style={{ color: C.text, fontSize: 13 }} numberOfLines={1}>{p.title}</Text>
                  <Text style={{ color: colors[i % 4], fontSize: 13, fontWeight: '700' }}>{pct}%</Text>
                </View>
                <View style={{ height: 5, backgroundColor: C.surface, borderRadius: 3 }}>
                  <View style={{ height: 5, width: pct + '%', backgroundColor: colors[i % 4], borderRadius: 3 }} />
                </View>
              </View>
            );
          })}
        </View>

        {/* Crew Utilization */}
        <View style={{ backgroundColor: C.card, borderRadius: 18, padding: 16 }}>
          <Text style={{ color: C.text, fontSize: 15, fontWeight: '700', marginBottom: 14 }}>Crew Utilization</Text>
          {crew.slice(0, 5).map((c, i) => {
            const util = Math.floor(40 + (i * 13) % 55);
            return (
              <View key={c.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: C.surface, alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                  <Text style={{ fontSize: 14 }}>{c.name.charAt(0)}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                    <Text style={{ color: C.text, fontSize: 12 }}>{c.name}</Text>
                    <Text style={{ color: C.sub, fontSize: 12 }}>{util}%</Text>
                  </View>
                  <View style={{ height: 4, backgroundColor: C.surface, borderRadius: 2 }}>
                    <View style={{ height: 4, width: util + '%', backgroundColor: util > 80 ? C.red : util > 60 ? C.yellow : C.green, borderRadius: 2 }} />
                  </View>
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
// PART 10: MORE / SETTINGS SCREEN + TAB BAR
// ─────────────────────────────────────────────

function MoreScreen({ store, onNav }) {
  const { settings, updateSettings, currentUser } = store;
  const [notifOn, setNotifOn] = React.useState(settings ? settings.notifications : true);
  const [darkMode, setDarkMode] = React.useState(settings ? settings.darkMode : true);
  const [biometric, setBiometric] = React.useState(settings ? settings.biometric : false);
  const [emailDigest, setEmailDigest] = React.useState(settings ? settings.emailDigest : true);

  const toggle = (key, val, setter) => {
    setter(val);
    updateSettings && updateSettings({ ...settings, [key]: val });
  };

  const MenuItem = ({ icon, label, sublabel, onPress, right, danger }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: C.border,
      }}
    >
      <View style={{
        width: 36,
        height: 36,
        borderRadius: 10,
        backgroundColor: danger ? 'rgba(255,80,80,0.15)' : C.card,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
      }}>
        <Text style={{ fontSize: 18 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: danger ? C.red : C.text, fontSize: 14, fontWeight: '600' }}>{label}</Text>
        {sublabel ? <Text style={{ color: C.muted, fontSize: 12, marginTop: 2 }}>{sublabel}</Text> : null}
      </View>
      {right !== undefined ? right : <Text style={{ color: C.muted, fontSize: 16 }}>›</Text>}
    </TouchableOpacity>
  );

  const SectionTitle = ({ title }) => (
    <Text style={{ color: C.sub, fontSize: 11, fontWeight: '700', letterSpacing: 1.2, textTransform: 'uppercase', paddingHorizontal: 16, paddingTop: 22, paddingBottom: 8 }}>{title}</Text>
  );

  return (
    <View style={{ flex: 1, backgroundColor: C.bg }}>
      <HeaderBar title="More" subtitle="Account & Settings" />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile Card */}
        <View style={{
          margin: 16,
          backgroundColor: C.card,
          borderRadius: 20,
          padding: 20,
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 1,
          borderColor: C.border,
        }}>
          <View style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            backgroundColor: C.accent + '33',
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 14,
            borderWidth: 2,
            borderColor: C.accent,
          }}>
            <Text style={{ fontSize: 24 }}>{currentUser ? currentUser.avatar || '👤' : '👤'}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: C.text, fontSize: 17, fontWeight: '700' }}>{currentUser ? currentUser.name : 'Production Manager'}</Text>
            <Text style={{ color: C.sub, fontSize: 13, marginTop: 2 }}>{currentUser ? currentUser.role : 'Admin'}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: C.green, marginRight: 5 }} />
              <Text style={{ color: C.green, fontSize: 11 }}>Online</Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => Alert.alert('Edit Profile', 'Update your name, role, and avatar in profile settings.')}
            style={{ padding: 8 }}
          >
            <Text style={{ color: C.accent, fontSize: 13, fontWeight: '600' }}>Edit</Text>
          </TouchableOpacity>
        </View>

        <SectionTitle title="Notifications" />
        <View style={{ backgroundColor: C.card, marginHorizontal: 16, borderRadius: 16, overflow: 'hidden' }}>
          <MenuItem
            icon="🔔"
            label="Push Notifications"
            sublabel="Alerts for shifts and messages"
            right={
              <Switch
                value={notifOn}
                onValueChange={v => toggle('notifications', v, setNotifOn)}
                trackColor={{ false: C.border, true: C.accent + '88' }}
                thumbColor={notifOn ? C.accent : C.muted}
              />
            }
          />
          <MenuItem
            icon="📧"
            label="Email Digest"
            sublabel="Daily summary emails"
            right={
              <Switch
                value={emailDigest}
                onValueChange={v => toggle('emailDigest', v, setEmailDigest)}
                trackColor={{ false: C.border, true: C.accent + '88' }}
                thumbColor={emailDigest ? C.accent : C.muted}
              />
            }
          />
        </View>

        <SectionTitle title="App Preferences" />
        <View style={{ backgroundColor: C.card, marginHorizontal: 16, borderRadius: 16, overflow: 'hidden' }}>
          <MenuItem
            icon="🌙"
            label="Dark Mode"
            sublabel="Always on"
            right={
              <Switch
                value={darkMode}
                onValueChange={v => toggle('darkMode', v, setDarkMode)}
                trackColor={{ false: C.border, true: C.accent + '88' }}
                thumbColor={darkMode ? C.accent : C.muted}
              />
            }
          />
          <MenuItem
            icon="🔐"
            label="Biometric Lock"
            sublabel="Face ID / Fingerprint"
            right={
              <Switch
                value={biometric}
                onValueChange={v => toggle('biometric', v, setBiometric)}
                trackColor={{ false: C.border, true: C.accent + '88' }}
                thumbColor={biometric ? C.accent : C.muted}
              />
            }
          />
          <MenuItem icon="📱" label="App Version" sublabel="v2.4.0 (Build 241)" right={<Text style={{ color: C.muted, fontSize: 13 }}>Latest</Text>} onPress={() => {}} />
        </View>

        <SectionTitle title="Workspace" />
        <View style={{ backgroundColor: C.card, marginHorizontal: 16, borderRadius: 16, overflow: 'hidden' }}>
          <MenuItem icon="🏢" label="Company Settings" sublabel="Logo, name, timezone" onPress={() => Alert.alert('Company Settings', 'Manage your workspace details.')} />
          <MenuItem icon="🎨" label="Branding" sublabel="Colors, custom themes" onPress={() => Alert.alert('Branding', 'Customize your CrewDesk appearance.')} />
          <MenuItem icon="🔗" label="Integrations" sublabel="Slack, QuickBooks, Google Cal" onPress={() => Alert.alert('Integrations', 'Connect your favorite tools.')} />
          <MenuItem icon="💾" label="Export Data" sublabel="CSV, PDF reports" onPress={() => Alert.alert('Export', 'Choose format to export your data.')} />
        </View>

        <SectionTitle title="Support" />
        <View style={{ backgroundColor: C.card, marginHorizontal: 16, borderRadius: 16, overflow: 'hidden' }}>
          <MenuItem icon="📚" label="Help Center" onPress={() => Alert.alert('Help Center', 'Browse our documentation and guides.')} />
          <MenuItem icon="💬" label="Contact Support" onPress={() => Alert.alert('Support', 'Email us at support@crewdesk.app')} />
          <MenuItem icon="⭐" label="Rate CrewDesk" onPress={() => Alert.alert('Thanks!', 'We appreciate your support!')} />
        </View>

        <SectionTitle title="Account" />
        <View style={{ backgroundColor: C.card, marginHorizontal: 16, borderRadius: 16, overflow: 'hidden', marginBottom: 8 }}>
          <MenuItem icon="🚪" label="Sign Out" danger onPress={() => Alert.alert('Sign Out', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: () => Alert.alert('Signed out', 'See you next time!') },
          ])} />
        </View>
      </ScrollView>
    </View>
  );
}

// ─────────────────────────────────────────────
// TAB BAR COMPONENT
// ─────────────────────────────────────────────
const TAB_CONFIG = [
  { key: 'home',      label: 'Home',     icon: '⚡' },
  { key: 'projects',  label: 'Projects', icon: '🎬' },
  { key: 'crew',      label: 'Crew',     icon: '👥' },
  { key: 'schedule',  label: 'Schedule', icon: '📅' },
  { key: 'messages',  label: 'Messages', icon: '💬' },
  { key: 'invoices',  label: 'Invoices', icon: '🧾' },
  { key: 'time',      label: 'Time',     icon: '⏱' },
  { key: 'reports',   label: 'Reports',  icon: '📊' },
  { key: 'more',      label: 'More',     icon: '⚙️' },
];

function TabBar({ active, onTab, unreadMessages }) {
  const primary = TAB_CONFIG.slice(0, 5);
  return (
    <View style={{
      flexDirection: 'row',
      backgroundColor: C.surface,
      borderTopWidth: 1,
      borderTopColor: C.border,
      paddingBottom: 8,
      paddingTop: 6,
    }}>
      {primary.map(t => {
        const isActive = active === t.key;
        const badge = t.key === 'messages' && unreadMessages > 0;
        return (
          <TouchableOpacity
            key={t.key}
            onPress={() => onTab(t.key)}
            style={{ flex: 1, alignItems: 'center', paddingVertical: 4 }}
            activeOpacity={0.7}
          >
            <View style={{ position: 'relative' }}>
              <Text style={{ fontSize: 22, opacity: isActive ? 1 : 0.5 }}>{t.icon}</Text>
              {badge && (
                <View style={{
                  position: 'absolute',
                  top: -3,
                  right: -5,
                  backgroundColor: C.red,
                  borderRadius: 8,
                  minWidth: 16,
                  height: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 3,
                }}>
                  <Text style={{ color: '#fff', fontSize: 9, fontWeight: '700' }}>{unreadMessages}</Text>
                </View>
              )}
            </View>
            <Text style={{
              color: isActive ? C.accent : C.muted,
              fontSize: 10,
              marginTop: 3,
              fontWeight: isActive ? '700' : '400',
            }}>{t.label}</Text>
            {isActive && (
              <View style={{ width: 20, height: 2, backgroundColor: C.accent, borderRadius: 1, marginTop: 3 }} />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

function MoreTabBar({ active, onTab }) {
  const secondary = TAB_CONFIG.slice(5);
  return (
    <View style={{ backgroundColor: C.surface, borderBottomWidth: 1, borderBottomColor: C.border, paddingVertical: 6 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 12 }}>
        {secondary.map(t => {
          const isActive = active === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              onPress={() => onTab(t.key)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 14,
                paddingVertical: 7,
                borderRadius: 16,
                marginRight: 8,
                backgroundColor: isActive ? C.accent + '22' : 'transparent',
                borderWidth: 1,
                borderColor: isActive ? C.accent : 'transparent',
              }}
              activeOpacity={0.7}
            >
              <Text style={{ fontSize: 15, marginRight: 5 }}>{t.icon}</Text>
              <Text style={{ color: isActive ? C.accent : C.sub, fontSize: 13, fontWeight: isActive ? '700' : '500' }}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}


// ─────────────────────────────────────────────
// PART 11: MAIN APP COMPONENT
// ─────────────────────────────────────────────

export default function App() {
  const store = useStore();
  const [activeTab, setActiveTab] = React.useState('home');
  const [showNotif, setShowNotif] = React.useState(false);

  const unreadMessages = store.messages.reduce((a, m) => a + (m.unread || 0), 0);

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':      return <HomeScreen store={store} onNav={setActiveTab} />;
      case 'projects':  return <ProjectsScreen store={store} onNav={setActiveTab} />;
      case 'crew':      return <CrewScreen store={store} onNav={setActiveTab} />;
      case 'schedule':  return <ScheduleScreen store={store} onNav={setActiveTab} />;
      case 'messages':  return <MessagesScreen store={store} onNav={setActiveTab} />;
      case 'invoices':  return <InvoicesScreen store={store} onNav={setActiveTab} />;
      case 'time':      return <TimeTrackingScreen store={store} onNav={setActiveTab} />;
      case 'reports':   return <ReportsScreen store={store} onNav={setActiveTab} />;
      case 'more':      return <MoreScreen store={store} onNav={setActiveTab} />;
      default:          return <HomeScreen store={store} onNav={setActiveTab} />;
    }
  };

  const secondaryTabs = ['invoices', 'time', 'reports', 'more'];
  const isSecondary = secondaryTabs.includes(activeTab);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      {isSecondary && <MoreTabBar active={activeTab} onTab={setActiveTab} />}
      <View style={{ flex: 1 }}>{renderScreen()}</View>
      <TabBar active={activeTab} onTab={setActiveTab} unreadMessages={unreadMessages} />

      {/* Global Notification Modal */}
      {showNotif && (
        <NotifModal
          notifications={store.notifications}
          onDismiss={(id) => store.dismissNotification(id)}
          onClose={() => setShowNotif(false)}
        />
      )}
    </SafeAreaView>
  );
}
