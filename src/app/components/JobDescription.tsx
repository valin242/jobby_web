"use client";

import { Job, useJobs } from "../context/JobContext";
import { Calendar, Building2, MapPin, FileText } from 'lucide-react';


export function JobDescription() {

    const { jobs, selectedJobId, updateJob } = useJobs();
    const selectedJob = jobs.find(job => job.id === selectedJobId);

    if (!selectedJob) {
        return (
            <aside className="w-80 border-l p-6">
                <div className="text-center py-12 text-gray-500">
                    Select a job to view details.
                </div>
            </aside>
        );
    }

    const statusColors = {
        Applied: 'text-green-600 bg-green-50',
        Interview: 'text-blue-600 bg-blue-50',
        Offer: 'text-purple-600 bg-purple-50',
        Rejected: 'text-gray-600 bg-gray-50',
    };

    return (
        <aside className="w-80 border-l pl-6">
            <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2">{selectedJob.position}</h2>
                <div className="text-gray-600">{selectedJob.company}</div>
            </div>

            <div className="space-y-6">
                <div className="flex items-start gap-3">
                    <Building2 className="w-5 h-5 text-gray-400 mt-1"/>
                    <div>
                        <div className="font-medium">Company</div>
                        <div className="text-gray-600">{selectedJob.company}</div>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                        <div className="font-medium">Location</div>
                        <div className="text-gray-600">{selectedJob.location}</div>
                    </div>
                </div>

                <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                        <div className="font-medium">Applied Date</div>
                        <div className="text-gray-600">{selectedJob.date}</div>
                    </div>
                </div>
                
                <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                        <div className="font-medium">Status</div>
                        <select 
                            value={selectedJob.status}
                            onChange={(e) => updateJob(selectedJob.id, { 
                                status: e.target.value as Job['status'] 
                                })}
                                className={`mt-1 block w-full rounded-lg px-3 py-2 ${
                                statusColors[selectedJob.status as keyof typeof statusColors]
                                }`}
                                >
                            <option value="Applied">Applied</option>
                            <option value="Interview">Interview</option>
                            <option value="Offer">Offer</option>
                            <option value="Rejected">Rejected</option>
                        </select>
                    </div>
                </div>

                <div className="pt-6 border-t">
                    <button className="w-full py-2 px-4 text-red-600 hover:g-red-50 rounded-lg">
                        Delete Application
                    </button>
                </div>
            </div>
        </aside>
    )
}