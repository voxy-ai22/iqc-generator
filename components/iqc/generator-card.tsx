'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, Zap, Clock, Send } from 'lucide-react';

interface GeneratorCardProps {
  onGenerate: (data: GeneratorData) => void;
  isLoading: boolean;
}

export interface GeneratorData {
  text: string;
  provider: string;
  jam: string;
  baterai: number;
}

export function GeneratorCard({ onGenerate, isLoading }: GeneratorCardProps) {
  const [formData, setFormData] = useState<GeneratorData>({
    text: '',
    provider: '5G',
    jam: new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
    baterai: 80,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.text.trim()) return;
    onGenerate(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    >
      <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-xl rounded-[24px] overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            IQC Generator
          </CardTitle>
          <p className="text-muted-foreground text-sm">Create beautiful iPhone Quote Chats</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="text" className="text-sm font-medium flex items-center gap-2">
                <Send className="w-4 h-4 text-blue-500" />
                Pesan Chat
              </Label>
              <Textarea
                id="text"
                placeholder="Tulis pesan Anda di sini..."
                className="min-h-[120px] rounded-xl border-blue-100 focus:border-blue-400 focus:ring-blue-100 transition-all resize-none text-base"
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="jam" className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  Waktu
                </Label>
                <Input
                  id="jam"
                  type="time"
                  className="rounded-xl border-blue-100 focus:border-blue-400 transition-all"
                  value={formData.jam}
                  onChange={(e) => setFormData({ ...formData, jam: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider" className="text-sm font-medium flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-blue-500" />
                  Provider
                </Label>
                <Select
                  value={formData.provider}
                  onValueChange={(val) => setFormData({ ...formData, provider: val })}
                >
                  <SelectTrigger className="rounded-xl border-blue-100 focus:border-blue-400">
                    <SelectValue placeholder="Pilih Provider" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl border-blue-100">
                    {['Telkomsel', 'XL', 'Indosat', 'Smartfren', '5G', 'LTE'].map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="baterai" className="text-sm font-medium flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  Baterai
                </Label>
                <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                  {formData.baterai}%
                </span>
              </div>
              <Slider
                id="baterai"
                min={0}
                max={100}
                step={1}
                value={[formData.baterai]}
                onValueChange={(val) => setFormData({ ...formData, baterai: val[0] })}
                className="py-4"
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading || !formData.text.trim()}
              className="w-full h-12 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Generating...
                </div>
              ) : (
                'Generate IQC'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
