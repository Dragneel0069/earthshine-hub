import { useState } from 'react';
import { ShoppingCart, AlertCircle, Construction } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CreditListing } from './CreditListingCard';

interface PurchaseFlowProps {
  listing: CreditListing;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

export function PurchaseFlow({ listing, isOpen, onClose, onSuccess }: PurchaseFlowProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Purchase Carbon Credits
          </DialogTitle>
          <DialogDescription>
            {listing.projectName}
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <Construction className="h-4 w-4" />
          <AlertTitle>Purchase Flow Upgrade in Progress</AlertTitle>
          <AlertDescription className="mt-2">
            The credit purchase system is being upgraded to support:
            <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
              <li>Organization-level purchases with approval workflows</li>
              <li>Enhanced escrow with multi-signature release</li>
              <li>Automated registry retirement integration</li>
              <li>Immutable transaction ledger for audit compliance</li>
            </ul>
            <p className="mt-3">
              This will be available after Phase 3 & 4 of the backend migration is complete.
            </p>
          </AlertDescription>
        </Alert>
      </DialogContent>
    </Dialog>
  );
}
