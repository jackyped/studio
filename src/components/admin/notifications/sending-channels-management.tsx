"use client";

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from '@/components/ui/badge';
import { Search, MoreHorizontal, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

type ChannelType = 'Email' | 'SMS' | 'Push Notification';
type ChannelStatus = 'Active' | 'Inactive' | 'Error';

type Channel = {
  id: string;
  name: string;
  type: ChannelType;
  provider: string;
  status: ChannelStatus;
  config: Record<string, string>;
  createdAt: string;
};

const mockChannels: Channel[] = [
  { id: 'CHN001', name: 'Transactional Email', type: 'Email', provider: 'SendGrid', status: 'Active', config: { apiKey: 'SG.xxx.yyy' }, createdAt: '2024-01-20' },
  { id: 'CHN002', name: 'SMS Alerts', type: 'SMS', provider: 'Twilio', status: 'Active', config: { accountSid: 'ACxxx', authToken: 'auth.yyy' }, createdAt: '2024-02-10' },
  { id: 'CHN003', name: 'Customer Push Notifications', type: 'Push Notification', provider: 'Firebase Cloud Messaging', status: 'Inactive', config: { serverKey: 'AIzaSy...' }, createdAt: '2024-03-01' },
  { id: 'CHN004', name: 'Marketing Email', type: 'Email', provider: 'Mailchimp', status: 'Error', config: { apiKey: 'mc.xxx-us19' }, createdAt: '2024-03-12' },
];

export function SendingChannelsManagement() {
  const [channels, setChannels] = useState(mockChannels);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentChannel, setCurrentChannel] = useState<Partial<Channel> | null>(null);
  const { toast } = useToast();

  const filteredChannels = useMemo(() => {
    return channels.filter(channel =>
      channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      channel.provider.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, channels]);

  const handleOpenForm = (channel?: Channel) => {
    setCurrentChannel(channel ? { ...channel, config: JSON.stringify(channel.config, null, 2) } : {});
    setIsFormOpen(true);
  };
  
  const handleSaveChannel = () => {
    try {
      const configObject = currentChannel?.config ? JSON.parse(currentChannel.config as any) : {};
      
      if (currentChannel?.id) {
          setChannels(channels.map(c => c.id === currentChannel.id ? { ...c, ...currentChannel, config: configObject } as Channel : c));
          toast({ title: "Channel Updated", description: `Channel "${currentChannel.name}" has been updated.` });
      } else {
          const newChannel: Channel = {
              id: `CHN${String(channels.length + 1).padStart(3, '0')}`,
              name: currentChannel?.name || 'Untitled Channel',
              type: currentChannel?.type || 'Email',
              provider: currentChannel?.provider || '',
              status: 'Inactive',
              config: configObject,
              createdAt: new Date().toISOString().split('T')[0],
          };
          setChannels([newChannel, ...channels]);
          toast({ title: "Channel Created", description: `Channel "${newChannel.name}" has been created.` });
      }
      setIsFormOpen(false);
      setCurrentChannel(null);
    } catch(e) {
        toast({
            variant: 'destructive',
            title: 'Invalid Configuration',
            description: 'The configuration details must be a valid JSON object.',
        });
    }
  };
  
  const handleDeleteChannel = (channelId: string) => {
    setChannels(channels.filter(c => c.id !== channelId));
    toast({ variant: "destructive", title: "Channel Deleted", description: "The sending channel has been permanently deleted." });
  };
  
  const getStatusBadgeVariant = (status: ChannelStatus) => {
    switch (status) {
      case 'Active': return 'default';
      case 'Inactive': return 'secondary';
      case 'Error': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or provider..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button onClick={() => handleOpenForm()}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Channel
        </Button>
      </div>
      <div className="rounded-lg border mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredChannels.map(channel => (
              <TableRow key={channel.id}>
                <TableCell className="font-medium">
                    {channel.name}
                </TableCell>
                <TableCell><Badge variant="outline">{channel.type}</Badge></TableCell>
                <TableCell>{channel.provider}</TableCell>
                <TableCell><Badge variant={getStatusBadgeVariant(channel.status)}>{channel.status}</Badge></TableCell>
                <TableCell className="text-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => handleOpenForm(channel)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Test Channel</DropdownMenuItem>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">Delete</DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                                <AlertDialogDescription>This action cannot be undone. This will permanently delete this channel.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteChannel(channel.id)}>Delete</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{currentChannel?.id ? 'Edit Channel' : 'Create New Channel'}</DialogTitle>
            <DialogDescription>
                Configure a new channel for sending notifications. Configuration details should be in JSON format.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[60vh] overflow-y-auto pr-4">
            <div className="space-y-2">
              <Label htmlFor="name">Channel Name</Label>
              <Input id="name" placeholder="e.g. Transactional Email" value={currentChannel?.name || ''} onChange={(e) => setCurrentChannel({...currentChannel, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                <Label htmlFor="type">Channel Type</Label>
                <Select value={currentChannel?.type} onValueChange={(value: ChannelType) => setCurrentChannel({...currentChannel, type: value})}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="SMS">SMS</SelectItem>
                        <SelectItem value="Push Notification">Push Notification</SelectItem>
                    </SelectContent>
                </Select>
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="provider">Provider</Label>
                    <Input id="provider" placeholder="e.g. SendGrid" value={currentChannel?.provider || ''} onChange={(e) => setCurrentChannel({...currentChannel, provider: e.target.value})} />
                </div>
            </div>
             <div className="space-y-2">
              <Label htmlFor="config">Configuration (JSON)</Label>
              <Textarea id="config" rows={8} placeholder={`{\n  "apiKey": "YOUR_API_KEY"\n}`} value={currentChannel?.config as string || ''} onChange={(e) => setCurrentChannel({...currentChannel, config: e.target.value})} />
            </div>
            {currentChannel?.id && (
                <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select value={currentChannel?.status} onValueChange={(value: ChannelStatus) => setCurrentChannel({...currentChannel, status: value})}>
                        <SelectTrigger><SelectValue placeholder="Select a status" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Active">Active</SelectItem>
                            <SelectItem value="Inactive">Inactive</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            )}
          </div>
          <DialogFooter>
            <DialogClose asChild><Button variant="outline">Cancel</Button></DialogClose>
            <Button onClick={handleSaveChannel}>Save Channel</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
