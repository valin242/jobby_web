"use client";

import { useState } from "react";
import { useJobs } from '../context/JobContext';
import { Plus, Filter, Search } from 'lucide-react';


export function JobList() {
    const { jobs, selectJob, selectedJobId } = useJobs();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredJobs = jobs.filter(job =>
        job.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex-1 max-w-3xl">
            <div className="mb-6">
                <div className="flex gap-4 mb-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text"
                            placeholder="Search jobs..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Filter size={20} />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        <Plus size={20} />
                        <span>Add Job</span>
                    </button>
                </div>

                    <div className="grid grid-cols-5 px-4 py-2 text-sm font-medium text-gray-500">
                        <div>Position</div>
                        <div>Company</div>
                        <div>Location</div>
                        <div>Date</div>
                        <div>Status</div>
                    </div>
                </div>

                <div className="space-y-2">
                    {filteredJobs.map(job => (
                        <button
                            key={job.id}
                            onClick={() => selectJob(job.id)}
                            className={`w-full grid grid-cols-5 px-4 py-3 text-left border rounded-full hover:border-blue-200 ${
                                selectedJobId === job.id ? 'border-blue-500 bg-blue-50' : ''}`}
                        >
                            <div className="font-medium font-bold">{job.position}</div>
                            <div>{job.company}</div>
                            <div>{job.location}</div>
                            <div>{job.date}</div>
                            <div>
                                <span className={`inline-flex px-2 py-1 text-sm rounded-full ${
                                    job.status === 'Applied' ? 'bg-green-100 text-green-700' :
                                    job.status === 'Interview' ? 'bg-blue-100 text-blue-700' :
                                    job.status === 'Offer' ? 'bg-purple-100 text-purple-700' :
                                    "bg-grapy-100 text-gray-700"
                                }`}>
                                    {job.status}
                                </span>
                            </div>
                        </button>
                    ))}
                    </div>
                    
                    {filteredJobs.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-gray-400 mb-2">No jobs found.</div>
                            <div className="text-sm text-gray-500">Try adjusting your search or filters</div>
                        </div>
                    )}
                    </div>
                );
            }                  