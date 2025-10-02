import React, { useMemo, useRef, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, PillIcon, AlertTriangle, Languages, Mic, Volume2 } from 'lucide-react';
import { TreatmentRecord, COMMON_DRUGS, SPECIES_OPTIONS } from '@/types';
import { toast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';

interface AddTreatmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTreatmentAdded: (treatment: TreatmentRecord) => void;
}

const AddTreatmentDialog: React.FC<AddTreatmentDialogProps> = ({
  open,
  onOpenChange,
  onTreatmentAdded,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [formData, setFormData] = useState({
    animalTagId: '',
    species: '',
    drugId: '',
    dosage: '',
    frequency: '',
    duration: '',
    purpose: '',
  });

  const [selectedDrug, setSelectedDrug] = useState<typeof COMMON_DRUGS[0] | null>(null);

  const recognitionRef = useRef<any>(null);

  const speechLang = useMemo(() => (language === 'te' ? 'te-IN' : 'en-IN'), [language]);

  const speakText = (text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      toast({ title: 'Voice not supported', description: 'Your browser does not support speech', variant: 'destructive' });
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = speechLang;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const startDictation = () => {
    const SpeechRecognition: any = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    if (!SpeechRecognition) {
      toast({ title: 'Voice not supported', description: 'Speech recognition is not available', variant: 'destructive' });
      return;
    }
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = speechLang;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript as string;
      setFormData(prev => ({ ...prev, purpose: prev.purpose ? prev.purpose + ' ' + transcript : transcript }));
    };
    recognition.onerror = () => {
      toast({ title: 'Voice error', description: 'Could not capture speech, try again', variant: 'destructive' });
    };
    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.animalTagId || !formData.species || !formData.drugId || !formData.dosage) {
      toast({
        title: 'Missing Information',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + parseInt(formData.duration));

    const drug = COMMON_DRUGS.find(d => d.id === formData.drugId);
    if (!drug) return;

    const withdrawalDays = drug.withdrawalPeriods[formData.species as keyof typeof drug.withdrawalPeriods]?.meat || 14;
    const withdrawalEndDate = new Date(endDate);
    withdrawalEndDate.setDate(withdrawalEndDate.getDate() + withdrawalDays);

    const newTreatment: TreatmentRecord = {
      id: Date.now().toString(),
      farmId: 'FARM001',
      animalId: formData.animalTagId,
      drugId: formData.drugId,
      dosage: parseFloat(formData.dosage),
      frequency: parseInt(formData.frequency),
      duration: parseInt(formData.duration),
      purpose: formData.purpose,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      withdrawalEndDate: withdrawalEndDate.toISOString().split('T')[0],
      status: 'active',
      complianceStatus: 'pending',
      veterinarianApproved: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onTreatmentAdded(newTreatment);

    // Reset form
    setFormData({
      animalTagId: '',
      species: '',
      drugId: '',
      dosage: '',
      frequency: '',
      duration: '',
      purpose: '',
    });
    setSelectedDrug(null);

    toast({
      title: 'Treatment Added',
      description: 'Treatment record has been created successfully',
    });
  };

  const handleDrugSelect = (drugId: string) => {
    const drug = COMMON_DRUGS.find(d => d.id === drugId);
    setSelectedDrug(drug || null);
    setFormData(prev => ({ ...prev, drugId }));
  };

  const getWithdrawalInfo = () => {
    if (!selectedDrug || !formData.species) return null;

    const species = formData.species as keyof typeof selectedDrug.withdrawalPeriods;
    const withdrawalPeriods = selectedDrug.withdrawalPeriods[species];
    
    if (!withdrawalPeriods) return null;

    return withdrawalPeriods;
  };

  const withdrawalInfo = getWithdrawalInfo();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <PillIcon className="h-5 w-5 mr-2" />
            {t('treatment.add')}
          </DialogTitle>
          <DialogDescription>
            {t('app.description')}
          </DialogDescription>
          <div className="flex items-center gap-2 mt-2">
            <Languages className="h-4 w-4" />
            <Select value={language} onValueChange={(val: any) => setLanguage(val)}>
              <SelectTrigger className="w-36 h-8">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="te">తెలుగు</SelectItem>
              </SelectContent>
            </Select>
            <Button type="button" variant="ghost" size="sm" onClick={() => speakText(t('treatment.add'))}>
              <Volume2 className="h-4 w-4 mr-1" />
              {t('dashboard.quickActions')}
            </Button>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Animal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="animalTagId">Animal Tag ID / पशु टैग आईडी *</Label>
              <Input
                id="animalTagId"
                placeholder="e.g., COW001, BUF025"
                value={formData.animalTagId}
                onChange={(e) => setFormData(prev => ({ ...prev, animalTagId: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="species">Animal Species / पशु प्रजाति *</Label>
              <Select
                value={formData.species}
                onValueChange={(value) => setFormData(prev => ({ ...prev, species: value }))}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select species" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIES_OPTIONS.map((species) => (
                    <SelectItem key={species.value} value={species.value}>
                      <span className="mr-2">{species.icon}</span>
                      {species.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Drug Selection */}
          <div className="space-y-2">
            <Label htmlFor="drug">Antimicrobial Drug / दवा *</Label>
            <Select
              value={formData.drugId}
              onValueChange={handleDrugSelect}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select antimicrobial drug" />
              </SelectTrigger>
              <SelectContent>
                {COMMON_DRUGS.map((drug) => (
                  <SelectItem key={drug.id} value={drug.id}>
                    <div>
                      <p className="font-medium">{drug.name}</p>
                      <p className="text-xs text-muted-foreground">{drug.activeIngredient}</p>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Dosage Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dosage">Dosage (mg/kg) / खुराक *</Label>
              <Input
                id="dosage"
                type="number"
                step="0.1"
                placeholder="e.g., 10.5"
                value={formData.dosage}
                onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency">Frequency (per day) / आवृत्ति</Label>
              <Select
                value={formData.frequency}
                onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Times per day" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Once daily</SelectItem>
                  <SelectItem value="2">Twice daily</SelectItem>
                  <SelectItem value="3">Three times daily</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (days) / अवधि</Label>
              <Input
                id="duration"
                type="number"
                placeholder="e.g., 7"
                value={formData.duration}
                onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
              />
            </div>
          </div>

          {/* Purpose */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="purpose">{t('treatment.purpose')}</Label>
              <Button type="button" variant="outline" size="sm" onClick={startDictation}>
                <Mic className="h-4 w-4 mr-2" />
                Voice
              </Button>
            </div>
            <Textarea
              id="purpose"
              placeholder="e.g., Mastitis treatment, Respiratory infection"
              value={formData.purpose}
              onChange={(e) => setFormData(prev => ({ ...prev, purpose: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Withdrawal Period Information */}
          {withdrawalInfo && (
            <Card className="border-warning">
              <CardContent className="pt-4">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-medium text-warning">Withdrawal Period / निकासी अवधि</h4>
                    <div className="mt-2 space-y-1">
                       {'milk' in withdrawalInfo && (
                         <div className="flex justify-between">
                           <span>Milk / दूध:</span>
                           <Badge variant="outline">{(withdrawalInfo as any).milk} days</Badge>
                         </div>
                       )}
                       {'meat' in withdrawalInfo && (
                         <div className="flex justify-between">
                           <span>Meat / मांस:</span>
                           <Badge variant="outline">{(withdrawalInfo as any).meat} days</Badge>
                         </div>
                       )}
                       {'egg' in withdrawalInfo && (
                         <div className="flex justify-between">
                           <span>Eggs / अंडे:</span>
                           <Badge variant="outline">{(withdrawalInfo as any).egg} days</Badge>
                         </div>
                       )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Products cannot be sold during withdrawal period
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Form Actions */}
          <div className="flex space-x-2 pt-4">
            <Button type="submit" className="flex-1">
              <CalendarIcon className="h-4 w-4 mr-2" />
              {t('treatment.save')}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t('treatment.cancel')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTreatmentDialog;