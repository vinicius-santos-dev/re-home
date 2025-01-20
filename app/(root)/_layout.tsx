import { useGlobalContext } from "@/lib/global-provider";
import { Redirect, Slot } from "expo-router";
import { ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Root App Layout
 * 
 * Protected layout component that handles:
 * 
 * - Authentication state management
 * - Loading states
 * - Protected route redirection
 * - Child route rendering
 */
export default function AppLayout() {
  const { isLogged, loading } = useGlobalContext();

  if (loading) {
    return (
      <SafeAreaView className="bg-white h-full flex justify-center items-center">
        <ActivityIndicator className="text-primary-300" size="large" />
      </SafeAreaView>
    );
  }

  if (!isLogged) return <Redirect href="/sign-in" />;

  return <Slot />;
}
