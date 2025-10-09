'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface InteractionFormProps {
  leadId: string;
}

export function InteractionForm({ leadId }: InteractionFormProps) {
  const router = useRouter();
  const [interactionType, setInteractionType] = useState('note');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!description.trim()) {
      setMessage({ text: 'Description is required', type: 'error' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch('/api/interactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lead_id: leadId,
          interaction_type: interactionType,
          description: description.trim(),
          notes: notes.trim() || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add interaction');
      }

      setMessage({ text: 'Interaction added successfully!', type: 'success' });
      setDescription('');
      setNotes('');
      setInteractionType('note');

      // Refresh the page to show the new interaction
      router.refresh();

    } catch (error: any) {
      console.error('Error adding interaction:', error);
      setMessage({ text: error.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`p-3 rounded-md ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-800'
            : 'bg-red-50 border border-red-200 text-red-800'
        }`}>
          {message.text}
        </div>
      )}

      <div>
        <label htmlFor="interactionType" className="block text-sm font-medium text-gray-700 mb-2">
          Interaction Type
        </label>
        <select
          id="interactionType"
          value={interactionType}
          onChange={(e) => setInteractionType(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="note">Note</option>
          <option value="call">Phone Call</option>
          <option value="email">Email</option>
          <option value="meeting">Meeting</option>
        </select>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Brief description of the interaction..."
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={4}
          placeholder="Detailed notes about the interaction..."
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <button
          type="submit"
          disabled={loading || !description.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Adding...' : 'Add Interaction'}
        </button>
      </div>
    </form>
  );
}
