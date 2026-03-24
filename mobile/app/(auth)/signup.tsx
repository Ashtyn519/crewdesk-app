import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

const C = { bg: '#04080F', card: '#0A1020', border: '#1A2540', amber: '#F59E0B', text: '#FFFFFF', muted: '#64748B' };

export default function SignupScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup() {
    if (!email || !password) { Alert.alert('Error', 'Please enter your email and password.'); return; }
    if (password.length < 6) { Alert.alert('Error', 'Password must be at least 6 characters.'); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      Alert.alert('Sign Up Failed', error.message);
    } else {
      Alert.alert('Check your email', 'We sent a verification link to ' + email, [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]);
    }
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <LinearGradient colors={['#04080F', '#060C18']} style={StyleSheet.absoluteFill} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.logoRow}>
          <View style={styles.logoBox}><Ionicons name="flash" size={20} color="#04080F" /></View>
          <Text style={styles.logoText}>CrewDesk</Text>
        </View>
        <Text style={styles.heading}>Create your account</Text>
        <Text style={styles.sub}>Free forever. No credit card required.</Text>
        <Text style={styles.label}>Email</Text>
        <TextInput style={styles.input} placeholder="you@company.com" placeholderTextColor={C.muted} value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <Text style={styles.label}>Password</Text>
        <View style={styles.pwRow}>
          <TextInput style={[styles.input, { flex: 1, marginBottom: 0 }]} placeholder="At least 6 characters" placeholderTextColor={C.muted} value={password} onChangeText={setPassword} secureTextEntry={!showPw} />
          <TouchableOpacity onPress={() => setShowPw(!showPw)} style={styles.eyeBtn}>
            <Ionicons name={showPw ? 'eye-off' : 'eye'} size={18} color={C.muted} />
          </TouchableOpacity>
        </View>
        <Text style={styles.terms}>By signing up you agree to our Terms of Service and Privacy Policy.</Text>
        <TouchableOpacity style={styles.signUpBtn} onPress={handleSignup} disabled={loading}>
          <LinearGradient colors={['#F59E0B', '#D97706']} style={styles.signUpGrad}>
            {loading ? <ActivityIndicator color="#04080F" /> : <><Text style={styles.signUpText}>Create account</Text><Ionicons name="arrow-forward" size={16} color="#04080F" /></>}
          </LinearGradient>
        </TouchableOpacity>
        <View style={styles.loginRow}>
          <Text style={styles.loginPrompt}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}><Text style={styles.loginLink}>Sign in</Text></TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { padding: 28, paddingTop: 80 },
  logoRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 48 },
  logoBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: C.amber, alignItems: 'center', justifyContent: 'center' },
  logoText: { color: C.text, fontSize: 20, fontWeight: '700' },
  heading: { color: C.text, fontSize: 28, fontWeight: '700', marginBottom: 6 },
  sub: { color: C.muted, fontSize: 14, marginBottom: 32 },
  label: { color: '#94A3B8', fontSize: 12, fontWeight: '600', marginBottom: 8 },
  input: { backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: C.border, borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: C.text, fontSize: 14, marginBottom: 16 },
  pwRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  eyeBtn: { padding: 12, backgroundColor: 'rgba(255,255,255,0.04)', borderWidth: 1, borderColor: C.border, borderRadius: 12 },
  terms: { color: C.muted, fontSize: 12, lineHeight: 18, marginBottom: 24 },
  signUpBtn: { borderRadius: 14, overflow: 'hidden', marginBottom: 24 },
  signUpGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, paddingVertical: 16 },
  signUpText: { color: '#04080F', fontWeight: '700', fontSize: 15 },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginPrompt: { color: C.muted, fontSize: 13 },
  loginLink: { color: C.amber, fontSize: 13, fontWeight: '600' },
});
