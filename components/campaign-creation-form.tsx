"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Zap, MessageSquare, Target, Loader2, Calendar, Clock, Eye, Send, Users, CheckCircle } from "lucide-react"
import { CustomerReviewStep } from "./customer-review-step"

export interface CampaignData {
  name: string
  targetAudience: string
  campaignType: string
  frequency: string
  customPrompt: string
  vipSegment: string
  scheduleType: string
  scheduleDate: string
  scheduleTime: string
  timezone: string
  isRecurring: boolean
  recurringType: string
  recurringEndDate: string
  maxSends: string
}

export function CampaignCreationForm() {
  const [campaignData, setCampaignData] = useState<CampaignData>({
    name: "",
    targetAudience: "",
    campaignType: "",
    frequency: "",
    customPrompt: "",
    vipSegment: "",
    scheduleType: "immediate",
    scheduleDate: "",
    scheduleTime: "",
    timezone: "UTC",
    isRecurring: false,
    recurringType: "",
    recurringEndDate: "",
    maxSends: "",
  })

  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 6 // Updated total steps to include scheduling
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationStep, setGenerationStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isLaunching, setIsLaunching] = useState(false)
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([])

  const handleInputChange = (field: keyof CampaignData, value: string | boolean) => {
    setCampaignData((prev) => ({ ...prev, [field]: value }))
  }

  const nextStep = () => {
    if (currentStep === 3) {
      handleAIGeneration()
    } else if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleAIGeneration = () => {
    setIsGenerating(true)
    setCompletedSteps([])
    setGenerationStep(1)

    setTimeout(() => {
      // first step complete
      setCompletedSteps((prev) => [...prev, 1])
      setGenerationStep(2)

      setTimeout(() => {
        // second step complete
        setCompletedSteps((prev) => [...prev, 2])
        setGenerationStep(3)

        setTimeout(() => {
          // third step complete
          setCompletedSteps((prev) => [...prev, 3])
          setIsGenerating(false)
          setGenerationStep(0)
          setCurrentStep(currentStep + 1)
        }, 1000)
      }, 1500)
    }, 1500)
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleLaunchCampaign = () => {
    setIsLaunching(true)
    // Simulate campaign launch
    setTimeout(() => {
      setIsLaunching(false)
      // Here you would typically redirect to dashboard or show success message
      alert("Campaign launched successfully!")
    }, 2000)
  }

  const getEstimatedReach = () => {
    const baseReach = {
      platinum: 450,
      gold: 1200,
      silver: 2100,
      "all-vip": 3750,
    }
    return baseReach[campaignData.vipSegment as keyof typeof baseReach] || 0
  }

  const renderStepBadge = (step: number) => {
    if (isGenerating && generationStep === step) {
      return (
        <Badge variant="secondary" className="flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" />
          Processing
        </Badge>
      )
    }

    // if this step has completed, show Ready
    if (completedSteps.includes(step)) {
      return <Badge variant="secondary">Ready</Badge>
    }

    // default state before any generation
    return <Badge variant="default">Ready to Run</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-8">
        {[1, 2, 3, 4, 5, 6].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${step <= currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
            >
              {step}
            </div>
            {step < totalSteps && <div className={`w-12 h-1 mx-2 ${step < currentStep ? "bg-primary" : "bg-muted"}`} />}
          </div>
        ))}
      </div>

      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              Campaign Details
            </CardTitle>
            <CardDescription>Set up the basic information for your SMS campaign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-name">Campaign Name</Label>
                <Input
                  id="campaign-name"
                  placeholder="e.g., Holiday VIP Sale 2024"
                  value={campaignData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vip-segment">VIP Segment</Label>
                <Select
                  value={campaignData.vipSegment}
                  onValueChange={(value) => handleInputChange("vipSegment", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select VIP tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="platinum">Platinum Members</SelectItem>
                    <SelectItem value="gold">Gold Members</SelectItem>
                    <SelectItem value="silver">Silver Members</SelectItem>
                    <SelectItem value="all-vip">All VIP Members</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="target-audience">Target Audience Description</Label>
              <Textarea
                id="target-audience"
                placeholder="Describe your target audience (e.g., fashion-conscious women aged 25-45 who frequently shop luxury brands)"
                value={campaignData.targetAudience}
                onChange={(e) => handleInputChange("targetAudience", e.target.value)}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="campaign-type">Campaign Type</Label>
              <Select
                value={campaignData.campaignType}
                onValueChange={(value) => handleInputChange("campaignType", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="promotional">Promotional Sale</SelectItem>
                  <SelectItem value="new-arrivals">New Arrivals</SelectItem>
                  <SelectItem value="exclusive-event">Exclusive Event</SelectItem>
                  <SelectItem value="loyalty-reward">Loyalty Reward</SelectItem>
                  <SelectItem value="seasonal">Seasonal Campaign</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              AI Message Configuration
            </CardTitle>
            <CardDescription>Configure how AI will generate your SMS messages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="frequency">Message Frequency</Label>
              <Select value={campaignData.frequency} onValueChange={(value) => handleInputChange("frequency", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select frequency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once">Send Once</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="custom-prompt">Custom AI Prompt (Optional)</Label>
              <Textarea
                id="custom-prompt"
                placeholder="Add specific instructions for AI message generation (e.g., 'Use a friendly tone, mention exclusive benefits, include urgency')"
                value={campaignData.customPrompt}
                onChange={(e) => handleInputChange("customPrompt", e.target.value)}
                rows={4}
              />
              <p className="text-sm text-muted-foreground">
                Leave blank to use our optimized default prompts for your campaign type
              </p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-medium mb-2 flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                AI Features
              </h4>
              <p className="text-sm text-muted-foreground mb-2">Select features to enable for this campaign</p>
              <div className="flex flex-wrap gap-2">
                {[
                  "Personalization",
                  "A/B Testing",
                  "Optimal Timing",
                  "Emoji Integration",
                  "Call-to-Action",
                ].map((feature) => {
                  const selected = selectedFeatures.includes(feature)
                  return (
                    <Badge
                      key={feature}
                      variant={selected ? "default" : "secondary"}
                      className={`cursor-pointer select-none ${selected ? "ring-2 ring-primary" : ""}`}
                      onClick={() =>
                        setSelectedFeatures((prev) => (prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]))
                      }
                      role="button"
                      aria-pressed={selected}
                    >
                      {feature}
                    </Badge>
                  )
                })}
              </div>
              {selectedFeatures.length > 0 && (
                <p className="text-xs text-muted-foreground mt-2">Selected: {selectedFeatures.join(", ")}</p>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Generate AI Messages
            </CardTitle>
            <CardDescription>AI will generate personalized messages for your target audience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Campaign Name</h4>
                  <p className="font-medium">{campaignData.name || "Untitled Campaign"}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">VIP Segment</h4>
                  <p className="font-medium">{campaignData.vipSegment || "Not selected"}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Campaign Type</h4>
                  <p className="font-medium">{campaignData.campaignType || "Not selected"}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Frequency</h4>
                  <p className="font-medium">{campaignData.frequency || "Not selected"}</p>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground">Target Audience</h4>
                  <p className="text-sm">{campaignData.targetAudience || "Not specified"}</p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="bg-card border rounded-lg p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4" />
                AI Generation Preview
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <span className="text-sm">Analyzing customer data...</span>
                  {renderStepBadge(1)}
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <span className="text-sm">Generating personalized messages...</span>
                  {renderStepBadge(2)}
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-md">
                  <span className="text-sm">Optimizing for engagement...</span>
                  {renderStepBadge(3)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 4 && <CustomerReviewStep campaignData={campaignData} />}

      {currentStep === 5 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Schedule Campaign
            </CardTitle>
            <CardDescription>Choose when to send your SMS campaign</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label className="text-base font-medium">Send Options</Label>
              <RadioGroup
                value={campaignData.scheduleType}
                onValueChange={(value) => handleInputChange("scheduleType", value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="immediate" id="immediate" />
                  <Label htmlFor="immediate" className="font-normal">
                    Send immediately after launch
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="scheduled" id="scheduled" />
                  <Label htmlFor="scheduled" className="font-normal">
                    Schedule for specific date and time
                  </Label>
                </div>
              </RadioGroup>
            </div>

            {campaignData.scheduleType === "scheduled" && (
              <div className="space-y-4 p-4 bg-muted rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="schedule-date">Date</Label>
                    <Input
                      id="schedule-date"
                      type="date"
                      value={campaignData.scheduleDate}
                      onChange={(e) => handleInputChange("scheduleDate", e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schedule-time">Time</Label>
                    <Input
                      id="schedule-time"
                      type="time"
                      value={campaignData.scheduleTime}
                      onChange={(e) => handleInputChange("scheduleTime", e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={campaignData.timezone}
                      onValueChange={(value) => handleInputChange("timezone", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="EST">Eastern Time (EST)</SelectItem>
                        <SelectItem value="CST">Central Time (CST)</SelectItem>
                        <SelectItem value="MST">Mountain Time (MST)</SelectItem>
                        <SelectItem value="PST">Pacific Time (PST)</SelectItem>
                        <SelectItem value="GMT">Greenwich Mean Time (GMT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Recurring Campaign</Label>
                  <p className="text-sm text-muted-foreground">Send this campaign multiple times on a schedule</p>
                </div>
                <Switch
                  checked={campaignData.isRecurring}
                  onCheckedChange={(checked) => handleInputChange("isRecurring", checked)}
                />
              </div>

              {campaignData.isRecurring && (
                <div className="space-y-4 p-4 bg-muted rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="recurring-type">Repeat Every</Label>
                      <Select
                        value={campaignData.recurringType}
                        onValueChange={(value) => handleInputChange("recurringType", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="max-sends">Max Sends (Optional)</Label>
                      <Input
                        id="max-sends"
                        type="number"
                        placeholder="e.g., 10"
                        value={campaignData.maxSends}
                        onChange={(e) => handleInputChange("maxSends", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recurring-end-date">End Date (Optional)</Label>
                    <Input
                      id="recurring-end-date"
                      type="date"
                      value={campaignData.recurringEndDate}
                      onChange={(e) => handleInputChange("recurringEndDate", e.target.value)}
                      min={campaignData.scheduleDate || new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="bg-card border rounded-lg p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Schedule Summary
              </h4>
              <div className="space-y-2 text-sm">
                {campaignData.scheduleType === "immediate" ? (
                  <p>Campaign will be sent immediately after launch</p>
                ) : (
                  <>
                    <p>
                      <span className="font-medium">Send Date:</span> {campaignData.scheduleDate || "Not set"} at{" "}
                      {campaignData.scheduleTime || "Not set"} ({campaignData.timezone})
                    </p>
                    {campaignData.isRecurring && (
                      <>
                        <p>
                          <span className="font-medium">Recurring:</span> {campaignData.recurringType || "Not set"}
                        </p>
                        {campaignData.maxSends && (
                          <p>
                            <span className="font-medium">Max Sends:</span> {campaignData.maxSends}
                          </p>
                        )}
                        {campaignData.recurringEndDate && (
                          <p>
                            <span className="font-medium">End Date:</span> {campaignData.recurringEndDate}
                          </p>
                        )}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {currentStep === 6 && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5 text-primary" />
                Campaign Preview & Launch
              </CardTitle>
              <CardDescription>Review your campaign details and launch when ready</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Campaign Summary */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Campaign Name</h4>
                    <p className="font-semibold text-lg">{campaignData.name || "Untitled Campaign"}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Target Audience</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{campaignData.vipSegment}</Badge>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm">{getEstimatedReach()} customers</span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Campaign Type</h4>
                    <Badge variant="secondary">{campaignData.campaignType}</Badge>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Schedule</h4>
                    {campaignData.scheduleType === "immediate" ? (
                      <div className="flex items-center gap-2">
                        <Send className="h-4 w-4 text-green-500" />
                        <span className="text-sm">Send immediately</span>
                      </div>
                    ) : (
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">
                            {campaignData.scheduleDate} at {campaignData.scheduleTime} ({campaignData.timezone})
                          </span>
                        </div>
                        {campaignData.isRecurring && (
                          <div className="flex items-center gap-2 ml-6">
                            <Clock className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">Repeats {campaignData.recurringType}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted-foreground mb-1">Message Frequency</h4>
                    <span className="text-sm">{campaignData.frequency}</span>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Sample Messages Preview */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Sample Messages Preview
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">PLATINUM MEMBER</span>
                        <Badge variant="outline" className="text-xs">
                          SMS
                        </Badge>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                        <p className="text-sm">
                          Hi Sarah! 🌟 Exclusive 40% off luxury handbags just for Platinum members. Limited time - shop
                          now at Mall Level 2. Use code PLAT40. Expires tonight!
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">160 characters • Personalized for Sarah Johnson</p>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-muted-foreground">GOLD MEMBER</span>
                        <Badge variant="outline" className="text-xs">
                          SMS
                        </Badge>
                      </div>
                      <div className="bg-amber-50 p-3 rounded-lg border-l-4 border-amber-500">
                        <p className="text-sm">
                          Hey Michael! 🎉 VIP Gold exclusive: 25% off your favorite brands. Visit us today at the mall.
                          Code: GOLD25. Valid until Sunday!
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground">155 characters • Personalized for Michael Chen</p>
                    </div>
                  </Card>
                </div>
              </div>

              <Separator />

              {/* Campaign Statistics */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Estimated Campaign Impact
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">{getEstimatedReach()}</div>
                    <p className="text-xs text-muted-foreground">Total Reach</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">68%</div>
                    <p className="text-xs text-muted-foreground">Expected Open Rate</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">15%</div>
                    <p className="text-xs text-muted-foreground">Expected Response Rate</p>
                  </Card>
                  <Card className="p-4 text-center">
                    <div className="text-2xl font-bold text-orange-600">$2.4K</div>
                    <p className="text-xs text-muted-foreground">Estimated Revenue</p>
                  </Card>
                </div>
              </div>

              <Separator />

              {/* Final Checklist */}
              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Pre-Launch Checklist
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Campaign details configured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">AI messages generated and reviewed</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Customer list reviewed ({getEstimatedReach()} recipients)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Schedule configured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Compliance requirements met</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={prevStep} disabled={currentStep === 1 || isGenerating || isLaunching}>
          Previous
        </Button>
        <div className="flex gap-2">
          {currentStep < totalSteps ? (
            <Button onClick={nextStep} disabled={isGenerating} className="flex items-center gap-2">
              {isGenerating && currentStep === 3 && <Loader2 className="h-4 w-4 animate-spin" />}
              {currentStep === 3
                ? isGenerating
                  ? "Generating..."
                  : "Generate Messages"
                : currentStep === 5
                  ? "Preview Campaign"
                  : "Next Step"}
            </Button>
          ) : (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary/90 flex items-center gap-2" disabled={isLaunching}>
                  {isLaunching ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Launching...
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      {campaignData.scheduleType === "immediate" ? "Launch Campaign Now" : "Schedule Campaign"}
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    {campaignData.scheduleType === "immediate" ? "Launch Campaign Now?" : "Schedule Campaign?"}
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    {campaignData.scheduleType === "immediate"
                      ? `This will immediately send SMS messages to ${getEstimatedReach()} VIP customers. This action cannot be undone.`
                      : `This will schedule your campaign to send on ${campaignData.scheduleDate} at ${campaignData.scheduleTime} (${campaignData.timezone}) to ${getEstimatedReach()} VIP customers.`}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleLaunchCampaign} className="bg-primary hover:bg-primary/90">
                    {campaignData.scheduleType === "immediate" ? "Launch Now" : "Schedule Campaign"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  )
}
