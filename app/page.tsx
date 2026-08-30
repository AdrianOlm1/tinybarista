import { StoreProvider } from "@/lib/store";
import App from "@/components/App";

export default function Home() {
  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  );
}
