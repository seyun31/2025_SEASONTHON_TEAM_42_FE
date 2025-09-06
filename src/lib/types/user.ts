export interface Address {
  city: string;
  street: string;
}

export interface AdditionalInfo {
  birthDate: string;
  gender: 'FEMALE' | 'MALE';
  address: Address;
}

export interface UserData {
  userId: number;
  name: string;
  socialProvider: string;
  socialId: string;
  email: string;
  profileImage: string;
  additionalInfo: AdditionalInfo;
}

export interface ApiError {
  code: string;
  message: string;
}

export interface UserResponse {
  result: 'SUCCESS' | 'ERROR';
  data: UserData;
  error: ApiError;
}
