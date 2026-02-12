'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { getSiteContent, saveSiteContent, type SiteContent } from '@/lib/dataStore';
import { Plus, Trash2, Save, ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';

export default function PartnerManagementPage() {
    const [content, setContent] = useState<SiteContent | null>(null);
    const [newEmail, setNewEmail] = useState('');

    useEffect(() => {
        setContent(getSiteContent());
    }, []);

    const handleSave = () => {
        if (!content) return;
        saveSiteContent(content);
        alert('Partner list updated successfully!');
    };

    const addPartner = () => {
        if (!content || !newEmail.trim()) return;
        if (content.partnerEmails.includes(newEmail.trim())) {
            alert('This email is already registered as a partner');
            return;
        }
        setContent({
            ...content,
            partnerEmails: [...content.partnerEmails, newEmail.trim()]
        });
        setNewEmail('');
    };

    const removePartner = (email: string) => {
        if (!content) return;
        if (!confirm(`Are you sure you want to remove "${email}"? They will lose access to the partner portal.`)) return;
        setContent({
            ...content,
            partnerEmails: content.partnerEmails.filter(e => e !== email)
        });
    };

    if (!content) return <div className="p-8 text-gray-500">Loading...</div>;

    return (
        <div className="max-w-3xl">
            <div className="mb-6">
                <Link href="/admin/dashboard" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-4">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Dashboard
                </Link>
                <div className="flex items-center gap-3 mb-2">
                    <Users className="w-8 h-8 text-heritage-maroon" />
                    <h1 className="text-3xl font-serif font-bold text-gray-800">Partner Management</h1>
                </div>
                <p className="text-gray-500">Authorize manufacturers or partners to add products to the marketplace</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-6">
                <div className="flex gap-4 items-end pb-6 border-b border-gray-50">
                    <div className="flex-1 space-y-2">
                        <Label htmlFor="newEmail">Partner Email Address</Label>
                        <Input
                            id="newEmail"
                            type="email"
                            placeholder="partner@example.com"
                            value={newEmail}
                            onChange={(e) => setNewEmail(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addPartner()}
                        />
                    </div>
                    <Button onClick={addPartner} className="gap-2">
                        <Plus className="w-4 h-4" /> Authorize Partner
                    </Button>
                </div>

                <div className="space-y-4">
                    <Label className="text-lg">Authorized Partners</Label>
                    {content.partnerEmails.length === 0 ? (
                        <p className="text-gray-400 italic py-4">No partners authorized yet.</p>
                    ) : (
                        <div className="space-y-3">
                            {content.partnerEmails.map((email) => (
                                <div key={email} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl group hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="font-medium text-gray-700">{email}</span>
                                    </div>
                                    <button
                                        onClick={() => removePartner(email)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                                        title="Revoke Access"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="pt-6 border-t border-gray-50">
                    <Button onClick={handleSave} className="w-full gap-2 py-6 text-lg">
                        <Save className="w-5 h-5" />
                        Save Partner List
                    </Button>
                </div>
            </div>

            <div className="mt-8 bg-blue-50 p-6 rounded-2xl border border-blue-100 text-sm text-blue-800 space-y-2">
                <p className="font-bold flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Partner Access Information:
                </p>
                <ul className="list-disc ml-6 space-y-1">
                    <li>Partners log in at the same admin URL using their authorized email.</li>
                    <li>The default password for all partners is <strong>partner2025!</strong></li>
                    <li>Partners only see the "Add New Product" option in their sidebar.</li>
                    <li>They cannot see orders, site configurations, or other partners.</li>
                </ul>
            </div>
        </div>
    );
}
