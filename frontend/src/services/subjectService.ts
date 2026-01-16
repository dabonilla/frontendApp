import {api} from "../lib/axios";
import type { CreateSubjectRequest } from "@/types/CreateSubjectRequest";

export async function createSubject(
    payload: CreateSubjectRequest
  ): Promise<void> {
    await api.post("/addSubject", payload);
  }

export async function updateSubject(
    id: number,
    payload: CreateSubjectRequest
  ): Promise<void> {
    await api.put(`/updateSubject/${id}`, payload);
}

export async function deleteSubject(
    id:number
    ): Promise<void>{
        await api.delete(`/deleteSubject/${id}`)
    }