import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { ArrowLeft, UserCheck, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { api } from "@/app/lib/api";

interface Beneficiary {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  skillcraftScore: number;
  pathwaysRate: number;
  offlineAttendance: number;
  wantsEntrepreneurship: boolean;
  businessGoal: string;
  track: string;
}

function mapApiBeneficiary(raw: any): Beneficiary {
  return {
    id: raw.id,
    name: raw.name || `${raw.first_name ?? ""} ${raw.last_name ?? ""}`.trim(),
    age: raw.age ?? 0,
    gender: raw.gender ?? "",
    email: raw.email ?? "",
    skillcraftScore: raw.skillcraft_score ?? 0,
    pathwaysRate: raw.pathways_completion_rate ?? raw.pathways_completion ?? 0,
    offlineAttendance: raw.offline_attendance ?? 0,
    wantsEntrepreneurship: raw.wants_entrepreneurship ?? false,
    businessGoal: raw.business_development_text ?? "",
    track: raw.track ?? "",
  };
}

export function BeneficiarySelection() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [assigning, setAssigning] = useState(false);

  const loadBeneficiaries = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.adminListBeneficiaries({
        selection_status: "selected",
        page_size: "10000",
      });
      const mapped = (data.items ?? data.beneficiaries ?? []).map(mapApiBeneficiary);
      setBeneficiaries(mapped);
    } catch (err: any) {
      setError(err.message || "Failed to load beneficiaries");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBeneficiaries();
  }, []);

  const filteredBeneficiaries = beneficiaries.filter(b => {
    const q = searchQuery.toLowerCase();
    return !q || b.name.toLowerCase().includes(q) || b.email.toLowerCase().includes(q);
  });

  const toggleSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleAssignTrack = async (track: string) => {
    const ids = Array.from(selectedIds);
    if (ids.length === 0) return;
    try {
      setAssigning(true);
      await api.adminAssignTracks(ids, track);
      await loadBeneficiaries();
      setSelectedIds(new Set());
    } catch (err: any) {
      setError(err.message || `Failed to assign to ${track} track`);
    } finally {
      setAssigning(false);
    }
  };

  const trackLabel = (t: string) => {
    if (t === "employment") return "Employment";
    if (t === "entrepreneurship") return "Entrepreneurship";
    return "—";
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1400px] mx-auto">
        <Link to="/admin">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-2xl">Phase 2 Selection</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Total: {beneficiaries.length} selected beneficiaries
                </p>
              </div>
            </div>
            {selectedIds.size > 0 && (
              <Badge variant="outline" className="border-primary text-primary ml-auto">
                {selectedIds.size} Selected
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
                <span>{error}</span>
                <Button variant="ghost" size="sm" onClick={() => setError(null)}>Dismiss</Button>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-md"
              />
              {selectedIds.size > 0 && (
                <div className="flex items-center gap-2 ml-auto">
                  <Button
                    onClick={() => handleAssignTrack("employment")}
                    disabled={assigning}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {assigning && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Assign Employment
                  </Button>
                  <Button
                    onClick={() => handleAssignTrack("entrepreneurship")}
                    disabled={assigning}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {assigning && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                    Assign Entrepreneurship
                  </Button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary mb-4" />
                <p className="text-muted-foreground">Loading beneficiaries...</p>
              </div>
            ) : (
              <div className="border rounded-lg overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-8"></TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>Gender</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead className="text-center">SkillCraft</TableHead>
                      <TableHead className="text-center">Pathways Rate</TableHead>
                      <TableHead className="text-center">Attendance</TableHead>
                      <TableHead className="text-center">Ent. Applied</TableHead>
                      <TableHead>Business Goal</TableHead>
                      <TableHead className="text-center">Track</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBeneficiaries.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center py-12 text-muted-foreground">
                          No beneficiaries found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBeneficiaries.map((b) => {
                        const checked = selectedIds.has(b.id);
                        return (
                          <TableRow key={b.id} className={`hover:bg-gray-100 ${checked ? "bg-primary/5" : ""}`}>
                            <TableCell>
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={(e) => {
                                  const next = new Set(selectedIds);
                                  if (e.target.checked) next.add(b.id);
                                  else next.delete(b.id);
                                  setSelectedIds(next);
                                }}
                                className="h-4 w-4 rounded border-gray-300"
                              />
                            </TableCell>
                            <TableCell className="font-medium">{b.name}</TableCell>
                            <TableCell>{b.age}</TableCell>
                            <TableCell>{b.gender}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">{b.email}</TableCell>
                            <TableCell className="text-center font-semibold">{b.skillcraftScore}</TableCell>
                            <TableCell className="text-center font-semibold">{b.pathwaysRate}%</TableCell>
                            <TableCell className="text-center font-semibold">{b.offlineAttendance}</TableCell>
                            <TableCell className="text-center">
                              <Badge variant={b.wantsEntrepreneurship ? "default" : "secondary"}>
                                {b.wantsEntrepreneurship ? "Yes" : "No"}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate text-sm text-muted-foreground" title={b.businessGoal}>
                              {b.businessGoal || "—"}
                            </TableCell>
                            <TableCell className="text-center">
                              {b.track ? (
                                <Badge variant="outline" className={
                                  b.track === "employment" ? "border-blue-500 text-blue-600" :
                                  b.track === "entrepreneurship" ? "border-green-500 text-green-600" : ""
                                }>
                                  {trackLabel(b.track)}
                                </Badge>
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
