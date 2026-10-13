"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { pdf } from "@react-pdf/renderer";
import { BACKEND_URL } from "@/config/api";

export default function ResumePreview() {
  const router = useRouter();
  const { id } = router.query;

  const [resume, setResume] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchResume = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/resume/${id}`);

        setResume(res.data.resume);
      } catch (error) {
        console.log(error);
      }
    };

    fetchResume();
  }, [id]);
}