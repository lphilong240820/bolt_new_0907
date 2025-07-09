'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, Truck, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CheckoutFormProps {
  cart: any;
  onSubmit: (orderData: any) => void;
  processing: boolean;
}

export default function CheckoutForm({ cart, onSubmit, processing }: CheckoutFormProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    // Shipping Address
    shippingFirstName: '',
    shippingLastName: '',
    shippingEmail: '',
    shippingPhone: '',
    shippingAddress1: '',
    shippingAddress2: '',
    shippingCity: '',
    shippingState: '',
    shippingPostalCode: '',
    shippingCountry: 'US',
    
    // Billing Address
    billingFirstName: '',
    billingLastName: '',
    billingAddress1: '',
    billingAddress2: '',
    billingCity: '',
    billingState: '',
    billingPostalCode: '',
    billingCountry: 'US',
    
    // Payment
    paymentMethod: 'credit_card',
    
    // Options
    sameAsShipping: true,
    saveAddress: false,
    
    // Order notes
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Required shipping fields
    const requiredShippingFields = [
      'shippingFirstName',
      'shippingLastName', 
      'shippingEmail',
      'shippingAddress1',
      'shippingCity',
      'shippingState',
      'shippingPostalCode'
    ];

    requiredShippingFields.forEach(field => {
      if (!formData[field as keyof typeof formData]) {
        const fieldName = field.replace('shipping', '').replace(/([A-Z])/g, ' $1').toLowerCase();
        newErrors[field] = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
    });

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.shippingEmail && !emailRegex.test(formData.shippingEmail)) {
      newErrors.shippingEmail = 'Please enter a valid email address';
    }

    // Billing address validation if different from shipping
    if (!formData.sameAsShipping) {
      const requiredBillingFields = [
        'billingFirstName',
        'billingLastName',
        'billingAddress1',
        'billingCity',
        'billingState',
        'billingPostalCode'
      ];

      requiredBillingFields.forEach(field => {
        if (!formData[field as keyof typeof formData]) {
          const fieldName = field.replace('billing', '').replace(/([A-Z])/g, ' $1').toLowerCase();
          newErrors[field] = `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields correctly.",
        variant: "destructive",
      });
      return;
    }
    
    const subtotal = cart.total;
    const shipping = subtotal >= 50 ? 0 : 9.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const shippingAddress = {
      firstName: formData.shippingFirstName,
      lastName: formData.shippingLastName,
      email: formData.shippingEmail,
      phone: formData.shippingPhone,
      address1: formData.shippingAddress1,
      address2: formData.shippingAddress2,
      city: formData.shippingCity,
      state: formData.shippingState,
      postalCode: formData.shippingPostalCode,
      country: formData.shippingCountry,
    };

    const billingAddress = formData.sameAsShipping ? shippingAddress : {
      firstName: formData.billingFirstName,
      lastName: formData.billingLastName,
      address1: formData.billingAddress1,
      address2: formData.billingAddress2,
      city: formData.billingCity,
      state: formData.billingState,
      postalCode: formData.billingPostalCode,
      country: formData.billingCountry,
    };

    onSubmit({
      shippingAddress,
      billingAddress,
      paymentMethod: formData.paymentMethod,
      subtotal,
      tax,
      shipping,
      total,
      notes: formData.notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Shipping Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Truck className="w-5 h-5" />
            <span>Shipping Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shippingFirstName">First Name *</Label>
              <Input
                id="shippingFirstName"
                name="shippingFirstName"
                value={formData.shippingFirstName}
                onChange={handleInputChange}
                className={errors.shippingFirstName ? 'border-red-500' : ''}
                required
              />
              {errors.shippingFirstName && (
                <p className="text-red-500 text-sm mt-1">{errors.shippingFirstName}</p>
              )}
            </div>
            <div>
              <Label htmlFor="shippingLastName">Last Name *</Label>
              <Input
                id="shippingLastName"
                name="shippingLastName"
                value={formData.shippingLastName}
                onChange={handleInputChange}
                className={errors.shippingLastName ? 'border-red-500' : ''}
                required
              />
              {errors.shippingLastName && (
                <p className="text-red-500 text-sm mt-1">{errors.shippingLastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="shippingEmail">Email *</Label>
              <Input
                id="shippingEmail"
                name="shippingEmail"
                type="email"
                value={formData.shippingEmail}
                onChange={handleInputChange}
                className={errors.shippingEmail ? 'border-red-500' : ''}
                required
              />
              {errors.shippingEmail && (
                <p className="text-red-500 text-sm mt-1">{errors.shippingEmail}</p>
              )}
            </div>
            <div>
              <Label htmlFor="shippingPhone">Phone</Label>
              <Input
                id="shippingPhone"
                name="shippingPhone"
                type="tel"
                value={formData.shippingPhone}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="shippingAddress1">Address Line 1 *</Label>
            <Input
              id="shippingAddress1"
              name="shippingAddress1"
              value={formData.shippingAddress1}
              onChange={handleInputChange}
              className={errors.shippingAddress1 ? 'border-red-500' : ''}
              required
            />
            {errors.shippingAddress1 && (
              <p className="text-red-500 text-sm mt-1">{errors.shippingAddress1}</p>
            )}
          </div>

          <div>
            <Label htmlFor="shippingAddress2">Address Line 2</Label>
            <Input
              id="shippingAddress2"
              name="shippingAddress2"
              value={formData.shippingAddress2}
              onChange={handleInputChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="shippingCity">City *</Label>
              <Input
                id="shippingCity"
                name="shippingCity"
                value={formData.shippingCity}
                onChange={handleInputChange}
                className={errors.shippingCity ? 'border-red-500' : ''}
                required
              />
              {errors.shippingCity && (
                <p className="text-red-500 text-sm mt-1">{errors.shippingCity}</p>
              )}
            </div>
            <div>
              <Label htmlFor="shippingState">State *</Label>
              <Input
                id="shippingState"
                name="shippingState"
                value={formData.shippingState}
                onChange={handleInputChange}
                className={errors.shippingState ? 'border-red-500' : ''}
                required
              />
              {errors.shippingState && (
                <p className="text-red-500 text-sm mt-1">{errors.shippingState}</p>
              )}
            </div>
            <div>
              <Label htmlFor="shippingPostalCode">Postal Code *</Label>
              <Input
                id="shippingPostalCode"
                name="shippingPostalCode"
                value={formData.shippingPostalCode}
                onChange={handleInputChange}
                className={errors.shippingPostalCode ? 'border-red-500' : ''}
                required
              />
              {errors.shippingPostalCode && (
                <p className="text-red-500 text-sm mt-1">{errors.shippingPostalCode}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <MapPin className="w-5 h-5" />
            <span>Billing Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sameAsShipping"
              checked={formData.sameAsShipping}
              onCheckedChange={(checked) => handleCheckboxChange('sameAsShipping', checked as boolean)}
            />
            <Label htmlFor="sameAsShipping">Same as shipping address</Label>
          </div>

          {!formData.sameAsShipping && (
            <>
              <Separator />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="billingFirstName">First Name *</Label>
                  <Input
                    id="billingFirstName"
                    name="billingFirstName"
                    value={formData.billingFirstName}
                    onChange={handleInputChange}
                    className={errors.billingFirstName ? 'border-red-500' : ''}
                    required={!formData.sameAsShipping}
                  />
                  {errors.billingFirstName && (
                    <p className="text-red-500 text-sm mt-1">{errors.billingFirstName}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="billingLastName">Last Name *</Label>
                  <Input
                    id="billingLastName"
                    name="billingLastName"
                    value={formData.billingLastName}
                    onChange={handleInputChange}
                    className={errors.billingLastName ? 'border-red-500' : ''}
                    required={!formData.sameAsShipping}
                  />
                  {errors.billingLastName && (
                    <p className="text-red-500 text-sm mt-1">{errors.billingLastName}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="billingAddress1">Address Line 1 *</Label>
                <Input
                  id="billingAddress1"
                  name="billingAddress1"
                  value={formData.billingAddress1}
                  onChange={handleInputChange}
                  className={errors.billingAddress1 ? 'border-red-500' : ''}
                  required={!formData.sameAsShipping}
                />
                {errors.billingAddress1 && (
                  <p className="text-red-500 text-sm mt-1">{errors.billingAddress1}</p>
                )}
              </div>

              <div>
                <Label htmlFor="billingAddress2">Address Line 2</Label>
                <Input
                  id="billingAddress2"
                  name="billingAddress2"
                  value={formData.billingAddress2}
                  onChange={handleInputChange}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="billingCity">City *</Label>
                  <Input
                    id="billingCity"
                    name="billingCity"
                    value={formData.billingCity}
                    onChange={handleInputChange}
                    className={errors.billingCity ? 'border-red-500' : ''}
                    required={!formData.sameAsShipping}
                  />
                  {errors.billingCity && (
                    <p className="text-red-500 text-sm mt-1">{errors.billingCity}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="billingState">State *</Label>
                  <Input
                    id="billingState"
                    name="billingState"
                    value={formData.billingState}
                    onChange={handleInputChange}
                    className={errors.billingState ? 'border-red-500' : ''}
                    required={!formData.sameAsShipping}
                  />
                  {errors.billingState && (
                    <p className="text-red-500 text-sm mt-1">{errors.billingState}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="billingPostalCode">Postal Code *</Label>
                  <Input
                    id="billingPostalCode"
                    name="billingPostalCode"
                    value={formData.billingPostalCode}
                    onChange={handleInputChange}
                    className={errors.billingPostalCode ? 'border-red-500' : ''}
                    required={!formData.sameAsShipping}
                  />
                  {errors.billingPostalCode && (
                    <p className="text-red-500 text-sm mt-1">{errors.billingPostalCode}</p>
                  )}
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <CreditCard className="w-5 h-5" />
            <span>Payment Method</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={formData.paymentMethod}
            onValueChange={(value) => setFormData(prev => ({ ...prev, paymentMethod: value }))}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="credit_card" id="credit_card" />
              <Label htmlFor="credit_card">Credit Card (Simulated)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="paypal" id="paypal" />
              <Label htmlFor="paypal">PayPal (Simulated)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="bank_transfer" id="bank_transfer" />
              <Label htmlFor="bank_transfer">Bank Transfer (Simulated)</Label>
            </div>
          </RadioGroup>
          
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This is a demo checkout. No actual payment will be processed. 
              Your order will be marked as "Pending Payment\" for demonstration purposes.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Order Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Order Notes (Optional)</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            name="notes"
            placeholder="Special instructions for your order..."
            value={formData.notes}
            onChange={handleInputChange}
            rows={3}
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <Button 
        type="submit" 
        className="w-full" 
        size="lg"
        disabled={processing}
      >
        {processing ? 'Processing Order...' : 'Place Order'}
      </Button>
    </form>
  );
}