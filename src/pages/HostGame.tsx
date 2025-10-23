import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Navbar } from "@/components/Navbar";
import { getAllSportsDisplayNames, toDbSportValue } from "@/utils/sportsUtils";

const SPORTS = getAllSportsDisplayNames();

const SKILL_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "ALL_LEVELS"];

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

  const [formData, setFormData] = useState({
    sport: "",
    skillLevel: "",
    gameDate: "",
    timeInput: "12:00",
    timePeriod: "PM",
    durationMinutes: "",
    maxPlayers: "",
    costPerPerson: "",
    locationName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    description: "",
    equipmentRequirements: "",
    gameRules: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const geocodeAddress = async () => {
    console.log('🗺️ [Geocoding] Starting geocoding via edge function...');
    const { address, city, state, zipCode } = formData;
    console.log('Address details:', { address, city, state, zipCode });

    try {
      console.log('📍 [Geocoding] Calling geocode edge function...');
      const { data, error } = await supabase.functions.invoke('geocode', {
        body: { address, city, state, zipCode }
      });

      if (error) {
        console.error('❌ [Geocoding] Edge function error:', error);
        throw new Error(error.message || 'Geocoding service error');
      }

      if (data.error) {
        console.error('❌ [Geocoding] API error:', data.error);
        throw new Error(data.error);
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

    console.log('✅ [HostGame] User authenticated:', user.id);
    setLoading(true);

    try {
      // Step 1: Convert 12-hour time to 24-hour format for database
      console.log('⏰ [HostGame] Step 1: Converting time format...');
      console.log('Input time:', formData.timeInput, formData.timePeriod);
      
      const [hours, minutes] = formData.timeInput.split(':');
      let hour24 = parseInt(hours);
      
      if (formData.timePeriod === "PM" && hour24 !== 12) {
        hour24 += 12;
      } else if (formData.timePeriod === "AM" && hour24 === 12) {
        hour24 = 0;
      }
      
      const startTime24 = `${hour24.toString().padStart(2, '0')}:${minutes}`;
      console.log('✅ [HostGame] Time converted to 24h format:', startTime24);

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
        skill_level: formData.skillLevel as any,
        game_date: formData.gameDate,
        start_time: startTime24,
        duration_minutes: parseInt(formData.durationMinutes),
        max_players: parseInt(formData.maxPlayers),
        cost_per_person: parseFloat(formData.costPerPerson) || 0,
        location_name: formData.locationName,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zipCode,
        latitude,
        longitude,
        description: formData.description || null,
        equipment_requirements: formData.equipmentRequirements || null,
        game_rules: formData.gameRules || null,
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
      const communityName = `${formData.sport} - ${formData.locationName}`;
      const communityDescription = `Community for the ${formData.sport} game on ${formData.gameDate}. ${formData.description || ''}`;

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar />
      <div className="pt-24 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-3xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-black">Host a Game</CardTitle>
              <CardDescription>Fill out the details to create your game</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Sport & Skill Level */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="sport">Sport *</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="skillLevel">Skill Level *</Label>
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
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gameDate">Date *</Label>
                    <Input type="date" id="gameDate" name="gameDate" value={formData.gameDate} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="timeInput">Start Time *</Label>
                    <div className="flex gap-2">
                      <Input
                        type="time"
                        id="timeInput"
                        name="timeInput"
                        value={formData.timeInput}
                        onChange={handleInputChange}
                        placeholder="00:00"
                        required
                        className="flex-1"
                      />
                      <Select
                        name="timePeriod"
                        value={formData.timePeriod}
                        onValueChange={(value) => handleSelectChange("timePeriod", value)}
                        required
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AM">AM</SelectItem>
                          <SelectItem value="PM">PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="durationMinutes">Duration (minutes) *</Label>
                    <Input type="number" id="durationMinutes" name="durationMinutes" placeholder="0" value={formData.durationMinutes} onChange={handleInputChange} min="0" required />
                  </div>
                </div>

                {/* Players & Cost */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxPlayers">Max Players *</Label>
                    <Input type="number" id="maxPlayers" name="maxPlayers" placeholder="Enter a number" value={formData.maxPlayers} onChange={handleInputChange} min="1" required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="costPerPerson">Cost per Person ($)</Label>
                    <Input type="number" id="costPerPerson" name="costPerPerson" placeholder="0.00" value={formData.costPerPerson} onChange={handleInputChange} min="0" step="0.01" />
                  </div>
                </div>

                {/* Location */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="locationName">Location Name *</Label>
                    <Input type="text" id="locationName" name="locationName" placeholder="Enter a location" value={formData.locationName} onChange={handleInputChange} required />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input type="text" id="address" name="address" placeholder="123 Main St" value={formData.address} onChange={handleInputChange} required />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">City *</Label>
                      <Input type="text" id="city" name="city" placeholder="Enter a city" value={formData.city} onChange={handleInputChange} required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="state">State *</Label>
                      <Select name="state" value={formData.state} onValueChange={(value) => handleSelectChange("state", value)} required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(US_STATE_MAP).map(([code, name]) => (
                            <SelectItem key={code} value={code}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="zipCode">ZIP Code *</Label>
                      <Input type="text" id="zipCode" name="zipCode" placeholder="Enter a zip code" value={formData.zipCode} onChange={handleInputChange} required />
                    </div>
                  </div>
                </div>

                {/* Optional Details */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" name="description" placeholder="Tell players about this game..." value={formData.description} onChange={handleInputChange} rows={3} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="equipmentRequirements">Equipment Requirements</Label>
                    <Textarea id="equipmentRequirements" name="equipmentRequirements" placeholder="What should players bring?" value={formData.equipmentRequirements} onChange={handleInputChange} rows={2} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gameRules">Game Rules</Label>
                    <Textarea id="gameRules" name="gameRules" placeholder="Any specific rules or format?" value={formData.gameRules} onChange={handleInputChange} rows={2} />
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button type="submit" disabled={loading} className="flex-1">
                    {loading ? "Creating..." : "Create Game"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => navigate("/discover")} disabled={loading}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
