// components/Auth.tsx
import { createClient } from "@/utils/supabase/client";

export const Login = () => {
  const handleGoogleLogin = async () => {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
    });
  };

  return (
    <button
      onClick={handleGoogleLogin}
      className="bg-blue-500 text-white p-2 rounded"
    >
      Continuar con Google
    </button>
  );
};
