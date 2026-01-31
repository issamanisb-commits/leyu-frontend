import { cookies } from "next/headers";
import { NextApiRequest, NextApiResponse } from "next";

interface AuthResponse {
    token?: string;
    error?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<AuthResponse>) {
    const cookiesData = await cookies();
    const token = cookiesData.get("auth_token")?.value;
    if (token) {
        res.status(200).json({ token });
    } else {
        res.status(401).json({ error: "Unauthorized" });
    }
}