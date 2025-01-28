/**
 * User
 * A User
 */
declare interface User {
    id?: number;
    email: string;
    provider: string;
    providerId?: string | null;
    tenantId: string;
    userId: string;
}
export { User };
