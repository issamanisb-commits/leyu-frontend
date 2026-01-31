// pages/api/projects.ts
import type { NextApiRequest, NextApiResponse } from "next";

interface Project {
  id: string;
  title: string;
  status: "Active" | "Inactive";
  date: string;
  tasksCompleted: number;
  totalTasks: number;
  description: string;

}


