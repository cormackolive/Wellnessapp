import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

type AuthState = {
  session: Session | null;
  initializing: boolean;
  setSession: (session: Session | null) => void;
  init: () => Promise<void>;
  signOut: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  initializing: true,
  setSession: (session) => set({ session }),
  init: async () => {
    const { data } = await supabase.auth.getSession();
    set({ session: data.session, initializing: false });
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session });
    });
  },
  signOut: async () => {
    await supabase.auth.signOut();
  },
}));
