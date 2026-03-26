"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { CalendarSearch , Plus, X, Edit2, Trash2 } from "lucide-react";
import { API_URLS } from "@/lib/config";
import { syncEntity } from "@/lib/storageSync";

type Event = { id: number; name: string; price: number; category: string; stock: number; };

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ name: '', price: '', category: '', stock: '' });
  
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const syncedData = await syncEntity<Event>('events_cache', API_URLS.EVENTS);
      setEvents(syncedData);
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await axios.post(API_URLS.EVENTS, {
        name: newEvent.name,
        price: parseFloat(newEvent.price),
        category: newEvent.category,
        stock: parseInt(newEvent.stock)
      });
      setIsModalOpen(false);
      setNewEvent({ name: '', price: '', category: '', stock: '' });
      fetchEvents();
    } catch (error) {
      console.error("Error adding event:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;
    setSubmitting(true);
    try {
      await axios.put(`${API_URLS.EVENTS}/${editingEvent.id}`, {
        name: editingEvent.name,
        price: parseFloat(editingEvent.price.toString()),
        category: editingEvent.category,
        stock: parseInt(editingEvent.stock.toString())
      });
      setEditingEvent(null);
      fetchEvents();
    } catch (error) {
      console.error("Error updating event:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`${API_URLS.EVENTS}/${id}`);
      const localStr = localStorage.getItem('events_cache');
      if (localStr) {
        let localData = JSON.parse(localStr);
        localData = localData.filter((e: any) => e.id !== id);
        localStorage.setItem('events_cache', JSON.stringify(localData));
      }
      fetchEvents();
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <CalendarSearch className="h-8 w-8 text-primary" />
            Events
          </h2>
          <p className="text-slate-500 mt-2">View, edit, and manage Events.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary hover:bg-indigo-600 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" /> Create Event
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {events.map((event) => (
          <div key={event.id} className="group relative overflow-hidden rounded-2xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 text-slate-400 group-hover:text-primary transition-colors">
                <CalendarSearch className="h-6 w-6" />
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setEditingEvent(event)} className="text-slate-400 hover:text-indigo-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Edit2 className="h-4 w-4" /></button>
                <button onClick={() => handleDeleteEvent(event.id)} className="text-slate-400 hover:text-rose-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
            
            <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 mb-2">
              {event.category}
            </span>
            <h3 className="text-lg font-semibold text-slate-900 mb-1 group-hover:text-primary transition-colors">{event.name}</h3>
            
            <div className="flex justify-between items-end mt-4 pt-4 border-t border-slate-100">
              <div>
                <p className="text-xs text-slate-500 mb-1">Price</p>
                <p className="text-xl font-bold text-slate-900">${event.price.toFixed(2)}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 mb-1">Seats</p>
                <p className={`text-sm font-medium ${event.stock < 20 ? 'text-amber-500' : 'text-emerald-500'}`}>
                  {event.stock} units
                </p>
              </div>
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <div className="col-span-full py-12 text-center text-sm text-slate-500 rounded-2xl border border-dashed border-slate-300">
            No Events found in Local Storage or Backend. Book one!
          </div>
        )}
      </div>

      {/* Add Event Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Book New Event</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleAddEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Name</label>
                <input required type="text" value={newEvent.name} onChange={e => setNewEvent({...newEvent, name: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="e.g. Music Concert" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price </label>
                  <input required type="number" step="0.01" min="0" value={newEvent.price} onChange={e => setNewEvent({...newEvent, price: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="0.00" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Seats</label>
                  <input required type="number" min="0" value={newEvent.stock} onChange={e => setNewEvent({...newEvent, stock: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" placeholder="0" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select required value={newEvent.category} onChange={e => setNewEvent({...newEvent, category: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none bg-white">
                  <option value="" disabled>Select category</option>
                  <option value="Sports">Sports</option>
                  <option value="Music">Music</option>
                  <option value="Cultural">Cultural</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="bg-primary hover:bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? 'Adding...' : 'Add Event'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {editingEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Edit Event</h3>
              <button onClick={() => setEditingEvent(null)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleEditEvent} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Event Name</label>
                <input required type="text" value={editingEvent.name} onChange={e => setEditingEvent({...editingEvent, name: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price </label>
                  <input required type="number" step="0.01" min="0" value={editingEvent.price} onChange={e => setEditingEvent({...editingEvent, price: parseFloat(e.target.value)})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Seats</label>
                  <input required type="number" min="0" value={editingEvent.stock} onChange={e => setEditingEvent({...editingEvent, stock: parseInt(e.target.value)})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                <select required value={editingEvent.category} onChange={e => setEditingEvent({...editingEvent, category: e.target.value})} className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none bg-white">
                  <option value="Electronics">Sports</option>
                  <option value="Furniture">Music</option>
                  <option value="Clothing">Cultural</option>
                  <option value="General">General</option>
                </select>
              </div>
              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingEvent(null)} className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={submitting} className="bg-primary hover:bg-indigo-600 text-white px-6 py-2 rounded-xl text-sm font-medium transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed">
                  {submitting ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
