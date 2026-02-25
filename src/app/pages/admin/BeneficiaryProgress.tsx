import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft, Loader2, Search, CheckCircle2, Clock, Sparkles } from "lucide-react";
import { Badge } from "@/app/components/ui/badge";
import { Input } from "@/app/components/ui/input";
import { api } from "@/app/lib/api";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
} from "recharts";

interface CourseInfo {
  course_name: string;
  order_number: number;
  completed: boolean;
}

interface PathwayInfo {
  pathway_name: string;
  order_number?: number;
  courses: Record<string, CourseInfo>;
}

interface SubScore {
  score: number;
  [key: string]: any;
}

interface SkillcraftScores {
  w_sub_scores: Record<string, SubScore>;
  e_sub_scores: Record<string, SubScore>;
}

interface Beneficiary {
  id: string;
  name: string;
  email: string;
  skillcraftScore: number | null;
  wScore: number | null;
  eScore: number | null;
  skillcraftScores: SkillcraftScores | null;
  pathwaysRate: number | null;
  businessGoal: string;
  offlineAttendance: number;
  hired: boolean;
  courseProgress: Record<string, PathwayInfo> | null;
}

const W_SUB_LABELS: Record<string, string> = {
  corsi: "Corsi Block",
  cpt: "CPT (Attention)",
  digit_span: "Digit Span",
  tmt: "Trail Making",
  social_awareness: "Social Awareness",
  self_management: "Self-Management",
  self_awareness: "Self-Awareness",
  agreeableness: "Agreeableness",
  conscientiousness: "Conscientiousness",
  realistic: "Realistic",
  investigative: "Investigative",
  artistic: "Artistic",
  social: "Social",
  conventional: "Conventional",
};

const E_SUB_LABELS: Record<string, string> = {
  digit_span: "Digit Span",
  hmt: "HMT (Memory)",
  conscientiousness: "Conscientiousness",
  openness: "Openness",
  growth_mindset: "Growth Mindset",
  bret: "BRET (Risk)",
  proactive: "Proactive",
  mtpt: "MTPT (Persistence)",
  enterprising: "Enterprising",
};

function mapApiBeneficiary(b: any): Beneficiary {
  return {
    id: b.id ?? b._id ?? "",
    name: b.name || [b.first_name, b.last_name].filter(Boolean).join(" ") || "Unknown",
    email: b.email || "",
    skillcraftScore: b.skillcraft_score ?? null,
    wScore: b.w_score ?? null,
    eScore: b.e_score ?? null,
    skillcraftScores: b.skillcraft_scores ?? null,
    pathwaysRate: b.pathways_completion_rate ?? b.pathways_completion ?? null,
    businessGoal: b.business_development_text || "",
    offlineAttendance: b.offline_attendance ?? 0,
    hired: b.hired ?? false,
    courseProgress: b.pathways_course_progress ?? null,
  };
}

export function BeneficiaryProgress() {
  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [generating, setGenerating] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleGenerateResults = async () => {
    try {
      setGenerating(true);
      setActionError(null);
      setActionMessage(null);
      const result = await api.adminApplyPhase1Results();
      setActionMessage(
        `Results generated: ${result.updated?.toLocaleString()} beneficiaries updated, ${result.ent_applicants?.toLocaleString()} applied for entrepreneurship`
      );
      // Reload beneficiaries to reflect new data
      const data = await api.adminListBeneficiaries({ page_size: "10000", selection_status: "selected" });
      const mapped = (data.items || data.beneficiaries || []).map(mapApiBeneficiary);
      setBeneficiaries(mapped);
      if (mapped.length > 0 && !selectedId) setSelectedId(mapped[0].id);
    } catch (err: any) {
      setActionError(err.message || "Failed to generate results");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    async function fetch() {
      try {
        setLoading(true);
        setError(null);
        // Fetch selected beneficiaries (Phase 1 selected)
        const data = await api.adminListBeneficiaries({ page_size: "10000", selection_status: "selected" });
        if (cancelled) return;
        const mapped = (data.items || data.beneficiaries || []).map(mapApiBeneficiary);
        setBeneficiaries(mapped);
        if (mapped.length > 0) setSelectedId(mapped[0].id);
      } catch (err: any) {
        if (cancelled) return;
        setError(err.message || "Failed to load beneficiaries");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetch();
    return () => { cancelled = true; };
  }, []);

  const filteredList = beneficiaries.filter(b => {
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Progress View</CardTitle>
                <CardDescription>View selected beneficiaries and their progress details</CardDescription>
              </div>
              <Button
                onClick={handleGenerateResults}
                disabled={generating}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {generating ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 mr-2" />
                )}
                {generating ? "Generating..." : "Generate Results"}
              </Button>
            </div>
            {actionMessage && (
              <div className="mt-3 p-3 bg-green-50 text-green-700 rounded-md text-sm">{actionMessage}</div>
            )}
            {actionError && (
              <div className="mt-3 p-3 bg-red-50 text-red-700 rounded-md text-sm">{actionError}</div>
            )}
          </CardHeader>
        </Card>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-3 text-muted-foreground">Loading beneficiaries...</span>
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
            <p className="text-muted-foreground">No selected beneficiaries found.</p>
          </div>
        )}

        {!loading && !error && beneficiaries.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Beneficiary List */}
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
                    {filteredList.map((b) => (
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
                    {filteredList.length === 0 && (
                      <p className="text-center text-sm text-muted-foreground py-8">No results found.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right: Details Panel */}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* SkillCraft Score */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">SkillCraft Score</p>
                        <p className="text-2xl font-bold text-foreground">
                          {selected.skillcraftScore != null ? selected.skillcraftScore : "—"}
                        </p>
                      </div>

                      {/* W Score */}
                      <div className="bg-blue-50 rounded-lg p-4">
                        <p className="text-sm text-blue-600 mb-1">W Score (Employability)</p>
                        <p className="text-2xl font-bold text-blue-700">
                          {selected.wScore != null ? selected.wScore.toFixed(4) : "—"}
                        </p>
                      </div>

                      {/* E Score */}
                      <div className="bg-purple-50 rounded-lg p-4">
                        <p className="text-sm text-purple-600 mb-1">E Score (Entrepreneurship)</p>
                        <p className="text-2xl font-bold text-purple-700">
                          {selected.eScore != null ? selected.eScore.toFixed(4) : "—"}
                        </p>
                      </div>

                      {/* Pathways Completion Rate */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">Pathways Completion Rate</p>
                        <p className="text-2xl font-bold text-foreground">
                          {selected.pathwaysRate != null ? `${selected.pathwaysRate}%` : "—"}
                        </p>
                      </div>

                      {/* Offline Attendance Score */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">Offline Attendance Score</p>
                        <p className="text-2xl font-bold text-foreground">
                          {selected.offlineAttendance}
                        </p>
                      </div>

                      {/* Hired Status */}
                      <div className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-muted-foreground mb-1">Hired Status</p>
                        <p className={`text-2xl font-bold ${selected.hired ? "text-green-600" : "text-foreground"}`}>
                          {selected.hired ? "Yes" : "No"}
                        </p>
                      </div>

                      {/* Bar Chart – All 23 Sub-Scores */}
                      {selected.skillcraftScores && (
                        <div className="bg-gray-50 rounded-lg p-4 sm:col-span-2">
                          <p className="text-sm font-semibold text-foreground mb-3">All SkillCraft Scores</p>
                          <ResponsiveContainer width="100%" height={340}>
                            <BarChart
                              data={[
                                ...Object.entries(W_SUB_LABELS).map(([key, label]) => ({
                                  name: label,
                                  score: selected.skillcraftScores!.w_sub_scores?.[key]?.score ?? 0,
                                  type: "W",
                                })),
                                ...Object.entries(E_SUB_LABELS).map(([key, label]) => ({
                                  name: label,
                                  score: selected.skillcraftScores!.e_sub_scores?.[key]?.score ?? 0,
                                  type: "E",
                                })),
                              ]}
                              margin={{ top: 5, right: 10, left: 0, bottom: 80 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis
                                dataKey="name"
                                angle={-45}
                                textAnchor="end"
                                interval={0}
                                tick={{ fontSize: 10 }}
                                height={80}
                              />
                              <YAxis domain={[0, 1]} tick={{ fontSize: 11 }} />
                              <Tooltip
                                formatter={(value: number) => value.toFixed(4)}
                                labelStyle={{ fontWeight: 600 }}
                              />
                              <Bar dataKey="score" radius={[3, 3, 0, 0]}>
                                {[
                                  ...Object.keys(W_SUB_LABELS).map(() => "W"),
                                  ...Object.keys(E_SUB_LABELS).map(() => "E"),
                                ].map((type, i) => (
                                  <Cell key={i} fill={type === "W" ? "#3b82f6" : "#8b5cf6"} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                          <div className="flex items-center justify-center gap-6 mt-2 text-xs">
                            <span className="flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-sm bg-blue-500 inline-block" /> W Sub-Scores
                            </span>
                            <span className="flex items-center gap-1.5">
                              <span className="w-3 h-3 rounded-sm bg-violet-500 inline-block" /> E Sub-Scores
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Radar Chart – E Sub-Scores */}
                      {selected.skillcraftScores?.e_sub_scores && (
                        <div className="bg-purple-50/30 rounded-lg p-4 sm:col-span-2">
                          <p className="text-sm font-semibold text-purple-700 mb-3">Entrepreneur Ability</p>
                          <ResponsiveContainer width="100%" height={340}>
                            <RadarChart
                              data={Object.entries(E_SUB_LABELS).map(([key, label]) => ({
                                subject: label,
                                score: selected.skillcraftScores!.e_sub_scores[key]?.score ?? 0,
                              }))}
                              outerRadius="75%"
                            >
                              <PolarGrid />
                              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11 }} />
                              <PolarRadiusAxis domain={[0, 1]} tick={{ fontSize: 10 }} tickCount={5} />
                              <Radar
                                dataKey="score"
                                stroke="#7c3aed"
                                fill="#8b5cf6"
                                fillOpacity={0.35}
                              />
                              <Tooltip formatter={(value: number) => value.toFixed(4)} />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      )}

                      {/* Business Goal */}
                      <div className="bg-gray-50 rounded-lg p-4 sm:col-span-2">
                        <p className="text-sm text-muted-foreground mb-1">Business Goal</p>
                        <p className="text-sm text-foreground leading-relaxed">
                          {selected.businessGoal || "No business goal submitted yet."}
                        </p>
                      </div>

                      {/* Per-Course Progress */}
                      {selected.courseProgress && Object.keys(selected.courseProgress).length > 0 && (
                        <div className="bg-gray-50 rounded-lg p-4 sm:col-span-2">
                          <p className="text-sm text-muted-foreground mb-3">Course Progress</p>
                          <div className="space-y-4">
                            {Object.entries(selected.courseProgress)
                              .sort(([, a], [, b]) => (a.order_number ?? 0) - (b.order_number ?? 0))
                              .map(([pathwayId, pathway]) => {
                                const courses = Object.entries(pathway.courses)
                                  .sort(([, a], [, b]) => a.order_number - b.order_number);
                                const done = courses.filter(([, c]) => c.completed).length;
                                return (
                                  <div key={pathwayId}>
                                    <div className="flex items-center justify-between mb-2">
                                      <p className="font-semibold text-sm">{pathway.pathway_name}</p>
                                      <span className="text-xs text-muted-foreground">{done}/{courses.length}</span>
                                    </div>
                                    <div className="space-y-1">
                                      {courses.map(([courseId, course]) => (
                                        <div key={courseId} className="flex items-center justify-between text-sm py-1">
                                          <span className="flex items-center gap-2">
                                            {course.completed
                                              ? <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                                              : <Clock className="w-3.5 h-3.5 text-gray-400" />
                                            }
                                            {course.order_number}. {course.course_name}
                                          </span>
                                          <Badge variant="outline" className={
                                            course.completed
                                              ? "bg-green-50 text-green-700 border-green-300 text-xs"
                                              : "bg-gray-50 text-gray-500 border-gray-300 text-xs"
                                          }>
                                            {course.completed ? "Done" : "Pending"}
                                          </Badge>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                );
                              })}
                          </div>
                        </div>
                      )}
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
