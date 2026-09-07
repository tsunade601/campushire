import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import Sidebar from '../../components/Sidebar';
import Badge from '../../components/Badge';
import { Gift, Calendar, DollarSign, CheckCircle2, XCircle, FileText } from 'lucide-react';

export default function OffersPage() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [respondingId, setRespondingId] = useState(null);

  const loadOffers = async () => {
    try {
      const res = await api.listOffers();
      setOffers(res.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOffers();
  }, []);

  const handleAction = async (offerId, action) => {
    if (!window.confirm(`Are you sure you want to ${action} this recruitment offer?`)) return;
    setRespondingId(offerId);
    try {
      await api.respondToOffer(offerId, action);
      loadOffers();
    } catch (err) {
      alert(err.message || 'Error processing response');
    } finally {
      setRespondingId(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex">
      <Sidebar role="student" />

      <main className="flex-1 min-w-0 space-y-6 animate-fade-in">
        <div className="glass-panel p-6 rounded-3xl border border-slate-800">
          <h1 className="text-2xl font-bold text-white">Recruitment Offers</h1>
          <p className="text-xs text-slate-400 mt-1">
            Formal internship offers extended by corporate partners. Accepting atomically registers an official internship record.
          </p>
        </div>

        {loading ? (
          <div className="p-8 text-center text-slate-400 text-xs">Loading offers...</div>
        ) : offers.length === 0 ? (
          <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800">
            <p className="text-sm font-semibold text-slate-300">No recruitment offers received yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {offers.map((offer) => (
              <div key={offer.id} className="glass-card p-6 rounded-2xl border border-slate-800 flex flex-col justify-between gap-4">
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">{offer.company_name}</span>
                      <h3 className="text-lg font-bold text-white mt-0.5">{offer.role_title}</h3>
                    </div>
                    <Badge status={offer.status}>{offer.status}</Badge>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4 p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs">
                    <div>
                      <span className="text-slate-400 block">Offered Stipend</span>
                      <strong className="text-emerald-400 text-base">₹{Number(offer.stipend_offered).toLocaleString()}/mo</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Joining Date</span>
                      <strong className="text-white text-sm">{new Date(offer.joining_date).toLocaleDateString()}</strong>
                    </div>
                    <div>
                      <span className="text-slate-400 block">Offer Validity Deadline</span>
                      <strong className="text-amber-400 text-sm">{new Date(offer.offer_valid_until).toLocaleDateString()}</strong>
                    </div>
                  </div>

                  {offer.benefits_description && (
                    <p className="text-xs text-slate-300 mt-2">
                      <strong className="text-slate-400">Benefits &amp; Perks:</strong> {offer.benefits_description}
                    </p>
                  )}
                </div>

                {offer.status === 'Issued' && (
                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                    <button
                      disabled={respondingId === offer.id}
                      onClick={() => handleAction(offer.id, 'reject')}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 border border-rose-500/20 transition-all"
                    >
                      Decline Offer
                    </button>
                    <button
                      disabled={respondingId === offer.id}
                      onClick={() => handleAction(offer.id, 'accept')}
                      className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-md shadow-emerald-500/20"
                    >
                      {respondingId === offer.id ? 'Processing...' : 'Accept Offer'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
