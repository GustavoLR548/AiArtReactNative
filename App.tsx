import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createDrawerNavigator,
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { DrawerScreenProps } from "@react-navigation/drawer";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { DefaultTheme, DarkTheme } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import TextToImage from "./pages/TextToImage";
import ImageToImage from "./pages/ImageToImage";
import ImageEdit from "./pages/ImageEdit";
import Options from "./pages/Options";
import { getPalette, resolveTheme, ThemeMode, ThemePalette } from "./theme/palette";
import AsyncStorage from "@react-native-async-storage/async-storage";

const THEME_MODE_STORAGE_KEY = "@aiart/theme_mode";

type RootDrawerParamList = {
  Home: undefined;
  "Text To Image": undefined;
  "Image To Image": undefined;
  Inpainting: undefined;
  Outpainting: undefined;
  Options: undefined;
};

const getDrawerIconName = (
  routeName: keyof RootDrawerParamList
): keyof typeof Ionicons.glyphMap => {
  switch (routeName) {
    case "Home":
      return "home-outline";
    case "Text To Image":
      return "text-outline";
    case "Image To Image":
      return "images-outline";
    case "Inpainting":
      return "brush-outline";
    case "Outpainting":
      return "expand-outline";
    case "Options":
      return "settings-outline";
    default:
      return "ellipse-outline";
  }
};

const Drawer = createDrawerNavigator<RootDrawerParamList>();

type MainMenuProps = DrawerScreenProps<RootDrawerParamList, "Home">;

const features: {
  title: string;
  description: string;
  route: keyof RootDrawerParamList;
}[] = [
  {
    title: "Text to Image",
    description: "Transform your prompt into original AI artworks in seconds.",
    route: "Text To Image",
  },
  {
    title: "Image to Image",
    description: "Use an existing image as reference to generate new visual styles.",
    route: "Image To Image",
  },
  {
    title: "Inpainting",
    description: "Edit and regenerate specific regions while preserving context.",
    route: "Inpainting",
  },
  {
    title: "Outpainting",
    description: "Expand your canvas and continue scenes beyond original borders.",
    route: "Outpainting",
  },
];

const InpaintingScreen = ({ colors }: { colors: ThemePalette }) => (
  <ImageEdit
    mode="inpainting"
    screenTitle="Inpainting"
    screenDescription="Select an image and regenerate focused areas with a guiding prompt."
    colors={colors}
  />
);

const OutpaintingScreen = ({ colors }: { colors: ThemePalette }) => (
  <ImageEdit
    mode="outpainting"
    screenTitle="Outpainting"
    screenDescription="Upload an image and expand the composition beyond its original frame."
    colors={colors}
  />
);

const MainMenu = ({ navigation, colors }: MainMenuProps & { colors: ThemePalette }) => {
  const styles = createStyles(colors);

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroCard}>
          <Text style={styles.badge}>AI Art Studio</Text>
          <Text style={styles.heroTitle}>Create art with AI, faster.</Text>
          <Text style={styles.heroDescription}>
            Build visuals with text prompts, transform existing images, and apply
            inpainting or outpainting in one simple workflow.
          </Text>
          <Pressable style={styles.primaryButton} onPress={() => navigation.navigate("Text To Image")}>
            <Text style={styles.primaryButtonText}>Start creating</Text>
          </Pressable>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Tools</Text>
          <Text style={styles.sectionSubtitle}>
            Choose one of the modes below to begin.
          </Text>
        </View>

        {features.map((feature) => (
          <Pressable
            key={feature.title}
            style={styles.featureCard}
            onPress={() => navigation.navigate(feature.route)}
          >
            <Text style={styles.featureTitle}>{feature.title}</Text>
            <Text style={styles.featureDescription}>{feature.description}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const App = () => {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeMode] = useState<ThemeMode>("system");

  useEffect(() => {
    const loadThemeMode = async () => {
      const persistedMode = await AsyncStorage.getItem(THEME_MODE_STORAGE_KEY);

      if (
        persistedMode === "light" ||
        persistedMode === "dark" ||
        persistedMode === "system"
      ) {
        setThemeMode(persistedMode);
      }
    };

    loadThemeMode();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(THEME_MODE_STORAGE_KEY, themeMode);
  }, [themeMode]);

  const resolvedTheme = resolveTheme(themeMode, systemScheme);
  const colors = getPalette(resolvedTheme);
  const styles = createStyles(colors);

  const navigationTheme = resolvedTheme === "dark" ? DarkTheme : DefaultTheme;

  return (
    <NavigationContainer
      theme={{
        ...navigationTheme,
        colors: {
          ...navigationTheme.colors,
          background: colors.background,
          card: colors.surface,
          text: colors.text,
          border: colors.border,
          primary: colors.primary,
        },
      }}
    >
      <StatusBar barStyle={resolvedTheme === "dark" ? "light-content" : "dark-content"} />
      <Drawer.Navigator
        initialRouteName="Home"
        drawerContent={(props) => <CustomDrawerContent {...props} colors={colors} />}
        screenOptions={({ route }) => ({
          headerStyle: styles.header,
          headerTitleStyle: styles.headerTitle,
          headerTintColor: resolvedTheme === "dark" ? "#ffffff" : colors.text,
          drawerActiveTintColor: colors.drawerActiveTint,
          drawerInactiveTintColor: colors.drawerInactiveTint,
          drawerActiveBackgroundColor: colors.drawerActiveBackground,
          drawerLabelStyle: styles.drawerLabel,
          drawerIcon: ({ color, size }) => (
            <Ionicons
              name={getDrawerIconName(route.name as keyof RootDrawerParamList)}
              size={size}
              color={color}
            />
          ),
        })}
      >
        <Drawer.Screen name="Home">
          {(props) => <MainMenu {...props} colors={colors} />}
        </Drawer.Screen>
        <Drawer.Screen name="Text To Image">
          {() => <TextToImage colors={colors} />}
        </Drawer.Screen>
        <Drawer.Screen name="Image To Image">
          {() => <ImageToImage colors={colors} />}
        </Drawer.Screen>
        <Drawer.Screen name="Inpainting">
          {() => <InpaintingScreen colors={colors} />}
        </Drawer.Screen>
        <Drawer.Screen name="Outpainting">
          {() => <OutpaintingScreen colors={colors} />}
        </Drawer.Screen>
        <Drawer.Screen name="Options">
          {() => (
            <Options
              themeMode={themeMode}
              onThemeModeChange={setThemeMode}
              colors={colors}
            />
          )}
        </Drawer.Screen>
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

const CustomDrawerContent = (
  props: DrawerContentComponentProps & { colors: ThemePalette }
) => {
  const styles = createStyles(props.colors);

  return (
    <DrawerContentScrollView
      {...props}
      style={styles.drawerContainer}
      contentContainerStyle={styles.drawerContent}
    >
      <View style={styles.drawerBanner}>
        <Text style={styles.drawerBannerTitle}>Ai Art</Text>
        <Text style={styles.drawerBannerSubtitle}>Create with AI</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
};

const createStyles = (colors: ThemePalette) =>
  StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: colors.background,
    },
  scrollContent: {
    paddingTop: 18,
    paddingHorizontal: 18,
    paddingBottom: 28,
  },
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.drawerActiveBackground,
    color: colors.mutedText,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  heroTitle: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "700",
    color: colors.text,
    marginBottom: 10,
  },
  heroDescription: {
    color: colors.mutedText,
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 16,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  primaryButtonText: {
    color: colors.onPrimary,
    fontWeight: "600",
    fontSize: 15,
  },
  sectionHeader: {
    marginBottom: 10,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  sectionSubtitle: {
    color: colors.mutedText,
    fontSize: 14,
  },
  featureCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 10,
  },
  featureTitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  featureDescription: {
    color: colors.mutedText,
    fontSize: 14,
    lineHeight: 20,
  },
  header: {
    backgroundColor: colors.surface,
  },
  headerTitle: {
    color: colors.text,
    fontWeight: "700",
  },
  drawerLabel: {
    fontSize: 14,
  },
  drawerContainer: {
    backgroundColor: colors.background,
  },
  drawerContent: {
    paddingTop: 0,
  },
  drawerBanner: {
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 12,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: colors.bannerBackground,
    borderWidth: 1,
    borderColor: colors.border,
  },
  drawerBannerTitle: {
    color: colors.bannerText,
    fontSize: 20,
    fontWeight: "800",
  },
  drawerBannerSubtitle: {
    color: colors.bannerText,
    fontSize: 12,
    marginTop: 4,
    opacity: 0.9,
  },
});

export default App;
