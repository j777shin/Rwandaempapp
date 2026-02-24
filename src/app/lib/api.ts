const API_BASE = "http://localhost:8001";

function getToken(): string | null {
  return localStorage.getItem("token");
}

async function request<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || "Request failed");
  }

  // Handle empty responses (204 No Content)
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// File upload helper (no Content-Type header - browser sets multipart boundary)
async function uploadFile<T>(path: string, file: File): Promise<T> {
  const token = getToken();
  const formData = new FormData();
  formData.append("file", file);

  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Upload failed" }));
    throw new Error(error.detail || "Upload failed");
  }

  return response.json();
}

// PDF download helper
async function downloadBlob(path: string): Promise<Blob> {
  const token = getToken();
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, { headers });
  if (!response.ok) throw new Error("Download failed");
  return response.blob();
}

export const api = {
  // Auth
  login: (email: string, password: string) =>
    request<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),
  getMe: () => request<any>("/auth/me"),
  logout: () => request<any>("/auth/logout", { method: "POST" }),

  // Beneficiary Dashboard
  getDashboard: () => request<any>("/beneficiary/dashboard"),

  // Employment Status
  updateEmploymentStatus: (data: { status: string; hired_company_name?: string; self_employed_description?: string }) =>
    request<any>("/beneficiary/dashboard/employment-status", { method: "POST", body: JSON.stringify(data) }),

  // SkillCraft
  getSkillcraftStatus: () => request<any>("/beneficiary/skillcraft/status"),
  startSkillcraft: () => request<any>("/beneficiary/skillcraft/start", { method: "POST" }),
  syncSkillcraft: () => request<any>("/beneficiary/skillcraft/sync", { method: "POST" }),

  // Pathways
  getPathwaysStatus: () => request<any>("/beneficiary/pathways/status"),
  enrollPathways: () => request<any>("/beneficiary/pathways/enroll", { method: "POST" }),
  syncPathways: () => request<any>("/beneficiary/pathways/sync", { method: "POST" }),

  // Business Development
  getBusinessDev: () => request<any>("/beneficiary/business-dev"),
  submitBusinessDev: (data: { wants_entrepreneurship: boolean; business_development_text: string }) =>
    request<any>("/beneficiary/business-dev", { method: "POST", body: JSON.stringify(data) }),

  // Chatbot
  getChatbotStatus: () => request<any>("/beneficiary/chatbot/status"),
  sendChatMessage: (message: string, conversationHistory: { message: string; is_user: boolean }[] = []) =>
    request<any>("/beneficiary/chatbot/message", {
      method: "POST",
      body: JSON.stringify({ message, conversation_history: conversationHistory }),
    }),
  finishChatbotStage: (conversationHistory: { message: string; is_user: boolean }[] = []) =>
    request<any>("/beneficiary/chatbot/finish-stage", {
      method: "POST",
      body: JSON.stringify({ conversation_history: conversationHistory }),
    }),
  goToChatbotStage: (stageNumber: number) =>
    request<any>("/beneficiary/chatbot/go-to-stage", {
      method: "POST",
      body: JSON.stringify({ stage_number: stageNumber }),
    }),
  getChatbotStages: () => request<any>("/beneficiary/chatbot/stages"),
  getChatbotReport: () => request<any>("/beneficiary/chatbot/report"),
  downloadReportPdf: () => downloadBlob("/beneficiary/chatbot/report/pdf"),

  // Surveys
  submitPhase1Survey: (responses: Record<string, any>) =>
    request<any>("/beneficiary/surveys/phase1", { method: "POST", body: JSON.stringify({ responses }) }),
  submitEmploymentSurvey: (responses: Record<string, any>) =>
    request<any>("/beneficiary/surveys/employment", { method: "POST", body: JSON.stringify({ responses }) }),
  submitEntrepreneurshipSurvey: (responses: Record<string, any>) =>
    request<any>("/beneficiary/surveys/entrepreneurship", { method: "POST", body: JSON.stringify({ responses }) }),
  getSurveyStatus: () => request<any>("/beneficiary/surveys/status"),

  // Admin - Beneficiaries
  adminListBeneficiaries: (params?: Record<string, any>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any>(`/admin/beneficiaries${query}`);
  },
  adminGetBeneficiary: (id: string) => request<any>(`/admin/beneficiaries/${id}`),
  adminUpdateBeneficiary: (id: string, data: any) =>
    request<any>(`/admin/beneficiaries/${id}`, { method: "PUT", body: JSON.stringify(data) }),

  // Admin - Accounts
  adminListAccounts: (params?: Record<string, any>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any>(`/admin/accounts${query}`);
  },
  adminUpdateAccount: (id: string, data: any) =>
    request<any>(`/admin/accounts/${id}`, { method: "PUT", body: JSON.stringify(data) }),
  adminDeactivateAccount: (id: string) =>
    request<any>(`/admin/accounts/${id}`, { method: "DELETE" }),

  // Admin - Registration
  adminUploadCsv: (file: File) => uploadFile<any>("/admin/registration/csv", file),
  adminRegisterManual: (data: any) =>
    request<any>("/admin/registration/manual", { method: "POST", body: JSON.stringify(data) }),

  // Admin - Selection
  adminCalculateScores: () =>
    request<any>("/admin/selection/calculate-scores", { method: "POST" }),
  adminRunPhase1Selection: (count: number = 9000) =>
    request<any>("/admin/selection/phase1", { method: "POST", body: JSON.stringify({ count }) }),
  adminGetSelectionResults: () => request<any>("/admin/selection/results"),
  adminAssignTracks: (beneficiary_ids: string[], track: string) =>
    request<any>("/admin/selection/phase2", {
      method: "POST",
      body: JSON.stringify({ beneficiary_ids, track }),
    }),
  adminGetEligibilityStats: () => request<any>("/admin/selection/eligibility/stats"),
  adminResetSelection: () =>
    request<any>("/admin/selection/reset", { method: "POST" }),
  adminResetPhase2: () =>
    request<any>("/admin/selection/reset-phase2", { method: "POST" }),
  adminApplyPhase1Results: () =>
    request<any>("/admin/selection/apply-phase1-results", { method: "POST" }),
  adminRunPhase2Selection: () =>
    request<any>("/admin/selection/run-phase2", { method: "POST" }),

  // Admin - Analytics
  adminGetOverview: () => request<any>("/admin/analytics/overview"),
  adminGetDemographics: () => request<any>("/admin/analytics/demographics"),
  adminGetEngagement: () => request<any>("/admin/analytics/engagement"),
  adminGetSocioeconomic: () => request<any>("/admin/analytics/socioeconomic"),
  adminGetImpactDashboard: () => request<any>("/admin/analytics/impact"),

  // Admin - Chatbot Analytics
  adminGetChatbotAnalytics: () => request<any>("/admin/chatbot/analytics"),
  adminGetBeneficiaryConversations: (id: string) => request<any>(`/admin/chatbot/conversations/${id}`),

  // Admin - Phase Dashboards
  adminGetPhase1Dashboard: () => request<any>("/admin/phase1/dashboard"),
  adminGetPhase2Dashboard: () => request<any>("/admin/phase2/dashboard"),
  adminGetEmploymentProgress: () => request<any>("/admin/progress/employment"),
  adminGetEntrepreneurshipProgress: () => request<any>("/admin/progress/entrepreneurship"),

  // Admin - Survey Results
  adminGetSurveyResults: (surveyType: string, params?: Record<string, any>) => {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    return request<any>(`/admin/surveys/${surveyType}${query}`);
  },
  adminGetSurveyStats: (surveyType: string) =>
    request<any>(`/admin/surveys/${surveyType}/stats`),
  adminGetSurveyInsights: (surveyType: string) =>
    request<any>(`/admin/surveys/${surveyType}/insights`),
  adminGetSurveyAnalytics: (surveyType: string) =>
    request<any>(`/admin/surveys/${surveyType}/analytics`),
  adminGetSurveyResponse: (surveyType: string, responseId: string) =>
    request<any>(`/admin/surveys/${surveyType}/${responseId}`),
  adminExportSurveyResults: (surveyType: string) =>
    downloadBlob(`/admin/surveys/${surveyType}/export`),

  // Admin - Sync
  adminSyncPathways: () =>
    request<any>("/admin/sync/pathways", { method: "POST" }),
};
