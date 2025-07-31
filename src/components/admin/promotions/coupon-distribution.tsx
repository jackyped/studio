"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Ticket, Clock, Users, Gift } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

// Mock data - in a real app, this would come from your API
const mockCoupons = [
  { id: 'PROMO001', name: '10% Off Welcome Offer', code: 'WELCOME10', type: 'Percentage', value: 10, status: 'Active' },
  { id: 'PROMO002', name: '$5 Off $50', code: 'SAVE5', type: 'Fixed Amount', value: 5, status: 'Active' },
  { id: 'PROMO004', name: 'Spring Sale 15% Off', code: 'SPRING15', type: 'Percentage', value: 15, status: 'Scheduled' },
];

const mockUsers = {
    'Customers': [{ id: 'USR001', name: 'Alice Johnson', email: 'alice@example.com' }, { id: 'USR005', name: 'Charlie Brown', email: 'charlie@example.com' }],
    'Drivers': [{ id: 'DRV001', name: 'John Doe', email: 'john.d@driver.com'}, { id: 'DRV002', name: 'Jane Smith', email: 'jane.s@driver.com'}],
    'Pharmacies': [{ id: 'PHM001', name: 'GoodHealth Pharmacy', email: 'contact@goodhealth.com' }, { id: 'PHM003', name: 'The Corner Drugstore', email: 'support@cornerdrug.com' }],
};


export function CouponDistribution() {
  const [step, setStep] = useState(1);
  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);
  const [selectedAudience, setSelectedAudience] = useState<Record<string, string[]>>({ Customers: [], Drivers: [], Pharmacies: [] });
  const [sendTime, setSendTime] = useState('now');
  const [scheduledTime, setScheduledTime] = useState('');
  const { toast } = useToast();

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSelectCoupon = (couponId: string) => {
    const coupon = mockCoupons.find(n => n.id === couponId);
    setSelectedCoupon(coupon);
  };
  
  const handleAudienceSelect = (type: string, id: string) => {
    setSelectedAudience(prev => {
      const currentSelection = prev[type] || [];
      const newSelection = currentSelection.includes(id)
        ? currentSelection.filter(item => item !== id)
        : [...currentSelection, id];
      return { ...prev, [type]: newSelection };
    });
  };

  const totalSelectedUsers = Object.values(selectedAudience).reduce((acc, curr) => acc + curr.length, 0);

  const handleSubmit = () => {
    toast({
        title: "Coupons Distributed!",
        description: `Coupon "${selectedCoupon.name}" has been scheduled for distribution.`,
    });
    // Reset state
    setStep(1);
    setSelectedCoupon(null);
    setSelectedAudience({ Customers: [], Drivers: [], Pharmacies: [] });
    setSendTime('now');
    setScheduledTime('');
  };

  const steps = [
    { number: 1, title: 'Select Coupon', icon: Ticket },
    { number: 2, title: 'Select Audience', icon: Users },
    { number: 3, title: 'Schedule & Confirm', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Distribute a Coupon</CardTitle>
          <CardDescription>Follow the steps to send a coupon to your users.</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Progress Bar */}
          <div className="mb-8 flex justify-between items-center">
            {steps.map((s, index) => (
              <div key={s.number} className="flex-1 flex items-center">
                <div className={`flex items-center gap-3 ${step >= s.number ? 'text-primary' : 'text-muted-foreground'}`}>
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center border-2 ${step >= s.number ? 'border-primary bg-primary/10' : 'border-border'}`}>
                        <s.icon className="h-5 w-5"/>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Step {s.number}</p>
                        <p className="font-semibold">{s.title}</p>
                    </div>
                </div>
                 {index < steps.length - 1 && <div className={`flex-1 h-0.5 mx-4 ${step > s.number ? 'bg-primary' : 'bg-border'}`} />}
              </div>
            ))}
          </div>

          {/* Step Content */}
          <div>
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Step 1: Select a coupon to distribute</h3>
                <Select onValueChange={handleSelectCoupon}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a coupon..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockCoupons.map(c => <SelectItem key={c.id} value={c.id} disabled={c.status !== 'Active'}>{c.name} ({c.code}) {c.status !== 'Active' && ` - ${c.status}`}</SelectItem>)}
                  </SelectContent>
                </Select>
                {selectedCoupon && (
                  <div className="border rounded-lg p-4 bg-muted/50 space-y-2">
                    <h4 className="font-bold">Details: {selectedCoupon.name}</h4>
                    <p className="text-sm">
                        <Badge variant="outline">{selectedCoupon.type}</Badge>
                        <span className="ml-2">{selectedCoupon.type === 'Percentage' ? `${selectedCoupon.value}% off` : `$${selectedCoupon.value} off`}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">Code: {selectedCoupon.code}</p>
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Step 2: Select the audience</h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.keys(mockUsers).map(type => (
                        <Card key={type}>
                            <CardHeader><CardTitle>{type} ({selectedAudience[type].length} selected)</CardTitle></CardHeader>
                            <CardContent className="max-h-60 overflow-y-auto">
                                {mockUsers[type as keyof typeof mockUsers].map(user => (
                                    <div key={user.id} className="flex items-center space-x-2 py-2">
                                        <Checkbox 
                                            id={`${type}-${user.id}`} 
                                            onCheckedChange={() => handleAudienceSelect(type, user.id)}
                                            checked={selectedAudience[type].includes(user.id)}
                                        />
                                        <Label htmlFor={`${type}-${user.id}`} className="font-normal w-full">
                                            <div>{user.name}</div>
                                            <div className="text-xs text-muted-foreground">{user.email}</div>
                                        </Label>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    ))}
                </div>
              </div>
            )}
            
            {step === 3 && (
                <div className="space-y-6">
                    <h3 className="font-semibold text-lg">Step 3: Confirm and schedule</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                <p><strong>Coupon:</strong> {selectedCoupon.name}</p>
                                <p><strong>Audience:</strong> {totalSelectedUsers} user(s)</p>
                            </CardContent>
                        </Card>
                         <Card>
                            <CardHeader><CardTitle>Scheduling</CardTitle></CardHeader>
                            <CardContent>
                                <RadioGroup defaultValue="now" value={sendTime} onValueChange={setSendTime}>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="now" id="now" />
                                        <Label htmlFor="now">Send Immediately</Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <RadioGroupItem value="later" id="later" />
                                        <Label htmlFor="later">Schedule for Later</Label>
                                    </div>
                                </RadioGroup>
                                {sendTime === 'later' && (
                                    <Input 
                                        type="datetime-local" 
                                        className="mt-4" 
                                        value={scheduledTime}
                                        onChange={(e) => setScheduledTime(e.target.value)}
                                    />
                                )}
                            </CardContent>
                        </Card>
                     </div>
                </div>
            )}
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            {step > 1 ? (
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
            ) : <div />}
            {step < 3 ? (
              <Button onClick={nextStep} disabled={(step === 1 && !selectedCoupon) || (step === 2 && totalSelectedUsers === 0)}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button>
                          <Gift className="mr-2 h-4 w-4" />
                          Confirm & Distribute
                       </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Ready to Distribute?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will send the coupon to {totalSelectedUsers} user(s). Are you sure you want to proceed?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleSubmit}>Yes, Send Coupon</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
