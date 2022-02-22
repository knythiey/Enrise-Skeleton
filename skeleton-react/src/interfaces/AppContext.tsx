export type AppContextInterface = {
  isInitialized: boolean,
  setIsInitialized: (c: boolean) => void,
  isLoggedIn: boolean,
  setIsLoggedIn: (c: boolean) => void,
  user: any,
  setUser: (c: any) => void,
  refreshUser: () => void,
  isDrawerOpen: boolean,
  setIsDrawerOpen: (c: boolean) => void,
}