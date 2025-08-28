'use client'

import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { TableViewOptions } from '@/components/table/data_table_view_option'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'
import { useIsClient } from '@/context/client_provider'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  initialSorting?: SortingState
  initialVisibility?: VisibilityState
}

export function DataTable<TData, TValue>({
  columns,
  data,
  initialSorting,
  initialVisibility,
}: Readonly<DataTableProps<TData, TValue>>) {
  const isClient = useIsClient()
  const [sorting, setSorting] = useState<SortingState>(initialSorting || [])
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(initialVisibility || {})

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      sorting,
      columnVisibility,
    },
  })

  return (
    <div>
      <div className="flex items-center justify-end py-4">
        <TableViewOptions table={table} />
      </div>
      <div className="overflow-hidden rounded-md border">
        {isClient ? (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    )
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        ) : (
          <Skeleton className="h-64" />
        )}
      </div>
    </div>
  )
}
