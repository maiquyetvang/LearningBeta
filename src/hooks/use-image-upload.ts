import { useCallback, useState } from "react";
import { toast } from "sonner-native";
import { useSystem } from "~/lib/powersync";
import { useAuthStore } from "~/stores/auth.store";

type ImageUploadOptions = {
  bucket?: string;
  onSuccess?: (publicUrl: string) => void;
  parentPath?: string;
};

export const useImageUpload = ({
  bucket = "default",
  parentPath = "",
  onSuccess,
}: ImageUploadOptions) => {
  const [uploading, setUploading] = useState(false);
  const userId = useAuthStore((state) => state.profile?.id);
  const { supabase } = useSystem();
  const upload = useCallback(
    async ({ uri, mimeType }: { uri: string; mimeType?: string }) => {
      setUploading(true);
      try {
        const arraybuffer = await fetch(uri).then((res) => res.arrayBuffer());
        const fileExt = uri?.split(".").pop()?.toLowerCase() ?? "jpeg";
        const path = `${parentPath}${userId}/${new Date().getTime()}.${fileExt}`;
        const { data, error: uploadError } = await supabase.client.storage
          .from(bucket)
          .upload(path, arraybuffer, {
            contentType: mimeType ?? "image/jpeg",
          });

        if (uploadError) {
          toast.error(uploadError.message);
          throw uploadError;
        }
        const {
          data: { publicUrl },
        } = supabase.client.storage.from(bucket).getPublicUrl(data.path);
        onSuccess?.(publicUrl);
      } catch (error) {
        console.log(error);
        if (error instanceof Error) {
          toast.error(error.message);
          return;
        }
        throw error;
      } finally {
        setUploading(false);
      }
    },
    [bucket, onSuccess, parentPath, supabase.client.storage, userId]
  );
  return { upload, uploading };
};
