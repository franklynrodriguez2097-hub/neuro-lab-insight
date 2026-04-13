import {
  LayoutDashboard,
  FlaskConical,
  Image,
  ClipboardList,
  Users,
  BarChart3,
  Download,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
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
  useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Studies", url: "/studies", icon: FlaskConical },
  { title: "Stimuli", url: "/stimuli", icon: Image },
  { title: "Surveys", url: "/surveys", icon: ClipboardList },
];

const analysisItems = [
  { title: "Participants", url: "/participants", icon: Users },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Export", url: "/export", icon: Download },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  const renderItems = (items: typeof mainItems) =>
    items.map((item) => (
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
        {!collapsed && (
          <div className="flex items-center gap-2">
            <FlaskConical className="h-6 w-6 text-sidebar-primary" />
            <div>
              <h1 className="text-sm font-semibold text-sidebar-primary-foreground font-body tracking-wide">
                NeuroSmart
              </h1>
              <p className="text-[10px] text-sidebar-foreground/60 uppercase tracking-widest">
                Perception Lab
              </p>
            </div>
          </div>
        )}
        {collapsed && (
          <FlaskConical className="h-5 w-5 text-sidebar-primary mx-auto" />
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-[10px] tracking-widest">
            Research
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(mainItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="text-sidebar-foreground/50 uppercase text-[10px] tracking-widest">
            Analysis
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>{renderItems(analysisItems)}</SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
