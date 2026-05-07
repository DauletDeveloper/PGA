import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  Pressable,
} from "react-native";
import Header from "../components/Header";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  User,
  CheckCircle2,
  Star,
  Lock,
  ShieldCheck,
  KeyRound,
  X,
} from "lucide-react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PinModal = ({ visible, onClose }) => {
  const [step, setStep] = useState("set");
  const [firstPin, setFirstPin] = useState("");
  const [currentPin, setCurrentPin] = useState("");

  const reset = () => {
    setStep("set");
    setFirstPin("");
    setCurrentPin("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleDigit = (d) => {
    if (currentPin.length >= 4) return;
    const next = currentPin + d;
    setCurrentPin(next);

    if (next.length === 4) {
      setTimeout(() => {
        if (step === "set") {
          setFirstPin(next);
          setCurrentPin("");
          setStep("confirm");
        } else {
          if (next === firstPin) {
            AsyncStorage.setItem("user_pin", next)
              .then(() => {
                Alert.alert("PIN Set", "Your security PIN has been saved.");
                handleClose();
              })
              .catch(() => Alert.alert("Error", "Failed to save PIN."));
          } else {
            setCurrentPin("");
            Alert.alert("Mismatch", "PINs don't match. Try again.");
            setStep("set");
            setFirstPin("");
          }
        }
      }, 150);
    }
  };

  const handleDelete = () => setCurrentPin((p) => p.slice(0, -1));

  const KEYS = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "⌫"],
  ];

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={handleClose}>
      <Pressable
        className="justify-end flex-1"
        style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
        onPress={handleClose}
      >
        <Pressable onPress={() => {}} className="px-8 pb-10 bg-white rounded-t-3xl pt-7">
          <View className="self-center w-10 h-1 mb-6 bg-gray-200 rounded-full" />

          <View className="flex-row items-center justify-between mb-6">
            <View>
              <Text className="text-xl font-black text-slate-900">
                {step === "set" ? "Create PIN" : "Confirm PIN"}
              </Text>
              <Text className="mt-1 text-xs text-slate-400">
                {step === "set" ? "Enter a 4-digit PIN code" : "Re-enter to confirm"}
              </Text>
            </View>
            <TouchableOpacity onPress={handleClose} className="p-2 rounded-full bg-slate-100">
              <X size={18} color="#64748b" />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center gap-4 mb-9">
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                className={`w-5 h-5 rounded-full border-2 ${
                  i < currentPin.length
                    ? "bg-slate-900 border-slate-900"
                    : "bg-transparent border-slate-300"
                }`}
              />
            ))}
          </View>

          {KEYS.map((row, ri) => (
            <View key={ri} className="flex-row justify-between mb-3">
              {row.map((k, ki) => {
                if (k === "") return <View key={ki} className="flex-1 mx-1.5" />;
                const isDelete = k === "⌫";
                return (
                  <TouchableOpacity
                    key={ki}
                    onPress={() => (isDelete ? handleDelete() : handleDigit(k))}
                    activeOpacity={0.7}
                    className="flex-1 mx-1.5 py-5 bg-slate-100 rounded-2xl items-center justify-center"
                  >
                    <Text className="text-2xl font-bold text-slate-900">{k}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const Profile = () => {
  const [currentPlan, setCurrentPlan] = useState("Free");
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [pinExists, setPinExists] = useState(false);

  const getProPlan = async () => {
    try {
      const userDataRaw = await AsyncStorage.getItem("user_data");
      let user = userDataRaw ? JSON.parse(userDataRaw) : {};
      await AsyncStorage.setItem("user_data", JSON.stringify({ ...user, plan: "Pro" }));
      setCurrentPlan("Pro");
      Alert.alert("Welcome to PRO!", "Enjoy unlimited passwords.");
    } catch (e) {
      Alert.alert("Error", "Failed to upgrade plan.");
    }
  };

  useEffect(() => {
    const load = async () => {
      const userData = await AsyncStorage.getItem("user_data");
      if (userData) setCurrentPlan(JSON.parse(userData).plan ?? "Free");
      const pin = await AsyncStorage.getItem("user_pin");
      setPinExists(!!pin);
    };
    load();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 px-5">
        <ScrollView showsVerticalScrollIndicator={false} className="mb-20">

          <View className="items-center my-7">
            <View className="items-center justify-center w-20 h-20 mb-3 border-2 rounded-full bg-slate-100 border-slate-200">
              <User size={38} color="#334155" />
            </View>
            <View className="flex-row items-center gap-1.5">
              {currentPlan === "Pro" && <Star size={14} color="#f59e0b" fill="#f59e0b" />}
              <Text className="text-lg font-black text-slate-900">
                {currentPlan === "Pro" ? "Pro" : "Free Plan"}
              </Text>
            </View>
          </View>

          <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">
            Upgrade your account
          </Text>

          <View className="p-6 mb-4 overflow-hidden border bg-slate-900 rounded-3xl border-slate-800">
            <View className="absolute w-40 h-40 rounded-full -top-8 -right-8 bg-amber-400 opacity-10" />
            <View className="absolute w-32 h-32 bg-blue-500 rounded-full -bottom-10 -left-5 opacity-10" />

            <View className="absolute top-0 px-3 py-1 right-5 bg-amber-400 rounded-b-xl">
              <Text className="text-[9px] font-black text-slate-900 tracking-widest uppercase">
                Most Popular
              </Text>
            </View>

            <View className="flex-row items-center gap-2 mt-4 mb-1">
              <Text className="text-3xl font-black tracking-tight text-white">PRO</Text>
              <View className="bg-amber-400 px-2 py-0.5 rounded-md">
                <Text className="text-[10px] font-black text-slate-900 tracking-widest">PLAN</Text>
              </View>
            </View>

            <View className="flex-row items-end mb-5">
              <Text className="text-4xl font-black tracking-tight text-amber-400">$1</Text>
              <Text className="text-sm text-slate-500 mb-1.5 ml-1">/ month</Text>
            </View>

            <View className="h-px mb-5 bg-slate-800" />

            {[
              { icon: <CheckCircle2 size={16} color="#f59e0b" />, text: "Unlimited saved accounts" },
              { icon: <Lock size={16} color="#f59e0b" />, text: "PIN-Code protection" },
              { icon: <ShieldCheck size={16} color="#f59e0b" />, text: "Enhanced Security & Encryption" },
            ].map((f, i) => (
              <View key={i} className="flex-row items-center mb-3">
                {f.icon}
                <Text className="ml-2.5 text-sm text-slate-300 font-medium">{f.text}</Text>
              </View>
            ))}

            <TouchableOpacity
              onPress={getProPlan}
              activeOpacity={0.85}
              className="items-center py-4 mt-2 bg-amber-400 rounded-2xl"
            >
              <Text className="text-base font-black tracking-wide text-slate-900">
                GET PRO
              </Text>
            </TouchableOpacity>
          </View>

          <Text className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3 mt-2">
            Security
          </Text>

          <TouchableOpacity
            onPress={() => setPinModalOpen(true)}
            activeOpacity={0.8}
            className="flex-row items-center justify-between p-4 mb-8 border bg-slate-50 rounded-2xl border-slate-200"
          >
            <View className="flex-row items-center">
              <View className="items-center justify-center w-10 h-10 mr-3 rounded-xl bg-slate-900">
                <KeyRound size={18} color="#f59e0b" />
              </View>
              <View>
                <Text className="text-sm font-bold text-slate-900">Security PIN</Text>
                <Text className="text-xs text-slate-400 mt-0.5">
                  {pinExists ? "PIN is active — tap to change" : "Tap to set a 4-digit PIN"}
                </Text>
              </View>
            </View>
            <View className={`px-2.5 py-1 rounded-lg ${pinExists ? "bg-green-100" : "bg-slate-100"}`}>
              <Text className={`text-xs font-bold ${pinExists ? "text-green-600" : "text-slate-400"}`}>
                {pinExists ? "ON" : "OFF"}
              </Text>
            </View>
          </TouchableOpacity>

          <View className="items-center py-4">
            <View className="flex-row items-center gap-1.5">
              <ShieldCheck size={15} color="#cbd5e1" />
              <Text className="text-xs font-semibold tracking-wide text-slate-300">
                Vault · Password Manager
              </Text>
            </View>
            <Text className="text-[11px] text-slate-300 mt-1">v1.0.0 · All data stored locally</Text>

          </View>

        </ScrollView>
      </SafeAreaView>

      <Header active="Profile" />
      <PinModal
        visible={pinModalOpen}
        onClose={() => {
          setPinModalOpen(false);
          AsyncStorage.getItem("user_pin").then((p) => setPinExists(!!p));
        }}
      />
    </View>
  );
};

export default Profile;