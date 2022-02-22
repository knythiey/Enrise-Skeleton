import { getUser } from "services/UserService";

export const checkSubscription = (): boolean => {
  // const user = getUser();
  // return user !== null && (!user.withdrawn_flag || user.withdrawn_flag === 0);
  return true;
};
