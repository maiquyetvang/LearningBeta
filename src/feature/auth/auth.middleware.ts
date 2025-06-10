import { useEffect } from "react";
import { useGetMyProfile } from "~/hooks/use-my-profile";
import { useSystem } from "~/lib/powersync";
import { useAuthStore } from "~/stores/auth.store";

export const AuthMiddleware = () => {
  // useAuthLinking();
  const { supabase, powersync } = useSystem();
  const { session, setSession, setLoading } = useAuthStore();
  const { refetch } = useGetMyProfile();
  useEffect(() => {
    supabase.client.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.client.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!powersync.connected && session) {
      powersync.connect(supabase);
      refetch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [powersync, session, supabase]);

  return null;
};
// const useAuthLinking = () => {
//   const { supabase } = useSystem();
//   const url = Linking.useURL();
//   useEffect(() => {
//     if (!url) return;
//     supabase.createSessionFromUrl(url);
//   }, [supabase, url]);
//   return url;
// };
