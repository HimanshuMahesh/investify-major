
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { IndianRupee, MapPin } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const SettingsContent = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  // Profile settings
  const [name, setName] = useState("Raj Sharma");
  const [email, setEmail] = useState("raj@investify.com");
  const [phone, setPhone] = useState("+91 9876543210");
  const [location, setLocation] = useState("Mumbai");
  
  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(true);
  const [newMatches, setNewMatches] = useState(true);
  const [messages, setMessages] = useState(true);
  
  // Subscription details
  const [currentPlan, setCurrentPlan] = useState("Business Pro");
  const [billingCycle, setBillingCycle] = useState("yearly");
  const [autoRenew, setAutoRenew] = useState(true);
  
  const indianCities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", 
    "Kolkata", "Pune", "Ahmedabad", "Jaipur", "Surat"
  ];
  
  const handleProfileUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved.",
    });
  };
  
  const handleSubscriptionChange = (plan: string) => {
    setCurrentPlan(plan);
    toast({
      title: "Plan Changed",
      description: `You have switched to the ${plan} plan.`,
    });
  };
  
  const handleLogout = () => {
    localStorage.removeItem("investify_auth");
    localStorage.removeItem("investify_user_type");
    navigate("/login");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  return (
    <div className="container mx-auto py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing & Subscription</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>
        
        {/* Profile Settings */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Manage your personal information and how it appears on your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate}>
                <div className="grid gap-6">
                  <div className="grid gap-3">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="email">Email Address</Label>
                    <Input 
                      id="email" 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input 
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>
                  
                  <div className="grid gap-3">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <div className="absolute top-3 left-3">
                        <MapPin size={16} className="text-gray-500" />
                      </div>
                      <select
                        id="location"
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                      >
                        {indianCities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                <Button type="submit" className="mt-6">
                  Save Changes
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Manage how and when you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-gray-500">
                      Receive updates via email
                    </p>
                  </div>
                  <Switch 
                    checked={emailNotifications}
                    onCheckedChange={setEmailNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-gray-500">
                      Receive updates via text message
                    </p>
                  </div>
                  <Switch 
                    checked={smsNotifications}
                    onCheckedChange={setSmsNotifications}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Marketing Emails</p>
                    <p className="text-sm text-gray-500">
                      Receive promotional emails and newsletters
                    </p>
                  </div>
                  <Switch 
                    checked={marketingEmails}
                    onCheckedChange={setMarketingEmails}
                  />
                </div>
                
                <h3 className="text-lg font-medium mt-8 mb-4">What to notify me about</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">New Matches</p>
                    <p className="text-sm text-gray-500">
                      When a new potential investor match is found
                    </p>
                  </div>
                  <Switch 
                    checked={newMatches}
                    onCheckedChange={setNewMatches}
                  />
                </div>
                
                <Separator />
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Messages</p>
                    <p className="text-sm text-gray-500">
                      When you receive new messages
                    </p>
                  </div>
                  <Switch 
                    checked={messages}
                    onCheckedChange={setMessages}
                  />
                </div>
              </div>
              
              <Button className="mt-6">
                Save Preferences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Billing Settings */}
        <TabsContent value="billing">
          <Card>
            <CardHeader>
              <CardTitle>Billing & Subscription</CardTitle>
              <CardDescription>
                Manage your subscription plan and payment details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-2">Current Plan</h3>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium">{currentPlan}</span>
                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    Billed {billingCycle === 'monthly' ? 'monthly' : 'annually'}
                  </p>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Available Plans</h3>
                  
                  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Card className={`border ${currentPlan === 'Basic' ? 'border-investify-primary' : ''}`}>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          <span>Basic</span>
                          {currentPlan === 'Basic' && (
                            <Badge className="bg-investify-primary">Current</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          For new businesses just getting started
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-baseline mb-4">
                          <IndianRupee size={20} className="mr-1 text-gray-700" />
                          <span className="text-3xl font-bold">1,999</span>
                          <span className="text-gray-500 ml-1">/month</span>
                        </div>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Up to 5 investor matches
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Basic profile
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Standard support
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant={currentPlan === 'Basic' ? "secondary" : "default"} 
                          className="w-full"
                          onClick={() => handleSubscriptionChange('Basic')}
                        >
                          {currentPlan === 'Basic' ? 'Current Plan' : 'Switch Plan'}
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className={`border ${currentPlan === 'Business Pro' ? 'border-investify-primary' : ''}`}>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          <span>Business Pro</span>
                          {currentPlan === 'Business Pro' && (
                            <Badge className="bg-investify-primary">Current</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          For established businesses seeking funding
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-baseline mb-4">
                          <IndianRupee size={20} className="mr-1 text-gray-700" />
                          <span className="text-3xl font-bold">4,999</span>
                          <span className="text-gray-500 ml-1">/month</span>
                        </div>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Unlimited investor matches
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Enhanced profile
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Priority support
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Analytics dashboard
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant={currentPlan === 'Business Pro' ? "secondary" : "default"} 
                          className="w-full"
                          onClick={() => handleSubscriptionChange('Business Pro')}
                        >
                          {currentPlan === 'Business Pro' ? 'Current Plan' : 'Switch Plan'}
                        </Button>
                      </CardFooter>
                    </Card>
                    
                    <Card className={`border ${currentPlan === 'Enterprise' ? 'border-investify-primary' : ''}`}>
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          <span>Enterprise</span>
                          {currentPlan === 'Enterprise' && (
                            <Badge className="bg-investify-primary">Current</Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          For large organizations with complex needs
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-baseline mb-4">
                          <IndianRupee size={20} className="mr-1 text-gray-700" />
                          <span className="text-3xl font-bold">14,999</span>
                          <span className="text-gray-500 ml-1">/month</span>
                        </div>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Everything in Pro plan
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Dedicated account manager
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Custom integration
                          </li>
                          <li className="flex items-center">
                            <svg className="w-4 h-4 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            Enterprise support SLA
                          </li>
                        </ul>
                      </CardContent>
                      <CardFooter>
                        <Button 
                          variant={currentPlan === 'Enterprise' ? "secondary" : "default"} 
                          className="w-full"
                          onClick={() => handleSubscriptionChange('Enterprise')}
                        >
                          {currentPlan === 'Enterprise' ? 'Current Plan' : 'Switch Plan'}
                        </Button>
                      </CardFooter>
                    </Card>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Billing Information</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Auto-renew subscription</p>
                      <p className="text-sm text-gray-500">
                        Automatically renew your subscription at the end of the billing cycle
                      </p>
                    </div>
                    <Switch 
                      checked={autoRenew}
                      onCheckedChange={setAutoRenew}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Security Settings */}
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>
                Manage your account security and session information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Password</h3>
                  <Button>Change Password</Button>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    Add an extra layer of security to your account
                  </p>
                  <Button variant="outline">Set Up Two-Factor Authentication</Button>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Session Management</h3>
                  <p className="text-sm text-gray-500 mb-4">
                    You are currently signed in on this device
                  </p>
                  <Button variant="destructive" onClick={handleLogout}>Sign Out from All Devices</Button>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium mb-4">Account Management</h3>
                  <Button variant="destructive">Delete Account</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsContent;
