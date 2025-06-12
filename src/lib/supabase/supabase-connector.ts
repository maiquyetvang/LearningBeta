import {
  AbstractPowerSyncDatabase,
  CrudEntry,
  PowerSyncBackendConnector,
  UpdateType,
} from '@powersync/react-native';

import { SupabaseClient, createClient } from '@supabase/supabase-js';
import { POWERSYNC_URL, SUPABASE_ANON_KEY, SUPABASE_URL } from '~/constant';
import { System } from '../powersync';
import { SupabaseStorageAdapter } from '../storage';

/// Postgres Response codes that we cannot recover from by retrying.
const FATAL_RESPONSE_CODES = [
  // Class 22 — Data Exception
  // Examples include data type mismatch.
  new RegExp('^22...$'),
  // Class 23 — Integrity Constraint Violation.
  // Examples include NOT NULL, FOREIGN KEY and UNIQUE violations.
  new RegExp('^23...$'),
  // INSUFFICIENT PRIVILEGE - typically a row-level security violation
  new RegExp('^42501$'),
];

export class SupabaseConnector implements PowerSyncBackendConnector {
  client: SupabaseClient;

  storage: SupabaseStorageAdapter;
  constructor(protected system: System) {
    this.client = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        storage: this.system.kvStorage,
      },
    });
    this.storage = new SupabaseStorageAdapter({ client: this.client });
  }

  async userId() {
    const {
      data: { session },
    } = await this.client.auth.getSession();

    return session?.user.id;
  }

  async signinWithGoogle() {
    const { error } = await this.client.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${POWERSYNC_URL}/auth/callback`,
      },
    });
    if (error) {
      throw error;
    }
  }
  async login(username: string, password: string) {
    const { error } = await this.client.auth.signInWithPassword({
      email: username,
      password: password,
    });

    if (error) {
      throw error;
    }
  }

  async register(username: string, password: string) {
    const { error } = await this.client.auth.signUp({
      email: username,
      password: password,
    });
    console.log({ error });
    if (error) {
      throw error;
    }
  }

  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    //  {
    // Kiểm tra mật khẩu mới và cũ có giống nhau không
    if (oldPassword === newPassword) {
      throw new Error('New password must be different from current password');
    }

    // Lấy email của user hiện tại
    const { data: userData, error: userError } = await this.client.auth.getUser();

    if (userError || !userData.user || !userData.user.email) {
      throw new Error(
        `Could not get current user info: ${userError?.message || 'User not found or email missing'}`,
      );
    }

    // Kiểm tra mật khẩu cũ bằng cách đăng nhập lại
    const { error: signInError } = await this.client.auth.signInWithPassword({
      email: userData.user.email,
      password: oldPassword,
    });

    if (signInError) {
      throw new Error(`Current password is incorrect: ${signInError.message}`);
    }

    // Nếu đăng nhập thành công, cập nhật mật khẩu mới
    const { error: updateError } = await this.client.auth.updateUser({
      password: newPassword,
    });

    if (updateError) {
      throw new Error(`Could not change password: ${updateError.message}`);
    }

    console.log('Password changed successfully');
    // } catch (error) {
    //   console.error("Error changing password:", error);
    //   throw error;
    // }
  }

  async signOut() {
    return this.client.auth.signOut();
  }

  async fetchCredentials() {
    const {
      data: { session },
      error,
    } = await this.client.auth.getSession();

    if (!session || error) {
      throw new Error(`Could not fetch Supabase credentials: ${error}`);
    }

    console.debug(
      'session expires at',
      session.expires_at && new Date(session.expires_at * 1000).toLocaleString(),
    );

    return {
      client: this.client,
      endpoint: POWERSYNC_URL,
      token: session.access_token ?? '',
      expiresAt: session.expires_at ? new Date(session.expires_at * 1000) : undefined,
      userID: session.user.id,
    };
  }

  async uploadData(database: AbstractPowerSyncDatabase): Promise<void> {
    const transaction = await database.getNextCrudTransaction();

    if (!transaction) {
      return;
    }

    let lastOp: CrudEntry | null = null;
    try {
      // Note: If transactional consistency is important, use database functions
      // or edge functions to process the entire transaction in a single call.
      for (const op of transaction.crud) {
        lastOp = op;
        const table = this.client.from(op.table);
        let result: any = null;
        switch (op.op) {
          case UpdateType.PUT:
            const record = { ...op.opData, id: op.id };
            result = await table.upsert(record);
            break;
          case UpdateType.PATCH:
            result = await table.update(op.opData).eq('id', op.id);
            break;
          case UpdateType.DELETE:
            result = await table.delete().eq('id', op.id);
            break;
        }

        if (result.error) {
          throw new Error(`Could not ${op.op} data to Supabase error: ${JSON.stringify(result)}`);
        }
      }

      await transaction.complete();
    } catch (ex: any) {
      console.debug(ex);
      if (typeof ex.code == 'string' && FATAL_RESPONSE_CODES.some((regex) => regex.test(ex.code))) {
        /**
         * Instead of blocking the queue with these errors,
         * discard the (rest of the) transaction.
         *
         * Note that these errors typically indicate a bug in the application.
         * If protecting against data loss is important, save the failing records
         * elsewhere instead of discarding, and/or notify the user.
         */
        console.error(`Data upload error - discarding ${lastOp}`, ex);
        await transaction.complete();
      } else {
        // Error may be retryable - e.g. network error or temporary server error.
        // Throwing an error here causes this call to be retried after a delay.
        throw ex;
      }
    }
  }
}
