import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  SafeAreaView, StatusBar, Dimensions, Modal, Alert,
  FlatList, KeyboardAvoidingView, Platform, Switch,
  Pressable, Animated, RefreshControl,
} from 'react-native';

const C = {
  bg:'#080C14', bgCard:'#0F1520', bgElevated:'#16202E', bgHighlight:'#1E2A3A', bgGlass:'rgba(15,21,32,0.92)',
  primary:'#F5A623', accent:'#00D4B4', punch:'#FF5C5C', success:'#4ADE80', purple:'#A78BFA', blue:'#3B82F6',
  primaryT:'rgba(245,166,35,0.12)', accentT:'rgba(0,212,180,0.12)', punchT:'rgba(255,92,92,0.12)',
  successT:'rgba(74,222,128,0.12)', purpleT:'rgba(167,139,250,0.12)', blueT:'rgba(59,130,246,0.12)',
  ink:'#F0F4FF', inkSub:'#8896A8', inkFaint:'#2E3D52', inkDark:'#080C14',
  border:'#1A2538', borderGlow:'rgba(245,166,35,0.35)', shadow:'rgba(0,0,0,0.6)', overlay:'rgba(8,12,20,0.88)',
};
const TY = {
  hero:  {fontSize:38,fontWeight:'800',letterSpacing:-1.5,lineHeight:44},
  h1:    {fontSize:28,fontWeight:'800',letterSpacing:-1,  lineHeight:34},
  h2:    {fontSize:22,fontWeight:'700',letterSpacing:-0.5,lineHeight:28},
  h3:    {fontSize:17,fontWeight:'700',letterSpacing:-0.3,lineHeight:22},
  h4:    {fontSize:15,fontWeight:'700',letterSpacing:-0.1,lineHeight:20},
  label: {fontSize:11,fontWeight:'700',letterSpacing:1.4, textTransform:'uppercase'},
  body:  {fontSize:15,fontWeight:'400',lineHeight:23},
  bodyMd:{fontSize:14,fontWeight:'400',lineHeight:21},
  caption:{fontSize:12,fontWeight:'500',lineHeight:17},
  micro: {fontSize:10,fontWeight:'700',letterSpacing:0.6},
  mono:  {fontSize:13,fontWeight:'600'},
};
const SW = Dimensions.get('window').width;
const isIOS = Platform.OS === 'ios';

let _listeners = [];
const store = {
  projects:[
    {id:'p1',title:'Midnight Runner',subtitle:'Feature Film',client:'StudioFX Productions',status:'active',budget:480000,spent:312000,crew:14,startDate:'2026-01-15',endDate:'2026-07-30',location:'London, UK',color:'#F5A623',desc:'A high-octane action thriller filmed across London and Edinburgh. Principal photography underway.'},
    {id:'p2',title:'Nova Campaign',subtitle:'Brand and Commercial',client:'Nova Collective',status:'active',budget:95000,spent:41200,crew:6,startDate:'2026-02-01',endDate:'2026-04-15',location:'Manchester, UK',color:'#00D4B4',desc:'A 360 brand refresh campaign across OOH, digital and broadcast channels.'},
    {id:'p3',title:'Altitude',subtitle:'Documentary',client:'Channel 4',status:'completed',budget:220000,spent:218500,crew:9,startDate:'2025-09-01',endDate:'2026-01-20',location:'Scotland, UK',color:'#A78BFA',desc:'Award-winning documentary exploring life above the clouds. Post-production complete.'},
    {id:'p4',title:'The Last Signal',subtitle:'Short Film',client:'Indie Arts Fund',status:'pending',budget:35000,spent:0,crew:5,startDate:'2026-04-01',endDate:'2026-06-30',location:'Bristol, UK',color:'#3B82F6',desc:'A sci-fi short film selected for Sundance development programme.'},
  ],
  crew:[
    {id:'c1',name:'Sophia Marlowe',role:'Director of Photography',dept:'Camera',rate:1200,status:'active',phone:'+44 7700 900001',email:'sophia@crewdesk.io',location:'London',skills:['Arri Alexa','Lighting','Drone Op'],initials:'SM',color:'#F5A623',projects:['p1','p2']},
    {id:'c2',name:'Marcus Webb',role:'Production Designer',dept:'Art',rate:950,status:'active',phone:'+44 7700 900002',email:'marcus@crewdesk.io',location:'Manchester',skills:['Set Design','Concept Art','CAD'],initials:'MW',color:'#00D4B4',projects:['p1']},
    {id:'c3',name:'Priya Nair',role:'Sound Supervisor',dept:'Sound',rate:875,status:'onleave',phone:'+44 7700 900003',email:'priya@crewdesk.io',location:'Birmingham',skills:['Boom','Pro Tools','Foley'],initials:'PN',color:'#A78BFA',projects:['p3']},
    {id:'c4',name:'James Fletcher',role:'1st AC',dept:'Camera',rate:720,status:'active',phone:'+44 7700 900004',email:'james@crewdesk.io',location:'London',skills:['Focus Pull','Lens Matching','DIT'],initials:'JF',color:'#FF5C5C',projects:['p1','p2']},
    {id:'c5',name:'Aisha Okafor',role:'Gaffer',dept:'Electrical',rate:810,status:'active',phone:'+44 7700 900005',email:'aisha@crewdesk.io',location:'Leeds',skills:['HMI','LED','Rigging'],initials:'AO',color:'#4ADE80',projects:['p1']},
    {id:'c6',name:'Tom Bradshaw',role:'Editor',dept:'Post',rate:680,status:'active',phone:'+44 7700 900006',email:'tom@crewdesk.io',location:'London',skills:['Avid','Premiere','DaVinci'],initials:'TB',color:'#3B82F6',projects:['p3']},
  ],
  shifts:[
    {id:'s1',title:'Principal Photography Day 18',project:'Midnight Runner',crewNeeded:8,date:'2026-03-08',callTime:'06:00',wrapTime:'18:30',location:'Pinewood Studios Stage 4',status:'confirmed',dept:'Full Crew',notes:'Camera test 05:30. Catering on set.'},
    {id:'s2',title:'Brand Shoot Day 1',project:'Nova Campaign',crewNeeded:4,date:'2026-03-09',callTime:'08:00',wrapTime:'17:00',location:'ICI Studios Manchester',status:'pending',dept:'Camera + Art',notes:'Client attending. Smart dress.'},
    {id:'s3',title:'VFX Review',project:'Midnight Runner',crewNeeded:3,date:'2026-03-10',callTime:'10:00',wrapTime:'16:00',location:'Remote Zoom',status:'confirmed',dept:'Post',notes:'Bring latest cut on SSD.'},
    {id:'s4',title:'Location Scout',project:'The Last Signal',crewNeeded:2,date:'2026-03-11',callTime:'09:00',wrapTime:'15:00',location:'Bristol Docks',status:'pending',dept:'Production',notes:'Rain gear recommended.'},
  ],
  messages:[
    {id:'m1',name:'Sophia Marlowe',initials:'SM',color:'#F5A623',preview:'Can we push call time to 06:30?',time:'09:41',unread:2,msgs:[
      {id:'msg1',from:'them',text:'Morning! Just checking call time for tomorrow?',time:'09:38'},
      {id:'msg2',from:'them',text:'Can we push call time to 06:30?',time:'09:41'},
    ]},
    {id:'m2',name:'Marcus Webb',initials:'MW',color:'#00D4B4',preview:'Set build confirmed on schedule',time:'Yesterday',unread:0,msgs:[
      {id:'msg1',from:'them',text:'Set build confirmed on schedule',time:'Yesterday'},
    ]},
    {id:'m3',name:'Midnight Runner Crew',initials:'MR',color:'#A78BFA',preview:'Budget review moved to 15:00',time:'08:15',unread:1,msgs:[
      {id:'msg1',from:'me',text:'Heads up: budget review moved to 15:00 today',time:'08:15'},
      {id:'msg2',from:'them',text:'Got it, thanks!',time:'08:17'},
    ]},
    {id:'m4',name:'James Fletcher',initials:'JF',color:'#FF5C5C',preview:'Lens kit ready for tomorrow',time:'Tue',unread:0,msgs:[
      {id:'msg1',from:'them',text:'Lens kit checked and ready for tomorrow',time:'Tue'},
    ]},
  ],
  invoices:[
    {id:'i1',number:'INV-2026-001',client:'StudioFX Productions',project:'Midnight Runner',amount:48000,status:'paid',dueDate:'2026-02-28',issueDate:'2026-02-01',desc:'Director of Photography Weeks 1-4'},
    {id:'i2',number:'INV-2026-002',client:'Nova Collective',project:'Nova Campaign',amount:18500,status:'pending',dueDate:'2026-03-20',issueDate:'2026-03-01',desc:'Production Design Phase 1'},
    {id:'i3',number:'INV-2026-003',client:'Channel 4',project:'Altitude',amount:9250,status:'overdue',dueDate:'2026-02-15',issueDate:'2026-01-25',desc:'Sound Supervision Final Mix'},
    {id:'i4',number:'INV-2026-004',client:'StudioFX Productions',project:'Midnight Runner',amount:62000,status:'pending',dueDate:'2026-04-01',issueDate:'2026-03-01',desc:'Director of Photography Weeks 5-8'},
  ],
  notifications:[
    {id:'n1',type:'warning',title:'Budget Alert',body:'Midnight Runner is at 65% of budget with 8 weeks of shoot remaining.',action:'Review Budget',read:false,time:'10 min ago'},
    {id:'n2',type:'success',title:'Invoice Paid',body:'INV-2026-001 for GBP48,000 from StudioFX Productions has cleared.',action:'View Invoice',read:false,time:'2 hrs ago'},
    {id:'n3',type:'info',title:'3 Crew Available',body:'James, Aisha and Tom have confirmed availability for next month.',action:'View Crew',read:true,time:'Yesterday'},
    {id:'n4',type:'error',title:'Invoice Overdue',body:'INV-2026-003 from Channel 4 is 20 days overdue. Send a reminder now.',action:'Send Reminder',read:false,time:'2 days ago'},
  ],
};
function subscribe(fn){_listeners.push(fn);return()=>{_listeners=_listeners.filter(l=>l!==fn);};}
function getStore(){return{...store};}
function dispatch(fn){fn(store);_listeners.forEach(l=>l());}
function useStore(){const[,setTick]=useState(0);useEffect(()=>subscribe(()=>setTick(t=>t+1)),[]);return{data:getStore(),dispatch};}

function PressCard({children,style,onPress,glowColor}){
  const scale=useRef(new Animated.Value(1)).current;
  function onIn(){Animated.spring(scale,{toValue:0.97,useNativeDriver:true,speed:40,bounciness:4}).start();}
  function onOut(){Animated.spring(scale,{toValue:1,useNativeDriver:true,speed:30,bounciness:6}).start();}
  if(!onPress)return<View style={[{backgroundColor:C.bgCard,borderRadius:20,borderWidth:1,borderColor:C.border,shadowColor:C.shadow,shadowOffset:{width:0,height:6},shadowOpacity:1,shadowRadius:20,elevation:8},style]}>{children}</View>;
  return(
    <Pressable onPress={onPress} onPressIn={onIn} onPressOut={onOut}>
      <Animated.View style={[{backgroundColor:C.bgCard,borderRadius:20,borderWidth:1.5,borderColor:glowColor||C.border,shadowColor:C.shadow,shadowOffset:{width:0,height:6},shadowOpacity:1,shadowRadius:20,elevation:8,transform:[{scale}]},style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
function NotifCard({notif,onDismiss}){
  const MAP={warning:{color:C.primary,bg:'rgba(245,166,35,0.08)',icon:'!'},success:{color:C.success,bg:'rgba(74,222,128,0.08)',icon:'c'},info:{color:C.accent,bg:'rgba(0,212,180,0.08)',icon:'i'},error:{color:C.punch,bg:'rgba(255,92,92,0.08)',icon:'x'}};
  const t=MAP[notif.type]||MAP.info;
  return(
    <View style={{backgroundColor:t.bg,borderRadius:16,borderLeftWidth:3.5,borderLeftColor:t.color,marginBottom:10,flexDirection:'row'}}>
      <View style={{flex:1,padding:14}}>
        <View style={{flexDirection:'row',alignItems:'center',marginBottom:4}}>
          <View style={{width:20,height:20,borderRadius:10,backgroundColor:t.color,alignItems:'center',justifyContent:'center',marginRight:8}}>
            <Text style={{color:C.inkDark,fontSize:11,fontWeight:'900'}}>{t.icon}</Text>
          </View>
          <Text style={[TY.h4,{color:C.ink,flex:1}]}>{notif.title}</Text>
          {!notif.read&&<View style={{width:7,height:7,borderRadius:4,backgroundColor:t.color}}/>}
        </View>
        <Text style={[TY.bodyMd,{color:C.inkSub,marginBottom:8,marginLeft:28}]}>{notif.body}</Text>
        <View style={{flexDirection:'row',alignItems:'center',marginLeft:28}}>
          <Text style={{color:t.color,...TY.micro,fontWeight:'700'}}>{notif.action}</Text>
          <Text style={{color:t.color,fontSize:11,marginLeft:3}}>-></Text>
        </View>
        <Text style={[TY.micro,{color:C.inkFaint,marginTop:6,marginLeft:28}]}>{notif.time}</Text>
      </View>
      <TouchableOpacity onPress={onDismiss} style={{padding:14,justifyContent:'flex-start'}}>
        <View style={{width:24,height:24,borderRadius:12,backgroundColor:C.bgHighlight,alignItems:'center',justifyContent:'center'}}>
          <Text style={{color:C.inkSub,fontSize:14,lineHeight:16}}>x</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}
function Avatar({initials,color,size=44,style}){
  return(
    <View style={[{width:size,height:size,borderRadius:size/2,backgroundColor:color+'22',borderWidth:2,borderColor:color+'66',alignItems:'center',justifyContent:'center'},style]}>
      <Text style={{color,fontSize:size*0.34,fontWeight:'900',letterSpacing:-0.5}}>{initials}</Text>
    </View>
  );
}
function AvatarStack({members,max=4,size=34}){
  const shown=members.slice(0,max); const extra=members.length-max;
  return(
    <View style={{flexDirection:'row'}}>
      {shown.map((m,i)=>(
        <View key={m.id} style={{marginLeft:i===0?0:-(size*0.35),zIndex:max-i,borderRadius:size/2,borderWidth:2,borderColor:C.bgCard}}>
          <Avatar initials={m.initials} color={m.color} size={size}/>
        </View>
      ))}
      {extra>0&&<View style={{marginLeft:-(size*0.35),width:size,height:size,borderRadius:size/2,backgroundColor:C.bgHighlight,borderWidth:2,borderColor:C.bgCard,alignItems:'center',justifyContent:'center',zIndex:0}}>
        <Text style={[TY.micro,{color:C.inkSub}]}>+{extra}</Text>
      </View>}
    </View>
  );
}
function Badge({label,color=C.primary,textColor,size='md'}){
  const tc=textColor||(color===C.primary?C.inkDark:C.ink);
  const px=size==='sm'?8:12,py=size==='sm'?3:5,fs=size==='sm'?9:10;
  return(<View style={{backgroundColor:color+'25',borderRadius:100,borderWidth:1,borderColor:color+'50',paddingHorizontal:px,paddingVertical:py}}>
    <Text style={{color,fontSize:fs,fontWeight:'700',letterSpacing:0.8,textTransform:'uppercase'}}>{label}</Text>
  </View>);
}
function SectionLabel({text,right,style}){
  return(<View style={[{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:14},style]}>
    <Text style={[TY.label,{color:C.inkSub}]}>{text}</Text>{right}
  </View>);
}
function ProgressBar({pct,color,height=6}){
  const safe=Math.min(100,Math.max(0,pct));
  return(<View style={{height,backgroundColor:C.bgHighlight,borderRadius:height/2,overflow:'hidden'}}>
    <View style={{height,width:safe+'%',backgroundColor:color,borderRadius:height/2}}/>
  </View>);
}
function StatPill({label,value,color,icon}){
  return(<View style={{backgroundColor:C.bgHighlight,borderRadius:16,padding:14,flex:1,marginHorizontal:4}}>
    {icon?<Text style={{fontSize:18,marginBottom:8}}>{icon}</Text>:null}
    <Text style={[TY.h2,{color:color||C.ink,marginBottom:4}]}>{value}</Text>
    <Text style={[TY.label,{color:C.inkSub,fontSize:9}]}>{label}</Text>
  </View>);
}
function EmptyState({title,body,onAction,actionLabel,color}){
  return(<View style={{alignItems:'center',paddingVertical:56,paddingHorizontal:28}}>
    <View style={{width:72,height:72,borderRadius:36,backgroundColor:(color||C.primary)+'18',borderWidth:2,borderColor:(color||C.primary)+'30',alignItems:'center',justifyContent:'center',marginBottom:20}}>
      <Text style={{fontSize:30,color:color||C.primary}}>o</Text>
    </View>
    <Text style={[TY.h3,{color:C.ink,textAlign:'center',marginBottom:8}]}>{title}</Text>
    <Text style={[TY.body,{color:C.inkSub,textAlign:'center',marginBottom:24,lineHeight:22}]}>{body}</Text>
    {onAction&&<TouchableOpacity onPress={onAction} style={{backgroundColor:color||C.primary,paddingHorizontal:24,paddingVertical:13,borderRadius:100,shadowColor:color||C.primary,shadowOffset:{width:0,height:4},shadowOpacity:0.4,shadowRadius:12,elevation:6}}>
      <Text style={[TY.h4,{color:C.inkDark}]}>{actionLabel}</Text>
    </TouchableOpacity>}
  </View>);
}
function Field({label,value,onChangeText,placeholder,keyboardType,multiline,lines}){
  const[focused,setFocused]=useState(false);
  return(<View style={{marginBottom:16}}>
    <Text style={[TY.label,{color:C.inkSub,marginBottom:7}]}>{label}</Text>
    <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={C.inkFaint}
      keyboardType={keyboardType||'default'} multiline={multiline} numberOfLines={lines||1}
      onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
      style={{backgroundColor:focused?C.bgElevated:C.bgHighlight,borderRadius:14,paddingHorizontal:16,paddingVertical:13,color:C.ink,fontSize:15,lineHeight:21,borderWidth:1.5,borderColor:focused?C.primary:C.border,minHeight:multiline?90:50}}/>
  </View>);
}
function StatusPicker({options,value,onChange,activeColor}){
  return(<View style={{marginBottom:16}}>
    <Text style={[TY.label,{color:C.inkSub,marginBottom:8}]}>Status</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {options.map(s=>{const on=value===s;return(
        <TouchableOpacity key={s} onPress={()=>onChange(s)} style={{backgroundColor:on?(activeColor||C.primary):C.bgHighlight,borderRadius:100,paddingHorizontal:16,paddingVertical:9,marginRight:8,borderWidth:1.5,borderColor:on?(activeColor||C.primary):C.border}}>
          <Text style={[TY.caption,{color:on?C.inkDark:C.inkSub,fontWeight:'700'}]}>{s==='onleave'?'On Leave':s.charAt(0).toUpperCase()+s.slice(1)}</Text>
        </TouchableOpacity>
      );})}
    </ScrollView>
  </View>);
}
function PrimaryBtn({label,onPress,color,disabled,style}){
  const c=color||C.primary;
  return(<TouchableOpacity onPress={onPress} disabled={disabled} style={[{backgroundColor:disabled?C.bgHighlight:c,borderRadius:100,paddingVertical:16,alignItems:'center',shadowColor:c,shadowOffset:{width:0,height:6},shadowOpacity:disabled?0:0.4,shadowRadius:16,elevation:8,opacity:disabled?0.5:1},style]}>
    <Text style={[TY.h4,{color:disabled?C.inkSub:C.inkDark,fontWeight:'700'}]}>{label}</Text>
  </TouchableOpacity>);
}
function Sheet({visible,onClose,title,children}){
  return(<Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
    <Pressable style={{flex:1,backgroundColor:C.overlay,justifyContent:'flex-end'}} onPress={onClose}>
      <Pressable onPress={()=>{}} style={{backgroundColor:C.bgCard,borderTopLeftRadius:28,borderTopRightRadius:28,paddingBottom:isIOS?36:24,maxHeight:'92%'}}>
        <View style={{alignItems:'center',paddingTop:12,paddingBottom:4}}>
          <View style={{width:44,height:4,backgroundColor:C.border,borderRadius:2}}/>
        </View>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:24,paddingVertical:16,borderBottomWidth:1,borderBottomColor:C.border}}>
          <Text style={[TY.h2,{color:C.ink}]}>{title}</Text>
          <TouchableOpacity onPress={onClose} style={{width:32,height:32,borderRadius:16,backgroundColor:C.bgHighlight,alignItems:'center',justifyContent:'center'}}>
            <Text style={{color:C.inkSub,fontSize:18,lineHeight:22}}>x</Text>
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView behavior={isIOS?'padding':undefined}>
          <ScrollView contentContainerStyle={{padding:24}} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
            {children}
          </ScrollView>
        </KeyboardAvoidingView>
      </Pressable>
    </Pressable>
  </Modal>);
}
function Header({title,subtitle,right}){
  return(<View style={{paddingHorizontal:20,paddingTop:8,paddingBottom:18}}>
    {subtitle?<Text style={[TY.label,{color:C.inkSub,marginBottom:5}]}>{subtitle}</Text>:null}
    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
      <Text style={[TY.h1,{color:C.ink,flex:1}]}>{title}</Text>{right}
    </View>
  </View>);
}
function BackHeader({title,onBack,right}){
  return(<View style={{flexDirection:'row',alignItems:'center',paddingHorizontal:16,paddingVertical:12,borderBottomWidth:1,borderBottomColor:C.border}}>
    <TouchableOpacity onPress={onBack} style={{backgroundColor:C.bgHighlight,borderRadius:100,width:38,height:38,alignItems:'center',justifyContent:'center',marginRight:12,borderWidth:1,borderColor:C.border}}>
      <Text style={{color:C.ink,fontSize:17,fontWeight:'600',lineHeight:22}}>{'<'}</Text>
    </TouchableOpacity>
    <Text style={[TY.h3,{color:C.ink,flex:1}]} numberOfLines={1}>{title}</Text>{right}
  </View>);
}
function statusColor(s){return{active:C.success,confirmed:C.success,paid:C.success,pending:C.primary,onleave:C.purple,completed:C.accent,overdue:C.punch,cancelled:C.punch}[s]||C.inkSub;}
function statusLabel(s){return{active:'Active',confirmed:'Confirmed',pending:'Pending',paid:'Paid',overdue:'Overdue',completed:'Completed',onleave:'On Leave',cancelled:'Cancelled'}[s]||s;}
function fmtGBP(n){return 'GBP'+(n>=1000?(n/1000).toFixed(n%1000===0?0:1)+'k':n.toLocaleString());}
function FAB({onPress,label,color}){
  const scale=useRef(new Animated.Value(1)).current;
  function onIn(){Animated.spring(scale,{toValue:0.93,useNativeDriver:true,speed:40,bounciness:4}).start();}
  function onOut(){Animated.spring(scale,{toValue:1,useNativeDriver:true,speed:30,bounciness:8}).start();}
  return(<Pressable onPress={onPress} onPressIn={onIn} onPressOut={onOut} style={{position:'absolute',bottom:30,right:20,zIndex:10}}>
    <Animated.View style={{flexDirection:'row',alignItems:'center',backgroundColor:color||C.primary,paddingHorizontal:22,paddingVertical:15,borderRadius:100,shadowColor:color||C.primary,shadowOffset:{width:0,height:8},shadowOpacity:0.5,shadowRadius:20,elevation:14,transform:[{scale}]}}>
      <Text style={{color:C.inkDark,fontSize:20,fontWeight:'900',marginRight:8,lineHeight:24}}>+</Text>
      <Text style={[TY.h4,{color:C.inkDark}]}>{label}</Text>
    </Animated.View>
  </Pressable>);
}

function HomeScreen({navigate}){
  const{data,dispatch}=useStore();
  const[refreshing,setRefreshing]=useState(false);
  const activeProjects=data.projects.filter(p=>p.status==='active');
  const crewActive=data.crew.filter(c=>c.status==='active');
  const pendingInvTotal=data.invoices.filter(i=>i.status==='pending'||i.status==='overdue').reduce((a,i)=>a+i.amount,0);
  const unread=data.notifications.filter(n=>!n.read).length;
  const totalBudget=data.projects.reduce((a,p)=>a+p.budget,0);
  const totalSpent=data.projects.reduce((a,p)=>a+p.spent,0);
  const overallPct=totalBudget>0?Math.round((totalSpent/totalBudget)*100):0;
  function onRefresh(){setRefreshing(true);setTimeout(()=>setRefreshing(false),1200);}
  function dismissNotif(id){dispatch(s=>{s.notifications=s.notifications.filter(n=>n.id!==id);});}
  return(
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:120}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.primary}/>}>
        <View style={{paddingHorizontal:20,paddingTop:20,paddingBottom:28}}>
          <View style={{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'}}>
            <View style={{flex:1}}>
              <Text style={[TY.label,{color:C.primary,marginBottom:10,letterSpacing:2}]}>CREWDESK</Text>
              <Text style={[TY.hero,{color:C.ink}]}>Good morning,</Text>
              <Text style={[TY.hero,{color:C.primary,marginTop:-4}]}>Ashtyn.</Text>
              <Text style={[TY.body,{color:C.inkSub,marginTop:10}]}>{activeProjects.length} active project{activeProjects.length!==1?'s':''} · {crewActive.length} crew on call</Text>
            </View>
            <TouchableOpacity onPress={()=>navigate('More')} style={{width:44,height:44,borderRadius:22,backgroundColor:C.bgElevated,borderWidth:1.5,borderColor:C.primary+'40',alignItems:'center',justifyContent:'center',marginTop:4}}>
              <Text style={{color:C.primary,fontSize:18,fontWeight:'700'}}>A</Text>
              {unread>0&&<View style={{position:'absolute',top:-2,right:-2,backgroundColor:C.punch,width:14,height:14,borderRadius:7,alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:C.bg}}>
                <Text style={{color:C.ink,fontSize:8,fontWeight:'900'}}>{unread}</Text>
              </View>}
            </TouchableOpacity>
          </View>
        </View>
        <View style={{paddingHorizontal:20,marginBottom:28}}>
          <PressCard style={{padding:20}}>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-end',marginBottom:14}}>
              <View>
                <Text style={[TY.label,{color:C.inkSub,marginBottom:4}]}>Portfolio Burn</Text>
                <Text style={[TY.h1,{color:C.ink}]}>{fmtGBP(totalSpent)}</Text>
                <Text style={[TY.bodyMd,{color:C.inkSub,marginTop:2}]}>of {fmtGBP(totalBudget)} total budget</Text>
              </View>
              <Text style={[TY.hero,{color:overallPct>80?C.punch:overallPct>60?C.primary:C.success,fontSize:40}]}>{overallPct}<Text style={{fontSize:22}}>%</Text></Text>
            </View>
            <ProgressBar pct={overallPct} color={overallPct>80?C.punch:overallPct>60?C.primary:C.success} height={8}/>
            <View style={{flexDirection:'row',marginTop:12}}>
              <Text style={[TY.caption,{color:C.success}]}>{fmtGBP(totalBudget-totalSpent)} remaining</Text>
              <Text style={[TY.caption,{color:C.inkSub,marginLeft:'auto'}]}>{data.projects.length} projects</Text>
            </View>
          </PressCard>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:16,paddingBottom:4}}>
          {[
            {label:'ACTIVE',val:activeProjects.length,color:C.accent,bg:C.accentT,onPress:()=>navigate('Projects')},
            {label:'CREW',val:crewActive.length,color:C.success,bg:C.successT,onPress:()=>navigate('Crew')},
            {label:'OUTSTANDING',val:fmtGBP(pendingInvTotal),color:C.punch,bg:C.punchT,onPress:()=>navigate('Invoices')},
            {label:'ALERTS',val:unread,color:C.purple,bg:C.purpleT,onPress:()=>navigate('More')},
          ].map(k=>(
            <TouchableOpacity key={k.label} onPress={k.onPress} activeOpacity={0.8}
              style={{backgroundColor:k.bg,borderRadius:18,padding:16,marginRight:10,minWidth:120,borderWidth:1,borderColor:k.color+'30'}}>
              <Text style={[TY.hero,{color:k.color,fontSize:30,lineHeight:36}]}>{k.val}</Text>
              <Text style={[TY.label,{color:k.color,fontSize:9,marginTop:4}]}>{k.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {data.notifications.length>0&&(
          <View style={{paddingHorizontal:20,marginTop:28}}>
            <SectionLabel text="Alerts and Updates" right={<TouchableOpacity onPress={()=>dispatch(s=>{s.notifications.forEach(n=>n.read=true);})}>
              <Text style={[TY.caption,{color:C.primary}]}>Clear all</Text>
            </TouchableOpacity>}/>
            {data.notifications.map(n=>(<NotifCard key={n.id} notif={n} onDismiss={()=>dismissNotif(n.id)}/>))}
          </View>
        )}
        <View style={{paddingHorizontal:20,marginTop:24}}>
          <SectionLabel text="Active Projects" right={<TouchableOpacity onPress={()=>navigate('Projects')}>
            <Text style={[TY.caption,{color:C.primary}]}>See all</Text>
          </TouchableOpacity>}/>
          {activeProjects.map(p=>{
            const pct=p.budget>0?Math.round((p.spent/p.budget)*100):0;
            const bc=pct>85?C.punch:pct>65?C.primary:C.success;
            const projCrew=data.crew.filter(c=>c.projects&&c.projects.includes(p.id));
            return(
              <PressCard key={p.id} style={{marginBottom:14}} onPress={()=>navigate('Projects')} glowColor={p.color}>
                <View style={{width:4,position:'absolute',top:0,bottom:0,left:0,backgroundColor:p.color,borderTopLeftRadius:20,borderBottomLeftRadius:20}}/>
                <View style={{padding:20,paddingLeft:18}}>
                  <View style={{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between',marginBottom:12}}>
                    <View style={{flex:1,marginRight:10}}>
                      <Text style={[TY.bodyMd,{color:p.color,fontWeight:'700',marginBottom:2}]}>{p.subtitle}</Text>
                      <Text style={[TY.h3,{color:C.ink}]}>{p.title}</Text>
                      <Text style={[TY.caption,{color:C.inkSub,marginTop:2}]}>{p.client}</Text>
                    </View>
                    <Badge label={statusLabel(p.status)} color={statusColor(p.status)}/>
                  </View>
                  <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:7}}>
                    <Text style={[TY.caption,{color:C.inkSub}]}>Budget used</Text>
                    <Text style={[TY.mono,{color:bc,fontSize:12}]}>{pct}% · {fmtGBP(p.spent)} / {fmtGBP(p.budget)}</Text>
                  </View>
                  <ProgressBar pct={pct} color={bc} height={7}/>
                  <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginTop:12}}>
                    {projCrew.length>0&&<AvatarStack members={projCrew} max={4} size={28}/>}
                    <Text style={[TY.caption,{color:C.inkSub,marginLeft:'auto'}]}>End {p.endDate}</Text>
                  </View>
                </View>
              </PressCard>
            );
          })}
        </View>
        {data.shifts.length>0&&(
          <View style={{paddingHorizontal:20,marginTop:8}}>
            <SectionLabel text="Next Shift" right={<TouchableOpacity onPress={()=>navigate('Schedule')}>
              <Text style={[TY.caption,{color:C.accent}]}>Schedule</Text>
            </TouchableOpacity>}/>
            {data.shifts.slice(0,1).map(s=>(
              <PressCard key={s.id} style={{padding:20}} onPress={()=>navigate('Schedule')} glowColor={C.accent}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                  <View style={{flex:1}}>
                    <Text style={[TY.h3,{color:C.ink}]}>{s.title}</Text>
                    <Text style={[TY.bodyMd,{color:C.accent,fontWeight:'600',marginTop:2}]}>{s.project}</Text>
                  </View>
                  <Badge label={statusLabel(s.status)} color={statusColor(s.status)}/>
                </View>
                <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                  {[
                    {v:'Call '+s.callTime,c:C.accent,bg:C.accentT},
                    {v:s.location,c:C.inkSub,bg:C.bgHighlight},
                    {v:s.crewNeeded+' crew',c:C.inkSub,bg:C.bgHighlight},
                  ].map(function(tag,ti){return(
                    <View key={ti} style={{backgroundColor:tag.bg,borderRadius:8,paddingHorizontal:10,paddingVertical:5,marginRight:7,marginBottom:6}}>
                      <Text style={[TY.micro,{color:tag.c}]}>{tag.v}</Text>
                    </View>
                  );})}
                </View>
              </PressCard>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function ProjectsScreen(){
  const{data,dispatch}=useStore();
  const[showForm,setShowForm]=useState(false);
  const[editing,setEditing]=useState(null);
  const[detail,setDetail]=useState(null);
  const[filter,setFilter]=useState('all');
  const PCOLS=[C.primary,C.accent,C.purple,C.success,C.punch,C.blue];
  const blank={title:'',subtitle:'',client:'',status:'active',budget:'',spent:'',crew:'',startDate:'',endDate:'',location:'',desc:'',color:C.primary};
  const[form,setForm]=useState(blank);
  const filtered=data.projects.filter(p=>filter==='all'||p.status===filter);
  function openNew(){setForm({...blank,color:PCOLS[data.projects.length%PCOLS.length]});setEditing(null);setShowForm(true);}
  function openEdit(p){setForm({...p,budget:String(p.budget),spent:String(p.spent),crew:String(p.crew)});setEditing(p.id);setShowForm(true);}
  function save(){
    if(!form.title.trim()){Alert.alert('Required','Project title is required');return;}
    const proj={...form,budget:parseFloat(form.budget)||0,spent:parseFloat(form.spent)||0,crew:parseInt(form.crew)||0};
    if(editing){dispatch(s=>{const i=s.projects.findIndex(p=>p.id===editing);if(i>-1)s.projects[i]={...s.projects[i],...proj};});}
    else{dispatch(s=>{s.projects.push({...proj,id:'p'+Date.now()});});}
    setShowForm(false);
  }
  function del(id){
    Alert.alert('Delete Project','Permanently delete this project?',
      [{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:function(){dispatch(s=>{s.projects=s.projects.filter(p=>p.id!==id);});setDetail(null);}}]);
  }
  if(detail){
    const p=data.projects.find(x=>x.id===detail);
    if(!p){setDetail(null);return null;}
    const pct=p.budget>0?Math.round((p.spent/p.budget)*100):0;
    const bc=pct>85?C.punch:pct>65?C.primary:C.success;
    const projCrew=data.crew.filter(c=>c.projects&&c.projects.includes(p.id));
    return(
      <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
        <BackHeader title={p.title} onBack={()=>setDetail(null)} right={<View style={{flexDirection:'row'}}>
          <TouchableOpacity onPress={()=>{setDetail(null);openEdit(p);}} style={{backgroundColor:C.bgHighlight,borderRadius:100,paddingHorizontal:14,paddingVertical:7,marginRight:8,borderWidth:1,borderColor:C.border}}>
            <Text style={[TY.micro,{color:C.primary,fontWeight:'700'}]}>EDIT</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>del(p.id)} style={{backgroundColor:C.punchT,borderRadius:100,paddingHorizontal:14,paddingVertical:7,borderWidth:1,borderColor:C.punch+'40'}}>
            <Text style={[TY.micro,{color:C.punch,fontWeight:'700'}]}>DELETE</Text>
          </TouchableOpacity>
        </View>}/>
        <ScrollView contentContainerStyle={{padding:20,paddingBottom:60}} showsVerticalScrollIndicator={false}>
          <PressCard style={{padding:22,marginBottom:16,overflow:'hidden'}}>
            <View style={{position:'absolute',top:0,right:0,width:120,height:120,borderRadius:60,backgroundColor:p.color,opacity:0.07,transform:[{translateX:30},{translateY:-30}]}}/>
            <Badge label={statusLabel(p.status)} color={statusColor(p.status)}/>
            <Text style={[TY.bodyMd,{color:p.color,fontWeight:'700',marginTop:14,marginBottom:4}]}>{p.subtitle}</Text>
            <Text style={[TY.h1,{color:C.ink}]}>{p.title}</Text>
            <Text style={[TY.body,{color:C.inkSub,marginTop:4}]}>{p.client}</Text>
            <Text style={[TY.bodyMd,{color:C.inkSub,marginTop:14,lineHeight:22}]}>{p.desc}</Text>
          </PressCard>
          <PressCard style={{padding:20,marginBottom:12}}>
            <Text style={[TY.label,{color:C.inkSub,marginBottom:14}]}>Budget Health</Text>
            <View style={{flexDirection:'row',marginBottom:10}}>
              <StatPill label="TOTAL BUDGET" value={fmtGBP(p.budget)} color={C.ink}/>
              <StatPill label="SPENT" value={fmtGBP(p.spent)} color={bc}/>
              <StatPill label="REMAINING" value={fmtGBP(p.budget-p.spent)} color={C.success}/>
            </View>
            <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:8}}>
              <Text style={[TY.body,{color:C.ink,fontWeight:'600'}]}>{pct}% used</Text>
              {pct>80&&<Text style={[TY.caption,{color:C.punch,fontWeight:'700'}]}>Over-run risk</Text>}
            </View>
            <ProgressBar pct={pct} color={bc} height={10}/>
          </PressCard>
          {projCrew.length>0&&(
            <PressCard style={{padding:20,marginBottom:12}}>
              <Text style={[TY.label,{color:C.inkSub,marginBottom:14}]}>Crew ({projCrew.length})</Text>
              {projCrew.map((c,i)=>(
                <View key={c.id} style={{flexDirection:'row',alignItems:'center',paddingVertical:10,borderBottomWidth:i<projCrew.length-1?1:0,borderBottomColor:C.border}}>
                  <Avatar initials={c.initials} color={c.color} size={38}/>
                  <View style={{flex:1,marginLeft:12}}>
                    <Text style={[TY.h4,{color:C.ink}]}>{c.name}</Text>
                    <Text style={[TY.caption,{color:C.inkSub}]}>{c.role}</Text>
                  </View>
                  <Text style={[TY.caption,{color:C.primary,fontWeight:'700'}]}>{fmtGBP(c.rate)}/day</Text>
                </View>
              ))}
            </PressCard>
          )}
          <PressCard style={{padding:20}}>
            {[{label:'Location',value:p.location},{label:'Start Date',value:p.startDate},{label:'End Date',value:p.endDate},{label:'Crew Count',value:String(p.crew)}].map(row=>(
              <View key={row.label} style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:12,borderBottomWidth:1,borderBottomColor:C.border}}>
                <Text style={[TY.body,{color:C.inkSub}]}>{row.label}</Text>
                <Text style={[TY.body,{color:C.ink,fontWeight:'600'}]}>{row.value}</Text>
              </View>
            ))}
          </PressCard>
        </ScrollView>
      </SafeAreaView>
    );
  }
  return(
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      <Header title="Projects" subtitle="PRODUCTIONS" right={<TouchableOpacity onPress={openNew} style={{backgroundColor:C.primary,borderRadius:100,paddingHorizontal:18,paddingVertical:9,shadowColor:C.primary,shadowOffset:{width:0,height:4},shadowOpacity:0.4,shadowRadius:10,elevation:6}}>
        <Text style={[TY.micro,{color:C.inkDark,fontWeight:'900'}]}>+ NEW</Text>
      </TouchableOpacity>}/>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:20,paddingBottom:14}}>
        {['all','active','pending','completed'].map(f=>(
          <TouchableOpacity key={f} onPress={()=>setFilter(f)} style={{backgroundColor:filter===f?C.primary:C.bgHighlight,borderRadius:100,paddingHorizontal:16,paddingVertical:9,marginRight:8,borderWidth:1.5,borderColor:filter===f?C.primary:C.border}}>
            <Text style={[TY.caption,{color:filter===f?C.inkDark:C.inkSub,fontWeight:'700'}]}>{f.charAt(0).toUpperCase()+f.slice(1)}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList data={filtered} keyExtractor={i=>i.id} contentContainerStyle={{paddingHorizontal:20,paddingBottom:100}} showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState title="No projects" body="Create your first production project." onAction={openNew} actionLabel="Create Project"/>}
        renderItem={({item:p})=>{
          const pct=p.budget>0?Math.round((p.spent/p.budget)*100):0;
          const bc=pct>85?C.punch:pct>65?C.primary:C.success;
          return(
            <PressCard style={{marginBottom:14}} onPress={()=>setDetail(p.id)} glowColor={p.color}>
              <View style={{width:4,position:'absolute',top:0,bottom:0,left:0,backgroundColor:p.color,borderTopLeftRadius:20,borderBottomLeftRadius:20}}/>
              <View style={{padding:18,paddingLeft:20}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                  <View style={{flex:1,marginRight:10}}>
                    <Text style={[TY.micro,{color:p.color,marginBottom:4}]}>{p.subtitle||''}</Text>
                    <Text style={[TY.h3,{color:C.ink}]}>{p.title}</Text>
                    <Text style={[TY.caption,{color:C.inkSub,marginTop:3}]}>{p.client}</Text>
                  </View>
                  <Badge label={statusLabel(p.status)} color={statusColor(p.status)}/>
                </View>
                <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:7}}>
                  <Text style={[TY.caption,{color:C.inkSub}]}>Budget burn</Text>
                  <Text style={[TY.mono,{color:bc,fontSize:12}]}>{pct}%</Text>
                </View>
                <ProgressBar pct={pct} color={bc} height={6}/>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:12}}>
                  <Text style={[TY.caption,{color:C.inkSub}]}>{fmtGBP(p.spent)} / {fmtGBP(p.budget)}</Text>
                  <Text style={[TY.caption,{color:C.inkSub}]}>{p.crew} crew · {p.location}</Text>
                </View>
              </View>
            </PressCard>
          );
        }}/>
      <Sheet visible={showForm} onClose={()=>setShowForm(false)} title={editing?'Edit Project':'New Project'}>
        <Field label="Project Title" value={form.title} onChangeText={v=>setForm(f=>({...f,title:v}))} placeholder="e.g. Midnight Runner"/>
        <Field label="Type / Genre" value={form.subtitle} onChangeText={v=>setForm(f=>({...f,subtitle:v}))} placeholder="e.g. Feature Film"/>
        <Field label="Client" value={form.client} onChangeText={v=>setForm(f=>({...f,client:v}))} placeholder="e.g. StudioFX Productions"/>
        <Field label="Location" value={form.location} onChangeText={v=>setForm(f=>({...f,location:v}))} placeholder="e.g. London, UK"/>
        <StatusPicker options={['active','pending','completed']} value={form.status} onChange={v=>setForm(f=>({...f,status:v}))}/>
        <Field label="Total Budget (GBP)" value={form.budget} onChangeText={v=>setForm(f=>({...f,budget:v}))} placeholder="0" keyboardType="numeric"/>
        <Field label="Spent to Date (GBP)" value={form.spent} onChangeText={v=>setForm(f=>({...f,spent:v}))} placeholder="0" keyboardType="numeric"/>
        <Field label="Crew Count" value={form.crew} onChangeText={v=>setForm(f=>({...f,crew:v}))} placeholder="0" keyboardType="numeric"/>
        <Field label="Start Date" value={form.startDate} onChangeText={v=>setForm(f=>({...f,startDate:v}))} placeholder="YYYY-MM-DD"/>
        <Field label="End Date" value={form.endDate} onChangeText={v=>setForm(f=>({...f,endDate:v}))} placeholder="YYYY-MM-DD"/>
        <Field label="Description" value={form.desc} onChangeText={v=>setForm(f=>({...f,desc:v}))} placeholder="Brief overview..." multiline lines={3}/>
        <View style={{marginBottom:20}}>
          <Text style={[TY.label,{color:C.inkSub,marginBottom:10}]}>Accent Colour</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {PCOLS.map(col=>(
              <TouchableOpacity key={col} onPress={()=>setForm(f=>({...f,color:col}))} style={{width:36,height:36,borderRadius:18,backgroundColor:col,marginRight:10,borderWidth:3,borderColor:form.color===col?C.ink:col}}/>
            ))}
          </ScrollView>
        </View>
        <PrimaryBtn label={editing?'Save Changes':'Create Project'} onPress={save}/>
        {editing&&<TouchableOpacity onPress={()=>{setShowForm(false);del(editing);}} style={{alignItems:'center',marginTop:16}}>
          <Text style={[TY.body,{color:C.punch}]}>Delete this project</Text>
        </TouchableOpacity>}
      </Sheet>
    </SafeAreaView>
  );
}

function CrewScreen(){
  const{data,dispatch}=useStore();
  const[showForm,setShowForm]=useState(false);
  const[editing,setEditing]=useState(null);
  const[detail,setDetail]=useState(null);
  const[filter,setFilter]=useState('all');
  const CCOLS=[C.primary,C.accent,C.purple,C.punch,C.success,C.blue];
  const blank={name:'',role:'',dept:'',rate:'',status:'active',phone:'',email:'',location:'',skills:'',projects:[]};
  const[form,setForm]=useState(blank);
  const DEPTS=['all','Camera','Art','Sound','Electrical','Post','Production'];
  const filtered=data.crew.filter(c=>filter==='all'||c.dept===filter);
  function openNew(){setForm(blank);setEditing(null);setShowForm(true);}
  function openEdit(c){setForm({...c,rate:String(c.rate),skills:Array.isArray(c.skills)?c.skills.join(', '):c.skills});setEditing(c.id);setShowForm(true);}
  function save(){
    if(!form.name.trim()){Alert.alert('Required','Name is required');return;}
    const member={...form,rate:parseFloat(form.rate)||0,skills:form.skills.split(',').map(s=>s.trim()).filter(Boolean)};
    if(editing){dispatch(s=>{const i=s.crew.findIndex(c=>c.id===editing);if(i>-1)s.crew[i]={...s.crew[i],...member};});}
    else{const initials=form.name.split(' ').map(n=>n[0]).join('').toUpperCase().slice(0,2);const color=CCOLS[data.crew.length%CCOLS.length];dispatch(s=>{s.crew.push({...member,id:'c'+Date.now(),initials,color,projects:[]});});}
    setShowForm(false);
  }
  function del(id){
    Alert.alert('Remove Crew Member','Remove from CrewDesk?',
      [{text:'Cancel',style:'cancel'},{text:'Remove',style:'destructive',onPress:function(){dispatch(s=>{s.crew=s.crew.filter(c=>c.id!==id);});setDetail(null);}}]);
  }
  if(detail){
    const c=data.crew.find(x=>x.id===detail);
    if(!c){setDetail(null);return null;}
    const crewProjects=data.projects.filter(p=>c.projects&&c.projects.includes(p.id));
    return(
      <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
        <BackHeader title="Crew Profile" onBack={()=>setDetail(null)} right={<View style={{flexDirection:'row'}}>
          <TouchableOpacity onPress={()=>{setDetail(null);openEdit(c);}} style={{backgroundColor:C.bgHighlight,borderRadius:100,paddingHorizontal:14,paddingVertical:7,marginRight:8,borderWidth:1,borderColor:C.border}}>
            <Text style={[TY.micro,{color:C.primary,fontWeight:'700'}]}>EDIT</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=>del(c.id)} style={{backgroundColor:C.punchT,borderRadius:100,paddingHorizontal:14,paddingVertical:7,borderWidth:1,borderColor:C.punch+'40'}}>
            <Text style={[TY.micro,{color:C.punch,fontWeight:'700'}]}>REMOVE</Text>
          </TouchableOpacity>
        </View>}/>
        <ScrollView contentContainerStyle={{padding:20,paddingBottom:60}} showsVerticalScrollIndicator={false}>
          <PressCard style={{padding:24,marginBottom:16,alignItems:'center',overflow:'hidden'}}>
            <View style={{position:'absolute',top:-20,right:-20,width:120,height:120,borderRadius:60,backgroundColor:c.color,opacity:0.06}}/>
            <Avatar initials={c.initials} color={c.color} size={80}/>
            <Text style={[TY.h1,{color:C.ink,marginTop:16,textAlign:'center'}]}>{c.name}</Text>
            <Text style={[TY.body,{color:c.color,fontWeight:'700',marginTop:4}]}>{c.role}</Text>
            <View style={{marginTop:12}}><Badge label={statusLabel(c.status)} color={statusColor(c.status)}/></View>
          </PressCard>
          <View style={{flexDirection:'row',marginBottom:12}}>
            <StatPill label="DEPARTMENT" value={c.dept} color={C.accent}/>
            <StatPill label="DAY RATE" value={fmtGBP(c.rate)} color={C.primary}/>
          </View>
          <PressCard style={{padding:20,marginBottom:12}}>
            <Text style={[TY.label,{color:C.inkSub,marginBottom:14}]}>Contact Details</Text>
            {[{label:'Phone',value:c.phone},{label:'Email',value:c.email},{label:'Base',value:c.location}].map(row=>(
              <View key={row.label} style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:12,borderBottomWidth:1,borderBottomColor:C.border}}>
                <Text style={[TY.body,{color:C.inkSub}]}>{row.label}</Text>
                <Text style={[TY.body,{color:C.ink,fontWeight:'600',flex:1,textAlign:'right'}]}>{row.value}</Text>
              </View>
            ))}
          </PressCard>
          {c.skills&&c.skills.length>0&&(
            <PressCard style={{padding:20,marginBottom:12}}>
              <Text style={[TY.label,{color:C.inkSub,marginBottom:14}]}>Skills and Equipment</Text>
              <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                {c.skills.map(sk=>(
                  <View key={sk} style={{backgroundColor:C.bgHighlight,borderRadius:100,paddingHorizontal:12,paddingVertical:7,marginRight:8,marginBottom:8,borderWidth:1,borderColor:C.border}}>
                    <Text style={[TY.caption,{color:C.inkSub}]}>{sk}</Text>
                  </View>
                ))}
              </View>
            </PressCard>
          )}
          {crewProjects.length>0&&(
            <PressCard style={{padding:20}}>
              <Text style={[TY.label,{color:C.inkSub,marginBottom:14}]}>Active Projects</Text>
              {crewProjects.map((p,i)=>(
                <View key={p.id} style={{flexDirection:'row',alignItems:'center',paddingVertical:10,borderBottomWidth:i<crewProjects.length-1?1:0,borderBottomColor:C.border}}>
                  <View style={{width:10,height:10,borderRadius:5,backgroundColor:p.color,marginRight:12}}/>
                  <View style={{flex:1}}>
                    <Text style={[TY.h4,{color:C.ink}]}>{p.title}</Text>
                    <Text style={[TY.caption,{color:C.inkSub}]}>{p.client}</Text>
                  </View>
                  <Badge label={statusLabel(p.status)} color={statusColor(p.status)} size="sm"/>
                </View>
              ))}
            </PressCard>
          )}
        </ScrollView>
      </SafeAreaView>
    );
  }
  return(
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      <Header title="Crew" subtitle="TEAM ROSTER" right={<TouchableOpacity onPress={openNew} style={{backgroundColor:C.accent,borderRadius:100,paddingHorizontal:18,paddingVertical:9,shadowColor:C.accent,shadowOffset:{width:0,height:4},shadowOpacity:0.4,shadowRadius:10,elevation:6}}>
        <Text style={[TY.micro,{color:C.inkDark,fontWeight:'900'}]}>+ ADD</Text>
      </TouchableOpacity>}/>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:20,paddingBottom:14}}>
        {DEPTS.map(d=>(
          <TouchableOpacity key={d} onPress={()=>setFilter(d)} style={{backgroundColor:filter===d?C.accent:C.bgHighlight,borderRadius:100,paddingHorizontal:14,paddingVertical:9,marginRight:8,borderWidth:1.5,borderColor:filter===d?C.accent:C.border}}>
            <Text style={[TY.caption,{color:filter===d?C.inkDark:C.inkSub,fontWeight:'700'}]}>{d}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      <FlatList data={filtered} keyExtractor={i=>i.id} contentContainerStyle={{paddingHorizontal:20,paddingBottom:100}} showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState title="No crew members" body="Build your production team by adding crew with roles, rates and contact details." onAction={openNew} actionLabel="Add First Member" color={C.accent}/>}
        renderItem={({item:c})=>(
          <PressCard style={{marginBottom:12}} onPress={()=>setDetail(c.id)} glowColor={c.color}>
            <View style={{padding:16}}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Avatar initials={c.initials} color={c.color} size={50}/>
                <View style={{flex:1,marginLeft:14}}>
                  <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:3}}>
                    <Text style={[TY.h3,{color:C.ink,flex:1,marginRight:8}]}>{c.name}</Text>
                    <Badge label={statusLabel(c.status)} color={statusColor(c.status)} size="sm"/>
                  </View>
                  <Text style={[TY.bodyMd,{color:C.inkSub}]}>{c.role}</Text>
                  <View style={{flexDirection:'row',marginTop:6,alignItems:'center'}}>
                    <View style={{backgroundColor:C.bgHighlight,borderRadius:6,paddingHorizontal:8,paddingVertical:3,marginRight:8}}>
                      <Text style={[TY.micro,{color:C.inkSub}]}>{c.dept}</Text>
                    </View>
                    <Text style={[TY.caption,{color:C.primary,fontWeight:'700'}]}>{fmtGBP(c.rate)}/day</Text>
                  </View>
                </View>
              </View>
            </View>
          </PressCard>
        )}/>
      <Sheet visible={showForm} onClose={()=>setShowForm(false)} title={editing?'Edit Crew Member':'Add Crew Member'}>
        <Field label="Full Name" value={form.name} onChangeText={v=>setForm(f=>({...f,name:v}))} placeholder="e.g. Sophia Marlowe"/>
        <Field label="Role" value={form.role} onChangeText={v=>setForm(f=>({...f,role:v}))} placeholder="e.g. Director of Photography"/>
        <Field label="Department" value={form.dept} onChangeText={v=>setForm(f=>({...f,dept:v}))} placeholder="e.g. Camera"/>
        <Field label="Day Rate (GBP)" value={form.rate} onChangeText={v=>setForm(f=>({...f,rate:v}))} placeholder="0" keyboardType="numeric"/>
        <StatusPicker options={['active','onleave','inactive']} value={form.status} onChange={v=>setForm(f=>({...f,status:v}))} activeColor={C.accent}/>
        <Field label="Phone" value={form.phone} onChangeText={v=>setForm(f=>({...f,phone:v}))} placeholder="+44 7700 000000" keyboardType="phone-pad"/>
        <Field label="Email" value={form.email} onChangeText={v=>setForm(f=>({...f,email:v}))} placeholder="email@example.com" keyboardType="email-address"/>
        <Field label="Base Location" value={form.location} onChangeText={v=>setForm(f=>({...f,location:v}))} placeholder="e.g. London"/>
        <Field label="Skills (comma-separated)" value={form.skills} onChangeText={v=>setForm(f=>({...f,skills:v}))} placeholder="e.g. Arri Alexa, Drone, Lighting"/>
        <PrimaryBtn label={editing?'Save Changes':'Add to Crew'} onPress={save} color={C.accent}/>
        {editing&&<TouchableOpacity onPress={()=>{setShowForm(false);del(editing);}} style={{alignItems:'center',marginTop:16}}>
          <Text style={[TY.body,{color:C.punch}]}>Remove from crew</Text>
        </TouchableOpacity>}
      </Sheet>
    </SafeAreaView>
  );
}

function ScheduleScreen(){
  const{data,dispatch}=useStore();
  const[showForm,setShowForm]=useState(false);
  const[editing,setEditing]=useState(null);
  const[selectedDay,setSelectedDay]=useState(0);
  const blank={title:'',project:'',date:'',callTime:'',wrapTime:'',location:'',dept:'',crewNeeded:'',status:'pending',notes:''};
  const[form,setForm]=useState(blank);
  const BASE=new Date('2026-03-08');
  const days=Array.from({length:10},(_,i)=>{const d=new Date(BASE);d.setDate(d.getDate()+i);return{label:d.toLocaleDateString('en-GB',{weekday:'short'}).toUpperCase(),num:d.getDate(),month:d.toLocaleDateString('en-GB',{month:'short'}).toUpperCase(),full:d.toISOString().slice(0,10)};});
  const selDate=days[selectedDay].full;
  const dayShifts=data.shifts.filter(s=>s.date===selDate);
  const allOther=data.shifts.filter(s=>s.date!==selDate);
  function openNew(){setForm({...blank,date:selDate});setEditing(null);setShowForm(true);}
  function openEdit(s){setForm({...s,crewNeeded:String(s.crewNeeded)});setEditing(s.id);setShowForm(true);}
  function save(){
    if(!form.title.trim()){Alert.alert('Required','Shift title is required');return;}
    const shift={...form,crewNeeded:parseInt(form.crewNeeded)||0};
    if(editing){dispatch(s=>{const i=s.shifts.findIndex(x=>x.id===editing);if(i>-1)s.shifts[i]={...s.shifts[i],...shift};});}
    else{dispatch(s=>{s.shifts.push({...shift,id:'s'+Date.now()});});}
    setShowForm(false);
  }
  function del(id){Alert.alert('Delete Shift','Remove from schedule?',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:function(){dispatch(s=>{s.shifts=s.shifts.filter(x=>x.id!==id);});}}]);}
  return(
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      <Header title="Schedule" subtitle="PRODUCTION CALENDAR" right={<TouchableOpacity onPress={openNew} style={{backgroundColor:C.accent,borderRadius:100,paddingHorizontal:18,paddingVertical:9,shadowColor:C.accent,shadowOffset:{width:0,height:4},shadowOpacity:0.4,shadowRadius:10,elevation:6}}>
        <Text style={[TY.micro,{color:C.inkDark,fontWeight:'900'}]}>+ SHIFT</Text>
      </TouchableOpacity>}/>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:16,paddingBottom:16}}>
        {days.map((d,i)=>{const has=data.shifts.some(s=>s.date===d.full);const on=i===selectedDay;return(
          <TouchableOpacity key={i} onPress={()=>setSelectedDay(i)} style={{alignItems:'center',marginRight:8,width:58,paddingVertical:14,borderRadius:18,backgroundColor:on?C.accent:C.bgCard,borderWidth:1.5,borderColor:on?C.accent:C.border}}>
            <Text style={[TY.label,{color:on?C.inkDark:C.inkSub,fontSize:9}]}>{d.label}</Text>
            <Text style={[TY.h2,{color:on?C.inkDark:C.ink,marginTop:4}]}>{d.num}</Text>
            <Text style={[TY.micro,{color:on?C.inkDark+'99':C.inkFaint,marginTop:2}]}>{d.month}</Text>
            {has&&<View style={{width:6,height:6,borderRadius:3,backgroundColor:on?C.inkDark:C.accent,marginTop:5}}/>}
          </TouchableOpacity>
        );})}
      </ScrollView>
      <ScrollView contentContainerStyle={{paddingHorizontal:20,paddingBottom:120}} showsVerticalScrollIndicator={false}>
        <SectionLabel text={dayShifts.length+' shift'+(dayShifts.length!==1?'s':'')+' on '+selDate}/>
        {dayShifts.length===0?(
          <PressCard style={{padding:32,alignItems:'center'}}>
            <Text style={[TY.h3,{color:C.ink,marginBottom:6}]}>Nothing scheduled</Text>
            <Text style={[TY.body,{color:C.inkSub,textAlign:'center',marginBottom:20}]}>No shifts on this day yet.</Text>
            <TouchableOpacity onPress={openNew} style={{backgroundColor:C.accent,borderRadius:100,paddingHorizontal:22,paddingVertical:12,shadowColor:C.accent,shadowOffset:{width:0,height:4},shadowOpacity:0.4,shadowRadius:12}}>
              <Text style={[TY.h4,{color:C.inkDark}]}>Add Shift</Text>
            </TouchableOpacity>
          </PressCard>
        ):(dayShifts.map(s=>{const bc=statusColor(s.status);return(
          <PressCard key={s.id} style={{marginBottom:14,padding:18}} glowColor={bc}>
            <View style={{position:'absolute',top:0,right:0,bottom:0,width:4,backgroundColor:bc,borderTopRightRadius:20,borderBottomRightRadius:20}}/>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
              <View style={{flex:1,marginRight:10}}>
                <Text style={[TY.h3,{color:C.ink}]}>{s.title}</Text>
                <Text style={[TY.bodyMd,{color:C.accent,fontWeight:'600',marginTop:3}]}>{s.project}</Text>
              </View>
              <Badge label={statusLabel(s.status)} color={bc}/>
            </View>
            <View style={{flexDirection:'row',flexWrap:'wrap',marginBottom:10}}>
              {[{v:'Call '+s.callTime+' Wrap '+s.wrapTime,c:C.accent,bg:C.accentT},{v:s.location,c:C.inkSub,bg:C.bgHighlight},{v:s.crewNeeded+' crew',c:C.inkSub,bg:C.bgHighlight},{v:s.dept,c:C.inkSub,bg:C.bgHighlight}].map(function(tag,ti){return(
                <View key={ti} style={{backgroundColor:tag.bg,borderRadius:8,paddingHorizontal:10,paddingVertical:5,marginRight:7,marginBottom:6}}>
                  <Text style={[TY.micro,{color:tag.c}]}>{tag.v}</Text>
                </View>
              );})}
            </View>
            {s.notes?<Text style={[TY.caption,{color:C.inkFaint,marginBottom:12,fontStyle:'italic'}]}>Note: {s.notes}</Text>:null}
            <View style={{flexDirection:'row'}}>
              <TouchableOpacity onPress={()=>openEdit(s)} style={{flex:1,backgroundColor:C.bgHighlight,borderRadius:100,paddingVertical:10,alignItems:'center',marginRight:8,borderWidth:1,borderColor:C.border}}>
                <Text style={[TY.micro,{color:C.primary,fontWeight:'700'}]}>EDIT</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={()=>del(s.id)} style={{flex:1,backgroundColor:C.punchT,borderRadius:100,paddingVertical:10,alignItems:'center',borderWidth:1,borderColor:C.punch+'30'}}>
                <Text style={[TY.micro,{color:C.punch,fontWeight:'700'}]}>DELETE</Text>
              </TouchableOpacity>
            </View>
          </PressCard>
        );}))}
        {allOther.length>0&&(
          <View style={{marginTop:24}}>
            <SectionLabel text="Upcoming Shifts"/>
            {allOther.slice(0,6).map(s=>(
              <PressCard key={s.id} style={{marginBottom:10,padding:16}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <View style={{width:44,height:44,borderRadius:12,backgroundColor:C.accentT,alignItems:'center',justifyContent:'center',marginRight:14}}>
                    <Text style={[TY.micro,{color:C.accent}]}>{s.date.slice(8)}</Text>
                    <Text style={[TY.label,{color:C.accent,fontSize:8}]}>{s.date.slice(5,7)}</Text>
                  </View>
                  <View style={{flex:1}}>
                    <Text style={[TY.h4,{color:C.ink}]}>{s.title}</Text>
                    <Text style={[TY.caption,{color:C.inkSub,marginTop:2}]}>{s.project} · {s.callTime}</Text>
                  </View>
                  <Badge label={statusLabel(s.status)} color={statusColor(s.status)} size="sm"/>
                </View>
              </PressCard>
            ))}
          </View>
        )}
      </ScrollView>
      <Sheet visible={showForm} onClose={()=>setShowForm(false)} title={editing?'Edit Shift':'New Shift'}>
        <Field label="Shift Title" value={form.title} onChangeText={v=>setForm(f=>({...f,title:v}))} placeholder="e.g. Principal Photography Day 1"/>
        <Field label="Project" value={form.project} onChangeText={v=>setForm(f=>({...f,project:v}))} placeholder="e.g. Midnight Runner"/>
        <Field label="Date" value={form.date} onChangeText={v=>setForm(f=>({...f,date:v}))} placeholder="YYYY-MM-DD"/>
        <Field label="Call Time" value={form.callTime} onChangeText={v=>setForm(f=>({...f,callTime:v}))} placeholder="e.g. 06:00"/>
        <Field label="Wrap Time" value={form.wrapTime} onChangeText={v=>setForm(f=>({...f,wrapTime:v}))} placeholder="e.g. 18:00"/>
        <Field label="Location" value={form.location} onChangeText={v=>setForm(f=>({...f,location:v}))} placeholder="e.g. Pinewood Studios"/>
        <Field label="Department" value={form.dept} onChangeText={v=>setForm(f=>({...f,dept:v}))} placeholder="e.g. Full Crew"/>
        <Field label="Crew Needed" value={form.crewNeeded} onChangeText={v=>setForm(f=>({...f,crewNeeded:v}))} placeholder="0" keyboardType="numeric"/>
        <StatusPicker options={['pending','confirmed','cancelled']} value={form.status} onChange={v=>setForm(f=>({...f,status:v}))} activeColor={C.accent}/>
        <Field label="Notes" value={form.notes} onChangeText={v=>setForm(f=>({...f,notes:v}))} placeholder="Any notes..." multiline lines={2}/>
        <PrimaryBtn label={editing?'Save Changes':'Schedule Shift'} onPress={save} color={C.accent}/>
        {editing&&<TouchableOpacity onPress={()=>{setShowForm(false);del(editing);}} style={{alignItems:'center',marginTop:16}}>
          <Text style={[TY.body,{color:C.punch}]}>Delete this shift</Text>
        </TouchableOpacity>}
      </Sheet>
    </SafeAreaView>
  );
}

function MessagesScreen(){
  const{data,dispatch}=useStore();
  const[thread,setThread]=useState(null);
  const[input,setInput]=useState('');
  const scrollRef=useRef(null);
  const AUTO=['Sounds good, I will be there!','Can we push back 30 minutes?','On my way now.','Confirmed. See you on set.','I will send the files over shortly.','Great, noted. Thanks!','Let me check my schedule.','No problem at all.'];
  function sendMsg(){
    if(!input.trim())return;
    const txt=input.trim();setInput('');
    dispatch(function(s){var conv=s.messages.find(function(m){return m.id===thread;});if(!conv)return;conv.msgs.push({id:'msg'+Date.now(),from:'me',text:txt,time:'Now'});conv.preview=txt;conv.time='Now';});
    setTimeout(function(){var reply=AUTO[Math.floor(Math.random()*AUTO.length)];dispatch(function(s){var conv=s.messages.find(function(m){return m.id===thread;});if(!conv)return;conv.msgs.push({id:'msg'+Date.now()+'r',from:'them',text:reply,time:'Now'});conv.preview=reply;});},1100+Math.random()*800);
  }
  function newConvo(){
    Alert.alert('New Conversation','Start:',[{text:'Cancel',style:'cancel'},{text:'New Direct',onPress:function(){var id='m'+Date.now();dispatch(function(s){s.messages.unshift({id,name:'New Contact',initials:'NC',color:C.accent,preview:'',time:'Now',unread:0,msgs:[]});});setThread(id);}}]);
  }
  if(thread){
    var conv=data.messages.find(function(m){return m.id===thread;});
    if(!conv){setThread(null);return null;}
    dispatch(function(s){var c=s.messages.find(function(m){return m.id===thread;});if(c)c.unread=0;});
    return(
      <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
        <BackHeader title={conv.name} onBack={function(){setThread(null);}} right={<Avatar initials={conv.initials} color={conv.color} size={36}/>}/>
        <KeyboardAvoidingView style={{flex:1}} behavior={isIOS?'padding':undefined}>
          <ScrollView ref={scrollRef} contentContainerStyle={{padding:16,paddingBottom:16}} onContentSizeChange={function(){if(scrollRef.current)scrollRef.current.scrollToEnd({animated:true});}}>
            {conv.msgs.length===0&&(
              <View style={{alignItems:'center',paddingVertical:48}}>
                <Avatar initials={conv.initials} color={conv.color} size={72}/>
                <Text style={[TY.h2,{color:C.ink,marginTop:18}]}>{conv.name}</Text>
                <Text style={[TY.body,{color:C.inkSub,marginTop:6}]}>Start the conversation</Text>
              </View>
            )}
            {conv.msgs.map(function(m){
              var isMe=m.from==='me';
              return(
                <View key={m.id} style={{flexDirection:'row',justifyContent:isMe?'flex-end':'flex-start',marginBottom:10}}>
                  {!isMe&&<Avatar initials={conv.initials} color={conv.color} size={26} style={{marginRight:8,marginTop:4}}/>}
                  <View style={{maxWidth:'72%'}}>
                    <View style={{backgroundColor:isMe?C.primary:C.bgElevated,borderRadius:20,borderBottomRightRadius:isMe?4:20,borderBottomLeftRadius:isMe?20:4,paddingHorizontal:16,paddingVertical:11,borderWidth:isMe?0:1,borderColor:C.border}}>
                      <Text style={{color:isMe?C.inkDark:C.ink,...TY.body}}>{m.text}</Text>
                    </View>
                    <Text style={[TY.micro,{color:C.inkFaint,marginTop:4,textAlign:isMe?'right':'left',marginHorizontal:4}]}>{m.time}</Text>
                  </View>
                </View>
              );
            })}
          </ScrollView>
          <View style={{flexDirection:'row',alignItems:'flex-end',paddingHorizontal:12,paddingVertical:10,borderTopWidth:1,borderTopColor:C.border,backgroundColor:C.bgCard}}>
            <TextInput value={input} onChangeText={setInput} placeholder="Message..." placeholderTextColor={C.inkFaint} multiline maxLength={500} style={{flex:1,backgroundColor:C.bgHighlight,borderRadius:22,paddingHorizontal:18,paddingVertical:11,color:C.ink,fontSize:15,lineHeight:21,maxHeight:100,marginRight:10,borderWidth:1,borderColor:C.border}}/>
            <TouchableOpacity onPress={sendMsg} style={{backgroundColor:input.trim()?C.primary:C.bgHighlight,width:44,height:44,borderRadius:22,alignItems:'center',justifyContent:'center',shadowColor:C.primary,shadowOffset:{width:0,height:3},shadowOpacity:input.trim()?0.4:0,shadowRadius:8}}>
              <Text style={{color:input.trim()?C.inkDark:C.inkFaint,fontSize:20,fontWeight:'700',lineHeight:24}}>^</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
  const totalUnread=data.messages.reduce(function(a,m){return a+(m.unread||0);},0);
  return(
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      <Header title="Messages" subtitle="INBOX" right={<TouchableOpacity onPress={newConvo} style={{backgroundColor:C.primary,borderRadius:100,paddingHorizontal:18,paddingVertical:9,shadowColor:C.primary,shadowOffset:{width:0,height:4},shadowOpacity:0.4,shadowRadius:10,elevation:6}}>
        <Text style={[TY.micro,{color:C.inkDark,fontWeight:'900'}]}>+ NEW</Text>
      </TouchableOpacity>}/>
      {totalUnread>0&&<View style={{marginHorizontal:20,marginBottom:14,backgroundColor:C.punchT,borderRadius:14,padding:12,flexDirection:'row',alignItems:'center',borderWidth:1,borderColor:C.punch+'30'}}>
        <View style={{width:22,height:22,borderRadius:11,backgroundColor:C.punch,alignItems:'center',justifyContent:'center',marginRight:10}}>
          <Text style={{color:C.ink,fontSize:11,fontWeight:'900'}}>{totalUnread}</Text>
        </View>
        <Text style={[TY.body,{color:C.punch,fontWeight:'600'}]}>{totalUnread} unread message{totalUnread!==1?'s':''}</Text>
      </View>}
      <FlatList data={data.messages} keyExtractor={function(i){return i.id;}} contentContainerStyle={{paddingHorizontal:20,paddingBottom:100}} showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState title="No messages yet" body="Start a conversation with your crew." onAction={newConvo} actionLabel="Start Messaging"/>}
        renderItem={function({item:m}){return(
          <TouchableOpacity onPress={function(){setThread(m.id);}} activeOpacity={0.82} style={{flexDirection:'row',alignItems:'center',paddingVertical:14,borderBottomWidth:1,borderBottomColor:C.border}}>
            <View style={{position:'relative',marginRight:14}}>
              <Avatar initials={m.initials} color={m.color} size={52}/>
              {m.unread>0&&<View style={{position:'absolute',top:-3,right:-3,backgroundColor:C.punch,width:20,height:20,borderRadius:10,alignItems:'center',justifyContent:'center',borderWidth:2.5,borderColor:C.bg}}>
                <Text style={{color:C.ink,fontSize:10,fontWeight:'900'}}>{m.unread}</Text>
              </View>}
            </View>
            <View style={{flex:1}}>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'baseline',marginBottom:4}}>
                <Text style={[TY.h4,{color:C.ink}]}>{m.name}</Text>
                <Text style={[TY.micro,{color:C.inkSub}]}>{m.time}</Text>
              </View>
              <Text style={[TY.bodyMd,{color:m.unread>0?C.inkSub:C.inkFaint,fontWeight:m.unread>0?'600':'400'}]} numberOfLines={1}>{m.preview}</Text>
            </View>
          </TouchableOpacity>
        );}}/>
    </SafeAreaView>
  );
}

function InvoicesScreen(){
  const{data,dispatch}=useStore();
  const[showForm,setShowForm]=useState(false);
  const[editing,setEditing]=useState(null);
  const[detail,setDetail]=useState(null);
  const[filter,setFilter]=useState('all');
  const blank={number:'',client:'',project:'',amount:'',status:'pending',dueDate:'',issueDate:'',desc:''};
  const[form,setForm]=useState(blank);
  const total=data.invoices.reduce(function(a,i){return a+i.amount;},0);
  const paid=data.invoices.filter(function(i){return i.status==='paid';}).reduce(function(a,i){return a+i.amount;},0);
  const pending=data.invoices.filter(function(i){return i.status==='pending';}).reduce(function(a,i){return a+i.amount;},0);
  const overdue=data.invoices.filter(function(i){return i.status==='overdue';}).reduce(function(a,i){return a+i.amount;},0);
  const collRate=total>0?Math.round((paid/total)*100):0;
  const filtered=data.invoices.filter(function(i){return filter==='all'||i.status===filter;});
  function openNew(){var num='INV-2026-'+String(data.invoices.length+1).padStart(3,'0');setForm({...blank,number:num,issueDate:new Date().toISOString().slice(0,10)});setEditing(null);setShowForm(true);}
  function openEdit(inv){setForm({...inv,amount:String(inv.amount)});setEditing(inv.id);setShowForm(true);}
  function save(){
    if(!form.client.trim()){Alert.alert('Required','Client name is required');return;}
    var inv={...form,amount:parseFloat(form.amount)||0};
    if(editing){dispatch(function(s){var i=s.invoices.findIndex(function(x){return x.id===editing;});if(i>-1)s.invoices[i]={...s.invoices[i],...inv};});}
    else{dispatch(function(s){s.invoices.push({...inv,id:'i'+Date.now()});});}
    setShowForm(false);
  }
  function del(id){Alert.alert('Delete Invoice','Permanently delete?',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:function(){dispatch(function(s){s.invoices=s.invoices.filter(function(i){return i.id!==id;});});setDetail(null);}}]);}
  function markPaid(id){dispatch(function(s){var inv=s.invoices.find(function(i){return i.id===id;});if(inv)inv.status='paid';});}
  function remind(inv){Alert.alert('Reminder Sent','Payment reminder sent to '+inv.client+'.');}
  if(detail){
    var inv=data.invoices.find(function(i){return i.id===detail;});
    if(!inv){setDetail(null);return null;}
    const sc=statusColor(inv.status);
    return(
      <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
        <BackHeader title={inv.number} onBack={function(){setDetail(null);}} right={<View style={{flexDirection:'row'}}>
          <TouchableOpacity onPress={function(){setDetail(null);openEdit(inv);}} style={{backgroundColor:C.bgHighlight,borderRadius:100,paddingHorizontal:14,paddingVertical:7,marginRight:8,borderWidth:1,borderColor:C.border}}>
            <Text style={[TY.micro,{color:C.primary,fontWeight:'700'}]}>EDIT</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={function(){del(inv.id);}} style={{backgroundColor:C.punchT,borderRadius:100,paddingHorizontal:14,paddingVertical:7,borderWidth:1,borderColor:C.punch+'40'}}>
            <Text style={[TY.micro,{color:C.punch,fontWeight:'700'}]}>DELETE</Text>
          </TouchableOpacity>
        </View>}/>
        <ScrollView contentContainerStyle={{padding:20,paddingBottom:60}} showsVerticalScrollIndicator={false}>
          <PressCard style={{padding:24,marginBottom:16,overflow:'hidden'}}>
            <View style={{position:'absolute',top:-30,right:-30,width:150,height:150,borderRadius:75,backgroundColor:sc,opacity:0.06}}/>
            <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:16}}>
              <View>
                <Text style={[TY.label,{color:C.inkSub,marginBottom:6}]}>Invoice Amount</Text>
                <Text style={[TY.hero,{color:sc}]}>{fmtGBP(inv.amount)}</Text>
              </View>
              <Badge label={statusLabel(inv.status)} color={sc}/>
            </View>
            <Text style={[TY.h2,{color:C.ink}]}>{inv.client}</Text>
            <Text style={[TY.body,{color:C.inkSub,marginTop:4}]}>{inv.project}</Text>
            {inv.desc?<Text style={[TY.bodyMd,{color:C.inkFaint,marginTop:10,fontStyle:'italic'}]}>{inv.desc}</Text>:null}
          </PressCard>
          <PressCard style={{padding:20,marginBottom:16}}>
            {[{label:'Invoice No.',value:inv.number},{label:'Issue Date',value:inv.issueDate},{label:'Due Date',value:inv.dueDate}].map(function(row){return(
              <View key={row.label} style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:12,borderBottomWidth:1,borderBottomColor:C.border}}>
                <Text style={[TY.body,{color:C.inkSub}]}>{row.label}</Text>
                <Text style={[TY.body,{color:C.ink,fontWeight:'600'}]}>{row.value}</Text>
              </View>
            );})}
          </PressCard>
          <View style={{flexDirection:'row'}}>
            {inv.status!=='paid'&&<TouchableOpacity onPress={function(){markPaid(inv.id);}} style={{flex:1,marginRight:8}}><PrimaryBtn label="Mark as Paid" color={C.success}/></TouchableOpacity>}
            <TouchableOpacity onPress={function(){remind(inv);}} style={{flex:1}}><PrimaryBtn label="Send Reminder" color={C.accent}/></TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
  return(
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      <Header title="Invoices" subtitle="BILLING" right={<TouchableOpacity onPress={openNew} style={{backgroundColor:C.primary,borderRadius:100,paddingHorizontal:18,paddingVertical:9,shadowColor:C.primary,shadowOffset:{width:0,height:4},shadowOpacity:0.4,shadowRadius:10,elevation:6}}>
        <Text style={[TY.micro,{color:C.inkDark,fontWeight:'900'}]}>+ INVOICE</Text>
      </TouchableOpacity>}/>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:16,paddingBottom:12}}>
        {[{label:'TOTAL RAISED',value:fmtGBP(total),color:C.ink,bg:C.bgHighlight},{label:'COLLECTED',value:fmtGBP(paid),color:C.success,bg:C.successT},{label:'OUTSTANDING',value:fmtGBP(pending),color:C.primary,bg:C.primaryT},{label:'OVERDUE',value:fmtGBP(overdue),color:C.punch,bg:C.punchT}].map(function(k){return(
          <View key={k.label} style={{backgroundColor:k.bg,borderRadius:16,padding:16,marginRight:10,minWidth:130,borderWidth:1,borderColor:k.color==='#F0F4FF'?C.border:k.color+'30'}}>
            <Text style={[TY.h2,{color:k.color}]}>{k.value}</Text>
            <Text style={[TY.label,{color:k.color,opacity:0.7,fontSize:9,marginTop:4}]}>{k.label}</Text>
          </View>
        );})}
      </ScrollView>
      <View style={{paddingHorizontal:20,marginBottom:16}}>
        <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:7}}>
          <Text style={[TY.caption,{color:C.inkSub}]}>Collection rate</Text>
          <Text style={[TY.mono,{color:C.success,fontSize:12}]}>{collRate}%</Text>
        </View>
        <ProgressBar pct={collRate} color={C.success} height={6}/>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:20,paddingBottom:14}}>
        {['all','pending','paid','overdue'].map(function(f){return(
          <TouchableOpacity key={f} onPress={function(){setFilter(f);}} style={{backgroundColor:filter===f?C.primary:C.bgHighlight,borderRadius:100,paddingHorizontal:16,paddingVertical:9,marginRight:8,borderWidth:1.5,borderColor:filter===f?C.primary:C.border}}>
            <Text style={[TY.caption,{color:filter===f?C.inkDark:C.inkSub,fontWeight:'700'}]}>{f.charAt(0).toUpperCase()+f.slice(1)}</Text>
          </TouchableOpacity>
        );})}
      </ScrollView>
      <FlatList data={filtered} keyExtractor={function(i){return i.id;}} contentContainerStyle={{paddingHorizontal:20,paddingBottom:100}} showsVerticalScrollIndicator={false}
        ListEmptyComponent={<EmptyState title="No invoices" body="Create your first invoice and start tracking payments." onAction={openNew} actionLabel="Create Invoice"/>}
        renderItem={function({item:inv}){const sc=statusColor(inv.status);return(
          <PressCard style={{marginBottom:12}} onPress={function(){setDetail(inv.id);}} glowColor={sc}>
            <View style={{padding:18}}>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:12}}>
                <View style={{flex:1,marginRight:10}}>
                  <Text style={[TY.micro,{color:C.inkSub,marginBottom:4}]}>{inv.number}</Text>
                  <Text style={[TY.h3,{color:C.ink}]}>{inv.client}</Text>
                  <Text style={[TY.caption,{color:C.inkSub,marginTop:2}]}>{inv.project}</Text>
                </View>
                <Badge label={statusLabel(inv.status)} color={sc}/>
              </View>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                <Text style={[TY.h2,{color:sc}]}>{fmtGBP(inv.amount)}</Text>
                <Text style={[TY.caption,{color:C.inkSub}]}>Due {inv.dueDate}</Text>
              </View>
              {inv.status==='overdue'&&<View style={{marginTop:12,backgroundColor:C.punchT,borderRadius:10,padding:10,borderWidth:1,borderColor:C.punch+'30'}}>
                <Text style={[TY.caption,{color:C.punch,fontWeight:'700'}]}>Payment overdue · Send a reminder</Text>
              </View>}
            </View>
          </PressCard>
        );}}/>
      <Sheet visible={showForm} onClose={function(){setShowForm(false);}} title={editing?'Edit Invoice':'New Invoice'}>
        <Field label="Invoice Number" value={form.number} onChangeText={function(v){setForm(function(f){return{...f,number:v};});}} placeholder="INV-2026-001"/>
        <Field label="Client" value={form.client} onChangeText={function(v){setForm(function(f){return{...f,client:v};});}} placeholder="Client name"/>
        <Field label="Project" value={form.project} onChangeText={function(v){setForm(function(f){return{...f,project:v};});}} placeholder="Project name"/>
        <Field label="Description" value={form.desc} onChangeText={function(v){setForm(function(f){return{...f,desc:v};});}} placeholder="e.g. DoP Weeks 1-4"/>
        <Field label="Amount (GBP)" value={form.amount} onChangeText={function(v){setForm(function(f){return{...f,amount:v};});}} placeholder="0" keyboardType="numeric"/>
        <StatusPicker options={['pending','paid','overdue']} value={form.status} onChange={function(v){setForm(function(f){return{...f,status:v};});}}/>
        <Field label="Issue Date" value={form.issueDate} onChangeText={function(v){setForm(function(f){return{...f,issueDate:v};});}} placeholder="YYYY-MM-DD"/>
        <Field label="Due Date" value={form.dueDate} onChangeText={function(v){setForm(function(f){return{...f,dueDate:v};});}} placeholder="YYYY-MM-DD"/>
        <PrimaryBtn label={editing?'Save Changes':'Create Invoice'} onPress={save}/>
        {editing&&<TouchableOpacity onPress={function(){setShowForm(false);del(editing);}} style={{alignItems:'center',marginTop:16}}>
          <Text style={[TY.body,{color:C.punch}]}>Delete this invoice</Text>
        </TouchableOpacity>}
      </Sheet>
    </SafeAreaView>
  );
}

function ReportsScreen(){
  const{data}=useStore();
  const totalBudget=data.projects.reduce(function(a,p){return a+p.budget;},0);
  const totalSpent=data.projects.reduce(function(a,p){return a+p.spent;},0);
  const invoiceRevenue=data.invoices.filter(function(i){return i.status==='paid';}).reduce(function(a,i){return a+i.amount;},0);
  const crewActive=data.crew.filter(function(c){return c.status==='active';}).length;
  const maxBudget=Math.max.apply(null,data.projects.map(function(p){return p.budget;}))||1;
  const deptCount=data.crew.reduce(function(acc,c){acc[c.dept]=(acc[c.dept]||0)+1;return acc;},{});
  const deptEntries=Object.entries(deptCount).sort(function(a,b){return b[1]-a[1];});
  const PALETTE=[C.primary,C.accent,C.purple,C.success,C.punch,C.blue];
  const kpis=[{label:'TOTAL BUDGET',value:fmtGBP(totalBudget),color:C.ink,g:'B'},{label:'TOTAL SPENT',value:fmtGBP(totalSpent),color:totalSpent/totalBudget>0.8?C.punch:C.accent,g:'S'},{label:'REVENUE IN',value:fmtGBP(invoiceRevenue),color:C.success,g:'R'},{label:'ACTIVE CREW',value:String(crewActive),color:C.purple,g:'C'}];
  return(
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      <ScrollView contentContainerStyle={{paddingBottom:120}} showsVerticalScrollIndicator={false}>
        <Header title="Reports" subtitle="ANALYTICS"/>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:16,paddingBottom:20}}>
          {kpis.map(function(k){return(
            <View key={k.label} style={{backgroundColor:C.bgCard,borderRadius:18,padding:18,marginRight:10,minWidth:140,borderWidth:1,borderColor:C.border}}>
              <View style={{width:36,height:36,borderRadius:10,backgroundColor:k.color+'18',alignItems:'center',justifyContent:'center',marginBottom:12}}>
                <Text style={{color:k.color,fontSize:16,fontWeight:'900'}}>{k.g}</Text>
              </View>
              <Text style={[TY.h2,{color:k.color}]}>{k.value}</Text>
              <Text style={[TY.label,{color:C.inkSub,fontSize:9,marginTop:4}]}>{k.label}</Text>
            </View>
          );})}
        </ScrollView>
        <View style={{paddingHorizontal:20,marginBottom:24}}>
          <SectionLabel text="Budget by Project"/>
          <PressCard style={{padding:20}}>
            {data.projects.map(function(p,i){
              var pct=p.budget>0?Math.round((p.spent/p.budget)*100):0;
              var barW=(p.budget/maxBudget)*100;
              var color=p.color||PALETTE[i%PALETTE.length];
              var bc=pct>85?C.punch:pct>65?C.primary:C.success;
              return(
                <View key={p.id} style={{marginBottom:18}}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:7,alignItems:'baseline'}}>
                    <View style={{flex:1,marginRight:8}}>
                      <Text style={[TY.h4,{color:C.ink}]} numberOfLines={1}>{p.title}</Text>
                      <Text style={[TY.caption,{color:C.inkSub,marginTop:2}]}>{p.client}</Text>
                    </View>
                    <Text style={[TY.mono,{color:color,fontSize:13}]}>{fmtGBP(p.budget)}</Text>
                  </View>
                  <View style={{height:10,backgroundColor:C.bgHighlight,borderRadius:5,marginBottom:4}}>
                    <View style={{height:10,width:barW+'%',backgroundColor:color+'40',borderRadius:5}}/>
                  </View>
                  <View style={{height:10,backgroundColor:'transparent',borderRadius:5,marginTop:-10}}>
                    <View style={{height:10,width:Math.min(100,p.budget>0?(p.spent/p.budget)*100:0)+'%',backgroundColor:bc,borderRadius:5,opacity:0.9}}/>
                  </View>
                  <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:5}}>
                    <Text style={[TY.micro,{color:C.inkSub}]}>Spent {fmtGBP(p.spent)}</Text>
                    <Text style={[TY.micro,{color:bc}]}>{pct}%</Text>
                  </View>
                </View>
              );
            })}
          </PressCard>
        </View>
        <View style={{paddingHorizontal:20,marginBottom:24}}>
          <SectionLabel text="Invoice Breakdown"/>
          <View style={{flexDirection:'row'}}>
            {[{label:'Paid',count:data.invoices.filter(function(i){return i.status==='paid';}).length,value:data.invoices.filter(function(i){return i.status==='paid';}).reduce(function(a,i){return a+i.amount;},0),color:C.success},{label:'Pending',count:data.invoices.filter(function(i){return i.status==='pending';}).length,value:data.invoices.filter(function(i){return i.status==='pending';}).reduce(function(a,i){return a+i.amount;},0),color:C.primary},{label:'Overdue',count:data.invoices.filter(function(i){return i.status==='overdue';}).length,value:data.invoices.filter(function(i){return i.status==='overdue';}).reduce(function(a,i){return a+i.amount;},0),color:C.punch}].map(function(item){return(
              <PressCard key={item.label} style={{flex:1,marginHorizontal:4,padding:16,alignItems:'center'}}>
                <Text style={[TY.hero,{color:item.color,fontSize:32}]}>{item.count}</Text>
                <Text style={[TY.label,{color:item.color,fontSize:9,marginTop:4}]}>{item.label}</Text>
                <Text style={[TY.caption,{color:C.inkSub,marginTop:6}]}>{fmtGBP(item.value)}</Text>
              </PressCard>
            );})}
          </View>
        </View>
        <View style={{paddingHorizontal:20,marginBottom:24}}>
          <SectionLabel text="Team by Department"/>
          <PressCard style={{padding:20}}>
            {deptEntries.map(function(entry,i){
              var dept=entry[0];var count=entry[1];
              var pct=data.crew.length>0?Math.round((count/data.crew.length)*100):0;
              var color=PALETTE[i%PALETTE.length];
              return(
                <View key={dept} style={{marginBottom:16}}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:7}}>
                    <View style={{flexDirection:'row',alignItems:'center'}}>
                      <View style={{width:10,height:10,borderRadius:5,backgroundColor:color,marginRight:10}}/>
                      <Text style={[TY.h4,{color:C.ink}]}>{dept}</Text>
                    </View>
                    <Text style={[TY.mono,{color:color,fontSize:12}]}>{count} · {pct}%</Text>
                  </View>
                  <ProgressBar pct={pct} color={color} height={7}/>
                </View>
              );
            })}
          </PressCard>
        </View>
        <View style={{paddingHorizontal:20}}>
          <SectionLabel text="At a Glance"/>
          <PressCard style={{padding:20}}>
            {[{label:'Active Projects',value:data.projects.filter(function(p){return p.status==='active';}).length,color:C.accent},{label:'Completed Projects',value:data.projects.filter(function(p){return p.status==='completed';}).length,color:C.success},{label:'Total Crew',value:data.crew.length,color:C.purple},{label:'Scheduled Shifts',value:data.shifts.length,color:C.primary},{label:'Messages',value:data.messages.length,color:C.blue},{label:'Total Invoices',value:data.invoices.length,color:C.inkSub}].map(function(item,i,arr){return(
              <View key={item.label} style={{flexDirection:'row',alignItems:'center',paddingVertical:13,borderBottomWidth:i<arr.length-1?1:0,borderBottomColor:C.border}}>
                <View style={{width:8,height:8,borderRadius:4,backgroundColor:item.color,marginRight:14}}/>
                <Text style={[TY.body,{color:C.inkSub,flex:1}]}>{item.label}</Text>
                <Text style={[TY.h3,{color:item.color}]}>{item.value}</Text>
              </View>
            );})}
          </PressCard>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function MoreScreen(){
  const[editProfile,setEditProfile]=useState(false);
  const[profile,setProfile]=useState({name:'Ashtyn',company:'CrewDesk Ltd',email:'ashtyn@crewdesk.io',phone:'+44 7700 900000',role:'Executive Producer'});
  const[notifOn,setNotifOn]=useState(true);
  const[budgetOn,setBudgetOn]=useState(true);
  const[darkOn,setDarkOn]=useState(true);
  const[biometric,setBiometric]=useState(false);
  function saveProfile(){setEditProfile(false);Alert.alert('Saved','Your profile has been updated.');}
  const sections=[{title:'Account',items:[{label:'Edit Profile',sub:'Update your name, role and contact',onPress:function(){setEditProfile(true);}},{label:'Security and Privacy',sub:'Password, biometrics, data',onPress:function(){Alert.alert('Security','Manage your security settings.');}},{label:'Billing and Subscription',sub:'CrewDesk Pro GBP49/month',onPress:function(){Alert.alert('Billing','You are on the Pro plan at GBP49/month.');}},{label:'Manage Plan',sub:'Upgrade, downgrade or cancel',onPress:function(){Alert.alert('Plan','Manage your subscription.');}}]},{title:'Workspace',items:[{label:'Company Settings',sub:'Branding, address, tax info',onPress:function(){Alert.alert('Company','Manage your company profile.');}},{label:'Team and Permissions',sub:'Manage access levels and roles',onPress:function(){Alert.alert('Team','Add team members and set permissions.');}},{label:'Integrations',sub:'Slack, Xero, Google, Dropbox',onPress:function(){Alert.alert('Integrations','Connect with your existing tools.');}},{label:'Export Data',sub:'Download as CSV or PDF',onPress:function(){Alert.alert('Export','Exporting your data...');}}]},{title:'Support',items:[{label:'Help Centre',sub:'Guides, FAQs and tutorials',onPress:function(){Alert.alert('Help','Browse our help centre at help.crewdesk.io');}},{label:'Contact Support',sub:'Get help from the team',onPress:function(){Alert.alert('Support','Email: support@crewdesk.io');}},{label:'Send Feedback',sub:'Help us improve CrewDesk',onPress:function(){Alert.alert('Feedback','Thank you! Your feedback matters.');}},{label:'Rate CrewDesk',sub:'Leave a review on the App Store',onPress:function(){Alert.alert('Rate','Thank you for supporting CrewDesk!');}}]}];
  return(
    <SafeAreaView style={{flex:1,backgroundColor:C.bg}}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      <ScrollView contentContainerStyle={{paddingBottom:120}} showsVerticalScrollIndicator={false}>
        <Header title="Settings" subtitle="ACCOUNT"/>
        <View style={{paddingHorizontal:20,marginBottom:24}}>
          <PressCard style={{padding:22}} onPress={function(){setEditProfile(true);}}>
            <View style={{flexDirection:'row',alignItems:'center'}}>
              <View style={{width:68,height:68,borderRadius:34,backgroundColor:C.primary+'22',borderWidth:3,borderColor:C.primary+'60',alignItems:'center',justifyContent:'center',marginRight:18}}>
                <Text style={{color:C.primary,fontSize:26,fontWeight:'900'}}>{profile.name.split(' ').map(function(n){return n[0];}).join('').toUpperCase()}</Text>
              </View>
              <View style={{flex:1}}>
                <Text style={[TY.h2,{color:C.ink}]}>{profile.name}</Text>
                <Text style={[TY.body,{color:C.inkSub,marginTop:2}]}>{profile.role}</Text>
                <Text style={[TY.caption,{color:C.inkSub,marginTop:2}]}>{profile.company}</Text>
                <View style={{marginTop:10,alignSelf:'flex-start'}}><Badge label="Pro Plan" color={C.primary}/></View>
              </View>
              <View style={{backgroundColor:C.bgHighlight,borderRadius:100,padding:10,borderWidth:1,borderColor:C.border}}>
                <Text style={{color:C.inkSub,fontSize:14,fontWeight:'600'}}>{'>'}</Text>
              </View>
            </View>
          </PressCard>
        </View>
        <View style={{paddingHorizontal:20,marginBottom:24}}>
          <SectionLabel text="Preferences"/>
          <PressCard style={{padding:0,overflow:'hidden'}}>
            {[{label:'Push Notifications',sub:'Alerts for shifts and messages',val:notifOn,fn:setNotifOn},{label:'Budget Alerts',sub:'Warn when nearing budget limits',val:budgetOn,fn:setBudgetOn},{label:'Dark Mode',sub:'Uses your current system theme',val:darkOn,fn:setDarkOn},{label:'Biometric Login',sub:'Use Face ID or fingerprint',val:biometric,fn:setBiometric}].map(function(pref,i,arr){return(
              <View key={pref.label} style={{flexDirection:'row',alignItems:'center',paddingHorizontal:20,paddingVertical:14,borderBottomWidth:i<arr.length-1?1:0,borderBottomColor:C.border}}>
                <View style={{flex:1,marginRight:12}}>
                  <Text style={[TY.h4,{color:C.ink}]}>{pref.label}</Text>
                  <Text style={[TY.caption,{color:C.inkSub,marginTop:2}]}>{pref.sub}</Text>
                </View>
                <Switch value={pref.val} onValueChange={pref.fn} trackColor={{false:C.bgHighlight,true:C.primary}} thumbColor={pref.val?C.inkDark:C.inkSub}/>
              </View>
            );})}
          </PressCard>
        </View>
        {sections.map(function(section){return(
          <View key={section.title} style={{paddingHorizontal:20,marginBottom:20}}>
            <SectionLabel text={section.title}/>
            <PressCard style={{padding:0,overflow:'hidden'}}>
              {section.items.map(function(item,i,arr){return(
                <TouchableOpacity key={item.label} onPress={item.onPress} activeOpacity={0.75} style={{flexDirection:'row',alignItems:'center',paddingHorizontal:20,paddingVertical:15,borderBottomWidth:i<arr.length-1?1:0,borderBottomColor:C.border}}>
                  <View style={{flex:1}}>
                    <Text style={[TY.h4,{color:C.ink}]}>{item.label}</Text>
                    <Text style={[TY.caption,{color:C.inkSub,marginTop:2}]}>{item.sub}</Text>
                  </View>
                  <Text style={{color:C.inkFaint,fontSize:18,fontWeight:'300'}}>{'>'}</Text>
                </TouchableOpacity>
              );})}
            </PressCard>
          </View>
        );})}
        <View style={{alignItems:'center',paddingTop:8,paddingBottom:4}}>
          <Text style={[TY.caption,{color:C.inkFaint}]}>CrewDesk v6.0</Text>
          <Text style={[TY.micro,{color:C.inkFaint,marginTop:4}]}>Built for film, TV and events production</Text>
        </View>
      </ScrollView>
      <Sheet visible={editProfile} onClose={function(){setEditProfile(false);}} title="Edit Profile">
        <Field label="Full Name" value={profile.name} onChangeText={function(v){setProfile(function(p){return{...p,name:v};});}} placeholder="Your name"/>
        <Field label="Role" value={profile.role} onChangeText={function(v){setProfile(function(p){return{...p,role:v};});}} placeholder="e.g. Executive Producer"/>
        <Field label="Company" value={profile.company} onChangeText={function(v){setProfile(function(p){return{...p,company:v};});}} placeholder="Company name"/>
        <Field label="Email" value={profile.email} onChangeText={function(v){setProfile(function(p){return{...p,email:v};});}} keyboardType="email-address" placeholder="email@example.com"/>
        <Field label="Phone" value={profile.phone} onChangeText={function(v){setProfile(function(p){return{...p,phone:v};});}} keyboardType="phone-pad" placeholder="+44 7700 000000"/>
        <PrimaryBtn label="Save Profile" onPress={saveProfile}/>
      </Sheet>
    </SafeAreaView>
  );
}

const TABS=[{key:'Home',label:'Home',g:'H'},{key:'Projects',label:'Projects',g:'P'},{key:'Crew',label:'Crew',g:'C'},{key:'Schedule',label:'Schedule',g:'S'},{key:'Messages',label:'Msgs',g:'M'},{key:'Invoices',label:'Invoices',g:'I'},{key:'Reports',label:'Reports',g:'R'},{key:'More',label:'More',g:'...'}];
const TAB_COLORS={Home:C.primary,Projects:C.primary,Crew:C.accent,Schedule:C.accent,Messages:C.punch,Invoices:C.primary,Reports:C.purple,More:'#8896A8'};

function TabBar({active,onSelect,unread}){
  return(
    <View style={{position:'absolute',bottom:0,left:0,right:0,backgroundColor:C.bgCard,borderTopWidth:1,borderTopColor:C.border,shadowColor:'#000',shadowOffset:{width:0,height:-6},shadowOpacity:0.4,shadowRadius:24,elevation:24}}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:4,paddingTop:8,paddingBottom:isIOS?28:12}}>
        {TABS.map(function(tab){
          var isActive=active===tab.key;
          var ac=TAB_COLORS[tab.key]||C.inkSub;
          var hasBadge=tab.key==='Messages'&&unread>0;
          return(
            <TouchableOpacity key={tab.key} onPress={function(){onSelect(tab.key);}} style={{alignItems:'center',paddingHorizontal:10,paddingVertical:2,minWidth:64}}>
              <View style={{width:44,height:32,borderRadius:12,alignItems:'center',justifyContent:'center',backgroundColor:isActive?ac+'20':'transparent',position:'relative'}}>
                {isActive&&<View style={{position:'absolute',top:-9,left:'50%',width:28,height:3,marginLeft:-14,backgroundColor:ac,borderRadius:2}}/>}
                <Text style={{color:isActive?ac:C.inkFaint,fontSize:isActive?17:16,fontWeight:'900',lineHeight:22}}>{tab.g}</Text>
                {hasBadge&&<View style={{position:'absolute',top:-4,right:0,backgroundColor:C.punch,width:16,height:16,borderRadius:8,alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:C.bgCard}}>
                  <Text style={{color:C.ink,fontSize:8,fontWeight:'900'}}>{unread>9?'9+':unread}</Text>
                </View>}
              </View>
              <Text style={{color:isActive?ac:C.inkFaint,fontSize:9,fontWeight:isActive?'800':'500',marginTop:3,letterSpacing:0.3}}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

export default function App(){
  const[activeTab,setActiveTab]=useState('Home');
  const{data}=useStore();
  const unread=data.messages.reduce(function(a,m){return a+(m.unread||0);},0);
  function nav(screen){setActiveTab(screen);}
  function render(){
    if(activeTab==='Home')     return<HomeScreen navigate={nav}/>;
    if(activeTab==='Projects') return<ProjectsScreen/>;
    if(activeTab==='Crew')     return<CrewScreen/>;
    if(activeTab==='Schedule') return<ScheduleScreen/>;
    if(activeTab==='Messages') return<MessagesScreen/>;
    if(activeTab==='Invoices') return<InvoicesScreen/>;
    if(activeTab==='Reports')  return<ReportsScreen/>;
    if(activeTab==='More')     return<MoreScreen/>;
    return null;
  }
  return(<View style={{flex:1,backgroundColor:C.bg}}>{render()}<TabBar active={activeTab} onSelect={setActiveTab} unread={unread}/></View>);
}
