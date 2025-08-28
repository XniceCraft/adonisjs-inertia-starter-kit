import { GalleryVerticalEnd } from 'lucide-react'
import { usePage } from '@inertiajs/react'
import { Separator } from '@/components/ui/separator'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarGroupLabel,
  SidebarGroup,
  SidebarRail,
  SidebarFooter,
} from '@/components/ui/sidebar'
import { NavMenu } from './items/nav_menu'

import type { SidebarProps } from './types'

export function BaseSidebar({ items, footer = undefined }: Readonly<SidebarProps>) {
  const page = usePage()

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="overflow-hidden">
        <div className="flex gap-3 items-center p-2 group-data-[collapsible=icon]:p-0!">
          <div className="bg-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <h1 className="font-medium truncate">{page.props.appName as string}</h1>
        </div>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            {items.map((item) => (
              <NavMenu key={item.title} item={item} />
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      {footer && (
        <>
          <Separator />
          <SidebarFooter>{footer}</SidebarFooter>
        </>
      )}
      <SidebarRail />
    </Sidebar>
  )
}
