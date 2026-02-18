import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Building2, Loader2, Search } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { api } from "@/app/lib/api";

interface EmpBeneficiary {
  id: string;
  name: string;
  email: string;
  pathways_completion_rate: number | null;
}

export function EmploymentProgress() {
  const [beneficiaries, setBeneficiaries] = useState<EmpBeneficiary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        setLoading(true);
        setError(null);
        const data = await api.adminGetEmploymentProgress();
        if (cancelled) return;
        // API returns an array directly
        const items: EmpBeneficiary[] = (Array.isArray(data) ? data : data.items ?? []).map((b: any) => ({
          id: b.id,
          name: b.name || "",
          email: b.email || "",
          pathways_completion_rate: b.pathways_completion_rate ?? null,
        }));
        setBeneficiaries(items);
        if (items.length > 0) setSelectedId(items[0].id);
      } catch (err: any) {
        if (!cancelled) setError(err.message || "Failed to load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetch();
    return () => { cancelled = true; };
  }, []);

  const filtered = beneficiaries.filter(b => {
    const q = search.toLowerCase();
    return !q || b.name.toLowerCase().includes(q) || b.email.toLowerCase().includes(q);
  });

  const selected = beneficiaries.find(b => b.id === selectedId) || null;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/admin">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Employment Track View</CardTitle>
                <CardDescription>View pathways completion rate for employment track beneficiaries</CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading...</span>
          </div>
        )}

        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <p className="text-destructive mb-4">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
          </div>
        )}

        {!loading && !error && beneficiaries.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-muted-foreground">No employment track beneficiaries found.</p>
          </div>
        )}

        {!loading && !error && beneficiaries.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: List */}
            <div className="lg:col-span-1">
              <Card className="h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Beneficiaries ({beneficiaries.length})</CardTitle>
                  <div className="relative mt-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search by name or email..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="divide-y max-h-[60vh] overflow-y-auto">
                    {filtered.map((b) => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedId(b.id)}
                        className={`w-full p-4 text-left hover:bg-gray-50 transition-colors ${
                          selectedId === b.id ? "bg-primary/10 border-l-4 border-l-primary" : ""
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {b.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-sm truncate">{b.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{b.email}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                    {filtered.length === 0 && (
                      <p className="text-center text-sm text-muted-foreground py-8">No results found.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Detail */}
            <div className="lg:col-span-2">
              {selected ? (
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white text-xl font-bold">
                        {selected.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <CardTitle className="text-xl">{selected.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{selected.email}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-6">
                      <p className="text-sm text-muted-foreground mb-2">Pathways Completion Rate</p>
                      <p className="text-4xl font-bold text-primary">
                        {selected.pathways_completion_rate != null ? `${selected.pathways_completion_rate}%` : "—"}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <p className="text-muted-foreground">Select a beneficiary to view their details.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
