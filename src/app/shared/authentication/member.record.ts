export type MemberRecord = {
  username: string; // normalized lowercase (lookup key)
  displayName: string; // original casing as provided at registration
  salt: string; // per-user salt
  hash: string; // salted+peppered hash
  createdAt: number;
};
