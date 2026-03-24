/**
 * DC Current App APIs
 * Provides current-app scoped overview, snapshot, forum, review, and review action APIs.
 */

import { HttpClient } from '../../core/network/httpClient.js';
import type { ResolvedContext } from '../../core/types/context.js';
import { EnvConfig } from '../../core/utils/env.js';

const CURRENT_APP_API_PREFIX = '/mcp/v1/current-app';

/**
 * Generic JSON object returned by server-side DC APIs.
 */
export interface JsonObject {
  [key: string]: unknown;
}

/**
 * Whether a value is a plain JSON object.
 */
function isJsonObject(value: unknown): value is JsonObject {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * Build a readable description for unexpected upstream payloads.
 */
function describeUnexpectedResponse(value: unknown): string {
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (normalized.startsWith('<!doctype html') || normalized.startsWith('<html')) {
      return 'an HTML document';
    }

    return 'a text response';
  }

  if (Array.isArray(value)) {
    return 'a JSON array';
  }

  if (value === null) {
    return 'null';
  }

  return `a ${typeof value} value`;
}

/**
 * Ensure upstream returned a JSON object instead of HTML/text fallback pages.
 */
function ensureObjectResponse<T>(value: unknown, apiName: string): T {
  if (!isJsonObject(value)) {
    throw new Error(
      `${apiName} returned ${describeUnexpectedResponse(value)} instead of a JSON object. ` +
        `This usually means the configured host/path is serving a web page or gateway fallback.`
    );
  }

  return value as T;
}

/**
 * Ensure required list field exists on upstream JSON payload.
 */
function ensureArrayField(value: unknown, fieldName: string, apiName: string): void {
  if (!Array.isArray(value)) {
    throw new Error(
      `${apiName} returned invalid JSON: expected "${fieldName}" to be an array, ` +
        `but received ${describeUnexpectedResponse(value)}.`
    );
  }
}

/**
 * Store snapshot response for current app.
 */
export interface CurrentAppStoreSnapshotResponse {
  app?: JsonObject;
  stat?: JsonObject;
  rating_summary?: JsonObject;
  rating_trend?: JsonObject[];
  version_status?: string;
  update_time?: number;
  expected_launch_time?: string;
  can_view?: boolean;
}

/**
 * Current app store overview request parameters.
 */
export interface CurrentAppStoreOverviewParams {
  app_id: number;
  start_date?: string;
  end_date?: string;
}

/**
 * Store overview trend item.
 */
export interface CurrentAppStoreOverviewTrendItem {
  date: string;
  apk_download_request_count?: number;
  tap_play_download_request_count?: number;
  download_request_count?: number;
  pc_download_request_count?: number;
}

/**
 * Current app store overview response.
 */
export interface CurrentAppStoreOverviewResponse {
  start_date?: string;
  end_date?: string;
  page_view_count?: number;
  download_count?: number;
  reserve_count?: number;
  ad_download_reserve_count?: number;
  download_request_count?: number;
  pc_download_request_count?: number;
  trend?: CurrentAppStoreOverviewTrendItem[];
}

/**
 * Current app review overview request parameters.
 */
export interface CurrentAppReviewOverviewParams {
  app_id: number;
  start_date?: string;
  end_date?: string;
}

/**
 * Review overview response.
 */
export interface CurrentAppReviewOverviewResponse {
  start_date?: string;
  end_date?: string;
  rating_summary?: JsonObject;
  rating_score?: string;
  rating_trend?: JsonObject[];
  positive_review_count?: number;
  neutral_review_count?: number;
  negative_review_count?: number;
}

/**
 * Community overview request parameters.
 */
export interface CurrentAppCommunityOverviewParams {
  app_id: number;
  start_date?: string;
  end_date?: string;
}

/**
 * Community overview trend item.
 */
export interface CurrentAppCommunityOverviewTrendItem {
  date: string;
  value?: number;
}

/**
 * Community overview response.
 */
export interface CurrentAppCommunityOverviewResponse {
  start_date?: string;
  end_date?: string;
  group?: JsonObject;
  topic_count?: number;
  favorite_count?: number;
  topic_page_view_count?: number;
  feed_count?: number;
  topic_trend?: CurrentAppCommunityOverviewTrendItem[];
  favorite_trend?: CurrentAppCommunityOverviewTrendItem[];
}

/**
 * Forum contents query parameters.
 */
export interface CurrentAppForumContentsParams {
  app_id: number;
  type?: string;
  sort?: string;
  from?: number;
  limit?: number;
  group_label_id?: number;
}

/**
 * Forum contents response.
 */
export interface CurrentAppForumContentsResponse {
  group?: JsonObject;
  list: JsonObject[];
  prev_page?: string;
  next_page?: string;
  total?: number;
}

/**
 * Current app reviews query parameters.
 */
export interface CurrentAppReviewsParams {
  app_id: number;
  sort?: 'new' | 'hot' | 'spent';
  from?: number;
  limit?: number;
  is_collapsed?: boolean;
  filter_platform?: 'mobile' | 'pc' | 'web';
}

/**
 * Current app reviews response.
 */
export interface CurrentAppReviewsResponse {
  list: JsonObject[];
  prev_page?: string;
  next_page?: string;
  total?: number;
  has_collapsed_list?: boolean;
}

/**
 * Like review request parameters.
 */
export interface LikeCurrentAppReviewParams {
  app_id: number;
  review_id: number;
}

/**
 * Like review response.
 */
export interface LikeCurrentAppReviewResponse {
  app_id: number;
  review_id: number;
  moment_id?: number;
  vote_value?: string;
  executed: boolean;
}

/**
 * Review reply risk level.
 */
export enum ReviewReplyRiskLevel {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

/**
 * Reply review request parameters.
 */
export interface ReplyCurrentAppReviewParams {
  app_id: number;
  review_id: number;
  contents: string;
  reply_comment_id?: number;
  confirm_high_risk?: boolean;
}

/**
 * Reply review response.
 */
export interface ReplyCurrentAppReviewResponse {
  app_id: number;
  review_id: number;
  risk_level: ReviewReplyRiskLevel;
  risk_reasons?: string[];
  sent: boolean;
  need_confirmation: boolean;
  comment?: JsonObject;
  draft?: string;
}

/**
 * Resolve app_id from the selected app cache.
 */
function resolveCurrentAppId(appId: number | undefined, ctx?: ResolvedContext): number {
  const resolved = appId ?? ctx?.resolveApp().appId;

  if (!resolved) {
    throw new Error(
      'app_id is required. Please either:\n' +
        '1. Use select_app tool to select an app first, or\n' +
        '2. Ensure current app context is available'
    );
  }

  return resolved;
}

/**
 * Get current app store snapshot.
 */
export async function getCurrentAppStoreSnapshot(
  appId: number | undefined,
  ctx?: ResolvedContext
): Promise<CurrentAppStoreSnapshotResponse> {
  const client = new HttpClient(ctx);
  const resolvedAppId = resolveCurrentAppId(appId, ctx);
  const baseUrl = EnvConfig.dcCurrentAppBaseUrl;

  try {
    const response = ensureObjectResponse<CurrentAppStoreSnapshotResponse>(
      await client.get<unknown>(`${CURRENT_APP_API_PREFIX}/store-snapshot`, {
        baseUrl,
        params: {
          app_id: resolvedAppId.toString(),
        },
      }),
      'Current app store snapshot API'
    );

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get current app store snapshot: ${error.message}`);
    }

    throw new Error(`Failed to get current app store snapshot: ${String(error)}`);
  }
}

/**
 * Get current app store overview.
 */
export async function getCurrentAppStoreOverview(
  params: CurrentAppStoreOverviewParams,
  ctx?: ResolvedContext
): Promise<CurrentAppStoreOverviewResponse> {
  const client = new HttpClient(ctx);
  const resolvedAppId = resolveCurrentAppId(params.app_id, ctx);
  const baseUrl = EnvConfig.dcCurrentAppBaseUrl;

  try {
    const query: Record<string, string> = {
      app_id: resolvedAppId.toString(),
    };
    if (params.start_date) query.start_date = params.start_date;
    if (params.end_date) query.end_date = params.end_date;

    const response = ensureObjectResponse<CurrentAppStoreOverviewResponse>(
      await client.get<unknown>(`${CURRENT_APP_API_PREFIX}/store-overview`, {
        baseUrl,
        params: query,
      }),
      'Current app store overview API'
    );

    ensureArrayField(response.trend, 'trend', 'Current app store overview API');

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get current app store overview: ${error.message}`);
    }

    throw new Error(`Failed to get current app store overview: ${String(error)}`);
  }
}

/**
 * Get current app review overview.
 */
export async function getCurrentAppReviewOverview(
  params: CurrentAppReviewOverviewParams,
  ctx?: ResolvedContext
): Promise<CurrentAppReviewOverviewResponse> {
  const client = new HttpClient(ctx);
  const resolvedAppId = resolveCurrentAppId(params.app_id, ctx);
  const baseUrl = EnvConfig.dcCurrentAppBaseUrl;

  try {
    const query: Record<string, string> = {
      app_id: resolvedAppId.toString(),
    };
    if (params.start_date) query.start_date = params.start_date;
    if (params.end_date) query.end_date = params.end_date;

    const response = ensureObjectResponse<CurrentAppReviewOverviewResponse>(
      await client.get<unknown>(`${CURRENT_APP_API_PREFIX}/review-overview`, {
        baseUrl,
        params: query,
      }),
      'Current app review overview API'
    );

    ensureArrayField(response.rating_trend, 'rating_trend', 'Current app review overview API');

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get current app review overview: ${error.message}`);
    }

    throw new Error(`Failed to get current app review overview: ${String(error)}`);
  }
}

/**
 * Get current app community overview.
 */
export async function getCurrentAppCommunityOverview(
  params: CurrentAppCommunityOverviewParams,
  ctx?: ResolvedContext
): Promise<CurrentAppCommunityOverviewResponse> {
  const client = new HttpClient(ctx);
  const resolvedAppId = resolveCurrentAppId(params.app_id, ctx);
  const baseUrl = EnvConfig.dcCurrentAppBaseUrl;

  try {
    const query: Record<string, string> = {
      app_id: resolvedAppId.toString(),
    };
    if (params.start_date) query.start_date = params.start_date;
    if (params.end_date) query.end_date = params.end_date;

    const response = ensureObjectResponse<CurrentAppCommunityOverviewResponse>(
      await client.get<unknown>(`${CURRENT_APP_API_PREFIX}/community-overview`, {
        baseUrl,
        params: query,
      }),
      'Current app community overview API'
    );

    ensureArrayField(response.topic_trend, 'topic_trend', 'Current app community overview API');
    ensureArrayField(
      response.favorite_trend,
      'favorite_trend',
      'Current app community overview API'
    );

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get current app community overview: ${error.message}`);
    }

    throw new Error(`Failed to get current app community overview: ${String(error)}`);
  }
}

/**
 * Get current app forum contents.
 */
export async function getCurrentAppForumContents(
  params: CurrentAppForumContentsParams,
  ctx?: ResolvedContext
): Promise<CurrentAppForumContentsResponse> {
  const client = new HttpClient(ctx);
  const resolvedAppId = resolveCurrentAppId(params.app_id, ctx);
  const baseUrl = EnvConfig.dcCurrentAppBaseUrl;

  try {
    const query: Record<string, string> = {
      app_id: resolvedAppId.toString(),
    };

    if (params.type) query.type = params.type;
    if (params.sort) query.sort = params.sort;
    if (params.from !== undefined) query.from = params.from.toString();
    if (params.limit !== undefined) query.limit = params.limit.toString();
    if (params.group_label_id !== undefined) {
      query.group_label_id = params.group_label_id.toString();
    }

    const response = ensureObjectResponse<CurrentAppForumContentsResponse>(
      await client.get<unknown>(`${CURRENT_APP_API_PREFIX}/forum-contents`, {
        baseUrl,
        params: query,
      }),
      'Current app forum contents API'
    );

    ensureArrayField(response.list, 'list', 'Current app forum contents API');

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get current app forum contents: ${error.message}`);
    }

    throw new Error(`Failed to get current app forum contents: ${String(error)}`);
  }
}

/**
 * Get current app reviews.
 */
export async function getCurrentAppReviews(
  params: CurrentAppReviewsParams,
  ctx?: ResolvedContext
): Promise<CurrentAppReviewsResponse> {
  const client = new HttpClient(ctx);
  const resolvedAppId = resolveCurrentAppId(params.app_id, ctx);
  const baseUrl = EnvConfig.dcCurrentAppBaseUrl;

  try {
    const query: Record<string, string> = {
      app_id: resolvedAppId.toString(),
    };

    if (params.sort) query.sort = params.sort;
    if (params.from !== undefined) query.from = params.from.toString();
    if (params.limit !== undefined) query.limit = params.limit.toString();
    if (params.is_collapsed !== undefined) {
      query.is_collapsed = String(params.is_collapsed);
    }
    if (params.filter_platform) query.filter_platform = params.filter_platform;

    const response = ensureObjectResponse<CurrentAppReviewsResponse>(
      await client.get<unknown>(`${CURRENT_APP_API_PREFIX}/reviews`, {
        baseUrl,
        params: query,
      }),
      'Current app reviews API'
    );

    ensureArrayField(response.list, 'list', 'Current app reviews API');

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get current app reviews: ${error.message}`);
    }

    throw new Error(`Failed to get current app reviews: ${String(error)}`);
  }
}

/**
 * Like a review under the current app.
 */
export async function likeCurrentAppReview(
  params: LikeCurrentAppReviewParams,
  ctx?: ResolvedContext
): Promise<LikeCurrentAppReviewResponse> {
  const client = new HttpClient(ctx);
  const resolvedAppId = resolveCurrentAppId(params.app_id, ctx);
  const baseUrl = EnvConfig.dcCurrentAppBaseUrl;

  try {
    const response = ensureObjectResponse<LikeCurrentAppReviewResponse>(
      await client.post<unknown>(`${CURRENT_APP_API_PREFIX}/reviews/like`, {
        baseUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: {
          app_id: resolvedAppId,
          review_id: params.review_id,
        },
      }),
      'Like current app review API'
    );

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to like current app review: ${error.message}`);
    }

    throw new Error(`Failed to like current app review: ${String(error)}`);
  }
}

/**
 * Reply to a review under the current app.
 */
export async function replyCurrentAppReview(
  params: ReplyCurrentAppReviewParams,
  ctx?: ResolvedContext
): Promise<ReplyCurrentAppReviewResponse> {
  const client = new HttpClient(ctx);
  const resolvedAppId = resolveCurrentAppId(params.app_id, ctx);
  const baseUrl = EnvConfig.dcCurrentAppBaseUrl;

  try {
    const response = ensureObjectResponse<ReplyCurrentAppReviewResponse>(
      await client.post<unknown>(`${CURRENT_APP_API_PREFIX}/reviews/reply`, {
        baseUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: {
          app_id: resolvedAppId,
          review_id: params.review_id,
          contents: params.contents,
          reply_comment_id: params.reply_comment_id,
          confirm_high_risk: params.confirm_high_risk,
        },
      }),
      'Reply current app review API'
    );

    return response;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to reply current app review: ${error.message}`);
    }

    throw new Error(`Failed to reply current app review: ${String(error)}`);
  }
}
