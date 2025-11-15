import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { SEO } from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { getAllSportsDisplayNames, toDbSportValue } from "@/utils/sportsUtils";
import { AlertTriangle } from "lucide-react";
import { z } from "zod";

// Field validation limits
const FIELD_LIMITS = {
  description: 1000,
  equipmentRequirements: 500,
  gameRules: 500,
};

// Validation schema for text fields
const textFieldSchema = z.object({
  description: z.string().trim().max(FIELD_LIMITS.description, {
    message: `Description must be ${FIELD_LIMITS.description} characters or less`,
  }).optional(),
  equipmentRequirements: z.string().trim().max(FIELD_LIMITS.equipmentRequirements, {
    message: `Equipment requirements must be ${FIELD_LIMITS.equipmentRequirements} characters or less`,
  }).optional(),
  gameRules: z.string().trim().max(FIELD_LIMITS.gameRules, {
    message: `Game rules must be ${FIELD_LIMITS.gameRules} characters or less`,
  }).optional(),
});

const SPORTS = getAllSportsDisplayNames();

const SKILL_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"];

const COUNTRIES = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Argentina", "Armenia", "Australia", 
  "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium",
  "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei",
  "Bulgaria", "Burkina Faso", "Burundi", "Cambodia", "Cameroon", "Canada", "Cape Verde",
  "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica",
  "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
  "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia", "Fiji",
  "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada",
  "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland",
  "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan",
  "Kazakhstan", "Kenya", "Kiribati", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho",
  "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia",
  "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia",
  "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia",
  "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Korea",
  "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea",
  "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda",
  "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino",
  "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone",
  "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Korea",
  "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria",
  "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Timor-Leste", "Togo", "Tonga", "Trinidad and Tobago",
  "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates",
  "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela",
  "Vietnam", "Yemen", "Zambia", "Zimbabwe"
];

const US_STATE_MAP = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
};

export default function HostGame() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [hostLiabilityAcknowledged, setHostLiabilityAcknowledged] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    description?: string;
    equipmentRequirements?: string;
    gameRules?: string;
    customSportName?: string;
    customEmoji?: string;
  }>({});

  // Load saved form data from localStorage on component mount
  const [formData, setFormData] = useState(() => {
    const savedData = localStorage.getItem('hostGameFormData');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
    return {
      sport: "",
      skillLevel: "",
      gameDate: "",
      timeInput: "12:00",
      durationMinutes: "",
      maxPlayers: "",
      locationName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      description: "",
      equipmentRequirements: "",
      gameRules: "",
      customSportName: "",
      customEmoji: "",
    };
  });

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('hostGameFormData', JSON.stringify(formData));
  }, [formData]);

  // Load saved liability acknowledgment
  useEffect(() => {
    const savedAcknowledgment = localStorage.getItem('hostGameLiabilityAcknowledged');
    if (savedAcknowledgment === 'true') {
      setHostLiabilityAcknowledged(true);
    }
  }, []);

  // Save liability acknowledgment to localStorage
  useEffect(() => {
    localStorage.setItem('hostGameLiabilityAcknowledged', String(hostLiabilityAcknowledged));
  }, [hostLiabilityAcknowledged]);

  const handleClearForm = () => {
    // Reset form data to initial state
    setFormData({
      sport: "",
      skillLevel: "",
      gameDate: "",
      timeInput: "12:00",
      durationMinutes: "",
      maxPlayers: "",
      locationName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      country: "United States",
      description: "",
      equipmentRequirements: "",
      gameRules: "",
      customSportName: "",
      customEmoji: "",
    });
    
    // Reset liability acknowledgment
    setHostLiabilityAcknowledged(false);
    
    // Clear validation errors
    setValidationErrors({});
    
    // Clear localStorage
    localStorage.removeItem('hostGameFormData');
    localStorage.removeItem('hostGameLiabilityAcknowledged');
    
    toast({
      title: "Form cleared",
      description: "All fields have been reset.",
    });
  };


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Validate custom sport name to only allow English alphabets and spaces
    if (name === 'customSportName') {
      const alphabetOnly = /^[a-zA-Z\s]*$/;
      if (!alphabetOnly.test(value)) {
        setValidationErrors((prev) => ({
          ...prev,
          customSportName: 'Only English alphabets are allowed',
        }));
        return;
      } else {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.customSportName;
          return newErrors;
        });
      }
    }
    
    // Validate custom emoji to only allow single emoji character
    if (name === 'customEmoji') {
      // Regex to match a single emoji (basic emoji support)
      const emojiRegex = /^[\p{Emoji_Presentation}\p{Extended_Pictographic}]$/u;
      if (value && !emojiRegex.test(value)) {
        setValidationErrors((prev) => ({
          ...prev,
          customEmoji: 'Please enter a single emoji only',
        }));
        return;
      } else {
        setValidationErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.customEmoji;
          return newErrors;
        });
      }
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Real-time validation for text fields
    if (name === 'description' || name === 'equipmentRequirements' || name === 'gameRules') {
      try {
        const fieldLimit = FIELD_LIMITS[name as keyof typeof FIELD_LIMITS];
        if (value.trim().length > fieldLimit) {
          setValidationErrors((prev) => ({
            ...prev,
            [name]: `Must be ${fieldLimit} characters or less (current: ${value.trim().length})`,
          }));
        } else {
          setValidationErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[name as keyof typeof validationErrors];
            return newErrors;
          });
        }
      } catch (error) {
        console.error('Validation error:', error);
      }
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear custom sport name when switching away from "Other"
    if (name === 'sport' && value !== 'Other') {
      setFormData((prev) => ({ ...prev, customSportName: '' }));
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.customSportName;
        return newErrors;
      });
    }
  };

  const geocodeAddress = async () => {
    console.log('🗺️ [Geocoding] Starting geocoding via edge function...');
    const { address, city, state, zipCode, country } = formData;
    console.log('Address details:', { address, city, state, zipCode, country });

    try {
      console.log('📍 [Geocoding] Calling geocode edge function...');
      const { data, error } = await supabase.functions.invoke('geocode', {
        body: { address, city, state, zipCode, country }
      });

      console.log('📍 [Geocoding] Response received:', { data, error });

      if (error) {
        console.error('❌ [Geocoding] Edge function error:', error);
        throw new Error(error.message || 'Geocoding service error');
      }

      if (!data || data.error || data.success === false) {
        console.error('❌ [Geocoding] API error:', data?.error);
        throw new Error(data?.error || 'Failed to geocode address');
      }

      console.log('✅ [Geocoding] Success:', data);
      return data;
    } catch (error: any) {
      console.error('❌ [Geocoding] Error:', error);
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      
      if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
        throw new Error("Network error. Please check your internet connection and try again.");
      }
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('🎮 [HostGame] Starting game creation process...');
    console.log('Form data:', formData);

    if (!user) {
      console.error('❌ [HostGame] No user authenticated');
      toast({
        title: "Authentication required",
        description: "Please sign in to host a game.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    if (!hostLiabilityAcknowledged) {
      toast({
        title: "Liability acknowledgment required",
        description: "You must acknowledge the hosting responsibilities and liability before creating a game.",
        variant: "destructive",
      });
      return;
    }

    // Validate custom sport name if "Other" is selected
    if (formData.sport === 'Other' && !formData.customSportName.trim()) {
      toast({
        title: "Custom sport name required",
        description: "Please specify the sport name when 'Other' is selected.",
        variant: "destructive",
      });
      return;
    }

    console.log('✅ [HostGame] User authenticated:', user.id);

    // Validate text fields before submission
    try {
      textFieldSchema.parse({
        description: formData.description,
        equipmentRequirements: formData.equipmentRequirements,
        gameRules: formData.gameRules,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: typeof validationErrors = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            errors[err.path[0] as keyof typeof validationErrors] = err.message;
          }
        });
        setValidationErrors(errors);
        toast({
          title: "Validation Error",
          description: "Please check the form for errors.",
          variant: "destructive",
        });
        return;
      }
    }

    // Validate that the game date is not in the past
    const selectedDate = new Date(formData.gameDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day for accurate comparison
    
    if (selectedDate < today) {
      toast({
        title: "Invalid date",
        description: "Cannot create games with past dates. Please select today or a future date.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Step 1: Convert time to 24-hour format for database
      console.log('⏰ [HostGame] Step 1: Processing time...');
      console.log('Input time:', formData.timeInput);
      
      // The native time input already provides time in 24-hour format (HH:mm)
      // regardless of how it's displayed to the user (12h or 24h based on device settings)
      const startTime24 = formData.timeInput;
      
      console.log('✅ [HostGame] Time format (24h):', startTime24);

      // Step 2: Geocode the address
      console.log('🗺️ [HostGame] Step 2: Starting geocoding...');
      toast({
        title: "Validating address...",
        description: "Please wait while we verify your location.",
      });

      const { latitude, longitude } = await geocodeAddress();
      console.log('✅ [HostGame] Geocoding successful:', { latitude, longitude });

      // Step 3: Create the game
      console.log('🎮 [HostGame] Step 3: Creating game in database...');
      
      const gamePayload = {
        host_id: user.id,
        sport: toDbSportValue(formData.sport) as any,
        custom_sport_name: formData.sport === 'Other' ? formData.customSportName.trim() : null,
        custom_emoji: formData.sport === 'Other' && formData.customEmoji.trim() ? formData.customEmoji.trim() : null,
        skill_level: formData.skillLevel as any,
        game_date: formData.gameDate,
        start_time: startTime24,
        duration_minutes: parseInt(formData.durationMinutes),
        max_players: parseInt(formData.maxPlayers),
        location_name: formData.locationName.trim(),
        address: formData.address.trim(),
        city: formData.city.trim(),
        state: formData.state?.trim() || null,
        zip_code: formData.zipCode?.trim() || null,
        country: formData.country,
        latitude,
        longitude,
        description: formData.description.trim() || null,
        equipment_requirements: formData.equipmentRequirements.trim() || null,
        game_rules: formData.gameRules.trim() || null,
        status: "UPCOMING" as any,
        visibility: "PUBLIC" as any,
        current_players: 1,
      };
      console.log('Game payload:', gamePayload);
      
      const { data: gameData, error } = await supabase
        .from("games")
        .insert(gamePayload)
        .select()
        .single();

      if (error) {
        console.error('❌ [HostGame] Game creation failed:', error);
        console.error('Error details:', JSON.stringify(error, null, 2));
        throw error;
      }
      
      console.log('✅ [HostGame] Game created successfully:', gameData.id);

      // Step 4: Auto-create a community for the game
      console.log('👥 [HostGame] Step 4: Creating community...');
      
      // Format community name to show "Other - [Custom Sport Name]" for custom sports
      const displaySportName = formData.sport === 'Other' && formData.customSportName.trim()
        ? `Other - ${formData.customSportName.trim()}`
        : formData.sport;
      
      const communityName = `${displaySportName} - ${formData.locationName}`;
      const communityDescription = `Community for the ${displaySportName} game on ${formData.gameDate}. ${formData.description || ''}`;

      const communityPayload = {
        name: communityName,
        description: communityDescription,
        game_id: gameData.id,
        created_by: user.id,
        type: 'game',
        sport: toDbSportValue(formData.sport) as any
      };
      console.log('Community payload:', communityPayload);
      
      const { data: communityData, error: communityError } = await supabase
        .from("communities")
        .insert(communityPayload)
        .select()
        .single();

      if (communityError) {
        console.error('❌ [HostGame] Community creation failed:', communityError);
        console.error('Error details:', JSON.stringify(communityError, null, 2));
      } else if (communityData) {
        console.log('✅ [HostGame] Community created:', communityData.id);
        
        // Step 5: Add host as admin of the community
        console.log('👑 [HostGame] Step 5: Adding host as admin...');
        const { error: memberError } = await supabase
          .from("community_members")
          .insert({
            community_id: communityData.id,
            user_id: user.id,
            role: 'admin'
          });
          
        if (memberError) {
          console.error('❌ [HostGame] Failed to add host as admin:', memberError);
          console.error('Error details:', JSON.stringify(memberError, null, 2));
        } else {
          console.log('✅ [HostGame] Host added as admin');
        }
      }

      console.log('✅ [HostGame] Game hosting process completed successfully!');
      toast({
        title: "Game created!",
        description: "Your game has been posted successfully.",
      });

      // Clear saved form data from localStorage after successful submission
      localStorage.removeItem('hostGameFormData');
      localStorage.removeItem('hostGameLiabilityAcknowledged');

      navigate("/my-games");
    } catch (error: any) {
      console.error('❌ [HostGame] Error in hosting process:', error);
      console.error('Error type:', error.constructor.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      console.error('Full error object:', JSON.stringify(error, null, 2));
      
      toast({
        title: "Error creating game",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      console.log('🏁 [HostGame] Process ended');
    }
  };

  return (
    <div className="min-h-screen min-h-screen-mobile bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800">
      <SEO
        title="Host a Pickup Game"
        description="Create and host your own pickup game. Set the date, time, location, and skill level. Connect with athletes in your area looking for games to join."
        keywords="host game, create pickup game, organize sports game, host basketball, host soccer, schedule game, find players, game organizer"
        canonicalUrl="https://squadup.app/host-game"
      />
      <Navbar />
      <div className="mobile-page-padding px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl mobile-container">
          <Card>
            <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
              <CardTitle className="text-2xl sm:text-3xl font-black">Host a Game</CardTitle>
              <CardDescription className="text-sm sm:text-base">Fill out the details to create your game</CardDescription>
            </CardHeader>
            <CardContent className="px-4 sm:px-6 pb-4 sm:pb-6">
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                {/* Sport & Skill Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mobile-form-grid">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="sport" className="text-sm">Sport *</Label>
                    <Select name="sport" value={formData.sport} onValueChange={(value) => handleSelectChange("sport", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a sport" />
                      </SelectTrigger>
                      <SelectContent>
                        {SPORTS.map((sport) => (
                          <SelectItem key={sport} value={sport}>
                            {sport}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Custom Sport Name - Only show when "Other" is selected */}
                  {formData.sport === 'Other' && (
                    <>
                      <div className="space-y-1.5 sm:space-y-2 md:col-span-2">
                        <Label htmlFor="customSportName" className="text-sm">Custom Sport Name *</Label>
                        <Input
                          type="text"
                          id="customSportName"
                          name="customSportName"
                          placeholder="Enter sport name (English alphabets only)"
                          value={formData.customSportName}
                          onChange={handleInputChange}
                          required={formData.sport === 'Other'}
                          className={validationErrors.customSportName ? 'border-destructive' : ''}
                        />
                        {validationErrors.customSportName && (
                          <p className="text-sm text-destructive">{validationErrors.customSportName}</p>
                        )}
                      </div>
                      
                      <div className="space-y-1.5 sm:space-y-2">
                        <Label htmlFor="customEmoji" className="text-sm">
                          Custom Emoji <span className="text-muted-foreground">(Optional)</span>
                        </Label>
                        <Input
                          type="text"
                          id="customEmoji"
                          name="customEmoji"
                          placeholder="🎯 (default if empty)"
                          value={formData.customEmoji}
                          onChange={handleInputChange}
                          maxLength={2}
                          className={validationErrors.customEmoji ? 'border-destructive' : ''}
                        />
                        {validationErrors.customEmoji && (
                          <p className="text-sm text-destructive">{validationErrors.customEmoji}</p>
                        )}
                        <p className="text-xs text-muted-foreground">Enter a single emoji to represent your sport</p>
                      </div>
                    </>
                  )}

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="skillLevel" className="text-sm">Skill Level *</Label>
                    <Select name="skillLevel" value={formData.skillLevel} onValueChange={(value) => handleSelectChange("skillLevel", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select skill level" />
                      </SelectTrigger>
                      <SelectContent>
                        {SKILL_LEVELS.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mobile-form-grid">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="gameDate" className="text-sm">Date *</Label>
                    <Input 
                      type="date" 
                      id="gameDate" 
                      name="gameDate" 
                      value={formData.gameDate} 
                      onChange={handleInputChange} 
                      required 
                      className="w-full text-sm px-2 py-2" 
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeInput" className="text-sm">Start Time *</Label>
                    <Input
                      type="time"
                      id="timeInput"
                      name="timeInput"
                      value={formData.timeInput}
                      onChange={handleInputChange}
                      required
                      className="w-full text-sm px-2 py-2"
                    />
                    <p className="text-xs text-muted-foreground">
                      Time shown in your device's format (12/24 hour)
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="durationMinutes" className="text-sm">Duration (minutes) *</Label>
                    <Input 
                      type="number" 
                      id="durationMinutes" 
                      name="durationMinutes" 
                      placeholder="0" 
                      value={formData.durationMinutes} 
                      onChange={handleInputChange} 
                      min="0"
                      max="99999" 
                      required 
                      className="w-full text-sm px-2 py-2" 
                    />
                  </div>
                </div>

                {/* Players */}
                <div className="space-y-1.5 sm:space-y-2">
                  <Label htmlFor="maxPlayers" className="text-sm">Max Players</Label>
                  <Input type="number" id="maxPlayers" name="maxPlayers" placeholder="10" value={formData.maxPlayers} onChange={handleInputChange} min="2" max="99999" required className="text-sm" />
                </div>

                {/* Location */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="country" className="text-sm">Country *</Label>
                    <Select name="country" value={formData.country} onValueChange={(value) => handleSelectChange("country", value)} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                      <SelectContent className="max-h-[300px]">
                        {COUNTRIES.map((country) => (
                          <SelectItem key={country} value={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="locationName" className="text-sm">Location Name *</Label>
                    <Input type="text" id="locationName" name="locationName" placeholder="Enter a location" value={formData.locationName} onChange={handleInputChange} required className="text-sm" />
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="address" className="text-sm">Street Address *</Label>
                    <Input type="text" id="address" name="address" placeholder="123 Main St" value={formData.address} onChange={handleInputChange} required className="text-sm" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mobile-form-grid">
                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="city" className="text-sm">City *</Label>
                      <Input type="text" id="city" name="city" placeholder="Enter a city" value={formData.city} onChange={handleInputChange} required className="text-sm" />
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="state" className="text-sm">State/Province/Region</Label>
                      <Input 
                        type="text" 
                        id="state" 
                        name="state" 
                        placeholder="e.g., California, Ontario, Karnataka" 
                        value={formData.state} 
                        onChange={handleInputChange}
                      />
                      <p className="text-[0.6875rem] sm:text-xs text-muted-foreground">Optional - Enter state, province, or region</p>
                    </div>

                    <div className="space-y-1.5 sm:space-y-2">
                      <Label htmlFor="zipCode" className="text-sm">ZIP/Postal Code</Label>
                      <Input type="text" id="zipCode" name="zipCode" placeholder="Enter postal code" value={formData.zipCode} onChange={handleInputChange} className="text-sm" />
                    </div>
                  </div>
                </div>

                {/* Optional Details */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="description" className="text-sm">Description</Label>
                    <Textarea 
                      id="description" 
                      name="description" 
                      placeholder="Tell players about this game..." 
                      value={formData.description} 
                      onChange={handleInputChange} 
                      rows={3}
                      maxLength={FIELD_LIMITS.description}
                      className={`text-sm ${validationErrors.description ? "border-destructive" : ""}`}
                    />
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-[0.6875rem] sm:text-xs text-muted-foreground">
                        {formData.description.trim().length}/{FIELD_LIMITS.description} characters
                      </p>
                      {validationErrors.description && (
                        <p className="text-[0.6875rem] sm:text-xs text-destructive">{validationErrors.description}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="equipmentRequirements" className="text-sm">Equipment Requirements</Label>
                    <Textarea 
                      id="equipmentRequirements" 
                      name="equipmentRequirements" 
                      placeholder="What should players bring? (e.g., cleats, water bottle, shin guards)" 
                      value={formData.equipmentRequirements} 
                      onChange={handleInputChange} 
                      rows={2}
                      maxLength={FIELD_LIMITS.equipmentRequirements}
                      className={`text-sm ${validationErrors.equipmentRequirements ? "border-destructive" : ""}`}
                    />
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-[0.6875rem] sm:text-xs text-muted-foreground">
                        {formData.equipmentRequirements.trim().length}/{FIELD_LIMITS.equipmentRequirements} characters
                      </p>
                      {validationErrors.equipmentRequirements && (
                        <p className="text-[0.6875rem] sm:text-xs text-destructive">{validationErrors.equipmentRequirements}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:space-y-2">
                    <Label htmlFor="gameRules" className="text-sm">Game Rules</Label>
                    <Textarea 
                      id="gameRules" 
                      name="gameRules" 
                      placeholder="Any specific rules or format? (e.g., no slide tackles, winner stays on)" 
                      value={formData.gameRules} 
                      onChange={handleInputChange} 
                      rows={2}
                      maxLength={FIELD_LIMITS.gameRules}
                      className={`text-sm ${validationErrors.gameRules ? "border-destructive" : ""}`}
                    />
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-[0.6875rem] sm:text-xs text-muted-foreground">
                        {formData.gameRules.trim().length}/{FIELD_LIMITS.gameRules} characters
                      </p>
                      {validationErrors.gameRules && (
                        <p className="text-[0.6875rem] sm:text-xs text-destructive">{validationErrors.gameRules}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Host Liability Acknowledgment - MANDATORY */}
                <div className="space-y-2 sm:space-y-3 border-2 border-destructive/20 rounded-lg p-3 sm:p-4 bg-destructive/5 mt-4 sm:mt-6 mobile-alert-compact">
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-xs sm:text-sm font-semibold text-foreground mb-1 sm:mb-2">
                        HOST LIABILITY ACKNOWLEDGMENT
                      </p>
                      <p className="text-[0.6875rem] sm:text-xs text-muted-foreground mb-2 sm:mb-3">
                        By hosting a game, you are taking on additional responsibilities and risks. Please read and acknowledge:
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-2 sm:space-x-3">
                    <Checkbox
                      id="host-liability"
                      checked={hostLiabilityAcknowledged}
                      onCheckedChange={(checked) => setHostLiabilityAcknowledged(checked === true)}
                      className="mt-1 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <Label
                        htmlFor="host-liability"
                        className="text-[0.6875rem] sm:text-xs leading-relaxed cursor-pointer font-normal mobile-checkbox-label block"
                      >
                        <strong className="text-foreground block mb-1">I acknowledge and agree</strong> that by hosting this game:
                        <ul className="list-disc pl-4 sm:pl-5 mt-1 sm:mt-2 space-y-1 sm:space-y-1.5 text-muted-foreground">
                          <li className="leading-snug"><strong className="text-foreground">I am hosting at my own risk</strong> and accept full personal responsibility for organizing this activity</li>
                          <li className="leading-snug"><strong className="text-foreground">The platform has no liability</strong> for any injuries, damages, disputes, or incidents that occur during my hosted game</li>
                          <li className="leading-snug"><strong className="text-foreground">I am responsible for venue safety</strong> - I must ensure the location is safe, appropriate, and legally accessible for the activity</li>
                          <li className="leading-snug"><strong className="text-foreground">I am responsible for all participants</strong> - The platform does not verify, supervise, or manage attendees</li>
                          <li className="leading-snug"><strong className="text-foreground">I assume all risks</strong> including but not limited to injuries, property damage, theft, disputes, and legal claims</li>
                          <li className="leading-snug"><strong className="text-foreground">I release the platform</strong> from any and all claims, damages, or liabilities related to this game</li>
                          <li className="leading-snug"><strong className="text-foreground">I am bound by the{" "}
                            <Link to="/terms" target="_blank" className="text-primary underline hover:text-primary/80">
                              Terms and Conditions
                            </Link></strong> and all legal provisions</li>
                        </ul>
                        <p className="mt-2 sm:mt-3 font-semibold text-foreground text-[0.6875rem] sm:text-xs leading-snug">
                          I understand that SquadUp is only a coordination platform and provides no supervision, insurance, or liability coverage for hosted games.
                        </p>
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6 mobile-button-stack">
                  <Button 
                    type="submit" 
                    disabled={loading || !hostLiabilityAcknowledged || Object.keys(validationErrors).length > 0} 
                    className="w-full sm:flex-1 text-sm sm:text-base"
                  >
                    {loading ? "Creating..." : "Create Game"}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={handleClearForm} 
                    disabled={loading}
                    className="w-full sm:w-auto text-sm sm:text-base"
                  >
                    Clear Form
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate("/discover")} 
                    disabled={loading}
                    className="w-full sm:w-auto text-sm sm:text-base"
                  >
                    Cancel
                  </Button>
                </div>
                {Object.keys(validationErrors).length > 0 && (
                  <p className="text-xs sm:text-sm text-destructive text-center mt-2">
                    Please fix validation errors before submitting
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
