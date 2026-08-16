import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, Loader2, AlertCircle, ArrowLeft, Truck } from 'lucide-react';

export default function AccountLoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
        setLoading(false);
      } else if (data.session) {
        navigate('/konto');
      } else {
        setError('Konto skapat. Kontrollera din e-post om bekräftelse krävs.');
        setLoading(false);
      }
    } else {
      const { error } = await signIn(email, password);
      if (error) {
        setError(error);
        setLoading(false);
      } else {
        navigate('/konto');
      }
    }
  };

  return (
    <div className="min-h-screen bg-ink-900 flex items-center justify-center px-4 relative overflow-hidden pt-20">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-500/5 rounded-full blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-white/50 hover:text-amber-400 transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" />
          Tillbaka till hemsidan
        </Link>

        <div className="glass-card p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-diesel-600 flex items-center justify-center">
              <Truck className="w-7 h-7 text-ink-900" strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-heading font-bold text-xl text-white">Mina sidor</h1>
              <p className="text-sm text-white/50">Åseda Truckmeet</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">E-post</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all"
                  placeholder="din@email.se" />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 block">Lösenord</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:border-amber-500/50 focus:outline-none focus:ring-1 focus:ring-amber-500/30 transition-all"
                  placeholder="••••••••" />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
              {loading ? (<><Loader2 className="w-5 h-5 animate-spin" /> {isSignUp ? 'Skapar konto...' : 'Loggar in...'}</>) : (isSignUp ? 'Skapa konto' : 'Logga in')}
            </button>
          </form>

          <button
            onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
            className="w-full text-center text-sm text-white/50 hover:text-amber-400 transition-colors mt-4"
          >
            {isSignUp ? 'Har du redan ett konto? Logga in' : 'Har du inget konto? Skapa ett'}
          </button>
        </div>
      </div>
    </div>
  );
}
