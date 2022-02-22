import { createContext, useContext } from "react"
import { AppContextInterface } from 'interfaces/AppContext'

// set a default value
export const AppContext = createContext<AppContextInterface>({
  isInitialized: false,
  setIsInitialized: () => { },
  isLoggedIn: false,
  setIsLoggedIn: () => { },
  user: {
    affiliation_id: null,
    authority_id: null,
    birthday: null,
    created_at: null,
    date_registered: null,
    department_child_id: null,
    department_id: null,
    email: null,
    id: null,
    image: null,
    last_login_day: null,
    membership_type: null,
    name: null,
    plan_id: null,
    remarks: null,
    sex: null,
    updated_at: null,
    withdrawn_flag: null,
  },
  setUser: () => { },
  refreshUser: () => { },
  isDrawerOpen: false,
  setIsDrawerOpen: () => { },
})

export const useAppContext = () => useContext(AppContext)