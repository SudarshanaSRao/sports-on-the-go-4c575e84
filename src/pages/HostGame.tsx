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

  const [coords, setCoords] = useState({ lat: "", lng: "" });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCoords({
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString()
          });
          toast({
            title: "Location captured",
            description: "Your current location has been set."
          });
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Unable to get your location. Please enter manually.",
            variant: "destructive"
          });
        }
      );
    } else {
      toast({
        title: "Not supported",
        description: "Geolocation is not supported by your browser.",
        variant: "destructive"
      });
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

    if (!formData.sport || !formData.skill_level || !formData.location_name || 
        !formData.game_date || !formData.start_time || !formData.max_players ||
        !coords.lat || !coords.lng) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields and set location.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.from("games").insert({
        host_id: user.id,
        sport: formData.sport,
        skill_level: formData.skill_level,
        location_name: formData.location_name,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        latitude: parseFloat(coords.lat),
        longitude: parseFloat(coords.lng),
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
        description: "Failed to create game. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
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

            {/* Coordinates */}
            <div>
              <Label>Coordinates *</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Latitude"
                  value={coords.lat}
                  onChange={(e) => setCoords(prev => ({ ...prev, lat: e.target.value }))}
                />
                <Input
                  placeholder="Longitude"
                  value={coords.lng}
                  onChange={(e) => setCoords(prev => ({ ...prev, lng: e.target.value }))}
                />
                <Button type="button" onClick={handleGetLocation} variant="outline">
                  <MapPin className="w-4 h-4 mr-2" />
                  Use My Location
                </Button>
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
  );
}
