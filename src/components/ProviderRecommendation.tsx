import React, { useState } from "react";
import {
  Hospital,
  Clock,
  Phone,
  MapPin,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface Facility {
  name: string;
  type: string;
  address: string;
  distance: string;
  phone?: string;
  wait_time?: string;
}

interface ProviderRecommendationProps {
  severity?: "low" | "moderate" | "high";
}

const ProviderRecommendation: React.FC<ProviderRecommendationProps> = ({
  severity = "low",
}) => {
  const [isSearching, setIsSearching] = useState(false);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  const getRecommendedFacilities = (severity: string) => {
    switch (severity) {
      case "high":
        return {
          title: "Emergency Care Needed",
          description:
            "Based on your symptoms, you should seek immediate medical attention.",
          facilityTypes: ["Emergency Room", "Hospital"],
        };
      case "moderate":
        return {
          title: "Urgent Care Recommended",
          description:
            "Your symptoms suggest you should seek medical attention soon.",
          facilityTypes: ["Urgent Care", "Primary Care"],
        };
      default:
        return {
          title: "Non-Urgent Care Options",
          description:
            "Your symptoms can be addressed through routine medical care.",
          facilityTypes: ["Primary Care", "Clinic"],
        };
    }
  };

  const findNearbyFacilities = async () => {
    setIsSearching(true);
    setSearchError(null);
    setFacilities([]);

    try {
      // Get user's location
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        }
      );

      const { latitude, longitude } = position.coords;

      // For demonstration, creating mock facilities based on severity
      // In a real app, you would make an API call to a healthcare provider database
      const mockFacilities: Facility[] = [
        {
          name: "City General Hospital",
          type: severity === "high" ? "Emergency Room" : "Hospital",
          address: "123 Healthcare Ave",
          distance: "0.8 miles",
          wait_time: severity === "high" ? "Immediate" : "30-45 mins",
        },
        {
          name: "Urgent Care Plus",
          type: "Urgent Care Center",
          address: "456 Medical Dr",
          distance: "1.2 miles",
          wait_time: "15-20 mins",
        },
        {
          name: "Community Medical Center",
          type: "Primary Care",
          address: "789 Wellness Blvd",
          distance: "1.5 miles",
          wait_time: "By appointment",
        },
      ];

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setFacilities(mockFacilities);
    } catch (error) {
      console.error("Error finding facilities:", error);
      setSearchError(
        error instanceof GeolocationPositionError
          ? "Please enable location access to find nearby facilities"
          : "Unable to find nearby facilities. Please try again."
      );
    } finally {
      setIsSearching(false);
    }
  };

  const recommendation = getRecommendedFacilities(severity);

  return (
    <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-lg border border-white/20">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-6 h-6 text-[#2B4570]" />
        <h2 className="text-xl font-bold text-[#2B4570]">
          Care Recommendations
        </h2>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#2B4570] mb-2">
          {recommendation.title}
        </h3>
        <p className="text-gray-600">{recommendation.description}</p>
      </div>

      <button
        onClick={findNearbyFacilities}
        disabled={isSearching}
        className="w-full bg-[#2B4570] text-white py-3 px-4 rounded-xl hover:bg-[#2B4570]/90 transition-colors duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isSearching ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <MapPin className="w-5 h-5" />
        )}
        {isSearching ? "Searching..." : "Find Nearby Facilities"}
      </button>

      {searchError && (
        <div className="mt-4 p-4 bg-red-50 rounded-xl text-sm text-red-600 flex items-start gap-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p>{searchError}</p>
        </div>
      )}

      {facilities.length > 0 && (
        <div className="mt-6 space-y-4">
          <h4 className="font-medium text-[#2B4570]">Nearby Facilities:</h4>
          {facilities.map((facility, index) => (
            <div
              key={index}
              className="p-4 rounded-xl bg-white/50 border border-[#2B4570]/10 hover:border-[#2B4570]/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-medium text-[#2B4570]">
                    {facility.name}
                  </h5>
                  <p className="text-sm text-gray-500">{facility.type}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {facility.address}
                  </p>
                  {facility.wait_time && (
                    <p className="text-sm text-gray-500 mt-1">
                      Wait time: {facility.wait_time}
                    </p>
                  )}
                </div>
                <span className="text-sm text-[#2B4570] bg-[#2B4570]/10 px-3 py-1 rounded-full">
                  {facility.distance}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {severity === "high" && (
        <div className="mt-4 p-4 bg-red-50 rounded-xl text-sm text-red-600 flex items-start gap-2">
          <Phone className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <strong className="font-medium">Emergency Services: </strong>
            If you're experiencing a medical emergency, call your local
            emergency number immediately.
          </div>
        </div>
      )}
    </div>
  );
};

export default ProviderRecommendation;
