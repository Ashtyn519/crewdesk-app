import React from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  Modal, Alert, Animated, StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator
} from 'react-native';

const C = {
  bg:'#0A0E17',
  surface:'#111827',
  surf2:'#1A2235',
  border:'#1E2D45',
  text:'#F0F4FF',
  sub:'#6B7FA3',
  dimmer:'#3A4A6B',
  teal:'#00D4AA',
  gold:'#F59F00',
  red:'#FA5252',
  blue:'#339AF0',
  purple:'#845EF7',
  green:'#20C997',
};

const T = { xs:11, sm:12, base:14, md:15, lg:17, xl:20, xxl:24, h1:32 };
const R = { sm:8, md:12, lg:16, xl:20, pill:100 };
const S = {
  px:20, card:{backgroundColor:'#111827',borderRadius:16,padding:16,borderWidth:1,borderColor:'#1E2D45'},
};

function fmt(n){ return n>=1000?(n/1000).toFixed(1)+'k':String(n); }
function fmtFull(n){ return '$'+Number(n||0).toLocaleString(); }

const SEED_PROJECTS = [
  {id:'p1',name:'Sunrise Wedding Films',client:'Harrington Events',status:'In Progress',budget:12000,crew:['c1','c2'],expenses:[{id:'e1',desc:'Camera Hire',amount:1200,date:'2026-02-10'}],notes:'Ceremony at 2pm, golden hour shoot till 7pm'},
  {id:'p2',name:'Mountain Documentary',client:'Peak Media',status:'Pre-Production',budget:45000,crew:['c1','c3'],expenses:[],notes:'3-week shoot, high altitude gear required'},
  {id:'p3',name:'Tech Product Launch',client:'NovaTech',status:'Post-Production',budget:28000,crew:['c2','c4'],expenses:[{id:'e2',desc:'Studio Hire',amount:2400,date:'2026-01-28'}],notes:'Deliver by 15 April'},
  {id:'p4',name:'Fashion Campaign',client:'Velour Brand',status:'Planning',budget:19500,crew:[],expenses:[],notes:'Summer collection, outdoor locations'},
  {id:'p5',name:'Music Video - Echoes',client:'Midnight Records',status:'Completed',budget:8800,crew:['c3'],expenses:[],notes:'Delivered and approved'},
];

const SEED_CREW = [
  {id:'c1',name:'Jamie Chen',role:'Director',status:'On Job',phone:'07700900111',email:'jamie@crewdesk.io',rate:750},
  {id:'c2',name:'Priya Sharma',role:'Camera Op',status:'Available',phone:'07700900222',email:'priya@crewdesk.io',rate:480},
  {id:'c3',name:'Tom Walsh',role:'Sound',status:'Available',phone:'07700900333',email:'tom@crewdesk.io',rate:380},
  {id:'c4',name:'Aaliya Brooks',role:'Producer',status:'On Job',phone:'07700900444',email:'aaliya@crewdesk.io',rate:620},
  {id:'c5',name:'Renz Garcia',role:'Gaffer',status:'Unavailable',phone:'07700900555',email:'renz@crewdesk.io',rate:320},
  {id:'c6',name:'Mia Foster',role:'Editor',status:'Available',phone:'07700900666',email:'mia@crewdesk.io',rate:500},
];

const SEED_INVOICES = [
  {id:'i1',number:'INV-001',client:'Harrington Events',amount:6000,status:'Paid',dueDate:'28 Feb 2026',attachments:[],lineItems:[]},
  {id:'i2',number:'INV-002',client:'Peak Media',amount:15000,status:'Sent',dueDate:'15 Mar 2026',attachments:[],lineItems:[]},
  {id:'i3',number:'INV-003',client:'NovaTech',amount:9000,status:'Overdue',dueDate:'01 Mar 2026',attachments:[],lineItems:[]},
  {id:'i4',number:'INV-004',client:'Velour Brand',amount:4500,status:'Draft',dueDate:'30 Apr 2026',attachments:[],lineItems:[]},
];

const SEED_MESSAGES = [
  {id:'m1',thread:'Sunrise Wedding',sender:'Jamie Chen',text:'Confirmed golden hour shoot from 6:30pm',time:'09:15 AM'},
  {id:'m2',thread:'Sunrise Wedding',sender:'You',text:'Perfect, I will brief the crew this afternoon',time:'09:18 AM'},
  {id:'m3',thread:'Mountain Doc',sender:'Priya Sharma',text:'High altitude camera cases are ready to ship',time:'Yesterday'},
  {id:'m4',thread:'Studio - Internal',sender:'Aaliya Brooks',text:'Invoices approved for Q1, sending to accounts now',time:'Mon'},
];

const SEED_NOTIFICATIONS = [
  {id:'n1',type:'invoice',title:'Invoice Overdue',body:'INV-003 from NovaTech is 7 days overdue',time:'2 hrs ago',read:false},
  {id:'n2',type:'message',title:'New Message',body:'Jamie Chen: Confirmed golden hour shoot from 6:30pm',time:'3 hrs ago',read:false},
  {id:'n3',type:'schedule',title:'Project Update',body:'Mountain Documentary has moved to Pre-Production',time:'Yesterday',read:false},
  {id:'n4',type:'invoice',title:'Invoice Paid',body:'INV-001 from Harrington Events has been paid',time:'2 days ago',read:true},
  {id:'n5',type:'crew',title:'Crew Status Changed',body:'Renz Garcia is now Unavailable',time:'3 days ago',read:true},
];


function useStore() {
  const [projects,setProjects] = React.useState(SEED_PROJECTS);
  const [crew,setCrew] = React.useState(SEED_CREW);
  const [invoices,setInvoices] = React.useState(SEED_INVOICES);
  const [messages,setMessages] = React.useState(SEED_MESSAGES);
  const [notifications,setNotifications] = React.useState(SEED_NOTIFICATIONS);
  const [userProfile,setUserProfile] = React.useState({id:'u1',name:'Alex Morgan',role:'Production Manager',email:'alex@crewdesk.io',phone:'07700900001',rate:850});

  function addProject(p){ setProjects(prev=>[...prev,p]); }
  function updateProject(id,data){ setProjects(prev=>prev.map(p=>p.id===id?data:p)); }
  function deleteProject(id){ setProjects(prev=>prev.filter(p=>p.id!==id)); }
  function addCrew(c){ setCrew(prev=>[...prev,c]); }
  function updateCrew(id,data){ setCrew(prev=>prev.map(c=>c.id===id?data:c)); }
  function deleteCrew(id){ setCrew(prev=>prev.filter(c=>c.id!==id)); }
  function addInvoice(i){ setInvoices(prev=>[...prev,i]); }
  function updateInvoice(id,data){ setInvoices(prev=>prev.map(i=>i.id===id?data:i)); }
  function deleteInvoice(id){ setInvoices(prev=>prev.filter(i=>i.id!==id)); }
  function addMessage(m){ setMessages(prev=>[...prev,m]); }
  function addExpense(projectId,expense){ setProjects(prev=>prev.map(p=>p.id===projectId?{...p,expenses:[...(p.expenses||[]),expense]}:p)); }
  function assignCrew(projectId,crewId){ setProjects(prev=>prev.map(p=>{ if(p.id!==projectId) return p; const crew=p.crew||[]; const has=crew.includes(crewId); return {...p,crew:has?crew.filter(c=>c!==crewId):[...crew,crewId]}; })); }
  function markNotifRead(id){ setNotifications(prev=>prev.map(n=>n.id===id?{...n,read:true}:n)); }
  function markAllRead(){ setNotifications(prev=>prev.map(n=>({...n,read:true}))); }
  function updateUserProfile(data){ setUserProfile(data); }
  const unreadNotifs = notifications.filter(n=>!n.read).length;
  return {projects,crew,invoices,messages,notifications,userProfile,unreadNotifs,addProject,updateProject,deleteProject,addCrew,updateCrew,deleteCrew,addInvoice,updateInvoice,deleteInvoice,addMessage,addExpense,assignCrew,markNotifRead,markAllRead,updateUserProfile};
}

function Card({children,style,onPress}) {
  if(onPress) return <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={[S.card,style]}>{children}</TouchableOpacity>;
  return <View style={[S.card,style]}>{children}</View>;
}

function StatCard({label,value,sub,color}) {
  return (
    <View style={{flex:1,backgroundColor:C.surface,borderRadius:16,padding:14,borderWidth:1,borderColor:C.border,alignItems:'flex-start'}}>
      <Text style={{color:color||C.teal,fontSize:22,fontWeight:'900'}}>{value}</Text>
      <Text style={{color:C.text,fontSize:12,fontWeight:'700',marginTop:4}}>{label}</Text>
      {sub?<Text style={{color:C.sub,fontSize:11,marginTop:2}}>{sub}</Text>:null}
    </View>
  );
}

function QuickCard({label,sub,color,onPress,badge}) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={{flex:1,backgroundColor:C.surface,borderRadius:16,padding:14,borderWidth:1,borderColor:C.border}}>
      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start'}}>
        <View style={{width:36,height:36,borderRadius:10,backgroundColor:color+'22',alignItems:'center',justifyContent:'center'}}>
          <View style={{width:14,height:14,borderRadius:7,backgroundColor:color}}/>
        </View>
        {badge>0?<View style={{backgroundColor:C.red,borderRadius:10,minWidth:20,height:20,alignItems:'center',justifyContent:'center',paddingHorizontal:5}}>
          <Text style={{color:'#fff',fontSize:10,fontWeight:'800'}}>{badge}</Text>
        </View>:null}
      </View>
      <Text style={{color:C.text,fontSize:14,fontWeight:'700',marginTop:10}}>{label}</Text>
      {sub?<Text style={{color:C.sub,fontSize:11,marginTop:3}}>{sub}</Text>:null}
    </TouchableOpacity>
  );
}

function NotifIcon({type}) {
  const map = {invoice:{color:C.gold,letter:'$'},message:{color:C.teal,letter:'M'},schedule:{color:C.blue,letter:'S'},crew:{color:C.purple,letter:'C'}};
  const cfg = map[type]||{color:C.sub,letter:'N'};
  return (
    <View style={{width:40,height:40,borderRadius:12,backgroundColor:cfg.color+'22',alignItems:'center',justifyContent:'center',marginRight:14}}>
      <Text style={{color:cfg.color,fontWeight:'800',fontSize:15}}>{cfg.letter}</Text>
    </View>
  );
}


function LoginScreen({onLogin}) {
  const [loading,setLoading] = React.useState(false);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const slideAnim = React.useRef(new Animated.Value(40)).current;
  React.useEffect(()=>{
    Animated.parallel([
      Animated.timing(fadeAnim,{toValue:1,duration:800,useNativeDriver:true}),
      Animated.timing(slideAnim,{toValue:0,duration:700,useNativeDriver:true}),
    ]).start();
  },[]);
  function handleLogin(mode) {
    setLoading(mode);
    setTimeout(()=>{ setLoading(false); onLogin(mode); },900);
  }
  return (
    <View style={{flex:1,backgroundColor:C.bg,alignItems:'center',justifyContent:'center',paddingHorizontal:24}}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      <Animated.View style={{opacity:fadeAnim,transform:[{translateY:slideAnim}],alignItems:'center',width:'100%'}}>
        <View style={{width:80,height:80,borderRadius:24,backgroundColor:C.teal+'22',borderWidth:2,borderColor:C.teal,alignItems:'center',justifyContent:'center',marginBottom:24}}>
          <Text style={{color:C.teal,fontWeight:'900',fontSize:32}}>CD</Text>
        </View>
        <Text style={{color:C.text,fontSize:34,fontWeight:'900',letterSpacing:-1,marginBottom:6}}>
          <Text style={{color:C.teal}}>Crew</Text>Desk
        </Text>
        <Text style={{color:C.sub,fontSize:15,textAlign:'center',marginBottom:48,lineHeight:22}}>The professional production management platform</Text>
        <TouchableOpacity onPress={()=>handleLogin('business')} disabled={!!loading} activeOpacity={0.85} style={{width:'100%',backgroundColor:C.surface,borderRadius:20,padding:20,marginBottom:14,borderWidth:1.5,borderColor:C.teal,flexDirection:'row',alignItems:'center'}}>
          <View style={{width:46,height:46,borderRadius:13,backgroundColor:C.teal+'22',alignItems:'center',justifyContent:'center',marginRight:16}}>
            <Text style={{color:C.teal,fontWeight:'900',fontSize:18}}>Bz</Text>
          </View>
          <View style={{flex:1}}>
            <Text style={{color:C.text,fontSize:17,fontWeight:'800'}}>Business</Text>
            <Text style={{color:C.sub,fontSize:13,marginTop:2}}>Manage productions, crew, budgets and billing</Text>
          </View>
          {loading==='business'?<ActivityIndicator color={C.teal}/>:<Text style={{color:C.teal,fontSize:20}}>{'>'}</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={()=>handleLogin('freelancer')} disabled={!!loading} activeOpacity={0.85} style={{width:'100%',backgroundColor:C.surface,borderRadius:20,padding:20,borderWidth:1.5,borderColor:C.gold,flexDirection:'row',alignItems:'center'}}>
          <View style={{width:46,height:46,borderRadius:13,backgroundColor:C.gold+'22',alignItems:'center',justifyContent:'center',marginRight:16}}>
            <Text style={{color:C.gold,fontWeight:'900',fontSize:18}}>Fr</Text>
          </View>
          <View style={{flex:1}}>
            <Text style={{color:C.text,fontSize:17,fontWeight:'800'}}>Freelancer / Contractor</Text>
            <Text style={{color:C.sub,fontSize:13,marginTop:2}}>Find work, track gigs, send invoices and get paid</Text>
          </View>
          {loading==='freelancer'?<ActivityIndicator color={C.gold}/>:<Text style={{color:C.gold,fontSize:20}}>{'>'}</Text>}
        </TouchableOpacity>
        <Text style={{color:C.dimmer,fontSize:11,marginTop:32,textAlign:'center'}}>By continuing you agree to CrewDesk Terms of Service</Text>
      </Animated.View>
    </View>
  );
}

function NotificationsScreen({store,onBack}) {
  const {notifications,markNotifRead,markAllRead} = store;
  const anim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{ Animated.timing(anim,{toValue:1,duration:350,useNativeDriver:true}).start(); },[]);
  const unread = notifications.filter(n=>!n.read).length;
  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <View style={{backgroundColor:C.surface,paddingTop:52,paddingBottom:16,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:C.border,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
        <TouchableOpacity onPress={onBack} style={{marginRight:14}}>
          <Text style={{color:C.teal,fontSize:15,fontWeight:'600'}}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={{color:C.text,fontSize:22,fontWeight:'800',flex:1}}>Notifications</Text>
        {unread>0 && <TouchableOpacity onPress={markAllRead} style={{backgroundColor:C.teal+'22',borderRadius:12,paddingHorizontal:12,paddingVertical:6}}>
          <Text style={{color:C.teal,fontWeight:'700',fontSize:12}}>Mark all read</Text>
        </TouchableOpacity>}
      </View>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20}}>
        {notifications.length===0 && <Text style={{color:C.sub,textAlign:'center',marginTop:60}}>All caught up!</Text>}
        {notifications.map(n=>(
          <TouchableOpacity key={n.id} onPress={()=>markNotifRead(n.id)} activeOpacity={0.85}>
            <View style={{backgroundColor:n.read?C.surface:C.surf2,borderRadius:14,padding:14,marginBottom:10,borderWidth:1,borderColor:n.read?C.border:C.teal+'44',flexDirection:'row',alignItems:'center'}}>
              <NotifIcon type={n.type}/>
              <View style={{flex:1}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <Text style={{color:C.text,fontSize:14,fontWeight:'700',flex:1}}>{n.title}</Text>
                  {!n.read&&<View style={{width:8,height:8,borderRadius:4,backgroundColor:C.teal}}/>}
                </View>
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


function HomeScreen({store,onNav}) {
  const {projects,crew,invoices,unreadNotifs} = store;
  const anim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{ Animated.timing(anim,{toValue:1,duration:500,useNativeDriver:true}).start(); },[]);
  const active = projects.filter(p=>p.status!=='Completed'&&p.status!=='Cancelled');
  const crewAvail = crew.filter(c=>c.status==='Available').length;
  const overdue = invoices.filter(i=>i.status==='Overdue').length;
  const totalPipeline = active.reduce((a,b)=>a+(b.budget||0),0);
  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <View style={{backgroundColor:C.surface,paddingTop:52,paddingBottom:16,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:C.border,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
        <View>
          <Text style={{color:C.sub,fontSize:12,fontWeight:'600',letterSpacing:1}}>BUSINESS DASHBOARD</Text>
          <Text style={{color:C.text,fontSize:24,fontWeight:'900'}}>CrewDesk</Text>
        </View>
        <TouchableOpacity onPress={()=>onNav('notifications')} style={{position:'relative',padding:8}}>
          <View style={{width:36,height:36,borderRadius:12,backgroundColor:C.surf2,borderWidth:1,borderColor:C.border,alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:C.text,fontSize:16}}>B</Text>
          </View>
          {unreadNotifs>0&&<View style={{position:'absolute',top:4,right:4,width:16,height:16,borderRadius:8,backgroundColor:C.red,alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:'#fff',fontSize:9,fontWeight:'800'}}>{unreadNotifs}</Text>
          </View>}
        </TouchableOpacity>
      </View>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20}}>
        <View style={{flexDirection:'row',marginBottom:12}}>
          <StatCard label="Active Projects" value={String(active.length)} sub={active.length===1?'1 in progress':active.length+' running'} color={C.teal} style={{marginRight:8}}/>
          <View style={{width:8}}/>
          <StatCard label="Pipeline" value={'$'+fmt(totalPipeline)} sub="Total project value" color={C.gold}/>
        </View>
        <View style={{flexDirection:'row',marginBottom:20}}>
          <StatCard label="Crew Available" value={String(crewAvail)} sub={crew.length+' total crew'} color={C.green} style={{marginRight:8}}/>
          <View style={{width:8}}/>
          <StatCard label="Overdue Invoices" value={String(overdue)} sub={overdue>0?'Needs attention':'All on time'} color={overdue>0?C.red:C.green}/>
        </View>
        <Text style={{color:C.sub,fontSize:12,fontWeight:'700',letterSpacing:1,marginBottom:12}}>QUICK ACCESS</Text>
        <View style={{flexDirection:'row',marginBottom:12}}>
          <QuickCard label="Messages" sub="Team chat" color={C.teal} onPress={()=>onNav('messages')}/>
          <View style={{width:10}}/>
          <QuickCard label="Invoices" sub="Billing" color={C.gold} onPress={()=>onNav('invoices')}/>
        </View>
        <View style={{flexDirection:'row',marginBottom:20}}>
          <QuickCard label="Reports" sub="Analytics" color={C.purple} onPress={()=>onNav('reports')}/>
          <View style={{width:10}}/>
          <QuickCard label="Notifications" sub="Alerts" color={C.blue} onPress={()=>onNav('notifications')} badge={unreadNotifs}/>
        </View>
        <Text style={{color:C.sub,fontSize:12,fontWeight:'700',letterSpacing:1,marginBottom:12}}>ACTIVE PROJECTS</Text>
        {active.length===0&&<Card><Text style={{color:C.sub,textAlign:'center',paddingVertical:12}}>No active projects. Add one in Projects tab.</Text></Card>}
        {active.slice(0,3).map(p=>{
          const sc = p.status==='In Progress'?C.teal:p.status==='Pre-Production'?C.blue:p.status==='Post-Production'?C.purple:C.gold;
          return (
            <Card key={p.id} style={{marginBottom:10}}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <View style={{width:4,height:44,borderRadius:2,backgroundColor:sc,marginRight:12}}/>
                <View style={{flex:1}}>
                  <Text style={{color:C.text,fontSize:14,fontWeight:'700'}}>{p.name}</Text>
                  <Text style={{color:C.sub,fontSize:12,marginTop:2}}>{p.client}</Text>
                </View>
                <View style={{alignItems:'flex-end'}}>
                  <View style={{backgroundColor:sc+'22',borderRadius:12,paddingHorizontal:10,paddingVertical:3}}>
                    <Text style={{color:sc,fontSize:11,fontWeight:'700'}}>{p.status}</Text>
                  </View>
                  {p.budget?<Text style={{color:C.teal,fontSize:12,fontWeight:'700',marginTop:4}}>{fmtFull(p.budget)}</Text>:null}
                </View>
              </View>
            </Card>
          );
        })}
        <View style={{height:40}}/>
      </ScrollView>
    </Animated.View>
  );
}

function FHomeScreen({store,onNav}) {
  const {projects,invoices,userProfile,unreadNotifs} = store;
  const anim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{ Animated.timing(anim,{toValue:1,duration:500,useNativeDriver:true}).start(); },[]);
  const myProjects = projects.filter(p=>p.status!=='Cancelled');
  const totalEarned = invoices.filter(i=>i.status==='Paid').reduce((a,b)=>a+(b.amount||0),0);
  const pending = invoices.filter(i=>i.status==='Sent'||i.status==='Draft').length;
  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <View style={{backgroundColor:C.surface,paddingTop:52,paddingBottom:16,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:C.border,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
        <View>
          <Text style={{color:C.sub,fontSize:12,fontWeight:'600',letterSpacing:1}}>FREELANCER PORTAL</Text>
          <Text style={{color:C.text,fontSize:22,fontWeight:'900'}}>Hi, {(userProfile.name||'').split(' ')[0]}</Text>
        </View>
        <TouchableOpacity onPress={()=>onNav('notifications')} style={{position:'relative',padding:8}}>
          <View style={{width:36,height:36,borderRadius:12,backgroundColor:C.surf2,borderWidth:1,borderColor:C.gold+'44',alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:C.gold,fontSize:14,fontWeight:'700'}}>N</Text>
          </View>
          {unreadNotifs>0&&<View style={{position:'absolute',top:4,right:4,width:16,height:16,borderRadius:8,backgroundColor:C.red,alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:'#fff',fontSize:9,fontWeight:'800'}}>{unreadNotifs}</Text>
          </View>}
        </TouchableOpacity>
      </View>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20}}>
        <View style={{flexDirection:'row',marginBottom:20}}>
          <StatCard label="Total Earned" value={fmtFull(totalEarned)} sub="From paid invoices" color={C.gold}/>
          <View style={{width:10}}/>
          <StatCard label="Pending" value={String(pending)} sub="Invoices awaiting payment" color={C.blue}/>
        </View>
        <Text style={{color:C.sub,fontSize:12,fontWeight:'700',letterSpacing:1,marginBottom:12}}>QUICK ACCESS</Text>
        <View style={{flexDirection:'row',marginBottom:20}}>
          <QuickCard label="My Portal" sub="Profile and earnings" color={C.gold} onPress={()=>onNav('portal')}/>
          <View style={{width:10}}/>
          <QuickCard label="Notifications" sub="Alerts" color={C.blue} onPress={()=>onNav('notifications')} badge={unreadNotifs}/>
        </View>
        <Text style={{color:C.sub,fontSize:12,fontWeight:'700',letterSpacing:1,marginBottom:12}}>UPCOMING WORK</Text>
        {myProjects.length===0&&<Card><Text style={{color:C.sub,textAlign:'center',paddingVertical:12}}>No upcoming projects assigned</Text></Card>}
        {myProjects.slice(0,4).map(p=>{
          const sc = p.status==='In Progress'?C.teal:p.status==='Pre-Production'?C.blue:C.gold;
          return (
            <Card key={p.id} style={{marginBottom:10}}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <View style={{width:4,height:44,borderRadius:2,backgroundColor:sc,marginRight:12}}/>
                <View style={{flex:1}}>
                  <Text style={{color:C.text,fontSize:14,fontWeight:'700'}}>{p.name}</Text>
                  <Text style={{color:C.sub,fontSize:12,marginTop:2}}>{p.client}</Text>
                </View>
                <View style={{backgroundColor:sc+'22',borderRadius:12,paddingHorizontal:10,paddingVertical:3}}>
                  <Text style={{color:sc,fontSize:11,fontWeight:'700'}}>{p.status}</Text>
                </View>
              </View>
            </Card>
          );
        })}
        <View style={{height:40}}/>
      </ScrollView>
    </Animated.View>
  );
}


function ProjectsScreen({store}) {
  const {projects,addProject,updateProject,deleteProject,crew,addExpense} = store;
  const [selected,setSelected] = React.useState(null);
  const [view,setView] = React.useState('list');
  const [showAdd,setShowAdd] = React.useState(false);
  const [showExpense,setShowExpense] = React.useState(false);
  const [expForm,setExpForm] = React.useState({desc:'',amount:''});
  const [form,setForm] = React.useState({name:'',client:'',status:'Planning',budget:'',notes:''});
  const [editing,setEditing] = React.useState(false);
  const anim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{ Animated.timing(anim,{toValue:1,duration:400,useNativeDriver:true}).start(); },[]);
  const STATUSES = ['Planning','Pre-Production','In Progress','Post-Production','Completed','Cancelled'];
  function statusColor(s) {
    if(s==='In Progress') return C.teal;
    if(s==='Pre-Production') return C.blue;
    if(s==='Post-Production') return C.purple;
    if(s==='Completed') return C.green;
    if(s==='Cancelled') return C.red;
    return C.gold;
  }
  function openAdd() {
    setForm({name:'',client:'',status:'Planning',budget:'',notes:''});
    setEditing(false);
    setShowAdd(true);
  }
  function openEdit(p) {
    setForm({name:p.name,client:p.client,status:p.status,budget:String(p.budget||''),notes:p.notes||''});
    setEditing(true);
    setShowAdd(true);
    setSelected(null);
  }
  function saveProject() {
    if(!form.name.trim()||!form.client.trim()) { Alert.alert('Required','Name and Client are required'); return; }
    const data = {...form,budget:parseFloat(form.budget)||0};
    if(editing&&selected) { updateProject(selected.id,{...selected,...data}); setSelected(null); }
    else { addProject({...data,id:Date.now().toString(),crew:[],expenses:[]}); }
    setShowAdd(false);
  }
  function confirmDelete(p) {
    Alert.alert('Delete Project','Delete '+p.name+'? This cannot be undone.',[
      {text:'Cancel',style:'cancel'},
      {text:'Delete',style:'destructive',onPress:()=>{ deleteProject(p.id); setSelected(null); }}
    ]);
  }
  function saveExpense() {
    if(!expForm.desc.trim()||!expForm.amount.trim()) { Alert.alert('Required','Description and Amount required'); return; }
    addExpense(selected.id,{id:Date.now().toString(),desc:expForm.desc,amount:parseFloat(expForm.amount)||0,date:new Date().toISOString().split('T')[0]});
    const updated = {...selected,expenses:[...(selected.expenses||[]),{id:Date.now().toString(),desc:expForm.desc,amount:parseFloat(expForm.amount)||0,date:new Date().toISOString().split('T')[0]}]};
    setSelected(updated);
    setExpForm({desc:'',amount:''});
    setShowExpense(false);
  }

  if(selected&&!showAdd) {
    const totalExp = (selected.expenses||[]).reduce((a,b)=>a+(b.amount||0),0);
    const margin = selected.budget>0?Math.round((1-(totalExp/selected.budget))*100):100;
    const assignedCrew = crew.filter(c=>(selected.crew||[]).includes(c.id));
    return (
      <View style={{flex:1,backgroundColor:C.bg}}>
        <View style={{backgroundColor:C.surface,paddingTop:52,paddingBottom:16,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:C.border}}>
          <TouchableOpacity onPress={()=>setSelected(null)} style={{flexDirection:'row',alignItems:'center',marginBottom:12}}>
            <Text style={{color:C.teal,fontSize:15,fontWeight:'600'}}>{'< Back'}</Text>
          </TouchableOpacity>
          <View style={{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'}}>
            <View style={{flex:1}}>
              <Text style={{color:C.text,fontSize:21,fontWeight:'800'}}>{selected.name}</Text>
              <Text style={{color:C.sub,fontSize:13,marginTop:3}}>{selected.client}</Text>
            </View>
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity onPress={()=>openEdit(selected)} style={{padding:8,marginRight:4}}>
                <Text style={{color:C.teal,fontSize:13,fontWeight:'700'}}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>confirmDelete(selected)} style={{padding:8}}>
                <Text style={{color:C.red,fontSize:13,fontWeight:'700'}}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{flexDirection:'row',marginTop:10}}>
            {STATUSES.map(s=>(
              <TouchableOpacity key={s} onPress={()=>{ updateProject(selected.id,{...selected,status:s}); setSelected({...selected,status:s}); }} style={{paddingHorizontal:10,paddingVertical:5,borderRadius:20,marginRight:6,backgroundColor:selected.status===s?statusColor(s)+'33':C.bg,borderWidth:1,borderColor:selected.status===s?statusColor(s):C.border}}>
                <Text style={{color:selected.status===s?statusColor(s):C.sub,fontSize:10,fontWeight:'700'}}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <ScrollView style={{flex:1}} contentContainerStyle={{padding:20}}>
          <View style={{flexDirection:'row',marginBottom:16}}>
            <View style={{flex:1,backgroundColor:C.surface,borderRadius:14,padding:14,marginRight:8,borderWidth:1,borderColor:C.border}}>
              <Text style={{color:C.sub,fontSize:11}}>Budget</Text>
              <Text style={{color:C.teal,fontSize:20,fontWeight:'800',marginTop:4}}>{fmtFull(selected.budget)}</Text>
            </View>
            <View style={{flex:1,backgroundColor:C.surface,borderRadius:14,padding:14,marginRight:8,borderWidth:1,borderColor:C.border}}>
              <Text style={{color:C.sub,fontSize:11}}>Expenses</Text>
              <Text style={{color:C.gold,fontSize:20,fontWeight:'800',marginTop:4}}>{fmtFull(totalExp)}</Text>
            </View>
            <View style={{flex:1,backgroundColor:C.surface,borderRadius:14,padding:14,borderWidth:1,borderColor:C.border}}>
              <Text style={{color:C.sub,fontSize:11}}>Margin</Text>
              <Text style={{color:margin>=50?C.green:margin>=20?C.gold:C.red,fontSize:20,fontWeight:'800',marginTop:4}}>{margin}%</Text>
            </View>
          </View>
          {selected.notes?<Card style={{marginBottom:16}}><Text style={{color:C.sub,fontSize:11,marginBottom:6,fontWeight:'600'}}>NOTES</Text><Text style={{color:C.text,fontSize:14,lineHeight:20}}>{selected.notes}</Text></Card>:null}
          <Card style={{marginBottom:16}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <Text style={{color:C.sub,fontSize:11,fontWeight:'600',letterSpacing:1}}>CREW ({(selected.crew||[]).length})</Text>
            </View>
            {crew.map(c=>{
              const isAssigned = (selected.crew||[]).includes(c.id);
              return (
                <TouchableOpacity key={c.id} onPress={()=>{ store.assignCrew(selected.id,c.id); const newCrew=isAssigned?(selected.crew||[]).filter(x=>x!==c.id):[...(selected.crew||[]),c.id]; setSelected({...selected,crew:newCrew}); }} style={{flexDirection:'row',alignItems:'center',paddingVertical:8,borderBottomWidth:1,borderBottomColor:C.border}}>
                  <View style={{width:32,height:32,borderRadius:16,backgroundColor:isAssigned?C.teal+'33':C.bg,alignItems:'center',justifyContent:'center',marginRight:10,borderWidth:1,borderColor:isAssigned?C.teal:C.border}}>
                    <Text style={{color:isAssigned?C.teal:C.sub,fontWeight:'800',fontSize:13}}>{c.name.charAt(0)}</Text>
                  </View>
                  <View style={{flex:1}}>
                    <Text style={{color:C.text,fontSize:13,fontWeight:'600'}}>{c.name}</Text>
                    <Text style={{color:C.sub,fontSize:11}}>{c.role}</Text>
                  </View>
                  {isAssigned&&<Text style={{color:C.teal,fontWeight:'700',fontSize:12}}>Assigned</Text>}
                </TouchableOpacity>
              );
            })}
          </Card>
          <Card style={{marginBottom:16}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <Text style={{color:C.sub,fontSize:11,fontWeight:'600',letterSpacing:1}}>EXPENSES</Text>
              <TouchableOpacity onPress={()=>setShowExpense(true)} style={{backgroundColor:C.teal,borderRadius:12,paddingHorizontal:12,paddingVertical:5}}>
                <Text style={{color:'#fff',fontWeight:'700',fontSize:12}}>+ Add</Text>
              </TouchableOpacity>
            </View>
            {(selected.expenses||[]).length===0&&<Text style={{color:C.sub,fontSize:13}}>No expenses logged yet</Text>}
            {(selected.expenses||[]).map(ex=>(
              <View key={ex.id} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:8,borderBottomWidth:1,borderBottomColor:C.border}}>
                <View>
                  <Text style={{color:C.text,fontSize:13,fontWeight:'600'}}>{ex.desc}</Text>
                  <Text style={{color:C.sub,fontSize:11,marginTop:2}}>{ex.date}</Text>
                </View>
                <Text style={{color:C.gold,fontWeight:'700',fontSize:14}}>{fmtFull(ex.amount)}</Text>
              </View>
            ))}
          </Card>
          <View style={{height:40}}/>
        </ScrollView>
        <Modal visible={showExpense} animationType="slide" transparent>
          <View style={{flex:1,backgroundColor:'#000A',justifyContent:'flex-end'}}>
            <View style={{backgroundColor:C.surface,borderTopLeftRadius:24,borderTopRightRadius:24,padding:24,paddingBottom:40}}>
              <Text style={{color:C.text,fontSize:18,fontWeight:'800',marginBottom:16}}>Log Expense</Text>
              <Text style={{color:C.sub,fontSize:12,marginBottom:6,fontWeight:'600'}}>DESCRIPTION</Text>
              <TextInput style={{backgroundColor:C.bg,borderRadius:12,paddingHorizontal:14,paddingVertical:12,color:C.text,fontSize:15,marginBottom:14}} placeholder="e.g. Camera hire" placeholderTextColor={C.sub} value={expForm.desc} onChangeText={v=>setExpForm(f=>({...f,desc:v}))}/>
              <Text style={{color:C.sub,fontSize:12,marginBottom:6,fontWeight:'600'}}>AMOUNT</Text>
              <TextInput style={{backgroundColor:C.bg,borderRadius:12,paddingHorizontal:14,paddingVertical:12,color:C.text,fontSize:15,marginBottom:20}} placeholder="0.00" placeholderTextColor={C.sub} keyboardType="numeric" value={expForm.amount} onChangeText={v=>setExpForm(f=>({...f,amount:v}))}/>
              <View style={{flexDirection:'row'}}>
                <TouchableOpacity onPress={()=>setShowExpense(false)} style={{flex:1,paddingVertical:16,borderRadius:16,backgroundColor:C.bg,alignItems:'center',marginRight:12}}>
                  <Text style={{color:C.sub,fontWeight:'700',fontSize:16}}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={saveExpense} style={{flex:1,paddingVertical:16,borderRadius:16,backgroundColor:C.teal,alignItems:'center'}}>
                  <Text style={{color:'#fff',fontWeight:'700',fontSize:16}}>Save</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }

  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <View style={{backgroundColor:C.surface,paddingTop:52,paddingBottom:16,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:C.border,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
        <Text style={{color:C.text,fontSize:24,fontWeight:'800'}}>Projects</Text>
        <View style={{flexDirection:'row'}}>
          {['list','kanban'].map(v=>(
            <TouchableOpacity key={v} onPress={()=>setView(v)} style={{paddingHorizontal:12,paddingVertical:6,borderRadius:12,marginLeft:8,backgroundColor:view===v?C.teal:C.bg}}>
              <Text style={{color:view===v?'#fff':C.sub,fontSize:12,fontWeight:'600'}}>{v==='list'?'List':'Kanban'}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={openAdd} style={{backgroundColor:C.teal,borderRadius:20,paddingHorizontal:16,paddingVertical:8,marginLeft:8}}>
            <Text style={{color:'#fff',fontWeight:'700',fontSize:14}}>+ New</Text>
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20}}>
        {view==='list' ? (
          projects.length===0 ? <Text style={{color:C.sub,textAlign:'center',marginTop:60}}>No projects yet. Tap + New to create one.</Text> :
          projects.map(p=>(
            <TouchableOpacity key={p.id} onPress={()=>setSelected(p)} activeOpacity={0.85}>
              <Card style={{marginBottom:12}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <View style={{flex:1}}>
                    <Text style={{color:C.text,fontSize:15,fontWeight:'700'}}>{p.name}</Text>
                    <Text style={{color:C.sub,fontSize:13,marginTop:2}}>{p.client}</Text>
                    <View style={{flexDirection:'row',marginTop:8}}>
                      <View style={{backgroundColor:statusColor(p.status)+'22',borderRadius:12,paddingHorizontal:10,paddingVertical:3}}>
                        <Text style={{color:statusColor(p.status),fontSize:11,fontWeight:'700'}}>{p.status}</Text>
                      </View>
                      {(p.crew||[]).length>0&&<View style={{backgroundColor:C.surf2,borderRadius:12,paddingHorizontal:10,paddingVertical:3,marginLeft:8}}>
                        <Text style={{color:C.sub,fontSize:11}}>{p.crew.length} crew</Text>
                      </View>}
                    </View>
                  </View>
                  {p.budget?<Text style={{color:C.teal,fontWeight:'800',fontSize:16,marginLeft:12}}>{fmtFull(p.budget)}</Text>:null}
                </View>
              </Card>
            </TouchableOpacity>
          ))
        ) : (
          STATUSES.map(s=>{
            const grp = projects.filter(p=>p.status===s);
            return (
              <View key={s} style={{marginBottom:20}}>
                <View style={{flexDirection:'row',alignItems:'center',marginBottom:8}}>
                  <View style={{width:8,height:8,borderRadius:4,backgroundColor:statusColor(s),marginRight:8}}/>
                  <Text style={{color:statusColor(s),fontWeight:'700',fontSize:13}}>{s}</Text>
                  <Text style={{color:C.sub,fontSize:12,marginLeft:8}}>({grp.length})</Text>
                </View>
                {grp.map(p=>(
                  <TouchableOpacity key={p.id} onPress={()=>setSelected(p)} activeOpacity={0.85}>
                    <Card style={{marginBottom:8}}>
                      <Text style={{color:C.text,fontSize:14,fontWeight:'700'}}>{p.name}</Text>
                      <Text style={{color:C.sub,fontSize:12,marginTop:2}}>{p.client}</Text>
                      {p.budget?<Text style={{color:C.teal,fontSize:13,fontWeight:'700',marginTop:6}}>{fmtFull(p.budget)}</Text>:null}
                    </Card>
                  </TouchableOpacity>
                ))}
                {grp.length===0&&<View style={{backgroundColor:C.surface,borderRadius:12,padding:12,borderWidth:1,borderColor:C.border,borderStyle:'dashed'}}><Text style={{color:C.dimmer,fontSize:12,textAlign:'center'}}>No projects</Text></View>}
              </View>
            );
          })
        )}
        <View style={{height:40}}/>
      </ScrollView>
      <Modal visible={showAdd} animationType="slide" transparent>
        <View style={{flex:1,backgroundColor:'#000A',justifyContent:'flex-end'}}>
          <View style={{backgroundColor:C.surface,borderTopLeftRadius:24,borderTopRightRadius:24,padding:24,paddingBottom:40}}>
            <Text style={{color:C.text,fontSize:20,fontWeight:'800',marginBottom:20}}>{editing?'Edit Project':'New Project'}</Text>
            {[['Project Name','name','default'],['Client Name','client','default'],['Budget','budget','numeric']].map(([label,key,kb])=>(
              <View key={key} style={{marginBottom:14}}>
                <Text style={{color:C.sub,fontSize:12,marginBottom:6,fontWeight:'600'}}>{label.toUpperCase()}</Text>
                <TextInput style={{backgroundColor:C.bg,borderRadius:12,paddingHorizontal:14,paddingVertical:12,color:C.text,fontSize:15}} placeholder={label} placeholderTextColor={C.sub} keyboardType={kb} value={form[key]} onChangeText={v=>setForm(f=>({...f,[key]:v}))}/>
              </View>
            ))}
            <Text style={{color:C.sub,fontSize:12,marginBottom:8,fontWeight:'600'}}>STATUS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:16}}>
              {STATUSES.map(s=>(
                <TouchableOpacity key={s} onPress={()=>setForm(f=>({...f,status:s}))} style={{paddingHorizontal:14,paddingVertical:8,borderRadius:20,marginRight:8,backgroundColor:form.status===s?statusColor(s)+'33':C.bg,borderWidth:1.5,borderColor:form.status===s?statusColor(s):C.border}}>
                  <Text style={{color:form.status===s?statusColor(s):C.sub,fontWeight:'700',fontSize:12}}>{s}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <Text style={{color:C.sub,fontSize:12,marginBottom:6,fontWeight:'600'}}>NOTES</Text>
            <TextInput style={{backgroundColor:C.bg,borderRadius:12,paddingHorizontal:14,paddingVertical:12,color:C.text,fontSize:15,marginBottom:20}} placeholder="Optional project notes" placeholderTextColor={C.sub} multiline numberOfLines={3} value={form.notes} onChangeText={v=>setForm(f=>({...f,notes:v}))}/>
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity onPress={()=>setShowAdd(false)} style={{flex:1,paddingVertical:16,borderRadius:16,backgroundColor:C.bg,alignItems:'center',marginRight:12}}>
                <Text style={{color:C.sub,fontWeight:'700',fontSize:16}}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveProject} style={{flex:1,paddingVertical:16,borderRadius:16,backgroundColor:C.teal,alignItems:'center'}}>
                <Text style={{color:'#fff',fontWeight:'700',fontSize:16}}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}


function CrewScreen({store,onNav}) {
  const {crew,addCrew,updateCrew,deleteCrew} = store;
  const [search,setSearch] = React.useState('');
  const [showAdd,setShowAdd] = React.useState(false);
  const [selected,setSelected] = React.useState(null);
  const [editing,setEditing] = React.useState(false);
  const [form,setForm] = React.useState({name:'',role:'',phone:'',email:'',rate:'',status:'Available'});
  const STATUSES = ['Available','On Job','Unavailable'];
  const filtered = crew.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.role.toLowerCase().includes(search.toLowerCase()));
  const anim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => { Animated.timing(anim,{toValue:1,duration:400,useNativeDriver:true}).start(); },[]);
  function cycleStatus(c) {
    const idx = STATUSES.indexOf(c.status);
    const next = STATUSES[(idx+1)%STATUSES.length];
    updateCrew(c.id,{...c,status:next});
  }
  function statusColor(s) {
    if(s==='Available') return '#20C997';
    if(s==='On Job') return '#339AF0';
    return '#FA5252';
  }
  function openAdd() {
    setForm({name:'',role:'',phone:'',email:'',rate:'',status:'Available'});
    setEditing(false);
    setShowAdd(true);
  }
  function openEdit(c) {
    setForm({name:c.name,role:c.role,phone:c.phone||'',email:c.email||'',rate:String(c.rate||''),status:c.status});
    setEditing(true);
    setShowAdd(true);
    setSelected(null);
  }
  function saveForm() {
    if(!form.name.trim()||!form.role.trim()) { Alert.alert('Required','Name and Role are required'); return; }
    const data = {...form, rate:parseFloat(form.rate)||0, id: editing && selected ? selected.id : Date.now().toString()};
    if(editing && selected) { updateCrew(selected.id, data); }
    else { addCrew(data); }
    setShowAdd(false);
  }
  function confirmDelete(c) {
    Alert.alert('Remove Crew Member','Remove '+c.name+' from your crew?',[
      {text:'Cancel',style:'cancel'},
      {text:'Remove',style:'destructive',onPress:()=>{ deleteCrew(c.id); setSelected(null); }}
    ]);
  }
  const roleColors = {'Director':'#845EF7','Producer':'#339AF0','Camera Op':'#20C997','Sound':'#F59F00','Gaffer':'#E64980','PA':'#74C0FC','Editor':'#94D82D'};
  function roleColor(r) { return roleColors[r] || '#94A3B8'; }

  if(selected && !showAdd) {
    return (
      <View style={{flex:1,backgroundColor:C.bg}}>
        <View style={{backgroundColor:C.surface,paddingTop:52,paddingBottom:16,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:C.border}}>
          <TouchableOpacity onPress={()=>setSelected(null)} style={{flexDirection:'row',alignItems:'center',marginBottom:12}}>
            <Text style={{color:C.teal,fontSize:15,fontWeight:'600'}}>{'< Back'}</Text>
          </TouchableOpacity>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <View style={{width:64,height:64,borderRadius:32,backgroundColor:roleColor(selected.role),alignItems:'center',justifyContent:'center',marginRight:16}}>
              <Text style={{color:'#fff',fontWeight:'800',fontSize:22}}>{selected.name.charAt(0)}</Text>
            </View>
            <View style={{flex:1}}>
              <Text style={{color:C.text,fontSize:22,fontWeight:'800'}}>{selected.name}</Text>
              <Text style={{color:C.sub,fontSize:14,marginTop:2}}>{selected.role}</Text>
              <TouchableOpacity onPress={()=>cycleStatus(selected)} style={{marginTop:6,alignSelf:'flex-start',backgroundColor:statusColor(selected.status)+'22',borderRadius:20,paddingHorizontal:12,paddingVertical:4}}>
                <Text style={{color:statusColor(selected.status),fontWeight:'700',fontSize:12}}>{selected.status}</Text>
              </TouchableOpacity>
            </View>
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity onPress={()=>openEdit(selected)} style={{padding:8,marginRight:4}}>
                <Text style={{color:C.teal,fontSize:13,fontWeight:'700'}}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>confirmDelete(selected)} style={{padding:8}}>
                <Text style={{color:'#FA5252',fontSize:13,fontWeight:'700'}}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <ScrollView style={{flex:1}} contentContainerStyle={{padding:20}}>
          <Card>
            <Text style={{color:C.sub,fontSize:12,fontWeight:'600',marginBottom:12,letterSpacing:1}}>CONTACT INFO</Text>
            {selected.email ? <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:10}}>
              <Text style={{color:C.sub,fontSize:14}}>Email</Text>
              <Text style={{color:C.text,fontSize:14,fontWeight:'600'}}>{selected.email}</Text>
            </View> : null}
            {selected.phone ? <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:10}}>
              <Text style={{color:C.sub,fontSize:14}}>Phone</Text>
              <Text style={{color:C.text,fontSize:14,fontWeight:'600'}}>{selected.phone}</Text>
            </View> : null}
            <View style={{flexDirection:'row',justifyContent:'space-between'}}>
              <Text style={{color:C.sub,fontSize:14}}>Day Rate</Text>
              <Text style={{color:C.teal,fontSize:14,fontWeight:'700'}}>{'$'+(selected.rate||0)+' / day'}</Text>
            </View>
          </Card>
          <Card style={{marginTop:16}}>
            <Text style={{color:C.sub,fontSize:12,fontWeight:'600',marginBottom:12,letterSpacing:1}}>ASSIGNED PROJECTS</Text>
            {store.projects.filter(p=>p.crew&&p.crew.includes(selected.id)).length===0
              ? <Text style={{color:C.sub,fontSize:14}}>Not assigned to any projects</Text>
              : store.projects.filter(p=>p.crew&&p.crew.includes(selected.id)).map(p=>(
                <View key={p.id} style={{flexDirection:'row',justifyContent:'space-between',marginBottom:8}}>
                  <Text style={{color:C.text,fontSize:14,fontWeight:'600'}}>{p.name}</Text>
                  <View style={{backgroundColor:C.teal+'22',borderRadius:12,paddingHorizontal:10,paddingVertical:3}}>
                    <Text style={{color:C.teal,fontSize:12,fontWeight:'700'}}>{p.status}</Text>
                  </View>
                </View>
              ))}
          </Card>
        </ScrollView>
      </View>
    );
  }

  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <View style={{backgroundColor:C.surface,paddingTop:52,paddingBottom:16,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:C.border,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
        <Text style={{color:C.text,fontSize:24,fontWeight:'800'}}>Crew</Text>
        <TouchableOpacity onPress={openAdd} style={{backgroundColor:C.teal,borderRadius:20,paddingHorizontal:16,paddingVertical:8}}>
          <Text style={{color:'#fff',fontWeight:'700',fontSize:14}}>+ Add</Text>
        </TouchableOpacity>
      </View>
      <View style={{paddingHorizontal:20,paddingVertical:12,backgroundColor:C.surface,borderBottomWidth:1,borderBottomColor:C.border}}>
        <View style={{backgroundColor:C.bg,borderRadius:12,paddingHorizontal:14,paddingVertical:10,flexDirection:'row',alignItems:'center'}}>
          <Text style={{color:C.sub,marginRight:8,fontSize:15}}>S</Text>
          <TextInput style={{flex:1,color:C.text,fontSize:15}} placeholder="Search crew..." placeholderTextColor={C.sub} value={search} onChangeText={setSearch}/>
        </View>
      </View>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20}}>
        <View style={{flexDirection:'row',marginBottom:16}}>
          {[['Available','#20C997'],[' On Job','#339AF0'],['Unavail','#FA5252']].map(([label,color])=>(
            <View key={label} style={{flexDirection:'row',alignItems:'center',marginRight:16}}>
              <View style={{width:8,height:8,borderRadius:4,backgroundColor:color,marginRight:5}}/>
              <Text style={{color:C.sub,fontSize:12}}>{label}</Text>
            </View>
          ))}
        </View>
        {filtered.length===0 && <Text style={{color:C.sub,textAlign:'center',marginTop:40}}>No crew members found</Text>}
        {filtered.map(c=>(
          <TouchableOpacity key={c.id} onPress={()=>setSelected(c)} activeOpacity={0.85}>
            <Card style={{marginBottom:12}}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <View style={{width:48,height:48,borderRadius:24,backgroundColor:roleColor(c.role),alignItems:'center',justifyContent:'center',marginRight:14}}>
                  <Text style={{color:'#fff',fontWeight:'800',fontSize:18}}>{c.name.charAt(0)}</Text>
                </View>
                <View style={{flex:1}}>
                  <Text style={{color:C.text,fontSize:16,fontWeight:'700'}}>{c.name}</Text>
                  <Text style={{color:C.sub,fontSize:13,marginTop:2}}>{c.role}</Text>
                  {c.rate ? <Text style={{color:C.teal,fontSize:12,marginTop:2,fontWeight:'600'}}>{'$'+c.rate+'/day'}</Text> : null}
                </View>
                <View style={{alignItems:'flex-end'}}>
                  <TouchableOpacity onPress={()=>cycleStatus(c)} style={{backgroundColor:statusColor(c.status)+'22',borderRadius:20,paddingHorizontal:10,paddingVertical:5}}>
                    <Text style={{color:statusColor(c.status),fontSize:11,fontWeight:'700'}}>{c.status}</Text>
                  </TouchableOpacity>
                  <Text style={{color:C.sub,fontSize:11,marginTop:6}}>Tap to view</Text>
                </View>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
        <View style={{height:40}}/>
      </ScrollView>
      <Modal visible={showAdd} animationType="slide" transparent>
        <View style={{flex:1,backgroundColor:'#000A',justifyContent:'flex-end'}}>
          <View style={{backgroundColor:C.surface,borderTopLeftRadius:24,borderTopRightRadius:24,padding:24,paddingBottom:40}}>
            <Text style={{color:C.text,fontSize:20,fontWeight:'800',marginBottom:20}}>{editing?'Edit Crew Member':'Add Crew Member'}</Text>
            {[['Full Name','name','text'],['Role (e.g. Camera Op)','role','text'],['Email','email','email-address'],['Phone','phone','phone-pad'],['Day Rate (number)','rate','numeric']].map(([label,key,kb])=>(
              <View key={key} style={{marginBottom:14}}>
                <Text style={{color:C.sub,fontSize:12,marginBottom:6,fontWeight:'600'}}>{label.toUpperCase()}</Text>
                <TextInput style={{backgroundColor:C.bg,borderRadius:12,paddingHorizontal:14,paddingVertical:12,color:C.text,fontSize:15}} placeholder={label} placeholderTextColor={C.sub} keyboardType={kb} value={form[key]} onChangeText={v=>setForm(f=>({...f,[key]:v}))}/>
              </View>
            ))}
            <Text style={{color:C.sub,fontSize:12,marginBottom:8,fontWeight:'600'}}>STATUS</Text>
            <View style={{flexDirection:'row',marginBottom:20}}>
              {STATUSES.map(s=>(
                <TouchableOpacity key={s} onPress={()=>setForm(f=>({...f,status:s}))} style={{flex:1,alignItems:'center',paddingVertical:10,borderRadius:12,marginRight:s!=='Unavailable'?8:0,backgroundColor:form.status===s?statusColor(s)+'33':C.bg,borderWidth:1.5,borderColor:form.status===s?statusColor(s):C.border}}>
                  <Text style={{color:form.status===s?statusColor(s):C.sub,fontWeight:'700',fontSize:12}}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity onPress={()=>setShowAdd(false)} style={{flex:1,paddingVertical:16,borderRadius:16,backgroundColor:C.bg,alignItems:'center',marginRight:12}}>
                <Text style={{color:C.sub,fontWeight:'700',fontSize:16}}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveForm} style={{flex:1,paddingVertical:16,borderRadius:16,backgroundColor:C.teal,alignItems:'center'}}>
                <Text style={{color:'#fff',fontWeight:'700',fontSize:16}}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}


function ScheduleScreen({store}) {
  const {projects} = store;
  const [view,setView] = React.useState('week');
  const anim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{ Animated.timing(anim,{toValue:1,duration:400,useNativeDriver:true}).start(); },[]);
  const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const today = new Date();
  const dayIdx = (today.getDay()+6)%7;
  const scheduled = projects.filter(p=>p.status!=='Completed'&&p.status!=='Cancelled');
  function projectsForDay(d) { return scheduled.filter((_,i)=>i%7===d); }
  const statusColor = s=>{
    if(s==='In Progress') return '#20C997';
    if(s==='Pre-Production') return '#339AF0';
    if(s==='Post-Production') return '#845EF7';
    if(s==='Planning') return '#F59F00';
    return '#94A3B8';
  };
  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <View style={{backgroundColor:C.surface,paddingTop:52,paddingBottom:16,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:C.border}}>
        <Text style={{color:C.text,fontSize:24,fontWeight:'800'}}>Schedule</Text>
        <View style={{flexDirection:'row',marginTop:12,backgroundColor:C.bg,borderRadius:14,padding:3}}>
          {['week','list'].map(v=>(
            <TouchableOpacity key={v} onPress={()=>setView(v)} style={{flex:1,paddingVertical:8,borderRadius:12,alignItems:'center',backgroundColor:view===v?C.surface:'transparent'}}>
              <Text style={{color:view===v?C.teal:C.sub,fontWeight:view===v?'700':'500',fontSize:14}}>{v==='week'?'Week View':'List View'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20}}>
        {view==='week' ? (
          <View>
            <View style={{flexDirection:'row',marginBottom:16}}>
              {DAYS.map((d,i)=>(
                <View key={d} style={{flex:1,alignItems:'center'}}>
                  <Text style={{color:i===dayIdx?C.teal:C.sub,fontSize:11,fontWeight:i===dayIdx?'700':'500',marginBottom:4}}>{d}</Text>
                  <View style={{width:28,height:28,borderRadius:14,backgroundColor:i===dayIdx?C.teal:'transparent',alignItems:'center',justifyContent:'center'}}>
                    <Text style={{color:i===dayIdx?'#fff':C.text,fontSize:13,fontWeight:'700'}}>{today.getDate()-dayIdx+i}</Text>
                  </View>
                </View>
              ))}
            </View>
            {DAYS.map((d,i)=>{
              const dayProjects = projectsForDay(i);
              if(dayProjects.length===0) return null;
              return (
                <View key={d} style={{marginBottom:16}}>
                  <Text style={{color:i===dayIdx?C.teal:C.sub,fontWeight:'700',fontSize:13,marginBottom:8}}>{d}{i===dayIdx?' - Today':''}</Text>
                  {dayProjects.map(p=>(
                    <Card key={p.id} style={{marginBottom:8}}>
                      <View style={{flexDirection:'row',alignItems:'center'}}>
                        <View style={{width:4,height:40,borderRadius:2,backgroundColor:statusColor(p.status),marginRight:12}}/>
                        <View style={{flex:1}}>
                          <Text style={{color:C.text,fontSize:14,fontWeight:'700'}}>{p.name}</Text>
                          <Text style={{color:C.sub,fontSize:12,marginTop:2}}>{p.client} - {p.status}</Text>
                        </View>
                        {p.budget ? <Text style={{color:C.teal,fontWeight:'700',fontSize:13}}>{'$'+p.budget.toLocaleString()}</Text> : null}
                      </View>
                    </Card>
                  ))}
                </View>
              );
            })}
            {scheduled.length===0 && <Text style={{color:C.sub,textAlign:'center',marginTop:60,fontSize:15}}>No active projects scheduled</Text>}
          </View>
        ) : (
          <View>
            {scheduled.length===0 && <Text style={{color:C.sub,textAlign:'center',marginTop:60}}>No projects to show</Text>}
            {scheduled.map(p=>(
              <Card key={p.id} style={{marginBottom:12}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <View style={{width:4,height:52,borderRadius:2,backgroundColor:statusColor(p.status),marginRight:14}}/>
                  <View style={{flex:1}}>
                    <Text style={{color:C.text,fontSize:15,fontWeight:'700'}}>{p.name}</Text>
                    <Text style={{color:C.sub,fontSize:13,marginTop:2}}>{p.client}</Text>
                    <View style={{flexDirection:'row',marginTop:6}}>
                      <View style={{backgroundColor:statusColor(p.status)+'22',borderRadius:12,paddingHorizontal:10,paddingVertical:3}}>
                        <Text style={{color:statusColor(p.status),fontSize:11,fontWeight:'700'}}>{p.status}</Text>
                      </View>
                      {p.crew&&p.crew.length>0 ? <View style={{backgroundColor:C.border,borderRadius:12,paddingHorizontal:10,paddingVertical:3,marginLeft:8}}>
                        <Text style={{color:C.sub,fontSize:11,fontWeight:'600'}}>{p.crew.length} crew</Text>
                      </View> : null}
                    </View>
                  </View>
                  {p.budget ? <Text style={{color:C.teal,fontWeight:'700',fontSize:14}}>{'$'+p.budget.toLocaleString()}</Text> : null}
                </View>
              </Card>
            ))}
          </View>
        )}
        <View style={{height:40}}/>
      </ScrollView>
    </Animated.View>
  );
}

function MessagesScreen({store,onBack}) {
  const {messages,addMessage} = store;
  const THREADS = ['Sunrise Wedding','Mountain Doc','Tech Launch','Studio - Internal'];
  const [activeThread,setActiveThread] = React.useState(null);
  const [msgText,setMsgText] = React.useState('');
  const scrollRef = React.useRef(null);
  const anim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{ Animated.timing(anim,{toValue:1,duration:350,useNativeDriver:true}).start(); },[]);

  function threadMessages(t) { return (messages||[]).filter(m=>m.thread===t); }
  function lastMsg(t) { const ms=threadMessages(t); return ms.length>0?ms[ms.length-1]:null; }
  function sendMsg() {
    if(!msgText.trim()) return;
    addMessage({id:Date.now().toString(),thread:activeThread,sender:'You',text:msgText.trim(),time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})});
    setMsgText('');
    setTimeout(()=>scrollRef.current&&scrollRef.current.scrollToEnd({animated:true}),100);
  }

  if(activeThread) {
    const msgs = threadMessages(activeThread);
    return (
      <View style={{flex:1,backgroundColor:C.bg}}>
        <View style={{backgroundColor:C.surface,paddingTop:52,paddingBottom:16,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:C.border,flexDirection:'row',alignItems:'center'}}>
          <TouchableOpacity onPress={()=>setActiveThread(null)} style={{marginRight:14}}>
            <Text style={{color:C.teal,fontSize:15,fontWeight:'600'}}>{'< Back'}</Text>
          </TouchableOpacity>
          <View style={{flex:1}}>
            <Text style={{color:C.text,fontSize:17,fontWeight:'800'}}>{activeThread}</Text>
            <Text style={{color:C.sub,fontSize:12,marginTop:2}}>{msgs.length} messages</Text>
          </View>
        </View>
        <ScrollView ref={scrollRef} style={{flex:1}} contentContainerStyle={{padding:16}} onContentSizeChange={()=>scrollRef.current&&scrollRef.current.scrollToEnd({animated:false})}>
          {msgs.length===0 && <Text style={{color:C.sub,textAlign:'center',marginTop:40}}>No messages yet. Start the conversation!</Text>}
          {msgs.map(m=>{
            const isMe = m.sender==='You';
            return (
              <View key={m.id} style={{marginBottom:12,alignItems:isMe?'flex-end':'flex-start'}}>
                {!isMe && <Text style={{color:C.sub,fontSize:11,marginBottom:4,marginLeft:4}}>{m.sender}</Text>}
                <View style={{maxWidth:'80%',backgroundColor:isMe?C.teal:C.surface,borderRadius:18,borderBottomRightRadius:isMe?4:18,borderBottomLeftRadius:isMe?18:4,paddingHorizontal:16,paddingVertical:10}}>
                  <Text style={{color:'#fff',fontSize:15,lineHeight:21}}>{m.text}</Text>
                </View>
                <Text style={{color:C.sub,fontSize:10,marginTop:4}}>{m.time}</Text>
              </View>
            );
          })}
        </ScrollView>
        <View style={{backgroundColor:C.surface,borderTopWidth:1,borderTopColor:C.border,flexDirection:'row',alignItems:'center',paddingHorizontal:16,paddingVertical:12,paddingBottom:28}}>
          <TextInput style={{flex:1,backgroundColor:C.bg,borderRadius:24,paddingHorizontal:18,paddingVertical:12,color:C.text,fontSize:15,marginRight:10}} placeholder="Type a message..." placeholderTextColor={C.sub} value={msgText} onChangeText={setMsgText} multiline/>
          <TouchableOpacity onPress={sendMsg} style={{backgroundColor:C.teal,width:44,height:44,borderRadius:22,alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:'#fff',fontWeight:'800',fontSize:18}}>{'>'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <View style={{backgroundColor:C.surface,paddingTop:52,paddingBottom:16,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:C.border,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
        <TouchableOpacity onPress={onBack} style={{marginRight:14}}>
          <Text style={{color:C.teal,fontSize:15,fontWeight:'600'}}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={{color:C.text,fontSize:24,fontWeight:'800',flex:1}}>Messages</Text>
      </View>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20}}>
        {THREADS.map(t=>{
          const last = lastMsg(t);
          return (
            <TouchableOpacity key={t} onPress={()=>setActiveThread(t)} activeOpacity={0.85}>
              <Card style={{marginBottom:12}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <View style={{width:46,height:46,borderRadius:23,backgroundColor:C.teal+'33',alignItems:'center',justifyContent:'center',marginRight:14}}>
                    <Text style={{color:C.teal,fontWeight:'800',fontSize:17}}>{t.charAt(0)}</Text>
                  </View>
                  <View style={{flex:1}}>
                    <Text style={{color:C.text,fontSize:15,fontWeight:'700'}}>{t}</Text>
                    <Text style={{color:C.sub,fontSize:13,marginTop:3}} numberOfLines={1}>{last?last.text:'No messages yet'}</Text>
                  </View>
                  {last&&<Text style={{color:C.sub,fontSize:11}}>{last.time}</Text>}
                </View>
              </Card>
            </TouchableOpacity>
          );
        })}
        <View style={{height:40}}/>
      </ScrollView>
    </Animated.View>
  );
}


function InvoicesScreen({store,onBack}) {
  const {invoices,addInvoice,updateInvoice,deleteInvoice} = store;
  const [selected,setSelected] = React.useState(null);
  const [showAdd,setShowAdd] = React.useState(false);
  const [filter,setFilter] = React.useState('All');
  const [uploading,setUploading] = React.useState(false);
  const [form,setForm] = React.useState({number:'',client:'',amount:'',status:'Draft',dueDate:'',notes:''});
  const anim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{ Animated.timing(anim,{toValue:1,duration:400,useNativeDriver:true}).start(); },[]);
  const FILTERS = ['All','Draft','Sent','Paid','Overdue'];
  const STATUSES = ['Draft','Sent','Paid','Overdue'];
  function statusColor(s) {
    if(s==='Paid') return '#20C997';
    if(s==='Sent') return '#339AF0';
    if(s==='Overdue') return '#FA5252';
    return '#94A3B8';
  }
  const filtered = filter==='All' ? invoices : invoices.filter(i=>i.status===filter);
  const totalPaid = invoices.filter(i=>i.status==='Paid').reduce((a,b)=>a+(b.amount||0),0);
  const totalPending = invoices.filter(i=>i.status==='Sent'||i.status==='Draft').reduce((a,b)=>a+(b.amount||0),0);
  const totalOverdue = invoices.filter(i=>i.status==='Overdue').reduce((a,b)=>a+(b.amount||0),0);

  function openAdd() {
    setForm({number:'INV-'+String(invoices.length+1).padStart(3,'0'),client:'',amount:'',status:'Draft',dueDate:'',notes:''});
    setShowAdd(true);
  }
  function saveInvoice() {
    if(!form.client.trim()||!form.amount.trim()) { Alert.alert('Required','Client and Amount are required'); return; }
    const inv = {...form, amount:parseFloat(form.amount)||0, id:Date.now().toString(), attachments:[], lineItems:[]};
    addInvoice(inv);
    setShowAdd(false);
  }
  function updateStatus(inv,status) {
    updateInvoice(inv.id,{...inv,status});
    setSelected({...inv,status});
  }
  function simulateUpload(inv) {
    const names = ['invoice_backup.pdf','receipt_scan.pdf','contract_signed.pdf','project_brief.pdf'];
    const name = names[Math.floor(Math.random()*names.length)];
    setUploading(true);
    setTimeout(()=>{
      const updated = {...inv,attachments:[...(inv.attachments||[]),{id:Date.now().toString(),name,size:'128 KB'}]};
      updateInvoice(inv.id,updated);
      setSelected(updated);
      setUploading(false);
    },1200);
  }
  function removeAttachment(inv,attId) {
    const updated = {...inv,attachments:(inv.attachments||[]).filter(a=>a.id!==attId)};
    updateInvoice(inv.id,updated);
    setSelected(updated);
  }
  function confirmDelete(inv) {
    Alert.alert('Delete Invoice','Delete '+inv.number+'? This cannot be undone.',[
      {text:'Cancel',style:'cancel'},
      {text:'Delete',style:'destructive',onPress:()=>{ deleteInvoice(inv.id); setSelected(null); }}
    ]);
  }
  function sendInvoice(inv) {
    Alert.alert('Send Invoice','Mark as Sent and notify '+inv.client+'?',[
      {text:'Cancel',style:'cancel'},
      {text:'Send',onPress:()=>updateStatus(inv,'Sent')}
    ]);
  }

  if(selected&&!showAdd) {
    return (
      <View style={{flex:1,backgroundColor:C.bg}}>
        <View style={{backgroundColor:C.surface,paddingTop:52,paddingBottom:16,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:C.border,flexDirection:'row',alignItems:'center'}}>
          <TouchableOpacity onPress={()=>setSelected(null)} style={{marginRight:14}}>
            <Text style={{color:C.teal,fontSize:15,fontWeight:'600'}}>{'< Back'}</Text>
          </TouchableOpacity>
          <View style={{flex:1}}>
            <Text style={{color:C.text,fontSize:19,fontWeight:'800'}}>{selected.number}</Text>
            <Text style={{color:C.sub,fontSize:13,marginTop:2}}>{selected.client}</Text>
          </View>
          <View style={{backgroundColor:statusColor(selected.status)+'22',borderRadius:16,paddingHorizontal:12,paddingVertical:5}}>
            <Text style={{color:statusColor(selected.status),fontWeight:'700',fontSize:12}}>{selected.status}</Text>
          </View>
        </View>
        <ScrollView style={{flex:1}} contentContainerStyle={{padding:20}}>
          <Card>
            <View style={{alignItems:'center',paddingVertical:8}}>
              <Text style={{color:C.sub,fontSize:13,marginBottom:4}}>Invoice Total</Text>
              <Text style={{color:C.teal,fontSize:36,fontWeight:'900'}}>{'$'+(selected.amount||0).toLocaleString()}</Text>
              {selected.dueDate ? <Text style={{color:C.sub,fontSize:13,marginTop:6}}>Due: {selected.dueDate}</Text> : null}
            </View>
          </Card>
          <View style={{flexDirection:'row',marginTop:16}}>
            {selected.status!=='Paid' && <TouchableOpacity onPress={()=>updateStatus(selected,'Paid')} style={{flex:1,backgroundColor:'#20C99733',borderRadius:14,paddingVertical:14,alignItems:'center',marginRight:8}}>
              <Text style={{color:'#20C997',fontWeight:'700',fontSize:14}}>Mark Paid</Text>
            </TouchableOpacity>}
            {selected.status==='Draft' && <TouchableOpacity onPress={()=>sendInvoice(selected)} style={{flex:1,backgroundColor:C.teal,borderRadius:14,paddingVertical:14,alignItems:'center',marginRight:8}}>
              <Text style={{color:'#fff',fontWeight:'700',fontSize:14}}>Send Invoice</Text>
            </TouchableOpacity>}
            {selected.status!=='Overdue' && selected.status!=='Paid' && <TouchableOpacity onPress={()=>updateStatus(selected,'Overdue')} style={{flex:1,backgroundColor:'#FA525233',borderRadius:14,paddingVertical:14,alignItems:'center'}}>
              <Text style={{color:'#FA5252',fontWeight:'700',fontSize:14}}>Mark Overdue</Text>
            </TouchableOpacity>}
          </View>
          {selected.notes ? <Card style={{marginTop:16}}>
            <Text style={{color:C.sub,fontSize:12,fontWeight:'600',marginBottom:8,letterSpacing:1}}>NOTES</Text>
            <Text style={{color:C.text,fontSize:14,lineHeight:20}}>{selected.notes}</Text>
          </Card> : null}
          <Card style={{marginTop:16}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
              <Text style={{color:C.sub,fontSize:12,fontWeight:'600',letterSpacing:1}}>ATTACHMENTS</Text>
              <TouchableOpacity onPress={()=>simulateUpload(selected)} disabled={uploading} style={{backgroundColor:C.teal,borderRadius:12,paddingHorizontal:12,paddingVertical:5}}>
                <Text style={{color:'#fff',fontWeight:'700',fontSize:12}}>{uploading?'Uploading...':'+ Attach'}</Text>
              </TouchableOpacity>
            </View>
            {(selected.attachments||[]).length===0 && <Text style={{color:C.sub,fontSize:13}}>No attachments. Tap attach to add a file.</Text>}
            {(selected.attachments||[]).map(a=>(
              <View key={a.id} style={{flexDirection:'row',alignItems:'center',backgroundColor:C.bg,borderRadius:10,padding:12,marginBottom:8}}>
                <View style={{width:36,height:36,borderRadius:8,backgroundColor:C.teal+'22',alignItems:'center',justifyContent:'center',marginRight:12}}>
                  <Text style={{color:C.teal,fontWeight:'800',fontSize:12}}>PDF</Text>
                </View>
                <View style={{flex:1}}>
                  <Text style={{color:C.text,fontSize:13,fontWeight:'600'}}>{a.name}</Text>
                  <Text style={{color:C.sub,fontSize:11,marginTop:2}}>{a.size}</Text>
                </View>
                <TouchableOpacity onPress={()=>removeAttachment(selected,a.id)}>
                  <Text style={{color:'#FA5252',fontWeight:'700',fontSize:13}}>Remove</Text>
                </TouchableOpacity>
              </View>
            ))}
          </Card>
          <TouchableOpacity onPress={()=>confirmDelete(selected)} style={{marginTop:20,paddingVertical:14,borderRadius:14,borderWidth:1.5,borderColor:'#FA5252',alignItems:'center'}}>
            <Text style={{color:'#FA5252',fontWeight:'700',fontSize:15}}>Delete Invoice</Text>
          </TouchableOpacity>
          <View style={{height:40}}/>
        </ScrollView>
      </View>
    );
  }

  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <View style={{backgroundColor:C.surface,paddingTop:52,paddingBottom:16,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:C.border,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
        <TouchableOpacity onPress={onBack}>
          <Text style={{color:C.teal,fontSize:15,fontWeight:'600'}}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={{color:C.text,fontSize:24,fontWeight:'800',flex:1,marginLeft:14}}>Invoices</Text>
        <TouchableOpacity onPress={openAdd} style={{backgroundColor:C.teal,borderRadius:20,paddingHorizontal:16,paddingVertical:8}}>
          <Text style={{color:'#fff',fontWeight:'700',fontSize:14}}>+ New</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20}}>
        <View style={{flexDirection:'row',marginBottom:20}}>
          <View style={{flex:1,backgroundColor:C.surface,borderRadius:14,padding:14,marginRight:8,alignItems:'center'}}>
            <Text style={{color:'#20C997',fontWeight:'800',fontSize:18}}>{'$'+totalPaid.toLocaleString()}</Text>
            <Text style={{color:C.sub,fontSize:11,marginTop:4}}>Paid</Text>
          </View>
          <View style={{flex:1,backgroundColor:C.surface,borderRadius:14,padding:14,marginRight:8,alignItems:'center'}}>
            <Text style={{color:C.teal,fontWeight:'800',fontSize:18}}>{'$'+totalPending.toLocaleString()}</Text>
            <Text style={{color:C.sub,fontSize:11,marginTop:4}}>Pending</Text>
          </View>
          <View style={{flex:1,backgroundColor:C.surface,borderRadius:14,padding:14,alignItems:'center'}}>
            <Text style={{color:'#FA5252',fontWeight:'800',fontSize:18}}>{'$'+totalOverdue.toLocaleString()}</Text>
            <Text style={{color:C.sub,fontSize:11,marginTop:4}}>Overdue</Text>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:20}}>
          {FILTERS.map(f=>(
            <TouchableOpacity key={f} onPress={()=>setFilter(f)} style={{paddingHorizontal:18,paddingVertical:8,borderRadius:20,marginRight:8,backgroundColor:filter===f?C.teal:C.surface}}>
              <Text style={{color:filter===f?'#fff':C.sub,fontWeight:filter===f?'700':'500',fontSize:13}}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {filtered.length===0 && <Text style={{color:C.sub,textAlign:'center',marginTop:40}}>No invoices found</Text>}
        {filtered.map(iv=>(
          <TouchableOpacity key={iv.id} onPress={()=>setSelected(iv)} activeOpacity={0.85}>
            <Card style={{marginBottom:12}}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <View style={{flex:1}}>
                  <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={{color:C.text,fontSize:15,fontWeight:'700'}}>{iv.number}</Text>
                    <View style={{backgroundColor:statusColor(iv.status)+'22',borderRadius:12,paddingHorizontal:10,paddingVertical:3,marginLeft:10}}>
                      <Text style={{color:statusColor(iv.status),fontSize:11,fontWeight:'700'}}>{iv.status}</Text>
                    </View>
                  </View>
                  <Text style={{color:C.sub,fontSize:13,marginTop:3}}>{iv.client}</Text>
                  {iv.dueDate ? <Text style={{color:C.sub,fontSize:11,marginTop:2}}>Due {iv.dueDate}</Text> : null}
                </View>
                <Text style={{color:C.teal,fontWeight:'800',fontSize:17}}>{'$'+(iv.amount||0).toLocaleString()}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
        <View style={{height:40}}/>
      </ScrollView>
      <Modal visible={showAdd} animationType="slide" transparent>
        <View style={{flex:1,backgroundColor:'#000A',justifyContent:'flex-end'}}>
          <View style={{backgroundColor:C.surface,borderTopLeftRadius:24,borderTopRightRadius:24,padding:24,paddingBottom:40}}>
            <Text style={{color:C.text,fontSize:20,fontWeight:'800',marginBottom:20}}>New Invoice</Text>
            {[['Invoice Number','number','default'],['Client Name','client','default'],['Amount (number)','amount','numeric'],['Due Date (e.g. 30 Apr 2026)','dueDate','default']].map(([label,key,kb])=>(
              <View key={key} style={{marginBottom:14}}>
                <Text style={{color:C.sub,fontSize:12,marginBottom:6,fontWeight:'600'}}>{label.toUpperCase()}</Text>
                <TextInput style={{backgroundColor:C.bg,borderRadius:12,paddingHorizontal:14,paddingVertical:12,color:C.text,fontSize:15}} placeholder={label} placeholderTextColor={C.sub} keyboardType={kb} value={form[key]} onChangeText={v=>setForm(f=>({...f,[key]:v}))}/>
              </View>
            ))}
            <Text style={{color:C.sub,fontSize:12,marginBottom:8,fontWeight:'600'}}>STATUS</Text>
            <View style={{flexDirection:'row',marginBottom:16}}>
              {STATUSES.map(s=>(
                <TouchableOpacity key={s} onPress={()=>setForm(f=>({...f,status:s}))} style={{flex:1,alignItems:'center',paddingVertical:10,borderRadius:12,marginRight:s!=='Overdue'?6:0,backgroundColor:form.status===s?statusColor(s)+'33':C.bg,borderWidth:1.5,borderColor:form.status===s?statusColor(s):C.border}}>
                  <Text style={{color:form.status===s?statusColor(s):C.sub,fontWeight:'700',fontSize:11}}>{s}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity onPress={()=>setShowAdd(false)} style={{flex:1,paddingVertical:16,borderRadius:16,backgroundColor:C.bg,alignItems:'center',marginRight:12}}>
                <Text style={{color:C.sub,fontWeight:'700',fontSize:16}}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveInvoice} style={{flex:1,paddingVertical:16,borderRadius:16,backgroundColor:C.teal,alignItems:'center'}}>
                <Text style={{color:'#fff',fontWeight:'700',fontSize:16}}>Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}


function ReportsScreen({store,onBack}) {
  const {projects,invoices,crew} = store;
  const anim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{ Animated.timing(anim,{toValue:1,duration:400,useNativeDriver:true}).start(); },[]);
  const totalRevenue = invoices.filter(i=>i.status==='Paid').reduce((a,b)=>a+(b.amount||0),0);
  const totalPipeline = projects.filter(p=>p.status!=='Completed'&&p.status!=='Cancelled').reduce((a,b)=>a+(b.budget||0),0);
  const totalInvoiced = invoices.reduce((a,b)=>a+(b.amount||0),0);
  const crewAvailable = crew.filter(c=>c.status==='Available').length;
  const crewBusy = crew.filter(c=>c.status==='On Job').length;
  const projectsByStatus = ['Planning','Pre-Production','In Progress','Post-Production','Completed','Cancelled'].map(s=>({label:s,count:projects.filter(p=>p.status===s).length}));
  const invoicesByStatus = ['Draft','Sent','Paid','Overdue'].map(s=>({label:s,count:invoices.filter(i=>i.status===s).length, amount:invoices.filter(i=>i.status===s).reduce((a,b)=>a+(b.amount||0),0)}));
  const sColor = s=>{
    if(s==='Paid'||s==='Completed'||s==='In Progress') return '#20C997';
    if(s==='Sent'||s==='Pre-Production'||s==='Planning') return '#339AF0';
    if(s==='Overdue'||s==='Cancelled') return '#FA5252';
    if(s==='Post-Production') return '#845EF7';
    return '#F59F00';
  };
  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <View style={{backgroundColor:C.surface,paddingTop:52,paddingBottom:16,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:C.border,flexDirection:'row',alignItems:'center'}}>
        <TouchableOpacity onPress={onBack} style={{marginRight:14}}>
          <Text style={{color:C.teal,fontSize:15,fontWeight:'600'}}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={{color:C.text,fontSize:24,fontWeight:'800'}}>Reports</Text>
      </View>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20}}>
        <Card style={{marginBottom:20}}>
          <Text style={{color:C.sub,fontSize:12,fontWeight:'600',letterSpacing:1,marginBottom:16}}>FINANCIAL OVERVIEW</Text>
          <View style={{flexDirection:'row',marginBottom:16}}>
            <View style={{flex:1,alignItems:'center'}}>
              <Text style={{color:'#20C997',fontWeight:'900',fontSize:22}}>{'$'+totalRevenue.toLocaleString()}</Text>
              <Text style={{color:C.sub,fontSize:11,marginTop:4}}>Revenue Collected</Text>
            </View>
            <View style={{width:1,backgroundColor:C.border}}/>
            <View style={{flex:1,alignItems:'center'}}>
              <Text style={{color:C.teal,fontWeight:'900',fontSize:22}}>{'$'+totalPipeline.toLocaleString()}</Text>
              <Text style={{color:C.sub,fontSize:11,marginTop:4}}>Pipeline Value</Text>
            </View>
          </View>
          <View style={{flexDirection:'row'}}>
            <View style={{flex:1,alignItems:'center'}}>
              <Text style={{color:'#F59F00',fontWeight:'900',fontSize:22}}>{'$'+totalInvoiced.toLocaleString()}</Text>
              <Text style={{color:C.sub,fontSize:11,marginTop:4}}>Total Invoiced</Text>
            </View>
            <View style={{width:1,backgroundColor:C.border}}/>
            <View style={{flex:1,alignItems:'center'}}>
              <Text style={{color:'#845EF7',fontWeight:'900',fontSize:22}}>{crew.length}</Text>
              <Text style={{color:C.sub,fontSize:11,marginTop:4}}>Total Crew</Text>
            </View>
          </View>
        </Card>
        <Card style={{marginBottom:20}}>
          <Text style={{color:C.sub,fontSize:12,fontWeight:'600',letterSpacing:1,marginBottom:16}}>PROJECTS BY STATUS</Text>
          {projectsByStatus.map(ps=>(
            <View key={ps.label} style={{flexDirection:'row',alignItems:'center',marginBottom:10}}>
              <View style={{width:10,height:10,borderRadius:5,backgroundColor:sColor(ps.label),marginRight:10}}/>
              <Text style={{color:C.text,fontSize:14,flex:1}}>{ps.label}</Text>
              <View style={{height:6,flex:2,backgroundColor:C.bg,borderRadius:3,marginRight:10,overflow:'hidden'}}>
                <View style={{height:6,width:projects.length>0?(ps.count/projects.length*100)+'%':'0%',backgroundColor:sColor(ps.label),borderRadius:3}}/>
              </View>
              <Text style={{color:C.sub,fontSize:13,fontWeight:'700',width:20,textAlign:'right'}}>{ps.count}</Text>
            </View>
          ))}
        </Card>
        <Card style={{marginBottom:20}}>
          <Text style={{color:C.sub,fontSize:12,fontWeight:'600',letterSpacing:1,marginBottom:16}}>INVOICES BREAKDOWN</Text>
          {invoicesByStatus.map(is=>(
            <View key={is.label} style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:12,backgroundColor:C.bg,borderRadius:12,padding:12}}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <View style={{width:10,height:10,borderRadius:5,backgroundColor:sColor(is.label),marginRight:10}}/>
                <Text style={{color:C.text,fontSize:14,fontWeight:'600'}}>{is.label}</Text>
              </View>
              <View style={{alignItems:'flex-end'}}>
                <Text style={{color:sColor(is.label),fontWeight:'800',fontSize:15}}>{'$'+is.amount.toLocaleString()}</Text>
                <Text style={{color:C.sub,fontSize:11}}>{is.count} invoice{is.count!==1?'s':''}</Text>
              </View>
            </View>
          ))}
        </Card>
        <Card style={{marginBottom:20}}>
          <Text style={{color:C.sub,fontSize:12,fontWeight:'600',letterSpacing:1,marginBottom:16}}>CREW UTILISATION</Text>
          <View style={{flexDirection:'row'}}>
            <View style={{flex:1,alignItems:'center'}}>
              <Text style={{color:'#20C997',fontWeight:'800',fontSize:22}}>{crewAvailable}</Text>
              <Text style={{color:C.sub,fontSize:12,marginTop:4}}>Available</Text>
            </View>
            <View style={{flex:1,alignItems:'center'}}>
              <Text style={{color:'#339AF0',fontWeight:'800',fontSize:22}}>{crewBusy}</Text>
              <Text style={{color:C.sub,fontSize:12,marginTop:4}}>On Job</Text>
            </View>
            <View style={{flex:1,alignItems:'center'}}>
              <Text style={{color:'#FA5252',fontWeight:'800',fontSize:22}}>{crew.filter(c=>c.status==='Unavailable').length}</Text>
              <Text style={{color:C.sub,fontSize:12,marginTop:4}}>Unavailable</Text>
            </View>
          </View>
        </Card>
        <View style={{height:40}}/>
      </ScrollView>
    </Animated.View>
  );
}

function PortalScreen({store,onBack}) {
  const {userProfile,updateUserProfile,invoices} = store;
  const [editing,setEditing] = React.useState(false);
  const [form,setForm] = React.useState({name:userProfile.name||'',role:userProfile.role||'',email:userProfile.email||'',phone:userProfile.phone||'',rate:String(userProfile.rate||'')});
  const anim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{ Animated.timing(anim,{toValue:1,duration:400,useNativeDriver:true}).start(); },[]);
  const totalEarned = invoices.filter(i=>i.status==='Paid').reduce((a,b)=>a+(b.amount||0),0);
  const totalPending = invoices.filter(i=>i.status==='Sent'||i.status==='Draft').reduce((a,b)=>a+(b.amount||0),0);
  function saveProfile() {
    updateUserProfile({...userProfile,...form,rate:parseFloat(form.rate)||0});
    setEditing(false);
  }
  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <View style={{backgroundColor:C.surface,paddingTop:52,paddingBottom:16,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:C.border,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
        <TouchableOpacity onPress={onBack} style={{marginRight:14}}>
          <Text style={{color:C.teal,fontSize:15,fontWeight:'600'}}>{'< Back'}</Text>
        </TouchableOpacity>
        <Text style={{color:C.text,fontSize:24,fontWeight:'800',flex:1}}>My Portal</Text>
        <TouchableOpacity onPress={()=>setEditing(e=>!e)}>
          <Text style={{color:C.teal,fontWeight:'700',fontSize:14}}>{editing?'Done':'Edit'}</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20}}>
        <Card style={{marginBottom:16,alignItems:'center',paddingVertical:24}}>
          <View style={{width:72,height:72,borderRadius:36,backgroundColor:C.gold+'33',alignItems:'center',justifyContent:'center',marginBottom:12}}>
            <Text style={{color:C.gold,fontWeight:'900',fontSize:28}}>{(userProfile.name||'F').charAt(0)}</Text>
          </View>
          {editing ? (
            <View style={{width:'100%'}}>
              {[['Name','name','default'],['Role','role','default'],['Email','email','email-address'],['Phone','phone','phone-pad'],['Day Rate','rate','numeric']].map(([label,key,kb])=>(
                <View key={key} style={{marginBottom:12}}>
                  <Text style={{color:C.sub,fontSize:11,fontWeight:'600',marginBottom:5}}>{label.toUpperCase()}</Text>
                  <TextInput style={{backgroundColor:C.bg,borderRadius:12,paddingHorizontal:14,paddingVertical:11,color:C.text,fontSize:15}} placeholder={label} placeholderTextColor={C.sub} keyboardType={kb} value={form[key]} onChangeText={v=>setForm(f=>({...f,[key]:v}))}/>
                </View>
              ))}
              <TouchableOpacity onPress={saveProfile} style={{backgroundColor:C.gold,borderRadius:14,paddingVertical:14,alignItems:'center',marginTop:8}}>
                <Text style={{color:'#fff',fontWeight:'700',fontSize:16}}>Save Profile</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{alignItems:'center'}}>
              <Text style={{color:C.text,fontSize:22,fontWeight:'800'}}>{userProfile.name||'Freelancer'}</Text>
              <Text style={{color:C.sub,fontSize:15,marginTop:4}}>{userProfile.role||'Role not set'}</Text>
              {userProfile.rate ? <Text style={{color:C.gold,fontSize:14,fontWeight:'700',marginTop:6}}>{'$'+userProfile.rate+' / day'}</Text> : null}
              {userProfile.email ? <Text style={{color:C.sub,fontSize:13,marginTop:4}}>{userProfile.email}</Text> : null}
            </View>
          )}
        </Card>
        <View style={{flexDirection:'row',marginBottom:16}}>
          <Card style={{flex:1,marginRight:8,alignItems:'center'}}>
            <Text style={{color:'#20C997',fontWeight:'900',fontSize:20}}>{'$'+totalEarned.toLocaleString()}</Text>
            <Text style={{color:C.sub,fontSize:11,marginTop:4}}>Earned</Text>
          </Card>
          <Card style={{flex:1,alignItems:'center'}}>
            <Text style={{color:C.gold,fontWeight:'900',fontSize:20}}>{'$'+totalPending.toLocaleString()}</Text>
            <Text style={{color:C.sub,fontSize:11,marginTop:4}}>Pending</Text>
          </Card>
        </View>
        <Card>
          <Text style={{color:C.sub,fontSize:12,fontWeight:'600',letterSpacing:1,marginBottom:12}}>MY INVOICES</Text>
          {invoices.length===0 && <Text style={{color:C.sub,fontSize:14}}>No invoices yet</Text>}
          {invoices.slice(0,5).map(iv=>(
            <View key={iv.id} style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',paddingVertical:10,borderBottomWidth:1,borderBottomColor:C.border}}>
              <View>
                <Text style={{color:C.text,fontSize:14,fontWeight:'600'}}>{iv.number}</Text>
                <Text style={{color:C.sub,fontSize:12,marginTop:2}}>{iv.status}</Text>
              </View>
              <Text style={{color:C.teal,fontWeight:'700',fontSize:14}}>{'$'+(iv.amount||0).toLocaleString()}</Text>
            </View>
          ))}
        </Card>
        <View style={{height:40}}/>
      </ScrollView>
    </Animated.View>
  );
}

function MoreScreen({store,onNav,onSignOut}) {
  const {userProfile} = store;
  const anim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{ Animated.timing(anim,{toValue:1,duration:400,useNativeDriver:true}).start(); },[]);
  const items = [
    {label:'Messages',sub:'Team chat and project threads',screen:'messages',color:C.teal},
    {label:'Invoices',sub:'Manage billing and payments',screen:'invoices',color:'#F59F00'},
    {label:'Reports',sub:'Financial overview and analytics',screen:'reports',color:'#845EF7'},
    {label:'Notifications',sub:'Alerts and activity updates',screen:'notifications',color:'#339AF0'},
  ];
  function confirmSignOut() {
    Alert.alert('Sign Out','Are you sure you want to sign out?',[
      {text:'Cancel',style:'cancel'},
      {text:'Sign Out',style:'destructive',onPress:onSignOut}
    ]);
  }
  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <View style={{backgroundColor:C.surface,paddingTop:52,paddingBottom:16,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:C.border}}>
        <Text style={{color:C.text,fontSize:24,fontWeight:'800'}}>More</Text>
      </View>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20}}>
        <Card style={{marginBottom:20}}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <View style={{width:52,height:52,borderRadius:26,backgroundColor:C.teal+'33',alignItems:'center',justifyContent:'center',marginRight:14}}>
              <Text style={{color:C.teal,fontWeight:'900',fontSize:20}}>{(userProfile.name||'U').charAt(0)}</Text>
            </View>
            <View>
              <Text style={{color:C.text,fontSize:17,fontWeight:'800'}}>{userProfile.name||'User'}</Text>
              <Text style={{color:C.sub,fontSize:13,marginTop:2}}>{userProfile.role||'Business Account'}</Text>
            </View>
          </View>
        </Card>
        {items.map(item=>(
          <TouchableOpacity key={item.screen} onPress={()=>onNav(item.screen)} activeOpacity={0.85}>
            <Card style={{marginBottom:12}}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <View style={{width:42,height:42,borderRadius:12,backgroundColor:item.color+'22',alignItems:'center',justifyContent:'center',marginRight:14}}>
                  <View style={{width:14,height:14,borderRadius:7,backgroundColor:item.color}}/>
                </View>
                <View style={{flex:1}}>
                  <Text style={{color:C.text,fontSize:15,fontWeight:'700'}}>{item.label}</Text>
                  <Text style={{color:C.sub,fontSize:12,marginTop:2}}>{item.sub}</Text>
                </View>
                <Text style={{color:C.sub,fontSize:18}}>{'>'}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={confirmSignOut} style={{marginTop:24,paddingVertical:16,borderRadius:16,borderWidth:1.5,borderColor:'#FA5252',alignItems:'center'}}>
          <Text style={{color:'#FA5252',fontWeight:'700',fontSize:16}}>Sign Out</Text>
        </TouchableOpacity>
        <Text style={{color:C.sub,fontSize:11,textAlign:'center',marginTop:20}}>CrewDesk v17 - Production Management Platform</Text>
        <View style={{height:40}}/>
      </ScrollView>
    </Animated.View>
  );
}

function FScheduleScreen({store}) {
  const {projects} = store;
  const anim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{ Animated.timing(anim,{toValue:1,duration:400,useNativeDriver:true}).start(); },[]);
  const myProjects = projects.filter(p=>p.status!=='Cancelled');
  const statusColor = s=>{
    if(s==='In Progress') return '#20C997';
    if(s==='Pre-Production') return '#339AF0';
    if(s==='Post-Production') return '#845EF7';
    return '#F59F00';
  };
  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <View style={{backgroundColor:C.surface,paddingTop:52,paddingBottom:16,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:C.border}}>
        <Text style={{color:C.text,fontSize:24,fontWeight:'800'}}>My Schedule</Text>
        <Text style={{color:C.sub,fontSize:13,marginTop:4}}>Upcoming and active projects</Text>
      </View>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20}}>
        {myProjects.length===0 && <Text style={{color:C.sub,textAlign:'center',marginTop:60}}>No projects scheduled</Text>}
        {myProjects.map(p=>(
          <Card key={p.id} style={{marginBottom:12}}>
            <View style={{flexDirection:'row',alignItems:'center'}}>
              <View style={{width:4,height:52,borderRadius:2,backgroundColor:statusColor(p.status),marginRight:14}}/>
              <View style={{flex:1}}>
                <Text style={{color:C.text,fontSize:15,fontWeight:'700'}}>{p.name}</Text>
                <Text style={{color:C.sub,fontSize:13,marginTop:2}}>{p.client}</Text>
                <View style={{backgroundColor:statusColor(p.status)+'22',borderRadius:12,paddingHorizontal:10,paddingVertical:3,alignSelf:'flex-start',marginTop:6}}>
                  <Text style={{color:statusColor(p.status),fontSize:11,fontWeight:'700'}}>{p.status}</Text>
                </View>
              </View>
              {p.budget ? <Text style={{color:C.gold,fontWeight:'700',fontSize:14}}>{'$'+p.budget.toLocaleString()}</Text> : null}
            </View>
          </Card>
        ))}
        <View style={{height:40}}/>
      </ScrollView>
    </Animated.View>
  );
}

function FInvoicesScreen({store}) {
  const {invoices} = store;
  const anim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{ Animated.timing(anim,{toValue:1,duration:400,useNativeDriver:true}).start(); },[]);
  const statusColor = s=>s==='Paid'?'#20C997':s==='Sent'?'#339AF0':s==='Overdue'?'#FA5252':'#94A3B8';
  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <View style={{backgroundColor:C.surface,paddingTop:52,paddingBottom:16,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:C.border}}>
        <Text style={{color:C.text,fontSize:24,fontWeight:'800'}}>My Invoices</Text>
      </View>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20}}>
        {invoices.length===0 && <Text style={{color:C.sub,textAlign:'center',marginTop:60}}>No invoices yet</Text>}
        {invoices.map(iv=>(
          <Card key={iv.id} style={{marginBottom:12}}>
            <View style={{flexDirection:'row',alignItems:'center'}}>
              <View style={{flex:1}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <Text style={{color:C.text,fontSize:15,fontWeight:'700'}}>{iv.number}</Text>
                  <View style={{backgroundColor:statusColor(iv.status)+'22',borderRadius:12,paddingHorizontal:10,paddingVertical:3,marginLeft:10}}>
                    <Text style={{color:statusColor(iv.status),fontSize:11,fontWeight:'700'}}>{iv.status}</Text>
                  </View>
                </View>
                <Text style={{color:C.sub,fontSize:13,marginTop:3}}>{iv.client}</Text>
              </View>
              <Text style={{color:C.gold,fontWeight:'800',fontSize:17}}>{'$'+(iv.amount||0).toLocaleString()}</Text>
            </View>
          </Card>
        ))}
        <View style={{height:40}}/>
      </ScrollView>
    </Animated.View>
  );
}

function FMoreScreen({store,onNav,onSignOut}) {
  const {userProfile} = store;
  const anim = React.useRef(new Animated.Value(0)).current;
  React.useEffect(()=>{ Animated.timing(anim,{toValue:1,duration:400,useNativeDriver:true}).start(); },[]);
  function confirmSignOut() {
    Alert.alert('Sign Out','Are you sure you want to sign out?',[
      {text:'Cancel',style:'cancel'},
      {text:'Sign Out',style:'destructive',onPress:onSignOut}
    ]);
  }
  return (
    <Animated.View style={{flex:1,backgroundColor:C.bg,opacity:anim}}>
      <View style={{backgroundColor:C.surface,paddingTop:52,paddingBottom:16,paddingHorizontal:20,borderBottomWidth:1,borderBottomColor:C.border}}>
        <Text style={{color:C.text,fontSize:24,fontWeight:'800'}}>More</Text>
      </View>
      <ScrollView style={{flex:1}} contentContainerStyle={{padding:20}}>
        <Card style={{marginBottom:20}}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <View style={{width:52,height:52,borderRadius:26,backgroundColor:C.gold+'33',alignItems:'center',justifyContent:'center',marginRight:14}}>
              <Text style={{color:C.gold,fontWeight:'900',fontSize:20}}>{(userProfile.name||'F').charAt(0)}</Text>
            </View>
            <View>
              <Text style={{color:C.text,fontSize:17,fontWeight:'800'}}>{userProfile.name||'Freelancer'}</Text>
              <Text style={{color:C.sub,fontSize:13,marginTop:2}}>Freelancer Account</Text>
            </View>
          </View>
        </Card>
        {[{label:'My Portal',sub:'Profile, earnings and stats',screen:'portal',color:C.gold},{label:'Notifications',sub:'Alerts and activity updates',screen:'notifications',color:'#339AF0'}].map(item=>(
          <TouchableOpacity key={item.screen} onPress={()=>onNav(item.screen)} activeOpacity={0.85}>
            <Card style={{marginBottom:12}}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <View style={{width:42,height:42,borderRadius:12,backgroundColor:item.color+'22',alignItems:'center',justifyContent:'center',marginRight:14}}>
                  <View style={{width:14,height:14,borderRadius:7,backgroundColor:item.color}}/>
                </View>
                <View style={{flex:1}}>
                  <Text style={{color:C.text,fontSize:15,fontWeight:'700'}}>{item.label}</Text>
                  <Text style={{color:C.sub,fontSize:12,marginTop:2}}>{item.sub}</Text>
                </View>
                <Text style={{color:C.sub,fontSize:18}}>{'>'}</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
        <TouchableOpacity onPress={confirmSignOut} style={{marginTop:24,paddingVertical:16,borderRadius:16,borderWidth:1.5,borderColor:'#FA5252',alignItems:'center'}}>
          <Text style={{color:'#FA5252',fontWeight:'700',fontSize:16}}>Sign Out</Text>
        </TouchableOpacity>
        <Text style={{color:C.sub,fontSize:11,textAlign:'center',marginTop:20}}>CrewDesk v17 - Production Platform</Text>
        <View style={{height:40}}/>
      </ScrollView>
    </Animated.View>
  );
}

function TabBar({tabs,active,onPress,type}) {
  const accentColor = type==='freelancer'?C.gold:C.teal;
  return (
    <View style={{flexDirection:'row',backgroundColor:C.surface,borderTopWidth:1,borderTopColor:C.border,paddingBottom:20,paddingTop:8}}>
      {tabs.map(tab=>{
        const isActive = active===tab.key;
        return (
          <TouchableOpacity key={tab.key} style={{flex:1,alignItems:'center',paddingVertical:6}} onPress={()=>onPress(tab.key)}>
            <View style={{width:28,height:3,borderRadius:2,backgroundColor:isActive?accentColor:'transparent',marginBottom:6}}/>
            <Text style={{fontSize:12,fontWeight:isActive?'700':'500',color:isActive?accentColor:C.sub}}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function App() {
  const store = useStore();
  const [mode,setMode] = React.useState(null);
  const [bizTab,setBizTab] = React.useState('home');
  const [freeTab,setFreeTab] = React.useState('home');
  const [subScreen,setSubScreen] = React.useState(null);

  const SUBS = ['messages','invoices','reports','portal','notifications'];
  function handleNav(screen) { if(SUBS.includes(screen)) setSubScreen(screen); }
  function goBack() { setSubScreen(null); }
  function handleSignOut() { setMode(null); setSubScreen(null); setBizTab('home'); setFreeTab('home'); }

  if(!mode) return <LoginScreen onLogin={setMode}/>;

  if(mode==='business') {
    const bizTabs = [{key:'home',label:'Home'},{key:'projects',label:'Projects'},{key:'crew',label:'Crew'},{key:'schedule',label:'Schedule'},{key:'more',label:'More'}];
    function renderSub() {
      if(subScreen==='messages') return <MessagesScreen store={store} onBack={goBack}/>;
      if(subScreen==='invoices') return <InvoicesScreen store={store} onBack={goBack}/>;
      if(subScreen==='reports') return <ReportsScreen store={store} onBack={goBack}/>;
      if(subScreen==='notifications') return <NotificationsScreen store={store} onBack={goBack}/>;
      return null;
    }
    if(subScreen) {
      return (
        <View style={{flex:1}}>
          {renderSub()}
        </View>
      );
    }
    return (
      <View style={{flex:1,backgroundColor:C.bg}}>
        {bizTab==='home' && <HomeScreen store={store} onNav={handleNav}/>}
        {bizTab==='projects' && <ProjectsScreen store={store}/>}
        {bizTab==='crew' && <CrewScreen store={store} onNav={handleNav}/>}
        {bizTab==='schedule' && <ScheduleScreen store={store}/>}
        {bizTab==='more' && <MoreScreen store={store} onNav={handleNav} onSignOut={handleSignOut}/>}
        <TabBar tabs={bizTabs} active={bizTab} onPress={setBizTab} type="business"/>
      </View>
    );
  }

  if(mode==='freelancer') {
    const freeTabs = [{key:'home',label:'Home'},{key:'schedule',label:'Schedule'},{key:'invoices',label:'Invoices'},{key:'more',label:'More'}];
    function renderFreeSub() {
      if(subScreen==='portal') return <PortalScreen store={store} onBack={goBack}/>;
      if(subScreen==='notifications') return <NotificationsScreen store={store} onBack={goBack}/>;
      return null;
    }
    if(subScreen) {
      return (
        <View style={{flex:1}}>
          {renderFreeSub()}
        </View>
      );
    }
    return (
      <View style={{flex:1,backgroundColor:C.bg}}>
        {freeTab==='home' && <FHomeScreen store={store} onNav={handleNav}/>}
        {freeTab==='schedule' && <FScheduleScreen store={store}/>}
        {freeTab==='invoices' && <FInvoicesScreen store={store}/>}
        {freeTab==='more' && <FMoreScreen store={store} onNav={handleNav} onSignOut={handleSignOut}/>}
        <TabBar tabs={freeTabs} active={freeTab} onPress={setFreeTab} type="freelancer"/>
      </View>
    );
  }

  return null;
}
