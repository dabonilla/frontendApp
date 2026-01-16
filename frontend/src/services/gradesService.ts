import {api} from "../lib/axios";
import type { CreateGradeRequest } from "@/types/CreateGradeRequest";

export async function createGrade(
    payload: CreateGradeRequest
  ) {
    await api.post("/addGrade", payload);
  }
export function getGrades(
  name: string
) {
  return api.get(`/getGrade/${name}`);
}