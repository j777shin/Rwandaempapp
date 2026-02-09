import { createBrowserRouter } from "react-router";
import { Root } from "@/app/pages/Root";
import { Login } from "@/app/pages/Login";
import { BeneficiaryLayout } from "@/app/components/BeneficiaryLayout";
import { BeneficiaryDashboard } from "@/app/pages/beneficiary/Dashboard";
import { SkillCraftTest } from "@/app/pages/beneficiary/SkillCraftTest";
import { PathwaysPage } from "@/app/pages/beneficiary/PathwaysPage";
import { PathwaysDeepDive } from "@/app/pages/beneficiary/PathwaysDeepDive";
import { EligibilityScore } from "@/app/pages/beneficiary/EligibilityScore";
import { ChatbotPage } from "@/app/pages/beneficiary/ChatbotPage";
import { ResultReport } from "@/app/pages/beneficiary/ResultReport";
import { BusinessDevelopment } from "@/app/pages/beneficiary/BusinessDevelopment";
import { BusinessLearning } from "@/app/pages/beneficiary/BusinessLearning";
import { AdminLayout } from "@/app/components/AdminLayout";
import { AdminDashboard } from "@/app/pages/admin/Dashboard";
import { DataRegistration } from "@/app/pages/admin/DataRegistration";
import { BeneficiarySelection } from "@/app/pages/admin/BeneficiarySelection";
import { AccountManagement } from "@/app/pages/admin/AccountManagement";
import { BeneficiaryProgress } from "@/app/pages/admin/BeneficiaryProgress";
import { SkillCraftInfo } from "@/app/pages/admin/SkillCraftInfo";
import { EligibilityManagement } from "@/app/pages/admin/EligibilityManagement";
import { EntrepreneurshipSelection } from "@/app/pages/admin/EntrepreneurshipSelection";
import { ChatbotAnalytics } from "@/app/pages/admin/ChatbotAnalytics";
import { Analytics } from "@/app/pages/admin/Analytics";
import { TrackAssignment } from "@/app/pages/admin/TrackAssignment";
import { EmploymentProgress } from "@/app/pages/admin/EmploymentProgress";
import { EntrepreneurProgress } from "@/app/pages/admin/EntrepreneurProgress";
import { Phase1Dashboard } from "@/app/pages/admin/Phase1Dashboard";
import { Phase2Dashboard } from "@/app/pages/admin/Phase2Dashboard";
import { Phase1Selection } from "@/app/pages/admin/Phase1Selection";
import { NotFound } from "@/app/pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Login },
      {
        path: "beneficiary",
        Component: BeneficiaryLayout,
        children: [
          { index: true, Component: BeneficiaryDashboard },
          { path: "skillcraft", Component: SkillCraftTest },
          { path: "pathways", Component: PathwaysPage },
          { path: "pathways-deepdive", Component: PathwaysDeepDive },
          { path: "eligibility", Component: EligibilityScore },
          { path: "chatbot", Component: ChatbotPage },
          { path: "results", Component: ResultReport },
          { path: "business-development", Component: BusinessDevelopment },
          { path: "business-learning", Component: BusinessLearning },
        ],
      },
      {
        path: "admin",
        Component: AdminLayout,
        children: [
          { index: true, Component: AdminDashboard },
          { path: "registration", Component: DataRegistration },
          { path: "selection", Component: BeneficiarySelection },
          { path: "accounts", Component: AccountManagement },
          { path: "progress", Component: BeneficiaryProgress },
          { path: "track-assignment", Component: TrackAssignment },
          { path: "employment-progress", Component: EmploymentProgress },
          { path: "entrepreneur-progress", Component: EntrepreneurProgress },
          { path: "phase1-dashboard", Component: Phase1Dashboard },
          { path: "phase2-dashboard", Component: Phase2Dashboard },
          { path: "skillcraft-info", Component: SkillCraftInfo },
          { path: "eligibility-management", Component: EligibilityManagement },
          { path: "entrepreneurship", Component: EntrepreneurshipSelection },
          { path: "chatbot-analytics", Component: ChatbotAnalytics },
          { path: "analytics", Component: Analytics },
          { path: "phase1-selection", Component: Phase1Selection },
        ],
      },
      { path: "*", Component: NotFound },
    ],
  },
]);