import axiosInstance from "@/axios"

export default async function submitName(name: string) {
    await axiosInstance.post('/api/v1/login', { name }, { withCredentials: true })
}