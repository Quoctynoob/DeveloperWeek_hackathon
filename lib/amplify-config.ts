export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-2_q4343eMy6',
      userPoolClientId: '14kmscqedrr2og8goqoba0sdo2',
      signUpVerificationMethod: 'code' as const,
      loginWith: {
        email: true,
      },
    },
  },
};