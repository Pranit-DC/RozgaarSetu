// import { useState } from "react";
// import { supabase } from "../supabase-client";

// export const Auth = () => {
//   // State
//   const [isSignUp, setIsSignUp] = useState(false);
//   const [loginMode, setLoginMode] = useState("email"); // "email" or "phone"
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const [otp, setOtp] = useState("");
//   const [otpSent, setOtpSent] = useState(false);
//   const [fullName, setFullName] = useState("");
//   const [role, setRole] = useState("worker");
//   const [location, setLocation] = useState("");
//   const [experience, setExperience] = useState("");
//   const [skills, setSkills] = useState<string[]>([]);
//   const [bio, setBio] = useState("");
//   const skillOptions = ["Gardener", "Plumber", "Electrician", "Carpenter", "Cook", "Driver", "Maid", "Painter", "Mechanic"];

//   // Email sign up/login
//   const handleEmailAuth = async () => {
//     if (isSignUp) {
//       const { data, error } = await supabase.auth.signUp({ email, password });
//       if (error) return alert(error.message);
//       // Save extra profile info
//       if (data.user) {
//         await supabase.from("users").upsert({
//           id: data.user.id,
//           email,
//           full_name: fullName,
//           role,
//           phone_number: phoneNumber,
//           location,
//           skills,
//           experience_years: role === "worker" && experience ? parseInt(experience) : null,
//           bio,
//           age: 20 // optional, can be omitted to use default
//         });
//       }
//       alert("Account created successfully! Please check your email for verification.");
//     } else {
//       const { error } = await supabase.auth.signInWithPassword({ email, password });
//       if (error) alert(error.message);
//     }
//   };

//   // Phone OTP login only (no sign-up)
//   const sendOtp = async () => {
//     const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;
//     const { error } = await supabase.auth.signInWithOtp({ phone: formattedPhone });
//     if (error) return alert(error.message);
//     setOtpSent(true);
//   };

//   const verifyOtp = async () => {
//     const formattedPhone = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;
//     const { error } = await supabase.auth.verifyOtp({ phone: formattedPhone, token: otp, type: "sms" });
//     if (error) return alert(error.message);
//     alert("Logged in successfully!");
//   };

//   // Skill selection for workers
//   const handleSkillToggle = (skill: string) => {
//     setSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
//   };

//   // UI
//   return (
//     <div style={{ maxWidth: "400px", margin: "0 auto", padding: "1rem" }}>
//       <h2>{isSignUp ? "Sign Up" : "Log In"}</h2>
//       <div style={{ marginBottom: "1rem" }}>
//         <button onClick={() => { setLoginMode("email"); setOtpSent(false); }}>Email</button>
//         <button onClick={() => { setLoginMode("phone"); setOtpSent(false); }}>Phone</button>
//       </div>
//       {loginMode === "email" ? (
//         <>
//           {isSignUp && (
//             <>
//               <input placeholder="Full Name" value={fullName} onChange={e => setFullName(e.target.value)} />
//               <select value={role} onChange={e => setRole(e.target.value)}>
//                 <option value="worker">Worker</option>
//                 <option value="employer">Employer</option>
//               </select>
//               <input placeholder="Phone Number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
//               <input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
//               {role === "worker" && (
//                 <>
//                   <div>Skills:</div>
//                   <div style={{ display: "flex", flexWrap: "wrap" }}>
//                     {skillOptions.map(skill => (
//                       <label key={skill} style={{ marginRight: "8px" }}>
//                         <input type="checkbox" checked={skills.includes(skill)} onChange={() => handleSkillToggle(skill)} /> {skill}
//                       </label>
//                     ))}
//                   </div>
//                   <input placeholder="Experience" value={experience} onChange={e => setExperience(e.target.value)} />
//                   <textarea placeholder="Bio" value={bio} onChange={e => setBio(e.target.value)} />
//                 </>
//               )}
//             </>
//           )}
//           <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
//           <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
//           <button onClick={handleEmailAuth}>{isSignUp ? "Sign Up" : "Log In"}</button>
//         </>
//       ) : (
//         <>
//           {!otpSent ? (
//             <>
//               <input placeholder="Phone Number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} />
//               <button onClick={sendOtp}>Send OTP</button>
//             </>
//           ) : (
//             <>
//               <input placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} />
//               <button onClick={verifyOtp}>Verify OTP</button>
//             </>
//           )}
//         </>
//       )}
//       <p>
//         {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
//         <span style={{ color: "blue", cursor: "pointer" }} onClick={() => { setIsSignUp(!isSignUp); setOtpSent(false); }}>
//           {isSignUp ? "Log In" : "Sign Up"}
//         </span>
//       </p>
//     </div>
//   );
// };





















import { useState } from "react";
import { supabase } from "../../../supabase-client";

// TypeScript interfaces for better type safety
interface UserProfile {
  full_name: string;
  role: "worker" | "employer";
  phone_number: string;
  location: string;
  experience?: string;
  skills?: string[];
  bio?: string;
}

type AuthMode = "signup" | "login";
type LoginMethod = "email" | "phone";

// Enhanced Auth Component with better UX and error handling
export const Auth = () => {
  
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  // Authentication flow control
  const [authMode, setAuthMode] = useState<AuthMode>("login");
  const [loginMethod, setLoginMethod] = useState<LoginMethod>("email");
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  // Form data - Authentication
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");

  // Form data - User Profile
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"worker" | "employer">("worker");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);

  // Available skill options for workers
  const skillOptions = [
    "Gardener", "Plumber", "Electrician", "Carpenter", 
    "Cook", "Driver", "Maid", "Painter", "Mechanic"
  ];

  
  // ========================================
  // VALIDATION FUNCTIONS
  // ========================================

  /**
   * Validates email format using a simple regex
   */
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * Validates phone number format (Indian numbers)
   */
  const validatePhoneNumber = (phone: string): boolean => {
    // Remove any spaces, dashes, or parentheses
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    // Check if it's a valid Indian phone number (10 digits or with +91)
    return /^(\+91)?[6-9]\d{9}$/.test(cleanPhone);
  };

  /**
   * Validates password strength
   */
  const validatePassword = (password: string): { isValid: boolean; message: string } => {
    if (password.length < 6) {
      return { isValid: false, message: "Password must be at least 6 characters long" };
    }
    return { isValid: true, message: "" };
  };

  /**
   * Formats phone number to include country code
   */
  const formatPhoneNumber = (phone: string): string => {
    const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
    return cleanPhone.startsWith("+91") ? cleanPhone : `+91${cleanPhone}`;
  };

  
  // ========================================
  // AUTHENTICATION FUNCTIONS - EMAIL
  // ========================================

  /**
   * Handles email-based authentication (both signup and login)
   */
  const handleEmailAuth = async () => {
    // Validate inputs
    if (!validateEmail(email)) {
      alert("Please enter a valid email address");
      return;
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      alert(passwordValidation.message);
      return;
    }

    // Additional validation for signup
    if (authMode === "signup") {
      if (!fullName.trim()) {
        alert("Please enter your full name");
        return;
      }
      if (!location.trim()) {
        alert("Please enter your location");
        return;
      }
    }

    setIsLoading(true);

    try {
      if (authMode === "signup") {
        // Sign up new user
        const { data, error } = await supabase.auth.signUp({ 
          email, 
          password 
        });

        if (error) {
          console.error("Signup error:", error);
          alert(`Signup failed: ${error.message}`);
          return;
        }

        // Save additional profile information
        if (data.user) {
          await saveUserProfile(data.user.id);
          alert("Account created successfully! Please check your email for verification.");
        }

      } else {
        // Sign in existing user
        const { error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        });

        if (error) {
          console.error("Login error:", error);
          alert(`Login failed: ${error.message}`);
          return;
        }

        alert("Login successful!");
      }

    } catch (err) {
      console.error("Unexpected error during email auth:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  
  // ========================================
  // AUTHENTICATION FUNCTIONS - PHONE/OTP
  // ========================================

  /**
   * Sends OTP to phone number for authentication
   */
  const sendOtp = async () => {
    // Validate phone number
    if (!validatePhoneNumber(phoneNumber)) {
      alert("Please enter a valid Indian phone number (10 digits)");
      return;
    }

    // Additional validation for signup
    if (authMode === "signup") {
      if (!fullName.trim()) {
        alert("Please enter your full name");
        return;
      }
      if (!location.trim()) {
        alert("Please enter your location");
        return;
      }
      
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        alert(passwordValidation.message);
        return;
      }
    }

    setIsLoading(true);
    const formattedPhone = formatPhoneNumber(phoneNumber);

    try {
      if (authMode === "signup") {
        // Phone signup requires password
        const { data, error } = await supabase.auth.signUp({
          phone: formattedPhone,
          password,
        });

        if (error) {
          console.error("Phone signup error:", error);
          alert(`Signup failed: ${error.message}`);
          return;
        }

        setOtpSent(true);
        alert("OTP sent to your phone number. Please enter the code to verify.");

        // Save profile info if user is created
        if (data.user) {
          await saveUserProfile(data.user.id);
        }

      } else {
        // Phone login with OTP
        const { error } = await supabase.auth.signInWithOtp({
          phone: formattedPhone,
        });

        if (error) {
          console.error("OTP send error:", error);
          alert(`Failed to send OTP: ${error.message}`);
          return;
        }

        setOtpSent(true);
        alert("OTP sent to your phone number. Please enter the code to login.");
      }

    } catch (err) {
      console.error("Unexpected error sending OTP:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Verifies the OTP entered by user
   */
  const verifyOtp = async () => {
    if (!otp.trim()) {
      alert("Please enter the OTP");
      return;
    }

    if (otp.length !== 6) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    const formattedPhone = formatPhoneNumber(phoneNumber);

    try {
      const { error } = await supabase.auth.verifyOtp({
        phone: formattedPhone,
        token: otp,
        type: "sms",
      });

      if (error) {
        console.error("OTP verification error:", error);
        alert(`OTP verification failed: ${error.message}`);
        return;
      }

      alert("Phone number verified successfully!");

    } catch (err) {
      console.error("Unexpected error verifying OTP:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  
  // ========================================
  // USER PROFILE FUNCTIONS
  // ========================================

  /**
   * Saves additional user profile information to the database
   */
  const saveUserProfile = async (userId: string) => {
    try {
      const profileData: Partial<UserProfile> = {
        full_name: fullName,
        role: role,
        phone_number: loginMethod === "phone" ? formatPhoneNumber(phoneNumber) : "",
        location: location,
      };

      // Add worker-specific fields
      if (role === "worker") {
        profileData.experience = experience;
        profileData.skills = skills;
        profileData.bio = bio;
      }

      const { error } = await supabase
        .from("users")
        .upsert(profileData)
        .eq("id", userId);

      if (error) {
        console.error("Error saving user profile:", error);
        alert("Account created but failed to save profile. Please update your profile later.");
      }

    } catch (err) {
      console.error("Unexpected error saving profile:", err);
    }
  };

  /**
   * Handles skill selection for workers
   */
  const handleSkillToggle = (skill: string) => {
    setSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  
  // ========================================
  // UI HELPER FUNCTIONS
  // ========================================

  /**
   * Resets form state when switching between modes
   */
  const switchAuthMode = () => {
    setAuthMode(authMode === "signup" ? "login" : "signup");
    setOtpSent(false);
    setOtp("");
    // Keep email/phone but clear password for security
    setPassword("");
  };

  /**
   * Switches login method and resets related state
   */
  const switchLoginMethod = (method: LoginMethod) => {
    setLoginMethod(method);
    setOtpSent(false);
    setOtp("");
  };

  
  // ========================================
  // RENDER COMPONENT
  // ========================================

  return (
    <div style={{ 
      maxWidth: "450px", 
      margin: "0 auto", 
      padding: "30px",
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      fontFamily: "Arial, sans-serif"
    }}>
      
      {/* ========================================
          HEADER SECTION
          ======================================== */}
      
      <div style={{ textAlign: "center", marginBottom: "30px" }}>
        <h1 style={{ 
          color: "#333", 
          marginBottom: "10px", 
          fontSize: "28px",
          fontWeight: "bold"
        }}>
          {authMode === "signup" ? "Create Account" : "Welcome Back"}
        </h1>
        <p style={{ color: "#666", fontSize: "14px" }}>
          {authMode === "signup" 
            ? "Join our platform to find work or hire skilled workers"
            : "Sign in to your account to continue"
          }
        </p>
      </div>

      
      {/* ========================================
          LOGIN METHOD SELECTOR
          ======================================== */}
      
      <div style={{ 
        display: "flex", 
        marginBottom: "25px",
        backgroundColor: "#f8f9fa",
        borderRadius: "8px",
        padding: "4px"
      }}>
        <button 
          onClick={() => switchLoginMethod("email")}
          style={{
            flex: 1,
            padding: "10px",
            border: "none",
            backgroundColor: loginMethod === "email" ? "white" : "transparent",
            color: loginMethod === "email" ? "#007bff" : "#666",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          📧 Email
        </button>
        <button 
          onClick={() => switchLoginMethod("phone")}
          style={{
            flex: 1,
            padding: "10px",
            border: "none",
            backgroundColor: loginMethod === "phone" ? "white" : "transparent",
            color: loginMethod === "phone" ? "#007bff" : "#666",
            borderRadius: "6px",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s ease"
          }}
        >
          📱 Phone
        </button>
      </div>

      
      {/* ========================================
          FORM FIELDS - COMMON SIGNUP FIELDS
          ======================================== */}
      
      {authMode === "signup" && !otpSent && (
        <div style={{ marginBottom: "20px" }}>
          
          {/* Full Name */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "5px", 
              fontWeight: "500",
              color: "#333"
            }}>
              Full Name *
            </label>
            <input 
              type="text"
              placeholder="Enter your full name" 
              value={fullName} 
              onChange={(e) => setFullName(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* Role Selection */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "5px", 
              fontWeight: "500",
              color: "#333"
            }}>
              I am a *
            </label>
            <select 
              value={role} 
              onChange={(e) => setRole(e.target.value as "worker" | "employer")}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box"
              }}
            >
              <option value="worker">🔨 Worker (Looking for jobs)</option>
              <option value="employer">👔 Employer (Hiring workers)</option>
            </select>
          </div>

          {/* Location */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "5px", 
              fontWeight: "500",
              color: "#333"
            }}>
              Location *
            </label>
            <input 
              type="text"
              placeholder="Enter your city/area" 
              value={location} 
              onChange={(e) => setLocation(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* Worker-specific fields */}
          {role === "worker" && (
            <>
              {/* Skills Selection */}
              <div style={{ marginBottom: "15px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "8px", 
                  fontWeight: "500",
                  color: "#333"
                }}>
                  Skills (Select all that apply)
                </label>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", 
                  gap: "8px" 
                }}>
                  {skillOptions.map((skill) => (
                    <label 
                      key={skill}
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        fontSize: "12px",
                        cursor: "pointer",
                        padding: "4px"
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={skills.includes(skill)}
                        onChange={() => handleSkillToggle(skill)}
                        style={{ marginRight: "6px" }}
                      />
                      {skill}
                    </label>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div style={{ marginBottom: "15px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "5px", 
                  fontWeight: "500",
                  color: "#333"
                }}>
                  Experience
                </label>
                <input 
                  type="text"
                  placeholder="e.g., 2 years, Beginner, Expert" 
                  value={experience} 
                  onChange={(e) => setExperience(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
              </div>

              {/* Bio */}
              <div style={{ marginBottom: "15px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "5px", 
                  fontWeight: "500",
                  color: "#333"
                }}>
                  Bio (Optional)
                </label>
                <textarea 
                  placeholder="Tell employers about yourself..." 
                  value={bio} 
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box",
                    resize: "vertical"
                  }}
                />
              </div>
            </>
          )}
        </div>
      )}

      
      {/* ========================================
          FORM FIELDS - EMAIL AUTHENTICATION
          ======================================== */}
      
      {loginMethod === "email" && (
        <div style={{ marginBottom: "20px" }}>
          
          {/* Email Field */}
          <div style={{ marginBottom: "15px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "5px", 
              fontWeight: "500",
              color: "#333"
            }}>
              Email Address *
            </label>
            <input 
              type="email" 
              placeholder="Enter your email address" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* Password Field */}
          <div style={{ marginBottom: "20px" }}>
            <label style={{ 
              display: "block", 
              marginBottom: "5px", 
              fontWeight: "500",
              color: "#333"
            }}>
              Password *
            </label>
            <input 
              type="password" 
              placeholder={authMode === "signup" ? "Create a password (min 6 characters)" : "Enter your password"} 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box"
              }}
            />
          </div>

          {/* Submit Button */}
          <button 
            onClick={handleEmailAuth}
            disabled={isLoading}
            style={{
              width: "100%",
              padding: "14px",
              backgroundColor: isLoading ? "#6c757d" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: isLoading ? "not-allowed" : "pointer",
              transition: "background-color 0.2s ease"
            }}
          >
            {isLoading ? "Processing..." : (authMode === "signup" ? "Create Account" : "Sign In")}
          </button>
        </div>
      )}

      
      {/* ========================================
          FORM FIELDS - PHONE AUTHENTICATION
          ======================================== */}
      
      {loginMethod === "phone" && (
        <div style={{ marginBottom: "20px" }}>
          
          {/* Password for Phone Signup */}
          {authMode === "signup" && !otpSent && (
            <div style={{ marginBottom: "15px" }}>
              <label style={{ 
                display: "block", 
                marginBottom: "5px", 
                fontWeight: "500",
                color: "#333"
              }}>
                Password *
              </label>
              <input 
                type="password" 
                placeholder="Create a password (min 6 characters)" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box"
                }}
              />
            </div>
          )}

          {!otpSent ? (
            <>
              {/* Phone Number Field */}
              <div style={{ marginBottom: "15px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "5px", 
                  fontWeight: "500",
                  color: "#333"
                }}>
                  Phone Number *
                </label>
                <input 
                  type="tel" 
                  placeholder="Enter 10-digit mobile number" 
                  value={phoneNumber} 
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px",
                    boxSizing: "border-box"
                  }}
                />
                <small style={{ color: "#666", fontSize: "12px" }}>
                  Format: 9876543210 or +919876543210
                </small>
              </div>

              {/* Send OTP Button */}
              <button 
                onClick={sendOtp}
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: isLoading ? "#6c757d" : "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "background-color 0.2s ease"
                }}
              >
                {isLoading ? "Sending..." : (authMode === "signup" ? "Sign Up with OTP" : "Send OTP")}
              </button>
            </>
          ) : (
            <>
              {/* OTP Input Field */}
              <div style={{ marginBottom: "15px" }}>
                <label style={{ 
                  display: "block", 
                  marginBottom: "5px", 
                  fontWeight: "500",
                  color: "#333"
                }}>
                  Enter OTP *
                </label>
                <input 
                  type="text" 
                  placeholder="Enter 6-digit OTP" 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength={6}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "18px",
                    textAlign: "center",
                    letterSpacing: "4px",
                    boxSizing: "border-box"
                  }}
                />
                <small style={{ color: "#666", fontSize: "12px" }}>
                  OTP sent to {formatPhoneNumber(phoneNumber)}
                </small>
              </div>

              {/* Verify OTP Button */}
              <button 
                onClick={verifyOtp}
                disabled={isLoading}
                style={{
                  width: "100%",
                  padding: "14px",
                  backgroundColor: isLoading ? "#6c757d" : "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  transition: "background-color 0.2s ease"
                }}
              >
                {isLoading ? "Verifying..." : "Verify OTP"}
              </button>

              {/* Resend OTP Option */}
              <div style={{ textAlign: "center", marginTop: "15px" }}>
                <button
                  onClick={() => setOtpSent(false)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#007bff",
                    fontSize: "14px",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  ← Back to phone number
                </button>
              </div>
            </>
          )}
        </div>
      )}

      
      {/* ========================================
          FOOTER SECTION - SWITCH AUTH MODE
          ======================================== */}
      
      <div style={{ 
        textAlign: "center", 
        paddingTop: "20px", 
        borderTop: "1px solid #eee" 
      }}>
        <p style={{ color: "#666", fontSize: "14px" }}>
          {authMode === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={switchAuthMode}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              fontSize: "14px",
              fontWeight: "500",
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            {authMode === "signup" ? "Sign In" : "Create Account"}
          </button>
        </p>
      </div>
      
    </div>
  );
};
