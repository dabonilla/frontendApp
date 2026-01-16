import {api} from "../lib/axios";
import type {CreateStudentRequest} from "@/types/CreateStudentRequest"

export async function createStudent(
    payload: CreateStudentRequest
  ): Promise<void> {
    await api.post("/addStudent", payload);
  }

export async function updateStudent(
    id: number,
    payload: CreateStudentRequest
  ): Promise<void> {
    await api.put(`/updateStudent/${id}`, payload);
}

export async function deleteStudent(
    id:number
    ): Promise<void>{
        await api.delete(`/deleteStudent/${id}`)
    }