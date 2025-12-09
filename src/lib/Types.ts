export type User = {
  name: string;
  email: string;
  credits: number;
  subscriptionId?: string;
};

export type Messages = {
  role: string;
  content: string;
};
