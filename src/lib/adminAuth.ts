// Backward-compatible exports.
// New code should import from `src/lib/auth/ownerSession.ts`.
export {
  getOwnerSessionCookieName as getAdminSessionCookieName,
  getOwnerSessionSecret as getAdminSessionSecret,
  createOwnerSessionToken as createAdminSessionToken,
  verifyOwnerSessionToken as verifyAdminSessionToken,
} from './auth/ownerSession';
