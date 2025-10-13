import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";

const sports = [
  "Basketball", "Soccer", "Tennis", "Volleyball", "Football", 
  "Baseball", "Pickleball", "Ultimate Frisbee", "Running", 
  "Cycling", "Badminton", "Golf"
];

const skillLevels = ["Beginner", "Intermediate", "Advanced", "All Levels"];

export default function HostGame() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    sport: "",
    skill_level: "",
    location_name: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    game_date: undefined as Date | undefined,
    start_time: "",
    duration_minutes: "",
    max_players: "",
    cost_per_person: "0",
    description: "",
    game_rules: "",
    equipment_requirements: "",
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const geocodeAddress = async () => {
    const fullAddress = `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip_code}`.trim();
    
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}&limit=1`
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        return {
          latitude: parseFloat(data[0].lat),
          longitude: parseFloat(data[0].lon),
        };
      } else {
        throw new Error("Location not found");
      }
    } catch (error) {
      console.error("Geocoding error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to host a game.",
        variant: "destructive"
      });
      navigate("/auth");
      return;
    }

    // Validate required fields
    const missingFields = [];
    if (!formData.sport?.trim()) missingFields.push("Sport");
    if (!formData.skill_level?.trim()) missingFields.push("Skill Level");
    if (!formData.location_name?.trim()) missingFields.push("Location Name");
    if (!formData.address?.trim()) missingFields.push("Street Address");
    if (!formData.city?.trim()) missingFields.push("City");
    if (!formData.game_date) missingFields.push("Game Date");
    if (!formData.start_time?.trim()) missingFields.push("Start Time");
    if (!formData.max_players?.trim()) missingFields.push("Max Players");

    if (missingFields.length > 0) {
      toast({
        title: "Missing required fields",
        description: `Please fill in: ${missingFields.join(", ")}`,
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Geocode the address to get coordinates
      toast({
        title: "Finding location...",
        description: "Converting address to coordinates..."
      });
      
      const coords = await geocodeAddress();

      const { error } = await (supabase as any).from("games").insert({
        host_id: user.id,
        sport: formData.sport,
        skill_level: formData.skill_level,
        location_name: formData.location_name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        latitude: coords.latitude,
        longitude: coords.longitude,
        game_date: format(formData.game_date, "yyyy-MM-dd"),
        start_time: formData.start_time,
        duration_minutes: parseInt(formData.duration_minutes) || 60,
        max_players: parseInt(formData.max_players),
        cost_per_person: parseFloat(formData.cost_per_person) || 0,
        description: formData.description,
        game_rules: formData.game_rules,
        equipment_requirements: formData.equipment_requirements,
        visibility: "PUBLIC",
        status: "UPCOMING"
      });

      if (error) throw error;

      toast({
        title: "Game created!",
        description: "Your game has been posted successfully."
      });

      navigate("/discover");
    } catch (error) {
      console.error("Error creating game:", error);
      toast({
        title: "Error",
        description: "Failed to create game. Please check the address and try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar />
      <div className="pt-20 px-4 pb-4">
        <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Host a Game</h1>
          <p className="text-gray-600 mb-6">Create and advertise your pickup game</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Sport Selection */}
            <div>
              <Label htmlFor="sport">Sport *</Label>
              <Select value={formData.sport} onValueChange={(value) => handleInputChange("sport", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a sport" />
                </SelectTrigger>
                <SelectContent>
                  {sports.map(sport => (
                    <SelectItem key={sport} value={sport}>{sport}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Skill Level */}
            <div>
              <Label htmlFor="skill_level">Skill Level *</Label>
              <Select value={formData.skill_level} onValueChange={(value) => handleInputChange("skill_level", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select skill level" />
                </SelectTrigger>
                <SelectContent>
                  {skillLevels.map(level => (
                    <SelectItem key={level} value={level}>{level}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location Name */}
            <div>
              <Label htmlFor="location_name">Location Name *</Label>
              <Input
                id="location_name"
                placeholder="e.g., Central Park Basketball Courts"
                value={formData.location_name}
                onChange={(e) => handleInputChange("location_name", e.target.value)}
              />
            </div>

            {/* Address */}
            <div>
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                placeholder="e.g., 123 Main St"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
              />
            </div>

            {/* City, State, Zip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => handleInputChange("city", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="State"
                  value={formData.state}
                  onChange={(e) => handleInputChange("state", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="zip_code">Zip Code</Label>
                <Input
                  id="zip_code"
                  placeholder="Zip"
                  value={formData.zip_code}
                  onChange={(e) => handleInputChange("zip_code", e.target.value)}
                />
              </div>
            </div>

            {/* Location Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Automatic Location Detection</p>
                  <p className="text-sm text-blue-700 mt-1">
                    The map will automatically pinpoint your game location based on the address you provide above.
                  </p>
                </div>
              </div>
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Game Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.game_date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.game_date ? format(formData.game_date, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.game_date}
                      onSelect={(date) => setFormData(prev => ({ ...prev, game_date: date }))}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="start_time">Start Time *</Label>
                <Input
                  id="start_time"
                  type="time"
                  value={formData.start_time}
                  onChange={(e) => handleInputChange("start_time", e.target.value)}
                />
              </div>
            </div>

            {/* Duration and Players */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="duration_minutes">Duration (minutes)</Label>
                <Input
                  id="duration_minutes"
                  type="number"
                  placeholder="60"
                  value={formData.duration_minutes}
                  onChange={(e) => handleInputChange("duration_minutes", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="max_players">Max Players *</Label>
                <Input
                  id="max_players"
                  type="number"
                  placeholder="10"
                  value={formData.max_players}
                  onChange={(e) => handleInputChange("max_players", e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="cost_per_person">Cost per Person ($)</Label>
                <Input
                  id="cost_per_person"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.cost_per_person}
                  onChange={(e) => handleInputChange("cost_per_person", e.target.value)}
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Tell players about your game..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
              />
            </div>

            {/* Game Rules */}
            <div>
              <Label htmlFor="game_rules">Game Rules</Label>
              <Textarea
                id="game_rules"
                placeholder="Any specific rules for this game..."
                value={formData.game_rules}
                onChange={(e) => handleInputChange("game_rules", e.target.value)}
                rows={3}
              />
            </div>

            {/* Equipment Requirements */}
            <div>
              <Label htmlFor="equipment_requirements">Equipment Requirements</Label>
              <Textarea
                id="equipment_requirements"
                placeholder="What should players bring..."
                value={formData.equipment_requirements}
                onChange={(e) => handleInputChange("equipment_requirements", e.target.value)}
                rows={2}
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Creating..." : "Create Game"}
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/discover")}>
                Cancel
              </Button>
            </div>
          </form>
        </div>
        </div>
      </div>
    </div>
  );
}
