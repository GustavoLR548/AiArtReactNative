# AiArtReactNative

AiArtReactNative is a mobile app for generating AI art with a clean drawer-based workflow: Text to Image, Image to Image, Inpainting, and Outpainting. It lets users write prompts, upload reference images, tune sample settings, and preview generated outputs directly on-device with Expo.

The app is built with React Native + Expo (SDK 48), React Navigation (Drawer), and Google Gemini image generation (Nano Banana model: `gemini-2.0-flash-exp-image-generation`), with a theme system (Light/Dark/System) and persisted UI preferences. It targets fast iteration in development and Android native builds when needed.

## Quick setup

- Use `Node.js 18.x`, `npm 9+`, `Expo CLI` via `npx`, and `OpenJDK 17` (Android builds).
- Configure Gemini API key: set `EXPO_PUBLIC_GEMINI_API_KEY` in your environment (or replace fallback key in `api/GeminiAPI.ts`).
- Install Android tooling: Android SDK (with `platform-tools`/`adb`) and set `ANDROID_HOME` + `PATH` to include `$ANDROID_HOME/platform-tools`.
- Install dependencies: `npm install`.
- Start development (Expo Go): `npx expo start`.
