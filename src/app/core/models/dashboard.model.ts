export interface DashboardStats {
  totalDeclarations: number;
  totalConsultations: number;
  totalPrescriptions: number;
  totalCertificates: number;
  pendingDeclarations: number;
  activeConsultations: number;
  expiringPrescriptions: number;
  emittedCertificates: number;
}

export interface DeclarationChartData {
  labels: string[];
  submitted: number[];
  approved: number[];
  rejected: number[];
}

export interface StatusDistributionData {
  labels: string[];
  data: number[];
  colors: string[];
}

export interface MonthlyTrendData {
  labels: string[];
  declarations: number[];
  consultations: number[];
  certificates: number[];
}

export interface RecentDeclaration {
  id: string;
  reference: string;
  agentName: string;
  status: string;
  declarationDate: string;
}

export interface RecentConsultation {
  id: string;
  patientName: string;
  doctorName: string;
  type: string;
  date: string;
  status: string;
}

export interface DashboardActivity {
  id: string;
  icon: string;
  title: string;
  description: string;
  timestamp: string;
  color: 'primary' | 'accent' | 'success' | 'warn';
}

export interface DashboardNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface DashboardData {
  stats: DashboardStats;
  declarationChart: DeclarationChartData;
  statusDistribution: StatusDistributionData;
  monthlyTrend: MonthlyTrendData;
  recentDeclarations: RecentDeclaration[];
  recentConsultations: RecentConsultation[];
  activities: DashboardActivity[];
  notifications: DashboardNotification[];
}
