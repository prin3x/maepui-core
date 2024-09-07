export class SignInResponseDto {
  uid: string;
  email: string;
  emailVerified: boolean;
  isAnonymous: boolean;
  accessToken: string;
  refreshToken: string;
  createdAt: string;
  lastLoginAt: string;
}

export class SignInResponseMapper {
  map(user): SignInResponseDto {
    return {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      isAnonymous: user.isAnonymous,
      accessToken: user.stsTokenManager.accessToken,
      refreshToken: user.stsTokenManager.refreshToken,
      createdAt: user.createdAt,
      lastLoginAt: user.last_login_at,
    };
  }
}
