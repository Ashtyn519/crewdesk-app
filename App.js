import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, SafeAreaView, StatusBar, Animated, Dimensions,
  Modal, Alert, FlatList, KeyboardAvoidingView, Platform,
  Switch, Pressable, Image
} from 'react-native';

const C = {
  bg:'#0B0F19', bgCard:'#141824', bgElevated:'#1C2235', bgHighlight:'#242A3D', bgSheet:'#F9F7F3',
  primary:'#F5A623', primarySoft:'#FDF3DC', accent:'#00D4B4', accentSoft:'#D6FBF5',
  punch:'#FF5C5C', punchSoft:'#FFE8E8', success:'#4ADE80', successSoft:'#D9FCE8',
  purple:'#A78BFA', purpleSoft:'#EDE9FE', ink:'#FFFFFF', inkMuted:'#8892A4',
  inkFaint:'#3D4559', inkDark:'#0B0F19', border:'#232A3E', borderLight:'#E8E4DC',
  shadow:'rgba(0,0,0,0.4)', overlay:'rgba(11,15,25,0.85)',
};
const TY = {
  hero:   { fontSize:36, fontWeight:'800', letterSpacing:-1.5, lineHeight:40 },
  h1:     { fontSize:28, fontWeight:'800', letterSpacing:-1,   lineHeight:34 },
  h2:     { fontSize:22, fontWeight:'700', letterSpacing:-0.5, lineHeight:28 },
  h3:     { fontSize:17, fontWeight:'700', letterSpacing:-0.2, lineHeight:22 },
  label:  { fontSize:11, fontWeight:'700', letterSpacing:1.2,  textTransform:'uppercase' },
  body:   { fontSize:15, fontWeight:'400', lineHeight:22 },
  bodyMd: { fontSize:14, fontWeight:'400', lineHeight:20 },
  caption:{ fontSize:12, fontWeight:'500', lineHeight:16 },
  mono:   { fontSize:13, fontWeight:'600', fontVariant:['tabular-nums'] },
};
const { width: SW, height: SH } = Dimensions.get('window');
const isIOS = Platform.OS === 'ios';

let _listeners = [];
const store = {
  projects: [
    { id:'p1', title:'Midnight Runner — Feature Film', client:'StudioFX Productions', status:'active', budget:480000, spent:312000, crew:14, startDate:'2026-01-15', endDate:'2026-07-30', location:'London, UK', desc:'A high-octane action thriller filmed across London and Edinburgh.' },
    { id:'p2', title:'Nova Brand Campaign', client:'Nova Collective', status:'active', budget:95000, spent:41200, crew:6, startDate:'2026-02-01', endDate:'2026-04-15', location:'Manchester, UK', desc:'A 360 brand refresh campaign across OOH, digital and broadcast.' },
    { id:'p3', title:'Altitude — Documentary', client:'Channel 4', status:'completed', budget:220000, spent:218500, crew:9, startDate:'2025-09-01', endDate:'2026-01-20', location:'Scotland, UK', desc:'Award-winning documentary exploring life above the clouds.' },
  ],
  crew: [
    { id:'c1', name:'Sophia Marlowe', role:'Director of Photography', dept:'Camera', rate:1200, status:'active', phone:'+44 7700 900001', email:'sophia@crewdesk.io', location:'London', skills:['Arri Alexa', 'Lighting', 'Drone'], initials:'SM', color:'#F5A623' },
    { id:'c2', name:'Marcus Webb', role:'Production Designer', dept:'Art', rate:950, status:'active', phone:'+44 7700 900002', email:'marcus@crewdesk.io', location:'Manchester', skills:['Set Design', 'Concept Art', 'CAD'], initials:'MW', color:'#00D4B4' },
    { id:'c3', name:'Priya Nair', role:'Sound Supervisor', dept:'Sound', rate:875, status:'onleave', phone:'+44 7700 900003', email:'priya@crewdesk.io', location:'Birmingham', skills:['Boom Operator', 'Pro Tools', 'Foley'], initials:'PN', color:'#A78BFA' },
    { id:'c4', name:'James Fletcher', role:'1st AC', dept:'Camera', rate:720, status:'active', phone:'+44 7700 900004', email:'james@crewdesk.io', location:'London', skills:['Focus Pull', 'Lens Matching'], initials:'JF', color:'#FF5C5C' },
    { id:'c5', name:'Aisha Okafor', role:'Gaffer', dept:'Electrical', rate:810, status:'active', phone:'+44 7700 900005', email:'aisha@crewdesk.io', location:'Leeds', skills:['HMI Lighting', 'LED', 'Rigging'], initials:'AO', color:'#4ADE80' },
  ],
  shifts: [
    { id:'s1', title:'Principal Photography Day 12', project:'Midnight Runner', crewNeeded:8, date:'2026-03-10', callTime:'06:00', wrapTime:'18:00', location:'Pinewood Studios Stage 4', status:'confirmed', dept:'Full Crew', notes:'Camera test at 05:30' },
    { id:'s2', title:'Brand Shoot Day 1', project:'Nova Brand Campaign', crewNeeded:4, date:'2026-03-11', callTime:'08:00', wrapTime:'17:00', location:'ICI Studios Manchester', status:'pending', dept:'Camera + Art', notes:'Client attending' },
    { id:'s3', title:'VFX Review Session', project:'Midnight Runner', crewNeeded:3, date:'2026-03-12', callTime:'10:00', wrapTime:'16:00', location:'Remote Zoom', status:'confirmed', dept:'Post', notes:'Bring latest cut' },
  ],
  messages: [
    { id:'m1', name:'Sophia Marlowe', initials:'SM', color:'#F5A623', preview:'Can we push call time to 06:30?', time:'09:41', unread:2, msgs:[
      { id:'msg1', from:'them', text:'Morning! Just checking call time tomorrow?', time:'09:38' },
      { id:'msg2', from:'them', text:'Can we push call time to 06:30?', time:'09:41' },
    ]},
    { id:'m2', name:'Marcus Webb', initials:'MW', color:'#00D4B4', preview:'Set build is on schedule', time:'Yesterday', unread:0, msgs:[
      { id:'msg1', from:'them', text:'Set build is on schedule', time:'Yesterday' },
    ]},
    { id:'m3', name:'Project: Midnight Runner', initials:'MR', color:'#A78BFA', preview:'Budget review at 14:00 today', time:'08:15', unread:1, msgs:[
      { id:'msg1', from:'me', text:'Reminder: budget review at 14:00 today', time:'08:15' },
    ]},
  ],
  invoices: [
    { id:'i1', number:'INV-2026-001', client:'StudioFX Productions', project:'Midnight Runner', amount:48000, status:'paid', dueDate:'2026-02-28', issueDate:'2026-02-01', items:[] },
    { id:'i2', number:'INV-2026-002', client:'Nova Collective', project:'Nova Brand Campaign', amount:18500, status:'pending', dueDate:'2026-03-20', issueDate:'2026-03-01', items:[] },
    { id:'i3', number:'INV-2026-003', client:'Channel 4', project:'Altitude Documentary', amount:9250, status:'overdue', dueDate:'2026-02-15', issueDate:'2026-01-25', items:[] },
  ],
  notifications: [
    { id:'n1', type:'warning', title:'Budget Alert', body:'Midnight Runner is at 65% of budget with 8 weeks remaining.', action:'Review Budget', read:false, time:'10 min ago' },
    { id:'n2', type:'success', title:'Invoice Paid', body:'INV-2026-001 48000 from StudioFX Productions has cleared.', action:'View Invoice', read:false, time:'2 hours ago' },
    { id:'n3', type:'info', title:'New Crew Request', body:'3 crew members have submitted availability for Midnight Runner.', action:'Review Requests', read:true, time:'Yesterday' },
  ],
};
function subscribe(fn) { _listeners.push(fn); return () => { _listeners = _listeners.filter(l => l !== fn); }; }
function getStore() { return { ...store }; }
function dispatch(fn) { fn(store); _listeners.forEach(l => l()); }
function useStore() {
  const [, setTick] = useState(0);
  useEffect(() => subscribe(() => setTick(t => t + 1)), []);
  return { data: getStore(), dispatch };
}

function Card({ children, style, onPress, elevated = false }) {
  const bg = elevated ? C.bgElevated : C.bgCard;
  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.82} onPress={onPress}
        style={[{ backgroundColor:bg, borderRadius:20, borderWidth:1, borderColor:C.border,
          shadowColor:C.shadow, shadowOffset:{width:0,height:4}, shadowOpacity:1, shadowRadius:16, elevation:8 }, style]}>
        {children}
      </TouchableOpacity>
    );
  }
  return (
    <View style={[{ backgroundColor:bg, borderRadius:20, borderWidth:1, borderColor:C.border,
      shadowColor:C.shadow, shadowOffset:{width:0,height:4}, shadowOpacity:1, shadowRadius:16, elevation:8 }, style]}>
      {children}
    </View>
  );
}
function Badge({ label, color = C.primary, textColor = C.inkDark, size = 'md' }) {
  const pad = size === 'sm' ? { paddingHorizontal:8, paddingVertical:3 } : { paddingHorizontal:12, paddingVertical:5 };
  const fs  = size === 'sm' ? 10 : 11;
  return (
    <View style={[{ backgroundColor:color, borderRadius:100 }, pad]}>
      <Text style={{ color:textColor, fontSize:fs, fontWeight:'700', letterSpacing:0.6, textTransform:'uppercase' }}>{label}</Text>
    </View>
  );
}
function SectionLabel({ text, right }) {
  return (
    <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
      <Text style={[TY.label, { color:C.inkMuted }]}>{text}</Text>
      {right}
    </View>
  );
}
function EmptyState({ icon, title, body, onAction, actionLabel }) {
  return (
    <View style={{ alignItems:'center', paddingVertical:60, paddingHorizontal:32 }}>
      <Text style={{ fontSize:48, marginBottom:16 }}>{icon}</Text>
      <Text style={[TY.h3, { color:C.ink, textAlign:'center', marginBottom:8 }]}>{title}</Text>
      <Text style={[TY.body, { color:C.inkMuted, textAlign:'center', marginBottom:24 }]}>{body}</Text>
      {onAction && (
        <TouchableOpacity onPress={onAction}
          style={{ backgroundColor:C.primary, paddingHorizontal:24, paddingVertical:12, borderRadius:100 }}>
          <Text style={{ color:C.inkDark, ...TY.h3 }}>{actionLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
function NotifCard({ notif, onDismiss }) {
  const typeMap = {
    warning: { color:C.primary, bg:'#1E1A0F', icon:'bolt' },
    success: { color:C.success, bg:'#0C1A14', icon:'check' },
    info:    { color:C.accent,  bg:'#0A1A1A', icon:'info' },
    error:   { color:C.punch,   bg:'#1A0C0C', icon:'alert' },
  };
  const t = typeMap[notif.type] || typeMap.info;
  return (
    <View style={{ backgroundColor:t.bg, borderRadius:16, borderLeftWidth:4, borderLeftColor:t.color,
      marginBottom:10, overflow:'hidden', flexDirection:'row' }}>
      <View style={{ flex:1, padding:14 }}>
        <View style={{ flexDirection:'row', alignItems:'center', marginBottom:4 }}>
          <Text style={[TY.h3, { color:C.ink }]}>{notif.title}</Text>
          {!notif.read && <View style={{ width:7, height:7, borderRadius:4, backgroundColor:t.color, marginLeft:8 }}/>}
        </View>
        <Text style={[TY.bodyMd, { color:C.inkMuted, marginBottom:8 }]}>{notif.body}</Text>
        <Text style={{ color:t.color, ...TY.caption, fontWeight:'700' }}>{notif.action} -></Text>
      </View>
      <TouchableOpacity onPress={onDismiss} style={{ padding:14, justifyContent:'flex-start' }}>
        <Text style={{ color:C.inkFaint, fontSize:18 }}>x</Text>
      </TouchableOpacity>
    </View>
  );
}
function Avatar({ initials, color, size = 44 }) {
  return (
    <View style={{ width:size, height:size, borderRadius:size/2, backgroundColor:color+'33',
      borderWidth:2, borderColor:color, alignItems:'center', justifyContent:'center' }}>
      <Text style={{ color, fontSize:size*0.35, fontWeight:'800' }}>{initials}</Text>
    </View>
  );
}
function statusColor(s) {
  return s === 'active' || s === 'confirmed' || s === 'paid' ? C.success
       : s === 'pending' ? C.primary
       : s === 'overdue' ? C.punch
       : s === 'completed' ? C.accent
       : s === 'onleave' ? C.purple
       : C.inkMuted;
}
function statusLabel(s) {
  return { active:'Active', confirmed:'Confirmed', pending:'Pending', paid:'Paid',
           overdue:'Overdue', completed:'Completed', onleave:'On Leave' }[s] || s;
}
function Field({ label, value, onChangeText, placeholder, keyboardType, multiline, lines }) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={{ marginBottom:16 }}>
      <Text style={[TY.label, { color:C.inkMuted, marginBottom:6 }]}>{label}</Text>
      <TextInput
        value={value} onChangeText={onChangeText} placeholder={placeholder}
        placeholderTextColor={C.inkFaint} keyboardType={keyboardType || 'default'}
        multiline={multiline} numberOfLines={lines || 1}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        style={{ backgroundColor:C.bgHighlight, borderRadius:12, paddingHorizontal:14,
          paddingVertical:12, color:C.ink, ...TY.body,
          borderWidth:1.5, borderColor:focused ? C.primary : C.border,
          minHeight:multiline ? 80 : 48 }}
      />
    </View>
  );
}
function PrimaryBtn({ label, onPress, color, disabled }) {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}
      style={{ backgroundColor:disabled ? C.bgHighlight : (color || C.primary),
        borderRadius:100, paddingVertical:15, alignItems:'center',
        shadowColor:color || C.primary, shadowOffset:{width:0,height:6},
        shadowOpacity:disabled ? 0 : 0.45, shadowRadius:16, elevation:8, opacity:disabled ? 0.5 : 1 }}>
      <Text style={[TY.h3, { color:disabled ? C.inkMuted : C.inkDark }]}>{label}</Text>
    </TouchableOpacity>
  );
}
function Sheet({ visible, onClose, title, children }) {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <Pressable style={{ flex:1, backgroundColor:C.overlay, justifyContent:'flex-end' }} onPress={onClose}>
        <Pressable onPress={() => {}} style={{ backgroundColor:C.bgCard, borderTopLeftRadius:28, borderTopRightRadius:28, paddingBottom:40 }}>
          <View style={{ alignItems:'center', paddingTop:12, paddingBottom:4 }}>
            <View style={{ width:40, height:4, backgroundColor:C.border, borderRadius:2 }}/>
          </View>
          <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between',
            paddingHorizontal:24, paddingVertical:16, borderBottomWidth:1, borderBottomColor:C.border }}>
            <Text style={[TY.h2, { color:C.ink }]}>{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Text style={{ color:C.inkMuted, fontSize:22 }}>x</Text>
            </TouchableOpacity>
          </View>
          <KeyboardAvoidingView behavior={isIOS ? 'padding' : undefined}>
            <ScrollView contentContainerStyle={{ padding:24 }} keyboardShouldPersistTaps="handled">
              {children}
            </ScrollView>
          </KeyboardAvoidingView>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
function Header({ title, subtitle, right }) {
  return (
    <View style={{ paddingHorizontal:20, paddingTop:8, paddingBottom:16 }}>
      <View style={{ flexDirection:'row', alignItems:'flex-end', justifyContent:'space-between' }}>
        <View style={{ flex:1 }}>
          {subtitle ? <Text style={[TY.label, { color:C.inkMuted, marginBottom:4 }]}>{subtitle}</Text> : null}
          <Text style={[TY.h1, { color:C.ink }]}>{title}</Text>
        </View>
        {right}
      </View>
    </View>
  );
}
function BackHeader({ title, onBack, right }) {
  return (
    <View style={{ flexDirection:'row', alignItems:'center', paddingHorizontal:16, paddingVertical:12,
      borderBottomWidth:1, borderBottomColor:C.border }}>
      <TouchableOpacity onPress={onBack}
        style={{ backgroundColor:C.bgHighlight, borderRadius:100, width:38, height:38,
          alignItems:'center', justifyContent:'center', marginRight:12 }}>
        <Text style={{ color:C.ink, fontSize:18 }}>back</Text>
      </TouchableOpacity>
      <Text style={[TY.h3, { color:C.ink, flex:1 }]}>{title}</Text>
      {right}
    </View>
  );
}
function StatPill({ label, value, color }) {
  return (
    <View style={{ backgroundColor:C.bgHighlight, borderRadius:14, padding:14, flex:1, marginHorizontal:4 }}>
      <Text style={[TY.label, { color:C.inkMuted, marginBottom:6 }]}>{label}</Text>
      <Text style={[TY.h2, { color:color || C.ink }]}>{value}</Text>
    </View>
  );
}

function HomeScreen({ navigate }) {
  const { data, dispatch } = useStore();
  const activeProjects = data.projects.filter(p => p.status === 'active').length;
  const totalCrew = data.crew.filter(c => c.status === 'active').length;
  const pendingInv = data.invoices.filter(i => i.status === 'pending' || i.status === 'overdue').length;
  const unreadNotifs = data.notifications.filter(n => !n.read).length;
  function dismissNotif(id) {
    dispatch(s => { s.notifications = s.notifications.filter(n => n.id !== id); });
  }
  return (
    <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      <ScrollView contentContainerStyle={{ paddingBottom:100 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal:20, paddingTop:20, paddingBottom:24 }}>
          <Text style={[TY.label, { color:C.primary, marginBottom:8 }]}>CREWDESK</Text>
          <Text style={[TY.hero, { color:C.ink }]}>Good morning, <Text style={{ color:C.primary }}>Ashtyn</Text></Text>
          <Text style={[TY.body, { color:C.inkMuted, marginTop:8 }]}>Here is what is happening today.</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal:16, paddingBottom:8 }}>
          {[
            { label:'ACTIVE PROJECTS', value:activeProjects, color:C.accent, icon:'film' },
            { label:'CREW ACTIVE', value:totalCrew, color:C.success, icon:'crew' },
            { label:'PENDING INVOICES', value:pendingInv, color:C.punch, icon:'inv' },
            { label:'NOTIFICATIONS', value:unreadNotifs, color:C.purple, icon:'bell' },
          ].map(k => (
            <Card key={k.label} style={{ marginRight:12, padding:18, width:160 }}>
              <Text style={[TY.hero, { color:k.color, fontSize:32 }]}>{k.value}</Text>
              <Text style={[TY.label, { color:C.inkMuted, marginTop:4 }]}>{k.label}</Text>
            </Card>
          ))}
        </ScrollView>
        {data.notifications.length > 0 && (
          <View style={{ paddingHorizontal:20, marginTop:24 }}>
            <SectionLabel text="Notifications"
              right={
                <TouchableOpacity onPress={() => dispatch(s => { s.notifications.forEach(n => n.read = true); })}>
                  <Text style={[TY.caption, { color:C.primary }]}>Mark all read</Text>
                </TouchableOpacity>
              }/>
            {data.notifications.map(n => (
              <NotifCard key={n.id} notif={n} onDismiss={() => dismissNotif(n.id)}/>
            ))}
          </View>
        )}
        <View style={{ paddingHorizontal:20, marginTop:24 }}>
          <SectionLabel text="Active Projects"
            right={
              <TouchableOpacity onPress={() => navigate('Projects')}>
                <Text style={[TY.caption, { color:C.primary }]}>View all</Text>
              </TouchableOpacity>
            }/>
          {data.projects.filter(p => p.status === 'active').map(p => {
            const pct = p.budget > 0 ? Math.round((p.spent / p.budget) * 100) : 0;
            const barColor = pct > 85 ? C.punch : pct > 60 ? C.primary : C.success;
            return (
              <Card key={p.id} style={{ marginBottom:12, padding:20 }} onPress={() => navigate('Projects')}>
                <View style={{ flexDirection:'row', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                  <View style={{ flex:1, marginRight:12 }}>
                    <Text style={[TY.h3, { color:C.ink }]}>{p.title}</Text>
                    <Text style={[TY.bodyMd, { color:C.inkMuted, marginTop:2 }]}>{p.client}</Text>
                  </View>
                  <Badge label={statusLabel(p.status)} color={statusColor(p.status) + '33'} textColor={statusColor(p.status)}/>
                </View>
                <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:8 }}>
                  <Text style={[TY.caption, { color:C.inkMuted }]}>Budget used</Text>
                  <Text style={[TY.mono, { color:barColor }]}>{pct}%</Text>
                </View>
                <View style={{ height:6, backgroundColor:C.bgHighlight, borderRadius:3 }}>
                  <View style={{ height:6, width:(pct)+'%', backgroundColor:barColor, borderRadius:3 }}/>
                </View>
                <View style={{ flexDirection:'row', marginTop:12 }}>
                  <Text style={[TY.caption, { color:C.inkMuted }]}>GBP{p.spent.toLocaleString()} / GBP{p.budget.toLocaleString()}</Text>
                </View>
              </Card>
            );
          })}
        </View>
        <View style={{ paddingHorizontal:20, marginTop:8 }}>
          <SectionLabel text="Crew on Call"
            right={
              <TouchableOpacity onPress={() => navigate('Crew')}>
                <Text style={[TY.caption, { color:C.primary }]}>View all</Text>
              </TouchableOpacity>
            }/>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingBottom:4 }}>
            {data.crew.filter(c => c.status === 'active').map(c => (
              <Card key={c.id} style={{ marginRight:12, padding:16, alignItems:'center', width:120 }} onPress={() => navigate('Crew')}>
                <Avatar initials={c.initials} color={c.color} size={50}/>
                <Text style={[TY.caption, { color:C.ink, marginTop:10, textAlign:'center', fontWeight:'700' }]}>{c.name.split(' ')[0]}</Text>
                <Text style={[TY.caption, { color:C.inkMuted, textAlign:'center', marginTop:2 }]}>{c.role.split(' ')[0]}</Text>
              </Card>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ProjectsScreen() {
  const { data, dispatch } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detail, setDetail] = useState(null);
  const [filter, setFilter] = useState('all');
  const blank = { title:'', client:'', status:'active', budget:'', spent:'', crew:'', startDate:'', endDate:'', location:'', desc:'' };
  const [form, setForm] = useState(blank);
  const filters = ['all','active','pending','completed'];
  const filtered = data.projects.filter(p => filter === 'all' || p.status === filter);
  function openNew() { setForm(blank); setEditing(null); setShowForm(true); }
  function openEdit(p) { setForm({ ...p, budget:String(p.budget), spent:String(p.spent), crew:String(p.crew) }); setEditing(p.id); setShowForm(true); }
  function save() {
    if (!form.title.trim()) { Alert.alert('Required', 'Project title is required'); return; }
    const proj = { ...form, budget:parseFloat(form.budget)||0, spent:parseFloat(form.spent)||0, crew:parseInt(form.crew)||0 };
    if (editing) {
      dispatch(s => { const i = s.projects.findIndex(p => p.id === editing); if (i > -1) s.projects[i] = { ...s.projects[i], ...proj }; });
    } else {
      dispatch(s => { s.projects.push({ ...proj, id:'p'+Date.now() }); });
    }
    setShowForm(false);
  }
  function del(id) {
    Alert.alert('Delete Project', 'This will permanently delete the project.',
      [{ text:'Cancel', style:'cancel' }, { text:'Delete', style:'destructive', onPress: function() { dispatch(s => { s.projects = s.projects.filter(p => p.id !== id); }); setDetail(null); } }]);
  }
  if (detail) {
    const p = data.projects.find(x => x.id === detail);
    if (!p) { setDetail(null); return null; }
    const pct = p.budget > 0 ? Math.round((p.spent / p.budget) * 100) : 0;
    const barColor = pct > 85 ? C.punch : pct > 60 ? C.primary : C.success;
    return (
      <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
        <BackHeader title={p.title} onBack={() => setDetail(null)}
          right={
            <View style={{ flexDirection:'row' }}>
              <TouchableOpacity onPress={() => { setDetail(null); openEdit(p); }}
                style={{ backgroundColor:C.bgHighlight, borderRadius:100, paddingHorizontal:14, paddingVertical:7, marginRight:8 }}>
                <Text style={{ color:C.primary, ...TY.caption, fontWeight:'700' }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => del(p.id)}
                style={{ backgroundColor:C.punch+'22', borderRadius:100, paddingHorizontal:14, paddingVertical:7 }}>
                <Text style={{ color:C.punch, ...TY.caption, fontWeight:'700' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          }/>
        <ScrollView contentContainerStyle={{ padding:20, paddingBottom:60 }}>
          <Card style={{ padding:20, marginBottom:16 }}>
            <Badge label={statusLabel(p.status)} color={statusColor(p.status)+'33'} textColor={statusColor(p.status)}/>
            <Text style={[TY.h1, { color:C.ink, marginTop:12 }]}>{p.title}</Text>
            <Text style={[TY.body, { color:C.inkMuted, marginTop:4 }]}>{p.client}</Text>
            <Text style={[TY.bodyMd, { color:C.inkMuted, marginTop:12 }]}>{p.desc}</Text>
          </Card>
          <View style={{ flexDirection:'row', marginBottom:16 }}>
            <StatPill label="BUDGET" value={"GBP"+p.budget.toLocaleString()} color={C.primary}/>
            <StatPill label="SPENT" value={"GBP"+p.spent.toLocaleString()} color={barColor}/>
            <StatPill label="CREW" value={p.crew} color={C.accent}/>
          </View>
          <Card style={{ padding:20, marginBottom:16 }}>
            <Text style={[TY.label, { color:C.inkMuted, marginBottom:10 }]}>Budget Progress</Text>
            <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:8 }}>
              <Text style={[TY.body, { color:C.ink }]}>{pct}% used</Text>
              <Text style={[TY.bodyMd, { color:barColor, fontWeight:'700' }]}>GBP{(p.budget - p.spent).toLocaleString()} remaining</Text>
            </View>
            <View style={{ height:8, backgroundColor:C.bgHighlight, borderRadius:4 }}>
              <View style={{ height:8, width:pct+'%', backgroundColor:barColor, borderRadius:4 }}/>
            </View>
          </Card>
          <Card style={{ padding:20 }}>
            {[
              { label:'Location', value:p.location },
              { label:'Start Date', value:p.startDate },
              { label:'End Date', value:p.endDate },
            ].map(row => (
              <View key={row.label} style={{ flexDirection:'row', justifyContent:'space-between', paddingVertical:10,
                borderBottomWidth:1, borderBottomColor:C.border }}>
                <Text style={[TY.body, { color:C.inkMuted }]}>{row.label}</Text>
                <Text style={[TY.body, { color:C.ink, fontWeight:'600' }]}>{row.value}</Text>
              </View>
            ))}
          </Card>
        </ScrollView>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      <Header title="Projects" subtitle="PRODUCTIONS"
        right={
          <TouchableOpacity onPress={openNew}
            style={{ backgroundColor:C.primary, borderRadius:100, paddingHorizontal:16, paddingVertical:8 }}>
            <Text style={[TY.caption, { color:C.inkDark, fontWeight:'700' }]}>+ New</Text>
          </TouchableOpacity>
        }/>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal:20, paddingBottom:12 }}>
        {filters.map(f => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)}
            style={{ backgroundColor:filter===f ? C.primary : C.bgHighlight,
              borderRadius:100, paddingHorizontal:16, paddingVertical:8, marginRight:8 }}>
            <Text style={[TY.caption, { color:filter===f ? C.inkDark : C.inkMuted, fontWeight:'700' }]}>
              {f.charAt(0).toUpperCase()+f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList data={filtered} keyExtractor={i => i.id}
        contentContainerStyle={{ paddingHorizontal:20, paddingBottom:100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState icon="film" title="No projects yet" body="Tap to create your first project." onAction={openNew} actionLabel="Create Project"/>}
        renderItem={({ item: p }) => {
          const pct = p.budget > 0 ? Math.round((p.spent / p.budget) * 100) : 0;
          const bc = pct > 85 ? C.punch : pct > 60 ? C.primary : C.success;
          return (
            <Card style={{ marginBottom:14, padding:20 }} onPress={() => setDetail(p.id)}>
              <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
                <View style={{ flex:1, marginRight:10 }}>
                  <Text style={[TY.h3, { color:C.ink }]}>{p.title}</Text>
                  <Text style={[TY.bodyMd, { color:C.inkMuted, marginTop:2 }]}>{p.client}</Text>
                </View>
                <Badge label={statusLabel(p.status)} color={statusColor(p.status)+'33'} textColor={statusColor(p.status)}/>
              </View>
              <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:6 }}>
                <Text style={[TY.caption, { color:C.inkMuted }]}>Budget Used</Text>
                <Text style={[TY.mono, { color:bc }]}>{pct}% GBP{p.spent.toLocaleString()}</Text>
              </View>
              <View style={{ height:5, backgroundColor:C.bgHighlight, borderRadius:3 }}>
                <View style={{ height:5, width:pct+'%', backgroundColor:bc, borderRadius:3 }}/>
              </View>
              <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop:10 }}>
                <Text style={[TY.caption, { color:C.inkMuted }]}>{p.crew} crew</Text>
                <Text style={[TY.caption, { color:C.inkMuted }]}>{p.location}</Text>
              </View>
            </Card>
          );
        }}/>
      <Sheet visible={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Project' : 'New Project'}>
        <Field label="Project Title" value={form.title} onChangeText={v => setForm(f => ({...f,title:v}))} placeholder="e.g. Midnight Runner"/>
        <Field label="Client" value={form.client} onChangeText={v => setForm(f => ({...f,client:v}))} placeholder="Client name"/>
        <Field label="Location" value={form.location} onChangeText={v => setForm(f => ({...f,location:v}))} placeholder="e.g. London, UK"/>
        <View style={{ marginBottom:16 }}>
          <Text style={[TY.label, { color:C.inkMuted, marginBottom:8 }]}>Status</Text>
          <View style={{ flexDirection:'row' }}>
            {['active','pending','completed'].map(s => (
              <TouchableOpacity key={s} onPress={() => setForm(f => ({...f,status:s}))}
                style={{ backgroundColor:form.status===s ? C.primary : C.bgHighlight,
                  borderRadius:100, paddingHorizontal:14, paddingVertical:7, marginRight:8 }}>
                <Text style={{ color:form.status===s ? C.inkDark : C.inkMuted, ...TY.caption, fontWeight:'700' }}>
                  {s.charAt(0).toUpperCase()+s.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Field label="Budget" value={form.budget} onChangeText={v => setForm(f => ({...f,budget:v}))} placeholder="0" keyboardType="numeric"/>
        <Field label="Spent" value={form.spent} onChangeText={v => setForm(f => ({...f,spent:v}))} placeholder="0" keyboardType="numeric"/>
        <Field label="Crew Count" value={form.crew} onChangeText={v => setForm(f => ({...f,crew:v}))} placeholder="0" keyboardType="numeric"/>
        <Field label="Start Date" value={form.startDate} onChangeText={v => setForm(f => ({...f,startDate:v}))} placeholder="YYYY-MM-DD"/>
        <Field label="End Date" value={form.endDate} onChangeText={v => setForm(f => ({...f,endDate:v}))} placeholder="YYYY-MM-DD"/>
        <Field label="Description" value={form.desc} onChangeText={v => setForm(f => ({...f,desc:v}))} placeholder="Brief description..." multiline lines={3}/>
        <PrimaryBtn label={editing ? 'Save Changes' : 'Create Project'} onPress={save}/>
        {editing && <TouchableOpacity onPress={() => { setShowForm(false); del(editing); }} style={{ alignItems:'center', marginTop:12 }}>
          <Text style={{ color:C.punch, ...TY.body }}>Delete this project</Text>
        </TouchableOpacity>}
      </Sheet>
    </SafeAreaView>
  );
}

function CrewScreen() {
  const { data, dispatch } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detail, setDetail] = useState(null);
  const [filter, setFilter] = useState('all');
  const COLORS = [C.primary, C.accent, C.purple, C.punch, C.success];
  const blank = { name:'', role:'', dept:'', rate:'', status:'active', phone:'', email:'', location:'', skills:'' };
  const [form, setForm] = useState(blank);
  const depts = ['all','Camera','Art','Sound','Electrical','Post','Production'];
  const filtered = data.crew.filter(c => filter === 'all' || c.dept === filter);
  function openNew() { setForm(blank); setEditing(null); setShowForm(true); }
  function openEdit(c) { setForm({ ...c, rate:String(c.rate), skills:Array.isArray(c.skills) ? c.skills.join(', ') : c.skills }); setEditing(c.id); setShowForm(true); }
  function save() {
    if (!form.name.trim()) { Alert.alert('Required', 'Name is required'); return; }
    const member = { ...form, rate:parseFloat(form.rate)||0, skills:form.skills.split(',').map(s => s.trim()).filter(Boolean) };
    if (editing) {
      dispatch(s => { const i = s.crew.findIndex(c => c.id === editing); if (i > -1) s.crew[i] = { ...s.crew[i], ...member }; });
    } else {
      const initials = form.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0,2);
      const color = COLORS[data.crew.length % COLORS.length];
      dispatch(s => { s.crew.push({ ...member, id:'c'+Date.now(), initials, color }); });
    }
    setShowForm(false);
  }
  function del(id) {
    Alert.alert('Remove Crew', 'Remove this crew member?',
      [{ text:'Cancel', style:'cancel' }, { text:'Remove', style:'destructive', onPress: function() { dispatch(s => { s.crew = s.crew.filter(c => c.id !== id); }); setDetail(null); }}]);
  }
  if (detail) {
    const c = data.crew.find(x => x.id === detail);
    if (!c) { setDetail(null); return null; }
    return (
      <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
        <BackHeader title="Crew Member" onBack={() => setDetail(null)}
          right={
            <View style={{ flexDirection:'row' }}>
              <TouchableOpacity onPress={() => { setDetail(null); openEdit(c); }}
                style={{ backgroundColor:C.bgHighlight, borderRadius:100, paddingHorizontal:14, paddingVertical:7, marginRight:8 }}>
                <Text style={{ color:C.primary, ...TY.caption, fontWeight:'700' }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => del(c.id)}
                style={{ backgroundColor:C.punch+'22', borderRadius:100, paddingHorizontal:14, paddingVertical:7 }}>
                <Text style={{ color:C.punch, ...TY.caption, fontWeight:'700' }}>Remove</Text>
              </TouchableOpacity>
            </View>
          }/>
        <ScrollView contentContainerStyle={{ padding:20, paddingBottom:60 }}>
          <Card style={{ padding:24, marginBottom:16, alignItems:'center' }}>
            <Avatar initials={c.initials} color={c.color} size={80}/>
            <Text style={[TY.h1, { color:C.ink, marginTop:16, textAlign:'center' }]}>{c.name}</Text>
            <Text style={[TY.body, { color:c.color, fontWeight:'600', marginTop:4 }]}>{c.role}</Text>
            <View style={{ marginTop:12 }}>
              <Badge label={statusLabel(c.status)} color={statusColor(c.status)+'33'} textColor={statusColor(c.status)}/>
            </View>
          </Card>
          <View style={{ flexDirection:'row', marginBottom:16 }}>
            <StatPill label="DEPT" value={c.dept} color={C.accent}/>
            <StatPill label="DAY RATE" value={"GBP"+c.rate} color={C.primary}/>
          </View>
          <Card style={{ padding:20, marginBottom:16 }}>
            <Text style={[TY.label, { color:C.inkMuted, marginBottom:12 }]}>Contact</Text>
            {[
              { label:'Phone', value:c.phone },
              { label:'Email', value:c.email },
              { label:'Location', value:c.location },
            ].map(row => (
              <View key={row.label} style={{ flexDirection:'row', justifyContent:'space-between', paddingVertical:10,
                borderBottomWidth:1, borderBottomColor:C.border }}>
                <Text style={[TY.body, { color:C.inkMuted }]}>{row.label}</Text>
                <Text style={[TY.body, { color:C.ink, fontWeight:'600', flex:1, textAlign:'right' }]}>{row.value}</Text>
              </View>
            ))}
          </Card>
          {c.skills && c.skills.length > 0 && (
            <Card style={{ padding:20 }}>
              <Text style={[TY.label, { color:C.inkMuted, marginBottom:12 }]}>Skills</Text>
              <View style={{ flexDirection:'row', flexWrap:'wrap' }}>
                {c.skills.map(sk => (
                  <View key={sk} style={{ backgroundColor:C.bgHighlight, borderRadius:100,
                    paddingHorizontal:12, paddingVertical:6, marginRight:8, marginBottom:8 }}>
                    <Text style={[TY.caption, { color:C.inkMuted }]}>{sk}</Text>
                  </View>
                ))}
              </View>
            </Card>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      <Header title="Crew" subtitle="TEAM"
        right={
          <TouchableOpacity onPress={openNew}
            style={{ backgroundColor:C.primary, borderRadius:100, paddingHorizontal:16, paddingVertical:8 }}>
            <Text style={[TY.caption, { color:C.inkDark, fontWeight:'700' }]}>+ Add</Text>
          </TouchableOpacity>
        }/>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal:20, paddingBottom:12 }}>
        {depts.map(d => (
          <TouchableOpacity key={d} onPress={() => setFilter(d)}
            style={{ backgroundColor:filter===d ? C.accent : C.bgHighlight,
              borderRadius:100, paddingHorizontal:14, paddingVertical:7, marginRight:8 }}>
            <Text style={[TY.caption, { color:filter===d ? C.inkDark : C.inkMuted, fontWeight:'700' }]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList data={filtered} keyExtractor={i => i.id}
        contentContainerStyle={{ paddingHorizontal:20, paddingBottom:100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState icon="crew" title="No crew members" body="Start building your crew." onAction={openNew} actionLabel="Add First Member"/>}
        renderItem={({ item: c }) => (
          <Card style={{ marginBottom:12, padding:16 }} onPress={() => setDetail(c.id)}>
            <View style={{ flexDirection:'row', alignItems:'center' }}>
              <Avatar initials={c.initials} color={c.color} size={48}/>
              <View style={{ flex:1, marginLeft:14 }}>
                <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between' }}>
                  <Text style={[TY.h3, { color:C.ink }]}>{c.name}</Text>
                  <Badge label={statusLabel(c.status)} color={statusColor(c.status)+'33'} textColor={statusColor(c.status)} size="sm"/>
                </View>
                <Text style={[TY.bodyMd, { color:C.inkMuted, marginTop:2 }]}>{c.role}</Text>
                <View style={{ flexDirection:'row', marginTop:6 }}>
                  <Text style={[TY.caption, { color:C.inkMuted, marginRight:12 }]}>{c.dept}</Text>
                  <Text style={[TY.caption, { color:C.primary }]}>GBP{c.rate}/day</Text>
                </View>
              </View>
            </View>
          </Card>
        )}/>
      <Sheet visible={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Crew Member' : 'Add Crew Member'}>
        <Field label="Full Name" value={form.name} onChangeText={v => setForm(f => ({...f,name:v}))} placeholder="e.g. Sophia Marlowe"/>
        <Field label="Role / Job Title" value={form.role} onChangeText={v => setForm(f => ({...f,role:v}))} placeholder="e.g. Director of Photography"/>
        <Field label="Department" value={form.dept} onChangeText={v => setForm(f => ({...f,dept:v}))} placeholder="e.g. Camera"/>
        <Field label="Day Rate" value={form.rate} onChangeText={v => setForm(f => ({...f,rate:v}))} placeholder="0" keyboardType="numeric"/>
        <View style={{ marginBottom:16 }}>
          <Text style={[TY.label, { color:C.inkMuted, marginBottom:8 }]}>Status</Text>
          <View style={{ flexDirection:'row' }}>
            {['active','onleave','inactive'].map(s => (
              <TouchableOpacity key={s} onPress={() => setForm(f => ({...f,status:s}))}
                style={{ backgroundColor:form.status===s ? C.accent : C.bgHighlight,
                  borderRadius:100, paddingHorizontal:12, paddingVertical:7, marginRight:8 }}>
                <Text style={{ color:form.status===s ? C.inkDark : C.inkMuted, ...TY.caption, fontWeight:'700' }}>
                  {s === 'onleave' ? 'On Leave' : s.charAt(0).toUpperCase()+s.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Field label="Phone" value={form.phone} onChangeText={v => setForm(f => ({...f,phone:v}))} placeholder="+44 7700 000000" keyboardType="phone-pad"/>
        <Field label="Email" value={form.email} onChangeText={v => setForm(f => ({...f,email:v}))} placeholder="email@example.com" keyboardType="email-address"/>
        <Field label="Location" value={form.location} onChangeText={v => setForm(f => ({...f,location:v}))} placeholder="e.g. London"/>
        <Field label="Skills" value={form.skills} onChangeText={v => setForm(f => ({...f,skills:v}))} placeholder="e.g. Arri Alexa, Drone, Lighting"/>
        <PrimaryBtn label={editing ? 'Save Changes' : 'Add to Crew'} onPress={save} color={C.accent}/>
        {editing && <TouchableOpacity onPress={() => { setShowForm(false); del(editing); }} style={{ alignItems:'center', marginTop:12 }}>
          <Text style={{ color:C.punch, ...TY.body }}>Remove from crew</Text>
        </TouchableOpacity>}
      </Sheet>
    </SafeAreaView>
  );
}

function ScheduleScreen() {
  const { data, dispatch } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedDay, setSelectedDay] = useState(0);
  const blank = { title:'', project:'', date:'', callTime:'', wrapTime:'', location:'', dept:'', crewNeeded:'', status:'pending', notes:'' };
  const [form, setForm] = useState(blank);
  const days = Array.from({ length:7 }, (_, i) => {
    const d = new Date('2026-03-08');
    d.setDate(d.getDate() + i);
    return {
      label: d.toLocaleDateString('en-GB', { weekday:'short' }).toUpperCase(),
      num: d.getDate(),
      full: d.toISOString().slice(0,10),
    };
  });
  const selDate = days[selectedDay].full;
  const todayShifts = data.shifts.filter(s => s.date === selDate);
  function openNew() { setForm({ ...blank, date:selDate }); setEditing(null); setShowForm(true); }
  function openEdit(s) { setForm({ ...s, crewNeeded:String(s.crewNeeded) }); setEditing(s.id); setShowForm(true); }
  function save() {
    if (!form.title.trim()) { Alert.alert('Required', 'Shift title is required'); return; }
    const shift = { ...form, crewNeeded:parseInt(form.crewNeeded)||0 };
    if (editing) {
      dispatch(s => { const i = s.shifts.findIndex(x => x.id === editing); if (i > -1) s.shifts[i] = { ...s.shifts[i], ...shift }; });
    } else {
      dispatch(s => { s.shifts.push({ ...shift, id:'s'+Date.now() }); });
    }
    setShowForm(false);
  }
  function del(id) {
    Alert.alert('Delete Shift', 'Delete this shift?',
      [{ text:'Cancel', style:'cancel' }, { text:'Delete', style:'destructive', onPress: function() { dispatch(s => { s.shifts = s.shifts.filter(x => x.id !== id); }); }}]);
  }
  return (
    <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      <Header title="Schedule" subtitle="PRODUCTION DAYS"
        right={
          <TouchableOpacity onPress={openNew}
            style={{ backgroundColor:C.accent, borderRadius:100, paddingHorizontal:16, paddingVertical:8 }}>
            <Text style={[TY.caption, { color:C.inkDark, fontWeight:'700' }]}>+ Shift</Text>
          </TouchableOpacity>
        }/>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal:16, paddingBottom:16 }}>
        {days.map((d, i) => {
          const hasShifts = data.shifts.some(s => s.date === d.full);
          return (
            <TouchableOpacity key={i} onPress={() => setSelectedDay(i)}
              style={{ alignItems:'center', marginRight:8, width:56, paddingVertical:12, borderRadius:16,
                backgroundColor:i === selectedDay ? C.accent : C.bgCard,
                borderWidth:1, borderColor:i === selectedDay ? C.accent : C.border }}>
              <Text style={[TY.label, { color:i === selectedDay ? C.inkDark : C.inkMuted, fontSize:9 }]}>{d.label}</Text>
              <Text style={[TY.h2, { color:i === selectedDay ? C.inkDark : C.ink, marginTop:4 }]}>{d.num}</Text>
              {hasShifts && <View style={{ width:5, height:5, borderRadius:3, backgroundColor:i === selectedDay ? C.inkDark : C.primary, marginTop:4 }}/>}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <ScrollView contentContainerStyle={{ paddingHorizontal:20, paddingBottom:100 }}>
        <SectionLabel text={selDate + ' — ' + todayShifts.length + ' shift' + (todayShifts.length !== 1 ? 's' : '')}/>
        {todayShifts.length === 0 ? (
          <Card style={{ padding:32, alignItems:'center' }}>
            <Text style={[TY.h3, { color:C.ink, marginBottom:6 }]}>No shifts scheduled</Text>
            <TouchableOpacity onPress={openNew}
              style={{ backgroundColor:C.accent, borderRadius:100, paddingHorizontal:20, paddingVertical:10, marginTop:12 }}>
              <Text style={[TY.caption, { color:C.inkDark, fontWeight:'700' }]}>Schedule a Shift</Text>
            </TouchableOpacity>
          </Card>
        ) : (
          todayShifts.map(s => (
            <Card key={s.id} style={{ marginBottom:12, padding:18 }}>
              <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                <View style={{ flex:1, marginRight:10 }}>
                  <Text style={[TY.h3, { color:C.ink }]}>{s.title}</Text>
                  <Text style={[TY.bodyMd, { color:C.inkMuted, marginTop:2 }]}>{s.project}</Text>
                </View>
                <Badge label={statusLabel(s.status)} color={statusColor(s.status)+'33'} textColor={statusColor(s.status)}/>
              </View>
              <Text style={[TY.caption, { color:C.inkMuted, marginBottom:4 }]}>{s.callTime} to {s.wrapTime} | {s.location}</Text>
              <Text style={[TY.caption, { color:C.inkMuted }]}>{s.crewNeeded} crew needed | {s.dept}</Text>
              {s.notes ? <Text style={[TY.caption, { color:C.inkFaint, marginTop:6 }]}>Notes: {s.notes}</Text> : null}
              <View style={{ flexDirection:'row', marginTop:14 }}>
                <TouchableOpacity onPress={() => openEdit(s)}
                  style={{ flex:1, backgroundColor:C.bgHighlight, borderRadius:100, paddingVertical:9, alignItems:'center', marginRight:8 }}>
                  <Text style={[TY.caption, { color:C.primary, fontWeight:'700' }]}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => del(s.id)}
                  style={{ flex:1, backgroundColor:C.punch+'22', borderRadius:100, paddingVertical:9, alignItems:'center' }}>
                  <Text style={[TY.caption, { color:C.punch, fontWeight:'700' }]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))
        )}
        {data.shifts.filter(s => s.date !== selDate).length > 0 && (
          <View style={{ marginTop:24 }}>
            <SectionLabel text="All Upcoming"/>
            {data.shifts.filter(s => s.date !== selDate).slice(0,5).map(s => (
              <Card key={s.id} style={{ marginBottom:10, padding:14 }}>
                <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
                  <View style={{ flex:1 }}>
                    <Text style={[TY.bodyMd, { color:C.ink, fontWeight:'600' }]}>{s.title}</Text>
                    <Text style={[TY.caption, { color:C.inkMuted, marginTop:2 }]}>{s.date} {s.callTime}</Text>
                  </View>
                  <Badge label={statusLabel(s.status)} color={statusColor(s.status)+'33'} textColor={statusColor(s.status)} size="sm"/>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
      <Sheet visible={showForm} onClose={() => setShowForm(false)} title={editing ? 'Edit Shift' : 'New Shift'}>
        <Field label="Shift Title" value={form.title} onChangeText={v => setForm(f => ({...f,title:v}))} placeholder="e.g. Principal Photography Day 1"/>
        <Field label="Project" value={form.project} onChangeText={v => setForm(f => ({...f,project:v}))} placeholder="e.g. Midnight Runner"/>
        <Field label="Date" value={form.date} onChangeText={v => setForm(f => ({...f,date:v}))} placeholder="YYYY-MM-DD"/>
        <Field label="Call Time" value={form.callTime} onChangeText={v => setForm(f => ({...f,callTime:v}))} placeholder="e.g. 06:00"/>
        <Field label="Wrap Time" value={form.wrapTime} onChangeText={v => setForm(f => ({...f,wrapTime:v}))} placeholder="e.g. 18:00"/>
        <Field label="Location" value={form.location} onChangeText={v => setForm(f => ({...f,location:v}))} placeholder="e.g. Pinewood Studios"/>
        <Field label="Department" value={form.dept} onChangeText={v => setForm(f => ({...f,dept:v}))} placeholder="e.g. Camera + Art"/>
        <Field label="Crew Needed" value={form.crewNeeded} onChangeText={v => setForm(f => ({...f,crewNeeded:v}))} placeholder="0" keyboardType="numeric"/>
        <View style={{ marginBottom:16 }}>
          <Text style={[TY.label, { color:C.inkMuted, marginBottom:8 }]}>Status</Text>
          <View style={{ flexDirection:'row' }}>
            {['pending','confirmed','cancelled'].map(s => (
              <TouchableOpacity key={s} onPress={() => setForm(f => ({...f,status:s}))}
                style={{ backgroundColor:form.status===s ? C.accent : C.bgHighlight,
                  borderRadius:100, paddingHorizontal:12, paddingVertical:7, marginRight:8 }}>
                <Text style={{ color:form.status===s ? C.inkDark : C.inkMuted, ...TY.caption, fontWeight:'700' }}>
                  {s.charAt(0).toUpperCase()+s.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Field label="Notes" value={form.notes} onChangeText={v => setForm(f => ({...f,notes:v}))} placeholder="Any notes..." multiline lines={2}/>
        <PrimaryBtn label={editing ? 'Save Changes' : 'Create Shift'} onPress={save} color={C.accent}/>
        {editing && <TouchableOpacity onPress={() => { setShowForm(false); del(editing); }} style={{ alignItems:'center', marginTop:12 }}>
          <Text style={{ color:C.punch, ...TY.body }}>Delete this shift</Text>
        </TouchableOpacity>}
      </Sheet>
    </SafeAreaView>
  );
}

function MessagesScreen() {
  const { data, dispatch } = useStore();
  const [thread, setThread] = useState(null);
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);
  const AUTO_REPLIES = [
    'Sounds good, I will be there!',
    'Can we push back 30 minutes?',
    'On my way now.',
    'Confirmed',
    'I will send over the files shortly.',
    'Great see you on set.',
    'Let me check and get back to you.',
  ];
  function sendMsg() {
    if (!input.trim()) return;
    const txt = input.trim();
    setInput('');
    dispatch(function(s) {
      var conv = s.messages.find(function(m) { return m.id === thread; });
      if (!conv) return;
      conv.msgs.push({ id:'msg'+Date.now(), from:'me', text:txt, time:'Now' });
      conv.preview = txt;
      conv.time = 'Now';
    });
    setTimeout(function() {
      var reply = AUTO_REPLIES[Math.floor(Math.random() * AUTO_REPLIES.length)];
      dispatch(function(s) {
        var conv = s.messages.find(function(m) { return m.id === thread; });
        if (!conv) return;
        conv.msgs.push({ id:'msg'+Date.now()+'r', from:'them', text:reply, time:'Now' });
        conv.preview = reply;
      });
    }, 1200);
  }
  function newConvo() {
    Alert.alert('New Message', 'Start new conversation?', [
      { text:'Cancel', style:'cancel' },
      { text:'Create', onPress: function() {
        var id = 'm'+Date.now();
        dispatch(function(s) {
          s.messages.unshift({ id:id, name:'New Contact', initials:'NC', color:C.accent, preview:'New conversation', time:'Now', unread:0, msgs:[] });
        });
        setThread(id);
      }}
    ]);
  }
  if (thread) {
    var conv = data.messages.find(function(m) { return m.id === thread; });
    if (!conv) { setThread(null); return null; }
    dispatch(function(s) {
      var c = s.messages.find(function(m) { return m.id === thread; });
      if (c) c.unread = 0;
    });
    return (
      <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
        <BackHeader title={conv.name} onBack={function() { setThread(null); }}
          right={<Avatar initials={conv.initials} color={conv.color} size={36}/>}/>
        <KeyboardAvoidingView style={{ flex:1 }} behavior={isIOS ? 'padding' : undefined}>
          <ScrollView ref={scrollRef} contentContainerStyle={{ padding:16, paddingBottom:20 }}
            onContentSizeChange={function() { if (scrollRef.current) scrollRef.current.scrollToEnd({ animated:true }); }}>
            {conv.msgs.length === 0 && (
              <View style={{ alignItems:'center', paddingVertical:40 }}>
                <Avatar initials={conv.initials} color={conv.color} size={64}/>
                <Text style={[TY.h3, { color:C.ink, marginTop:16 }]}>{conv.name}</Text>
                <Text style={[TY.body, { color:C.inkMuted, marginTop:4 }]}>Start the conversation</Text>
              </View>
            )}
            {conv.msgs.map(function(m) {
              var isMe = m.from === 'me';
              return (
                <View key={m.id} style={{ flexDirection:'row', justifyContent:isMe ? 'flex-end' : 'flex-start', marginBottom:8 }}>
                  <View style={{ maxWidth:'72%' }}>
                    <View style={{ backgroundColor:isMe ? C.primary : C.bgElevated,
                      borderRadius:18, borderBottomRightRadius:isMe ? 4 : 18, borderBottomLeftRadius:isMe ? 18 : 4,
                      paddingHorizontal:14, paddingVertical:10 }}>
                      <Text style={{ color:isMe ? C.inkDark : C.ink, ...TY.body }}>{m.text}</Text>
                    </View>
                    <Text style={[TY.caption, { color:C.inkFaint, marginTop:3, textAlign:isMe ? 'right' : 'left' }]}>{m.time}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
          <View style={{ flexDirection:'row', alignItems:'center', paddingHorizontal:12, paddingVertical:8,
            borderTopWidth:1, borderTopColor:C.border, backgroundColor:C.bgCard }}>
            <TextInput value={input} onChangeText={setInput} placeholder="Message..."
              placeholderTextColor={C.inkFaint}
              style={{ flex:1, backgroundColor:C.bgHighlight, borderRadius:22, paddingHorizontal:16,
                paddingVertical:10, color:C.ink, ...TY.body, marginRight:10 }}
              onSubmitEditing={sendMsg}/>
            <TouchableOpacity onPress={sendMsg}
              style={{ backgroundColor:input.trim() ? C.primary : C.bgHighlight,
                width:42, height:42, borderRadius:21, alignItems:'center', justifyContent:'center' }}>
              <Text style={{ color:input.trim() ? C.inkDark : C.inkFaint, fontSize:18 }}>up</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      <Header title="Messages" subtitle="INBOX"
        right={
          <TouchableOpacity onPress={newConvo}
            style={{ backgroundColor:C.primary, borderRadius:100, paddingHorizontal:16, paddingVertical:8 }}>
            <Text style={[TY.caption, { color:C.inkDark, fontWeight:'700' }]}>+ New</Text>
          </TouchableOpacity>
        }/>
      <FlatList data={data.messages} keyExtractor={function(i) { return i.id; }}
        contentContainerStyle={{ paddingHorizontal:20, paddingBottom:100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState icon="chat" title="No messages" body="Start a conversation with your crew." onAction={newConvo} actionLabel="New Message"/>}
        renderItem={function({ item: m }) {
          return (
            <TouchableOpacity onPress={function() { setThread(m.id); }} activeOpacity={0.85}
              style={{ flexDirection:'row', alignItems:'center', paddingVertical:14,
                borderBottomWidth:1, borderBottomColor:C.border }}>
              <View style={{ position:'relative', marginRight:14 }}>
                <Avatar initials={m.initials} color={m.color} size={50}/>
                {m.unread > 0 && (
                  <View style={{ position:'absolute', top:-2, right:-2, backgroundColor:C.punch,
                    width:18, height:18, borderRadius:9, alignItems:'center', justifyContent:'center',
                    borderWidth:2, borderColor:C.bg }}>
                    <Text style={{ color:C.ink, fontSize:10, fontWeight:'800' }}>{m.unread}</Text>
                  </View>
                )}
              </View>
              <View style={{ flex:1 }}>
                <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:3 }}>
                  <Text style={[TY.h3, { color:C.ink }]}>{m.name}</Text>
                  <Text style={[TY.caption, { color:C.inkMuted }]}>{m.time}</Text>
                </View>
                <Text style={[TY.bodyMd, { color:m.unread > 0 ? C.inkMuted : C.inkFaint }]} numberOfLines={1}>{m.preview}</Text>
              </View>
            </TouchableOpacity>
          );
        }}/>
    </SafeAreaView>
  );
}

function InvoicesScreen() {
  const { data, dispatch } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [detail, setDetail] = useState(null);
  const [filter, setFilter] = useState('all');
  const blank = { number:'', client:'', project:'', amount:'', status:'pending', dueDate:'', issueDate:'', items:[] };
  const [form, setForm] = useState(blank);
  const total = data.invoices.reduce(function(a, i) { return a + i.amount; }, 0);
  const paid = data.invoices.filter(function(i) { return i.status === 'paid'; }).reduce(function(a, i) { return a + i.amount; }, 0);
  const outstanding = data.invoices.filter(function(i) { return i.status !== 'paid'; }).reduce(function(a, i) { return a + i.amount; }, 0);
  const filters = ['all','pending','paid','overdue'];
  const filtered = data.invoices.filter(function(i) { return filter === 'all' || i.status === filter; });
  function openNew() {
    var num = 'INV-2026-' + String(data.invoices.length + 1).padStart(3,'0');
    setForm({ ...blank, number:num, issueDate:new Date().toISOString().slice(0,10) });
    setEditing(null); setShowForm(true);
  }
  function openEdit(inv) { setForm({ ...inv, amount:String(inv.amount) }); setEditing(inv.id); setShowForm(true); }
  function save() {
    if (!form.client.trim()) { Alert.alert('Required', 'Client name is required'); return; }
    var inv = { ...form, amount:parseFloat(form.amount)||0 };
    if (editing) {
      dispatch(function(s) { var i = s.invoices.findIndex(function(x) { return x.id === editing; }); if (i > -1) s.invoices[i] = { ...s.invoices[i], ...inv }; });
    } else {
      dispatch(function(s) { s.invoices.push({ ...inv, id:'i'+Date.now(), items:[] }); });
    }
    setShowForm(false);
  }
  function del(id) {
    Alert.alert('Delete Invoice', 'Delete this invoice?',
      [{ text:'Cancel', style:'cancel' }, { text:'Delete', style:'destructive', onPress: function() { dispatch(function(s) { s.invoices = s.invoices.filter(function(i) { return i.id !== id; }); }); setDetail(null); } }]);
  }
  function markPaid(id) { dispatch(function(s) { var inv = s.invoices.find(function(i) { return i.id === id; }); if (inv) inv.status = 'paid'; }); }
  function sendReminder(inv) { Alert.alert('Reminder Sent', 'Payment reminder sent to ' + inv.client + '.'); }
  if (detail) {
    var inv = data.invoices.find(function(i) { return i.id === detail; });
    if (!inv) { setDetail(null); return null; }
    return (
      <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
        <BackHeader title={inv.number} onBack={function() { setDetail(null); }}
          right={
            <View style={{ flexDirection:'row' }}>
              <TouchableOpacity onPress={function() { setDetail(null); openEdit(inv); }}
                style={{ backgroundColor:C.bgHighlight, borderRadius:100, paddingHorizontal:14, paddingVertical:7, marginRight:8 }}>
                <Text style={{ color:C.primary, ...TY.caption, fontWeight:'700' }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={function() { del(inv.id); }}
                style={{ backgroundColor:C.punch+'22', borderRadius:100, paddingHorizontal:14, paddingVertical:7 }}>
                <Text style={{ color:C.punch, ...TY.caption, fontWeight:'700' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          }/>
        <ScrollView contentContainerStyle={{ padding:20, paddingBottom:60 }}>
          <Card style={{ padding:24, marginBottom:16 }}>
            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:16 }}>
              <View>
                <Text style={[TY.label, { color:C.inkMuted }]}>Amount</Text>
                <Text style={[TY.hero, { color:C.primary, fontSize:40 }]}>GBP{inv.amount.toLocaleString()}</Text>
              </View>
              <Badge label={statusLabel(inv.status)} color={statusColor(inv.status)+'33'} textColor={statusColor(inv.status)}/>
            </View>
            <Text style={[TY.h3, { color:C.ink }]}>{inv.client}</Text>
            <Text style={[TY.body, { color:C.inkMuted }]}>{inv.project}</Text>
          </Card>
          <Card style={{ padding:20, marginBottom:16 }}>
            {[
              { label:'Invoice No.', value:inv.number },
              { label:'Issue Date', value:inv.issueDate },
              { label:'Due Date', value:inv.dueDate },
            ].map(function(row) {
              return (
                <View key={row.label} style={{ flexDirection:'row', justifyContent:'space-between', paddingVertical:10,
                  borderBottomWidth:1, borderBottomColor:C.border }}>
                  <Text style={[TY.body, { color:C.inkMuted }]}>{row.label}</Text>
                  <Text style={[TY.body, { color:C.ink, fontWeight:'600' }]}>{row.value}</Text>
                </View>
              );
            })}
          </Card>
          <View style={{ flexDirection:'row', marginBottom:10 }}>
            {inv.status !== 'paid' && (
              <TouchableOpacity onPress={function() { markPaid(inv.id); }} style={{ flex:1, marginRight:8 }}>
                <PrimaryBtn label="Mark as Paid" color={C.success}/>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={function() { sendReminder(inv); }} style={{ flex:1 }}>
              <PrimaryBtn label="Send Reminder" color={C.accent}/>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
  return (
    <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      <Header title="Invoices" subtitle="BILLING"
        right={
          <TouchableOpacity onPress={openNew}
            style={{ backgroundColor:C.primary, borderRadius:100, paddingHorizontal:16, paddingVertical:8 }}>
            <Text style={[TY.caption, { color:C.inkDark, fontWeight:'700' }]}>+ Invoice</Text>
          </TouchableOpacity>
        }/>
      <View style={{ flexDirection:'row', paddingHorizontal:16, paddingBottom:16 }}>
        <StatPill label="TOTAL" value={"GBP"+Math.round(total/1000)+"k"} color={C.ink}/>
        <StatPill label="PAID" value={"GBP"+Math.round(paid/1000)+"k"} color={C.success}/>
        <StatPill label="OUTSTANDING" value={"GBP"+Math.round(outstanding/1000)+"k"} color={C.punch}/>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal:20, paddingBottom:12 }}>
        {filters.map(function(f) {
          return (
            <TouchableOpacity key={f} onPress={function() { setFilter(f); }}
              style={{ backgroundColor:filter===f ? C.primary : C.bgHighlight,
                borderRadius:100, paddingHorizontal:16, paddingVertical:8, marginRight:8 }}>
              <Text style={[TY.caption, { color:filter===f ? C.inkDark : C.inkMuted, fontWeight:'700' }]}>
                {f.charAt(0).toUpperCase()+f.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      <FlatList data={filtered} keyExtractor={function(i) { return i.id; }}
        contentContainerStyle={{ paddingHorizontal:20, paddingBottom:100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState icon="invoice" title="No invoices" body="Create your first invoice." onAction={openNew} actionLabel="Create Invoice"/>}
        renderItem={function({ item: inv }) {
          return (
            <Card style={{ marginBottom:12, padding:18 }} onPress={function() { setDetail(inv.id); }}>
              <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                <View style={{ flex:1, marginRight:10 }}>
                  <Text style={[TY.h3, { color:C.ink }]}>{inv.number}</Text>
                  <Text style={[TY.bodyMd, { color:C.inkMuted, marginTop:2 }]}>{inv.client}</Text>
                </View>
                <Badge label={statusLabel(inv.status)} color={statusColor(inv.status)+'33'} textColor={statusColor(inv.status)}/>
              </View>
              <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
                <Text style={[TY.h2, { color:inv.status === 'paid' ? C.success : inv.status === 'overdue' ? C.punch : C.primary }]}>
                  GBP{inv.amount.toLocaleString()}
                </Text>
                <Text style={[TY.caption, { color:C.inkMuted }]}>Due {inv.dueDate}</Text>
              </View>
              {inv.status === 'overdue' && (
                <View style={{ marginTop:10, backgroundColor:C.punch+'22', borderRadius:8, padding:8 }}>
                  <Text style={[TY.caption, { color:C.punch, fontWeight:'700' }]}>Overdue - Send reminder?</Text>
                </View>
              )}
            </Card>
          );
        }}/>
      <Sheet visible={showForm} onClose={function() { setShowForm(false); }} title={editing ? 'Edit Invoice' : 'New Invoice'}>
        <Field label="Invoice Number" value={form.number} onChangeText={function(v) { setForm(function(f) { return {...f,number:v}; }); }} placeholder="INV-2026-001"/>
        <Field label="Client" value={form.client} onChangeText={function(v) { setForm(function(f) { return {...f,client:v}; }); }} placeholder="Client name"/>
        <Field label="Project" value={form.project} onChangeText={function(v) { setForm(function(f) { return {...f,project:v}; }); }} placeholder="Project name"/>
        <Field label="Amount" value={form.amount} onChangeText={function(v) { setForm(function(f) { return {...f,amount:v}; }); }} placeholder="0" keyboardType="numeric"/>
        <View style={{ marginBottom:16 }}>
          <Text style={[TY.label, { color:C.inkMuted, marginBottom:8 }]}>Status</Text>
          <View style={{ flexDirection:'row' }}>
            {['pending','paid','overdue'].map(function(s) {
              return (
                <TouchableOpacity key={s} onPress={function() { setForm(function(f) { return {...f,status:s}; }); }}
                  style={{ backgroundColor:form.status===s ? C.primary : C.bgHighlight,
                    borderRadius:100, paddingHorizontal:14, paddingVertical:7, marginRight:8 }}>
                  <Text style={{ color:form.status===s ? C.inkDark : C.inkMuted, ...TY.caption, fontWeight:'700' }}>
                    {s.charAt(0).toUpperCase()+s.slice(1)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <Field label="Issue Date" value={form.issueDate} onChangeText={function(v) { setForm(function(f) { return {...f,issueDate:v}; }); }} placeholder="YYYY-MM-DD"/>
        <Field label="Due Date" value={form.dueDate} onChangeText={function(v) { setForm(function(f) { return {...f,dueDate:v}; }); }} placeholder="YYYY-MM-DD"/>
        <PrimaryBtn label={editing ? 'Save Changes' : 'Create Invoice'} onPress={save}/>
        {editing && <TouchableOpacity onPress={function() { setShowForm(false); del(editing); }} style={{ alignItems:'center', marginTop:12 }}>
          <Text style={{ color:C.punch, ...TY.body }}>Delete this invoice</Text>
        </TouchableOpacity>}
      </Sheet>
    </SafeAreaView>
  );
}

function ReportsScreen() {
  const { data } = useStore();
  const totalBudget = data.projects.reduce(function(a, p) { return a + p.budget; }, 0);
  const totalSpent = data.projects.reduce(function(a, p) { return a + p.spent; }, 0);
  const invoiceRevenue = data.invoices.filter(function(i) { return i.status === 'paid'; }).reduce(function(a, i) { return a + i.amount; }, 0);
  const crewActive = data.crew.filter(function(c) { return c.status === 'active'; }).length;
  const maxBudget = Math.max.apply(null, data.projects.map(function(p) { return p.budget; })) || 1;
  const barColors = [C.primary, C.accent, C.purple, C.success, C.punch];
  const deptBreakdown = data.crew.reduce(function(acc, c) { acc[c.dept] = (acc[c.dept] || 0) + 1; return acc; }, {});
  const deptEntries = Object.entries(deptBreakdown);
  return (
    <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      <ScrollView contentContainerStyle={{ paddingBottom:100 }}>
        <Header title="Reports" subtitle="ANALYTICS"/>
        <View style={{ paddingHorizontal:16, marginBottom:24 }}>
          <View style={{ flexDirection:'row', marginBottom:8 }}>
            <StatPill label="TOTAL BUDGET" value={"GBP"+Math.round(totalBudget/1000)+"k"} color={C.primary}/>
            <StatPill label="TOTAL SPENT" value={"GBP"+Math.round(totalSpent/1000)+"k"} color={totalSpent/totalBudget > 0.8 ? C.punch : C.accent}/>
          </View>
          <View style={{ flexDirection:'row' }}>
            <StatPill label="REVENUE EARNED" value={"GBP"+Math.round(invoiceRevenue/1000)+"k"} color={C.success}/>
            <StatPill label="CREW ON SET" value={crewActive} color={C.purple}/>
          </View>
        </View>
        <View style={{ paddingHorizontal:20, marginBottom:24 }}>
          <SectionLabel text="Budget by Project"/>
          <Card style={{ padding:20 }}>
            {data.projects.map(function(p, i) {
              var pct = p.budget > 0 ? Math.round((p.spent / p.budget) * 100) : 0;
              var barW = (p.budget / maxBudget) * 100;
              var color = barColors[i % barColors.length];
              return (
                <View key={p.id} style={{ marginBottom:16 }}>
                  <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:6 }}>
                    <Text style={[TY.bodyMd, { color:C.ink, fontWeight:'600', flex:1 }]} numberOfLines={1}>{p.title}</Text>
                    <Text style={[TY.mono, { color:color, marginLeft:8 }]}>GBP{Math.round(p.budget/1000)}k</Text>
                  </View>
                  <View style={{ height:10, backgroundColor:C.bgHighlight, borderRadius:5 }}>
                    <View style={{ height:10, width:barW+'%', backgroundColor:color, borderRadius:5 }}/>
                  </View>
                  <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop:4 }}>
                    <Text style={[TY.caption, { color:C.inkMuted }]}>Spent: GBP{Math.round(p.spent/1000)}k</Text>
                    <Text style={[TY.caption, { color:pct > 85 ? C.punch : C.inkMuted }]}>{pct}% used</Text>
                  </View>
                </View>
              );
            })}
          </Card>
        </View>
        <View style={{ paddingHorizontal:20, marginBottom:24 }}>
          <SectionLabel text="Invoice Status"/>
          <View style={{ flexDirection:'row' }}>
            {[
              { label:'Paid', count:data.invoices.filter(function(i) { return i.status==='paid'; }).length, color:C.success },
              { label:'Pending', count:data.invoices.filter(function(i) { return i.status==='pending'; }).length, color:C.primary },
              { label:'Overdue', count:data.invoices.filter(function(i) { return i.status==='overdue'; }).length, color:C.punch },
            ].map(function(item) {
              return (
                <Card key={item.label} style={{ flex:1, marginHorizontal:4, padding:16, alignItems:'center' }}>
                  <Text style={[TY.hero, { color:item.color, fontSize:28 }]}>{item.count}</Text>
                  <Text style={[TY.label, { color:C.inkMuted, marginTop:4 }]}>{item.label}</Text>
                </Card>
              );
            })}
          </View>
        </View>
        <View style={{ paddingHorizontal:20, marginBottom:24 }}>
          <SectionLabel text="Crew by Department"/>
          <Card style={{ padding:20 }}>
            {deptEntries.map(function(entry, i) {
              var dept = entry[0]; var count = entry[1];
              var pct = data.crew.length > 0 ? Math.round((count / data.crew.length) * 100) : 0;
              var color = barColors[i % barColors.length];
              return (
                <View key={dept} style={{ marginBottom:14 }}>
                  <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:5 }}>
                    <Text style={[TY.body, { color:C.ink, fontWeight:'600' }]}>{dept}</Text>
                    <Text style={[TY.mono, { color:color }]}>{count} crew</Text>
                  </View>
                  <View style={{ height:8, backgroundColor:C.bgHighlight, borderRadius:4 }}>
                    <View style={{ height:8, width:pct+'%', backgroundColor:color, borderRadius:4 }}/>
                  </View>
                </View>
              );
            })}
          </Card>
        </View>
        <View style={{ paddingHorizontal:20 }}>
          <SectionLabel text="At a Glance"/>
          <Card style={{ padding:20 }}>
            {[
              { label:'Active Projects', value:data.projects.filter(function(p) { return p.status==='active'; }).length, color:C.accent },
              { label:'Completed Projects', value:data.projects.filter(function(p) { return p.status==='completed'; }).length, color:C.success },
              { label:'Total Crew', value:data.crew.length, color:C.purple },
              { label:'Scheduled Shifts', value:data.shifts.length, color:C.primary },
              { label:'Messages', value:data.messages.length, color:C.accent },
            ].map(function(item) {
              return (
                <View key={item.label} style={{ flexDirection:'row', alignItems:'center', paddingVertical:10,
                  borderBottomWidth:1, borderBottomColor:C.border }}>
                  <Text style={[TY.body, { color:C.inkMuted, flex:1 }]}>{item.label}</Text>
                  <Text style={[TY.h3, { color:item.color }]}>{item.value}</Text>
                </View>
              );
            })}
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MoreScreen() {
  const { data, dispatch } = useStore();
  const [editProfile, setEditProfile] = useState(false);
  const [profile, setProfile] = useState({ name:'Ashtyn', company:'CrewDesk Ltd', email:'ashtyn@crewdesk.io', phone:'+44 7700 900000' });
  const [notifications, setNotifications] = useState(true);
  const [budgetAlerts, setBudgetAlerts] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  function saveProfile() { setEditProfile(false); Alert.alert('Saved', 'Profile updated successfully.'); }
  const menuItems = [
    { section:'Account', items:[
      { icon:'person', label:'Edit Profile', onPress:function() { setEditProfile(true); } },
      { icon:'lock', label:'Security and Privacy', onPress:function() { Alert.alert('Security', 'Manage your account security.'); } },
      { icon:'card', label:'Billing and Subscription', onPress:function() { Alert.alert('Billing', 'CrewDesk Pro GBP49/month'); } },
    ]},
    { section:'Workspace', items:[
      { icon:'building', label:'Company Settings', onPress:function() { Alert.alert('Company', 'Manage company details.'); } },
      { icon:'team', label:'Team and Permissions', onPress:function() { Alert.alert('Team', 'Manage team access and roles.'); } },
      { icon:'link', label:'Integrations', onPress:function() { Alert.alert('Integrations', 'Connect Slack, Xero, Google and more.'); } },
    ]},
    { section:'Support', items:[
      { icon:'chat', label:'Contact Support', onPress:function() { Alert.alert('Support', 'Email: support@crewdesk.io'); } },
      { icon:'book', label:'Help Centre', onPress:function() { Alert.alert('Help', 'Browse guides and tutorials.'); } },
      { icon:'star', label:'Rate CrewDesk', onPress:function() { Alert.alert('Rate', 'Thank you! Your review helps us grow.'); } },
    ]},
  ];
  return (
    <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      <ScrollView contentContainerStyle={{ paddingBottom:100 }}>
        <Header title="Settings" subtitle="ACCOUNT"/>
        <View style={{ paddingHorizontal:20, marginBottom:24 }}>
          <Card style={{ padding:20 }}>
            <View style={{ flexDirection:'row', alignItems:'center' }}>
              <View style={{ width:64, height:64, borderRadius:32, backgroundColor:C.primary+'33',
                borderWidth:3, borderColor:C.primary, alignItems:'center', justifyContent:'center', marginRight:16 }}>
                <Text style={{ color:C.primary, fontSize:24, fontWeight:'800' }}>
                  {profile.name.split(' ').map(function(n) { return n[0]; }).join('').toUpperCase()}
                </Text>
              </View>
              <View style={{ flex:1 }}>
                <Text style={[TY.h2, { color:C.ink }]}>{profile.name}</Text>
                <Text style={[TY.body, { color:C.inkMuted }]}>{profile.company}</Text>
                <View style={{ marginTop:6 }}>
                  <Badge label="Pro" color={C.primary} textColor={C.inkDark} size="sm"/>
                </View>
              </View>
              <TouchableOpacity onPress={function() { setEditProfile(true); }}
                style={{ backgroundColor:C.bgHighlight, borderRadius:100, paddingHorizontal:14, paddingVertical:7 }}>
                <Text style={[TY.caption, { color:C.primary, fontWeight:'700' }]}>Edit</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>
        <View style={{ paddingHorizontal:20, marginBottom:24 }}>
          <SectionLabel text="Preferences"/>
          <Card style={{ padding:0, overflow:'hidden' }}>
            {[
              { label:'Push Notifications', value:notifications, onChange:setNotifications },
              { label:'Budget Alerts', value:budgetAlerts, onChange:setBudgetAlerts },
              { label:'Dark Mode', value:darkMode, onChange:setDarkMode },
            ].map(function(pref, idx) {
              return (
                <View key={pref.label} style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between',
                  paddingHorizontal:20, paddingVertical:16,
                  borderBottomWidth:idx < 2 ? 1 : 0, borderBottomColor:C.border }}>
                  <Text style={[TY.body, { color:C.ink }]}>{pref.label}</Text>
                  <Switch value={pref.value} onValueChange={pref.onChange}
                    trackColor={{ false:C.bgHighlight, true:C.primary }}
                    thumbColor={pref.value ? C.inkDark : C.inkMuted}/>
                </View>
              );
            })}
          </Card>
        </View>
        {menuItems.map(function(section) {
          return (
            <View key={section.section} style={{ paddingHorizontal:20, marginBottom:20 }}>
              <SectionLabel text={section.section}/>
              <Card style={{ padding:0, overflow:'hidden' }}>
                {section.items.map(function(item, idx) {
                  return (
                    <TouchableOpacity key={item.label} onPress={item.onPress}
                      style={{ flexDirection:'row', alignItems:'center', paddingHorizontal:20, paddingVertical:16,
                        borderBottomWidth:idx < section.items.length - 1 ? 1 : 0, borderBottomColor:C.border }}>
                      <Text style={[TY.body, { color:C.ink, flex:1 }]}>{item.label}</Text>
                      <Text style={{ color:C.inkFaint, fontSize:16 }}>></Text>
                    </TouchableOpacity>
                  );
                })}
              </Card>
            </View>
          );
        })}
        <Text style={[TY.caption, { color:C.inkFaint, textAlign:'center', marginTop:8 }]}>CrewDesk v5.0 - Built for the industry</Text>
      </ScrollView>
      <Sheet visible={editProfile} onClose={function() { setEditProfile(false); }} title="Edit Profile">
        <Field label="Full Name" value={profile.name} onChangeText={function(v) { setProfile(function(p) { return {...p,name:v}; }); }} placeholder="Your name"/>
        <Field label="Company" value={profile.company} onChangeText={function(v) { setProfile(function(p) { return {...p,company:v}; }); }} placeholder="Company name"/>
        <Field label="Email" value={profile.email} onChangeText={function(v) { setProfile(function(p) { return {...p,email:v}; }); }} placeholder="email@example.com" keyboardType="email-address"/>
        <Field label="Phone" value={profile.phone} onChangeText={function(v) { setProfile(function(p) { return {...p,phone:v}; }); }} placeholder="+44 7700 000000" keyboardType="phone-pad"/>
        <PrimaryBtn label="Save Profile" onPress={saveProfile}/>
      </Sheet>
    </SafeAreaView>
  );
}

const TABS = [
  { key:'Home', label:'Home', icon:'H' },
  { key:'Projects', label:'Projects', icon:'P' },
  { key:'Crew', label:'Crew', icon:'C' },
  { key:'Schedule', label:'Schedule', icon:'S' },
  { key:'Messages', label:'Msgs', icon:'M' },
  { key:'Invoices', label:'Invoices', icon:'I' },
  { key:'Reports', label:'Reports', icon:'R' },
  { key:'More', label:'More', icon:'...' },
];
function TabBar({ active, onSelect, unread }) {
  return (
    <View style={{ position:'absolute', bottom:0, left:0, right:0, backgroundColor:C.bgCard,
      borderTopWidth:1, borderTopColor:C.border,
      shadowColor:C.shadow, shadowOffset:{width:0,height:-4}, shadowOpacity:1, shadowRadius:20, elevation:20 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal:8, paddingVertical:8 }}>
        {TABS.map(function(tab) {
          var isActive = active === tab.key;
          var hasUnread = tab.key === 'Messages' && unread > 0;
          return (
            <TouchableOpacity key={tab.key} onPress={function() { onSelect(tab.key); }}
              style={{ alignItems:'center', paddingHorizontal:10, paddingVertical:6, minWidth:68, position:'relative' }}>
              {isActive && (
                <View style={{ position:'absolute', top:0, left:12, right:12, height:2,
                  backgroundColor:C.primary, borderRadius:1 }}/>
              )}
              <View style={{ position:'relative' }}>
                <View style={{ width:36, height:36, borderRadius:18,
                  backgroundColor:isActive ? C.primary+'22' : 'transparent',
                  alignItems:'center', justifyContent:'center' }}>
                  <Text style={{ color:isActive ? C.primary : C.inkMuted, fontSize:16, fontWeight:'700' }}>{tab.icon}</Text>
                </View>
                {hasUnread && (
                  <View style={{ position:'absolute', top:-3, right:-5, backgroundColor:C.punch,
                    width:14, height:14, borderRadius:7, alignItems:'center', justifyContent:'center',
                    borderWidth:1.5, borderColor:C.bgCard }}>
                    <Text style={{ color:C.ink, fontSize:8, fontWeight:'800' }}>{unread}</Text>
                  </View>
                )}
              </View>
              <Text style={{ color:isActive ? C.primary : C.inkMuted, fontSize:10,
                fontWeight:isActive ? '700' : '500', marginTop:2, letterSpacing:0.2 }}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const { data } = useStore();
  const unreadMessages = data.messages.reduce(function(a, m) { return a + (m.unread || 0); }, 0);
  function navigateFromHome(screen) { setActiveTab(screen); }
  function renderScreen() {
    if (activeTab === 'Home')     return <HomeScreen navigate={navigateFromHome}/>;
    if (activeTab === 'Projects') return <ProjectsScreen/>;
    if (activeTab === 'Crew')     return <CrewScreen/>;
    if (activeTab === 'Schedule') return <ScheduleScreen/>;
    if (activeTab === 'Messages') return <MessagesScreen/>;
    if (activeTab === 'Invoices') return <InvoicesScreen/>;
    if (activeTab === 'Reports')  return <ReportsScreen/>;
    if (activeTab === 'More')     return <MoreScreen/>;
    return null;
  }
  return (
    <View style={{ flex:1, backgroundColor:C.bg }}>
      {renderScreen()}
      <TabBar active={activeTab} onSelect={setActiveTab} unread={unreadMessages}/>
    </View>
  );
}
