import { useEffect, useRef } from "react";
import { View, TouchableOpacity, Animated } from "react-native";
import { House, User, Key } from "lucide-react-native";
import { useNavigation, useNavigationState } from "@react-navigation/native";

const Header = ({ active }) => {
  const navigation = useNavigation();
  const autoScreenName = useNavigationState((state) => state?.routes[state.index]?.name);
  const currentActive = active || autoScreenName;

  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {

    fadeAnim.setValue(0);
    Animated.spring(fadeAnim, {
      toValue: 1,
      useNativeDriver: true, 
      friction: 8, 
      tension: 40, 
    }).start();
  }, [currentActive]);

  const getIconColor = (name) => (currentActive === name ? "#2563eb" : "black");

  const ActiveIndicator = () => (
    <Animated.View 
      style={{ 
        opacity: fadeAnim, 
        transform: [{ scaleX: fadeAnim }] 
      }} 
      className="h-1 mt-1 bg-blue-600 rounded-full w-7" 
    />
  );

  return (
    <View className="absolute bottom-0 left-0 right-0 flex-row items-center justify-around h-20 pb-5 bg-white border-t border-gray-200">
      
      <TouchableOpacity
        onPress={() => navigation.navigate("Home")}
        activeOpacity={0.7}
        className="items-center p-2"
      >
        <House color={getIconColor("Home")} size={26} />
        {currentActive === "Home" && <ActiveIndicator />}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Passwords")}
        activeOpacity={0.7}
        className="items-center p-2"
      >
        <Key color={getIconColor("Passwords")} size={26} />
        {currentActive === "Passwords" && <ActiveIndicator />}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Profile")}
        activeOpacity={0.7}
        className="items-center p-2"
      >
        <User color={getIconColor("Profile")} size={26} />
        {currentActive === "Profile" && <ActiveIndicator />}
      </TouchableOpacity>
      
    </View>
  );
};

export default Header;
