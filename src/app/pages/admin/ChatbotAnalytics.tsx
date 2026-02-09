import { Link } from "react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { ArrowLeft } from "lucide-react";

const interactions = [
  { date: "2026-01-28", user: "Jean Baptiste", messages: 15, topic: "SkillCraft Help" },
  { date: "2026-01-28", user: "Marie Claire", messages: 8, topic: "Pathways Info" },
  { date: "2026-01-27", user: "Patrick Nkusi", messages: 12, topic: "Eligibility" },
];

export function ChatbotAnalytics() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Link to="/admin">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle>Total Conversations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">1,847</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Avg Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">1.2s</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Satisfaction Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">94%</div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Recent Interactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {interactions.map((interaction, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{interaction.user}</p>
                    <p className="text-sm text-muted-foreground">{interaction.topic}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{interaction.messages} messages</p>
                    <p className="text-sm text-muted-foreground">{interaction.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}