export interface Job {
  job_id: string;
  job_details: string;
  description: string;
  location: string;
  budget_max: number;
  posted_at: string;
  client_id?: string;
  client_name?: string;
  status?: string;
  created_at?: string;
  [key: string]: any; // Allow additional properties
}
