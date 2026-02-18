import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/app/components/ui/table";
import { ArrowLeft, Download, X, Search, Filter, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/app/components/ui/dialog";
import { Badge } from "@/app/components/ui/badge";
import { Separator } from "@/app/components/ui/separator";
import { Input } from "@/app/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/components/ui/select";
import { Label } from "@/app/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/components/ui/popover";
import { Checkbox } from "@/app/components/ui/checkbox";
import { api } from "@/app/lib/api";

// Shape of an account row in the UI (mapped from API response)
interface Account {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  gender: string;
  phone: string;
  district: string;
  education: string;
  status: string;
  selectionStatus: string;
  track: string;
  createdAt: string;
  skillcraftScore: number;
  pathwaysScore: number;
  eligibilityScore: number;
  lastEdited: string;
}

/**
 * Derive a display status from the API's selection_status and track fields.
 */
function deriveStatus(selectionStatus: string, track: string): string {
  if (selectionStatus === "inactive" || selectionStatus === "rejected") {
    return "Inactive";
  }
  if (track === "employment") return "Emp Track";
  if (track === "entrepreneurship") return "Ent Track";
  if (selectionStatus === "selected") return "Selected";
  if (selectionStatus === "phase1_selected" || selectionStatus === "registered") {
    return "Phase1";
  }
  if (selectionStatus === "pending") return "Pending";
  if (selectionStatus === "waitlist") return "Waitlist";
  return selectionStatus || "Pending";
}

/**
 * Map a raw API beneficiary object to the UI Account shape.
 */
function mapBeneficiary(b: any): Account {
  const selectionStatus = b.selection_status || "";
  const track = b.track || "";
  // Map gender from DB format ("male"/"female") to display format ("M"/"F")
  const genderMap: Record<string, string> = { male: "M", female: "F" };
  const gender = genderMap[b.gender?.toLowerCase()] || b.gender || "";
  return {
    id: String(b.id),
    name: b.name || `${b.first_name || ""} ${b.last_name || ""}`.trim(),
    firstName: b.first_name || b.name?.split(" ")[0] || "",
    lastName: b.last_name || b.name?.split(" ").slice(1).join(" ") || "",
    email: b.email || "",
    age: b.age ?? 0,
    gender,
    phone: b.phone || b.contact || "",
    district: b.district || "",
    education: b.education_level || "",
    status: deriveStatus(selectionStatus, track),
    selectionStatus,
    track,
    createdAt: b.created_at ? new Date(b.created_at).toLocaleDateString() : "",
    skillcraftScore: b.skillcraft_score ?? 0,
    pathwaysScore: b.pathways_completion_rate ?? b.pathways_completion ?? 0,
    eligibilityScore: b.eligibility_score ?? 0,
    lastEdited: b.updated_at
      ? new Date(b.updated_at).toLocaleString("en-US", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      : b.created_at
        ? new Date(b.created_at).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        : "",
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "Emp Track":
      return "bg-blue-600 text-white";
    case "Ent Track":
      return "bg-purple-600 text-white";
    case "Phase1":
      return "bg-primary text-white";
    case "Selected":
      return "bg-green-600 text-white";
    case "Pending":
      return "bg-yellow-500 text-white";
    case "Waitlist":
      return "bg-orange-500 text-white";
    case "Inactive":
      return "bg-gray-200 text-gray-700";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

const PAGE_SIZE = 20;

export function AccountManagement() {
  // Data state
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Pagination state
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  // Dialog state
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [editedAccount, setEditedAccount] = useState<Account | null>(null);
  const [detailedInfo, setDetailedInfo] = useState<any>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [genderFilters, setGenderFilters] = useState<string[]>(["M", "F"]);
  const [statusFilters, setStatusFilters] = useState<string[]>(["Pending", "Selected", "Phase1", "Emp Track", "Ent Track", "Waitlist", "Inactive"]);

  // Debounce search input so we don't fire a request on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setPage(1); // reset to first page when search changes
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Build API params from current filter/pagination state
  const buildParams = useCallback(() => {
    const params: Record<string, string> = {
      page: String(page),
      page_size: String(PAGE_SIZE),
    };
    if (debouncedSearch) {
      params.search = debouncedSearch;
    }
    return params;
  }, [page, debouncedSearch]);

  // Fetch data from API
  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = buildParams();
      const response = await api.adminListBeneficiaries(params);

      // Handle both paginated { items, total } and plain array responses
      let beneficiaries: any[];
      if (Array.isArray(response)) {
        beneficiaries = response;
        setTotalCount(response.length);
      } else if (response.items) {
        beneficiaries = response.items;
        setTotalCount(response.total ?? response.count ?? response.items.length);
      } else if (response.results) {
        beneficiaries = response.results;
        setTotalCount(response.count ?? response.total ?? response.results.length);
      } else {
        beneficiaries = [];
        setTotalCount(0);
      }

      setAccounts(beneficiaries.map(mapBeneficiary));
    } catch (err: any) {
      console.error("Failed to load beneficiaries:", err);
      setError(err.message || "Failed to load accounts");
    } finally {
      setLoading(false);
    }
  }, [buildParams]);

  // Load data on mount and when filters/page change
  useEffect(() => {
    fetchAccounts();
  }, [fetchAccounts]);

  // Client-side filter for gender and status (since API may not support these directly)
  const filteredAccounts = accounts.filter((account) => {
    const matchesGender = genderFilters.includes(account.gender);
    const matchesStatus = statusFilters.includes(account.status);
    return matchesGender && matchesStatus;
  });

  // Toggle gender filter
  const toggleGenderFilter = (gender: string) => {
    setGenderFilters((prev) =>
      prev.includes(gender)
        ? prev.filter((g) => g !== gender)
        : [...prev, gender]
    );
  };

  // Toggle status filter
  const toggleStatusFilter = (status: string) => {
    setStatusFilters((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  const handleRowClick = async (account: Account) => {
    setSelectedAccount(account);
    setEditedAccount({ ...account });
    setDetailedInfo(null);
    setIsDialogOpen(true);
    setDetailLoading(true);
    try {
      const detail = await api.adminGetBeneficiary(account.id);
      setDetailedInfo(detail);
    } catch (err) {
      console.error("Failed to load beneficiary details:", err);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedAccount(null);
    setEditedAccount(null);
    setDetailedInfo(null);
  };

  const handleSave = async () => {
    if (!editedAccount) return;

    setSaving(true);
    try {
      const genderReverseMap: Record<string, string> = { M: "male", F: "female" };
      const updateData: Record<string, any> = {
        age: editedAccount.age,
        gender: genderReverseMap[editedAccount.gender] || editedAccount.gender,
        email: editedAccount.email,
        contact: editedAccount.phone,
        district: editedAccount.district,
      };

      await api.adminUpdateBeneficiary(editedAccount.id, updateData);

      // Refresh the list to reflect server state
      await fetchAccounts();
      handleCloseDialog();
    } catch (err: any) {
      console.error("Failed to save beneficiary:", err);
      alert(`Failed to save: ${err.message || "Unknown error"}`);
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field: string, value: any) => {
    if (editedAccount) {
      setEditedAccount({ ...editedAccount, [field]: value });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link to="/admin">
            <Button variant="ghost">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <Button className="bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            Export Accounts
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Account Management</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-4">
              <Input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-1/2"
              />
            </div>

            {/* Loading state */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading accounts...</span>
              </div>
            )}

            {/* Error state */}
            {error && !loading && (
              <div className="flex flex-col items-center justify-center py-12">
                <p className="text-destructive mb-4">{error}</p>
                <Button variant="outline" onClick={fetchAccounts}>
                  Retry
                </Button>
              </div>
            )}

            {/* Table */}
            {!loading && !error && (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Age</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          Gender
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Filter className="h-3 w-3" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48">
                              <div className="space-y-2">
                                <Label className="font-semibold">Filter by Gender</Label>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="male"
                                    checked={genderFilters.includes("M")}
                                    onCheckedChange={() => toggleGenderFilter("M")}
                                  />
                                  <label htmlFor="male" className="text-sm cursor-pointer">
                                    Male
                                  </label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Checkbox
                                    id="female"
                                    checked={genderFilters.includes("F")}
                                    onCheckedChange={() => toggleGenderFilter("F")}
                                  />
                                  <label htmlFor="female" className="text-sm cursor-pointer">
                                    Female
                                  </label>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-2">
                          Status
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <Filter className="h-3 w-3" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-48">
                              <div className="space-y-2">
                                <Label className="font-semibold">Filter by Status</Label>
                                {["Pending", "Selected", "Phase1", "Emp Track", "Ent Track", "Waitlist", "Inactive"].map((status) => (
                                  <div key={status} className="flex items-center space-x-2">
                                    <Checkbox
                                      id={`status-${status}`}
                                      checked={statusFilters.includes(status)}
                                      onCheckedChange={() => toggleStatusFilter(status)}
                                    />
                                    <label htmlFor={`status-${status}`} className="text-sm cursor-pointer">
                                      {status}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            </PopoverContent>
                          </Popover>
                        </div>
                      </TableHead>
                      <TableHead>Details</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAccounts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No accounts found.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAccounts.map((account) => (
                        <TableRow
                          key={account.id}
                          className="hover:bg-gray-50"
                        >
                          <TableCell className="font-medium">{account.name}</TableCell>
                          <TableCell>{account.age}</TableCell>
                          <TableCell>{account.gender}</TableCell>
                          <TableCell>
                            <Badge className={`${getStatusColor(account.status)} text-xs`}>
                              {account.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleRowClick(account)}
                            >
                              More
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>

                {/* Pagination controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground">
                      Page {page} of {totalPages} ({totalCount} total accounts)
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages}
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* User Details Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl">Account Details</DialogTitle>
              <DialogDescription>
                View and edit beneficiary account information.
              </DialogDescription>
            </DialogHeader>
            {selectedAccount && editedAccount && (
              <div className="space-y-6">
                {/* Editable Fields */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-primary">Edit Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">Age</Label>
                      <Input
                        type="number"
                        value={editedAccount.age}
                        onChange={(e) => updateField("age", parseInt(e.target.value))}
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Gender</Label>
                      <Select
                        value={editedAccount.gender}
                        onValueChange={(value) => updateField("gender", value)}
                      >
                        <SelectTrigger>
                          {editedAccount.gender === "M" ? "Male" : "Female"}
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="M">Male</SelectItem>
                          <SelectItem value="F">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Email</Label>
                      <Input
                        type="email"
                        value={editedAccount.email}
                        onChange={(e) => updateField("email", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">Phone</Label>
                      <Input
                        type="text"
                        value={editedAccount.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                      />
                    </div>
                    <div className="col-span-2">
                      <Label className="text-sm text-muted-foreground">District</Label>
                      <Input
                        type="text"
                        value={editedAccount.district}
                        onChange={(e) => updateField("district", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      {saving ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </div>

                <Separator />

                {/* All Beneficiary Info (Read-Only) */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-primary">All Information</h3>
                  {detailLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      <span className="ml-2 text-sm text-muted-foreground">Loading details...</span>
                    </div>
                  ) : detailedInfo ? (
                    <div className="space-y-4">
                      {/* Personal */}
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Personal</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 bg-gray-50 rounded-lg p-3">
                          <div><span className="text-xs text-muted-foreground">Name</span><p className="text-sm font-medium">{detailedInfo.name || `${detailedInfo.first_name || ""} ${detailedInfo.last_name || ""}`.trim()}</p></div>
                          <div><span className="text-xs text-muted-foreground">Age</span><p className="text-sm font-medium">{detailedInfo.age ?? "—"}</p></div>
                          <div><span className="text-xs text-muted-foreground">Gender</span><p className="text-sm font-medium">{detailedInfo.gender || "—"}</p></div>
                          <div><span className="text-xs text-muted-foreground">Education</span><p className="text-sm font-medium">{detailedInfo.education_level || "—"}</p></div>
                          <div><span className="text-xs text-muted-foreground">Marital Status</span><p className="text-sm font-medium">{detailedInfo.marital_status || "—"}</p></div>
                          <div><span className="text-xs text-muted-foreground">Disability</span><p className="text-sm font-medium">{detailedInfo.disability || "—"}</p></div>
                        </div>
                      </div>

                      {/* Contact */}
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Contact</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 bg-gray-50 rounded-lg p-3">
                          <div><span className="text-xs text-muted-foreground">Email</span><p className="text-sm font-medium">{detailedInfo.email || "—"}</p></div>
                          <div><span className="text-xs text-muted-foreground">Phone</span><p className="text-sm font-medium">{detailedInfo.contact || detailedInfo.phone || "—"}</p></div>
                          <div><span className="text-xs text-muted-foreground">District</span><p className="text-sm font-medium">{detailedInfo.district || "—"}</p></div>
                          <div><span className="text-xs text-muted-foreground">Sector</span><p className="text-sm font-medium">{detailedInfo.sector || "—"}</p></div>
                          <div><span className="text-xs text-muted-foreground">Cell</span><p className="text-sm font-medium">{detailedInfo.cell || "—"}</p></div>
                          <div><span className="text-xs text-muted-foreground">Village</span><p className="text-sm font-medium">{detailedInfo.village || "—"}</p></div>
                        </div>
                      </div>

                      {/* Household */}
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Household</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 bg-gray-50 rounded-lg p-3">
                          <div><span className="text-xs text-muted-foreground">Household Size</span><p className="text-sm font-medium">{detailedInfo.household_size ?? "—"}</p></div>
                          <div><span className="text-xs text-muted-foreground">Dependents</span><p className="text-sm font-medium">{detailedInfo.dependents ?? "—"}</p></div>
                          <div><span className="text-xs text-muted-foreground">Income Source</span><p className="text-sm font-medium">{detailedInfo.income_source || "—"}</p></div>
                          <div><span className="text-xs text-muted-foreground">Monthly Income</span><p className="text-sm font-medium">{detailedInfo.monthly_income ?? "—"}</p></div>
                        </div>
                      </div>

                      {/* Assets & Housing */}
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Assets & Housing</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 bg-gray-50 rounded-lg p-3">
                          <div><span className="text-xs text-muted-foreground">Land Ownership</span><p className="text-sm font-medium">{detailedInfo.land_ownership || "—"}</p></div>
                          <div><span className="text-xs text-muted-foreground">Livestock</span><p className="text-sm font-medium">{detailedInfo.livestock || "—"}</p></div>
                          <div><span className="text-xs text-muted-foreground">Housing Type</span><p className="text-sm font-medium">{detailedInfo.housing_type || "—"}</p></div>
                          <div><span className="text-xs text-muted-foreground">Water Source</span><p className="text-sm font-medium">{detailedInfo.water_source || "—"}</p></div>
                          <div><span className="text-xs text-muted-foreground">Electricity</span><p className="text-sm font-medium">{detailedInfo.electricity ? "Yes" : "No"}</p></div>
                          <div><span className="text-xs text-muted-foreground">Ubudehe Category</span><p className="text-sm font-medium">{detailedInfo.ubudehe_category ?? "—"}</p></div>
                        </div>
                      </div>

                      {/* Scores & Status */}
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Scores & Status</h4>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 bg-gray-50 rounded-lg p-3">
                          <div><span className="text-xs text-muted-foreground">SkillCraft Score</span><p className="text-sm font-medium">{detailedInfo.skillcraft_score ?? "—"}</p></div>
                          <div><span className="text-xs text-muted-foreground">Pathways Rate</span><p className="text-sm font-medium">{detailedInfo.pathways_completion_rate ?? "—"}%</p></div>
                          <div><span className="text-xs text-muted-foreground">Eligibility Score</span><p className="text-sm font-medium">{detailedInfo.eligibility_score ?? "—"}</p></div>
                          <div><span className="text-xs text-muted-foreground">Offline Attendance</span><p className="text-sm font-medium">{detailedInfo.offline_attendance ?? "—"}</p></div>
                          <div><span className="text-xs text-muted-foreground">Selection Status</span><p className="text-sm font-medium">{detailedInfo.selection_status || "—"}</p></div>
                          <div><span className="text-xs text-muted-foreground">Track</span><p className="text-sm font-medium">{detailedInfo.track || "—"}</p></div>
                          <div><span className="text-xs text-muted-foreground">Hired</span><p className="text-sm font-medium">{detailedInfo.hired ? "Yes" : "No"}</p></div>
                          <div><span className="text-xs text-muted-foreground">Wants Entrepreneurship</span><p className="text-sm font-medium">{detailedInfo.wants_entrepreneurship ? "Yes" : "No"}</p></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Failed to load detailed information.</p>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
