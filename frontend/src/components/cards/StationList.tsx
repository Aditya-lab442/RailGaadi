import React, { useState } from 'react';
import { Station } from '../../types/train';
import { StationCard } from './StationCard';
import { Search, Filter, MapPin } from 'lucide-react';

interface StationListProps {
  stations: Station[];
}

export const StationList: React.FC<StationListProps> = ({ stations }) => {
  const [haltsOnly, setHaltsOnly] = useState(true);
  const [filterText, setFilterText] = useState('');

  const haltingStations = stations.filter((s) => s.isHalt !== false);
  const displayStations = (haltsOnly ? haltingStations : stations).filter(
    (s) =>
      s.name.toLowerCase().includes(filterText.toLowerCase()) ||
      s.code.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="apple-card" style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.0625rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MapPin size={20} color="var(--accent-primary)" />
            Route & Station Schedule
          </h2>
          <div style={{ fontSize: '0.781rem', color: 'var(--text-tertiary)', marginTop: '2px', fontWeight: 500 }}>
            {haltingStations.length} Major Halts ({stations.length} Total Waypoints)
          </div>
        </div>

        {/* Halts Toggle Button */}
        <button
          onClick={() => setHaltsOnly(!haltsOnly)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            borderRadius: 'var(--radius-full)',
            backgroundColor: haltsOnly ? 'var(--accent-subtle)' : 'var(--bg-subtle)',
            color: haltsOnly ? 'var(--accent-primary)' : 'var(--text-secondary)',
            border: haltsOnly ? '1px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all var(--transition-fast)',
            fontFamily: 'inherit',
          }}
        >
          <Filter size={14} />
          {haltsOnly ? 'Major Halts Only' : 'All Stops Included'}
        </button>
      </div>

      {/* Station Search Filter Input */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'var(--bg-subtle)',
          border: '1px solid var(--border-subtle)',
          marginBottom: '20px',
        }}
      >
        <Search size={16} color="var(--text-tertiary)" />
        <input
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          placeholder="Filter stations by name or code (e.g. Ujjain, NDLS)..."
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            background: 'transparent',
            fontSize: '0.875rem',
            color: 'var(--text-primary)',
            fontFamily: 'inherit',
            fontWeight: 500,
          }}
        />
        {filterText && (
          <button
            onClick={() => setFilterText('')}
            style={{ border: 'none', background: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-tertiary)', fontWeight: 700 }}
          >
            CLEAR
          </button>
        )}
      </div>

      {/* Station List Container */}
      <div style={{ maxHeight: '560px', overflowY: 'auto', paddingRight: '4px' }}>
        {displayStations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-tertiary)', fontSize: '0.875rem' }}>
            No stations matching &ldquo;{filterText}&rdquo;
          </div>
        ) : (
          displayStations.map((station, index) => (
            <StationCard
              key={station.code + index}
              station={station}
              isFirst={index === 0}
              isLast={index === displayStations.length - 1}
            />
          ))
        )}
      </div>
    </div>
  );
};
