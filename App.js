import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Modal, SafeAreaView, StatusBar, KeyboardAvoidingView, Platform, Dimensions } from 'react-native';

const { width: SW } = Dimensions.get('window');

const C = {
  bg:'#07090F', surface:'#0D1117', card:'#111827', cardAlt:'#161f2e',
  border:'#1e2d42', borderLight:'#253550',
  text:'#EEF2FF', textSoft:'#C7D2EE', muted:'#6B7FA8', dim:'#3D4F6B',
  accent:'#4F8EF7', accentSoft:'#1E3A6E', accentGlow:'rgba(79,142,247,0.12)',
  gold:'#F5C842', goldSoft:'rgba(245,200,66,0.12)',
  green:'#22D47E', greenSoft:'rgba(34,212,126,0.12)',
  red:'#F05252', redSoft:'rgba(240,82,82,0.12)',
  purple:'#8B5CF6', purpleSoft:'rgba(139,92,246,0.12)',
  orange:'#F97316', orangeSoft:'rgba(249,115,22,0.12)',
  teal:'#2DD4BF', tealSoft:'rgba(45,212,191,0.12)',
};

// ─── SAMPLE DATA ─────────────────────────────────────────────────────────────
const PROJECTS_DATA = [
  { id:1, name:'Nike Summer Campaign', client:'Nike EMEA', status:'On Track', statusColor:C.green, crew:8, due:'Mar 15', budget:24000, spent:16800, progress:0.70, lead:'Alex M.' },
  { id:2, name:'BBC Documentary Series', client:'BBC Studios', status:'Pending', statusColor:C.orange, crew:12, due:'Apr 2', budget:85000, spent:12000, progress:0.14, lead:'Jordan K.' },
  { id:3, name:'Adidas Product Shoot', client:'Adidas UK', status:'In Progress', statusColor:C.accent, crew:5, due:'Mar 22', budget:18000, spent:9000, progress:0.50, lead:'Sam R.' },
  { id:4, name:'Netflix Series BTS', client:'Netflix', status:'On Track', statusColor:C.green, crew:15, due:'May 10', budget:120000, spent:45000, progress:0.38, lead:'Taylor W.' },
  { id:5, name:'Apple Launch Event', client:'Apple Inc', status:'At Risk', statusColor:C.red, crew:20, due:'Mar 8', budget:200000, spent:190000, progress:0.95, lead:'Morgan P.' },
];

const CREW_DATA = [
  { id:1, name:'Alex Morgan', role:'Director', dept:'Production', status:'Available', rate:850, rating:4.9, projects:3, avatar:'A', color:C.accent },
  { id:2, name:'Jordan Kim', role:'DP', dept:'Camera', status:'On Set', rate:750, rating:4.8, projects:2, avatar:'J', color:C.purple },
  { id:3, name:'Sam Rivera', role:'Gaffer', dept:'Lighting', status:'Available', rate:620, rating:4.7, projects:4, avatar:'S', color:C.green },
  { id:4, name:'Taylor Walsh', role:'Sound Engineer', dept:'Audio', status:'Travelling', rate:580, rating:4.6, projects:2, avatar:'T', color:C.gold },
  { id:5, name:'Morgan Patel', role:'Art Director', dept:'Art', status:'On Set', rate:700, rating:4.9, projects:5, avatar:'M', color:C.orange },
  { id:6, name:'Casey Chen', role:'Editor', dept:'Post', status:'Available', rate:680, rating:4.7, projects:1, avatar:'C', color:C.teal },
  { id:7, name:'Riley Johnson', role:'PA', dept:'Production', status:'Available', rate:380, rating:4.5, projects:6, avatar:'R', color:C.red },
  { id:8, name:'Quinn Davis', role:'Colorist', dept:'Post', status:'Travelling', rate:720, rating:4.8, projects:3, avatar:'Q', color:C.accent },
];

const MESSAGES_DATA = [
  { id:1, name:'Alex Morgan', text:'Confirmed for the Nike shoot tomorrow 7am.', time:'2m ago', unread:2, color:C.accent },
  { id:2, name:'Jordan Kim', text:'Sending over the shot list now.', time:'18m ago', unread:0, color:C.purple },
  { id:3, name:'Nike Team', text:'Client approved the revised treatment!', time:'1h ago', unread:5, color:C.green },
  { id:4, name:'Sam Rivera', text:'Lighting rig is set. Ready when you are.', time:'3h ago', unread:0, color:C.orange },
  { id:5, name:'Taylor Walsh', text:'Audio equipment sorted. See you at 6.', time:'5h ago', unread:1, color:C.gold },
  { id:6, name:'Morgan Patel', text:'Art department wrap confirmed.', time:'Yesterday', unread:0, color:C.teal },
];

const SHIFTS_DATA = [
  { id:1, project:'Nike Campaign', role:'Director', crewName:'Alex Morgan', day:'Mon', start:'07:00', end:'18:00', color:C.accent },
  { id:2, project:'Nike Campaign', role:'DP', crewName:'Jordan Kim', day:'Mon', start:'06:30', end:'18:00', color:C.purple },
  { id:3, project:'BBC Docs', role:'Sound Eng', crewName:'Taylor Walsh', day:'Tue', start:'08:00', end:'20:00', color:C.gold },
  { id:4, project:'Adidas Shoot', role:'Gaffer', crewName:'Sam Rivera', day:'Wed', start:'07:00', end:'16:00', color:C.green },
  { id:5, project:'Netflix BTS', role:'Art Dir', crewName:'Morgan Patel', day:'Thu', start:'09:00', end:'21:00', color:C.orange },
  { id:6, project:'Apple Event', role:'Editor', crewName:'Casey Chen', day:'Fri', start:'10:00', end:'22:00', color:C.teal },
];

const INVOICES_DATA = [
  { id:'INV-001', project:'Nike Summer Campaign', client:'Nike EMEA', amount:12400, status:'Paid', statusColor:C.green, due:'Feb 28', issued:'Feb 1' },
  { id:'INV-002', project:'BBC Documentary', client:'BBC Studios', amount:32000, status:'Pending', statusColor:C.orange, due:'Mar 15', issued:'Feb 15' },
  { id:'INV-003', project:'Adidas Shoot', client:'Adidas UK', amount:9000, status:'Overdue', statusColor:C.red, due:'Mar 1', issued:'Feb 10' },
  { id:'INV-004', project:'Netflix BTS', client:'Netflix', amount:45000, status:'Draft', statusColor:C.muted, due:'Apr 30', issued:'Mar 1' },
  { id:'INV-005', project:'Apple Event', client:'Apple Inc', amount:80000, status:'Paid', statusColor:C.green, due:'Mar 5', issued:'Jan 20' },
];

const CHAT_MESSAGES = {
  1: [
    { id:1, me:false, text:'Hey! Confirmed for the Nike shoot tomorrow 7am.', time:'09:02' },
    { id:2, me:true, text:'Perfect. Make sure the rig is ready by 6:45.', time:'09:05' },
    { id:3, me:false, text:'Already sorted. Anything else?', time:'09:06' },
    { id:4, me:true, text:'Bring the extra 35mm. Client might want options.', time:'09:08' },
    { id:5, me:false, text:'On it. See you tomorrow!', time:'09:09' },
  ],
  3: [
    { id:1, me:false, text:'Client approved the revised treatment!', time:'10:30' },
    { id:2, me:true, text:'Amazing news! When do they want to kick off?', time:'10:32' },
    { id:3, me:false, text:'They are thinking next Monday.', time:'10:33' },
    { id:4, me:true, text:'Works for us. Sending the crew schedule shortly.', time:'10:35' },
  ],
};

// ─── SHARED COMPONENTS ───────────────────────────────────────────────────────

const Avatar = ({ name, size=36, color=C.accent, showBorder=true }) => (
  <View style={{
    width:size, height:size, borderRadius:size/2,
    backgroundColor:color+'22', alignItems:'center', justifyContent:'center',
    borderWidth:showBorder?1.5:0, borderColor:color+'60',
  }}>
    <Text style={{ color, fontSize:size*0.38, fontWeight:'700' }}>
      {(name||'?').charAt(0).toUpperCase()}
    </Text>
  </View>
);

const Badge = ({ label, color }) => (
  <View style={{
    backgroundColor:color+'18', paddingHorizontal:10, paddingVertical:4,
    borderRadius:20, borderWidth:1, borderColor:color+'40',
  }}>
    <Text style={{ color, fontSize:10, fontWeight:'700', letterSpacing:0.5 }}>
      {label.toUpperCase()}
    </Text>
  </View>
);

const ProgressBar = ({ progress, color=C.accent, height=4 }) => (
  <View style={{ height, backgroundColor:C.border, borderRadius:height/2, overflow:'hidden' }}>
    <View style={{
      width:`${Math.round(progress*100)}%`, height:'100%',
      backgroundColor:color, borderRadius:height/2,
    }} />
  </View>
);

const StatTile = ({ value, label, color, sub }) => (
  <View style={{
    flex:1, backgroundColor:C.card, borderRadius:18, padding:16,
    marginHorizontal:4, borderWidth:1, borderColor:C.border,
  }}>
    <Text style={{ fontSize:24, fontWeight:'800', color, letterSpacing:-0.5 }}>{value}</Text>
    <Text style={{ fontSize:11, color:C.muted, marginTop:3, fontWeight:'500' }}>{label}</Text>
    {sub && <Text style={{ fontSize:10, color:color+'99', marginTop:1 }}>{sub}</Text>}
  </View>
);

const SectionRow = ({ title, action, onAction }) => (
  <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:14, marginTop:6 }}>
    <Text style={{ fontSize:15, fontWeight:'700', color:C.text, letterSpacing:-0.2 }}>{title}</Text>
    {action && (
      <TouchableOpacity onPress={onAction}>
        <Text style={{ fontSize:12, color:C.accent, fontWeight:'600' }}>{action}</Text>
      </TouchableOpacity>
    )}
  </View>
);

const Card = ({ children, style={}, onPress }) => {
  const Wrapper = onPress ? TouchableOpacity : View;
  return (
    <Wrapper onPress={onPress} style={[{
      backgroundColor:C.card, borderRadius:20, padding:16,
      marginBottom:10, borderWidth:1, borderColor:C.border,
    }, style]}>
      {children}
    </Wrapper>
  );
};

const Divider = () => <View style={{ height:1, backgroundColor:C.border, marginVertical:10 }} />;

const EmptyState = ({ icon, title, subtitle }) => (
  <View style={{ alignItems:'center', paddingVertical:50 }}>
    <Text style={{ fontSize:40, marginBottom:12 }}>{icon}</Text>
    <Text style={{ fontSize:16, fontWeight:'700', color:C.textSoft, marginBottom:6 }}>{title}</Text>
    <Text style={{ fontSize:13, color:C.muted, textAlign:'center' }}>{subtitle}</Text>
  </View>
);

const InputField = ({ value, onChangeText, placeholder, multiline=false, style={} }) => (
  <TextInput
    value={value}
    onChangeText={onChangeText}
    placeholder={placeholder}
    placeholderTextColor={C.dim}
    multiline={multiline}
    style={[{
      backgroundColor:C.surface, borderWidth:1, borderColor:C.border,
      borderRadius:14, paddingHorizontal:14, paddingVertical:12,
      color:C.text, fontSize:14, marginBottom:12,
    }, multiline && { height:80, textAlignVertical:'top' }, style]}
  />
);

// HOME SCREEN
const HomeScreen = ({ setTab }) => {
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  });
  const [clockedIn, setClockedIn] = useState(false);
  const [clockTime, setClockTime] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (clockedIn) {
      timerRef.current = setInterval(() => setClockTime(t => t+1), 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [clockedIn]);

  const fmt = secs => {
    const h = Math.floor(secs/3600).toString().padStart(2,'0');
    const m = Math.floor((secs%3600)/60).toString().padStart(2,'0');
    const s = (secs%60).toString().padStart(2,'0');
    return h+':'+m+':'+s;
  };

  return (
    <ScrollView style={{ flex:1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom:30 }}>
      <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:22 }}>
        <View>
          <Text style={{ fontSize:24, fontWeight:'800', color:C.text, letterSpacing:-0.5 }}>{greeting}</Text>
          <Text style={{ fontSize:13, color:C.muted, marginTop:2 }}>You have 3 items needing attention</Text>
        </View>
        <TouchableOpacity style={{
          width:44, height:44, borderRadius:22,
          backgroundColor:C.accentSoft, alignItems:'center', justifyContent:'center',
          borderWidth:1, borderColor:C.accent+'40',
        }}>
          <Text style={{ fontSize:18 }}>🔔</Text>
        </TouchableOpacity>
      </View>

      <Card style={{ marginBottom:16, borderColor: clockedIn ? C.green+'50' : C.border }}>
        <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
          <View>
            <Text style={{ fontSize:12, color:C.muted, fontWeight:'600', letterSpacing:0.5, textTransform:'uppercase' }}>
              {clockedIn ? 'Currently On Clock' : 'Ready to Start?'}
            </Text>
            <Text style={{ fontSize:28, fontWeight:'800', color: clockedIn ? C.green : C.text, letterSpacing:-1, marginTop:4 }}>
              {clockedIn ? fmt(clockTime) : '00:00:00'}
            </Text>
            {clockedIn && <Text style={{ fontSize:11, color:C.muted, marginTop:2 }}>Nike Summer Campaign</Text>}
          </View>
          <TouchableOpacity
            onPress={() => { setClockedIn(!clockedIn); if(clockedIn) setClockTime(0); }}
            style={{
              paddingHorizontal:22, paddingVertical:12, borderRadius:50,
              backgroundColor: clockedIn ? C.red+'22' : C.green,
              borderWidth:1, borderColor: clockedIn ? C.red : C.green,
            }}>
            <Text style={{ color: clockedIn ? C.red : C.bg, fontWeight:'700', fontSize:13 }}>
              {clockedIn ? 'Clock Out' : 'Clock In'}
            </Text>
          </TouchableOpacity>
        </View>
      </Card>

      <View style={{ flexDirection:'row', marginBottom:16, marginHorizontal:-4 }}>
        <StatTile value="12" label="Active Projects" color={C.accent} />
        <StatTile value="47" label="Crew Members" color={C.purple} />
        <StatTile value="£28k" label="This Month" color={C.gold} />
      </View>

      <SectionRow title="Quick Actions" />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:20 }}>
        {[
          { label:'New Project', icon:'◈', color:C.accent, tab:'Projects' },
          { label:'Add Crew', icon:'◉', color:C.purple, tab:'Crew' },
          { label:'Schedule', icon:'▦', color:C.green, tab:'Schedule' },
          { label:'Invoice', icon:'◎', color:C.gold, tab:'More' },
          { label:'Message', icon:'◷', color:C.teal, tab:'Messages' },
        ].map(a => (
          <TouchableOpacity key={a.label} onPress={() => setTab(a.tab)} style={{
            backgroundColor:C.card, borderWidth:1, borderColor:C.border,
            borderRadius:16, padding:14, marginRight:10, alignItems:'center', minWidth:80,
          }}>
            <Text style={{ fontSize:22, marginBottom:6 }}>{a.icon}</Text>
            <Text style={{ fontSize:11, color:C.textSoft, fontWeight:'600' }}>{a.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <SectionRow title="Active Projects" action="See All" onAction={() => setTab('Projects')} />
      {PROJECTS_DATA.slice(0,3).map(p => (
        <Card key={p.id} style={{ marginBottom:10 }}>
          <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
            <View style={{ flex:1 }}>
              <Text style={{ fontSize:14, fontWeight:'700', color:C.text, marginBottom:2 }}>{p.name}</Text>
              <Text style={{ fontSize:12, color:C.muted }}>{p.client}</Text>
            </View>
            <Badge label={p.status} color={p.statusColor} />
          </View>
          <ProgressBar progress={p.progress} color={p.statusColor} height={5} />
          <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop:10 }}>
            <Text style={{ fontSize:11, color:C.dim }}>Crew: {p.crew} · Due {p.due}</Text>
            <Text style={{ fontSize:11, color:C.muted, fontWeight:'600' }}>£{(p.budget/1000).toFixed(0)}k</Text>
          </View>
        </Card>
      ))}

      <SectionRow title="On Deck Today" action="Full Roster" onAction={() => setTab('Crew')} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {CREW_DATA.filter(c => c.status === 'On Set').map(c => (
          <View key={c.id} style={{
            backgroundColor:C.card, borderRadius:16, padding:12,
            marginRight:10, alignItems:'center', width:90,
            borderWidth:1, borderColor:C.border,
          }}>
            <Avatar name={c.name} size={44} color={c.color} />
            <Text style={{ fontSize:11, color:C.text, fontWeight:'600', marginTop:8, textAlign:'center' }} numberOfLines={1}>
              {c.name.split(' ')[0]}
            </Text>
            <Text style={{ fontSize:10, color:C.muted, textAlign:'center' }}>{c.role}</Text>
            <View style={{ marginTop:6 }}>
              <Badge label={c.status} color={c.color} />
            </View>
          </View>
        ))}
      </ScrollView>
    </ScrollView>
  );
};

// PROJECTS SCREEN
const ProjectsScreen = () => {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const filters = ['All','On Track','In Progress','Pending','At Risk'];

  const filtered = PROJECTS_DATA.filter(p => {
    const matchFilter = filter === 'All' || p.status === filter;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.client.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const ProjectModal = ({ project, onClose }) => (
    <Modal visible={!!project} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
        <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:20, borderBottomWidth:1, borderBottomColor:C.border }}>
          <Text style={{ fontSize:18, fontWeight:'800', color:C.text }}>Project Details</Text>
          <TouchableOpacity onPress={onClose} style={{ padding:8, backgroundColor:C.surface, borderRadius:20 }}>
            <Text style={{ color:C.muted, fontSize:16 }}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{ flex:1, padding:20 }}>
          <View style={{ marginBottom:20 }}>
            <Badge label={project?.status||''} color={project?.statusColor||C.accent} />
            <Text style={{ fontSize:22, fontWeight:'800', color:C.text, marginTop:10, marginBottom:4 }}>{project?.name}</Text>
            <Text style={{ fontSize:14, color:C.muted }}>{project?.client}</Text>
          </View>
          <Divider />
          <View style={{ flexDirection:'row', marginBottom:20, marginHorizontal:-4 }}>
            <StatTile value={'£'+(project?.budget/1000).toFixed(0)+'k'} label="Budget" color={C.gold} />
            <StatTile value={'£'+(project?.spent/1000).toFixed(0)+'k'} label="Spent" color={C.red} />
            <StatTile value={project?.crew} label="Crew" color={C.purple} />
          </View>
          <Card style={{ marginBottom:12 }}>
            <Text style={{ fontSize:12, color:C.muted, marginBottom:8 }}>PROJECT PROGRESS</Text>
            <ProgressBar progress={project?.progress||0} color={project?.statusColor||C.accent} height={8} />
            <Text style={{ fontSize:22, fontWeight:'800', color:project?.statusColor, marginTop:8 }}>
              {Math.round((project?.progress||0)*100)}%
            </Text>
          </Card>
          <Card>
            <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:8 }}>
              <Text style={{ fontSize:12, color:C.muted }}>LEAD</Text>
              <Text style={{ fontSize:13, color:C.text, fontWeight:'600' }}>{project?.lead}</Text>
            </View>
            <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:8 }}>
              <Text style={{ fontSize:12, color:C.muted }}>DUE DATE</Text>
              <Text style={{ fontSize:13, color:C.text, fontWeight:'600' }}>{project?.due}</Text>
            </View>
            <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
              <Text style={{ fontSize:12, color:C.muted }}>REMAINING</Text>
              <Text style={{ fontSize:13, color:C.gold, fontWeight:'600' }}>
                £{((project?.budget||0)-(project?.spent||0)).toLocaleString()}
              </Text>
            </View>
          </Card>
          <TouchableOpacity style={{
            backgroundColor:C.accent, padding:16, borderRadius:16, alignItems:'center', marginTop:16,
          }}>
            <Text style={{ color:'#fff', fontWeight:'700', fontSize:15 }}>Manage Project</Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <View style={{ flex:1 }}>
      <ProjectModal project={selected} onClose={() => setSelected(null)} />
      <InputField value={search} onChangeText={setSearch} placeholder="Search projects or clients..." style={{ marginBottom:12 }} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:16 }}>
        {filters.map(f => (
          <TouchableOpacity key={f} onPress={() => setFilter(f)} style={{
            paddingHorizontal:16, paddingVertical:8, borderRadius:50, marginRight:8,
            backgroundColor: filter===f ? C.accent : C.card,
            borderWidth:1, borderColor: filter===f ? C.accent : C.border,
          }}>
            <Text style={{ color: filter===f ? '#fff' : C.muted, fontWeight:'600', fontSize:12 }}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom:30 }}>
        {filtered.length === 0 ? (
          <EmptyState icon="◈" title="No projects found" subtitle="Try adjusting your search or filter" />
        ) : filtered.map(p => (
          <Card key={p.id} onPress={() => setSelected(p)} style={{ marginBottom:12 }}>
            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <View style={{ flex:1, paddingRight:10 }}>
                <Text style={{ fontSize:15, fontWeight:'700', color:C.text, marginBottom:3 }}>{p.name}</Text>
                <Text style={{ fontSize:12, color:C.muted }}>{p.client} · Lead: {p.lead}</Text>
              </View>
              <Badge label={p.status} color={p.statusColor} />
            </View>
            <ProgressBar progress={p.progress} color={p.statusColor} height={5} />
            <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop:12 }}>
              <View style={{ flexDirection:'row', alignItems:'center' }}>
                <Text style={{ fontSize:11, color:C.dim }}>👥 {p.crew} crew</Text>
                <Text style={{ fontSize:11, color:C.dim, marginLeft:12 }}>📅 Due {p.due}</Text>
              </View>
              <Text style={{ fontSize:13, color:C.gold, fontWeight:'700' }}>£{(p.budget/1000).toFixed(0)}k</Text>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

// CREW SCREEN
const CrewScreen = () => {
  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [selected, setSelected] = useState(null);
  const depts = ['All','Production','Camera','Lighting','Audio','Art','Post'];

  const filtered = CREW_DATA.filter(c => {
    const matchDept = deptFilter === 'All' || c.dept === deptFilter;
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.role.toLowerCase().includes(search.toLowerCase());
    return matchDept && matchSearch;
  });

  const statusColor = (s) => s==='Available'?C.green : s==='On Set'?C.accent : C.orange;

  const CrewModal = ({ crew, onClose }) => (
    <Modal visible={!!crew} animationType="slide" presentationStyle="pageSheet">
      <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
        <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:20, borderBottomWidth:1, borderBottomColor:C.border }}>
          <Text style={{ fontSize:18, fontWeight:'800', color:C.text }}>Crew Profile</Text>
          <TouchableOpacity onPress={onClose} style={{ padding:8, backgroundColor:C.surface, borderRadius:20 }}>
            <Text style={{ color:C.muted, fontSize:16 }}>✕</Text>
          </TouchableOpacity>
        </View>
        <ScrollView style={{ flex:1, padding:20 }}>
          <View style={{ alignItems:'center', paddingVertical:24 }}>
            <Avatar name={crew?.name||''} size={80} color={crew?.color||C.accent} />
            <Text style={{ fontSize:22, fontWeight:'800', color:C.text, marginTop:14, marginBottom:4 }}>{crew?.name}</Text>
            <Text style={{ fontSize:14, color:C.muted, marginBottom:10 }}>{crew?.role} · {crew?.dept}</Text>
            <Badge label={crew?.status||''} color={statusColor(crew?.status||'')} />
          </View>
          <Divider />
          <View style={{ flexDirection:'row', marginBottom:20, marginHorizontal:-4 }}>
            <StatTile value={'£'+crew?.rate} label="Day Rate" color={C.gold} />
            <StatTile value={crew?.rating} label="Rating" color={C.green} />
            <StatTile value={crew?.projects} label="Projects" color={C.accent} />
          </View>
          <View style={{ flexDirection:'row' }}>
            <TouchableOpacity style={{
              flex:1, backgroundColor:C.accent, padding:14, borderRadius:14, alignItems:'center', marginRight:8,
            }}>
              <Text style={{ color:'#fff', fontWeight:'700' }}>Message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{
              flex:1, backgroundColor:C.surface, padding:14, borderRadius:14, alignItems:'center',
              borderWidth:1, borderColor:C.border,
            }}>
              <Text style={{ color:C.text, fontWeight:'700' }}>Schedule</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );

  return (
    <View style={{ flex:1 }}>
      <CrewModal crew={selected} onClose={() => setSelected(null)} />
      <InputField value={search} onChangeText={setSearch} placeholder="Search crew by name or role..." style={{ marginBottom:12 }} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:16 }}>
        {depts.map(d => (
          <TouchableOpacity key={d} onPress={() => setDeptFilter(d)} style={{
            paddingHorizontal:16, paddingVertical:8, borderRadius:50, marginRight:8,
            backgroundColor: deptFilter===d ? C.purple : C.card,
            borderWidth:1, borderColor: deptFilter===d ? C.purple : C.border,
          }}>
            <Text style={{ color: deptFilter===d ? '#fff' : C.muted, fontWeight:'600', fontSize:12 }}>{d}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <View style={{ flexDirection:'row', marginBottom:16, marginHorizontal:-4 }}>
        <StatTile value={CREW_DATA.filter(c=>c.status==='Available').length} label="Available" color={C.green} />
        <StatTile value={CREW_DATA.filter(c=>c.status==='On Set').length} label="On Set" color={C.accent} />
        <StatTile value={CREW_DATA.filter(c=>c.status==='Travelling').length} label="Travelling" color={C.orange} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom:30 }}>
        {filtered.length === 0 ? (
          <EmptyState icon="◉" title="No crew found" subtitle="Try adjusting your search or filter" />
        ) : filtered.map(c => (
          <Card key={c.id} onPress={() => setSelected(c)} style={{ marginBottom:10 }}>
            <View style={{ flexDirection:'row', alignItems:'center' }}>
              <Avatar name={c.name} size={48} color={c.color} />
              <View style={{ flex:1, marginLeft:14 }}>
                <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:3 }}>
                  <Text style={{ fontSize:15, fontWeight:'700', color:C.text }}>{c.name}</Text>
                  <Badge label={c.status} color={statusColor(c.status)} />
                </View>
                <Text style={{ fontSize:12, color:C.muted, marginBottom:4 }}>{c.role} · {c.dept}</Text>
                <View style={{ flexDirection:'row', alignItems:'center' }}>
                  <Text style={{ fontSize:11, color:C.gold }}>★ {c.rating}</Text>
                  <Text style={{ fontSize:11, color:C.dim, marginLeft:10 }}>{c.projects} projects</Text>
                  <Text style={{ fontSize:11, color:C.muted, marginLeft:10 }}>£{c.rate}/day</Text>
                </View>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

// SCHEDULE SCREEN
const ScheduleScreen = () => {
  const [selectedDay, setSelectedDay] = useState('Mon');
  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const dayShifts = SHIFTS_DATA.filter(s => s.day === selectedDay);

  return (
    <View style={{ flex:1 }}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:20 }}>
        {days.map(d => {
          const hasShifts = SHIFTS_DATA.some(s => s.day === d);
          const isSelected = d === selectedDay;
          return (
            <TouchableOpacity key={d} onPress={() => setSelectedDay(d)} style={{
              alignItems:'center', marginRight:10, paddingVertical:12, paddingHorizontal:16,
              borderRadius:16, borderWidth:1,
              backgroundColor: isSelected ? C.accent : C.card,
              borderColor: isSelected ? C.accent : C.border,
            }}>
              <Text style={{ fontSize:12, color: isSelected ? '#fff' : C.muted, fontWeight:'600', marginBottom:4 }}>{d}</Text>
              {hasShifts && (
                <View style={{ width:5, height:5, borderRadius:3, backgroundColor: isSelected ? '#fff' : C.accent }} />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={{ flexDirection:'row', marginBottom:16, marginHorizontal:-4 }}>
        <StatTile value={dayShifts.length} label="Shifts" color={C.accent} />
        <StatTile value={dayShifts.length} label="Crew Needed" color={C.purple} />
        <StatTile value={'£'+(dayShifts.reduce((a,s) => {
          const crew = CREW_DATA.find(c => c.name===s.crewName);
          return a + (crew?.rate||0);
        },0)).toLocaleString()} label="Day Rate" color={C.gold} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom:30 }}>
        {dayShifts.length === 0 ? (
          <EmptyState icon="▦" title="No shifts scheduled" subtitle={"Nothing booked for " + selectedDay + " yet"} />
        ) : (
          <>
            <SectionRow title={selectedDay + " · " + dayShifts.length + " shifts"} />
            {dayShifts.map(shift => {
              const crew = CREW_DATA.find(c => c.name===shift.crewName);
              return (
                <Card key={shift.id} style={{ marginBottom:10, borderLeftWidth:3, borderLeftColor:shift.color }}>
                  <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start' }}>
                    <View style={{ flex:1 }}>
                      <Text style={{ fontSize:14, fontWeight:'700', color:C.text, marginBottom:2 }}>{shift.project}</Text>
                      <Text style={{ fontSize:12, color:C.muted, marginBottom:8 }}>{shift.role}</Text>
                      <View style={{ flexDirection:'row', alignItems:'center' }}>
                        {crew && <Avatar name={crew.name} size={28} color={crew.color} />}
                        <Text style={{ fontSize:13, color:C.textSoft, marginLeft:8, fontWeight:'600' }}>{shift.crewName}</Text>
                      </View>
                    </View>
                    <View style={{ alignItems:'flex-end' }}>
                      <View style={{
                        backgroundColor:shift.color+'18', paddingHorizontal:12, paddingVertical:6,
                        borderRadius:20, borderWidth:1, borderColor:shift.color+'40',
                      }}>
                        <Text style={{ color:shift.color, fontWeight:'700', fontSize:12 }}>
                          {shift.start} – {shift.end}
                        </Text>
                      </View>
                      {crew && (
                        <Text style={{ fontSize:11, color:C.gold, marginTop:8 }}>£{crew.rate}/day</Text>
                      )}
                    </View>
                  </View>
                </Card>
              );
            })}
          </>
        )}

        <SectionRow title="All Scheduled Shifts" />
        {SHIFTS_DATA.map(shift => (
          <Card key={shift.id+'-all'} style={{ marginBottom:8 }}>
            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
              <View style={{ flexDirection:'row', alignItems:'center', flex:1 }}>
                <View style={{ width:8, height:8, borderRadius:4, backgroundColor:shift.color, marginRight:12 }} />
                <View style={{ flex:1 }}>
                  <Text style={{ fontSize:13, fontWeight:'700', color:C.text }}>{shift.crewName}</Text>
                  <Text style={{ fontSize:11, color:C.muted }}>{shift.project} · {shift.role}</Text>
                </View>
              </View>
              <View style={{ alignItems:'flex-end' }}>
                <Text style={{ fontSize:12, color:C.muted, fontWeight:'600' }}>{shift.day}</Text>
                <Text style={{ fontSize:11, color:C.dim }}>{shift.start}–{shift.end}</Text>
              </View>
            </View>
          </Card>
        ))}
      </ScrollView>
    </View>
  );
};

// MESSAGES SCREEN
const MessagesScreen = () => {
  const [activeChat, setActiveChat] = useState(null);
  const [newMsg, setNewMsg] = useState('');
  const [chats, setChats] = useState({
    1: [
      { id:1, me:false, text:'Hey! Confirmed for the Nike shoot tomorrow 7am.', time:'09:02' },
      { id:2, me:true, text:'Perfect. Make sure the rig is ready by 6:45.', time:'09:05' },
      { id:3, me:false, text:'Already sorted. Anything else?', time:'09:06' },
    ],
    3: [
      { id:1, me:false, text:'Client approved the revised treatment!', time:'10:30' },
      { id:2, me:true, text:'Amazing news! When do they want to kick off?', time:'10:32' },
    ],
  });
  const [messages, setMessages] = useState(MESSAGES_DATA);

  const sendMessage = () => {
    if (!newMsg.trim() || !activeChat) return;
    const chat = chats[activeChat.id] || [];
    const updated = [...chat, { id:Date.now(), me:true, text:newMsg.trim(), time:'now' }];
    setChats({ ...chats, [activeChat.id]: updated });
    setMessages(prev => prev.map(m => m.id === activeChat.id ? { ...m, text:newMsg.trim(), unread:0 } : m));
    setNewMsg('');
  };

  if (activeChat) {
    const chatMsgs = chats[activeChat.id] || [];
    return (
      <KeyboardAvoidingView style={{ flex:1 }} behavior={Platform.OS==='ios'?'padding':'height'}>
        <View style={{
          flexDirection:'row', alignItems:'center', paddingBottom:16,
          borderBottomWidth:1, borderBottomColor:C.border, marginBottom:12,
        }}>
          <TouchableOpacity onPress={() => setActiveChat(null)} style={{ marginRight:14, padding:4 }}>
            <Text style={{ color:C.accent, fontSize:18 }}>←</Text>
          </TouchableOpacity>
          <Avatar name={activeChat.name} size={40} color={activeChat.color} />
          <View style={{ marginLeft:12, flex:1 }}>
            <Text style={{ fontSize:15, fontWeight:'700', color:C.text }}>{activeChat.name}</Text>
            <Text style={{ fontSize:11, color:C.green }}>● Online</Text>
          </View>
        </View>
        <ScrollView style={{ flex:1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom:16 }}>
          {chatMsgs.map(msg => (
            <View key={msg.id} style={{
              flexDirection:'row', justifyContent: msg.me ? 'flex-end' : 'flex-start',
              marginBottom:10, paddingHorizontal:4,
            }}>
              {!msg.me && <Avatar name={activeChat.name} size={28} color={activeChat.color} showBorder={false} />}
              <View style={{
                maxWidth:'72%', marginLeft: msg.me ? 0 : 8,
                backgroundColor: msg.me ? C.accent : C.card,
                paddingHorizontal:14, paddingVertical:10, borderRadius:18,
                borderBottomRightRadius: msg.me ? 4 : 18,
                borderBottomLeftRadius: msg.me ? 18 : 4,
                borderWidth: msg.me ? 0 : 1, borderColor:C.border,
              }}>
                <Text style={{ color: msg.me ? '#fff' : C.text, fontSize:14, lineHeight:20 }}>{msg.text}</Text>
                <Text style={{ color: msg.me ? 'rgba(255,255,255,0.6)' : C.dim, fontSize:10, marginTop:4, textAlign:'right' }}>
                  {msg.time}
                </Text>
              </View>
            </View>
          ))}
          {chatMsgs.length === 0 && (
            <EmptyState icon="◷" title="No messages yet" subtitle={"Start a conversation with " + activeChat.name} />
          )}
        </ScrollView>
        <View style={{ flexDirection:'row', alignItems:'center', paddingTop:12, borderTopWidth:1, borderTopColor:C.border }}>
          <TextInput
            value={newMsg}
            onChangeText={setNewMsg}
            placeholder="Message..."
            placeholderTextColor={C.dim}
            style={{
              flex:1, backgroundColor:C.surface, borderRadius:50, borderWidth:1,
              borderColor:C.border, paddingHorizontal:18, paddingVertical:12,
              color:C.text, fontSize:14, marginRight:10,
            }}
            onSubmitEditing={sendMessage}
          />
          <TouchableOpacity onPress={sendMessage} style={{
            width:44, height:44, borderRadius:22,
            backgroundColor: newMsg.trim() ? C.accent : C.surface,
            alignItems:'center', justifyContent:'center',
            borderWidth:1, borderColor: newMsg.trim() ? C.accent : C.border,
          }}>
            <Text style={{ color: newMsg.trim() ? '#fff' : C.dim, fontSize:16 }}>↑</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  const totalUnread = messages.reduce((a,m) => a + m.unread, 0);

  return (
    <View style={{ flex:1 }}>
      {totalUnread > 0 && (
        <View style={{
          backgroundColor:C.accentSoft, borderRadius:14, padding:12,
          marginBottom:16, flexDirection:'row', alignItems:'center',
          borderWidth:1, borderColor:C.accent+'40',
        }}>
          <Text style={{ fontSize:14, color:C.accent, fontWeight:'700' }}>
            {totalUnread} unread messages
          </Text>
        </View>
      )}
      <InputField value={''} onChangeText={()=>{}} placeholder="Search conversations..." style={{ marginBottom:12 }} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom:30 }}>
        {messages.map(m => (
          <TouchableOpacity key={m.id} onPress={() => setActiveChat(m)} style={{
            flexDirection:'row', alignItems:'center', paddingVertical:14,
            borderBottomWidth:1, borderBottomColor:C.border,
          }}>
            <View style={{ position:'relative', marginRight:14 }}>
              <Avatar name={m.name} size={48} color={m.color} />
              {m.unread > 0 && (
                <View style={{
                  position:'absolute', top:-2, right:-2, width:18, height:18,
                  borderRadius:9, backgroundColor:C.accent, alignItems:'center', justifyContent:'center',
                  borderWidth:2, borderColor:C.bg,
                }}>
                  <Text style={{ color:'#fff', fontSize:9, fontWeight:'800' }}>{m.unread}</Text>
                </View>
              )}
            </View>
            <View style={{ flex:1 }}>
              <View style={{ flexDirection:'row', justifyContent:'space-between', marginBottom:4 }}>
                <Text style={{ fontSize:14, fontWeight: m.unread>0?'700':'600', color:C.text }}>{m.name}</Text>
                <Text style={{ fontSize:11, color:C.dim }}>{m.time}</Text>
              </View>
              <Text style={{ fontSize:13, color: m.unread>0 ? C.textSoft : C.muted }} numberOfLines={1}>
                {m.text}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// INVOICES SCREEN
const InvoicesScreen = () => {
  const [filter, setFilter] = useState('All');
  const filters = ['All','Paid','Pending','Overdue','Draft'];
  const filtered = INVOICES_DATA.filter(i => filter === 'All' || i.status === filter);
  const totalRevenue = INVOICES_DATA.filter(i => i.status==='Paid').reduce((a,i) => a+i.amount, 0);
  const totalPending = INVOICES_DATA.filter(i => i.status==='Pending').reduce((a,i) => a+i.amount, 0);
  const totalOverdue = INVOICES_DATA.filter(i => i.status==='Overdue').reduce((a,i) => a+i.amount, 0);

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom:30 }}>
      <View style={{ flexDirection:'row', marginBottom:20, marginHorizontal:-4 }}>
        <StatTile value={'£'+(totalRevenue/1000).toFixed(0)+'k'} label="Collected" color={C.green} />
        <StatTile value={'£'+(totalPending/1000).toFixed(0)+'k'} label="Pending" color={C.orange} />
        <StatTile value={'£'+(totalOverdue/1000).toFixed(0)+'k'} label="Overdue" color={C.red} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:16 }}>
        {filters.map(f => {
          const sc = f==='Paid'?C.green : f==='Pending'?C.orange : f==='Overdue'?C.red : f==='Draft'?C.muted : C.accent;
          return (
            <TouchableOpacity key={f} onPress={() => setFilter(f)} style={{
              paddingHorizontal:16, paddingVertical:8, borderRadius:50, marginRight:8,
              backgroundColor: filter===f ? sc+'22' : C.card,
              borderWidth:1, borderColor: filter===f ? sc : C.border,
            }}>
              <Text style={{ color: filter===f ? sc : C.muted, fontWeight:'600', fontSize:12 }}>{f}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {filtered.map(inv => {
        const sc = inv.status==='Paid'?C.green : inv.status==='Pending'?C.orange : inv.status==='Overdue'?C.red : C.muted;
        return (
          <Card key={inv.id} style={{ marginBottom:12 }}>
            <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
              <View style={{ flex:1 }}>
                <Text style={{ fontSize:12, color:C.muted, fontWeight:'600', letterSpacing:0.5 }}>{inv.id}</Text>
                <Text style={{ fontSize:15, fontWeight:'700', color:C.text, marginTop:2 }}>{inv.project}</Text>
                <Text style={{ fontSize:12, color:C.muted, marginTop:2 }}>{inv.client}</Text>
              </View>
              <View style={{ alignItems:'flex-end' }}>
                <Text style={{ fontSize:20, fontWeight:'800', color:C.text }}>£{inv.amount.toLocaleString()}</Text>
                <Badge label={inv.status} color={sc} />
              </View>
            </View>
            <Divider />
            <View style={{ flexDirection:'row', justifyContent:'space-between' }}>
              <Text style={{ fontSize:11, color:C.dim }}>Issued: {inv.issued}</Text>
              <Text style={{ fontSize:11, color: inv.status==='Overdue' ? C.red : C.dim }}>
                {inv.status==='Paid' ? '✓ Paid' : 'Due: ' + inv.due}
              </Text>
            </View>
            {inv.status !== 'Paid' && (
              <View style={{ flexDirection:'row', marginTop:12 }}>
                <TouchableOpacity style={{
                  flex:1, backgroundColor:C.accent, padding:10, borderRadius:12, alignItems:'center', marginRight:8,
                }}>
                  <Text style={{ color:'#fff', fontWeight:'700', fontSize:12 }}>
                    {inv.status==='Draft' ? 'Send Invoice' : 'Send Reminder'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity style={{
                  flex:1, backgroundColor:C.surface, padding:10, borderRadius:12, alignItems:'center',
                  borderWidth:1, borderColor:C.border,
                }}>
                  <Text style={{ color:C.textSoft, fontWeight:'700', fontSize:12 }}>View PDF</Text>
                </TouchableOpacity>
              </View>
            )}
          </Card>
        );
      })}
    </ScrollView>
  );
};

// TIME TRACKING SECTION
const TimeTrackingSection = ({ onBack }) => {
  const [clockedIn, setClockedIn] = useState(false);
  const [clockTime, setClockTime] = useState(0);
  const [selectedProject, setSelectedProject] = useState(PROJECTS_DATA[0].name);
  const timerRef = useRef(null);
  const timeLog = [
    { date:'Today', project:'Nike Campaign', hours:4.5, rate:850 },
    { date:'Yesterday', project:'BBC Docs', hours:8, rate:850 },
    { date:'Mar 5', project:'Adidas Shoot', hours:10, rate:850 },
    { date:'Mar 4', project:'Nike Campaign', hours:7, rate:850 },
  ];
  useEffect(() => {
    if (clockedIn) timerRef.current = setInterval(() => setClockTime(t => t+1), 1000);
    else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [clockedIn]);
  const fmt = s => {
    const h = Math.floor(s/3600).toString().padStart(2,'0');
    const m = Math.floor((s%3600)/60).toString().padStart(2,'0');
    const sec = (s%60).toString().padStart(2,'0');
    return h+':'+m+':'+sec;
  };
  const weekTotal = timeLog.reduce((a,l) => a+l.hours, 0);
  const weekEarnings = timeLog.reduce((a,l) => a+(l.hours*l.rate), 0);
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom:40 }}>
      <TouchableOpacity onPress={onBack} style={{ flexDirection:'row', alignItems:'center', marginBottom:20 }}>
        <Text style={{ color:C.accent, fontSize:16 }}>← </Text>
        <Text style={{ color:C.accent, fontWeight:'600' }}>Back</Text>
      </TouchableOpacity>
      <Card style={{ alignItems:'center', paddingVertical:28, marginBottom:16, borderColor: clockedIn ? C.green+'50' : C.border }}>
        <Text style={{ fontSize:44, fontWeight:'800', color: clockedIn ? C.green : C.text, letterSpacing:-2 }}>
          {fmt(clockTime)}
        </Text>
        <Text style={{ fontSize:12, color:C.muted, marginTop:8, marginBottom:20 }}>
          {clockedIn ? 'On: ' + selectedProject : 'Select a project and start'}
        </Text>
        {!clockedIn && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom:16 }}>
            {PROJECTS_DATA.slice(0,4).map(p => (
              <TouchableOpacity key={p.id} onPress={() => setSelectedProject(p.name)} style={{
                paddingHorizontal:14, paddingVertical:8, borderRadius:50, marginHorizontal:4,
                backgroundColor: selectedProject===p.name ? C.accent : C.surface,
                borderWidth:1, borderColor: selectedProject===p.name ? C.accent : C.border,
              }}>
                <Text style={{ color: selectedProject===p.name ? '#fff' : C.muted, fontSize:12, fontWeight:'600' }} numberOfLines={1}>
                  {p.name.split(' ').slice(0,2).join(' ')}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        )}
        <TouchableOpacity onPress={() => { setClockedIn(!clockedIn); if(clockedIn) setClockTime(0); }} style={{
          paddingHorizontal:40, paddingVertical:14, borderRadius:50,
          backgroundColor: clockedIn ? C.red : C.green,
        }}>
          <Text style={{ color:'#fff', fontWeight:'800', fontSize:16 }}>
            {clockedIn ? '■ Stop' : '▶ Start'}
          </Text>
        </TouchableOpacity>
      </Card>
      <View style={{ flexDirection:'row', marginBottom:20, marginHorizontal:-4 }}>
        <StatTile value={weekTotal + 'h'} label="This Week" color={C.accent} />
        <StatTile value={'£'+(weekEarnings/1000).toFixed(1)+'k'} label="Earned" color={C.gold} />
      </View>
      <SectionRow title="Time Log" />
      {timeLog.map((log, i) => (
        <Card key={i} style={{ marginBottom:8 }}>
          <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
            <View>
              <Text style={{ fontSize:13, fontWeight:'700', color:C.text }}>{log.project}</Text>
              <Text style={{ fontSize:11, color:C.muted, marginTop:2 }}>{log.date}</Text>
            </View>
            <View style={{ alignItems:'flex-end' }}>
              <Text style={{ fontSize:14, fontWeight:'700', color:C.accent }}>{log.hours}h</Text>
              <Text style={{ fontSize:11, color:C.gold }}>£{(log.hours*log.rate).toLocaleString()}</Text>
            </View>
          </View>
        </Card>
      ))}
    </ScrollView>
  );
};

// REPORTS SECTION
const ReportsSection = ({ onBack }) => {
  const bars = [
    { label:'Jan', value:0.6, amount:'18k' },
    { label:'Feb', value:0.8, amount:'24k' },
    { label:'Mar', value:0.95, amount:'28k' },
    { label:'Apr', value:0.5, amount:'15k', projected:true },
    { label:'May', value:0.3, amount:'9k', projected:true },
  ];
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom:40 }}>
      <TouchableOpacity onPress={onBack} style={{ flexDirection:'row', alignItems:'center', marginBottom:20 }}>
        <Text style={{ color:C.accent, fontSize:16 }}>← </Text>
        <Text style={{ color:C.accent, fontWeight:'600' }}>Back</Text>
      </TouchableOpacity>
      <View style={{ flexDirection:'row', marginBottom:20, marginHorizontal:-4 }}>
        <StatTile value="£92k" label="YTD Revenue" color={C.green} />
        <StatTile value="£68k" label="YTD Costs" color={C.red} />
        <StatTile value="£24k" label="Net Profit" color={C.gold} />
      </View>
      <Card style={{ marginBottom:20 }}>
        <Text style={{ fontSize:14, fontWeight:'700', color:C.text, marginBottom:16 }}>Monthly Revenue</Text>
        <View style={{ flexDirection:'row', alignItems:'flex-end', height:100, justifyContent:'space-between' }}>
          {bars.map((b, i) => (
            <View key={i} style={{ alignItems:'center', flex:1 }}>
              <Text style={{ fontSize:9, color:C.muted, marginBottom:4 }}>£{b.amount}</Text>
              <View style={{
                width:'60%', height:b.value*80,
                backgroundColor: b.projected ? C.accent+'50' : C.accent,
                borderRadius:4,
              }} />
              <Text style={{ fontSize:10, color: b.projected ? C.dim : C.muted, marginTop:6 }}>{b.label}</Text>
            </View>
          ))}
        </View>
      </Card>
      <SectionRow title="Top Projects by Revenue" />
      {PROJECTS_DATA.map((p, i) => (
        <View key={p.id} style={{ flexDirection:'row', alignItems:'center', paddingVertical:12, borderBottomWidth:1, borderBottomColor:C.border }}>
          <Text style={{ fontSize:14, color:C.dim, fontWeight:'700', width:24 }}>{i+1}</Text>
          <View style={{ flex:1, marginLeft:8 }}>
            <Text style={{ fontSize:13, fontWeight:'700', color:C.text }}>{p.name}</Text>
            <ProgressBar progress={p.progress} color={p.statusColor} height={3} />
          </View>
          <Text style={{ fontSize:13, color:C.gold, fontWeight:'700', marginLeft:12 }}>
            £{(p.spent/1000).toFixed(0)}k
          </Text>
        </View>
      ))}
    </ScrollView>
  );
};

// MORE SCREEN
const MoreScreen = ({ setTab }) => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [section, setSection] = useState('main');

  const menuItems = [
    { icon:'◷', label:'Messages', color:C.teal, onPress:() => setTab('Messages') },
    { icon:'◎', label:'Invoices & Billing', color:C.gold, onPress:() => setSection('invoices') },
    { icon:'◈', label:'Time Tracking', color:C.green, onPress:() => setSection('time') },
    { icon:'◉', label:'Reports & Analytics', color:C.purple, onPress:() => setSection('reports') },
    { icon:'⚙', label:'Settings', color:C.accent, onPress:() => setSection('settings') },
  ];

  if (section === 'invoices') {
    return (
      <View style={{ flex:1 }}>
        <TouchableOpacity onPress={() => setSection('main')} style={{ flexDirection:'row', alignItems:'center', marginBottom:20 }}>
          <Text style={{ color:C.accent, fontSize:16 }}>← </Text>
          <Text style={{ color:C.accent, fontWeight:'600' }}>Back</Text>
        </TouchableOpacity>
        <InvoicesScreen />
      </View>
    );
  }
  if (section === 'time') return <TimeTrackingSection onBack={() => setSection('main')} />;
  if (section === 'reports') return <ReportsSection onBack={() => setSection('main')} />;

  if (section === 'settings') {
    const { Switch } = require('react-native');
    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom:40 }}>
        <TouchableOpacity onPress={() => setSection('main')} style={{ flexDirection:'row', alignItems:'center', marginBottom:20 }}>
          <Text style={{ color:C.accent, fontSize:16 }}>← </Text>
          <Text style={{ color:C.accent, fontWeight:'600' }}>Back</Text>
        </TouchableOpacity>
        <Card style={{ marginBottom:20, alignItems:'center', paddingVertical:24 }}>
          <Avatar name="A" size={72} color={C.accent} />
          <Text style={{ fontSize:20, fontWeight:'800', color:C.text, marginTop:14 }}>Alex Thompson</Text>
          <Text style={{ fontSize:13, color:C.muted, marginTop:4 }}>Production Manager · PRO</Text>
          <View style={{ flexDirection:'row', marginTop:14 }}>
            <View style={{ backgroundColor:C.accentSoft, paddingHorizontal:14, paddingVertical:6, borderRadius:20 }}>
              <Text style={{ color:C.accent, fontWeight:'700', fontSize:12 }}>PRO PLAN</Text>
            </View>
          </View>
        </Card>
        <Text style={{ fontSize:12, color:C.muted, fontWeight:'700', letterSpacing:1, marginBottom:10, marginLeft:4 }}>PREFERENCES</Text>
        <Card style={{ marginBottom:16 }}>
          {[
            { label:'Push Notifications', value:notifications, setter:setNotifications },
            { label:'Dark Mode', value:darkMode, setter:setDarkMode },
            { label:'Biometric Login', value:biometric, setter:setBiometric },
          ].map((item, i) => (
            <View key={item.label}>
              {i > 0 && <Divider />}
              <View style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical:4 }}>
                <Text style={{ fontSize:14, color:C.textSoft, fontWeight:'500' }}>{item.label}</Text>
                <Switch value={item.value} onValueChange={item.setter} trackColor={{ false:C.border, true:C.accent }} thumbColor={'#fff'} />
              </View>
            </View>
          ))}
        </Card>
        <Text style={{ fontSize:12, color:C.muted, fontWeight:'700', letterSpacing:1, marginBottom:10, marginLeft:4 }}>ACCOUNT</Text>
        <Card style={{ marginBottom:16 }}>
          {['Edit Profile','Change Password','Manage Subscription','Privacy & Data'].map((item, i) => (
            <View key={item}>
              {i > 0 && <Divider />}
              <TouchableOpacity style={{ flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingVertical:6 }}>
                <Text style={{ fontSize:14, color:C.textSoft, fontWeight:'500' }}>{item}</Text>
                <Text style={{ color:C.muted, fontSize:16 }}>›</Text>
              </TouchableOpacity>
            </View>
          ))}
        </Card>
        <TouchableOpacity style={{ backgroundColor:C.redSoft, padding:16, borderRadius:16, alignItems:'center', borderWidth:1, borderColor:C.red+'40' }}>
          <Text style={{ color:C.red, fontWeight:'700' }}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom:40 }}>
      <Card style={{ flexDirection:'row', alignItems:'center', marginBottom:24 }}>
        <Avatar name="A" size={52} color={C.accent} />
        <View style={{ marginLeft:14, flex:1 }}>
          <Text style={{ fontSize:16, fontWeight:'800', color:C.text }}>Alex Thompson</Text>
          <Text style={{ fontSize:12, color:C.muted }}>Production Manager</Text>
        </View>
        <View style={{ backgroundColor:C.accentSoft, paddingHorizontal:12, paddingVertical:5, borderRadius:20 }}>
          <Text style={{ color:C.accent, fontWeight:'700', fontSize:11 }}>PRO</Text>
        </View>
      </Card>
      {menuItems.map((item, i) => (
        <TouchableOpacity key={item.label} onPress={item.onPress} style={{
          flexDirection:'row', alignItems:'center', paddingVertical:16,
          borderBottomWidth: i < menuItems.length-1 ? 1 : 0, borderBottomColor:C.border,
        }}>
          <View style={{
            width:40, height:40, borderRadius:12,
            backgroundColor:item.color+'18', alignItems:'center', justifyContent:'center',
            borderWidth:1, borderColor:item.color+'30', marginRight:14,
          }}>
            <Text style={{ fontSize:16, color:item.color }}>{item.icon}</Text>
          </View>
          <Text style={{ fontSize:14, color:C.textSoft, fontWeight:'600', flex:1 }}>{item.label}</Text>
          <Text style={{ color:C.dim, fontSize:16 }}>›</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// ─── TAB BAR ─────────────────────────────────────────────────────────────────
const TabBar = ({ tabs, activeTab, setTab }) => (
  <View style={{
    flexDirection:'row', backgroundColor:C.surface,
    borderTopWidth:1, borderTopColor:C.border,
    paddingBottom:Platform.OS==='ios'?20:8, paddingTop:8,
  }}>
    {tabs.map(tab => {
      const isActive = activeTab === tab.key;
      const icons = { Home:'⌂', Projects:'◈', Crew:'◉', Schedule:'▦', More:'···' };
      return (
        <TouchableOpacity key={tab.key} onPress={() => setTab(tab.key)}
          style={{ flex:1, alignItems:'center', justifyContent:'center', paddingVertical:4 }}>
          <View style={{
            width:32, height:32, borderRadius:10,
            backgroundColor: isActive ? C.accent+'22' : 'transparent',
            alignItems:'center', justifyContent:'center', marginBottom:4,
          }}>
            <Text style={{ fontSize:16, color: isActive ? C.accent : C.dim }}>{icons[tab.key] || '·'}</Text>
          </View>
          <Text style={{ fontSize:10, fontWeight: isActive ? '700' : '500', color: isActive ? C.accent : C.dim, letterSpacing:0.2 }}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const tabs = [
    { key:'Home', label:'Home' },
    { key:'Projects', label:'Projects' },
    { key:'Crew', label:'Crew' },
    { key:'Schedule', label:'Schedule' },
    { key:'More', label:'More' },
  ];
  const screenTitles = { Home:null, Projects:'Projects', Crew:'Crew Roster', Schedule:'Schedule', Messages:'Messages', More:'More' };

  const renderScreen = () => {
    switch(activeTab) {
      case 'Home': return <HomeScreen setTab={setActiveTab} />;
      case 'Projects': return <ProjectsScreen />;
      case 'Crew': return <CrewScreen />;
      case 'Schedule': return <ScheduleScreen />;
      case 'Messages': return <MessagesScreen />;
      case 'More': return <MoreScreen setTab={setActiveTab} />;
      default: return <HomeScreen setTab={setActiveTab} />;
    }
  };

  const title = screenTitles[activeTab];

  return (
    <SafeAreaView style={{ flex:1, backgroundColor:C.bg }}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      {title && (
        <View style={{
          paddingHorizontal:20, paddingTop:16, paddingBottom:12,
          borderBottomWidth:1, borderBottomColor:C.border,
          flexDirection:'row', alignItems:'center', justifyContent:'space-between',
        }}>
          <Text style={{ fontSize:20, fontWeight:'800', color:C.text, letterSpacing:-0.5 }}>{title}</Text>
          <TouchableOpacity style={{ paddingHorizontal:14, paddingVertical:7, borderRadius:50, backgroundColor:C.accent }}>
            <Text style={{ color:'#fff', fontWeight:'700', fontSize:12 }}>+ New</Text>
          </TouchableOpacity>
        </View>
      )}
      <View style={{ flex:1, paddingHorizontal:20, paddingTop:16 }}>
        {renderScreen()}
      </View>
      {activeTab !== 'Messages' && <TabBar tabs={tabs} activeTab={activeTab} setTab={setActiveTab} />}
    </SafeAreaView>
  );
}
