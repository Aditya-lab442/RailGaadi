import React from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '../components/ui/EmptyState';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <EmptyState
      title="404 — Page Not Found"
      description="The train journey route or page you were looking for doesn't exist or was moved."
      onSelectSuggestion={(trainNumber) => navigate(`/train/${trainNumber}`)}
    />
  );
};
