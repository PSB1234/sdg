"use client";
import * as React from "react";
import Image from "next/image";
import { redirect, usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { P } from "@/components/typography";
import { NavUser } from "@/components/nav-user";
import { useEffect } from "react";

const data = {
  navMain: [
    {
      title: "Leads",
      url: "#",
      items: [
        {
          title: "My Leads",
          url: "#",
          isActive: false,
        },
        {
          title: "All Leads",
          url: "#",
          isActive: false,
        },
        {
          title: "Add New Leads",
          url: "#",
          isActive: false,
        },
      ],
    },
    {
      title: "Ai Insights",
      url: "#",
      isActive: false,
    },
    {
      title: "Task",
      url: "#",
      isActive: false,
    },
    {
      title: "Reports",
      url: "#",
      isActive: false,
    },
    {
      title: "Lead Distribution ",
      url: "#",
      isActive: false,
    },
    {
      title: "Audit Logs",
      url: "#",
      isActive: false,
    },
    {
      title: "Help & Support",
      url: "#",
      isActive: false,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Derive active state from the current pathname
  const pathname = usePathname();
  const API_BASE =
    process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:8080/api";
  // Expect paths like /dashboard, /dashboard/leads, /dashboard/leads/my-leads
  const [, , sectionParam, viewParam] = (pathname || "/").split("/");

  const slugify = (s: string) =>
    s
      .toLowerCase()
      .replace(/&/g, "and")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  const [user, setUser] = React.useState<{
    _id: string;
    name: string;
    email: string;
    age?: number;
    roles: string[];
    isActive: boolean;
    isEmailVerified: boolean;
    loginAttempts: number;
    permissions: string[];
    createdAt: string;
    updatedAt: string;
  } | null>(null);

  const [isLoading, setIsLoading] = React.useState(true);

  const getUser = React.useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        redirect("/login");
        return;
      }

      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        redirect("/login");
        return;
      }
      const userData = (await response.json()) as {
        user: {
          _id: string;
          name: string;
          email: string;
          age?: number;
          roles: string[];
          isActive: boolean;
          isEmailVerified: boolean;
          loginAttempts: number;
          permissions: string[];
          createdAt: string;
          updatedAt: string;
        };
      };
      console.log("Fetched user data:", userData);
      setUser(userData.user);
    } catch (error) {
      console.error("Failed to fetch user:", error);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      redirect("/login");
    } finally {
      setIsLoading(false);
    }
  }, [API_BASE]);
  useEffect(() => {
    void getUser();
  }, [getUser]);
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <div>
                <Link href="/dashboard" className="flex items-center gap-2">
                  <Image
                    src="/favicon.ico"
                    width={30}
                    height={30}
                    alt="logo"
                    className="rounded-sm"
                  />
                </Link>
                <div className="flex w-full flex-row items-center justify-between gap-0.5 text-center leading-none">
                  <P className="m-0 p-0 font-medium">SDG Finance</P>
                  <P className="m-0 p-0">v0.0.1</P>
                </div>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => {
              const parentSlug = slugify(item.title);
              const isParentActive = sectionParam === parentSlug;
              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      className={`font-medium ${isParentActive ? "text-primary" : ""}`}
                      href={`/dashboard/${parentSlug}`}
                    >
                      {item.title}
                    </Link>
                  </SidebarMenuButton>
                  {item.items?.length ? (
                    <SidebarMenuSub>
                      {item.items.map((sub) => {
                        const subSlug = slugify(sub.title);
                        const isActive =
                          isParentActive && viewParam === subSlug;
                        return (
                          <SidebarMenuSubItem key={sub.title}>
                            <SidebarMenuSubButton asChild isActive={isActive}>
                              <Link
                                href={`/dashboard/${parentSlug}/${subSlug}`}
                              >
                                {sub.title}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  ) : null}
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
      <SidebarFooter>
        {!isLoading && user && (
          <NavUser
            user={{
              name: user.name,
              email: user.email,
              avatar: "/avatars/default.jpg",
            }}
          />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
