"use client";

import React, { createContext, useContext, useState } from "react";

export interface Job {
    id: string;
    position: string;
    company: string;
    location: string;
    date: string;
    status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
    description?: string;
}

interface JobContextType {
    jobs: Job[];
    selectedJobId: string | null;
    addJob: (job: Omit<Job, 'id'>) => void;
    updateJob: (id: string, job: Partial<Job>) => void;
    deleteJob: (id: string) => void;
    selectJob: (id: string | null) => void;
}

const JobContext = createContext<JobContextType | undefined>(undefined);

export function JobProvider({ children }: { children: React.ReactNode}) {
    const [jobs, setJobs] = useState<Job[]>([
        {
            id: '1',
            position: "Senior Scientist I",
            company: "Pfizer",
            location: "Remote",
            date: "02/10/2025",
            status: "Applied"
        },
        {
            id: '2',
            position: "Senior Scientist II",
            company: "Roche",
            location: "Arlington, VA",
            date: "02/05/2025",
            status: "Applied"
        },
        {
            id: '3',
            position: "Senior Bioinfromatics",
            company: "Moderna",
            location: "Boston, MA",
            date: "01/20/2025",
            status: "Applied"
        }
    ]);

    const [selectedJobId, setSelectedJobId] = useState<string | null>(null);

    const addJob = (newJob: Omit<Job, 'id'>) => {
        const job: Job = {
            ...newJob,
            id: crypto.randomUUID()
        };
        setJobs(prev => [...prev, job]);
    };

    const updateJob = (id: string, updatedFields: Partial<Job>) => {
        setJobs(prev => prev.map(job =>
            job.id === id ? { ...job, ...updatedFields } : job
        ));
    };

    const deleteJob = (id: string | null) => {
        setJobs(prev => prev.filter(job => job.id !== id));
        if (selectedJobId === id) {
            setSelectedJobId(null);
        }
    };

    const selectJob = (id: string | null) => {
        setSelectedJobId(id);
    };

    return (
        <JobContext.Provider 
        value={{
            jobs,
            selectedJobId,
            addJob,
            updateJob,
            deleteJob,
            selectJob
        }}
        >
            {children}
        </JobContext.Provider>
    );
}

export function useJobs() {
    const context = useContext(JobContext);
    if (context === undefined) {
        throw new Error("useJobs must be used within a JobProvider");
    }

    return context;
}

