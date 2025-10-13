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
import { IOSTimePicker } from "@/components/IOSTimePicker";

const SPORTS = [
  "Basketball",
  "Soccer",
  "Tennis",
  "Volleyball",
  "Football",
  "Baseball",
  "Pickleball",
  "Ultimate Frisbee",
  "Running",
  "Cycling",
  "Badminton",
  "Golf",
];

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
    startTime: { hour: "12", minute: "00", period: "PM" },
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
    const { address, city, state, zipCode } = formData;
    const stateName = US_STATE_MAP[state.toUpperCase() as keyof typeof US_STATE_MAP] || state;

    try {
      // Try structured query first
      const structuredUrl = `https://nominatim.openstreetmap.org/search?` +
        `street=${encodeURIComponent(address)}&` +
        `city=${encodeURIComponent(city)}&` +
        `state=${encodeURIComponent(stateName)}&` +
        `postalcode=${encodeURIComponent(zipCode)}&` +
        `country=USA&format=json&limit=1`;

      let response = await fetch(structuredUrl, {
        headers: { 
          "User-Agent": "SquadUp-App",
          "Accept": "application/json"
        },
      });

      if (response.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a minute.");
      }

      if (!response.ok) {
        throw new Error(`Geocoding service unavailable (${response.status}). Please try again later.`);
      }

      let data = await response.json();

      // If structured query fails, try full-text search
      if (!data || data.length === 0) {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Add delay between requests
        
        const fullAddress = `${address}, ${city}, ${stateName} ${zipCode}, USA`;
        const fullTextUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullAddress)}&format=json&limit=1`;

        response = await fetch(fullTextUrl, {
          headers: { 
            "User-Agent": "SquadUp-App",
            "Accept": "application/json"
          },
        });

        if (!response.ok) {
          throw new Error(`Geocoding service unavailable (${response.status}). Please try again later.`);
        }

        data = await response.json();
      }

      if (!data || data.length === 0) {
        throw new Error("Could not find coordinates for this address. Please verify the address is correct.");
      }

      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    } catch (error: any) {
      console.error("Geocoding error:", error);
      if (error.message.includes("Failed to fetch")) {
        throw new Error("Network error. Please check your internet connection and try again.");
      }
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to host a game.",
        variant: "destructive",
      });
      navigate("/auth");
      return;
    }

    setLoading(true);

    try {
      // Convert 12-hour time to 24-hour format for database
      let hour24 = parseInt(formData.startTime.hour);
      if (formData.startTime.period === "PM" && hour24 !== 12) {
        hour24 += 12;
      } else if (formData.startTime.period === "AM" && hour24 === 12) {
        hour24 = 0;
      }
      const startTime24 = `${hour24.toString().padStart(2, '0')}:${formData.startTime.minute}`;

      // Geocode the address
      toast({
        title: "Validating address...",
        description: "Please wait while we verify your location.",
      });

      const { latitude, longitude } = await geocodeAddress();

      // Create the game
      const { error } = await supabase.from("games").insert({
        host_id: user.id,
        sport: formData.sport as any,
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
      });

      if (error) throw error;

      toast({
        title: "Game created!",
        description: "Your game has been posted successfully.",
      });

      navigate("/my-games");
    } catch (error: any) {
      console.error("Error creating game:", error);
      toast({
        title: "Error creating game",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
                    <Label>Start Time *</Label>
                    <IOSTimePicker
                      value={formData.startTime}
                      onChange={(time) => setFormData((prev) => ({ ...prev, startTime: time }))}
                    />
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
                      <Input type="text" id="state" name="state" placeholder="Enter a state" maxLength={2} value={formData.state} onChange={handleInputChange} required />
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
