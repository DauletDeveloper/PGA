import { Text, View, TouchableOpacity, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useNavigation } from '@react-navigation/native'
import { useEffect, useState } from 'react'
import { KeyRound, Delete } from 'lucide-react-native'

const PinScreen = () => {
  const navigation = useNavigation()
  const [currentPin, setCurrentPin] = useState("")
  const [error, setError] = useState(false)
  const [attempts, setAttempts] = useState(0)

  const checkUser = async () => {
    const jsonValue = await AsyncStorage.getItem('user_pin')
    if (!jsonValue) {
      navigation.navigate("Home")
    }
  }

  useEffect(() => {
    checkUser()
  }, [])

  const handleDigit = (d) => {
    if (currentPin.length >= 4) return
    const next = currentPin + d
    setCurrentPin(next)
    setError(false)

    if (next.length === 4) {
      setTimeout(async () => {
        const savedPin = await AsyncStorage.getItem('user_pin')
        if (next === savedPin) {
          navigation.navigate("Home")
        } else {
          const newAttempts = attempts + 1
          setAttempts(newAttempts)
          setError(true)
          setCurrentPin("")
          if (newAttempts >= 5) {
            Alert.alert("Too many attempts", "Please try again later.")
          }
        }
      }, 150)
    }
  }

  const handleDelete = () => {
    setCurrentPin((p) => p.slice(0, -1))
    setError(false)
  }

  const KEYS = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["", "0", "⌫"],
  ]
  
  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="items-center justify-center flex-1 px-8">

        <View className="items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-slate-900">
          <KeyRound size={28} color="#f59e0b" />
        </View>

        <Text className="mb-1 text-2xl font-black text-slate-900">Enter PIN</Text>
        <Text className="mb-10 text-sm text-slate-400">
          {error
            ? `Wrong PIN · ${5 - attempts} attempts left`
            : "Enter your 4-digit security PIN"}
        </Text>

        <View className="flex-row gap-4 mb-12">
          {[0, 1, 2, 3].map((i) => (
            <View
            key={i}
            className={`w-5 h-5 rounded-full border-2 ${
              error
              ? "bg-red-500 border-red-500"
              : i < currentPin.length
              ? "bg-slate-900 border-slate-900"
              : "bg-transparent border-slate-300"
            }`}
            />
          ))}
        </View>

        <View className="w-full">
          {KEYS.map((row, ri) => (
            <View key={ri} className="flex-row justify-between mb-3">
              {row.map((k, ki) => {
                if (k === "") return <View key={ki} className="flex-1 mx-2" />
                const isDelete = k === "⌫"
                return (
                  <TouchableOpacity
                  key={ki}
                  onPress={() => (isDelete ? handleDelete() : handleDigit(k))}
                  activeOpacity={0.7}
                  className={`flex-1 mx-2 py-5 rounded-2xl items-center justify-center ${
                    isDelete ? "bg-slate-100" : "bg-slate-100"
                  }`}
                  >
                    <Text className="text-2xl font-bold text-slate-900">{k}</Text>
                  </TouchableOpacity>
                )
              })}
            </View>
          ))}
        </View>


        {attempts > 0 && (
          <Text className="mt-6 text-xs font-medium text-red-400">
            {attempts} failed attempt{attempts > 1 ? "s" : ""}
          </Text>
        )}
      </View>
    </SafeAreaView>
  )
}

export default PinScreen