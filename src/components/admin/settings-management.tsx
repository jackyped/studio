"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Globe, Percent, Scale } from 'lucide-react';

// Mock data for initial settings
const initialSettings = {
  general: {
    platformName: 'MediChain',
    supportEmail: 'support@medichain.com',
    currency: 'USD',
  },
  financial: {
    pharmacyCommissionRate: 10,
    driverCommissionRate: 5,
    paymentGateway: 'Stripe',
  },
  legal: {
    termsOfService: 'Welcome to MediChain. By using our services, you agree to these terms...',
    privacyPolicy: 'Your privacy is important to us. This policy explains what information we collect...',
  },
};

export function SettingsManagement() {
  const [settings, setSettings] = useState(initialSettings);
  const { toast } = useToast();

  const handleInputChange = (tab: keyof typeof settings, key: string, value: string | number) => {
    setSettings(prev => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        [key]: value,
      },
    }));
  };

  const handleSave = () => {
    // In a real app, you would send this to your API
    console.log('Saving settings:', settings);
    toast({
      title: 'Settings Saved',
      description: 'Your changes have been saved successfully.',
    });
  };

  return (
    <Tabs defaultValue="general" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="general">
            <Globe className="mr-2 h-4 w-4" />
            General
        </TabsTrigger>
        <TabsTrigger value="financial">
            <Percent className="mr-2 h-4 w-4" />
            Financial
        </TabsTrigger>
        <TabsTrigger value="legal">
            <Scale className="mr-2 h-4 w-4" />
            Legal
        </TabsTrigger>
      </TabsList>
      <div className="mt-6">
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>
                Manage basic platform information and settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="platformName">Platform Name</Label>
                <Input
                  id="platformName"
                  value={settings.general.platformName}
                  onChange={e => handleInputChange('general', 'platformName', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.general.supportEmail}
                  onChange={e => handleInputChange('general', 'supportEmail', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input
                  id="currency"
                  value={settings.general.currency}
                  onChange={e => handleInputChange('general', 'currency', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="financial">
          <Card>
            <CardHeader>
              <CardTitle>Financial Settings</CardTitle>
              <CardDescription>
                Configure commission rates and payment settings.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pharmacyCommission">Pharmacy Commission Rate (%)</Label>
                <Input
                  id="pharmacyCommission"
                  type="number"
                  value={settings.financial.pharmacyCommissionRate}
                  onChange={e => handleInputChange('financial', 'pharmacyCommissionRate', parseFloat(e.target.value))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="driverCommission">Driver Commission Rate (%)</Label>
                <Input
                  id="driverCommission"
                  type="number"
                  value={settings.financial.driverCommissionRate}
                  onChange={e => handleInputChange('financial', 'driverCommissionRate', parseFloat(e.target.value))}
                />
              </div>
               <div className="space-y-2">
                <Label htmlFor="paymentGateway">Payment Gateway</Label>
                <Input
                  id="paymentGateway"
                  value={settings.financial.paymentGateway}
                  onChange={e => handleInputChange('financial', 'paymentGateway', e.target.value)}
                  disabled
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="legal">
          <Card>
            <CardHeader>
              <CardTitle>Legal Documents</CardTitle>
              <CardDescription>
                Edit the content for Terms of Service and Privacy Policy.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="termsOfService">Terms of Service</Label>
                <Textarea
                  id="termsOfService"
                  rows={10}
                  value={settings.legal.termsOfService}
                  onChange={e => handleInputChange('legal', 'termsOfService', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="privacyPolicy">Privacy Policy</Label>
                <Textarea
                  id="privacyPolicy"
                  rows={10}
                  value={settings.legal.privacyPolicy}
                  onChange={e => handleInputChange('legal', 'privacyPolicy', e.target.value)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </div>
       <div className="mt-6 flex justify-end">
          <Button onClick={handleSave}>Save All Changes</Button>
        </div>
    </Tabs>
  );
}
