import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from '../components/Header';
import * as Clipboard from 'expo-clipboard';
import { X } from 'lucide-react-native';

const CopyButton = ({ textToCopy, mini = false }) => {
  const [copied, setCopied] = useState(false);
  const [verifed, setVerifed] = useState(false);
  const checkAndSaveUser = async () => {
    try {
      const existingUser = await AsyncStorage.getItem('user_data');
      if (existingUser === null) {
        const newUser = { 
          id: Date.now().toString(), 
          plan: 'Free', 
          pincode: null,
        };
        await AsyncStorage.setItem('user_data', JSON.stringify(newUser));
      } else {
        console.log('Wellcome back');
      }
    } catch (e) {
      console.error(e);
    }
  };
  

  useEffect(() => {
    checkAndSaveUser();
  }, []);
  
  const handleCopy = async () => {
    if (!textToCopy) return;
    await Clipboard.setStringAsync(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (mini) {
    return (
      <TouchableOpacity
        onPress={handleCopy}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 6,
          borderRadius: 8,
          backgroundColor: copied ? '#dcfce7' : '#e5e7eb',
        }}
      >
        <Text style={{ fontSize: 12, fontWeight: '600', color: copied ? '#16a34a' : '#4B5563' }}>
          {copied ? 'Copied' : '📋 Copy'}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={handleCopy}
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        marginTop: 12,
        borderRadius: 12,
        borderWidth: 1,
        backgroundColor: copied ? '#f0fdf4' : '#f3f4f6',
        borderColor: copied ? '#86efac' : '#d1d5db',
      }}
    >
      <Text style={{ fontSize: 14, fontWeight: '700', color: copied ? '#16a34a' : '#374151' }}>
        {copied ? 'Copied!' : '📋 Copy password'}
      </Text>
    </TouchableOpacity>
  );
};

const ToggleBtn = ({ label, active, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className={`flex-1 p-3 m-1 rounded-xl border ${active ? 'bg-black border-black' : 'bg-white border-gray-300'}`}
  >
    <Text className={`text-center font-bold ${active ? 'text-white' : 'text-gray-600'}`}>
      {label}
    </Text>
  </TouchableOpacity>
);

const Home = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState('12');
  const [open, setOpen] = useState(false);
  const [useLetters, setUseLetters] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [accountName, setAccountName] = useState('');

  const generatePassword = () => {
    const charSets = {
      letters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+~{}[]:;?',
    };

    let charPool = '';
    if (useLetters) charPool += charSets.letters;
    if (useNumbers) charPool += charSets.numbers;
    if (useSymbols) charPool += charSets.symbols;

    if (charPool === '') {
      Alert.alert('Error', 'Choose symbols type');
      return;
    }

    const passLength = parseInt(length) || 8;
    let newPassword = '';
    for (let i = 0; i < passLength; i++) {
      newPassword += charPool.charAt(Math.floor(Math.random() * charPool.length));
    }
    setPassword(newPassword);
  };

  const savePassword = async () => {
    if (!password) {
      Alert.alert('Error', 'Please generate a password first');
      return;
    }
    
    if (!accountName.trim()) {
      Alert.alert('Error', 'Account name cannot be empty');
      return;
    }
  
    try {
      const userDataRaw = await AsyncStorage.getItem('user_data');
      const userData = userDataRaw ? JSON.parse(userDataRaw) : { plan: 'Free' };
      

      const existing = await AsyncStorage.getItem("user_passwords");
      const list = existing ? JSON.parse(existing) : [];

      const userPlan = userData.plan || "Free";

      const isPro = userPlan.toLowerCase() === "pro";
      const limit = isPro ? Infinity : 5;

      if (list.length >= limit) {
        const message = isPro
          ? "Your Pro vault is full (wow, that's a lot of passwords!)."
          : "Free plan is limited to 5 passwords. Upgrade to PRO for unlimited storage!";

        Alert.alert("Limit Reached", message);
        return;
      }

  

      const newPasswordEntry = { 
        id: Date.now().toString(), 
        service: accountName.trim(), 
        value: password, 
        date: new Date().toLocaleDateString() 
      };
  
      const updatedList = [...list, newPasswordEntry];
      await AsyncStorage.setItem('user_passwords', JSON.stringify(updatedList));
      
      setOpen(false);
      setAccountName('');
      console.log(`Success! Total items: ${updatedList.length}`);
  
    } catch (e) {
      console.error('Save error:', e);
      Alert.alert('Error', 'Failed to save data to storage');
    }
  };
  
  

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 px-6">
        <Text className="mt-4 text-3xl font-bold text-center text-gray-900">Generator</Text>
        <Text className="mb-8 italic text-center text-gray-400">Create a secure password</Text>

        <View className="p-8 mb-6 bg-gray-100 border border-gray-200 rounded-3xl">
          <Text className="font-mono text-3xl tracking-tight text-center text-black" selectable>
            {password || 'Not Generated yet'}
          </Text>
          {!!password && <CopyButton textToCopy={password} />}
        </View>

        <View className="flex-row items-center justify-between px-2 mb-8">
          <Text className="text-lg font-semibold text-gray-700">Password Length:</Text>
          <TextInput
            className="w-16 p-2 text-xl font-bold text-center bg-gray-100 border border-gray-200 rounded-xl"
            keyboardType="numeric"
            value={length}
            maxLength={2}
            onChangeText={setLength}
          />
        </View>

        <Text className="mb-3 ml-2 text-sm font-bold tracking-widest text-gray-400 uppercase">Options</Text>
        <View className="flex-row mb-10">
          <ToggleBtn label="ABC" active={useLetters} onPress={() => setUseLetters(!useLetters)} />
          <ToggleBtn label="123" active={useNumbers} onPress={() => setUseNumbers(!useNumbers)} />
          <ToggleBtn label="#@&" active={useSymbols} onPress={() => setUseSymbols(!useSymbols)} />
        </View>

        <TouchableOpacity
          onPress={generatePassword}
          className="py-5 bg-blue-600 shadow-lg rounded-2xl shadow-blue-300 active:bg-blue-700"
        >
          <Text className="text-xl font-black text-center text-white">GENERATE</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setOpen(true)}
          className="py-5 mt-5 bg-blue-600 shadow-lg rounded-2xl shadow-blue-300 active:bg-blue-700"
        >
          <Text className="text-xl font-black text-center text-white">Save Password</Text>
        </TouchableOpacity>

        {open && (
          <View className="absolute inset-0 z-50 items-center justify-center bg-black/50">
            <View className="p-6 bg-white shadow-xl w-80 rounded-3xl">
              <Text className="mb-4 text-xl font-bold text-center">Save Password</Text>
              <TouchableOpacity
              onPress={() => setOpen(false)}
              >
            <X size={24} color="black" />
              </TouchableOpacity>

              <TextInput
                className="h-12 px-4 mb-4 border border-gray-200 rounded-xl bg-gray-50"
                placeholder="Account Name (e.g. Google)"
                value={accountName}
                onChangeText={setAccountName}
              />

              <View className="p-3 mb-6 bg-gray-100 rounded-lg">
                <Text className="mb-2 text-xs text-gray-500 uppercase">Password</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text className="font-mono text-base font-bold" numberOfLines={1} style={{ flex: 1, marginRight: 8 }}>
                    {password}
                  </Text>
                  <CopyButton textToCopy={password} mini />
                </View>
              </View>

              <TouchableOpacity
                onPress={savePassword}
                className="p-4 bg-blue-600 rounded-xl"
              >
                <Text className="font-bold text-center text-white">Save to List</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setOpen(false)}
                className="p-3 mt-2"
              >
                <Text className="text-center text-gray-400">Go Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </SafeAreaView>

      <Header />
    </View>
  );
};

export default Home;
