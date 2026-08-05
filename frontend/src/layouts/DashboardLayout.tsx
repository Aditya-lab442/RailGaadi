import React from 'react';

interface DashboardLayoutProps {
  hero: React.ReactNode;
  map: React.ReactNode;
  journey: React.ReactNode;
  stationList: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  hero,
  map,
  journey,
  stationList,
}) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: '24px',
        maxWidth: '1440px',
        margin: '0 auto',
        padding: '24px',
      }}
    >
      {/* Top Banner: Hero Card (Full 12 cols) */}
      <div style={{ gridColumn: 'span 12' }}>{hero}</div>

      {/* Left Column: Interactive Map + Journey Completion (8 cols desktop, 12 cols mobile) */}
      <div
        style={{
          gridColumn: 'span 12',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
        className="dashboard-main-col"
      >
        <style>{`
          @media (min-width: 1024px) {
            .dashboard-main-col { grid-column: span 7 !important; }
            .dashboard-side-col { grid-column: span 5 !important; }
          }
        `}</style>
        {map}
        {journey}
      </div>

      {/* Right Column: Station List (5 cols desktop, 12 cols mobile) */}
      <div
        style={{
          gridColumn: 'span 12',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
        className="dashboard-side-col"
      >
        {stationList}
      </div>
    </div>
  );
};
