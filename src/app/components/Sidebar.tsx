'use client';

import { useState} from 'react';
import { Briefcase, Archive, Info, User, ChevronDown } from 'lucide-react';

export function Sidebar() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <aside className="w- flex flex-col min-h-[calc(100vh-4rem)] border-r">
            <div className='p-4'>
                <h2 className='text-lg font-semibold mb-6'>Side B Nav</h2>

                <nav className="space-y-2">
                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-blue-600 bg-blue-50 rounded-lg">
                        <Briefcase size={20} />
                        <span>Jobs</span>
                        <span className="ml-auto bg-blue-100 px-2 py-0.5 text-sm rounded-full">{/* {appliedCount} */}</span>
                    </a>

                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                        <Archive size={20} />
                        <span>Archived</span>
                    </a>

                    <a href="#" className="flex items-center gap-3 px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
                        <Info size={20} />
                        <span>About</span>
                    </a>
                </nav>
            </div>

            <div>
                <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-3 w-full p-2 hover:bg-gray-50 rounded-lg">
                    <User className="w-8 h-8 text-gray-400" />
                    <div className="flex-1 text-left">
                        <div className="text-sm font-medium">Account Holder</div>
                        <div className="text-xs text-gray-500">tesh@gmail.com</div>
                    </div>
                    <ChevronDown className={`transition-transform ${isProfileOpen ? 'rotate-180' : ''}`}/>
                </button>

                {isProfileOpen && (
                    <div>
                        <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900">
                            Settings
                        </button>
                        <button className="w-full text-left text-sm text-gray-600 hover:text-gray-900">
                            Sign Out
                        </button>
                    </div>
                )}
            </div>
        </aside>
    )
}
