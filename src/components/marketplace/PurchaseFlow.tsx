import { useState } from 'react';
import { X, ShoppingCart, AlertCircle, Check, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { CreditListing } from './CreditListingCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface PurchaseFlowProps {
  listing: CreditListing;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (orderId: string) => void;
}

type PurchaseStep = 'quantity' | 'beneficiary' | 'review' | 'payment' | 'confirmation';

const COMMISSION_RATE = 0.05; // 5% platform commission
const GST_RATE = 0.18; // 18% GST

export function PurchaseFlow({ listing, isOpen, onClose, onSuccess }: PurchaseFlowProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [step, setStep] = useState<PurchaseStep>('quantity');
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(1);
  const [beneficiaryName, setBeneficiaryName] = useState('');
  const [beneficiaryStatement, setBeneficiaryStatement] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [acceptedDisclaimer, setAcceptedDisclaimer] = useState(false);

  const subtotal = quantity * listing.pricePerTon;
  const commission = subtotal * COMMISSION_RATE;
  const gst = (subtotal + commission) * GST_RATE;
  const total = subtotal + commission + gst;

  const maxQuantity = Math.min(listing.availableCredits, 10000);

  const handleQuantityChange = (value: string) => {
    const num = parseInt(value) || 0;
    setQuantity(Math.min(Math.max(1, num), maxQuantity));
  };

  const handleCreateOrder = async () => {
    if (!user) {
      toast({ variant: 'destructive', title: 'Please log in to purchase credits' });
      return;
    }

    setIsProcessing(true);

    try {
      // Create order in database
      const { data: order, error } = await (supabase
        .from('marketplace_orders') as any)
        .insert({
          buyer_id: user.id,
          batch_id: listing.id,
          project_id: listing.id, // In real impl, this would be separate
          credits_purchased: quantity,
          price_per_credit: listing.pricePerTon,
          total_amount: total,
          commission_amount: commission,
          gst_amount: gst,
          payment_status: 'pending',
          escrow_status: 'none',
          retirement_status: 'none',
        })
        .select()
        .single();

      if (error) throw error;

      // Log to ledger
      await (supabase.from('credit_ledger') as any).insert({
        batch_id: listing.id,
        order_id: order.id,
        action: 'order_created',
        credits_amount: quantity,
        actor_id: user.id,
        metadata: { beneficiary_name: beneficiaryName },
      });

      setOrderId(order.id);
      setStep('payment');
    } catch (error) {
      console.error('Error creating order:', error);
      toast({ variant: 'destructive', title: 'Failed to create order' });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!orderId) return;
    
    setIsProcessing(true);

    try {
      // Simulate successful payment
      await (supabase
        .from('marketplace_orders') as any)
        .update({
          payment_status: 'completed',
          escrow_status: 'held',
        })
        .eq('id', orderId);

      setStep('confirmation');
      onSuccess(orderId);
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({ variant: 'destructive', title: 'Payment failed' });
    } finally {
      setIsProcessing(false);
    }
  };

  const resetFlow = () => {
    setStep('quantity');
    setQuantity(1);
    setBeneficiaryName('');
    setBeneficiaryStatement('');
    setAcceptedTerms(false);
    setAcceptedDisclaimer(false);
    setOrderId(null);
  };

  const handleClose = () => {
    resetFlow();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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

        {/* Progress indicator */}
        <div className="flex items-center gap-2 mb-4">
          {['quantity', 'beneficiary', 'review', 'payment', 'confirmation'].map((s, i) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full ${
                ['quantity', 'beneficiary', 'review', 'payment', 'confirmation'].indexOf(step) >= i
                  ? 'bg-primary'
                  : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Step 1: Quantity */}
        {step === 'quantity' && (
          <div className="space-y-4">
            <div>
              <Label>Number of Credits (tCO₂e)</Label>
              <div className="flex gap-2 mt-1">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  className="text-center"
                  min={1}
                  max={maxQuantity}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                >
                  +
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Available: {listing.availableCredits.toLocaleString()} credits
              </p>
            </div>

            <Card>
              <CardContent className="pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Price per credit</span>
                  <span>₹{listing.pricePerTon.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity</span>
                  <span>{quantity} tCO₂e</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Platform fee (5%)</span>
                  <span>₹{commission.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">GST (18%)</span>
                  <span>₹{gst.toLocaleString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            <Button className="w-full" onClick={() => setStep('beneficiary')}>
              Continue
            </Button>
          </div>
        )}

        {/* Step 2: Beneficiary Info */}
        {step === 'beneficiary' && (
          <div className="space-y-4">
            <div>
              <Label>Beneficiary Name *</Label>
              <Input
                value={beneficiaryName}
                onChange={(e) => setBeneficiaryName(e.target.value)}
                placeholder="Company or individual name for the certificate"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Retirement Statement (Optional)</Label>
              <Textarea
                value={beneficiaryStatement}
                onChange={(e) => setBeneficiaryStatement(e.target.value)}
                placeholder="e.g., In support of our 2025 carbon neutrality commitment..."
                className="mt-1"
                rows={3}
              />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                The beneficiary name will appear on the retirement certificate and cannot be changed after purchase.
              </AlertDescription>
            </Alert>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('quantity')}>
                Back
              </Button>
              <Button 
                className="flex-1" 
                onClick={() => setStep('review')}
                disabled={!beneficiaryName.trim()}
              >
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Review */}
        {step === 'review' && (
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Project</span>
                  <span className="font-medium">{listing.projectName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Registry</span>
                  <span>{listing.registry.toUpperCase()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vintage</span>
                  <span>{listing.vintageYear}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantity</span>
                  <span>{quantity} tCO₂e</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Beneficiary</span>
                  <span>{beneficiaryName}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimers */}
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={acceptedTerms}
                  onCheckedChange={(c) => setAcceptedTerms(c === true)}
                />
                <label htmlFor="terms" className="text-xs text-muted-foreground leading-tight">
                  I agree to the Terms & Conditions and understand that carbon credits represent verified emission reductions by third-party projects.
                </label>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox
                  id="disclaimer"
                  checked={acceptedDisclaimer}
                  onCheckedChange={(c) => setAcceptedDisclaimer(c === true)}
                />
                <label htmlFor="disclaimer" className="text-xs text-muted-foreground leading-tight">
                  I understand that purchasing carbon credits does not eliminate my emissions and should complement, not replace, direct emissions reductions.
                </label>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep('beneficiary')}>
                Back
              </Button>
              <Button
                className="flex-1"
                onClick={handleCreateOrder}
                disabled={!acceptedTerms || !acceptedDisclaimer || isProcessing}
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating Order...
                  </>
                ) : (
                  'Proceed to Payment'
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Payment (Simulated) */}
        {step === 'payment' && (
          <div className="space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                This is a demo. In production, you would be redirected to a secure payment gateway.
              </AlertDescription>
            </Alert>

            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-3xl font-bold mb-2">₹{total.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Order #{orderId?.slice(0, 8)}</p>
              </CardContent>
            </Card>

            <Button
              className="w-full"
              onClick={handleSimulatePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                'Complete Payment (Demo)'
              )}
            </Button>
          </div>
        )}

        {/* Step 5: Confirmation */}
        {step === 'confirmation' && (
          <div className="space-y-4 text-center">
            <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mx-auto">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Purchase Successful!</h3>
              <p className="text-muted-foreground">
                Your credits are now in escrow pending retirement.
              </p>
            </div>

            <Card>
              <CardContent className="pt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Credits Purchased</span>
                  <span className="font-medium">{quantity} tCO₂e</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge className="bg-blue-100 text-blue-700">In Escrow</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Next Step</span>
                  <span>Registry Retirement</span>
                </div>
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground">
              Once the credits are retired with {listing.registry.toUpperCase()}, you'll receive a retirement certificate.
            </p>

            <Button className="w-full" onClick={handleClose}>
              View My Orders
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
