"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Send, Clock, Users, RadioTower } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';

// Mock data - in a real app, this would come from your API
const mockNotifications = [
  { id: 'NTF002', title: 'New Feature: Faster Checkout', content: 'We have launched a new feature that will make your checkout process faster and smoother. Check it out now!', audience: 'Customers', status: 'Draft' },
  { id: 'NTF003', title: 'Holiday Delivery Schedule', content: 'Please be aware of the updated delivery schedule for the upcoming holiday season to avoid delays.', audience: 'Drivers', status: 'Draft' },
];

const mockUsers = {
    'Customers': [{ id: 'USR001', name: 'Alice Johnson', email: 'alice@example.com' }, { id: 'USR005', name: 'Charlie Brown', email: 'charlie@example.com' }],
    'Drivers': [{ id: 'DRV001', name: 'John Doe', email: 'john.d@driver.com'}, { id: 'DRV002', name: 'Jane Smith', email: 'jane.s@driver.com'}],
    'Pharmacies': [{ id: 'PHM001', name: 'GoodHealth Pharmacy', email: 'contact@goodhealth.com' }, { id: 'PHM003', name: 'The Corner Drugstore', email: 'support@cornerdrug.com' }],
};

const mockChannels = [
    { id: 'CHN001', name: 'Transactional Email', type: 'Email' },
    { id: 'CHN002', name: 'SMS Alerts', type: 'SMS' },
    { id: 'CHN003', name: 'Customer Push Notifications', type: 'Push Notification' },
];

export function NotificationPublishing() {
  const [step, setStep] = useState(1);
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [selectedAudience, setSelectedAudience] = useState<Record<string, string[]>>({ Customers: [], Drivers: [], Pharmacies: [] });
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [sendTime, setSendTime] = useState('now');
  const [scheduledTime, setScheduledTime] = useState('');
  const { toast } = useToast();

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const handleSelectNotification = (notificationId: string) => {
    const notification = mockNotifications.find(n => n.id === notificationId);
    setSelectedNotification(notification);
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

  const handleChannelSelect = (id: string) => {
    setSelectedChannels(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
  };
  
  const totalSelectedUsers = Object.values(selectedAudience).reduce((acc, curr) => acc + curr.length, 0);

  const handleSubmit = () => {
    toast({
        title: "Notification Sent!",
        description: `"${selectedNotification.title}" has been scheduled for delivery.`,
    });
    // Reset state
    setStep(1);
    setSelectedNotification(null);
    setSelectedAudience({ Customers: [], Drivers: [], Pharmacies: [] });
    setSelectedChannels([]);
    setSendTime('now');
    setScheduledTime('');
  };

  const steps = [
    { number: 1, title: 'Select Notification', icon: Send },
    { number: 2, title: 'Select Audience', icon: Users },
    { number: 3, title: 'Select Channels', icon: RadioTower },
    { number: 4, title: 'Schedule & Confirm', icon: Clock },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Publish a Notification</CardTitle>
          <CardDescription>Follow the steps to send a notification to your users.</CardDescription>
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
                <h3 className="font-semibold text-lg">Step 1: Select a notification to send</h3>
                <Select onValueChange={handleSelectNotification}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a notification..." />
                  </SelectTrigger>
                  <SelectContent>
                    {mockNotifications.map(n => <SelectItem key={n.id} value={n.id}>{n.title} ({n.audience})</SelectItem>)}
                  </SelectContent>
                </Select>
                {selectedNotification && (
                  <div className="border rounded-lg p-4 bg-muted/50 space-y-2">
                    <h4 className="font-bold">Preview: {selectedNotification.title}</h4>
                    <p className="text-sm">{selectedNotification.content}</p>
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
                <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Step 3: Select sending channels</h3>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {mockChannels.map(channel => (
                            <Card key={channel.id} className={`cursor-pointer transition-all ${selectedChannels.includes(channel.id) ? 'border-primary ring-2 ring-primary' : 'hover:border-primary/50'}`} onClick={() => handleChannelSelect(channel.id)}>
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg">{channel.name}</CardTitle>
                                     <Checkbox checked={selectedChannels.includes(channel.id)} className="h-5 w-5" />
                                </CardHeader>
                                <CardContent>
                                    <p className="text-muted-foreground">{channel.type}</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            )}
            
            {step === 4 && (
                <div className="space-y-6">
                    <h3 className="font-semibold text-lg">Step 4: Confirm and schedule</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
                            <CardContent className="space-y-2">
                                <p><strong>Notification:</strong> {selectedNotification.title}</p>
                                <p><strong>Audience:</strong> {totalSelectedUsers} user(s)</p>
                                <p><strong>Channels:</strong> {selectedChannels.map(id => mockChannels.find(c => c.id === id)?.name).join(', ')}</p>
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
            {step < 4 ? (
              <Button onClick={nextStep} disabled={(step === 1 && !selectedNotification) || (step === 2 && totalSelectedUsers === 0) || (step === 3 && selectedChannels.length === 0)}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                       <Button>
                          <Send className="mr-2 h-4 w-4" />
                          Confirm & Send
                       </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Ready to Send?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will queue the notification for delivery to {totalSelectedUsers} user(s). Are you sure you want to proceed?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleSubmit}>Yes, Send Notification</AlertDialogAction>
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
