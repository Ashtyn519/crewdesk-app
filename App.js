import React,{useState,useRef,useEffect,useCallback} from 'react';
import {
  View,Text,TouchableOpacity,TextInput,ScrollView,FlatList,
  StyleSheet,Animated,Alert,Dimensions,StatusBar,SafeAreaView,Platform
} from 'react-native';

const {width:SW,height:SH} = Dimensions.get('window');

/* ── DESIGN TOKENS ───────────────────────────────────────── */
const C = {
  bg:'#0a1628',surf:'#111f3a',card:'#0f1d35',card2:'#122240',
  teal:'#00c2a8',gold:'#f59e0b',red:'#ef4444',green:'#22c55e',
  blue:'#3b82f6',purple:'#8b5cf6',orange:'#f97316',
  text:'#f0f4ff',sub:'#8fa3bf',dimmer:'#4a6080',
  border:'#1e3a5f',border2:'#243d63',
  pill:'#162d4e',
};
const T = {xs:11,sm:13,base:15,md:17,lg:20,xl:24,xxl:32,hero:42};
const R = {sm:8,md:14,lg:20,xl:28,pill:999};
const STAT_H = Platform.OS==='ios'?44:40;

/* ── SEED DATA ───────────────────────────────────────────── */
const SEED_PROJECTS = [
  {id:'p1',name:'Horizon Feature Film',client:'Apex Studios',status:'active',budget:280000,spent:142000,startDate:'2026-01-15',endDate:'2026-06-30',crew:12,desc:'Feature film production'},
  {id:'p2',name:'Nova TV Series S2',client:'StreamVault',status:'active',budget:950000,spent:310000,startDate:'2026-02-01',endDate:'2026-11-30',crew:28,desc:'Streaming drama series'},
  {id:'p3',name:'Echo Brand Campaign',client:'Lumina Corp',status:'pipeline',budget:45000,spent:0,startDate:'2026-04-01',endDate:'2026-05-15',crew:4,desc:'Commercial campaign'},
  {id:'p4',name:'Vertex Music Video',client:'Neon Records',status:'completed',budget:22000,spent:21500,startDate:'2026-01-05',endDate:'2026-01-28',crew:6,desc:'Music video production'},
  {id:'p5',name:'Summit Documentary',client:'TrueVision',status:'pipeline',budget:120000,spent:0,startDate:'2026-05-01',endDate:'2026-09-30',crew:8,desc:'Feature documentary'},
];
const SEED_CREW = [
  {id:'c1',name:'Alex Rivera',role:'Director of Photography',rate:850,rateType:'day',status:'available',skills:['Arri Alexa','DJI Ronin','Lighting'],email:'alex@crew.com',phone:'555-0101',rating:4.9,jobs:47},
  {id:'c2',name:'Sam Chen',role:'Production Designer',rate:700,rateType:'day',status:'busy',skills:['AutoCAD','Set Design','Props'],email:'sam@crew.com',phone:'555-0102',rating:4.8,jobs:33},
  {id:'c3',name:'Jordan Blake',role:'Sound Mixer',rate:600,rateType:'day',status:'available',skills:['Pro Tools','Boom Op','Location Sound'],email:'jordan@crew.com',phone:'555-0103',rating:4.7,jobs:58},
  {id:'c4',name:'Morgan Lee',role:'1st AC',rate:450,rateType:'day',status:'available',skills:['Focus Pull','Camera Prep','DIT'],email:'morgan@crew.com',phone:'555-0104',rating:4.6,jobs:29},
  {id:'c5',name:'Casey Kim',role:'Gaffer',rate:550,rateType:'day',status:'unavailable',skills:['HMI','LED','Electrical'],email:'casey@crew.com',phone:'555-0105',rating:4.8,jobs:41},
  {id:'c6',name:'Riley Park',role:'Script Supervisor',rate:400,rateType:'day',status:'available',skills:['Continuity','Script Notes','Breakdown'],email:'riley@crew.com',phone:'555-0106',rating:4.9,jobs:22},
];
const SEED_EVENTS = [
  {id:'e1',title:'Horizon - INT. Kitchen Scene',project:'Horizon Feature Film',date:'2026-03-06',start:'07:00',end:'14:00',crew:['Alex Rivera','Morgan Lee','Casey Kim'],location:'Stage 4, Sunset Studios',status:'completed',type:'shoot'},
  {id:'e2',title:'Nova S2 - Ep 5 Block',project:'Nova TV Series S2',date:'2026-03-08',start:'06:00',end:'18:00',crew:['Alex Rivera','Sam Chen','Jordan Blake','Morgan Lee'],location:'Downtown LA',status:'today',type:'shoot'},
  {id:'e3',title:'Echo Campaign - Lookbook',project:'Echo Brand Campaign',date:'2026-03-10',start:'09:00',end:'17:00',crew:['Alex Rivera','Riley Park'],location:'Malibu Beach',status:'upcoming',type:'shoot'},
  {id:'e4',title:'Summit Doc - Pre-Pro Meeting',project:'Summit Documentary',date:'2026-03-12',start:'10:00',end:'12:00',crew:['Sam Chen','Riley Park'],location:'CrewDesk HQ',status:'upcoming',type:'meeting'},
  {id:'e5',title:'Nova S2 - Table Read',project:'Nova TV Series S2',date:'2026-03-15',start:'13:00',end:'16:00',crew:['Jordan Blake','Riley Park'],location:'Read Room B',status:'upcoming',type:'prep'},
];
const SEED_INVOICES = [
  {id:'i1',project:'Nova TV Series S2',client:'StreamVault',amount:48500,status:'paid',date:'2026-02-15',due:'2026-03-01',items:[{desc:'Crew Week 1-4',qty:4,rate:12125}],attachments:[]},
  {id:'i2',project:'Horizon Feature Film',client:'Apex Studios',amount:32000,status:'pending',date:'2026-03-01',due:'2026-03-15',items:[{desc:'Production Week 1-2',qty:2,rate:16000}],attachments:[]},
  {id:'i3',project:'Echo Brand Campaign',client:'Lumina Corp',amount:18750,status:'draft',date:'2026-03-07',due:'2026-03-21',items:[{desc:'Pre-Production Services',qty:1,rate:18750}],attachments:[]},
  {id:'i4',project:'Vertex Music Video',client:'Neon Records',amount:21500,status:'paid',date:'2026-01-28',due:'2026-02-11',items:[{desc:'Full Production Package',qty:1,rate:21500}],attachments:[]},
  {id:'i5',project:'Nova TV Series S2',client:'StreamVault',amount:55000,status:'overdue',date:'2026-02-01',due:'2026-02-15',items:[{desc:'Crew Week 5-8',qty:4,rate:13750}],attachments:[]},
];
const SEED_MESSAGES = [
  {id:'m1',thread:'Horizon Film - Production',last:'Call sheet for tomorrow sent',time:'2m',unread:3,members:['Alex R','Sam C','Jordan B'],online:true},
  {id:'m2',thread:'Nova S2 - Full Crew',last:'Ep 5 location confirmed - Downtown',time:'18m',unread:1,members:['Alex R','Sam C','Jordan B','Morgan L'],online:true},
  {id:'m3',thread:'Echo Campaign',last:'Client approved the mood board!',time:'1h',unread:0,members:['Riley P','Sam C'],online:false},
  {id:'m4',thread:'Summit Doc - Core Team',last:'Pre-pro meeting confirmed Thurs',time:'3h',unread:0,members:['Sam C','Riley P'],online:false},
];
const CHAT_SEEDS = {
  'm1':[
    {id:'cm1',sender:'Alex R',text:'Hey all - final call sheet for tomorrow is attached',time:'09:15',mine:false},
    {id:'cm2',sender:'You',text:'Got it, will review now',time:'09:18',mine:true},
    {id:'cm3',sender:'Sam C',text:'Set is prepped and ready. Lighting rig is up',time:'09:22',mine:false},
    {id:'cm4',sender:'Jordan B',text:'Sound package loaded. See everyone at 6am',time:'09:45',mine:false},
  ],
  'm2':[
    {id:'cm5',sender:'Morgan L',text:'Location scouts confirmed Downtown for Ep 5',time:'10:00',mine:false},
    {id:'cm6',sender:'You',text:'Perfect - permits cleared too',time:'10:05',mine:true},
    {id:'cm7',sender:'Alex R',text:'Great. I will do a tech scout tomorrow afternoon',time:'10:12',mine:false},
  ],
};
const FAKE_ATTACHMENTS = ['invoice_breakdown.pdf','project_summary.pdf','contract_draft.pdf','timesheet_week1.pdf'];
/* ── STORE ───────────────────────────────────────────────── */
function useStore() {
  const [projects,setProjects] = useState(SEED_PROJECTS);
  const [crew,setCrew] = useState(SEED_CREW);
  const [events,setEvents] = useState(SEED_EVENTS);
  const [invoices,setInvoices] = useState(SEED_INVOICES);
  const [messages,setMessages] = useState(SEED_MESSAGES);
  const [chats,setChats] = useState(CHAT_SEEDS);

  const addProject = p => setProjects(prev=>[{...p,id:'p'+Date.now()},  ...prev]);
  const updateProject = p => setProjects(prev=>prev.map(x=>x.id===p.id?p:x));
  const deleteProject = id => setProjects(prev=>prev.filter(x=>x.id!==id));

  const addCrew = c => setCrew(prev=>[{...c,id:'c'+Date.now(),rating:5,jobs:0},...prev]);
  const updateCrew = c => setCrew(prev=>prev.map(x=>x.id===c.id?c:x));
  const deleteCrew = id => setCrew(prev=>prev.filter(x=>x.id!==id));

  const addEvent = e => setEvents(prev=>[{...e,id:'e'+Date.now()},...prev]);
  const updateEvent = e => setEvents(prev=>prev.map(x=>x.id===e.id?e:x));
  const deleteEvent = id => setEvents(prev=>prev.filter(x=>x.id!==id));

  const addInvoice = i => setInvoices(prev=>[{...i,id:'i'+Date.now(),attachments:[]},...prev]);
  const updateInvoice = i => setInvoices(prev=>prev.map(x=>x.id===i.id?i:x));
  const deleteInvoice = id => setInvoices(prev=>prev.filter(x=>x.id!==id));

  const sendMessage = (threadId,text) => {
    const msg = {id:'cm'+Date.now(),sender:'You',text,time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),mine:true};
    setChats(prev=>({...prev,[threadId]:[...(prev[threadId]||[]),msg]}));
    setMessages(prev=>prev.map(m=>m.id===threadId?{...m,last:text,time:'now'}:m));
  };
  const addThread = t => setMessages(prev=>[{...t,id:'m'+Date.now(),unread:0,online:false},...prev]);

  return {projects,crew,events,invoices,messages,chats,
    addProject,updateProject,deleteProject,
    addCrew,updateCrew,deleteCrew,
    addEvent,updateEvent,deleteEvent,
    addInvoice,updateInvoice,deleteInvoice,
    sendMessage,addThread};
}

/* ── SHARED COMPONENTS ──────────────────────────────────── */
function PBtn({onPress,style,children,disabled=false}) {
  const sc = useRef(new Animated.Value(1)).current;
  const onIn = () => Animated.spring(sc,{toValue:0.94,useNativeDriver:true}).start();
  const onOut = () => Animated.spring(sc,{toValue:1,useNativeDriver:true}).start();
  return (
    <TouchableOpacity onPress={disabled?null:onPress} onPressIn={onIn} onPressOut={onOut} activeOpacity={1}>
      <Animated.View style={[{transform:[{scale:sc}]},style,disabled&&{opacity:0.45}]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
}

function Badge({count,color=C.red}) {
  if(!count) return null;
  return <View style={{backgroundColor:color,borderRadius:R.pill,minWidth:18,height:18,alignItems:'center',justifyContent:'center',paddingHorizontal:4}}>
    <Text style={{color:C.text,fontSize:T.xs,fontWeight:'700'}}>{count>99?'99+':count}</Text>
  </View>;
}

function Chip({label,color=C.teal,onPress,active=true}) {
  return (
    <PBtn onPress={onPress}>
      <View style={{paddingHorizontal:12,paddingVertical:5,borderRadius:R.pill,
        backgroundColor:active?color+'22':C.pill,
        borderWidth:1,borderColor:active?color:C.border}}>
        <Text style={{color:active?color:C.sub,fontSize:T.xs,fontWeight:'600'}}>{label}</Text>
      </View>
    </PBtn>
  );
}

function FilterPills({options,selected,onSelect,color=C.teal}) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}
      contentContainerStyle={{paddingHorizontal:16,paddingVertical:8}}>
      {options.map(o=>(
        <View key={o} style={{marginRight:8}}>
          <Chip label={o} active={selected===o} color={color} onPress={()=>onSelect(o)} />
        </View>
      ))}
    </ScrollView>
  );
}

function Card({style,children,onPress}) {
  if(onPress) return (
    <PBtn onPress={onPress} style={[{backgroundColor:C.card,borderRadius:R.lg,padding:16,borderWidth:1,borderColor:C.border},style]}>
      {children}
    </PBtn>
  );
  return <View style={[{backgroundColor:C.card,borderRadius:R.lg,padding:16,borderWidth:1,borderColor:C.border},style]}>{children}</View>;
}

function KPI({label,value,sub,color=C.teal,onPress,icon}) {
  return (
    <PBtn onPress={onPress} style={{flex:1,backgroundColor:C.card2,borderRadius:R.lg,padding:14,borderWidth:1,borderColor:C.border,alignItems:'center'}}>
      {icon && <Text style={{fontSize:18,marginBottom:4}}>{icon}</Text>}
      <Text style={{color,fontSize:T.xl,fontWeight:'800',letterSpacing:-0.5}}>{value}</Text>
      <Text style={{color:C.text,fontSize:T.xs,fontWeight:'600',marginTop:2,textAlign:'center'}}>{label}</Text>
      {sub && <Text style={{color:C.sub,fontSize:T.xs,marginTop:2,textAlign:'center'}}>{sub}</Text>}
    </PBtn>
  );
}

function SecHead({label,action,onAction,color}) {
  return (
    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
      <Text style={{color:color||C.text,fontSize:T.md,fontWeight:'700'}}>{label}</Text>
      {action && <TouchableOpacity onPress={onAction}><Text style={{color:C.teal,fontSize:T.sm,fontWeight:'600'}}>{action}</Text></TouchableOpacity>}
    </View>
  );
}

function Avi({name,size=36,color=C.teal,online=false}) {
  const initials = name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
  return (
    <View style={{position:'relative',width:size,height:size,borderRadius:size/2,backgroundColor:color+'33',alignItems:'center',justifyContent:'center',borderWidth:1.5,borderColor:color+'55'}}>
      <Text style={{color,fontSize:size*0.38,fontWeight:'700'}}>{initials}</Text>
      {online && <View style={{position:'absolute',bottom:0,right:0,width:size*0.28,height:size*0.28,borderRadius:size*0.14,backgroundColor:C.green,borderWidth:1.5,borderColor:C.bg}} />}
    </View>
  );
}

function Empty({icon,label,sub,action,onAction}) {
  return (
    <View style={{alignItems:'center',paddingVertical:48,paddingHorizontal:24}}>
      <Text style={{fontSize:40,marginBottom:12}}>{icon}</Text>
      <Text style={{color:C.text,fontSize:T.md,fontWeight:'600',textAlign:'center'}}>{label}</Text>
      {sub && <Text style={{color:C.sub,fontSize:T.sm,textAlign:'center',marginTop:6,lineHeight:20}}>{sub}</Text>}
      {action && <View style={{marginTop:20}}><Btn label={action} onPress={onAction} /></View>}
    </View>
  );
}

function FInput({label,value,onChangeText,placeholder,kbType='default',multi=false,lines=1,error}) {
  const [focus,setFocus] = useState(false);
  const borderColor = error ? C.red : focus ? C.teal : C.border;
  return (
    <View style={{marginBottom:14}}>
      {label && <Text style={{color:C.sub,fontSize:T.xs,fontWeight:'700',marginBottom:6,textTransform:'uppercase',letterSpacing:1}}>{label}</Text>}
      <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder}
        placeholderTextColor={C.dimmer} keyboardType={kbType} multiline={multi}
        numberOfLines={lines} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)}
        style={{backgroundColor:C.surf,borderRadius:R.md,borderWidth:1.5,borderColor,
          color:C.text,fontSize:T.base,paddingHorizontal:14,
          paddingVertical:multi?12:0,height:multi?lines*30:48}} />
      {error && <Text style={{color:C.red,fontSize:T.xs,marginTop:4}}>{error}</Text>}
    </View>
  );
}

function Btn({label,onPress,color=C.teal,outline=false,style,disabled=false,size='md'}) {
  const py = size==='sm' ? 9 : size==='lg' ? 16 : 13;
  return (
    <PBtn onPress={onPress} disabled={disabled} style={{
      backgroundColor:outline?'transparent':color,
      borderRadius:R.pill,paddingVertical:py,paddingHorizontal:28,alignItems:'center',
      borderWidth:1.5,borderColor:outline?color:'transparent',...style}}>
      <Text style={{color:outline?color:C.bg,fontSize:T.base,fontWeight:'800'}}>{label}</Text>
    </PBtn>
  );
}

function Sheet({visible,onClose,title,children}) {
  const ty = useRef(new Animated.Value(300)).current;
  useEffect(()=>{
    Animated.spring(ty,{toValue:visible?0:300,useNativeDriver:true,tension:80,friction:12}).start();
  },[visible]);
  if(!visible) return null;
  return (
    <View style={StyleSheet.absoluteFillObject}>
      <TouchableOpacity style={{flex:1,backgroundColor:'#00000088'}} activeOpacity={1} onPress={onClose} />
      <Animated.View style={{backgroundColor:C.surf,borderTopLeftRadius:24,borderTopRightRadius:24,padding:20,paddingBottom:36,transform:[{translateY:ty}]}}>
        <View style={{width:36,height:4,borderRadius:2,backgroundColor:C.border,alignSelf:'center',marginBottom:16}} />
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
          <Text style={{color:C.text,fontSize:T.md,fontWeight:'700'}}>{title}</Text>
          <TouchableOpacity onPress={onClose}><Text style={{color:C.sub,fontSize:T.md}}>Done</Text></TouchableOpacity>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView>
      </Animated.View>
    </View>
  );
}

function Stars({rating}) {
  return (
    <View style={{flexDirection:'row',alignItems:'center'}}>
      {[1,2,3,4,5].map(s=>(
        <Text key={s} style={{fontSize:11,color:s<=Math.round(rating)?C.gold:C.dimmer}}>
          {s<=Math.round(rating)?'*':'.'}
        </Text>
      ))}
      <Text style={{color:C.sub,fontSize:T.xs,marginLeft:4}}>{rating.toFixed(1)}</Text>
    </View>
  );
}

function Bar({pct,color=C.teal,height=6}) {
  return (
    <View style={{height,borderRadius:R.pill,backgroundColor:C.border,overflow:'hidden',flex:1}}>
      <View style={{width:pct+'%',height:'100%',borderRadius:R.pill,backgroundColor:color}} />
    </View>
  );
}

function ScreenHeader({title,onBack,right}) {
  return (
    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingVertical:12,borderBottomWidth:1,borderBottomColor:C.border}}>
      <View style={{flexDirection:'row',alignItems:'center',flex:1}}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={{marginRight:12,padding:4}}>
            <Text style={{color:C.teal,fontSize:T.base,fontWeight:'600'}}>{'< Back'}</Text>
          </TouchableOpacity>
        )}
        <Text style={{color:C.text,fontSize:T.md,fontWeight:'700',flex:1}}>{title}</Text>
      </View>
      {right && <View>{right}</View>}
    </View>
  );
}

function Divider({style}) {
  return <View style={[{height:1,backgroundColor:C.border,marginVertical:8},style]} />;
}
/* ── LOGIN SCREEN ───────────────────────────────────────── */
function LoginScreen({onLogin}) {
  const [mode,setMode] = useState('choose');
  const [isBiz,setIsBiz] = useState(true);
  const [email,setEmail] = useState('');
  const [pass,setPass] = useState('');
  const [emailErr,setEmailErr] = useState('');
  const [passErr,setPassErr] = useState('');
  const fade = useRef(new Animated.Value(0)).current;
  const slideY = useRef(new Animated.Value(40)).current;

  useEffect(()=>{
    Animated.parallel([
      Animated.timing(fade,{toValue:1,duration:700,useNativeDriver:true}),
      Animated.spring(slideY,{toValue:0,tension:60,friction:10,useNativeDriver:true}),
    ]).start();
  },[]);

  const goForm = (biz) => {
    setIsBiz(biz);
    setEmail('');setPass('');setEmailErr('');setPassErr('');
    setMode('form');
  };

  const validate = () => {
    let ok = true;
    if(!email.includes('@')){setEmailErr('Enter a valid email address');ok=false;}else setEmailErr('');
    if(pass.length<6){setPassErr('Password must be at least 6 characters');ok=false;}else setPassErr('');
    return ok;
  };

  const handleSignIn = () => {
    if(validate()) onLogin(isBiz?'business':'freelancer');
  };

  if(mode==='form') return (
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <TouchableOpacity onPress={()=>setMode('choose')} style={{paddingHorizontal:20,paddingTop:16}}>
        <Text style={{color:C.teal,fontSize:T.base,fontWeight:'600'}}>{'< Back'}</Text>
      </TouchableOpacity>
      <ScrollView contentContainerStyle={{padding:24,paddingTop:20}}>
        <View style={{alignItems:'center',marginBottom:32}}>
          <View style={{width:64,height:64,borderRadius:R.lg,backgroundColor:isBiz?C.teal+'22':C.gold+'22',
            borderWidth:2,borderColor:isBiz?C.teal:C.gold,alignItems:'center',justifyContent:'center',marginBottom:12}}>
            <Text style={{color:isBiz?C.teal:C.gold,fontSize:T.xl,fontWeight:'900'}}>{isBiz?'Bz':'Fr'}</Text>
          </View>
          <Text style={{color:C.text,fontSize:T.xl,fontWeight:'800'}}>{isBiz?'Business Login':'Freelancer Login'}</Text>
          <Text style={{color:C.sub,fontSize:T.sm,marginTop:6}}>
            {isBiz?'Access your production dashboard':'Access your freelancer portal'}
          </Text>
        </View>
        <FInput label="Email Address" value={email} onChangeText={setEmail}
          placeholder="you@company.com" kbType="email-address" error={emailErr} />
        <FInput label="Password" value={pass} onChangeText={setPass}
          placeholder="Min. 6 characters" error={passErr} />
        <View style={{marginTop:8}}>
          <Btn label={isBiz?'Sign In to Dashboard':'Sign In to Portal'}
            onPress={handleSignIn} color={isBiz?C.teal:C.gold} size='lg' />
        </View>
        <TouchableOpacity style={{marginTop:16,alignItems:'center'}}>
          <Text style={{color:C.sub,fontSize:T.sm}}>Forgot password? <Text style={{color:isBiz?C.teal:C.gold,fontWeight:'600'}}>Reset</Text></Text>
        </TouchableOpacity>
        <TouchableOpacity style={{marginTop:32,alignItems:'center',padding:16,borderRadius:R.lg,borderWidth:1,borderColor:C.border}} onPress={()=>setMode('choose')}>
          <Text style={{color:C.sub,fontSize:T.sm}}>Not your account type? <Text style={{color:isBiz?C.teal:C.gold,fontWeight:'600'}}>Switch</Text></Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );

  return (
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg} />
      <Animated.View style={{flex:1,opacity:fade,transform:[{translateY:slideY}]}}>
        <View style={{flex:1,justifyContent:'center',paddingHorizontal:28}}>
          <View style={{alignItems:'center',marginBottom:48}}>
            <View style={{width:80,height:80,borderRadius:20,backgroundColor:C.teal+'22',
              borderWidth:2.5,borderColor:C.teal,alignItems:'center',justifyContent:'center',marginBottom:20}}>
              <Text style={{color:C.text,fontSize:T.xxl,fontWeight:'900',letterSpacing:-1}}>CD</Text>
            </View>
            <Text style={{color:C.text,fontSize:T.hero,fontWeight:'900',letterSpacing:-2,textAlign:'center'}}>
              Crew<Text style={{color:C.teal}}>Desk</Text>
            </Text>
            <Text style={{color:C.sub,fontSize:T.sm,marginTop:8,textAlign:'center',lineHeight:20}}>
              The production management platform for film, TV and live events
            </Text>
          </View>

          <Text style={{color:C.sub,fontSize:T.xs,fontWeight:'700',textAlign:'center',
            letterSpacing:2,textTransform:'uppercase',marginBottom:20}}>CONTINUE AS</Text>

          <PBtn onPress={()=>goForm(true)} style={{backgroundColor:C.card,borderRadius:R.xl,
            padding:20,marginBottom:14,borderWidth:1.5,borderColor:C.teal+'66',
            flexDirection:'row',alignItems:'center'}}>
            <View style={{width:52,height:52,borderRadius:R.md,backgroundColor:C.teal+'22',
              borderWidth:2,borderColor:C.teal,alignItems:'center',justifyContent:'center',marginRight:16}}>
              <Text style={{color:C.teal,fontSize:T.lg,fontWeight:'900'}}>Bz</Text>
            </View>
            <View style={{flex:1}}>
              <Text style={{color:C.text,fontSize:T.md,fontWeight:'800'}}>Business</Text>
              <Text style={{color:C.sub,fontSize:T.sm,marginTop:3,lineHeight:18}}>Manage productions, crew, budgets and billing</Text>
            </View>
            <Text style={{color:C.teal,fontSize:T.lg,fontWeight:'700'}}>{'>'}</Text>
          </PBtn>

          <PBtn onPress={()=>goForm(false)} style={{backgroundColor:C.card,borderRadius:R.xl,
            padding:20,borderWidth:1.5,borderColor:C.gold+'66',
            flexDirection:'row',alignItems:'center'}}>
            <View style={{width:52,height:52,borderRadius:R.md,backgroundColor:C.gold+'22',
              borderWidth:2,borderColor:C.gold,alignItems:'center',justifyContent:'center',marginRight:16}}>
              <Text style={{color:C.gold,fontSize:T.lg,fontWeight:'900'}}>Fr</Text>
            </View>
            <View style={{flex:1}}>
              <Text style={{color:C.text,fontSize:T.md,fontWeight:'800'}}>Freelancer / Contractor</Text>
              <Text style={{color:C.sub,fontSize:T.sm,marginTop:3,lineHeight:18}}>Find work, track gigs, send invoices and get paid</Text>
            </View>
            <Text style={{color:C.gold,fontSize:T.lg,fontWeight:'700'}}>{'>'}</Text>
          </PBtn>

          <Text style={{color:C.dimmer,fontSize:T.xs,textAlign:'center',marginTop:32,lineHeight:16}}>
            By continuing you agree to CrewDesk Terms of Service and Privacy Policy
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}
/* ── HOME SCREEN (BUSINESS) ─────────────────────────────── */
function HomeScreen({store,onNav}) {
  const {projects,invoices,crew,events} = store;
  const activeProj = projects.filter(p=>p.status==='active');
  const totalBudget = activeProj.reduce((s,p)=>s+p.budget,0);
  const totalSpent = activeProj.reduce((s,p)=>s+p.spent,0);
  const pendingInv = invoices.filter(iv=>iv.status==='pending'||iv.status==='overdue');
  const overdueInv = invoices.filter(iv=>iv.status==='overdue');
  const availCrew = crew.filter(c=>c.status==='available');
  const todayEvents = events.filter(e=>e.status==='today');
  const pendingAmount = pendingInv.reduce((s,iv)=>s+iv.amount,0);
  const overdueAmount = overdueInv.reduce((s,iv)=>s+iv.amount,0);
  const utilPct = Math.round((crew.filter(c=>c.status==='busy').length/crew.length)*100);
  const fmt = n => n>=1000?'$'+(n/1000).toFixed(0)+'k':'$'+n;

  return (
    <ScrollView style={{flex:1,backgroundColor:C.bg}} showsVerticalScrollIndicator={false}>
      <SafeAreaView>
        <View style={{paddingHorizontal:16,paddingTop:20,paddingBottom:12}}>
          <Text style={{color:C.sub,fontSize:T.sm,fontWeight:'600',letterSpacing:1,textTransform:'uppercase'}}>DASHBOARD</Text>
          <Text style={{color:C.text,fontSize:T.xl,fontWeight:'800',marginTop:4}}>Good morning</Text>
        </View>

        {overdueInv.length>0 && (
          <View style={{marginHorizontal:16,marginBottom:12,backgroundColor:C.red+'18',borderRadius:R.lg,
            padding:14,borderWidth:1,borderColor:C.red+'55',flexDirection:'row',alignItems:'center'}}>
            <View style={{flex:1}}>
              <Text style={{color:C.red,fontSize:T.sm,fontWeight:'700'}}>{overdueInv.length} Overdue Invoice{overdueInv.length>1?'s':''}</Text>
              <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>{fmt(overdueAmount)} outstanding - action required</Text>
            </View>
            <TouchableOpacity onPress={()=>onNav('invoices')}>
              <Text style={{color:C.red,fontSize:T.sm,fontWeight:'700'}}>View {'>'}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{flexDirection:'row',paddingHorizontal:16,marginBottom:8}}>
          <KPI label="Active Projects" value={activeProj.length} sub={projects.filter(p=>p.status==='pipeline').length+' in pipeline'}
            color={C.teal} onPress={()=>onNav('projects')} />
          <View style={{width:10}} />
          <KPI label="Budget Used" value={fmt(totalSpent)} sub={'of '+fmt(totalBudget)+' total'}
            color={C.blue} onPress={()=>onNav('projects')} />
        </View>
        <View style={{flexDirection:'row',paddingHorizontal:16,marginBottom:16}}>
          <KPI label="Outstanding" value={fmt(pendingAmount)} sub={pendingInv.length+' invoice'+(pendingInv.length!==1?'s':'')}
            color={overdueInv.length>0?C.red:C.gold} onPress={()=>onNav('invoices')} />
          <View style={{width:10}} />
          <KPI label="Crew Utilisation" value={utilPct+'%'} sub={availCrew.length+' available now'}
            color={C.green} onPress={()=>onNav('crew')} />
        </View>

        <View style={{paddingHorizontal:16,marginBottom:16}}>
          <SecHead label="Quick Access" />
          <View style={{flexDirection:'row',flexWrap:'wrap'}}>
            {[
              {label:'Messages',sub:'Team comms',color:C.blue,nav:'messages'},
              {label:'Invoices',sub:'Billing centre',color:C.gold,nav:'invoices'},
              {label:'Reports',sub:'Analytics',color:C.purple,nav:'reports'},
            ].map(item=>(
              <PBtn key={item.nav} onPress={()=>onNav(item.nav)}
                style={{width:(SW-48)/3,marginRight:8,backgroundColor:C.card2,borderRadius:R.lg,
                  padding:12,borderWidth:1,borderColor:C.border,alignItems:'center',marginBottom:8}}>
                <View style={{width:40,height:40,borderRadius:R.md,backgroundColor:item.color+'22',
                  borderWidth:1.5,borderColor:item.color+'55',alignItems:'center',justifyContent:'center',marginBottom:8}}>
                  <Text style={{color:item.color,fontSize:T.lg,fontWeight:'800'}}>{item.label[0]}</Text>
                </View>
                <Text style={{color:C.text,fontSize:T.xs,fontWeight:'700',textAlign:'center'}}>{item.label}</Text>
                <Text style={{color:C.sub,fontSize:10,marginTop:2,textAlign:'center'}}>{item.sub}</Text>
              </PBtn>
            ))}
          </View>
        </View>

        <View style={{paddingHorizontal:16,marginBottom:16}}>
          <SecHead label="Today" />
          {todayEvents.length===0 ? (
            <Card><Text style={{color:C.sub,fontSize:T.sm,textAlign:'center',paddingVertical:8}}>No shoots today</Text></Card>
          ) : todayEvents.map(e=>(
            <Card key={e.id} style={{marginBottom:8,flexDirection:'row',alignItems:'center'}}>
              <View style={{width:4,height:44,borderRadius:2,backgroundColor:C.teal,marginRight:12}} />
              <View style={{flex:1}}>
                <Text style={{color:C.text,fontSize:T.sm,fontWeight:'700'}}>{e.title}</Text>
                <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>{e.start} - {e.end}  |  {e.location}</Text>
              </View>
            </Card>
          ))}
        </View>

        <View style={{paddingHorizontal:16,marginBottom:24}}>
          <SecHead label="Active Productions" action="See all" onAction={()=>onNav('projects')} />
          {activeProj.slice(0,3).map(p=>{
            const pct = Math.round((p.spent/p.budget)*100);
            return (
              <Card key={p.id} style={{marginBottom:10}}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:8}}>
                  <Text style={{color:C.text,fontSize:T.sm,fontWeight:'700',flex:1}}>{p.name}</Text>
                  <Text style={{color:C.sub,fontSize:T.xs}}>{p.crew} crew</Text>
                </View>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <Bar pct={pct} color={pct>85?C.red:pct>60?C.gold:C.teal} />
                  <Text style={{color:C.sub,fontSize:T.xs,marginLeft:8,width:36,textAlign:'right'}}>{pct}%</Text>
                </View>
                <Text style={{color:C.sub,fontSize:T.xs,marginTop:6}}>{fmt(p.spent)} spent of {fmt(p.budget)}</Text>
              </Card>
            );
          })}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}

/* ── FREELANCER HOME ─────────────────────────────────────── */
function FHomeScreen({store,onNav,userName='Jordan'}) {
  const {invoices,events} = store;
  const myInvoices = invoices.slice(0,3);
  const upcoming = events.filter(e=>e.status==='upcoming'||e.status==='today').slice(0,3);
  const earned = myInvoices.filter(iv=>iv.status==='paid').reduce((s,iv)=>s+iv.amount,0);
  const pending = myInvoices.filter(iv=>iv.status==='pending').reduce((s,iv)=>s+iv.amount,0);
  const overdue = myInvoices.filter(iv=>iv.status==='overdue').reduce((s,iv)=>s+iv.amount,0);
  const fmt = n => n>=1000?'$'+(n/1000).toFixed(0)+'k':'$'+n;

  return (
    <ScrollView style={{flex:1,backgroundColor:C.bg}} showsVerticalScrollIndicator={false}>
      <SafeAreaView>
        <View style={{paddingHorizontal:16,paddingTop:20,paddingBottom:12}}>
          <Text style={{color:C.sub,fontSize:T.sm,fontWeight:'600',letterSpacing:1,textTransform:'uppercase'}}>PORTAL</Text>
          <Text style={{color:C.text,fontSize:T.xl,fontWeight:'800',marginTop:4}}>Hi, {userName}</Text>
        </View>

        {overdue>0 && (
          <View style={{marginHorizontal:16,marginBottom:12,backgroundColor:C.red+'18',borderRadius:R.lg,
            padding:14,borderWidth:1,borderColor:C.red+'55',flexDirection:'row',alignItems:'center'}}>
            <View style={{flex:1}}>
              <Text style={{color:C.red,fontSize:T.sm,fontWeight:'700'}}>Overdue Payment</Text>
              <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>{fmt(overdue)} outstanding</Text>
            </View>
            <TouchableOpacity onPress={()=>onNav('invoices')}>
              <Text style={{color:C.red,fontSize:T.sm,fontWeight:'700'}}>Chase {'>'}</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{flexDirection:'row',paddingHorizontal:16,marginBottom:8}}>
          <KPI label="Earned (YTD)" value={fmt(earned)} color={C.teal} onPress={()=>onNav('invoices')} />
          <View style={{width:10}} />
          <KPI label="Pending" value={fmt(pending)} color={C.gold} onPress={()=>onNav('invoices')} />
        </View>
        <View style={{flexDirection:'row',paddingHorizontal:16,marginBottom:16}}>
          <KPI label="Jobs Done" value={myInvoices.filter(iv=>iv.status==='paid').length} color={C.green} onPress={()=>onNav('invoices')} />
          <View style={{width:10}} />
          <KPI label="Upcoming Gigs" value={upcoming.length} color={C.blue} onPress={()=>onNav('schedule')} />
        </View>

        <View style={{paddingHorizontal:16,marginBottom:16}}>
          <SecHead label="Quick Access" />
          <View style={{flexDirection:'row',flexWrap:'wrap'}}>
            {[
              {label:'Messages',sub:'Work chat',color:C.blue,nav:'messages'},
              {label:'Reports',sub:'Earnings',color:C.purple,nav:'reports'},
              {label:'Portal',sub:'My profile',color:C.gold,nav:'portal'},
            ].map(item=>(
              <PBtn key={item.nav} onPress={()=>onNav(item.nav)}
                style={{width:(SW-48)/3,marginRight:8,backgroundColor:C.card2,borderRadius:R.lg,
                  padding:12,borderWidth:1,borderColor:C.border,alignItems:'center',marginBottom:8}}>
                <View style={{width:40,height:40,borderRadius:R.md,backgroundColor:item.color+'22',
                  borderWidth:1.5,borderColor:item.color+'55',alignItems:'center',justifyContent:'center',marginBottom:8}}>
                  <Text style={{color:item.color,fontSize:T.lg,fontWeight:'800'}}>{item.label[0]}</Text>
                </View>
                <Text style={{color:C.text,fontSize:T.xs,fontWeight:'700',textAlign:'center'}}>{item.label}</Text>
                <Text style={{color:C.sub,fontSize:10,marginTop:2,textAlign:'center'}}>{item.sub}</Text>
              </PBtn>
            ))}
          </View>
        </View>

        <View style={{paddingHorizontal:16,marginBottom:16}}>
          <SecHead label="Upcoming Work" action="Schedule" onAction={()=>onNav('schedule')} />
          {upcoming.length===0 ? (
            <Card><Text style={{color:C.sub,fontSize:T.sm,textAlign:'center',paddingVertical:8}}>No upcoming gigs</Text></Card>
          ) : upcoming.map(e=>(
            <Card key={e.id} style={{marginBottom:8,flexDirection:'row',alignItems:'center'}}>
              <View style={{width:4,height:44,borderRadius:2,backgroundColor:e.status==='today'?C.teal:C.gold,marginRight:12}} />
              <View style={{flex:1}}>
                <Text style={{color:C.text,fontSize:T.sm,fontWeight:'700'}}>{e.title}</Text>
                <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>{e.date}  |  {e.start} - {e.end}</Text>
              </View>
            </Card>
          ))}
        </View>

        <View style={{paddingHorizontal:16,marginBottom:24}}>
          <SecHead label="Recent Invoices" action="See all" onAction={()=>onNav('invoices')} />
          {myInvoices.slice(0,3).map(ri=>(
            <Card key={ri.id} style={{marginBottom:8,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
              <View style={{flex:1}}>
                <Text style={{color:C.text,fontSize:T.sm,fontWeight:'600'}}>{ri.project}</Text>
                <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>{ri.date}</Text>
              </View>
              <View style={{alignItems:'flex-end'}}>
                <Text style={{color:C.text,fontSize:T.sm,fontWeight:'700'}}>{'$' + ri.amount.toLocaleString()}</Text>
                <View style={{marginTop:4}}>
                  <Chip label={ri.status.toUpperCase()} active
                    color={ri.status==='paid'?C.green:ri.status==='overdue'?C.red:C.gold}
                    onPress={()=>{}} />
                </View>
              </View>
            </Card>
          ))}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
}
/* ── PROJECTS SCREEN ────────────────────────────────────── */
function ProjectsScreen({store}) {
  const {projects,addProject,updateProject,deleteProject} = store;
  const [filter,setFilter] = useState('All');
  const [sheet,setSheet] = useState(false);
  const [edit,setEdit] = useState(null);
  const [form,setForm] = useState({name:'',client:'',budget:'',status:'active',desc:''});
  const [errors,setErrors] = useState({});

  const filters = ['All','Active','Pipeline','Completed'];
  const fmt = n => n>=1000?'$'+(n/1000).toFixed(0)+'k':'$'+n;

  const filtered = filter==='All'?projects:projects.filter(p=>p.status===filter.toLowerCase());
  const totalBudget = projects.reduce((s,p)=>s+p.budget,0);
  const activeCount = projects.filter(p=>p.status==='active').length;
  const pipelineCount = projects.filter(p=>p.status==='pipeline').length;

  const openAdd = () => { setEdit(null); setForm({name:'',client:'',budget:'',status:'active',desc:''}); setErrors({}); setSheet(true); };
  const openEdit = p => { setEdit(p); setForm({name:p.name,client:p.client,budget:String(p.budget),status:p.status,desc:p.desc||''}); setErrors({}); setSheet(true); };

  const validate = () => {
    const e={};
    if(!form.name.trim()) e.name='Project name is required';
    if(!form.client.trim()) e.client='Client name is required';
    if(!form.budget||isNaN(Number(form.budget))) e.budget='Enter a valid budget amount';
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const save = () => {
    if(!validate()) return;
    const data = {...form,budget:Number(form.budget),spent:edit?edit.spent:0,startDate:edit?edit.startDate:'2026-03-08',endDate:edit?edit.endDate:'2026-12-31',crew:edit?edit.crew:0};
    if(edit) updateProject({...edit,...data});
    else addProject(data);
    setSheet(false);
  };

  const confirmDelete = p => Alert.alert('Delete Project','Remove '+p.name+' from your projects?',[
    {text:'Cancel',style:'cancel'},
    {text:'Delete',style:'destructive',onPress:()=>deleteProject(p.id)},
  ]);

  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <SafeAreaView style={{flex:1}}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingTop:16,paddingBottom:8}}>
          <Text style={{color:C.text,fontSize:T.xl,fontWeight:'800'}}>Projects</Text>
          <Btn label="+ New" onPress={openAdd} size='sm' />
        </View>

        <View style={{flexDirection:'row',paddingHorizontal:16,marginBottom:8}}>
          <View style={{flex:1,backgroundColor:C.card2,borderRadius:R.md,padding:10,marginRight:6,alignItems:'center',borderWidth:1,borderColor:C.border}}>
            <Text style={{color:C.teal,fontSize:T.md,fontWeight:'800'}}>{fmt(totalBudget)}</Text>
            <Text style={{color:C.sub,fontSize:T.xs}}>Total Budget</Text>
          </View>
          <View style={{flex:1,backgroundColor:C.card2,borderRadius:R.md,padding:10,marginRight:6,alignItems:'center',borderWidth:1,borderColor:C.border}}>
            <Text style={{color:C.green,fontSize:T.md,fontWeight:'800'}}>{activeCount}</Text>
            <Text style={{color:C.sub,fontSize:T.xs}}>Active</Text>
          </View>
          <View style={{flex:1,backgroundColor:C.card2,borderRadius:R.md,padding:10,alignItems:'center',borderWidth:1,borderColor:C.border}}>
            <Text style={{color:C.gold,fontSize:T.md,fontWeight:'800'}}>{pipelineCount}</Text>
            <Text style={{color:C.sub,fontSize:T.xs}}>Pipeline</Text>
          </View>
        </View>

        <FilterPills options={filters} selected={filter} onSelect={setFilter} />

        <FlatList data={filtered} keyExtractor={p=>p.id} contentContainerStyle={{paddingHorizontal:16,paddingBottom:24}}
          ListEmptyComponent={<Empty icon="T" label="No projects" sub="Tap + New to add your first project" action="Add Project" onAction={openAdd} />}
          renderItem={({item:p})=>{
            const pct = p.budget>0?Math.round((p.spent/p.budget)*100):0;
            const statusColor = p.status==='active'?C.teal:p.status==='pipeline'?C.gold:p.status==='completed'?C.green:C.sub;
            return (
              <Card style={{marginBottom:10}}>
                <View style={{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginBottom:10}}>
                  <View style={{flex:1,marginRight:8}}>
                    <Text style={{color:C.text,fontSize:T.base,fontWeight:'700'}}>{p.name}</Text>
                    <Text style={{color:C.sub,fontSize:T.xs,marginTop:3}}>{p.client}</Text>
                  </View>
                  <Chip label={p.status.toUpperCase()} color={statusColor} active onPress={()=>{}} />
                </View>
                <View style={{flexDirection:'row',alignItems:'center',marginBottom:8}}>
                  <Bar pct={pct} color={pct>85?C.red:pct>60?C.gold:C.teal} />
                  <Text style={{color:C.sub,fontSize:T.xs,marginLeft:8,width:36,textAlign:'right'}}>{pct}%</Text>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                  <Text style={{color:C.sub,fontSize:T.xs}}>{fmt(p.spent)} / {fmt(p.budget)}</Text>
                  <Text style={{color:C.sub,fontSize:T.xs}}>{p.crew} crew members</Text>
                </View>
                <Divider />
                <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                  <TouchableOpacity onPress={()=>openEdit(p)} style={{paddingHorizontal:12,paddingVertical:6,marginRight:8}}>
                    <Text style={{color:C.teal,fontSize:T.sm,fontWeight:'600'}}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>confirmDelete(p)} style={{paddingHorizontal:12,paddingVertical:6}}>
                    <Text style={{color:C.red,fontSize:T.sm,fontWeight:'600'}}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </Card>
            );
          }}
        />
      </SafeAreaView>
      <Sheet visible={sheet} onClose={()=>setSheet(false)} title={edit?'Edit Project':'New Project'}>
        <FInput label="Project Name" value={form.name} onChangeText={v=>setForm(f=>({...f,name:v}))} placeholder="e.g. Horizon Feature Film" error={errors.name} />
        <FInput label="Client" value={form.client} onChangeText={v=>setForm(f=>({...f,client:v}))} placeholder="e.g. Apex Studios" error={errors.client} />
        <FInput label="Budget" value={form.budget} onChangeText={v=>setForm(f=>({...f,budget:v}))} placeholder="e.g. 250000" kbType="numeric" error={errors.budget} />
        <View style={{marginBottom:14}}>
          <Text style={{color:C.sub,fontSize:T.xs,fontWeight:'700',marginBottom:6,textTransform:'uppercase',letterSpacing:1}}>STATUS</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap'}}>
            {['active','pipeline','completed'].map(s=>(
              <View key={s} style={{marginRight:8,marginBottom:8}}>
                <Chip label={s.toUpperCase()} active={form.status===s}
                  color={s==='active'?C.teal:s==='pipeline'?C.gold:C.green}
                  onPress={()=>setForm(f=>({...f,status:s}))} />
              </View>
            ))}
          </View>
        </View>
        <FInput label="Description" value={form.desc} onChangeText={v=>setForm(f=>({...f,desc:v}))} placeholder="Brief project description" multi lines={3} />
        <Btn label={edit?'Save Changes':'Create Project'} onPress={save} style={{marginTop:8}} />
      </Sheet>
    </View>
  );
}

/* ── CREW SCREEN ─────────────────────────────────────────── */
function CrewScreen({store}) {
  const {crew,addCrew,updateCrew,deleteCrew} = store;
  const [filter,setFilter] = useState('All');
  const [search,setSearch] = useState('');
  const [sheet,setSheet] = useState(false);
  const [edit,setEdit] = useState(null);
  const [form,setForm] = useState({name:'',role:'',rate:'',rateType:'day',status:'available',email:'',phone:'',skills:''});
  const [errors,setErrors] = useState({});

  const filters = ['All','Available','Busy','Unavailable'];

  const filtered = crew.filter(c=>{
    const matchFilter = filter==='All'||c.status===filter.toLowerCase();
    const matchSearch = !search||c.name.toLowerCase().includes(search.toLowerCase())||c.role.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const availCount = crew.filter(c=>c.status==='available').length;
  const busyCount = crew.filter(c=>c.status==='busy').length;

  const openAdd = () => { setEdit(null); setForm({name:'',role:'',rate:'',rateType:'day',status:'available',email:'',phone:'',skills:''}); setErrors({}); setSheet(true); };
  const openEdit = c => { setEdit(c); setForm({name:c.name,role:c.role,rate:String(c.rate),rateType:c.rateType,status:c.status,email:c.email,phone:c.phone,skills:(c.skills||[]).join(', ')}); setErrors({}); setSheet(true); };

  const validate = () => {
    const e={};
    if(!form.name.trim()) e.name='Name is required';
    if(!form.role.trim()) e.role='Role is required';
    if(!form.rate||isNaN(Number(form.rate))) e.rate='Enter a valid rate';
    if(!form.email.includes('@')) e.email='Enter a valid email';
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const save = () => {
    if(!validate()) return;
    const data = {...form,rate:Number(form.rate),skills:form.skills.split(',').map(s=>s.trim()).filter(Boolean),rating:edit?edit.rating:5,jobs:edit?edit.jobs:0};
    if(edit) updateCrew({...edit,...data});
    else addCrew(data);
    setSheet(false);
  };

  const confirmDelete = c => Alert.alert('Remove Crew','Remove '+c.name+' from your roster?',[
    {text:'Cancel',style:'cancel'},
    {text:'Remove',style:'destructive',onPress:()=>deleteCrew(c.id)},
  ]);

  const statusColor = s => s==='available'?C.green:s==='busy'?C.gold:C.red;

  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <SafeAreaView style={{flex:1}}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingTop:16,paddingBottom:8}}>
          <Text style={{color:C.text,fontSize:T.xl,fontWeight:'800'}}>Crew</Text>
          <Btn label="+ Add" onPress={openAdd} size='sm' />
        </View>

        <View style={{flexDirection:'row',paddingHorizontal:16,marginBottom:8}}>
          <View style={{flex:1,backgroundColor:C.card2,borderRadius:R.md,padding:10,marginRight:6,alignItems:'center',borderWidth:1,borderColor:C.border}}>
            <Text style={{color:C.text,fontSize:T.md,fontWeight:'800'}}>{crew.length}</Text>
            <Text style={{color:C.sub,fontSize:T.xs}}>Total Roster</Text>
          </View>
          <View style={{flex:1,backgroundColor:C.card2,borderRadius:R.md,padding:10,marginRight:6,alignItems:'center',borderWidth:1,borderColor:C.border}}>
            <Text style={{color:C.green,fontSize:T.md,fontWeight:'800'}}>{availCount}</Text>
            <Text style={{color:C.sub,fontSize:T.xs}}>Available</Text>
          </View>
          <View style={{flex:1,backgroundColor:C.card2,borderRadius:R.md,padding:10,alignItems:'center',borderWidth:1,borderColor:C.border}}>
            <Text style={{color:C.gold,fontSize:T.md,fontWeight:'800'}}>{busyCount}</Text>
            <Text style={{color:C.sub,fontSize:T.xs}}>On Job</Text>
          </View>
        </View>

        <View style={{flexDirection:'row',alignItems:'center',marginHorizontal:16,marginBottom:4,backgroundColor:C.surf,borderRadius:R.pill,paddingHorizontal:14,borderWidth:1,borderColor:C.border}}>
          <TextInput value={search} onChangeText={setSearch} placeholder="Search by name or role..."
            placeholderTextColor={C.dimmer}
            style={{flex:1,color:C.text,fontSize:T.base,paddingVertical:10}} />
          {search.length>0 && (
            <TouchableOpacity onPress={()=>setSearch('')} style={{width:22,height:22,borderRadius:11,backgroundColor:C.dimmer,alignItems:'center',justifyContent:'center'}}>
              <Text style={{color:C.bg,fontSize:12,fontWeight:'700'}}>x</Text>
            </TouchableOpacity>
          )}
        </View>

        <FilterPills options={filters} selected={filter} onSelect={setFilter} />

        <FlatList data={filtered} keyExtractor={c=>c.id} contentContainerStyle={{paddingHorizontal:16,paddingBottom:24}}
          ListEmptyComponent={<Empty icon="P" label="No crew found" sub="Try adjusting your search or filters" />}
          renderItem={({item:c})=>(
            <Card style={{marginBottom:10}}>
              <View style={{flexDirection:'row',alignItems:'flex-start',marginBottom:8}}>
                <Avi name={c.name} size={44} color={statusColor(c.status)} />
                <View style={{flex:1,marginLeft:12}}>
                  <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                    <Text style={{color:C.text,fontSize:T.base,fontWeight:'700',flex:1}}>{c.name}</Text>
                    <Chip label={c.status.toUpperCase()} color={statusColor(c.status)} active onPress={()=>{}} />
                  </View>
                  <Text style={{color:C.sub,fontSize:T.sm,marginTop:2}}>{c.role}</Text>
                  <Stars rating={c.rating} />
                </View>
              </View>
              <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:8}}>
                <Text style={{color:C.sub,fontSize:T.xs}}>{'$'+c.rate+'/'+c.rateType}</Text>
                <Text style={{color:C.sub,fontSize:T.xs}}>{c.jobs} jobs completed</Text>
              </View>
              {c.skills&&c.skills.length>0 && (
                <View style={{flexDirection:'row',flexWrap:'wrap',marginBottom:8}}>
                  {c.skills.slice(0,3).map(sk=>(
                    <View key={sk} style={{backgroundColor:C.pill,borderRadius:R.pill,paddingHorizontal:8,paddingVertical:3,marginRight:6,marginBottom:4,borderWidth:1,borderColor:C.border2}}>
                      <Text style={{color:C.sub,fontSize:T.xs}}>{sk}</Text>
                    </View>
                  ))}
                </View>
              )}
              <Divider />
              <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                <TouchableOpacity onPress={()=>openEdit(c)} style={{paddingHorizontal:12,paddingVertical:6,marginRight:8}}>
                  <Text style={{color:C.teal,fontSize:T.sm,fontWeight:'600'}}>Edit</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>confirmDelete(c)} style={{paddingHorizontal:12,paddingVertical:6}}>
                  <Text style={{color:C.red,fontSize:T.sm,fontWeight:'600'}}>Remove</Text>
                </TouchableOpacity>
              </View>
            </Card>
          )}
        />
      </SafeAreaView>
      <Sheet visible={sheet} onClose={()=>setSheet(false)} title={edit?'Edit Crew Member':'Add Crew Member'}>
        <FInput label="Full Name" value={form.name} onChangeText={v=>setForm(f=>({...f,name:v}))} placeholder="e.g. Alex Rivera" error={errors.name} />
        <FInput label="Role" value={form.role} onChangeText={v=>setForm(f=>({...f,role:v}))} placeholder="e.g. Director of Photography" error={errors.role} />
        <FInput label="Day Rate" value={form.rate} onChangeText={v=>setForm(f=>({...f,rate:v}))} placeholder="e.g. 750" kbType="numeric" error={errors.rate} />
        <FInput label="Email" value={form.email} onChangeText={v=>setForm(f=>({...f,email:v}))} placeholder="email@example.com" kbType="email-address" error={errors.email} />
        <FInput label="Phone" value={form.phone} onChangeText={v=>setForm(f=>({...f,phone:v}))} placeholder="+1 555 000 0000" kbType="phone-pad" />
        <FInput label="Skills (comma separated)" value={form.skills} onChangeText={v=>setForm(f=>({...f,skills:v}))} placeholder="e.g. Arri Alexa, DJI Ronin, Lighting" />
        <View style={{marginBottom:14}}>
          <Text style={{color:C.sub,fontSize:T.xs,fontWeight:'700',marginBottom:6,textTransform:'uppercase',letterSpacing:1}}>AVAILABILITY</Text>
          <View style={{flexDirection:'row'}}>
            {['available','busy','unavailable'].map(s=>(
              <View key={s} style={{marginRight:8}}>
                <Chip label={s} active={form.status===s}
                  color={s==='available'?C.green:s==='busy'?C.gold:C.red}
                  onPress={()=>setForm(f=>({...f,status:s}))} />
              </View>
            ))}
          </View>
        </View>
        <Btn label={edit?'Save Changes':'Add to Roster'} onPress={save} style={{marginTop:8}} />
      </Sheet>
    </View>
  );
}
/* ── SCHEDULE SCREEN ────────────────────────────────────── */
function ScheduleScreen({store}) {
  const {events,addEvent,updateEvent,deleteEvent} = store;
  const [filter,setFilter] = useState('All');
  const [sheet,setSheet] = useState(false);
  const [edit,setEdit] = useState(null);
  const [form,setForm] = useState({title:'',project:'',date:'',start:'',end:'',location:'',type:'shoot',status:'upcoming'});

  const filters = ['All','Today','Upcoming','Completed'];
  const today = events.filter(e=>e.status==='today');
  const upcoming = events.filter(e=>e.status==='upcoming');

  const filtered = filter==='All'?events:events.filter(e=>{
    if(filter==='Today') return e.status==='today';
    if(filter==='Upcoming') return e.status==='upcoming';
    if(filter==='Completed') return e.status==='completed';
    return true;
  });

  const openAdd = () => { setEdit(null); setForm({title:'',project:'',date:'',start:'06:00',end:'18:00',location:'',type:'shoot',status:'upcoming'}); setSheet(true); };
  const openEdit = e => { setEdit(e); setForm({title:e.title,project:e.project,date:e.date,start:e.start,end:e.end,location:e.location,type:e.type,status:e.status}); setSheet(true); };

  const save = () => {
    if(!form.title.trim()) return;
    const data = {...form,crew:edit?edit.crew:[]};
    if(edit) updateEvent({...edit,...data});
    else addEvent(data);
    setSheet(false);
  };

  const confirmDelete = e => Alert.alert('Delete Event','Remove this event from your schedule?',[
    {text:'Cancel',style:'cancel'},
    {text:'Delete',style:'destructive',onPress:()=>deleteEvent(e.id)},
  ]);

  const typeColor = t => t==='shoot'?C.teal:t==='meeting'?C.blue:t==='prep'?C.purple:C.gold;
  const statusStyle = s => s==='today'?{borderColor:C.teal+'88',backgroundColor:C.teal+'0a'}:s==='completed'?{opacity:0.65}:{};

  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <SafeAreaView style={{flex:1}}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:16,paddingTop:16,paddingBottom:8}}>
          <Text style={{color:C.text,fontSize:T.xl,fontWeight:'800'}}>Schedule</Text>
          <Btn label="+ Event" onPress={openAdd} size='sm' />
        </View>

        <View style={{flexDirection:'row',paddingHorizontal:16,marginBottom:8}}>
          <View style={{flex:1,backgroundColor:C.card2,borderRadius:R.md,padding:10,marginRight:6,alignItems:'center',borderWidth:1,borderColor:C.teal+'44'}}>
            <Text style={{color:C.teal,fontSize:T.md,fontWeight:'800'}}>{today.length}</Text>
            <Text style={{color:C.sub,fontSize:T.xs}}>Today</Text>
          </View>
          <View style={{flex:1,backgroundColor:C.card2,borderRadius:R.md,padding:10,marginRight:6,alignItems:'center',borderWidth:1,borderColor:C.border}}>
            <Text style={{color:C.gold,fontSize:T.md,fontWeight:'800'}}>{upcoming.length}</Text>
            <Text style={{color:C.sub,fontSize:T.xs}}>Upcoming</Text>
          </View>
          <View style={{flex:1,backgroundColor:C.card2,borderRadius:R.md,padding:10,alignItems:'center',borderWidth:1,borderColor:C.border}}>
            <Text style={{color:C.green,fontSize:T.md,fontWeight:'800'}}>{events.filter(e=>e.status==='completed').length}</Text>
            <Text style={{color:C.sub,fontSize:T.xs}}>Done</Text>
          </View>
        </View>

        <FilterPills options={filters} selected={filter} onSelect={setFilter} />

        <FlatList data={filtered} keyExtractor={e=>e.id} contentContainerStyle={{paddingHorizontal:16,paddingBottom:24}}
          ListEmptyComponent={<Empty icon="C" label="No events" sub="Tap + Event to add to your schedule" action="Add Event" onAction={openAdd} />}
          renderItem={({item:ev})=>(
            <Card style={[{marginBottom:10,flexDirection:'row',alignItems:'center'},statusStyle(ev.status)]}>
              <View style={{width:4,alignSelf:'stretch',borderRadius:2,backgroundColor:typeColor(ev.type),marginRight:12}} />
              <View style={{flex:1}}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:4}}>
                  <Text style={{color:C.text,fontSize:T.sm,fontWeight:'700',flex:1}}>{ev.title}</Text>
                  {ev.status==='today' && (
                    <View style={{backgroundColor:C.teal,borderRadius:R.pill,paddingHorizontal:8,paddingVertical:2}}>
                      <Text style={{color:C.bg,fontSize:T.xs,fontWeight:'700'}}>TODAY</Text>
                    </View>
                  )}
                </View>
                <Text style={{color:C.sub,fontSize:T.xs}}>{ev.date}  |  {ev.start} - {ev.end}</Text>
                <Text style={{color:C.dimmer,fontSize:T.xs,marginTop:2}}>{ev.location}</Text>
                <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:8}}>
                  <TouchableOpacity onPress={()=>openEdit(ev)} style={{paddingHorizontal:10,paddingVertical:4,marginRight:6}}>
                    <Text style={{color:C.teal,fontSize:T.xs,fontWeight:'600'}}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>confirmDelete(ev)} style={{paddingHorizontal:10,paddingVertical:4}}>
                    <Text style={{color:C.red,fontSize:T.xs,fontWeight:'600'}}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Card>
          )}
        />
      </SafeAreaView>
      <Sheet visible={sheet} onClose={()=>setSheet(false)} title={edit?'Edit Event':'New Event'}>
        <FInput label="Event Title" value={form.title} onChangeText={v=>setForm(f=>({...f,title:v}))} placeholder="e.g. INT. Kitchen Scene" />
        <FInput label="Project" value={form.project} onChangeText={v=>setForm(f=>({...f,project:v}))} placeholder="e.g. Horizon Feature Film" />
        <FInput label="Date" value={form.date} onChangeText={v=>setForm(f=>({...f,date:v}))} placeholder="YYYY-MM-DD" />
        <View style={{flexDirection:'row'}}>
          <View style={{flex:1,marginRight:8}}>
            <FInput label="Start" value={form.start} onChangeText={v=>setForm(f=>({...f,start:v}))} placeholder="06:00" />
          </View>
          <View style={{flex:1}}>
            <FInput label="End" value={form.end} onChangeText={v=>setForm(f=>({...f,end:v}))} placeholder="18:00" />
          </View>
        </View>
        <FInput label="Location" value={form.location} onChangeText={v=>setForm(f=>({...f,location:v}))} placeholder="e.g. Stage 4, Sunset Studios" />
        <View style={{marginBottom:14}}>
          <Text style={{color:C.sub,fontSize:T.xs,fontWeight:'700',marginBottom:6,textTransform:'uppercase',letterSpacing:1}}>TYPE</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap'}}>
            {['shoot','meeting','prep','travel'].map(t=>(
              <View key={t} style={{marginRight:8,marginBottom:6}}>
                <Chip label={t.toUpperCase()} active={form.type===t} color={typeColor(t)} onPress={()=>setForm(f=>({...f,type:t}))} />
              </View>
            ))}
          </View>
        </View>
        <Btn label={edit?'Save Changes':'Add to Schedule'} onPress={save} style={{marginTop:8}} />
      </Sheet>
    </View>
  );
}

/* ── MESSAGES SCREEN ─────────────────────────────────────── */
function MessagesScreen({store,onBack}) {
  const {messages,chats,sendMessage,addThread} = store;
  const [active,setActive] = useState(null);
  const [draft,setDraft] = useState('');
  const [newSheet,setNewSheet] = useState(false);
  const [newForm,setNewForm] = useState({thread:'',members:''});
  const scrollRef = useRef(null);

  useEffect(()=>{
    if(active && scrollRef.current) {
      setTimeout(()=>scrollRef.current?.scrollToEnd({animated:true}),100);
    }
  },[active,chats]);

  const send = () => {
    if(!draft.trim()||!active) return;
    sendMessage(active,draft.trim());
    setDraft('');
  };

  const createThread = () => {
    if(!newForm.thread.trim()) return;
    addThread({thread:newForm.thread,last:'',time:'now',members:newForm.members.split(',').map(s=>s.trim()).filter(Boolean),unread:0,online:false});
    setNewSheet(false);
    setNewForm({thread:'',members:''});
  };

  if(active) {
    const thread = messages.find(m=>m.id===active);
    const msgs = chats[active]||[];
    return (
      <View style={{flex:1,backgroundColor:C.bg}}>
        <SafeAreaView style={{flex:1}}>
          <ScreenHeader title={thread?thread.thread:'Chat'} onBack={()=>setActive(null)} />
          <ScrollView ref={scrollRef} style={{flex:1}} contentContainerStyle={{padding:16}}>
            {msgs.map(msg=>(
              <View key={msg.id} style={{flexDirection:msg.mine?'row-reverse':'row',marginBottom:12,alignItems:'flex-end'}}>
                {!msg.mine && <Avi name={msg.sender} size={30} color={C.blue} />}
                <View style={{maxWidth:'72%',marginHorizontal:8}}>
                  {!msg.mine && <Text style={{color:C.sub,fontSize:T.xs,marginBottom:4,fontWeight:'600'}}>{msg.sender}</Text>}
                  <View style={{backgroundColor:msg.mine?C.teal:C.card2,borderRadius:R.lg,
                    borderBottomRightRadius:msg.mine?4:R.lg,borderBottomLeftRadius:msg.mine?R.lg:4,
                    padding:12}}>
                    <Text style={{color:msg.mine?C.bg:C.text,fontSize:T.sm,lineHeight:20}}>{msg.text}</Text>
                  </View>
                  <Text style={{color:C.dimmer,fontSize:T.xs,marginTop:4,textAlign:msg.mine?'right':'left'}}>{msg.time}</Text>
                </View>
              </View>
            ))}
            {msgs.length===0 && <Empty icon="B" label="No messages yet" sub="Send the first message to start the conversation" />}
          </ScrollView>
          <View style={{flexDirection:'row',alignItems:'center',padding:12,borderTopWidth:1,borderTopColor:C.border}}>
            <TextInput value={draft} onChangeText={setDraft} placeholder="Type a message..."
              placeholderTextColor={C.dimmer}
              style={{flex:1,backgroundColor:C.surf,borderRadius:R.pill,paddingHorizontal:16,paddingVertical:10,
                color:C.text,fontSize:T.sm,marginRight:10,borderWidth:1,borderColor:C.border}} />
            <PBtn onPress={send} disabled={!draft.trim()}
              style={{width:40,height:40,borderRadius:20,backgroundColor:draft.trim()?C.teal:C.pill,
                alignItems:'center',justifyContent:'center'}}>
              <Text style={{color:draft.trim()?C.bg:C.dimmer,fontSize:T.base,fontWeight:'700'}}>{'>'}</Text>
            </PBtn>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <SafeAreaView style={{flex:1}}>
        <ScreenHeader title="Messages" onBack={onBack}
          right={<TouchableOpacity onPress={()=>setNewSheet(true)}><Text style={{color:C.teal,fontSize:T.sm,fontWeight:'600'}}>+ New</Text></TouchableOpacity>} />
        <FlatList data={messages} keyExtractor={m=>m.id} contentContainerStyle={{padding:16}}
          ListEmptyComponent={<Empty icon="B" label="No messages" sub="Start a new thread with your team" action="New Thread" onAction={()=>setNewSheet(true)} />}
          renderItem={({item:m})=>(
            <PBtn onPress={()=>setActive(m.id)}>
              <View style={{flexDirection:'row',alignItems:'center',backgroundColor:C.card,borderRadius:R.lg,padding:14,marginBottom:10,borderWidth:1,borderColor:m.unread>0?C.teal+'44':C.border}}>
                <Avi name={m.thread} size={44} color={m.online?C.teal:C.sub} online={m.online} />
                <View style={{flex:1,marginLeft:12}}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:4}}>
                    <Text style={{color:C.text,fontSize:T.sm,fontWeight:'700',flex:1}}>{m.thread}</Text>
                    <Text style={{color:C.dimmer,fontSize:T.xs}}>{m.time}</Text>
                  </View>
                  <Text style={{color:C.sub,fontSize:T.xs,lineHeight:16}} numberOfLines={1}>{m.last}</Text>
                </View>
                {m.unread>0 && <View style={{marginLeft:8}}><Badge count={m.unread} color={C.teal} /></View>}
              </View>
            </PBtn>
          )}
        />
      </SafeAreaView>
      <Sheet visible={newSheet} onClose={()=>setNewSheet(false)} title="New Thread">
        <FInput label="Thread Name" value={newForm.thread} onChangeText={v=>setNewForm(f=>({...f,thread:v}))} placeholder="e.g. Horizon - Production" />
        <FInput label="Members (comma separated)" value={newForm.members} onChangeText={v=>setNewForm(f=>({...f,members:v}))} placeholder="e.g. Alex R, Sam C, Jordan B" />
        <Btn label="Create Thread" onPress={createThread} style={{marginTop:8}} />
      </Sheet>
    </View>
  );
}
/* ── INVOICES SCREEN ────────────────────────────────────── */
function InvoicesScreen({store,onBack}) {
  const {invoices,addInvoice,updateInvoice,deleteInvoice} = store;
  const [filter,setFilter] = useState('All');
  const [sheet,setSheet] = useState(false);
  const [edit,setEdit] = useState(null);
  const [detailSheet,setDetailSheet] = useState(false);
  const [detail,setDetail] = useState(null);
  const [uploading,setUploading] = useState(false);
  const [form,setForm] = useState({project:'',client:'',amount:'',status:'draft',date:'',due:''});

  const filters = ['All','Draft','Pending','Paid','Overdue'];
  const fmt = n => n>=1000?'$'+(n/1000).toFixed(0)+'k':'$'+n;

  const filtered = filter==='All'?invoices:invoices.filter(iv=>iv.status===filter.toLowerCase());

  const totalPaid = invoices.filter(iv=>iv.status==='paid').reduce((s,iv)=>s+iv.amount,0);
  const totalPending = invoices.filter(iv=>iv.status==='pending').reduce((s,iv)=>s+iv.amount,0);
  const totalOverdue = invoices.filter(iv=>iv.status==='overdue').reduce((s,iv)=>s+iv.amount,0);

  const openAdd = () => { setEdit(null); setForm({project:'',client:'',amount:'',status:'draft',date:'2026-03-08',due:'2026-03-22'}); setSheet(true); };
  const openEdit = iv => { setEdit(iv); setForm({project:iv.project,client:iv.client,amount:String(iv.amount),status:iv.status,date:iv.date,due:iv.due}); setSheet(true); };
  const openDetail = iv => { setDetail(iv); setDetailSheet(true); };

  const save = () => {
    if(!form.project.trim()||!form.amount) return;
    const data = {...form,amount:Number(form.amount),items:edit?edit.items:[{desc:form.project,qty:1,rate:Number(form.amount)}],attachments:edit?edit.attachments:[]};
    if(edit) updateInvoice({...edit,...data});
    else addInvoice(data);
    setSheet(false);
  };

  const handleSend = iv => {
    updateInvoice({...iv,status:'pending'});
    Alert.alert('Invoice Sent','Invoice sent to '+iv.client+' successfully');
  };

  const handleMarkPaid = iv => {
    Alert.alert('Mark as Paid','Mark this invoice as paid?',[
      {text:'Cancel',style:'cancel'},
      {text:'Mark Paid',onPress:()=>updateInvoice({...iv,status:'paid'})},
    ]);
  };

  const handleAttach = iv => {
    setUploading(true);
    const fake = FAKE_ATTACHMENTS[Math.floor(Math.random()*FAKE_ATTACHMENTS.length)];
    setTimeout(()=>{
      updateInvoice({...iv,attachments:[...(iv.attachments||[]),fake]});
      setUploading(false);
      if(detail&&detail.id===iv.id) setDetail({...iv,attachments:[...(iv.attachments||[]),fake]});
      Alert.alert('Attached','File attached successfully');
    },1200);
  };

  const confirmDelete = iv => Alert.alert('Delete Invoice','Delete this invoice? This cannot be undone.',[
    {text:'Cancel',style:'cancel'},
    {text:'Delete',style:'destructive',onPress:()=>deleteInvoice(iv.id)},
  ]);

  const statusColor = s => s==='paid'?C.green:s==='pending'?C.gold:s==='overdue'?C.red:C.sub;

  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <SafeAreaView style={{flex:1}}>
        <ScreenHeader title="Invoices" onBack={onBack}
          right={<TouchableOpacity onPress={openAdd}><Text style={{color:C.teal,fontSize:T.sm,fontWeight:'600'}}>+ New</Text></TouchableOpacity>} />

        <View style={{flexDirection:'row',paddingHorizontal:16,marginVertical:10}}>
          <PBtn onPress={()=>setFilter('Paid')} style={{flex:1,backgroundColor:C.card2,borderRadius:R.md,padding:10,marginRight:6,alignItems:'center',borderWidth:1,borderColor:filter==='Paid'?C.green+'66':C.border}}>
            <Text style={{color:C.green,fontSize:T.sm,fontWeight:'800'}}>{fmt(totalPaid)}</Text>
            <Text style={{color:C.sub,fontSize:T.xs}}>Collected</Text>
          </PBtn>
          <PBtn onPress={()=>setFilter('Pending')} style={{flex:1,backgroundColor:C.card2,borderRadius:R.md,padding:10,marginRight:6,alignItems:'center',borderWidth:1,borderColor:filter==='Pending'?C.gold+'66':C.border}}>
            <Text style={{color:C.gold,fontSize:T.sm,fontWeight:'800'}}>{fmt(totalPending)}</Text>
            <Text style={{color:C.sub,fontSize:T.xs}}>Pending</Text>
          </PBtn>
          <PBtn onPress={()=>setFilter('Overdue')} style={{flex:1,backgroundColor:C.card2,borderRadius:R.md,padding:10,alignItems:'center',borderWidth:1,borderColor:filter==='Overdue'?C.red+'66':C.border}}>
            <Text style={{color:C.red,fontSize:T.sm,fontWeight:'800'}}>{fmt(totalOverdue)}</Text>
            <Text style={{color:C.sub,fontSize:T.xs}}>Overdue</Text>
          </PBtn>
        </View>

        <FilterPills options={filters} selected={filter} onSelect={setFilter} color={C.gold} />

        <FlatList data={filtered} keyExtractor={iv=>iv.id} contentContainerStyle={{paddingHorizontal:16,paddingBottom:24}}
          ListEmptyComponent={<Empty icon="R" label="No invoices" sub="Create your first invoice to get started" action="New Invoice" onAction={openAdd} />}
          renderItem={({item:iv})=>(
            <PBtn onPress={()=>openDetail(iv)}>
              <View style={{backgroundColor:C.card,borderRadius:R.lg,padding:14,marginBottom:10,borderWidth:1,
                borderColor:iv.status==='overdue'?C.red+'44':iv.status==='paid'?C.green+'22':C.border}}>
                <View style={{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginBottom:8}}>
                  <View style={{flex:1,marginRight:8}}>
                    <Text style={{color:C.text,fontSize:T.sm,fontWeight:'700'}}>{iv.project}</Text>
                    <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>{iv.client}  |  Due: {iv.due}</Text>
                  </View>
                  <View style={{alignItems:'flex-end'}}>
                    <Text style={{color:C.text,fontSize:T.base,fontWeight:'800'}}>{'$'+iv.amount.toLocaleString()}</Text>
                    <Chip label={iv.status.toUpperCase()} color={statusColor(iv.status)} active onPress={()=>{}} />
                  </View>
                </View>
                {iv.attachments&&iv.attachments.length>0 && (
                  <Text style={{color:C.sub,fontSize:T.xs,marginBottom:8}}>{iv.attachments.length} attachment{iv.attachments.length>1?'s':''}</Text>
                )}
                <View style={{flexDirection:'row',justifyContent:'flex-end'}}>
                  {iv.status==='draft' && (
                    <TouchableOpacity onPress={()=>handleSend(iv)} style={{paddingHorizontal:12,paddingVertical:5,backgroundColor:C.teal+'22',borderRadius:R.pill,marginRight:8,borderWidth:1,borderColor:C.teal+'44'}}>
                      <Text style={{color:C.teal,fontSize:T.xs,fontWeight:'700'}}>Send</Text>
                    </TouchableOpacity>
                  )}
                  {iv.status==='pending' && (
                    <TouchableOpacity onPress={()=>handleMarkPaid(iv)} style={{paddingHorizontal:12,paddingVertical:5,backgroundColor:C.green+'22',borderRadius:R.pill,marginRight:8,borderWidth:1,borderColor:C.green+'44'}}>
                      <Text style={{color:C.green,fontSize:T.xs,fontWeight:'700'}}>Mark Paid</Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={()=>openEdit(iv)} style={{paddingHorizontal:10,paddingVertical:5,marginRight:6}}>
                    <Text style={{color:C.teal,fontSize:T.xs,fontWeight:'600'}}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=>confirmDelete(iv)} style={{paddingHorizontal:10,paddingVertical:5}}>
                    <Text style={{color:C.red,fontSize:T.xs,fontWeight:'600'}}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </PBtn>
          )}
        />
      </SafeAreaView>

      <Sheet visible={sheet} onClose={()=>setSheet(false)} title={edit?'Edit Invoice':'New Invoice'}>
        <FInput label="Project" value={form.project} onChangeText={v=>setForm(f=>({...f,project:v}))} placeholder="e.g. Horizon Feature Film" />
        <FInput label="Client" value={form.client} onChangeText={v=>setForm(f=>({...f,client:v}))} placeholder="e.g. Apex Studios" />
        <FInput label="Amount" value={form.amount} onChangeText={v=>setForm(f=>({...f,amount:v}))} placeholder="e.g. 25000" kbType="numeric" />
        <FInput label="Invoice Date" value={form.date} onChangeText={v=>setForm(f=>({...f,date:v}))} placeholder="YYYY-MM-DD" />
        <FInput label="Due Date" value={form.due} onChangeText={v=>setForm(f=>({...f,due:v}))} placeholder="YYYY-MM-DD" />
        <View style={{marginBottom:14}}>
          <Text style={{color:C.sub,fontSize:T.xs,fontWeight:'700',marginBottom:6,textTransform:'uppercase',letterSpacing:1}}>STATUS</Text>
          <View style={{flexDirection:'row',flexWrap:'wrap'}}>
            {['draft','pending','paid','overdue'].map(s=>(
              <View key={s} style={{marginRight:8,marginBottom:8}}>
                <Chip label={s.toUpperCase()} active={form.status===s} color={statusColor(s)} onPress={()=>setForm(f=>({...f,status:s}))} />
              </View>
            ))}
          </View>
        </View>
        <Btn label={edit?'Save Changes':'Create Invoice'} onPress={save} style={{marginTop:8}} />
      </Sheet>

      <Sheet visible={detailSheet} onClose={()=>setDetailSheet(false)} title="Invoice Detail">
        {detail && (
          <View>
            <View style={{backgroundColor:C.card2,borderRadius:R.md,padding:16,marginBottom:16}}>
              <Text style={{color:C.text,fontSize:T.md,fontWeight:'700',marginBottom:4}}>{detail.project}</Text>
              <Text style={{color:C.sub,fontSize:T.sm,marginBottom:12}}>{detail.client}</Text>
              <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:4}}>
                <Text style={{color:C.sub,fontSize:T.sm}}>Amount</Text>
                <Text style={{color:C.text,fontSize:T.base,fontWeight:'800'}}>{'$'+detail.amount.toLocaleString()}</Text>
              </View>
              <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:4}}>
                <Text style={{color:C.sub,fontSize:T.sm}}>Status</Text>
                <Chip label={detail.status.toUpperCase()} color={statusColor(detail.status)} active onPress={()=>{}} />
              </View>
              <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                <Text style={{color:C.sub,fontSize:T.sm}}>Due</Text>
                <Text style={{color:C.text,fontSize:T.sm}}>{detail.due}</Text>
              </View>
            </View>
            <SecHead label="Attachments" />
            {(detail.attachments||[]).map((a,i)=>(
              <View key={i} style={{flexDirection:'row',alignItems:'center',backgroundColor:C.pill,borderRadius:R.md,padding:12,marginBottom:8,borderWidth:1,borderColor:C.border}}>
                <Text style={{color:C.teal,fontSize:T.sm,flex:1}}>{a}</Text>
                <Text style={{color:C.sub,fontSize:T.xs}}>PDF</Text>
              </View>
            ))}
            <Btn label={uploading?'Attaching...':'Attach File'} onPress={()=>handleAttach(detail)}
              color={C.blue} outline disabled={uploading} style={{marginTop:8}} />
          </View>
        )}
      </Sheet>
    </View>
  );
}
/* ── REPORTS SCREEN ─────────────────────────────────────── */
function ReportsScreen({store,onBack,isBiz=true}) {
  const {invoices,projects,crew} = store;
  const paid = invoices.filter(iv=>iv.status==='paid');
  const totalRevenue = paid.reduce((s,iv)=>s+iv.amount,0);
  const totalPending = invoices.filter(iv=>iv.status==='pending'||iv.status==='overdue').reduce((s,iv)=>s+iv.amount,0);
  const collectionRate = invoices.length>0?Math.round((paid.length/invoices.length)*100):0;
  const activeProj = projects.filter(p=>p.status==='active');
  const totalBudget = activeProj.reduce((s,p)=>s+p.budget,0);
  const totalSpent = activeProj.reduce((s,p)=>s+p.spent,0);
  const fmt = n => n>=1000?'$'+(n/1000).toFixed(0)+'k':'$'+n;

  const statusBreakdown = [
    {label:'Paid',count:invoices.filter(iv=>iv.status==='paid').length,amount:paid.reduce((s,iv)=>s+iv.amount,0),color:C.green},
    {label:'Pending',count:invoices.filter(iv=>iv.status==='pending').length,amount:invoices.filter(iv=>iv.status==='pending').reduce((s,iv)=>s+iv.amount,0),color:C.gold},
    {label:'Overdue',count:invoices.filter(iv=>iv.status==='overdue').length,amount:invoices.filter(iv=>iv.status==='overdue').reduce((s,iv)=>s+iv.amount,0),color:C.red},
    {label:'Draft',count:invoices.filter(iv=>iv.status==='draft').length,amount:invoices.filter(iv=>iv.status==='draft').reduce((s,iv)=>s+iv.amount,0),color:C.sub},
  ];
  const maxAmount = Math.max(...statusBreakdown.map(s=>s.amount),1);

  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <SafeAreaView style={{flex:1}}>
        <ScreenHeader title="Reports" onBack={onBack} />
        <ScrollView contentContainerStyle={{padding:16}}>

          <View style={{flexDirection:'row',marginBottom:8}}>
            <KPI label="Total Revenue" value={fmt(totalRevenue)} color={C.teal} />
            <View style={{width:10}} />
            <KPI label="Outstanding" value={fmt(totalPending)} color={C.gold} />
          </View>
          <View style={{flexDirection:'row',marginBottom:20}}>
            <KPI label="Collection Rate" value={collectionRate+'%'} color={C.green} />
            <View style={{width:10}} />
            <KPI label="Invoices Sent" value={invoices.filter(iv=>iv.status!=='draft').length} color={C.blue} />
          </View>

          <Card style={{marginBottom:16}}>
            <SecHead label="Invoice Breakdown" />
            {statusBreakdown.map(s=>(
              <View key={s.label} style={{marginBottom:12}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
                  <View style={{flexDirection:'row',alignItems:'center'}}>
                    <View style={{width:8,height:8,borderRadius:4,backgroundColor:s.color,marginRight:8}} />
                    <Text style={{color:C.text,fontSize:T.sm,fontWeight:'600'}}>{s.label}</Text>
                  </View>
                  <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={{color:C.sub,fontSize:T.xs,marginRight:8}}>{s.count} invoice{s.count!==1?'s':''}</Text>
                    <Text style={{color:s.color,fontSize:T.sm,fontWeight:'700'}}>{fmt(s.amount)}</Text>
                  </View>
                </View>
                <Bar pct={maxAmount>0?Math.round((s.amount/maxAmount)*100):0} color={s.color} height={8} />
              </View>
            ))}
          </Card>

          {isBiz && (
            <Card style={{marginBottom:16}}>
              <SecHead label="Budget Overview" />
              {activeProj.map(p=>{
                const pct = p.budget>0?Math.round((p.spent/p.budget)*100):0;
                return (
                  <View key={p.id} style={{marginBottom:12}}>
                    <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:5}}>
                      <Text style={{color:C.text,fontSize:T.sm,fontWeight:'600',flex:1}}>{p.name}</Text>
                      <Text style={{color:C.sub,fontSize:T.xs}}>{pct}%</Text>
                    </View>
                    <Bar pct={pct} color={pct>85?C.red:pct>60?C.gold:C.teal} height={8} />
                    <Text style={{color:C.dimmer,fontSize:T.xs,marginTop:4}}>{fmt(p.spent)} of {fmt(p.budget)}</Text>
                  </View>
                );
              })}
            </Card>
          )}

          {isBiz && (
            <Card style={{marginBottom:16}}>
              <SecHead label="Crew Stats" />
              <View style={{flexDirection:'row',justifyContent:'space-around'}}>
                {[
                  {label:'Available',count:crew.filter(c=>c.status==='available').length,color:C.green},
                  {label:'On Job',count:crew.filter(c=>c.status==='busy').length,color:C.gold},
                  {label:'Unavail.',count:crew.filter(c=>c.status==='unavailable').length,color:C.red},
                ].map(s=>(
                  <View key={s.label} style={{alignItems:'center'}}>
                    <Text style={{color:s.color,fontSize:T.xl,fontWeight:'800'}}>{s.count}</Text>
                    <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>{s.label}</Text>
                  </View>
                ))}
              </View>
            </Card>
          )}

          <Text style={{color:C.dimmer,fontSize:T.xs,textAlign:'center',marginBottom:24}}>Reports reflect current session data</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/* ── PORTAL SCREEN ───────────────────────────────────────── */
function PortalScreen({store,onBack,onSignOut}) {
  const {invoices,events} = store;
  const paid = invoices.filter(iv=>iv.status==='paid');
  const totalEarned = paid.reduce((s,iv)=>s+iv.amount,0);
  const pendingPay = invoices.filter(iv=>iv.status==='pending').reduce((s,iv)=>s+iv.amount,0);
  const collectionRate = invoices.length>0?Math.round((paid.length/invoices.length)*100):0;
  const upcoming = events.filter(e=>e.status==='upcoming'||e.status==='today');
  const fmt = n => n>=1000?'$'+(n/1000).toFixed(0)+'k':'$'+n;

  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <SafeAreaView style={{flex:1}}>
        <ScreenHeader title="My Portal" onBack={onBack} />
        <ScrollView contentContainerStyle={{padding:16}}>
          <Card style={{marginBottom:16,alignItems:'center',paddingVertical:24}}>
            <Avi name="Jordan Blake" size={64} color={C.gold} />
            <Text style={{color:C.text,fontSize:T.lg,fontWeight:'800',marginTop:12}}>Jordan Blake</Text>
            <Text style={{color:C.sub,fontSize:T.sm,marginTop:4}}>Sound Mixer  |  Freelancer</Text>
            <View style={{flexDirection:'row',marginTop:16,paddingTop:16,borderTopWidth:1,borderTopColor:C.border,width:'100%',justifyContent:'space-around'}}>
              <View style={{alignItems:'center'}}>
                <Text style={{color:C.teal,fontSize:T.lg,fontWeight:'800'}}>{events.length}</Text>
                <Text style={{color:C.sub,fontSize:T.xs}}>Shifts</Text>
              </View>
              <View style={{alignItems:'center'}}>
                <Text style={{color:C.gold,fontSize:T.lg,fontWeight:'800'}}>{invoices.length}</Text>
                <Text style={{color:C.sub,fontSize:T.xs}}>Invoices</Text>
              </View>
              <View style={{alignItems:'center'}}>
                <Text style={{color:C.green,fontSize:T.lg,fontWeight:'800'}}>{collectionRate}%</Text>
                <Text style={{color:C.sub,fontSize:T.xs}}>Collection</Text>
              </View>
            </View>
          </Card>

          <View style={{flexDirection:'row',marginBottom:16}}>
            <KPI label="Total Earned" value={fmt(totalEarned)} color={C.teal} />
            <View style={{width:10}} />
            <KPI label="Pending Pay" value={fmt(pendingPay)} color={C.gold} />
          </View>

          <Card style={{marginBottom:16}}>
            <SecHead label="Upcoming Work" />
            {upcoming.slice(0,4).map(e=>(
              <View key={e.id} style={{flexDirection:'row',alignItems:'center',paddingVertical:10,borderBottomWidth:1,borderBottomColor:C.border}}>
                <View style={{width:4,height:36,borderRadius:2,backgroundColor:e.status==='today'?C.teal:C.gold,marginRight:12}} />
                <View style={{flex:1}}>
                  <Text style={{color:C.text,fontSize:T.sm,fontWeight:'600'}}>{e.title}</Text>
                  <Text style={{color:C.sub,fontSize:T.xs,marginTop:2}}>{e.date}  |  {e.start}-{e.end}</Text>
                </View>
              </View>
            ))}
            {upcoming.length===0 && <Text style={{color:C.sub,fontSize:T.sm,textAlign:'center',paddingVertical:8}}>No upcoming work scheduled</Text>}
          </Card>

          <Card style={{marginBottom:16}}>
            <SecHead label="Account Settings" />
            {[
              {label:'Edit Profile',color:C.teal},
              {label:'Payment Details',color:C.green},
              {label:'Notifications',color:C.blue},
              {label:'Privacy & Security',color:C.purple},
            ].map(row=>(
              <TouchableOpacity key={row.label} style={{flexDirection:'row',alignItems:'center',paddingVertical:13,borderBottomWidth:1,borderBottomColor:C.border}}>
                <View style={{width:32,height:32,borderRadius:R.md,backgroundColor:row.color+'22',borderWidth:1,borderColor:row.color+'44',alignItems:'center',justifyContent:'center',marginRight:12}}>
                  <Text style={{color:row.color,fontSize:T.sm,fontWeight:'700'}}>{row.label[0]}</Text>
                </View>
                <Text style={{color:C.text,fontSize:T.sm,fontWeight:'600',flex:1}}>{row.label}</Text>
                <Text style={{color:C.sub,fontSize:T.sm}}>{'>'}</Text>
              </TouchableOpacity>
            ))}
          </Card>

          <Btn label="Sign Out" onPress={onSignOut} color={C.red} outline style={{marginBottom:32}} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}
/* ── MORE SCREEN ─────────────────────────────────────────── */
function MoreScreen({store,onSignOut,isBiz}) {
  const {invoices,projects,crew} = store;
  const paid = invoices.filter(iv=>iv.status==='paid');
  const totalRevenue = paid.reduce((s,iv)=>s+iv.amount,0);
  const fmt = n => n>=1000?'$'+(n/1000).toFixed(0)+'k':'$'+n;

  const handleSignOut = () => Alert.alert('Sign Out','Are you sure you want to sign out of CrewDesk?',[
    {text:'Cancel',style:'cancel'},
    {text:'Sign Out',style:'destructive',onPress:onSignOut},
  ]);

  const settingsRows = isBiz ? [
    {label:'Account & Profile',icon:'A',color:C.teal},
    {label:'Notifications',icon:'N',color:C.blue},
    {label:'Billing & Payments',icon:'B',color:C.green},
    {label:'Team Management',icon:'T',color:C.purple},
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
        <View style={{paddingHorizontal:16,paddingTop:20,paddingBottom:12}}>
          <Text style={{color:C.text,fontSize:T.xl,fontWeight:'800'}}>More</Text>
        </View>
        <ScrollView contentContainerStyle={{paddingHorizontal:16,paddingBottom:40}}>

          <Card style={{marginBottom:16,alignItems:'center',paddingVertical:20}}>
            <Avi name={isBiz?'My Business':'Jordan Blake'} size={56} color={isBiz?C.teal:C.gold} />
            <Text style={{color:C.text,fontSize:T.md,fontWeight:'800',marginTop:10}}>{isBiz?'My Production Co':'Jordan Blake'}</Text>
            <Text style={{color:C.sub,fontSize:T.sm,marginTop:4}}>{isBiz?'Business Account':'Freelancer Account'}</Text>

            {isBiz && (
              <View style={{flexDirection:'row',marginTop:14,paddingTop:14,borderTopWidth:1,borderTopColor:C.border,width:'100%',justifyContent:'space-around'}}>
                <View style={{alignItems:'center'}}>
                  <Text style={{color:C.teal,fontSize:T.lg,fontWeight:'800'}}>{projects.filter(p=>p.status==='active').length}</Text>
                  <Text style={{color:C.sub,fontSize:T.xs}}>Active</Text>
                </View>
                <View style={{alignItems:'center'}}>
                  <Text style={{color:C.gold,fontSize:T.lg,fontWeight:'800'}}>{crew.length}</Text>
                  <Text style={{color:C.sub,fontSize:T.xs}}>Crew</Text>
                </View>
                <View style={{alignItems:'center'}}>
                  <Text style={{color:C.green,fontSize:T.lg,fontWeight:'800'}}>{fmt(totalRevenue)}</Text>
                  <Text style={{color:C.sub,fontSize:T.xs}}>Revenue</Text>
                </View>
              </View>
            )}
          </Card>

          <Card style={{marginBottom:16}}>
            {settingsRows.map((row,idx)=>(
              <TouchableOpacity key={row.label}
                style={{flexDirection:'row',alignItems:'center',paddingVertical:13,
                  borderBottomWidth:idx<settingsRows.length-1?1:0,borderBottomColor:C.border}}>
                <View style={{width:34,height:34,borderRadius:R.md,backgroundColor:row.color+'22',
                  borderWidth:1,borderColor:row.color+'44',alignItems:'center',justifyContent:'center',marginRight:12}}>
                  <Text style={{color:row.color,fontSize:T.sm,fontWeight:'700'}}>{row.icon}</Text>
                </View>
                <Text style={{color:C.text,fontSize:T.sm,fontWeight:'600',flex:1}}>{row.label}</Text>
                <Text style={{color:C.sub,fontSize:T.base}}>{'>'}</Text>
              </TouchableOpacity>
            ))}
          </Card>

          <Card style={{marginBottom:20,backgroundColor:C.card2}}>
            <View style={{alignItems:'center'}}>
              <Text style={{color:C.text,fontSize:T.xs,fontWeight:'700',letterSpacing:1,textTransform:'uppercase',marginBottom:4}}>CrewDesk MVP1</Text>
              <Text style={{color:C.sub,fontSize:T.xs}}>Production Management Platform</Text>
              <Text style={{color:C.dimmer,fontSize:T.xs,marginTop:4}}>Film  -  TV  -  Live Events</Text>
            </View>
          </Card>

          <Btn label="Sign Out" onPress={handleSignOut} color={C.red} outline style={{marginBottom:8}} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

/* ── TAB BARS ─────────────────────────────────────────────── */
const BIZ_TABS = [
  {id:'home',label:'Home',icon:'H'},
  {id:'projects',label:'Projects',icon:'P'},
  {id:'crew',label:'Crew',icon:'C'},
  {id:'schedule',label:'Schedule',icon:'S'},
  {id:'more',label:'More',icon:'M'},
];

const FREE_TABS = [
  {id:'home',label:'Home',icon:'H'},
  {id:'schedule',label:'Schedule',icon:'S'},
  {id:'invoices',label:'Invoices',icon:'I'},
  {id:'more',label:'More',icon:'M'},
];

function TabBar({tabs,active,onTab,accentColor=C.teal,totalUnread=0}) {
  return (
    <View style={{flexDirection:'row',backgroundColor:C.surf,borderTopWidth:1,borderTopColor:C.border,paddingBottom:Platform.OS==='ios'?20:6,paddingTop:6}}>
      {tabs.map(t=>{
        const isActive = active===t.id;
        return (
          <PBtn key={t.id} onPress={()=>onTab(t.id)} style={{flex:1,alignItems:'center',paddingVertical:6}}>
            <View style={{width:36,height:36,borderRadius:R.md,alignItems:'center',justifyContent:'center',
              backgroundColor:isActive?accentColor+'22':'transparent',
              borderWidth:isActive?1.5:0,borderColor:isActive?accentColor+'55':'transparent'}}>
              {t.id==='messages' && totalUnread>0 && isActive===false && (
                <View style={{position:'absolute',top:-2,right:-2,zIndex:10}}>
                  <Badge count={totalUnread} color={C.red} />
                </View>
              )}
              <Text style={{fontSize:T.base,fontWeight:'700',color:isActive?accentColor:C.dimmer}}>{t.icon}</Text>
            </View>
            <Text style={{color:isActive?accentColor:C.dimmer,fontSize:9,fontWeight:isActive?'700':'500',marginTop:3,letterSpacing:0.3}}>
              {t.label}
            </Text>
          </PBtn>
        );
      })}
    </View>
  );
}

/* ── APP ROOT ─────────────────────────────────────────────── */
export default function App() {
  const store = useStore();
  const [userType,setUserType] = useState(null);
  const [tab,setTab] = useState('home');
  const [subScreen,setSubScreen] = useState(null);

  const handleLogin = type => { setUserType(type); setTab('home'); setSubScreen(null); };
  const handleSignOut = () => { setUserType(null); setTab('home'); setSubScreen(null); };

  const handleNav = screen => {
    const subScreens = ['messages','invoices','reports','portal'];
    if(subScreens.includes(screen)) setSubScreen(screen);
    else { setTab(screen); setSubScreen(null); }
  };

  if(!userType) return <LoginScreen onLogin={handleLogin} />;

  const isBiz = userType==='business';
  const tabs = isBiz ? BIZ_TABS : FREE_TABS;
  const accentColor = isBiz ? C.teal : C.gold;
  const totalUnread = store.messages.reduce((s,m)=>s+m.unread,0);

  const renderSubScreen = () => {
    if(subScreen==='messages') return <MessagesScreen store={store} onBack={()=>setSubScreen(null)} />;
    if(subScreen==='invoices') return <InvoicesScreen store={store} onBack={()=>setSubScreen(null)} />;
    if(subScreen==='reports') return <ReportsScreen store={store} onBack={()=>setSubScreen(null)} isBiz={isBiz} />;
    if(subScreen==='portal') return <PortalScreen store={store} onBack={()=>setSubScreen(null)} onSignOut={handleSignOut} />;
    return null;
  };

  const renderTab = () => {
    if(tab==='home') return isBiz
      ? <HomeScreen store={store} onNav={handleNav} />
      : <FHomeScreen store={store} onNav={handleNav} />;
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
      <View style={{flex:1}}>
        {subScreen ? renderSubScreen() : renderTab()}
      </View>
      {!subScreen && <TabBar tabs={tabs} active={tab} onTab={t=>{setTab(t);setSubScreen(null);}} accentColor={accentColor} totalUnread={totalUnread} />}
    </View>
  );
}
