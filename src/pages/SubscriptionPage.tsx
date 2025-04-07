
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ArrowRight, Crown, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';

const SubscriptionPage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleSubscribe = () => {
    // In a real app, this would integrate with a payment processor
    toast({
      title: "Subscription Demo",
      description: "This is a demo app. In a real app, this would open a payment page.",
    });
  };

  const features = [
    "Access to all answers and explanations",
    "Download questions and answers",
    "Unlimited CBT practice tests",
    "Priority support",
    "Ad-free experience"
  ];

  if (user?.isSubscribed) {
    return (
      <div className="container px-4 py-12 mx-auto max-w-3xl text-center">
        <Crown className="mx-auto h-16 w-16 text-uniwise-gold mb-4" />
        <h1 className="text-3xl font-bold mb-4">You're a Premium Member!</h1>
        <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
          Thank you for supporting UniWise. You now have access to all premium features.
        </p>
        <Alert className="bg-uniwise-gold/10 border-uniwise-gold mb-8">
          <AlertCircle className="h-5 w-5 text-uniwise-gold" />
          <AlertTitle>You have full access</AlertTitle>
          <AlertDescription>
            Enjoy unlimited access to all answers, explanations, and downloads.
          </AlertDescription>
        </Alert>
        <Button asChild>
          <a href="/browse">
            Browse Past Questions <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Upgrade to UniWise Premium</h1>
        <p className="text-muted-foreground max-w-lg mx-auto">
          Get unlimited access to past question answers, explanations, and more premium features.
        </p>
      </div>

      <Tabs defaultValue="monthly" className="max-w-3xl mx-auto">
        <div className="text-center mb-6">
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-uniwise-gold text-uniwise-blue">Save 20%</span></TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="monthly">
          <Card className="border-2 border-uniwise-gold">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Premium Monthly</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">₦1,500</span>
                <span className="text-muted-foreground ml-2">/ month</span>
              </div>
              <CardDescription className="mt-2">Full access to all premium features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="text-green-500 h-5 w-5 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubscribe} size="lg" className="w-full">
                Start Premium Monthly
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="yearly">
          <Card className="border-2 border-uniwise-gold">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Premium Yearly</CardTitle>
              <div className="mt-2">
                <span className="text-3xl font-bold">₦14,400</span>
                <span className="text-muted-foreground ml-2">/ year</span>
              </div>
              <CardDescription className="mt-2">
                Full access to all premium features
                <div className="mt-1 inline-block px-2 py-1 bg-uniwise-gold/20 text-uniwise-blue rounded-md text-xs">
                  Save ₦3,600 compared to monthly
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="text-green-500 h-5 w-5 mr-3 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSubscribe} size="lg" className="w-full">
                Start Premium Yearly
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="max-w-3xl mx-auto mt-12 text-center">
        <h3 className="text-lg font-medium mb-6">Frequently Asked Questions</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Can I cancel anytime?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Yes, you can cancel your subscription at any time. Your premium access will remain until the end of your billing period.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">How do I access premium content?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Once subscribed, all answers and premium features will automatically unlock throughout the app.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What payment methods do you accept?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We accept credit/debit cards, bank transfers, and mobile money payments for your convenience.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Do you offer refunds?</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                We offer a 7-day money-back guarantee if you're not satisfied with your premium subscription.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionPage;
