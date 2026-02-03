export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type ProfileRole = "user" | "admin";
export type SubmissionStatus = "pending" | "approved" | "rejected";

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  role: ProfileRole;
  created_at: string;
  updated_at: string;
}

export interface Journey {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  image_url: string | null;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Challenge {
  id: string;
  journey_id: string;
  level: number;
  title: string;
  description: string | null;
  xp_reward: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface Submission {
  id: string;
  user_id: string;
  challenge_id: string;
  links: string[];
  text: string | null;
  file_urls: string[];
  status: SubmissionStatus;
  score: number | null;
  feedback: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface Progress {
  user_id: string;
  journey_id: string;
  total_xp: number;
  level: number;
  updated_at: string;
}
