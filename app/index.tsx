import { LoadingModal } from "@/components/ui/loading-modal";
import { Redirect } from "expo-router";
import { useIsAuthenticated } from "../lib/hooks/use-auth";

export default function Index() {
  const { data: isLoggedIn, isLoading } = useIsAuthenticated();

  // Redirect based on auth status
  if (isLoggedIn) {
    return <Redirect href="/home" />;
  }

  return (
    <>
      <LoadingModal visible={isLoading} message="Checking authentication..." />
      {!isLoading && <Redirect href="/login" />}
    </>
  );
}
