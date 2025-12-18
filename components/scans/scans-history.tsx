"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from "@/components/ui/pagination"
import { Search, Filter, Eye, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import type { Scan } from "@/lib/types/database"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface ScansHistoryProps {
  scans: Scan[]
  totalScans: number
  currentPage: number
  pageSize: number
  currentSearch?: string
  currentRiskFilter?: string
  currentIndustryFilter?: string
}

export function ScansHistory({
  scans,
  totalScans,
  currentPage,
  pageSize,
  currentSearch,
  currentRiskFilter,
  currentIndustryFilter,
}: ScansHistoryProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set(name, value)
    return params.toString()
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value) {
      router.push(`/scans?${createQueryString("search", value)}`)
    } else {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("search")
      router.push(`/scans?${params.toString()}`)
    }
  }

  const handleRiskFilterChange = (value: string) => {
    if (value !== "all") {
      router.push(`/scans?${createQueryString("risk", value)}`)
    } else {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("risk")
      router.push(`/scans?${params.toString()}`)
    }
  }

  const handleIndustryFilterChange = (value: string) => {
    if (value !== "all") {
      router.push(`/scans?${createQueryString("industry", value)}`)
    } else {
      const params = new URLSearchParams(searchParams.toString())
      params.delete("industry")
      router.push(`/scans?${params.toString()}`)
    }
  }

  const totalPages = Math.ceil(totalScans / pageSize)

  const getRiskBadge = (level: string | null) => {
    switch (level) {
      case "safe":
        return (
          <Badge className="gap-1 bg-safe-green/10 text-safe-green">
            <CheckCircle className="h-3 w-3" />
            Safe
          </Badge>
        )
      case "warning":
        return (
          <Badge className="gap-1 bg-warning-yellow/10 text-warning-yellow">
            <AlertTriangle className="h-3 w-3" />
            Warning
          </Badge>
        )
      case "danger":
        return (
          <Badge className="gap-1 bg-risk-red/10 text-risk-red">
            <AlertTriangle className="h-3 w-3" />
            High Risk
          </Badge>
        )
      default:
        return (
          <Badge variant="outline" className="gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        )
    }
  }

  const getScoreColor = (score: number | null) => {
    if (!score) return "text-muted-foreground"
    if (score >= 80) return "text-safe-green"
    if (score >= 50) return "text-warning-yellow"
    return "text-risk-red"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Scan History</h1>
        <p className="mt-1 text-sm text-muted-foreground sm:text-base">View and manage all your compliance scans</p>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search scans..."
                value={currentSearch || ""}
                onChange={handleSearchChange}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Select value={currentRiskFilter || "all"} onValueChange={handleRiskFilterChange}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Risks</SelectItem>
                  <SelectItem value="safe">Safe</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                  <SelectItem value="danger">High Risk</SelectItem>
                </SelectContent>
              </Select>
              <Select value={currentIndustryFilter || "all"} onValueChange={handleIndustryFilterChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Industry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Industries</SelectItem>
                  <SelectItem value="real_estate">Real Estate</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="healthcare">Healthcare</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Scans</p>
            <p className="text-2xl font-bold">{totalScans}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Safe</p>
            <p className="text-2xl font-bold text-safe-green">{scans.filter((s) => s.safety_score && s.safety_score >= 80).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Warnings</p>
            <p className="text-2xl font-bold text-warning-yellow">
              {scans.filter((s) => s.safety_score && s.safety_score >= 50 && s.safety_score < 80).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">High Risk</p>
            <p className="text-2xl font-bold text-risk-red">{scans.filter((s) => s.safety_score && s.safety_score < 50).length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Scans ({totalScans})</CardTitle>
        </CardHeader>
        <CardContent>
          {scans.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Search className="mb-4 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">
                {totalScans === 0 ? "No scans yet. Start scanning content!" : "No scans match your filters"}
              </p>
              {totalScans === 0 && (
                <Button asChild className="mt-4 bg-trust-blue hover:bg-trust-blue/90">
                  <Link href="/scanner">Go to Scanner</Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Content Preview</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Industry</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {scans.map((scan) => (
                    <TableRow key={scan.id}>
                      <TableCell className="max-w-[300px]">
                        <p className="line-clamp-2 text-sm">{scan.original_content}</p>
                      </TableCell>
                      <TableCell>{getRiskBadge(scan.risk_level)}</TableCell>
                      <TableCell>
                        <span className={`font-semibold ${getScoreColor(scan.safety_score)}`}>
                          {scan.safety_score ?? "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {scan.industry?.replace("_", " ") || "General"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(scan.created_at), { addSuffix: true })}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="outline" size="sm" asChild className="bg-transparent">
                            <Link href={`/scans/${scan.id}`}>
                              <Eye className="h-4 w-4" />
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {totalPages > 1 && (
                <Pagination className="mt-4">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href={currentPage > 1 ? `/scans?${createQueryString("page", (currentPage - 1).toString())}` : "#"}
                        aria-disabled={currentPage <= 1}
                        tabIndex={currentPage <= 1 ? -1 : undefined}
                        className={currentPage <= 1 ? "pointer-events-none opacity-50" : undefined}
                      />
                    </PaginationItem>
                    {[...Array(totalPages)].map((_, i) => (
                      <PaginationItem key={i}>
                        <PaginationLink
                          href={`/scans?${createQueryString("page", (i + 1).toString())}`}
                          isActive={currentPage === i + 1}
                        >
                          {i + 1}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    <PaginationItem>
                      <PaginationNext
                        href={currentPage < totalPages ? `/scans?${createQueryString("page", (currentPage + 1).toString())}` : "#"}
                        aria-disabled={currentPage >= totalPages}
                        tabIndex={currentPage >= totalPages ? -1 : undefined}
                        className={currentPage >= totalPages ? "pointer-events-none opacity-50" : undefined}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
