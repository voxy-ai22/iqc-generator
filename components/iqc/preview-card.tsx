'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, Share2, RefreshCw, Smartphone, AlertCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface PreviewCardProps {
  imageUrl: string | null;
  isLoading: boolean;
}

export function PreviewCard({ imageUrl, isLoading }: PreviewCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (imageUrl) {
      setImageLoaded(false);
    }
  }, [imageUrl]);

  const handleDownload = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `iqc-iphone-generator-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      toast.success('Gambar berhasil disimpan ke perangkat!');
    } catch (error) {
      toast.error('Gagal mengunduh gambar. Coba simpan manual (tahan gambar).');
    }
  };

  const handleShare = async () => {
    if (!imageUrl) return;
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const file = new File([blob], 'iqc-chat.png', { type: 'image/png' });

      if (navigator.share && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'IQC iPhone Generator',
          text: 'Lihat tampilan chat iPhone yang saya buat!',
        });
      } else {
        // Fallback: If sharing files is not supported, just open image in new tab
        // Note: We removed "Copy Link" for security reasons as requested.
        toast.info('Perangkat Anda tidak mendukung fitur share file langsung. Silakan download terlebih dahulu.');
      }
    } catch (error) {
      toast.error('Gagal memproses fitur berbagi.');
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full aspect-[4/5] bg-white rounded-[40px] shadow-2xl flex items-center justify-center border-8 border-blue-50/30"
          >
            <div className="flex flex-col items-center gap-6">
              <div className="relative">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 2.5, ease: "linear" }}
                  className="w-16 h-16 border-4 border-blue-100 border-t-blue-500 rounded-full"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                   <Smartphone className="w-6 h-6 text-blue-500 animate-pulse" />
                </div>
              </div>
              <p className="text-blue-600 font-bold tracking-tight">Memproses Image...</p>
            </div>
          </motion.div>
        ) : imageUrl ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          >
            <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] bg-white rounded-[40px] overflow-hidden group">
              <CardContent className="p-0 relative">
                {!imageLoaded && (
                   <div className="absolute inset-0 bg-blue-50 animate-pulse flex items-center justify-center">
                      <RefreshCw className="w-10 h-10 text-blue-200 animate-spin" />
                   </div>
                )}
                <img
                  src={imageUrl}
                  alt="IQC Preview"
                  className={`w-full h-auto transition-all duration-700 ease-out ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-110'}`}
                  onLoad={() => setImageLoaded(true)}
                />
                
                {imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                )}
              </CardContent>
            </Card>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="grid grid-cols-2 gap-5 mt-8"
            >
              <Button
                onClick={handleDownload}
                disabled={!imageLoaded}
                className="h-16 rounded-[20px] bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-200/50 flex items-center justify-center gap-3 font-black text-lg transition-all active:scale-95 disabled:opacity-50"
              >
                <Download className="w-5 h-5" />
                Download
              </Button>
              <Button
                onClick={handleShare}
                disabled={!imageLoaded}
                variant="outline"
                className="h-16 rounded-[20px] border-2 border-blue-50 text-blue-900 hover:bg-blue-50 flex items-center justify-center gap-3 font-black text-lg transition-all active:scale-95 disabled:opacity-50"
              >
                <Share2 className="w-5 h-5" />
                Share
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="mt-6 flex items-start gap-2 p-4 bg-blue-50/50 rounded-2xl border border-blue-100/50"
            >
              <AlertCircle className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
              <p className="text-[10px] leading-tight text-blue-900/40 font-medium">
                Tip Keamanan: Jangan bagikan link generate langsung untuk menjaga privasi data key Anda. Gunakan fitur Download atau Share di atas.
              </p>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full aspect-[4/5] bg-white rounded-[40px] border-4 border-dashed border-blue-100 flex flex-col items-center justify-center p-12 text-center group transition-colors hover:border-blue-200"
          >
            <div className="space-y-6">
              <div className="w-24 h-24 bg-blue-50 rounded-[32px] flex items-center justify-center mx-auto transform transition-transform group-hover:rotate-12 group-hover:scale-110 duration-500">
                <Smartphone className="w-12 h-12 text-blue-400" />
              </div>
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-blue-950">Pratinjau Kosong</h3>
                <p className="text-blue-900/40 text-sm max-w-[240px] font-medium leading-relaxed mx-auto">
                  Silakan masukkan pesan di formulir samping dan klik tombol generate.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
