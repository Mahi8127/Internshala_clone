"use client";

import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { pdf } from "@react-pdf/renderer";

export default function ResumePreview() {
  const router = useRouter();
  const { id } = router.query;

  const [resume, setResume] = useState<any>(null);

  useEffect(() => {
    if (!id) return;

    const fetchResume = async () => {
      try {
        const res = await axios.get(`http://internshala-backend-5ycp.onrender.com/api/resume/${id}`);

        setResume(res.data.resume);
      } catch (error) {
        console.log(error);
      }
    };

    fetchResume();
  }, [id]);
}