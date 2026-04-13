import { useState, createContext, useContext } from "react";

export type UserRole = "admin" | "participant" | "supervisor";

interface RoleContextValue {
  role: UserRole;
  setRole: (role: UserRole) => void;
  roleName: string;
}

const ROLE_NAMES: Record<UserRole, string> = {
  admin: "Admin Researcher",
  participant: "Participant",
  supervisor: "Supervisor / Analyst",
};

const RoleContext = createContext<RoleContextValue>({
  role: "admin",
  setRole: () => {},
  roleName: "Admin Researcher",
});

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRole] = useState<UserRole>("admin");
  return (
    <RoleContext.Provider value={{ role, setRole, roleName: ROLE_NAMES[role] }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}
