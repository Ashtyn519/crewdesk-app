import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Modal, Alert, Animated, StatusBar, ActivityIndicator, Dimensions
} from 'react-native';

const WIN = Dimensions.get('window');
const IS_WEB_WIDE = WIN.width >= 768;

const C = {
  bg:'#080C14',surface:'#0F1825',surf2:'#162030',surf3:'#1C2840',border:'#1E2D45',
  text:'#EEF2FF',sub:'#6B7FA3',dimmer:'#3A4A6B',teal:'#00C4A0',gold:'#F0A500',
  red:'#F04060',blue:'#3B9EF8',purple:'#8B6CF7',green:'#18C97A',orange:'#F07030',
};

function fmt(n){ if(!n) return '$0'; return n>=1000000?'$'+(n/1000000).toFixed(1)+'M':n>=1000?'$'+(n/1000).toFixed(0)+'k':'$'+n; }
function fmtFull(n){ return '$'+Number(n||0).toLocaleString(); }

const TRIAL_DAYS = 3;
const BUSINESS_TYPES = ['Agency','Studio','Consultancy','Trades & Construction','Events & Hospitality','Technology','Healthcare','Education','Retail & E-Commerce','Finance & Legal','Other'];
const JOB_CATEGORIES = ['Design','Development','Marketing','Consulting','Events','Construction','Healthcare','Legal','Accounting','Education','Other'];
const JOB_STATUSES = ['Planning','Pre-Production','In Progress','Post-Production','Completed','Cancelled'];

const SEED_JOBS = [
  {id:'j1',name:'Q2 Website Redesign',client:'Apex Digital',status:'In Progress',budget:18000,team:[],expenses:[{id:'e1',desc:'Design Software',amount:299,date:'2026-03-01'}],notes:'Delivery due end of March.',category:'Design'},
  {id:'j2',name:'Brand Identity Package',client:'Nova Retail',status:'Pre-Production',budget:8500,team:[],expenses:[],notes:'Logo, brand guide, print assets.',category:'Branding'},
  {id:'j3',name:'Social Media Campaign',client:'Peak Nutrition',status:'In Progress',budget:4200,team:[],expenses:[],notes:'12-week campaign, 3 platforms.',category:'Marketing'},
  {id:'j4',name:'Annual Report 2025',client:'BridgePoint Corp',status:'Completed',budget:12000,team:[],expenses:[],notes:'Delivered and signed off.',category:'Design'},
  {id:'j5',name:'E-commerce Build',client:'Velour Store',status:'Planning',budget:22000,team:[],expenses:[],notes:'Shopify platform, full build.',category:'Development'},
  {id:'j6',name:'SEO & Content Strategy',client:'Lumen Finance',status:'Post-Production',budget:6000,team:[],expenses:[],notes:'6-month retainer content plan.',category:'Marketing'},
];
const SEED_TEAM = [
  {id:'t1',name:'Jamie Chen',role:'Creative Director',status:'Active',phone:'07700900111',email:'jamie@workdesk.io',rate:750,skills:['Design','Strategy','Leadership']},
  {id:'t2',name:'Priya Sharma',role:'Developer',status:'Active',phone:'07700900222',email:'priya@workdesk.io',rate:600,skills:['React','Node','Databases']},
  {id:'t3',name:'Tom Walsh',role:'Project Manager',status:'Active',phone:'07700900333',email:'tom@workdesk.io',rate:450,skills:['Agile','Client Relations','Reporting']},
  {id:'t4',name:'Aaliya Brooks',role:'Marketing Lead',status:'Active',phone:'07700900444',email:'aaliya@workdesk.io',rate:520,skills:['SEO','Social','Analytics']},
  {id:'t5',name:'Renz Garcia',role:'Designer',status:'Away',phone:'07700900555',email:'renz@workdesk.io',rate:380,skills:['Figma','Illustration','Branding']},
  {id:'t6',name:'Mia Foster',role:'Copywriter',status:'Active',phone:'07700900666',email:'mia@workdesk.io',rate:320,skills:['Content','SEO Writing','UX Copy']},
];
const SEED_CLIENTS = [
  {id:'cl1',name:'Apex Digital',industry:'Technology',contact:'Sarah Mills',email:'sarah@apexdigital.com',phone:'020 1234 5678',value:45000,status:'Active'},
  {id:'cl2',name:'Nova Retail',industry:'Retail',contact:'James Court',email:'james@novaretail.com',phone:'020 2345 6789',value:12000,status:'Active'},
  {id:'cl3',name:'Peak Nutrition',industry:'Health & Wellness',contact:'Ana Lopez',email:'ana@peaknutrition.com',phone:'020 3456 7890',value:8400,status:'Active'},
  {id:'cl4',name:'BridgePoint Corp',industry:'Finance',contact:'David Ng',email:'d.ng@bridgepoint.com',phone:'020 4567 8901',value:24000,status:'Active'},
  {id:'cl5',name:'Velour Store',industry:'E-Commerce',contact:'Chloe Park',email:'chloe@velour.com',phone:'020 5678 9012',value:22000,status:'Prospect'},
  {id:'cl6',name:'Lumen Finance',industry:'Financial Services',contact:'Mike Ford',email:'mike@lumenfi.com',phone:'020 6789 0123',value:6000,status:'Active'},
];
const SEED_INVOICES = [
  {id:'i1',number:'INV-001',client:'Apex Digital',amount:9000,status:'Paid',dueDate:'28 Feb 2026',attachments:[],jobId:'j1'},
  {id:'i2',number:'INV-002',client:'BridgePoint Corp',amount:12000,status:'Paid',dueDate:'15 Jan 2026',attachments:[],jobId:'j4'},
  {id:'i3',number:'INV-003',client:'Peak Nutrition',amount:4200,status:'Sent',dueDate:'20 Mar 2026',attachments:[],jobId:'j3'},
  {id:'i4',number:'INV-004',client:'Lumen Finance',amount:3000,status:'Overdue',dueDate:'01 Mar 2026',attachments:[],jobId:'j6'},
  {id:'i5',number:'INV-005',client:'Nova Retail',amount:4250,status:'Draft',dueDate:'30 Apr 2026',attachments:[],jobId:'j2'},
  {id:'i6',number:'INV-006',client:'Velour Store',amount:5500,status:'Sent',dueDate:'15 Apr 2026',attachments:[],jobId:'j5'},
];
const SEED_MESSAGES = [
  {id:'m1',thread:'Q2 Website Redesign',sender:'Jamie Chen',text:'Design mockups are ready for client review',time:'09:15 AM'},
  {id:'m2',thread:'Q2 Website Redesign',sender:'You',text:'Great, will schedule the call for Thursday',time:'09:22 AM'},
  {id:'m3',thread:'General',sender:'Aaliya Brooks',text:'Q1 report is ready for review in shared drive',time:'Yesterday'},
  {id:'m4',thread:'General',sender:'You',text:'Thanks Aaliya, will look at it this afternoon',time:'Yesterday'},
  {id:'m5',thread:'Brand Identity Package',sender:'Renz Garcia',text:'First logo concepts uploaded to Figma',time:'Mon'},
];
const SEED_NOTIFS = [
  {id:'n1',type:'invoice',title:'Invoice Overdue',body:'INV-004 from Lumen Finance is 7 days overdue',time:'2 hrs ago',read:false},
  {id:'n2',type:'message',title:'New Message',body:'Jamie Chen: Design mockups are ready for client review',time:'3 hrs ago',read:false},
  {id:'n3',type:'job',title:'Job Updated',body:'E-commerce Build moved to Planning',time:'Yesterday',read:false},
  {id:'n4',type:'invoice',title:'Invoice Paid',body:'INV-002 from BridgePoint Corp - payment received',time:'2 days ago',read:true},
  {id:'n5',type:'team',title:'Team Member Active',body:'Mia Foster is now available for new projects',time:'3 days ago',read:true},
];

const S = {card:{backgroundColor:'#0F1825',borderRadius:18,padding:16,borderWidth:1,borderColor:'#1E2D45'},px:20};

function Card({children,style,onPress}) {
  if(onPress) return <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[S.card,style]}>{children}</TouchableOpacity>;
  return <View style={[S.card,style]}>{children}</View>;
}
function Badge({label,color,size}) {
  const fs=size==='sm'?10:11;
  return <View style={{backgroundColor:color+'25',borderRadius:20,paddingHorizontal:10,paddingVertical:3,alignSelf:'flex-start'}}><Text style={{color,fontSize:fs,fontWeight:'700'}}>{label}</Text></View>;
}
function StatCard({label,value,sub,color,style}) {
  return <View style={[{flex:1,backgroundColor:C.surface,borderRadius:18,padding:16,borderWidth:1,borderColor:C.border},style]}><Text style={{color:color||C.teal,fontSize:24,fontWeight:'900'}}>{value}</Text><Text style={{color:C.text,fontSize:12,fontWeight:'700',marginTop:5}}>{label}</Text>{sub?<Text style={{color:C.sub,fontSize:11,marginTop:3}}>{sub}</Text>:null}</View>;
}
function SectionHeader({title,action,onAction}) {
  return <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:12}}><Text style={{color:C.sub,fontSize:11,fontWeight:'700',letterSpacing:1.2}}>{title}</Text>{action&&<TouchableOpacity onPress={onAction}><Text style={{color:C.teal,fontSize:12,fontWeight:'700'}}>{action}</Text></TouchableOpacity>}</View>;
}
function ScreenHeader({title,sub,right,onBack,accentColor}) {
  const ac=accentColor||C.teal;
  return (
    <View style={{backgroundColor:C.surface,paddingTop:52,paddingBottom:16,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:C.border}}>
      {onBack&&<TouchableOpacity onPress={onBack} style={{marginBottom:10}}><Text style={{color:ac,fontSize:15,fontWeight:'600'}}>{'< Back'}</Text></TouchableOpacity>}
      <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
        <View style={{flex:1}}>{sub&&<Text style={{color:C.sub,fontSize:11,fontWeight:'700',letterSpacing:1,marginBottom:3}}>{sub}</Text>}<Text style={{color:C.text,fontSize:24,fontWeight:'900'}}>{title}</Text></View>
        {right}
      </View>
    </View>
  );
}
function Pill({label,onPress,active,color}) {
  return <TouchableOpacity onPress={onPress} style={{paddingHorizontal:16,paddingVertical:8,borderRadius:20,marginRight:8,backgroundColor:active?(color||C.teal):C.surface,borderWidth:1,borderColor:active?(color||C.teal):C.border}}><Text style={{color:active?'#fff':C.sub,fontWeight:active?'700':'500',fontSize:13}}>{label}</Text></TouchableOpacity>;
}
function Avatar({name,color,size}) {
  const sz=size||44;
  return <View style={{width:sz,height:sz,borderRadius:sz/2,backgroundColor:(color||C.teal)+'33',alignItems:'center',justifyContent:'center'}}><Text style={{color:color||C.teal,fontWeight:'800',fontSize:sz*0.38}}>{(name||'?').charAt(0).toUpperCase()}</Text></View>;
}
function NotifIcon({type}) {
  const m={invoice:{c:C.gold,l:'$'},message:{c:C.teal,l:'M'},job:{c:C.blue,l:'J'},team:{c:C.purple,l:'T'},schedule:{c:C.orange,l:'S'}};
  const cfg=m[type]||{c:C.sub,l:'N'};
  return <View style={{width:42,height:42,borderRadius:12,backgroundColor:cfg.c+'22',alignItems:'center',justifyContent:'center',marginRight:14}}><Text style={{color:cfg.c,fontWeight:'800',fontSize:14}}>{cfg.l}</Text></View>;
}
function MiniBar({value,max,color}) {
  const pct=max>0?Math.min((value/max)*100,100):0;
  return <View style={{height:5,backgroundColor:C.surf2,borderRadius:3,overflow:'hidden',flex:1}}><View style={{height:5,width:pct+'%',backgroundColor:color||C.teal,borderRadius:3}}/></View>;
}

function useStore() {
  const [jobs,setJobs] = React.useState(SEED_JOBS);
  const [team,setTeam] = React.useState(SEED_TEAM);
  const [clients,setClients] = React.useState(SEED_CLIENTS);
  const [invoices,setInvoices] = React.useState(SEED_INVOICES);
  const [messages,setMessages] = React.useState(SEED_MESSAGES);
  const [notifs,setNotifs] = React.useState(SEED_NOTIFS);
  const [userProfile,setUserProfile] = React.useState({id:'u1',name:'Alex Morgan',role:'Business Owner',email:'alex@myworkdesk.io',phone:'07700900001',businessName:'Morgan Creative',businessType:'Agency',trialStart:Date.now()-(1*24*60*60*1000)});
  function addJob(j){setJobs(p=>[...p,j]);}
  function updateJob(id,d){setJobs(p=>p.map(j=>j.id===id?d:j));}
  function deleteJob(id){setJobs(p=>p.filter(j=>j.id!==id));}
  function addExpense(jobId,ex){setJobs(p=>p.map(j=>j.id===jobId?{...j,expenses:[...(j.expenses||[]),ex]}:j));}
  function assignTeam(jobId,tid){setJobs(p=>p.map(j=>{if(j.id!==jobId) return j; const t=j.team||[]; return {...j,team:t.includes(tid)?t.filter(x=>x!==tid):[...t,tid]};}));}
  function addTeam(m){setTeam(p=>[...p,m]);}
  function updateTeam(id,d){setTeam(p=>p.map(m=>m.id===id?d:m));}
  function deleteTeam(id){setTeam(p=>p.filter(m=>m.id!==id));}
  function addClient(c){setClients(p=>[...p,c]);}
  function updateClient(id,d){setClients(p=>p.map(c=>c.id===id?d:c));}
  function deleteClient(id){setClients(p=>p.filter(c=>c.id!==id));}
  function addInvoice(i){setInvoices(p=>[...p,i]);}
  function updateInvoice(id,d){setInvoices(p=>p.map(i=>i.id===id?d:i));}
  function deleteInvoice(id){setInvoices(p=>p.filter(i=>i.id!==id));}
  function addMessage(m){setMessages(p=>[...p,m]);}
  function markNotifRead(id){setNotifs(p=>p.map(n=>n.id===id?{...n,read:true}:n));}
  function markAllRead(){setNotifs(p=>p.map(n=>({...n,read:true})));}
  function updateUserProfile(d){setUserProfile(d);}
  const unread=notifs.filter(n=>!n.read).length;
  const trialDaysLeft=Math.max(0,TRIAL_DAYS-Math.floor((Date.now()-userProfile.trialStart)/(24*60*60*1000)));
  const trialExpired=trialDaysLeft<=0;
  return {jobs,team,clients,invoices,messages,notifs,userProfile,unread,trialDaysLeft,trialExpired,addJob,updateJob,deleteJob,addExpense,assignTeam,addTeam,updateTeam,deleteTeam,addClient,updateClient,deleteClient,addInvoice,updateInvoice,deleteInvoice,addMessage,markNotifRead,markAllRead,updateUserProfile};
}

function TrialBanner({daysLeft,onUpgrade}) {
  if(daysLeft>1) return null;
  const isLast=daysLeft===1;
  return <TouchableOpacity onPress={onUpgrade} style={{backgroundColor:isLast?C.red+'22':C.gold+'22',borderBottomWidth:1,borderBottomColor:isLast?C.red:C.gold,paddingHorizontal:20,paddingVertical:10,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><Text style={{color:isLast?C.red:C.gold,fontSize:13,fontWeight:'700'}}>{isLast?'Last day of free trial! Upgrade now':'Free trial active'}</Text><Text style={{color:isLast?C.red:C.gold,fontSize:12,fontWeight:'600'}}>Upgrade {'>'}</Text></TouchableOpacity>;
}

function UpgradeModal({visible,onClose,onUpgrade,daysLeft}) {
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={{flex:1,backgroundColor:'#000C',justifyContent:'center',alignItems:'center',padding:24}}>
        <View style={{backgroundColor:C.surface,borderRadius:24,padding:28,width:'100%',maxWidth:480,borderWidth:1,borderColor:C.border}}>
          <View style={{alignItems:'center',marginBottom:24}}>
            <View style={{width:64,height:64,borderRadius:20,backgroundColor:C.teal+'22',alignItems:'center',justifyContent:'center',marginBottom:14}}><Text style={{color:C.teal,fontSize:28,fontWeight:'900'}}>WD</Text></View>
            <Text style={{color:C.text,fontSize:22,fontWeight:'900',marginBottom:6}}>Upgrade WorkDesk</Text>
            <Text style={{color:C.sub,fontSize:14,textAlign:'center',lineHeight:20}}>{daysLeft<=0?'Your 3-day free trial has ended.':'Your trial ends soon. Unlock everything.'}</Text>
          </View>
          {[{plan:'Starter',price:'$29/mo',desc:'1 user, 10 jobs, 5 clients, invoicing'},{plan:'Professional',price:'$79/mo',desc:'5 users, unlimited jobs, full dashboard, reports',best:true},{plan:'Business',price:'$199/mo',desc:'Unlimited team, white-label, API access, priority support'}].map(p=>(
            <TouchableOpacity key={p.plan} onPress={onUpgrade} style={{backgroundColor:p.best?C.teal:C.surf2,borderRadius:16,padding:16,marginBottom:10,borderWidth:1,borderColor:p.best?C.teal:C.border}}>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <View><View style={{flexDirection:'row',alignItems:'center'}}><Text style={{color:p.best?'#fff':C.text,fontSize:16,fontWeight:'800'}}>{p.plan}</Text>{p.best&&<View style={{backgroundColor:'#fff3',borderRadius:10,paddingHorizontal:8,paddingVertical:2,marginLeft:8}}><Text style={{color:'#fff',fontSize:10,fontWeight:'700'}}>POPULAR</Text></View>}</View><Text style={{color:p.best?'#ffffffaa':C.sub,fontSize:12,marginTop:3}}>{p.desc}</Text></View>
                <Text style={{color:p.best?'#fff':C.teal,fontSize:17,fontWeight:'900'}}>{p.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {daysLeft>0&&<TouchableOpacity onPress={onClose} style={{marginTop:8,alignItems:'center',paddingVertical:12}}><Text style={{color:C.sub,fontSize:13}}>{daysLeft} day{daysLeft!==1?'s':''} left - Continue with trial</Text></TouchableOpacity>}
        </View>
      </View>
    </Modal>
  );
}

function OnboardingScreen({onComplete}) {
  const [step,setStep] = React.useState(0);
  const [biz,setBiz] = React.useState({name:'',type:'Agency'});
  const fade=React.useRef(new Animated.Value(1)).current;
  function next() {
    if(step===0&&!biz.name.trim()){Alert.alert('Required','Please enter your business name');return;}
    if(step<1){Animated.sequence([Animated.timing(fade,{toValue:0,duration:200,useNativeDriver:true}),Animated.timing(fade,{toValue:1,duration:300,useNativeDriver:true})]).start();setStep(1);}
    else{onComplete(biz);}
  }
  return (
    <View style={{flex:1,backgroundColor:C.bg,alignItems:'center',justifyContent:'center',padding:28}}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      <Animated.View style={{opacity:fade,width:'100%',maxWidth:440}}>
        {step===0&&(
          <View style={{alignItems:'center'}}>
            <View style={{width:72,height:72,borderRadius:22,backgroundColor:C.teal+'22',borderWidth:2,borderColor:C.teal,alignItems:'center',justifyContent:'center',marginBottom:20}}><Text style={{color:C.teal,fontWeight:'900',fontSize:28}}>WD</Text></View>
            <Text style={{color:C.text,fontSize:30,fontWeight:'900',marginBottom:6,textAlign:'center'}}><Text style={{color:C.teal}}>Work</Text>Desk</Text>
            <Text style={{color:C.sub,fontSize:15,textAlign:'center',marginBottom:36,lineHeight:22}}>The all-in-one business management platform. Built for every industry.</Text>
            <View style={{width:'100%',marginBottom:16}}>
              <Text style={{color:C.sub,fontSize:12,fontWeight:'700',marginBottom:8,letterSpacing:1}}>BUSINESS NAME</Text>
              <TextInput style={{backgroundColor:C.surface,borderRadius:14,paddingHorizontal:16,paddingVertical:14,color:C.text,fontSize:16,borderWidth:1,borderColor:C.border}} placeholder="e.g. Apex Creative Ltd" placeholderTextColor={C.sub} value={biz.name} onChangeText={v=>setBiz(b=>({...b,name:v}))}/>
            </View>
            <Text style={{color:C.sub,fontSize:12,fontWeight:'700',marginBottom:10,letterSpacing:1,alignSelf:'flex-start'}}>BUSINESS TYPE</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:28,alignSelf:'flex-start'}}>
              {BUSINESS_TYPES.map(t=><TouchableOpacity key={t} onPress={()=>setBiz(b=>({...b,type:t}))} style={{paddingHorizontal:14,paddingVertical:8,borderRadius:20,marginRight:8,backgroundColor:biz.type===t?C.teal:C.surface,borderWidth:1,borderColor:biz.type===t?C.teal:C.border}}><Text style={{color:biz.type===t?'#fff':C.sub,fontSize:13,fontWeight:'600'}}>{t}</Text></TouchableOpacity>)}
            </ScrollView>
            <TouchableOpacity onPress={next} style={{backgroundColor:C.teal,borderRadius:16,paddingVertical:16,width:'100%',alignItems:'center'}}><Text style={{color:'#fff',fontWeight:'700',fontSize:17}}>Start Free 3-Day Trial</Text></TouchableOpacity>
            <Text style={{color:C.dimmer,fontSize:11,marginTop:14,textAlign:'center'}}>No credit card required. Cancel anytime.</Text>
          </View>
        )}
        {step===1&&(
          <View style={{alignItems:'center'}}>
            <Text style={{color:C.teal,fontSize:40,marginBottom:16}}>^</Text>
            <Text style={{color:C.text,fontSize:24,fontWeight:'900',marginBottom:8,textAlign:'center'}}>Welcome, {biz.name}!</Text>
            <Text style={{color:C.sub,fontSize:15,textAlign:'center',marginBottom:32,lineHeight:22}}>Your 3-day free trial is active. Explore every feature with no limits.</Text>
            {[['All Jobs and Projects','Track every job, budget and deadline'],['Full Team Management','Assign work, track rates and availability'],['Client CRM','Manage clients, contacts and pipeline'],['Invoicing and Payments','Create, send and track invoices'],['Business Reports','Revenue, pipeline and team analytics']].map(([h,s])=>(
              <View key={h} style={{flexDirection:'row',alignItems:'flex-start',marginBottom:14,alignSelf:'flex-start'}}>
                <View style={{width:20,height:20,borderRadius:10,backgroundColor:C.green,alignItems:'center',justifyContent:'center',marginRight:12,marginTop:1}}><Text style={{color:'#fff',fontSize:11,fontWeight:'800'}}>+</Text></View>
                <View style={{flex:1}}><Text style={{color:C.text,fontSize:14,fontWeight:'700'}}>{h}</Text><Text style={{color:C.sub,fontSize:12,marginTop:2}}>{s}</Text></View>
              </View>
            ))}
            <TouchableOpacity onPress={next} style={{backgroundColor:C.teal,borderRadius:16,paddingVertical:16,width:'100%',alignItems:'center',marginTop:16}}><Text style={{color:'#fff',fontWeight:'700',fontSize:17}}>Enter WorkDesk</Text></TouchableOpacity>
          </View>
        )}
      </Animated.View>
    </View>
  );
}

function LoginScreen({onLogin}) {
  const [loading,setLoading] = React.useState(false);
  const fade=React.useRef(new Animated.Value(0)).current;
  const slide=React.useRef(new Animated.Value(40)).current;
  React.useEffect(()=>{Animated.parallel([Animated.timing(fade,{toValue:1,duration:800,useNativeDriver:true}),Animated.timing(slide,{toValue:0,duration:700,useNativeDriver:true})]).start();},[]);
  function login(mode){setLoading(mode);setTimeout(()=>{setLoading(false);onLogin(mode);},900);}
  return (
    <View style={{flex:1,backgroundColor:C.bg,alignItems:'center',justifyContent:'center',paddingHorizontal:24}}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      <Animated.View style={{opacity:fade,transform:[{translateY:slide}],alignItems:'center',width:'100%',maxWidth:440}}>
        <View style={{width:76,height:76,borderRadius:22,backgroundColor:C.teal+'22',borderWidth:2,borderColor:C.teal,alignItems:'center',justifyContent:'center',marginBottom:22}}><Text style={{color:C.teal,fontWeight:'900',fontSize:28}}>WD</Text></View>
        <Text style={{color:C.text,fontSize:34,fontWeight:'900',letterSpacing:-1,marginBottom:6,textAlign:'center'}}><Text style={{color:C.teal}}>Work</Text>Desk</Text>
        <Text style={{color:C.sub,fontSize:15,textAlign:'center',marginBottom:12,lineHeight:22}}>All-in-one business management. Every industry.</Text>
        <View style={{backgroundColor:C.teal+'18',borderRadius:12,paddingHorizontal:16,paddingVertical:8,marginBottom:40}}><Text style={{color:C.teal,fontSize:12,fontWeight:'700'}}>3-Day Free Trial - No card required</Text></View>
        <TouchableOpacity onPress={()=>login('business')} disabled={!!loading} activeOpacity={0.85} style={{width:'100%',backgroundColor:C.surface,borderRadius:20,padding:20,marginBottom:14,borderWidth:1.5,borderColor:C.teal,flexDirection:'row',alignItems:'center'}}>
          <View style={{width:46,height:46,borderRadius:13,backgroundColor:C.teal+'22',alignItems:'center',justifyContent:'center',marginRight:16}}><Text style={{color:C.teal,fontWeight:'900',fontSize:18}}>Bz</Text></View>
          <View style={{flex:1}}><Text style={{color:C.text,fontSize:17,fontWeight:'800'}}>Business Owner</Text><Text style={{color:C.sub,fontSize:13,marginTop:2}}>Manage jobs, team, clients and billing</Text></View>
          {loading==='business'?<ActivityIndicator color={C.teal}/>:<Text style={{color:C.teal,fontSize:20}}>{'>'}</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>login('freelancer')} disabled={!!loading} activeOpacity={0.85} style={{width:'100%',backgroundColor:C.surface,borderRadius:20,padding:20,borderWidth:1.5,borderColor:C.gold,flexDirection:'row',alignItems:'center'}}>
          <View style={{width:46,height:46,borderRadius:13,backgroundColor:C.gold+'22',alignItems:'center',justifyContent:'center',marginRight:16}}><Text style={{color:C.gold,fontWeight:'900',fontSize:18}}>Fr</Text></View>
          <View style={{flex:1}}><Text style={{color:C.text,fontSize:17,fontWeight:'800'}}>Freelancer / Contractor</Text><Text style={{color:C.sub,fontSize:13,marginTop:2}}>Track gigs, send invoices, manage earnings</Text></View>
          {loading==='freelancer'?<ActivityIndicator color={C.gold}/>:<Text style={{color:C.gold,fontSize:20}}>{'>'}</Text>}
        </TouchableOpacity>
        <Text style={{color:C.dimmer,fontSize:11,marginTop:28,textAlign:'center'}}>By signing in you agree to WorkDesk Terms of Service</Text>
      </Animated.View>
    </View>
  );
}

function NotificationsScreen({store,onBack,accentColor}) {
  const {notifs,markNotifRead,markAllRead}=store;
  const ac=accentColor||C.teal;
  const anim=React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{Animated.timing(anim,{toValue:1,duration:350,useNativeDriver:true}).start();},[]);
  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <ScreenHeader title="Notifications" onBack={onBack} accentColor={ac} right={notifs.filter(n=>!n.read).length>0?<TouchableOpacity onPress={markAllRead} style={{backgroundColor:ac+'22',borderRadius:12,paddingHorizontal:12,paddingVertical:6}}><Text style={{color:ac,fontWeight:'700',fontSize:12}}>Mark all read</Text></TouchableOpacity>:null}/>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20}}>
        {notifs.length===0&&<Text style={{color:C.sub,textAlign:'center',marginTop:60}}>All caught up!</Text>}
        {notifs.map(n=>(
          <TouchableOpacity key={n.id} onPress={()=>markNotifRead(n.id)} activeOpacity={0.85}>
            <View style={{backgroundColor:n.read?C.surface:C.surf3,borderRadius:14,padding:14,marginBottom:10,borderWidth:1,borderColor:n.read?C.border:ac+'44',flexDirection:'row',alignItems:'center'}}>
              <NotifIcon type={n.type}/>
              <View style={{flex:1}}>
                <View style={{flexDirection:'row',alignItems:'center'}}><Text style={{color:C.text,fontSize:14,fontWeight:'700',flex:1}}>{n.title}</Text>{!n.read&&<View style={{width:8,height:8,borderRadius:4,backgroundColor:ac}}/>}</View>
                <Text style={{color:C.sub,fontSize:13,marginTop:3,lineHeight:18}}>{n.body}</Text>
                <Text style={{color:C.dimmer,fontSize:11,marginTop:5}}>{n.time}</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        <View style={{height:40}}/>
      </ScrollView>
    </Animated.View>
  );
}

function HomeScreen({store,onNav,trialDaysLeft,onUpgrade}) {
  const {jobs,team,invoices,clients,unread,userProfile}=store;
  const anim=React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{Animated.timing(anim,{toValue:1,duration:500,useNativeDriver:true}).start();},[]);
  const activeJobs=jobs.filter(j=>j.status!=='Completed'&&j.status!=='Cancelled');
  const pipeline=activeJobs.reduce((a,b)=>a+(b.budget||0),0);
  const paid=invoices.filter(i=>i.status==='Paid').reduce((a,b)=>a+(b.amount||0),0);
  const overdue=invoices.filter(i=>i.status==='Overdue');
  const todayStr=new Date().toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long'});
  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <View style={{backgroundColor:C.surface,paddingTop:52,paddingBottom:16,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:C.border}}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
          <View>
            <Text style={{color:C.sub,fontSize:11,fontWeight:'700',letterSpacing:1}}>BUSINESS DASHBOARD</Text>
            <Text style={{color:C.text,fontSize:22,fontWeight:'900',marginTop:2}}>{userProfile.businessName||'WorkDesk'}</Text>
            <Text style={{color:C.sub,fontSize:12,marginTop:2}}>{todayStr}</Text>
          </View>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            {trialDaysLeft<=3&&trialDaysLeft>0&&<TouchableOpacity onPress={onUpgrade} style={{backgroundColor:C.gold+'22',borderRadius:12,paddingHorizontal:10,paddingVertical:6,marginRight:10,borderWidth:1,borderColor:C.gold}}><Text style={{color:C.gold,fontSize:11,fontWeight:'700'}}>{trialDaysLeft}d left</Text></TouchableOpacity>}
            <TouchableOpacity onPress={()=>onNav('notifications')} style={{position:'relative'}}>
              <View style={{width:38,height:38,borderRadius:12,backgroundColor:C.surf2,borderWidth:1,borderColor:C.border,alignItems:'center',justifyContent:'center'}}><Text style={{color:C.text,fontSize:16}}>N</Text></View>
              {unread>0&&<View style={{position:'absolute',top:-2,right:-2,width:16,height:16,borderRadius:8,backgroundColor:C.red,alignItems:'center',justifyContent:'center'}}><Text style={{color:'#fff',fontSize:9,fontWeight:'800'}}>{unread}</Text></View>}
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <TrialBanner daysLeft={trialDaysLeft} onUpgrade={onUpgrade}/>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,maxWidth:900,alignSelf:'center',width:'100%'}}>
        <View style={{flexDirection:'row',marginBottom:10}}><StatCard label="Active Jobs" value={String(activeJobs.length)} sub={jobs.length+' total'} color={C.teal} style={{marginRight:8}}/><View style={{width:8}}/><StatCard label="Pipeline" value={fmt(pipeline)} sub="Open job value" color={C.blue}/></View>
        <View style={{flexDirection:'row',marginBottom:20}}><StatCard label="Revenue" value={fmt(paid)} sub="Paid invoices" color={C.green} style={{marginRight:8}}/><View style={{width:8}}/><StatCard label="Overdue" value={String(overdue.length)} sub={overdue.length>0?fmtFull(overdue.reduce((a,b)=>a+(b.amount||0),0))+' at risk':'All invoices on time'} color={overdue.length>0?C.red:C.green}/></View>
        <SectionHeader title="QUICK ACCESS"/>
        <View style={{flexDirection:'row',marginBottom:10}}>
          <Card onPress={()=>onNav('messages')} style={{flex:1,marginRight:8}}><View style={{width:34,height:34,borderRadius:10,backgroundColor:C.teal+'22',alignItems:'center',justifyContent:'center',marginBottom:8}}><View style={{width:12,height:12,borderRadius:6,backgroundColor:C.teal}}/></View><Text style={{color:C.text,fontSize:14,fontWeight:'700'}}>Messages</Text><Text style={{color:C.sub,fontSize:11,marginTop:2}}>Team chat</Text></Card>
          <Card onPress={()=>onNav('invoices')} style={{flex:1,marginRight:8}}><View style={{width:34,height:34,borderRadius:10,backgroundColor:C.gold+'22',alignItems:'center',justifyContent:'center',marginBottom:8}}><View style={{width:12,height:12,borderRadius:6,backgroundColor:C.gold}}/></View><Text style={{color:C.text,fontSize:14,fontWeight:'700'}}>Invoices</Text><Text style={{color:C.sub,fontSize:11,marginTop:2}}>Billing</Text></Card>
          <Card onPress={()=>onNav('reports')} style={{flex:1}}><View style={{width:34,height:34,borderRadius:10,backgroundColor:C.purple+'22',alignItems:'center',justifyContent:'center',marginBottom:8}}><View style={{width:12,height:12,borderRadius:6,backgroundColor:C.purple}}/></View><Text style={{color:C.text,fontSize:14,fontWeight:'700'}}>Reports</Text><Text style={{color:C.sub,fontSize:11,marginTop:2}}>Analytics</Text></Card>
        </View>
        <View style={{flexDirection:'row',marginBottom:24}}>
          <Card onPress={()=>onNav('clients')} style={{flex:1,marginRight:8}}><View style={{width:34,height:34,borderRadius:10,backgroundColor:C.blue+'22',alignItems:'center',justifyContent:'center',marginBottom:8}}><View style={{width:12,height:12,borderRadius:6,backgroundColor:C.blue}}/></View><Text style={{color:C.text,fontSize:14,fontWeight:'700'}}>Clients</Text><Text style={{color:C.sub,fontSize:11,marginTop:2}}>{clients.length} contacts</Text></Card>
          <Card onPress={()=>onNav('notifications')} style={{flex:1,marginRight:8}}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}><View style={{width:34,height:34,borderRadius:10,backgroundColor:C.orange+'22',alignItems:'center',justifyContent:'center',marginBottom:8}}><View style={{width:12,height:12,borderRadius:6,backgroundColor:C.orange}}/></View>{unread>0&&<View style={{backgroundColor:C.red,borderRadius:10,minWidth:20,height:20,alignItems:'center',justifyContent:'center',paddingHorizontal:5}}><Text style={{color:'#fff',fontSize:10,fontWeight:'800'}}>{unread}</Text></View>}</View>
            <Text style={{color:C.text,fontSize:14,fontWeight:'700'}}>Alerts</Text><Text style={{color:C.sub,fontSize:11,marginTop:2}}>{unread} unread</Text>
          </Card>
          <View style={{flex:1}}/>
        </View>
        <SectionHeader title="ACTIVE JOBS" action="View All" onAction={()=>onNav('jobs')}/>
        {activeJobs.length===0&&<Card><Text style={{color:C.sub,textAlign:'center',paddingVertical:10}}>No active jobs. Add one in Jobs.</Text></Card>}
        {activeJobs.slice(0,4).map(j=>{
          const sc=j.status==='In Progress'?C.teal:j.status==='Pre-Production'?C.blue:j.status==='Post-Production'?C.purple:C.gold;
          return <Card key={j.id} style={{marginBottom:10}}><View style={{flexDirection:'row',alignItems:'center'}}><View style={{width:4,height:44,borderRadius:2,backgroundColor:sc,marginRight:12}}/><View style={{flex:1}}><Text style={{color:C.text,fontSize:14,fontWeight:'700'}}>{j.name}</Text><Text style={{color:C.sub,fontSize:12,marginTop:2}}>{j.client}{j.category?' - '+j.category:''}</Text></View><View style={{alignItems:'flex-end'}}><Badge label={j.status} color={sc}/>{j.budget?<Text style={{color:C.teal,fontSize:12,fontWeight:'700',marginTop:4}}>{fmtFull(j.budget)}</Text>:null}</View></View></Card>;
        })}
        {overdue.length>0&&<View style={{marginTop:16}}><SectionHeader title="OVERDUE INVOICES"/>{overdue.map(iv=><Card key={iv.id} style={{marginBottom:8,borderColor:C.red+'44'}}><View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}><View><Text style={{color:C.text,fontSize:14,fontWeight:'700'}}>{iv.number} - {iv.client}</Text><Text style={{color:C.red,fontSize:12,marginTop:2}}>Due {iv.dueDate}</Text></View><Text style={{color:C.red,fontWeight:'800',fontSize:16}}>{fmtFull(iv.amount)}</Text></View></Card>)}</View>}
        <View style={{height:40}}/>
      </ScrollView>
    </Animated.View>
  );
}

function FHomeScreen({store,onNav,trialDaysLeft,onUpgrade,accentColor}) {
  const {invoices,jobs,userProfile,unread}=store;
  const ac=accentColor||C.gold;
  const anim=React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{Animated.timing(anim,{toValue:1,duration:500,useNativeDriver:true}).start();},[]);
  const earned=invoices.filter(i=>i.status==='Paid').reduce((a,b)=>a+(b.amount||0),0);
  const pending=invoices.filter(i=>i.status==='Sent'||i.status==='Draft');
  const myJobs=jobs.filter(j=>j.status!=='Cancelled');
  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <View style={{backgroundColor:C.surface,paddingTop:52,paddingBottom:16,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:C.border,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
        <View><Text style={{color:C.sub,fontSize:11,fontWeight:'700',letterSpacing:1}}>FREELANCER PORTAL</Text><Text style={{color:C.text,fontSize:22,fontWeight:'900',marginTop:2}}>Hi, {(userProfile.name||'').split(' ')[0]}</Text></View>
        <View style={{flexDirection:'row',alignItems:'center'}}>
          {trialDaysLeft<=3&&trialDaysLeft>0&&<TouchableOpacity onPress={onUpgrade} style={{backgroundColor:ac+'22',borderRadius:12,paddingHorizontal:10,paddingVertical:6,marginRight:10,borderWidth:1,borderColor:ac}}><Text style={{color:ac,fontSize:11,fontWeight:'700'}}>{trialDaysLeft}d left</Text></TouchableOpacity>}
          <TouchableOpacity onPress={()=>onNav('notifications')}>
            <View style={{position:'relative'}}><View style={{width:38,height:38,borderRadius:12,backgroundColor:C.surf2,borderWidth:1,borderColor:ac+'44',alignItems:'center',justifyContent:'center'}}><Text style={{color:ac,fontSize:13,fontWeight:'700'}}>N</Text></View>{unread>0&&<View style={{position:'absolute',top:-2,right:-2,width:16,height:16,borderRadius:8,backgroundColor:C.red,alignItems:'center',justifyContent:'center'}}><Text style={{color:'#fff',fontSize:9,fontWeight:'800'}}>{unread}</Text></View>}</View>
          </TouchableOpacity>
        </View>
      </View>
      <TrialBanner daysLeft={trialDaysLeft} onUpgrade={onUpgrade}/>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,maxWidth:900,alignSelf:'center',width:'100%'}}>
        <View style={{flexDirection:'row',marginBottom:10}}><StatCard label="Total Earned" value={fmt(earned)} sub="From paid invoices" color={ac} style={{marginRight:8}}/><View style={{width:8}}/><StatCard label="Pending" value={String(pending.length)} sub={pending.length>0?fmtFull(pending.reduce((a,b)=>a+(b.amount||0),0))+' outstanding':'Nothing pending'} color={C.blue}/></View>
        <View style={{flexDirection:'row',marginBottom:24}}>
          <Card onPress={()=>onNav('portal')} style={{flex:1,marginRight:8}}><View style={{width:34,height:34,borderRadius:10,backgroundColor:ac+'22',alignItems:'center',justifyContent:'center',marginBottom:8}}><View style={{width:12,height:12,borderRadius:6,backgroundColor:ac}}/></View><Text style={{color:C.text,fontSize:14,fontWeight:'700'}}>My Portal</Text><Text style={{color:C.sub,fontSize:11,marginTop:2}}>Profile and earnings</Text></Card>
          <Card onPress={()=>onNav('notifications')} style={{flex:1}}>
            <View style={{flexDirection:'row',justifyContent:'space-between'}}><View style={{width:34,height:34,borderRadius:10,backgroundColor:C.blue+'22',alignItems:'center',justifyContent:'center',marginBottom:8}}><View style={{width:12,height:12,borderRadius:6,backgroundColor:C.blue}}/></View>{unread>0&&<View style={{backgroundColor:C.red,borderRadius:10,minWidth:20,height:20,alignItems:'center',justifyContent:'center',paddingHorizontal:5}}><Text style={{color:'#fff',fontSize:10,fontWeight:'800'}}>{unread}</Text></View>}</View>
            <Text style={{color:C.text,fontSize:14,fontWeight:'700'}}>Alerts</Text><Text style={{color:C.sub,fontSize:11,marginTop:2}}>{unread} unread</Text>
          </Card>
        </View>
        <SectionHeader title="MY ACTIVE JOBS"/>
        {myJobs.slice(0,5).map(j=>{const sc=j.status==='In Progress'?C.teal:j.status==='Pre-Production'?C.blue:C.gold;return <Card key={j.id} style={{marginBottom:10}}><View style={{flexDirection:'row',alignItems:'center'}}><View style={{width:4,height:44,borderRadius:2,backgroundColor:sc,marginRight:12}}/><View style={{flex:1}}><Text style={{color:C.text,fontSize:14,fontWeight:'700'}}>{j.name}</Text><Text style={{color:C.sub,fontSize:12,marginTop:2}}>{j.client}</Text></View><Badge label={j.status} color={sc}/></View></Card>;})}
        {myJobs.length===0&&<Card><Text style={{color:C.sub,textAlign:'center',paddingVertical:10}}>No active jobs assigned</Text></Card>}
        <View style={{height:40}}/>
      </ScrollView>
    </Animated.View>
  );
}

function JobsScreen({store}) {
  const {jobs,addJob,updateJob,deleteJob,team,addExpense,assignTeam}=store;
  const [sel,setSel]=React.useState(null);
  const [showAdd,setShowAdd]=React.useState(false);
  const [showExp,setShowExp]=React.useState(false);
  const [filterStatus,setFilterStatus]=React.useState('All');
  const [editing,setEditing]=React.useState(false);
  const [expForm,setExpForm]=React.useState({desc:'',amount:''});
  const [form,setForm]=React.useState({name:'',client:'',status:'Planning',budget:'',notes:'',category:'Design'});
  const anim=React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{Animated.timing(anim,{toValue:1,duration:400,useNativeDriver:true}).start();},[]);
  function sColor(s){if(s==='In Progress') return C.teal;if(s==='Pre-Production') return C.blue;if(s==='Post-Production') return C.purple;if(s==='Completed') return C.green;if(s==='Cancelled') return C.red;return C.gold;}
  const filtered=filterStatus==='All'?jobs:jobs.filter(j=>j.status===filterStatus);
  function openAdd(){setForm({name:'',client:'',status:'Planning',budget:'',notes:'',category:'Design'});setEditing(false);setShowAdd(true);}
  function openEdit(j){setForm({name:j.name,client:j.client,status:j.status,budget:String(j.budget||''),notes:j.notes||'',category:j.category||'Design'});setEditing(true);setShowAdd(true);setSel(null);}
  function saveJob(){if(!form.name.trim()||!form.client.trim()){Alert.alert('Required','Job name and client are required');return;}const data={...form,budget:parseFloat(form.budget)||0};if(editing&&sel){updateJob(sel.id,{...sel,...data});setSel(null);}else{addJob({...data,id:Date.now().toString(),team:[],expenses:[]});}setShowAdd(false);}
  function delJob(j){Alert.alert('Delete Job','Delete '+j.name+'?',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>{deleteJob(j.id);setSel(null);}}]);}
  function saveExp(){if(!expForm.desc.trim()||!expForm.amount.trim()){Alert.alert('Required','Description and amount required');return;}const ex={id:Date.now().toString(),desc:expForm.desc,amount:parseFloat(expForm.amount)||0,date:new Date().toISOString().split('T')[0]};addExpense(sel.id,ex);setSel({...sel,expenses:[...(sel.expenses||[]),ex]});setExpForm({desc:'',amount:''});setShowExp(false);}

  if(sel&&!showAdd){
    const totalExp=(sel.expenses||[]).reduce((a,b)=>a+(b.amount||0),0);
    const margin=sel.budget>0?Math.round((1-(totalExp/sel.budget))*100):100;
    return (
      <View style={{flex:1,backgroundColor:C.bg}}>
        <ScreenHeader title={sel.name} sub={sel.client} onBack={()=>setSel(null)} right={<View style={{flexDirection:'row'}}><TouchableOpacity onPress={()=>openEdit(sel)} style={{padding:8,marginRight:4}}><Text style={{color:C.teal,fontWeight:'700'}}>Edit</Text></TouchableOpacity><TouchableOpacity onPress={()=>delJob(sel)} style={{padding:8}}><Text style={{color:C.red,fontWeight:'700'}}>Delete</Text></TouchableOpacity></View>}/>
        <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,maxWidth:900,alignSelf:'center',width:'100%'}}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:16}}>{JOB_STATUSES.map(s=><TouchableOpacity key={s} onPress={()=>{updateJob(sel.id,{...sel,status:s});setSel({...sel,status:s});}} style={{paddingHorizontal:12,paddingVertical:7,borderRadius:20,marginRight:8,backgroundColor:sel.status===s?sColor(s)+'33':C.surface,borderWidth:1,borderColor:sel.status===s?sColor(s):C.border}}><Text style={{color:sel.status===s?sColor(s):C.sub,fontSize:11,fontWeight:'700'}}>{s}</Text></TouchableOpacity>)}</ScrollView>
          <View style={{flexDirection:'row',marginBottom:16}}>
            <View style={{flex:1,backgroundColor:C.surface,borderRadius:14,padding:14,marginRight:8,borderWidth:1,borderColor:C.border}}><Text style={{color:C.sub,fontSize:11}}>Budget</Text><Text style={{color:C.teal,fontSize:20,fontWeight:'800',marginTop:4}}>{fmtFull(sel.budget)}</Text></View>
            <View style={{flex:1,backgroundColor:C.surface,borderRadius:14,padding:14,marginRight:8,borderWidth:1,borderColor:C.border}}><Text style={{color:C.sub,fontSize:11}}>Expenses</Text><Text style={{color:C.gold,fontSize:20,fontWeight:'800',marginTop:4}}>{fmtFull(totalExp)}</Text></View>
            <View style={{flex:1,backgroundColor:C.surface,borderRadius:14,padding:14,borderWidth:1,borderColor:C.border}}><Text style={{color:C.sub,fontSize:11}}>Margin</Text><Text style={{color:margin>=50?C.green:margin>=20?C.gold:C.red,fontSize:20,fontWeight:'800',marginTop:4}}>{margin}%</Text></View>
          </View>
          {sel.notes?<Card style={{marginBottom:16}}><SectionHeader title="NOTES"/><Text style={{color:C.text,fontSize:14,lineHeight:20}}>{sel.notes}</Text></Card>:null}
          <Card style={{marginBottom:16}}>
            <SectionHeader title={'TEAM ('+(sel.team||[]).length+')'}/>
            {team.map(m=>{const assigned=(sel.team||[]).includes(m.id);return(
              <TouchableOpacity key={m.id} onPress={()=>{assignTeam(sel.id,m.id);const nt=assigned?(sel.team||[]).filter(x=>x!==m.id):[...(sel.team||[]),m.id];setSel({...sel,team:nt});}} style={{flexDirection:'row',alignItems:'center',paddingVertical:9,borderBottomWidth:1,borderBottomColor:C.border}}>
                <Avatar name={m.name} color={assigned?C.teal:C.sub} size={32}/><View style={{flex:1,marginLeft:10}}><Text style={{color:C.text,fontSize:13,fontWeight:'600'}}>{m.name}</Text><Text style={{color:C.sub,fontSize:11}}>{m.role}</Text></View>
                {assigned&&<Text style={{color:C.teal,fontWeight:'700',fontSize:12}}>Assigned</Text>}
              </TouchableOpacity>
            );})}
          </Card>
          <Card style={{marginBottom:16}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:12}}><Text style={{color:C.sub,fontSize:11,fontWeight:'700',letterSpacing:1}}>EXPENSES</Text><TouchableOpacity onPress={()=>setShowExp(true)} style={{backgroundColor:C.teal,borderRadius:12,paddingHorizontal:12,paddingVertical:5}}><Text style={{color:'#fff',fontWeight:'700',fontSize:12}}>+ Add</Text></TouchableOpacity></View>
            {(sel.expenses||[]).length===0&&<Text style={{color:C.sub,fontSize:13}}>No expenses logged yet</Text>}
            {(sel.expenses||[]).map(ex=><View key={ex.id} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:8,borderBottomWidth:1,borderBottomColor:C.border}}><View><Text style={{color:C.text,fontSize:13,fontWeight:'600'}}>{ex.desc}</Text><Text style={{color:C.sub,fontSize:11,marginTop:2}}>{ex.date}</Text></View><Text style={{color:C.gold,fontWeight:'700',fontSize:14}}>{fmtFull(ex.amount)}</Text></View>)}
          </Card>
          <View style={{height:40}}/>
        </ScrollView>
        <Modal visible={showExp} animationType="slide" transparent>
          <View style={{flex:1,backgroundColor:'#000A',justifyContent:'flex-end'}}>
            <View style={{backgroundColor:C.surface,borderTopLeftRadius:24,borderTopRightRadius:24,padding:24,paddingBottom:40}}>
              <Text style={{color:C.text,fontSize:18,fontWeight:'800',marginBottom:16}}>Log Expense</Text>
              <Text style={{color:C.sub,fontSize:12,marginBottom:6,fontWeight:'600'}}>DESCRIPTION</Text>
              <TextInput style={{backgroundColor:C.bg,borderRadius:12,paddingHorizontal:14,paddingVertical:12,color:C.text,fontSize:15,marginBottom:14}} placeholder="e.g. Software licence" placeholderTextColor={C.sub} value={expForm.desc} onChangeText={v=>setExpForm(f=>({...f,desc:v}))}/>
              <Text style={{color:C.sub,fontSize:12,marginBottom:6,fontWeight:'600'}}>AMOUNT</Text>
              <TextInput style={{backgroundColor:C.bg,borderRadius:12,paddingHorizontal:14,paddingVertical:12,color:C.text,fontSize:15,marginBottom:20}} placeholder="0.00" placeholderTextColor={C.sub} keyboardType="numeric" value={expForm.amount} onChangeText={v=>setExpForm(f=>({...f,amount:v}))}/>
              <View style={{flexDirection:'row'}}><TouchableOpacity onPress={()=>setShowExp(false)} style={{flex:1,paddingVertical:16,borderRadius:16,backgroundColor:C.bg,alignItems:'center',marginRight:12}}><Text style={{color:C.sub,fontWeight:'700',fontSize:16}}>Cancel</Text></TouchableOpacity><TouchableOpacity onPress={saveExp} style={{flex:1,paddingVertical:16,borderRadius:16,backgroundColor:C.teal,alignItems:'center'}}><Text style={{color:'#fff',fontWeight:'700',fontSize:16}}>Save</Text></TouchableOpacity></View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <ScreenHeader title="Jobs" right={<TouchableOpacity onPress={openAdd} style={{backgroundColor:C.teal,borderRadius:20,paddingHorizontal:16,paddingVertical:8}}><Text style={{color:'#fff',fontWeight:'700',fontSize:14}}>+ New</Text></TouchableOpacity>}/>
      <View style={{backgroundColor:C.surface,borderBottomWidth:1,borderBottomColor:C.border}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{paddingHorizontal:20,paddingVertical:10}}>
          {['All',...JOB_STATUSES].map(s=><Pill key={s} label={s} active={filterStatus===s} onPress={()=>setFilterStatus(s)} color={s==='Completed'?C.green:s==='Cancelled'?C.red:C.teal}/>)}
          <View style={{width:8}}/>
        </ScrollView>
      </View>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,maxWidth:900,alignSelf:'center',width:'100%'}}>
        {filtered.length===0&&<Text style={{color:C.sub,textAlign:'center',marginTop:60}}>No jobs found. Tap + New to add one.</Text>}
        {filtered.map(j=>(
          <TouchableOpacity key={j.id} onPress={()=>setSel(j)} activeOpacity={0.85}>
            <Card style={{marginBottom:12}}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <View style={{flex:1}}><Text style={{color:C.text,fontSize:15,fontWeight:'700'}}>{j.name}</Text><Text style={{color:C.sub,fontSize:13,marginTop:2}}>{j.client}{j.category?' - '+j.category:''}</Text><View style={{flexDirection:'row',marginTop:8}}><Badge label={j.status} color={sColor(j.status)}/>{(j.team||[]).length>0&&<View style={{backgroundColor:C.surf2,borderRadius:12,paddingHorizontal:10,paddingVertical:3,marginLeft:8}}><Text style={{color:C.sub,fontSize:11}}>{j.team.length} assigned</Text></View>}</View></View>
                {j.budget?<Text style={{color:C.teal,fontWeight:'800',fontSize:16,marginLeft:12}}>{fmtFull(j.budget)}</Text>:null}
              </View>
            </Card>
          </TouchableOpacity>
        ))}
        <View style={{height:40}}/>
      </ScrollView>
      <Modal visible={showAdd} animationType="slide" transparent>
        <View style={{flex:1,backgroundColor:'#000A',justifyContent:'flex-end'}}>
          <ScrollView style={{maxHeight:'90%'}}>
            <View style={{backgroundColor:C.surface,borderTopLeftRadius:24,borderTopRightRadius:24,padding:24,paddingBottom:40}}>
              <Text style={{color:C.text,fontSize:20,fontWeight:'800',marginBottom:20}}>{editing?'Edit Job':'New Job'}</Text>
              {[['Job Name','name','default'],['Client Name','client','default'],['Budget','budget','numeric']].map(([label,key,kb])=>(
                <View key={key} style={{marginBottom:14}}><Text style={{color:C.sub,fontSize:12,marginBottom:6,fontWeight:'600'}}>{label.toUpperCase()}</Text><TextInput style={{backgroundColor:C.bg,borderRadius:12,paddingHorizontal:14,paddingVertical:12,color:C.text,fontSize:15}} placeholder={label} placeholderTextColor={C.sub} keyboardType={kb} value={form[key]} onChangeText={v=>setForm(f=>({...f,[key]:v}))}/></View>
              ))}
              <Text style={{color:C.sub,fontSize:12,marginBottom:8,fontWeight:'600'}}>CATEGORY</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:14}}>{JOB_CATEGORIES.map(c=><TouchableOpacity key={c} onPress={()=>setForm(f=>({...f,category:c}))} style={{paddingHorizontal:12,paddingVertical:8,borderRadius:20,marginRight:8,backgroundColor:form.category===c?C.teal:C.bg,borderWidth:1,borderColor:form.category===c?C.teal:C.border}}><Text style={{color:form.category===c?'#fff':C.sub,fontSize:12,fontWeight:'600'}}>{c}</Text></TouchableOpacity>)}</ScrollView>
              <Text style={{color:C.sub,fontSize:12,marginBottom:8,fontWeight:'600'}}>STATUS</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:14}}>{JOB_STATUSES.map(s=><TouchableOpacity key={s} onPress={()=>setForm(f=>({...f,status:s}))} style={{paddingHorizontal:12,paddingVertical:8,borderRadius:20,marginRight:8,backgroundColor:form.status===s?C.teal:C.bg,borderWidth:1,borderColor:form.status===s?C.teal:C.border}}><Text style={{color:form.status===s?'#fff':C.sub,fontSize:12,fontWeight:'600'}}>{s}</Text></TouchableOpacity>)}</ScrollView>
              <Text style={{color:C.sub,fontSize:12,marginBottom:6,fontWeight:'600'}}>NOTES</Text>
              <TextInput style={{backgroundColor:C.bg,borderRadius:12,paddingHorizontal:14,paddingVertical:12,color:C.text,fontSize:15,marginBottom:20}} placeholder="Optional notes..." placeholderTextColor={C.sub} multiline numberOfLines={3} value={form.notes} onChangeText={v=>setForm(f=>({...f,notes:v}))}/>
              <View style={{flexDirection:'row'}}><TouchableOpacity onPress={()=>setShowAdd(false)} style={{flex:1,paddingVertical:16,borderRadius:16,backgroundColor:C.bg,alignItems:'center',marginRight:12}}><Text style={{color:C.sub,fontWeight:'700',fontSize:16}}>Cancel</Text></TouchableOpacity><TouchableOpacity onPress={saveJob} style={{flex:1,paddingVertical:16,borderRadius:16,backgroundColor:C.teal,alignItems:'center'}}><Text style={{color:'#fff',fontWeight:'700',fontSize:16}}>Save Job</Text></TouchableOpacity></View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </Animated.View>
  );
}

function TeamScreen({store}) {
  const {team,addTeam,updateTeam,deleteTeam,jobs}=store;
  const [sel,setSel]=React.useState(null);
  const [showAdd,setShowAdd]=React.useState(false);
  const [editing,setEditing]=React.useState(false);
  const [search,setSearch]=React.useState('');
  const [form,setForm]=React.useState({name:'',role:'',email:'',phone:'',rate:'',status:'Active',skills:''});
  const anim=React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{Animated.timing(anim,{toValue:1,duration:400,useNativeDriver:true}).start();},[]);
  const STATUSES=['Active','Away','Unavailable'];
  const filtered=team.filter(m=>m.name.toLowerCase().includes(search.toLowerCase())||m.role.toLowerCase().includes(search.toLowerCase()));
  function sColor(s){return s==='Active'?C.green:s==='Away'?C.gold:C.red;}
  const roleColors={Director:C.purple,Developer:C.blue,'Project Manager':C.teal,'Marketing Lead':C.orange,Designer:C.gold,Copywriter:C.green,Consultant:C.blue,Engineer:C.teal,Accountant:C.purple,Manager:C.blue};
  function rColor(r){return roleColors[r]||C.sub;}
  function cycleStatus(m){const i=STATUSES.indexOf(m.status);const next=STATUSES[(i+1)%3];updateTeam(m.id,{...m,status:next});}
  function openAdd(){setForm({name:'',role:'',email:'',phone:'',rate:'',status:'Active',skills:''});setEditing(false);setShowAdd(true);}
  function openEdit(m){setForm({name:m.name,role:m.role,email:m.email||'',phone:m.phone||'',rate:String(m.rate||''),status:m.status,skills:(m.skills||[]).join(', ')});setEditing(true);setShowAdd(true);setSel(null);}
  function saveMember(){if(!form.name.trim()||!form.role.trim()){Alert.alert('Required','Name and role are required');return;}const data={...form,rate:parseFloat(form.rate)||0,skills:form.skills.split(',').map(s=>s.trim()).filter(Boolean)};if(editing&&sel){updateTeam(sel.id,{...sel,...data});}else{addTeam({...data,id:Date.now().toString()});}setShowAdd(false);}
  function delMember(m){Alert.alert('Remove Member','Remove '+m.name+' from team?',[{text:'Cancel',style:'cancel'},{text:'Remove',style:'destructive',onPress:()=>{deleteTeam(m.id);setSel(null);}}]);}
  if(sel&&!showAdd){
    const myJobs=jobs.filter(j=>(j.team||[]).includes(sel.id));
    return (
      <View style={{flex:1,backgroundColor:C.bg}}>
        <ScreenHeader title={sel.name} sub={sel.role} onBack={()=>setSel(null)} right={<View style={{flexDirection:'row'}}><TouchableOpacity onPress={()=>openEdit(sel)} style={{padding:8,marginRight:4}}><Text style={{color:C.teal,fontWeight:'700'}}>Edit</Text></TouchableOpacity><TouchableOpacity onPress={()=>delMember(sel)} style={{padding:8}}><Text style={{color:C.red,fontWeight:'700'}}>Remove</Text></TouchableOpacity></View>}/>
        <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,maxWidth:900,alignSelf:'center',width:'100%'}}>
          <Card style={{marginBottom:16,alignItems:'center',paddingVertical:20}}>
            <Avatar name={sel.name} color={rColor(sel.role)} size={64}/>
            <Text style={{color:C.text,fontSize:20,fontWeight:'800',marginTop:12}}>{sel.name}</Text>
            <Text style={{color:C.sub,fontSize:14,marginTop:3}}>{sel.role}</Text>
            <TouchableOpacity onPress={()=>cycleStatus(sel)} style={{marginTop:10,backgroundColor:sColor(sel.status)+'22',borderRadius:20,paddingHorizontal:14,paddingVertical:5}}><Text style={{color:sColor(sel.status),fontWeight:'700',fontSize:12}}>{sel.status} - tap to change</Text></TouchableOpacity>
          </Card>
          <Card style={{marginBottom:16}}>
            <SectionHeader title="CONTACT"/>
            {sel.email&&<View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:10}}><Text style={{color:C.sub}}>Email</Text><Text style={{color:C.text,fontWeight:'600'}}>{sel.email}</Text></View>}
            {sel.phone&&<View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:10}}><Text style={{color:C.sub}}>Phone</Text><Text style={{color:C.text,fontWeight:'600'}}>{sel.phone}</Text></View>}
            <View style={{flexDirection:'row',justifyContent:'space-between'}}><Text style={{color:C.sub}}>Day Rate</Text><Text style={{color:C.teal,fontWeight:'700'}}>{fmtFull(sel.rate)}/day</Text></View>
          </Card>
          {(sel.skills||[]).length>0&&<Card style={{marginBottom:16}}><SectionHeader title="SKILLS"/><View style={{flexDirection:'row',flexWrap:'wrap'}}>{sel.skills.map(sk=><View key={sk} style={{backgroundColor:C.teal+'22',borderRadius:20,paddingHorizontal:12,paddingVertical:5,marginRight:8,marginBottom:8}}><Text style={{color:C.teal,fontSize:12,fontWeight:'600'}}>{sk}</Text></View>)}</View></Card>}
          <Card><SectionHeader title={'ASSIGNED JOBS ('+myJobs.length+')'}/>{myJobs.length===0&&<Text style={{color:C.sub,fontSize:13}}>Not assigned to any jobs</Text>}{myJobs.map(j=><View key={j.id} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:8,borderBottomWidth:1,borderBottomColor:C.border}}><Text style={{color:C.text,fontSize:14,fontWeight:'600',flex:1}}>{j.name}</Text><Badge label={j.status} color={j.status==='In Progress'?C.teal:j.status==='Completed'?C.green:C.gold}/></View>)}</Card>
          <View style={{height:40}}/>
        </ScrollView>
      </View>
    );
  }
  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <ScreenHeader title="Team" right={<TouchableOpacity onPress={openAdd} style={{backgroundColor:C.teal,borderRadius:20,paddingHorizontal:16,paddingVertical:8}}><Text style={{color:'#fff',fontWeight:'700',fontSize:14}}>+ Add</Text></TouchableOpacity>}/>
      <View style={{paddingHorizontal:20,paddingVertical:12,backgroundColor:C.surface,borderBottomWidth:1,borderBottomColor:C.border}}>
        <View style={{backgroundColor:C.bg,borderRadius:12,paddingHorizontal:14,paddingVertical:10,flexDirection:'row',alignItems:'center'}}><Text style={{color:C.sub,marginRight:8}}>S</Text><TextInput style={{flex:1,color:C.text,fontSize:15}} placeholder="Search team..." placeholderTextColor={C.sub} value={search} onChangeText={setSearch}/></View>
      </View>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,maxWidth:900,alignSelf:'center',width:'100%'}}>
        {filtered.length===0&&<Text style={{color:C.sub,textAlign:'center',marginTop:40}}>No team members found</Text>}
        {filtered.map(m=>(
          <TouchableOpacity key={m.id} onPress={()=>setSel(m)} activeOpacity={0.85}>
            <Card style={{marginBottom:12}}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Avatar name={m.name} color={rColor(m.role)} size={48}/>
                <View style={{flex:1,marginLeft:14}}><Text style={{color:C.text,fontSize:16,fontWeight:'700'}}>{m.name}</Text><Text style={{color:C.sub,fontSize:13,marginTop:2}}>{m.role}</Text>{m.rate?<Text style={{color:C.teal,fontSize:12,marginTop:2,fontWeight:'600'}}>{fmtFull(m.rate)}/day</Text>:null}</View>
                <View style={{alignItems:'flex-end'}}><TouchableOpacity onPress={()=>cycleStatus(m)} style={{backgroundColor:sColor(m.status)+'22',borderRadius:20,paddingHorizontal:10,paddingVertical:5}}><Text style={{color:sColor(m.status),fontSize:11,fontWeight:'700'}}>{m.status}</Text></TouchableOpacity><Text style={{color:C.dimmer,fontSize:11,marginTop:6}}>View profile</Text></View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
        <View style={{height:40}}/>
      </ScrollView>
      <Modal visible={showAdd} animationType="slide" transparent>
        <View style={{flex:1,backgroundColor:'#000A',justifyContent:'flex-end'}}>
          <ScrollView style={{maxHeight:'90%'}}>
            <View style={{backgroundColor:C.surface,borderTopLeftRadius:24,borderTopRightRadius:24,padding:24,paddingBottom:40}}>
              <Text style={{color:C.text,fontSize:20,fontWeight:'800',marginBottom:20}}>{editing?'Edit Member':'Add Team Member'}</Text>
              {[['Full Name','name','default'],['Job Role','role','default'],['Email','email','email-address'],['Phone','phone','phone-pad'],['Day Rate','rate','numeric'],['Skills (comma separated)','skills','default']].map(([label,key,kb])=>(
                <View key={key} style={{marginBottom:14}}><Text style={{color:C.sub,fontSize:12,marginBottom:6,fontWeight:'600'}}>{label.toUpperCase()}</Text><TextInput style={{backgroundColor:C.bg,borderRadius:12,paddingHorizontal:14,paddingVertical:12,color:C.text,fontSize:15}} placeholder={label} placeholderTextColor={C.sub} keyboardType={kb} value={form[key]} onChangeText={v=>setForm(f=>({...f,[key]:v}))}/></View>
              ))}
              <Text style={{color:C.sub,fontSize:12,marginBottom:8,fontWeight:'600'}}>STATUS</Text>
              <View style={{flexDirection:'row',marginBottom:20}}>{STATUSES.map(s=><TouchableOpacity key={s} onPress={()=>setForm(f=>({...f,status:s}))} style={{flex:1,alignItems:'center',paddingVertical:10,borderRadius:12,marginRight:s!=='Unavailable'?8:0,backgroundColor:form.status===s?sColor(s)+'33':C.bg,borderWidth:1.5,borderColor:form.status===s?sColor(s):C.border}}><Text style={{color:form.status===s?sColor(s):C.sub,fontWeight:'700',fontSize:12}}>{s}</Text></TouchableOpacity>)}</View>
              <View style={{flexDirection:'row'}}><TouchableOpacity onPress={()=>setShowAdd(false)} style={{flex:1,paddingVertical:16,borderRadius:16,backgroundColor:C.bg,alignItems:'center',marginRight:12}}><Text style={{color:C.sub,fontWeight:'700',fontSize:16}}>Cancel</Text></TouchableOpacity><TouchableOpacity onPress={saveMember} style={{flex:1,paddingVertical:16,borderRadius:16,backgroundColor:C.teal,alignItems:'center'}}><Text style={{color:'#fff',fontWeight:'700',fontSize:16}}>Save</Text></TouchableOpacity></View>
            </View>
          </ScrollView>
        </View>
      </Modal>
    </Animated.View>
  );
}

function ClientsScreen({store}) {
  const {clients,addClient,updateClient,deleteClient,jobs,invoices}=store;
  const [sel,setSel]=React.useState(null);
  const [showAdd,setShowAdd]=React.useState(false);
  const [editing,setEditing]=React.useState(false);
  const [form,setForm]=React.useState({name:'',industry:'',contact:'',email:'',phone:'',status:'Active'});
  const anim=React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{Animated.timing(anim,{toValue:1,duration:400,useNativeDriver:true}).start();},[]);
  const CSTATUSES=['Active','Prospect','Inactive'];
  function sColor(s){return s==='Active'?C.green:s==='Prospect'?C.gold:C.sub;}
  function openAdd(){setForm({name:'',industry:'',contact:'',email:'',phone:'',status:'Active'});setEditing(false);setShowAdd(true);}
  function openEdit(c){setForm({name:c.name,industry:c.industry||'',contact:c.contact||'',email:c.email||'',phone:c.phone||'',status:c.status});setEditing(true);setShowAdd(true);setSel(null);}
  function saveClient(){if(!form.name.trim()){Alert.alert('Required','Client name is required');return;}const data={...form,value:0};if(editing&&sel){updateClient(sel.id,{...sel,...data});}else{addClient({...data,id:Date.now().toString()});}setShowAdd(false);}
  function delClient(c){Alert.alert('Delete Client','Delete '+c.name+'?',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>{deleteClient(c.id);setSel(null);}}]);}
  if(sel&&!showAdd){
    const myJobs=jobs.filter(j=>j.client===sel.name);
    const myInvs=invoices.filter(i=>i.client===sel.name);
    const totalValue=myInvs.filter(i=>i.status==='Paid').reduce((a,b)=>a+(b.amount||0),0);
    return (
      <View style={{flex:1,backgroundColor:C.bg}}>
        <ScreenHeader title={sel.name} sub={sel.industry} onBack={()=>setSel(null)} right={<View style={{flexDirection:'row'}}><TouchableOpacity onPress={()=>openEdit(sel)} style={{padding:8,marginRight:4}}><Text style={{color:C.teal,fontWeight:'700'}}>Edit</Text></TouchableOpacity><TouchableOpacity onPress={()=>delClient(sel)} style={{padding:8}}><Text style={{color:C.red,fontWeight:'700'}}>Delete</Text></TouchableOpacity></View>}/>
        <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,maxWidth:900,alignSelf:'center',width:'100%'}}>
          <View style={{flexDirection:'row',marginBottom:16}}>
            <View style={{flex:1,backgroundColor:C.surface,borderRadius:14,padding:14,marginRight:8,borderWidth:1,borderColor:C.border,alignItems:'center'}}><Text style={{color:C.teal,fontSize:20,fontWeight:'800'}}>{fmtFull(totalValue)}</Text><Text style={{color:C.sub,fontSize:11,marginTop:4}}>Total Paid</Text></View>
            <View style={{flex:1,backgroundColor:C.surface,borderRadius:14,padding:14,marginRight:8,borderWidth:1,borderColor:C.border,alignItems:'center'}}><Text style={{color:C.blue,fontSize:20,fontWeight:'800'}}>{myJobs.length}</Text><Text style={{color:C.sub,fontSize:11,marginTop:4}}>Jobs</Text></View>
            <View style={{flex:1,backgroundColor:C.surface,borderRadius:14,padding:14,borderWidth:1,borderColor:C.border,alignItems:'center'}}><Badge label={sel.status} color={sColor(sel.status)}/><Text style={{color:C.sub,fontSize:11,marginTop:6}}>Status</Text></View>
          </View>
          <Card style={{marginBottom:16}}><SectionHeader title="CONTACT DETAILS"/>{sel.contact&&<View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:10}}><Text style={{color:C.sub}}>Contact</Text><Text style={{color:C.text,fontWeight:'600'}}>{sel.contact}</Text></View>}{sel.email&&<View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:10}}><Text style={{color:C.sub}}>Email</Text><Text style={{color:C.text,fontWeight:'600'}}>{sel.email}</Text></View>}{sel.phone&&<View style={{flexDirection:'row',justifyContent:'space-between'}}><Text style={{color:C.sub}}>Phone</Text><Text style={{color:C.text,fontWeight:'600'}}>{sel.phone}</Text></View>}</Card>
          <Card style={{marginBottom:16}}><SectionHeader title={'JOBS ('+myJobs.length+')'}/>{myJobs.length===0&&<Text style={{color:C.sub,fontSize:13}}>No jobs with this client yet</Text>}{myJobs.map(j=><View key={j.id} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:9,borderBottomWidth:1,borderBottomColor:C.border}}><Text style={{color:C.text,fontSize:14,fontWeight:'600',flex:1}}>{j.name}</Text><Text style={{color:C.teal,fontWeight:'700',fontSize:13}}>{fmtFull(j.budget)}</Text></View>)}</Card>
          <Card><SectionHeader title={'INVOICES ('+myInvs.length+')'}/>{myInvs.length===0&&<Text style={{color:C.sub,fontSize:13}}>No invoices for this client</Text>}{myInvs.map(iv=><View key={iv.id} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:9,borderBottomWidth:1,borderBottomColor:C.border}}><View><Text style={{color:C.text,fontSize:14,fontWeight:'600'}}>{iv.number}</Text><Text style={{color:C.sub,fontSize:11,marginTop:2}}>{iv.status}</Text></View><Text style={{color:C.teal,fontWeight:'700'}}>{fmtFull(iv.amount)}</Text></View>)}</Card>
          <View style={{height:40}}/>
        </ScrollView>
      </View>
    );
  }
  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <ScreenHeader title="Clients" right={<TouchableOpacity onPress={openAdd} style={{backgroundColor:C.teal,borderRadius:20,paddingHorizontal:16,paddingVertical:8}}><Text style={{color:'#fff',fontWeight:'700',fontSize:14}}>+ Add</Text></TouchableOpacity>}/>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,maxWidth:900,alignSelf:'center',width:'100%'}}>
        <View style={{flexDirection:'row',marginBottom:20}}>{[['Active',clients.filter(c=>c.status==='Active').length,C.green],['Prospects',clients.filter(c=>c.status==='Prospect').length,C.gold],['Total',clients.length,C.blue]].map(([label,count,color])=><View key={label} style={{flex:1,backgroundColor:C.surface,borderRadius:14,padding:14,marginRight:label!=='Total'?8:0,borderWidth:1,borderColor:C.border,alignItems:'center'}}><Text style={{color:color,fontSize:20,fontWeight:'800'}}>{count}</Text><Text style={{color:C.sub,fontSize:11,marginTop:4}}>{label}</Text></View>)}</View>
        {clients.length===0&&<Text style={{color:C.sub,textAlign:'center',marginTop:60}}>No clients yet. Add your first client.</Text>}
        {clients.map(c=><TouchableOpacity key={c.id} onPress={()=>setSel(c)} activeOpacity={0.85}><Card style={{marginBottom:12}}><View style={{flexDirection:'row',alignItems:'center'}}><Avatar name={c.name} color={sColor(c.status)} size={46}/><View style={{flex:1,marginLeft:14}}><Text style={{color:C.text,fontSize:15,fontWeight:'700'}}>{c.name}</Text><Text style={{color:C.sub,fontSize:13,marginTop:2}}>{c.industry}{c.contact?' - '+c.contact:''}</Text></View><Badge label={c.status} color={sColor(c.status)}/></View></Card></TouchableOpacity>)}
        <View style={{height:40}}/>
      </ScrollView>
      <Modal visible={showAdd} animationType="slide" transparent>
        <View style={{flex:1,backgroundColor:'#000A',justifyContent:'flex-end'}}>
          <View style={{backgroundColor:C.surface,borderTopLeftRadius:24,borderTopRightRadius:24,padding:24,paddingBottom:40}}>
            <Text style={{color:C.text,fontSize:20,fontWeight:'800',marginBottom:20}}>{editing?'Edit Client':'New Client'}</Text>
            {[['Company Name','name','default'],['Industry','industry','default'],['Main Contact','contact','default'],['Email','email','email-address'],['Phone','phone','phone-pad']].map(([label,key,kb])=>(
              <View key={key} style={{marginBottom:14}}><Text style={{color:C.sub,fontSize:12,marginBottom:6,fontWeight:'600'}}>{label.toUpperCase()}</Text><TextInput style={{backgroundColor:C.bg,borderRadius:12,paddingHorizontal:14,paddingVertical:12,color:C.text,fontSize:15}} placeholder={label} placeholderTextColor={C.sub} keyboardType={kb} value={form[key]} onChangeText={v=>setForm(f=>({...f,[key]:v}))}/></View>
            ))}
            <Text style={{color:C.sub,fontSize:12,marginBottom:8,fontWeight:'600'}}>STATUS</Text>
            <View style={{flexDirection:'row',marginBottom:20}}>{CSTATUSES.map(s=><TouchableOpacity key={s} onPress={()=>setForm(f=>({...f,status:s}))} style={{flex:1,alignItems:'center',paddingVertical:10,borderRadius:12,marginRight:s!=='Inactive'?8:0,backgroundColor:form.status===s?sColor(s)+'33':C.bg,borderWidth:1.5,borderColor:form.status===s?sColor(s):C.border}}><Text style={{color:form.status===s?sColor(s):C.sub,fontWeight:'700',fontSize:12}}>{s}</Text></TouchableOpacity>)}</View>
            <View style={{flexDirection:'row'}}><TouchableOpacity onPress={()=>setShowAdd(false)} style={{flex:1,paddingVertical:16,borderRadius:16,backgroundColor:C.bg,alignItems:'center',marginRight:12}}><Text style={{color:C.sub,fontWeight:'700',fontSize:16}}>Cancel</Text></TouchableOpacity><TouchableOpacity onPress={saveClient} style={{flex:1,paddingVertical:16,borderRadius:16,backgroundColor:C.teal,alignItems:'center'}}><Text style={{color:'#fff',fontWeight:'700',fontSize:16}}>Save</Text></TouchableOpacity></View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}

function MessagesScreen({store,onBack}) {
  const {messages,addMessage,jobs}=store;
  const threads=['General',...jobs.slice(0,5).map(j=>j.name)];
  const [activeThread,setActiveThread]=React.useState(null);
  const [msgText,setMsgText]=React.useState('');
  const scrollRef=React.useRef(null);
  const anim=React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{Animated.timing(anim,{toValue:1,duration:350,useNativeDriver:true}).start();},[]);
  function threadMsgs(t){return messages.filter(m=>m.thread===t);}
  function lastMsg(t){const ms=threadMsgs(t);return ms.length>0?ms[ms.length-1]:null;}
  function sendMsg(){if(!msgText.trim()) return;addMessage({id:Date.now().toString(),thread:activeThread,sender:'You',text:msgText.trim(),time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})});setMsgText('');setTimeout(()=>scrollRef.current&&scrollRef.current.scrollToEnd({animated:true}),100);}
  if(activeThread){
    const msgs=threadMsgs(activeThread);
    return (
      <View style={{flex:1,backgroundColor:C.bg}}>
        <View style={{backgroundColor:C.surface,paddingTop:52,paddingBottom:16,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:C.border,flexDirection:'row',alignItems:'center'}}>
          <TouchableOpacity onPress={()=>setActiveThread(null)} style={{marginRight:14}}><Text style={{color:C.teal,fontSize:15,fontWeight:'600'}}>{'< Back'}</Text></TouchableOpacity>
          <View style={{flex:1}}><Text style={{color:C.text,fontSize:17,fontWeight:'800'}}>{activeThread}</Text><Text style={{color:C.sub,fontSize:12,marginTop:2}}>{msgs.length} messages</Text></View>
        </View>
        <ScrollView ref={scrollRef} style={{flex:1}} contentContainerStyle={{padding:16,maxWidth:900,alignSelf:'center',width:'100%'}} onContentSizeChange={()=>scrollRef.current&&scrollRef.current.scrollToEnd({animated:false})}>
          {msgs.length===0&&<Text style={{color:C.sub,textAlign:'center',marginTop:40}}>No messages yet. Start the conversation!</Text>}
          {msgs.map(m=>{const isMe=m.sender==='You';return(
            <View key={m.id} style={{marginBottom:12,alignItems:isMe?'flex-end':'flex-start'}}>
              {!isMe&&<Text style={{color:C.sub,fontSize:11,marginBottom:4,marginLeft:4}}>{m.sender}</Text>}
              <View style={{maxWidth:'80%',backgroundColor:isMe?C.teal:C.surface,borderRadius:18,borderBottomRightRadius:isMe?4:18,borderBottomLeftRadius:isMe?18:4,paddingHorizontal:16,paddingVertical:10}}>
                <Text style={{color:'#fff',fontSize:15,lineHeight:21}}>{m.text}</Text>
              </View>
              <Text style={{color:C.sub,fontSize:10,marginTop:4}}>{m.time}</Text>
            </View>
          );})}
        </ScrollView>
        <View style={{backgroundColor:C.surface,borderTopWidth:1,borderTopColor:C.border,flexDirection:'row',alignItems:'center',paddingHorizontal:16,paddingVertical:12,paddingBottom:28}}>
          <TextInput style={{flex:1,backgroundColor:C.bg,borderRadius:24,paddingHorizontal:18,paddingVertical:12,color:C.text,fontSize:15,marginRight:10}} placeholder="Type a message..." placeholderTextColor={C.sub} value={msgText} onChangeText={setMsgText} multiline/>
          <TouchableOpacity onPress={sendMsg} style={{backgroundColor:C.teal,width:44,height:44,borderRadius:22,alignItems:'center',justifyContent:'center'}}><Text style={{color:'#fff',fontWeight:'800',fontSize:18}}>{'>'}</Text></TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <ScreenHeader title="Messages" onBack={onBack}/>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,maxWidth:900,alignSelf:'center',width:'100%'}}>
        {threads.map(t=>{const last=lastMsg(t);return(
          <TouchableOpacity key={t} onPress={()=>setActiveThread(t)} activeOpacity={0.85}>
            <Card style={{marginBottom:12}}><View style={{flexDirection:'row',alignItems:'center'}}><Avatar name={t} color={C.teal} size={46}/><View style={{flex:1,marginLeft:14}}><Text style={{color:C.text,fontSize:15,fontWeight:'700'}}>{t}</Text><Text style={{color:C.sub,fontSize:13,marginTop:3}} numberOfLines={1}>{last?last.text:'No messages yet'}</Text></View>{last&&<Text style={{color:C.sub,fontSize:11}}>{last.time}</Text>}</View></Card>
          </TouchableOpacity>
        );})}
        <View style={{height:40}}/>
      </ScrollView>
    </Animated.View>
  );
}

function InvoicesScreen({store,onBack}) {
  const {invoices,addInvoice,updateInvoice,deleteInvoice}=store;
  const [sel,setSel]=React.useState(null);
  const [showAdd,setShowAdd]=React.useState(false);
  const [filter,setFilter]=React.useState('All');
  const [uploading,setUploading]=React.useState(false);
  const [form,setForm]=React.useState({number:'',client:'',amount:'',status:'Draft',dueDate:'',notes:''});
  const anim=React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{Animated.timing(anim,{toValue:1,duration:400,useNativeDriver:true}).start();},[]);
  const FILTERS=['All','Draft','Sent','Paid','Overdue'];
  const INV_STATUSES=['Draft','Sent','Paid','Overdue'];
  function iColor(s){if(s==='Paid') return C.green;if(s==='Sent') return C.blue;if(s==='Overdue') return C.red;return C.sub;}
  const filtered=filter==='All'?invoices:invoices.filter(i=>i.status===filter);
  const totalPaid=invoices.filter(i=>i.status==='Paid').reduce((a,b)=>a+(b.amount||0),0);
  const totalPending=invoices.filter(i=>i.status==='Sent'||i.status==='Draft').reduce((a,b)=>a+(b.amount||0),0);
  const totalOverdue=invoices.filter(i=>i.status==='Overdue').reduce((a,b)=>a+(b.amount||0),0);
  function openAdd(){setForm({number:'INV-'+String(invoices.length+1).padStart(3,'0'),client:'',amount:'',status:'Draft',dueDate:'',notes:''});setShowAdd(true);}
  function saveInvoice(){if(!form.client.trim()||!form.amount.trim()){Alert.alert('Required','Client and amount are required');return;}addInvoice({...form,amount:parseFloat(form.amount)||0,id:Date.now().toString(),attachments:[]});setShowAdd(false);}
  function upStatus(inv,s){const u={...inv,status:s};updateInvoice(inv.id,u);setSel(u);}
  function simulateUpload(inv){const names=['invoice_backup.pdf','receipt_scan.pdf','contract_signed.pdf','project_brief.pdf'];const name=names[Math.floor(Math.random()*names.length)];setUploading(true);setTimeout(()=>{const u={...inv,attachments:[...(inv.attachments||[]),{id:Date.now().toString(),name,size:'128 KB'}]};updateInvoice(inv.id,u);setSel(u);setUploading(false);},1200);}
  function removeAtt(inv,aid){const u={...inv,attachments:(inv.attachments||[]).filter(a=>a.id!==aid)};updateInvoice(inv.id,u);setSel(u);}
  function delInvoice(inv){Alert.alert('Delete Invoice','Delete '+inv.number+'?',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>{deleteInvoice(inv.id);setSel(null);}}]);}
  if(sel&&!showAdd){
    return (
      <View style={{flex:1,backgroundColor:C.bg}}>
        <ScreenHeader title={sel.number} sub={sel.client} onBack={()=>setSel(null)} right={<Badge label={sel.status} color={iColor(sel.status)}/>}/>
        <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,maxWidth:900,alignSelf:'center',width:'100%'}}>
          <Card style={{marginBottom:16,alignItems:'center',paddingVertical:16}}>
            <Text style={{color:C.sub,fontSize:13,marginBottom:4}}>Invoice Total</Text>
            <Text style={{color:C.teal,fontSize:38,fontWeight:'900'}}>{fmtFull(sel.amount)}</Text>
            {sel.dueDate&&<Text style={{color:C.sub,fontSize:13,marginTop:6}}>Due: {sel.dueDate}</Text>}
          </Card>
          <View style={{flexDirection:'row',marginBottom:16}}>
            {sel.status!=='Paid'&&<TouchableOpacity onPress={()=>upStatus(sel,'Paid')} style={{flex:1,backgroundColor:C.green+'22',borderRadius:14,paddingVertical:14,alignItems:'center',marginRight:8}}><Text style={{color:C.green,fontWeight:'700'}}>Mark Paid</Text></TouchableOpacity>}
            {sel.status==='Draft'&&<TouchableOpacity onPress={()=>Alert.alert('Send Invoice','Mark as Sent?',[{text:'Cancel',style:'cancel'},{text:'Send',onPress:()=>upStatus(sel,'Sent')}])} style={{flex:1,backgroundColor:C.teal,borderRadius:14,paddingVertical:14,alignItems:'center',marginRight:8}}><Text style={{color:'#fff',fontWeight:'700'}}>Send</Text></TouchableOpacity>}
            {sel.status!=='Overdue'&&sel.status!=='Paid'&&<TouchableOpacity onPress={()=>upStatus(sel,'Overdue')} style={{flex:1,backgroundColor:C.red+'22',borderRadius:14,paddingVertical:14,alignItems:'center'}}><Text style={{color:C.red,fontWeight:'700'}}>Mark Overdue</Text></TouchableOpacity>}
          </View>
          <Card style={{marginBottom:16}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:12}}><Text style={{color:C.sub,fontSize:11,fontWeight:'700',letterSpacing:1}}>ATTACHMENTS</Text><TouchableOpacity onPress={()=>simulateUpload(sel)} disabled={uploading} style={{backgroundColor:C.teal,borderRadius:12,paddingHorizontal:12,paddingVertical:5}}><Text style={{color:'#fff',fontWeight:'700',fontSize:12}}>{uploading?'Uploading...':'+ Attach'}</Text></TouchableOpacity></View>
            {(sel.attachments||[]).length===0&&<Text style={{color:C.sub,fontSize:13}}>No attachments yet</Text>}
            {(sel.attachments||[]).map(a=><View key={a.id} style={{flexDirection:'row',alignItems:'center',backgroundColor:C.bg,borderRadius:10,padding:12,marginBottom:8}}><View style={{width:36,height:36,borderRadius:8,backgroundColor:C.teal+'22',alignItems:'center',justifyContent:'center',marginRight:12}}><Text style={{color:C.teal,fontWeight:'800',fontSize:11}}>PDF</Text></View><View style={{flex:1}}><Text style={{color:C.text,fontSize:13,fontWeight:'600'}}>{a.name}</Text><Text style={{color:C.sub,fontSize:11,marginTop:2}}>{a.size}</Text></View><TouchableOpacity onPress={()=>removeAtt(sel,a.id)}><Text style={{color:C.red,fontWeight:'700',fontSize:13}}>Remove</Text></TouchableOpacity></View>)}
          </Card>
          <TouchableOpacity onPress={()=>delInvoice(sel)} style={{paddingVertical:14,borderRadius:14,borderWidth:1.5,borderColor:C.red,alignItems:'center'}}><Text style={{color:C.red,fontWeight:'700',fontSize:15}}>Delete Invoice</Text></TouchableOpacity>
          <View style={{height:40}}/>
        </ScrollView>
      </View>
    );
  }
  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <ScreenHeader title="Invoices" onBack={onBack} right={<TouchableOpacity onPress={openAdd} style={{backgroundColor:C.teal,borderRadius:20,paddingHorizontal:16,paddingVertical:8}}><Text style={{color:'#fff',fontWeight:'700',fontSize:14}}>+ New</Text></TouchableOpacity>}/>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,maxWidth:900,alignSelf:'center',width:'100%'}}>
        <View style={{flexDirection:'row',marginBottom:16}}>
          <View style={{flex:1,backgroundColor:C.surface,borderRadius:14,padding:14,marginRight:8,borderWidth:1,borderColor:C.border,alignItems:'center'}}><Text style={{color:C.green,fontWeight:'800',fontSize:17}}>{fmtFull(totalPaid)}</Text><Text style={{color:C.sub,fontSize:11,marginTop:4}}>Paid</Text></View>
          <View style={{flex:1,backgroundColor:C.surface,borderRadius:14,padding:14,marginRight:8,borderWidth:1,borderColor:C.border,alignItems:'center'}}><Text style={{color:C.teal,fontWeight:'800',fontSize:17}}>{fmtFull(totalPending)}</Text><Text style={{color:C.sub,fontSize:11,marginTop:4}}>Pending</Text></View>
          <View style={{flex:1,backgroundColor:C.surface,borderRadius:14,padding:14,borderWidth:1,borderColor:C.border,alignItems:'center'}}><Text style={{color:C.red,fontWeight:'800',fontSize:17}}>{fmtFull(totalOverdue)}</Text><Text style={{color:C.sub,fontSize:11,marginTop:4}}>Overdue</Text></View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:16}}>{FILTERS.map(f=><Pill key={f} label={f} active={filter===f} onPress={()=>setFilter(f)} color={f==='Paid'?C.green:f==='Overdue'?C.red:C.teal}/>)}</ScrollView>
        {filtered.length===0&&<Text style={{color:C.sub,textAlign:'center',marginTop:40}}>No invoices found</Text>}
        {filtered.map(iv=>(
          <TouchableOpacity key={iv.id} onPress={()=>setSel(iv)} activeOpacity={0.85}>
            <Card style={{marginBottom:12}}><View style={{flexDirection:'row',alignItems:'center'}}><View style={{flex:1}}><View style={{flexDirection:'row',alignItems:'center'}}><Text style={{color:C.text,fontSize:15,fontWeight:'700'}}>{iv.number}</Text><View style={{marginLeft:10}}><Badge label={iv.status} color={iColor(iv.status)}/></View></View><Text style={{color:C.sub,fontSize:13,marginTop:3}}>{iv.client}</Text>{iv.dueDate&&<Text style={{color:C.sub,fontSize:11,marginTop:2}}>Due {iv.dueDate}</Text>}</View><Text style={{color:C.teal,fontWeight:'800',fontSize:17}}>{fmtFull(iv.amount)}</Text></View></Card>
          </TouchableOpacity>
        ))}
        <View style={{height:40}}/>
      </ScrollView>
      <Modal visible={showAdd} animationType="slide" transparent>
        <View style={{flex:1,backgroundColor:'#000A',justifyContent:'flex-end'}}>
          <View style={{backgroundColor:C.surface,borderTopLeftRadius:24,borderTopRightRadius:24,padding:24,paddingBottom:40}}>
            <Text style={{color:C.text,fontSize:20,fontWeight:'800',marginBottom:20}}>New Invoice</Text>
            {[['Invoice Number','number','default'],['Client Name','client','default'],['Amount','amount','numeric'],['Due Date','dueDate','default']].map(([label,key,kb])=>(
              <View key={key} style={{marginBottom:14}}><Text style={{color:C.sub,fontSize:12,marginBottom:6,fontWeight:'600'}}>{label.toUpperCase()}</Text><TextInput style={{backgroundColor:C.bg,borderRadius:12,paddingHorizontal:14,paddingVertical:12,color:C.text,fontSize:15}} placeholder={label} placeholderTextColor={C.sub} keyboardType={kb} value={form[key]} onChangeText={v=>setForm(f=>({...f,[key]:v}))}/></View>
            ))}
            <Text style={{color:C.sub,fontSize:12,marginBottom:8,fontWeight:'600'}}>STATUS</Text>
            <View style={{flexDirection:'row',marginBottom:16}}>{INV_STATUSES.map(s=><TouchableOpacity key={s} onPress={()=>setForm(f=>({...f,status:s}))} style={{flex:1,alignItems:'center',paddingVertical:10,borderRadius:12,marginRight:s!=='Overdue'?6:0,backgroundColor:form.status===s?iColor(s)+'33':C.bg,borderWidth:1.5,borderColor:form.status===s?iColor(s):C.border}}><Text style={{color:form.status===s?iColor(s):C.sub,fontWeight:'700',fontSize:11}}>{s}</Text></TouchableOpacity>)}</View>
            <View style={{flexDirection:'row'}}><TouchableOpacity onPress={()=>setShowAdd(false)} style={{flex:1,paddingVertical:16,borderRadius:16,backgroundColor:C.bg,alignItems:'center',marginRight:12}}><Text style={{color:C.sub,fontWeight:'700',fontSize:16}}>Cancel</Text></TouchableOpacity><TouchableOpacity onPress={saveInvoice} style={{flex:1,paddingVertical:16,borderRadius:16,backgroundColor:C.teal,alignItems:'center'}}><Text style={{color:'#fff',fontWeight:'700',fontSize:16}}>Create</Text></TouchableOpacity></View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}

function ReportsScreen({store,onBack}) {
  const {jobs,invoices,team,clients}=store;
  const anim=React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{Animated.timing(anim,{toValue:1,duration:400,useNativeDriver:true}).start();},[]);
  const revenue=invoices.filter(i=>i.status==='Paid').reduce((a,b)=>a+(b.amount||0),0);
  const pipeline=jobs.filter(j=>j.status!=='Completed'&&j.status!=='Cancelled').reduce((a,b)=>a+(b.budget||0),0);
  const totalInvoiced=invoices.reduce((a,b)=>a+(b.amount||0),0);
  const winRate=invoices.length>0?Math.round((invoices.filter(i=>i.status==='Paid').length/invoices.length)*100):0;
  const byStatus=JOB_STATUSES.map(s=>({s,count:jobs.filter(j=>j.status===s).length}));
  const iByStatus=['Draft','Sent','Paid','Overdue'].map(s=>({s,count:invoices.filter(i=>i.status===s).length,amount:invoices.filter(i=>i.status===s).reduce((a,b)=>a+(b.amount||0),0)}));
  function sColor(s){if(s==='In Progress'||s==='Paid') return C.teal;if(s==='Completed') return C.green;if(s==='Cancelled'||s==='Overdue') return C.red;if(s==='Pre-Production'||s==='Sent') return C.blue;if(s==='Post-Production') return C.purple;return C.gold;}
  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <ScreenHeader title="Reports" sub="BUSINESS ANALYTICS" onBack={onBack}/>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,maxWidth:900,alignSelf:'center',width:'100%'}}>
        <Card style={{marginBottom:20}}>
          <SectionHeader title="FINANCIAL OVERVIEW"/>
          <View style={{flexDirection:'row',marginBottom:16}}>
            <View style={{flex:1,alignItems:'center'}}><Text style={{color:C.green,fontWeight:'900',fontSize:22}}>{fmtFull(revenue)}</Text><Text style={{color:C.sub,fontSize:11,marginTop:4}}>Revenue</Text></View>
            <View style={{width:1,backgroundColor:C.border}}/>
            <View style={{flex:1,alignItems:'center'}}><Text style={{color:C.teal,fontWeight:'900',fontSize:22}}>{fmtFull(pipeline)}</Text><Text style={{color:C.sub,fontSize:11,marginTop:4}}>Pipeline</Text></View>
          </View>
          <View style={{flexDirection:'row'}}>
            <View style={{flex:1,alignItems:'center'}}><Text style={{color:C.gold,fontWeight:'900',fontSize:22}}>{fmtFull(totalInvoiced)}</Text><Text style={{color:C.sub,fontSize:11,marginTop:4}}>Total Invoiced</Text></View>
            <View style={{width:1,backgroundColor:C.border}}/>
            <View style={{flex:1,alignItems:'center'}}><Text style={{color:C.purple,fontWeight:'900',fontSize:22}}>{winRate}%</Text><Text style={{color:C.sub,fontSize:11,marginTop:4}}>Collection Rate</Text></View>
          </View>
        </Card>
        <Card style={{marginBottom:20}}>
          <SectionHeader title="JOBS BY STATUS"/>
          {byStatus.map(({s,count})=>(
            <View key={s} style={{flexDirection:'row',alignItems:'center',marginBottom:10}}>
              <View style={{width:10,height:10,borderRadius:5,backgroundColor:sColor(s),marginRight:10}}/>
              <Text style={{color:C.text,fontSize:13,flex:1}}>{s}</Text>
              <MiniBar value={count} max={jobs.length||1} color={sColor(s)}/>
              <Text style={{color:C.sub,fontSize:13,fontWeight:'700',width:24,textAlign:'right',marginLeft:10}}>{count}</Text>
            </View>
          ))}
        </Card>
        <Card style={{marginBottom:20}}>
          <SectionHeader title="INVOICE BREAKDOWN"/>
          {iByStatus.map(({s,count,amount})=>(
            <View key={s} style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:12,backgroundColor:C.bg,borderRadius:12,padding:12}}>
              <View style={{flexDirection:'row',alignItems:'center'}}><View style={{width:10,height:10,borderRadius:5,backgroundColor:sColor(s),marginRight:10}}/><Text style={{color:C.text,fontSize:14,fontWeight:'600'}}>{s}</Text></View>
              <View style={{alignItems:'flex-end'}}><Text style={{color:sColor(s),fontWeight:'800',fontSize:15}}>{fmtFull(amount)}</Text><Text style={{color:C.sub,fontSize:11}}>{count} invoice{count!==1?'s':''}</Text></View>
            </View>
          ))}
        </Card>
        <View style={{flexDirection:'row',marginBottom:20}}>
          <Card style={{flex:1,marginRight:8,alignItems:'center'}}><Text style={{color:C.teal,fontWeight:'800',fontSize:22}}>{clients.length}</Text><Text style={{color:C.sub,fontSize:12,marginTop:4}}>Total Clients</Text><Text style={{color:C.green,fontSize:11,marginTop:2}}>{clients.filter(c=>c.status==='Active').length} active</Text></Card>
          <Card style={{flex:1,alignItems:'center'}}><Text style={{color:C.blue,fontWeight:'800',fontSize:22}}>{team.length}</Text><Text style={{color:C.sub,fontSize:12,marginTop:4}}>Team Size</Text><Text style={{color:C.green,fontSize:11,marginTop:2}}>{team.filter(m=>m.status==='Active').length} active</Text></Card>
        </View>
        <Card style={{marginBottom:20}}>
          <SectionHeader title="TEAM UTILISATION"/>
          <View style={{flexDirection:'row'}}>{[['Active',team.filter(m=>m.status==='Active').length,C.green],['Away',team.filter(m=>m.status==='Away').length,C.gold],['Unavailable',team.filter(m=>m.status==='Unavailable').length,C.red]].map(([label,count,color])=><View key={label} style={{flex:1,alignItems:'center'}}><Text style={{color:color,fontWeight:'800',fontSize:22}}>{count}</Text><Text style={{color:C.sub,fontSize:11,marginTop:4}}>{label}</Text></View>)}</View>
        </Card>
        <View style={{height:40}}/>
      </ScrollView>
    </Animated.View>
  );
}

function PortalScreen({store,onBack,accentColor}) {
  const {userProfile,updateUserProfile,invoices}=store;
  const ac=accentColor||C.gold;
  const [editing,setEditing]=React.useState(false);
  const [form,setForm]=React.useState({name:userProfile.name||'',role:userProfile.role||'',email:userProfile.email||'',phone:userProfile.phone||'',rate:String(userProfile.rate||'')});
  const anim=React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{Animated.timing(anim,{toValue:1,duration:400,useNativeDriver:true}).start();},[]);
  const earned=invoices.filter(i=>i.status==='Paid').reduce((a,b)=>a+(b.amount||0),0);
  const pending=invoices.filter(i=>i.status==='Sent'||i.status==='Draft').reduce((a,b)=>a+(b.amount||0),0);
  function saveProfile(){updateUserProfile({...userProfile,...form,rate:parseFloat(form.rate)||0});setEditing(false);}
  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <ScreenHeader title="My Portal" onBack={onBack} accentColor={ac} right={<TouchableOpacity onPress={()=>setEditing(e=>!e)}><Text style={{color:ac,fontWeight:'700',fontSize:14}}>{editing?'Done':'Edit'}</Text></TouchableOpacity>}/>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,maxWidth:900,alignSelf:'center',width:'100%'}}>
        <Card style={{marginBottom:16,alignItems:'center',paddingVertical:24}}>
          <Avatar name={userProfile.name} color={ac} size={72}/>
          {editing?(
            <View style={{width:'100%',marginTop:16}}>
              {[['Name','name','default'],['Role','role','default'],['Email','email','email-address'],['Phone','phone','phone-pad'],['Day Rate','rate','numeric']].map(([label,key,kb])=>(
                <View key={key} style={{marginBottom:12}}><Text style={{color:C.sub,fontSize:11,fontWeight:'600',marginBottom:5}}>{label.toUpperCase()}</Text><TextInput style={{backgroundColor:C.bg,borderRadius:12,paddingHorizontal:14,paddingVertical:11,color:C.text,fontSize:15}} placeholder={label} placeholderTextColor={C.sub} keyboardType={kb} value={form[key]} onChangeText={v=>setForm(f=>({...f,[key]:v}))}/></View>
              ))}
              <TouchableOpacity onPress={saveProfile} style={{backgroundColor:ac,borderRadius:14,paddingVertical:14,alignItems:'center',marginTop:8}}><Text style={{color:'#fff',fontWeight:'700',fontSize:16}}>Save Profile</Text></TouchableOpacity>
            </View>
          ):(
            <View style={{alignItems:'center',marginTop:14}}>
              <Text style={{color:C.text,fontSize:22,fontWeight:'800'}}>{userProfile.name||'Your Name'}</Text>
              <Text style={{color:C.sub,fontSize:15,marginTop:4}}>{userProfile.role||'Role'}</Text>
              {userProfile.rate?<Text style={{color:ac,fontSize:14,fontWeight:'700',marginTop:6}}>{fmtFull(userProfile.rate)}/day</Text>:null}
              {userProfile.email?<Text style={{color:C.sub,fontSize:13,marginTop:4}}>{userProfile.email}</Text>:null}
            </View>
          )}
        </Card>
        <View style={{flexDirection:'row',marginBottom:16}}>
          <Card style={{flex:1,marginRight:8,alignItems:'center'}}><Text style={{color:C.green,fontWeight:'900',fontSize:20}}>{fmtFull(earned)}</Text><Text style={{color:C.sub,fontSize:11,marginTop:4}}>Earned</Text></Card>
          <Card style={{flex:1,alignItems:'center'}}><Text style={{color:ac,fontWeight:'900',fontSize:20}}>{fmtFull(pending)}</Text><Text style={{color:C.sub,fontSize:11,marginTop:4}}>Pending</Text></Card>
        </View>
        <Card><SectionHeader title="RECENT INVOICES"/>{invoices.length===0&&<Text style={{color:C.sub,fontSize:14}}>No invoices yet</Text>}{invoices.slice(0,5).map(iv=><View key={iv.id} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:10,borderBottomWidth:1,borderBottomColor:C.border}}><View><Text style={{color:C.text,fontSize:14,fontWeight:'600'}}>{iv.number}</Text><Text style={{color:C.sub,fontSize:12,marginTop:2}}>{iv.status}</Text></View><Text style={{color:C.teal,fontWeight:'700',fontSize:14}}>{fmtFull(iv.amount)}</Text></View>)}</Card>
        <View style={{height:40}}/>
      </ScrollView>
    </Animated.View>
  );
}

function MoreScreen({store,onNav,onSignOut,accentColor}) {
  const {userProfile,unread}=store;
  const ac=accentColor||C.teal;
  const anim=React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{Animated.timing(anim,{toValue:1,duration:400,useNativeDriver:true}).start();},[]);
  const items=[{label:'Messages',sub:'Team communication',screen:'messages',color:C.teal},{label:'Invoices',sub:'Billing and payments',screen:'invoices',color:C.gold},{label:'Clients',sub:'CRM and contacts',screen:'clients',color:C.blue},{label:'Reports',sub:'Analytics and insights',screen:'reports',color:C.purple},{label:'Notifications',sub:'Alerts and updates',screen:'notifications',color:C.orange,badge:unread}];
  function signOut(){Alert.alert('Sign Out','Are you sure you want to sign out?',[{text:'Cancel',style:'cancel'},{text:'Sign Out',style:'destructive',onPress:onSignOut}]);}
  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <ScreenHeader title="More" sub="SETTINGS AND TOOLS"/>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,maxWidth:900,alignSelf:'center',width:'100%'}}>
        <Card style={{marginBottom:20}}><View style={{flexDirection:'row',alignItems:'center'}}><Avatar name={userProfile.businessName||userProfile.name} color={ac} size={52}/><View style={{marginLeft:14,flex:1}}><Text style={{color:C.text,fontSize:17,fontWeight:'800'}}>{userProfile.businessName||userProfile.name||'My Business'}</Text><Text style={{color:C.sub,fontSize:13,marginTop:2}}>{userProfile.businessType||'Business Account'}</Text></View>{store.trialDaysLeft>0&&<View style={{backgroundColor:C.teal+'22',borderRadius:10,paddingHorizontal:10,paddingVertical:5}}><Text style={{color:C.teal,fontSize:11,fontWeight:'700'}}>{store.trialDaysLeft}d trial</Text></View>}</View></Card>
        {items.map(item=>(
          <TouchableOpacity key={item.screen} onPress={()=>onNav(item.screen)} activeOpacity={0.85}>
            <Card style={{marginBottom:10}}><View style={{flexDirection:'row',alignItems:'center'}}><View style={{width:42,height:42,borderRadius:12,backgroundColor:item.color+'22',alignItems:'center',justifyContent:'center',marginRight:14}}><View style={{width:14,height:14,borderRadius:7,backgroundColor:item.color}}/></View><View style={{flex:1}}><Text style={{color:C.text,fontSize:15,fontWeight:'700'}}>{item.label}</Text><Text style={{color:C.sub,fontSize:12,marginTop:2}}>{item.sub}</Text></View>{item.badge>0&&<View style={{backgroundColor:C.red,borderRadius:10,minWidth:20,height:20,alignItems:'center',justifyContent:'center',paddingHorizontal:5,marginRight:8}}><Text style={{color:'#fff',fontSize:10,fontWeight:'800'}}>{item.badge}</Text></View>}<Text style={{color:C.sub,fontSize:18}}>{'>'}</Text></View></Card>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={signOut} style={{marginTop:20,paddingVertical:16,borderRadius:16,borderWidth:1.5,borderColor:C.red,alignItems:'center'}}><Text style={{color:C.red,fontWeight:'700',fontSize:16}}>Sign Out</Text></TouchableOpacity>
        <Text style={{color:C.dimmer,fontSize:11,textAlign:'center',marginTop:20}}>WorkDesk v18 - Universal Business Platform</Text>
        <View style={{height:40}}/>
      </ScrollView>
    </Animated.View>
  );
}

function FMoreScreen({store,onNav,onSignOut}) {
  const {userProfile,unread}=store;
  const anim=React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{Animated.timing(anim,{toValue:1,duration:400,useNativeDriver:true}).start();},[]);
  function signOut(){Alert.alert('Sign Out','Are you sure you want to sign out?',[{text:'Cancel',style:'cancel'},{text:'Sign Out',style:'destructive',onPress:onSignOut}]);}
  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <ScreenHeader title="More"/>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,maxWidth:900,alignSelf:'center',width:'100%'}}>
        <Card style={{marginBottom:20}}><View style={{flexDirection:'row',alignItems:'center'}}><Avatar name={userProfile.name} color={C.gold} size={52}/><View style={{marginLeft:14}}><Text style={{color:C.text,fontSize:17,fontWeight:'800'}}>{userProfile.name||'Freelancer'}</Text><Text style={{color:C.sub,fontSize:13,marginTop:2}}>Freelancer Account</Text></View></View></Card>
        {[{label:'My Portal',sub:'Profile and earnings',screen:'portal',color:C.gold},{label:'Notifications',sub:'Alerts and updates',screen:'notifications',color:C.blue,badge:unread}].map(item=>(
          <TouchableOpacity key={item.screen} onPress={()=>onNav(item.screen)} activeOpacity={0.85}>
            <Card style={{marginBottom:10}}><View style={{flexDirection:'row',alignItems:'center'}}><View style={{width:42,height:42,borderRadius:12,backgroundColor:item.color+'22',alignItems:'center',justifyContent:'center',marginRight:14}}><View style={{width:14,height:14,borderRadius:7,backgroundColor:item.color}}/></View><View style={{flex:1}}><Text style={{color:C.text,fontSize:15,fontWeight:'700'}}>{item.label}</Text><Text style={{color:C.sub,fontSize:12,marginTop:2}}>{item.sub}</Text></View>{item.badge>0&&<View style={{backgroundColor:C.red,borderRadius:10,minWidth:20,height:20,alignItems:'center',justifyContent:'center',paddingHorizontal:5,marginRight:8}}><Text style={{color:'#fff',fontSize:10,fontWeight:'800'}}>{item.badge}</Text></View>}<Text style={{color:C.sub,fontSize:18}}>{'>'}</Text></View></Card>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={signOut} style={{marginTop:20,paddingVertical:16,borderRadius:16,borderWidth:1.5,borderColor:C.red,alignItems:'center'}}><Text style={{color:C.red,fontWeight:'700',fontSize:16}}>Sign Out</Text></TouchableOpacity>
        <Text style={{color:C.dimmer,fontSize:11,textAlign:'center',marginTop:20}}>WorkDesk v18 - Universal Business Platform</Text>
        <View style={{height:40}}/>
      </ScrollView>
    </Animated.View>
  );
}

function FScheduleScreen({store}) {
  const {jobs}=store;
  const anim=React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{Animated.timing(anim,{toValue:1,duration:400,useNativeDriver:true}).start();},[]);
  const myJobs=jobs.filter(j=>j.status!=='Cancelled');
  function sColor(s){if(s==='In Progress') return C.teal;if(s==='Pre-Production') return C.blue;if(s==='Post-Production') return C.purple;return C.gold;}
  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <ScreenHeader title="My Schedule" sub="ACTIVE AND UPCOMING JOBS"/>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,maxWidth:900,alignSelf:'center',width:'100%'}}>
        {myJobs.length===0&&<Text style={{color:C.sub,textAlign:'center',marginTop:60}}>No jobs scheduled</Text>}
        {myJobs.map(j=><Card key={j.id} style={{marginBottom:12}}><View style={{flexDirection:'row',alignItems:'center'}}><View style={{width:4,height:52,borderRadius:2,backgroundColor:sColor(j.status),marginRight:14}}/><View style={{flex:1}}><Text style={{color:C.text,fontSize:15,fontWeight:'700'}}>{j.name}</Text><Text style={{color:C.sub,fontSize:13,marginTop:2}}>{j.client}</Text><View style={{marginTop:6}}><Badge label={j.status} color={sColor(j.status)}/></View></View>{j.budget?<Text style={{color:C.gold,fontWeight:'700',fontSize:14}}>{fmtFull(j.budget)}</Text>:null}</View></Card>)}
        <View style={{height:40}}/>
      </ScrollView>
    </Animated.View>
  );
}

function FInvoicesScreen({store}) {
  const {invoices}=store;
  const anim=React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{Animated.timing(anim,{toValue:1,duration:400,useNativeDriver:true}).start();},[]);
  function iColor(s){if(s==='Paid') return C.green;if(s==='Sent') return C.blue;if(s==='Overdue') return C.red;return C.sub;}
  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <ScreenHeader title="My Invoices"/>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20,maxWidth:900,alignSelf:'center',width:'100%'}}>
        {invoices.length===0&&<Text style={{color:C.sub,textAlign:'center',marginTop:60}}>No invoices yet</Text>}
        {invoices.map(iv=><Card key={iv.id} style={{marginBottom:12}}><View style={{flexDirection:'row',alignItems:'center'}}><View style={{flex:1}}><View style={{flexDirection:'row',alignItems:'center'}}><Text style={{color:C.text,fontSize:15,fontWeight:'700'}}>{iv.number}</Text><View style={{marginLeft:10}}><Badge label={iv.status} color={iColor(iv.status)}/></View></View><Text style={{color:C.sub,fontSize:13,marginTop:3}}>{iv.client}</Text></View><Text style={{color:C.gold,fontWeight:'800',fontSize:17}}>{fmtFull(iv.amount)}</Text></View></Card>)}
        <View style={{height:40}}/>
      </ScrollView>
    </Animated.View>
  );
}

function TabBar({tabs,active,onPress,accentColor}) {
  const ac=accentColor||C.teal;
  return (
    <View style={{flexDirection:'row',backgroundColor:C.surface,borderTopWidth:1,borderTopColor:C.border,paddingBottom:20,paddingTop:8}}>
      {tabs.map(tab=>{const isActive=active===tab.key;return(<TouchableOpacity key={tab.key} style={{flex:1,alignItems:'center',paddingVertical:6}} onPress={()=>onPress(tab.key)}><View style={{width:28,height:3,borderRadius:2,backgroundColor:isActive?ac:'transparent',marginBottom:6}}/><Text style={{fontSize:11,fontWeight:isActive?'700':'500',color:isActive?ac:C.sub}}>{tab.label}</Text></TouchableOpacity>);})}
    </View>
  );
}

export default function App() {
  const store=useStore();
  const [mode,setMode]=React.useState(null);
  const [onboarded,setOnboarded]=React.useState(false);
  const [bizTab,setBizTab]=React.useState('home');
  const [freeTab,setFreeTab]=React.useState('home');
  const [subScreen,setSubScreen]=React.useState(null);
  const [showUpgrade,setShowUpgrade]=React.useState(false);
  const SUBS=['messages','invoices','reports','portal','notifications','clients'];
  function handleNav(screen){if(SUBS.includes(screen)) setSubScreen(screen);}
  function goBack(){setSubScreen(null);}
  function handleSignOut(){setMode(null);setSubScreen(null);setBizTab('home');setFreeTab('home');setOnboarded(false);}
  React.useEffect(()=>{if(mode&&store.trialExpired){setShowUpgrade(true);}},[mode,store.trialExpired]);
  if(!mode) return <LoginScreen onLogin={m=>{setMode(m);if(m==='business') setOnboarded(false);else setOnboarded(true);}}/>;
  if(mode==='business'&&!onboarded) return <OnboardingScreen onComplete={(biz)=>{store.updateUserProfile({...store.userProfile,businessName:biz.name,businessType:biz.type});setOnboarded(true);}}/>;
  const trialProps={trialDaysLeft:store.trialDaysLeft,onUpgrade:()=>setShowUpgrade(true)};
  if(mode==='business'){
    const bizTabs=[{key:'home',label:'Home'},{key:'jobs',label:'Jobs'},{key:'team',label:'Team'},{key:'clients',label:'Clients'},{key:'more',label:'More'}];
    function renderSub(){if(subScreen==='messages') return <MessagesScreen store={store} onBack={goBack}/>;if(subScreen==='invoices') return <InvoicesScreen store={store} onBack={goBack}/>;if(subScreen==='reports') return <ReportsScreen store={store} onBack={goBack}/>;if(subScreen==='notifications') return <NotificationsScreen store={store} onBack={goBack}/>;if(subScreen==='clients') return <ClientsScreen store={store}/>;return null;}
    if(subScreen) return <View style={{flex:1}}>{renderSub()}</View>;
    return (
      <View style={{flex:1,backgroundColor:C.bg}}>
        <UpgradeModal visible={showUpgrade} onClose={()=>setShowUpgrade(false)} onUpgrade={()=>setShowUpgrade(false)} daysLeft={store.trialDaysLeft}/>
        {bizTab==='home'&&<HomeScreen store={store} onNav={handleNav} {...trialProps}/>}
        {bizTab==='jobs'&&<JobsScreen store={store}/>}
        {bizTab==='team'&&<TeamScreen store={store}/>}
        {bizTab==='clients'&&<ClientsScreen store={store}/>}
        {bizTab==='more'&&<MoreScreen store={store} onNav={handleNav} onSignOut={handleSignOut} accentColor={C.teal}/>}
        <TabBar tabs={bizTabs} active={bizTab} onPress={setBizTab} accentColor={C.teal}/>
      </View>
    );
  }
  if(mode==='freelancer'){
    const freeTabs=[{key:'home',label:'Home'},{key:'schedule',label:'Schedule'},{key:'invoices',label:'Invoices'},{key:'more',label:'More'}];
    function renderFreeSub(){if(subScreen==='portal') return <PortalScreen store={store} onBack={goBack} accentColor={C.gold}/>;if(subScreen==='notifications') return <NotificationsScreen store={store} onBack={goBack} accentColor={C.gold}/>;return null;}
    if(subScreen) return <View style={{flex:1}}>{renderFreeSub()}</View>;
    return (
      <View style={{flex:1,backgroundColor:C.bg}}>
        <UpgradeModal visible={showUpgrade} onClose={()=>setShowUpgrade(false)} onUpgrade={()=>setShowUpgrade(false)} daysLeft={store.trialDaysLeft}/>
        {freeTab==='home'&&<FHomeScreen store={store} onNav={handleNav} accentColor={C.gold} {...trialProps}/>}
        {freeTab==='schedule'&&<FScheduleScreen store={store}/>}
        {freeTab==='invoices'&&<FInvoicesScreen store={store}/>}
        {freeTab==='more'&&<FMoreScreen store={store} onNav={handleNav} onSignOut={handleSignOut}/>}
        <TabBar tabs={freeTabs} active={freeTab} onPress={setFreeTab} accentColor={C.gold}/>
      </View>
    );
  }
  return null;
}
