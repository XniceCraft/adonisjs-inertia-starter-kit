import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export type SidebarSubItemProps = {
  title: string
  url: string
  icon?: LucideIcon
  badge?: number
}

export type SidebarItemProps = {
  title: string
  url: string
  icon: LucideIcon
  badge?: number
  items?: Array<SidebarSubItemProps>
}

export type SidebarProps = {
  items: Array<SidebarItemProps>
  footer?: ReactNode
}
