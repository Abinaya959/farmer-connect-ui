import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';

export type LoginMode = 'guest' | 'phone' | 'email';

export interface AnalysisData {
  sessionType: 'new_planning' | 'crop_in_field' | 'post_harvest';
  districtId?: string;
  cropId?: string;
  cropName?: { en: string; ta: string };
  season?: string;
  landSize?: number;
  temperature?: number;
  humidity?: number;
  storageDays?: number;
  riskLevel?: 'safe' | 'warning' | 'danger';
  riskScore?: number;
  spoilageHours?: number;
  riskReasons?: string[];
  recommendations?: string[];
}

interface SessionContextType {
  sessionId: string | null;
  analysisSessionId: string | null;
  analysisData: AnalysisData | null;
  loginMode: LoginMode;
  setLoginMode: (mode: LoginMode) => void;
  setAnalysisData: (data: AnalysisData | null) => void;
  createAnalysisSession: (data: Partial<AnalysisData>) => Promise<string | null>;
  updateAnalysisSession: (data: Partial<AnalysisData>) => Promise<void>;
  resetSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [analysisSessionId, setAnalysisSessionId] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [loginMode, setLoginModeState] = useState<LoginMode>('guest');

  const setLoginMode = (mode: LoginMode) => {
    setLoginModeState(mode);
    localStorage.setItem('vivasai_login_mode', mode);
  };

  useEffect(() => {
    const savedLoginMode = localStorage.getItem('vivasai_login_mode') as LoginMode;
    if (savedLoginMode) {
      setLoginModeState(savedLoginMode);
    }
  }, []);

  useEffect(() => {
    const initSession = async () => {
      const savedSessionToken = localStorage.getItem('vivasai_session_token');

      if (savedSessionToken) {
        const { data } = await supabase
          .from('farmer_sessions')
          .select('id')
          .eq('session_token', savedSessionToken)
          .single();

        if (data) {
          setSessionId(data.id);
          return;
        }
      }

      const language = localStorage.getItem('vivasai_language') || 'ta';
      const { data, error } = await supabase
        .from('farmer_sessions')
        .insert({ language })
        .select('id, session_token')
        .single();

      if (data && !error) {
        setSessionId(data.id);
        localStorage.setItem('vivasai_session_token', data.session_token);
      }
    };

    initSession();
  }, []);

  const createAnalysisSession = async (data: Partial<AnalysisData>): Promise<string | null> => {
    if (!sessionId) return null;

    const { data: result, error } = await supabase
      .from('analysis_sessions')
      .insert({
        farmer_session_id: sessionId,
        session_type: data.sessionType || 'new_planning',
        district_id: data.districtId || null,
        crop_id: data.cropId || null,
        season: data.season || null,
        land_size_acres: data.landSize || null,
      })
      .select('id')
      .single();

    if (result && !error) {
      setAnalysisSessionId(result.id);
      setAnalysisData(data as AnalysisData);
      return result.id;
    }

    return null;
  };

  const updateAnalysisSession = async (data: Partial<AnalysisData>): Promise<void> => {
    if (!analysisSessionId) return;

    const updateData: {
      temperature?: number;
      humidity?: number;
      storage_days?: number;
      risk_level?: string;
      risk_score?: number;
      spoilage_hours?: number;
      risk_reasons?: string[];
      recommendations?: string[];
      crop_id?: string;
    } = {};

    if (data.temperature !== undefined) updateData.temperature = data.temperature;
    if (data.humidity !== undefined) updateData.humidity = data.humidity;
    if (data.storageDays !== undefined) updateData.storage_days = data.storageDays;
    if (data.riskLevel) updateData.risk_level = data.riskLevel;
    if (data.riskScore !== undefined) updateData.risk_score = data.riskScore;
    if (data.spoilageHours !== undefined) updateData.spoilage_hours = data.spoilageHours;
    if (data.riskReasons) updateData.risk_reasons = data.riskReasons;
    if (data.recommendations) updateData.recommendations = data.recommendations;
    if (data.cropId) updateData.crop_id = data.cropId;

    await supabase
      .from('analysis_sessions')
      .update(updateData as any)
      .eq('id', analysisSessionId);

    setAnalysisData(prev => prev ? { ...prev, ...data } : data as AnalysisData);
  };

  const resetSession = () => {
    setAnalysisSessionId(null);
    setAnalysisData(null);
  };

  return (
    <SessionContext.Provider value={{
      sessionId, analysisSessionId, analysisData, loginMode,
      setLoginMode, setAnalysisData, createAnalysisSession, updateAnalysisSession, resetSession,
    }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
