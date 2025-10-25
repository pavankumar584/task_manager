import { NextFunction, Request, Response } from 'express';
import semver from 'semver';
export function versionMiddleware(versions: string[]) {
  return function (req: Request, _: Response, next: NextFunction) {
    const headerVersion = req.headers['version'] as string;
    if (headerVersion && versions.some(version => semver.eq(headerVersion.toString(), version))) {
      return next();
    }
    return next('route'); // skip to the next route
  };
}
