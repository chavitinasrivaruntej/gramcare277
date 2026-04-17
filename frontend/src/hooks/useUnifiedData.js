import { useState, useEffect, useCallback } from 'react';
import { dataEngine } from '../lib/dataEngine';

export function useUnifiedData() {
  const [patients, setPatients] = useState(() => dataEngine.getPatients());

  const refreshData = useCallback(() => {
    setPatients(dataEngine.getPatients());
  }, []);

  useEffect(() => {
    // Listen for storage events (even in the same tab since dataEngine dispatches it)
    window.addEventListener('storage', refreshData);
    
    // Initial fetch
    refreshData();

    return () => window.removeEventListener('storage', refreshData);
  }, [refreshData]);

  return {
    patients,
    refreshData,
    updateStatus: dataEngine.updatePatientStatus,
    completeConsultation: dataEngine.completeConsultation,
    registerPatient: dataEngine.registerPatient
  };
}
