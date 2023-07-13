import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StyleSheet, Text, View } from "react-native";
import TextToImage from "./pages/TextToImage";
import ImageToImage from "./pages/ImageToImage";

const Drawer = createDrawerNavigator();

const MainMenu = () => {
  return (
    <View style={styles.container}>
      <Text>Seja bem vindo</Text>
    </View>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="App">
        <Drawer.Screen name="App" component={MainMenu} />
        <Drawer.Screen name="Text To Image" component={TextToImage} />
        <Drawer.Screen name="Image To Image" component={ImageToImage} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default App;
