import { Request } from 'express';

export function getUsernameFRomRequest(request: Request) {
  return request['user'].name;
}
