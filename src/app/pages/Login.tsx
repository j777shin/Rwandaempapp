import { useState } from "react";
import { useNavigate } from "react-router";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleBeneficiaryLogin = () => {
    navigate("/beneficiary");
  };

  const handleAdminLogin = () => {
    navigate("/admin");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-border">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white text-3xl font-bold">RW</span>
            </div>
          </div>
          <CardTitle className="text-2xl text-center text-foreground">Rwanda MVP Portal</CardTitle>
          <CardDescription className="text-center">
            Youth Training and Employment Platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="beneficiary" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-neutral-100">
              <TabsTrigger value="beneficiary" className="data-[state=active]:bg-white">Beneficiary</TabsTrigger>
              <TabsTrigger value="admin" className="data-[state=active]:bg-white">Admin</TabsTrigger>
            </TabsList>
            <TabsContent value="beneficiary" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="beneficiary-email">Email</Label>
                <Input
                  id="beneficiary-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="beneficiary-password">Password</Label>
                <Input
                  id="beneficiary-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button onClick={handleBeneficiaryLogin} className="w-full bg-neutral-800 hover:bg-neutral-700">
                Sign In as Beneficiary
              </Button>
            </TabsContent>
            <TabsContent value="admin" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="admin-email">Email</Label>
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@gov.rw"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">Password</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button onClick={handleAdminLogin} className="w-full bg-primary hover:bg-primary/90">
                Sign In as Admin
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
