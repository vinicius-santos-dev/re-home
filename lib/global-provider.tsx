/**
 * Global Context Provider
 * 
 * Provides application-wide state management using React Context.
 * Primarily handles user authentication state and user data.
 */

import { useAppwrite } from "@/lib/useAppwrite";
import { createContext, ReactNode, useContext } from "react";
import { getCurrentUser } from "./appwrite";

/**
 * Global context type definition containing authentication state
 */
interface GlobalContextType {
  isLogged: boolean;
  user: User | null;
  loading: boolean;
  refetch: () => void; // Function to refresh user data
}

/**
 * Represents the authenticated user structure from Appwrite
 */
interface User {
  $id: string;
  name: string;
  email: string;
  avatar: string;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

interface GlobalProviderProps {
  children: ReactNode;
}

/**
 * Global Provider Component
 * 
 * Wraps the application and provides authentication state and user data
 * to all child components using React Context.
 * 
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <GlobalProvider>
 *       <YourApp />
 *     </GlobalProvider>
 *   );
 * }
 * ```
 */
const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const { data: user, loading, refetch } = useAppwrite({ fn: getCurrentUser });

  const isLogged = !!user;

  // console.log(JSON.stringify(user, null, 2));

  return (
    <GlobalContext.Provider
      value={{
        isLogged,
        user,
        loading,
        refetch,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

/**
 * Custom hook to access the global context
 * 
 * @throws Error if used outside of GlobalProvider
 * @returns GlobalContextType containing auth state and user data
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isLogged, user } = useGlobalContext();
 *   return isLogged ? <p>Welcome {user.name}!</p> : <p>Please login</p>;
 * }
 * ```
 */
export const useGlobalContext = (): GlobalContextType => {
  const context = useContext(GlobalContext);

  if (!context)
    throw new Error("useGlobalContext must be used within a GlobalProvider");

  return context;
};

export default GlobalProvider;
