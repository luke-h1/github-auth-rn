import { Button, StyleSheet } from "react-native";

import EditScreenInfo from "../../components/EditScreenInfo";
import { Text, View } from "../../components/Themed";
import { useAuthContext } from "../../context/AuthContext";

export default function TabOneScreen() {
  const { user, signOut } = useAuthContext();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{user?.displayName}</Text>
      <Text style={styles.title}>{user?.providerId}</Text>
      <Text style={styles.title}>{user?.uid}</Text>
      <Button title="sign out" onPress={signOut} />
      <View
        style={styles.separator}
        lightColor="#eee"
        darkColor="rgba(255,255,255,0.1)"
      />
      <EditScreenInfo path="app/(tabs)/index.tsx" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
