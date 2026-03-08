import React,{useState,useRef,useEffect,useCallback} from 'react';
import {
  View,Text,TouchableOpacity,TextInput,ScrollView,FlatList,
  StyleSheet,Animated,Alert,Dimensions,StatusBar,SafeAreaView,
  Platform,RefreshControl,Modal,KeyboardAvoidingView
} from 'react-native';

const {width:SW,height:SH} = Dimensions.get('window');

const C = {
  bg:'#080f1e',surf:'#0e1c36',card:'#0f1d38',card2:'#132240',card3:'#172849',
  teal:'#00c5aa',tealDim:'#00c5aa33',
  gold:'#f59e0b',goldDim:'#f59e0b33',
  red:'#ef4444',redDim:'#ef444430',
  green:'#22c55e',greenDim:'#22c55e30',
  blue:'#3b82f6',blueDim:'#3b82f630',
  purple:'#8b5cf6',purpleDim:'#8b5cf630',
  orange:'#f97316',
  text:'#eef2ff',sub:'#7b93b8',dimmer:'#3d5473',
  border:'#1a3356',border2:'#1e3d66',
  pill:'#142038',overlay:'#000000cc',
};
const T = {xs:11,sm:13,base:15,md:17,lg:20,xl:24,xxl:32,hero:44};
const R = {xs:6,sm:8,md:14,lg:20,xl:28,pill:999};

const fmt = n => {
  if(n>=1000000) return '$'+(n/1000000).toFixed(1)+'M';
  if(n>=1000) return '$'+(n/1000).toFixed(0)+'k';
  return '$'+n;
};
const fmtFull = n => '$'+n.toLocaleString();
const pct = (a,b) => b>0?Math.round((a/b)*100):0;

const SEED_PROJECTS = [
  {id:'p1',name:'Horizon Feature Film',client:'Apex Studios',status:'active',budget:280000,spent:142000,startDate:'2026-01-15',endDate:'2026-06-30',crew:['c1','c2','c3','c4'],desc:'Award-contending feature film production set in modern LA.',expenses:[{desc:'Equipment rental',amount:12000,date:'2026-02-01'},{desc:'Location fees',amount:8500,date:'2026-02-15'}]},
  {id:'p2',name:'Nova TV Series S2',client:'StreamVault',status:'active',budget:950000,spent:310000,startDate:'2026-02-01',endDate:'2026-11-30',crew:['c1','c2','c3','c4','c5','c6'],desc:'Streaming drama series - Season 2, 8 episodes.',expenses:[{desc:'Crew week 1-4',amount:48000,date:'2026-02-01'},{desc:'Stage hire',amount:22000,date:'2026-02-10'}]},
  {id:'p3',name:'Echo Brand Campaign',client:'Lumina Corp',status:'pipeline',budget:45000,spent:0,startDate:'2026-04-01',endDate:'2026-05-15',crew:['c1','c6'],desc:'Multi-platform brand campaign for luxury consumer goods.',expenses:[]},
  {id:'p4',name:'Vertex Music Video',client:'Neon Records',status:'completed',budget:22000,spent:21500,startDate:'2026-01-05',endDate:'2026-01-28',crew:['c1','c4'],desc:'High-concept music video for chart-topping artist.',expenses:[{desc:'Full production',amount:21500,date:'2026-01-28'}]},
  {id:'p5',name:'Summit Documentary',client:'TrueVision',status:'pipeline',budget:120000,spent:0,startDate:'2026-05-01',endDate:'2026-09-30',crew:['c2','c6'],desc:'Feature-length documentary following elite mountaineers.',expenses:[]},
];
const SEED_CREW = [
  {id:'c1',name:'Alex Rivera',role:'Director of Photography',rate:850,rateType:'day',status:'available',skills:['Arri Alexa','DJI Ronin','Lighting Design'],email:'alex@crew.com',phone:'+1 555 0101',rating:4.9,jobs:47,bio:'Award-winning DP with 15 years in film and TV. BAFTA nominated.'},
  {id:'c2',name:'Sam Chen',role:'Production Designer',rate:700,rateType:'day',status:'busy',skills:['AutoCAD','Set Design','Art Direction'],email:'sam@crew.com',phone:'+1 555 0102',rating:4.8,jobs:33,bio:'Visionary production designer known for immersive environments.'},
  {id:'c3',name:'Jordan Blake',role:'Sound Mixer',rate:600,rateType:'day',status:'available',skills:['Pro Tools','Boom Op','Location Sound'],email:'jordan@crew.com',phone:'+1 555 0103',rating:4.7,jobs:58,bio:'On-set sound specialist with broadcast and streaming credits.'},
  {id:'c4',name:'Morgan Lee',role:'1st AC',rate:450,rateType:'day',status:'available',skills:['Focus Pull','Camera Prep','DIT'],email:'morgan@crew.com',phone:'+1 555 0104',rating:4.6,jobs:29,bio:'Precision focus puller with credits on multiple feature films.'},
  {id:'c5',name:'Casey Kim',role:'Gaffer',rate:550,rateType:'day',status:'unavailable',skills:['HMI Lighting','LED Rigs','Electrical'],email:'casey@crew.com',phone:'+1 555 0105',rating:4.8,jobs:41,bio:'Master gaffer specialising in large-scale lighting setups.'},
  {id:'c6',name:'Riley Park',role:'Script Supervisor',rate:400,rateType:'day',status:'available',skills:['Continuity','Script Notes','Shot Breakdown'],email:'riley@crew.com',phone:'+1 555 0106',rating:4.9,jobs:22,bio:'Detail-obsessed script supervisor with flawless continuity record.'},
];
const SEED_EVENTS = [
  {id:'e1',title:'Horizon - INT. Kitchen Scene',project:'p1',projectName:'Horizon Feature Film',date:'2026-03-06',start:'07:00',end:'14:00',crew:['c1','c4','c5'],location:'Stage 4, Sunset Studios',status:'completed',type:'shoot',notes:'Coverage complete. B-roll to pickup next session.'},
  {id:'e2',title:'Nova S2 - Ep 5 Block',project:'p2',projectName:'Nova TV Series S2',date:'2026-03-08',start:'06:00',end:'18:00',crew:['c1','c2','c3','c4'],location:'Downtown LA',status:'today',type:'shoot',notes:'Full crew call. Permits confirmed. Catering on site.'},
  {id:'e3',title:'Echo Campaign - Lookbook',project:'p3',projectName:'Echo Brand Campaign',date:'2026-03-10',start:'09:00',end:'17:00',crew:['c1','c6'],location:'Malibu Beach',status:'upcoming',type:'shoot',notes:'Golden hour shots required. Bring ND filters.'},
  {id:'e4',title:'Summit Doc - Pre-Pro Meeting',project:'p5',projectName:'Summit Documentary',date:'2026-03-12',start:'10:00',end:'12:00',crew:['c2','c6'],location:'CrewDesk HQ',status:'upcoming',type:'meeting',notes:'Review treatment and location scouting results.'},
  {id:'e5',title:'Nova S2 - Table Read',project:'p2',projectName:'Nova TV Series S2',date:'2026-03-15',start:'13:00',end:'16:00',crew:['c3','c6'],location:'Read Room B',status:'upcoming',type:'prep',notes:'Episode 6 and 7 prep. All dept heads invited.'},
];
const SEED_INVOICES = [
  {id:'i1',ref:'INV-2026-001',project:'Nova TV Series S2',client:'StreamVault',amount:48500,status:'paid',date:'2026-02-15',due:'2026-03-01',items:[{desc:'Crew Week 1-4',qty:4,rate:12125}],attachments:['crew_week1-4_timesheet.pdf'],notes:''},
  {id:'i2',ref:'INV-2026-002',project:'Horizon Feature Film',client:'Apex Studios',amount:32000,status:'pending',date:'2026-03-01',due:'2026-03-15',items:[{desc:'Production Week 1-2',qty:2,rate:16000}],attachments:[],notes:'30-day payment terms as per contract.'},
  {id:'i3',ref:'INV-2026-003',project:'Echo Brand Campaign',client:'Lumina Corp',amount:18750,status:'draft',date:'2026-03-07',due:'2026-03-21',items:[{desc:'Pre-Production Services',qty:1,rate:18750},{desc:'Creative Direction',qty:1,rate:0}],attachments:[],notes:'Awaiting client PO number.'},
  {id:'i4',ref:'INV-2026-004',project:'Vertex Music Video',client:'Neon Records',amount:21500,status:'paid',date:'2026-01-28',due:'2026-02-11',items:[{desc:'Full Production Package',qty:1,rate:21500}],attachments:['final_delivery_confirmation.pdf'],notes:''},
  {id:'i5',ref:'INV-2026-005',project:'Nova TV Series S2',client:'StreamVault',amount:55000,status:'overdue',date:'2026-02-01',due:'2026-02-15',items:[{desc:'Crew Week 5-8',qty:4,rate:13750}],attachments:[],notes:'Second chase sent 2026-02-20. Client contact: billing@streamvault.com'},
];
const SEED_MESSAGES = [
  {id:'m1',thread:'Horizon Film - Core Crew',last:'Call sheet for tomorrow sent',time:'2m',unread:3,members:['Alex R','Sam C','Jordan B'],online:true},
  {id:'m2',thread:'Nova S2 - Full Production',last:'Ep 5 location confirmed - Downtown LA',time:'18m',unread:1,members:['Alex R','Sam C','Jordan B','Morgan L'],online:true},
  {id:'m3',thread:'Echo Campaign - Team',last:'Client approved the mood board!',time:'1h',unread:0,members:['Riley P','Sam C'],online:false},
  {id:'m4',thread:'Summit Doc - Core Team',last:'Pre-pro meeting confirmed Thursday',time:'3h',unread:0,members:['Sam C','Riley P'],online:false},
];
const CHAT_SEEDS = {
  'm1':[
    {id:'cm1',sender:'Alex R',text:'Hey all - final call sheet for tomorrow attached. 7am crew call at Stage 4.',time:'09:15',mine:false},
    {id:'cm2',sender:'You',text:'Got it - will review now. Is parking sorted?',time:'09:18',mine:true},
    {id:'cm3',sender:'Sam C',text:'Set is prepped and ready. Lighting rig is up and tested.',time:'09:22',mine:false},
    {id:'cm4',sender:'Jordan B',text:'Sound package loaded. See everyone at 6:45am for sound check.',time:'09:45',mine:false},
  ],
  'm2':[
    {id:'cm5',sender:'Morgan L',text:'Location scouts confirmed Downtown for Ep 5. Parking on 5th.',time:'10:00',mine:false},
    {id:'cm6',sender:'You',text:'Perfect - permits are cleared too. Production office confirmed.',time:'10:05',mine:true},
    {id:'cm7',sender:'Alex R',text:'Great. I will do a quick tech scout tomorrow afternoon at 3pm.',time:'10:12',mine:false},
  ],
};
const FAKE_ATTACHMENTS = ['invoice_breakdown.pdf','project_summary.pdf','contract_draft.pdf','timesheet_week1.pdf','delivery_receipt.pdf'];
function useStore() {
  const [projects,setProjects] = useState(SEED_PROJECTS);
  const [crew,setCrew] = useState(SEED_CREW);
  const [events,setEvents] = useState(SEED_EVENTS);
  const [invoices,setInvoices] = useState(SEED_INVOICES);
  const [messages,setMessages] = useState(SEED_MESSAGES);
  const [chats,setChats] = useState(CHAT_SEEDS);

  const addProject = p => setProjects(prev=>[{...p,id:'p'+Date.now(),expenses:[],crew:[]}, ...prev]);
  const updateProject = p => setProjects(prev=>prev.map(x=>x.id===p.id?p:x));
  const deleteProject = id => setProjects(prev=>prev.filter(x=>x.id!==id));
  const addExpense = (projectId,exp) => setProjects(prev=>prev.map(p=>{
    if(p.id!==projectId) return p;
    const newSpent = p.spent + Number(exp.amount);
    return {...p,spent:newSpent,expenses:[...p.expenses,{...exp,id:'ex'+Date.now()}]};
  }));
  const addCrew = c => setCrew(prev=>[{...c,id:'c'+Date.now(),rating:5,jobs:0,bio:''},...prev]);
  const updateCrew = c => setCrew(prev=>prev.map(x=>x.id===c.id?c:x));
  const deleteCrew = id => setCrew(prev=>prev.filter(x=>x.id!==id));
  const cycleStatus = id => setCrew(prev=>prev.map(c=>{
    if(c.id!==id) return c;
    const next = {available:'busy',busy:'unavailable',unavailable:'available'};
    return {...c,status:next[c.status]||'available'};
  }));
  const addEvent = e => setEvents(prev=>[{...e,id:'e'+Date.now(),crew:[]},...prev]);
  const updateEvent = e => setEvents(prev=>prev.map(x=>x.id===e.id?e:x));
  const deleteEvent = id => setEvents(prev=>prev.filter(x=>x.id!==id));
  const addInvoice = iv => setInvoices(prev=>[{...iv,id:'i'+Date.now(),ref:'INV-'+Date.now(),attachments:[],notes:''},...prev]);
  const updateInvoice = iv => setInvoices(prev=>prev.map(x=>x.id===iv.id?iv:x));
  const deleteInvoice = id => setInvoices(prev=>prev.filter(x=>x.id!==id));
  const sendMessage = (threadId,text) => {
    const msg = {id:'cm'+Date.now(),sender:'You',text,time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),mine:true};
    setChats(prev=>({...prev,[threadId]:[...(prev[threadId]||[]),msg]}));
    setMessages(prev=>prev.map(m=>m.id===threadId?{...m,last:text,time:'now',unread:0}:m));
  };
  const addThread = t => setMessages(prev=>[{...t,id:'m'+Date.now(),unread:0,online:false,members:[]},...prev]);
  return {projects,crew,events,invoices,messages,chats,
    addProject,updateProject,deleteProject,addExpense,
    addCrew,updateCrew,deleteCrew,cycleStatus,
    addEvent,updateEvent,deleteEvent,
    addInvoice,updateInvoice,deleteInvoice,sendMessage,addThread};
}

function PBtn({onPress,style,children,disabled=false}) {
  const sc = useRef(new Animated.Value(1)).current;
  const onIn = () => Animated.spring(sc,{toValue:0.95,useNativeDriver:true,tension:120,friction:8}).start();
  const onOut = () => Animated.spring(sc,{toValue:1,useNativeDriver:true,tension:120,friction:8}).start();
  return (
    <TouchableOpacity onPress={disabled?null:onPress} onPressIn={onIn} onPressOut={onOut} activeOpacity={1}>
      <Animated.View style={[{transform:[{scale:sc}]},style,disabled&&{opacity:0.4}]}>{children}</Animated.View>
    </TouchableOpacity>
  );
}

function Badge({count,color=C.red,small=false}) {
  if(!count&&count!==0) return null;
  const sz = small?14:18;
  return <View style={{backgroundColor:color,borderRadius:R.pill,minWidth:sz,height:sz,
    alignItems:'center',justifyContent:'center',paddingHorizontal:small?3:5}}>
    <Text style={{color:'#fff',fontSize:small?9:T.xs,fontWeight:'800'}}>{count>99?'99+':count}</Text>
  </View>;
}

function Chip({label,color=C.teal,onPress,active=true,small=false}) {
  return (
    <PBtn onPress={onPress}>
      <View style={{paddingHorizontal:small?8:12,paddingVertical:small?3:5,borderRadius:R.pill,
        backgroundColor:active?color+'22':C.pill,borderWidth:1,borderColor:active?color+'88':C.border}}>
        <Text style={{color:active?color:C.sub,fontSize:small?10:T.xs,fontWeight:'700',letterSpacing:0.3}}>{label}</Text>
      </View>
    </PBtn>
  );
}

function FilterPills({options,selected,onSelect,color=C.teal}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:16,paddingVertical:8}}>
      {options.map(o=>(
        <View key={o} style={{marginRight:8}}>
          <Chip label={o} active={selected===o} color={color} onPress={()=>onSelect(o)} />
        </View>
      ))}
    </ScrollView>
  );
}

function Card({style,children,onPress,color}) {
  const base = {backgroundColor:color||C.card,borderRadius:R.lg,padding:16,borderWidth:1,borderColor:C.border};
  if(onPress) return <PBtn onPress={onPress} style={[base,style]}>{children}</PBtn>;
  return <View style={[base,style]}>{children}</View>;
}

function KPI({label,value,sub,color=C.teal,onPress,flex=1}) {
  return (
    <PBtn onPress={onPress} style={{flex,backgroundColor:C.card2,borderRadius:R.lg,padding:14,
      borderWidth:1,borderColor:C.border,alignItems:'center'}}>
      <Text style={{color,fontSize:T.xl,fontWeight:'900',letterSpacing:-0.5}}>{value}</Text>
      <Text style={{color:C.text,fontSize:T.xs,fontWeight:'700',marginTop:3,textAlign:'center',letterSpacing:0.2}}>{label}</Text>
      {sub && <Text style={{color:C.sub,fontSize:10,marginTop:2,textAlign:'center'}}>{sub}</Text>}
    </PBtn>
  );
}

function SecHead({label,action,onAction,color,right}) {
  return (
    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
      <Text style={{color:color||C.text,fontSize:T.md,fontWeight:'800',letterSpacing:-0.3}}>{label}</Text>
      {action && <TouchableOpacity onPress={onAction}><Text style={{color:C.teal,fontSize:T.sm,fontWeight:'600'}}>{action}</Text></TouchableOpacity>}
      {right}
    </View>
  );
}

function Avi({name,size=36,color=C.teal,online=false,style}) {
  const initials = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  return (
    <View style={[{position:'relative',width:size,height:size,borderRadius:size/2,
      backgroundColor:color+'25',alignItems:'center',justifyContent:'center',borderWidth:1.5,borderColor:color+'55'},style]}>
      <Text style={{color,fontSize:size*0.36,fontWeight:'800'}}>{initials}</Text>
      {online && <View style={{position:'absolute',bottom:1,right:1,width:size*0.27,height:size*0.27,
        borderRadius:size*0.14,backgroundColor:C.green,borderWidth:1.5,borderColor:C.bg}} />}
    </View>
  );
}

function Empty({icon,label,sub,action,onAction}) {
  return (
    <View style={{alignItems:'center',paddingVertical:52,paddingHorizontal:28}}>
      <View style={{width:64,height:64,borderRadius:R.xl,backgroundColor:C.card2,alignItems:'center',
        justifyContent:'center',marginBottom:16,borderWidth:1,borderColor:C.border}}>
        <Text style={{color:C.sub,fontSize:T.xl,fontWeight:'700'}}>{icon}</Text>
      </View>
      <Text style={{color:C.text,fontSize:T.md,fontWeight:'700',textAlign:'center'}}>{label}</Text>
      {sub && <Text style={{color:C.sub,fontSize:T.sm,textAlign:'center',marginTop:8,lineHeight:22}}>{sub}</Text>}
      {action && <View style={{marginTop:20}}><Btn label={action} onPress={onAction} /></View>}
    </View>
  );
}

function FInput({label,value,onChangeText,placeholder,kbType='default',multi=false,lines=1,error,hint}) {
  const [focus,setFocus] = useState(false);
  const borderColor = error ? C.red : focus ? C.teal : C.border;
  return (
    <View style={{marginBottom:16}}>
      {label && <Text style={{color:C.sub,fontSize:T.xs,fontWeight:'700',marginBottom:6,textTransform:'uppercase',letterSpacing:1.2}}>{label}</Text>}
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder}
        placeholderTextColor={C.dimmer} keyboardType={kbType} multiline={multi} numberOfLines={lines}
        onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
        style={{backgroundColor:C.surf,borderRadius:R.md,borderWidth:1.5,borderColor,
          color:C.text,fontSize:T.base,paddingHorizontal:16,paddingVertical:multi?14:0,height:multi?lines*32:50}} />
      {error && <Text style={{color:C.red,fontSize:T.xs,marginTop:5,fontWeight:'600'}}>{error}</Text>}
      {hint && !error && <Text style={{color:C.dimmer,fontSize:T.xs,marginTop:4}}>{hint}</Text>}
    </View>
  );
}

function Btn({label,onPress,color=C.teal,outline=false,style,disabled=false,size='md'}) {
  const py = size==='sm'?9:size==='lg'?18:13;
  return (
    <PBtn onPress={onPress} disabled={disabled} style={{
      backgroundColor:outline?'transparent':disabled?C.dimmer:color,
      borderRadius:R.pill,paddingVertical:py,paddingHorizontal:size==='sm'?16:size==='lg'?32:24,
      alignItems:'center',justifyContent:'center',
      borderWidth:1.5,borderColor:outline?color:disabled?C.dimmer:'transparent',...style}}>
      <Text style={{color:outline?color:C.bg,fontSize:T.base,fontWeight:'800',letterSpacing:0.2}}>{label}</Text>
    </PBtn>
  );
}

function Sheet({visible,onClose,title,children}) {
  const ty = useRef(new Animated.Value(400)).current;
  useEffect(()=>{
    Animated.spring(ty,{toValue:visible?0:400,useNativeDriver:true,tension:80,friction:13}).start();
  },[visible]);
  if(!visible) return null;
  return (
    <View style={[StyleSheet.absoluteFillObject,{zIndex:100}]}>
      <TouchableOpacity style={{flex:1,backgroundColor:C.overlay}} activeOpacity={1} onPress={onClose} />
      <Animated.View style={{backgroundColor:C.surf,borderTopLeftRadius:24,borderTopRightRadius:24,
        paddingBottom:36,transform:[{translateY:ty}],maxHeight:SH*0.88}}>
        <View style={{width:40,height:4,borderRadius:2,backgroundColor:C.border,alignSelf:'center',marginTop:12,marginBottom:16}} />
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,marginBottom:4}}>
          <Text style={{color:C.text,fontSize:T.md,fontWeight:'800'}}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={{padding:6}}>
            <Text style={{color:C.sub,fontSize:T.base,fontWeight:'600'}}>Done</Text>
          </TouchableOpacity>
        </View>
        <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}
          contentContainerStyle={{padding:20,paddingTop:12}}>
          {children}
        </ScrollView>
      </Animated.View>
    </View>
  );
}

function Stars({rating}) {
  return (
    <View style={{flexDirection:'row',alignItems:'center'}}>
      {[1,2,3,4,5].map(s=>(
        <Text key={s} style={{fontSize:11,color:s<=Math.round(rating)?C.gold:C.dimmer,marginRight:1}}>
          {s<=Math.round(rating)?'*':'.'}
        </Text>
      ))}
      <Text style={{color:C.sub,fontSize:T.xs,marginLeft:5,fontWeight:'600'}}>{rating.toFixed(1)}</Text>
    </View>
  );
}

function Bar({pct:p,color=C.teal,height=6,style}) {
  const val = Math.min(100,Math.max(0,p));
  return (
    <View style={[{height,borderRadius:R.pill,backgroundColor:C.border2,overflow:'hidden',flex:1},style]}>
      <View style={{width:val+'%',height:'100%',borderRadius:R.pill,backgroundColor:color}} />
    </View>
  );
}

function ScreenHeader({title,onBack,right,sub}) {
  return (
    <View style={{paddingHorizontal:16,paddingVertical:14,borderBottomWidth:1,borderBottomColor:C.border}}>
      {onBack && (
        <TouchableOpacity onPress={onBack} style={{marginBottom:sub?4:0}}>
          <Text style={{color:C.teal,fontSize:T.sm,fontWeight:'600'}}>{'< Back'}</Text>
        </TouchableOpacity>
      )}
      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
        <Text style={{color:C.text,fontSize:T.lg,fontWeight:'800',flex:1,letterSpacing:-0.4}}>{title}</Text>
        {right && <View>{right}</View>}
      </View>
      {sub && <Text style={{color:C.sub,fontSize:T.xs,marginTop:3}}>{sub}</Text>}
    </View>
  );
}

function Divider({style}) {
  return <View style={[{height:1,backgroundColor:C.border,marginVertical:10},style]} />;
}

function StatusDot({status}) {
  const color = status==='available'?C.green:status==='busy'?C.gold:C.red;
  return <View style={{width:8,height:8,borderRadius:4,backgroundColor:color,marginRight:6}} />;
}
function LoginScreen({onLogin}) {
  const [mode,setMode] = useState('choose');
  const [isBiz,setIsBiz] = useState(true);
  const [email,setEmail] = useState('');
  const [pass,setPass] = useState('');
  const [emailErr,setEmailErr] = useState('');
  const [passErr,setPassErr] = useState('');
  const [loading,setLoading] = useState(false);
  const fade = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;

  useEffect(()=>{
    Animated.parallel([
      Animated.timing(fade,{toValue:1,duration:800,useNativeDriver:true}),
      Animated.spring(slideY,{toValue:0,tension:50,friction:10,useNativeDriver:true}),
      Animated.spring(logoScale,{toValue:1,tension:60,friction:8,delay:200,useNativeDriver:true}),
    ]).start();
  },[]);

  const goForm = biz => { setIsBiz(biz); setEmail(''); setPass(''); setEmailErr(''); setPassErr(''); setMode('form'); };

  const validate = () => {
    let ok = true;
    if(!email.includes('@')||email.length<5){setEmailErr('Enter a valid email address');ok=false;}else setEmailErr('');
    if(pass.length<6){setPassErr('Password must be at least 6 characters');ok=false;}else setPassErr('');
    return ok;
  };

  const handleSignIn = () => {
    if(!validate()) return;
    setLoading(true);
    setTimeout(()=>{ setLoading(false); onLogin(isBiz?'business':'freelancer'); },900);
  };

  const accent = isBiz ? C.teal : C.gold;

  if(mode==='form') return (
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}}>
        <ScrollView contentContainerStyle={{flexGrow:1}} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={()=>setMode('choose')} style={{paddingHorizontal:20,paddingTop:20,paddingBottom:4}}>
            <Text style={{color:C.teal,fontSize:T.base,fontWeight:'600'}}>{'< Back'}</Text>
          </TouchableOpacity>
          <View style={{flex:1,padding:28,paddingTop:16}}>
            <View style={{alignItems:'center',marginBottom:36}}>
              <View style={{width:68,height:68,borderRadius:18,backgroundColor:accent+'22',
                borderWidth:2,borderColor:accent+'88',alignItems:'center',justifyContent:'center',marginBottom:14}}>
                <Text style={{color:accent,fontSize:T.xl,fontWeight:'900'}}>{isBiz?'Bz':'Fr'}</Text>
              </View>
              <Text style={{color:C.text,fontSize:T.xl,fontWeight:'800'}}>{isBiz?'Business Sign In':'Freelancer Sign In'}</Text>
              <Text style={{color:C.sub,fontSize:T.sm,marginTop:6,textAlign:'center'}}>
                {isBiz?'Access your production dashboard':'Access your freelancer portal'}
              </Text>
            </View>
            <FInput label="Email Address" value={email} onChangeText={setEmail} placeholder="you@company.com" kbType="email-address" error={emailErr} />
            <FInput label="Password" value={pass} onChangeText={setPass} placeholder="Minimum 6 characters" error={passErr} />
            <View style={{marginTop:8,marginBottom:16}}>
              <Btn label={loading?'Signing in...':'Sign In'} onPress={handleSignIn} color={accent} size='lg' disabled={loading} />
            </View>
            <TouchableOpacity style={{alignItems:'center',marginBottom:12}}>
              <Text style={{color:C.sub,fontSize:T.sm}}>Forgot your password?{'  '}<Text style={{color:accent,fontWeight:'700'}}>Reset it</Text></Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>setMode('choose')} style={{marginTop:16,alignItems:'center',padding:16,borderRadius:R.lg,borderWidth:1,borderColor:C.border}}>
              <Text style={{color:C.sub,fontSize:T.sm}}>Wrong account type?{'  '}<Text style={{color:accent,fontWeight:'700'}}>Switch</Text></Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <Animated.View style={{flex:1,opacity:fade,transform:[{translateY:slideY}]}}>
        <View style={{flex:1,justifyContent:'center',paddingHorizontal:28,paddingBottom:20}}>
          <Animated.View style={{alignItems:'center',marginBottom:52,transform:[{scale:logoScale}]}}>
            <View style={{width:88,height:88,borderRadius:22,backgroundColor:C.teal+'20',
              borderWidth:2.5,borderColor:C.teal+'88',alignItems:'center',justifyContent:'center',marginBottom:22}}>
              <Text style={{color:C.text,fontSize:T.xxl,fontWeight:'900',letterSpacing:-1}}>CD</Text>
            </View>
            <Text style={{color:C.text,fontSize:T.hero,fontWeight:'900',letterSpacing:-2,textAlign:'center'}}>
              Crew<Text style={{color:C.teal}}>Desk</Text>
            </Text>
            <Text style={{color:C.sub,fontSize:T.sm,marginTop:10,textAlign:'center',lineHeight:22}}>
              The professional production management platform
            </Text>
            <Text style={{color:C.dimmer,fontSize:T.xs,marginTop:4,textAlign:'center',letterSpacing:0.5}}>
              Film  |  TV  |  Streaming  |  Live Events
            </Text>
          </Animated.View>
          <Text style={{color:C.sub,fontSize:T.xs,fontWeight:'700',textAlign:'center',letterSpacing:2.5,textTransform:'uppercase',marginBottom:18}}>CONTINUE AS</Text>
          <PBtn onPress={()=>goForm(true)} style={{backgroundColor:C.card,borderRadius:R.xl,padding:20,marginBottom:14,borderWidth:1.5,borderColor:C.teal+'55',flexDirection:'row',alignItems:'center'}}>
            <View style={{width:54,height:54,borderRadius:14,backgroundColor:C.teal+'22',borderWidth:2,borderColor:C.teal+'66',alignItems:'center',justifyContent:'center',marginRight:16}}>
              <Text style={{color:C.teal,fontSize:T.lg,fontWeight:'900'}}>Bz</Text>
            </View>
            <View style={{flex:1}}>
              <Text style={{color:C.text,fontSize:T.md,fontWeight:'800'}}>Business</Text>
              <Text style={{color:C.sub,fontSize:T.sm,marginTop:4,lineHeight:18}}>Manage productions, crew, budgets and billing</Text>
            </View>
            <Text style={{color:C.teal,fontSize:T.lg,fontWeight:'700',marginLeft:8}}>{'>'}</Text>
          </PBtn>
          <PBtn onPress={()=>goForm(false)} style={{backgroundColor:C.card,borderRadius:R.xl,padding:20,borderWidth:1.5,borderColor:C.gold+'55',flexDirection:'row',alignItems:'center'}}>
            <View style={{width:54,height:54,borderRadius:14,backgroundColor:C.gold+'22',borderWidth:2,borderColor:C.gold+'66',alignItems:'center',justifyContent:'center',marginRight:16}}>
              <Text style={{color:C.gold,fontSize:T.lg,fontWeight:'900'}}>Fr</Text>
            </View>
            <View style={{flex:1}}>
              <Text style={{color:C.text,fontSize:T.md,fontWeight:'800'}}>Freelancer / Contractor</Text>
              <Text style={{color:C.sub,fontSize:T.sm,marginTop:4,lineHeight:18}}>Find work, track gigs, send invoices and get paid</Text>
            </View>
            <Text style={{color:C.gold,fontSize:T.lg,fontWeight:'700',marginLeft:8}}>{'>'}</Text>
          </PBtn>
          <Text style={{color:C.dimmer,fontSize:T.xs,textAlign:'center',marginTop:28,lineHeight:18}}>
            By continuing you agree to CrewDesk Terms of Service and Privacy Policy
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
function HomeScreen({store,onNav}) {
  const {projects,invoices,crew,events} = store;
  const [refreshing,setRefreshing] = useState(false);
  const onRefresh = () => { setRefreshing(true); setTimeout(()=>setRefreshing(false),1000); };
  const activeProj = projects.filter(p=>p.status==='active');
  const totalBudget = activeProj.reduce((s,p)=>s+p.budget,0);
  const totalSpent = activeProj.reduce((s,p)=>s+p.spent,0);
  const overdueInv = invoices.filter(iv=>iv.status==='overdue');
  const pendingInv = invoices.filter(iv=>iv.status==='pending'||iv.status==='overdue');
  const pendingAmt = pendingInv.reduce((s,iv)=>s+iv.amount,0);
  const overdueAmt = overdueInv.reduce((s,iv)=>s+iv.amount,0);
  const availCrew = crew.filter(c=>c.status==='available');
  const busyCrew = crew.filter(c=>c.status==='busy');
  const utilPct = crew.length>0?Math.round((busyCrew.length/crew.length)*100):0;
  const todayEvents = events.filter(e=>e.status==='today');
  const budgetPct = pct(totalSpent,totalBudget);

  return (
    <ScrollView style={{flex:1,backgroundColor:C.bg}} showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.teal} />}>
      <SafeAreaView>
        <View style={{paddingHorizontal:20,paddingTop:22,paddingBottom:14}}>
          <Text style={{color:C.dimmer,fontSize:T.xs,fontWeight:'700',letterSpacing:2,textTransform:'uppercase'}}>PRODUCTION DASHBOARD</Text>
          <Text style={{color:C.text,fontSize:T.xl,fontWeight:'900',marginTop:5,letterSpacing:-0.5}}>Overview</Text>
        </View>
        {overdueInv.length>0 && (
          <TouchableOpacity onPress={()=>onNav('invoices')} style={{marginHorizontal:16,marginBottom:12,backgroundColor:C.redDim,borderRadius:R.lg,padding:14,borderWidth:1,borderColor:C.red+'55',flexDirection:'row',alignItems:'center'}}>
            <View style={{width:36,height:36,borderRadius:R.md,backgroundColor:C.red+'22',borderWidth:1,borderColor:C.red+'44',alignItems:'center',justifyContent:'center',marginRight:12}}>
              <Text style={{color:C.red,fontSize:T.sm,fontWeight:'800'}}>!</Text>
            </View>
            <View style={{flex:1}}>
              <Text style={{color:C.red,fontSize:T.sm,fontWeight:'800'}}>{overdueInv.length} Overdue Invoice{overdueInv.length>1?'s':''}</Text>
              <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>{fmt(overdueAmt)} outstanding - immediate action required</Text>
            </View>
            <Text style={{color:C.red,fontSize:T.sm,fontWeight:'700'}}>{'>'}</Text>
          </TouchableOpacity>
        )}
        <View style={{flexDirection:'row',paddingHorizontal:16,marginBottom:10}}>
          <KPI label="Active Projects" value={activeProj.length} sub={projects.filter(p=>p.status==='pipeline').length+' in pipeline'} color={C.teal} onPress={()=>onNav('projects')} />
          <View style={{width:10}} />
          <KPI label="Crew Available" value={availCrew.length} sub={utilPct+'% utilisation'} color={C.green} onPress={()=>onNav('crew')} />
        </View>
        <View style={{flexDirection:'row',paddingHorizontal:16,marginBottom:16}}>
          <KPI label="Outstanding" value={fmt(pendingAmt)} sub={pendingInv.length+' invoice'+(pendingInv.length!==1?'s':'')} color={overdueInv.length>0?C.red:C.gold} onPress={()=>onNav('invoices')} />
          <View style={{width:10}} />
          <KPI label="Budget Used" value={budgetPct+'%'} sub={fmt(totalSpent)+' of '+fmt(totalBudget)} color={budgetPct>80?C.red:budgetPct>60?C.gold:C.blue} onPress={()=>onNav('projects')} />
        </View>
        <View style={{paddingHorizontal:16,marginBottom:18}}>
          <SecHead label="Quick Access" />
          <View style={{flexDirection:'row'}}>
            {[
              {label:'Messages',color:C.blue,nav:'messages',icon:'B'},
              {label:'Invoices',color:C.gold,nav:'invoices',icon:'I'},
              {label:'Reports',color:C.purple,nav:'reports',icon:'R'},
            ].map((item,i)=>(
              <PBtn key={item.nav} onPress={()=>onNav(item.nav)}
                style={{flex:1,marginRight:i<2?10:0,backgroundColor:C.card2,borderRadius:R.lg,padding:14,borderWidth:1,borderColor:C.border,alignItems:'center'}}>
                <View style={{width:42,height:42,borderRadius:R.md,backgroundColor:item.color+'22',borderWidth:1.5,borderColor:item.color+'44',alignItems:'center',justifyContent:'center',marginBottom:8}}>
                  <Text style={{color:item.color,fontSize:T.base,fontWeight:'800'}}>{item.icon}</Text>
                </View>
                <Text style={{color:C.text,fontSize:T.xs,fontWeight:'700'}}>{item.label}</Text>
              </PBtn>
            ))}
          </View>
        </View>
        {todayEvents.length>0 && (
          <View style={{paddingHorizontal:16,marginBottom:18}}>
            <SecHead label="On Set Today" />
            {todayEvents.map(e=>(
              <Card key={e.id} style={{marginBottom:8,flexDirection:'row',alignItems:'center',padding:14}}>
                <View style={{width:4,alignSelf:'stretch',borderRadius:2,backgroundColor:C.teal,marginRight:12}} />
                <View style={{flex:1}}>
                  <Text style={{color:C.text,fontSize:T.sm,fontWeight:'700'}}>{e.title}</Text>
                  <Text style={{color:C.sub,fontSize:T.xs,marginTop:3}}>{e.start} - {e.end}</Text>
                  <Text style={{color:C.dimmer,fontSize:T.xs,marginTop:1}}>{e.location}</Text>
                </View>
                <View style={{backgroundColor:C.teal,borderRadius:R.pill,paddingHorizontal:8,paddingVertical:3}}>
                  <Text style={{color:C.bg,fontSize:9,fontWeight:'800'}}>LIVE</Text>
                </View>
              </Card>
            ))}
          </View>
        )}
        <View style={{paddingHorizontal:16,marginBottom:24}}>
          <SecHead label="Active Productions" action="All projects" onAction={()=>onNav('projects')} />
          {activeProj.length===0
            ? <Card><Text style={{color:C.sub,textAlign:'center',paddingVertical:8,fontSize:T.sm}}>No active projects</Text></Card>
            : activeProj.map(p=>{
              const bp = pct(p.spent,p.budget);
              return (
                <Card key={p.id} style={{marginBottom:10,padding:14}}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                    <View style={{flex:1,marginRight:10}}>
                      <Text style={{color:C.text,fontSize:T.sm,fontWeight:'700'}}>{p.name}</Text>
                      <Text style={{color:C.sub,fontSize:T.xs,marginTop:3}}>{p.client}</Text>
                    </View>
                    <Text style={{color:C.sub,fontSize:T.xs}}>{crew.filter(c=>p.crew.includes(c.id)).length} crew</Text>
                  </View>
                  <View style={{flexDirection:'row',alignItems:'center',marginBottom:6}}>
                    <Bar pct={bp} color={bp>85?C.red:bp>65?C.gold:C.teal} />
                    <Text style={{color:C.sub,fontSize:T.xs,marginLeft:8,fontWeight:'600',minWidth:32}}>{bp}%</Text>
                  </View>
                  <Text style={{color:C.dimmer,fontSize:T.xs}}>{fmt(p.spent)} spent of {fmt(p.budget)}</Text>
                </Card>
              );
            })}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

function FHomeScreen({store,onNav,userName='Jordan'}) {
  const {invoices,events} = store;
  const [refreshing,setRefreshing] = useState(false);
  const onRefresh = () => { setRefreshing(true); setTimeout(()=>setRefreshing(false),1000); };
  const paidInv = invoices.filter(iv=>iv.status==='paid');
  const pendingInv = invoices.filter(iv=>iv.status==='pending');
  const overdueInv = invoices.filter(iv=>iv.status==='overdue');
  const earned = paidInv.reduce((s,iv)=>s+iv.amount,0);
  const pending = pendingInv.reduce((s,iv)=>s+iv.amount,0);
  const overdue = overdueInv.reduce((s,iv)=>s+iv.amount,0);
  const upcoming = events.filter(e=>e.status==='upcoming'||e.status==='today');
  const collRate = invoices.length>0?pct(paidInv.length,invoices.length):0;
  return (
    <ScrollView style={{flex:1,backgroundColor:C.bg}} showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.gold} />}>
      <SafeAreaView>
        <View style={{paddingHorizontal:20,paddingTop:22,paddingBottom:14}}>
          <Text style={{color:C.dimmer,fontSize:T.xs,fontWeight:'700',letterSpacing:2,textTransform:'uppercase'}}>FREELANCER PORTAL</Text>
          <Text style={{color:C.text,fontSize:T.xl,fontWeight:'900',marginTop:5,letterSpacing:-0.5}}>Hi, {userName}</Text>
        </View>
        {overdue>0 && (
          <TouchableOpacity onPress={()=>onNav('invoices')} style={{marginHorizontal:16,marginBottom:12,backgroundColor:C.redDim,borderRadius:R.lg,padding:14,borderWidth:1,borderColor:C.red+'55',flexDirection:'row',alignItems:'center'}}>
            <View style={{width:36,height:36,borderRadius:R.md,backgroundColor:C.red+'22',borderWidth:1,borderColor:C.red+'44',alignItems:'center',justifyContent:'center',marginRight:12}}>
              <Text style={{color:C.red,fontSize:T.sm,fontWeight:'800'}}>!</Text>
            </View>
            <View style={{flex:1}}>
              <Text style={{color:C.red,fontSize:T.sm,fontWeight:'800'}}>Overdue Payment</Text>
              <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>{fmt(overdue)} outstanding - follow up now</Text>
            </View>
            <Text style={{color:C.red,fontSize:T.sm,fontWeight:'700'}}>{'>'}</Text>
          </TouchableOpacity>
        )}
        <View style={{flexDirection:'row',paddingHorizontal:16,marginBottom:10}}>
          <KPI label="Earned YTD" value={fmt(earned)} color={C.teal} onPress={()=>onNav('invoices')} />
          <View style={{width:10}} />
          <KPI label="Pending Pay" value={fmt(pending)} color={C.gold} onPress={()=>onNav('invoices')} />
        </View>
        <View style={{flexDirection:'row',paddingHorizontal:16,marginBottom:16}}>
          <KPI label="Collection Rate" value={collRate+'%'} color={C.green} onPress={()=>onNav('invoices')} />
          <View style={{width:10}} />
          <KPI label="Upcoming Gigs" value={upcoming.length} color={C.blue} onPress={()=>onNav('schedule')} />
        </View>
        <View style={{paddingHorizontal:16,marginBottom:18}}>
          <SecHead label="Quick Access" />
          <View style={{flexDirection:'row'}}>
            {[
              {label:'Messages',color:C.blue,nav:'messages',icon:'B'},
              {label:'Reports',color:C.purple,nav:'reports',icon:'R'},
              {label:'Portal',color:C.gold,nav:'portal',icon:'P'},
            ].map((item,i)=>(
              <PBtn key={item.nav} onPress={()=>onNav(item.nav)}
                style={{flex:1,marginRight:i<2?10:0,backgroundColor:C.card2,borderRadius:R.lg,padding:14,borderWidth:1,borderColor:C.border,alignItems:'center'}}>
                <View style={{width:42,height:42,borderRadius:R.md,backgroundColor:item.color+'22',borderWidth:1.5,borderColor:item.color+'44',alignItems:'center',justifyContent:'center',marginBottom:8}}>
                  <Text style={{color:item.color,fontSize:T.base,fontWeight:'800'}}>{item.icon}</Text>
                </View>
                <Text style={{color:C.text,fontSize:T.xs,fontWeight:'700'}}>{item.label}</Text>
              </PBtn>
            ))}
          </View>
        </View>
        <View style={{paddingHorizontal:16,marginBottom:16}}>
          <SecHead label="Upcoming Work" action="Schedule" onAction={()=>onNav('schedule')} />
          {upcoming.length===0
            ? <Card><Text style={{color:C.sub,textAlign:'center',paddingVertical:8,fontSize:T.sm}}>No upcoming gigs booked</Text></Card>
            : upcoming.slice(0,3).map(e=>(
              <Card key={e.id} style={{marginBottom:8,flexDirection:'row',alignItems:'center',padding:14}}>
                <View style={{width:4,alignSelf:'stretch',borderRadius:2,backgroundColor:e.status==='today'?C.teal:C.gold,marginRight:12}} />
                <View style={{flex:1}}>
                  <Text style={{color:C.text,fontSize:T.sm,fontWeight:'700'}}>{e.title}</Text>
                  <Text style={{color:C.sub,fontSize:T.xs,marginTop:3}}>{e.date}  |  {e.start} - {e.end}</Text>
                </View>
                {e.status==='today' && <View style={{backgroundColor:C.teal,borderRadius:R.pill,paddingHorizontal:8,paddingVertical:3}}><Text style={{color:C.bg,fontSize:9,fontWeight:'800'}}>TODAY</Text></View>}
              </Card>
            ))}
        </View>
        <View style={{paddingHorizontal:16,marginBottom:28}}>
          <SecHead label="Recent Invoices" action="All invoices" onAction={()=>onNav('invoices')} />
          {invoices.slice(0,3).map(ri=>(
            <Card key={ri.id} style={{marginBottom:8,flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:14}}>
              <View style={{flex:1,marginRight:10}}>
                <Text style={{color:C.text,fontSize:T.sm,fontWeight:'600'}}>{ri.project}</Text>
                <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>{ri.ref}  |  {ri.date}</Text>
              </View>
              <View style={{alignItems:'flex-end'}}>
                <Text style={{color:C.text,fontSize:T.sm,fontWeight:'800'}}>{fmtFull(ri.amount)}</Text>
                <View style={{marginTop:5}}><Chip label={ri.status.toUpperCase()} small active color={ri.status==='paid'?C.green:ri.status==='overdue'?C.red:C.gold} onPress={()=>{}} /></View>
              </View>
            </Card>
          ))}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
function ProjectsScreen({store}) {
  const {projects,crew,addProject,updateProject,deleteProject,addExpense} = store;
  const [filter,setFilter] = useState('All');
  const [search,setSearch] = useState('');
  const [sheet,setSheet] = useState(false);
  const [edit,setEdit] = useState(null);
  const [detailId,setDetailId] = useState(null);
  const [expSheet,setExpSheet] = useState(false);
  const [expForm,setExpForm] = useState({desc:'',amount:''});
  const [form,setForm] = useState({name:'',client:'',budget:'',status:'active',desc:''});
  const [errors,setErrors] = useState({});
  const filters = ['All','Active','Pipeline','Completed'];
  const statusColor = s => s==='active'?C.teal:s==='pipeline'?C.gold:s==='completed'?C.green:C.sub;
  const filtered = projects.filter(p=>{
    const matchF = filter==='All'||p.status===filter.toLowerCase();
    const matchS = !search||p.name.toLowerCase().includes(search.toLowerCase())||p.client.toLowerCase().includes(search.toLowerCase());
    return matchF && matchS;
  });
  const detail = projects.find(p=>p.id===detailId);
  const openAdd = () => { setEdit(null); setForm({name:'',client:'',budget:'',status:'active',desc:''}); setErrors({}); setSheet(true); };
  const openEdit = p => { setEdit(p); setForm({name:p.name,client:p.client,budget:String(p.budget),status:p.status,desc:p.desc||''}); setErrors({}); setSheet(true); };
  const validate = () => {
    const e={};
    if(!form.name.trim()) e.name='Project name is required';
    if(!form.client.trim()) e.client='Client name is required';
    if(!form.budget||isNaN(Number(form.budget))||Number(form.budget)<=0) e.budget='Enter a valid budget amount';
    setErrors(e); return Object.keys(e).length===0;
  };
  const save = () => {
    if(!validate()) return;
    const data={...form,budget:Number(form.budget),spent:edit?edit.spent:0,startDate:edit?edit.startDate:'2026-03-08',endDate:edit?edit.endDate:'2026-12-31',crew:edit?edit.crew:[],expenses:edit?edit.expenses:[]};
    if(edit) updateProject({...edit,...data}); else addProject(data);
    setSheet(false);
  };
  const addExp = () => {
    if(!expForm.desc.trim()||!expForm.amount) return;
    addExpense(detailId,expForm); setExpForm({desc:'',amount:''}); setExpSheet(false);
  };
  const confirmDelete = p => Alert.alert('Delete Project','Remove "'+p.name+'" and all its data?',[
    {text:'Cancel',style:'cancel'},
    {text:'Delete',style:'destructive',onPress:()=>{ deleteProject(p.id); if(detailId===p.id) setDetailId(null); }},
  ]);

  if(detailId && detail) return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <SafeAreaView style={{flex:1}}>
        <ScreenHeader title={detail.name} onBack={()=>setDetailId(null)} sub={detail.client}
          right={<View style={{flexDirection:'row'}}>
            <TouchableOpacity onPress={()=>openEdit(detail)} style={{marginRight:16}}><Text style={{color:C.teal,fontSize:T.sm,fontWeight:'600'}}>Edit</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>confirmDelete(detail)}><Text style={{color:C.red,fontSize:T.sm,fontWeight:'600'}}>Delete</Text></TouchableOpacity>
          </View>}
        />
        <ScrollView contentContainerStyle={{padding:16}}>
          <View style={{flexDirection:'row',marginBottom:10}}>
            <Chip label={detail.status.toUpperCase()} color={statusColor(detail.status)} active onPress={()=>{}} />
            <Text style={{color:C.sub,fontSize:T.xs,marginLeft:12,alignSelf:'center'}}>{detail.startDate} - {detail.endDate}</Text>
          </View>
          <Card style={{marginBottom:14}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:12}}>
              <View style={{alignItems:'center'}}>
                <Text style={{color:C.teal,fontSize:T.lg,fontWeight:'800'}}>{fmt(detail.budget)}</Text>
                <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>Total Budget</Text>
              </View>
              <View style={{alignItems:'center'}}>
                <Text style={{color:C.gold,fontSize:T.lg,fontWeight:'800'}}>{fmt(detail.spent)}</Text>
                <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>Spent</Text>
              </View>
              <View style={{alignItems:'center'}}>
                <Text style={{color:C.green,fontSize:T.lg,fontWeight:'800'}}>{fmt(detail.budget-detail.spent)}</Text>
                <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>Remaining</Text>
              </View>
            </View>
            <View style={{flexDirection:'row',alignItems:'center'}}>
              <Bar pct={pct(detail.spent,detail.budget)} color={pct(detail.spent,detail.budget)>85?C.red:pct(detail.spent,detail.budget)>65?C.gold:C.teal} />
              <Text style={{color:C.sub,fontSize:T.xs,marginLeft:8,fontWeight:'700'}}>{pct(detail.spent,detail.budget)}%</Text>
            </View>
          </Card>
          {detail.desc ? <Card style={{marginBottom:14}}><SecHead label="Description" /><Text style={{color:C.sub,fontSize:T.sm,lineHeight:22}}>{detail.desc}</Text></Card> : null}
          <Card style={{marginBottom:14}}>
            <SecHead label="Crew Assigned" right={<Text style={{color:C.sub,fontSize:T.xs}}>{detail.crew.length} members</Text>} />
            {detail.crew.length===0
              ? <Text style={{color:C.sub,fontSize:T.sm}}>No crew assigned yet</Text>
              : detail.crew.map(cid=>{
                const cm = crew.find(c=>c.id===cid);
                if(!cm) return null;
                return (
                  <View key={cid} style={{flexDirection:'row',alignItems:'center',paddingVertical:8,borderBottomWidth:1,borderBottomColor:C.border}}>
                    <Avi name={cm.name} size={34} color={cm.status==='available'?C.green:cm.status==='busy'?C.gold:C.red} />
                    <View style={{flex:1,marginLeft:10}}>
                      <Text style={{color:C.text,fontSize:T.sm,fontWeight:'600'}}>{cm.name}</Text>
                      <Text style={{color:C.sub,fontSize:T.xs}}>{cm.role}</Text>
                    </View>
                    <Text style={{color:C.sub,fontSize:T.xs}}>{fmt(cm.rate)}/day</Text>
                  </View>
                );
              })}
          </Card>
          <Card style={{marginBottom:14}}>
            <SecHead label="Expenses" right={
              <TouchableOpacity onPress={()=>setExpSheet(true)} style={{backgroundColor:C.teal+'22',borderRadius:R.pill,paddingHorizontal:12,paddingVertical:5,borderWidth:1,borderColor:C.teal+'44'}}>
                <Text style={{color:C.teal,fontSize:T.xs,fontWeight:'700'}}>+ Log Expense</Text>
              </TouchableOpacity>
            } />
            {(detail.expenses||[]).length===0
              ? <Text style={{color:C.sub,fontSize:T.sm}}>No expenses logged yet</Text>
              : (detail.expenses||[]).map((ex,i)=>(
                <View key={i} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:8,borderBottomWidth:1,borderBottomColor:C.border}}>
                  <View style={{flex:1}}><Text style={{color:C.text,fontSize:T.sm,fontWeight:'600'}}>{ex.desc}</Text><Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>{ex.date}</Text></View>
                  <Text style={{color:C.gold,fontSize:T.sm,fontWeight:'700'}}>{fmt(Number(ex.amount))}</Text>
                </View>
              ))}
          </Card>
        </ScrollView>
      </SafeAreaView>
      <Sheet visible={expSheet} onClose={()=>setExpSheet(false)} title="Log Expense">
        <FInput label="Description" value={expForm.desc} onChangeText={v=>setExpForm(f=>({...f,desc:v}))} placeholder="e.g. Equipment rental" />
        <FInput label="Amount" value={expForm.amount} onChangeText={v=>setExpForm(f=>({...f,amount:v}))} placeholder="e.g. 5000" kbType="numeric" />
        <Btn label="Log Expense" onPress={addExp} style={{marginTop:4}} />
      </Sheet>
      <Sheet visible={sheet} onClose={()=>setSheet(false)} title="Edit Project">
        <FInput label="Project Name" value={form.name} onChangeText={v=>setForm(f=>({...f,name:v}))} placeholder="e.g. Horizon Feature Film" error={errors.name} />
        <FInput label="Client" value={form.client} onChangeText={v=>setForm(f=>({...f,client:v}))} placeholder="e.g. Apex Studios" error={errors.client} />
        <FInput label="Budget" value={form.budget} onChangeText={v=>setForm(f=>({...f,budget:v}))} placeholder="e.g. 250000" kbType="numeric" error={errors.budget} />
        <View style={{marginBottom:16}}>
          <Text style={{color:C.sub,fontSize:T.xs,fontWeight:'700',marginBottom:8,textTransform:'uppercase',letterSpacing:1.2}}>STATUS</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap'}}>
            {['active','pipeline','completed'].map(s=>(
              <View key={s} style={{marginRight:8,marginBottom:8}}>
                <Chip label={s.toUpperCase()} active={form.status===s} color={statusColor(s)} onPress={()=>setForm(f=>({...f,status:s}))} />
              </View>
            ))}
          </View>
        </View>
        <FInput label="Description" value={form.desc} onChangeText={v=>setForm(f=>({...f,desc:v}))} placeholder="Brief project description" multi lines={3} />
        <Btn label="Save Changes" onPress={save} style={{marginTop:4}} />
      </Sheet>
    </View>
  );

  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <SafeAreaView style={{flex:1}}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingTop:20,paddingBottom:12}}>
          <Text style={{color:C.text,fontSize:T.xl,fontWeight:'900',letterSpacing:-0.5}}>Projects</Text>
          <Btn label="+ New" onPress={openAdd} size='sm' />
        </View>
        <View style={{flexDirection:'row',paddingHorizontal:16,marginBottom:10}}>
          {[
            {label:'Total Budget',val:fmt(projects.reduce((s,p)=>s+p.budget,0)),color:C.teal},
            {label:'Active',val:projects.filter(p=>p.status==='active').length,color:C.green},
            {label:'Pipeline',val:projects.filter(p=>p.status==='pipeline').length,color:C.gold},
          ].map((s,i)=>(
            <View key={s.label} style={{flex:1,backgroundColor:C.card2,borderRadius:R.md,padding:10,marginRight:i<2?8:0,alignItems:'center',borderWidth:1,borderColor:C.border}}>
              <Text style={{color:s.color,fontSize:T.md,fontWeight:'800'}}>{s.val}</Text>
              <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>{s.label}</Text>
            </View>
          ))}
        </View>
        <View style={{flexDirection:'row',alignItems:'center',marginHorizontal:16,marginBottom:4,backgroundColor:C.surf,borderRadius:R.pill,paddingHorizontal:14,borderWidth:1,borderColor:C.border}}>
          <TextInput value={search} onChangeText={setSearch} placeholder="Search projects..." placeholderTextColor={C.dimmer} style={{flex:1,color:C.text,fontSize:T.sm,paddingVertical:10}} />
          {search.length>0 && <TouchableOpacity onPress={()=>setSearch('')} style={{width:20,height:20,borderRadius:10,backgroundColor:C.dimmer,alignItems:'center',justifyContent:'center'}}><Text style={{color:C.bg,fontSize:11,fontWeight:'700',lineHeight:13}}>x</Text></TouchableOpacity>}
        </View>
        <FilterPills options={filters} selected={filter} onSelect={setFilter} />
        <FlatList data={filtered} keyExtractor={p=>p.id} contentContainerStyle={{paddingHorizontal:16,paddingBottom:24}}
          ListEmptyComponent={<Empty icon="P" label="No projects found" sub="Tap + New to create your first project" action="New Project" onAction={openAdd} />}
          renderItem={({item:p})=>{
            const bp = pct(p.spent,p.budget);
            return (
              <PBtn onPress={()=>setDetailId(p.id)}>
                <View style={{backgroundColor:C.card,borderRadius:R.lg,padding:14,marginBottom:10,borderWidth:1,borderColor:C.border}}>
                  <View style={{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginBottom:10}}>
                    <View style={{flex:1,marginRight:10}}>
                      <Text style={{color:C.text,fontSize:T.base,fontWeight:'700'}}>{p.name}</Text>
                      <Text style={{color:C.sub,fontSize:T.xs,marginTop:3}}>{p.client}</Text>
                    </View>
                    <Chip label={p.status.toUpperCase()} color={statusColor(p.status)} active small onPress={()=>{}} />
                  </View>
                  <View style={{flexDirection:'row',alignItems:'center',marginBottom:6}}>
                    <Bar pct={bp} color={bp>85?C.red:bp>65?C.gold:C.teal} />
                    <Text style={{color:C.sub,fontSize:T.xs,marginLeft:8,fontWeight:'600',minWidth:28}}>{bp}%</Text>
                  </View>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                    <Text style={{color:C.dimmer,fontSize:T.xs}}>{fmt(p.spent)} / {fmt(p.budget)}</Text>
                    <View style={{flexDirection:'row'}}>
                      <TouchableOpacity onPress={()=>openEdit(p)} style={{paddingHorizontal:10,paddingVertical:4,marginRight:4}}><Text style={{color:C.teal,fontSize:T.xs,fontWeight:'600'}}>Edit</Text></TouchableOpacity>
                      <TouchableOpacity onPress={()=>confirmDelete(p)} style={{paddingHorizontal:10,paddingVertical:4}}><Text style={{color:C.red,fontSize:T.xs,fontWeight:'600'}}>Delete</Text></TouchableOpacity>
                    </View>
                  </View>
                </View>
              </PBtn>
            );
          }}
        />
      </SafeAreaView>
      <Sheet visible={sheet} onClose={()=>setSheet(false)} title={edit?'Edit Project':'New Project'}>
        <FInput label="Project Name" value={form.name} onChangeText={v=>setForm(f=>({...f,name:v}))} placeholder="e.g. Horizon Feature Film" error={errors.name} />
        <FInput label="Client" value={form.client} onChangeText={v=>setForm(f=>({...f,client:v}))} placeholder="e.g. Apex Studios" error={errors.client} />
        <FInput label="Budget" value={form.budget} onChangeText={v=>setForm(f=>({...f,budget:v}))} placeholder="e.g. 250000" kbType="numeric" error={errors.budget} />
        <View style={{marginBottom:16}}>
          <Text style={{color:C.sub,fontSize:T.xs,fontWeight:'700',marginBottom:8,textTransform:'uppercase',letterSpacing:1.2}}>STATUS</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap'}}>
            {['active','pipeline','completed'].map(s=>(
              <View key={s} style={{marginRight:8,marginBottom:8}}>
                <Chip label={s.toUpperCase()} active={form.status===s} color={statusColor(s)} onPress={()=>setForm(f=>({...f,status:s}))} />
              </View>
            ))}
          </View>
        </View>
        <FInput label="Description" value={form.desc} onChangeText={v=>setForm(f=>({...f,desc:v}))} placeholder="Brief project description" multi lines={3} />
        <Btn label={edit?'Save Changes':'Create Project'} onPress={save} style={{marginTop:4}} />
      </Sheet>
    </View>
  );
}
function CrewScreen({store}) {
  const {crew,addCrew,updateCrew,deleteCrew,cycleStatus} = store;
  const [filter,setFilter] = useState('All');
  const [search,setSearch] = useState('');
  const [sheet,setSheet] = useState(false);
  const [edit,setEdit] = useState(null);
  const [profileId,setProfileId] = useState(null);
  const [form,setForm] = useState({name:'',role:'',rate:'',rateType:'day',status:'available',email:'',phone:'',skills:'',bio:''});
  const [errors,setErrors] = useState({});
  const filters = ['All','Available','Busy','Unavailable'];
  const statusColor = s => s==='available'?C.green:s==='busy'?C.gold:C.red;
  const filtered = crew.filter(c=>{
    const matchF = filter==='All'||c.status===filter.toLowerCase();
    const matchS = !search||c.name.toLowerCase().includes(search.toLowerCase())||c.role.toLowerCase().includes(search.toLowerCase());
    return matchF && matchS;
  });
  const profile = crew.find(c=>c.id===profileId);
  const openAdd = () => { setEdit(null); setForm({name:'',role:'',rate:'',rateType:'day',status:'available',email:'',phone:'',skills:'',bio:''}); setErrors({}); setSheet(true); };
  const openEdit = c => { setEdit(c); setForm({name:c.name,role:c.role,rate:String(c.rate),rateType:c.rateType,status:c.status,email:c.email,phone:c.phone,skills:(c.skills||[]).join(', '),bio:c.bio||''}); setErrors({}); setSheet(true); };
  const validate = () => {
    const e={};
    if(!form.name.trim()) e.name='Full name is required';
    if(!form.role.trim()) e.role='Role is required';
    if(!form.rate||isNaN(Number(form.rate))||Number(form.rate)<=0) e.rate='Enter a valid day rate';
    if(!form.email.includes('@')||form.email.length<5) e.email='Enter a valid email address';
    setErrors(e); return Object.keys(e).length===0;
  };
  const save = () => {
    if(!validate()) return;
    const data={...form,rate:Number(form.rate),skills:form.skills.split(',').map(s=>s.trim()).filter(Boolean),rating:edit?edit.rating:5,jobs:edit?edit.jobs:0};
    if(edit) updateCrew({...edit,...data}); else addCrew(data);
    setSheet(false);
  };
  const confirmDelete = c => Alert.alert('Remove Crew Member','Remove '+c.name+' from your roster?',[
    {text:'Cancel',style:'cancel'},
    {text:'Remove',style:'destructive',onPress:()=>{ deleteCrew(c.id); if(profileId===c.id) setProfileId(null); }},
  ]);

  if(profileId && profile) {
    const cm = crew.find(c=>c.id===profileId)||profile;
    return (
      <View style={{flex:1,backgroundColor:C.bg}}>
        <SafeAreaView style={{flex:1}}>
          <ScreenHeader title="Crew Profile" onBack={()=>setProfileId(null)}
            right={<View style={{flexDirection:'row'}}>
              <TouchableOpacity onPress={()=>{setProfileId(null);openEdit(cm);}} style={{marginRight:16}}><Text style={{color:C.teal,fontSize:T.sm,fontWeight:'600'}}>Edit</Text></TouchableOpacity>
              <TouchableOpacity onPress={()=>confirmDelete(cm)}><Text style={{color:C.red,fontSize:T.sm,fontWeight:'600'}}>Remove</Text></TouchableOpacity>
            </View>}
          />
          <ScrollView contentContainerStyle={{padding:16}}>
            <Card style={{alignItems:'center',marginBottom:16,paddingVertical:24}}>
              <Avi name={cm.name} size={64} color={statusColor(cm.status)} online={cm.status==='available'} />
              <Text style={{color:C.text,fontSize:T.lg,fontWeight:'800',marginTop:14}}>{cm.name}</Text>
              <Text style={{color:C.sub,fontSize:T.sm,marginTop:4}}>{cm.role}</Text>
              <View style={{marginTop:8}}><Stars rating={cm.rating} /></View>
              <TouchableOpacity onPress={()=>cycleStatus(cm.id)} style={{marginTop:12,flexDirection:'row',alignItems:'center',backgroundColor:statusColor(cm.status)+'22',borderRadius:R.pill,paddingHorizontal:16,paddingVertical:7,borderWidth:1,borderColor:statusColor(cm.status)+'55'}}>
                <StatusDot status={cm.status} />
                <Text style={{color:statusColor(cm.status),fontSize:T.sm,fontWeight:'700',textTransform:'uppercase'}}>{cm.status}</Text>
                <Text style={{color:statusColor(cm.status),fontSize:T.xs,marginLeft:8,opacity:0.7}}>(tap to change)</Text>
              </TouchableOpacity>
            </Card>
            <View style={{flexDirection:'row',marginBottom:14}}>
              {[{label:'Jobs Done',val:cm.jobs,color:C.teal},{label:'Per Day',val:fmt(cm.rate),color:C.gold},{label:'Rating',val:cm.rating,color:C.green}].map((s,i)=>(
                <View key={s.label} style={{flex:1,backgroundColor:C.card2,borderRadius:R.md,padding:12,marginRight:i<2?8:0,alignItems:'center',borderWidth:1,borderColor:C.border}}>
                  <Text style={{color:s.color,fontSize:T.lg,fontWeight:'800'}}>{s.val}</Text>
                  <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>{s.label}</Text>
                </View>
              ))}
            </View>
            {cm.bio ? <Card style={{marginBottom:14}}><SecHead label="About" /><Text style={{color:C.sub,fontSize:T.sm,lineHeight:22}}>{cm.bio}</Text></Card> : null}
            <Card style={{marginBottom:14}}>
              <SecHead label="Skills" />
              <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                {(cm.skills||[]).map(sk=>(
                  <View key={sk} style={{backgroundColor:C.teal+'18',borderRadius:R.pill,paddingHorizontal:12,paddingVertical:5,marginRight:8,marginBottom:8,borderWidth:1,borderColor:C.teal+'33'}}>
                    <Text style={{color:C.teal,fontSize:T.xs,fontWeight:'600'}}>{sk}</Text>
                  </View>
                ))}
              </View>
            </Card>
            <Card style={{marginBottom:24}}>
              <SecHead label="Contact" />
              <View style={{flexDirection:'row',alignItems:'center',marginBottom:10}}>
                <Text style={{color:C.sub,fontSize:T.sm,width:64}}>Email</Text>
                <Text style={{color:C.text,fontSize:T.sm,flex:1}}>{cm.email}</Text>
              </View>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={{color:C.sub,fontSize:T.sm,width:64}}>Phone</Text>
                <Text style={{color:C.text,fontSize:T.sm,flex:1}}>{cm.phone}</Text>
              </View>
            </Card>
          </ScrollView>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <SafeAreaView style={{flex:1}}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingTop:20,paddingBottom:12}}>
          <Text style={{color:C.text,fontSize:T.xl,fontWeight:'900',letterSpacing:-0.5}}>Crew Roster</Text>
          <Btn label="+ Add" onPress={openAdd} size='sm' />
        </View>
        <View style={{flexDirection:'row',paddingHorizontal:16,marginBottom:10}}>
          {[{label:'Total',val:crew.length,color:C.text},{label:'Available',val:crew.filter(c=>c.status==='available').length,color:C.green},{label:'On Job',val:crew.filter(c=>c.status==='busy').length,color:C.gold},{label:'Unavail.',val:crew.filter(c=>c.status==='unavailable').length,color:C.red}].map((s,i)=>(
            <View key={s.label} style={{flex:1,backgroundColor:C.card2,borderRadius:R.md,padding:10,marginRight:i<3?6:0,alignItems:'center',borderWidth:1,borderColor:C.border}}>
              <Text style={{color:s.color,fontSize:T.md,fontWeight:'800'}}>{s.val}</Text>
              <Text style={{color:C.sub,fontSize:10,marginTop:2}}>{s.label}</Text>
            </View>
          ))}
        </View>
        <View style={{flexDirection:'row',alignItems:'center',marginHorizontal:16,marginBottom:4,backgroundColor:C.surf,borderRadius:R.pill,paddingHorizontal:14,borderWidth:1,borderColor:C.border}}>
          <TextInput value={search} onChangeText={setSearch} placeholder="Search by name or role..." placeholderTextColor={C.dimmer} style={{flex:1,color:C.text,fontSize:T.sm,paddingVertical:10}} />
          {search.length>0 && <TouchableOpacity onPress={()=>setSearch('')} style={{width:20,height:20,borderRadius:10,backgroundColor:C.dimmer,alignItems:'center',justifyContent:'center'}}><Text style={{color:C.bg,fontSize:11,fontWeight:'700',lineHeight:13}}>x</Text></TouchableOpacity>}
        </View>
        <FilterPills options={filters} selected={filter} onSelect={setFilter} color={C.green} />
        <FlatList data={filtered} keyExtractor={c=>c.id} contentContainerStyle={{paddingHorizontal:16,paddingBottom:24}}
          ListEmptyComponent={<Empty icon="C" label="No crew found" sub="Try adjusting your search or add a new crew member" />}
          renderItem={({item:c})=>(
            <PBtn onPress={()=>setProfileId(c.id)}>
              <View style={{backgroundColor:C.card,borderRadius:R.lg,padding:14,marginBottom:10,borderWidth:1,borderColor:C.border}}>
                <View style={{flexDirection:'row',alignItems:'flex-start'}}>
                  <Avi name={c.name} size={46} color={statusColor(c.status)} online={c.status==='available'} />
                  <View style={{flex:1,marginLeft:12}}>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                      <Text style={{color:C.text,fontSize:T.base,fontWeight:'700',flex:1}}>{c.name}</Text>
                      <TouchableOpacity onPress={()=>cycleStatus(c.id)} style={{flexDirection:'row',alignItems:'center',backgroundColor:statusColor(c.status)+'18',borderRadius:R.pill,paddingHorizontal:8,paddingVertical:3,borderWidth:1,borderColor:statusColor(c.status)+'44'}}>
                        <StatusDot status={c.status} />
                        <Text style={{color:statusColor(c.status),fontSize:T.xs,fontWeight:'700',textTransform:'uppercase'}}>{c.status}</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={{color:C.sub,fontSize:T.sm,marginTop:3}}>{c.role}</Text>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:5}}>
                      <Stars rating={c.rating} />
                      <Text style={{color:C.sub,fontSize:T.xs}}>{fmt(c.rate)}/day  |  {c.jobs} jobs</Text>
                    </View>
                  </View>
                </View>
                {c.skills&&c.skills.length>0 && (
                  <View style={{flexDirection:'row',flexWrap:'wrap',marginTop:10}}>
                    {c.skills.slice(0,3).map(sk=>(
                      <View key={sk} style={{backgroundColor:C.pill,borderRadius:R.pill,paddingHorizontal:8,paddingVertical:3,marginRight:6,marginBottom:4,borderWidth:1,borderColor:C.border2}}>
                        <Text style={{color:C.sub,fontSize:T.xs}}>{sk}</Text>
                      </View>
                    ))}
                    {c.skills.length>3 && <Text style={{color:C.dimmer,fontSize:T.xs,alignSelf:'center'}}>+{c.skills.length-3}</Text>}
                  </View>
                )}
              </View>
            </PBtn>
          )}
        />
      </SafeAreaView>
      <Sheet visible={sheet} onClose={()=>setSheet(false)} title={edit?'Edit Crew Member':'Add Crew Member'}>
        <FInput label="Full Name" value={form.name} onChangeText={v=>setForm(f=>({...f,name:v}))} placeholder="e.g. Alex Rivera" error={errors.name} />
        <FInput label="Role" value={form.role} onChangeText={v=>setForm(f=>({...f,role:v}))} placeholder="e.g. Director of Photography" error={errors.role} />
        <FInput label="Day Rate" value={form.rate} onChangeText={v=>setForm(f=>({...f,rate:v}))} placeholder="e.g. 750" kbType="numeric" error={errors.rate} hint="Enter rate in USD per day" />
        <FInput label="Email" value={form.email} onChangeText={v=>setForm(f=>({...f,email:v}))} placeholder="email@example.com" kbType="email-address" error={errors.email} />
        <FInput label="Phone" value={form.phone} onChangeText={v=>setForm(f=>({...f,phone:v}))} placeholder="+1 555 000 0000" kbType="phone-pad" />
        <FInput label="Skills (comma separated)" value={form.skills} onChangeText={v=>setForm(f=>({...f,skills:v}))} placeholder="e.g. Arri Alexa, DJI Ronin, Lighting" />
        <FInput label="Bio" value={form.bio} onChangeText={v=>setForm(f=>({...f,bio:v}))} placeholder="Brief professional bio" multi lines={3} />
        <View style={{marginBottom:16}}>
          <Text style={{color:C.sub,fontSize:T.xs,fontWeight:'700',marginBottom:8,textTransform:'uppercase',letterSpacing:1.2}}>AVAILABILITY</Text>
          <View style={{flexDirection:'row'}}>
            {['available','busy','unavailable'].map(s=>(
              <View key={s} style={{marginRight:8}}>
                <Chip label={s} active={form.status===s} color={statusColor(s)} onPress={()=>setForm(f=>({...f,status:s}))} />
              </View>
            ))}
          </View>
        </View>
        <Btn label={edit?'Save Changes':'Add to Roster'} onPress={save} style={{marginTop:4}} />
      </Sheet>
    </View>
  );
}
function ScheduleScreen({store}) {
  const {events,addEvent,updateEvent,deleteEvent,crew} = store;
  const [filter,setFilter] = useState('All');
  const [sheet,setSheet] = useState(false);
  const [edit,setEdit] = useState(null);
  const [form,setForm] = useState({title:'',project:'',date:'',start:'06:00',end:'18:00',location:'',type:'shoot',notes:'',status:'upcoming'});
  const filters = ['All','Today','Upcoming','Completed'];
  const typeColor = t => t==='shoot'?C.teal:t==='meeting'?C.blue:t==='prep'?C.purple:C.gold;
  const filtered = filter==='All'?events:events.filter(e=>{
    if(filter==='Today') return e.status==='today';
    if(filter==='Upcoming') return e.status==='upcoming';
    if(filter==='Completed') return e.status==='completed';
    return true;
  });
  const sorted = [...filtered].sort((a,b)=>({today:0,upcoming:1,completed:2}[a.status]??1)-({today:0,upcoming:1,completed:2}[b.status]??1));
  const openAdd = () => { setEdit(null); setForm({title:'',project:'',date:'',start:'06:00',end:'18:00',location:'',type:'shoot',notes:'',status:'upcoming'}); setSheet(true); };
  const openEdit = e => { setEdit(e); setForm({title:e.title,project:e.project||e.projectName||'',date:e.date,start:e.start,end:e.end,location:e.location,type:e.type,notes:e.notes||'',status:e.status}); setSheet(true); };
  const save = () => {
    if(!form.title.trim()) return;
    const data={...form,crew:edit?edit.crew:[],projectName:form.project};
    if(edit) updateEvent({...edit,...data}); else addEvent(data);
    setSheet(false);
  };
  const confirmDelete = e => Alert.alert('Delete Event','Remove this event from the schedule?',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>deleteEvent(e.id)}]);
  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <SafeAreaView style={{flex:1}}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingTop:20,paddingBottom:12}}>
          <Text style={{color:C.text,fontSize:T.xl,fontWeight:'900',letterSpacing:-0.5}}>Schedule</Text>
          <Btn label="+ Event" onPress={openAdd} size='sm' />
        </View>
        <View style={{flexDirection:'row',paddingHorizontal:16,marginBottom:10}}>
          {[{label:'Today',val:events.filter(e=>e.status==='today').length,color:C.teal,border:C.teal+'33'},{label:'Upcoming',val:events.filter(e=>e.status==='upcoming').length,color:C.gold,border:C.border},{label:'Done',val:events.filter(e=>e.status==='completed').length,color:C.green,border:C.border},{label:'Total',val:events.length,color:C.sub,border:C.border}].map((s,i)=>(
            <View key={s.label} style={{flex:1,backgroundColor:C.card2,borderRadius:R.md,padding:10,marginRight:i<3?6:0,alignItems:'center',borderWidth:1,borderColor:s.border}}>
              <Text style={{color:s.color,fontSize:T.md,fontWeight:'800'}}>{s.val}</Text>
              <Text style={{color:C.sub,fontSize:10,marginTop:2}}>{s.label}</Text>
            </View>
          ))}
        </View>
        <FilterPills options={filters} selected={filter} onSelect={setFilter} color={C.teal} />
        <FlatList data={sorted} keyExtractor={e=>e.id} contentContainerStyle={{paddingHorizontal:16,paddingBottom:24}}
          ListEmptyComponent={<Empty icon="S" label="No events" sub="Tap + Event to build your production schedule" action="Add Event" onAction={openAdd} />}
          renderItem={({item:ev})=>(
            <View style={{backgroundColor:C.card,borderRadius:R.lg,marginBottom:10,borderWidth:1,borderColor:ev.status==='today'?C.teal+'44':C.border,overflow:'hidden',opacity:ev.status==='completed'?0.7:1}}>
              <View style={{height:3,backgroundColor:typeColor(ev.type)}} />
              <View style={{padding:14}}>
                <View style={{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginBottom:6}}>
                  <View style={{flex:1,marginRight:10}}>
                    <Text style={{color:C.text,fontSize:T.sm,fontWeight:'700'}}>{ev.title}</Text>
                    <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>{ev.projectName||ev.project}</Text>
                  </View>
                  <View style={{flexDirection:'row',alignItems:'center'}}>
                    {ev.status==='today' && <View style={{backgroundColor:C.teal,borderRadius:R.pill,paddingHorizontal:8,paddingVertical:3,marginRight:8}}><Text style={{color:C.bg,fontSize:9,fontWeight:'800'}}>LIVE</Text></View>}
                    <Chip label={ev.type.toUpperCase()} color={typeColor(ev.type)} active small onPress={()=>{}} />
                  </View>
                </View>
                <Text style={{color:C.sub,fontSize:T.xs,marginBottom:2}}>{ev.date}  |  {ev.start} - {ev.end}</Text>
                <Text style={{color:C.dimmer,fontSize:T.xs}}>{ev.location}</Text>
                {ev.notes ? <Text style={{color:C.dimmer,fontSize:T.xs,marginTop:4,fontStyle:'italic'}}>{ev.notes}</Text> : null}
                {ev.crew&&ev.crew.length>0 && (
                  <View style={{flexDirection:'row',marginTop:8}}>
                    {ev.crew.slice(0,4).map(cid=>{ const cm=crew.find(c=>c.id===cid); if(!cm) return null; return <View key={cid} style={{marginRight:4}}><Avi name={cm.name} size={24} color={C.teal} /></View>; })}
                    {ev.crew.length>4 && <Text style={{color:C.sub,fontSize:T.xs,alignSelf:'center'}}>+{ev.crew.length-4}</Text>}
                  </View>
                )}
                <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:10}}>
                  <TouchableOpacity onPress={()=>openEdit(ev)} style={{paddingHorizontal:10,paddingVertical:4,marginRight:4}}><Text style={{color:C.teal,fontSize:T.xs,fontWeight:'600'}}>Edit</Text></TouchableOpacity>
                  <TouchableOpacity onPress={()=>confirmDelete(ev)} style={{paddingHorizontal:10,paddingVertical:4}}><Text style={{color:C.red,fontSize:T.xs,fontWeight:'600'}}>Delete</Text></TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      </SafeAreaView>
      <Sheet visible={sheet} onClose={()=>setSheet(false)} title={edit?'Edit Event':'New Event'}>
        <FInput label="Event Title" value={form.title} onChangeText={v=>setForm(f=>({...f,title:v}))} placeholder="e.g. INT. Kitchen Scene" />
        <FInput label="Project" value={form.project} onChangeText={v=>setForm(f=>({...f,project:v}))} placeholder="e.g. Horizon Feature Film" />
        <FInput label="Date (YYYY-MM-DD)" value={form.date} onChangeText={v=>setForm(f=>({...f,date:v}))} placeholder="2026-03-15" />
        <View style={{flexDirection:'row'}}>
          <View style={{flex:1,marginRight:8}}><FInput label="Start" value={form.start} onChangeText={v=>setForm(f=>({...f,start:v}))} placeholder="06:00" /></View>
          <View style={{flex:1}}><FInput label="End" value={form.end} onChangeText={v=>setForm(f=>({...f,end:v}))} placeholder="18:00" /></View>
        </View>
        <FInput label="Location" value={form.location} onChangeText={v=>setForm(f=>({...f,location:v}))} placeholder="e.g. Stage 4, Sunset Studios" />
        <FInput label="Notes" value={form.notes} onChangeText={v=>setForm(f=>({...f,notes:v}))} placeholder="Any important notes..." multi lines={2} />
        <View style={{marginBottom:16}}>
          <Text style={{color:C.sub,fontSize:T.xs,fontWeight:'700',marginBottom:8,textTransform:'uppercase',letterSpacing:1.2}}>EVENT TYPE</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap'}}>
            {['shoot','meeting','prep','travel'].map(t=>(
              <View key={t} style={{marginRight:8,marginBottom:8}}><Chip label={t.toUpperCase()} active={form.type===t} color={typeColor(t)} onPress={()=>setForm(f=>({...f,type:t}))} /></View>
            ))}
          </View>
        </View>
        <View style={{marginBottom:16}}>
          <Text style={{color:C.sub,fontSize:T.xs,fontWeight:'700',marginBottom:8,textTransform:'uppercase',letterSpacing:1.2}}>STATUS</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap'}}>
            {['upcoming','today','completed'].map(s=>(
              <View key={s} style={{marginRight:8,marginBottom:8}}><Chip label={s.toUpperCase()} active={form.status===s} color={s==='today'?C.teal:s==='completed'?C.green:C.gold} onPress={()=>setForm(f=>({...f,status:s}))} /></View>
            ))}
          </View>
        </View>
        <Btn label={edit?'Save Changes':'Add to Schedule'} onPress={save} style={{marginTop:4}} />
      </Sheet>
    </View>
  );
}

function MessagesScreen({store,onBack}) {
  const {messages,chats,sendMessage,addThread} = store;
  const [active,setActive] = useState(null);
  const [draft,setDraft] = useState('');
  const [newSheet,setNewSheet] = useState(false);
  const [newForm,setNewForm] = useState({thread:'',members:''});
  const scrollRef = useRef(null);
  useEffect(()=>{
    if(active&&scrollRef.current) setTimeout(()=>scrollRef.current?.scrollToEnd({animated:true}),150);
  },[active,chats]);
  const send = () => { if(!draft.trim()||!active) return; sendMessage(active,draft.trim()); setDraft(''); };
  const createThread = () => {
    if(!newForm.thread.trim()) return;
    addThread({thread:newForm.thread,last:'Thread created',time:'now',members:newForm.members.split(',').map(s=>s.trim()).filter(Boolean),unread:0,online:false});
    setNewSheet(false); setNewForm({thread:'',members:''});
  };
  const thread = messages.find(m=>m.id===active);
  const msgs = chats[active]||[];
  if(active) return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <SafeAreaView style={{flex:1}}>
        <View style={{paddingHorizontal:16,paddingVertical:14,borderBottomWidth:1,borderBottomColor:C.border,flexDirection:'row',alignItems:'center'}}>
          <TouchableOpacity onPress={()=>setActive(null)} style={{marginRight:12}}><Text style={{color:C.teal,fontSize:T.sm,fontWeight:'600'}}>{'< Back'}</Text></TouchableOpacity>
          <Avi name={thread?thread.thread:'Chat'} size={32} color={thread&&thread.online?C.teal:C.sub} online={thread&&thread.online} />
          <View style={{marginLeft:10,flex:1}}>
            <Text style={{color:C.text,fontSize:T.sm,fontWeight:'700'}}>{thread?thread.thread:'Chat'}</Text>
            {thread&&thread.online && <Text style={{color:C.green,fontSize:T.xs}}>Active now</Text>}
          </View>
          <Text style={{color:C.sub,fontSize:T.xs}}>{thread?thread.members.length:0} members</Text>
        </View>
        <ScrollView ref={scrollRef} style={{flex:1}} contentContainerStyle={{padding:16}}>
          {msgs.map(msg=>(
            <View key={msg.id} style={{flexDirection:msg.mine?'row-reverse':'row',marginBottom:14,alignItems:'flex-end'}}>
              {!msg.mine && <Avi name={msg.sender} size={28} color={C.blue} style={{marginRight:8}} />}
              <View style={{maxWidth:'74%'}}>
                {!msg.mine && <Text style={{color:C.sub,fontSize:T.xs,marginBottom:4,fontWeight:'600',marginLeft:4}}>{msg.sender}</Text>}
                <View style={{backgroundColor:msg.mine?C.teal:C.card2,borderRadius:R.lg,borderBottomRightRadius:msg.mine?4:R.lg,borderBottomLeftRadius:msg.mine?R.lg:4,padding:12,borderWidth:msg.mine?0:1,borderColor:C.border}}>
                  <Text style={{color:msg.mine?C.bg:C.text,fontSize:T.sm,lineHeight:20}}>{msg.text}</Text>
                </View>
                <Text style={{color:C.dimmer,fontSize:T.xs,marginTop:4,textAlign:msg.mine?'right':'left',marginRight:msg.mine?4:0,marginLeft:msg.mine?0:4}}>{msg.time}</Text>
              </View>
            </View>
          ))}
          {msgs.length===0 && <Empty icon="B" label="No messages yet" sub="Send the first message to start the conversation" />}
        </ScrollView>
        <View style={{flexDirection:'row',alignItems:'center',padding:12,paddingBottom:Platform.OS==='ios'?28:12,borderTopWidth:1,borderTopColor:C.border}}>
          <TextInput value={draft} onChangeText={setDraft} placeholder="Type a message..." placeholderTextColor={C.dimmer} onSubmitEditing={send} style={{flex:1,backgroundColor:C.surf,borderRadius:R.pill,paddingHorizontal:16,paddingVertical:10,color:C.text,fontSize:T.sm,marginRight:10,borderWidth:1,borderColor:C.border}} />
          <PBtn onPress={send} disabled={!draft.trim()} style={{width:42,height:42,borderRadius:21,backgroundColor:draft.trim()?C.teal:C.pill,alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:draft.trim()?C.bg:C.dimmer,fontSize:T.base,fontWeight:'700'}}>{'>'}</Text>
          </PBtn>
        </View>
      </SafeAreaView>
    </View>
  );
  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <SafeAreaView style={{flex:1}}>
        <ScreenHeader title="Messages" onBack={onBack}
          right={<TouchableOpacity onPress={()=>setNewSheet(true)} style={{backgroundColor:C.teal+'22',borderRadius:R.pill,paddingHorizontal:12,paddingVertical:6,borderWidth:1,borderColor:C.teal+'44'}}><Text style={{color:C.teal,fontSize:T.xs,fontWeight:'700'}}>+ New</Text></TouchableOpacity>}
        />
        <FlatList data={messages} keyExtractor={m=>m.id} contentContainerStyle={{padding:16}}
          ListEmptyComponent={<Empty icon="B" label="No messages" sub="Start a new thread to communicate with your team" action="New Thread" onAction={()=>setNewSheet(true)} />}
          renderItem={({item:m})=>(
            <PBtn onPress={()=>setActive(m.id)}>
              <View style={{flexDirection:'row',alignItems:'center',backgroundColor:C.card,borderRadius:R.lg,padding:14,marginBottom:10,borderWidth:1,borderColor:m.unread>0?C.teal+'44':C.border}}>
                <Avi name={m.thread} size={46} color={m.online?C.teal:C.sub} online={m.online} />
                <View style={{flex:1,marginLeft:12}}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                    <Text style={{color:C.text,fontSize:T.sm,fontWeight:'700',flex:1}}>{m.thread}</Text>
                    <Text style={{color:C.dimmer,fontSize:T.xs}}>{m.time}</Text>
                  </View>
                  <Text style={{color:m.unread>0?C.sub:C.dimmer,fontSize:T.xs,lineHeight:17,fontWeight:m.unread>0?'600':'400'}} numberOfLines={1}>{m.last}</Text>
                  {m.members&&m.members.length>0 && <Text style={{color:C.dimmer,fontSize:10,marginTop:3}}>{m.members.join(', ')}</Text>}
                </View>
                {m.unread>0 && <View style={{marginLeft:10}}><Badge count={m.unread} color={C.teal} /></View>}
              </View>
            </PBtn>
          )}
        />
      </SafeAreaView>
      <Sheet visible={newSheet} onClose={()=>setNewSheet(false)} title="New Thread">
        <FInput label="Thread Name" value={newForm.thread} onChangeText={v=>setNewForm(f=>({...f,thread:v}))} placeholder="e.g. Horizon Film - Core Crew" />
        <FInput label="Members (comma separated)" value={newForm.members} onChangeText={v=>setNewForm(f=>({...f,members:v}))} placeholder="e.g. Alex R, Sam C" />
        <Btn label="Create Thread" onPress={createThread} style={{marginTop:4}} />
      </Sheet>
    </View>
  );
}
function InvoicesScreen({store,onBack}) {
  const {invoices,addInvoice,updateInvoice,deleteInvoice} = store;
  const [filter,setFilter] = useState('All');
  const [sheet,setSheet] = useState(false);
  const [detailId,setDetailId] = useState(null);
  const [edit,setEdit] = useState(null);
  const [uploading,setUploading] = useState(false);
  const [form,setForm] = useState({project:'',client:'',amount:'',status:'draft',date:'',due:'',notes:''});
  const filters = ['All','Draft','Pending','Paid','Overdue'];
  const filtered = filter==='All'?invoices:invoices.filter(iv=>iv.status===filter.toLowerCase());
  const totalPaid = invoices.filter(iv=>iv.status==='paid').reduce((s,iv)=>s+iv.amount,0);
  const totalPending = invoices.filter(iv=>iv.status==='pending').reduce((s,iv)=>s+iv.amount,0);
  const totalOverdue = invoices.filter(iv=>iv.status==='overdue').reduce((s,iv)=>s+iv.amount,0);
  const statusColor = s => s==='paid'?C.green:s==='pending'?C.gold:s==='overdue'?C.red:C.sub;
  const detail = invoices.find(iv=>iv.id===detailId);
  const openAdd = () => { setEdit(null); setForm({project:'',client:'',amount:'',status:'draft',date:'2026-03-08',due:'2026-03-22',notes:''}); setSheet(true); };
  const openEdit = iv => { setEdit(iv); setForm({project:iv.project,client:iv.client,amount:String(iv.amount),status:iv.status,date:iv.date,due:iv.due,notes:iv.notes||''}); setSheet(true); };
  const save = () => {
    if(!form.project.trim()||!form.amount||isNaN(Number(form.amount))) return;
    const data={...form,amount:Number(form.amount),items:edit?edit.items:[{desc:form.project,qty:1,rate:Number(form.amount)}],attachments:edit?edit.attachments:[]};
    if(edit) updateInvoice({...edit,...data}); else addInvoice(data);
    setSheet(false);
  };
  const handleSend = iv => { updateInvoice({...iv,status:'pending'}); Alert.alert('Invoice Sent','Invoice '+iv.ref+' sent to '+iv.client); };
  const handleMarkPaid = iv => Alert.alert('Mark as Paid','Confirm payment received for '+iv.ref+'?',[{text:'Cancel',style:'cancel'},{text:'Mark Paid',onPress:()=>updateInvoice({...iv,status:'paid'})}]);
  const handleChase = iv => Alert.alert('Chase Invoice','Send payment reminder to '+iv.client+'?',[{text:'Cancel',style:'cancel'},{text:'Send Reminder',style:'destructive',onPress:()=>Alert.alert('Reminder Sent','Payment reminder sent to '+iv.client)}]);
  const handleAttach = iv => {
    setUploading(true);
    const fake = FAKE_ATTACHMENTS[Math.floor(Math.random()*FAKE_ATTACHMENTS.length)];
    setTimeout(()=>{
      const updated = {...iv,attachments:[...(iv.attachments||[]),fake]};
      updateInvoice(updated); setUploading(false);
      Alert.alert('File Attached',fake+' attached to invoice');
    },1200);
  };
  const confirmDelete = iv => Alert.alert('Delete Invoice','Delete '+iv.ref+'? This cannot be undone.',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>{ deleteInvoice(iv.id); if(detailId===iv.id) setDetailId(null); }}]);

  if(detailId && detail) return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <SafeAreaView style={{flex:1}}>
        <ScreenHeader title={detail.ref} onBack={()=>setDetailId(null)} sub={detail.project+' - '+detail.client}
          right={<View style={{flexDirection:'row'}}>
            <TouchableOpacity onPress={()=>{setDetailId(null);openEdit(detail);}} style={{marginRight:14}}><Text style={{color:C.teal,fontSize:T.sm,fontWeight:'600'}}>Edit</Text></TouchableOpacity>
            <TouchableOpacity onPress={()=>confirmDelete(detail)}><Text style={{color:C.red,fontSize:T.sm,fontWeight:'600'}}>Delete</Text></TouchableOpacity>
          </View>}
        />
        <ScrollView contentContainerStyle={{padding:16}}>
          <Card style={{marginBottom:14,backgroundColor:C.card2}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
              <View>
                <Text style={{color:C.sub,fontSize:T.xs,fontWeight:'700',textTransform:'uppercase',letterSpacing:1}}>AMOUNT</Text>
                <Text style={{color:C.text,fontSize:T.xxl,fontWeight:'900',marginTop:4,letterSpacing:-1}}>{fmtFull(detail.amount)}</Text>
              </View>
              <Chip label={detail.status.toUpperCase()} color={statusColor(detail.status)} active onPress={()=>{}} />
            </View>
            <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:6}}>
              <Text style={{color:C.sub,fontSize:T.sm}}>Issued</Text>
              <Text style={{color:C.text,fontSize:T.sm,fontWeight:'600'}}>{detail.date}</Text>
            </View>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Text style={{color:C.sub,fontSize:T.sm}}>Due</Text>
              <Text style={{color:detail.status==='overdue'?C.red:C.text,fontSize:T.sm,fontWeight:'600'}}>{detail.due}</Text>
            </View>
          </Card>
          <Card style={{marginBottom:14}}>
            <SecHead label="Line Items" />
            {(detail.items||[]).map((item,i)=>(
              <View key={i} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:10,borderBottomWidth:i<detail.items.length-1?1:0,borderBottomColor:C.border}}>
                <View style={{flex:1}}>
                  <Text style={{color:C.text,fontSize:T.sm,fontWeight:'600'}}>{item.desc}</Text>
                  {item.qty>1 && <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>{item.qty} x {fmtFull(item.rate)}</Text>}
                </View>
                <Text style={{color:C.text,fontSize:T.sm,fontWeight:'700'}}>{fmtFull(item.qty*item.rate)}</Text>
              </View>
            ))}
            <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:10,paddingTop:10,borderTopWidth:1,borderTopColor:C.border2}}>
              <Text style={{color:C.text,fontSize:T.sm,fontWeight:'700'}}>Total</Text>
              <Text style={{color:C.teal,fontSize:T.base,fontWeight:'900'}}>{fmtFull(detail.amount)}</Text>
            </View>
          </Card>
          {detail.notes ? <Card style={{marginBottom:14}}><SecHead label="Notes" /><Text style={{color:C.sub,fontSize:T.sm,lineHeight:20}}>{detail.notes}</Text></Card> : null}
          <Card style={{marginBottom:14}}>
            <SecHead label="Attachments" />
            {(detail.attachments||[]).length===0
              ? <Text style={{color:C.sub,fontSize:T.sm}}>No files attached</Text>
              : (detail.attachments||[]).map((a,i)=>(
                <View key={i} style={{flexDirection:'row',alignItems:'center',backgroundColor:C.card2,borderRadius:R.md,padding:12,marginBottom:8,borderWidth:1,borderColor:C.border}}>
                  <View style={{width:32,height:32,borderRadius:R.sm,backgroundColor:C.red+'22',alignItems:'center',justifyContent:'center',marginRight:10,borderWidth:1,borderColor:C.red+'33'}}>
                    <Text style={{color:C.red,fontSize:T.xs,fontWeight:'700'}}>PDF</Text>
                  </View>
                  <Text style={{color:C.text,fontSize:T.sm,flex:1}}>{a}</Text>
                </View>
              ))}
            <View style={{marginTop:8}}><Btn label={uploading?'Attaching...':'Attach File'} onPress={()=>handleAttach(detail)} color={C.blue} outline disabled={uploading} /></View>
          </Card>
          <View style={{marginBottom:28}}>
            {detail.status==='draft' && <Btn label="Send Invoice" onPress={()=>handleSend(detail)} color={C.teal} style={{marginBottom:10}} />}
            {detail.status==='pending' && <Btn label="Mark as Paid" onPress={()=>handleMarkPaid(detail)} color={C.green} style={{marginBottom:10}} />}
            {detail.status==='overdue' && <Btn label="Send Payment Reminder" onPress={()=>handleChase(detail)} color={C.red} style={{marginBottom:10}} />}
          </View>
        </ScrollView>
      </SafeAreaView>
      <Sheet visible={sheet} onClose={()=>setSheet(false)} title="Edit Invoice">
        <FInput label="Project" value={form.project} onChangeText={v=>setForm(f=>({...f,project:v}))} placeholder="e.g. Horizon Feature Film" />
        <FInput label="Client" value={form.client} onChangeText={v=>setForm(f=>({...f,client:v}))} placeholder="e.g. Apex Studios" />
        <FInput label="Amount" value={form.amount} onChangeText={v=>setForm(f=>({...f,amount:v}))} placeholder="e.g. 25000" kbType="numeric" />
        <View style={{flexDirection:'row'}}>
          <View style={{flex:1,marginRight:8}}><FInput label="Invoice Date" value={form.date} onChangeText={v=>setForm(f=>({...f,date:v}))} placeholder="YYYY-MM-DD" /></View>
          <View style={{flex:1}}><FInput label="Due Date" value={form.due} onChangeText={v=>setForm(f=>({...f,due:v}))} placeholder="YYYY-MM-DD" /></View>
        </View>
        <View style={{marginBottom:16}}>
          <Text style={{color:C.sub,fontSize:T.xs,fontWeight:'700',marginBottom:8,textTransform:'uppercase',letterSpacing:1.2}}>STATUS</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap'}}>
            {['draft','pending','paid','overdue'].map(s=>(
              <View key={s} style={{marginRight:8,marginBottom:8}}><Chip label={s.toUpperCase()} active={form.status===s} color={statusColor(s)} onPress={()=>setForm(f=>({...f,status:s}))} /></View>
            ))}
          </View>
        </View>
        <FInput label="Notes" value={form.notes} onChangeText={v=>setForm(f=>({...f,notes:v}))} placeholder="Payment terms, PO number, etc." multi lines={2} />
        <Btn label="Save Changes" onPress={save} style={{marginTop:4}} />
      </Sheet>
    </View>
  );

  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <SafeAreaView style={{flex:1}}>
        <ScreenHeader title="Invoices" onBack={onBack}
          right={<TouchableOpacity onPress={openAdd} style={{backgroundColor:C.gold+'22',borderRadius:R.pill,paddingHorizontal:12,paddingVertical:6,borderWidth:1,borderColor:C.gold+'44'}}><Text style={{color:C.gold,fontSize:T.xs,fontWeight:'700'}}>+ New</Text></TouchableOpacity>}
        />
        <View style={{flexDirection:'row',paddingHorizontal:16,marginTop:10,marginBottom:4}}>
          <PBtn onPress={()=>setFilter('Paid')} style={{flex:1,backgroundColor:filter==='Paid'?C.green+'18':C.card2,borderRadius:R.md,padding:10,marginRight:6,alignItems:'center',borderWidth:1,borderColor:filter==='Paid'?C.green+'55':C.border}}>
            <Text style={{color:C.green,fontSize:T.sm,fontWeight:'800'}}>{fmt(totalPaid)}</Text>
            <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>Collected</Text>
          </PBtn>
          <PBtn onPress={()=>setFilter('Pending')} style={{flex:1,backgroundColor:filter==='Pending'?C.gold+'18':C.card2,borderRadius:R.md,padding:10,marginRight:6,alignItems:'center',borderWidth:1,borderColor:filter==='Pending'?C.gold+'55':C.border}}>
            <Text style={{color:C.gold,fontSize:T.sm,fontWeight:'800'}}>{fmt(totalPending)}</Text>
            <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>Pending</Text>
          </PBtn>
          <PBtn onPress={()=>setFilter('Overdue')} style={{flex:1,backgroundColor:filter==='Overdue'?C.redDim:C.card2,borderRadius:R.md,padding:10,alignItems:'center',borderWidth:1,borderColor:filter==='Overdue'?C.red+'55':C.border}}>
            <Text style={{color:C.red,fontSize:T.sm,fontWeight:'800'}}>{fmt(totalOverdue)}</Text>
            <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>Overdue</Text>
          </PBtn>
        </View>
        <FilterPills options={filters} selected={filter} onSelect={setFilter} color={C.gold} />
        <FlatList data={filtered} keyExtractor={iv=>iv.id} contentContainerStyle={{paddingHorizontal:16,paddingBottom:24}}
          ListEmptyComponent={<Empty icon="I" label="No invoices" sub="Create your first invoice to start billing clients" action="New Invoice" onAction={openAdd} />}
          renderItem={({item:iv})=>(
            <PBtn onPress={()=>setDetailId(iv.id)}>
              <View style={{backgroundColor:C.card,borderRadius:R.lg,padding:14,marginBottom:10,borderWidth:1,borderColor:iv.status==='overdue'?C.red+'44':iv.status==='paid'?C.green+'22':C.border}}>
                <View style={{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginBottom:8}}>
                  <View style={{flex:1,marginRight:10}}>
                    <Text style={{color:C.text,fontSize:T.sm,fontWeight:'700'}}>{iv.project}</Text>
                    <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>{iv.ref}  |  {iv.client}</Text>
                    <Text style={{color:C.dimmer,fontSize:T.xs,marginTop:1}}>Due: {iv.due}</Text>
                  </View>
                  <View style={{alignItems:'flex-end'}}>
                    <Text style={{color:C.text,fontSize:T.base,fontWeight:'900'}}>{fmtFull(iv.amount)}</Text>
                    <View style={{marginTop:6}}><Chip label={iv.status.toUpperCase()} color={statusColor(iv.status)} active small onPress={()=>{}} /></View>
                  </View>
                </View>
                <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                  {iv.status==='draft' && <TouchableOpacity onPress={()=>handleSend(iv)} style={{backgroundColor:C.teal+'22',borderRadius:R.pill,paddingHorizontal:12,paddingVertical:5,marginRight:8,borderWidth:1,borderColor:C.teal+'44'}}><Text style={{color:C.teal,fontSize:T.xs,fontWeight:'700'}}>Send</Text></TouchableOpacity>}
                  {iv.status==='pending' && <TouchableOpacity onPress={()=>handleMarkPaid(iv)} style={{backgroundColor:C.green+'22',borderRadius:R.pill,paddingHorizontal:12,paddingVertical:5,marginRight:8,borderWidth:1,borderColor:C.green+'44'}}><Text style={{color:C.green,fontSize:T.xs,fontWeight:'700'}}>Mark Paid</Text></TouchableOpacity>}
                  {iv.status==='overdue' && <TouchableOpacity onPress={()=>handleChase(iv)} style={{backgroundColor:C.red+'22',borderRadius:R.pill,paddingHorizontal:12,paddingVertical:5,marginRight:8,borderWidth:1,borderColor:C.red+'44'}}><Text style={{color:C.red,fontSize:T.xs,fontWeight:'700'}}>Chase</Text></TouchableOpacity>}
                  <TouchableOpacity onPress={()=>confirmDelete(iv)} style={{paddingHorizontal:10,paddingVertical:5}}><Text style={{color:C.red,fontSize:T.xs,fontWeight:'600'}}>Delete</Text></TouchableOpacity>
                </View>
              </View>
            </PBtn>
          )}
        />
      </SafeAreaView>
      <Sheet visible={sheet} onClose={()=>setSheet(false)} title="New Invoice">
        <FInput label="Project" value={form.project} onChangeText={v=>setForm(f=>({...f,project:v}))} placeholder="e.g. Horizon Feature Film" />
        <FInput label="Client" value={form.client} onChangeText={v=>setForm(f=>({...f,client:v}))} placeholder="e.g. Apex Studios" />
        <FInput label="Amount" value={form.amount} onChangeText={v=>setForm(f=>({...f,amount:v}))} placeholder="e.g. 25000" kbType="numeric" />
        <View style={{flexDirection:'row'}}>
          <View style={{flex:1,marginRight:8}}><FInput label="Invoice Date" value={form.date} onChangeText={v=>setForm(f=>({...f,date:v}))} placeholder="YYYY-MM-DD" /></View>
          <View style={{flex:1}}><FInput label="Due Date" value={form.due} onChangeText={v=>setForm(f=>({...f,due:v}))} placeholder="YYYY-MM-DD" /></View>
        </View>
        <FInput label="Notes" value={form.notes} onChangeText={v=>setForm(f=>({...f,notes:v}))} placeholder="Payment terms, PO number, etc." multi lines={2} />
        <Btn label="Create Invoice" onPress={save} style={{marginTop:4}} />
      </Sheet>
    </View>
  );
}
function ReportsScreen({store,onBack,isBiz=true}) {
  const {invoices,projects,crew} = store;
  const paid = invoices.filter(iv=>iv.status==='paid');
  const totalRevenue = paid.reduce((s,iv)=>s+iv.amount,0);
  const totalPending = invoices.filter(iv=>iv.status==='pending'||iv.status==='overdue').reduce((s,iv)=>s+iv.amount,0);
  const collRate = invoices.length>0?pct(paid.length,invoices.length):0;
  const activeProj = projects.filter(p=>p.status==='active');
  const totalBudget = activeProj.reduce((s,p)=>s+p.budget,0);
  const totalSpent = activeProj.reduce((s,p)=>s+p.spent,0);
  const budgetPct = pct(totalSpent,totalBudget);
  const statusBreakdown = [
    {label:'Paid',count:paid.length,amount:totalRevenue,color:C.green},
    {label:'Pending',count:invoices.filter(iv=>iv.status==='pending').length,amount:invoices.filter(iv=>iv.status==='pending').reduce((s,iv)=>s+iv.amount,0),color:C.gold},
    {label:'Overdue',count:invoices.filter(iv=>iv.status==='overdue').length,amount:invoices.filter(iv=>iv.status==='overdue').reduce((s,iv)=>s+iv.amount,0),color:C.red},
    {label:'Draft',count:invoices.filter(iv=>iv.status==='draft').length,amount:invoices.filter(iv=>iv.status==='draft').reduce((s,iv)=>s+iv.amount,0),color:C.sub},
  ];
  const maxAmt = Math.max(...statusBreakdown.map(s=>s.amount),1);
  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <SafeAreaView style={{flex:1}}>
        <ScreenHeader title="Reports" onBack={onBack} sub={isBiz?'Business Analytics':'Freelancer Earnings'} />
        <ScrollView contentContainerStyle={{padding:16}}>
          <View style={{flexDirection:'row',marginBottom:10}}>
            <KPI label="Total Revenue" value={fmt(totalRevenue)} color={C.teal} />
            <View style={{width:10}} />
            <KPI label="Outstanding" value={fmt(totalPending)} color={C.gold} />
          </View>
          <View style={{flexDirection:'row',marginBottom:20}}>
            <KPI label="Collection Rate" value={collRate+'%'} color={collRate>=80?C.green:collRate>=60?C.gold:C.red} />
            <View style={{width:10}} />
            <KPI label="Total Invoices" value={invoices.length} color={C.blue} />
          </View>
          <Card style={{marginBottom:16}}>
            <SecHead label="Invoice Breakdown" />
            {statusBreakdown.map(s=>(
              <View key={s.label} style={{marginBottom:14}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:6}}>
                  <View style={{flexDirection:'row',alignItems:'center'}}>
                    <View style={{width:10,height:10,borderRadius:5,backgroundColor:s.color,marginRight:8}} />
                    <Text style={{color:C.text,fontSize:T.sm,fontWeight:'600'}}>{s.label}</Text>
                    <Text style={{color:C.sub,fontSize:T.xs,marginLeft:8}}>{s.count} invoice{s.count!==1?'s':''}</Text>
                  </View>
                  <Text style={{color:s.color,fontSize:T.sm,fontWeight:'800'}}>{fmt(s.amount)}</Text>
                </View>
                <Bar pct={maxAmt>0?Math.round((s.amount/maxAmt)*100):0} color={s.color} height={8} />
              </View>
            ))}
          </Card>
          {isBiz && activeProj.length>0 && (
            <Card style={{marginBottom:16}}>
              <SecHead label="Budget Performance" />
              <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:12}}>
                {[{label:'Total Budget',val:fmt(totalBudget),color:C.teal},{label:'Spent',val:fmt(totalSpent),color:C.gold},{label:'Remaining',val:fmt(totalBudget-totalSpent),color:C.green}].map(s=>(
                  <View key={s.label} style={{alignItems:'center'}}>
                    <Text style={{color:s.color,fontSize:T.lg,fontWeight:'800'}}>{s.val}</Text>
                    <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>{s.label}</Text>
                  </View>
                ))}
              </View>
              <View style={{flexDirection:'row',alignItems:'center',marginBottom:12}}>
                <Bar pct={budgetPct} color={budgetPct>85?C.red:budgetPct>65?C.gold:C.teal} height={10} />
                <Text style={{color:C.sub,fontSize:T.xs,marginLeft:8,fontWeight:'700'}}>{budgetPct}%</Text>
              </View>
              {activeProj.map(p=>{ const bp=pct(p.spent,p.budget); return (
                <View key={p.id} style={{marginBottom:12}}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:5}}>
                    <Text style={{color:C.text,fontSize:T.xs,fontWeight:'600',flex:1}}>{p.name}</Text>
                    <Text style={{color:C.sub,fontSize:T.xs}}>{bp}%</Text>
                  </View>
                  <Bar pct={bp} color={bp>85?C.red:bp>65?C.gold:C.teal} height={6} />
                  <Text style={{color:C.dimmer,fontSize:T.xs,marginTop:3}}>{fmt(p.spent)} of {fmt(p.budget)}</Text>
                </View>
              ); })}
            </Card>
          )}
          {isBiz && (
            <Card style={{marginBottom:16}}>
              <SecHead label="Crew Utilisation" />
              <View style={{flexDirection:'row',justifyContent:'space-around',marginBottom:10}}>
                {[{label:'Available',count:crew.filter(c=>c.status==='available').length,color:C.green},{label:'On Job',count:crew.filter(c=>c.status==='busy').length,color:C.gold},{label:'Unavailable',count:crew.filter(c=>c.status==='unavailable').length,color:C.red}].map(s=>(
                  <View key={s.label} style={{alignItems:'center'}}>
                    <Text style={{color:s.color,fontSize:T.xl,fontWeight:'900'}}>{s.count}</Text>
                    <Text style={{color:C.sub,fontSize:T.xs,marginTop:3}}>{s.label}</Text>
                  </View>
                ))}
              </View>
              <Bar pct={crew.length>0?pct(crew.filter(c=>c.status==='busy').length,crew.length):0} color={C.gold} height={8} />
              <Text style={{color:C.sub,fontSize:T.xs,marginTop:6,textAlign:'center'}}>{crew.length>0?pct(crew.filter(c=>c.status==='busy').length,crew.length):0}% crew utilisation rate</Text>
            </Card>
          )}
          <Text style={{color:C.dimmer,fontSize:T.xs,textAlign:'center',marginBottom:28,lineHeight:18}}>Data reflects current session. Export coming soon.</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function PortalScreen({store,onBack,onSignOut}) {
  const {invoices,events} = store;
  const paid = invoices.filter(iv=>iv.status==='paid');
  const totalEarned = paid.reduce((s,iv)=>s+iv.amount,0);
  const pendingPay = invoices.filter(iv=>iv.status==='pending').reduce((s,iv)=>s+iv.amount,0);
  const collRate = invoices.length>0?pct(paid.length,invoices.length):0;
  const upcoming = events.filter(e=>e.status==='upcoming'||e.status==='today');
  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <SafeAreaView style={{flex:1}}>
        <ScreenHeader title="My Portal" onBack={onBack} />
        <ScrollView contentContainerStyle={{padding:16}}>
          <Card style={{marginBottom:16,alignItems:'center',paddingVertical:28}}>
            <Avi name="Jordan Blake" size={70} color={C.gold} online />
            <Text style={{color:C.text,fontSize:T.lg,fontWeight:'900',marginTop:14,letterSpacing:-0.4}}>Jordan Blake</Text>
            <Text style={{color:C.sub,fontSize:T.sm,marginTop:4}}>Sound Mixer  |  Freelancer</Text>
            <View style={{flexDirection:'row',alignItems:'center',marginTop:8,backgroundColor:C.green+'18',borderRadius:R.pill,paddingHorizontal:12,paddingVertical:5,borderWidth:1,borderColor:C.green+'44'}}>
              <StatusDot status="available" />
              <Text style={{color:C.green,fontSize:T.xs,fontWeight:'700'}}>AVAILABLE FOR WORK</Text>
            </View>
            <View style={{flexDirection:'row',marginTop:20,paddingTop:16,borderTopWidth:1,borderTopColor:C.border,width:'100%',justifyContent:'space-around'}}>
              {[{label:'Shoots',val:events.length,color:C.teal},{label:'Invoices',val:invoices.length,color:C.gold},{label:'Collection',val:collRate+'%',color:C.green},{label:'Earned',val:fmt(totalEarned),color:C.purple}].map(s=>(
                <View key={s.label} style={{alignItems:'center'}}>
                  <Text style={{color:s.color,fontSize:T.lg,fontWeight:'800'}}>{s.val}</Text>
                  <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>{s.label}</Text>
                </View>
              ))}
            </View>
          </Card>
          <View style={{flexDirection:'row',marginBottom:16}}>
            <KPI label="Total Earned YTD" value={fmt(totalEarned)} color={C.teal} />
            <View style={{width:10}} />
            <KPI label="Pending Payment" value={fmt(pendingPay)} color={C.gold} />
          </View>
          {upcoming.length>0 && (
            <Card style={{marginBottom:16}}>
              <SecHead label="Upcoming Shoots" />
              {upcoming.slice(0,4).map(e=>(
                <View key={e.id} style={{flexDirection:'row',alignItems:'center',paddingVertical:10,borderBottomWidth:1,borderBottomColor:C.border}}>
                  <View style={{width:4,height:40,borderRadius:2,backgroundColor:e.status==='today'?C.teal:C.gold,marginRight:12}} />
                  <View style={{flex:1}}>
                    <Text style={{color:C.text,fontSize:T.sm,fontWeight:'600'}}>{e.title}</Text>
                    <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>{e.date}  |  {e.start}-{e.end}</Text>
                    <Text style={{color:C.dimmer,fontSize:T.xs,marginTop:1}}>{e.location}</Text>
                  </View>
                  {e.status==='today' && <View style={{backgroundColor:C.teal,borderRadius:R.pill,paddingHorizontal:6,paddingVertical:2}}><Text style={{color:C.bg,fontSize:9,fontWeight:'800'}}>NOW</Text></View>}
                </View>
              ))}
            </Card>
          )}
          <Card style={{marginBottom:16}}>
            <SecHead label="Account Settings" />
            {['Edit Profile & Skills','Payment & Banking','Rate Card & Availability','Notification Preferences','Privacy & Security'].map((label,idx,arr)=>(
              <TouchableOpacity key={label} style={{flexDirection:'row',alignItems:'center',paddingVertical:13,borderBottomWidth:idx<arr.length-1?1:0,borderBottomColor:C.border}}>
                <View style={{width:34,height:34,borderRadius:R.sm,backgroundColor:[C.teal,C.green,C.gold,C.blue,C.purple][idx]+'20',borderWidth:1,borderColor:[C.teal,C.green,C.gold,C.blue,C.purple][idx]+'33',alignItems:'center',justifyContent:'center',marginRight:12}}>
                  <Text style={{color:[C.teal,C.green,C.gold,C.blue,C.purple][idx],fontSize:T.sm,fontWeight:'800'}}>{label[0]}</Text>
                </View>
                <Text style={{color:C.text,fontSize:T.sm,fontWeight:'600',flex:1}}>{label}</Text>
                <Text style={{color:C.sub,fontSize:T.base}}>{'>'}</Text>
              </TouchableOpacity>
            ))}
          </Card>
          <Btn label="Sign Out" onPress={onSignOut} color={C.red} outline style={{marginBottom:32}} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function MoreScreen({store,onSignOut,isBiz}) {
  const {invoices,projects,crew} = store;
  const totalRevenue = invoices.filter(iv=>iv.status==='paid').reduce((s,iv)=>s+iv.amount,0);
  const handleSignOut = () => Alert.alert('Sign Out','Are you sure you want to sign out of CrewDesk?',[{text:'Cancel',style:'cancel'},{text:'Sign Out',style:'destructive',onPress:onSignOut}]);
  const settingsRows = isBiz ? [
    {label:'Account & Profile',icon:'A',color:C.teal},
    {label:'Notifications',icon:'N',color:C.blue},
    {label:'Billing & Payments',icon:'B',color:C.green},
    {label:'Team & Permissions',icon:'T',color:C.purple},
    {label:'Integrations',icon:'I',color:C.gold},
    {label:'Help & Support',icon:'H',color:C.orange},
    {label:'Privacy & Security',icon:'S',color:C.red},
  ] : [
    {label:'My Profile',icon:'P',color:C.gold},
    {label:'Notifications',icon:'N',color:C.blue},
    {label:'Payment Details',icon:'B',color:C.green},
    {label:'Rate Card',icon:'R',color:C.purple},
    {label:'Help & Support',icon:'H',color:C.orange},
    {label:'Privacy & Security',icon:'S',color:C.red},
  ];
  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <SafeAreaView style={{flex:1}}>
        <View style={{paddingHorizontal:20,paddingTop:22,paddingBottom:14}}>
          <Text style={{color:C.dimmer,fontSize:T.xs,fontWeight:'700',letterSpacing:2,textTransform:'uppercase'}}>SETTINGS</Text>
          <Text style={{color:C.text,fontSize:T.xl,fontWeight:'900',marginTop:5,letterSpacing:-0.5}}>More</Text>
        </View>
        <ScrollView contentContainerStyle={{paddingHorizontal:16,paddingBottom:40}}>
          <Card style={{marginBottom:16,alignItems:'center',paddingVertical:24}}>
            <Avi name={isBiz?'My Business':'Jordan Blake'} size={60} color={isBiz?C.teal:C.gold} />
            <Text style={{color:C.text,fontSize:T.md,fontWeight:'900',marginTop:12,letterSpacing:-0.3}}>{isBiz?'My Production Co':'Jordan Blake'}</Text>
            <View style={{marginTop:6,backgroundColor:isBiz?C.teal+'18':C.gold+'18',borderRadius:R.pill,paddingHorizontal:12,paddingVertical:4,borderWidth:1,borderColor:isBiz?C.teal+'33':C.gold+'33'}}>
              <Text style={{color:isBiz?C.teal:C.gold,fontSize:T.xs,fontWeight:'700'}}>{isBiz?'BUSINESS ACCOUNT':'FREELANCER ACCOUNT'}</Text>
            </View>
            {isBiz && (
              <View style={{flexDirection:'row',marginTop:18,paddingTop:16,borderTopWidth:1,borderTopColor:C.border,width:'100%',justifyContent:'space-around'}}>
                {[{label:'Projects',val:projects.filter(p=>p.status==='active').length,color:C.teal},{label:'Crew',val:crew.length,color:C.gold},{label:'Revenue',val:fmt(totalRevenue),color:C.green}].map(s=>(
                  <View key={s.label} style={{alignItems:'center'}}>
                    <Text style={{color:s.color,fontSize:T.lg,fontWeight:'800'}}>{s.val}</Text>
                    <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>{s.label}</Text>
                  </View>
                ))}
              </View>
            )}
          </Card>
          <Card style={{marginBottom:16}}>
            {settingsRows.map((row,idx)=>(
              <TouchableOpacity key={row.label} style={{flexDirection:'row',alignItems:'center',paddingVertical:13,borderBottomWidth:idx<settingsRows.length-1?1:0,borderBottomColor:C.border}}>
                <View style={{width:36,height:36,borderRadius:R.sm,backgroundColor:row.color+'20',borderWidth:1,borderColor:row.color+'33',alignItems:'center',justifyContent:'center',marginRight:12}}>
                  <Text style={{color:row.color,fontSize:T.sm,fontWeight:'800'}}>{row.icon}</Text>
                </View>
                <Text style={{color:C.text,fontSize:T.sm,fontWeight:'600',flex:1}}>{row.label}</Text>
                <Text style={{color:C.sub,fontSize:T.base}}>{'>'}</Text>
              </TouchableOpacity>
            ))}
          </Card>
          <Card style={{marginBottom:20,backgroundColor:C.card2,alignItems:'center',paddingVertical:16}}>
            <Text style={{color:C.text,fontSize:T.xs,fontWeight:'800',letterSpacing:1.5,textTransform:'uppercase'}}>CrewDesk</Text>
            <Text style={{color:C.sub,fontSize:T.xs,marginTop:4}}>MVP1  -  Production Management Platform</Text>
            <Text style={{color:C.dimmer,fontSize:T.xs,marginTop:3}}>Film  |  TV  |  Streaming  |  Live Events</Text>
          </Card>
          <Btn label="Sign Out" onPress={handleSignOut} color={C.red} outline style={{marginBottom:8}} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const BIZ_TABS = [{id:'home',label:'Home',icon:'H'},{id:'projects',label:'Projects',icon:'P'},{id:'crew',label:'Crew',icon:'C'},{id:'schedule',label:'Schedule',icon:'S'},{id:'more',label:'More',icon:'M'}];
const FREE_TABS = [{id:'home',label:'Home',icon:'H'},{id:'schedule',label:'Schedule',icon:'S'},{id:'invoices',label:'Invoices',icon:'I'},{id:'more',label:'More',icon:'M'}];

function TabBar({tabs,active,onTab,accentColor=C.teal,totalUnread=0}) {
  return (
    <View style={{flexDirection:'row',backgroundColor:C.surf,borderTopWidth:1,borderTopColor:C.border,paddingBottom:Platform.OS==='ios'?22:6,paddingTop:6}}>
      {tabs.map(t=>{
        const isActive = active===t.id;
        return (
          <PBtn key={t.id} onPress={()=>onTab(t.id)} style={{flex:1,alignItems:'center',paddingVertical:4}}>
            <View style={{width:38,height:38,borderRadius:R.md,alignItems:'center',justifyContent:'center',backgroundColor:isActive?accentColor+'22':'transparent',borderWidth:isActive?1.5:0,borderColor:isActive?accentColor+'66':'transparent',position:'relative'}}>
              {totalUnread>0 && t.id==='home' && !isActive && (
                <View style={{position:'absolute',top:-3,right:-3,zIndex:10}}><Badge count={totalUnread} color={C.red} small /></View>
              )}
              <Text style={{fontSize:T.sm,fontWeight:'700',color:isActive?accentColor:C.dimmer}}>{t.icon}</Text>
            </View>
            <Text style={{color:isActive?accentColor:C.dimmer,fontSize:9,fontWeight:isActive?'700':'500',marginTop:3,letterSpacing:0.3}}>{t.label}</Text>
          </PBtn>
        );
      })}
    </View>
  );
}

export default function App() {
  const store = useStore();
  const [userType,setUserType] = useState(null);
  const [tab,setTab] = useState('home');
  const [subScreen,setSubScreen] = useState(null);
  const handleLogin = type => { setUserType(type); setTab('home'); setSubScreen(null); };
  const handleSignOut = () => { setUserType(null); setTab('home'); setSubScreen(null); };
  const handleNav = screen => {
    const subs = ['messages','invoices','reports','portal'];
    if(subs.includes(screen)) setSubScreen(screen);
    else { setTab(screen); setSubScreen(null); }
  };
  if(!userType) return <LoginScreen onLogin={handleLogin} />;
  const isBiz = userType==='business';
  const tabs = isBiz ? BIZ_TABS : FREE_TABS;
  const accentColor = isBiz ? C.teal : C.gold;
  const totalUnread = store.messages.reduce((s,m)=>s+m.unread,0);
  const renderSub = () => {
    if(subScreen==='messages') return <MessagesScreen store={store} onBack={()=>setSubScreen(null)} />;
    if(subScreen==='invoices') return <InvoicesScreen store={store} onBack={()=>setSubScreen(null)} />;
    if(subScreen==='reports') return <ReportsScreen store={store} onBack={()=>setSubScreen(null)} isBiz={isBiz} />;
    if(subScreen==='portal') return <PortalScreen store={store} onBack={()=>setSubScreen(null)} onSignOut={handleSignOut} />;
    return null;
  };
  const renderTab = () => {
    if(tab==='home') return isBiz ? <HomeScreen store={store} onNav={handleNav} /> : <FHomeScreen store={store} onNav={handleNav} />;
    if(tab==='projects') return <ProjectsScreen store={store} />;
    if(tab==='crew') return <CrewScreen store={store} />;
    if(tab==='schedule') return <ScheduleScreen store={store} />;
    if(tab==='invoices') return <InvoicesScreen store={store} onBack={()=>setTab('home')} />;
    if(tab==='more') return <MoreScreen store={store} onSignOut={handleSignOut} isBiz={isBiz} />;
    return null;
  };
  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <View style={{flex:1}}>{subScreen ? renderSub() : renderTab()}</View>
      {!subScreen && <TabBar tabs={tabs} active={tab} onTab={t=>{setTab(t);setSubScreen(null);}} accentColor={accentColor} totalUnread={totalUnread} />}
    </View>
  );
}
