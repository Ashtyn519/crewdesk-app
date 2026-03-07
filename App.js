
import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  FlatList, Modal, Alert, Animated, RefreshControl, StatusBar,
  KeyboardAvoidingView, Platform, Dimensions,
} from 'react-native';

const { width: SW, height: SH } = Dimensions.get('window');

const C = {
  bg:'#060A12', surface:'#0D1420', card:'#111827', cardHi:'#161F30',
  border:'#1A2540', borderHi:'#243354', muted:'#253350',
  text:'#EDF2FF', textSub:'#94A3C0', textDim:'#4A5F82',
  gold:'#F59E0B', goldL:'#FCD34D', goldBg:'rgba(245,158,11,0.12)',
  teal:'#06B6D4', tealL:'#67E8F9', tealBg:'rgba(6,182,212,0.12)',
  green:'#10B981', greenL:'#6EE7B7', greenBg:'rgba(16,185,129,0.12)',
  red:'#EF4444', redL:'#FCA5A5', redBg:'rgba(239,68,68,0.12)',
  purple:'#8B5CF6', purpleL:'#C4B5FD', purpleBg:'rgba(139,92,246,0.12)',
  blue:'#3B82F6', blueL:'#93C5FD', blueBg:'rgba(59,130,246,0.12)',
  orange:'#F97316', orangeBg:'rgba(249,115,22,0.12)',
  pink:'#EC4899', pinkBg:'rgba(236,72,153,0.12)',
};
const ACCENTS = [C.gold, C.teal, C.purple, C.blue, C.pink, C.orange, C.red, C.green];

const fmtGBP = (n) => {
  if (!n && n!==0) return 'GBP0';
  if (n>=1_000_000) return 'GBP'+(n/1_000_000).toFixed(1)+'m';
  if (n>=1_000)     return 'GBP'+Math.round(n/1_000)+'k';
  return 'GBP'+Number(n).toLocaleString();
};
const fmtDate = (d) => {
  if (!d) return '';
  const p=d.split('-');
  const m=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return (p[2]||'')+' '+(m[parseInt(p[1],10)-1]||'')+' '+(p[0]||'');
};
const today = () => new Date().toISOString().split('T')[0];
const uid   = () => Math.random().toString(36).slice(2,9);
const clamp = (v,lo,hi) => Math.max(lo,Math.min(hi,v));
const daysUntil = (dateStr) => {
  if (!dateStr) return null;
  return Math.ceil((new Date(dateStr)-new Date(today()))/86400000);
};
const fmtDue = (dateStr) => {
  const d=daysUntil(dateStr);
  if (d===null) return '';
  if (d<0)  return Math.abs(d)+'d overdue';
  if (d===0) return 'due today';
  if (d<=7) return 'due in '+d+'d';
  return 'due '+fmtDate(dateStr);
};
const FAKE_FILES=['invoice_draft.pdf','payment_summary.pdf','contract_signed.pdf','po_order.pdf','remittance_advice.pdf','credit_note.pdf','statement_account.pdf','delivery_note.pdf'];
const pickFakeFile=()=>FAKE_FILES[Math.floor(Math.random()*FAKE_FILES.length)];

const INIT_PROJECTS=[
  {id:'p1',name:'Midnight Runner',type:'Feature Film',client:'Apex Studios',budget:480000,spent:312000,status:'active',accent:C.gold,crew:['c1','c2','c4'],startDate:'2026-01-10',endDate:'2026-08-30',location:'London, UK',notes:'Primary production phase. Weekly rushes review.'},
  {id:'p2',name:'Nova Campaign',type:'Brand Campaign',client:'Nova Beverages',budget:95000,spent:61200,status:'active',accent:C.teal,crew:['c3','c5'],startDate:'2026-02-01',endDate:'2026-04-15',location:'Manchester, UK',notes:'Social-first. 3 hero films + cutdowns.'},
  {id:'p3',name:'Altitude',type:'Documentary',client:'Sky Docs',budget:220000,spent:220000,status:'completed',accent:C.purple,crew:['c2','c6'],startDate:'2025-05-01',endDate:'2025-12-20',location:'Scotland, UK',notes:'Delivered on time. Post-production complete.'},
  {id:'p4',name:'The Last Signal',type:'Short Film',client:'BFI',budget:40000,spent:8500,status:'pending',accent:C.blue,crew:['c1','c3'],startDate:'2026-05-01',endDate:'2026-07-15',location:'Bristol, UK',notes:'Awaiting location permits.'},
];
const INIT_CREW=[
  {id:'c1',name:'Sophia Marlowe',role:'Director',email:'sophia@crewdesk.co',phone:'+44 7700 900001',rate:1200,rateUnit:'day',status:'active',available:true,projects:['p1','p4'],avatar:'SM',skills:['Direction','Creative Vision','Script Development'],bio:'Award-winning director with 12 years in film and advertising.'},
  {id:'c2',name:'Marcus Webb',role:'DOP',email:'marcus@crewdesk.co',phone:'+44 7700 900002',rate:950,rateUnit:'day',status:'active',available:true,projects:['p1','p3'],avatar:'MW',skills:['Cinematography','Lighting','Camera Operating'],bio:'BAFTA-nominated director of photography.'},
  {id:'c3',name:'Priya Nair',role:'Producer',email:'priya@crewdesk.co',phone:'+44 7700 900003',rate:800,rateUnit:'day',status:'active',available:true,projects:['p2','p4'],avatar:'PN',skills:['Production Management','Budgeting','Scheduling'],bio:'Experienced producer across commercials and long-form.'},
  {id:'c4',name:'James Fletcher',role:'1st AD',email:'james@crewdesk.co',phone:'+44 7700 900004',rate:700,rateUnit:'day',status:'active',available:false,projects:['p1'],avatar:'JF',skills:['Scheduling','Set Management','Safety'],bio:'Detail-focused AD keeping productions on track.'},
  {id:'c5',name:'Aisha Okafor',role:'Art Director',email:'aisha@crewdesk.co',phone:'+44 7700 900005',rate:650,rateUnit:'day',status:'active',available:true,projects:['p2'],avatar:'AO',skills:['Art Direction','Set Design','Props'],bio:'Bold aesthetic sensibility across brand and narrative.'},
  {id:'c6',name:'Tom Bradshaw',role:'Editor',email:'tom@crewdesk.co',phone:'+44 7700 900006',rate:750,rateUnit:'day',status:'freelance',available:true,projects:['p3'],avatar:'TB',skills:['Offline Editing','Colour Grade','Sound Design'],bio:'Post specialist with credits on BAFTA-winning documentaries.'},
];
const INIT_SHIFTS=[
  {id:'s1',projectId:'p1',title:'Shoot Day 12 - Ext. Warehouse',date:'2026-03-10',callTime:'06:00',wrapTime:'20:00',location:'Bermondsey SE1',crew:['c1','c2','c4'],status:'confirmed',notes:'Golden hour final shot at 19:30.'},
  {id:'s2',projectId:'p1',title:'Shoot Day 13 - Int. Office Set',date:'2026-03-11',callTime:'07:30',wrapTime:'18:00',location:'Shepperton Studios',crew:['c1','c2','c4'],status:'confirmed',notes:'Studio base. Catering on set.'},
  {id:'s3',projectId:'p2',title:'Brand Film Shoot',date:'2026-03-15',callTime:'08:00',wrapTime:'17:00',location:'Media City, Manchester',crew:['c3','c5'],status:'tentative',notes:'Talent confirmed. Weather dependent.'},
  {id:'s4',projectId:'p4',title:'Pre-Production Meeting',date:'2026-04-01',callTime:'10:00',wrapTime:'13:00',location:'Zoom / Remote',crew:['c1','c3'],status:'confirmed',notes:'Location scouting review.'},
  {id:'s5',projectId:'p1',title:'Shoot Day 14 - Rooftop Scene',date:'2026-03-20',callTime:'05:30',wrapTime:'19:00',location:'Canary Wharf, London',crew:['c1','c2'],status:'tentative',notes:'Sunrise wide shot. Permit pending.'},
];
const INIT_INVOICES=[
  {id:'i1',projectId:'p1',number:'INV-2026-001',client:'Apex Studios',amount:120000,status:'paid',issueDate:'2026-01-15',dueDate:'2026-02-14',paidDate:'2026-02-10',notes:'Production milestone 1 of 4.',attachments:['invoice_draft.pdf']},
  {id:'i2',projectId:'p1',number:'INV-2026-002',client:'Apex Studios',amount:120000,status:'paid',issueDate:'2026-02-15',dueDate:'2026-03-16',paidDate:'2026-03-12',notes:'Production milestone 2 of 4.',attachments:['payment_summary.pdf']},
  {id:'i3',projectId:'p2',number:'INV-2026-003',client:'Nova Beverages',amount:47500,status:'overdue',issueDate:'2026-02-01',dueDate:'2026-03-01',paidDate:null,notes:'50% of campaign fee.',attachments:[]},
  {id:'i4',projectId:'p1',number:'INV-2026-004',client:'Apex Studios',amount:120000,status:'sent',issueDate:'2026-03-01',dueDate:'2026-03-31',paidDate:null,notes:'Production milestone 3 of 4.',attachments:['po_order.pdf']},
  {id:'i5',projectId:'p4',number:'INV-2026-005',client:'BFI',amount:20000,status:'draft',issueDate:'2026-03-05',dueDate:'2026-04-04',paidDate:null,notes:'Development fee.',attachments:[]},
  {id:'i6',projectId:'p3',number:'INV-2025-019',client:'Sky Docs',amount:220000,status:'paid',issueDate:'2025-12-22',dueDate:'2026-01-21',paidDate:'2026-01-18',notes:'Final delivery invoice.',attachments:['contract_signed.pdf','remittance_advice.pdf']},
];
const INIT_MESSAGES=[
  {id:'m1',projectId:'p1',from:'Sophia Marlowe',fromId:'c1',avatar:'SM',text:'Rushes from day 12 looking incredible. The warehouse light is exactly what we wanted.',ts:'2026-03-08T09:14:00Z',read:true},
  {id:'m2',projectId:'p1',from:'Marcus Webb',fromId:'c2',avatar:'MW',text:'Agreed. Trying a colder key on day 13 to contrast the interiors.',ts:'2026-03-08T09:22:00Z',read:true},
  {id:'m3',projectId:'p2',from:'Priya Nair',fromId:'c3',avatar:'PN',text:'Manchester recce confirmed. Sending over the location pack this afternoon.',ts:'2026-03-07T14:05:00Z',read:false},
  {id:'m4',projectId:'p1',from:'James Fletcher',fromId:'c4',avatar:'JF',text:'Call sheet for day 13 is out. Please confirm receipt.',ts:'2026-03-08T11:00:00Z',read:false},
  {id:'m5',projectId:'p2',from:'Aisha Okafor',fromId:'c5',avatar:'AO',text:'Props list finalised. Sourcing the hero bottle display from a specialist props house.',ts:'2026-03-06T16:30:00Z',read:true},
  {id:'m6',projectId:'p4',from:'Priya Nair',fromId:'c3',avatar:'PN',text:'BFI confirmed the development fee invoice. Waiting on their PO number.',ts:'2026-03-05T10:00:00Z',read:false},
];


const useStore=()=>{
  const[projects,setProjects]=useState(INIT_PROJECTS);
  const[crew,setCrew]=useState(INIT_CREW);
  const[shifts,setShifts]=useState(INIT_SHIFTS);
  const[invoices,setInvoices]=useState(INIT_INVOICES);
  const[messages,setMessages]=useState(INIT_MESSAGES);
  const addProject=p=>setProjects(ps=>[{...p,id:uid(),crew:[],...ps}]);
  const updateProject=p=>setProjects(ps=>ps.map(x=>x.id===p.id?p:x));
  const deleteProject=id=>setProjects(ps=>ps.filter(x=>x.id!==id));
  const addCrew=c=>setCrew(cs=>[{...c,id:uid(),projects:[],available:true},...cs]);
  const updateCrew=c=>setCrew(cs=>cs.map(x=>x.id===c.id?c:x));
  const deleteCrew=id=>setCrew(cs=>cs.filter(x=>x.id!==id));
  const toggleAvailability=id=>setCrew(cs=>cs.map(c=>c.id===id?{...c,available:!c.available}:c));
  const assignCrewToProject=(crewId,projectId)=>{
    setCrew(cs=>cs.map(c=>c.id===crewId?{...c,projects:[...new Set([...c.projects,projectId])]}:c));
    setProjects(ps=>ps.map(p=>p.id===projectId?{...p,crew:[...new Set([...p.crew,crewId])]}:p));
  };
  const removeCrewFromProject=(crewId,projectId)=>{
    setCrew(cs=>cs.map(c=>c.id===crewId?{...c,projects:c.projects.filter(x=>x!==projectId)}:c));
    setProjects(ps=>ps.map(p=>p.id===projectId?{...p,crew:p.crew.filter(x=>x!==crewId)}:p));
  };
  const addShift=s=>setShifts(ss=>[{...s,id:uid()},...ss]);
  const updateShift=s=>setShifts(ss=>ss.map(x=>x.id===s.id?s:x));
  const deleteShift=id=>setShifts(ss=>ss.filter(x=>x.id!==id));
  const addInvoice=i=>setInvoices(is=>[{...i,id:uid(),attachments:[]},...is]);
  const updateInvoice=i=>setInvoices(is=>is.map(x=>x.id===i.id?i:x));
  const deleteInvoice=id=>setInvoices(is=>is.filter(x=>x.id!==id));
  const addAttachment=(invId,filename)=>setInvoices(is=>is.map(i=>i.id===invId?{...i,attachments:[...i.attachments,filename]}:i));
  const removeAttachment=(invId,filename)=>setInvoices(is=>is.map(i=>i.id===invId?{...i,attachments:i.attachments.filter(f=>f!==filename)}:i));
  const addMessage=m=>setMessages(ms=>[{...m,id:uid(),ts:new Date().toISOString(),read:false},...ms]);
  const markRead=id=>setMessages(ms=>ms.map(m=>m.id===id?{...m,read:true}:m));
  const markAllRead=()=>setMessages(ms=>ms.map(m=>({...m,read:true})));
  const deleteMsg=id=>setMessages(ms=>ms.filter(x=>x.id!==id));
  return{projects,crew,shifts,invoices,messages,addProject,updateProject,deleteProject,addCrew,updateCrew,deleteCrew,toggleAvailability,assignCrewToProject,removeCrewFromProject,addShift,updateShift,deleteShift,addInvoice,updateInvoice,deleteInvoice,addAttachment,removeAttachment,addMessage,markRead,markAllRead,deleteMsg};
};

const PressCard=({onPress,style,children,accent})=>{
  const scale=useRef(new Animated.Value(1)).current;
  const glow=useRef(new Animated.Value(0)).current;
  const onIn=()=>Animated.parallel([
    Animated.spring(scale,{toValue:0.975,useNativeDriver:true,speed:50,bounciness:3}),
    Animated.timing(glow,{toValue:1,useNativeDriver:false,duration:100}),
  ]).start();
  const onOut=()=>Animated.parallel([
    Animated.spring(scale,{toValue:1,useNativeDriver:true,speed:30,bounciness:5}),
    Animated.timing(glow,{toValue:0,useNativeDriver:false,duration:250}),
  ]).start();
  const borderColor=glow.interpolate({inputRange:[0,1],outputRange:[C.border,(accent||C.gold)+'44']});
  return(
    <TouchableOpacity activeOpacity={1} onPressIn={onIn} onPressOut={onOut} onPress={onPress}>
      <Animated.View style={[{transform:[{scale}],borderColor,borderWidth:1.5,borderRadius:18,overflow:'hidden'},style]}>
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};
const Badge=({label,color=C.gold})=>(
  <View style={{backgroundColor:color+'20',borderRadius:20,paddingHorizontal:10,paddingVertical:4,borderWidth:1,borderColor:color+'40'}}>
    <Text style={{color,fontSize:11,fontWeight:'700',textTransform:'uppercase',letterSpacing:0.5}}>{label}</Text>
  </View>
);
const StatusPicker=({value,options,onChange,style})=>(
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={style}>
    {options.map(o=>{
      const active=value===o.value;
      return(
        <TouchableOpacity key={o.value} onPress={()=>onChange(o.value)}
          style={{marginRight:8,paddingHorizontal:14,paddingVertical:7,borderRadius:22,
            backgroundColor:active?o.color:C.muted,borderWidth:1.5,borderColor:active?o.color:'transparent'}}>
          <Text style={{color:active?C.bg:C.textSub,fontSize:12,fontWeight:'700'}}>{o.label}</Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);
const Avatar=({initials,color=C.gold,size=36})=>(
  <View style={{width:size,height:size,borderRadius:size/2,backgroundColor:color+'25',borderWidth:2,borderColor:color+'80',alignItems:'center',justifyContent:'center'}}>
    <Text style={{color,fontSize:size*0.3,fontWeight:'800'}}>{initials}</Text>
  </View>
);
const AvatarStack=({ids,crew,limit=4})=>{
  const shown=ids.slice(0,limit);
  const extra=ids.length-limit;
  return(
    <View style={{flexDirection:'row',alignItems:'center'}}>
      {shown.map((id,i)=>{
        const m=crew.find(c=>c.id===id);
        if(!m)return null;
        const col=ACCENTS[i%ACCENTS.length];
        return(<View key={id} style={{marginLeft:i===0?0:-10,borderWidth:2,borderColor:C.surface,borderRadius:16}}><Avatar initials={m.avatar} color={col} size={28}/></View>);
      })}
      {extra>0&&(<View style={{marginLeft:-10,width:28,height:28,borderRadius:14,backgroundColor:C.muted,borderWidth:2,borderColor:C.surface,alignItems:'center',justifyContent:'center'}}><Text style={{color:C.textSub,fontSize:10,fontWeight:'700'}}>+{extra}</Text></View>)}
    </View>
  );
};
const SearchBar=({value,onChange,placeholder})=>(
  <View style={{flexDirection:'row',alignItems:'center',backgroundColor:C.card,borderRadius:14,borderWidth:1.5,borderColor:C.border,paddingHorizontal:14,marginBottom:12}}>
    <Text style={{color:C.textDim,fontSize:14,marginRight:8}}>SRC</Text>
    <TextInput value={value} onChangeText={onChange} placeholder={placeholder||'Search...'} placeholderTextColor={C.textDim} style={{flex:1,color:C.text,fontSize:14,paddingVertical:11}}/>
    {value.length>0&&(<TouchableOpacity onPress={()=>onChange('')} style={{padding:4}}><Text style={{color:C.textSub,fontSize:16,fontWeight:'700'}}>X</Text></TouchableOpacity>)}
  </View>
);
const SectionHdr=({title,action,actionLabel})=>(
  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10}}>
    <Text style={{color:C.textDim,fontSize:11,fontWeight:'700',textTransform:'uppercase',letterSpacing:1.3}}>{title}</Text>
    {action&&(<TouchableOpacity onPress={action}><Text style={{color:C.gold,fontSize:12,fontWeight:'700'}}>{actionLabel||'See all'}</Text></TouchableOpacity>)}
  </View>
);
const Empty=({label,sub,action,actionLabel})=>(
  <View style={{alignItems:'center',paddingVertical:52}}>
    <View style={{width:72,height:72,borderRadius:36,backgroundColor:C.card,borderWidth:1.5,borderColor:C.border,alignItems:'center',justifyContent:'center',marginBottom:16}}>
      <Text style={{color:C.textDim,fontSize:28}}>--</Text>
    </View>
    <Text style={{color:C.text,fontSize:17,fontWeight:'800',marginBottom:6,textAlign:'center'}}>{label}</Text>
    <Text style={{color:C.textSub,fontSize:13,textAlign:'center',maxWidth:240,lineHeight:20,marginBottom:action?20:0}}>{sub}</Text>
    {action&&(<TouchableOpacity onPress={action} style={{backgroundColor:C.gold,borderRadius:22,paddingHorizontal:24,paddingVertical:11}}><Text style={{color:C.bg,fontWeight:'800',fontSize:14}}>{actionLabel}</Text></TouchableOpacity>)}
  </View>
);
const Sheet=({visible,onClose,title,children})=>(
  <Modal visible={visible} animationType="slide" transparent>
    <KeyboardAvoidingView behavior={Platform.OS==='ios'?'padding':'height'} style={{flex:1}}>
      <View style={{flex:1,backgroundColor:'rgba(0,0,0,0.65)',justifyContent:'flex-end'}}>
        <View style={{backgroundColor:C.surface,borderTopLeftRadius:28,borderTopRightRadius:28,maxHeight:SH*0.93,paddingBottom:36}}>
          <View style={{alignItems:'center',paddingTop:12,paddingBottom:4}}>
            <View style={{width:40,height:4,borderRadius:2,backgroundColor:C.muted}}/>
          </View>
          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:20,paddingVertical:14,borderBottomWidth:1,borderBottomColor:C.border}}>
            <Text style={{color:C.text,fontSize:18,fontWeight:'800'}}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={{width:32,height:32,borderRadius:16,backgroundColor:C.muted,alignItems:'center',justifyContent:'center'}}>
              <Text style={{color:C.textSub,fontSize:15,fontWeight:'700',lineHeight:15}}>X</Text>
            </TouchableOpacity>
          </View>
          <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{padding:20}}>{children}</ScrollView>
        </View>
      </View>
    </KeyboardAvoidingView>
  </Modal>
);
const Field=({label,children})=>(
  <View style={{marginBottom:16}}>
    <Text style={{color:C.textDim,fontSize:11,fontWeight:'700',textTransform:'uppercase',letterSpacing:0.8,marginBottom:6}}>{label}</Text>
    {children}
  </View>
);
const TInput=({value,onChangeText,placeholder,multiline,keyboardType})=>(
  <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={C.textDim} multiline={multiline} keyboardType={keyboardType}
    style={{backgroundColor:C.card,borderRadius:12,borderWidth:1.5,borderColor:C.border,color:C.text,paddingHorizontal:14,paddingVertical:11,fontSize:14,minHeight:multiline?88:undefined,textAlignVertical:multiline?'top':undefined}}/>
);
const Btn=({label,onPress,color=C.gold,style,textColor})=>(
  <TouchableOpacity onPress={onPress} style={[{backgroundColor:color,borderRadius:14,paddingVertical:14,alignItems:'center'},style]}>
    <Text style={{color:textColor||(color===C.gold||color===C.green||color===C.teal?C.bg:C.text),fontWeight:'800',fontSize:15}}>{label}</Text>
  </TouchableOpacity>
);
const GhostBtn=({label,onPress,color=C.gold,style})=>(
  <TouchableOpacity onPress={onPress} style={[{borderRadius:14,paddingVertical:12,alignItems:'center',borderWidth:1.5,borderColor:color},style]}>
    <Text style={{color,fontWeight:'700',fontSize:14}}>{label}</Text>
  </TouchableOpacity>
);
const ProgressBar=({value,total,color=C.gold,height=6})=>{
  const pct=total>0?clamp(value/total,0,1):0;
  return(<View style={{height,backgroundColor:C.muted,borderRadius:height/2,overflow:'hidden'}}><View style={{width:(pct*100)+'%',height:'100%',backgroundColor:color,borderRadius:height/2}}/></View>);
};
const AnimBar=({value,max,color=C.gold,label,subLabel,delay=0})=>{
  const anim=useRef(new Animated.Value(0)).current;
  useEffect(()=>{Animated.timing(anim,{toValue:1,duration:800,delay,useNativeDriver:false}).start();},[]);
  const pct=max>0?clamp(value/max,0,1):0;
  const w=anim.interpolate({inputRange:[0,1],outputRange:['0%',(pct*100)+'%']});
  return(
    <View style={{marginBottom:16}}>
      <View style={{flexDirection:'row',justifyContent:'space-between',marginBottom:6}}>
        <Text style={{color:C.text,fontSize:13,fontWeight:'600',flex:1,marginRight:8}} numberOfLines={1}>{label}</Text>
        <Text style={{color,fontSize:13,fontWeight:'700'}}>{subLabel}</Text>
      </View>
      <View style={{height:8,backgroundColor:C.muted,borderRadius:4,overflow:'hidden'}}>
        <Animated.View style={{width:w,height:'100%',backgroundColor:color,borderRadius:4}}/>
      </View>
    </View>
  );
};
const HR=({style})=><View style={[{height:1,backgroundColor:C.border},style]}/>;
const StatTile=({label,value,color=C.gold,sub,onPress,style})=>(
  <TouchableOpacity onPress={onPress} style={[{backgroundColor:C.card,borderRadius:16,padding:16,borderWidth:1.5,borderColor:C.border,minWidth:100},style]}>
    <Text style={{color,fontSize:26,fontWeight:'900',marginBottom:2}}>{value}</Text>
    <Text style={{color:C.text,fontSize:12,fontWeight:'700'}}>{label}</Text>
    {sub&&<Text style={{color:C.textSub,fontSize:11,marginTop:2}}>{sub}</Text>}
  </TouchableOpacity>
);
const ColourPicker=({value,onChange})=>(
  <View style={{flexDirection:'row',flexWrap:'wrap'}}>
    {ACCENTS.map(col=>(
      <TouchableOpacity key={col} onPress={()=>onChange(col)}
        style={{width:38,height:38,borderRadius:19,backgroundColor:col,margin:5,borderWidth:value===col?3:0,borderColor:C.text,alignItems:'center',justifyContent:'center'}}>
        {value===col&&<View style={{width:10,height:10,borderRadius:5,backgroundColor:C.bg}}/>}
      </TouchableOpacity>
    ))}
  </View>
);
const AttachmentChip=({filename,onRemove})=>(
  <View style={{flexDirection:'row',alignItems:'center',backgroundColor:C.blueBg,borderRadius:22,paddingLeft:12,paddingRight:onRemove?4:12,paddingVertical:7,marginRight:8,marginBottom:8,borderWidth:1,borderColor:C.blue+'40'}}>
    <Text style={{color:C.blue,fontSize:12,fontWeight:'600',marginRight:onRemove?6:0}}>{filename}</Text>
    {onRemove&&(
      <TouchableOpacity onPress={onRemove} style={{width:20,height:20,borderRadius:10,backgroundColor:C.blue+'30',alignItems:'center',justifyContent:'center'}}>
        <Text style={{color:C.blue,fontSize:11,fontWeight:'900',lineHeight:11}}>X</Text>
      </TouchableOpacity>
    )}
  </View>
);


const HomeScreen=({store,navigate})=>{
  const[refreshing,setRefreshing]=useState(false);
  const onRefresh=useCallback(()=>{setRefreshing(true);setTimeout(()=>setRefreshing(false),900);},[]);
  const{projects,crew,invoices,shifts,messages}=store;
  const totalBudget=projects.reduce((s,p)=>s+p.budget,0);
  const totalSpent=projects.reduce((s,p)=>s+p.spent,0);
  const burnPct=totalBudget>0?Math.round(totalSpent/totalBudget*100):0;
  const activeProj=projects.filter(p=>p.status==='active').length;
  const overdueInv=invoices.filter(i=>i.status==='overdue').length;
  const unreadMsgs=messages.filter(m=>!m.read).length;
  const availCrew=crew.filter(c=>c.available).length;
  const upcoming=[...shifts].filter(s=>s.date>=today()).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,3);
  const alertInvoices=invoices.filter(i=>(i.status==='overdue')||(i.status==='sent'&&daysUntil(i.dueDate)!==null&&daysUntil(i.dueDate)<=7)).slice(0,3);
  const burnColor=burnPct>80?C.red:burnPct>65?C.gold:C.green;
  return(
    <ScrollView style={{flex:1,backgroundColor:C.bg}} contentContainerStyle={{paddingTop:60,paddingBottom:120}}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={C.gold} colors={[C.gold]}/>}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      <View style={{paddingHorizontal:22,marginBottom:22}}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
          <View>
            <Text style={{color:C.textDim,fontSize:12,fontWeight:'700',letterSpacing:1.5,textTransform:'uppercase'}}>CrewDesk</Text>
            <Text style={{color:C.text,fontSize:30,fontWeight:'900',lineHeight:36,marginTop:2}}>Command Centre</Text>
          </View>
          <View style={{backgroundColor:C.goldBg,borderRadius:14,paddingHorizontal:12,paddingVertical:8,borderWidth:1.5,borderColor:C.gold+'40'}}>
            <Text style={{color:C.gold,fontSize:11,fontWeight:'700'}}>v8.0</Text>
          </View>
        </View>
        <Text style={{color:C.textSub,fontSize:14,marginTop:6}}>{activeProj} active {activeProj===1?'project':'projects'}  {availCrew} crew available</Text>
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:22,paddingBottom:4}} style={{marginBottom:22}}>
        <StatTile label="Active" value={activeProj} color={C.teal} sub="projects" onPress={()=>navigate('Projects')} style={{marginRight:10}}/>
        <StatTile label="Crew" value={crew.length} color={C.purple} sub="members" onPress={()=>navigate('Crew')} style={{marginRight:10}}/>
        <StatTile label="Next Shoots" value={upcoming.length} color={C.blue} sub="upcoming" onPress={()=>navigate('Schedule')} style={{marginRight:10}}/>
        {overdueInv>0&&<StatTile label="Overdue" value={overdueInv} color={C.red} sub="invoices" onPress={()=>navigate('Invoices')} style={{marginRight:10}}/>}
        {unreadMsgs>0&&<StatTile label="Unread" value={unreadMsgs} color={C.orange} sub="messages" onPress={()=>navigate('Messages')}/>}
      </ScrollView>
      <View style={{paddingHorizontal:22,marginBottom:22}}>
        <PressCard onPress={()=>navigate('Reports')} accent={burnColor} style={{backgroundColor:C.card,padding:20}}>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:14}}>
            <View style={{flex:1}}>
              <Text style={{color:C.textDim,fontSize:11,fontWeight:'700',textTransform:'uppercase',letterSpacing:1.2}}>Portfolio Burn Rate</Text>
              <Text style={{color:C.text,fontSize:26,fontWeight:'900',marginTop:6}}>{fmtGBP(totalSpent)}</Text>
              <Text style={{color:C.textSub,fontSize:13,marginTop:2}}>of {fmtGBP(totalBudget)} total budget</Text>
            </View>
            <Text style={{color:burnColor,fontSize:52,fontWeight:'900',lineHeight:56}}>{burnPct}%</Text>
          </View>
          <ProgressBar value={totalSpent} total={totalBudget} color={burnColor} height={10}/>
          <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:8}}>
            <Text style={{color:C.textDim,fontSize:11}}>Tap to view full report</Text>
          </View>
        </PressCard>
      </View>
      {alertInvoices.length>0&&(
        <View style={{paddingHorizontal:22,marginBottom:22}}>
          <SectionHdr title="Needs Attention" action={()=>navigate('Invoices')} actionLabel="View all"/>
          {alertInvoices.map(inv=>{
            const isOverdue=inv.status==='overdue';
            const col=isOverdue?C.red:C.gold;
            return(
              <TouchableOpacity key={inv.id} onPress={()=>navigate('Invoices')}
                style={{backgroundColor:isOverdue?C.redBg:C.goldBg,borderRadius:14,padding:14,marginBottom:8,borderWidth:1.5,borderColor:col+'40'}}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                  <View style={{flex:1}}>
                    <Text style={{color:C.text,fontSize:14,fontWeight:'700'}}>{inv.number}</Text>
                    <Text style={{color:C.textSub,fontSize:12,marginTop:2}}>{inv.client}</Text>
                  </View>
                  <View style={{alignItems:'flex-end'}}>
                    <Text style={{color:col,fontSize:15,fontWeight:'900'}}>{fmtGBP(inv.amount)}</Text>
                    <Text style={{color:col,fontSize:11,fontWeight:'700',marginTop:2}}>{fmtDue(inv.dueDate)}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      <View style={{paddingHorizontal:22,marginBottom:22}}>
        <SectionHdr title="Active Projects" action={()=>navigate('Projects')} actionLabel="All projects"/>
        {projects.filter(p=>p.status==='active').map(p=>{
          const pct=p.budget>0?Math.round(p.spent/p.budget*100):0;
          const col=pct>80?C.red:p.accent;
          return(
            <PressCard key={p.id} onPress={()=>navigate('Projects')} accent={p.accent} style={{backgroundColor:C.card,padding:18,marginBottom:12}}>
              <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:10}}>
                <View style={{flexDirection:'row',alignItems:'center',flex:1}}>
                  <View style={{width:10,height:10,borderRadius:5,backgroundColor:p.accent,marginRight:10}}/>
                  <View style={{flex:1}}>
                    <Text style={{color:C.text,fontSize:16,fontWeight:'800'}}>{p.name}</Text>
                    <Text style={{color:C.textSub,fontSize:12,marginTop:1}}>{p.type} - {p.client}</Text>
                  </View>
                </View>
                <Text style={{color:col,fontSize:14,fontWeight:'800'}}>{pct}%</Text>
              </View>
              <ProgressBar value={p.spent} total={p.budget} color={col} height={6}/>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
                <AvatarStack ids={p.crew} crew={crew}/>
                <Text style={{color:C.textSub,fontSize:12}}>{fmtGBP(p.spent)} / {fmtGBP(p.budget)}</Text>
              </View>
            </PressCard>
          );
        })}
      </View>
      {upcoming.length>0&&(
        <View style={{paddingHorizontal:22,marginBottom:22}}>
          <SectionHdr title="Next Up" action={()=>navigate('Schedule')} actionLabel="Full schedule"/>
          {upcoming.map(s=>{
            const proj=projects.find(p=>p.id===s.projectId);
            const sc=s.status==='confirmed'?C.green:s.status==='tentative'?C.gold:C.red;
            return(
              <PressCard key={s.id} onPress={()=>navigate('Schedule')} accent={proj?proj.accent:C.gold} style={{backgroundColor:C.card,padding:16,marginBottom:8}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                  <View style={{width:4,alignSelf:'stretch',borderRadius:2,backgroundColor:proj?proj.accent:C.gold,marginRight:14}}/>
                  <View style={{flex:1}}>
                    <Text style={{color:C.text,fontSize:14,fontWeight:'700'}}>{s.title}</Text>
                    <Text style={{color:proj?proj.accent:C.textSub,fontSize:12,fontWeight:'600',marginTop:2}}>{proj?proj.name:'No project'}</Text>
                    <Text style={{color:C.textSub,fontSize:12,marginTop:2}}>{fmtDate(s.date)} - {s.callTime} call</Text>
                  </View>
                  <Badge label={s.status} color={sc}/>
                </View>
              </PressCard>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};

const PROJ_FILTER_OPTS=[{value:'all',label:'All',color:C.textSub},{value:'active',label:'Active',color:C.teal},{value:'pending',label:'Pending',color:C.gold},{value:'completed',label:'Completed',color:C.green},{value:'on-hold',label:'On Hold',color:C.orange}];
const PROJ_STATUS_OPTS=[{value:'active',label:'Active',color:C.teal},{value:'pending',label:'Pending',color:C.gold},{value:'completed',label:'Completed',color:C.green},{value:'on-hold',label:'On Hold',color:C.orange}];
const emptyProj=()=>({name:'',type:'',client:'',budget:'',spent:'',status:'active',accent:C.gold,location:'',notes:'',startDate:'',endDate:''});

const ProjectsScreen=({store})=>{
  const{projects,crew,addProject,updateProject,deleteProject,assignCrewToProject,removeCrewFromProject}=store;
  const[search,setSearch]=useState('');
  const[filter,setFilter]=useState('all');
  const[sheet,setSheet]=useState(null);
  const[form,setForm]=useState(emptyProj());
  const[crewSheet,setCrewSheet]=useState(null);
  const visible=projects.filter(p=>{
    if(filter!=='all'&&p.status!==filter)return false;
    const q=search.toLowerCase();
    return!q||p.name.toLowerCase().includes(q)||p.client.toLowerCase().includes(q)||p.type.toLowerCase().includes(q);
  });
  const openAdd=()=>{setForm(emptyProj());setSheet('add');};
  const openEdit=p=>{setForm({...p,budget:String(p.budget),spent:String(p.spent)});setSheet(p);};
  const save=()=>{
    if(!form.name.trim()){Alert.alert('Required','Project name is required');return;}
    const d={...form,budget:Number(form.budget)||0,spent:Number(form.spent)||0};
    sheet==='add'?addProject(d):updateProject({...sheet,...d});
    setSheet(null);
  };
  const del=p=>Alert.alert('Delete Project','Remove '+p.name+'? This cannot be undone.',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>deleteProject(p.id)}]);
  const statusCol=s=>({active:C.teal,pending:C.gold,completed:C.green,'on-hold':C.orange}[s]||C.textSub);
  return(
    <View style={{flex:1,backgroundColor:C.bg}}>
      <View style={{paddingTop:58,paddingHorizontal:22,paddingBottom:10}}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
          <Text style={{color:C.text,fontSize:28,fontWeight:'900'}}>Projects</Text>
          <TouchableOpacity onPress={openAdd} style={{backgroundColor:C.gold,borderRadius:22,paddingHorizontal:18,paddingVertical:9}}>
            <Text style={{color:C.bg,fontWeight:'800',fontSize:13}}>+ New</Text>
          </TouchableOpacity>
        </View>
        <SearchBar value={search} onChange={setSearch} placeholder="Search projects..."/>
        <StatusPicker value={filter} options={PROJ_FILTER_OPTS} onChange={setFilter} style={{marginBottom:6}}/>
      </View>
      <FlatList data={visible} keyExtractor={i=>i.id} contentContainerStyle={{paddingHorizontal:22,paddingBottom:120}}
        ListEmptyComponent={<Empty label="No projects found" sub="Try adjusting your search or add a new project." action={openAdd} actionLabel="New Project"/>}
        renderItem={({item:p})=>{
          const pct=p.budget>0?Math.round(p.spent/p.budget*100):0;
          const accentCol=pct>80?C.red:p.accent;
          return(
            <PressCard onPress={()=>openEdit(p)} accent={p.accent} style={{backgroundColor:C.card,marginBottom:12}}>
              <View style={{padding:18}}>
                <View style={{flexDirection:'row',alignItems:'flex-start',marginBottom:12}}>
                  <View style={{flex:1,marginRight:12}}>
                    <View style={{flexDirection:'row',alignItems:'center',marginBottom:4}}>
                      <View style={{width:10,height:10,borderRadius:5,backgroundColor:p.accent,marginRight:10}}/>
                      <Text style={{color:C.text,fontSize:17,fontWeight:'800'}}>{p.name}</Text>
                    </View>
                    <Text style={{color:C.textSub,fontSize:13}}>{p.type}</Text>
                    <Text style={{color:C.textSub,fontSize:12,marginTop:2}}>{p.client}</Text>
                    {p.location?<Text style={{color:C.textDim,fontSize:11,marginTop:4}}>{p.location}</Text>:null}
                    {(p.startDate||p.endDate)&&<Text style={{color:C.textDim,fontSize:11,marginTop:2}}>{p.startDate?fmtDate(p.startDate):''}{p.startDate&&p.endDate?' - ':''}{p.endDate?fmtDate(p.endDate):''}</Text>}
                  </View>
                  <View style={{alignItems:'flex-end'}}>
                    <Badge label={p.status} color={statusCol(p.status)}/>
                    <Text style={{color:accentCol,fontSize:18,fontWeight:'900',marginTop:8}}>{pct}%</Text>
                  </View>
                </View>
                <ProgressBar value={p.spent} total={p.budget} color={accentCol} height={7}/>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginTop:10}}>
                  <AvatarStack ids={p.crew} crew={crew} limit={5}/>
                  <Text style={{color:C.textSub,fontSize:12}}>{fmtGBP(p.spent)} spent</Text>
                </View>
              </View>
              <HR/>
              <View style={{flexDirection:'row'}}>
                {[{label:'Manage Crew',color:C.teal,onPress:()=>setCrewSheet(p.id)},{label:'Edit',color:C.gold,onPress:()=>openEdit(p)},{label:'Delete',color:C.red,onPress:()=>del(p)}].map((btn,i,arr)=>(
                  <React.Fragment key={btn.label}>
                    <TouchableOpacity onPress={btn.onPress} style={{flex:1,paddingVertical:12,alignItems:'center'}}>
                      <Text style={{color:btn.color,fontSize:12,fontWeight:'700'}}>{btn.label}</Text>
                    </TouchableOpacity>
                    {i<arr.length-1&&<View style={{width:1,backgroundColor:C.border}}/>}
                  </React.Fragment>
                ))}
              </View>
            </PressCard>
          );
        }}
      />
      <Sheet visible={!!sheet} onClose={()=>setSheet(null)} title={sheet==='add'?'New Project':'Edit Project'}>
        <Field label="Project Name"><TInput value={form.name} onChangeText={v=>setForm(f=>({...f,name:v}))} placeholder="e.g. Midnight Runner"/></Field>
        <Field label="Type"><TInput value={form.type} onChangeText={v=>setForm(f=>({...f,type:v}))} placeholder="e.g. Feature Film"/></Field>
        <Field label="Client"><TInput value={form.client} onChangeText={v=>setForm(f=>({...f,client:v}))} placeholder="e.g. Apex Studios"/></Field>
        <Field label="Location"><TInput value={form.location} onChangeText={v=>setForm(f=>({...f,location:v}))} placeholder="e.g. London, UK"/></Field>
        <View style={{flexDirection:'row'}}>
          <View style={{flex:1,marginRight:8}}><Field label="Budget (GBP)"><TInput value={form.budget} onChangeText={v=>setForm(f=>({...f,budget:v}))} placeholder="0" keyboardType="numeric"/></Field></View>
          <View style={{flex:1}}><Field label="Spent (GBP)"><TInput value={form.spent} onChangeText={v=>setForm(f=>({...f,spent:v}))} placeholder="0" keyboardType="numeric"/></Field></View>
        </View>
        <View style={{flexDirection:'row'}}>
          <View style={{flex:1,marginRight:8}}><Field label="Start Date"><TInput value={form.startDate} onChangeText={v=>setForm(f=>({...f,startDate:v}))} placeholder="YYYY-MM-DD"/></Field></View>
          <View style={{flex:1}}><Field label="End Date"><TInput value={form.endDate} onChangeText={v=>setForm(f=>({...f,endDate:v}))} placeholder="YYYY-MM-DD"/></Field></View>
        </View>
        <Field label="Status"><StatusPicker value={form.status} options={PROJ_STATUS_OPTS} onChange={v=>setForm(f=>({...f,status:v}))}/></Field>
        <Field label="Accent Colour"><ColourPicker value={form.accent} onChange={v=>setForm(f=>({...f,accent:v}))}/></Field>
        <Field label="Notes"><TInput value={form.notes} onChangeText={v=>setForm(f=>({...f,notes:v}))} placeholder="Production notes..." multiline/></Field>
        <Btn label="Save Project" onPress={save} style={{marginTop:8}}/>
        {sheet!=='add'&&<GhostBtn label="Delete Project" color={C.red} style={{marginTop:10}} onPress={()=>{setSheet(null);del(sheet);}}/>}
      </Sheet>
      <Sheet visible={!!crewSheet} onClose={()=>setCrewSheet(null)} title="Manage Project Crew">
        {crewSheet&&crew.map(c=>{
          const proj=projects.find(p=>p.id===crewSheet);
          const assigned=proj&&proj.crew.includes(c.id);
          return(
            <View key={c.id} style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingVertical:13,borderBottomWidth:1,borderBottomColor:C.border}}>
              <View style={{flexDirection:'row',alignItems:'center'}}>
                <Avatar initials={c.avatar} color={C.gold} size={38}/>
                <View style={{marginLeft:12}}>
                  <Text style={{color:C.text,fontSize:14,fontWeight:'700'}}>{c.name}</Text>
                  <View style={{flexDirection:'row',alignItems:'center',marginTop:2}}>
                    <Text style={{color:C.textSub,fontSize:12}}>{c.role}</Text>
                    <View style={{width:4,height:4,borderRadius:2,marginHorizontal:6,backgroundColor:c.available?C.green:C.red}}/>
                    <Text style={{color:c.available?C.green:C.red,fontSize:11}}>{c.available?'Available':'Unavailable'}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity onPress={()=>assigned?removeCrewFromProject(c.id,crewSheet):assignCrewToProject(c.id,crewSheet)}
                style={{backgroundColor:assigned?C.redBg:C.tealBg,borderRadius:22,paddingHorizontal:16,paddingVertical:7,borderWidth:1.5,borderColor:assigned?C.red+'40':C.teal+'40'}}>
                <Text style={{color:assigned?C.red:C.teal,fontSize:12,fontWeight:'700'}}>{assigned?'Remove':'Add'}</Text>
              </TouchableOpacity>
            </View>
          );
        })}
        <Btn label="Done" onPress={()=>setCrewSheet(null)} style={{marginTop:18}}/>
      </Sheet>
    </View>
  );
};


const CREW_STATUS_OPTS=[{value:'active',label:'Active',color:C.green},{value:'freelance',label:'Freelance',color:C.teal},{value:'inactive',label:'Inactive',color:C.textSub}];
const CREW_FILTER_OPTS=[{value:'all',label:'All',color:C.textSub},{value:'active',label:'Active',color:C.green},{value:'freelance',label:'Freelance',color:C.teal},{value:'available',label:'Available',color:C.blue}];
const emptyCrew=()=>({name:'',role:'',email:'',phone:'',rate:'',rateUnit:'day',status:'active',bio:'',skills:'',available:true});

const CrewScreen=({store})=>{
  const{crew,projects,addCrew,updateCrew,deleteCrew,toggleAvailability}=store;
  const[search,setSearch]=useState('');
  const[filter,setFilter]=useState('all');
  const[sheet,setSheet]=useState(null);
  const[form,setForm]=useState(emptyCrew());
  const visible=crew.filter(c=>{
    if(filter==='active'&&c.status!=='active')return false;
    if(filter==='freelance'&&c.status!=='freelance')return false;
    if(filter==='available'&&!c.available)return false;
    const q=search.toLowerCase();
    return!q||c.name.toLowerCase().includes(q)||c.role.toLowerCase().includes(q)||c.email.toLowerCase().includes(q);
  });
  const openAdd=()=>{setForm(emptyCrew());setSheet('add');};
  const openEdit=c=>{setForm({...c,rate:String(c.rate),skills:(c.skills||[]).join(', ')});setSheet(c);};
  const save=()=>{
    if(!form.name.trim()){Alert.alert('Required','Name is required');return;}
    const d={...form,rate:Number(form.rate)||0,skills:form.skills.split(',').map(s=>s.trim()).filter(Boolean)};
    sheet==='add'?addCrew(d):updateCrew({...sheet,...d});
    setSheet(null);
  };
  const del=c=>Alert.alert('Remove Crew Member','Remove '+c.name+'?',[{text:'Cancel',style:'cancel'},{text:'Remove',style:'destructive',onPress:()=>deleteCrew(c.id)}]);
  const statusCol=s=>({active:C.green,freelance:C.teal,inactive:C.textSub}[s]||C.textSub);
  return(
    <View style={{flex:1,backgroundColor:C.bg}}>
      <View style={{paddingTop:58,paddingHorizontal:22,paddingBottom:10}}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
          <Text style={{color:C.text,fontSize:28,fontWeight:'900'}}>Crew</Text>
          <TouchableOpacity onPress={openAdd} style={{backgroundColor:C.purple,borderRadius:22,paddingHorizontal:18,paddingVertical:9}}>
            <Text style={{color:C.text,fontWeight:'800',fontSize:13}}>+ Add</Text>
          </TouchableOpacity>
        </View>
        <SearchBar value={search} onChange={setSearch} placeholder="Search crew by name, role..."/>
        <StatusPicker value={filter} options={CREW_FILTER_OPTS} onChange={setFilter} style={{marginBottom:6}}/>
      </View>
      <FlatList data={visible} keyExtractor={i=>i.id} contentContainerStyle={{paddingHorizontal:22,paddingBottom:120}}
        ListEmptyComponent={<Empty label="No crew members" sub="Add your first crew member to get started." action={openAdd} actionLabel="Add Crew"/>}
        renderItem={({item:c})=>{
          const memberProjects=projects.filter(p=>p.crew.includes(c.id));
          const sc=statusCol(c.status);
          return(
            <PressCard onPress={()=>openEdit(c)} accent={sc} style={{backgroundColor:C.card,marginBottom:10}}>
              <View style={{padding:18}}>
                <View style={{flexDirection:'row',alignItems:'flex-start'}}>
                  <View style={{position:'relative'}}>
                    <Avatar initials={c.avatar||c.name.slice(0,2).toUpperCase()} color={sc} size={52}/>
                    <View style={{position:'absolute',bottom:0,right:0,width:14,height:14,borderRadius:7,backgroundColor:c.available?C.green:C.red,borderWidth:2,borderColor:C.card}}/>
                  </View>
                  <View style={{flex:1,marginLeft:14}}>
                    <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
                      <Text style={{color:C.text,fontSize:16,fontWeight:'800'}}>{c.name}</Text>
                      <Badge label={c.status} color={sc}/>
                    </View>
                    <Text style={{color:C.textSub,fontSize:13,marginTop:3}}>{c.role}</Text>
                    <Text style={{color:C.textDim,fontSize:12,marginTop:2}}>{c.email}</Text>
                    <View style={{flexDirection:'row',alignItems:'center',marginTop:6}}>
                      <Text style={{color:C.gold,fontSize:13,fontWeight:'700'}}>{fmtGBP(c.rate)} / {c.rateUnit}</Text>
                      {memberProjects.length>0&&<Text style={{color:C.textDim,fontSize:12,marginLeft:10}}>{memberProjects.length} project{memberProjects.length>1?'s':''}</Text>}
                    </View>
                  </View>
                </View>
                {(c.skills||[]).length>0&&(
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop:12}}>
                    {(c.skills||[]).map((sk,i)=>(
                      <View key={i} style={{backgroundColor:C.muted,borderRadius:22,paddingHorizontal:10,paddingVertical:4,marginRight:6}}>
                        <Text style={{color:C.textSub,fontSize:11,fontWeight:'600'}}>{sk}</Text>
                      </View>
                    ))}
                  </ScrollView>
                )}
                {memberProjects.length>0&&(
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginTop:8}}>
                    {memberProjects.map(p=>(
                      <View key={p.id} style={{flexDirection:'row',alignItems:'center',backgroundColor:p.accent+'18',borderRadius:22,paddingHorizontal:10,paddingVertical:4,marginRight:6,borderWidth:1,borderColor:p.accent+'35'}}>
                        <View style={{width:6,height:6,borderRadius:3,backgroundColor:p.accent,marginRight:6}}/>
                        <Text style={{color:p.accent,fontSize:11,fontWeight:'600'}}>{p.name}</Text>
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>
              <HR/>
              <View style={{flexDirection:'row'}}>
                <TouchableOpacity onPress={()=>toggleAvailability(c.id)} style={{flex:1.5,paddingVertical:12,alignItems:'center'}}>
                  <Text style={{color:c.available?C.red:C.green,fontSize:12,fontWeight:'700'}}>{c.available?'Mark Unavailable':'Mark Available'}</Text>
                </TouchableOpacity>
                <View style={{width:1,backgroundColor:C.border}}/>
                <TouchableOpacity onPress={()=>openEdit(c)} style={{flex:1,paddingVertical:12,alignItems:'center'}}>
                  <Text style={{color:C.gold,fontSize:12,fontWeight:'700'}}>Edit</Text>
                </TouchableOpacity>
                <View style={{width:1,backgroundColor:C.border}}/>
                <TouchableOpacity onPress={()=>del(c)} style={{flex:1,paddingVertical:12,alignItems:'center'}}>
                  <Text style={{color:C.red,fontSize:12,fontWeight:'700'}}>Remove</Text>
                </TouchableOpacity>
              </View>
            </PressCard>
          );
        }}
      />
      <Sheet visible={!!sheet} onClose={()=>setSheet(null)} title={sheet==='add'?'New Crew Member':'Edit Crew Member'}>
        <Field label="Full Name"><TInput value={form.name} onChangeText={v=>setForm(f=>({...f,name:v}))} placeholder="e.g. Sophia Marlowe"/></Field>
        <Field label="Role / Department"><TInput value={form.role} onChangeText={v=>setForm(f=>({...f,role:v}))} placeholder="e.g. Director"/></Field>
        <Field label="Email"><TInput value={form.email} onChangeText={v=>setForm(f=>({...f,email:v}))} placeholder="name@email.com"/></Field>
        <Field label="Phone"><TInput value={form.phone} onChangeText={v=>setForm(f=>({...f,phone:v}))} placeholder="+44 7700 900000"/></Field>
        <View style={{flexDirection:'row'}}>
          <View style={{flex:2,marginRight:8}}><Field label="Day Rate (GBP)"><TInput value={form.rate} onChangeText={v=>setForm(f=>({...f,rate:v}))} placeholder="0" keyboardType="numeric"/></Field></View>
          <View style={{flex:1}}><Field label="Unit"><View style={{flexDirection:'row'}}>{['day','hour','week'].map(u=>(<TouchableOpacity key={u} onPress={()=>setForm(f=>({...f,rateUnit:u}))} style={{flex:1,paddingVertical:10,borderRadius:10,marginRight:4,backgroundColor:form.rateUnit===u?C.gold:C.muted,alignItems:'center'}}><Text style={{color:form.rateUnit===u?C.bg:C.textSub,fontSize:11,fontWeight:'700'}}>{u}</Text></TouchableOpacity>))}</View></Field></View>
        </View>
        <Field label="Skills (comma separated)"><TInput value={form.skills} onChangeText={v=>setForm(f=>({...f,skills:v}))} placeholder="Direction, Lighting, Camera..."/></Field>
        <Field label="Status"><StatusPicker value={form.status} options={CREW_STATUS_OPTS} onChange={v=>setForm(f=>({...f,status:v}))}/></Field>
        <Field label="Bio"><TInput value={form.bio} onChangeText={v=>setForm(f=>({...f,bio:v}))} placeholder="Short bio..." multiline/></Field>
        <Btn label="Save" onPress={save} style={{marginTop:8}}/>
        {sheet!=='add'&&<GhostBtn label="Remove from Crew" color={C.red} style={{marginTop:10}} onPress={()=>{setSheet(null);del(sheet);}}/>}
      </Sheet>
    </View>
  );
};

const SHIFT_STATUS_OPTS=[{value:'confirmed',label:'Confirmed',color:C.green},{value:'tentative',label:'Tentative',color:C.gold},{value:'cancelled',label:'Cancelled',color:C.red}];
const SHIFT_FILTER_OPTS=[{value:'all',label:'All',color:C.textSub},{value:'upcoming',label:'Upcoming',color:C.teal},{value:'confirmed',label:'Confirmed',color:C.green},{value:'tentative',label:'Tentative',color:C.gold},{value:'past',label:'Past',color:C.textDim}];
const emptyShift=()=>({projectId:'',title:'',date:'',callTime:'',wrapTime:'',location:'',status:'confirmed',notes:'',crew:[]});

const ScheduleScreen=({store})=>{
  const{shifts,projects,crew,addShift,updateShift,deleteShift}=store;
  const[search,setSearch]=useState('');
  const[filter,setFilter]=useState('upcoming');
  const[sheet,setSheet]=useState(null);
  const[form,setForm]=useState(emptyShift());
  const sorted=[...shifts].sort((a,b)=>a.date.localeCompare(b.date));
  const visible=sorted.filter(s=>{
    const isPast=s.date<today();
    if(filter==='upcoming'&&isPast)return false;
    if(filter==='past'&&!isPast)return false;
    if(filter==='confirmed'&&s.status!=='confirmed')return false;
    if(filter==='tentative'&&s.status!=='tentative')return false;
    const q=search.toLowerCase();
    return!q||s.title.toLowerCase().includes(q)||(s.location||'').toLowerCase().includes(q);
  });
  const openAdd=()=>{setForm(emptyShift());setSheet('add');};
  const openEdit=s=>{setForm({...s});setSheet(s);};
  const save=()=>{
    if(!form.title.trim()){Alert.alert('Required','Title is required');return;}
    sheet==='add'?addShift(form):updateShift({...sheet,...form});
    setSheet(null);
  };
  const del=s=>Alert.alert('Delete Shift','Remove this shift?',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>deleteShift(s.id)}]);
  const sc=s=>({confirmed:C.green,tentative:C.gold,cancelled:C.red}[s]||C.textSub);
  return(
    <View style={{flex:1,backgroundColor:C.bg}}>
      <View style={{paddingTop:58,paddingHorizontal:22,paddingBottom:10}}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
          <Text style={{color:C.text,fontSize:28,fontWeight:'900'}}>Schedule</Text>
          <TouchableOpacity onPress={openAdd} style={{backgroundColor:C.blue,borderRadius:22,paddingHorizontal:18,paddingVertical:9}}>
            <Text style={{color:C.text,fontWeight:'800',fontSize:13}}>+ Shift</Text>
          </TouchableOpacity>
        </View>
        <SearchBar value={search} onChange={setSearch} placeholder="Search shifts..."/>
        <StatusPicker value={filter} options={SHIFT_FILTER_OPTS} onChange={setFilter} style={{marginBottom:6}}/>
      </View>
      <FlatList data={visible} keyExtractor={i=>i.id} contentContainerStyle={{paddingHorizontal:22,paddingBottom:120}}
        ListEmptyComponent={<Empty label="No shifts found" sub="Schedule your first shoot day or meeting." action={openAdd} actionLabel="Add Shift"/>}
        renderItem={({item:s})=>{
          const proj=projects.find(p=>p.id===s.projectId);
          const isPast=s.date<today();
          const statusColor=sc(s.status);
          return(
            <PressCard onPress={()=>openEdit(s)} accent={proj?proj.accent:C.gold} style={{backgroundColor:isPast?C.surface:C.card,marginBottom:10,opacity:isPast?0.65:1}}>
              <View style={{padding:16}}>
                <View style={{flexDirection:'row',alignItems:'flex-start',justifyContent:'space-between'}}>
                  <View style={{flex:1,marginRight:10}}>
                    <Text style={{color:C.text,fontSize:15,fontWeight:'800',marginBottom:4}}>{s.title}</Text>
                    <Text style={{color:proj?proj.accent:C.textSub,fontSize:12,fontWeight:'700'}}>{proj?proj.name:'No project'}</Text>
                    <Text style={{color:C.textSub,fontSize:12,marginTop:4}}>{fmtDate(s.date)}</Text>
                    {(s.callTime||s.wrapTime)&&<Text style={{color:C.textDim,fontSize:12}}>{s.callTime?'Call '+s.callTime:''}{s.callTime&&s.wrapTime?'  ':''}{s.wrapTime?'Wrap '+s.wrapTime:''}</Text>}
                    {s.location&&<Text style={{color:C.textDim,fontSize:12,marginTop:2}}>{s.location}</Text>}
                  </View>
                  <Badge label={s.status} color={statusColor}/>
                </View>
                {s.crew.length>0&&<View style={{marginTop:10}}><AvatarStack ids={s.crew} crew={crew} limit={7}/></View>}
                {s.notes?<Text style={{color:C.textDim,fontSize:12,marginTop:8,fontStyle:'italic'}} numberOfLines={2}>{s.notes}</Text>:null}
              </View>
              <HR/>
              <View style={{flexDirection:'row'}}>
                <TouchableOpacity onPress={()=>openEdit(s)} style={{flex:1,paddingVertical:12,alignItems:'center'}}><Text style={{color:C.gold,fontSize:12,fontWeight:'700'}}>Edit</Text></TouchableOpacity>
                <View style={{width:1,backgroundColor:C.border}}/>
                <TouchableOpacity onPress={()=>del(s)} style={{flex:1,paddingVertical:12,alignItems:'center'}}><Text style={{color:C.red,fontSize:12,fontWeight:'700'}}>Delete</Text></TouchableOpacity>
              </View>
            </PressCard>
          );
        }}
      />
      <Sheet visible={!!sheet} onClose={()=>setSheet(null)} title={sheet==='add'?'New Shift':'Edit Shift'}>
        <Field label="Title"><TInput value={form.title} onChangeText={v=>setForm(f=>({...f,title:v}))} placeholder="e.g. Shoot Day 12 - Ext. Warehouse"/></Field>
        <Field label="Project">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {projects.map(p=>(<TouchableOpacity key={p.id} onPress={()=>setForm(f=>({...f,projectId:p.id}))} style={{marginRight:8,paddingHorizontal:14,paddingVertical:7,borderRadius:22,backgroundColor:form.projectId===p.id?p.accent:C.muted,borderWidth:1.5,borderColor:form.projectId===p.id?p.accent:'transparent'}}><Text style={{color:form.projectId===p.id?C.bg:C.textSub,fontSize:12,fontWeight:'700'}}>{p.name}</Text></TouchableOpacity>))}
          </ScrollView>
        </Field>
        <Field label="Date"><TInput value={form.date} onChangeText={v=>setForm(f=>({...f,date:v}))} placeholder="YYYY-MM-DD"/></Field>
        <View style={{flexDirection:'row'}}>
          <View style={{flex:1,marginRight:8}}><Field label="Call Time"><TInput value={form.callTime} onChangeText={v=>setForm(f=>({...f,callTime:v}))} placeholder="06:00"/></Field></View>
          <View style={{flex:1}}><Field label="Wrap Time"><TInput value={form.wrapTime} onChangeText={v=>setForm(f=>({...f,wrapTime:v}))} placeholder="20:00"/></Field></View>
        </View>
        <Field label="Location"><TInput value={form.location} onChangeText={v=>setForm(f=>({...f,location:v}))} placeholder="e.g. Shepperton Studios"/></Field>
        <Field label="Status"><StatusPicker value={form.status} options={SHIFT_STATUS_OPTS} onChange={v=>setForm(f=>({...f,status:v}))}/></Field>
        <Field label="Assign Crew">
          <View style={{flexDirection:'row',flexWrap:'wrap'}}>
            {crew.map(c=>{
              const sel=form.crew.includes(c.id);
              return(<TouchableOpacity key={c.id} onPress={()=>setForm(f=>({...f,crew:sel?f.crew.filter(x=>x!==c.id):[...f.crew,c.id]}))} style={{flexDirection:'row',alignItems:'center',marginRight:8,marginBottom:8,paddingHorizontal:10,paddingVertical:6,borderRadius:22,backgroundColor:sel?C.tealBg:C.muted,borderWidth:1.5,borderColor:sel?C.teal+'50':'transparent'}}><Avatar initials={c.avatar||c.name.slice(0,2)} color={sel?C.teal:C.textDim} size={18}/><Text style={{color:sel?C.teal:C.textSub,fontSize:12,fontWeight:'600',marginLeft:6}}>{c.name.split(' ')[0]}</Text></TouchableOpacity>);
            })}
          </View>
        </Field>
        <Field label="Notes"><TInput value={form.notes} onChangeText={v=>setForm(f=>({...f,notes:v}))} placeholder="Notes for the crew..." multiline/></Field>
        <Btn label="Save Shift" onPress={save} style={{marginTop:8}}/>
        {sheet!=='add'&&<GhostBtn label="Delete Shift" color={C.red} style={{marginTop:10}} onPress={()=>{setSheet(null);del(sheet);}}/>}
      </Sheet>
    </View>
  );
};

const MessagesScreen=({store})=>{
  const{messages,projects,crew,addMessage,markRead,markAllRead,deleteMsg}=store;
  const[search,setSearch]=useState('');
  const[filterProj,setFilterProj]=useState('all');
  const[compose,setCompose]=useState(false);
  const[msgText,setMsgText]=useState('');
  const[msgProj,setMsgProj]=useState('');
  const[msgFrom,setMsgFrom]=useState('');
  const visible=messages.filter(m=>{
    if(filterProj!=='all'&&m.projectId!==filterProj)return false;
    const q=search.toLowerCase();
    return!q||m.text.toLowerCase().includes(q)||m.from.toLowerCase().includes(q);
  }).sort((a,b)=>b.ts.localeCompare(a.ts));
  const unread=messages.filter(m=>!m.read).length;
  const send=()=>{
    if(!msgText.trim()){Alert.alert('Required','Message text is required');return;}
    const sender=crew.find(c=>c.id===msgFrom);
    addMessage({projectId:msgProj,from:sender?sender.name:'You',fromId:msgFrom,avatar:sender?sender.avatar:'ME',text:msgText.trim()});
    setMsgText('');setMsgProj('');setMsgFrom('');setCompose(false);
  };
  const delMsg=m=>Alert.alert('Delete Message','Remove this message?',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>deleteMsg(m.id)}]);
  const fmtTs=(ts)=>{
    const diff=Math.floor((Date.now()-new Date(ts))/60000);
    if(diff<1)return'Just now';if(diff<60)return diff+'m ago';if(diff<1440)return Math.floor(diff/60)+'h ago';
    return fmtDate(ts.split('T')[0]);
  };
  const projFilterOpts=[{value:'all',label:'All',color:C.textSub},...projects.map(p=>({value:p.id,label:p.name,color:p.accent}))];
  return(
    <View style={{flex:1,backgroundColor:C.bg}}>
      <View style={{paddingTop:58,paddingHorizontal:22,paddingBottom:10}}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
          <View style={{flexDirection:'row',alignItems:'center'}}>
            <Text style={{color:C.text,fontSize:28,fontWeight:'900'}}>Messages</Text>
            {unread>0&&(<View style={{marginLeft:10,backgroundColor:C.red,borderRadius:12,paddingHorizontal:8,paddingVertical:3}}><Text style={{color:C.text,fontSize:11,fontWeight:'800'}}>{unread}</Text></View>)}
          </View>
          <View style={{flexDirection:'row'}}>
            {unread>0&&(<TouchableOpacity onPress={markAllRead} style={{backgroundColor:C.tealBg,borderRadius:18,paddingHorizontal:12,paddingVertical:7,marginRight:8,borderWidth:1.5,borderColor:C.teal+'40'}}><Text style={{color:C.teal,fontSize:12,fontWeight:'700'}}>Read all</Text></TouchableOpacity>)}
            <TouchableOpacity onPress={()=>setCompose(true)} style={{backgroundColor:C.teal,borderRadius:22,paddingHorizontal:18,paddingVertical:9}}>
              <Text style={{color:C.bg,fontWeight:'800',fontSize:13}}>+ New</Text>
            </TouchableOpacity>
          </View>
        </View>
        <SearchBar value={search} onChange={setSearch} placeholder="Search messages..."/>
        <StatusPicker value={filterProj} options={projFilterOpts} onChange={setFilterProj} style={{marginBottom:6}}/>
      </View>
      <FlatList data={visible} keyExtractor={i=>i.id} contentContainerStyle={{paddingHorizontal:22,paddingBottom:120}}
        ListEmptyComponent={<Empty label="No messages" sub="Send the first message to your crew." action={()=>setCompose(true)} actionLabel="New Message"/>}
        renderItem={({item:m})=>{
          const proj=projects.find(p=>p.id===m.projectId);
          return(
            <TouchableOpacity onPress={()=>markRead(m.id)} style={{backgroundColor:m.read?C.card:C.cardHi,borderRadius:16,borderWidth:1.5,borderColor:m.read?C.border:C.gold+'40',padding:16,marginBottom:8}}>
              <View style={{flexDirection:'row',alignItems:'flex-start'}}>
                <View style={{position:'relative'}}>
                  <Avatar initials={m.avatar} color={proj?proj.accent:C.gold} size={42}/>
                  {!m.read&&(<View style={{position:'absolute',top:-2,right:-2,width:11,height:11,borderRadius:6,backgroundColor:C.red,borderWidth:2,borderColor:C.bg}}/>)}
                </View>
                <View style={{flex:1,marginLeft:12}}>
                  <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:3}}>
                    <Text style={{color:C.text,fontSize:14,fontWeight:m.read?'600':'800'}}>{m.from}</Text>
                    <Text style={{color:C.textDim,fontSize:11}}>{fmtTs(m.ts)}</Text>
                  </View>
                  {proj&&(<View style={{flexDirection:'row',alignItems:'center',marginBottom:5}}><View style={{width:6,height:6,borderRadius:3,backgroundColor:proj.accent,marginRight:6}}/><Text style={{color:proj.accent,fontSize:11,fontWeight:'700'}}>{proj.name}</Text></View>)}
                  <Text style={{color:m.read?C.textSub:C.text,fontSize:13,lineHeight:19}} numberOfLines={2}>{m.text}</Text>
                </View>
              </View>
              <View style={{flexDirection:'row',justifyContent:'flex-end',marginTop:10}}>
                {!m.read&&(<TouchableOpacity onPress={()=>markRead(m.id)} style={{marginRight:14}}><Text style={{color:C.teal,fontSize:12,fontWeight:'700'}}>Mark read</Text></TouchableOpacity>)}
                <TouchableOpacity onPress={()=>delMsg(m)}><Text style={{color:C.red,fontSize:12,fontWeight:'700'}}>Delete</Text></TouchableOpacity>
              </View>
            </TouchableOpacity>
          );
        }}
      />
      <Sheet visible={compose} onClose={()=>setCompose(false)} title="New Message">
        <Field label="From (Crew Member)">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {crew.map(c=>(<TouchableOpacity key={c.id} onPress={()=>setMsgFrom(c.id)} style={{flexDirection:'row',alignItems:'center',marginRight:8,paddingHorizontal:12,paddingVertical:7,borderRadius:22,backgroundColor:msgFrom===c.id?C.teal:C.muted,borderWidth:1.5,borderColor:msgFrom===c.id?C.teal:'transparent'}}><Avatar initials={c.avatar} color={msgFrom===c.id?C.bg:C.textSub} size={18}/><Text style={{color:msgFrom===c.id?C.bg:C.textSub,fontSize:12,fontWeight:'700',marginLeft:6}}>{c.name.split(' ')[0]}</Text></TouchableOpacity>))}
          </ScrollView>
        </Field>
        <Field label="Project (optional)">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity onPress={()=>setMsgProj('')} style={{marginRight:8,paddingHorizontal:12,paddingVertical:7,borderRadius:22,backgroundColor:msgProj===''?C.muted:C.surface,borderWidth:1.5,borderColor:msgProj===''?C.textSub:'transparent'}}><Text style={{color:msgProj===''?C.text:C.textSub,fontSize:12,fontWeight:'700'}}>General</Text></TouchableOpacity>
            {projects.map(p=>(<TouchableOpacity key={p.id} onPress={()=>setMsgProj(p.id)} style={{marginRight:8,paddingHorizontal:12,paddingVertical:7,borderRadius:22,backgroundColor:msgProj===p.id?p.accent:C.muted,borderWidth:1.5,borderColor:msgProj===p.id?p.accent:'transparent'}}><Text style={{color:msgProj===p.id?C.bg:C.textSub,fontSize:12,fontWeight:'700'}}>{p.name}</Text></TouchableOpacity>))}
          </ScrollView>
        </Field>
        <Field label="Message"><TInput value={msgText} onChangeText={setMsgText} placeholder="Type your message to the crew..." multiline/></Field>
        <Btn label="Send Message" onPress={send} color={C.teal} style={{marginTop:8}}/>
      </Sheet>
    </View>
  );
};


const INV_STATUS_OPTS=[{value:'draft',label:'Draft',color:C.textSub},{value:'sent',label:'Sent',color:C.blue},{value:'paid',label:'Paid',color:C.green},{value:'overdue',label:'Overdue',color:C.red}];
const INV_FILTER_OPTS=[{value:'all',label:'All',color:C.textSub},{value:'draft',label:'Draft',color:C.textSub},{value:'sent',label:'Sent',color:C.blue},{value:'overdue',label:'Overdue',color:C.red},{value:'paid',label:'Paid',color:C.green}];
const emptyInv=()=>({number:'INV-'+new Date().getFullYear()+'-'+String(Date.now()).slice(-3),projectId:'',client:'',amount:'',status:'draft',issueDate:today(),dueDate:'',paidDate:'',notes:'',attachments:[]});

const InvoicesScreen=({store})=>{
  const{invoices,projects,addInvoice,updateInvoice,deleteInvoice,addAttachment,removeAttachment}=store;
  const[search,setSearch]=useState('');
  const[filter,setFilter]=useState('all');
  const[sheet,setSheet]=useState(null);
  const[viewSheet,setViewSheet]=useState(null);
  const[form,setForm]=useState(emptyInv());
  const[uploading,setUploading]=useState(false);
  const totals={
    paid:invoices.filter(i=>i.status==='paid').reduce((s,i)=>s+i.amount,0),
    sent:invoices.filter(i=>i.status==='sent').reduce((s,i)=>s+i.amount,0),
    overdue:invoices.filter(i=>i.status==='overdue').reduce((s,i)=>s+i.amount,0),
    draft:invoices.filter(i=>i.status==='draft').reduce((s,i)=>s+i.amount,0),
  };
  const totalAll=totals.paid+totals.sent+totals.overdue+totals.draft;
  const collRate=totalAll>0?Math.round(totals.paid/totalAll*100):0;
  const visible=invoices.filter(i=>{
    if(filter!=='all'&&i.status!==filter)return false;
    const q=search.toLowerCase();
    return!q||i.number.toLowerCase().includes(q)||i.client.toLowerCase().includes(q);
  }).sort((a,b)=>b.issueDate.localeCompare(a.issueDate));
  const openAdd=()=>{setForm(emptyInv());setSheet('add');};
  const openEdit=i=>{setForm({...i,amount:String(i.amount)});setSheet(i);};
  const save=()=>{
    if(!form.number.trim()){Alert.alert('Required','Invoice number is required');return;}
    const d={...form,amount:Number(form.amount)||0};
    sheet==='add'?addInvoice(d):updateInvoice({...sheet,...d});
    setSheet(null);
  };
  const del=i=>Alert.alert('Delete Invoice','Delete '+i.number+'?',[{text:'Cancel',style:'cancel'},{text:'Delete',style:'destructive',onPress:()=>deleteInvoice(i.id)}]);
  const statusCol=s=>({draft:C.textSub,sent:C.blue,paid:C.green,overdue:C.red}[s]||C.textSub);
  const markAs=(inv,status)=>updateInvoice({...inv,status,paidDate:status==='paid'?today():inv.paidDate});
  const handleUpload=(invId)=>{
    setUploading(true);
    setTimeout(()=>{
      const fn=pickFakeFile();
      addAttachment(invId,fn);
      setUploading(false);
      Alert.alert('File Attached',fn+' has been attached to this invoice.');
    },1200);
  };
  const handleFormUpload=()=>{
    setUploading(true);
    setTimeout(()=>{
      const fn=pickFakeFile();
      setForm(f=>({...f,attachments:[...f.attachments,fn]}));
      setUploading(false);
    },900);
  };
  const removeFormAttachment=filename=>setForm(f=>({...f,attachments:f.attachments.filter(x=>x!==filename)}));
  return(
    <View style={{flex:1,backgroundColor:C.bg}}>
      <View style={{paddingTop:58,paddingHorizontal:22,paddingBottom:10}}>
        <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:16}}>
          <Text style={{color:C.text,fontSize:28,fontWeight:'900'}}>Invoices</Text>
          <TouchableOpacity onPress={openAdd} style={{backgroundColor:C.green,borderRadius:22,paddingHorizontal:18,paddingVertical:9}}>
            <Text style={{color:C.bg,fontWeight:'800',fontSize:13}}>+ New</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom:14}}>
          {[{label:'Paid',val:totals.paid,color:C.green},{label:'Outstanding',val:totals.sent,color:C.blue},{label:'Overdue',val:totals.overdue,color:C.red},{label:'Draft',val:totals.draft,color:C.textSub},{label:'Collected',val:collRate,color:C.gold,pct:true}].map(t=>(
            <View key={t.label} style={{backgroundColor:C.card,borderRadius:16,padding:16,marginRight:10,borderWidth:1.5,borderColor:C.border,minWidth:120}}>
              <Text style={{color:t.color,fontSize:20,fontWeight:'900'}}>{t.pct?t.val+'%':fmtGBP(t.val)}</Text>
              <Text style={{color:C.textSub,fontSize:11,marginTop:3}}>{t.label}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={{marginBottom:14}}>
          <ProgressBar value={totals.paid} total={totalAll} color={C.green} height={6}/>
          <Text style={{color:C.textDim,fontSize:11,marginTop:4,textAlign:'right'}}>{collRate}% collected</Text>
        </View>
        <SearchBar value={search} onChange={setSearch} placeholder="Search by number or client..."/>
        <StatusPicker value={filter} options={INV_FILTER_OPTS} onChange={setFilter} style={{marginBottom:6}}/>
      </View>
      <FlatList data={visible} keyExtractor={i=>i.id} contentContainerStyle={{paddingHorizontal:22,paddingBottom:120}}
        ListEmptyComponent={<Empty label="No invoices" sub="Create your first invoice to start tracking payments." action={openAdd} actionLabel="New Invoice"/>}
        renderItem={({item:inv})=>{
          const col=statusCol(inv.status);
          const proj=projects.find(p=>p.id===inv.projectId);
          const dueLabel=fmtDue(inv.dueDate);
          const hasAttachments=(inv.attachments||[]).length>0;
          return(
            <PressCard onPress={()=>setViewSheet(inv)} accent={col} style={{backgroundColor:C.card,marginBottom:12}}>
              <View style={{padding:18}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                  <View style={{flex:1,marginRight:10}}>
                    <Text style={{color:C.text,fontSize:16,fontWeight:'800'}}>{inv.number}</Text>
                    <Text style={{color:C.textSub,fontSize:13,marginTop:2}}>{inv.client}</Text>
                    {proj&&(<View style={{flexDirection:'row',alignItems:'center',marginTop:3}}><View style={{width:6,height:6,borderRadius:3,backgroundColor:proj.accent,marginRight:5}}/><Text style={{color:proj.accent,fontSize:11,fontWeight:'600'}}>{proj.name}</Text></View>)}
                    <Text style={{color:C.textDim,fontSize:12,marginTop:4}}>Issued: {fmtDate(inv.issueDate)}{dueLabel?'  '+dueLabel:''}</Text>
                    {inv.status==='paid'&&inv.paidDate&&<Text style={{color:C.green,fontSize:12,marginTop:2}}>Paid {fmtDate(inv.paidDate)}</Text>}
                  </View>
                  <View style={{alignItems:'flex-end'}}>
                    <Text style={{color:C.text,fontSize:22,fontWeight:'900'}}>{fmtGBP(inv.amount)}</Text>
                    <Badge label={inv.status} color={col}/>
                    {hasAttachments&&(<View style={{flexDirection:'row',alignItems:'center',marginTop:5}}><View style={{width:8,height:8,borderRadius:4,backgroundColor:C.blue,marginRight:4}}/><Text style={{color:C.blue,fontSize:11,fontWeight:'600'}}>{inv.attachments.length} file{inv.attachments.length>1?'s':''}</Text></View>)}
                  </View>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {inv.status!=='sent'&&inv.status!=='paid'&&(<TouchableOpacity onPress={()=>markAs(inv,'sent')} style={{backgroundColor:C.blueBg,borderRadius:20,paddingHorizontal:14,paddingVertical:6,marginRight:8,borderWidth:1.5,borderColor:C.blue+'50'}}><Text style={{color:C.blue,fontSize:12,fontWeight:'700'}}>Mark Sent</Text></TouchableOpacity>)}
                  {inv.status!=='paid'&&(<TouchableOpacity onPress={()=>markAs(inv,'paid')} style={{backgroundColor:C.greenBg,borderRadius:20,paddingHorizontal:14,paddingVertical:6,marginRight:8,borderWidth:1.5,borderColor:C.green+'50'}}><Text style={{color:C.green,fontSize:12,fontWeight:'700'}}>Mark Paid</Text></TouchableOpacity>)}
                  {inv.status!=='overdue'&&inv.status!=='paid'&&(<TouchableOpacity onPress={()=>markAs(inv,'overdue')} style={{backgroundColor:C.redBg,borderRadius:20,paddingHorizontal:14,paddingVertical:6,marginRight:8,borderWidth:1.5,borderColor:C.red+'50'}}><Text style={{color:C.red,fontSize:12,fontWeight:'700'}}>Flag Overdue</Text></TouchableOpacity>)}
                  <TouchableOpacity onPress={()=>handleUpload(inv.id)} disabled={uploading} style={{backgroundColor:C.blueBg,borderRadius:20,paddingHorizontal:14,paddingVertical:6,borderWidth:1.5,borderColor:C.blue+'50',opacity:uploading?0.5:1}}>
                    <Text style={{color:C.blue,fontSize:12,fontWeight:'700'}}>{uploading?'Uploading...':'+ Attach File'}</Text>
                  </TouchableOpacity>
                </ScrollView>
                {hasAttachments&&(<View style={{flexDirection:'row',flexWrap:'wrap',marginTop:10}}>{inv.attachments.map(f=>(<AttachmentChip key={f} filename={f} onRemove={()=>removeAttachment(inv.id,f)}/>))}</View>)}
              </View>
              <HR/>
              <View style={{flexDirection:'row'}}>
                <TouchableOpacity onPress={()=>setViewSheet(inv)} style={{flex:1,paddingVertical:12,alignItems:'center'}}><Text style={{color:C.teal,fontSize:12,fontWeight:'700'}}>View</Text></TouchableOpacity>
                <View style={{width:1,backgroundColor:C.border}}/>
                <TouchableOpacity onPress={()=>openEdit(inv)} style={{flex:1,paddingVertical:12,alignItems:'center'}}><Text style={{color:C.gold,fontSize:12,fontWeight:'700'}}>Edit</Text></TouchableOpacity>
                <View style={{width:1,backgroundColor:C.border}}/>
                <TouchableOpacity onPress={()=>del(inv)} style={{flex:1,paddingVertical:12,alignItems:'center'}}><Text style={{color:C.red,fontSize:12,fontWeight:'700'}}>Delete</Text></TouchableOpacity>
              </View>
            </PressCard>
          );
        }}
      />
      <Sheet visible={!!viewSheet} onClose={()=>setViewSheet(null)} title={viewSheet?viewSheet.number:''}>
        {viewSheet&&(()=>{
          const inv=invoices.find(i=>i.id===viewSheet.id)||viewSheet;
          const col=statusCol(inv.status);
          const proj=projects.find(p=>p.id===inv.projectId);
          return(
            <View>
              <View style={{backgroundColor:C.card,borderRadius:16,padding:18,marginBottom:16,borderWidth:1.5,borderColor:col+'40'}}>
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
                  <Text style={{color:C.text,fontSize:28,fontWeight:'900'}}>{fmtGBP(inv.amount)}</Text>
                  <Badge label={inv.status} color={col}/>
                </View>
                <HR style={{marginBottom:12}}/>
                {[{label:'Client',val:inv.client},{label:'Project',val:proj?proj.name:'None'},{label:'Issue Date',val:fmtDate(inv.issueDate)},{label:'Due Date',val:inv.dueDate?fmtDate(inv.dueDate)+(fmtDue(inv.dueDate)?'  ('+fmtDue(inv.dueDate)+')':''):'Not set'},inv.paidDate&&{label:'Paid On',val:fmtDate(inv.paidDate)}].filter(Boolean).map(row=>(
                  <View key={row.label} style={{flexDirection:'row',justifyContent:'space-between',paddingVertical:7,borderBottomWidth:1,borderBottomColor:C.border}}>
                    <Text style={{color:C.textDim,fontSize:13}}>{row.label}</Text>
                    <Text style={{color:C.text,fontSize:13,fontWeight:'600',maxWidth:'60%',textAlign:'right'}}>{row.val}</Text>
                  </View>
                ))}
                {inv.notes&&(<View style={{marginTop:12}}><Text style={{color:C.textDim,fontSize:11,fontWeight:'700',textTransform:'uppercase',letterSpacing:0.8,marginBottom:5}}>Notes</Text><Text style={{color:C.textSub,fontSize:13,lineHeight:19}}>{inv.notes}</Text></View>)}
              </View>
              <View style={{backgroundColor:C.card,borderRadius:16,padding:18,marginBottom:16,borderWidth:1.5,borderColor:C.border}}>
                <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:12}}>
                  <Text style={{color:C.text,fontSize:15,fontWeight:'800'}}>Attachments</Text>
                  <TouchableOpacity onPress={()=>{setUploading(true);setTimeout(()=>{const fn=pickFakeFile();addAttachment(inv.id,fn);setUploading(false);},1000);}} disabled={uploading}
                    style={{backgroundColor:C.blueBg,borderRadius:18,paddingHorizontal:14,paddingVertical:7,borderWidth:1.5,borderColor:C.blue+'50',opacity:uploading?0.5:1}}>
                    <Text style={{color:C.blue,fontSize:12,fontWeight:'700'}}>{uploading?'Uploading...':'+ Upload File'}</Text>
                  </TouchableOpacity>
                </View>
                {(inv.attachments||[]).length===0?(
                  <View style={{alignItems:'center',paddingVertical:20}}>
                    <Text style={{color:C.textDim,fontSize:28,marginBottom:8}}>--</Text>
                    <Text style={{color:C.textSub,fontSize:13}}>No files attached yet</Text>
                    <Text style={{color:C.textDim,fontSize:12,marginTop:4,textAlign:'center'}}>Tap Upload File to attach a PDF, PO or remittance</Text>
                  </View>
                ):(
                  <View style={{flexDirection:'row',flexWrap:'wrap'}}>
                    {inv.attachments.map(f=>(<AttachmentChip key={f} filename={f} onRemove={()=>removeAttachment(inv.id,f)}/>))}
                  </View>
                )}
              </View>
              <View style={{flexDirection:'row',marginBottom:12}}>
                {inv.status!=='paid'&&<Btn label="Mark as Paid" onPress={()=>{markAs(inv,'paid');setViewSheet(null);}} color={C.green} style={{flex:1,marginRight:8}}/>}
                {inv.status!=='sent'&&inv.status!=='paid'&&<Btn label="Mark Sent" onPress={()=>{markAs(inv,'sent');setViewSheet(null);}} color={C.blue} style={{flex:1}}/>}
              </View>
              <GhostBtn label="Edit Invoice" onPress={()=>{setViewSheet(null);openEdit(inv);}} color={C.gold} style={{marginBottom:10}}/>
              <GhostBtn label="Delete Invoice" onPress={()=>{setViewSheet(null);del(inv);}} color={C.red}/>
            </View>
          );
        })()}
      </Sheet>
      <Sheet visible={!!sheet} onClose={()=>setSheet(null)} title={sheet==='add'?'New Invoice':'Edit Invoice'}>
        <Field label="Invoice Number"><TInput value={form.number} onChangeText={v=>setForm(f=>({...f,number:v}))} placeholder="INV-2026-001"/></Field>
        <Field label="Client"><TInput value={form.client} onChangeText={v=>setForm(f=>({...f,client:v}))} placeholder="Client name"/></Field>
        <Field label="Project">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity onPress={()=>setForm(f=>({...f,projectId:''}))} style={{marginRight:8,paddingHorizontal:12,paddingVertical:7,borderRadius:22,backgroundColor:form.projectId===''?C.muted:C.surface,borderWidth:1.5,borderColor:form.projectId===''?C.textSub:'transparent'}}><Text style={{color:form.projectId===''?C.text:C.textSub,fontSize:12,fontWeight:'700'}}>None</Text></TouchableOpacity>
            {projects.map(p=>(<TouchableOpacity key={p.id} onPress={()=>setForm(f=>({...f,projectId:p.id,client:p.client}))} style={{marginRight:8,paddingHorizontal:12,paddingVertical:7,borderRadius:22,backgroundColor:form.projectId===p.id?p.accent:C.muted,borderWidth:1.5,borderColor:form.projectId===p.id?p.accent:'transparent'}}><Text style={{color:form.projectId===p.id?C.bg:C.textSub,fontSize:12,fontWeight:'700'}}>{p.name}</Text></TouchableOpacity>))}
          </ScrollView>
        </Field>
        <Field label="Amount (GBP)"><TInput value={form.amount} onChangeText={v=>setForm(f=>({...f,amount:v}))} placeholder="0" keyboardType="numeric"/></Field>
        <View style={{flexDirection:'row'}}>
          <View style={{flex:1,marginRight:8}}><Field label="Issue Date"><TInput value={form.issueDate} onChangeText={v=>setForm(f=>({...f,issueDate:v}))} placeholder="YYYY-MM-DD"/></Field></View>
          <View style={{flex:1}}><Field label="Due Date"><TInput value={form.dueDate} onChangeText={v=>setForm(f=>({...f,dueDate:v}))} placeholder="YYYY-MM-DD"/></Field></View>
        </View>
        <Field label="Status"><StatusPicker value={form.status} options={INV_STATUS_OPTS} onChange={v=>setForm(f=>({...f,status:v}))}/></Field>
        <Field label="Notes"><TInput value={form.notes} onChangeText={v=>setForm(f=>({...f,notes:v}))} placeholder="Payment notes..." multiline/></Field>
        <Field label="Attachments">
          <View style={{flexDirection:'row',flexWrap:'wrap',marginBottom:8}}>
            {(form.attachments||[]).map(f=>(<AttachmentChip key={f} filename={f} onRemove={()=>removeFormAttachment(f)}/>))}
          </View>
          <TouchableOpacity onPress={handleFormUpload} disabled={uploading}
            style={{backgroundColor:C.blueBg,borderRadius:12,paddingVertical:12,alignItems:'center',borderWidth:1.5,borderColor:C.blue+'50',opacity:uploading?0.5:1}}>
            <Text style={{color:C.blue,fontSize:13,fontWeight:'700'}}>{uploading?'Uploading...':'+ Attach PDF / File'}</Text>
          </TouchableOpacity>
        </Field>
        <Btn label="Save Invoice" onPress={save} style={{marginTop:8}}/>
        {sheet!=='add'&&<GhostBtn label="Delete Invoice" color={C.red} style={{marginTop:10}} onPress={()=>{setSheet(null);del(sheet);}}/>}
      </Sheet>
    </View>
  );
};


const ReportsScreen=({store})=>{
  const{projects,invoices,crew,shifts}=store;
  const totalBudget=projects.reduce((s,p)=>s+p.budget,0);
  const totalSpent=projects.reduce((s,p)=>s+p.spent,0);
  const totalInv=invoices.reduce((s,i)=>s+i.amount,0);
  const totalPaid=invoices.filter(i=>i.status==='paid').reduce((s,i)=>s+i.amount,0);
  const totalOverdue=invoices.filter(i=>i.status==='overdue').reduce((s,i)=>s+i.amount,0);
  const burnPct=totalBudget>0?Math.round(totalSpent/totalBudget*100):0;
  const burnCol=burnPct>80?C.red:burnPct>65?C.gold:C.green;
  const activeProj=projects.filter(p=>p.status==='active').length;
  const completedProj=projects.filter(p=>p.status==='completed').length;
  const availCrew=crew.filter(c=>c.available).length;
  const upcomingShifts=shifts.filter(s=>s.date>=today()).length;
  const withAttachments=invoices.filter(i=>(i.attachments||[]).length>0).length;
  return(
    <ScrollView style={{flex:1,backgroundColor:C.bg}} contentContainerStyle={{paddingTop:60,paddingBottom:120}}>
      <View style={{paddingHorizontal:22,marginBottom:22}}>
        <Text style={{color:C.text,fontSize:28,fontWeight:'900',marginBottom:4}}>Reports</Text>
        <Text style={{color:C.textSub,fontSize:14}}>Real-time portfolio analytics</Text>
      </View>
      <View style={{paddingHorizontal:22,marginBottom:22}}>
        <SectionHdr title="Financial Overview"/>
        <View style={{backgroundColor:C.card,borderRadius:18,padding:20,borderWidth:1.5,borderColor:C.border}}>
          <View style={{flexDirection:'row',marginBottom:18}}>
            <View style={{flex:1}}><Text style={{color:C.textDim,fontSize:11,fontWeight:'700',textTransform:'uppercase',letterSpacing:0.8}}>Total Budget</Text><Text style={{color:C.text,fontSize:26,fontWeight:'900',marginTop:6}}>{fmtGBP(totalBudget)}</Text></View>
            <View style={{flex:1}}><Text style={{color:C.textDim,fontSize:11,fontWeight:'700',textTransform:'uppercase',letterSpacing:0.8}}>Total Spent</Text><Text style={{color:burnCol,fontSize:26,fontWeight:'900',marginTop:6}}>{fmtGBP(totalSpent)}</Text></View>
          </View>
          <ProgressBar value={totalSpent} total={totalBudget} color={burnCol} height={10}/>
          <Text style={{color:C.textDim,fontSize:12,marginTop:8,textAlign:'right'}}>{burnPct}% of portfolio budget consumed</Text>
          <HR style={{marginVertical:14}}/>
          <View style={{flexDirection:'row'}}>
            <View style={{flex:1}}><Text style={{color:C.green,fontSize:20,fontWeight:'900'}}>{fmtGBP(totalPaid)}</Text><Text style={{color:C.textDim,fontSize:11,marginTop:3}}>Invoices paid</Text></View>
            <View style={{flex:1}}><Text style={{color:C.red,fontSize:20,fontWeight:'900'}}>{fmtGBP(totalOverdue)}</Text><Text style={{color:C.textDim,fontSize:11,marginTop:3}}>Overdue</Text></View>
            <View style={{flex:1}}><Text style={{color:C.gold,fontSize:20,fontWeight:'900'}}>{totalInv>0?Math.round(totalPaid/totalInv*100):0}%</Text><Text style={{color:C.textDim,fontSize:11,marginTop:3}}>Collection rate</Text></View>
          </View>
        </View>
      </View>
      <View style={{paddingHorizontal:22,marginBottom:22}}>
        <SectionHdr title="Project Budget vs Spend"/>
        <View style={{backgroundColor:C.card,borderRadius:18,padding:20,borderWidth:1.5,borderColor:C.border}}>
          {projects.map((p,i)=>(<AnimBar key={p.id} value={p.spent} max={p.budget} color={p.accent} label={p.name} subLabel={fmtGBP(p.spent)+' / '+fmtGBP(p.budget)} delay={i*100}/>))}
        </View>
      </View>
      <View style={{paddingHorizontal:22,marginBottom:22}}>
        <SectionHdr title="Revenue by Project"/>
        <View style={{backgroundColor:C.card,borderRadius:18,padding:20,borderWidth:1.5,borderColor:C.border}}>
          {projects.map((p,i)=>{const projInv=invoices.filter(inv=>inv.projectId===p.id).reduce((s,inv)=>s+inv.amount,0);return(<AnimBar key={p.id} value={projInv} max={totalInv||1} color={p.accent} label={p.name} subLabel={fmtGBP(projInv)} delay={i*80+200}/>);})}
        </View>
      </View>
      <View style={{paddingHorizontal:22,marginBottom:22}}>
        <SectionHdr title="Portfolio Stats"/>
        <View style={{flexDirection:'row',marginBottom:10}}>
          <View style={{flex:1,backgroundColor:C.card,borderRadius:16,padding:16,marginRight:10,borderWidth:1.5,borderColor:C.border}}><Text style={{color:C.teal,fontSize:30,fontWeight:'900'}}>{activeProj}</Text><Text style={{color:C.text,fontSize:12,fontWeight:'700',marginTop:4}}>Active</Text><Text style={{color:C.textSub,fontSize:11}}>projects</Text></View>
          <View style={{flex:1,backgroundColor:C.card,borderRadius:16,padding:16,borderWidth:1.5,borderColor:C.border}}><Text style={{color:C.green,fontSize:30,fontWeight:'900'}}>{completedProj}</Text><Text style={{color:C.text,fontSize:12,fontWeight:'700',marginTop:4}}>Completed</Text><Text style={{color:C.textSub,fontSize:11}}>projects</Text></View>
        </View>
        <View style={{flexDirection:'row',marginBottom:10}}>
          <View style={{flex:1,backgroundColor:C.card,borderRadius:16,padding:16,marginRight:10,borderWidth:1.5,borderColor:C.border}}><Text style={{color:C.purple,fontSize:30,fontWeight:'900'}}>{crew.length}</Text><Text style={{color:C.text,fontSize:12,fontWeight:'700',marginTop:4}}>Total Crew</Text><Text style={{color:C.textSub,fontSize:11}}>{availCrew} available now</Text></View>
          <View style={{flex:1,backgroundColor:C.card,borderRadius:16,padding:16,borderWidth:1.5,borderColor:C.border}}><Text style={{color:C.blue,fontSize:30,fontWeight:'900'}}>{upcomingShifts}</Text><Text style={{color:C.text,fontSize:12,fontWeight:'700',marginTop:4}}>Upcoming</Text><Text style={{color:C.textSub,fontSize:11}}>shoot days</Text></View>
        </View>
        <View style={{flexDirection:'row'}}>
          <View style={{flex:1,backgroundColor:C.card,borderRadius:16,padding:16,marginRight:10,borderWidth:1.5,borderColor:C.border}}><Text style={{color:C.gold,fontSize:30,fontWeight:'900'}}>{invoices.length}</Text><Text style={{color:C.text,fontSize:12,fontWeight:'700',marginTop:4}}>Total Invoices</Text><Text style={{color:C.textSub,fontSize:11}}>{withAttachments} with files</Text></View>
          <View style={{flex:1,backgroundColor:C.card,borderRadius:16,padding:16,borderWidth:1.5,borderColor:C.border}}><Text style={{color:C.orange,fontSize:30,fontWeight:'900'}}>{fmtGBP(totalBudget-totalSpent)}</Text><Text style={{color:C.text,fontSize:12,fontWeight:'700',marginTop:4}}>Remaining</Text><Text style={{color:C.textSub,fontSize:11}}>budget headroom</Text></View>
        </View>
      </View>
      <View style={{paddingHorizontal:22,marginBottom:22}}>
        <SectionHdr title="Crew Day Rates"/>
        <View style={{backgroundColor:C.card,borderRadius:18,padding:20,borderWidth:1.5,borderColor:C.border}}>
          {crew.map((c,i)=>(<AnimBar key={c.id} value={c.rate} max={Math.max(...crew.map(x=>x.rate),1)} color={ACCENTS[i%ACCENTS.length]} label={c.name+' - '+c.role} subLabel={fmtGBP(c.rate)+'/'+c.rateUnit} delay={i*80+400}/>))}
        </View>
      </View>
    </ScrollView>
  );
};

const MoreScreen=({store,navigate})=>{
  const{projects,crew,invoices,messages}=store;
  const totalBudget=projects.reduce((s,p)=>s+p.budget,0);
  const totalPaid=invoices.filter(i=>i.status==='paid').reduce((s,i)=>s+i.amount,0);
  const unread=messages.filter(m=>!m.read).length;
  const withFiles=invoices.filter(i=>(i.attachments||[]).length>0).length;
  const MenuItem=({label,sub,onPress,color=C.gold,badge})=>(
    <TouchableOpacity onPress={onPress} style={{flexDirection:'row',alignItems:'center',backgroundColor:C.card,borderRadius:16,padding:18,marginBottom:8,borderWidth:1.5,borderColor:C.border}}>
      <View style={{flex:1}}>
        <Text style={{color:C.text,fontSize:15,fontWeight:'700'}}>{label}</Text>
        {sub&&<Text style={{color:C.textSub,fontSize:12,marginTop:2}}>{sub}</Text>}
      </View>
      {badge>0&&(<View style={{backgroundColor:C.red,borderRadius:10,minWidth:20,height:20,alignItems:'center',justifyContent:'center',marginRight:8}}><Text style={{color:C.text,fontSize:11,fontWeight:'800'}}>{badge}</Text></View>)}
      <Text style={{color:color,fontSize:16,fontWeight:'700'}}>{'>'}</Text>
    </TouchableOpacity>
  );
  return(
    <ScrollView style={{flex:1,backgroundColor:C.bg}} contentContainerStyle={{paddingTop:60,paddingHorizontal:22,paddingBottom:120}}>
      <Text style={{color:C.text,fontSize:28,fontWeight:'900',marginBottom:4}}>More</Text>
      <Text style={{color:C.textSub,fontSize:14,marginBottom:24}}>Account and settings</Text>
      <View style={{backgroundColor:C.card,borderRadius:20,padding:22,marginBottom:24,borderWidth:1.5,borderColor:C.border}}>
        <View style={{flexDirection:'row',alignItems:'center',marginBottom:18}}>
          <View style={{width:56,height:56,borderRadius:18,backgroundColor:C.goldBg,alignItems:'center',justifyContent:'center',marginRight:14,borderWidth:2,borderColor:C.gold+'60'}}>
            <Text style={{color:C.gold,fontSize:22,fontWeight:'900'}}>CD</Text>
          </View>
          <View>
            <Text style={{color:C.text,fontSize:20,fontWeight:'900'}}>CrewDesk</Text>
            <Text style={{color:C.textSub,fontSize:13}}>Professional Crew Management</Text>
            <View style={{backgroundColor:C.goldBg,borderRadius:10,paddingHorizontal:8,paddingVertical:3,marginTop:5,alignSelf:'flex-start',borderWidth:1,borderColor:C.gold+'40'}}>
              <Text style={{color:C.gold,fontSize:10,fontWeight:'800',letterSpacing:0.5}}>PRO PLAN</Text>
            </View>
          </View>
        </View>
        <HR style={{marginBottom:16}}/>
        <View style={{flexDirection:'row'}}>
          {[{val:projects.length,label:'Projects',color:C.teal},{val:crew.length,label:'Crew',color:C.purple},{val:fmtGBP(totalPaid),label:'Collected',color:C.green},{val:withFiles,label:'Files',color:C.blue}].map(s=>(
            <View key={s.label} style={{flex:1,alignItems:'center'}}><Text style={{color:s.color,fontSize:18,fontWeight:'900'}}>{s.val}</Text><Text style={{color:C.textDim,fontSize:11,marginTop:2}}>{s.label}</Text></View>
          ))}
        </View>
      </View>
      <Text style={{color:C.textDim,fontSize:11,fontWeight:'700',textTransform:'uppercase',letterSpacing:1.3,marginBottom:10}}>Navigation</Text>
      <MenuItem label="Projects" sub={projects.length+' in portfolio'} onPress={()=>navigate('Projects')} color={C.teal}/>
      <MenuItem label="Crew" sub={crew.length+' crew members'} onPress={()=>navigate('Crew')} color={C.purple}/>
      <MenuItem label="Schedule" sub="Upcoming shoot days" onPress={()=>navigate('Schedule')} color={C.blue}/>
      <MenuItem label="Invoices" sub={withFiles+' with attachments'} onPress={()=>navigate('Invoices')} color={C.green}/>
      <MenuItem label="Messages" sub="Team communication" onPress={()=>navigate('Messages')} color={C.orange} badge={unread}/>
      <MenuItem label="Reports" sub="Portfolio analytics" onPress={()=>navigate('Reports')} color={C.gold}/>
      <Text style={{color:C.textDim,fontSize:11,fontWeight:'700',textTransform:'uppercase',letterSpacing:1.3,marginTop:18,marginBottom:10}}>App Info</Text>
      <View style={{backgroundColor:C.card,borderRadius:16,padding:18,borderWidth:1.5,borderColor:C.border,marginBottom:10}}>
        <Text style={{color:C.text,fontSize:14,fontWeight:'700',marginBottom:6}}>CrewDesk v8.0</Text>
        <Text style={{color:C.textSub,fontSize:13,lineHeight:20}}>Production-ready crew management. Invoice file attachments. Search and filter across all screens. Real-time portfolio burn tracking. Animated analytics.</Text>
      </View>
      <View style={{backgroundColor:C.card,borderRadius:16,padding:18,borderWidth:1.5,borderColor:C.border}}>
        <Text style={{color:C.textDim,fontSize:11,fontWeight:'700',textTransform:'uppercase',letterSpacing:0.8,marginBottom:10}}>Colour System</Text>
        <View style={{flexDirection:'row',flexWrap:'wrap'}}>
          {[{col:C.gold,name:'Gold'},{col:C.teal,name:'Teal'},{col:C.purple,name:'Purple'},{col:C.blue,name:'Blue'},{col:C.green,name:'Green'},{col:C.red,name:'Red'},{col:C.orange,name:'Orange'},{col:C.pink,name:'Pink'}].map(({col,name})=>(
            <View key={name} style={{flexDirection:'row',alignItems:'center',width:'50%',marginBottom:8}}>
              <View style={{width:14,height:14,borderRadius:7,backgroundColor:col,marginRight:8}}/>
              <Text style={{color:C.textSub,fontSize:12}}>{name}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const TABS=[{key:'Home',label:'Home',color:C.gold},{key:'Projects',label:'Projects',color:C.teal},{key:'Crew',label:'Crew',color:C.purple},{key:'Schedule',label:'Schedule',color:C.blue},{key:'Messages',label:'Messages',color:C.orange},{key:'Invoices',label:'Invoices',color:C.green},{key:'Reports',label:'Reports',color:C.pink},{key:'More',label:'More',color:C.textSub}];

const TabBar=({active,setActive,unreadMsgs})=>{
  const scrollRef=useRef(null);
  const activeIdx=TABS.findIndex(t=>t.key===active);
  useEffect(()=>{if(scrollRef.current){scrollRef.current.scrollTo({x:Math.max(0,activeIdx*76-SW/2+38),animated:true});}},[active]);
  return(
    <View style={{position:'absolute',bottom:0,left:0,right:0,backgroundColor:C.surface,borderTopWidth:1,borderTopColor:C.border,paddingBottom:Platform.OS==='ios'?24:10}}>
      <ScrollView ref={scrollRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal:10,paddingTop:10,paddingBottom:4}}>
        {TABS.map(tab=>{
          const isActive=active===tab.key;
          return(
            <TouchableOpacity key={tab.key} onPress={()=>setActive(tab.key)} style={{alignItems:'center',paddingHorizontal:16,paddingVertical:6,minWidth:68,borderRadius:18,backgroundColor:isActive?tab.color+'16':'transparent'}}>
              {isActive&&(<View style={{position:'absolute',top:0,left:18,right:18,height:3,backgroundColor:tab.color,borderRadius:2}}/>)}
              <View style={{position:'relative'}}>
                <Text style={{color:isActive?tab.color:C.textDim,fontSize:11,fontWeight:isActive?'800':'500',letterSpacing:0.3,marginTop:5}}>{tab.label}</Text>
                {tab.key==='Messages'&&unreadMsgs>0&&(<View style={{position:'absolute',top:-5,right:-14,backgroundColor:C.red,borderRadius:8,minWidth:16,height:16,alignItems:'center',justifyContent:'center',borderWidth:1.5,borderColor:C.surface}}><Text style={{color:C.text,fontSize:9,fontWeight:'900'}}>{unreadMsgs}</Text></View>)}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default function App(){
  const store=useStore();
  const[active,setActive]=useState('Home');
  const unreadMsgs=store.messages.filter(m=>!m.read).length;
  const navigate=screen=>setActive(screen);
  const renderScreen=()=>{
    switch(active){
      case'Home':     return<HomeScreen     store={store} navigate={navigate}/>;
      case'Projects': return<ProjectsScreen store={store}/>;
      case'Crew':     return<CrewScreen     store={store}/>;
      case'Schedule': return<ScheduleScreen store={store}/>;
      case'Messages': return<MessagesScreen store={store}/>;
      case'Invoices': return<InvoicesScreen store={store}/>;
      case'Reports':  return<ReportsScreen  store={store}/>;
      case'More':     return<MoreScreen     store={store} navigate={navigate}/>;
      default:        return<HomeScreen     store={store} navigate={navigate}/>;
    }
  };
  return(
    <View style={{flex:1,backgroundColor:C.bg}}>
      <StatusBar barStyle="light-content" backgroundColor={C.bg}/>
      {renderScreen()}
      <TabBar active={active} setActive={setActive} unreadMsgs={unreadMsgs}/>
    </View>
  );
}
