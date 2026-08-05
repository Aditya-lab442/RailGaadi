import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SearchBar } from '../components/ui/SearchBar';
import { SearchSuggestions } from '../components/ui/SearchSuggestions';
import { useSearch } from '../hooks/useSearch';
import { useUserStore } from '../store/userStore';
import { TrainSearchResult } from '../types/train';

export const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { data: suggestions = [], isLoading } = useSearch(query);
  const { addRecentSearch } = useUserStore();

  const handleSelectTrain = (train: TrainSearchResult) => {
    addRecentSearch({ trainNumber: train.number, trainName: train.name });
    navigate(`/train/${train.number}`);
  };

  return (
    <div style={{ padding: '32px 20px', maxWidth: '640px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '8px', color: 'var(--text-primary)' }}>
        Search Trains
      </h1>
      <p style={{ fontSize: '0.9375rem', color: 'var(--text-secondary)', marginBottom: '24px' }}>
        Enter a 5-digit train number or train name to get real-time tracking data.
      </p>

      <div style={{ position: 'relative' }}>
        <SearchBar
          value={query}
          onChange={setQuery}
          isLoading={isLoading}
          autoFocus
          placeholder="e.g. 22436, Vande Bharat, Rajdhani"
        />
        <SearchSuggestions
          suggestions={suggestions}
          onSelect={handleSelectTrain}
          isVisible={Boolean(query.trim())}
        />
      </div>
    </div>
  );
};
