import { ReactNode, memo } from 'react'
import { ChevronRight } from 'lucide-react'
import { Link, usePage } from '@inertiajs/react'
import {
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  useSidebar,
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Badge } from '@/components/ui/badge'
import type { SidebarItemProps, SidebarSubItemProps } from '../types'

function checkIsActive(
  item: SidebarItemProps | SidebarSubItemProps,
  href: string,
  mainNav = false
) {
  return (
    href === item.url || // /endpoint?search=param
    href.split('?')[0] === item.url || // endpoint
    !!(item as SidebarItemProps).items?.filter((i) => i.url === href).length || // if child nav is active
    (mainNav && href.split('/')[1] !== '' && href.split('/')[1] === item?.url?.split('/')[1])
  )
}
const SidebarMenuButtonCustom = ({
  children,
  item,
  href,
}: Readonly<{ children?: ReactNode; item: SidebarSubItemProps; href: string }>) => {
  const { setOpenMobile } = useSidebar()
  return (
    <SidebarMenuButton
      asChild
      isActive={checkIsActive(item, href)}
      tooltip={item.title}
      className="data-[active=true]:bg-primary data-[active=true]:text-white"
    >
      <Link href={item.url} onClick={() => setOpenMobile(false)}>
        {item.icon && <item.icon className="size-4 shrink-0" />}
        <span className="truncate">{item.title}</span>
        {item.badge && <NavBadge>{item.badge}</NavBadge>}
        {children}
      </Link>
    </SidebarMenuButton>
  )
}

const NavBadge = memo(({ children }: { children: ReactNode }) => (
  <Badge className="ml-auto rounded-full px-1.5 py-0.5 text-xs font-medium">{children}</Badge>
))

const SidebarMenuCollapsible = ({ item, href }: { item: SidebarItemProps; href: string }) => {
  const { setOpenMobile } = useSidebar()

  return (
    <Collapsible
      asChild
      defaultOpen={checkIsActive(item, href, true)}
      className="group/collapsible"
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className="CollapsibleContent">
          <SidebarMenuSub>
            {item.items?.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  asChild
                  isActive={checkIsActive(subItem, href)}
                  className="data-[active=true]:bg-primary data-[active=true]:text-white"
                >
                  <Link href={subItem.url} onClick={() => setOpenMobile(false)}>
                    {subItem.icon && <subItem.icon />}
                    <span>{subItem.title}</span>
                    {subItem.badge && <NavBadge>{subItem.badge}</NavBadge>}
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

const SidebarMenuCollapsedDropdown = ({ item, href }: { item: SidebarItemProps; href: string }) => {
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButtonCustom item={item} href={href}>
            <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
          </SidebarMenuButtonCustom>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start" sideOffset={4}>
          <DropdownMenuLabel>
            {item.title} {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>
          {item.items ? (
            <>
              <DropdownMenuSeparator />
              {item.items.map((sub) => (
                <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
                  <Link
                    href={sub.url}
                    className={`${checkIsActive(sub, href) ? 'bg-secondary' : ''}`}
                  >
                    {sub.icon && <sub.icon />}
                    <span className="max-w-52 text-wrap">{sub.title}</span>
                    {sub.badge && <span className="ml-auto text-xs">{sub.badge}</span>}
                  </Link>
                </DropdownMenuItem>
              ))}
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}

export function NavMenu({ item }: Readonly<{ item: SidebarItemProps | SidebarSubItemProps }>) {
  const page = usePage()
  const { state, isMobile } = useSidebar()
  const key = `${item.title}-${item.url}`

  const sidebarItem = item as unknown as SidebarItemProps
  const sidebarSubItem = item as unknown as SidebarSubItemProps
  if (!sidebarItem.items)
    return (
      <SidebarMenuItem key={key}>
        <SidebarMenuButtonCustom item={sidebarSubItem} href={page.url}></SidebarMenuButtonCustom>
      </SidebarMenuItem>
    )

  if (state === 'collapsed' && !isMobile)
    return <SidebarMenuCollapsedDropdown key={key} item={sidebarItem} href={page.url} />

  return <SidebarMenuCollapsible key={key} item={sidebarItem} href={page.url} />
}
