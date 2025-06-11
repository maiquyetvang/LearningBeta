import '@azure/core-asynciterator-polyfill';
import { AttachmentRecord } from '@powersync/attachments';
import { Kysely, wrapPowerSyncWithKysely } from '@powersync/kysely-driver';
import { PowerSyncDatabase } from '@powersync/react-native';
import { Expression, ParseJSONResultsPlugin, RawBuilder } from 'kysely';
import React from 'react';
import { OPSqliteOpenFactory } from '@powersync/op-sqlite';
import { KVStorage, SupabaseStorageAdapter } from '../storage';
import { PhotoAttachmentQueue } from './attachment-queue';
import { SupabaseConnector } from '../supabase';
import { AppSchema, Database } from './app-schema';
import { SUPABASE_STORAGE_BUCKET } from '~/constant';

export class System {
  kvStorage: KVStorage;
  storage: SupabaseStorageAdapter;
  supabase: SupabaseConnector;
  powersync: PowerSyncDatabase;
  attachmentQueue: PhotoAttachmentQueue | undefined = undefined;
  db: Kysely<Database> & {
    withProfile: (profileId: Expression<string>) => RawBuilder<{
      id: string | null;
      username: string | null;
      full_name: string | null;
      avatar_url: string | null;
      currency_code: string | null;
    } | null>;
  };

  constructor() {
    this.kvStorage = new KVStorage();
    this.supabase = new SupabaseConnector(this);
    this.storage = this.supabase.storage;
    this.powersync = new PowerSyncDatabase({
      schema: AppSchema,
      database: new OPSqliteOpenFactory({
        dbFilename: 'sqlite.db',
      }),
    });
    //@ts-ignore
    this.db = wrapPowerSyncWithKysely(this.powersync, {
      plugins: [new ParseJSONResultsPlugin()],
    });
    // this.db.withProfile = (profileId: Expression<string>) => {
    //   return jsonObjectFrom(
    //     this.db
    //       .selectFrom("profiles")
    //       .select([
    //         "id",
    //         "username",
    //         "full_name",
    //         "avatar_url",
    //         "currency_code",
    //       ])
    //       .whereRef("profiles.id", "=", profileId)
    //   );
    // };
    if (SUPABASE_STORAGE_BUCKET) {
      this.attachmentQueue = new PhotoAttachmentQueue({
        powersync: this.powersync,
        storage: this.storage,
        // Use this to handle download errors where you can use the attachment
        // and/or the exception to decide if you want to retry the download
        onDownloadError: async (attachment: AttachmentRecord, exception: any) => {
          if (exception.toString() === 'StorageApiError: Object not found') {
            return { retry: false };
          }

          return { retry: true };
        },
      });
    }
  }

  async init() {
    await this.powersync.init().catch((error) => {
      console.error('Failed to initialize powersync', error);
    });
    await this.powersync.connect(this.supabase).catch((error) => {
      console.error('Failed to connect to powersync', error);
    });

    if (this.attachmentQueue) {
      await this.attachmentQueue.init();
    }
  }
}

export const system = new System();

export const SystemContext = React.createContext(system);
export const useSystem = () => {
  const context = React.useContext(SystemContext);
  if (context === undefined) {
    throw new Error('useSystem must be used within a SystemProvider');
  }
  return context;
};
