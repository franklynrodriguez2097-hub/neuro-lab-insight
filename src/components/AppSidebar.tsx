import {
  LayoutDashboard,
  FlaskConical,
  Image,
  ClipboardList,
  Users,
  BarChart3,
  Download,
  Settings,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useRole } from "@/contexts/RoleContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const researchItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, roles: ["admin", "supervisor"] },
  { title: "Studies", url: "/studies", icon: FlaskConical, roles: ["admin", "supervisor"] },
  { title: "Stimuli", url: "/stimuli", icon: Image, roles: ["admin"] },
  { title: "Survey Builder", url: "/surveys", icon: ClipboardList, roles: ["admin"] },
];

const analysisItems = [
  { title: "Participant Sessions", url: "/sessions", icon: Users, roles: ["admin", "supervisor"] },
  { title: "Analytics", url: "/analytics", icon: BarChart3, roles: ["admin", "supervisor"] },
  { title: "Exports", url: "/export", icon: Download, roles: ["admin", "supervisor"] },
];

const systemItems = [
  { title: "Settings", url: "/settings", icon: Settings, roles: ["admin"] },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { role } = useRole();

  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const renderItems = (items: typeof researchItems) =>
    items
      .filter((item) => item.roles.includes(role))
      .map((item) => (
        <SidebarMenuItem key={item.title}>
          <SidebarMenuButton asChild isActive={isActive(item.url)}>
            <NavLink to={item.url} end={item.url === "/"}>
              <item.icon className="h-4 w-4" />
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ));

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-4 py-5">
        {!collapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-sidebar-primary/20 flex items-center justify-center">
              <FlaskConical className="h-4.5 w-4.5 text-sidebar-primary" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-sidebar-primary-foreground font-body tracking-wide">
                NeuroSmart
              </h1>
              <p className="text-[10px] text-sidebar-foreground/50 uppercase tracking-widest">
                Perception Lab
              </p>
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <FlaskConical className="h-5 w-5 text-sidebar-primary" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 uppercase text-[10px] tracking-widest">
            Research
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(researchItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/40 uppercase text-[10px] tracking-widest">
            Analysis
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(analysisItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {systemItems.some((i) => i.roles.includes(role)) && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-sidebar-foreground/40 uppercase text-[10px] tracking-widest">
              System
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>{renderItems(systemItems)}</SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter className="px-4 py-3">
        {!collapsed && (
          <p className="text-[9px] text-sidebar-foreground/30 uppercase tracking-wider text-center">
            Universidad de La Sabana
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
