export interface Job {
    id: string;
    position: string;
    company: string;
    location: string;
    date: string;
    status: 'Applied' | 'Interview' | 'Offer' | 'Rejected';
    description?: string;
}