"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { api } from "@/lib/api";
import { useAuth } from "@/context/auth-context";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Plus, Loader2, Search, LayoutGrid, TableIcon } from "lucide-react";
import { useTheme } from "next-themes";

const fundSchema = z.object({
  code: z.string().min(2, "Code must be at least 2 characters"),
  name: z.string().min(3, "Name must be at least 3 characters"),
  region: z.string().optional(),
  currency: z.string().min(3, "Currency code required (e.g., USD)"),
});

export default function FundsPage() {
  const { user } = useAuth();
  const { theme, resolvedTheme } = useTheme();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards");
  const queryClient = useQueryClient();
  const [pageStyle, setPageStyle] = useState<React.CSSProperties>({});

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: light)");
    const prefersLight = mediaQuery.matches;
    const effectiveTheme = resolvedTheme || (prefersLight ? "light" : "dark");

    if (effectiveTheme === "light" || prefersLight) {
      setPageStyle({ colorScheme: "light" });
    } else if (effectiveTheme === "dark") {
      setPageStyle({ colorScheme: "light" });
    }
  }, [resolvedTheme]);

  const {
    data: funds,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["funds"],
    queryFn: async () => {
      try {
        const { data } = await api.get("/funds");
        return data;
      } catch (err: any) {
        toast.error(err.response?.data?.message || "Failed to load funds");
        throw err;
      }
    },
    retry: 1,
  });

  const form = useForm<z.infer<typeof fundSchema>>({
    resolver: zodResolver(fundSchema),
    defaultValues: {
      code: "",
      name: "",
      region: "",
      currency: "",
    },
  });

  const createFund = useMutation({
    mutationFn: async (values: z.infer<typeof fundSchema>) => {
      const { data } = await api.post("/funds", values);
      return data;
    },
    onSuccess: () => {
      toast.success("Fund created successfully");
      queryClient.invalidateQueries({ queryKey: ["funds"] });
      setDialogOpen(false);
      form.reset();
    },
    onError: (err: any) => {
      toast.error(
        err.response?.data?.message ||
          "Failed to create fund. Check if fund code already exists."
      );
    },
  });

  function onSubmit(values: z.infer<typeof fundSchema>) {
    createFund.mutate(values);
  }

  const isAdmin = user?.role === "ADMIN";

  // Filter funds by search and region
  const filteredFunds = funds?.filter((fund: any) => {
    const matchesSearch =
      fund.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fund.code.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRegion =
      regionFilter === "all" || fund.region === regionFilter;
    return matchesSearch && matchesRegion;
  });

  // Get unique regions for filter
  const regions = Array.from(
    new Set(funds?.map((f: any) => f.region).filter(Boolean))
  ) as string[];

  if (isLoading)
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="animate-spin" />
      </div>
    );

  const containerClass = resolvedTheme === "dark" ? "space-y-6" : "space-y-6";

  return (
    <div className={containerClass} style={pageStyle}>
      <div className="flex items-center justify-between">
        <div>
          <h1
            className={`text-3xl font-bold tracking-tight ${
              resolvedTheme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Funds
          </h1>
          <p
            className={
              resolvedTheme === "dark" ? "text-white" : "text-gray-600"
            }
          >
            Manage investment funds on the platform.
          </p>
        </div>
        {isAdmin && (
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Fund
              </Button>
            </DialogTrigger>
            <DialogContent
              className="bg-white"
              style={{ backgroundColor: "#ffffff" }}
            >
              <DialogHeader>
                <DialogTitle className="text-gray-900">
                  Create New Fund
                </DialogTitle>
                <DialogDescription className="text-gray-600">
                  Add a new investment fund to the platform.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900">
                          Fund Code
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="GF-001"
                            {...field}
                            className="bg-white border-gray-200 text-gray-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900">
                          Fund Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Global Tech Fund"
                            {...field}
                            className="bg-white border-gray-200 text-gray-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="region"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900">
                          Region (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="North America"
                            {...field}
                            className="bg-white border-gray-200 text-gray-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-900">
                          Currency
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="USD"
                            {...field}
                            className="bg-white border-gray-200 text-gray-900"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={createFund.isPending}>
                      {createFund.isPending ? "Creating..." : "Create Fund"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <div
        className="flex flex-col sm:flex-row gap-2"
        style={{
          backgroundColor: resolvedTheme === "dark" ? "transparent" : undefined,
        }}
      >
        <div className="relative flex-1">
          <Search
            className={`absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 ${
              resolvedTheme === "dark" ? "text-white" : "text-gray-500"
            }`}
          />
          <Input
            placeholder="Search funds by name or code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`pl-9 bg-white border-gray-200 ${
              resolvedTheme === "dark"
                ? "text-white placeholder:text-white/70"
                : ""
            }`}
            style={
              resolvedTheme === "dark"
                ? { color: "white" }
                : { color: "rgb(17, 24, 39)" }
            }
          />
        </div>
        <Select value={regionFilter} onValueChange={setRegionFilter}>
          <SelectTrigger className="w-full sm:w-[200px] bg-white border-gray-200">
            <SelectValue placeholder="Filter by Region" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Regions</SelectItem>
            {regions.map((region) => (
              <SelectItem key={region} value={region}>
                {region}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex gap-1 border border-gray-200 rounded-md p-1 bg-white">
          <Button
            variant={viewMode === "cards" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("cards")}
            className={resolvedTheme === "dark" ? "bg-gray-100" : ""}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "table" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setViewMode("table")}
            className={resolvedTheme === "dark" ? "bg-gray-100" : ""}
          >
            <TableIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === "cards" ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredFunds && filteredFunds.length === 0 ? (
            <p
              className={`col-span-full text-center py-12 ${
                resolvedTheme === "dark" ? "text-white" : "text-gray-600"
              }`}
            >
              No funds found.
            </p>
          ) : (
            filteredFunds?.map((fund: any) => (
              <Card
                key={fund.id}
                className={
                  resolvedTheme === "dark"
                    ? "bg-white border-gray-200"
                    : "bg-white border-gray-200"
                }
                style={{
                  backgroundColor:
                    resolvedTheme === "dark" ? "#ffffff" : undefined,
                }}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle
                        className={`text-lg ${
                          resolvedTheme === "dark"
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        {fund.name}
                      </CardTitle>
                      <CardDescription
                        className={`mt-1 ${
                          resolvedTheme === "dark"
                            ? "text-white"
                            : "text-gray-600"
                        }`}
                      >
                        <Badge
                          variant="outline"
                          className={`font-mono text-xs bg-white ${
                            resolvedTheme === "dark"
                              ? "text-white border-white"
                              : ""
                          }`}
                        >
                          {fund.code}
                        </Badge>
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    {fund.region && (
                      <div className="flex justify-between">
                        <span
                          className={
                            resolvedTheme === "dark"
                              ? "text-white"
                              : "text-gray-500"
                          }
                        >
                          Region:
                        </span>
                        <span
                          className={`font-medium ${
                            resolvedTheme === "dark"
                              ? "text-white"
                              : "text-gray-900"
                          }`}
                        >
                          {fund.region}
                        </span>
                      </div>
                    )}
                    {fund.currency && (
                      <div className="flex justify-between">
                        <span
                          className={
                            resolvedTheme === "dark"
                              ? "text-white"
                              : "text-gray-500"
                          }
                        >
                          Currency:
                        </span>
                        <span
                          className={`font-medium ${
                            resolvedTheme === "dark"
                              ? "text-white"
                              : "text-gray-900"
                          }`}
                        >
                          {fund.currency}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span
                        className={
                          resolvedTheme === "dark"
                            ? "text-white"
                            : "text-gray-500"
                        }
                      >
                        Documents:
                      </span>
                      <span
                        className={`font-medium ${
                          resolvedTheme === "dark"
                            ? "text-white"
                            : "text-gray-900"
                        }`}
                      >
                        {fund._count?.documents || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      ) : (
        <div
          className="rounded-md border border-gray-200 bg-white"
          style={{
            backgroundColor: resolvedTheme === "dark" ? "#ffffff" : undefined,
          }}
        >
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead
                  className={
                    resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                  }
                >
                  Code
                </TableHead>
                <TableHead
                  className={
                    resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                  }
                >
                  Name
                </TableHead>
                <TableHead
                  className={
                    resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                  }
                >
                  Region
                </TableHead>
                <TableHead
                  className={
                    resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                  }
                >
                  Currency
                </TableHead>
                <TableHead
                  className={`text-right ${
                    resolvedTheme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  Documents
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFunds && filteredFunds.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className={`h-24 text-center ${
                      resolvedTheme === "dark" ? "text-white" : "text-gray-600"
                    }`}
                  >
                    No funds found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredFunds?.map((fund: any) => (
                  <TableRow key={fund.id} className="bg-white">
                    <TableCell
                      className={
                        resolvedTheme === "dark"
                          ? "text-white"
                          : "text-gray-900"
                      }
                    >
                      <Badge
                        variant="outline"
                        className={`font-mono bg-white ${
                          resolvedTheme === "dark"
                            ? "text-white border-white"
                            : ""
                        }`}
                      >
                        {fund.code}
                      </Badge>
                    </TableCell>
                    <TableCell
                      className={`font-medium ${
                        resolvedTheme === "dark"
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      {fund.name}
                    </TableCell>
                    <TableCell
                      className={
                        resolvedTheme === "dark"
                          ? "text-white"
                          : "text-gray-900"
                      }
                    >
                      {fund.region || "-"}
                    </TableCell>
                    <TableCell
                      className={
                        resolvedTheme === "dark"
                          ? "text-white"
                          : "text-gray-900"
                      }
                    >
                      {fund.currency || "-"}
                    </TableCell>
                    <TableCell
                      className={`text-right ${
                        resolvedTheme === "dark"
                          ? "text-white"
                          : "text-gray-900"
                      }`}
                    >
                      {fund._count?.documents || 0}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
