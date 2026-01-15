'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { GeneratorCard, GeneratorData } from '@/components/iqc/generator-card';
import { PreviewCard } from '@/components/iqc/preview-card';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { Shield, Sparkles, Zap, Globe, Lock, ArrowRight } from 'lucide-react';

export default function IQCGeneratorPage() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState(0);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Security: Simple Anti-Inspect for basic users
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      // e.preventDefault();
    };
    window.addEventListener('contextmenu', handleContextMenu);
    return () => window.removeEventListener('contextmenu', handleContextMenu);
  }, []);

  const handleGenerate = async (data: GeneratorData) => {
    // Security: Rate Limiting (5 seconds)
    const now = Date.now();
    if (now - lastGenerated < 5000) {
      const remaining = Math.ceil((5000 - (now - lastGenerated)) / 1000);
      toast.warning(`Sistem Keamanan Aktif: Harap tunggu ${remaining} detik lagi.`);
      return;
    }

    setIsLoading(true);
    setImageUrl(null);
    setLastGenerated(now);

    try {
      // API Parameters mapping
      const params = new URLSearchParams({
        prompt: data.text,
        jam: data.jam,
        batre: data.baterai.toString(),
      });

      // API Key is safe on server side, but here we use a public API endpoint
      const apiUrl = `https://api-faa.my.id/faa/iqcv2?${params.toString()}`;
      
      // Update UI
      setTimeout(() => {
        setImageUrl(apiUrl);
        setIsLoading(false);
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#93c5fd', '#ffffff']
        });
        toast.success('IQC Berhasil Dibuat!');
      }, 2000);
      
    } catch (error) {
      toast.error('Gagal membuat gambar. Coba lagi nanti.');
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F8FBFF] relative overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1.5 bg-blue-500 z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div 
          animate={{ 
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[800px] h-[800px] bg-blue-100/50 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            x: [0, -40, 0],
            y: [0, 60, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 -right-40 w-[600px] h-[600px] bg-blue-200/30 rounded-full blur-[100px]" 
        />
      </div>

      <div className="container max-w-6xl mx-auto px-4 py-16 md:py-24 relative z-10">
        {/* Hero Section */}
        <header className="text-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-sm font-bold mb-6"
            >
              <Lock className="w-3.5 h-3.5" />
              Sistem Keamanan Terjamin
            </motion.div>
            
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-blue-950 mb-6 leading-[1.1]">
              Buat iPhone generator <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-blue-400">anda sekarang Juga</span> 🤗
            </h1>
            
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-lg md:text-xl text-blue-900/60 max-w-2xl mx-auto font-medium"
            >
              Ciptakan tampilan chat iPhone yang bersih, modern, dan profesional hanya dalam hitungan detik. Tanpa ribet, tanpa biaya.
            </motion.p>
          </motion.div>
        </header>

        {/* Generator & Preview Area */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <GeneratorCard onGenerate={handleGenerate} isLoading={isLoading} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <PreviewCard imageUrl={imageUrl} isLoading={isLoading} />
          </motion.div>
        </div>

        {/* Features with Staggered Scroll Animation */}
        <section className="mt-40">
          <motion.div 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-center mb-16"
          >
            <h2 className="text-3xl font-black text-blue-950 mb-4">Kenapa Memilih Kami?</h2>
            <p className="text-blue-900/50 font-medium">Fitur premium yang kami berikan secara gratis untuk Anda.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Shield className="w-6 h-6" />, title: "Aman & Privat", desc: "Data pesan Anda tidak pernah kami simpan di server." },
              { icon: <Zap className="w-6 h-6" />, title: "Sangat Cepat", desc: "Proses rendering secepat kilat dengan teknologi terbaru." },
              { icon: <Sparkles className="w-6 h-6" />, title: "HD Quality", desc: "Hasil gambar tajam dengan resolusi asli iPhone." },
              { icon: <Globe className="w-6 h-6" />, title: "Tanpa Instalasi", desc: "Langsung gunakan dari browser perangkat mana saja." }
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: i * 0.1, duration: 0.6, type: 'spring' }}
                className="group relative p-8 bg-white rounded-[32px] border border-blue-50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-500"
              >
                <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500 transform group-hover:rotate-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-blue-950 mb-3">{feature.title}</h3>
                <p className="text-blue-900/50 text-sm font-medium leading-relaxed">{feature.desc}</p>
                <div className="mt-6 flex items-center text-blue-500 text-xs font-bold gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Pelajari Lebih Lanjut <ArrowRight className="w-3 h-3" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-40 text-center pb-12 border-t border-blue-100 pt-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-center gap-4 text-blue-900/20">
              <div className="h-px w-12 bg-current" />
              <div className="w-2 h-2 rounded-full bg-current" />
              <div className="h-px w-12 bg-current" />
            </div>
            
            <p className="text-blue-900/50 text-base font-bold tracking-tight">
              by Gobel Devoloper
            </p>
            
            <p className="text-blue-900/30 text-xs font-medium">
              &copy; {new Date().getFullYear()} IQC Generator &bull; All Rights Reserved
            </p>
          </motion.div>
        </footer>
      </div>
      
      <Toaster position="bottom-right" richColors closeButton />
    </main>
  );
}
