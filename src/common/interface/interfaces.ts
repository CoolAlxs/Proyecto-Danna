export interface requestUser extends Request {
  user: currentUserInterface;
}

export interface currentUserInterface {
  user_ID: string;
  name: string;
  lastName: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export interface payload {
  user_ID: string;
  name: string;
  lastName: string;
  email: string;
  role: string;
}
