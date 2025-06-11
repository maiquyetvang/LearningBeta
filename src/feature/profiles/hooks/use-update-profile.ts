import {
  useMutation,
  UseMutationOptions,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner-native";
import { USE_GET_PROFILE_QUERY_KEY } from "~/hooks/use-my-profile";
import { useSystem } from "~/lib/powersync";
import { randomUUID } from "expo-crypto";
import { ProfileRecord } from "~/lib/powersync/app-schema";
import { useAuthStore } from "~/stores/auth.store";
type UpdateProfileOptions = Partial<
  Pick<
    ProfileRecord,
    | "avatar_url"
    | "username"
    | "full_name"
    | "currency_code"
    | "has_completed_survey"
    | "updated_at"
    | "learning_level"
    | "learning_purpose"
    | "daily_duration"
    | "native_language"
    | "target_language"
    | "ui_language"
  > & {
    is_setup_complete?: number;
  }
>;

export const useUpdateProfile = (
  options?: UseMutationOptions<void, unknown, UpdateProfileOptions>
) => {
  const { session, setProfile } = useAuthStore();
  const queryClient = useQueryClient();
  const { db } = useSystem();
  const { mutate, mutateAsync, ...rest } = useMutation({
    ...options,
    mutationFn: async (profile: UpdateProfileOptions) => {
      try {
        if (!session?.user) throw new Error("No user on the session!");
        const user_id = session.user.id;
        const existing = await db
          .selectFrom("profiles")
          .selectAll()
          .where("user_id", "=", user_id)
          .executeTakeFirst();
        console.log({ existing });

        if (existing) {
          console.log("existing profile found, updating...", { profile });
          await db
            .updateTable("profiles")
            .set(profile)
            .where("user_id", "=", user_id)
            .execute();
        } else {
          console.log("no existing profile found, creating new profile...");
          const id = randomUUID();
          const newProfile: ProfileRecord = {
            id,
            user_id,
            username: profile.username ?? null,
            full_name: profile.full_name ?? null,
            avatar_url: profile.avatar_url ?? null,
            currency_code: profile.currency_code ?? null,
            has_completed_survey: 0,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            learning_level: profile.learning_level ?? null,
            learning_purpose: profile.learning_purpose ?? null,
            daily_duration: profile.daily_duration ?? null,
            native_language: profile.native_language ?? null,
            target_language: profile.target_language ?? null,
            ui_language: profile.ui_language ?? null,
          };
          await db.insertInto("profiles").values(newProfile).execute();
        }
      } catch (err) {
        console.error("Error updating profile:", err);
        throw err;
      }
    },
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({
        queryKey: [USE_GET_PROFILE_QUERY_KEY, session?.user?.id],
      });
      options?.onSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      options?.onError?.(error, variables, context);
      toast.error("Failed to update profile");
    },
  });
  const error = rest.error as Error;
  return {
    updateProfile: mutate,
    updateProfileAsync: mutateAsync,
    ...rest,
    error,
  };
};
