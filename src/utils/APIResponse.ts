import { Response } from 'express';
import { DEFAULT_LIMIT, DEFAULT_OFFSET } from 'src/constants/api';

interface APIResponse {
  status: number;
  message: string;
  data: any[];
  errorCode?: string;
  total?: number;
}

export interface APIError {
  errorCode: string;
}

export const APIResponse = (
  res: Response,
  repData: APIResponse,
): Response<any, Record<string, any>> =>
  res.status(repData.status).json(repData);

export const toQueryParams = (query) => {
  const { offset = DEFAULT_OFFSET, limit = DEFAULT_LIMIT, search = '' } = query;

  let q = {};

  try {
    q = JSON.parse(query.q);
  } catch (e) {
    q = {};
  }

  return {
    offset: parseInt(offset, 10),
    limit: parseInt(limit, 10),
    search,
    q,
    getTotal: query.getTotal,
  };
};
