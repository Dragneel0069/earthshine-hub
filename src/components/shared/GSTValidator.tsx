import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Building2 } from "lucide-react";

const gstStateCodes: Record<string, string> = {
  "01": "Jammu & Kashmir",
  "02": "Himachal Pradesh",
  "03": "Punjab",
  "04": "Chandigarh",
  "05": "Uttarakhand",
  "06": "Haryana",
  "07": "Delhi",
  "08": "Rajasthan",
  "09": "Uttar Pradesh",
  "10": "Bihar",
  "11": "Sikkim",
  "12": "Arunachal Pradesh",
  "13": "Nagaland",
  "14": "Manipur",
  "15": "Mizoram",
  "16": "Tripura",
  "17": "Meghalaya",
  "18": "Assam",
  "19": "West Bengal",
  "20": "Jharkhand",
  "21": "Odisha",
  "22": "Chhattisgarh",
  "23": "Madhya Pradesh",
  "24": "Gujarat",
  "25": "Daman & Diu",
  "26": "Dadra & Nagar Haveli",
  "27": "Maharashtra",
  "28": "Andhra Pradesh",
  "29": "Karnataka",
  "30": "Goa",
  "31": "Lakshadweep",
  "32": "Kerala",
  "33": "Tamil Nadu",
  "34": "Puducherry",
  "35": "Andaman & Nicobar Islands",
  "36": "Telangana",
  "37": "Andhra Pradesh (New)",
  "38": "Ladakh",
};

interface GSTValidationResult {
  isValid: boolean;
  state: string | null;
  pan: string | null;
  errors: string[];
}

function validateGST(gst: string): GSTValidationResult {
  const result: GSTValidationResult = {
    isValid: false,
    state: null,
    pan: null,
    errors: [],
  };

  if (!gst) {
    return result;
  }

  const upperGST = gst.toUpperCase().trim();

  // Check length
  if (upperGST.length !== 15) {
    result.errors.push("GST number must be exactly 15 characters");
    return result;
  }

  // GST format: 22AAAAA0000A1Z5
  // First 2: State code (01-38)
  // Next 10: PAN number (AAAAA0000A)
  // 13th: Entity number (1-9 or A-Z)
  // 14th: Z by default
  // 15th: Checksum (alphanumeric)

  const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;

  if (!gstRegex.test(upperGST)) {
    result.errors.push("Invalid GST format");
    return result;
  }

  // Validate state code
  const stateCode = upperGST.substring(0, 2);
  const stateName = gstStateCodes[stateCode];

  if (!stateName) {
    result.errors.push("Invalid state code");
    return result;
  }

  result.state = stateName;
  result.pan = upperGST.substring(2, 12);
  result.isValid = true;

  return result;
}

interface GSTValidatorProps {
  value?: string;
  onChange?: (gst: string, validation: GSTValidationResult) => void;
  className?: string;
}

export function GSTValidator({ value, onChange, className }: GSTValidatorProps) {
  const [gstNumber, setGstNumber] = useState(value || "");
  const [validation, setValidation] = useState<GSTValidationResult>({
    isValid: false,
    state: null,
    pan: null,
    errors: [],
  });
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    if (gstNumber) {
      const result = validateGST(gstNumber);
      setValidation(result);
      onChange?.(gstNumber, result);
    } else {
      setValidation({ isValid: false, state: null, pan: null, errors: [] });
    }
  }, [gstNumber, onChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().slice(0, 15);
    setGstNumber(value);
    setTouched(true);
  };

  const getStatusIcon = () => {
    if (!touched || !gstNumber) return null;
    if (validation.isValid) {
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
    if (gstNumber.length === 15) {
      return <XCircle className="h-4 w-4 text-destructive" />;
    }
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  return (
    <div className={className}>
      <Label className="text-sm font-medium mb-2 block">GST Number</Label>
      <div className="relative">
        <Input
          value={gstNumber}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          placeholder="22AAAAA0000A1Z5"
          className="pr-10 font-mono uppercase bg-background border-border"
          maxLength={15}
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2">
          {getStatusIcon()}
        </div>
      </div>

      {/* Character count */}
      <p className="text-xs text-muted-foreground mt-1">
        {gstNumber.length}/15 characters
      </p>

      {/* Validation errors */}
      {touched && validation.errors.length > 0 && (
        <div className="mt-2 space-y-1">
          {validation.errors.map((error, i) => (
            <p key={i} className="text-xs text-destructive flex items-center gap-1">
              <XCircle className="h-3 w-3" />
              {error}
            </p>
          ))}
        </div>
      )}

      {/* Success state */}
      {validation.isValid && (
        <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="h-4 w-4 text-green-600" />
            <span className="font-medium text-sm text-green-700 dark:text-green-400">
              Valid GST Number
            </span>
            <Badge variant="outline" className="ml-auto text-xs border-green-500/50 text-green-600">
              Verified Format
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted-foreground">State:</span>
              <p className="font-medium text-foreground">{validation.state}</p>
            </div>
            <div>
              <span className="text-muted-foreground">PAN:</span>
              <p className="font-mono font-medium text-foreground">{validation.pan}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export { validateGST, gstStateCodes };
export type { GSTValidationResult };
