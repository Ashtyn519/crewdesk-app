
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  FlatList, Modal, Alert, Animated, KeyboardAvoidingView,
  Platform, StatusBar, SafeAreaView, Switch
} from 'react-native';

const C = {
  bg:'#04080F', surface:'#0A1020', card:'#0F1A2E', cardHigh:'#142035',
  border:'#1E2D45', borderFaint:'#152030', text:'#F0F4FF', textSub:'#8896B0',
  textMuted:'#4A5A74', gold:'#F59E0B', goldDim:'#7C4F0A', teal:'#06B6D4',
  tealDim:'#0A4A5A', purple:'#A78BFA', purpleDim:'#3D2B6A', green:'#10B981',
  greenDim:'#0A3D28', red:'#EF4444', redDim:'#4A1515', blue:'#3B82F6',
  blueDim:'#152855', orange:'#F97316', orangeDim:'#4A2508', pink:'#EC4899',
  pinkDim:'#4A1535',
};
const FONT = { xs:11, sm:12, base:14, md:15, lg:17, xl:20, xxl:24, xxxl:30 };
const R = { sm:8, md:12, lg:16, xl:20, xxl:28, full:999 };
const S = { hairline:1, thin:1.5, base:2 };

const uid = () => Math.random().toString(36).slice(2, 10);
const fmtCurrency = (n) => {
  if (n >= 1000000) return '£' + (n/1000000).toFixed(2) + 'M';
  if (n >= 1000) return '£' + (n/1000).toFixed(1) + 'k';
  return '£' + n.toFixed(2);
};
const today = () => new Date().toISOString().slice(0,10);
const addDays = (d, n) => {
  const dt = new Date(d); dt.setDate(dt.getDate()+n);
  return dt.toISOString().slice(0,10);
};
const shortDate = (d) => {
  const dt = new Date(d);
  return dt.toLocaleDateString('en-GB',{day:'numeric',month:'short'});
};
const timeAgo = (ts) => {
  const diff = Date.now() - ts;
  if (diff < 60000) return 'just now';
  if (diff < 3600000) return Math.floor(diff/60000) + 'm ago';
  if (diff < 86400000) return Math.floor(diff/3600000) + 'h ago';
  return Math.floor(diff/86400000) + 'd ago';
};

const ROLES = ['Director of Photography','Gaffer','Key Grip','Sound Mixer','Script Supervisor','1st AD','Art Director','Costume Designer','Make-up Artist','VFX Supervisor','Line Producer','Camera Operator','Boom Operator','Lighting Tech','Production Runner'];
const NAMES = ['Alex Morgan','Jamie Liu','Sam Okafor','Priya Sharma','Tom Walsh','Elena Petrov','Marcus Dale','Sofia Reyes','Leon Hart','Nadia Kim','Rhys Cooper','Aisha Brown','Finn OBrien','Yuki Tanaka','Dev Patel'];
const PROJECT_NAMES = ['Apex Series S2','Quantum Short Film','Brand Ident 2026','Docs: Ocean Deep','Music Video: NOVA','Indie Feature: Echo','Campaign: Vitals','Pilot: Midnight Run'];
const DEPARTMENTS = ['Camera','Lighting','Sound','Art','Production','VFX','Costume','Make-up'];

const T = today();

const INIT_CREW = NAMES.map((name,i) => ({
  id:uid(), name, role:ROLES[i%ROLES.length], dept:DEPARTMENTS[i%DEPARTMENTS.length],
  rate:250+(i*47)%400, email:name.toLowerCase().replace(/[ ]/g,'.')+('@crewdesk.io'),
  phone:'+44 7'+String(700000000+i*13579421).slice(0,9),
  status:i%5===0?'unavailable':(i%3===0?'booked':'available'),
  skills:[ROLES[i%ROLES.length],ROLES[(i+2)%ROLES.length]],
  rating:(3.5+(i*0.3)%1.5).toFixed(1), completedJobs:12+(i*7)%88,
  bio:'Award-winning '+ROLES[i%ROLES.length].toLowerCase()+' with '+(5+(i%15))+' years of industry experience.',
}));

const INIT_PROJECTS = PROJECT_NAMES.map((name,i) => ({
  id:uid(), name,
  client:['BBC Studios','Netflix','ITV','Channel 4','Sky Arts','Amazon Prime','Apple TV+','Discovery'][i],
  status:['active','active','active','planning','completed','active','planning','completed'][i],
  budget:(45000+i*18750), spent:(20000+i*9200),
  start:addDays(T,-30+i*8), end:addDays(T,30+i*12),
  dept:DEPARTMENTS[i%DEPARTMENTS.length],
  crew:INIT_CREW.slice(i,i+3).map(c=>c.id),
  priority:['high','high','medium','low','low','high','medium','low'][i],
  progress:[75,40,90,20,100,60,15,100][i],
}));

const INIT_SHIFTS = Array.from({length:18},(_,i) => ({
  id:uid(), crewId:INIT_CREW[i%INIT_CREW.length].id,
  projectId:INIT_PROJECTS[i%INIT_PROJECTS.length].id,
  date:addDays(T,-3+(i%9)), start:['07:00','08:00','09:00','10:00','14:00'][i%5],
  end:['15:00','16:00','17:00','18:00','22:00'][i%5],
  role:ROLES[i%ROLES.length],
  location:['Pinewood Studios','Shepperton','Location: Liverpool','Studio 4 - Soho','Remote/VFX'][i%5],
  status:i<6?'confirmed':(i<12?'pending':'completed'), notes:'',
}));

const INIT_INVOICES = Array.from({length:12},(_,i) => ({
  id:uid(), number:'INV-2026-'+String(1000+i),
  client:INIT_PROJECTS[i%INIT_PROJECTS.length].client,
  projectId:INIT_PROJECTS[i%INIT_PROJECTS.length].id,
  amount:3500+i*1250,
  status:['paid','paid','sent','sent','draft','overdue','paid','sent','draft','overdue','paid','sent'][i],
  issued:addDays(T,-20+i*3), due:addDays(T,-5+i*5),
  lineItems:[
    {id:uid(),desc:'Production services - '+DEPARTMENTS[i%DEPARTMENTS.length],qty:1,rate:2000+i*800,total:2000+i*800},
    {id:uid(),desc:'Equipment hire',qty:3,rate:250,total:750},
    {id:uid(),desc:'Travel and expenses',qty:1,rate:350,total:350},
  ],
  attachments:i%3===0?['brief_'+i+'.pdf']:[], notes:'', vatRate:20,
}));

const INIT_THREADS = [
  { id:uid(), subject:'Apex S2 - Pre-Production Call', participants:['Alex Morgan','Jamie Liu','Sam Okafor'], colour:C.teal, avatar:'A', unread:2,
    messages:[
      {id:uid(),sender:'Jamie Liu',text:'Morning all! Pre-production call confirmed for Thursday at 10am.',ts:Date.now()-7200000,isMe:false},
      {id:uid(),sender:'Sam Okafor',text:'Perfect. I will have the shot list ready by Wednesday.',ts:Date.now()-3600000,isMe:false},
      {id:uid(),sender:'Me',text:'Great. I will sort the location permits.',ts:Date.now()-1800000,isMe:true},
    ]
  },
  { id:uid(), subject:'Invoice INV-2026-1002 - Approval', participants:['Priya Sharma','Finance'], colour:C.green, avatar:'P', unread:1,
    messages:[
      {id:uid(),sender:'Priya Sharma',text:'Hi, can you approve INV-2026-1002 before the payment run on Friday?',ts:Date.now()-86400000,isMe:false},
      {id:uid(),sender:'Me',text:'On it - checking the line items now.',ts:Date.now()-82800000,isMe:true},
    ]
  },
  { id:uid(), subject:'Quantum Short - Location Scouting', participants:['Tom Walsh','Elena Petrov'], colour:C.purple, avatar:'T', unread:0,
    messages:[
      {id:uid(),sender:'Tom Walsh',text:'Found two great locations in East London. Sending the recce report shortly.',ts:Date.now()-172800000,isMe:false},
      {id:uid(),sender:'Me',text:'Amazing - looking forward to seeing them!',ts:Date.now()-169200000,isMe:true},
      {id:uid(),sender:'Elena Petrov',text:'The warehouse on Hackney Wick looks stunning for the night shoot.',ts:Date.now()-165600000,isMe:false},
    ]
  },
  { id:uid(), subject:'Brand Ident - VFX Review', participants:['Marcus Dale'], colour:C.orange, avatar:'M', unread:3,
    messages:[
      {id:uid(),sender:'Marcus Dale',text:'VFX pass 3 is ready for review. Colour grade feedback would help.',ts:Date.now()-259200000,isMe:false},
      {id:uid(),sender:'Me',text:'Will review today and send notes.',ts:Date.now()-255600000,isMe:true},
      {id:uid(),sender:'Marcus Dale',text:'Thanks. Also - the client wants an extra scene. Scope change inbound.',ts:Date.now()-252000000,isMe:false},
    ]
  },
  { id:uid(), subject:'Crew Availability - August Block', participants:['Sofia Reyes','Leon Hart','Nadia Kim'], colour:C.pink, avatar:'S', unread:0,
    messages:[
      {id:uid(),sender:'Sofia Reyes',text:'Can everyone confirm availability for the August block? 4-18 Aug.',ts:Date.now()-345600000,isMe:false},
      {id:uid(),sender:'Leon Hart',text:'Available all of August.',ts:Date.now()-342000000,isMe:false},
      {id:uid(),sender:'Me',text:'I am confirmed for the full block.',ts:Date.now()-338400000,isMe:true},
    ]
  },
];

const INIT_REPORTS = {
  revenueByMonth:[
    {month:'Sep',rev:42000,cost:28000},{month:'Oct',rev:58000,cost:35000},
    {month:'Nov',rev:49000,cost:31000},{month:'Dec',rev:71000,cost:44000},
    {month:'Jan',rev:63000,cost:39000},{month:'Feb',rev:88000,cost:52000},
  ],
  topClients:[
    {name:'Netflix',rev:145000,projects:3},{name:'BBC Studios',rev:98000,projects:4},
    {name:'Sky Arts',rev:67000,projects:2},{name:'ITV',rev:54000,projects:3},
    {name:'Amazon Prime',rev:41000,projects:2},
  ],
  crewUtilisation:[
    {dept:'Camera',util:87},{dept:'Lighting',util:72},{dept:'Sound',util:91},
    {dept:'Art',util:65},{dept:'Production',util:80},{dept:'VFX',util:58},
  ],
};


function useStore() {
  const [crew, setCrew] = useState(INIT_CREW);
  const [projects, setProjects] = useState(INIT_PROJECTS);
  const [shifts, setShifts] = useState(INIT_SHIFTS);
  const [invoices, setInvoices] = useState(INIT_INVOICES);
  const [threads, setThreads] = useState(INIT_THREADS);
  const [myProfile] = useState({
    name:'Jordan Blake', role:'Line Producer', company:'CrewDesk Productions',
    email:'jordan.blake@crewdesk.io', phone:'+44 7900 123456',
    bio:'Award-winning line producer with 12 years of experience across drama, documentary and commercial production.',
    skills:['Budget Management','Crew Coordination','Risk Assessment','Scheduling','Vendor Relations'],
    rate:650, available:true, completedJobs:94, rating:4.9,
    earnings:{ thisMonth:8450, lastMonth:12200, ytd:67800 },
  });
  const addCrew = (c) => setCrew(p => [{ id:uid(), ...c, status:'available', completedJobs:0 }, ...p]);
  const editCrew = (id, upd) => setCrew(p => p.map(c => c.id===id ? {...c,...upd} : c));
  const deleteCrew = (id) => setCrew(p => p.filter(c => c.id!==id));
  const addProject = (p) => setProjects(pr => [{ id:uid(), crew:[], progress:0, spent:0, ...p }, ...pr]);
  const editProject = (id, upd) => setProjects(p => p.map(pr => pr.id===id ? {...pr,...upd} : pr));
  const deleteProject = (id) => setProjects(p => p.filter(pr => pr.id!==id));
  const addShift = (s) => setShifts(p => [{ id:uid(), status:'pending', notes:'', ...s }, ...p]);
  const editShift = (id, upd) => setShifts(p => p.map(s => s.id===id ? {...s,...upd} : s));
  const deleteShift = (id) => setShifts(p => p.filter(s => s.id!==id));
  const addInvoice = (inv) => setInvoices(p => [{ id:uid(), attachments:[], notes:'', vatRate:20, lineItems:[], ...inv }, ...p]);
  const editInvoice = (id, upd) => setInvoices(p => p.map(inv => inv.id===id ? {...inv,...upd} : inv));
  const deleteInvoice = (id) => setInvoices(p => p.filter(inv => inv.id!==id));
  const sendMessage = (threadId, text) => {
    setThreads(p => p.map(t => t.id===threadId ? {
      ...t, messages:[...t.messages, {id:uid(),sender:'Me',text,ts:Date.now(),isMe:true}], unread:0,
    } : t));
  };
  const addThread = (thread) => setThreads(p => [{ id:uid(), messages:[], unread:0, ...thread }, ...p]);
  const deleteThread = (id) => setThreads(p => p.filter(t => t.id!==id));
  const markRead = (id) => setThreads(p => p.map(t => t.id===id ? {...t, unread:0} : t));
  return {
    crew, projects, shifts, invoices, threads, myProfile,
    addCrew, editCrew, deleteCrew, addProject, editProject, deleteProject,
    addShift, editShift, deleteShift, addInvoice, editInvoice, deleteInvoice,
    sendMessage, addThread, deleteThread, markRead,
  };
}

function PressBtn({ onPress, style, children }) {
  const sc = useRef(new Animated.Value(1)).current;
  const onIn = () => Animated.spring(sc,{toValue:0.95,useNativeDriver:true,speed:40}).start();
  const onOut = () => Animated.spring(sc,{toValue:1,useNativeDriver:true,speed:30}).start();
  return (
    <TouchableOpacity activeOpacity={1} onPress={onPress} onPressIn={onIn} onPressOut={onOut}>
      <Animated.View style={[{transform:[{scale:sc}]},style]}>{children}</Animated.View>
    </TouchableOpacity>
  );
}

function Chip({ label, colour, small }) {
  return (
    <View style={{ backgroundColor:colour+'22', borderRadius:R.full, paddingHorizontal:small?8:12, paddingVertical:small?3:5, borderWidth:S.hairline, borderColor:colour+'44' }}>
      <Text style={{ color:colour, fontSize:small?FONT.xs:FONT.sm, fontWeight:'600', letterSpacing:0.3 }}>{label}</Text>
    </View>
  );
}

function StatusChip({ status }) {
  const map = {
    active:[C.teal,'Active'], planning:[C.blue,'Planning'], completed:[C.green,'Completed'],
    available:[C.green,'Available'], booked:[C.gold,'Booked'], unavailable:[C.red,'Unavailable'],
    paid:[C.green,'Paid'], sent:[C.teal,'Sent'], draft:[C.textSub,'Draft'], overdue:[C.red,'Overdue'],
    confirmed:[C.teal,'Confirmed'], pending:[C.gold,'Pending'],
    high:[C.red,'High'], medium:[C.gold,'Medium'], low:[C.blue,'Low'],
  };
  const [col,lbl] = map[status] || [C.textSub,status];
  return <Chip label={lbl} colour={col} small />;
}

function Card({ children, style, onPress }) {
  const content = (
    <View style={[{backgroundColor:C.card,borderRadius:R.lg,padding:16,borderWidth:S.hairline,borderColor:C.border},style]}>
      {children}
    </View>
  );
  if (onPress) return <PressBtn onPress={onPress} style={{marginBottom:10}}>{content}</PressBtn>;
  return <View style={{marginBottom:10}}>{content}</View>;
}

function KPICard({ label, value, sub, colour, icon }) {
  return (
    <View style={{ flex:1, backgroundColor:C.card, borderRadius:R.lg, padding:16, borderWidth:S.hairline, borderColor:C.border, marginHorizontal:4 }}>
      <View style={{ width:36, height:36, borderRadius:R.md, backgroundColor:colour+'22', alignItems:'center', justifyContent:'center', marginBottom:10 }}>
        <Text style={{ fontSize:FONT.lg }}>{icon}</Text>
      </View>
      <Text style={{ color:colour, fontSize:FONT.xxl, fontWeight:'800', letterSpacing:-0.5 }}>{value}</Text>
      <Text style={{ color:C.text, fontSize:FONT.sm, fontWeight:'600', marginTop:2 }}>{label}</Text>
      {sub ? <Text style={{ color:C.textSub, fontSize:FONT.xs, marginTop:2 }}>{sub}</Text> : null}
    </View>
  );
}

function SectionHeader({ title, action, onAction }) {
  return (
    <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:12, marginTop:8 }}>
      <Text style={{ color:C.text, fontSize:FONT.md, fontWeight:'700', letterSpacing:0.2 }}>{title}</Text>
      {action ? <TouchableOpacity onPress={onAction}><Text style={{ color:C.gold, fontSize:FONT.sm, fontWeight:'600' }}>{action}</Text></TouchableOpacity> : null}
    </View>
  );
}

function Avatar({ name, colour, size=40 }) {
  const initials = name ? name.split(' ').map(w=>w[0]).slice(0,2).join('') : '?';
  return (
    <View style={{ width:size, height:size, borderRadius:size/2, backgroundColor:(colour||C.gold)+'33', alignItems:'center', justifyContent:'center', borderWidth:1.5, borderColor:(colour||C.gold)+'66' }}>
      <Text style={{ color:colour||C.gold, fontSize:size*0.36, fontWeight:'700' }}>{initials}</Text>
    </View>
  );
}

function EmptyState({ icon, title, sub }) {
  return (
    <View style={{ flex:1, alignItems:'center', justifyContent:'center', padding:40 }}>
      <Text style={{ fontSize:48, marginBottom:16 }}>{icon}</Text>
      <Text style={{ color:C.text, fontSize:FONT.lg, fontWeight:'700', textAlign:'center', marginBottom:6 }}>{title}</Text>
      <Text style={{ color:C.textSub, fontSize:FONT.base, textAlign:'center', lineHeight:22 }}>{sub}</Text>
    </View>
  );
}

function ModalSheet({ visible, onClose, title, children }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex:1, backgroundColor:'#00000088', justifyContent:'flex-end' }}>
        <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'}>
          <View style={{ backgroundColor:C.surface, borderTopLeftRadius:R.xxl, borderTopRightRadius:R.xxl, maxHeight:'90%' }}>
            <View style={{ alignItems:'center', paddingVertical:12 }}>
              <View style={{ width:40, height:4, borderRadius:2, backgroundColor:C.border }} />
            </View>
            <View style={{ flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:20, paddingBottom:16, borderBottomWidth:S.hairline, borderColor:C.border }}>
              <Text style={{ color:C.text, fontSize:FONT.lg, fontWeight:'700' }}>{title}</Text>
              <TouchableOpacity onPress={onClose} style={{ width:32, height:32, borderRadius:R.full, backgroundColor:C.card, alignItems:'center', justifyContent:'center' }}>
                <Text style={{ color:C.textSub, fontSize:FONT.base, fontWeight:'600' }}>x</Text>
              </TouchableOpacity>
            </View>
            <ScrollView style={{ padding:20 }} keyboardShouldPersistTaps="handled">{children}</ScrollView>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

function FormInput({ label, value, onChangeText, placeholder, multiline, keyboardType }) {
  return (
    <View style={{ marginBottom:16 }}>
      <Text style={{ color:C.textSub, fontSize:FONT.sm, fontWeight:'600', marginBottom:6, letterSpacing:0.4, textTransform:'uppercase' }}>{label}</Text>
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={C.textMuted}
        multiline={multiline} keyboardType={keyboardType||'default'}
        style={{ backgroundColor:C.card, borderRadius:R.md, padding:12, color:C.text, fontSize:FONT.base, borderWidth:S.hairline, borderColor:C.border, minHeight:multiline?80:44 }}
      />
    </View>
  );
}

function ActionBtn({ label, onPress, colour, outline }) {
  return (
    <PressBtn onPress={onPress} style={{ backgroundColor:outline?'transparent':colour||C.gold, borderRadius:R.full, paddingVertical:13, paddingHorizontal:24, alignItems:'center', justifyContent:'center', borderWidth:outline?1.5:0, borderColor:colour||C.gold, marginBottom:10 }}>
      <Text style={{ color:outline?colour||C.gold:C.bg, fontSize:FONT.base, fontWeight:'700', letterSpacing:0.5 }}>{label}</Text>
    </PressBtn>
  );
}

function StarRating({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <View style={{ flexDirection:'row', alignItems:'center' }}>
      {[1,2,3,4,5].map(i => (
        <Text key={i} style={{ color:i<=full?C.gold:(half&&i===full+1?C.gold:C.textMuted), fontSize:FONT.sm, marginRight:1 }}>
          {i<=full?'★':(half&&i===full+1?'★':'☆')}
        </Text>
      ))}
      <Text style={{ color:C.textSub, fontSize:FONT.xs, marginLeft:4 }}>{rating}</Text>
    </View>
  );
}


function HomeScreen({ store, setTab }) {
  const { projects, crew, shifts, invoices, threads } = store;
  const activeProjects = projects.filter(p => p.status === 'active');
  const todayShifts = shifts.filter(s => s.date === today());
  const overdueInvs = invoices.filter(i => i.status === 'overdue');
  const totalUnread = threads.reduce((a,t)=>a+t.unread,0);
  const totalRevenue = invoices.filter(i=>i.status==='paid').reduce((a,i)=>a+i.amount,0);
  const pendingRevenue = invoices.filter(i=>i.status==='sent').reduce((a,i)=>a+i.amount,0);

  const recentActivity = [
    {id:'1',icon:'S',colour:C.teal,text:'Apex S2 shoot confirmed for 12 March',ts:Date.now()-3600000},
    {id:'2',icon:'I',colour:C.green,text:'INV-2026-1001 paid - '+fmtCurrency(4750),ts:Date.now()-7200000},
    {id:'3',icon:'C',colour:C.purple,text:'Sofia Reyes added to Quantum project',ts:Date.now()-14400000},
    {id:'4',icon:'M',colour:C.gold,text:totalUnread+' unread messages',ts:Date.now()-28800000},
    {id:'5',icon:'P',colour:C.orange,text:'Brand Ident 2026 - 90% complete',ts:Date.now()-86400000},
  ];

  return (
    <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,paddingBottom:100}} showsVerticalScrollIndicator={false}>
      <View style={{marginBottom:24}}>
        <Text style={{color:C.textSub,fontSize:FONT.sm,fontWeight:'500',letterSpacing:1.5,textTransform:'uppercase',marginBottom:4}}>
          {new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'})}
        </Text>
        <Text style={{color:C.text,fontSize:FONT.xxxl,fontWeight:'800',letterSpacing:-1}}>Dashboard</Text>
        <Text style={{color:C.textSub,fontSize:FONT.base,marginTop:4}}>Good morning, Jordan</Text>
      </View>

      {overdueInvs.length > 0 && (
        <PressBtn onPress={()=>setTab('Invoices')} style={{backgroundColor:C.redDim,borderRadius:R.lg,padding:14,flexDirection:'row',alignItems:'center',marginBottom:16,borderWidth:S.hairline,borderColor:C.red+'44'}}>
          <View style={{width:32,height:32,borderRadius:R.full,backgroundColor:C.red+'33',alignItems:'center',justifyContent:'center',marginRight:12}}>
            <Text style={{color:C.red,fontSize:FONT.base,fontWeight:'700'}}>!</Text>
          </View>
          <View style={{flex:1}}>
            <Text style={{color:C.red,fontSize:FONT.base,fontWeight:'700'}}>{overdueInvs.length} Overdue Invoice{overdueInvs.length>1?'s':''}</Text>
            <Text style={{color:C.red+'BB',fontSize:FONT.sm}}>Outstanding: {fmtCurrency(overdueInvs.reduce((a,i)=>a+i.amount,0))}</Text>
          </View>
          <Text style={{color:C.red,fontSize:FONT.base}}>{'>'}</Text>
        </PressBtn>
      )}

      <View style={{flexDirection:'row',marginHorizontal:-4,marginBottom:16}}>
        <KPICard label="Revenue" value={fmtCurrency(totalRevenue)} sub="collected" colour={C.green} icon="P" />
        <KPICard label="Pipeline" value={fmtCurrency(pendingRevenue)} sub="pending" colour={C.gold} icon="%" />
      </View>
      <View style={{flexDirection:'row',marginHorizontal:-4,marginBottom:20}}>
        <KPICard label="Active" value={String(activeProjects.length)} sub="projects" colour={C.teal} icon="F" />
        <KPICard label="Crew" value={String(crew.filter(c=>c.status==='available').length)} sub="available" colour={C.purple} icon="C" />
      </View>

      <SectionHeader title={'Today — '+todayShifts.length+' shift'+(todayShifts.length!==1?'s':'')} action="Schedule" onAction={()=>setTab('Schedule')} />
      {todayShifts.length===0 ? (
        <View style={{backgroundColor:C.card,borderRadius:R.lg,padding:20,alignItems:'center',marginBottom:16}}>
          <Text style={{color:C.textSub,fontSize:FONT.base}}>No shifts scheduled today</Text>
        </View>
      ) : todayShifts.slice(0,4).map(s => {
        const member = store.crew.find(c=>c.id===s.crewId);
        const proj = store.projects.find(p=>p.id===s.projectId);
        return (
          <View key={s.id} style={{backgroundColor:C.card,borderRadius:R.lg,padding:14,marginBottom:8,flexDirection:'row',alignItems:'center',borderWidth:S.hairline,borderColor:C.border}}>
            <Avatar name={member?.name||'?'} colour={C.teal} size={40} />
            <View style={{flex:1,marginLeft:12}}>
              <Text style={{color:C.text,fontSize:FONT.base,fontWeight:'600'}}>{member?.name||'Unknown'}</Text>
              <Text style={{color:C.textSub,fontSize:FONT.sm}}>{s.start} - {s.end} | {proj?.name||'Unknown'}</Text>
              <Text style={{color:C.textMuted,fontSize:FONT.xs}}>{s.location}</Text>
            </View>
            <StatusChip status={s.status} />
          </View>
        );
      })}

      <SectionHeader title="Active Projects" action="All Projects" onAction={()=>setTab('Projects')} />
      {activeProjects.slice(0,3).map(p => (
        <View key={p.id} style={{backgroundColor:C.card,borderRadius:R.lg,padding:16,marginBottom:8,borderWidth:S.hairline,borderColor:C.border}}>
          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
            <Text style={{color:C.text,fontSize:FONT.base,fontWeight:'700',flex:1}}>{p.name}</Text>
            <StatusChip status={p.status} />
          </View>
          <Text style={{color:C.textSub,fontSize:FONT.sm,marginBottom:10}}>{p.client}</Text>
          <View style={{flexDirection:'row',alignItems:'center',marginBottom:6}}>
            <View style={{flex:1,height:6,backgroundColor:C.surface,borderRadius:3,overflow:'hidden',marginRight:10}}>
              <View style={{width:p.progress+'%',height:'100%',backgroundColor:C.teal,borderRadius:3}} />
            </View>
            <Text style={{color:C.teal,fontSize:FONT.sm,fontWeight:'700',minWidth:36}}>{p.progress}%</Text>
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={{color:C.textMuted,fontSize:FONT.xs}}>Budget: {fmtCurrency(p.budget)}</Text>
            <Text style={{color:C.textMuted,fontSize:FONT.xs}}>Due: {shortDate(p.end)}</Text>
          </View>
        </View>
      ))}

      <SectionHeader title="Recent Activity" />
      {recentActivity.map(a => (
        <View key={a.id} style={{flexDirection:'row',alignItems:'center',paddingVertical:10,borderBottomWidth:S.hairline,borderColor:C.borderFaint}}>
          <View style={{width:34,height:34,borderRadius:R.full,backgroundColor:a.colour+'22',alignItems:'center',justifyContent:'center',marginRight:12}}>
            <Text style={{color:a.colour,fontSize:FONT.sm,fontWeight:'700'}}>{a.icon}</Text>
          </View>
          <View style={{flex:1}}>
            <Text style={{color:C.text,fontSize:FONT.sm,lineHeight:18}}>{a.text}</Text>
            <Text style={{color:C.textMuted,fontSize:FONT.xs,marginTop:2}}>{timeAgo(a.ts)}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}


function BusinessScreen({ store }) {
  const { invoices, projects, shifts, crew } = store;
  const [period, setPeriod] = useState('month');
  const periods = ['week','month','quarter','year'];
  const revenue = invoices.filter(i=>i.status==='paid').reduce((a,i)=>a+i.amount,0);
  const pipeline = invoices.filter(i=>i.status==='sent').reduce((a,i)=>a+i.amount,0);
  const overdue = invoices.filter(i=>i.status==='overdue').reduce((a,i)=>a+i.amount,0);
  const totalBudget = projects.reduce((a,p)=>a+p.budget,0);
  const totalSpent = projects.reduce((a,p)=>a+p.spent,0);
  const budgetHealth = totalBudget>0?Math.round((1-totalSpent/totalBudget)*100):100;
  const revByMonth = [
    {label:'S',value:42000},{label:'O',value:58000},{label:'N',value:49000},
    {label:'D',value:71000},{label:'J',value:63000},{label:'F',value:88000},
  ];
  const maxRev = Math.max(...revByMonth.map(d=>d.value));
  const topProjects = [...projects].filter(p=>p.status!=='planning').sort((a,b)=>b.budget-a.budget).slice(0,4);
  const crewUtil = [{dept:'Camera',util:87},{dept:'Lighting',util:72},{dept:'Sound',util:91},{dept:'Art',util:65},{dept:'VFX',util:58}];
  const upcoming = shifts.filter(s=>s.date>=today()).slice(0,3);

  return (
    <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,paddingBottom:100}} showsVerticalScrollIndicator={false}>
      <View style={{marginBottom:24}}>
        <Text style={{color:C.textSub,fontSize:FONT.sm,fontWeight:'500',letterSpacing:1.5,textTransform:'uppercase',marginBottom:4}}>Financial Overview</Text>
        <Text style={{color:C.text,fontSize:FONT.xxxl,fontWeight:'800',letterSpacing:-1}}>Business</Text>
      </View>
      <View style={{flexDirection:'row',backgroundColor:C.card,borderRadius:R.full,padding:4,marginBottom:20,alignSelf:'flex-start'}}>
        {periods.map(p=>(
          <TouchableOpacity key={p} onPress={()=>setPeriod(p)} style={{paddingVertical:7,paddingHorizontal:16,borderRadius:R.full,backgroundColor:period===p?C.gold:'transparent'}}>
            <Text style={{color:period===p?C.bg:C.textSub,fontSize:FONT.sm,fontWeight:'700',textTransform:'capitalize'}}>{p}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={{flexDirection:'row',marginHorizontal:-4,marginBottom:10}}>
        <KPICard label="Revenue" value={fmtCurrency(revenue)} sub="collected" colour={C.green} icon="P" />
        <KPICard label="Pipeline" value={fmtCurrency(pipeline)} sub="pending" colour={C.gold} icon="%" />
      </View>
      <View style={{flexDirection:'row',marginHorizontal:-4,marginBottom:20}}>
        <KPICard label="Overdue" value={fmtCurrency(overdue)} sub="outstanding" colour={C.red} icon="!" />
        <KPICard label="Budget Health" value={budgetHealth+'%'} sub="remaining" colour={C.teal} icon="H" />
      </View>
      <View style={{backgroundColor:C.card,borderRadius:R.lg,padding:16,marginBottom:12,borderWidth:S.hairline,borderColor:C.border}}>
        <SectionHeader title="Revenue - Last 6 Months" />
        <View style={{flexDirection:'row',alignItems:'flex-end',height:100}}>
          {revByMonth.map((d,i)=>{
            const h=maxRev>0?(d.value/maxRev)*80:0;
            return (
              <View key={i} style={{flex:1,alignItems:'center',marginHorizontal:3}}>
                <Text style={{color:C.textMuted,fontSize:9,marginBottom:3}}>{(d.value/1000).toFixed(0)}k</Text>
                <View style={{width:'100%',height:h,backgroundColor:C.green,borderRadius:4,opacity:0.85}} />
                <Text style={{color:C.textMuted,fontSize:FONT.xs,marginTop:4}}>{d.label}</Text>
              </View>
            );
          })}
        </View>
      </View>
      <SectionHeader title="Top Projects by Budget" />
      {topProjects.map(p=>{
        const pct=p.budget>0?Math.round(p.spent/p.budget*100):0;
        const col=pct>90?C.red:(pct>70?C.gold:C.teal);
        return (
          <View key={p.id} style={{backgroundColor:C.card,borderRadius:R.lg,padding:14,marginBottom:8,borderWidth:S.hairline,borderColor:C.border}}>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
              <Text style={{color:C.text,fontSize:FONT.base,fontWeight:'600',flex:1}}>{p.name}</Text>
              <Text style={{color:C.textSub,fontSize:FONT.sm}}>{p.client}</Text>
            </View>
            <View style={{flexDirection:'row',alignItems:'center',marginBottom:6}}>
              <View style={{flex:1,height:6,backgroundColor:C.surface,borderRadius:3,overflow:'hidden',marginRight:10}}>
                <View style={{width:pct+'%',height:'100%',backgroundColor:col,borderRadius:3}} />
              </View>
              <Text style={{color:col,fontSize:FONT.sm,fontWeight:'700',minWidth:40}}>{pct}%</Text>
            </View>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Text style={{color:C.textMuted,fontSize:FONT.xs}}>Spent: {fmtCurrency(p.spent)}</Text>
              <Text style={{color:C.textMuted,fontSize:FONT.xs}}>Budget: {fmtCurrency(p.budget)}</Text>
            </View>
          </View>
        );
      })}
      <SectionHeader title="Crew Utilisation" />
      <View style={{backgroundColor:C.card,borderRadius:R.lg,padding:16,marginBottom:12,borderWidth:S.hairline,borderColor:C.border}}>
        {crewUtil.map((d,i)=>{
          const col=d.util>80?C.green:(d.util>60?C.gold:C.red);
          return (
            <View key={i} style={{marginBottom:i<crewUtil.length-1?12:0}}>
              <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:4}}>
                <Text style={{color:C.text,fontSize:FONT.sm,fontWeight:'600'}}>{d.dept}</Text>
                <Text style={{color:col,fontSize:FONT.sm,fontWeight:'700'}}>{d.util}%</Text>
              </View>
              <View style={{height:6,backgroundColor:C.surface,borderRadius:3,overflow:'hidden'}}>
                <View style={{width:d.util+'%',height:'100%',backgroundColor:col,borderRadius:3}} />
              </View>
            </View>
          );
        })}
      </View>
      <SectionHeader title="Upcoming Shifts" />
      {upcoming.map(s=>{
        const member=store.crew.find(c=>c.id===s.crewId);
        const proj=store.projects.find(p=>p.id===s.projectId);
        return (
          <View key={s.id} style={{backgroundColor:C.card,borderRadius:R.lg,padding:14,marginBottom:8,flexDirection:'row',alignItems:'center',borderWidth:S.hairline,borderColor:C.border}}>
            <Avatar name={member?.name||'?'} colour={C.purple} size={38} />
            <View style={{flex:1,marginLeft:12}}>
              <Text style={{color:C.text,fontSize:FONT.sm,fontWeight:'600'}}>{member?.name||'?'}</Text>
              <Text style={{color:C.textSub,fontSize:FONT.xs}}>{shortDate(s.date)} | {s.start}-{s.end}</Text>
              <Text style={{color:C.textMuted,fontSize:FONT.xs}}>{proj?.name||'?'}</Text>
            </View>
            <StatusChip status={s.status} />
          </View>
        );
      })}
    </ScrollView>
  );
}

function ProjectsScreen({ store }) {
  const {projects,addProject,editProject,deleteProject} = store;
  const [filter,setFilter] = useState('all');
  const [showAdd,setShowAdd] = useState(false);
  const [editItem,setEditItem] = useState(null);
  const [form,setForm] = useState({});
  const [search,setSearch] = useState('');
  const FILTERS=['all','active','planning','completed'];
  const filtered=projects.filter(p=>{
    const matchF=filter==='all'||p.status===filter;
    const matchS=!search||p.name.toLowerCase().includes(search.toLowerCase())||p.client.toLowerCase().includes(search.toLowerCase());
    return matchF&&matchS;
  });
  const openAdd=()=>{setForm({name:'',client:'',status:'planning',budget:'',start:T,end:addDays(T,30),dept:'Camera',priority:'medium',progress:'0'});setEditItem(null);setShowAdd(true);};
  const openEdit=(p)=>{setForm({...p,budget:String(p.budget),progress:String(p.progress)});setEditItem(p);setShowAdd(true);};
  const handleSave=()=>{
    if(!form.name||!form.client) return Alert.alert('Required','Please fill in name and client.');
    const data={...form,budget:parseFloat(form.budget)||0,progress:parseInt(form.progress)||0};
    if(editItem) editProject(editItem.id,data); else addProject(data);
    setShowAdd(false);
  };
  const handleDelete=(p)=>{
    Alert.alert('Delete Project','Delete '+p.name+'?',[
      {text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>deleteProject(p.id)}
    ]);
  };
  return (
    <View style={{flex:1}}>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,paddingBottom:100}} showsVerticalScrollIndicator={false}>
        <View style={{marginBottom:20}}>
          <Text style={{color:C.textSub,fontSize:FONT.sm,fontWeight:'500',letterSpacing:1.5,textTransform:'uppercase',marginBottom:4}}>Production</Text>
          <Text style={{color:C.text,fontSize:FONT.xxxl,fontWeight:'800',letterSpacing:-1}}>Projects</Text>
        </View>
        <View style={{backgroundColor:C.card,borderRadius:R.lg,flexDirection:'row',alignItems:'center',padding:12,marginBottom:14,borderWidth:S.hairline,borderColor:C.border}}>
          <Text style={{color:C.textMuted,fontSize:FONT.base,marginRight:10}}>S</Text>
          <TextInput value={search} onChangeText={setSearch} placeholder="Search projects..." placeholderTextColor={C.textMuted} style={{flex:1,color:C.text,fontSize:FONT.base}} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:16}}>
          <View style={{flexDirection:'row'}}>
            {FILTERS.map(f=>(
              <TouchableOpacity key={f} onPress={()=>setFilter(f)} style={{paddingVertical:7,paddingHorizontal:16,borderRadius:R.full,backgroundColor:filter===f?C.gold:C.card,marginRight:8,borderWidth:S.hairline,borderColor:filter===f?C.gold:C.border}}>
                <Text style={{color:filter===f?C.bg:C.textSub,fontSize:FONT.sm,fontWeight:'600',textTransform:'capitalize'}}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        {filtered.length===0?<EmptyState icon="F" title="No projects found" sub="Add your first project or adjust the filter" />:
          filtered.map(p=>(
            <Card key={p.id} style={{marginBottom:0}}>
              <View style={{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginBottom:8}}>
                <View style={{flex:1,marginRight:8}}>
                  <Text style={{color:C.text,fontSize:FONT.md,fontWeight:'700'}}>{p.name}</Text>
                  <Text style={{color:C.textSub,fontSize:FONT.sm,marginTop:2}}>{p.client}</Text>
                </View>
                <StatusChip status={p.status} />
              </View>
              <View style={{flexDirection:'row',alignItems:'center',marginBottom:10}}>
                <StatusChip status={p.priority} />
                <Text style={{color:C.textMuted,fontSize:FONT.xs,marginLeft:8}}>{p.dept}</Text>
                <Text style={{color:C.textMuted,fontSize:FONT.xs,marginLeft:8}}>{shortDate(p.start)} - {shortDate(p.end)}</Text>
              </View>
              <View style={{flexDirection:'row',alignItems:'center',marginBottom:10}}>
                <View style={{flex:1,height:6,backgroundColor:C.surface,borderRadius:3,overflow:'hidden',marginRight:10}}>
                  <View style={{width:p.progress+'%',height:'100%',backgroundColor:C.teal,borderRadius:3}} />
                </View>
                <Text style={{color:C.teal,fontSize:FONT.sm,fontWeight:'700'}}>{p.progress}%</Text>
              </View>
              <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:12}}>
                <Text style={{color:C.textMuted,fontSize:FONT.xs}}>Budget: {fmtCurrency(p.budget)}</Text>
                <Text style={{color:C.textMuted,fontSize:FONT.xs}}>Crew: {p.crew.length}</Text>
              </View>
              <View style={{flexDirection:'row'}}>
                <TouchableOpacity onPress={()=>openEdit(p)} style={{flex:1,backgroundColor:C.surface,borderRadius:R.md,padding:9,alignItems:'center',marginRight:8,borderWidth:S.hairline,borderColor:C.border}}>
                  <Text style={{color:C.teal,fontSize:FONT.sm,fontWeight:'600'}}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>handleDelete(p)} style={{flex:1,backgroundColor:C.redDim,borderRadius:R.md,padding:9,alignItems:'center',borderWidth:S.hairline,borderColor:C.red+'33'}}>
                  <Text style={{color:C.red,fontSize:FONT.sm,fontWeight:'600'}}>Delete</Text>
                </TouchableOpacity>
              </View>
            </Card>
          ))
        }
      </ScrollView>
      <PressBtn onPress={openAdd} style={{position:'absolute',bottom:90,right:20,width:56,height:56,borderRadius:28,backgroundColor:C.gold,alignItems:'center',justifyContent:'center',elevation:8}}>
        <Text style={{color:C.bg,fontSize:28,fontWeight:'300',marginTop:-2}}>+</Text>
      </PressBtn>
      <ModalSheet visible={showAdd} onClose={()=>setShowAdd(false)} title={editItem?'Edit Project':'New Project'}>
        <FormInput label="Project Name" value={form.name||''} onChangeText={v=>setForm(f=>({...f,name:v}))} placeholder="e.g. Apex Series S2" />
        <FormInput label="Client" value={form.client||''} onChangeText={v=>setForm(f=>({...f,client:v}))} placeholder="e.g. BBC Studios" />
        <FormInput label="Budget (GBP)" value={String(form.budget||'')} onChangeText={v=>setForm(f=>({...f,budget:v}))} keyboardType="numeric" />
        <FormInput label="Progress (%)" value={String(form.progress||'0')} onChangeText={v=>setForm(f=>({...f,progress:v}))} keyboardType="numeric" />
        <View style={{marginBottom:16}}>
          <Text style={{color:C.textSub,fontSize:FONT.sm,fontWeight:'600',marginBottom:8,textTransform:'uppercase',letterSpacing:0.4}}>Status</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap'}}>
            {['planning','active','completed'].map(s=>(
              <TouchableOpacity key={s} onPress={()=>setForm(f=>({...f,status:s}))} style={{paddingVertical:7,paddingHorizontal:14,borderRadius:R.full,backgroundColor:form.status===s?C.teal:C.card,marginRight:8,marginBottom:8,borderWidth:S.hairline,borderColor:form.status===s?C.teal:C.border}}>
                <Text style={{color:form.status===s?C.bg:C.textSub,fontSize:FONT.sm,fontWeight:'600',textTransform:'capitalize'}}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={{marginBottom:16}}>
          <Text style={{color:C.textSub,fontSize:FONT.sm,fontWeight:'600',marginBottom:8,textTransform:'uppercase',letterSpacing:0.4}}>Priority</Text>
          <View style={{flexDirection:'row'}}>
            {['low','medium','high'].map(s=>(
              <TouchableOpacity key={s} onPress={()=>setForm(f=>({...f,priority:s}))} style={{paddingVertical:7,paddingHorizontal:14,borderRadius:R.full,backgroundColor:form.priority===s?C.orange:C.card,marginRight:8,borderWidth:S.hairline,borderColor:form.priority===s?C.orange:C.border}}>
                <Text style={{color:form.priority===s?C.bg:C.textSub,fontSize:FONT.sm,fontWeight:'600',textTransform:'capitalize'}}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <ActionBtn label={editItem?'Save Changes':'Create Project'} onPress={handleSave} />
        {editItem&&<ActionBtn label="Delete Project" onPress={()=>{setShowAdd(false);handleDelete(editItem);}} colour={C.red} outline />}
      </ModalSheet>
    </View>
  );
}


function CrewScreen({ store }) {
  const {crew,addCrew,editCrew,deleteCrew} = store;
  const [filter,setFilter] = useState('all');
  const [showAdd,setShowAdd] = useState(false);
  const [editItem,setEditItem] = useState(null);
  const [selected,setSelected] = useState(null);
  const [form,setForm] = useState({});
  const [search,setSearch] = useState('');
  const FILTERS=['all','available','booked','unavailable'];
  const filtered=crew.filter(c=>{
    const mF=filter==='all'||c.status===filter;
    const mS=!search||c.name.toLowerCase().includes(search.toLowerCase())||c.role.toLowerCase().includes(search.toLowerCase())||c.dept.toLowerCase().includes(search.toLowerCase());
    return mF&&mS;
  });
  const openAdd=()=>{setForm({name:'',role:'',dept:'Camera',rate:'',email:'',phone:'',bio:'',status:'available'});setEditItem(null);setShowAdd(true);};
  const openEdit=(c)=>{setForm({...c,rate:String(c.rate)});setEditItem(c);setShowAdd(true);};
  const handleSave=()=>{
    if(!form.name||!form.role) return Alert.alert('Required','Name and role are required.');
    const data={...form,rate:parseFloat(form.rate)||0};
    if(editItem) editCrew(editItem.id,data); else addCrew(data);
    setShowAdd(false);
  };
  const handleDelete=(c)=>{
    Alert.alert('Remove Crew Member','Remove '+c.name+' from the roster?',[
      {text:'Cancel',style:'cancel'},{text:'Remove',style:'destructive',onPress:()=>{deleteCrew(c.id);setSelected(null);}}
    ]);
  };
  return (
    <View style={{flex:1}}>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,paddingBottom:100}}>
        <View style={{marginBottom:20}}>
          <Text style={{color:C.textSub,fontSize:FONT.sm,fontWeight:'500',letterSpacing:1.5,textTransform:'uppercase',marginBottom:4}}>Roster</Text>
          <Text style={{color:C.text,fontSize:FONT.xxxl,fontWeight:'800',letterSpacing:-1}}>Crew</Text>
          <Text style={{color:C.textSub,fontSize:FONT.sm,marginTop:4}}>{crew.filter(c=>c.status==='available').length} available of {crew.length} total</Text>
        </View>
        <View style={{backgroundColor:C.card,borderRadius:R.lg,flexDirection:'row',alignItems:'center',padding:12,marginBottom:14,borderWidth:S.hairline,borderColor:C.border}}>
          <Text style={{color:C.textMuted,fontSize:FONT.base,marginRight:10}}>S</Text>
          <TextInput value={search} onChangeText={setSearch} placeholder="Search by name, role or department..." placeholderTextColor={C.textMuted} style={{flex:1,color:C.text,fontSize:FONT.base}} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:16}}>
          <View style={{flexDirection:'row'}}>
            {FILTERS.map(f=>(
              <TouchableOpacity key={f} onPress={()=>setFilter(f)} style={{paddingVertical:7,paddingHorizontal:16,borderRadius:R.full,backgroundColor:filter===f?C.purple:C.card,marginRight:8,borderWidth:S.hairline,borderColor:filter===f?C.purple:C.border}}>
                <Text style={{color:filter===f?C.bg:C.textSub,fontSize:FONT.sm,fontWeight:'600',textTransform:'capitalize'}}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        {filtered.length===0?<EmptyState icon="C" title="No crew found" sub="Add your first crew member or change the filter" />:
          filtered.map(c=>(
            <Card key={c.id} onPress={()=>setSelected(selected===c.id?null:c.id)} style={{marginBottom:0}}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Avatar name={c.name} colour={c.status==='available'?C.green:(c.status==='booked'?C.gold:C.red)} size={48} />
                <View style={{flex:1,marginLeft:14}}>
                  <Text style={{color:C.text,fontSize:FONT.md,fontWeight:'700'}}>{c.name}</Text>
                  <Text style={{color:C.textSub,fontSize:FONT.sm}}>{c.role}</Text>
                  <Text style={{color:C.textMuted,fontSize:FONT.xs}}>{c.dept} | {fmtCurrency(c.rate)}/day</Text>
                </View>
                <View style={{alignItems:'flex-end'}}>
                  <StatusChip status={c.status} />
                  <StarRating rating={parseFloat(c.rating||4.0)} />
                </View>
              </View>
              {selected===c.id&&(
                <View style={{borderTopWidth:S.hairline,borderColor:C.border,marginTop:14,paddingTop:14}}>
                  {c.bio?<Text style={{color:C.textSub,fontSize:FONT.sm,lineHeight:20,marginBottom:12}}>{c.bio}</Text>:null}
                  <View style={{flexDirection:'row',flexWrap:'wrap',marginBottom:12}}>
                    {(c.skills||[]).map((sk,i)=><View key={i} style={{marginRight:6,marginBottom:4}}><Chip label={sk} colour={C.purple} small /></View>)}
                  </View>
                  <View style={{flexDirection:'row',justifyContent:'space-around',marginBottom:12}}>
                    <View style={{alignItems:'center'}}>
                      <Text style={{color:C.gold,fontSize:FONT.xl,fontWeight:'800'}}>{c.completedJobs||0}</Text>
                      <Text style={{color:C.textMuted,fontSize:FONT.xs}}>Jobs</Text>
                    </View>
                    <View style={{alignItems:'center'}}>
                      <Text style={{color:C.teal,fontSize:FONT.xl,fontWeight:'800'}}>{fmtCurrency(c.rate)}</Text>
                      <Text style={{color:C.textMuted,fontSize:FONT.xs}}>Day Rate</Text>
                    </View>
                    <View style={{alignItems:'center'}}>
                      <Text style={{color:C.purple,fontSize:FONT.xl,fontWeight:'800'}}>{c.rating||'4.0'}</Text>
                      <Text style={{color:C.textMuted,fontSize:FONT.xs}}>Rating</Text>
                    </View>
                  </View>
                  {c.email?<Text style={{color:C.textSub,fontSize:FONT.sm,marginBottom:4}}>{c.email}</Text>:null}
                  {c.phone?<Text style={{color:C.textSub,fontSize:FONT.sm,marginBottom:12}}>{c.phone}</Text>:null}
                  <View style={{flexDirection:'row'}}>
                    <TouchableOpacity onPress={()=>openEdit(c)} style={{flex:1,backgroundColor:C.surface,borderRadius:R.md,padding:9,alignItems:'center',marginRight:8,borderWidth:S.hairline,borderColor:C.border}}>
                      <Text style={{color:C.teal,fontSize:FONT.sm,fontWeight:'600'}}>Edit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={()=>handleDelete(c)} style={{flex:1,backgroundColor:C.redDim,borderRadius:R.md,padding:9,alignItems:'center',borderWidth:S.hairline,borderColor:C.red+'33'}}>
                      <Text style={{color:C.red,fontSize:FONT.sm,fontWeight:'600'}}>Remove</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Card>
          ))
        }
      </ScrollView>
      <PressBtn onPress={openAdd} style={{position:'absolute',bottom:90,right:20,width:56,height:56,borderRadius:28,backgroundColor:C.purple,alignItems:'center',justifyContent:'center',elevation:8}}>
        <Text style={{color:C.bg,fontSize:28,fontWeight:'300',marginTop:-2}}>+</Text>
      </PressBtn>
      <ModalSheet visible={showAdd} onClose={()=>setShowAdd(false)} title={editItem?'Edit Crew Member':'Add Crew Member'}>
        <FormInput label="Full Name" value={form.name||''} onChangeText={v=>setForm(f=>({...f,name:v}))} placeholder="e.g. Alex Morgan" />
        <FormInput label="Role" value={form.role||''} onChangeText={v=>setForm(f=>({...f,role:v}))} placeholder="e.g. Director of Photography" />
        <FormInput label="Department" value={form.dept||''} onChangeText={v=>setForm(f=>({...f,dept:v}))} placeholder="e.g. Camera" />
        <FormInput label="Day Rate (GBP)" value={String(form.rate||'')} onChangeText={v=>setForm(f=>({...f,rate:v}))} keyboardType="numeric" />
        <FormInput label="Email" value={form.email||''} onChangeText={v=>setForm(f=>({...f,email:v}))} keyboardType="email-address" />
        <FormInput label="Phone" value={form.phone||''} onChangeText={v=>setForm(f=>({...f,phone:v}))} keyboardType="phone-pad" />
        <FormInput label="Bio" value={form.bio||''} onChangeText={v=>setForm(f=>({...f,bio:v}))} multiline placeholder="Brief biography and experience..." />
        <View style={{marginBottom:16}}>
          <Text style={{color:C.textSub,fontSize:FONT.sm,fontWeight:'600',marginBottom:8,textTransform:'uppercase',letterSpacing:0.4}}>Status</Text>
          <View style={{flexDirection:'row'}}>
            {['available','booked','unavailable'].map(s=>(
              <TouchableOpacity key={s} onPress={()=>setForm(f=>({...f,status:s}))} style={{paddingVertical:7,paddingHorizontal:12,borderRadius:R.full,backgroundColor:form.status===s?C.green:C.card,marginRight:8,borderWidth:S.hairline,borderColor:form.status===s?C.green:C.border}}>
                <Text style={{color:form.status===s?C.bg:C.textSub,fontSize:FONT.sm,fontWeight:'600',textTransform:'capitalize'}}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <ActionBtn label={editItem?'Save Changes':'Add to Roster'} onPress={handleSave} colour={C.purple} />
        {editItem&&<ActionBtn label="Remove from Roster" onPress={()=>{setShowAdd(false);handleDelete(editItem);}} colour={C.red} outline />}
      </ModalSheet>
    </View>
  );
}


function ScheduleScreen({ store }) {
  const {shifts,addShift,editShift,deleteShift,crew,projects} = store;
  const [showAdd,setShowAdd] = useState(false);
  const [editItem,setEditItem] = useState(null);
  const [form,setForm] = useState({});
  const [dateOffset,setDateOffset] = useState(0);
  const focusDate = addDays(T,dateOffset);
  const DATES = Array.from({length:7},(_,i)=>addDays(T,dateOffset-3+i));
  const openAdd=()=>{
    setForm({crewId:crew[0]?.id||'',projectId:projects[0]?.id||'',date:focusDate,start:'09:00',end:'17:00',role:'',location:'',status:'pending',notes:''});
    setEditItem(null);setShowAdd(true);
  };
  const openEdit=(s)=>{setForm({...s});setEditItem(s);setShowAdd(true);};
  const handleSave=()=>{
    if(!form.crewId||!form.date) return Alert.alert('Required','Please select crew and date.');
    if(editItem) editShift(editItem.id,form); else addShift(form);
    setShowAdd(false);
  };
  const handleDelete=(s)=>{
    const member=crew.find(c=>c.id===s.crewId);
    Alert.alert('Delete Shift','Remove shift on '+shortDate(s.date)+' for '+(member?.name||'crew member')+'?',[
      {text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>deleteShift(s.id)}
    ]);
  };
  const dayShifts=shifts.filter(s=>s.date===focusDate).sort((a,b)=>a.start.localeCompare(b.start));
  return (
    <View style={{flex:1}}>
      <ScrollView style={{flex:1}} contentContainerStyle={{paddingBottom:100}}>
        <View style={{padding:20,paddingBottom:0}}>
          <Text style={{color:C.textSub,fontSize:FONT.sm,fontWeight:'500',letterSpacing:1.5,textTransform:'uppercase',marginBottom:4}}>Calendar</Text>
          <Text style={{color:C.text,fontSize:FONT.xxxl,fontWeight:'800',letterSpacing:-1,marginBottom:4}}>Schedule</Text>
          <Text style={{color:C.textSub,fontSize:FONT.sm,marginBottom:16}}>{shifts.length} total shifts</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:20}}>
            <View style={{flexDirection:'row'}}>
              {DATES.map(d=>{
                const isToday=d===T;
                const isFocus=d===focusDate;
                const cnt=shifts.filter(s=>s.date===d).length;
                const dt=new Date(d);
                const dayNum=dt.getDate();
                const dayName=dt.toLocaleDateString('en-GB',{weekday:'short'}).slice(0,3);
                const offIdx=DATES.indexOf(d);
                return (
                  <TouchableOpacity key={d} onPress={()=>setDateOffset(dateOffset+(offIdx-3))} style={{alignItems:'center',marginHorizontal:6,width:52}}>
                    <Text style={{color:isFocus?C.gold:C.textMuted,fontSize:FONT.xs,fontWeight:'600',marginBottom:4,textTransform:'uppercase'}}>{dayName}</Text>
                    <View style={{width:44,height:44,borderRadius:R.full,backgroundColor:isFocus?C.gold:(isToday?C.goldDim:'transparent'),alignItems:'center',justifyContent:'center',borderWidth:isFocus||isToday?0:1,borderColor:C.border}}>
                      <Text style={{color:isFocus?C.bg:(isToday?C.gold:C.text),fontSize:FONT.base,fontWeight:'700'}}>{dayNum}</Text>
                    </View>
                    {cnt>0&&<View style={{marginTop:4,width:20,height:14,borderRadius:7,backgroundColor:C.teal+'22',alignItems:'center',justifyContent:'center'}}>
                      <Text style={{color:C.teal,fontSize:9,fontWeight:'700'}}>{cnt}</Text>
                    </View>}
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
            <TouchableOpacity onPress={()=>setDateOffset(d=>d-7)} style={{backgroundColor:C.card,borderRadius:R.md,paddingVertical:8,paddingHorizontal:16,borderWidth:S.hairline,borderColor:C.border}}>
              <Text style={{color:C.textSub,fontSize:FONT.sm,fontWeight:'600'}}>{'< Prev'}</Text>
            </TouchableOpacity>
            <Text style={{color:C.text,fontSize:FONT.base,fontWeight:'600'}}>{shortDate(focusDate)}</Text>
            <TouchableOpacity onPress={()=>setDateOffset(d=>d+7)} style={{backgroundColor:C.card,borderRadius:R.md,paddingVertical:8,paddingHorizontal:16,borderWidth:S.hairline,borderColor:C.border}}>
              <Text style={{color:C.textSub,fontSize:FONT.sm,fontWeight:'600'}}>{'Next >'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{paddingHorizontal:20}}>
          <SectionHeader title={dayShifts.length+' shift'+(dayShifts.length!==1?'s':'')+' on '+shortDate(focusDate)} />
          {dayShifts.length===0?(
            <View style={{backgroundColor:C.card,borderRadius:R.lg,padding:24,alignItems:'center',borderWidth:S.hairline,borderColor:C.border}}>
              <Text style={{color:C.textSub,fontSize:FONT.base}}>No shifts scheduled</Text>
              <TouchableOpacity onPress={openAdd} style={{marginTop:12,backgroundColor:C.gold+'22',borderRadius:R.full,paddingVertical:8,paddingHorizontal:16}}>
                <Text style={{color:C.gold,fontSize:FONT.sm,fontWeight:'600'}}>+ Add Shift</Text>
              </TouchableOpacity>
            </View>
          ):dayShifts.map(s=>{
            const member=crew.find(c=>c.id===s.crewId);
            const proj=projects.find(p=>p.id===s.projectId);
            const lCol=s.status==='confirmed'?C.teal:(s.status==='pending'?C.gold:C.green);
            return (
              <View key={s.id} style={{backgroundColor:C.card,borderRadius:R.lg,padding:14,marginBottom:10,borderWidth:S.hairline,borderColor:C.border,borderLeftWidth:3,borderLeftColor:lCol}}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                  <View style={{flexDirection:'row',alignItems:'center',flex:1}}>
                    <Avatar name={member?.name||'?'} colour={C.teal} size={38} />
                    <View style={{marginLeft:12,flex:1}}>
                      <Text style={{color:C.text,fontSize:FONT.base,fontWeight:'700'}}>{member?.name||'Unknown'}</Text>
                      <Text style={{color:C.textSub,fontSize:FONT.sm}}>{s.role||member?.role||'?'}</Text>
                    </View>
                  </View>
                  <StatusChip status={s.status} />
                </View>
                <View style={{backgroundColor:C.surface,borderRadius:R.md,padding:10,marginBottom:10}}>
                  <Text style={{color:C.gold,fontSize:FONT.sm,fontWeight:'700'}}>{s.start} - {s.end}</Text>
                  <Text style={{color:C.textSub,fontSize:FONT.xs,marginTop:2}}>{proj?.name||'Unknown project'}</Text>
                  {s.location?<Text style={{color:C.textMuted,fontSize:FONT.xs,marginTop:2}}>{s.location}</Text>:null}
                </View>
                <View style={{flexDirection:'row'}}>
                  <TouchableOpacity onPress={()=>openEdit(s)} style={{flex:1,backgroundColor:C.surface,borderRadius:R.md,padding:8,alignItems:'center',marginRight:8,borderWidth:S.hairline,borderColor:C.border}}>
                    <Text style={{color:C.teal,fontSize:FONT.sm,fontWeight:'600'}}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>handleDelete(s)} style={{flex:1,backgroundColor:C.redDim,borderRadius:R.md,padding:8,alignItems:'center',borderWidth:S.hairline,borderColor:C.red+'33'}}>
                    <Text style={{color:C.red,fontSize:FONT.sm,fontWeight:'600'}}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
          <SectionHeader title="All Upcoming" />
          {shifts.filter(s=>s.date>=T).sort((a,b)=>a.date.localeCompare(b.date)||a.start.localeCompare(b.start)).slice(0,10).map(s=>{
            const member=crew.find(c=>c.id===s.crewId);
            const proj=projects.find(p=>p.id===s.projectId);
            return (
              <View key={s.id} style={{backgroundColor:C.card,borderRadius:R.lg,padding:12,marginBottom:8,flexDirection:'row',alignItems:'center',borderWidth:S.hairline,borderColor:C.border}}>
                <View style={{width:44,alignItems:'center',marginRight:12}}>
                  <Text style={{color:C.gold,fontSize:FONT.sm,fontWeight:'700'}}>{shortDate(s.date).split(' ')[0]}</Text>
                  <Text style={{color:C.textMuted,fontSize:FONT.xs}}>{shortDate(s.date).split(' ')[1]}</Text>
                </View>
                <Avatar name={member?.name||'?'} colour={C.purple} size={34} />
                <View style={{flex:1,marginLeft:10}}>
                  <Text style={{color:C.text,fontSize:FONT.sm,fontWeight:'600'}}>{member?.name||'?'}</Text>
                  <Text style={{color:C.textSub,fontSize:FONT.xs}}>{proj?.name||'?'} | {s.start}-{s.end}</Text>
                </View>
                <StatusChip status={s.status} />
              </View>
            );
          })}
        </View>
      </ScrollView>
      <PressBtn onPress={openAdd} style={{position:'absolute',bottom:90,right:20,width:56,height:56,borderRadius:28,backgroundColor:C.teal,alignItems:'center',justifyContent:'center',elevation:8}}>
        <Text style={{color:C.bg,fontSize:28,fontWeight:'300',marginTop:-2}}>+</Text>
      </PressBtn>
      <ModalSheet visible={showAdd} onClose={()=>setShowAdd(false)} title={editItem?'Edit Shift':'New Shift'}>
        <View style={{marginBottom:16}}>
          <Text style={{color:C.textSub,fontSize:FONT.sm,fontWeight:'600',marginBottom:8,textTransform:'uppercase',letterSpacing:0.4}}>Crew Member</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{flexDirection:'row'}}>
              {crew.slice(0,8).map(c=>(
                <TouchableOpacity key={c.id} onPress={()=>setForm(f=>({...f,crewId:c.id}))} style={{alignItems:'center',marginRight:12,opacity:form.crewId===c.id?1:0.5}}>
                  <Avatar name={c.name} colour={form.crewId===c.id?C.teal:C.textSub} size={40} />
                  <Text style={{color:form.crewId===c.id?C.teal:C.textSub,fontSize:FONT.xs,marginTop:4,maxWidth:50,textAlign:'center'}}>{c.name.split(' ')[0]}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        <View style={{marginBottom:16}}>
          <Text style={{color:C.textSub,fontSize:FONT.sm,fontWeight:'600',marginBottom:8,textTransform:'uppercase',letterSpacing:0.4}}>Project</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={{flexDirection:'row'}}>
              {projects.slice(0,6).map(p=>(
                <TouchableOpacity key={p.id} onPress={()=>setForm(f=>({...f,projectId:p.id}))} style={{backgroundColor:form.projectId===p.id?C.gold:C.card,borderRadius:R.full,paddingVertical:7,paddingHorizontal:14,marginRight:8,borderWidth:S.hairline,borderColor:form.projectId===p.id?C.gold:C.border}}>
                  <Text style={{color:form.projectId===p.id?C.bg:C.textSub,fontSize:FONT.sm,fontWeight:'600'}}>{p.name.split(' ')[0]}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
        <FormInput label="Date" value={form.date||T} onChangeText={v=>setForm(f=>({...f,date:v}))} placeholder="YYYY-MM-DD" />
        <View style={{flexDirection:'row'}}>
          <View style={{flex:1,marginRight:8}}><FormInput label="Start Time" value={form.start||''} onChangeText={v=>setForm(f=>({...f,start:v}))} placeholder="09:00" /></View>
          <View style={{flex:1}}><FormInput label="End Time" value={form.end||''} onChangeText={v=>setForm(f=>({...f,end:v}))} placeholder="17:00" /></View>
        </View>
        <FormInput label="Role on shoot" value={form.role||''} onChangeText={v=>setForm(f=>({...f,role:v}))} placeholder="e.g. Camera Operator" />
        <FormInput label="Location" value={form.location||''} onChangeText={v=>setForm(f=>({...f,location:v}))} placeholder="e.g. Pinewood Studios" />
        <View style={{marginBottom:16}}>
          <Text style={{color:C.textSub,fontSize:FONT.sm,fontWeight:'600',marginBottom:8,textTransform:'uppercase',letterSpacing:0.4}}>Status</Text>
          <View style={{flexDirection:'row'}}>
            {['pending','confirmed','completed'].map(s=>(
              <TouchableOpacity key={s} onPress={()=>setForm(f=>({...f,status:s}))} style={{paddingVertical:7,paddingHorizontal:12,borderRadius:R.full,backgroundColor:form.status===s?C.teal:C.card,marginRight:8,borderWidth:S.hairline,borderColor:form.status===s?C.teal:C.border}}>
                <Text style={{color:form.status===s?C.bg:C.textSub,fontSize:FONT.sm,fontWeight:'600',textTransform:'capitalize'}}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <ActionBtn label={editItem?'Save Changes':'Add Shift'} onPress={handleSave} colour={C.teal} />
        {editItem&&<ActionBtn label="Delete Shift" onPress={()=>{setShowAdd(false);handleDelete(editItem);}} colour={C.red} outline />}
      </ModalSheet>
    </View>
  );
}


function MessagesScreen({ store }) {
  const {threads,sendMessage,addThread,deleteThread,markRead} = store;
  const [activeThread,setActiveThread] = useState(null);
  const [reply,setReply] = useState('');
  const [showNew,setShowNew] = useState(false);
  const [newForm,setNewForm] = useState({subject:'',participants:''});
  const scrollRef = useRef(null);
  const totalUnread = threads.reduce((a,t)=>a+t.unread,0);
  const thread = threads.find(t=>t.id===activeThread);
  const openThread=(t)=>{markRead(t.id);setActiveThread(t.id);};
  const handleSend=()=>{
    if(!reply.trim()) return;
    sendMessage(activeThread,reply.trim());
    setReply('');
    setTimeout(()=>scrollRef.current?.scrollToEnd({animated:true}),100);
  };
  const handleNewThread=()=>{
    if(!newForm.subject.trim()) return Alert.alert('Required','Please enter a subject.');
    const parts=newForm.participants.split(',').map(p=>p.trim()).filter(Boolean);
    addThread({subject:newForm.subject.trim(),participants:parts.length?parts:['New Participant'],colour:C.teal,avatar:newForm.subject[0]||'N',unread:0});
    setNewForm({subject:'',participants:''});
    setShowNew(false);
  };
  const handleDeleteThread=(t)=>{
    Alert.alert('Delete Conversation','Delete this conversation?',[
      {text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>{if(activeThread===t.id) setActiveThread(null);deleteThread(t.id);}}
    ]);
  };
  if(activeThread&&thread) {
    return (
      <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS==='ios'?'padding':'height'}>
        <View style={{backgroundColor:C.surface,paddingTop:16,paddingBottom:14,paddingHorizontal:20,flexDirection:'row',alignItems:'center',borderBottomWidth:S.hairline,borderColor:C.border}}>
          <TouchableOpacity onPress={()=>setActiveThread(null)} style={{width:36,height:36,borderRadius:R.full,backgroundColor:C.card,alignItems:'center',justifyContent:'center',marginRight:14,borderWidth:S.hairline,borderColor:C.border}}>
            <Text style={{color:C.textSub,fontSize:FONT.base,fontWeight:'600'}}>{'<'}</Text>
          </TouchableOpacity>
          <Avatar name={thread.avatar||thread.subject} colour={thread.colour} size={40} />
          <View style={{flex:1,marginLeft:12}}>
            <Text style={{color:C.text,fontSize:FONT.md,fontWeight:'700'}} numberOfLines={1}>{thread.subject}</Text>
            <Text style={{color:C.textSub,fontSize:FONT.xs}} numberOfLines={1}>{thread.participants.join(', ')}</Text>
          </View>
          <TouchableOpacity onPress={()=>handleDeleteThread(thread)} style={{padding:8}}>
            <Text style={{color:C.red,fontSize:FONT.sm,fontWeight:'600'}}>Del</Text>
          </TouchableOpacity>
        </View>
        <ScrollView ref={scrollRef} style={{flex:1}} contentContainerStyle={{padding:16,paddingBottom:20}} showsVerticalScrollIndicator={false} onContentSizeChange={()=>scrollRef.current?.scrollToEnd({animated:false})}>
          {thread.messages.map((msg,i)=>{
            const showSender=i===0||thread.messages[i-1].sender!==msg.sender;
            return (
              <View key={msg.id} style={{marginBottom:6,alignItems:msg.isMe?'flex-end':'flex-start'}}>
                {showSender&&!msg.isMe&&<Text style={{color:C.textMuted,fontSize:FONT.xs,marginBottom:3,marginLeft:4}}>{msg.sender}</Text>}
                <View style={{maxWidth:'78%',backgroundColor:msg.isMe?C.gold:C.card,borderRadius:R.xl,paddingVertical:10,paddingHorizontal:14,borderBottomRightRadius:msg.isMe?4:R.xl,borderBottomLeftRadius:msg.isMe?R.xl:4,borderWidth:S.hairline,borderColor:msg.isMe?C.gold:C.border}}>
                  <Text style={{color:msg.isMe?C.bg:C.text,fontSize:FONT.base,lineHeight:20}}>{msg.text}</Text>
                  <Text style={{color:msg.isMe?C.bg+'99':C.textMuted,fontSize:FONT.xs,marginTop:4,textAlign:'right'}}>{timeAgo(msg.ts)}</Text>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <View style={{backgroundColor:C.surface,paddingHorizontal:16,paddingVertical:12,flexDirection:'row',alignItems:'center',borderTopWidth:S.hairline,borderColor:C.border}}>
          <TextInput value={reply} onChangeText={setReply} placeholder="Type a message..." placeholderTextColor={C.textMuted}
            style={{flex:1,backgroundColor:C.card,borderRadius:R.full,paddingHorizontal:16,paddingVertical:10,color:C.text,fontSize:FONT.base,borderWidth:S.hairline,borderColor:C.border,marginRight:10,maxHeight:100}}
            multiline returnKeyType="send"
          />
          <PressBtn onPress={handleSend} style={{width:44,height:44,borderRadius:22,backgroundColor:reply.trim()?C.gold:C.card,alignItems:'center',justifyContent:'center',borderWidth:S.hairline,borderColor:reply.trim()?C.gold:C.border}}>
            <Text style={{color:reply.trim()?C.bg:C.textMuted,fontSize:FONT.base,fontWeight:'700'}}>{'>'}</Text>
          </PressBtn>
        </View>
      </KeyboardAvoidingView>
    );
  }
  return (
    <View style={{flex:1}}>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,paddingBottom:100}}>
        <View style={{marginBottom:20}}>
          <Text style={{color:C.textSub,fontSize:FONT.sm,fontWeight:'500',letterSpacing:1.5,textTransform:'uppercase',marginBottom:4}}>Communication</Text>
          <Text style={{color:C.text,fontSize:FONT.xxxl,fontWeight:'800',letterSpacing:-1}}>Messages</Text>
          {totalUnread>0&&<Text style={{color:C.gold,fontSize:FONT.sm,marginTop:4,fontWeight:'600'}}>{totalUnread} unread message{totalUnread!==1?'s':''}</Text>}
        </View>
        {threads.length===0?<EmptyState icon="M" title="No conversations" sub="Start a new conversation using the compose button" />:
          threads.map(t=>{
            const last=t.messages[t.messages.length-1];
            return (
              <PressBtn key={t.id} onPress={()=>openThread(t)} style={{backgroundColor:C.card,borderRadius:R.lg,padding:14,marginBottom:8,borderWidth:S.hairline,borderColor:t.unread>0?t.colour+'44':C.border,flexDirection:'row',alignItems:'center'}}>
                <View style={{position:'relative'}}>
                  <Avatar name={t.avatar||t.subject} colour={t.colour} size={48} />
                  {t.unread>0&&<View style={{position:'absolute',top:-2,right:-2,width:18,height:18,borderRadius:9,backgroundColor:t.colour,alignItems:'center',justifyContent:'center'}}>
                    <Text style={{color:C.bg,fontSize:9,fontWeight:'800'}}>{t.unread}</Text>
                  </View>}
                </View>
                <View style={{flex:1,marginLeft:14}}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:3}}>
                    <Text style={{color:C.text,fontSize:FONT.base,fontWeight:t.unread>0?'800':'600',flex:1}} numberOfLines={1}>{t.subject}</Text>
                    <Text style={{color:C.textMuted,fontSize:FONT.xs,marginLeft:8}}>{last?timeAgo(last.ts):''}</Text>
                  </View>
                  <Text style={{color:t.unread>0?C.textSub:C.textMuted,fontSize:FONT.sm,lineHeight:18}} numberOfLines={1}>{last?last.sender+': '+last.text:'No messages yet'}</Text>
                  <Text style={{color:C.textMuted,fontSize:FONT.xs,marginTop:2}} numberOfLines={1}>{t.participants.join(', ')}</Text>
                </View>
                <Text style={{color:C.textMuted,fontSize:FONT.xl,marginLeft:8}}>{'>'}</Text>
              </PressBtn>
            );
          })
        }
      </ScrollView>
      <PressBtn onPress={()=>setShowNew(true)} style={{position:'absolute',bottom:90,right:20,width:56,height:56,borderRadius:28,backgroundColor:C.teal,alignItems:'center',justifyContent:'center',elevation:8}}>
        <Text style={{color:C.bg,fontSize:28,fontWeight:'300',marginTop:-2}}>+</Text>
      </PressBtn>
      <ModalSheet visible={showNew} onClose={()=>setShowNew(false)} title="New Conversation">
        <FormInput label="Subject" value={newForm.subject} onChangeText={v=>setNewForm(f=>({...f,subject:v}))} placeholder="e.g. Apex S2 - Pre-Production" />
        <FormInput label="Participants (comma-separated)" value={newForm.participants} onChangeText={v=>setNewForm(f=>({...f,participants:v}))} placeholder="e.g. Alex Morgan, Jamie Liu" />
        <ActionBtn label="Start Conversation" onPress={handleNewThread} colour={C.teal} />
      </ModalSheet>
    </View>
  );
}


function InvoicesScreen({ store }) {
  const {invoices,addInvoice,editInvoice,deleteInvoice,projects} = store;
  const [filter,setFilter] = useState('all');
  const [showAdd,setShowAdd] = useState(false);
  const [editItem,setEditItem] = useState(null);
  const [selected,setSelected] = useState(null);
  const [form,setForm] = useState({});
  const [uploading,setUploading] = useState(false);
  const FILTERS=['all','draft','sent','paid','overdue'];
  const filtered=invoices.filter(i=>filter==='all'||i.status===filter);
  const totalPaid=invoices.filter(i=>i.status==='paid').reduce((a,i)=>a+i.amount,0);
  const totalPending=invoices.filter(i=>i.status==='sent').reduce((a,i)=>a+i.amount,0);
  const totalOverdue=invoices.filter(i=>i.status==='overdue').reduce((a,i)=>a+i.amount,0);
  const openAdd=()=>{
    const num='INV-2026-'+String(2000+invoices.length);
    setForm({number:num,client:'',projectId:projects[0]?.id||'',amount:'',status:'draft',issued:T,due:addDays(T,30),notes:'',vatRate:'20',attachments:[]});
    setEditItem(null);setShowAdd(true);
  };
  const openEdit=(inv)=>{setForm({...inv,amount:String(inv.amount),vatRate:String(inv.vatRate)});setEditItem(inv);setShowAdd(true);};
  const handleSave=()=>{
    if(!form.client||!form.amount) return Alert.alert('Required','Please fill in client and amount.');
    const data={...form,amount:parseFloat(form.amount)||0,vatRate:parseInt(form.vatRate)||20};
    if(editItem) editInvoice(editItem.id,data); else addInvoice(data);
    setShowAdd(false);
  };
  const handleDelete=(inv)=>{
    Alert.alert('Delete Invoice','Delete '+inv.number+'?',[
      {text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>{deleteInvoice(inv.id);setSelected(null);}}
    ]);
  };
  const handleUpload=(invId)=>{
    setUploading(true);
    const fakeFiles=['brief.pdf','contract.pdf','PO_2026.pdf','scope_of_work.pdf','schedule.pdf'];
    const filename=fakeFiles[Math.floor(Math.random()*fakeFiles.length)];
    setTimeout(()=>{
      editInvoice(invId,{attachments:[...((invoices.find(i=>i.id===invId)||{}).attachments||[]),filename]});
      setUploading(false);
      Alert.alert('File Attached',filename+' has been attached to this invoice.');
    },1200);
  };
  return (
    <View style={{flex:1}}>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,paddingBottom:100}}>
        <View style={{marginBottom:20}}>
          <Text style={{color:C.textSub,fontSize:FONT.sm,fontWeight:'500',letterSpacing:1.5,textTransform:'uppercase',marginBottom:4}}>Finance</Text>
          <Text style={{color:C.text,fontSize:FONT.xxxl,fontWeight:'800',letterSpacing:-1}}>Invoices</Text>
        </View>
        <View style={{flexDirection:'row',marginHorizontal:-4,marginBottom:16}}>
          <KPICard label="Paid" value={fmtCurrency(totalPaid)} sub="" colour={C.green} icon="P" />
          <KPICard label="Pending" value={fmtCurrency(totalPending)} sub="" colour={C.gold} icon="%" />
        </View>
        {totalOverdue>0&&<View style={{backgroundColor:C.redDim,borderRadius:R.lg,padding:14,flexDirection:'row',alignItems:'center',marginBottom:16,borderWidth:S.hairline,borderColor:C.red+'33'}}>
          <Text style={{color:C.red,fontSize:FONT.base,fontWeight:'700',flex:1}}>Overdue: {fmtCurrency(totalOverdue)}</Text>
          <TouchableOpacity onPress={()=>setFilter('overdue')}><Text style={{color:C.red,fontSize:FONT.sm,fontWeight:'600'}}>View</Text></TouchableOpacity>
        </View>}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:16}}>
          <View style={{flexDirection:'row'}}>
            {FILTERS.map(f=>(
              <TouchableOpacity key={f} onPress={()=>setFilter(f)} style={{paddingVertical:7,paddingHorizontal:16,borderRadius:R.full,backgroundColor:filter===f?C.gold:C.card,marginRight:8,borderWidth:S.hairline,borderColor:filter===f?C.gold:C.border}}>
                <Text style={{color:filter===f?C.bg:C.textSub,fontSize:FONT.sm,fontWeight:'600',textTransform:'capitalize'}}>{f}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
        {filtered.length===0?<EmptyState icon="I" title="No invoices" sub="Create your first invoice using the button below" />:
          filtered.map(inv=>{
            const isSelected=selected===inv.id;
            const vatAmt=inv.amount*(inv.vatRate||20)/100;
            return (
              <View key={inv.id}>
                <PressBtn onPress={()=>setSelected(isSelected?null:inv.id)} style={{backgroundColor:C.card,borderRadius:R.lg,padding:14,marginBottom:8,borderWidth:S.hairline,borderColor:inv.status==='overdue'?C.red+'44':C.border}}>
                  <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
                    <Text style={{color:C.text,fontSize:FONT.base,fontWeight:'700'}}>{inv.number}</Text>
                    <StatusChip status={inv.status} />
                  </View>
                  <Text style={{color:C.textSub,fontSize:FONT.sm,marginBottom:4}}>{inv.client}</Text>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <Text style={{color:C.gold,fontSize:FONT.xl,fontWeight:'800',letterSpacing:-0.5}}>{fmtCurrency(inv.amount)}</Text>
                    <View style={{alignItems:'flex-end'}}>
                      <Text style={{color:C.textMuted,fontSize:FONT.xs}}>Issued: {shortDate(inv.issued)}</Text>
                      <Text style={{color:inv.status==='overdue'?C.red:C.textMuted,fontSize:FONT.xs}}>Due: {shortDate(inv.due)}</Text>
                    </View>
                  </View>
                  {inv.attachments&&inv.attachments.length>0&&<View style={{flexDirection:'row',flexWrap:'wrap',marginTop:6}}>
                    {inv.attachments.map((a,i)=><View key={i} style={{marginRight:4}}><Chip label={a} colour={C.blue} small /></View>)}
                  </View>}
                </PressBtn>
                {isSelected&&(
                  <View style={{backgroundColor:C.cardHigh,borderRadius:R.lg,padding:14,marginTop:-6,marginBottom:8,borderWidth:S.hairline,borderColor:C.border}}>
                    <Text style={{color:C.textSub,fontSize:FONT.sm,marginBottom:8,fontWeight:'600'}}>VAT ({inv.vatRate||20}%): {fmtCurrency(vatAmt)} | Total inc. VAT: {fmtCurrency(inv.amount+vatAmt)}</Text>
                    {inv.notes?<Text style={{color:C.textSub,fontSize:FONT.sm,marginBottom:10}}>{inv.notes}</Text>:null}
                    <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                      <TouchableOpacity onPress={()=>openEdit(inv)} style={{backgroundColor:C.surface,borderRadius:R.md,padding:9,alignItems:'center',marginRight:8,marginBottom:8,paddingHorizontal:16,borderWidth:S.hairline,borderColor:C.border}}>
                        <Text style={{color:C.teal,fontSize:FONT.sm,fontWeight:'600'}}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>handleUpload(inv.id)} disabled={uploading} style={{backgroundColor:C.blueDim,borderRadius:R.md,padding:9,alignItems:'center',marginRight:8,marginBottom:8,paddingHorizontal:16,borderWidth:S.hairline,borderColor:C.blue+'33'}}>
                        <Text style={{color:C.blue,fontSize:FONT.sm,fontWeight:'600'}}>{uploading?'Uploading...':'Attach File'}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>handleDelete(inv)} style={{backgroundColor:C.redDim,borderRadius:R.md,padding:9,alignItems:'center',marginBottom:8,paddingHorizontal:16,borderWidth:S.hairline,borderColor:C.red+'33'}}>
                        <Text style={{color:C.red,fontSize:FONT.sm,fontWeight:'600'}}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                    {inv.status!=='paid'&&<TouchableOpacity onPress={()=>editInvoice(inv.id,{status:'paid'})} style={{backgroundColor:C.greenDim,borderRadius:R.md,padding:10,alignItems:'center',borderWidth:S.hairline,borderColor:C.green+'33'}}>
                      <Text style={{color:C.green,fontSize:FONT.sm,fontWeight:'700'}}>Mark as Paid</Text>
                    </TouchableOpacity>}
                  </View>
                )}
              </View>
            );
          })
        }
      </ScrollView>
      <PressBtn onPress={openAdd} style={{position:'absolute',bottom:90,right:20,width:56,height:56,borderRadius:28,backgroundColor:C.gold,alignItems:'center',justifyContent:'center',elevation:8}}>
        <Text style={{color:C.bg,fontSize:28,fontWeight:'300',marginTop:-2}}>+</Text>
      </PressBtn>
      <ModalSheet visible={showAdd} onClose={()=>setShowAdd(false)} title={editItem?'Edit Invoice':'New Invoice'}>
        <FormInput label="Invoice Number" value={form.number||''} onChangeText={v=>setForm(f=>({...f,number:v}))} />
        <FormInput label="Client" value={form.client||''} onChangeText={v=>setForm(f=>({...f,client:v}))} placeholder="e.g. BBC Studios" />
        <FormInput label="Amount (GBP, ex VAT)" value={String(form.amount||'')} onChangeText={v=>setForm(f=>({...f,amount:v}))} keyboardType="numeric" />
        <FormInput label="VAT Rate (%)" value={String(form.vatRate||'20')} onChangeText={v=>setForm(f=>({...f,vatRate:v}))} keyboardType="numeric" />
        <FormInput label="Issue Date" value={form.issued||T} onChangeText={v=>setForm(f=>({...f,issued:v}))} placeholder="YYYY-MM-DD" />
        <FormInput label="Due Date" value={form.due||addDays(T,30)} onChangeText={v=>setForm(f=>({...f,due:v}))} placeholder="YYYY-MM-DD" />
        <FormInput label="Notes" value={form.notes||''} onChangeText={v=>setForm(f=>({...f,notes:v}))} multiline placeholder="Payment terms, notes..." />
        <View style={{marginBottom:16}}>
          <Text style={{color:C.textSub,fontSize:FONT.sm,fontWeight:'600',marginBottom:8,textTransform:'uppercase',letterSpacing:0.4}}>Status</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap'}}>
            {['draft','sent','paid','overdue'].map(s=>(
              <TouchableOpacity key={s} onPress={()=>setForm(f=>({...f,status:s}))} style={{paddingVertical:7,paddingHorizontal:12,borderRadius:R.full,backgroundColor:form.status===s?C.gold:C.card,marginRight:8,marginBottom:8,borderWidth:S.hairline,borderColor:form.status===s?C.gold:C.border}}>
                <Text style={{color:form.status===s?C.bg:C.textSub,fontSize:FONT.sm,fontWeight:'600',textTransform:'capitalize'}}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <ActionBtn label={editItem?'Save Changes':'Create Invoice'} onPress={handleSave} />
        {editItem&&<ActionBtn label="Delete Invoice" onPress={()=>{setShowAdd(false);handleDelete(editItem);}} colour={C.red} outline />}
      </ModalSheet>
    </View>
  );
}


function ReportsScreen({ store }) {
  const {projects,invoices,crew,shifts} = store;
  const [tab,setTab] = useState('finance');
  const paid=invoices.filter(i=>i.status==='paid').reduce((a,i)=>a+i.amount,0);
  const pipeline=invoices.filter(i=>i.status==='sent').reduce((a,i)=>a+i.amount,0);
  const overdue=invoices.filter(i=>i.status==='overdue').reduce((a,i)=>a+i.amount,0);
  const totalBudget=projects.reduce((a,p)=>a+p.budget,0);
  const totalSpent=projects.reduce((a,p)=>a+p.spent,0);
  const crewAvail=crew.filter(c=>c.status==='available').length;
  const monthData=INIT_REPORTS.revenueByMonth;
  const maxRevMonth=Math.max(...monthData.map(m=>m.rev));
  const topClients=INIT_REPORTS.topClients;
  const crewUtil=INIT_REPORTS.crewUtilisation;
  const TABS=['finance','projects','crew'];
  return (
    <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,paddingBottom:100}}>
      <View style={{marginBottom:20}}>
        <Text style={{color:C.textSub,fontSize:FONT.sm,fontWeight:'500',letterSpacing:1.5,textTransform:'uppercase',marginBottom:4}}>Analytics</Text>
        <Text style={{color:C.text,fontSize:FONT.xxxl,fontWeight:'800',letterSpacing:-1}}>Reports</Text>
      </View>
      <View style={{flexDirection:'row',backgroundColor:C.card,borderRadius:R.full,padding:4,marginBottom:20}}>
        {TABS.map(t=>(
          <TouchableOpacity key={t} onPress={()=>setTab(t)} style={{flex:1,paddingVertical:9,borderRadius:R.full,backgroundColor:tab===t?C.gold:'transparent',alignItems:'center'}}>
            <Text style={{color:tab===t?C.bg:C.textSub,fontSize:FONT.sm,fontWeight:'700',textTransform:'capitalize'}}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {tab==='finance'&&(
        <View>
          <View style={{flexDirection:'row',marginHorizontal:-4,marginBottom:10}}>
            <KPICard label="Revenue" value={fmtCurrency(paid)} sub="YTD collected" colour={C.green} icon="P" />
            <KPICard label="Pipeline" value={fmtCurrency(pipeline)} sub="outstanding" colour={C.gold} icon="%" />
          </View>
          <View style={{flexDirection:'row',marginHorizontal:-4,marginBottom:20}}>
            <KPICard label="Overdue" value={fmtCurrency(overdue)} sub="requires action" colour={C.red} icon="!" />
            <KPICard label="Invoices" value={String(invoices.length)} sub={invoices.filter(i=>i.status==='paid').length+' paid'} colour={C.teal} icon="I" />
          </View>
          <View style={{backgroundColor:C.card,borderRadius:R.lg,padding:16,marginBottom:12,borderWidth:S.hairline,borderColor:C.border}}>
            <SectionHeader title="Monthly Revenue vs Costs" />
            <View style={{flexDirection:'row',alignItems:'flex-end',height:120}}>
              {monthData.map((m,i)=>{
                const rH=maxRevMonth>0?(m.rev/maxRevMonth)*90:0;
                const cH=maxRevMonth>0?(m.cost/maxRevMonth)*90:0;
                return (
                  <View key={i} style={{flex:1,alignItems:'center',marginHorizontal:2}}>
                    <View style={{width:'100%',alignItems:'center',justifyContent:'flex-end',height:95,flexDirection:'row'}}>
                      <View style={{width:'42%',height:rH,backgroundColor:C.green,borderRadius:3,marginRight:2,opacity:0.9}} />
                      <View style={{width:'42%',height:cH,backgroundColor:C.red,borderRadius:3,opacity:0.7}} />
                    </View>
                    <Text style={{color:C.textMuted,fontSize:FONT.xs,marginTop:4}}>{m.month}</Text>
                  </View>
                );
              })}
            </View>
            <View style={{flexDirection:'row',justifyContent:'center',marginTop:8}}>
              <View style={{flexDirection:'row',alignItems:'center',marginRight:16}}>
                <View style={{width:10,height:10,borderRadius:2,backgroundColor:C.green,marginRight:6}} />
                <Text style={{color:C.textSub,fontSize:FONT.xs}}>Revenue</Text>
              </View>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <View style={{width:10,height:10,borderRadius:2,backgroundColor:C.red,marginRight:6}} />
                <Text style={{color:C.textSub,fontSize:FONT.xs}}>Costs</Text>
              </View>
            </View>
          </View>
          <SectionHeader title="Top Clients" />
          {topClients.map((c,i)=>(
            <View key={i} style={{backgroundColor:C.card,borderRadius:R.lg,padding:14,marginBottom:8,flexDirection:'row',alignItems:'center',borderWidth:S.hairline,borderColor:C.border}}>
              <View style={{width:32,height:32,borderRadius:R.full,backgroundColor:C.gold+'22',alignItems:'center',justifyContent:'center',marginRight:12}}>
                <Text style={{color:C.gold,fontSize:FONT.sm,fontWeight:'800'}}>#{i+1}</Text>
              </View>
              <View style={{flex:1}}>
                <Text style={{color:C.text,fontSize:FONT.base,fontWeight:'600'}}>{c.name}</Text>
                <Text style={{color:C.textSub,fontSize:FONT.xs}}>{c.projects} project{c.projects!==1?'s':''}</Text>
              </View>
              <Text style={{color:C.green,fontSize:FONT.base,fontWeight:'700'}}>{fmtCurrency(c.rev)}</Text>
            </View>
          ))}
        </View>
      )}
      {tab==='projects'&&(
        <View>
          <View style={{flexDirection:'row',marginHorizontal:-4,marginBottom:10}}>
            <KPICard label="Total" value={String(projects.length)} sub="projects" colour={C.teal} icon="F" />
            <KPICard label="Active" value={String(projects.filter(p=>p.status==='active').length)} sub="in progress" colour={C.gold} icon="A" />
          </View>
          <View style={{flexDirection:'row',marginHorizontal:-4,marginBottom:20}}>
            <KPICard label="Budget" value={fmtCurrency(totalBudget)} sub="total allocated" colour={C.blue} icon="B" />
            <KPICard label="Spent" value={fmtCurrency(totalSpent)} sub={Math.round(totalSpent/totalBudget*100)+'% of budget'} colour={totalSpent/totalBudget>0.8?C.red:C.green} icon="S" />
          </View>
          <SectionHeader title="Project Status Breakdown" />
          {['active','planning','completed'].map(s=>{
            const count=projects.filter(p=>p.status===s).length;
            const pct=projects.length>0?count/projects.length:0;
            const col=s==='active'?C.teal:(s==='planning'?C.blue:C.green);
            return (
              <View key={s} style={{marginBottom:14}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:4}}>
                  <Text style={{color:C.text,fontSize:FONT.sm,fontWeight:'600',textTransform:'capitalize'}}>{s}</Text>
                  <Text style={{color:col,fontSize:FONT.sm,fontWeight:'700'}}>{count} ({Math.round(pct*100)}%)</Text>
                </View>
                <View style={{height:8,backgroundColor:C.surface,borderRadius:4,overflow:'hidden'}}>
                  <View style={{width:(pct*100)+'%',height:'100%',backgroundColor:col,borderRadius:4}} />
                </View>
              </View>
            );
          })}
          <SectionHeader title="Projects by Budget" />
          {[...projects].sort((a,b)=>b.budget-a.budget).slice(0,5).map(p=>(
            <View key={p.id} style={{backgroundColor:C.card,borderRadius:R.lg,padding:14,marginBottom:8,flexDirection:'row',alignItems:'center',borderWidth:S.hairline,borderColor:C.border}}>
              <View style={{flex:1}}>
                <Text style={{color:C.text,fontSize:FONT.sm,fontWeight:'600'}}>{p.name}</Text>
                <Text style={{color:C.textSub,fontSize:FONT.xs}}>{p.client} | {p.progress}% complete</Text>
              </View>
              <Text style={{color:C.gold,fontSize:FONT.base,fontWeight:'700'}}>{fmtCurrency(p.budget)}</Text>
            </View>
          ))}
        </View>
      )}
      {tab==='crew'&&(
        <View>
          <View style={{flexDirection:'row',marginHorizontal:-4,marginBottom:10}}>
            <KPICard label="Total Crew" value={String(crew.length)} sub="in roster" colour={C.purple} icon="C" />
            <KPICard label="Available" value={String(crewAvail)} sub="right now" colour={C.green} icon="A" />
          </View>
          <View style={{flexDirection:'row',marginHorizontal:-4,marginBottom:20}}>
            <KPICard label="Booked" value={String(crew.filter(c=>c.status==='booked').length)} sub="on projects" colour={C.gold} icon="B" />
            <KPICard label="Shifts" value={String(shifts.length)} sub="total scheduled" colour={C.teal} icon="S" />
          </View>
          <SectionHeader title="Crew Utilisation by Dept" />
          <View style={{backgroundColor:C.card,borderRadius:R.lg,padding:16,marginBottom:16,borderWidth:S.hairline,borderColor:C.border}}>
            {crewUtil.map((d,i)=>{
              const col=d.util>80?C.green:(d.util>60?C.gold:C.red);
              return (
                <View key={i} style={{marginBottom:i<crewUtil.length-1?14:0}}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:4}}>
                    <Text style={{color:C.text,fontSize:FONT.sm,fontWeight:'600'}}>{d.dept}</Text>
                    <Text style={{color:col,fontSize:FONT.sm,fontWeight:'700'}}>{d.util}%</Text>
                  </View>
                  <View style={{height:8,backgroundColor:C.surface,borderRadius:4,overflow:'hidden'}}>
                    <View style={{width:d.util+'%',height:'100%',backgroundColor:col,borderRadius:4}} />
                  </View>
                </View>
              );
            })}
          </View>
          <SectionHeader title="Top Rated Crew" />
          {[...crew].sort((a,b)=>parseFloat(b.rating||0)-parseFloat(a.rating||0)).slice(0,5).map(c=>(
            <View key={c.id} style={{backgroundColor:C.card,borderRadius:R.lg,padding:12,marginBottom:8,flexDirection:'row',alignItems:'center',borderWidth:S.hairline,borderColor:C.border}}>
              <Avatar name={c.name} colour={C.purple} size={38} />
              <View style={{flex:1,marginLeft:12}}>
                <Text style={{color:C.text,fontSize:FONT.sm,fontWeight:'600'}}>{c.name}</Text>
                <Text style={{color:C.textSub,fontSize:FONT.xs}}>{c.role}</Text>
              </View>
              <StarRating rating={parseFloat(c.rating||4.0)} />
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function FreelancerScreen({ store }) {
  const {myProfile,shifts,invoices,projects} = store;
  const [available,setAvailable] = useState(myProfile.available);
  const [activeTab,setActiveTab] = useState('overview');
  const myShifts=shifts.filter(s=>s.status!=='completed').slice(0,5);
  const myInvoices=invoices.slice(0,5);
  const earned=myProfile.earnings;
  const earningsData=[
    {label:'Sep',value:5200},{label:'Oct',value:8400},{label:'Nov',value:6100},
    {label:'Dec',value:9800},{label:'Jan',value:7300},{label:'Feb',value:8450},
  ];
  const maxEarned=Math.max(...earningsData.map(d=>d.value));
  return (
    <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,paddingBottom:100}}>
      <View style={{backgroundColor:C.card,borderRadius:R.xl,padding:20,marginBottom:20,borderWidth:S.hairline,borderColor:C.border}}>
        <View style={{flexDirection:'row',alignItems:'center',marginBottom:14}}>
          <Avatar name={myProfile.name} colour={C.gold} size={64} />
          <View style={{flex:1,marginLeft:16}}>
            <Text style={{color:C.text,fontSize:FONT.xl,fontWeight:'800',letterSpacing:-0.3}}>{myProfile.name}</Text>
            <Text style={{color:C.textSub,fontSize:FONT.sm}}>{myProfile.role}</Text>
            <Text style={{color:C.textMuted,fontSize:FONT.xs}}>{myProfile.company}</Text>
          </View>
          <View style={{alignItems:'center'}}>
            <Switch value={available} onValueChange={setAvailable} trackColor={{false:C.surface,true:C.green+'66'}} thumbColor={available?C.green:C.textMuted} />
            <Text style={{color:available?C.green:C.textMuted,fontSize:FONT.xs,marginTop:4,fontWeight:'600'}}>{available?'Available':'Offline'}</Text>
          </View>
        </View>
        <Text style={{color:C.textSub,fontSize:FONT.sm,lineHeight:20,marginBottom:14}}>{myProfile.bio}</Text>
        <View style={{flexDirection:'row',flexWrap:'wrap',marginBottom:14}}>
          {myProfile.skills.map((sk,i)=><View key={i} style={{marginRight:6,marginBottom:6}}><Chip label={sk} colour={C.gold} small /></View>)}
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-around',borderTopWidth:S.hairline,borderColor:C.border,paddingTop:14}}>
          <View style={{alignItems:'center'}}>
            <Text style={{color:C.gold,fontSize:FONT.xl,fontWeight:'800'}}>{myProfile.completedJobs}</Text>
            <Text style={{color:C.textMuted,fontSize:FONT.xs}}>Jobs</Text>
          </View>
          <View style={{alignItems:'center'}}>
            <Text style={{color:C.green,fontSize:FONT.xl,fontWeight:'800'}}>{myProfile.rating}</Text>
            <Text style={{color:C.textMuted,fontSize:FONT.xs}}>Rating</Text>
          </View>
          <View style={{alignItems:'center'}}>
            <Text style={{color:C.teal,fontSize:FONT.xl,fontWeight:'800'}}>{fmtCurrency(myProfile.rate)}</Text>
            <Text style={{color:C.textMuted,fontSize:FONT.xs}}>Day Rate</Text>
          </View>
        </View>
      </View>
      <View style={{flexDirection:'row',backgroundColor:C.card,borderRadius:R.full,padding:4,marginBottom:20,borderWidth:S.hairline,borderColor:C.border}}>
        {['overview','shifts','invoices'].map(t=>(
          <TouchableOpacity key={t} onPress={()=>setActiveTab(t)} style={{flex:1,paddingVertical:9,borderRadius:R.full,backgroundColor:activeTab===t?C.gold:'transparent',alignItems:'center'}}>
            <Text style={{color:activeTab===t?C.bg:C.textSub,fontSize:FONT.sm,fontWeight:'700',textTransform:'capitalize'}}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {activeTab==='overview'&&(
        <View>
          <View style={{flexDirection:'row',marginHorizontal:-4,marginBottom:10}}>
            <KPICard label="This Month" value={fmtCurrency(earned.thisMonth)} sub="earned" colour={C.gold} icon="P" />
            <KPICard label="Last Month" value={fmtCurrency(earned.lastMonth)} sub="earned" colour={C.teal} icon="%" />
          </View>
          <View style={{flexDirection:'row',marginHorizontal:-4,marginBottom:20}}>
            <KPICard label="YTD Total" value={fmtCurrency(earned.ytd)} sub="year to date" colour={C.green} icon="Y" />
            <KPICard label="Day Rate" value={fmtCurrency(myProfile.rate)} sub="current rate" colour={C.purple} icon="R" />
          </View>
          <View style={{backgroundColor:C.card,borderRadius:R.lg,padding:16,marginBottom:20,borderWidth:S.hairline,borderColor:C.border}}>
            <SectionHeader title="Earnings - Last 6 Months" />
            <View style={{flexDirection:'row',alignItems:'flex-end',height:100}}>
              {earningsData.map((d,i)=>{
                const h=maxEarned>0?(d.value/maxEarned)*80:0;
                return (
                  <View key={i} style={{flex:1,alignItems:'center',marginHorizontal:3}}>
                    <Text style={{color:C.textMuted,fontSize:9,marginBottom:3}}>{(d.value/1000).toFixed(1)}k</Text>
                    <View style={{width:'100%',height:h,backgroundColor:C.gold,borderRadius:4,opacity:0.85}} />
                    <Text style={{color:C.textMuted,fontSize:FONT.xs,marginTop:4}}>{d.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>
          <SectionHeader title="Rate Cards" />
          <View style={{flexDirection:'row',marginHorizontal:-4}}>
            {[{label:'Half Day',rate:myProfile.rate/2,hours:4},{label:'Full Day',rate:myProfile.rate,hours:10},{label:'Weekly',rate:myProfile.rate*5*0.9,hours:50}].map((card,i)=>(
              <View key={i} style={{flex:1,backgroundColor:C.card,borderRadius:R.lg,padding:14,marginHorizontal:4,borderWidth:S.hairline,borderColor:C.border,alignItems:'center'}}>
                <Text style={{color:C.textSub,fontSize:FONT.xs,marginBottom:4,textTransform:'uppercase',letterSpacing:0.4}}>{card.label}</Text>
                <Text style={{color:C.gold,fontSize:FONT.lg,fontWeight:'800'}}>{fmtCurrency(card.rate)}</Text>
                <Text style={{color:C.textMuted,fontSize:FONT.xs,marginTop:2}}>{card.hours}h</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      {activeTab==='shifts'&&(
        <View>
          <SectionHeader title="Upcoming Shifts" />
          {myShifts.length===0?<EmptyState icon="S" title="No upcoming shifts" sub="Your scheduled shifts will appear here" />:
            myShifts.map(s=>{
              const proj=projects.find(p=>p.id===s.projectId);
              return (
                <View key={s.id} style={{backgroundColor:C.card,borderRadius:R.lg,padding:14,marginBottom:10,borderWidth:S.hairline,borderColor:C.border,borderLeftWidth:3,borderLeftColor:C.teal}}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                    <Text style={{color:C.gold,fontSize:FONT.base,fontWeight:'700'}}>{shortDate(s.date)}</Text>
                    <StatusChip status={s.status} />
                  </View>
                  <Text style={{color:C.text,fontSize:FONT.base,fontWeight:'600'}}>{proj?.name||'Unknown project'}</Text>
                  <Text style={{color:C.textSub,fontSize:FONT.sm}}>{s.role||'Crew'} | {s.start}-{s.end}</Text>
                  {s.location?<Text style={{color:C.textMuted,fontSize:FONT.xs,marginTop:4}}>{s.location}</Text>:null}
                  <Text style={{color:C.green,fontSize:FONT.sm,fontWeight:'600',marginTop:6}}>Est. {fmtCurrency(myProfile.rate)}</Text>
                </View>
              );
            })
          }
        </View>
      )}
      {activeTab==='invoices'&&(
        <View>
          <SectionHeader title="Recent Invoices" />
          {myInvoices.map(inv=>(
            <View key={inv.id} style={{backgroundColor:C.card,borderRadius:R.lg,padding:14,marginBottom:8,flexDirection:'row',alignItems:'center',borderWidth:S.hairline,borderColor:C.border}}>
              <View style={{flex:1}}>
                <Text style={{color:C.text,fontSize:FONT.base,fontWeight:'700'}}>{inv.number}</Text>
                <Text style={{color:C.textSub,fontSize:FONT.sm}}>{inv.client}</Text>
                <Text style={{color:C.textMuted,fontSize:FONT.xs}}>Due: {shortDate(inv.due)}</Text>
              </View>
              <View style={{alignItems:'flex-end'}}>
                <Text style={{color:C.gold,fontSize:FONT.lg,fontWeight:'800'}}>{fmtCurrency(inv.amount)}</Text>
                <StatusChip status={inv.status} />
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}


function MoreScreen({ store }) {
  const {crew,projects,invoices,shifts} = store;
  const [notifs,setNotifs] = useState(true);
  const [darkMode,setDarkMode] = useState(true);
  const [currency,setCurrency] = useState('GBP');
  const stats=[
    {label:'Crew Members',value:crew.length,colour:C.purple},
    {label:'Active Projects',value:projects.filter(p=>p.status==='active').length,colour:C.teal},
    {label:'Invoices',value:invoices.length,colour:C.gold},
    {label:'Total Shifts',value:shifts.length,colour:C.green},
  ];
  const MenuItem=({label,sub,right,onPress,colour})=>(
    <TouchableOpacity onPress={onPress} style={{flexDirection:'row',alignItems:'center',paddingVertical:14,borderBottomWidth:S.hairline,borderColor:C.borderFaint}}>
      <View style={{flex:1}}>
        <Text style={{color:colour||C.text,fontSize:FONT.base,fontWeight:'600'}}>{label}</Text>
        {sub?<Text style={{color:C.textSub,fontSize:FONT.xs,marginTop:2}}>{sub}</Text>:null}
      </View>
      {right||<Text style={{color:C.textMuted,fontSize:FONT.base}}>{'>'}</Text>}
    </TouchableOpacity>
  );
  return (
    <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,paddingBottom:100}}>
      <View style={{marginBottom:24}}>
        <Text style={{color:C.textSub,fontSize:FONT.sm,fontWeight:'500',letterSpacing:1.5,textTransform:'uppercase',marginBottom:4}}>Settings</Text>
        <Text style={{color:C.text,fontSize:FONT.xxxl,fontWeight:'800',letterSpacing:-1}}>More</Text>
      </View>
      <View style={{backgroundColor:C.card,borderRadius:R.xl,padding:20,marginBottom:20,flexDirection:'row',alignItems:'center',borderWidth:S.hairline,borderColor:C.border}}>
        <Avatar name="Jordan Blake" colour={C.gold} size={56} />
        <View style={{flex:1,marginLeft:16}}>
          <Text style={{color:C.text,fontSize:FONT.lg,fontWeight:'700'}}>Jordan Blake</Text>
          <Text style={{color:C.textSub,fontSize:FONT.sm}}>Line Producer</Text>
          <Text style={{color:C.textMuted,fontSize:FONT.xs}}>jordan.blake@crewdesk.io</Text>
        </View>
        <View style={{backgroundColor:C.gold+'22',borderRadius:R.full,paddingHorizontal:10,paddingVertical:5}}>
          <Text style={{color:C.gold,fontSize:FONT.xs,fontWeight:'700'}}>PRO</Text>
        </View>
      </View>
      <View style={{flexDirection:'row',flexWrap:'wrap',marginHorizontal:-4,marginBottom:20}}>
        {stats.map((s,i)=>(
          <View key={i} style={{width:'48%',backgroundColor:C.card,borderRadius:R.lg,padding:14,margin:4,borderWidth:S.hairline,borderColor:C.border}}>
            <Text style={{color:s.colour,fontSize:FONT.xl,fontWeight:'800'}}>{s.value}</Text>
            <Text style={{color:C.textSub,fontSize:FONT.xs,marginTop:4}}>{s.label}</Text>
          </View>
        ))}
      </View>
      <View style={{backgroundColor:C.card,borderRadius:R.lg,paddingHorizontal:16,marginBottom:16,borderWidth:S.hairline,borderColor:C.border}}>
        <Text style={{color:C.textSub,fontSize:FONT.xs,fontWeight:'700',letterSpacing:1,textTransform:'uppercase',paddingVertical:12}}>Preferences</Text>
        <MenuItem label="Push Notifications" sub="Shifts, invoices, messages" right={<Switch value={notifs} onValueChange={setNotifs} trackColor={{false:C.surface,true:C.teal+'66'}} thumbColor={notifs?C.teal:C.textMuted} />} />
        <MenuItem label="Dark Mode" sub="Premium dark interface" right={<Switch value={darkMode} onValueChange={setDarkMode} trackColor={{false:C.surface,true:C.gold+'66'}} thumbColor={darkMode?C.gold:C.textMuted} />} />
        <MenuItem label="Currency" sub="Display currency" right={<Text style={{color:C.gold,fontWeight:'700'}}>{currency}</Text>} onPress={()=>setCurrency(c=>c==='GBP'?'USD':'GBP')} />
        <MenuItem label="Language" sub="English (UK)" right={<Text style={{color:C.textSub,fontWeight:'600'}}>EN</Text>} />
      </View>
      <View style={{backgroundColor:C.card,borderRadius:R.lg,paddingHorizontal:16,marginBottom:16,borderWidth:S.hairline,borderColor:C.border}}>
        <Text style={{color:C.textSub,fontSize:FONT.xs,fontWeight:'700',letterSpacing:1,textTransform:'uppercase',paddingVertical:12}}>App</Text>
        <MenuItem label="Export Data" sub="Download all your data" />
        <MenuItem label="Backup and Sync" sub="Cloud backup enabled" />
        <MenuItem label="Integrations" sub="Xero, QuickBooks, Google Cal" />
        <MenuItem label="API Access" sub="Connect third-party tools" />
      </View>
      <View style={{backgroundColor:C.card,borderRadius:R.lg,paddingHorizontal:16,marginBottom:16,borderWidth:S.hairline,borderColor:C.border}}>
        <Text style={{color:C.textSub,fontSize:FONT.xs,fontWeight:'700',letterSpacing:1,textTransform:'uppercase',paddingVertical:12}}>Support</Text>
        <MenuItem label="Help Centre" sub="Guides and tutorials" />
        <MenuItem label="Send Feedback" sub="Help us improve CrewDesk" />
        <MenuItem label="Rate the App" sub="5 stars appreciated!" />
        <MenuItem label="Privacy Policy" sub="How we use your data" />
      </View>
      <View style={{alignItems:'center',paddingVertical:20}}>
        <Text style={{color:C.textMuted,fontSize:FONT.xs}}>CrewDesk v11.0.0</Text>
        <Text style={{color:C.textMuted,fontSize:FONT.xs}}>Built with Expo SDK 54</Text>
      </View>
    </ScrollView>
  );
}

const TABS = [
  {id:'Home',label:'Home',icon:'H',colour:C.gold},
  {id:'Business',label:'Business',icon:'B',colour:C.green},
  {id:'Projects',label:'Projects',icon:'P',colour:C.teal},
  {id:'Crew',label:'Crew',icon:'C',colour:C.purple},
  {id:'Schedule',label:'Schedule',icon:'S',colour:C.orange},
  {id:'Messages',label:'Messages',icon:'M',colour:C.blue},
  {id:'Invoices',label:'Invoices',icon:'I',colour:C.gold},
  {id:'Reports',label:'Reports',icon:'R',colour:C.pink},
  {id:'Portal',label:'Portal',icon:'*',colour:C.teal},
  {id:'More',label:'More',icon:'+',colour:C.textSub},
];

function TabBar({ active, setTab, unreadCount }) {
  return (
    <View style={{position:'absolute',bottom:0,left:0,right:0,backgroundColor:C.surface,borderTopWidth:S.hairline,borderColor:C.border,paddingBottom:Platform.OS==='ios'?24:0}}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:8}}>
        {TABS.map(t=>{
          const isActive=active===t.id;
          const badge=t.id==='Messages'&&unreadCount>0;
          return (
            <TouchableOpacity key={t.id} onPress={()=>setTab(t.id)} style={{alignItems:'center',paddingVertical:10,paddingHorizontal:14,minWidth:62}}>
              <View style={{position:'relative'}}>
                <View style={{width:34,height:34,borderRadius:R.full,backgroundColor:isActive?t.colour+'22':'transparent',alignItems:'center',justifyContent:'center',borderWidth:isActive?1.5:0,borderColor:isActive?t.colour+'66':'transparent'}}>
                  <Text style={{color:isActive?t.colour:C.textMuted,fontSize:FONT.sm,fontWeight:'800'}}>{t.icon}</Text>
                </View>
                {badge&&<View style={{position:'absolute',top:-2,right:-2,width:14,height:14,borderRadius:7,backgroundColor:t.colour,alignItems:'center',justifyContent:'center'}}>
                  <Text style={{color:C.bg,fontSize:8,fontWeight:'800'}}>{unreadCount}</Text>
                </View>}
              </View>
              <Text style={{color:isActive?t.colour:C.textMuted,fontSize:9,fontWeight:isActive?'700':'500',marginTop:3,letterSpacing:0.2}}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default function App() {
  const [activeTab,setActiveTab] = useState('Home');
  const store = useStore();
  const unreadCount = store.threads.reduce((a,t)=>a+t.unread,0);
  const setTab = (id) => setActiveTab(id);
  const screens = {
    Home:     <HomeScreen store={store} setTab={setTab} />,
    Business: <BusinessScreen store={store} />,
    Projects: <ProjectsScreen store={store} />,
    Crew:     <CrewScreen store={store} />,
    Schedule: <ScheduleScreen store={store} />,
    Messages: <MessagesScreen store={store} />,
    Invoices: <InvoicesScreen store={store} />,
    Reports:  <ReportsScreen store={store} />,
    Portal:   <FreelancerScreen store={store} />,
    More:     <MoreScreen store={store} />,
  };
  return (
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <View style={{flex:1}}>
        {screens[activeTab]}
      </View>
      <TabBar active={activeTab} setTab={setTab} unreadCount={unreadCount} />
    </SafeAreaView>
  );
}
