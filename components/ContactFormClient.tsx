'use client';

import { useState } from 'react';

export default function ContactFormClient() {
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSending(true);
        try {
            const { sendEnquiryNotification } = await import('@/app/actions/email');
            await sendEnquiryNotification(formData);
            setSent(true);
            setFormData({ name: '', email: '', phone: '', message: '' });
        } catch (error) {
            alert('Failed to send enquiry. Please try again.');
        } finally {
            setSending(false);
        }
    };

    if (sent) {
        return (
            <div className="text-center py-8 space-y-4">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h4 className="text-xl font-bold text-gray-800">Thank you!</h4>
                <p className="text-gray-600">Your enquiry has been received. Our team will get back to you shortly.</p>
                <button
                    onClick={() => setSent(false)}
                    className="px-6 py-2 rounded-lg font-medium border-2 border-heritage-maroon text-heritage-maroon hover:bg-heritage-maroon hover:text-white transition-all shadow-md"
                >
                    Send Another Message
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Your Name</label>
                    <input
                        required
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-maroon outline-none transition-all"
                        placeholder="Full Name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <input
                        required
                        type="email"
                        className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-maroon outline-none transition-all"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number (WhatsApp preferred)</label>
                <input
                    required
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-maroon outline-none transition-all"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Message / Enquiry Details</label>
                <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-heritage-maroon outline-none transition-all"
                    placeholder="Tell us what you are looking for..."
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                />
            </div>
            <button
                type="submit"
                disabled={sending}
                className="w-full py-4 text-lg bg-heritage-maroon hover:bg-heritage-maroon/90 text-white rounded-xl shadow-lg transition-all font-medium disabled:opacity-50"
            >
                {sending ? 'Sending...' : 'Submit Enquiry'}
            </button>
        </form>
    );
}
