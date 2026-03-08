
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  Animated, Alert, Modal, SafeAreaView, StatusBar,
  KeyboardAvoidingView, Platform, Dimensions
} from 'react-native';

const { width: SW, height: SH } = Dimensions.get('window');

const C = {
  bg:'#050C1A', surf:'#091222', card:'#0D1B30', card2:'#111F38',
  border:'#1B2D4A', border2:'#243855',
  teal:'#06B6D4', tealD:'#0891B2', gold:'#F59E0B', goldD:'#D97706',
  purple:'#A78BFA', green:'#10B981', red:'#EF4444', blue:'#3B82F6',
  muted:'#4A5568', text:'#F1F5F9', sub:'#94A3B8', dim:'#64748B', dimmer:'#3D5068',
};
const T = {xs:10,sm:12,base:14,md:16,lg:18,xl:22,xxl:28,hero:38};
const R = {sm:8,md:12,lg:16,xl:20,xxl:28,pill:99};

const uid      = () => Math.random().toString(36).slice(2,9);
const fmt      = n  => n>=1000?(n/1000).toFixed(1)+'k':String(n);
const fmtMoney = n  => '$'+Number(n).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const today    = () => new Date().toISOString().slice(0,10);
const MONTHS   = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const fmtDate  = d  => { const x=new Date(d); return MONTHS[x.getMonth()]+' '+x.getDate(); };

const ROLES = ['Director of Photography','Production Designer','1st AD','Script Supervisor',
  'Sound Mixer','Gaffer','Key Grip','VFX Supervisor','Production Manager','Line Producer'];
const NAMES = ['Alex Rivera','Jordan Lee','Sam Chen','Morgan Blake','Taylor Quinn',
  'Casey Doyle','Jamie Ortiz','Drew Malone','Quinn Foster','Riley Shaw',
  'Avery Kim','Parker Walsh','Skyler Nguyen','Dana Cruz','Cameron Bell'];

const INIT_CREW = NAMES.slice(0,8).map((name,i) => ({
  id:uid(),name,role:ROLES[i%ROLES.length],rate:450+i*55,
  rating:parseFloat((4.2+(i%4)*0.2).toFixed(1)),
  status:['available','booked','on-set','unavailable'][i%4],
  tags:i%2===0?['Union','Feature']:['Non-Union','Commercial'],
  phone:'+1 310-'+(500+i*13)+'-'+(1000+i*77),
  email:name.toLowerCase().replace(' ','.')+('@crewdesk.io'),
  joined:'2024-0'+(i+1)+'-15',
  bio:'Experienced professional with 8+ years in film and television production.',
  completedJobs:12+i*3,
}));

const INIT_PROJECTS = [
  {id:uid(),title:'Horizon Feature Film',client:'Apex Studios',status:'active',
   budget:240000,spent:98000,start:'2025-01-10',end:'2025-04-30',
   desc:'A thriller feature film shooting across multiple LA locations.',crewIds:[]},
  {id:uid(),title:'Velocity TVC',client:'Velocity Motors',status:'active',
   budget:85000,spent:31000,start:'2025-02-01',end:'2025-03-15',
   desc:'High-energy automotive commercial for global broadcast.',crewIds:[]},
  {id:uid(),title:'Neon Noir Series',client:'StreamVault',status:'planning',
   budget:520000,spent:12000,start:'2025-05-01',end:'2025-09-30',
   desc:'Six-part neo-noir limited series for a streaming platform.',crewIds:[]},
  {id:uid(),title:'Summit Doc',client:'PBS Independent',status:'wrapped',
   budget:60000,spent:58200,start:'2024-09-01',end:'2024-12-20',
   desc:'Documentary following extreme athletes over a full season.',crewIds:[]},
];

const INIT_SHIFTS = [
  {id:uid(),projectId:'',title:'Horizon Scene 12 Int.',date:'2025-03-10',
   start:'06:00',end:'18:00',location:'Warner Bros Stage 14',crewIds:[],notes:'Full lighting rig required.'},
  {id:uid(),projectId:'',title:'Velocity TVC Car Chase',date:'2025-03-12',
   start:'05:30',end:'16:00',location:'Angeles Crest Hwy',crewIds:[],notes:'Stunt coordinator on site.'},
  {id:uid(),projectId:'',title:'Neon Noir Location Scout',date:'2025-03-14',
   start:'09:00',end:'14:00',location:'Downtown LA',crewIds:[],notes:'PD and AD only.'},
  {id:uid(),projectId:'',title:'Horizon Scene 20 Ext.',date:'2025-03-17',
   start:'04:00',end:'12:00',location:'Malibu Beach',crewIds:[],notes:'Golden hour shoot.'},
];

const INIT_INVOICES = [
  {id:uid(),number:'INV-2025-001',client:'Apex Studios',project:'Horizon Feature Film',
   amount:24500,status:'paid',due:'2025-02-28',issued:'2025-02-01',
   items:[{desc:'Production Services Week 3',qty:1,rate:24500}],attachments:[]},
  {id:uid(),number:'INV-2025-002',client:'Velocity Motors',project:'Velocity TVC',
   amount:8750,status:'pending',due:'2025-03-15',issued:'2025-03-01',
   items:[{desc:'Shoot Day Services x2',qty:2,rate:4375}],attachments:[]},
  {id:uid(),number:'INV-2025-003',client:'StreamVault',project:'Neon Noir Series',
   amount:3200,status:'draft',due:'2025-04-01',issued:'2025-03-15',
   items:[{desc:'Pre-Production Consultation',qty:8,rate:400}],attachments:[]},
  {id:uid(),number:'INV-2025-004',client:'PBS Independent',project:'Summit Doc',
   amount:11000,status:'overdue',due:'2025-01-31',issued:'2025-01-05',
   items:[{desc:'Post-Production Supervision',qty:1,rate:11000}],attachments:[]},
];

const INIT_THREADS = [
  {id:uid(),name:'Horizon Core Team',avatar:'HC',preview:'Scene 12 locked for Monday',
   ts:'09:41',unread:3,projectId:'',
   messages:[
     {id:uid(),sender:'Jordan Lee',text:'Scene 12 locked for Monday - all crew confirmed?',ts:'09:38',mine:false},
     {id:uid(),sender:'Alex Rivera',text:'DP confirmed, waiting on gaffer.',ts:'09:40',mine:false},
     {id:uid(),sender:'You',text:'Confirmed - locked in.',ts:'09:41',mine:true},
   ]},
  {id:uid(),name:'Velocity TVC',avatar:'VT',preview:'Call sheet sent for Wednesday',
   ts:'Yesterday',unread:0,projectId:'',
   messages:[
     {id:uid(),sender:'Sam Chen',text:'Call sheet sent for Wednesday - 05:30 crew call.',ts:'Yesterday',mine:false},
     {id:uid(),sender:'You',text:'Copy that. Thanks Sam.',ts:'Yesterday',mine:true},
   ]},
  {id:uid(),name:'Production Office',avatar:'PO',preview:'Budget revised - check Invoices',
   ts:'Mon',unread:1,projectId:'',
   messages:[
     {id:uid(),sender:'Morgan Blake',text:'Budget revised - check Invoices tab for updated numbers.',ts:'Mon',mine:false},
   ]},
];


function useStore() {
  const [crew,setCrew]=useState(INIT_CREW);
  const [projects,setProjects]=useState(INIT_PROJECTS);
  const [shifts,setShifts]=useState(INIT_SHIFTS);
  const [invoices,setInvoices]=useState(INIT_INVOICES);
  const [threads,setThreads]=useState(INIT_THREADS);
  const addCrew=c=>setCrew(p=>[{...c,id:uid()},...p]);
  const updateCrew=c=>setCrew(p=>p.map(x=>x.id===c.id?c:x));
  const deleteCrew=id=>Alert.alert('Remove Crew Member','Remove this person from the roster?',
    [{text:'Cancel',style:'cancel'},{text:'Remove',style:'destructive',onPress:()=>setCrew(p=>p.filter(x=>x.id!==id))}]);
  const addProject=p=>setProjects(prev=>[{...p,id:uid()},...prev]);
  const updateProject=p=>setProjects(prev=>prev.map(x=>x.id===p.id?p:x));
  const deleteProject=id=>Alert.alert('Delete Project','Permanently delete this project?',
    [{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>setProjects(p=>p.filter(x=>x.id!==id))}]);
  const addShift=s=>setShifts(prev=>[{...s,id:uid()},...prev]);
  const updateShift=s=>setShifts(prev=>prev.map(x=>x.id===s.id?s:x));
  const deleteShift=id=>Alert.alert('Remove Shift','Remove this shift from the schedule?',
    [{text:'Cancel',style:'cancel'},{text:'Remove',style:'destructive',onPress:()=>setShifts(p=>p.filter(x=>x.id!==id))}]);
  const addInvoice=inv=>setInvoices(prev=>[{...inv,id:uid(),number:'INV-2025-'+String(prev.length+5).padStart(3,'0')},...prev]);
  const updateInvoice=inv=>setInvoices(prev=>prev.map(x=>x.id===inv.id?inv:x));
  const deleteInvoice=id=>Alert.alert('Delete Invoice','Permanently delete this invoice?',
    [{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>setInvoices(p=>p.filter(x=>x.id!==id))}]);
  const sendMessage=(threadId,text)=>{
    const msg={id:uid(),sender:'You',text,ts:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),mine:true};
    setThreads(prev=>prev.map(t=>t.id===threadId?{...t,messages:[...t.messages,msg],preview:text,ts:msg.ts,unread:0}:t));
  };
  const addThread=t=>setThreads(prev=>[{...t,id:uid(),messages:[],unread:0,ts:'Now'},...prev]);
  return {crew,projects,shifts,invoices,threads,addCrew,updateCrew,deleteCrew,addProject,updateProject,deleteProject,addShift,updateShift,deleteShift,addInvoice,updateInvoice,deleteInvoice,sendMessage,addThread};
}

function PBtn({onPress,style,children}) {
  const sc=useRef(new Animated.Value(1)).current;
  const go=()=>{Animated.sequence([Animated.timing(sc,{toValue:0.955,duration:70,useNativeDriver:true}),Animated.timing(sc,{toValue:1,duration:70,useNativeDriver:true})]).start();onPress&&onPress();};
  return <TouchableOpacity onPress={go} activeOpacity={0.9}><Animated.View style={[{transform:[{scale:sc}]},style]}>{children}</Animated.View></TouchableOpacity>;
}

function Chip({label,color=C.teal}) {
  return <View style={{backgroundColor:color+'18',borderRadius:R.pill,borderWidth:1,borderColor:color+'45',paddingHorizontal:9,paddingVertical:3,marginRight:5}}><Text style={{color,fontSize:T.xs,fontWeight:'600'}}>{label}</Text></View>;
}

function Badge({status}) {
  const MAP={active:{c:C.green,l:'Active'},planning:{c:C.blue,l:'Planning'},wrapped:{c:C.muted,l:'Wrapped'},paid:{c:C.green,l:'Paid'},pending:{c:C.gold,l:'Pending'},draft:{c:C.muted,l:'Draft'},overdue:{c:C.red,l:'Overdue'},available:{c:C.green,l:'Available'},booked:{c:C.blue,l:'Booked'},'on-set':{c:C.gold,l:'On Set'},unavailable:{c:C.red,l:'Unavailable'}};
  const s=MAP[status]||MAP.draft;
  return <View style={{backgroundColor:s.c+'18',borderRadius:R.pill,borderWidth:1,borderColor:s.c+'50',paddingHorizontal:10,paddingVertical:3}}><Text style={{color:s.c,fontSize:T.xs,fontWeight:'700'}}>{s.l}</Text></View>;
}

function Card({style,children,onPress}) {
  const base={backgroundColor:C.card,borderRadius:R.xl,borderWidth:1,borderColor:C.border,padding:16,marginBottom:12};
  if(onPress) return <PBtn onPress={onPress} style={[base,style]}>{children}</PBtn>;
  return <View style={[base,style]}>{children}</View>;
}

function KPI({label,value,color=C.teal,sub}) {
  return <View style={{flex:1,backgroundColor:C.card,borderRadius:R.xl,borderWidth:1,borderColor:C.border,padding:14,alignItems:'center'}}><Text style={{color,fontSize:T.xl,fontWeight:'800',letterSpacing:-0.5}}>{value}</Text><Text style={{color:C.text,fontSize:T.sm,fontWeight:'600',marginTop:3}}>{label}</Text>{sub?<Text style={{color:C.dim,fontSize:T.xs,marginTop:1}}>{sub}</Text>:null}</View>;
}

function SecHead({title,action,onAction}) {
  return <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10,marginTop:6}}><Text style={{color:C.text,fontSize:T.md,fontWeight:'700'}}>{title}</Text>{action?<TouchableOpacity onPress={onAction}><Text style={{color:C.teal,fontSize:T.sm,fontWeight:'600'}}>{action}</Text></TouchableOpacity>:null}</View>;
}

function Avi({name='',size=38,color=C.teal}) {
  const init=name.split(' ').slice(0,2).map(w=>w[0]).join('').toUpperCase();
  return <View style={{width:size,height:size,borderRadius:size/2,backgroundColor:color+'22',borderWidth:1.5,borderColor:color+'55',alignItems:'center',justifyContent:'center'}}><Text style={{color,fontSize:size*0.33,fontWeight:'700'}}>{init}</Text></View>;
}

function Empty({icon,title,sub}) {
  return <View style={{alignItems:'center',paddingVertical:52}}><View style={{width:64,height:64,borderRadius:R.xl,backgroundColor:C.card,borderWidth:1,borderColor:C.border,alignItems:'center',justifyContent:'center',marginBottom:16}}><Text style={{color:C.dim,fontSize:28}}>{icon}</Text></View><Text style={{color:C.text,fontSize:T.md,fontWeight:'700',marginBottom:6}}>{title}</Text><Text style={{color:C.dim,fontSize:T.base,textAlign:'center',maxWidth:250,lineHeight:20}}>{sub}</Text></View>;
}

function FInput({label,value,onChangeText,placeholder,kbType='default',multi=false,lines=1}) {
  const [focus,setFocus]=useState(false);
  return <View style={{marginBottom:14}}>{label?<Text style={{color:C.sub,fontSize:T.xs,fontWeight:'700',marginBottom:6,textTransform:'uppercase',letterSpacing:1}}>{label}</Text>:null}<TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={C.dimmer} keyboardType={kbType} multiline={multi} numberOfLines={lines} onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} style={{backgroundColor:C.surf,borderRadius:R.md,borderWidth:1.5,borderColor:focus?C.teal:C.border,color:C.text,fontSize:T.base,paddingHorizontal:14,paddingVertical:multi?12:0,height:multi?lines*30:48}} /></View>;
}

function Btn({label,onPress,color=C.teal,outline=false,style}) {
  return <PBtn onPress={onPress} style={{backgroundColor:outline?'transparent':color,borderRadius:R.pill,paddingVertical:14,paddingHorizontal:28,alignItems:'center',borderWidth:outline?1.5:0,borderColor:outline?color:'transparent',...style}}><Text style={{color:outline?color:C.bg,fontSize:T.base,fontWeight:'800',letterSpacing:0.3}}>{label}</Text></PBtn>;
}

function Sheet({visible,onClose,title,children}) {
  return <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}><KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}}><View style={{flex:1,justifyContent:'flex-end',backgroundColor:'#000000BB'}}><View style={{backgroundColor:C.surf,borderTopLeftRadius:R.xxl,borderTopRightRadius:R.xxl,paddingTop:8,paddingHorizontal:20,paddingBottom:40,maxHeight:'92%'}}><View style={{width:36,height:4,borderRadius:2,backgroundColor:C.border2,alignSelf:'center',marginBottom:16}}/><View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:20}}><Text style={{color:C.text,fontSize:T.lg,fontWeight:'800'}}>{title}</Text><TouchableOpacity onPress={onClose} style={{width:30,height:30,borderRadius:15,backgroundColor:C.card,borderWidth:1,borderColor:C.border,alignItems:'center',justifyContent:'center'}}><Text style={{color:C.dim,fontSize:T.sm,fontWeight:'700'}}>x</Text></TouchableOpacity></View><ScrollView showsVerticalScrollIndicator={false}>{children}</ScrollView></View></View></KeyboardAvoidingView></Modal>;
}

function Stars({rating=0,size=13}) {
  return <View style={{flexDirection:'row'}}>{[1,2,3,4,5].map(i=><Text key={i} style={{color:i<=Math.round(rating)?C.gold:C.border,fontSize:size,marginRight:1}}>{i<=Math.round(rating)?'*':'.'}</Text>)}</View>;
}

function Bar({value=0,color=C.teal,h=6}) {
  const pct=Math.min(100,Math.max(0,value));
  return <View style={{backgroundColor:C.border,borderRadius:99,height:h,overflow:'hidden'}}><View style={{width:pct+'%',backgroundColor:color,height:h,borderRadius:99}}/></View>;
}

function ScreenHeader({title,onBack,accent=C.teal}) {
  return <View style={{flexDirection:'row',alignItems:'center',paddingHorizontal:20,paddingTop:16,paddingBottom:12,borderBottomWidth:1,borderBottomColor:C.border}}>{onBack&&<TouchableOpacity onPress={onBack} style={{marginRight:12,width:34,height:34,borderRadius:17,backgroundColor:C.card,borderWidth:1,borderColor:C.border,alignItems:'center',justifyContent:'center'}}><Text style={{color:accent,fontSize:T.md,fontWeight:'700'}}>{'<'}</Text></TouchableOpacity>}<Text style={{color:C.text,fontSize:T.xl,fontWeight:'800',flex:1}}>{title}</Text></View>;
}


function LoginScreen({onLogin}) {
  const [mode,setMode]=useState('choose');
  const [email,setEmail]=useState('');
  const [pass,setPass]=useState('');
  const fadeY=useRef(new Animated.Value(30)).current;
  const fadeOp=useRef(new Animated.Value(0)).current;
  useEffect(()=>{
    fadeY.setValue(30);fadeOp.setValue(0);
    Animated.parallel([
      Animated.timing(fadeOp,{toValue:1,duration:500,useNativeDriver:true}),
      Animated.timing(fadeY,{toValue:0,duration:500,useNativeDriver:true}),
    ]).start();
  },[mode]);
  const goMode=m=>{setEmail('');setPass('');setMode(m);};
  const doLogin=()=>{if(!email.trim()){Alert.alert('Required','Please enter your email address.');return;}onLogin(mode);};

  if(mode==='choose') return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <StatusBar barStyle="light-content"/>
      <SafeAreaView style={{flex:1}}>
        <Animated.View style={{flex:1,opacity:fadeOp,transform:[{translateY:fadeY}]}}>
          <ScrollView contentContainerStyle={{flexGrow:1,justifyContent:'center',paddingHorizontal:28}}>
            <View style={{alignItems:'center',marginBottom:52}}>
              <View style={{width:96,height:96,borderRadius:28,backgroundColor:C.teal+'14',borderWidth:2,borderColor:C.teal+'35',alignItems:'center',justifyContent:'center',marginBottom:24}}>
                <View style={{width:64,height:64,borderRadius:18,backgroundColor:C.teal+'28',borderWidth:2,borderColor:C.teal+'70',alignItems:'center',justifyContent:'center'}}>
                  <Text style={{color:C.teal,fontSize:T.xxl,fontWeight:'900',letterSpacing:-1}}>CD</Text>
                </View>
              </View>
              <Text style={{color:C.text,fontSize:T.hero,fontWeight:'900',letterSpacing:-2,textAlign:'center',lineHeight:42}}>
                CrewDesk
              </Text>
              <Text style={{color:C.dim,fontSize:T.base,marginTop:8,textAlign:'center',letterSpacing:0.3,lineHeight:22}}>
                Production management platform for film, TV and live events
              </Text>
            </View>
            <View style={{flexDirection:'row',alignItems:'center',marginBottom:24}}>
              <View style={{flex:1,height:1,backgroundColor:C.border}}/>
              <Text style={{color:C.dim,fontSize:T.xs,fontWeight:'700',marginHorizontal:14,textTransform:'uppercase',letterSpacing:2}}>
                Continue as
              </Text>
              <View style={{flex:1,height:1,backgroundColor:C.border}}/>
            </View>
            <PBtn onPress={()=>goMode('business')} style={{backgroundColor:C.card,borderRadius:R.xxl,borderWidth:1.5,borderColor:C.teal+'50',padding:22,marginBottom:14}}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <View style={{width:52,height:52,borderRadius:R.lg,backgroundColor:C.teal+'20',borderWidth:1.5,borderColor:C.teal+'50',alignItems:'center',justifyContent:'center',marginRight:16}}>
                  <Text style={{color:C.teal,fontSize:T.lg,fontWeight:'900'}}>Bz</Text>
                </View>
                <View style={{flex:1}}>
                  <Text style={{color:C.text,fontSize:T.md,fontWeight:'800',marginBottom:3}}>Business</Text>
                  <Text style={{color:C.dim,fontSize:T.sm,lineHeight:18}}>Manage productions, crew, budgets and billing</Text>
                </View>
                <View style={{width:28,height:28,borderRadius:14,backgroundColor:C.teal+'15',borderWidth:1,borderColor:C.teal+'40',alignItems:'center',justifyContent:'center'}}>
                  <Text style={{color:C.teal,fontSize:T.sm,fontWeight:'700'}}>{'>'}</Text>
                </View>
              </View>
            </PBtn>
            <PBtn onPress={()=>goMode('freelancer')} style={{backgroundColor:C.card,borderRadius:R.xxl,borderWidth:1.5,borderColor:C.gold+'50',padding:22,marginBottom:40}}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <View style={{width:52,height:52,borderRadius:R.lg,backgroundColor:C.gold+'20',borderWidth:1.5,borderColor:C.gold+'50',alignItems:'center',justifyContent:'center',marginRight:16}}>
                  <Text style={{color:C.gold,fontSize:T.lg,fontWeight:'900'}}>Fr</Text>
                </View>
                <View style={{flex:1}}>
                  <Text style={{color:C.text,fontSize:T.md,fontWeight:'800',marginBottom:3}}>Freelancer / Contractor</Text>
                  <Text style={{color:C.dim,fontSize:T.sm,lineHeight:18}}>Find work, track gigs, send invoices and get paid</Text>
                </View>
                <View style={{width:28,height:28,borderRadius:14,backgroundColor:C.gold+'15',borderWidth:1,borderColor:C.gold+'40',alignItems:'center',justifyContent:'center'}}>
                  <Text style={{color:C.gold,fontSize:T.sm,fontWeight:'700'}}>{'>'}</Text>
                </View>
              </View>
            </PBtn>
            <Text style={{color:C.dimmer,fontSize:T.xs,textAlign:'center',lineHeight:18}}>
              By continuing you agree to CrewDesk Terms of Service and Privacy Policy
            </Text>
            <View style={{height:30}}/>
          </ScrollView>
        </Animated.View>
      </SafeAreaView>
    </View>
  );

  const isBiz=mode==='business';
  const accent=isBiz?C.teal:C.gold;
  const tag=isBiz?'Business':'Freelancer';
  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <StatusBar barStyle="light-content"/>
      <SafeAreaView style={{flex:1}}>
        <Animated.View style={{flex:1,opacity:fadeOp,transform:[{translateY:fadeY}]}}>
          <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}}>
            <ScrollView contentContainerStyle={{flexGrow:1,justifyContent:'center',paddingHorizontal:28}}>
              <TouchableOpacity onPress={()=>goMode('choose')} style={{flexDirection:'row',alignItems:'center',marginBottom:36}}>
                <View style={{width:34,height:34,borderRadius:17,backgroundColor:C.card,borderWidth:1,borderColor:C.border,alignItems:'center',justifyContent:'center',marginRight:10}}>
                  <Text style={{color:accent,fontSize:T.base,fontWeight:'700'}}>{'<'}</Text>
                </View>
                <Text style={{color:C.sub,fontSize:T.base}}>Back</Text>
              </TouchableOpacity>
              <View style={{flexDirection:'row',alignItems:'center',marginBottom:36}}>
                <View style={{width:56,height:56,borderRadius:R.lg,backgroundColor:accent+'20',borderWidth:2,borderColor:accent+'55',alignItems:'center',justifyContent:'center',marginRight:16}}>
                  <Text style={{color:accent,fontSize:T.lg,fontWeight:'900'}}>{isBiz?'Bz':'Fr'}</Text>
                </View>
                <View>
                  <Text style={{color:C.text,fontSize:T.xxl,fontWeight:'900',letterSpacing:-0.5}}>{tag} Login</Text>
                  <Text style={{color:C.dim,fontSize:T.sm,marginTop:3}}>{isBiz?'Access your production dashboard':'Access your gig portal'}</Text>
                </View>
              </View>
              <FInput label="Email Address" value={email} onChangeText={setEmail} placeholder="you@studio.com" kbType="email-address"/>
              <FInput label="Password" value={pass} onChangeText={setPass} placeholder="Enter password"/>
              <TouchableOpacity style={{alignSelf:'flex-end',marginTop:-4,marginBottom:30}}>
                <Text style={{color:accent,fontSize:T.sm,fontWeight:'600'}}>Forgot password?</Text>
              </TouchableOpacity>
              <Btn label={'Sign In as '+tag} onPress={doLogin} color={accent} style={{marginBottom:18}}/>
              <View style={{flexDirection:'row',justifyContent:'center',marginBottom:30}}>
                <Text style={{color:C.dim,fontSize:T.sm}}>No account?  </Text>
                <TouchableOpacity><Text style={{color:accent,fontSize:T.sm,fontWeight:'700'}}>Create free account</Text></TouchableOpacity>
              </View>
              <View style={{alignItems:'center'}}>
                <View style={{backgroundColor:accent+'18',borderRadius:R.pill,borderWidth:1,borderColor:accent+'40',paddingHorizontal:16,paddingVertical:6}}>
                  <Text style={{color:accent,fontSize:T.xs,fontWeight:'700',letterSpacing:1.5,textTransform:'uppercase'}}>{tag} Account</Text>
                </View>
              </View>
              <View style={{height:40}}/>
            </ScrollView>
          </KeyboardAvoidingView>
        </Animated.View>
      </SafeAreaView>
    </View>
  );
}


function HomeScreen({store,navigate}) {
  const {projects,crew,invoices,shifts}=store;
  const totalBudget=projects.reduce((s,p)=>s+p.budget,0);
  const totalSpent=projects.reduce((s,p)=>s+p.spent,0);
  const activeProj=projects.filter(p=>p.status==='active').length;
  const outstanding=invoices.filter(i=>i.status==='pending'||i.status==='overdue').reduce((s,i)=>s+i.amount,0);
  const onSet=crew.filter(c=>c.status==='on-set').length;
  const nextShifts=[...shifts].sort((a,b)=>a.date.localeCompare(b.date)).slice(0,3);
  return (
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <StatusBar barStyle="light-content"/>
      <ScrollView contentContainerStyle={{padding:20}} showsVerticalScrollIndicator={false}>
        <View style={{marginBottom:24}}>
          <Text style={{color:C.dim,fontSize:T.sm,fontWeight:'600',textTransform:'uppercase',letterSpacing:1.5}}>Good morning</Text>
          <Text style={{color:C.text,fontSize:T.xxl,fontWeight:'900',marginTop:4,letterSpacing:-0.5}}>Dashboard</Text>
          <Text style={{color:C.dim,fontSize:T.sm,marginTop:3}}>{new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</Text>
        </View>
        <View style={{flexDirection:'row',marginBottom:14}}>
          <KPI label="Active" value={String(activeProj)} color={C.teal} sub="projects"/>
          <View style={{width:10}}/>
          <KPI label="On Set" value={String(onSet)} color={C.gold} sub="crew today"/>
          <View style={{width:10}}/>
          <KPI label="Owed" value={'$'+fmt(outstanding)} color={C.green} sub="outstanding"/>
        </View>
        <Card style={{marginBottom:14}}>
          <SecHead title="Budget Overview"/>
          <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:12}}>
            <View><Text style={{color:C.dim,fontSize:T.xs,textTransform:'uppercase',letterSpacing:1,marginBottom:2}}>Total Budget</Text><Text style={{color:C.text,fontSize:T.xl,fontWeight:'800'}}>{fmtMoney(totalBudget)}</Text></View>
            <View style={{alignItems:'flex-end'}}><Text style={{color:C.dim,fontSize:T.xs,textTransform:'uppercase',letterSpacing:1,marginBottom:2}}>Spent</Text><Text style={{color:C.gold,fontSize:T.xl,fontWeight:'800'}}>{fmtMoney(totalSpent)}</Text></View>
          </View>
          <Bar value={(totalSpent/Math.max(totalBudget,1))*100} color={totalSpent/totalBudget>0.8?C.red:C.teal} h={8}/>
          <Text style={{color:C.dim,fontSize:T.xs,marginTop:8,textAlign:'right'}}>{Math.round((totalSpent/Math.max(totalBudget,1))*100)}% of total budget used</Text>
        </Card>
        <SecHead title="Active Projects" action="View all" onAction={()=>navigate('Projects')}/>
        {projects.filter(p=>p.status==='active').slice(0,2).map(p=>{
          const pct=Math.round((p.spent/Math.max(p.budget,1))*100);
          return <Card key={p.id} onPress={()=>navigate('Projects')}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
              <View style={{flex:1,marginRight:10}}><Text style={{color:C.text,fontSize:T.base,fontWeight:'700'}}>{p.title}</Text><Text style={{color:C.dim,fontSize:T.sm,marginTop:2}}>{p.client}</Text></View>
              <Badge status={p.status}/>
            </View>
            <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:7}}><Text style={{color:C.dim,fontSize:T.xs}}>Budget: {fmtMoney(p.budget)}</Text><Text style={{color:pct>85?C.red:C.sub,fontSize:T.xs,fontWeight:'600'}}>{pct}% spent</Text></View>
            <Bar value={pct} color={pct>85?C.red:C.teal}/>
          </Card>;
        })}
        <SecHead title="Upcoming Shifts" action="Schedule" onAction={()=>navigate('Schedule')}/>
        {nextShifts.map(s=><Card key={s.id}><View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
          <View style={{flex:1,marginRight:12}}><Text style={{color:C.text,fontSize:T.base,fontWeight:'600'}}>{s.title}</Text><Text style={{color:C.teal,fontSize:T.sm,fontWeight:'600',marginTop:3}}>{s.start} - {s.end}</Text><Text style={{color:C.dim,fontSize:T.xs,marginTop:2}}>{s.location}</Text></View>
          <View style={{backgroundColor:C.teal+'14',borderRadius:R.lg,padding:10,alignItems:'center',borderWidth:1,borderColor:C.teal+'30'}}><Text style={{color:C.teal,fontSize:T.xs,fontWeight:'700'}}>{fmtDate(s.date)}</Text></View>
        </View></Card>)}
        <SecHead title="Quick Access"/>
        <View style={{flexDirection:'row',flexWrap:'wrap',marginHorizontal:-4}}>
          {[{label:'Messages',color:C.blue,screen:'Messages'},{label:'Invoices',color:C.green,screen:'Invoices'},{label:'Reports',color:C.purple,screen:'Reports'},{label:'Crew',color:C.gold,screen:'Crew'}].map(item=>(
            <PBtn key={item.label} onPress={()=>navigate(item.screen)} style={{width:'47%',margin:'1.5%',backgroundColor:item.color+'12',borderRadius:R.xl,borderWidth:1,borderColor:item.color+'35',padding:16,alignItems:'center'}}>
              <Text style={{color:item.color,fontSize:T.base,fontWeight:'700'}}>{item.label}</Text>
            </PBtn>
          ))}
        </View>
        <View style={{height:30}}/>
      </ScrollView>
    </SafeAreaView>
  );
}

function FHomeScreen({store,navigate,userInfo}) {
  const {invoices,shifts,threads}=store;
  const earned=invoices.filter(i=>i.status==='paid').reduce((s,i)=>s+i.amount,0);
  const pending=invoices.filter(i=>i.status==='pending').reduce((s,i)=>s+i.amount,0);
  const upcoming=[...shifts].sort((a,b)=>a.date.localeCompare(b.date)).slice(0,3);
  const unread=threads.reduce((s,t)=>s+(t.unread||0),0);
  const name=userInfo?userInfo.name:'Freelancer';
  return (
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <StatusBar barStyle="light-content"/>
      <ScrollView contentContainerStyle={{padding:20}} showsVerticalScrollIndicator={false}>
        <View style={{marginBottom:24}}>
          <Text style={{color:C.dim,fontSize:T.sm,fontWeight:'600',textTransform:'uppercase',letterSpacing:1.5}}>Welcome back</Text>
          <Text style={{color:C.text,fontSize:T.xxl,fontWeight:'900',marginTop:4,letterSpacing:-0.5}}>{name}</Text>
          <Text style={{color:C.dim,fontSize:T.sm,marginTop:3}}>{new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}</Text>
        </View>
        <View style={{flexDirection:'row',marginBottom:14}}>
          <KPI label="Earned" value={'$'+fmt(earned)} color={C.gold} sub="all time"/>
          <View style={{width:10}}/>
          <KPI label="Pending" value={'$'+fmt(pending)} color={C.green} sub="awaiting"/>
          <View style={{width:10}}/>
          <KPI label="Shifts" value={String(upcoming.length)} color={C.teal} sub="upcoming"/>
        </View>
        <Card style={{marginBottom:14}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <View><Text style={{color:C.text,fontSize:T.base,fontWeight:'700'}}>Availability Status</Text><Text style={{color:C.dim,fontSize:T.sm,marginTop:3}}>Let productions know you are available</Text></View>
            <View style={{backgroundColor:C.green+'18',borderRadius:R.pill,borderWidth:1,borderColor:C.green+'50',paddingHorizontal:14,paddingVertical:6}}><Text style={{color:C.green,fontSize:T.sm,fontWeight:'700'}}>Available</Text></View>
          </View>
        </Card>
        <SecHead title="Upcoming Shifts" action="View all" onAction={()=>navigate('Schedule')}/>
        {upcoming.length===0?<Empty icon="C" title="No shifts yet" sub="Shifts assigned to you will appear here"/>
          :upcoming.map(s=><Card key={s.id}><View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <View style={{flex:1,marginRight:12}}><Text style={{color:C.text,fontSize:T.base,fontWeight:'600'}}>{s.title}</Text><Text style={{color:C.gold,fontSize:T.sm,fontWeight:'600',marginTop:3}}>{s.start} - {s.end}</Text><Text style={{color:C.dim,fontSize:T.xs,marginTop:2}}>{s.location}</Text></View>
            <View style={{backgroundColor:C.gold+'14',borderRadius:R.lg,padding:10,alignItems:'center',borderWidth:1,borderColor:C.gold+'30'}}><Text style={{color:C.gold,fontSize:T.xs,fontWeight:'700'}}>{fmtDate(s.date)}</Text></View>
          </View></Card>)}
        <SecHead title="Quick Access"/>
        <View style={{flexDirection:'row',flexWrap:'wrap',marginHorizontal:-4}}>
          {[{label:'Messages',color:C.blue,screen:'Messages'},{label:'Invoices',color:C.green,screen:'Invoices'},{label:'My Portal',color:C.gold,screen:'Portal'}].map(item=>(
            <PBtn key={item.label} onPress={()=>navigate(item.screen)} style={{width:'30%',margin:'1.5%',backgroundColor:item.color+'12',borderRadius:R.xl,borderWidth:1,borderColor:item.color+'35',padding:16,alignItems:'center'}}>
              <Text style={{color:item.color,fontSize:T.sm,fontWeight:'700'}}>{item.label}</Text>
            </PBtn>
          ))}
        </View>
        {unread>0&&<Card style={{marginTop:10,borderColor:C.blue+'50',backgroundColor:C.blue+'0E'}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <Text style={{color:C.text,fontSize:T.base,fontWeight:'600'}}>{unread} unread {unread>1?'messages':'message'}</Text>
            <PBtn onPress={()=>navigate('Messages')} style={{backgroundColor:C.blue,borderRadius:R.pill,paddingHorizontal:16,paddingVertical:8}}><Text style={{color:'#fff',fontSize:T.sm,fontWeight:'700'}}>View</Text></PBtn>
          </View>
        </Card>}
        <View style={{height:30}}/>
      </ScrollView>
    </SafeAreaView>
  );
}


function ProjectsScreen({store}) {
  const {projects,addProject,updateProject,deleteProject}=store;
  const [sheet,setSheet]=useState(false);const [edit,setEdit]=useState(null);const [filter,setFilter]=useState('all');
  const [form,setForm]=useState({title:'',client:'',budget:'',status:'active',desc:''});
  const openNew=()=>{setEdit(null);setForm({title:'',client:'',budget:'',status:'active',desc:''});setSheet(true);};
  const openEdit=p=>{setEdit(p);setForm({title:p.title,client:p.client,budget:String(p.budget),status:p.status,desc:p.desc});setSheet(true);};
  const save=()=>{if(!form.title.trim()){Alert.alert('Required','Project title is required.');return;}const data={...form,budget:parseFloat(form.budget)||0,spent:edit?edit.spent:0,crewIds:edit?edit.crewIds:[],start:today(),end:''};edit?updateProject({...edit,...data}):addProject(data);setSheet(false);};
  const visible=filter==='all'?projects:projects.filter(p=>p.status===filter);
  return (
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <ScrollView contentContainerStyle={{padding:20}} showsVerticalScrollIndicator={false}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <Text style={{color:C.text,fontSize:T.xxl,fontWeight:'900',letterSpacing:-0.5}}>Projects</Text>
          <Btn label="+ New" onPress={openNew} color={C.teal} style={{paddingVertical:10,paddingHorizontal:18}}/>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:16}}>
          <View style={{flexDirection:'row'}}>
            {['all','active','planning','wrapped'].map(f=><PBtn key={f} onPress={()=>setFilter(f)} style={{backgroundColor:filter===f?C.teal:C.card,borderRadius:R.pill,paddingHorizontal:16,paddingVertical:9,marginRight:8,borderWidth:1,borderColor:filter===f?C.teal:C.border}}>
              <Text style={{color:filter===f?C.bg:C.sub,fontSize:T.sm,fontWeight:'600',textTransform:'capitalize'}}>{f}</Text>
            </PBtn>)}
          </View>
        </ScrollView>
        {visible.length===0?<Empty icon="P" title="No projects" sub="Tap + New to create your first project"/>
          :visible.map(p=>{const pct=Math.round((p.spent/Math.max(p.budget,1))*100);return <Card key={p.id} onPress={()=>openEdit(p)}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
              <View style={{flex:1,marginRight:10}}><Text style={{color:C.text,fontSize:T.md,fontWeight:'700'}}>{p.title}</Text><Text style={{color:C.dim,fontSize:T.sm,marginTop:2}}>{p.client}</Text></View>
              <Badge status={p.status}/>
            </View>
            {p.desc?<Text style={{color:C.sub,fontSize:T.sm,marginBottom:12,lineHeight:19}} numberOfLines={2}>{p.desc}</Text>:null}
            <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:7}}><Text style={{color:C.dim,fontSize:T.xs}}>Budget: {fmtMoney(p.budget)}</Text><Text style={{color:pct>85?C.red:C.sub,fontSize:T.xs,fontWeight:'600'}}>{pct}% spent</Text></View>
            <Bar value={pct} color={pct>85?C.red:C.teal}/>
            <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:12}}><Text style={{color:C.dim,fontSize:T.xs}}>{p.start} - {p.end||'Ongoing'}</Text><TouchableOpacity onPress={()=>deleteProject(p.id)}><Text style={{color:C.red,fontSize:T.xs,fontWeight:'600'}}>Delete</Text></TouchableOpacity></View>
          </Card>;})}
        <View style={{height:30}}/>
      </ScrollView>
      <Sheet visible={sheet} onClose={()=>setSheet(false)} title={edit?'Edit Project':'New Project'}>
        <FInput label="Project Title" value={form.title} onChangeText={v=>setForm(f=>({...f,title:v}))} placeholder="e.g. Horizon Feature Film"/>
        <FInput label="Client / Studio" value={form.client} onChangeText={v=>setForm(f=>({...f,client:v}))} placeholder="e.g. Apex Studios"/>
        <FInput label="Budget (USD)" value={form.budget} onChangeText={v=>setForm(f=>({...f,budget:v}))} placeholder="240000" kbType="numeric"/>
        <Text style={{color:C.sub,fontSize:T.xs,fontWeight:'700',marginBottom:8,textTransform:'uppercase',letterSpacing:1}}>Status</Text>
        <View style={{flexDirection:'row',marginBottom:14}}>{['active','planning','wrapped'].map(s=><PBtn key={s} onPress={()=>setForm(f=>({...f,status:s}))} style={{backgroundColor:form.status===s?C.teal:C.card,borderRadius:R.pill,paddingHorizontal:14,paddingVertical:9,marginRight:8,borderWidth:1,borderColor:form.status===s?C.teal:C.border}}><Text style={{color:form.status===s?C.bg:C.sub,fontSize:T.sm,fontWeight:'600',textTransform:'capitalize'}}>{s}</Text></PBtn>)}</View>
        <FInput label="Description" value={form.desc} onChangeText={v=>setForm(f=>({...f,desc:v}))} placeholder="Brief project overview..." multi lines={3}/>
        <Btn label={edit?'Save Changes':'Create Project'} onPress={save} color={C.teal} style={{marginTop:8}}/>
        {edit&&<Btn label="Delete Project" onPress={()=>{setSheet(false);deleteProject(edit.id);}} color={C.red} outline style={{marginTop:10}}/>}
      </Sheet>
    </SafeAreaView>
  );
}

function CrewScreen({store}) {
  const {crew,addCrew,updateCrew,deleteCrew}=store;
  const [sheet,setSheet]=useState(false);const [search,setSearch]=useState('');const [filter,setFilter]=useState('all');
  const [edit,setEdit]=useState(null);const [form,setForm]=useState({name:'',role:'',rate:'',status:'available',email:'',phone:'',bio:''});
  const openNew=()=>{setEdit(null);setForm({name:'',role:'',rate:'',status:'available',email:'',phone:'',bio:''});setSheet(true);};
  const openEdit=m=>{setEdit(m);setForm({name:m.name,role:m.role,rate:String(m.rate),status:m.status,email:m.email,phone:m.phone,bio:m.bio});setSheet(true);};
  const save=()=>{if(!form.name.trim()){Alert.alert('Required','Name is required.');return;}const data={...form,rate:parseFloat(form.rate)||0,rating:edit?edit.rating:4.5,tags:edit?edit.tags:[],completedJobs:edit?edit.completedJobs:0,joined:edit?edit.joined:today()};edit?updateCrew({...edit,...data}):addCrew(data);setSheet(false);};
  const filtered=crew.filter(m=>filter==='all'||m.status===filter).filter(m=>!search||m.name.toLowerCase().includes(search.toLowerCase())||m.role.toLowerCase().includes(search.toLowerCase()));
  return (
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <ScrollView contentContainerStyle={{padding:20}} showsVerticalScrollIndicator={false}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <Text style={{color:C.text,fontSize:T.xxl,fontWeight:'900',letterSpacing:-0.5}}>Crew</Text>
          <Btn label="+ Add" onPress={openNew} color={C.gold} style={{paddingVertical:10,paddingHorizontal:18}}/>
        </View>
        <View style={{backgroundColor:C.card,borderRadius:R.lg,borderWidth:1,borderColor:C.border,flexDirection:'row',alignItems:'center',paddingHorizontal:14,marginBottom:14}}>
          <Text style={{color:C.dim,fontSize:T.base,marginRight:8}}>S</Text>
          <TextInput value={search} onChangeText={setSearch} placeholder="Search name or role..." placeholderTextColor={C.dimmer} style={{flex:1,color:C.text,fontSize:T.base,height:44}}/>
          {search.length>0&&<TouchableOpacity onPress={()=>setSearch('')}><Text style={{color:C.dim,fontSize:T.base,fontWeight:'700'}}>x</Text></TouchableOpacity>}
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:16}}>
          <View style={{flexDirection:'row'}}>
            {['all','available','booked','on-set','unavailable'].map(s=><PBtn key={s} onPress={()=>setFilter(s)} style={{backgroundColor:filter===s?C.gold:C.card,borderRadius:R.pill,paddingHorizontal:14,paddingVertical:9,marginRight:8,borderWidth:1,borderColor:filter===s?C.gold:C.border}}>
              <Text style={{color:filter===s?C.bg:C.sub,fontSize:T.sm,fontWeight:'600',textTransform:'capitalize'}}>{s==='on-set'?'On Set':s}</Text>
            </PBtn>)}
          </View>
        </ScrollView>
        {filtered.length===0?<Empty icon="C" title="No crew members" sub="Tap + Add to build your roster"/>
          :filtered.map(m=><Card key={m.id} onPress={()=>openEdit(m)}>
            <View style={{flexDirection:'row',alignItems:'center'}}>
              <Avi name={m.name} size={46} color={C.gold}/>
              <View style={{flex:1,marginLeft:14}}><Text style={{color:C.text,fontSize:T.base,fontWeight:'700'}}>{m.name}</Text><Text style={{color:C.dim,fontSize:T.sm,marginTop:2}}>{m.role}</Text><View style={{flexDirection:'row',alignItems:'center',marginTop:4}}><Stars rating={m.rating} size={12}/><Text style={{color:C.dim,fontSize:T.xs,marginLeft:6}}>{m.rating.toFixed(1)}</Text></View></View>
              <View style={{alignItems:'flex-end'}}><Badge status={m.status}/><Text style={{color:C.gold,fontSize:T.sm,fontWeight:'700',marginTop:8}}>{'$'+m.rate+'/day'}</Text></View>
            </View>
            {m.tags&&m.tags.length>0&&<View style={{flexDirection:'row',marginTop:10}}>{m.tags.map(tag=><Chip key={tag} label={tag} color={C.purple}/>)}</View>}
            <TouchableOpacity onPress={()=>deleteCrew(m.id)} style={{marginTop:10,alignSelf:'flex-end'}}><Text style={{color:C.red,fontSize:T.xs,fontWeight:'600'}}>Remove</Text></TouchableOpacity>
          </Card>)}
        <View style={{height:30}}/>
      </ScrollView>
      <Sheet visible={sheet} onClose={()=>setSheet(false)} title={edit?'Edit Crew Member':'Add Crew Member'}>
        <FInput label="Full Name" value={form.name} onChangeText={v=>setForm(f=>({...f,name:v}))} placeholder="Alex Rivera"/>
        <FInput label="Role / Position" value={form.role} onChangeText={v=>setForm(f=>({...f,role:v}))} placeholder="Director of Photography"/>
        <FInput label="Day Rate (USD)" value={form.rate} onChangeText={v=>setForm(f=>({...f,rate:v}))} placeholder="650" kbType="numeric"/>
        <FInput label="Email" value={form.email} onChangeText={v=>setForm(f=>({...f,email:v}))} placeholder="alex@email.com" kbType="email-address"/>
        <FInput label="Phone" value={form.phone} onChangeText={v=>setForm(f=>({...f,phone:v}))} placeholder="+1 310-000-0000" kbType="phone-pad"/>
        <Text style={{color:C.sub,fontSize:T.xs,fontWeight:'700',marginBottom:8,textTransform:'uppercase',letterSpacing:1}}>Status</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:14}}>
          <View style={{flexDirection:'row'}}>{['available','booked','on-set','unavailable'].map(s=><PBtn key={s} onPress={()=>setForm(f=>({...f,status:s}))} style={{backgroundColor:form.status===s?C.gold:C.card,borderRadius:R.pill,paddingHorizontal:12,paddingVertical:9,marginRight:8,borderWidth:1,borderColor:form.status===s?C.gold:C.border}}><Text style={{color:form.status===s?C.bg:C.sub,fontSize:T.xs,fontWeight:'600',textTransform:'capitalize'}}>{s==='on-set'?'On Set':s}</Text></PBtn>)}</View>
        </ScrollView>
        <FInput label="Bio / Notes" value={form.bio} onChangeText={v=>setForm(f=>({...f,bio:v}))} placeholder="Brief description..." multi lines={3}/>
        <Btn label={edit?'Save Changes':'Add to Roster'} onPress={save} color={C.gold} style={{marginTop:8}}/>
        {edit&&<Btn label="Remove from Roster" onPress={()=>{setSheet(false);deleteCrew(edit.id);}} color={C.red} outline style={{marginTop:10}}/>}
      </Sheet>
    </SafeAreaView>
  );
}


function ScheduleScreen({store}) {
  const {shifts,addShift,updateShift,deleteShift}=store;
  const [sheet,setSheet]=useState(false);const [edit,setEdit]=useState(null);
  const [form,setForm]=useState({title:'',date:today(),start:'09:00',end:'18:00',location:'',notes:''});
  const openNew=()=>{setEdit(null);setForm({title:'',date:today(),start:'09:00',end:'18:00',location:'',notes:''});setSheet(true);};
  const openEdit=s=>{setEdit(s);setForm({title:s.title,date:s.date,start:s.start,end:s.end,location:s.location,notes:s.notes});setSheet(true);};
  const save=()=>{if(!form.title.trim()){Alert.alert('Required','Shift title is required.');return;}edit?updateShift({...edit,...form}):addShift({...form,projectId:'',crewIds:[]});setSheet(false);};
  const sorted=[...shifts].sort((a,b)=>a.date.localeCompare(b.date));
  const grouped={};sorted.forEach(s=>{if(!grouped[s.date])grouped[s.date]=[];grouped[s.date].push(s);});
  return (
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <ScrollView contentContainerStyle={{padding:20}} showsVerticalScrollIndicator={false}>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:20}}>
          <Text style={{color:C.text,fontSize:T.xxl,fontWeight:'900',letterSpacing:-0.5}}>Schedule</Text>
          <Btn label="+ New" onPress={openNew} color={C.teal} style={{paddingVertical:10,paddingHorizontal:18}}/>
        </View>
        {shifts.length===0?<Empty icon="S" title="No shifts scheduled" sub="Tap + New to add a shift to the calendar"/>
          :Object.keys(grouped).sort().map(date=><View key={date}>
            <View style={{flexDirection:'row',alignItems:'center',marginBottom:8,marginTop:10}}>
              <View style={{backgroundColor:C.teal+'14',borderRadius:R.lg,paddingHorizontal:12,paddingVertical:5,borderWidth:1,borderColor:C.teal+'35'}}><Text style={{color:C.teal,fontSize:T.sm,fontWeight:'700'}}>{fmtDate(date)}</Text></View>
              <View style={{flex:1,height:1,backgroundColor:C.border,marginLeft:10}}/>
            </View>
            {grouped[date].map(s=><Card key={s.id} onPress={()=>openEdit(s)}>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'}}>
                <View style={{flex:1,marginRight:12}}><Text style={{color:C.text,fontSize:T.base,fontWeight:'700'}}>{s.title}</Text><Text style={{color:C.teal,fontSize:T.sm,fontWeight:'600',marginTop:4}}>{s.start} - {s.end}</Text><Text style={{color:C.dim,fontSize:T.sm,marginTop:3}}>{s.location}</Text>{s.notes?<Text style={{color:C.sub,fontSize:T.xs,marginTop:6,lineHeight:17}} numberOfLines={2}>{s.notes}</Text>:null}</View>
                <TouchableOpacity onPress={()=>deleteShift(s.id)} style={{padding:4}}><Text style={{color:C.red,fontSize:T.xs,fontWeight:'600'}}>Remove</Text></TouchableOpacity>
              </View>
            </Card>)}
          </View>)}
        <View style={{height:30}}/>
      </ScrollView>
      <Sheet visible={sheet} onClose={()=>setSheet(false)} title={edit?'Edit Shift':'New Shift'}>
        <FInput label="Shift Title" value={form.title} onChangeText={v=>setForm(f=>({...f,title:v}))} placeholder="e.g. Scene 12 Interior"/>
        <FInput label="Date (YYYY-MM-DD)" value={form.date} onChangeText={v=>setForm(f=>({...f,date:v}))} placeholder="2025-03-10"/>
        <View style={{flexDirection:'row'}}><View style={{flex:1,marginRight:8}}><FInput label="Start" value={form.start} onChangeText={v=>setForm(f=>({...f,start:v}))} placeholder="09:00"/></View><View style={{flex:1,marginLeft:8}}><FInput label="End" value={form.end} onChangeText={v=>setForm(f=>({...f,end:v}))} placeholder="18:00"/></View></View>
        <FInput label="Location" value={form.location} onChangeText={v=>setForm(f=>({...f,location:v}))} placeholder="Stage 14, Warner Bros"/>
        <FInput label="Notes" value={form.notes} onChangeText={v=>setForm(f=>({...f,notes:v}))} placeholder="Any important details..." multi lines={3}/>
        <Btn label={edit?'Save Changes':'Add Shift'} onPress={save} color={C.teal} style={{marginTop:8}}/>
        {edit&&<Btn label="Remove Shift" onPress={()=>{setSheet(false);deleteShift(edit.id);}} color={C.red} outline style={{marginTop:10}}/>}
      </Sheet>
    </SafeAreaView>
  );
}

function MessagesScreen({store,onBack}) {
  const {threads,sendMessage,addThread}=store;
  const [active,setActive]=useState(null);const [input,setInput]=useState('');
  const [newSheet,setNewSheet]=useState(false);const [newName,setNewName]=useState('');
  const scrollRef=useRef(null);
  const send=()=>{if(!input.trim()||!active)return;sendMessage(active.id,input.trim());setInput('');setTimeout(()=>scrollRef.current&&scrollRef.current.scrollToEnd({animated:true}),100);};
  const createThread=()=>{if(!newName.trim()){Alert.alert('Required','Thread name is required.');return;}addThread({name:newName.trim(),avatar:newName.trim()[0].toUpperCase(),preview:'',projectId:''});setNewName('');setNewSheet(false);};
  const live=active?threads.find(t=>t.id===active.id)||active:null;
  if(live) return (
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <View style={{flexDirection:'row',alignItems:'center',paddingHorizontal:16,paddingVertical:12,borderBottomWidth:1,borderBottomColor:C.border}}>
        <TouchableOpacity onPress={()=>setActive(null)} style={{width:34,height:34,borderRadius:17,backgroundColor:C.card,borderWidth:1,borderColor:C.border,alignItems:'center',justifyContent:'center',marginRight:14}}>
          <Text style={{color:C.teal,fontSize:T.base,fontWeight:'700'}}>{'<'}</Text>
        </TouchableOpacity>
        <Avi name={live.name} size={36} color={C.blue}/>
        <Text style={{color:C.text,fontSize:T.base,fontWeight:'700',marginLeft:12,flex:1}} numberOfLines={1}>{live.name}</Text>
      </View>
      <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}}>
        <ScrollView ref={scrollRef} contentContainerStyle={{padding:16}} showsVerticalScrollIndicator={false} onContentSizeChange={()=>scrollRef.current&&scrollRef.current.scrollToEnd({animated:false})}>
          {live.messages.map(msg=><View key={msg.id} style={{alignItems:msg.mine?'flex-end':'flex-start',marginBottom:12}}>
            {!msg.mine&&<Text style={{color:C.dim,fontSize:T.xs,marginBottom:4,marginLeft:4}}>{msg.sender}</Text>}
            <View style={{maxWidth:'78%',backgroundColor:msg.mine?C.teal:C.card,borderRadius:18,borderBottomRightRadius:msg.mine?4:18,borderBottomLeftRadius:msg.mine?18:4,padding:12,borderWidth:msg.mine?0:1,borderColor:C.border}}>
              <Text style={{color:msg.mine?C.bg:C.text,fontSize:T.base,lineHeight:20}}>{msg.text}</Text>
              <Text style={{color:msg.mine?C.bg+'AA':C.dim,fontSize:T.xs,marginTop:4,textAlign:msg.mine?'right':'left'}}>{msg.ts}</Text>
            </View>
          </View>)}
        </ScrollView>
        <View style={{flexDirection:'row',alignItems:'flex-end',padding:12,borderTopWidth:1,borderTopColor:C.border,backgroundColor:C.bg}}>
          <TextInput value={input} onChangeText={setInput} placeholder="Message..." placeholderTextColor={C.dimmer} multiline style={{flex:1,backgroundColor:C.card,borderRadius:22,borderWidth:1,borderColor:C.border,color:C.text,fontSize:T.base,paddingHorizontal:16,paddingVertical:10,maxHeight:100,marginRight:10}}/>
          <PBtn onPress={send} style={{backgroundColor:C.teal,borderRadius:22,width:44,height:44,alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:C.bg,fontSize:T.base,fontWeight:'800'}}>^</Text>
          </PBtn>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
  return (
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <ScreenHeader title="Messages" onBack={onBack} accent={C.blue}/>
      <ScrollView contentContainerStyle={{padding:20}} showsVerticalScrollIndicator={false}>
        <View style={{flexDirection:'row',justifyContent:'flex-end',marginBottom:16}}>
          <Btn label="+ Thread" onPress={()=>setNewSheet(true)} color={C.blue} style={{paddingVertical:10,paddingHorizontal:18}}/>
        </View>
        {threads.length===0?<Empty icon="M" title="No messages yet" sub="Create a thread to message your team"/>
          :threads.map(t=><PBtn key={t.id} onPress={()=>setActive(t)} style={{backgroundColor:C.card,borderRadius:R.xl,borderWidth:1,borderColor:t.unread>0?C.blue+'55':C.border,padding:16,marginBottom:10}}>
            <View style={{flexDirection:'row',alignItems:'center'}}>
              <Avi name={t.name} size={46} color={C.blue}/>
              <View style={{flex:1,marginLeft:14}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}><Text style={{color:C.text,fontSize:T.base,fontWeight:'700',flex:1}} numberOfLines={1}>{t.name}</Text><Text style={{color:C.dim,fontSize:T.xs,marginLeft:8}}>{t.ts}</Text></View>
                <Text style={{color:t.unread>0?C.text:C.dim,fontSize:T.sm,marginTop:4}} numberOfLines={1}>{t.preview}</Text>
              </View>
              {t.unread>0&&<View style={{backgroundColor:C.blue,borderRadius:12,minWidth:22,height:22,alignItems:'center',justifyContent:'center',marginLeft:10,paddingHorizontal:5}}><Text style={{color:'#fff',fontSize:T.xs,fontWeight:'700'}}>{t.unread}</Text></View>}
            </View>
          </PBtn>)}
        <View style={{height:30}}/>
      </ScrollView>
      <Sheet visible={newSheet} onClose={()=>setNewSheet(false)} title="New Thread">
        <FInput label="Thread Name" value={newName} onChangeText={setNewName} placeholder="e.g. Horizon Core Team"/>
        <Btn label="Create Thread" onPress={createThread} color={C.blue} style={{marginTop:8}}/>
      </Sheet>
    </SafeAreaView>
  );
}


function InvoicesScreen({store,onBack}) {
  const {invoices,addInvoice,updateInvoice,deleteInvoice}=store;
  const [sheet,setSheet]=useState(false);const [edit,setEdit]=useState(null);const [uploading,setUploading]=useState(false);const [filter,setFilter]=useState('all');
  const [form,setForm]=useState({client:'',project:'',amount:'',status:'draft',due:'',desc:'',attachments:[]});
  const openNew=()=>{setEdit(null);setForm({client:'',project:'',amount:'',status:'draft',due:'',desc:'',attachments:[]});setSheet(true);};
  const openEdit=inv=>{setEdit(inv);setForm({client:inv.client,project:inv.project,amount:String(inv.amount),status:inv.status,due:inv.due,desc:inv.items[0]?inv.items[0].desc:'',attachments:inv.attachments||[]});setSheet(true);};
  const save=()=>{if(!form.client.trim()){Alert.alert('Required','Client name is required.');return;}const data={client:form.client,project:form.project,amount:parseFloat(form.amount)||0,status:form.status,due:form.due,issued:today(),items:[{desc:form.desc||'Services',qty:1,rate:parseFloat(form.amount)||0}],attachments:form.attachments};edit?updateInvoice({...edit,...data}):addInvoice(data);setSheet(false);};
  const simulateUpload=()=>{setUploading(true);const files=['Invoice_Backup.pdf','Contract_Signed.pdf','Receipt_2025.pdf','PO_Reference.pdf'];const file=files[Math.floor(Math.random()*files.length)];setTimeout(()=>{setUploading(false);setForm(f=>({...f,attachments:[...(f.attachments||[]),file]}));Alert.alert('Attached',file+' attached successfully.');},1200);};
  const totals={draft:0,pending:0,paid:0,overdue:0};invoices.forEach(i=>{if(totals[i.status]!==undefined)totals[i.status]+=i.amount;});
  const visible=filter==='all'?invoices:invoices.filter(i=>i.status===filter);
  return (
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <ScreenHeader title="Invoices" onBack={onBack} accent={C.green}/>
      <ScrollView contentContainerStyle={{padding:20}} showsVerticalScrollIndicator={false}>
        <View style={{flexDirection:'row',justifyContent:'flex-end',marginBottom:16}}>
          <Btn label="+ New" onPress={openNew} color={C.green} style={{paddingVertical:10,paddingHorizontal:18}}/>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:16}}>
          <View style={{flexDirection:'row'}}>
            {[{l:'Paid',v:totals.paid,c:C.green},{l:'Pending',v:totals.pending,c:C.gold},{l:'Overdue',v:totals.overdue,c:C.red},{l:'Draft',v:totals.draft,c:C.muted}].map(item=><View key={item.l} style={{backgroundColor:C.card,borderRadius:R.xl,borderWidth:1,borderColor:item.c+'35',padding:14,marginRight:10,minWidth:100,alignItems:'center'}}>
              <Text style={{color:item.c,fontSize:T.lg,fontWeight:'800'}}>{fmtMoney(item.v)}</Text><Text style={{color:C.dim,fontSize:T.xs,marginTop:2}}>{item.l}</Text>
            </View>)}
          </View>
        </ScrollView>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:16}}>
          <View style={{flexDirection:'row'}}>
            {['all','pending','paid','overdue','draft'].map(f=><PBtn key={f} onPress={()=>setFilter(f)} style={{backgroundColor:filter===f?C.green:C.card,borderRadius:R.pill,paddingHorizontal:14,paddingVertical:9,marginRight:8,borderWidth:1,borderColor:filter===f?C.green:C.border}}>
              <Text style={{color:filter===f?C.bg:C.sub,fontSize:T.sm,fontWeight:'600',textTransform:'capitalize'}}>{f}</Text>
            </PBtn>)}
          </View>
        </ScrollView>
        {visible.length===0?<Empty icon="I" title="No invoices" sub="Tap + New to create your first invoice"/>
          :visible.map(inv=><Card key={inv.id} onPress={()=>openEdit(inv)}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:8}}>
              <View style={{flex:1,marginRight:10}}><Text style={{color:C.text,fontSize:T.base,fontWeight:'700'}}>{inv.number}</Text><Text style={{color:C.dim,fontSize:T.sm,marginTop:2}}>{inv.client}</Text><Text style={{color:C.sub,fontSize:T.xs,marginTop:1}}>{inv.project}</Text></View>
              <View style={{alignItems:'flex-end'}}><Badge status={inv.status}/><Text style={{color:C.text,fontSize:T.lg,fontWeight:'800',marginTop:8}}>{fmtMoney(inv.amount)}</Text></View>
            </View>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:8}}>
              <Text style={{color:C.dim,fontSize:T.xs}}>Due: {inv.due||'N/A'}</Text>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                {inv.attachments&&inv.attachments.length>0&&<Text style={{color:C.purple,fontSize:T.xs,marginRight:12}}>{inv.attachments.length} file{inv.attachments.length>1?'s':''}</Text>}
                <TouchableOpacity onPress={()=>deleteInvoice(inv.id)}><Text style={{color:C.red,fontSize:T.xs,fontWeight:'600'}}>Delete</Text></TouchableOpacity>
              </View>
            </View>
          </Card>)}
        <View style={{height:30}}/>
      </ScrollView>
      <Sheet visible={sheet} onClose={()=>setSheet(false)} title={edit?'Edit Invoice':'New Invoice'}>
        <FInput label="Client" value={form.client} onChangeText={v=>setForm(f=>({...f,client:v}))} placeholder="Apex Studios"/>
        <FInput label="Project" value={form.project} onChangeText={v=>setForm(f=>({...f,project:v}))} placeholder="Horizon Feature Film"/>
        <FInput label="Amount (USD)" value={form.amount} onChangeText={v=>setForm(f=>({...f,amount:v}))} placeholder="24500" kbType="numeric"/>
        <FInput label="Due Date (YYYY-MM-DD)" value={form.due} onChangeText={v=>setForm(f=>({...f,due:v}))} placeholder="2025-03-31"/>
        <FInput label="Description" value={form.desc} onChangeText={v=>setForm(f=>({...f,desc:v}))} placeholder="Services rendered..." multi lines={2}/>
        <Text style={{color:C.sub,fontSize:T.xs,fontWeight:'700',marginBottom:8,textTransform:'uppercase',letterSpacing:1}}>Status</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:14}}>
          <View style={{flexDirection:'row'}}>{['draft','pending','paid','overdue'].map(s=><PBtn key={s} onPress={()=>setForm(f=>({...f,status:s}))} style={{backgroundColor:form.status===s?C.green:C.card,borderRadius:R.pill,paddingHorizontal:12,paddingVertical:9,marginRight:8,borderWidth:1,borderColor:form.status===s?C.green:C.border}}><Text style={{color:form.status===s?C.bg:C.sub,fontSize:T.xs,fontWeight:'600',textTransform:'capitalize'}}>{s}</Text></PBtn>)}</View>
        </ScrollView>
        <TouchableOpacity onPress={simulateUpload} disabled={uploading} style={{backgroundColor:C.purple+'14',borderRadius:R.lg,borderWidth:1.5,borderColor:C.purple+'45',padding:14,alignItems:'center',marginBottom:14}}>
          <Text style={{color:uploading?C.dim:C.purple,fontSize:T.sm,fontWeight:'700'}}>{uploading?'Uploading...':'Attach File'}</Text>
        </TouchableOpacity>
        {form.attachments&&form.attachments.map((a,i)=><View key={i} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',backgroundColor:C.card,borderRadius:R.md,padding:10,marginBottom:6,borderWidth:1,borderColor:C.border}}>
          <Text style={{color:C.text,fontSize:T.sm}}>{a}</Text>
          <TouchableOpacity onPress={()=>setForm(f=>({...f,attachments:f.attachments.filter((_,j)=>j!==i)}))}><Text style={{color:C.red,fontSize:T.sm,fontWeight:'700'}}>x</Text></TouchableOpacity>
        </View>)}
        <Btn label={edit?'Save Changes':'Create Invoice'} onPress={save} color={C.green} style={{marginTop:8}}/>
        {edit&&<Btn label="Delete Invoice" onPress={()=>{setSheet(false);deleteInvoice(edit.id);}} color={C.red} outline style={{marginTop:10}}/>}
      </Sheet>
    </SafeAreaView>
  );
}

function ReportsScreen({store,onBack}) {
  const {projects,invoices,crew}=store;
  const totalBudget=projects.reduce((s,p)=>s+p.budget,0);const totalSpent=projects.reduce((s,p)=>s+p.spent,0);
  const totalInvoiced=invoices.reduce((s,i)=>s+i.amount,0);const totalPaid=invoices.filter(i=>i.status==='paid').reduce((s,i)=>s+i.amount,0);
  const crewOnSet=crew.filter(c=>c.status==='on-set').length;const crewBooked=crew.filter(c=>c.status==='booked').length;const crewAvail=crew.filter(c=>c.status==='available').length;
  const utilPct=crew.length>0?Math.round(((crewOnSet+crewBooked)/crew.length)*100):0;
  const byStatus={};projects.forEach(p=>{byStatus[p.status]=(byStatus[p.status]||0)+1;});
  const Row=({label,value,color=C.text})=><View style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:10,borderBottomWidth:1,borderBottomColor:C.border}}><Text style={{color:C.dim,fontSize:T.sm}}>{label}</Text><Text style={{color,fontSize:T.sm,fontWeight:'700'}}>{value}</Text></View>;
  return (
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <ScreenHeader title="Reports" onBack={onBack} accent={C.purple}/>
      <ScrollView contentContainerStyle={{padding:20}} showsVerticalScrollIndicator={false}>
        <Card><SecHead title="Financial Summary"/>
          <Row label="Total Budget" value={fmtMoney(totalBudget)}/>
          <Row label="Total Spent" value={fmtMoney(totalSpent)} color={C.gold}/>
          <Row label="Total Invoiced" value={fmtMoney(totalInvoiced)} color={C.teal}/>
          <Row label="Total Collected" value={fmtMoney(totalPaid)} color={C.green}/>
          <View style={{marginTop:14}}><View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:7}}><Text style={{color:C.dim,fontSize:T.sm}}>Budget Utilisation</Text><Text style={{color:totalSpent/totalBudget>0.85?C.red:C.green,fontSize:T.sm,fontWeight:'700'}}>{Math.round((totalSpent/Math.max(totalBudget,1))*100)}%</Text></View><Bar value={(totalSpent/Math.max(totalBudget,1))*100} color={totalSpent/totalBudget>0.85?C.red:C.teal} h={8}/></View>
        </Card>
        <Card><SecHead title="Crew Utilisation"/>
          <Row label="On Set Now" value={String(crewOnSet)} color={C.gold}/>
          <Row label="Booked" value={String(crewBooked)} color={C.blue}/>
          <Row label="Available" value={String(crewAvail)} color={C.green}/>
          <Row label="Total Roster" value={String(crew.length)}/>
          <View style={{marginTop:14}}><View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:7}}><Text style={{color:C.dim,fontSize:T.sm}}>Utilisation Rate</Text><Text style={{color:C.teal,fontSize:T.sm,fontWeight:'700'}}>{utilPct}%</Text></View><Bar value={utilPct} color={C.teal} h={8}/></View>
        </Card>
        <Card><SecHead title="Project Pipeline"/>
          {Object.entries(byStatus).map(([status,count])=><View key={status} style={{flexDirection:'row',alignItems:'center',marginBottom:12}}>
            <Badge status={status}/><View style={{flex:1,marginLeft:12}}><Bar value={(count/Math.max(projects.length,1))*100} color={status==='active'?C.teal:status==='planning'?C.blue:C.muted} h={6}/></View>
            <Text style={{color:C.text,fontSize:T.sm,fontWeight:'700',marginLeft:12,minWidth:16,textAlign:'right'}}>{count}</Text>
          </View>)}
          {projects.length===0&&<Text style={{color:C.dim,fontSize:T.sm,textAlign:'center',paddingVertical:12}}>No projects yet</Text>}
        </Card>
        <View style={{height:30}}/>
      </ScrollView>
    </SafeAreaView>
  );
}


function PortalScreen({store,userInfo,onBack}) {
  const {invoices,shifts}=store;
  const earned=invoices.filter(i=>i.status==='paid').reduce((s,i)=>s+i.amount,0);
  const pending=invoices.filter(i=>i.status==='pending').reduce((s,i)=>s+i.amount,0);
  const overdue=invoices.filter(i=>i.status==='overdue').reduce((s,i)=>s+i.amount,0);
  const name=userInfo?userInfo.name:'Freelancer';const role=userInfo?userInfo.role:'Crew Member';
  return (
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <ScreenHeader title="My Portal" onBack={onBack} accent={C.gold}/>
      <ScrollView contentContainerStyle={{padding:20}} showsVerticalScrollIndicator={false}>
        <Card style={{alignItems:'center',paddingVertical:30,marginBottom:16}}>
          <Avi name={name} size={76} color={C.gold}/>
          <Text style={{color:C.text,fontSize:T.xl,fontWeight:'900',marginTop:16,letterSpacing:-0.5}}>{name}</Text>
          <Text style={{color:C.dim,fontSize:T.base,marginTop:4}}>{role}</Text>
          <View style={{backgroundColor:C.gold+'18',borderRadius:R.pill,borderWidth:1,borderColor:C.gold+'50',paddingHorizontal:16,paddingVertical:6,marginTop:14}}>
            <Text style={{color:C.gold,fontSize:T.xs,fontWeight:'800',letterSpacing:1.5,textTransform:'uppercase'}}>Freelancer</Text>
          </View>
        </Card>
        <Card><SecHead title="Earnings Overview"/>
          <View style={{flexDirection:'row'}}><KPI label="Earned" value={'$'+fmt(earned)} color={C.gold} sub="all time"/><View style={{width:10}}/><KPI label="Pending" value={'$'+fmt(pending)} color={C.green} sub="awaiting"/><View style={{width:10}}/><KPI label="Overdue" value={'$'+fmt(overdue)} color={C.red} sub="action req."/></View>
        </Card>
        <Card><SecHead title="Rate Card"/>
          {[{label:'Day Rate',value:'$650 / day'},{label:'Half Day',value:'$375'},{label:'Overtime',value:'$85 / hr'},{label:'Kit Fee',value:'$200 / day'}].map(item=><View key={item.label} style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:10,borderBottomWidth:1,borderBottomColor:C.border}}><Text style={{color:C.dim,fontSize:T.sm}}>{item.label}</Text><Text style={{color:C.text,fontSize:T.sm,fontWeight:'700'}}>{item.value}</Text></View>)}
        </Card>
        <Card><SecHead title="Work History"/>
          {[{l:'Shifts Completed',v:String(shifts.length),c:C.text},{l:'Invoices Raised',v:String(invoices.length),c:C.text},{l:'Collection Rate',v:(invoices.length>0?Math.round(invoices.filter(i=>i.status==='paid').length/invoices.length*100):0)+'%',c:C.green}].map(row=><View key={row.l} style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:10,borderBottomWidth:1,borderBottomColor:C.border}}><Text style={{color:C.dim,fontSize:T.sm}}>{row.l}</Text><Text style={{color:row.c,fontSize:T.sm,fontWeight:'700'}}>{row.v}</Text></View>)}
        </Card>
        <View style={{height:30}}/>
      </ScrollView>
    </SafeAreaView>
  );
}

function MoreScreen({store,userType,userInfo,onLogout}) {
  const isBiz=userType==='business';const accent=isBiz?C.teal:C.gold;
  const name=isBiz?'Production Company':(userInfo?userInfo.name:'Freelancer');
  const role=isBiz?'Business Account':(userInfo?userInfo.role:'Crew Member');
  const doSignOut=()=>Alert.alert('Sign Out','Are you sure you want to sign out?',[{text:'Cancel',style:'cancel'},{text:'Sign Out',style:'destructive',onPress:onLogout}]);
  return (
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <StatusBar barStyle="light-content"/>
      <ScrollView contentContainerStyle={{padding:20}} showsVerticalScrollIndicator={false}>
        <Text style={{color:C.text,fontSize:T.xxl,fontWeight:'900',letterSpacing:-0.5,marginBottom:20}}>More</Text>
        <Card style={{marginBottom:20}}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Avi name={name} size={56} color={accent}/>
            <View style={{flex:1,marginLeft:14}}>
              <Text style={{color:C.text,fontSize:T.base,fontWeight:'700'}}>{name}</Text>
              <Text style={{color:C.dim,fontSize:T.sm,marginTop:2}}>{role}</Text>
              <View style={{backgroundColor:accent+'18',borderRadius:R.pill,borderWidth:1,borderColor:accent+'45',paddingHorizontal:10,paddingVertical:4,alignSelf:'flex-start',marginTop:8}}>
                <Text style={{color:accent,fontSize:T.xs,fontWeight:'800',letterSpacing:1.2,textTransform:'uppercase'}}>{isBiz?'Business':'Freelancer'}</Text>
              </View>
            </View>
          </View>
        </Card>
        {[{label:'Notifications',sub:'Manage push and email alerts'},{label:'Privacy',sub:'Data, security and privacy settings'},{label:'Help & Support',sub:'Get help or contact the team'},{label:'About CrewDesk',sub:'Version 1.0.0 - MVP1 Release'}].map(item=>(
          <PBtn key={item.label} onPress={()=>{}} style={{backgroundColor:C.card,borderRadius:R.xl,borderWidth:1,borderColor:C.border,padding:16,marginBottom:10,flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
            <View><Text style={{color:C.text,fontSize:T.base,fontWeight:'600'}}>{item.label}</Text><Text style={{color:C.dim,fontSize:T.sm,marginTop:2}}>{item.sub}</Text></View>
            <Text style={{color:C.dim,fontSize:T.lg}}>{'>'}</Text>
          </PBtn>
        ))}
        <View style={{height:20}}/>
        <Btn label="Sign Out" onPress={doSignOut} color={C.red} outline style={{marginBottom:14}}/>
        <Text style={{color:C.dimmer,fontSize:T.xs,textAlign:'center',lineHeight:18}}>
          CrewDesk MVP1  -  Production Management Platform
        </Text>
        <View style={{height:50}}/>
      </ScrollView>
    </SafeAreaView>
  );
}

const BIZ_TABS=[{key:'Home',label:'Home'},{key:'Projects',label:'Projects'},{key:'Crew',label:'Crew'},{key:'Schedule',label:'Schedule'},{key:'More',label:'More'}];
const FREE_TABS=[{key:'FHome',label:'Home'},{key:'Schedule',label:'Schedule'},{key:'Invoices',label:'Invoices'},{key:'More',label:'More'}];

function TabBar({tabs,active,onSelect,accent}) {
  return (
    <View style={{flexDirection:'row',backgroundColor:C.surf,borderTopWidth:1,borderTopColor:C.border,paddingBottom:Platform.OS==='ios'?24:12,paddingTop:10,paddingHorizontal:4}}>
      {tabs.map(tab=>{const on=tab.key===active;return (
        <TouchableOpacity key={tab.key} onPress={()=>onSelect(tab.key)} style={{flex:1,alignItems:'center'}} activeOpacity={0.7}>
          <View style={{width:on?32:0,height:3,borderRadius:2,backgroundColor:accent,marginBottom:6}}/>
          <Text style={{color:on?accent:C.muted,fontSize:T.xs,fontWeight:on?'800':'500',letterSpacing:on?0.4:0}}>{tab.label}</Text>
        </TouchableOpacity>
      );})}
    </View>
  );
}

export default function App() {
  const store=useStore();
  const [userType,setUserType]=useState(null);const [userInfo,setUserInfo]=useState(null);const [activeTab,setActiveTab]=useState(null);
  const handleLogin=type=>{setUserType(type);setUserInfo({name:type==='business'?'Production Co.':'Alex Rivera',role:type==='business'?'Business Account':'Director of Photography'});setActiveTab(type==='business'?'Home':'FHome');};
  const handleLogout=()=>{setUserType(null);setUserInfo(null);setActiveTab(null);};
  const navigate=screen=>setActiveTab(screen);
  if(!userType) return <LoginScreen onLogin={handleLogin}/>;
  const isBiz=userType==='business';const accent=isBiz?C.teal:C.gold;const tabs=isBiz?BIZ_TABS:FREE_TABS;
  const goHome=()=>setActiveTab(isBiz?'Home':'FHome');
  const renderScreen=()=>{switch(activeTab){
    case 'Home':     return <HomeScreen     store={store} navigate={navigate}/>;
    case 'FHome':    return <FHomeScreen    store={store} navigate={navigate} userInfo={userInfo}/>;
    case 'Projects': return <ProjectsScreen store={store}/>;
    case 'Crew':     return <CrewScreen     store={store}/>;
    case 'Schedule': return <ScheduleScreen store={store}/>;
    case 'Messages': return <MessagesScreen store={store} onBack={goHome}/>;
    case 'Invoices': return <InvoicesScreen store={store} onBack={goHome}/>;
    case 'Reports':  return <ReportsScreen  store={store} onBack={goHome}/>;
    case 'Portal':   return <PortalScreen   store={store} userInfo={userInfo} onBack={goHome}/>;
    case 'More':     return <MoreScreen     store={store} userType={userType} userInfo={userInfo} onLogout={handleLogout}/>;
    default: return isBiz?<HomeScreen store={store} navigate={navigate}/>:<FHomeScreen store={store} navigate={navigate} userInfo={userInfo}/>;
  }};
  const tabHighlight=tabs.find(t=>t.key===activeTab)?activeTab:(isBiz?'Home':'FHome');
  return (
    <View style={{flex:1,backgroundColor:C.bg}}>
      <View style={{flex:1}}>{renderScreen()}</View>
      <TabBar tabs={tabs} active={tabHighlight} onSelect={setActiveTab} accent={accent}/>
    </View>
  );
}
