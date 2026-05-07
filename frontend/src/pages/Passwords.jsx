import { Text, View, TouchableOpacity, FlatList, Alert } from "react-native";
import Header from "../components/Header";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Copy,
  Trash2,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react-native";
import * as Clipboard from "expo-clipboard";

const AccountCard = ({ item, onCopy, onDelete }) => {
  const [show, setShow] = useState(false);

  return (
    <View className="mb-4 bg-white shadow-md rounded-[32px] border border-slate-100 overflow-hidden">
      <View className="p-5">
        <View className="flex-row items-start justify-between mb-4">
          <View className="flex-1">
            <Text className="text-lg font-extrabold leading-tight text-slate-900">
              {item.service || "Unnamed Account"}
            </Text>
            <Text className="mt-1 text-xs font-medium text-slate-400">
              Added: {item.date || "No date"}
            </Text>
          </View>

          <View className="p-2 rounded-full bg-green-50">
            <ShieldCheck size={16} color="#10b981" />
          </View>
        </View>

        <View className="flex-row items-center justify-between p-4 border bg-slate-50 rounded-2xl border-slate-100">
          <View className="flex-row items-center flex-1">
            <Text
              className={`font-mono text-xl font-bold tracking-widest ${show ? "text-blue-600" : "text-slate-400"}`}
            >
              {show ? item.value : "••••••••"}
            </Text>
            <TouchableOpacity
              onPress={() => setShow(!show)}
              className="p-2 ml-4 bg-white border shadow-sm rounded-xl border-slate-100"
            >
              {show ? (
                <EyeOff size={18} color="#64748b" />
              ) : (
                <Eye size={18} color="#64748b" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row mt-4 gap-x-3">
          <TouchableOpacity
            onPress={() => onCopy(item.value)}
            className="flex-row items-center justify-center flex-1 py-4 bg-slate-900 rounded-2xl active:opacity-80"
          >
            <Copy size={18} color="white" />
            <Text className="ml-2 font-bold text-white">Copy</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onDelete(item.id)}
            className="items-center justify-center w-14 bg-red-50 rounded-2xl active:bg-red-100"
          >
            <Trash2 size={20} color="#ef4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const Passwords = () => {
  const [accounts, setAccounts] = useState([]);
  const [error, setError] = useState("");
  const [warn, setWarn] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("user_passwords");
      if (jsonValue !== null) {
        const data = JSON.parse(jsonValue);
        setAccounts(data);
        setError(data.length === 0 ? "You don't have any passwords yet" : "");
      } else {
        setError("You don't have any passwords yet");
      }
    } catch (e) {
      setError("Failed to load passwords");
    }
  };

  const removeData = async (id) => {
    try {
      const updatedAccounts = accounts.filter((item) => item.id !== id);
      setAccounts(updatedAccounts);
      await AsyncStorage.setItem(
        "user_passwords",
        JSON.stringify(updatedAccounts),
      );
      if (updatedAccounts.length === 0)
        setError("You don't have any passwords yet");
    } catch (e) {
      console.error("Error deleting data", e);
    }
  };

  const copyToClipboard = async (val) => {
    await Clipboard.setStringAsync(val);
    Alert.alert("Copied", "Password ready to paste! 🚀");
  };

  return (
    <View className="flex-1 bg-white">
      <SafeAreaView className="flex-1 px-5">
        <View className="flex-row items-center justify-between my-6">
          <View>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit={true}
              minimumFontScale={0.5}
              className="text-3xl italic font-black text-slate-900"
            >
              Password Generation Application
            </Text>

            <Text className="font-medium text-slate-400">
              You have {accounts.length == 1 ? `${accounts.length} Account` : `${accounts.length} Accounts`} 
            </Text>
          </View>
          <View className="p-3 rounded-full bg-slate-100">
          </View>
        </View>

        {error ? (
          <View className="items-center justify-center flex-1">
            <Text className="font-medium text-gray-400">{error}</Text>
          </View>
        ) : (
          <FlatList
            data={accounts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <AccountCard
                item={item}
                onCopy={copyToClipboard}
                onDelete={(id) => {
                  setDeleteId(id);
                  setWarn(true);
                }}
              />
            )}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
          />
        )}


        {warn && (
          <View className="absolute inset-0 z-50 items-center justify-center p-6 bg-slate-900/60">
            <View className="p-8 bg-white w-full rounded-[40px] shadow-2xl">
              <View className="items-center mb-4">
                <View className="p-4 rounded-full bg-red-50">
                  <Trash2 size={32} color="#ef4444" />
                </View>
              </View>
              <Text className="mb-2 text-2xl font-black text-center text-slate-900">
                Are you sure?
              </Text>
              <Text className="mb-8 leading-5 text-center text-slate-500">
                This action is permanent. This password will be removed from
                your vault.
              </Text>

              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => {
                    setWarn(false);
                    setDeleteId(null);
                  }}
                  className="flex-1 py-4 bg-slate-100 rounded-2xl active:bg-slate-200"
                >
                  <Text className="font-bold text-center text-slate-600">
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    removeData(deleteId);
                    setWarn(false);
                    setDeleteId(null);
                  }}
                  className="flex-1 py-4 bg-red-600 shadow-lg rounded-2xl active:opacity-80 shadow-red-300"
                >
                  <Text className="font-bold text-center text-white">
                    Delete
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </SafeAreaView>

      <Header active="Passwords" />
    </View>
  );
};

export default Passwords;
