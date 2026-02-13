export type Status = "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";

export type Application = {
  _id: string;
  company: string;
  role: string;
  location?: string;
  link?: string;
  salaryRange?: string;
  status: Status;
  nextActionAt?: string | null;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
};
