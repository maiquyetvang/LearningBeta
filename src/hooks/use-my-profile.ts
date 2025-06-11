import { useQuery } from '@tanstack/react-query';
import { useSystem } from '~/lib/powersync';
import { useAuthStore } from '~/stores/auth.store';

export const USE_GET_PROFILE_QUERY_KEY = 'profile';
export const useGetMyProfile = () => {
  const { setProfile, session } = useAuthStore();
  const { db, supabase } = useSystem();
  const { data, ...rest } = useQuery({
    queryKey: [USE_GET_PROFILE_QUERY_KEY, session?.user?.id],
    queryFn: async () => {
      const profiles = await db
        .selectFrom('profiles')
        .selectAll()
        .where('user_id', '=', session?.user?.id ?? '')
        .execute();
      if (profiles.length === 0) {
        // try to get profile from supabase
        const { data, error } = await supabase.client
          .from('profiles')
          .select()
          .eq('user_id', session?.user?.id!)
          .maybeSingle();
        if (error) {
          console.error('Error fetching profile', error);
          return null;
        }
        if (!data) {
          console.error('No profile found');
          return null;
        }
        console.log('Profile from supabase', data);
        setProfile(data);
        return null;
      }
      const profile = profiles[0] as any;
      setProfile(profile);
      return profile;
    },
    enabled: !!session?.user?.id,
  });
  return { data, ...rest };
};
