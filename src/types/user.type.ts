import { BaseEntity } from '.';

export type UserRelationshipStatus = 'none' | 'blocking' | 'blocked' | 'me';
type UserStatus = 'pending' | 'active' | 'banned' | 'unset' | 'inactive' | 'anonymous' | 'deleted';
export type User = {
  _id?: string;
  name?: string;
  avatar?: string;
  email?: string;

  // language: string;
  // status: UserStatus;
  // phoneNumber?: string;
  // username: string;
  stayLogin?: boolean;
  remember?: boolean;
  isFirstLogin?: boolean;
} & BaseEntity;
