export type TokenResponse = {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
};

export type Pagination = {
  pageSize: number;
  totalCount: number;
  pageIndex: number;
  totalPages: number;
  continuationToken?: string | null;
};

export type FormLight = {
  formSlug?: string | null;
  formType: string;
  state: string;
  title?: string | null;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  currency?: string | null;
  url?: string | null;
};

export type FormsPage = {
  data?: FormLight[] | null;
  pagination: Pagination;
};

export type Place = {
  name?: string | null;
  address?: string | null;
  city?: string | null;
  zipCode?: string | null;
  country?: string | null;
};

export type TierPublic = {
  id: number;
  label?: string | null;
  tierType: string;
  price?: number | null;
};

export type FormPublic = FormLight & {
  place?: Place | null;
  tiers?: TierPublic[] | null;
};
