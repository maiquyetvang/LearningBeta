import { User } from "./user.type";

export type BaseEntity = {
  _id: string;
  createdAt?: string;
  updatedAt?: string;
};

export type CursorParams = {
  limit?: number;
  cursor?: string;
  direction?: "forward" | "backward";
};

export type CursorPagination = {
  hasNextPage: boolean;
  endCursor: string;
};

export type OffsetPagination = {
  limit: number;
  total: number;
  currentPage: number;
  totalPages: number;
};

// dynamic file name for api response types
export type Response<T> = {
  message: string;
  data: T;
};

// export type SingleResponse<T, K extends string = 'data'> = {
//   message: string;
// } & Record<K, T>;

export type ListResponse<T, P extends OffsetPagination | CursorPagination> = {
  items: T[];
  pageInfo: P;
};

export type MediaType = "image" | "video" | "audio" | "document";

export type Media = {
  url: string;
  type: MediaType;
  file?: File;
  size?: number;
  name?: string;
  width?: number;
  height?: number;
  sender?: User;
  createdAt?: string;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
};

export * from "./auth.type";
