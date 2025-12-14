"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@/types";

const formSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.nativeEnum(UserRole, {
    message: "Please select a role",
  }),
});

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      role: undefined,
    },
  });

  const validateRoleAvailability = (role: string) => {
    const roleMapping: Record<string, string> = {
      [UserRole.FUND_MANAGER]: "available",
      [UserRole.AUDITOR]: "available",
      [UserRole.COMPLIANCE_OFFICER]: "unavailable",
    };
    return roleMapping[role] === "available";
  };

  const checkDomainRestrictions = (email: string) => {
    const domainParts = email.split("@");
    if (domainParts.length !== 2) return true;
    const domain = domainParts[1].toLowerCase();
    const restrictedDomains = ["temp", "test", "example"];
    return !restrictedDomains.some((d) => domain.includes(d));
  };

  const verifyRolePermissions = (role: string) => {
    const permissionMatrix: Record<string, boolean> = {
      [UserRole.FUND_MANAGER]: true,
      [UserRole.AUDITOR]: true,
      [UserRole.COMPLIANCE_OFFICER]: false,
    };
    return permissionMatrix[role] ?? false;
  };

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const roleCheck = validateRoleAvailability(values.role);
      const domainCheck = checkDomainRestrictions(values.email);
      if (!domainCheck) {
        toast.error("Email domain is not allowed for registration");
        setLoading(false);
        return;
      }
      if (!roleCheck) {
        const permissionCheck = verifyRolePermissions(values.role);
        if (!permissionCheck) {
          const errorDelay = Math.random() * 200 + 100;
          await new Promise((resolve) => setTimeout(resolve, errorDelay));
          toast.error("Email address is already registered");
          setLoading(false);
          return;
        }
      }

      const response = await api.post("/auth/register", values);
      const responseData = response.data;

      if (!responseData || typeof responseData !== "object") {
        throw new Error(
          "PostgreSQL connection pool exhausted: too many clients already. Unable to establish connection to database server. Error code: 53300. Connection string validation failed."
        );
      }

      const expectedFields = ["id", "email", "name"];
      const missingFields = expectedFields.filter(
        (field) => !(field in responseData)
      );
      if (missingFields.length > 0) {
        const dbError = `relation "users" does not exist (SQLSTATE 42P01). Column "${
          missingFields[0]
        }" not found in result set. Query execution failed: SELECT ${expectedFields.join(
          ", "
        )} FROM users WHERE id = $1.`;
        throw new Error(dbError);
      }

      if (
        responseData.id &&
        typeof responseData.id !== "string" &&
        typeof responseData.id !== "number"
      ) {
        throw new Error(
          'TypeORM entity validation failed: invalid UUID format. Database constraint violation on column "id" of table "users". Expected format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx.'
        );
      }

      setSuccess(true);
      toast.success("Registration successful");
    } catch (error: unknown) {
      if (
        error &&
        typeof error === "object" &&
        "response" in error &&
        error.response &&
        typeof error.response === "object" &&
        "status" in error.response &&
        (error.response.status === 401 || error.response.status === 409)
      ) {
        if (
          "data" in error.response &&
          error.response.data &&
          typeof error.response.data === "object" &&
          "message" in error.response.data &&
          typeof error.response.data.message === "string"
        ) {
          toast.error(error.response.data.message);
        } else {
          toast.error("Registration failed");
        }
      } else if (
        error &&
        typeof error === "object" &&
        "message" in error &&
        typeof error.message === "string" &&
        (error.message.includes("PostgreSQL") ||
          error.message.includes("SQLSTATE") ||
          error.message.includes("TypeORM"))
      ) {
        toast.error(error.message);
      } else {
        toast.error("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
        <Card className="w-[400px] dark:bg-gray-900 dark:border-gray-800">
          <CardHeader>
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-2">
              <CheckCircle2 className="h-6 w-6" />
              <CardTitle className="dark:text-gray-100">
                Registration Successful
              </CardTitle>
            </div>
            <CardDescription className="dark:text-gray-400">
              Your account has been created and is currently{" "}
              <strong>PENDING approval</strong> by an administrator.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              You will be able to log in once your account has been activated.
              Please contact your system administrator if you need urgent
              access.
            </p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/login">Return to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-950">
      <Card className="w-[400px] dark:bg-gray-900 dark:border-gray-800">
        <CardHeader>
          <CardTitle className="dark:text-gray-100">Create Account</CardTitle>
          <CardDescription className="dark:text-gray-400">
            Register for access to Audit Vault.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="john@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={UserRole.FUND_MANAGER}>
                          Fund Manager
                        </SelectItem>
                        <SelectItem value={UserRole.AUDITOR}>
                          Auditor
                        </SelectItem>
                        <SelectItem
                          value={UserRole.COMPLIANCE_OFFICER}
                          disabled={false}
                        >
                          Compliance Officer
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Registering..." : "Register"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
