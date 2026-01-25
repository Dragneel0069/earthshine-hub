import { useState } from 'react';
import { ShoppingCart, AlertCircle, CheckCircle, Loader2, Building2, FileText, CreditCard, Shield } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { CreditListing } from './CreditListingCard';
import { useOrganization } from '@/hooks/useOrganization';
import { useMarketplaceOrders } from '@/hooks/useMarketplaceOrders';
import { useToast } from '@/hooks/use-toast';

interface PurchaseFlowProps {
  listing: CreditListing;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

type PurchaseStep = 'quantity' | 'beneficiary' | 'review' | 'payment' | 'success';

const GST_RATE = 0.18;
const PLATFORM_FEE_RATE = 0.05;

export function PurchaseFlow({ listing, isOpen, onClose, onSuccess }: PurchaseFlowProps) {
  const { organization, hasOrganization } = useOrganization();
  const { initiateOrder, markOrderPaid } = useMarketplaceOrders();
  const { toast } = useToast();
  
  const [step, setStep] = useState<PurchaseStep>('quantity');
  const [isLoading, setIsLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  // Form state
  const [quantity, setQuantity] = useState(1);
  const [beneficiaryName, setBeneficiaryName] = useState(organization?.name || '');
  const [beneficiaryType, setBeneficiaryType] = useState('organization');
  const [retirementReason, setRetirementReason] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);

  // Calculate pricing
  const subtotal = quantity * listing.pricePerTon;
  const platformFee = Math.round(subtotal * PLATFORM_FEE_RATE);
  const gstAmount = Math.round((subtotal + platformFee) * GST_RATE);
  const totalAmount = subtotal + platformFee + gstAmount;

  const resetForm = () => {
    setStep('quantity');
    setQuantity(1);
    setBeneficiaryName(organization?.name || '');
    setBeneficiaryType('organization');
    setRetirementReason('');
    setAcceptedTerms(false);
    setAcceptedDisclaimer(false);
    setOrderId(null);
    setOrderNumber(null);
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleInitiateOrder = async () => {
    if (!hasOrganization) {
      toast({
        variant: 'destructive',
        title: 'Organization Required',
        description: 'Please complete your organization setup first.',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await initiateOrder({
        catalogId: listing.id,
        quantity,
        beneficiaryName,
        beneficiaryType,
        retirementReason,
      });

      setOrderId(result.order_id);
      setOrderNumber(result.order_number);
      setStep('payment');
    } catch (error) {
      console.error('Order initiation failed:', error);
      toast({
        variant: 'destructive',
        title: 'Order Failed',
        description: error instanceof Error ? error.message : 'Failed to create order',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!orderId) return;

    setIsLoading(true);
    try {
      // Simulate payment reference
      const paymentRef = `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      await markOrderPaid(orderId, paymentRef);
      
      setStep('success');
      onSuccess(orderId);
    } catch (error) {
      console.error('Payment failed:', error);
      toast({
        variant: 'destructive',
        title: 'Payment Failed',
        description: error instanceof Error ? error.message : 'Payment processing failed',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const canProceedToReview = quantity > 0 && quantity <= listing.availableCredits;
  const canProceedToPayment = beneficiaryName.trim() && acceptedTerms && acceptedDisclaimer;

  if (!hasOrganization) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Organization Required
            </DialogTitle>
          </DialogHeader>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Setup Required</AlertTitle>
            <AlertDescription>
              To purchase carbon credits, you need to complete your organization setup first.
              This ensures proper invoicing and retirement certificate generation.
            </AlertDescription>
          </Alert>
          <Button onClick={() => window.location.href = '/dashboard'}>
            Complete Setup
          </Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            {step === 'success' ? 'Order Confirmed' : 'Purchase Carbon Credits'}
          </DialogTitle>
          <DialogDescription>
            {listing.projectName}
          </DialogDescription>
        </DialogHeader>

        {/* Step 1: Quantity Selection */}
        {step === 'quantity' && (
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Price per tCO₂e</span>
                <span className="font-semibold">₹{listing.pricePerTon.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center mt-2">
                <span className="text-sm text-muted-foreground">Available</span>
                <span className="font-semibold">{listing.availableCredits.toLocaleString()} credits</span>
              </div>
            </div>

            <div>
              <Label htmlFor="quantity">Credits to Purchase (tCO₂e)</Label>
              <Input
                id="quantity"
                type="number"
                min={1}
                max={listing.availableCredits}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Math.min(listing.availableCredits, parseInt(e.target.value) || 1)))}
                className="mt-1"
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Platform Fee (5%)</span>
                <span>₹{platformFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>GST (18%)</span>
                <span>₹{gstAmount.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <Button 
              className="w-full" 
              onClick={() => setStep('beneficiary')}
              disabled={!canProceedToReview}
            >
              Continue to Beneficiary Details
            </Button>
          </div>
        )}

        {/* Step 2: Beneficiary Information */}
        {step === 'beneficiary' && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="beneficiaryType">Beneficiary Type</Label>
              <Select value={beneficiaryType} onValueChange={setBeneficiaryType}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="organization">Organization</SelectItem>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="product">Product/Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="beneficiaryName">Beneficiary Name</Label>
              <Input
                id="beneficiaryName"
                value={beneficiaryName}
                onChange={(e) => setBeneficiaryName(e.target.value)}
                placeholder="Name to appear on retirement certificate"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="retirementReason">Retirement Reason (Optional)</Label>
              <Textarea
                id="retirementReason"
                value={retirementReason}
                onChange={(e) => setRetirementReason(e.target.value)}
                placeholder="e.g., Carbon neutrality commitment FY 2025-26"
                className="mt-1"
                rows={2}
              />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Checkbox 
                  id="terms" 
                  checked={acceptedTerms}
                  onCheckedChange={(checked) => setAcceptedTerms(checked === true)}
                />
                <label htmlFor="terms" className="text-sm leading-tight">
                  I agree to the Terms of Service and understand that carbon credit purchases are final and non-refundable once retired.
                </label>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox 
                  id="disclaimer" 
                  checked={acceptedDisclaimer}
                  onCheckedChange={(checked) => setAcceptedDisclaimer(checked === true)}
                />
                <label htmlFor="disclaimer" className="text-sm leading-tight">
                  I understand that carbon credits represent verified emission reductions by third-party projects and should complement, not replace, direct emission reduction efforts.
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('quantity')} className="flex-1">
                Back
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleInitiateOrder}
                disabled={!canProceedToPayment || isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Continue to Payment'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 'payment' && (
          <div className="space-y-4">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertTitle>Order #{orderNumber}</AlertTitle>
              <AlertDescription>
                Your order has been created. Complete payment to proceed with credit retirement.
              </AlertDescription>
            </Alert>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Credits</span>
                <span>{quantity} tCO₂e</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Beneficiary</span>
                <span>{beneficiaryName}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold">
                <span>Total Amount</span>
                <span>₹{totalAmount.toLocaleString()}</span>
              </div>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>Demo Mode</AlertTitle>
              <AlertDescription>
                This is a simulated payment for demonstration purposes. In production, you would be redirected to a payment gateway.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                className="flex-1" 
                onClick={handleSimulatePayment}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Simulate Payment
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Success */}
        {step === 'success' && (
          <div className="space-y-4 text-center py-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold">Payment Successful!</h3>
              <p className="text-muted-foreground text-sm mt-1">
                Order #{orderNumber}
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Credits Purchased</span>
                <span>{quantity} tCO₂e</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Project</span>
                <span className="text-right max-w-[200px] truncate">{listing.projectName}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <span className="text-yellow-600 font-medium">Pending Retirement</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              Your credits are now in escrow. Retirement will be completed within 24-48 hours, after which you'll receive your certificate.
            </p>

            <Button onClick={handleClose} className="w-full">
              View My Orders
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
