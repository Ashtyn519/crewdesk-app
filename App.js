
import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput, Modal,
  Alert, Animated, RefreshControl, Platform,
  StatusBar, Dimensions, PanResponder, ActivityIndicator, KeyboardAvoidingView,
} from 'react-native';

const { width: SW, height: SH } = Dimensions.get('window');

const C = {
  bg:'#050911', surface:'#0C1320', card:'#101828', border:'#1E2D45', border2:'#253550',
  gold:'#F59E0B', goldBg:'rgba(245,158,11,0.12)',
  teal:'#06B6D4', tealBg:'rgba(6,182,212,0.12)',
  purple:'#8B5CF6', purpleBg:'rgba(139,92,246,0.12)',
  green:'#10B981', greenBg:'rgba(16,185,129,0.12)',
  red:'#EF4444', redBg:'rgba(239,68,68,0.12)',
  blue:'#3B82F6', blueBg:'rgba(59,130,246,0.12)',
  orange:'#F97316', orangeBg:'rgba(249,115,22,0.12)',
  pink:'#EC4899', pinkBg:'rgba(236,72,153,0.12)',
  txt:'#F1F5F9', txt2:'#94A3B8', txt3:'#475569', white:'#FFFFFF', overlay:'rgba(5,9,17,0.94)',
};

const uid = () => Math.random().toString(36).slice(2,10);
const fmt = (d) => { if (!d) return '—'; const o = new Date(d); return o.toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}); };
const daysUntil = (d) => { if (!d) return null; const diff = new Date(d) - new Date(); return Math.round(diff / 86400000); };
const fmtDue = (d) => { const n = daysUntil(d); if (n === null) return '—'; if (n < 0) return Math.abs(n)+'d overdue'; if (n === 0) return 'due today'; if (n <= 7) return 'due in '+n+'d'; return fmt(d); };
const fmtMoney = (n) => { const v = parseFloat(n)||0; return v.toLocaleString('en-GB',{style:'currency',currency:'GBP',minimumFractionDigits:0}); };
const clamp = (v, mn, mx) => Math.max(mn, Math.min(mx, v));

const ROLES = ['Director','Producer','1st AD','2nd AD','DP','Camera Op','Gaffer','Grip','Sound Mixer','Boom Op','Art Director','Set Designer','Costume Designer','Make-up Artist','Editor','VFX Supervisor','Location Manager','Production Manager','Coordinator','Runner'];
const STATUSES = ['Active','Wrapped','Pre-Production','Development','Post-Production','On Hold'];
const INV_STATUSES = ['Draft','Sent','Paid','Overdue','Cancelled'];
const SHIFT_TYPES = ['Call Time','Shoot Day','Travel','Wrap','Pre-Prod','Post'];
const COLORS_LIST = [C.gold, C.teal, C.purple, C.green, C.blue, C.orange, C.pink, C.red];
const FAKE_FILES = ['Invoice_Brief.pdf','Contract_Signed.pdf','Budget_Breakdown.pdf','Call_Sheet.pdf','Location_Agreement.pdf','Crew_Deal_Memo.pdf','Shooting_Schedule.pdf','Equipment_List.pdf'];

const TODAY = new Date().toISOString().split('T')[0];
const addDays = (d, n) => { const o = new Date(d); o.setDate(o.getDate()+n); return o.toISOString().split('T')[0]; };

const INIT_DATA = (() => {
  const projects = [
    { id:'p1', title:'The Last Signal', client:'Horizon Films', status:'Active', colour:C.gold, budget:85000, spent:52000, start:'2026-01-10', end:'2026-04-30', crew:['c1','c2','c3'], desc:'Feature film thriller set in London.' },
    { id:'p2', title:'Brand Relaunch TVC', client:'Vanta Corp', status:'Pre-Production', colour:C.teal, budget:28000, spent:8500, start:'2026-02-01', end:'2026-03-15', crew:['c2','c4'], desc:'30-second brand commercial for broadcast.' },
    { id:'p3', title:'Echoes Documentary', client:'BBC Studios', status:'Post-Production', colour:C.purple, budget:120000, spent:97000, start:'2025-09-01', end:'2026-06-30', crew:['c1','c3','c5'], desc:'Feature documentary on urban music scene.' },
    { id:'p4', title:'Summer Campaign', client:'Nova Brands', status:'Wrapped', colour:C.green, budget:15000, spent:15200, start:'2025-06-01', end:'2025-08-31', crew:['c4','c5'], desc:'Multi-platform digital campaign.' },
  ];
  const crew = [
    { id:'c1', name:'Alex Kim',   role:'Director',  rate:850, colour:C.gold,   available:true,  phone:'+44 7700 900001', email:'alex@crew.co', tags:['Drama','TVC'], contracts:[{id:'ct1',project:'The Last Signal',rate:850,start:'2026-01-10',end:'2026-04-30',notes:'Full feature deal'}] },
    { id:'c2', name:'Beth Lane',  role:'Producer',  rate:700, colour:C.teal,   available:true,  phone:'+44 7700 900002', email:'beth@crew.co', tags:['Feature','Doc'], contracts:[] },
    { id:'c3', name:'Carl Moss',  role:'DP',        rate:950, colour:C.purple, available:false, phone:'+44 7700 900003', email:'carl@crew.co', tags:['Drama'], contracts:[{id:'ct2',project:'Echoes Documentary',rate:800,start:'2025-09-01',end:'2026-06-30',notes:'Day rate deal'}] },
    { id:'c4', name:'Dana Shah',  role:'Production Manager', rate:600, colour:C.green, available:true, phone:'+44 7700 900004', email:'dana@crew.co', tags:['TVC','Digital'], contracts:[] },
    { id:'c5', name:'Evan Price', role:'Sound Mixer', rate:550, colour:C.blue, available:true,  phone:'+44 7700 900005', email:'evan@crew.co', tags:['Doc','Drama'], contracts:[] },
  ];
  const shifts = [
    { id:'s1', title:'Principal Photography Day 1', project:'p1', type:'Shoot Day', date:addDays(TODAY,1), start:'06:00', end:'18:00', location:'Canary Wharf, London', crew:['c1','c2','c3'], notes:'Full unit day.' },
    { id:'s2', title:'Location Recce', project:'p2', type:'Pre-Prod', date:addDays(TODAY,3), start:'09:00', end:'13:00', location:'Shoreditch, London', crew:['c2','c4'], notes:'Scout 3 locations.' },
    { id:'s3', title:'Audio Suite Session', project:'p3', type:'Post', date:addDays(TODAY,5), start:'10:00', end:'17:00', location:'Soho, London', crew:['c5'], notes:'Final mix session.' },
    { id:'s4', title:'Wrap Party', project:'p4', type:'Wrap', date:addDays(TODAY,-2), start:'19:00', end:'23:00', location:'Brixton, London', crew:['c1','c2','c3','c4','c5'], notes:'End of project wrap.' },
  ];
  const threads = [
    { id:'t1', subject:'Call Sheet Tomorrow', participants:['Alex Kim','You'], colour:C.gold, avatar:'AK',
      messages:[
        { id:'tm1', sender:'Alex Kim', text:'Hey, call sheet for tomorrow is ready. 6am unit call at Canary Wharf. Please confirm.', ts:new Date(Date.now()-7200000).toISOString(), isMe:false },
        { id:'tm2', sender:'You', text:'Confirmed, see you on set.', ts:new Date(Date.now()-5400000).toISOString(), isMe:true },
        { id:'tm3', sender:'Alex Kim', text:'Great! Wardrobe prep from 5:30am if you need it.', ts:new Date(Date.now()-3600000).toISOString(), isMe:false },
      ], unread:1 },
    { id:'t2', subject:'Budget Revision - Vanta', participants:['Beth Lane','You'], colour:C.teal, avatar:'BL',
      messages:[
        { id:'tm4', sender:'Beth Lane', text:'Budget revision sent over. Vanta Corp approved the extra day rate for the reshoot.', ts:new Date(Date.now()-86400000).toISOString(), isMe:false },
        { id:'tm5', sender:'You', text:'Brilliant, thanks for sorting that quickly.', ts:new Date(Date.now()-82800000).toISOString(), isMe:true },
      ], unread:1 },
    { id:'t3', subject:'Lens Package Confirmed', participants:['Carl Moss','You'], colour:C.purple, avatar:'CM',
      messages:[{ id:'tm6', sender:'Carl Moss', text:'Lens package confirmed. Cooke Anamorphic set for the whole shoot.', ts:new Date(Date.now()-172800000).toISOString(), isMe:false }],
      unread:0 },
    { id:'t4', subject:'Location Permits Cleared', participants:['Dana Shah','You'], colour:C.green, avatar:'DS',
      messages:[{ id:'tm7', sender:'Dana Shah', text:'All location permits cleared. We are good to go for day one.', ts:new Date(Date.now()-259200000).toISOString(), isMe:false }],
      unread:0 },
  ];
  const invoices = [
    { id:'i1', number:'INV-0041', client:'Horizon Films', project:'p1', amount:12500, status:'Sent', issue:'2026-02-01', due:addDays(TODAY,3), paid:null, notes:'First production instalment.', attachments:['Invoice_Brief.pdf'] },
    { id:'i2', number:'INV-0040', client:'Vanta Corp', project:'p2', amount:8750, status:'Paid', issue:'2026-01-15', due:'2026-02-15', paid:'2026-02-12', notes:'Pre-production services.', attachments:[] },
    { id:'i3', number:'INV-0039', client:'BBC Studios', project:'p3', amount:21000, status:'Overdue', issue:'2026-01-01', due:addDays(TODAY,-10), paid:null, notes:'Documentary phase 2.', attachments:['Contract_Signed.pdf','Budget_Breakdown.pdf'] },
    { id:'i4', number:'INV-0038', client:'Nova Brands', project:'p4', amount:5000, status:'Draft', issue:'2026-02-20', due:addDays(TODAY,14), paid:null, notes:'Final campaign delivery.', attachments:[] },
  ];
  const activity = [
    { id:'a1', user:'Alex Kim',  avatar:'AK', colour:C.gold,   verb:'created project',    target:'The Last Signal',     time:'2 min ago' },
    { id:'a2', user:'Beth Lane', avatar:'BL', colour:C.teal,   verb:'marked invoice paid', target:'INV-0040',            time:'1 hr ago' },
    { id:'a3', user:'Carl Moss', avatar:'CM', colour:C.purple, verb:'uploaded file',       target:'Budget_Breakdown.pdf',time:'3 hr ago' },
    { id:'a4', user:'Dana Shah', avatar:'DS', colour:C.green,  verb:'scheduled shift',     target:'Location Recce',      time:'Yesterday' },
    { id:'a5', user:'Evan Price',avatar:'EP', colour:C.blue,   verb:'added crew member',   target:'Carl Moss',           time:'2 days ago' },
  ];
  const freelancer = {
    name:'Alex Kim', role:'Director', rate:850, available:true,
    skills:['Drama','Documentary','TVC','Commercial','Music Video'],
    bio:'Award-winning director with 10 years experience across film, TV and branded content.',
    phone:'+44 7700 900001', email:'alex@crew.co', colour:C.gold,
    earnings:[
      { month:'Jan', amount:8500 }, { month:'Feb', amount:12750 }, { month:'Mar', amount:6800 },
      { month:'Apr', amount:14200 }, { month:'May', amount:9600 }, { month:'Jun', amount:11000 },
    ],
    upcomingShifts:['s1'], contracts:1,
  };
  return { projects, crew, shifts, threads, invoices, activity, freelancer };
})();


function useStore() {
  const [projects,setProjects]     = useState(INIT_DATA.projects);
  const [crew,setCrew]             = useState(INIT_DATA.crew);
  const [shifts,setShifts]         = useState(INIT_DATA.shifts);
  const [threads,setThreads]       = useState(INIT_DATA.threads);
  const [invoices,setInvoices]     = useState(INIT_DATA.invoices);
  const [activity,setActivity]     = useState(INIT_DATA.activity);
  const [freelancer,setFreelancer] = useState(INIT_DATA.freelancer);

  const logActivity = (user, verb, target) => setActivity(a=>[{id:uid(),user,avatar:user.split(' ').map(w=>w[0]).join(''),colour:C.teal,verb,target,time:'Just now'},...a].slice(0,20));

  const addProject    = (p) => { setProjects(ps=>[{...p,id:uid(),crew:[]},...ps]); logActivity('You','created project',p.title); };
  const updateProject = (p) => setProjects(ps=>ps.map(x=>x.id===p.id?p:x));
  const deleteProject = (id) => setProjects(ps=>ps.filter(x=>x.id!==id));
  const assignCrew    = (pid,cid) => setProjects(ps=>ps.map(p=>p.id!==pid?p:({...p,crew:p.crew.includes(cid)?p.crew.filter(x=>x!==cid):[...p.crew,cid]})));

  const addCrew    = (c) => { setCrew(cs=>[{...c,id:uid(),contracts:[]},...cs]); logActivity('You','added crew member',c.name); };
  const updateCrew = (c) => setCrew(cs=>cs.map(x=>x.id===c.id?c:x));
  const deleteCrew = (id) => setCrew(cs=>cs.filter(x=>x.id!==id));
  const toggleAvailability = (id) => setCrew(cs=>cs.map(c=>c.id===id?{...c,available:!c.available}:c));
  const addContract    = (cid,ct) => setCrew(cs=>cs.map(c=>c.id!==cid?c:{...c,contracts:[...(c.contracts||[]),{...ct,id:uid()}]}));
  const removeContract = (cid,ctid) => setCrew(cs=>cs.map(c=>c.id!==cid?c:{...c,contracts:(c.contracts||[]).filter(x=>x.id!==ctid)}));

  const addShift    = (s) => { setShifts(ss=>[{...s,id:uid()},...ss]); logActivity('You','scheduled shift',s.title); };
  const updateShift = (s) => setShifts(ss=>ss.map(x=>x.id===s.id?s:x));
  const deleteShift = (id) => setShifts(ss=>ss.filter(x=>x.id!==id));

  const sendMessage = (threadId, text) => {
    if (!text.trim()) return;
    const msg = { id:uid(), sender:'You', text:text.trim(), ts:new Date().toISOString(), isMe:true };
    setThreads(ts=>ts.map(t=>t.id!==threadId?t:{...t,messages:[...t.messages,msg],unread:0}));
  };
  const markThreadRead = (threadId) => setThreads(ts=>ts.map(t=>t.id!==threadId?t:{...t,unread:0}));
  const deleteThread  = (threadId) => setThreads(ts=>ts.filter(t=>t.id!==threadId));
  const newThread = (subject, participantName, participantColour, firstMsg) => {
    const initials = participantName.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    const colour = participantColour || COLORS_LIST[Math.floor(Math.random()*COLORS_LIST.length)];
    setThreads(ts=>[{ id:uid(), subject, participants:[participantName,'You'], colour, avatar:initials, messages:[{id:uid(),sender:'You',text:firstMsg,ts:new Date().toISOString(),isMe:true}], unread:0 },...ts]);
  };
  const deleteMessage = (threadId, msgId) => {
    setThreads(ts=>ts.map(t=>{
      if (t.id!==threadId) return t;
      const msgs = t.messages.filter(m=>m.id!==msgId);
      if (msgs.length===0) return null;
      return {...t,messages:msgs};
    }).filter(Boolean));
  };

  const addInvoice    = (inv) => { setInvoices(is=>[{...inv,id:uid(),attachments:[]},...is]); logActivity('You','created invoice',inv.number); };
  const updateInvoice = (inv) => setInvoices(is=>is.map(x=>x.id===inv.id?inv:x));
  const deleteInvoice = (id)  => setInvoices(is=>is.filter(x=>x.id!==id));
  const addAttachment = (id,fname) => { setInvoices(is=>is.map(i=>i.id!==id?i:{...i,attachments:[...(i.attachments||[]),fname]})); logActivity('You','uploaded file',fname); };
  const removeAttachment = (id,fname) => setInvoices(is=>is.map(i=>i.id!==id?i:{...i,attachments:(i.attachments||[]).filter(f=>f!==fname)}));
  const markInvoicePaid = (id) => { setInvoices(is=>is.map(i=>i.id!==id?i:{...i,status:'Paid',paid:TODAY})); logActivity('You','marked invoice paid','Invoice'); };
  const markInvoiceSent = (id) => setInvoices(is=>is.map(i=>i.id!==id?i:{...i,status:'Sent'}));
  const updateFreelancer = (f) => setFreelancer(f);

  return {
    projects, crew, shifts, threads, invoices, activity, freelancer,
    addProject, updateProject, deleteProject, assignCrew,
    addCrew, updateCrew, deleteCrew, toggleAvailability, addContract, removeContract,
    addShift, updateShift, deleteShift,
    sendMessage, markThreadRead, deleteThread, newThread, deleteMessage,
    addInvoice, updateInvoice, deleteInvoice, addAttachment, removeAttachment, markInvoicePaid, markInvoiceSent,
    updateFreelancer,
  };
}

function PressCard({ onPress, style, children, accent }) {
  const sc = useRef(new Animated.Value(1)).current;
  const pr = () => { Animated.sequence([Animated.timing(sc,{toValue:0.97,duration:80,useNativeDriver:true}),Animated.timing(sc,{toValue:1,duration:120,useNativeDriver:true})]).start(); onPress&&onPress(); };
  return (
    <Animated.View style={{transform:[{scale:sc}]}}>
      <TouchableOpacity onPress={pr} activeOpacity={1} style={[{backgroundColor:C.card,borderRadius:16,borderWidth:1.5,borderColor:accent||C.border,overflow:'hidden'},style]}>
        {accent&&<View style={{position:'absolute',top:0,left:0,right:0,height:2,backgroundColor:accent,opacity:0.7}}/>}
        {children}
      </TouchableOpacity>
    </Animated.View>
  );
}
function Badge({ label, colour, small }) {
  return <View style={{backgroundColor:colour+'22',borderRadius:20,paddingHorizontal:small?8:10,paddingVertical:small?2:4,alignSelf:'flex-start'}}><Text style={{fontSize:small?10:12,fontWeight:'700',color:colour,letterSpacing:0.3}}>{label}</Text></View>;
}
function Avatar({ name, colour, size=36 }) {
  const i = name?name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase():'?';
  return <View style={{width:size,height:size,borderRadius:size/2,backgroundColor:colour||C.surface,alignItems:'center',justifyContent:'center',borderWidth:1.5,borderColor:C.border}}><Text style={{fontSize:size*0.35,fontWeight:'800',color:C.txt}}>{i}</Text></View>;
}
function AvatarStack({ ids, crew, size=28 }) {
  const members = ids.slice(0,4).map(id=>crew.find(c=>c.id===id)).filter(Boolean);
  return (
    <View style={{flexDirection:'row'}}>
      {members.map((m,i)=>(<View key={m.id} style={{marginLeft:i>0?-8:0,zIndex:members.length-i,borderWidth:1.5,borderColor:C.card,borderRadius:size/2}}><Avatar name={m.name} colour={m.colour} size={size}/></View>))}
      {ids.length>4&&<View style={{marginLeft:-8,width:size,height:size,borderRadius:size/2,backgroundColor:C.surface,borderWidth:1.5,borderColor:C.border,alignItems:'center',justifyContent:'center'}}><Text style={{fontSize:10,fontWeight:'700',color:C.txt2}}>+{ids.length-4}</Text></View>}
    </View>
  );
}
function SearchBar({ value, onChange, placeholder }) {
  return (
    <View style={{flexDirection:'row',alignItems:'center',backgroundColor:C.surface,borderRadius:14,borderWidth:1.5,borderColor:C.border,paddingHorizontal:14,marginBottom:12,height:44}}>
      <Text style={{fontSize:14,marginRight:8,color:C.txt3,fontWeight:'700'}}>S</Text>
      <TextInput value={value} onChangeText={onChange} placeholder={placeholder||'Search...'} placeholderTextColor={C.txt3} style={{flex:1,color:C.txt,fontSize:15}}/>
      {value.length>0&&<TouchableOpacity onPress={()=>onChange('')}><Text style={{color:C.txt3,fontSize:18,fontWeight:'700'}}>x</Text></TouchableOpacity>}
    </View>
  );
}
function SectionHdr({ title, action, onAction }) {
  return (<View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:10,marginTop:8}}><Text style={{fontSize:11,fontWeight:'600',color:C.txt3,letterSpacing:1.5,textTransform:'uppercase'}}>{title}</Text>{action&&<TouchableOpacity onPress={onAction}><Text style={{fontSize:13,fontWeight:'700',color:C.gold}}>{action}</Text></TouchableOpacity>}</View>);
}
function Empty({ icon, label }) {
  return <View style={{alignItems:'center',paddingVertical:40,opacity:0.5}}><Text style={{fontSize:36,marginBottom:8}}>{icon}</Text><Text style={{fontSize:13,color:C.txt2,textAlign:'center'}}>{label}</Text></View>;
}
function Sheet({ visible, onClose, title, children }) {
  const y = useRef(new Animated.Value(SH)).current;
  useEffect(()=>{ if(visible) Animated.spring(y,{toValue:0,useNativeDriver:true,damping:22,stiffness:200}).start(); else Animated.timing(y,{toValue:SH,duration:220,useNativeDriver:true}).start(); },[visible]);
  if(!visible) return null;
  return (
    <Modal transparent animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={{flex:1,backgroundColor:C.overlay}} onPress={onClose} activeOpacity={1}/>
      <Animated.View style={{position:'absolute',bottom:0,left:0,right:0,backgroundColor:C.surface,borderTopLeftRadius:24,borderTopRightRadius:24,maxHeight:SH*0.92,transform:[{translateY:y}]}}>
        <View style={{alignItems:'center',paddingTop:12,paddingBottom:4}}><View style={{width:40,height:4,backgroundColor:C.border2,borderRadius:2}}/></View>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingBottom:12,borderBottomWidth:1,borderColor:C.border}}>
          <Text style={{fontSize:17,fontWeight:'700',color:C.txt}}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={{width:32,height:32,borderRadius:16,backgroundColor:C.card,alignItems:'center',justifyContent:'center'}}><Text style={{color:C.txt2,fontSize:15,fontWeight:'800'}}>x</Text></TouchableOpacity>
        </View>
        <ScrollView style={{paddingHorizontal:20}} contentContainerStyle={{paddingBottom:40}} showsVerticalScrollIndicator={false}>{children}</ScrollView>
      </Animated.View>
    </Modal>
  );
}
function Field({ label, value }) {
  if(!value) return null;
  return <View style={{marginBottom:14}}><Text style={{fontSize:11,fontWeight:'600',color:C.txt3,letterSpacing:1,textTransform:'uppercase',marginBottom:4}}>{label}</Text><Text style={{fontSize:15,color:C.txt}}>{value}</Text></View>;
}
function TInput({ label, value, onChange, placeholder, multi, keyboardType, style }) {
  return (
    <View style={[{marginBottom:14},style]}>
      {label&&<Text style={{fontSize:11,fontWeight:'600',color:C.txt3,letterSpacing:1,textTransform:'uppercase',marginBottom:6}}>{label}</Text>}
      <TextInput value={value} onChangeText={onChange} placeholder={placeholder||label||''} placeholderTextColor={C.txt3} multiline={multi} keyboardType={keyboardType||'default'}
        style={{backgroundColor:C.card,borderRadius:12,borderWidth:1.5,borderColor:C.border,paddingHorizontal:14,paddingVertical:12,color:C.txt,fontSize:15,minHeight:multi?90:48,textAlignVertical:multi?'top':'center'}}/>
    </View>
  );
}
function Btn({ label, onPress, colour, style }) {
  const cl=colour||C.gold;
  return <TouchableOpacity onPress={onPress} style={[{backgroundColor:cl,borderRadius:14,paddingVertical:14,alignItems:'center',justifyContent:'center'},style]}><Text style={{color:C.bg,fontWeight:'800',fontSize:15,letterSpacing:0.3}}>{label}</Text></TouchableOpacity>;
}
function GhostBtn({ label, onPress, colour, style }) {
  const cl=colour||C.txt2;
  return <TouchableOpacity onPress={onPress} style={[{borderRadius:14,paddingVertical:12,alignItems:'center',borderWidth:1.5,borderColor:cl+'55'},style]}><Text style={{color:cl,fontWeight:'700',fontSize:14}}>{label}</Text></TouchableOpacity>;
}
function ProgressBar({ value, colour, height=6 }) {
  const pct=clamp(value||0,0,100);
  return <View style={{height,backgroundColor:C.surface,borderRadius:height/2,overflow:'hidden'}}><View style={{height,width:pct+'%',backgroundColor:colour||C.gold,borderRadius:height/2}}/></View>;
}
function AnimBar({ value, colour, label, maxVal }) {
  const anim=useRef(new Animated.Value(0)).current;
  useEffect(()=>{Animated.timing(anim,{toValue:value/maxVal,duration:900,useNativeDriver:false}).start();},[value,maxVal]);
  const w=anim.interpolate({inputRange:[0,1],outputRange:['0%','100%']});
  return (
    <View style={{marginBottom:12}}>
      <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:5}}><Text style={{fontSize:13,color:C.txt2}}>{label}</Text><Text style={{fontSize:13,fontWeight:'700',color:colour}}>{fmtMoney(value)}</Text></View>
      <View style={{height:8,backgroundColor:C.surface,borderRadius:4,overflow:'hidden'}}><Animated.View style={{height:8,width:w,backgroundColor:colour,borderRadius:4}}/></View>
    </View>
  );
}
function HR() { return <View style={{height:1,backgroundColor:C.border,marginVertical:16}}/>; }
function StatTile({ label, value, colour, sub }) {
  return <View style={{flex:1,backgroundColor:C.card,borderRadius:14,borderWidth:1.5,borderColor:colour+'33',padding:14}}><Text style={{fontSize:11,fontWeight:'600',color:C.txt3,letterSpacing:1,textTransform:'uppercase',marginBottom:6}}>{label}</Text><Text style={{fontSize:22,fontWeight:'800',color:colour,letterSpacing:-0.5}}>{value}</Text>{sub&&<Text style={{fontSize:11,color:C.txt3,marginTop:4}}>{sub}</Text>}</View>;
}
function AttachmentChip({ name, onRemove }) {
  return (
    <View style={{flexDirection:'row',alignItems:'center',backgroundColor:C.blueBg,borderRadius:20,paddingVertical:5,paddingHorizontal:10,marginRight:8,marginBottom:6,borderWidth:1,borderColor:C.blue+'33'}}>
      <Text style={{fontSize:11,color:C.blue,fontWeight:'700',marginRight:4}}>[pdf]</Text>
      <Text style={{fontSize:12,fontWeight:'600',color:C.blue,maxWidth:140}} numberOfLines={1}>{name}</Text>
      {onRemove&&<TouchableOpacity onPress={onRemove} style={{marginLeft:6}}><Text style={{color:C.txt3,fontWeight:'700'}}>x</Text></TouchableOpacity>}
    </View>
  );
}
function SwipeRow({ children, onDelete, onEdit }) {
  const x=useRef(new Animated.Value(0)).current;
  const panResponder=useRef(PanResponder.create({
    onMoveShouldSetPanResponder:(_,g)=>Math.abs(g.dx)>8&&Math.abs(g.dx)>Math.abs(g.dy),
    onPanResponderMove:(_,g)=>{ if(g.dx<0) x.setValue(Math.max(g.dx,-130)); },
    onPanResponderRelease:(_,g)=>{ if(g.dx<-60) Animated.spring(x,{toValue:-100,useNativeDriver:true,damping:20}).start(); else Animated.spring(x,{toValue:0,useNativeDriver:true,damping:20}).start(); },
  })).current;
  const close=()=>Animated.spring(x,{toValue:0,useNativeDriver:true,damping:20}).start();
  return (
    <View style={{overflow:'hidden',borderRadius:16,marginBottom:10}}>
      <View style={{position:'absolute',right:0,top:0,bottom:0,flexDirection:'row',alignItems:'stretch',width:onEdit?100:50}}>
        {onEdit&&<TouchableOpacity onPress={()=>{close();onEdit();}} style={{flex:1,backgroundColor:C.blue,alignItems:'center',justifyContent:'center'}}><Text style={{color:C.white,fontSize:11,fontWeight:'700'}}>Edit</Text></TouchableOpacity>}
        <TouchableOpacity onPress={()=>{close();onDelete();}} style={{flex:1,backgroundColor:C.red,alignItems:'center',justifyContent:'center',borderTopRightRadius:16,borderBottomRightRadius:16}}><Text style={{color:C.white,fontSize:11,fontWeight:'700'}}>Del</Text></TouchableOpacity>
      </View>
      <Animated.View {...panResponder.panHandlers} style={{transform:[{translateX:x}]}}>{children}</Animated.View>
    </View>
  );
}
function Pill({ label, active, onPress, colour }) {
  const cl=colour||C.gold;
  return <TouchableOpacity onPress={onPress} style={{paddingHorizontal:14,paddingVertical:7,borderRadius:20,backgroundColor:active?cl:C.card,borderWidth:1.5,borderColor:active?cl:C.border,marginRight:8}}><Text style={{fontSize:13,fontWeight:'700',color:active?C.bg:C.txt2}}>{label}</Text></TouchableOpacity>;
}
function ColourPicker({ value, onChange }) {
  return (<View style={{marginBottom:14}}><Text style={{fontSize:11,fontWeight:'600',color:C.txt3,letterSpacing:1,textTransform:'uppercase',marginBottom:8}}>Colour</Text><View style={{flexDirection:'row',flexWrap:'wrap'}}>{COLORS_LIST.map(c=>(<TouchableOpacity key={c} onPress={()=>onChange(c)} style={{width:32,height:32,borderRadius:16,backgroundColor:c,marginRight:8,marginBottom:8,borderWidth:value===c?3:0,borderColor:C.white}}/>))}</View></View>);
}
function StatusPicker({ label, value, options, onChange }) {
  return (<View style={{marginBottom:14}}><Text style={{fontSize:11,fontWeight:'600',color:C.txt3,letterSpacing:1,textTransform:'uppercase',marginBottom:8}}>{label||'Status'}</Text><ScrollView horizontal showsHorizontalScrollIndicator={false}>{options.map(o=>{const active=value===o;return <TouchableOpacity key={o} onPress={()=>onChange(o)} style={{paddingHorizontal:14,paddingVertical:8,borderRadius:20,backgroundColor:active?C.gold:C.card,borderWidth:1.5,borderColor:active?C.gold:C.border,marginRight:8}}><Text style={{fontSize:13,fontWeight:'700',color:active?C.bg:C.txt2}}>{o}</Text></TouchableOpacity>;})}</ScrollView></View>);
}


function HomeScreen({ store, onNav }) {
  const { projects, crew, invoices, shifts, activity } = store;
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = () => { setRefreshing(true); setTimeout(()=>setRefreshing(false),900); };
  const activeProjects = projects.filter(p=>p.status==='Active');
  const availCrew = crew.filter(c=>c.available).length;
  const unpaidTotal = invoices.filter(i=>i.status==='Sent'||i.status==='Overdue').reduce((s,i)=>s+i.amount,0);
  const nextShift = [...shifts].filter(s=>s.date>=TODAY).sort((a,b)=>a.date.localeCompare(b.date))[0];
  const attention = invoices.filter(i=>{ const d=daysUntil(i.due); return i.status!=='Paid'&&i.status!=='Cancelled'&&d!==null&&d<=7; });
  return (
    <ScrollView style={{flex:1,backgroundColor:C.bg}} contentContainerStyle={{paddingHorizontal:20,paddingBottom:32}} showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.gold}/>}>
      <View style={{paddingTop:20,paddingBottom:8,flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'}}>
        <View>
          <Text style={{fontSize:11,fontWeight:'600',color:C.gold,letterSpacing:1.5,textTransform:'uppercase',marginBottom:4}}>CrewDesk</Text>
          <Text style={{fontSize:28,fontWeight:'800',color:C.txt,letterSpacing:-0.5}}>Dashboard</Text>
          <Text style={{fontSize:13,color:C.txt2,marginTop:2}}>{fmt(TODAY)}</Text>
        </View>
        <View style={{flexDirection:'row',alignItems:'center',backgroundColor:C.greenBg,borderRadius:20,paddingHorizontal:10,paddingVertical:4,borderWidth:1,borderColor:C.green+'44',marginTop:8}}>
          <View style={{width:7,height:7,borderRadius:3.5,backgroundColor:C.green,marginRight:5}}/><Text style={{fontSize:12,fontWeight:'700',color:C.green}}>Live</Text>
        </View>
      </View>
      <View style={{flexDirection:'row',marginBottom:16}}>
        <StatTile label="Active" value={activeProjects.length} colour={C.gold} sub="projects"/>
        <View style={{width:10}}/>
        <StatTile label="Crew" value={availCrew+'/'+crew.length} colour={C.teal} sub="available"/>
        <View style={{width:10}}/>
        <StatTile label="Owing" value={fmtMoney(unpaidTotal)} colour={C.orange} sub="unpaid"/>
      </View>
      {attention.length>0&&(
        <View style={{marginBottom:20}}>
          <SectionHdr title={'Needs Attention ('+attention.length+')'} action="View All" onAction={()=>onNav('Invoices')}/>
          {attention.map(inv=>{
            const d=daysUntil(inv.due); const overdue=d<0;
            return (<TouchableOpacity key={inv.id} onPress={()=>onNav('Invoices')} style={{flexDirection:'row',alignItems:'center',backgroundColor:overdue?C.redBg:C.goldBg,borderRadius:14,padding:14,marginBottom:8,borderWidth:1.5,borderColor:overdue?C.red+'44':C.gold+'44'}}>
              <View style={{width:8,height:8,borderRadius:4,backgroundColor:overdue?C.red:C.gold,marginRight:12}}/>
              <View style={{flex:1}}><Text style={{fontSize:15,fontWeight:'700',color:C.txt}}>{inv.number}</Text><Text style={{fontSize:13,fontWeight:'600',color:overdue?C.red:C.gold}}>{inv.client} - {fmtMoney(inv.amount)}</Text></View>
              <Badge label={fmtDue(inv.due)} colour={overdue?C.red:C.gold} small/>
            </TouchableOpacity>);
          })}
        </View>
      )}
      <SectionHdr title="Active Projects" action="See All" onAction={()=>onNav('Projects')}/>
      {activeProjects.slice(0,3).map(p=>{
        const pct=p.budget>0?Math.round((p.spent/p.budget)*100):0;
        return (<PressCard key={p.id} accent={p.colour} style={{padding:16,marginBottom:10}} onPress={()=>onNav('Projects')}>
          <View style={{flexDirection:'row',alignItems:'center',marginBottom:8}}><View style={{width:10,height:10,borderRadius:5,backgroundColor:p.colour,marginRight:8}}/><Text style={{fontSize:15,fontWeight:'700',color:C.txt,flex:1}}>{p.title}</Text><Badge label={p.status} colour={p.colour} small/></View>
          <Text style={{fontSize:13,color:C.txt2,marginBottom:10}}>{p.client}</Text>
          <ProgressBar value={pct} colour={p.colour}/>
          <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:6}}><Text style={{fontSize:11,color:C.txt3}}>{pct}% spent</Text><Text style={{fontSize:11,fontWeight:'700',color:p.colour}}>{fmtMoney(p.spent)} / {fmtMoney(p.budget)}</Text></View>
        </PressCard>);
      })}
      {activeProjects.length===0&&<Empty icon="*" label="No active projects"/>}
      {nextShift&&(<View style={{marginTop:8}}>
        <SectionHdr title="Next Shift" action="Schedule" onAction={()=>onNav('Schedule')}/>
        <PressCard accent={C.teal} style={{padding:16}} onPress={()=>onNav('Schedule')}>
          <Text style={{fontSize:17,fontWeight:'700',color:C.txt,marginBottom:4}}>{nextShift.title}</Text>
          <Text style={{fontSize:13,fontWeight:'600',color:C.teal,marginBottom:4}}>{fmt(nextShift.date)} - {nextShift.start} to {nextShift.end}</Text>
          <Text style={{fontSize:13,color:C.txt2}}>{nextShift.location}</Text>
        </PressCard>
      </View>)}
      <View style={{marginTop:20}}>
        <SectionHdr title="Recent Activity"/>
        {activity.slice(0,5).map(a=>(
          <View key={a.id} style={{flexDirection:'row',alignItems:'flex-start',marginBottom:12,paddingBottom:12,borderBottomWidth:1,borderColor:C.border}}>
            <Avatar name={a.user} colour={a.colour} size={34}/>
            <View style={{flex:1,marginLeft:10}}>
              <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'center'}}><Text style={{fontSize:13,fontWeight:'700',color:C.txt}}>{a.user} </Text><Text style={{fontSize:13,color:C.txt2}}>{a.verb} </Text><Text style={{fontSize:13,fontWeight:'700',color:a.colour}}>{a.target}</Text></View>
              <Text style={{fontSize:11,color:C.txt3,marginTop:2}}>{a.time}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}


function ProjectsScreen({ store }) {
  const { projects, crew, addProject, updateProject, deleteProject, assignCrew } = store;
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [sheet, setSheet] = useState(null);
  const [detail, setDetail] = useState(null);
  const [assignSheet, setAssignSheet] = useState(null);
  const [form, setForm] = useState({title:'',client:'',status:'Active',colour:C.gold,budget:'',spent:'0',start:'',end:'',desc:''});
  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  const isEdit = sheet && sheet !== 'add';
  const openAdd  = () => { setForm({title:'',client:'',status:'Active',colour:C.gold,budget:'',spent:'0',start:'',end:'',desc:''}); setSheet('add'); };
  const openEdit = (p) => { setForm({...p,budget:String(p.budget),spent:String(p.spent)}); setSheet(p); };
  const save = () => {
    if (!form.title.trim()) return Alert.alert('Required','Project title is required.');
    const data = {...form,budget:parseFloat(form.budget)||0,spent:parseFloat(form.spent)||0};
    isEdit ? updateProject({...sheet,...data}) : addProject(data);
    setSheet(null);
  };
  const del = (p) => Alert.alert('Delete Project','Remove "'+p.title+'"?',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>{deleteProject(p.id);setDetail(null);}}]);
  const statuses = ['All',...STATUSES];
  const statusColour = {'Active':C.green,'Pre-Production':C.teal,'Post-Production':C.purple,'Wrapped':C.txt3,'Development':C.blue,'On Hold':C.orange};
  const visible = useMemo(()=>projects.filter(p=>{
    const s=filter==='All'||p.status===filter;
    const q=!search||p.title.toLowerCase().includes(search.toLowerCase())||p.client.toLowerCase().includes(search.toLowerCase());
    return s&&q;
  }),[projects,filter,search]);
  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <ScrollView contentContainerStyle={{paddingHorizontal:20,paddingBottom:100}} showsVerticalScrollIndicator={false}>
        <View style={{paddingTop:20,paddingBottom:4,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
          <Text style={{fontSize:22,fontWeight:'700',color:C.txt}}>Projects</Text>
          <TouchableOpacity onPress={openAdd} style={{backgroundColor:C.gold,borderRadius:12,paddingHorizontal:16,paddingVertical:8}}><Text style={{color:C.bg,fontWeight:'800',fontSize:14}}>+ New</Text></TouchableOpacity>
        </View>
        <View style={{flexDirection:'row',marginBottom:10,marginTop:8}}>
          <StatTile label="Total" value={projects.length} colour={C.teal}/><View style={{width:10}}/>
          <StatTile label="Active" value={projects.filter(p=>p.status==='Active').length} colour={C.green}/><View style={{width:10}}/>
          <StatTile label="Budget" value={fmtMoney(projects.reduce((s,p)=>s+p.budget,0))} colour={C.gold}/>
        </View>
        <SearchBar value={search} onChange={setSearch} placeholder="Search projects..."/>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:14}}>
          {statuses.map(s=><Pill key={s} label={s} active={filter===s} onPress={()=>setFilter(s)} colour={statusColour[s]||C.gold}/>)}
        </ScrollView>
        {visible.map(p=>{
          const pct=p.budget>0?Math.round((p.spent/p.budget)*100):0; const cl=statusColour[p.status]||C.txt3;
          return (
            <SwipeRow key={p.id} onDelete={()=>del(p)} onEdit={()=>openEdit(p)}>
              <PressCard accent={p.colour} style={{padding:16}} onPress={()=>setDetail(p)}>
                <View style={{flexDirection:'row',alignItems:'flex-start',marginBottom:10}}>
                  <View style={{width:12,height:12,borderRadius:6,backgroundColor:p.colour,marginRight:10,marginTop:2}}/>
                  <View style={{flex:1}}><Text style={{fontSize:17,fontWeight:'700',color:C.txt,marginBottom:2}}>{p.title}</Text><Text style={{fontSize:13,color:C.txt2}}>{p.client}</Text></View>
                  <Badge label={p.status} colour={cl} small/>
                </View>
                {p.crew.length>0&&<AvatarStack ids={p.crew} crew={crew} size={26}/>}
                <View style={{marginTop:10}}>
                  <ProgressBar value={pct} colour={p.colour}/>
                  <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:5}}><Text style={{fontSize:11,color:C.txt3}}>{pct}% spent</Text><Text style={{fontSize:11,fontWeight:'700',color:p.colour}}>{fmtMoney(p.spent)} / {fmtMoney(p.budget)}</Text></View>
                </View>
                <View style={{flexDirection:'row',marginTop:10}}>
                  <TouchableOpacity onPress={()=>setAssignSheet(p)} style={{flex:1,backgroundColor:C.purpleBg,borderRadius:10,paddingVertical:7,alignItems:'center',marginRight:6,borderWidth:1,borderColor:C.purple+'33'}}><Text style={{fontSize:12,fontWeight:'700',color:C.purple}}>Assign Crew</Text></TouchableOpacity>
                  <TouchableOpacity onPress={()=>openEdit(p)} style={{flex:1,backgroundColor:C.surface,borderRadius:10,paddingVertical:7,alignItems:'center',borderWidth:1,borderColor:C.border}}><Text style={{fontSize:12,fontWeight:'700',color:C.txt2}}>Edit</Text></TouchableOpacity>
                </View>
              </PressCard>
            </SwipeRow>
          );
        })}
        {visible.length===0&&<Empty icon="*" label="No projects found"/>}
      </ScrollView>
      <Sheet visible={!!detail} onClose={()=>setDetail(null)} title={detail?.title||''}>
        {detail&&(<>
          <View style={{marginTop:16}}><Badge label={detail.status} colour={statusColour[detail.status]||C.txt3}/></View><HR/>
          <Field label="Client" value={detail.client}/><Field label="Description" value={detail.desc}/>
          <View style={{flexDirection:'row',marginBottom:14}}><View style={{flex:1}}><Field label="Start" value={fmt(detail.start)}/></View><View style={{flex:1}}><Field label="End" value={fmt(detail.end)}/></View></View>
          <View style={{flexDirection:'row',marginBottom:14}}><View style={{flex:1}}><Field label="Budget" value={fmtMoney(detail.budget)}/></View><View style={{flex:1}}><Field label="Spent" value={fmtMoney(detail.spent)}/></View></View>
          {detail.crew.length>0&&(<><Text style={{fontSize:11,fontWeight:'600',color:C.txt3,letterSpacing:1,textTransform:'uppercase',marginBottom:8}}>Crew</Text>{detail.crew.map(cid=>{const c=crew.find(x=>x.id===cid);return c?<View key={cid} style={{flexDirection:'row',alignItems:'center',marginBottom:8}}><Avatar name={c.name} colour={c.colour} size={28}/><Text style={{fontSize:13,fontWeight:'600',color:C.txt,marginLeft:8}}>{c.name} - {c.role}</Text></View>:null;})}</>)}
          <HR/><View style={{flexDirection:'row'}}><Btn label="Edit" onPress={()=>{setDetail(null);openEdit(detail);}} colour={C.gold} style={{flex:1,marginRight:8}}/><GhostBtn label="Delete" onPress={()=>del(detail)} colour={C.red} style={{flex:1}}/></View>
        </>)}
      </Sheet>
      <Sheet visible={!!sheet} onClose={()=>setSheet(null)} title={isEdit?'Edit Project':'New Project'}>
        <View style={{paddingTop:16}}>
          <TInput label="Project Title" value={form.title} onChange={v=>f('title',v)}/><TInput label="Client" value={form.client} onChange={v=>f('client',v)}/><TInput label="Description" value={form.desc} onChange={v=>f('desc',v)} multi/>
          <StatusPicker label="Status" value={form.status} options={STATUSES} onChange={v=>f('status',v)}/><ColourPicker value={form.colour} onChange={v=>f('colour',v)}/>
          <View style={{flexDirection:'row'}}><TInput label="Budget (GBP)" value={form.budget} onChange={v=>f('budget',v)} keyboardType="numeric" style={{flex:1,marginRight:8}}/><TInput label="Spent (GBP)" value={form.spent} onChange={v=>f('spent',v)} keyboardType="numeric" style={{flex:1}}/></View>
          <View style={{flexDirection:'row'}}><TInput label="Start Date" value={form.start} onChange={v=>f('start',v)} placeholder="YYYY-MM-DD" style={{flex:1,marginRight:8}}/><TInput label="End Date" value={form.end} onChange={v=>f('end',v)} placeholder="YYYY-MM-DD" style={{flex:1}}/></View>
          <Btn label={isEdit?'Save Changes':'Create Project'} onPress={save} colour={C.gold}/>
        </View>
      </Sheet>
      <Sheet visible={!!assignSheet} onClose={()=>setAssignSheet(null)} title="Assign Crew">
        {assignSheet&&(<View style={{paddingTop:16}}>{crew.map(c=>{
          const assigned=assignSheet.crew.includes(c.id);
          return (<TouchableOpacity key={c.id} onPress={()=>{assignCrew(assignSheet.id,c.id);setAssignSheet(ps=>ps?({...ps,crew:ps.crew.includes(c.id)?ps.crew.filter(x=>x!==c.id):[...ps.crew,c.id]}):null);}} style={{flexDirection:'row',alignItems:'center',paddingVertical:12,borderBottomWidth:1,borderColor:C.border}}>
            <Avatar name={c.name} colour={c.colour} size={36}/>
            <View style={{flex:1,marginLeft:10}}><Text style={{fontSize:15,fontWeight:'700',color:C.txt}}>{c.name}</Text><View style={{flexDirection:'row',alignItems:'center',marginTop:2}}><Text style={{fontSize:13,color:C.txt2}}>{c.role}</Text><View style={{width:5,height:5,borderRadius:2.5,backgroundColor:c.available?C.green:C.red,marginLeft:8}}/></View></View>
            <View style={{width:24,height:24,borderRadius:12,backgroundColor:assigned?C.gold:C.surface,borderWidth:1.5,borderColor:assigned?C.gold:C.border,alignItems:'center',justifyContent:'center'}}>{assigned&&<Text style={{color:C.bg,fontSize:13,fontWeight:'800'}}>v</Text>}</View>
          </TouchableOpacity>);
        })}</View>)}
      </Sheet>
    </View>
  );
}

function CrewScreen({ store }) {
  const { crew, addCrew, updateCrew, deleteCrew, toggleAvailability, addContract, removeContract } = store;
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [sheet, setSheet] = useState(null);
  const [detail, setDetail] = useState(null);
  const [contractSheet, setContractSheet] = useState(null);
  const [form, setForm] = useState({name:'',role:ROLES[0],rate:'',phone:'',email:'',colour:C.teal,available:true,tags:''});
  const [ctForm, setCtForm] = useState({project:'',rate:'',start:'',end:'',notes:''});
  const f=(k,v)=>setForm(p=>({...p,[k]:v})); const fc=(k,v)=>setCtForm(p=>({...p,[k]:v}));
  const isEdit = sheet && sheet !== 'add';
  const openAdd  = () => { setForm({name:'',role:ROLES[0],rate:'',phone:'',email:'',colour:C.teal,available:true,tags:''}); setSheet('add'); };
  const openEdit = (c) => { setForm({...c,rate:String(c.rate),tags:(c.tags||[]).join(', ')}); setSheet(c); };
  const save = () => {
    if (!form.name.trim()) return Alert.alert('Required','Name required.');
    const data={...form,rate:parseFloat(form.rate)||0,tags:form.tags?form.tags.split(',').map(t=>t.trim()).filter(Boolean):[]};
    isEdit?updateCrew({...sheet,...data}):addCrew(data); setSheet(null);
  };
  const del=(c)=>Alert.alert('Remove Crew','Remove '+c.name+'?',[{text:'Cancel',style:'cancel'},{text:'Remove',style:'destructive',onPress:()=>{deleteCrew(c.id);setDetail(null);}}]);
  const saveContract=()=>{
    if(!ctForm.project.trim()) return Alert.alert('Required','Project name required.');
    addContract(contractSheet.id,ctForm); setCtForm({project:'',rate:'',start:'',end:'',notes:''}); setContractSheet(null); Alert.alert('Saved','Rate card added.');
  };
  const visible=useMemo(()=>crew.filter(c=>{
    if(filter==='Available'&&!c.available) return false;
    if(filter!=='All'&&filter!=='Available'&&c.role!==filter) return false;
    return !search||c.name.toLowerCase().includes(search.toLowerCase())||c.role.toLowerCase().includes(search.toLowerCase());
  }),[crew,filter,search]);
  const roleFilters=['All','Available',...[...new Set(crew.map(c=>c.role))]];
  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <ScrollView contentContainerStyle={{paddingHorizontal:20,paddingBottom:100}} showsVerticalScrollIndicator={false}>
        <View style={{paddingTop:20,paddingBottom:4,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
          <Text style={{fontSize:22,fontWeight:'700',color:C.txt}}>Crew</Text>
          <TouchableOpacity onPress={openAdd} style={{backgroundColor:C.teal,borderRadius:12,paddingHorizontal:16,paddingVertical:8}}><Text style={{color:C.bg,fontWeight:'800',fontSize:14}}>+ Add</Text></TouchableOpacity>
        </View>
        <View style={{flexDirection:'row',marginBottom:10,marginTop:8}}>
          <StatTile label="Total" value={crew.length} colour={C.teal}/><View style={{width:10}}/>
          <StatTile label="Available" value={crew.filter(c=>c.available).length} colour={C.green}/><View style={{width:10}}/>
          <StatTile label="Avg Rate" value={'£'+(crew.length?Math.round(crew.reduce((s,c)=>s+c.rate,0)/crew.length):0)+'/d'} colour={C.gold}/>
        </View>
        <SearchBar value={search} onChange={setSearch} placeholder="Search crew..."/>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:14}}>
          {roleFilters.map(r=><Pill key={r} label={r} active={filter===r} onPress={()=>setFilter(r)} colour={r==='Available'?C.green:C.teal}/>)}
        </ScrollView>
        {visible.map(c=>(
          <SwipeRow key={c.id} onDelete={()=>del(c)} onEdit={()=>openEdit(c)}>
            <PressCard accent={c.colour} style={{padding:16}} onPress={()=>setDetail(c)}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <View style={{position:'relative',marginRight:12}}><Avatar name={c.name} colour={c.colour} size={44}/><View style={{position:'absolute',bottom:0,right:0,width:13,height:13,borderRadius:6.5,backgroundColor:c.available?C.green:C.red,borderWidth:2,borderColor:C.card}}/></View>
                <View style={{flex:1}}><Text style={{fontSize:15,fontWeight:'700',color:C.txt,marginBottom:2}}>{c.name}</Text><Text style={{fontSize:13,fontWeight:'600',color:c.colour}}>{c.role}</Text>{c.tags&&c.tags.length>0&&<View style={{flexDirection:'row',marginTop:4,flexWrap:'wrap'}}>{c.tags.slice(0,3).map(t=><Badge key={t} label={t} colour={c.colour} small/>)}</View>}</View>
                <View style={{alignItems:'flex-end'}}><Text style={{fontSize:15,fontWeight:'800',color:C.gold}}>{fmtMoney(c.rate)}/d</Text>{(c.contracts||[]).length>0&&<Text style={{fontSize:11,color:C.purple,marginTop:4}}>{c.contracts.length} contract{c.contracts.length>1?'s':''}</Text>}</View>
              </View>
              <View style={{flexDirection:'row',marginTop:12}}>
                <TouchableOpacity onPress={()=>toggleAvailability(c.id)} style={{flex:1,backgroundColor:c.available?C.greenBg:C.redBg,borderRadius:10,paddingVertical:7,alignItems:'center',marginRight:6,borderWidth:1,borderColor:c.available?C.green+'33':C.red+'33'}}><Text style={{fontSize:12,fontWeight:'700',color:c.available?C.green:C.red}}>{c.available?'Available':'Unavailable'}</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>setContractSheet(c)} style={{flex:1,backgroundColor:C.purpleBg,borderRadius:10,paddingVertical:7,alignItems:'center',marginRight:6,borderWidth:1,borderColor:C.purple+'33'}}><Text style={{fontSize:12,fontWeight:'700',color:C.purple}}>+ Contract</Text></TouchableOpacity>
                <TouchableOpacity onPress={()=>openEdit(c)} style={{flex:1,backgroundColor:C.surface,borderRadius:10,paddingVertical:7,alignItems:'center',borderWidth:1,borderColor:C.border}}><Text style={{fontSize:12,fontWeight:'700',color:C.txt2}}>Edit</Text></TouchableOpacity>
              </View>
            </PressCard>
          </SwipeRow>
        ))}
        {visible.length===0&&<Empty icon="*" label="No crew found"/>}
      </ScrollView>
      <Sheet visible={!!detail} onClose={()=>setDetail(null)} title={detail?.name||''}>
        {detail&&(<>
          <View style={{alignItems:'center',paddingVertical:20}}>
            <View style={{position:'relative'}}><Avatar name={detail.name} colour={detail.colour} size={72}/><View style={{position:'absolute',bottom:2,right:2,width:18,height:18,borderRadius:9,backgroundColor:detail.available?C.green:C.red,borderWidth:2.5,borderColor:C.surface}}/></View>
            <Text style={{fontSize:17,fontWeight:'700',color:C.txt,marginTop:10}}>{detail.name}</Text>
            <Text style={{fontSize:13,fontWeight:'600',color:detail.colour,marginTop:2}}>{detail.role}</Text>
            <Text style={{fontSize:15,fontWeight:'800',color:C.gold,marginTop:4}}>{fmtMoney(detail.rate)}/day</Text>
          </View>
          <HR/><Field label="Phone" value={detail.phone}/><Field label="Email" value={detail.email}/>
          {detail.tags&&detail.tags.length>0&&(<View style={{marginBottom:14}}><Text style={{fontSize:11,fontWeight:'600',color:C.txt3,letterSpacing:1,textTransform:'uppercase',marginBottom:6}}>Tags</Text><View style={{flexDirection:'row',flexWrap:'wrap'}}>{detail.tags.map(t=><Badge key={t} label={t} colour={detail.colour}/>)}</View></View>)}
          {(detail.contracts||[]).length>0&&(<><HR/><Text style={{fontSize:11,fontWeight:'600',color:C.txt3,letterSpacing:1,textTransform:'uppercase',marginBottom:10}}>Rate Cards</Text>{detail.contracts.map(ct=>(<View key={ct.id} style={{backgroundColor:C.purpleBg,borderRadius:12,padding:12,marginBottom:8,borderWidth:1,borderColor:C.purple+'33'}}><View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'}}><Text style={{fontSize:15,fontWeight:'700',color:C.txt,flex:1}}>{ct.project}</Text><TouchableOpacity onPress={()=>Alert.alert('Remove','Remove this contract?',[{text:'Cancel',style:'cancel'},{text:'Remove',style:'destructive',onPress:()=>{removeContract(detail.id,ct.id);setDetail(c=>c?{...c,contracts:(c.contracts||[]).filter(x=>x.id!==ct.id)}:null);}}])}><Text style={{color:C.red,fontWeight:'700',fontSize:13}}>Remove</Text></TouchableOpacity></View><Text style={{fontSize:13,fontWeight:'700',color:C.gold,marginTop:4}}>{fmtMoney(parseFloat(ct.rate)||0)}/d</Text><Text style={{fontSize:13,color:C.txt2}}>{fmt(ct.start)} - {fmt(ct.end)}</Text>{ct.notes&&<Text style={{fontSize:13,color:C.txt2,marginTop:4}}>{ct.notes}</Text>}</View>))}</>)}
          <HR/><View style={{flexDirection:'row'}}><Btn label="Edit" onPress={()=>{setDetail(null);openEdit(detail);}} colour={C.teal} style={{flex:1,marginRight:8}}/><GhostBtn label="Delete" onPress={()=>del(detail)} colour={C.red} style={{flex:1}}/></View>
        </>)}
      </Sheet>
      <Sheet visible={!!sheet} onClose={()=>setSheet(null)} title={isEdit?'Edit Crew':'Add Crew Member'}>
        <View style={{paddingTop:16}}>
          <TInput label="Full Name" value={form.name} onChange={v=>f('name',v)}/><StatusPicker label="Role" value={form.role} options={ROLES} onChange={v=>f('role',v)}/><TInput label="Day Rate (GBP)" value={form.rate} onChange={v=>f('rate',v)} keyboardType="numeric"/><TInput label="Phone" value={form.phone} onChange={v=>f('phone',v)} keyboardType="phone-pad"/><TInput label="Email" value={form.email} onChange={v=>f('email',v)} keyboardType="email-address"/><TInput label="Tags (comma-separated)" value={form.tags} onChange={v=>f('tags',v)} placeholder="Drama, TVC"/><ColourPicker value={form.colour} onChange={v=>f('colour',v)}/><Btn label={isEdit?'Save Changes':'Add Member'} onPress={save} colour={C.teal}/>
        </View>
      </Sheet>
      <Sheet visible={!!contractSheet} onClose={()=>setContractSheet(null)} title={'Rate Card - '+(contractSheet?.name||'')}>
        <View style={{paddingTop:16}}>
          <TInput label="Project Name" value={ctForm.project} onChange={v=>fc('project',v)}/><TInput label="Day Rate (GBP)" value={ctForm.rate} onChange={v=>fc('rate',v)} keyboardType="numeric"/>
          <View style={{flexDirection:'row'}}><TInput label="Start" value={ctForm.start} onChange={v=>fc('start',v)} placeholder="YYYY-MM-DD" style={{flex:1,marginRight:8}}/><TInput label="End" value={ctForm.end} onChange={v=>fc('end',v)} placeholder="YYYY-MM-DD" style={{flex:1}}/></View>
          <TInput label="Notes" value={ctForm.notes} onChange={v=>fc('notes',v)} multi/><Btn label="Save Rate Card" onPress={saveContract} colour={C.purple}/>
        </View>
      </Sheet>
    </View>
  );
}


function ScheduleScreen({ store }) {
  const { shifts, projects, crew, addShift, updateShift, deleteShift } = store;
  const [filter, setFilter] = useState('upcoming');
  const [sheet, setSheet] = useState(null);
  const [detail, setDetail] = useState(null);
  const [form, setForm] = useState({title:'',project:'',type:SHIFT_TYPES[0],date:TODAY,start:'08:00',end:'18:00',location:'',notes:'',crew:[]});
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const isEdit = sheet && sheet !== 'add';
  const openAdd  = () => { setForm({title:'',project:'',type:SHIFT_TYPES[0],date:TODAY,start:'08:00',end:'18:00',location:'',notes:'',crew:[]}); setSheet('add'); };
  const openEdit = (s) => { setForm({...s}); setSheet(s); };
  const save = () => { if(!form.title.trim()) return Alert.alert('Required','Shift title required.'); isEdit?updateShift({...sheet,...form}):addShift(form); setSheet(null); };
  const del = (s) => Alert.alert('Delete Shift','Remove "'+s.title+'"?',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>{deleteShift(s.id);setDetail(null);}}]);
  const typeColour = {'Call Time':C.gold,'Shoot Day':C.teal,'Travel':C.blue,'Wrap':C.green,'Pre-Prod':C.purple,'Post':C.orange};
  const visible = useMemo(()=>{ let l=[...shifts].sort((a,b)=>a.date.localeCompare(b.date)); if(filter==='upcoming') l=l.filter(s=>s.date>=TODAY); if(filter==='past') l=l.filter(s=>s.date<TODAY); return l; },[shifts,filter]);
  const grouped = useMemo(()=>{ const m={}; visible.forEach(s=>{ if(!m[s.date]) m[s.date]=[]; m[s.date].push(s); }); return Object.entries(m).sort((a,b)=>a[0].localeCompare(b[0])); },[visible]);
  const toggleCrew = (cid) => setForm(p=>({...p,crew:p.crew.includes(cid)?p.crew.filter(x=>x!==cid):[...p.crew,cid]}));
  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <ScrollView contentContainerStyle={{paddingHorizontal:20,paddingBottom:100}} showsVerticalScrollIndicator={false}>
        <View style={{paddingTop:20,paddingBottom:4,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
          <Text style={{fontSize:22,fontWeight:'700',color:C.txt}}>Schedule</Text>
          <TouchableOpacity onPress={openAdd} style={{backgroundColor:C.teal,borderRadius:12,paddingHorizontal:16,paddingVertical:8}}><Text style={{color:C.bg,fontWeight:'800',fontSize:14}}>+ Shift</Text></TouchableOpacity>
        </View>
        <View style={{flexDirection:'row',marginBottom:14,marginTop:8}}>
          <StatTile label="Total" value={shifts.length} colour={C.teal}/><View style={{width:10}}/>
          <StatTile label="Upcoming" value={shifts.filter(s=>s.date>=TODAY).length} colour={C.gold}/><View style={{width:10}}/>
          <StatTile label="Past" value={shifts.filter(s=>s.date<TODAY).length} colour={C.txt3}/>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:14}}>
          <Pill label="Upcoming" active={filter==='upcoming'} onPress={()=>setFilter('upcoming')} colour={C.gold}/>
          <Pill label="All" active={filter==='all'} onPress={()=>setFilter('all')} colour={C.teal}/>
          <Pill label="Past" active={filter==='past'} onPress={()=>setFilter('past')} colour={C.txt3}/>
        </ScrollView>
        {grouped.length===0&&<Empty icon="*" label="No shifts scheduled"/>}
        {grouped.map(([date,dayShifts])=>(
          <View key={date} style={{marginBottom:6}}>
            <View style={{flexDirection:'row',alignItems:'center',marginBottom:8}}>
              <View style={{height:1,flex:1,backgroundColor:C.border}}/><View style={{backgroundColor:C.surface,borderRadius:10,paddingHorizontal:12,paddingVertical:4,marginHorizontal:10,borderWidth:1,borderColor:C.border}}><Text style={{fontSize:11,fontWeight:'700',color:C.txt2}}>{fmt(date)}</Text></View><View style={{height:1,flex:1,backgroundColor:C.border}}/>
            </View>
            {dayShifts.map(s=>{
              const cl=typeColour[s.type]||C.teal;
              return (<SwipeRow key={s.id} onDelete={()=>del(s)} onEdit={()=>openEdit(s)}>
                <PressCard accent={cl} style={{padding:16,marginBottom:6}} onPress={()=>setDetail(s)}>
                  <View style={{flexDirection:'row',alignItems:'flex-start',marginBottom:8}}>
                    <View style={{flex:1}}><Text style={{fontSize:15,fontWeight:'700',color:C.txt,marginBottom:2}}>{s.title}</Text><Text style={{fontSize:13,fontWeight:'600',color:cl}}>{s.start} - {s.end}</Text></View>
                    <Badge label={s.type} colour={cl} small/>
                  </View>
                  {s.location?<Text style={{fontSize:13,color:C.txt2,marginBottom:6}}>{s.location}</Text>:null}
                  {s.crew&&s.crew.length>0&&<AvatarStack ids={s.crew} crew={crew} size={24}/>}
                </PressCard>
              </SwipeRow>);
            })}
          </View>
        ))}
      </ScrollView>
      <Sheet visible={!!detail} onClose={()=>setDetail(null)} title={detail?.title||''}>
        {detail&&(<><View style={{paddingTop:16}}><Badge label={detail.type} colour={typeColour[detail.type]||C.teal}/><HR/><Field label="Date" value={fmt(detail.date)}/><View style={{flexDirection:'row'}}><View style={{flex:1}}><Field label="Start" value={detail.start}/></View><View style={{flex:1}}><Field label="End" value={detail.end}/></View></View><Field label="Location" value={detail.location}/><Field label="Notes" value={detail.notes}/>{detail.crew&&detail.crew.length>0&&(<><Text style={{fontSize:11,fontWeight:'600',color:C.txt3,letterSpacing:1,textTransform:'uppercase',marginBottom:8}}>Crew</Text>{detail.crew.map(cid=>{const c=crew.find(x=>x.id===cid);return c?<View key={cid} style={{flexDirection:'row',alignItems:'center',marginBottom:8}}><Avatar name={c.name} colour={c.colour} size={28}/><Text style={{fontSize:13,fontWeight:'600',color:C.txt,marginLeft:8}}>{c.name}</Text></View>:null;})}</>)}<HR/><View style={{flexDirection:'row'}}><Btn label="Edit" onPress={()=>{setDetail(null);openEdit(detail);}} colour={C.teal} style={{flex:1,marginRight:8}}/><GhostBtn label="Delete" onPress={()=>del(detail)} colour={C.red} style={{flex:1}}/></View></View></>)}
      </Sheet>
      <Sheet visible={!!sheet} onClose={()=>setSheet(null)} title={isEdit?'Edit Shift':'New Shift'}>
        <View style={{paddingTop:16}}>
          <TInput label="Shift Title" value={form.title} onChange={v=>f('title',v)}/><StatusPicker label="Type" value={form.type} options={SHIFT_TYPES} onChange={v=>f('type',v)}/><TInput label="Date" value={form.date} onChange={v=>f('date',v)} placeholder="YYYY-MM-DD"/>
          <View style={{flexDirection:'row'}}><TInput label="Start" value={form.start} onChange={v=>f('start',v)} placeholder="HH:MM" style={{flex:1,marginRight:8}}/><TInput label="End" value={form.end} onChange={v=>f('end',v)} placeholder="HH:MM" style={{flex:1}}/></View>
          <TInput label="Location" value={form.location} onChange={v=>f('location',v)}/><TInput label="Notes" value={form.notes} onChange={v=>f('notes',v)} multi/>
          <Text style={{fontSize:11,fontWeight:'600',color:C.txt3,letterSpacing:1,textTransform:'uppercase',marginBottom:10,marginTop:4}}>Assign Crew</Text>
          {crew.map(c=>(<TouchableOpacity key={c.id} onPress={()=>toggleCrew(c.id)} style={{flexDirection:'row',alignItems:'center',paddingVertical:10,borderBottomWidth:1,borderColor:C.border}}><Avatar name={c.name} colour={c.colour} size={28}/><Text style={{fontSize:13,fontWeight:'600',color:C.txt,flex:1,marginLeft:8}}>{c.name}</Text><View style={{width:22,height:22,borderRadius:11,backgroundColor:form.crew.includes(c.id)?C.teal:C.surface,borderWidth:1.5,borderColor:form.crew.includes(c.id)?C.teal:C.border,alignItems:'center',justifyContent:'center'}}>{form.crew.includes(c.id)&&<Text style={{color:C.bg,fontSize:11,fontWeight:'800'}}>v</Text>}</View></TouchableOpacity>))}
          <View style={{marginTop:14}}><Btn label={isEdit?'Save Changes':'Create Shift'} onPress={save} colour={C.teal}/></View>
        </View>
      </Sheet>
    </View>
  );
}


function MessagesScreen({ store }) {
  const { threads, sendMessage, markThreadRead, deleteThread, newThread, deleteMessage } = store;
  const [activeThread, setActiveThread] = useState(null);
  const [composeSheet, setComposeSheet] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [newForm, setNewForm] = useState({to:'',subject:'',msg:''});
  const scrollRef = useRef(null);
  const totalUnread = threads.reduce((s,t)=>s+t.unread,0);
  const openThread = (t) => { markThreadRead(t.id); setActiveThread(t); setReplyText(''); };
  const handleSend = () => {
    if (!replyText.trim()) return;
    sendMessage(activeThread.id, replyText);
    setReplyText('');
    setActiveThread(prev=>{ if(!prev) return null; const msg={id:uid(),sender:'You',text:replyText.trim(),ts:new Date().toISOString(),isMe:true}; return {...prev,messages:[...prev.messages,msg],unread:0}; });
    setTimeout(()=>scrollRef.current&&scrollRef.current.scrollToEnd({animated:true}),100);
  };
  const handleNewThread = () => {
    if(!newForm.to.trim()||!newForm.msg.trim()) return Alert.alert('Required','Recipient and message required.');
    newThread(newForm.subject||'New Conversation',newForm.to,null,newForm.msg);
    setNewForm({to:'',subject:'',msg:''}); setComposeSheet(false); Alert.alert('Sent','Message sent.');
  };
  const delThread=(t)=>Alert.alert('Delete Conversation','Delete this conversation?',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>{deleteThread(t.id);setActiveThread(null);}}]);
  const fmtTs=(ts)=>{ if(!ts) return ''; const d=new Date(ts),now=new Date(),diffMs=now-d,diffH=diffMs/3600000; if(diffH<1) return Math.round(diffMs/60000)+'m ago'; if(diffH<24) return Math.round(diffH)+'h ago'; if(diffH<48) return 'Yesterday'; return d.toLocaleDateString('en-GB',{day:'2-digit',month:'short'}); };
  if (activeThread) {
    const liveThread = store.threads.find(t=>t.id===activeThread.id)||activeThread;
    return (
      <View style={{flex:1,backgroundColor:C.bg}}>
        <View style={{backgroundColor:C.surface,paddingTop:20,paddingBottom:14,paddingHorizontal:20,borderBottomWidth:1.5,borderColor:C.border,flexDirection:'row',alignItems:'center'}}>
          <TouchableOpacity onPress={()=>setActiveThread(null)} style={{marginRight:12,width:36,height:36,borderRadius:18,backgroundColor:C.card,alignItems:'center',justifyContent:'center',borderWidth:1.5,borderColor:C.border}}><Text style={{color:C.gold,fontSize:16,fontWeight:'800'}}>{'<'}</Text></TouchableOpacity>
          <Avatar name={liveThread.participants[0]} colour={liveThread.colour} size={38}/>
          <View style={{flex:1,marginLeft:10}}><Text style={{fontSize:15,fontWeight:'700',color:C.txt}}>{liveThread.participants[0]}</Text><Text style={{fontSize:12,color:C.txt3}} numberOfLines={1}>{liveThread.subject}</Text></View>
          <TouchableOpacity onPress={()=>delThread(liveThread)} style={{padding:8}}><Text style={{color:C.red,fontWeight:'700',fontSize:13}}>Delete</Text></TouchableOpacity>
        </View>
        <ScrollView ref={scrollRef} style={{flex:1}} contentContainerStyle={{padding:16,paddingBottom:8}} onContentSizeChange={()=>scrollRef.current&&scrollRef.current.scrollToEnd({animated:false})} showsVerticalScrollIndicator={false}>
          {liveThread.messages.map((msg)=>(
            <View key={msg.id} style={{flexDirection:msg.isMe?'row-reverse':'row',alignItems:'flex-end',marginBottom:12}}>
              {!msg.isMe&&<Avatar name={msg.sender} colour={liveThread.colour} size={30}/>}
              <View style={{maxWidth:'75%',backgroundColor:msg.isMe?C.gold:C.card,borderRadius:18,borderBottomRightRadius:msg.isMe?4:18,borderBottomLeftRadius:msg.isMe?18:4,padding:12,marginLeft:msg.isMe?0:8,marginRight:msg.isMe?8:0,borderWidth:msg.isMe?0:1.5,borderColor:C.border}}>
                {!msg.isMe&&<Text style={{fontSize:11,fontWeight:'700',color:liveThread.colour,marginBottom:3}}>{msg.sender}</Text>}
                <Text style={{fontSize:14,color:msg.isMe?C.bg:C.txt,lineHeight:20}}>{msg.text}</Text>
                <Text style={{fontSize:10,color:msg.isMe?C.bg+'99':C.txt3,marginTop:4,textAlign:msg.isMe?'right':'left'}}>{fmtTs(msg.ts)}</Text>
              </View>
              {msg.isMe&&<TouchableOpacity onPress={()=>Alert.alert('Delete Message','Remove this message?',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>{deleteMessage(liveThread.id,msg.id);setActiveThread(p=>p?{...p,messages:p.messages.filter(m=>m.id!==msg.id)}:null);}}])} style={{padding:4}}><Text style={{color:C.txt3,fontSize:10}}>del</Text></TouchableOpacity>}
            </View>
          ))}
        </ScrollView>
        <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'}>
          <View style={{flexDirection:'row',alignItems:'flex-end',padding:12,backgroundColor:C.surface,borderTopWidth:1.5,borderColor:C.border}}>
            <TextInput value={replyText} onChangeText={setReplyText} placeholder="Type a message..." placeholderTextColor={C.txt3} multiline style={{flex:1,backgroundColor:C.card,borderRadius:20,paddingHorizontal:16,paddingVertical:10,color:C.txt,fontSize:14,maxHeight:100,borderWidth:1.5,borderColor:C.border,marginRight:8}} onSubmitEditing={handleSend} returnKeyType="send"/>
            <TouchableOpacity onPress={handleSend} disabled={!replyText.trim()} style={{width:44,height:44,borderRadius:22,backgroundColor:replyText.trim()?C.gold:C.border,alignItems:'center',justifyContent:'center'}}><Text style={{color:C.bg,fontWeight:'800',fontSize:18}}>{'>'}</Text></TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  }
  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <ScrollView contentContainerStyle={{paddingHorizontal:20,paddingBottom:100}} showsVerticalScrollIndicator={false}>
        <View style={{paddingTop:20,paddingBottom:4,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
          <View><Text style={{fontSize:22,fontWeight:'700',color:C.txt}}>Messages</Text>{totalUnread>0&&<Text style={{fontSize:13,fontWeight:'700',color:C.gold,marginTop:2}}>{totalUnread} unread</Text>}</View>
          <TouchableOpacity onPress={()=>setComposeSheet(true)} style={{backgroundColor:C.blue,borderRadius:12,paddingHorizontal:16,paddingVertical:8}}><Text style={{color:C.white,fontWeight:'800',fontSize:14}}>+ New</Text></TouchableOpacity>
        </View>
        <View style={{height:14}}/>
        {threads.length===0&&<Empty icon="*" label="No messages yet"/>}
        {threads.map(t=>{
          const last=t.messages[t.messages.length-1];
          return (<SwipeRow key={t.id} onDelete={()=>delThread(t)}>
            <PressCard accent={t.unread>0?t.colour:undefined} style={{padding:16,marginBottom:4}} onPress={()=>openThread(t)}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <View style={{position:'relative',marginRight:12}}>
                  <Avatar name={t.participants[0]} colour={t.colour} size={46}/>
                  {t.unread>0&&<View style={{position:'absolute',top:-2,right:-2,width:18,height:18,borderRadius:9,backgroundColor:C.gold,borderWidth:2,borderColor:C.card,alignItems:'center',justifyContent:'center'}}><Text style={{color:C.bg,fontSize:9,fontWeight:'800'}}>{t.unread}</Text></View>}
                </View>
                <View style={{flex:1}}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:2}}><Text style={{fontSize:15,fontWeight:t.unread>0?'800':'600',color:C.txt}}>{t.participants[0]}</Text><Text style={{fontSize:11,color:C.txt3}}>{last?fmtTs(last.ts):''}</Text></View>
                  <Text style={{fontSize:12,fontWeight:'600',color:C.txt2,marginBottom:2}} numberOfLines={1}>{t.subject}</Text>
                  <Text style={{fontSize:13,color:t.unread>0?C.txt:C.txt3}} numberOfLines={1}>{last?last.text:''}</Text>
                </View>
              </View>
            </PressCard>
          </SwipeRow>);
        })}
      </ScrollView>
      <Sheet visible={composeSheet} onClose={()=>setComposeSheet(false)} title="New Message">
        <View style={{paddingTop:16}}>
          <TInput label="To (Name)" value={newForm.to} onChange={v=>setNewForm(p=>({...p,to:v}))} placeholder="Recipient name"/>
          <TInput label="Subject" value={newForm.subject} onChange={v=>setNewForm(p=>({...p,subject:v}))} placeholder="What is this about?"/>
          <TInput label="Message" value={newForm.msg} onChange={v=>setNewForm(p=>({...p,msg:v}))} multi placeholder="Write your message..."/>
          <Btn label="Send Message" onPress={handleNewThread} colour={C.blue}/>
        </View>
      </Sheet>
    </View>
  );
}


function InvoicesScreen({ store }) {
  const { invoices, projects, addInvoice, updateInvoice, deleteInvoice, addAttachment, removeAttachment, markInvoicePaid, markInvoiceSent } = store;
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [sheet, setSheet] = useState(null);
  const [detail, setDetail] = useState(null);
  const [uploading, setUploading] = useState(null);
  const [bulkMode, setBulkMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const [form, setForm] = useState({number:'',client:'',project:'',amount:'',status:'Draft',issue:TODAY,due:'',paid:'',notes:'',attachments:[]});
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const isEdit = sheet && sheet !== 'add';
  const pickFile=()=>FAKE_FILES[Math.floor(Math.random()*FAKE_FILES.length)];
  const handleUpload=(invId)=>{ setUploading(invId); const fn=pickFile(); setTimeout(()=>{ addAttachment(invId,fn); setUploading(null); Alert.alert('Attached',fn+' uploaded.'); },1200); };
  const handleFormUpload=()=>{ const fn=pickFile(); setTimeout(()=>setForm(p=>({...p,attachments:[...(p.attachments||[]),fn]})),900); Alert.alert('Attaching',fn+' will be attached.'); };
  const nextNum=()=>'INV-'+String(invoices.length+42).padStart(4,'0');
  const openAdd=()=>{ setForm({number:nextNum(),client:'',project:'',amount:'',status:'Draft',issue:TODAY,due:'',paid:'',notes:'',attachments:[]}); setSheet('add'); };
  const openEdit=(inv)=>{ setForm({...inv,amount:String(inv.amount)}); setSheet(inv); };
  const save=()=>{ if(!form.client.trim()) return Alert.alert('Required','Client required.'); const data={...form,amount:parseFloat(form.amount)||0}; isEdit?updateInvoice({...sheet,...data}):addInvoice(data); setSheet(null); };
  const del=(inv)=>Alert.alert('Delete','Delete '+inv.number+'?',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>{deleteInvoice(inv.id);setDetail(null);}}]);
  const bulkPaid=()=>{ selected.forEach(id=>markInvoicePaid(id)); setSelected([]); setBulkMode(false); Alert.alert('Done',selected.length+' invoice(s) marked paid.'); };
  const toggleSel=(id)=>setSelected(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);
  const statusColour={'Draft':C.txt3,'Sent':C.blue,'Paid':C.green,'Overdue':C.red,'Cancelled':C.txt3};
  const filters=['All',...INV_STATUSES];
  const visible=useMemo(()=>invoices.filter(inv=>{ const s=filter==='All'||inv.status===filter; const q=!search||inv.number.toLowerCase().includes(search.toLowerCase())||inv.client.toLowerCase().includes(search.toLowerCase()); return s&&q; }),[invoices,filter,search]);
  const totalOwed=invoices.filter(i=>i.status==='Sent'||i.status==='Overdue').reduce((s,i)=>s+i.amount,0);
  const totalPaid=invoices.filter(i=>i.status==='Paid').reduce((s,i)=>s+i.amount,0);
  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <ScrollView contentContainerStyle={{paddingHorizontal:20,paddingBottom:100}} showsVerticalScrollIndicator={false}>
        <View style={{paddingTop:20,paddingBottom:4,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
          <Text style={{fontSize:22,fontWeight:'700',color:C.txt}}>Invoices</Text>
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity onPress={()=>{setBulkMode(!bulkMode);setSelected([]);}} style={{backgroundColor:bulkMode?C.purpleBg:C.surface,borderRadius:12,paddingHorizontal:12,paddingVertical:8,marginRight:8,borderWidth:1.5,borderColor:bulkMode?C.purple:C.border}}><Text style={{color:bulkMode?C.purple:C.txt2,fontWeight:'700',fontSize:13}}>Bulk</Text></TouchableOpacity>
            <TouchableOpacity onPress={openAdd} style={{backgroundColor:C.green,borderRadius:12,paddingHorizontal:16,paddingVertical:8}}><Text style={{color:C.bg,fontWeight:'800',fontSize:14}}>+ New</Text></TouchableOpacity>
          </View>
        </View>
        <View style={{flexDirection:'row',marginBottom:10,marginTop:8}}>
          <StatTile label="Owed" value={fmtMoney(totalOwed)} colour={C.orange}/><View style={{width:10}}/>
          <StatTile label="Collected" value={fmtMoney(totalPaid)} colour={C.green}/><View style={{width:10}}/>
          <StatTile label="Total" value={invoices.length} colour={C.teal}/>
        </View>
        {bulkMode&&selected.length>0&&(<View style={{backgroundColor:C.purpleBg,borderRadius:14,padding:14,marginBottom:12,flexDirection:'row',alignItems:'center',borderWidth:1.5,borderColor:C.purple+'44'}}><Text style={{flex:1,fontSize:13,fontWeight:'700',color:C.purple}}>{selected.length} selected</Text><TouchableOpacity onPress={bulkPaid} style={{backgroundColor:C.green,borderRadius:10,paddingHorizontal:14,paddingVertical:7}}><Text style={{color:C.bg,fontWeight:'700',fontSize:13}}>Mark All Paid</Text></TouchableOpacity></View>)}
        <SearchBar value={search} onChange={setSearch} placeholder="Search invoices..."/>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:14}}>
          {filters.map(s=><Pill key={s} label={s} active={filter===s} onPress={()=>setFilter(s)} colour={statusColour[s]||C.gold}/>)}
        </ScrollView>
        {visible.map(inv=>{
          const cl=statusColour[inv.status]||C.txt3; const d=daysUntil(inv.due); const overdue=d!==null&&d<0&&inv.status!=='Paid';
          return (<SwipeRow key={inv.id} onDelete={()=>del(inv)} onEdit={()=>openEdit(inv)}>
            <PressCard accent={cl} style={{padding:16}} onPress={()=>bulkMode?toggleSel(inv.id):setDetail(inv)}>
              {bulkMode&&(<View style={{position:'absolute',top:16,right:16,width:24,height:24,borderRadius:12,backgroundColor:selected.includes(inv.id)?C.purple:C.surface,borderWidth:1.5,borderColor:selected.includes(inv.id)?C.purple:C.border,alignItems:'center',justifyContent:'center',zIndex:10}}>{selected.includes(inv.id)&&<Text style={{color:C.white,fontSize:13,fontWeight:'800'}}>v</Text>}</View>)}
              <View style={{flexDirection:'row',alignItems:'flex-start',marginBottom:8}}>
                <View style={{flex:1}}><Text style={{fontSize:13,fontWeight:'700',fontFamily:Platform.OS==='ios'?'Menlo':'monospace',color:C.teal}}>{inv.number}</Text><Text style={{fontSize:15,fontWeight:'700',color:C.txt,marginTop:2}}>{inv.client}</Text><Text style={{fontSize:12,color:C.txt3,marginTop:1}}>{projects.find(p=>p.id===inv.project)?.title||''}</Text></View>
                <View style={{alignItems:'flex-end'}}><Text style={{fontSize:20,fontWeight:'800',color:C.txt}}>{fmtMoney(inv.amount)}</Text><View style={{marginTop:4}}><Badge label={inv.status} colour={cl} small/></View></View>
              </View>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                <Text style={{fontSize:11,color:C.txt3}}>Due: <Text style={{color:overdue?C.red:d!==null&&d<=7?C.gold:C.txt2,fontWeight:'700'}}>{fmtDue(inv.due)}</Text></Text>
                {(inv.attachments||[]).length>0&&<Text style={{fontSize:11,color:C.blue,fontWeight:'600'}}>{inv.attachments.length} file{inv.attachments.length>1?'s':''}</Text>}
              </View>
              {!bulkMode&&(<View style={{flexDirection:'row'}}>
                {inv.status==='Draft'&&<TouchableOpacity onPress={()=>markInvoiceSent(inv.id)} style={{flex:1,backgroundColor:C.blueBg,borderRadius:10,paddingVertical:7,alignItems:'center',marginRight:6,borderWidth:1,borderColor:C.blue+'33'}}><Text style={{fontSize:12,fontWeight:'700',color:C.blue}}>Mark Sent</Text></TouchableOpacity>}
                {(inv.status==='Sent'||inv.status==='Overdue')&&<TouchableOpacity onPress={()=>markInvoicePaid(inv.id)} style={{flex:1,backgroundColor:C.greenBg,borderRadius:10,paddingVertical:7,alignItems:'center',marginRight:6,borderWidth:1,borderColor:C.green+'33'}}><Text style={{fontSize:12,fontWeight:'700',color:C.green}}>Mark Paid</Text></TouchableOpacity>}
                <TouchableOpacity onPress={()=>uploading===inv.id?null:handleUpload(inv.id)} style={{flex:1,backgroundColor:C.blueBg,borderRadius:10,paddingVertical:7,alignItems:'center',borderWidth:1,borderColor:C.blue+'33'}}>{uploading===inv.id?<ActivityIndicator size="small" color={C.blue}/>:<Text style={{fontSize:12,fontWeight:'700',color:C.blue}}>+ File</Text>}</TouchableOpacity>
              </View>)}
            </PressCard>
          </SwipeRow>);
        })}
        {visible.length===0&&<Empty icon="*" label="No invoices found"/>}
      </ScrollView>
      <Sheet visible={!!detail} onClose={()=>setDetail(null)} title={detail?.number||''}>
        {detail&&(<><View style={{paddingTop:16}}>
          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:16}}><Text style={{fontSize:28,fontWeight:'800',color:C.txt}}>{fmtMoney(detail.amount)}</Text><Badge label={detail.status} colour={statusColour[detail.status]||C.txt3}/></View>
          <Field label="Client" value={detail.client}/><Field label="Project" value={projects.find(p=>p.id===detail.project)?.title||detail.project}/>
          <View style={{flexDirection:'row'}}><View style={{flex:1}}><Field label="Issued" value={fmt(detail.issue)}/></View><View style={{flex:1}}><Text style={{fontSize:11,fontWeight:'600',color:C.txt3,letterSpacing:1,textTransform:'uppercase',marginBottom:4}}>Due</Text><Text style={{fontSize:15,color:daysUntil(detail.due)!==null&&daysUntil(detail.due)<0?C.red:C.txt}}>{fmt(detail.due)}</Text>{detail.status!=='Paid'&&<Text style={{fontSize:11,fontWeight:'700',color:daysUntil(detail.due)!==null&&daysUntil(detail.due)<0?C.red:C.gold,marginTop:2}}>{fmtDue(detail.due)}</Text>}</View></View>
          {detail.paid&&<Field label="Paid On" value={fmt(detail.paid)}/> }{detail.notes&&<Field label="Notes" value={detail.notes}/>}
          <HR/><Text style={{fontSize:11,fontWeight:'600',color:C.txt3,letterSpacing:1,textTransform:'uppercase',marginBottom:10}}>Attachments</Text>
          {(detail.attachments||[]).length===0&&<Text style={{fontSize:13,color:C.txt2,marginBottom:12}}>No files attached yet</Text>}
          <View style={{flexDirection:'row',flexWrap:'wrap',marginBottom:8}}>{(detail.attachments||[]).map(fn=>(<AttachmentChip key={fn} name={fn} onRemove={()=>{removeAttachment(detail.id,fn);setDetail(p=>p?{...p,attachments:(p.attachments||[]).filter(x=>x!==fn)}:null);}}/>))}</View>
          <TouchableOpacity onPress={()=>{ const fn=pickFile(); setUploading('detail'); setTimeout(()=>{ addAttachment(detail.id,fn); setDetail(p=>p?{...p,attachments:[...(p.attachments||[]),fn]}:null); setUploading(null); Alert.alert('Uploaded',fn+' attached.'); },1200); }} style={{backgroundColor:C.blueBg,borderRadius:12,padding:12,alignItems:'center',marginBottom:16,borderWidth:1,borderColor:C.blue+'33',flexDirection:'row',justifyContent:'center'}}>{uploading==='detail'?<ActivityIndicator size="small" color={C.blue}/>:<Text style={{fontSize:14,fontWeight:'700',color:C.blue}}>+ Upload File</Text>}</TouchableOpacity>
          <HR/><View style={{flexDirection:'row',marginBottom:8}}>
            {detail.status==='Draft'&&<TouchableOpacity onPress={()=>{markInvoiceSent(detail.id);setDetail(p=>p?{...p,status:'Sent'}:null);}} style={{flex:1,backgroundColor:C.blueBg,borderRadius:12,paddingVertical:12,alignItems:'center',marginRight:8,borderWidth:1.5,borderColor:C.blue+'44'}}><Text style={{color:C.blue,fontWeight:'700'}}>Mark Sent</Text></TouchableOpacity>}
            {(detail.status==='Sent'||detail.status==='Overdue')&&<TouchableOpacity onPress={()=>{markInvoicePaid(detail.id);setDetail(p=>p?{...p,status:'Paid',paid:TODAY}:null);}} style={{flex:1,backgroundColor:C.greenBg,borderRadius:12,paddingVertical:12,alignItems:'center',marginRight:8,borderWidth:1.5,borderColor:C.green+'44'}}><Text style={{color:C.green,fontWeight:'700'}}>Mark Paid</Text></TouchableOpacity>}
            <TouchableOpacity onPress={()=>{setDetail(null);openEdit(detail);}} style={{flex:1,backgroundColor:C.goldBg,borderRadius:12,paddingVertical:12,alignItems:'center',borderWidth:1.5,borderColor:C.gold+'44'}}><Text style={{color:C.gold,fontWeight:'700'}}>Edit</Text></TouchableOpacity>
          </View>
          <GhostBtn label="Delete Invoice" onPress={()=>del(detail)} colour={C.red}/>
        </View></>)}
      </Sheet>
      <Sheet visible={!!sheet} onClose={()=>setSheet(null)} title={isEdit?'Edit Invoice':'New Invoice'}>
        <View style={{paddingTop:16}}>
          <View style={{flexDirection:'row'}}><TInput label="Invoice #" value={form.number} onChange={v=>f('number',v)} style={{flex:1,marginRight:8}}/><TInput label="Amount (GBP)" value={form.amount} onChange={v=>f('amount',v)} keyboardType="numeric" style={{flex:1}}/></View>
          <TInput label="Client" value={form.client} onChange={v=>f('client',v)}/><TInput label="Project (optional)" value={form.project} onChange={v=>f('project',v)}/>
          <StatusPicker label="Status" value={form.status} options={INV_STATUSES} onChange={v=>f('status',v)}/>
          <View style={{flexDirection:'row'}}><TInput label="Issue Date" value={form.issue} onChange={v=>f('issue',v)} placeholder="YYYY-MM-DD" style={{flex:1,marginRight:8}}/><TInput label="Due Date" value={form.due} onChange={v=>f('due',v)} placeholder="YYYY-MM-DD" style={{flex:1}}/></View>
          <TInput label="Notes" value={form.notes} onChange={v=>f('notes',v)} multi/>
          {(form.attachments||[]).length>0&&(<View style={{flexDirection:'row',flexWrap:'wrap',marginBottom:8}}>{form.attachments.map(fn=><AttachmentChip key={fn} name={fn} onRemove={()=>setForm(p=>({...p,attachments:p.attachments.filter(x=>x!==fn)}))}/>)}</View>)}
          <TouchableOpacity onPress={handleFormUpload} style={{backgroundColor:C.blueBg,borderRadius:12,padding:12,alignItems:'center',marginBottom:14,borderWidth:1,borderColor:C.blue+'33'}}><Text style={{fontSize:14,fontWeight:'700',color:C.blue}}>+ Attach PDF / File</Text></TouchableOpacity>
          <Btn label={isEdit?'Save Changes':'Create Invoice'} onPress={save} colour={C.green}/>
        </View>
      </Sheet>
    </View>
  );
}


function ReportsScreen({ store }) {
  const { projects, crew, invoices, shifts } = store;
  const [tab, setTab] = useState('Financial');
  const tabs=['Financial','Projects','Crew','Activity'];
  const totalBudget=projects.reduce((s,p)=>s+p.budget,0); const totalSpent=projects.reduce((s,p)=>s+p.spent,0);
  const totalOwed=invoices.filter(i=>i.status==='Sent'||i.status==='Overdue').reduce((s,i)=>s+i.amount,0);
  const totalPaid=invoices.filter(i=>i.status==='Paid').reduce((s,i)=>s+i.amount,0);
  const maxBudget=Math.max(...projects.map(p=>p.budget),1);
  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <ScrollView contentContainerStyle={{paddingHorizontal:20,paddingBottom:100}} showsVerticalScrollIndicator={false}>
        <View style={{paddingTop:20,paddingBottom:14}}><Text style={{fontSize:22,fontWeight:'700',color:C.txt}}>Reports</Text><Text style={{fontSize:13,color:C.txt2,marginTop:2}}>Analytics and financial overview</Text></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:20}}>{tabs.map(t=><Pill key={t} label={t} active={tab===t} onPress={()=>setTab(t)} colour={C.gold}/>)}</ScrollView>
        {tab==='Financial'&&(<>
          <View style={{flexDirection:'row',marginBottom:12}}><StatTile label="Total Budget" value={fmtMoney(totalBudget)} colour={C.gold}/><View style={{width:10}}/><StatTile label="Total Spent" value={fmtMoney(totalSpent)} colour={C.orange}/></View>
          <View style={{flexDirection:'row',marginBottom:20}}><StatTile label="Owed" value={fmtMoney(totalOwed)} colour={C.red}/><View style={{width:10}}/><StatTile label="Collected" value={fmtMoney(totalPaid)} colour={C.green}/></View>
          <SectionHdr title="Invoice Breakdown"/>
          {['Draft','Sent','Paid','Overdue','Cancelled'].map(s=>{ const count=invoices.filter(i=>i.status===s).length; const total=invoices.filter(i=>i.status===s).reduce((a,i)=>a+i.amount,0); const colour={Draft:C.txt3,Sent:C.blue,Paid:C.green,Overdue:C.red,Cancelled:C.txt3}[s]; return (<View key={s} style={{flexDirection:'row',alignItems:'center',backgroundColor:C.card,borderRadius:12,padding:14,marginBottom:8,borderWidth:1,borderColor:C.border}}><View style={{width:10,height:10,borderRadius:5,backgroundColor:colour,marginRight:12}}/><Text style={{fontSize:13,fontWeight:'600',color:C.txt,flex:1}}>{s}</Text><Text style={{fontSize:13,color:C.txt2,marginRight:12}}>{count} inv</Text><Text style={{fontSize:13,fontWeight:'700',color:colour}}>{fmtMoney(total)}</Text></View>); })}
        </>)}
        {tab==='Projects'&&(<>
          <View style={{flexDirection:'row',marginBottom:16}}><StatTile label="Total" value={projects.length} colour={C.teal}/><View style={{width:10}}/><StatTile label="Active" value={projects.filter(p=>p.status==='Active').length} colour={C.green}/></View>
          <SectionHdr title="Budget by Project"/>{projects.map(p=><AnimBar key={p.id} label={p.title} value={p.budget} colour={p.colour} maxVal={maxBudget}/>)}<HR/>
          <SectionHdr title="Spend by Project"/>{projects.map(p=><AnimBar key={p.id+'s'} label={p.title} value={p.spent} colour={p.colour} maxVal={maxBudget}/>)}<HR/>
          <SectionHdr title="Status Distribution"/>
          {[...new Set(projects.map(p=>p.status))].map(s=>{ const count=projects.filter(p=>p.status===s).length; const pct=Math.round((count/projects.length)*100); const colour={'Active':C.green,'Pre-Production':C.teal,'Post-Production':C.purple,'Wrapped':C.txt3,'Development':C.blue,'On Hold':C.orange}[s]||C.txt3; return (<View key={s} style={{marginBottom:12}}><View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:5}}><Text style={{fontSize:13,color:C.txt2}}>{s}</Text><Text style={{fontSize:13,fontWeight:'700',color:colour}}>{count} ({pct}%)</Text></View><ProgressBar value={pct} colour={colour}/></View>); })}
        </>)}
        {tab==='Crew'&&(<>
          <View style={{flexDirection:'row',marginBottom:12}}><StatTile label="Total" value={crew.length} colour={C.purple}/><View style={{width:10}}/><StatTile label="Available" value={crew.filter(c=>c.available).length} colour={C.green}/></View>
          <SectionHdr title="Day Rate Comparison"/>{crew.map(c=><AnimBar key={c.id} label={c.name+' ('+c.role+')'} value={c.rate} colour={c.colour} maxVal={Math.max(...crew.map(x=>x.rate),1)}/>)}<HR/>
          <SectionHdr title="Availability Status"/>
          {crew.map(c=>(<View key={c.id} style={{flexDirection:'row',alignItems:'center',backgroundColor:C.card,borderRadius:12,padding:12,marginBottom:8,borderWidth:1,borderColor:C.border}}><Avatar name={c.name} colour={c.colour} size={32}/><View style={{flex:1,marginLeft:10}}><Text style={{fontSize:13,fontWeight:'700',color:C.txt}}>{c.name}</Text><Text style={{fontSize:11,color:C.txt3}}>{c.role}</Text></View><Badge label={c.available?'Available':'Busy'} colour={c.available?C.green:C.red} small/></View>))}
        </>)}
        {tab==='Activity'&&(<>
          <View style={{flexDirection:'row',marginBottom:16}}><StatTile label="Shifts" value={shifts.length} colour={C.teal}/><View style={{width:10}}/><StatTile label="Upcoming" value={shifts.filter(s=>s.date>=TODAY).length} colour={C.gold}/></View>
          <SectionHdr title="Shift Types"/>
          {SHIFT_TYPES.map(t=>{ const count=shifts.filter(s=>s.type===t).length; if(!count) return null; const cmap={'Call Time':C.gold,'Shoot Day':C.teal,'Travel':C.blue,'Wrap':C.green,'Pre-Prod':C.purple,'Post':C.orange}; const cl=cmap[t]||C.teal; return (<View key={t} style={{flexDirection:'row',alignItems:'center',backgroundColor:C.card,borderRadius:12,padding:12,marginBottom:8,borderWidth:1,borderColor:C.border}}><Badge label={t} colour={cl}/><Text style={{fontSize:13,fontWeight:'700',color:C.txt,flex:1,marginLeft:10}}>{count} shift{count!==1?'s':''}</Text></View>); })}
        </>)}
      </ScrollView>
    </View>
  );
}

function FreelancerScreen({ store }) {
  const { freelancer, shifts, invoices, updateFreelancer } = store;
  const [editSheet, setEditSheet] = useState(false);
  const [form, setForm] = useState({...freelancer});
  const f=(k,v)=>setForm(p=>({...p,[k]:v}));
  const myShifts=shifts.filter(s=>freelancer.upcomingShifts&&freelancer.upcomingShifts.includes(s.id));
  const myInvoices=invoices.slice(0,3);
  const totalEarned=(freelancer.earnings||[]).reduce((s,e)=>s+e.amount,0);
  const maxEarning=Math.max(...(freelancer.earnings||[{amount:1}]).map(e=>e.amount),1);
  const save=()=>{ updateFreelancer({...freelancer,...form}); setEditSheet(false); Alert.alert('Saved','Profile updated.'); };
  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <ScrollView contentContainerStyle={{paddingHorizontal:20,paddingBottom:100}} showsVerticalScrollIndicator={false}>
        <View style={{paddingTop:20,paddingBottom:4,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
          <Text style={{fontSize:22,fontWeight:'700',color:C.txt}}>My Portal</Text>
          <TouchableOpacity onPress={()=>{setForm({...freelancer});setEditSheet(true);}} style={{backgroundColor:C.purple,borderRadius:12,paddingHorizontal:16,paddingVertical:8}}><Text style={{color:C.white,fontWeight:'800',fontSize:14}}>Edit Profile</Text></TouchableOpacity>
        </View>
        <View style={{backgroundColor:C.card,borderRadius:20,padding:20,marginTop:12,marginBottom:16,borderWidth:1.5,borderColor:freelancer.colour+'44',alignItems:'center'}}>
          <View style={{position:'relative',marginBottom:12}}><Avatar name={freelancer.name} colour={freelancer.colour} size={72}/><View style={{position:'absolute',bottom:2,right:2,width:18,height:18,borderRadius:9,backgroundColor:freelancer.available?C.green:C.red,borderWidth:2.5,borderColor:C.card}}/></View>
          <Text style={{fontSize:20,fontWeight:'800',color:C.txt,marginBottom:4}}>{freelancer.name}</Text>
          <Text style={{fontSize:14,fontWeight:'600',color:freelancer.colour,marginBottom:8}}>{freelancer.role}</Text>
          <Text style={{fontSize:14,fontWeight:'800',color:C.gold,marginBottom:12}}>{fmtMoney(freelancer.rate)}/day</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'center'}}>{(freelancer.skills||[]).map(s=><View key={s} style={{backgroundColor:freelancer.colour+'22',borderRadius:20,paddingHorizontal:10,paddingVertical:4,margin:3,borderWidth:1,borderColor:freelancer.colour+'33'}}><Text style={{fontSize:11,fontWeight:'700',color:freelancer.colour}}>{s}</Text></View>)}</View>
          {freelancer.bio&&<Text style={{fontSize:13,color:C.txt2,textAlign:'center',marginTop:12,lineHeight:20}}>{freelancer.bio}</Text>}
        </View>
        <SectionHdr title="Earnings This Year"/>
        <View style={{backgroundColor:C.card,borderRadius:16,padding:16,marginBottom:16,borderWidth:1.5,borderColor:C.border}}>
          <Text style={{fontSize:26,fontWeight:'800',color:C.green,marginBottom:4}}>{fmtMoney(totalEarned)}</Text>
          <Text style={{fontSize:13,color:C.txt2,marginBottom:16}}>Total earned across all projects</Text>
          {(freelancer.earnings||[]).map(e=>(<View key={e.month} style={{flexDirection:'row',alignItems:'center',marginBottom:8}}><Text style={{fontSize:12,fontWeight:'600',color:C.txt3,width:32}}>{e.month}</Text><View style={{flex:1,height:8,backgroundColor:C.surface,borderRadius:4,overflow:'hidden',marginHorizontal:8}}><View style={{height:8,width:((e.amount/maxEarning)*100)+'%',backgroundColor:C.green,borderRadius:4}}/></View><Text style={{fontSize:12,fontWeight:'700',color:C.green,width:60,textAlign:'right'}}>{fmtMoney(e.amount)}</Text></View>))}
        </View>
        <View style={{flexDirection:'row',marginBottom:16}}>
          <StatTile label="Status" value={freelancer.available?'Open':'Busy'} colour={freelancer.available?C.green:C.red}/><View style={{width:10}}/>
          <StatTile label="Contracts" value={freelancer.contracts||0} colour={C.purple}/><View style={{width:10}}/>
          <StatTile label="Day Rate" value={fmtMoney(freelancer.rate)} colour={C.gold}/>
        </View>
        {myShifts.length>0&&(<><SectionHdr title="My Upcoming Shifts"/>{myShifts.map(s=>(<PressCard key={s.id} accent={C.teal} style={{padding:14,marginBottom:8}}><Text style={{fontSize:14,fontWeight:'700',color:C.txt,marginBottom:2}}>{s.title}</Text><Text style={{fontSize:12,fontWeight:'600',color:C.teal}}>{fmt(s.date)} - {s.start} to {s.end}</Text><Text style={{fontSize:12,color:C.txt2,marginTop:2}}>{s.location}</Text></PressCard>))}</>)}
        <SectionHdr title="Recent Invoices"/>
        {myInvoices.map(inv=>{ const statusColour={'Draft':C.txt3,'Sent':C.blue,'Paid':C.green,'Overdue':C.red,'Cancelled':C.txt3}; const cl=statusColour[inv.status]||C.txt3; return (<View key={inv.id} style={{flexDirection:'row',alignItems:'center',backgroundColor:C.card,borderRadius:12,padding:14,marginBottom:8,borderWidth:1,borderColor:C.border}}><View style={{flex:1}}><Text style={{fontSize:13,fontWeight:'700',color:C.teal,fontFamily:Platform.OS==='ios'?'Menlo':'monospace'}}>{inv.number}</Text><Text style={{fontSize:13,fontWeight:'600',color:C.txt,marginTop:2}}>{inv.client}</Text></View><View style={{alignItems:'flex-end'}}><Text style={{fontSize:15,fontWeight:'800',color:C.txt}}>{fmtMoney(inv.amount)}</Text><View style={{marginTop:4}}><Badge label={inv.status} colour={cl} small/></View></View></View>); })}
      </ScrollView>
      <Sheet visible={editSheet} onClose={()=>setEditSheet(false)} title="Edit Profile">
        <View style={{paddingTop:16}}>
          <TInput label="Name" value={form.name} onChange={v=>f('name',v)}/><StatusPicker label="Role" value={form.role} options={ROLES} onChange={v=>f('role',v)}/><TInput label="Day Rate (GBP)" value={String(form.rate)} onChange={v=>f('rate',parseFloat(v)||0)} keyboardType="numeric"/><TInput label="Bio" value={form.bio} onChange={v=>f('bio',v)} multi/><TInput label="Skills (comma-separated)" value={(form.skills||[]).join(', ')} onChange={v=>f('skills',v.split(',').map(x=>x.trim()).filter(Boolean))} placeholder="Drama, TVC, Doc"/><TInput label="Phone" value={form.phone} onChange={v=>f('phone',v)} keyboardType="phone-pad"/><TInput label="Email" value={form.email} onChange={v=>f('email',v)} keyboardType="email-address"/><ColourPicker value={form.colour} onChange={v=>f('colour',v)}/>
          <View style={{flexDirection:'row',marginBottom:14}}>
            <TouchableOpacity onPress={()=>f('available',true)} style={{flex:1,backgroundColor:form.available?C.greenBg:C.surface,borderRadius:12,paddingVertical:12,alignItems:'center',marginRight:8,borderWidth:1.5,borderColor:form.available?C.green:C.border}}><Text style={{color:form.available?C.green:C.txt2,fontWeight:'700'}}>Available</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>f('available',false)} style={{flex:1,backgroundColor:!form.available?C.redBg:C.surface,borderRadius:12,paddingVertical:12,alignItems:'center',borderWidth:1.5,borderColor:!form.available?C.red:C.border}}><Text style={{color:!form.available?C.red:C.txt2,fontWeight:'700'}}>Busy</Text></TouchableOpacity>
          </View>
          <Btn label="Save Profile" onPress={save} colour={C.purple}/>
        </View>
      </Sheet>
    </View>
  );
}


function BusinessScreen({ store }) {
  const { projects, crew, invoices, shifts, activity } = store;
  const [period, setPeriod] = useState('This Month');
  const periods=['This Week','This Month','This Quarter','All Time'];
  const totalRevenue=invoices.filter(i=>i.status==='Paid').reduce((s,i)=>s+i.amount,0);
  const totalOutstanding=invoices.filter(i=>i.status==='Sent'||i.status==='Overdue').reduce((s,i)=>s+i.amount,0);
  const activeCount=projects.filter(p=>p.status==='Active').length;
  const totalBudget=projects.reduce((s,p)=>s+p.budget,0); const totalSpent=projects.reduce((s,p)=>s+p.spent,0);
  const healthPct=totalBudget>0?Math.round((1-(totalSpent/totalBudget))*100):100;
  const availCrew=crew.filter(c=>c.available).length;
  const overdueInvs=invoices.filter(i=>i.status==='Overdue');
  const topProjects=[...projects].sort((a,b)=>b.budget-a.budget).slice(0,3);
  const maxBudget=Math.max(...projects.map(p=>p.budget),1);
  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <ScrollView contentContainerStyle={{paddingHorizontal:20,paddingBottom:100}} showsVerticalScrollIndicator={false}>
        <View style={{paddingTop:20,paddingBottom:8}}><Text style={{fontSize:11,fontWeight:'600',color:C.gold,letterSpacing:1.5,textTransform:'uppercase',marginBottom:4}}>Business</Text><Text style={{fontSize:28,fontWeight:'800',color:C.txt,letterSpacing:-0.5}}>Dashboard</Text></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:16}}>{periods.map(p=><Pill key={p} label={p} active={period===p} onPress={()=>setPeriod(p)} colour={C.gold}/>)}</ScrollView>
        <View style={{flexDirection:'row',marginBottom:10}}>
          <StatTile label="Revenue" value={fmtMoney(totalRevenue)} colour={C.green} sub="collected"/><View style={{width:10}}/>
          <StatTile label="Pipeline" value={fmtMoney(totalOutstanding)} colour={C.gold} sub="outstanding"/>
        </View>
        <View style={{flexDirection:'row',marginBottom:16}}>
          <StatTile label="Projects" value={activeCount} colour={C.teal} sub="active"/><View style={{width:10}}/>
          <StatTile label="Budget Health" value={healthPct+'%'} colour={healthPct>60?C.green:healthPct>30?C.orange:C.red} sub="remaining"/><View style={{width:10}}/>
          <StatTile label="Crew Ready" value={availCrew+'/'+crew.length} colour={C.purple} sub="available"/>
        </View>
        {overdueInvs.length>0&&(<View style={{backgroundColor:C.redBg,borderRadius:14,padding:16,marginBottom:16,borderWidth:1.5,borderColor:C.red+'44'}}>
          <Text style={{fontSize:14,fontWeight:'800',color:C.red,marginBottom:8}}>ACTION REQUIRED</Text>
          {overdueInvs.map(inv=>(<View key={inv.id} style={{flexDirection:'row',alignItems:'center',marginBottom:6}}><View style={{width:6,height:6,borderRadius:3,backgroundColor:C.red,marginRight:8}}/><Text style={{fontSize:13,fontWeight:'600',color:C.txt,flex:1}}>{inv.number} - {inv.client}</Text><Text style={{fontSize:13,fontWeight:'700',color:C.red}}>{fmtMoney(inv.amount)}</Text></View>))}
        </View>)}
        <SectionHdr title="Top Projects by Budget"/>
        {topProjects.map(p=>{ const pct=p.budget>0?Math.round((p.spent/p.budget)*100):0; return (<View key={p.id} style={{backgroundColor:C.card,borderRadius:14,padding:14,marginBottom:10,borderWidth:1.5,borderColor:p.colour+'33'}}>
          <View style={{flexDirection:'row',alignItems:'flex-start',marginBottom:10}}><View style={{width:10,height:10,borderRadius:5,backgroundColor:p.colour,marginRight:8,marginTop:3}}/><View style={{flex:1}}><Text style={{fontSize:14,fontWeight:'700',color:C.txt}}>{p.title}</Text><Text style={{fontSize:12,color:C.txt2}}>{p.client}</Text></View><Badge label={p.status} colour={p.colour} small/></View>
          <ProgressBar value={pct} colour={p.colour} height={8}/><View style={{flexDirection:'row',justifyContent:'space-between',marginTop:6}}><Text style={{fontSize:11,color:C.txt3}}>{pct}% used</Text><Text style={{fontSize:11,fontWeight:'700',color:p.colour}}>{fmtMoney(p.spent)} / {fmtMoney(p.budget)}</Text></View>
        </View>); })}
        <SectionHdr title="Revenue by Project"/>
        {projects.filter(p=>p.spent>0).map(p=>(<AnimBar key={p.id+'r'} label={p.title} value={p.spent} colour={p.colour} maxVal={maxBudget}/>))}
        <HR/>
        <SectionHdr title="Crew Utilisation"/>
        <View style={{backgroundColor:C.card,borderRadius:14,padding:14,marginBottom:16,borderWidth:1,borderColor:C.border}}>
          <View style={{flexDirection:'row',justifyContent:'space-around',marginBottom:12}}>
            {[{v:availCrew,l:'Available',c:C.green},{v:crew.length-availCrew,l:'Booked',c:C.red},{v:crew.length,l:'Total',c:C.gold}].map(item=>(<View key={item.l} style={{alignItems:'center'}}><Text style={{fontSize:24,fontWeight:'800',color:item.c}}>{item.v}</Text><Text style={{fontSize:11,color:C.txt3,marginTop:2}}>{item.l}</Text></View>))}
          </View>
          <ProgressBar value={Math.round((availCrew/Math.max(crew.length,1))*100)} colour={C.green} height={10}/>
          <Text style={{fontSize:11,color:C.txt3,marginTop:6,textAlign:'right'}}>{Math.round((availCrew/Math.max(crew.length,1))*100)}% utilisation</Text>
        </View>
        <SectionHdr title="Next 5 Shifts"/>
        {[...shifts].filter(s=>s.date>=TODAY).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,5).map(s=>{ const cmap={'Call Time':C.gold,'Shoot Day':C.teal,'Travel':C.blue,'Wrap':C.green,'Pre-Prod':C.purple,'Post':C.orange}; const cl=cmap[s.type]||C.teal; return (<View key={s.id} style={{flexDirection:'row',alignItems:'center',backgroundColor:C.card,borderRadius:12,padding:12,marginBottom:8,borderWidth:1,borderColor:C.border,borderLeftWidth:4,borderLeftColor:cl}}><View style={{flex:1}}><Text style={{fontSize:13,fontWeight:'700',color:C.txt}}>{s.title}</Text><Text style={{fontSize:11,color:C.txt3,marginTop:2}}>{fmt(s.date)} - {s.start}</Text></View><Badge label={s.type} colour={cl} small/></View>); })}
        {shifts.filter(s=>s.date>=TODAY).length===0&&<Empty icon="*" label="No upcoming shifts"/>}
        <HR/>
        <SectionHdr title="Recent Activity"/>
        {activity.slice(0,5).map(a=>(<View key={a.id} style={{flexDirection:'row',alignItems:'center',marginBottom:12,paddingBottom:12,borderBottomWidth:1,borderColor:C.border}}><Avatar name={a.user} colour={a.colour} size={32}/><View style={{flex:1,marginLeft:10}}><View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'center'}}><Text style={{fontSize:13,fontWeight:'700',color:C.txt}}>{a.user} </Text><Text style={{fontSize:13,color:C.txt2}}>{a.verb} </Text><Text style={{fontSize:13,fontWeight:'700',color:a.colour}}>{a.target}</Text></View><Text style={{fontSize:11,color:C.txt3,marginTop:1}}>{a.time}</Text></View></View>))}
      </ScrollView>
    </View>
  );
}

function MoreScreen({ store }) {
  const { projects, crew, invoices, shifts } = store;
  const [about, setAbout] = useState(false);
  const sections=[
    {title:'App Settings',items:[{label:'Notifications',icon:'N',colour:C.gold,hint:'Manage alerts'},{label:'Currency',icon:'C',colour:C.teal,hint:'GBP'},{label:'Default Rate',icon:'R',colour:C.purple,hint:'Set day rate'}]},
    {title:'Data and Tools',items:[{label:'Export Data',icon:'E',colour:C.blue,hint:'CSV / PDF',onPress:()=>Alert.alert('Export','Coming in v11.')},{label:'Import Crew',icon:'I',colour:C.green,hint:'CSV upload',onPress:()=>Alert.alert('Import','Coming in v11.')},{label:'Integrations',icon:'Z',colour:C.orange,hint:'Zapier, Slack',onPress:()=>Alert.alert('Coming Soon','Third-party integrations planned.')}]},
    {title:'Support',items:[{label:'Help Centre',icon:'H',colour:C.teal,hint:'Guides',onPress:()=>Alert.alert('Help','Documentation coming soon.')},{label:'Send Feedback',icon:'F',colour:C.pink,hint:'Bug report',onPress:()=>Alert.alert('Feedback','Thanks for your feedback!')},{label:'About CrewDesk',icon:'A',colour:C.gold,onPress:()=>setAbout(true)}]},
  ];
  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <ScrollView contentContainerStyle={{paddingHorizontal:20,paddingBottom:100}} showsVerticalScrollIndicator={false}>
        <View style={{paddingTop:20,paddingBottom:16}}><Text style={{fontSize:22,fontWeight:'700',color:C.txt}}>More</Text><Text style={{fontSize:13,color:C.txt2,marginTop:2}}>Settings and information</Text></View>
        <View style={{backgroundColor:C.card,borderRadius:16,padding:16,marginBottom:20,borderWidth:1.5,borderColor:C.border}}>
          <Text style={{fontSize:11,fontWeight:'600',color:C.txt3,letterSpacing:1,textTransform:'uppercase',marginBottom:14}}>Quick Summary</Text>
          <View style={{flexDirection:'row',justifyContent:'space-around'}}>
            {[{v:projects.length,l:'Projects',c:C.gold},{v:crew.length,l:'Crew',c:C.teal},{v:invoices.filter(i=>i.status==='Paid').length,l:'Paid',c:C.green},{v:shifts.length,l:'Shifts',c:C.blue}].map(item=>(<View key={item.l} style={{alignItems:'center'}}><Text style={{fontSize:26,fontWeight:'800',color:item.c}}>{item.v}</Text><Text style={{fontSize:11,color:C.txt3,marginTop:2}}>{item.l}</Text></View>))}
          </View>
        </View>
        {sections.map(sec=>(<View key={sec.title} style={{marginBottom:20}}><SectionHdr title={sec.title}/><View style={{backgroundColor:C.card,borderRadius:16,overflow:'hidden',borderWidth:1.5,borderColor:C.border}}>{sec.items.map((item,idx)=>(<TouchableOpacity key={item.label} onPress={item.onPress||null} style={{flexDirection:'row',alignItems:'center',padding:16,borderBottomWidth:idx<sec.items.length-1?1:0,borderColor:C.border}}><View style={{width:36,height:36,borderRadius:10,backgroundColor:item.colour+'22',alignItems:'center',justifyContent:'center',marginRight:12,borderWidth:1,borderColor:item.colour+'33'}}><Text style={{color:item.colour,fontWeight:'800',fontSize:14}}>{item.icon}</Text></View><Text style={{fontSize:15,fontWeight:'600',color:C.txt,flex:1}}>{item.label}</Text>{item.hint&&<Text style={{fontSize:13,color:C.txt2,marginRight:8}}>{item.hint}</Text>}<Text style={{color:C.txt3,fontSize:16}}>{'>'}</Text></TouchableOpacity>))}</View></View>))}
        <View style={{alignItems:'center',paddingVertical:16,opacity:0.4}}><Text style={{fontSize:11,color:C.txt3}}>CrewDesk v10.0</Text><Text style={{fontSize:11,color:C.txt3,marginTop:2}}>Built for Film, TV and Events Production</Text></View>
      </ScrollView>
      <Sheet visible={about} onClose={()=>setAbout(false)} title="About CrewDesk">
        <View style={{alignItems:'center',paddingVertical:24}}><View style={{width:72,height:72,borderRadius:20,backgroundColor:C.goldBg,alignItems:'center',justifyContent:'center',marginBottom:16,borderWidth:2,borderColor:C.gold+'44'}}><Text style={{fontSize:28,fontWeight:'800',color:C.gold}}>C</Text></View><Text style={{fontSize:22,fontWeight:'700',color:C.txt,marginBottom:4}}>CrewDesk</Text><Text style={{fontSize:13,fontWeight:'700',color:C.gold,marginBottom:2}}>Version 10.0</Text><Text style={{fontSize:13,color:C.txt2,textAlign:'center',marginTop:12,lineHeight:22}}>Professional crew management for film, TV and events production.</Text></View>
        <HR/>
        <View style={{flexDirection:'row',justifyContent:'space-around',paddingVertical:8}}>{[{v:'10',l:'Versions',c:C.gold},{v:'10',l:'Screens',c:C.teal},{v:'100%',l:'Functional',c:C.green}].map(item=>(<View key={item.l} style={{alignItems:'center'}}><Text style={{fontSize:20,fontWeight:'800',color:item.c}}>{item.v}</Text><Text style={{fontSize:11,color:C.txt3,marginTop:2}}>{item.l}</Text></View>))}</View>
      </Sheet>
    </View>
  );
}

const TABS=[
  {key:'Home',label:'Home',icon:'H'},{key:'Business',label:'Business',icon:'B'},{key:'Projects',label:'Projects',icon:'P'},
  {key:'Crew',label:'Crew',icon:'C'},{key:'Schedule',label:'Schedule',icon:'S'},{key:'Messages',label:'Messages',icon:'M'},
  {key:'Invoices',label:'Invoice',icon:'I'},{key:'Reports',label:'Reports',icon:'R'},{key:'Freelancer',label:'Portal',icon:'*'},{key:'More',label:'More',icon:'+'},
];
const TAB_COLOURS={Home:'#F59E0B',Business:'#06B6D4',Projects:'#10B981',Crew:'#8B5CF6',Schedule:'#3B82F6',Messages:'#EC4899',Invoices:'#10B981',Reports:'#F97316',Freelancer:'#8B5CF6',More:'#94A3B8'};

function TabBar({ active, onSelect, store }) {
  const { threads, invoices } = store;
  const unread=threads.reduce((s,t)=>s+t.unread,0); const overdue=invoices.filter(i=>i.status==='Overdue').length;
  const badges={Messages:unread>0?unread:0,Invoices:overdue>0?overdue:0};
  return (
    <View style={{position:'absolute',bottom:0,left:0,right:0,backgroundColor:C.surface,borderTopWidth:1.5,borderColor:C.border}}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:4,paddingVertical:6}}>
        {TABS.map(tab=>{ const isActive=active===tab.key; const cl=TAB_COLOURS[tab.key]||C.gold; const badge=badges[tab.key]||0; return (
          <TouchableOpacity key={tab.key} onPress={()=>onSelect(tab.key)} style={{alignItems:'center',paddingHorizontal:12,paddingVertical:6,minWidth:60,borderRadius:14,backgroundColor:isActive?cl+'18':'transparent',marginHorizontal:2}}>
            <View style={{position:'relative'}}>
              <View style={{width:32,height:32,borderRadius:10,backgroundColor:isActive?cl:C.card,alignItems:'center',justifyContent:'center',marginBottom:3,borderWidth:isActive?0:1,borderColor:C.border}}><Text style={{color:isActive?C.bg:C.txt3,fontWeight:'800',fontSize:14}}>{tab.icon}</Text></View>
              {badge>0&&<View style={{position:'absolute',top:-4,right:-6,backgroundColor:C.red,borderRadius:8,minWidth:16,height:16,alignItems:'center',justifyContent:'center',paddingHorizontal:3,borderWidth:1.5,borderColor:C.surface}}><Text style={{color:C.white,fontSize:9,fontWeight:'800'}}>{badge}</Text></View>}
            </View>
            <Text style={{fontSize:10,fontWeight:isActive?'800':'600',color:isActive?cl:C.txt3,letterSpacing:0.3}}>{tab.label}</Text>
          </TouchableOpacity>
        ); })}
      </ScrollView>
    </View>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState('Home');
  const store = useStore();
  const screens = {
    Home:<HomeScreen store={store} onNav={setActiveTab}/>, Business:<BusinessScreen store={store}/>,
    Projects:<ProjectsScreen store={store}/>, Crew:<CrewScreen store={store}/>,
    Schedule:<ScheduleScreen store={store}/>, Messages:<MessagesScreen store={store}/>,
    Invoices:<InvoicesScreen store={store}/>, Reports:<ReportsScreen store={store}/>,
    Freelancer:<FreelancerScreen store={store}/>, More:<MoreScreen store={store}/>,
  };
  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      {screens[activeTab]}
      <TabBar active={activeTab} onSelect={setActiveTab} store={store}/>
    </View>
  );
}
