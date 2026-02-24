import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Download, FileText, Loader2, MessageCircle, CheckCircle2 } from "lucide-react";
import { api } from "@/app/lib/api";

interface StageSummary {
  stage_number: number;
  stage_name: string;
  summary: string;
}

export function ResultReport() {
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await api.getChatbotReport();
      setReport(data);
    } catch (err) {
      console.error("Failed to load report:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      const blob = await api.downloadReportPdf();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "entrepreneurship_report.pdf";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download PDF:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-8 bg-background flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const stageSummaries: StageSummary[] = report?.stage_summaries || [];
  const hasReport = report && (stageSummaries.length > 0 || report.summary);

  return (
    <div className="p-8 space-y-6 bg-background">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Results & Report</h1>
          <p className="text-muted-foreground">
            Your entrepreneurship assessment results
          </p>
        </div>
        {hasReport && (
          <Button onClick={handleDownloadPdf} className="bg-primary hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            Download PDF Report
          </Button>
        )}
      </div>

      {/* Stage Summaries */}
      {stageSummaries.length > 0 ? (
        <Card className="border-border bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <MessageCircle className="w-5 h-5 text-primary" />
              Chatbot Assessment Summaries
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {stageSummaries.map((stage) => (
              <div
                key={stage.stage_number}
                className="flex gap-4 p-4 bg-neutral-50 rounded-lg"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-foreground text-sm">
                      Stage {stage.stage_number}: {stage.stage_name}
                    </h4>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {stage.summary || "No summary available yet."}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <Card className="border-border bg-white">
          <CardContent className="py-12 text-center">
            <MessageCircle className="w-12 h-12 text-neutral-300 mx-auto mb-4" />
            <h3 className="font-semibold text-foreground mb-2">No Assessment Summaries Yet</h3>
            <p className="text-muted-foreground mb-4">
              Complete the Entrepreneurship Chatbot stages to see your assessment summaries here.
            </p>
            <Link to="/beneficiary/chatbot">
              <Button variant="outline">Go to Chatbot</Button>
            </Link>
          </CardContent>
        </Card>
      )}

      {/* Entrepreneurship Score & Report (if generated) */}
      {report?.entrepreneurship_score && (
        <Card className="border-border bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <FileText className="w-5 h-5 text-primary" />
                Entrepreneurship Assessment
              </CardTitle>
              {report.readiness_level && (
                <Badge
                  className={
                    report.readiness_level === "Advanced"
                      ? "bg-green-100 text-green-800"
                      : report.readiness_level === "Intermediate"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-orange-100 text-orange-800"
                  }
                >
                  {report.readiness_level}
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-primary/5 rounded-lg p-4 text-center">
              <p className="text-sm text-muted-foreground mb-1">Readiness Score</p>
              <p className="text-4xl font-bold text-primary">
                {report.entrepreneurship_score?.toFixed(0)}
              </p>
              <p className="text-sm text-muted-foreground mt-1">out of 100</p>
            </div>

            {report.summary && (
              <div>
                <h3 className="font-semibold text-foreground mb-2 text-sm">Summary</h3>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
                    {report.summary}
                  </p>
                </div>
              </div>
            )}

            {report.recommendations && (
              <div>
                <h3 className="font-semibold text-foreground mb-2 text-sm">Recommendations</h3>
                <div className="bg-neutral-50 rounded-lg p-4">
                  <p className="text-muted-foreground whitespace-pre-wrap text-sm leading-relaxed">
                    {report.recommendations}
                  </p>
                </div>
              </div>
            )}

            {report.generated_at && (
              <p className="text-xs text-muted-foreground">
                Report generated on {new Date(report.generated_at).toLocaleDateString()}
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
