// import { useEffect, useState } from "react";
// import { supabase } from "../supabase-client";

// export default function JobBoard({ session }: { session: any }) {
//   // Show/hide applications for employer
//   const [showApplications, setShowApplications] = useState(false);
//   const [jobs, setJobs] = useState<any[]>([]);
//   const [applications, setApplications] = useState<any[]>([]);
//   // Job posting state for employer
//   const [newJob, setNewJob] = useState({
//     title: "",
//     description: "",
//     location: "",
//     pay: "",
//     worker_type: "maid",
//   });
//   const [posting, setPosting] = useState(false);

//   const userEmail = session.user.email;

//   // Determine if current user is employer or worker (you can store role in a profile table)
//   const [role, setRole] = useState<"worker" | "employer">("worker");
//   const fetchUserRole = async () => {
//     const { data, error } = await supabase
//       .from("users")
//       .select("role")
//       .eq("email", userEmail)   // find logged-in user by email
//       .single();                // get only one row

//     if (error) {
//       console.error("Error fetching user role:", error);
//     } else if (data) {
//     setRole(data.role); // update React state
//     }
//   };

//   const fetchJobs = async () => {
//     const { data, error } = await supabase
//       .from("jobs")
//       .select(`
//       *,
//       users ( full_name, email )
//       `)
//       .order("created_at", { ascending: false });

//     if (error) console.error(error);
//     else setJobs(data || []);
//   };

//   const fetchUsers = async () => {
//     const { data, error } = await supabase
//       .from("users")
//       .select("*")
//       .order("created_at", { ascending: false });

//     if (error) console.error(error);
//     else console.log("Users:", data); // or setUsers(data || [])
//   };


//   const fetchApplications = async () => {
//     const { data, error } = await supabase
//       .from("applications")
//       .select("*, jobs(title, employer_email)")
//       .order("created_at", { ascending: false });

//     if (error) console.error(error);
//     else setApplications(data || []);
//   };

//   const applyToJob = async (jobId: number) => {
//     const confirmed = window.confirm("Are you sure you want to apply for this job?");
//     if (!confirmed) return;

//     // 1. Check if already applied
//     const { data: existing, error: checkError } = await supabase
//     .from("applications")
//     .select("*")
//     .eq("job_id", jobId)
//     .eq("worker_id", session.user.id)
//     .maybeSingle();

//     if (checkError) {
//     console.error("Error checking application:", checkError);
//     return;
//     }

//     if (existing) {
//     alert("You have already applied for this job.");
//     return;
//     }
//     //insert new application
//     const { error } = await supabase.from("applications").insert({
//       job_id: jobId,
//       worker_id: session.user.id,
//       status: "pending",
//     }).select().single();

//     if (error) {
//       console.error(error);
//     } else {
//     // Update local state so UI shows "Pending" immediately
//     setApplications((prev) => [
//       ...prev,
//       { job_id: jobId, worker_email: userEmail, status: "pending" }
//       ]);
//     }
//   };


//   const acceptApplication = async (applicationId: number) => {
//     const { error } = await supabase
//       .from("applications")
//       .update({ status: "accepted" })
//       .eq("id", applicationId);

//     if (error) console.error(error);
//   };

//   useEffect(() => {
//     fetchJobs();
//     fetchApplications();
//     fetchUserRole();

//     // Real-time job updates
//     const jobChannel = supabase
//       .channel("jobs-changes")
//       .on("postgres_changes", { event: "*", schema: "public", table: "jobs" }, fetchJobs)
//       .subscribe();

//     // Real-time application updates
//     const appChannel = supabase
//       .channel("applications-changes")
//       .on("postgres_changes", { event: "*", schema: "public", table: "applications" }, fetchApplications)
//       .subscribe();

//     return () => {
//       supabase.removeChannel(jobChannel);
//       supabase.removeChannel(appChannel);
//     };
//   }, []);


//   //UI elements
//   // Handler for posting a job
//   const handlePostJob = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setPosting(true);
//     const { error } = await supabase.from("jobs").insert({
//       ...newJob,
//       employer_id: session.user.id,
//     });
//     setPosting(false);
//     if (error) {
//       alert("Error posting job: " + error.message);
//     } else {
//       setNewJob({ title: "", description: "", location: "", pay: "", worker_type: "maid" });
//       fetchJobs();
//     }
//   };

//   return (
//     <div>
//       {role === "employer" && (
//         <>
//           <div style={{ border: "1px solid #aaa", padding: "16px", marginBottom: "20px" }}>
//             <h2>Post a Job</h2>
//             <form onSubmit={handlePostJob}>
//               <input
//                 type="text"
//                 placeholder="Job Title"
//                 value={newJob.title}
//                 onChange={e => setNewJob({ ...newJob, title: e.target.value })}
//                 required
//                 style={{ marginBottom: "8px", width: "100%" }}
//               />
//               <textarea
//                 placeholder="Job Description"
//                 value={newJob.description}
//                 onChange={e => setNewJob({ ...newJob, description: e.target.value })}
//                 required
//                 style={{ marginBottom: "8px", width: "100%" }}
//               />
//               <input
//                 type="text"
//                 placeholder="Location"
//                 value={newJob.location}
//                 onChange={e => setNewJob({ ...newJob, location: e.target.value })}
//                 required
//                 style={{ marginBottom: "8px", width: "100%" }}
//               />
//               <input
//                 type="text"
//                 placeholder="Pay"
//                 value={newJob.pay}
//                 onChange={e => setNewJob({ ...newJob, pay: e.target.value })}
//                 required
//                 style={{ marginBottom: "8px", width: "100%" }}
//               />
//               <select
//                 value={newJob.worker_type}
//                 onChange={e => setNewJob({ ...newJob, worker_type: e.target.value })}
//                 style={{ marginBottom: "8px", width: "100%" }}
//               >
//                 <option value="maid">Maid</option>
//                 <option value="driver">Driver</option>
//                 <option value="carpenter">Carpenter</option>
//                 <option value="cook">Cook</option>
//                 <option value="gardener">Gardener</option>
//                 <option value="electrician">Electrician</option>
//                 <option value="plumber">Plumber</option>
//               </select>
//               <button type="submit" disabled={posting} style={{ width: "100%" }}>
//                 {posting ? "Posting..." : "Post Job"}
//               </button>
//             </form>
//           </div>
//           <button onClick={() => setShowApplications((prev) => !prev)} style={{ marginBottom: "16px" }}>
//             {showApplications ? "Hide Applications" : "Show Applications"}
//           </button>
//           {showApplications && (
//             <div>
//               <h2>Applications</h2>
//               {applications
//                 .filter((app) => app.jobs.employer_id === session.user.id)
//                 .map((app) => (
//                   <div key={app.id} style={{ border: "1px solid green", padding: "10px", margin: "10px" }}>
//                     <p><strong>Job:</strong> {app.jobs.title}</p>
//                     <p><strong>Applicant Name:</strong> {app.users?.full_name || "Unknown"}</p>
//                     <p><strong>Applicant Email:</strong> {app.users?.email || app.worker_email || "Unknown"}</p>
//                     <p><strong>Status:</strong> {app.status}</p>
//                     {app.status === "pending" && (
//                       <button onClick={() => acceptApplication(app.id)}>Accept</button>
//                     )}
//                   </div>
//                 ))}
//             </div>
//           )}
//         </>
//       )}

//       <h2>Job Listings</h2>
//       {jobs.map((job) => (
//         <div key={job.id} style={{ border: "1px solid gray", padding: "10px", margin: "10px" }}>
//           <p><strong>Employer:</strong> {job.users?.full_name || "Unknown"}</p>
//           <p><strong>Email:</strong> {job.users?.email || "Unknown"}</p>
//           <h3>{job.title}</h3>
//           <p>{job.description}</p>
//           <p><strong>Location:</strong> {job.location}</p>
//           <p><strong>Pay:</strong> {job.pay}</p>
//           <p><strong>Worker Type:</strong> {job.worker_type || "-"}</p>

//           {/* Only show Apply button for workers */}
//           {role === "worker" && (
//             applications.some((app) => app.job_id === job.id && app.worker_id === session.user.id)
//               ? (<button disabled>Pending</button>)
//               : (<button onClick={() => applyToJob(job.id)}>Apply</button>)
//           )}
//         </div>
//       ))}

//       {role === "employer" && (
//         <div>
//           <h2>Applications</h2>
//           {applications
//             .filter((app) => app.jobs.employer_email === userEmail)
//             .map((app) => (
//               <div key={app.id} style={{ border: "1px solid green", padding: "10px", margin: "10px" }}>
//                 <p><strong>Job:</strong> {app.jobs.title}</p>
//                 <p><strong>Applicant:</strong> {app.worker_email}</p>
//                 <p><strong>Status:</strong> {app.status}</p>
//                 {app.status === "pending" && (
//                   <button onClick={() => acceptApplication(app.id)}>Accept</button>
//                 )}
//               </div>
//             ))}
//         </div>
//       )}

//       {role === "worker" && (
//         <div>
//           <h2>My Applications</h2>
//           {applications
//             .filter((app) => app.worker_id === session.user.id)
//             .map((app) => (
//               <div key={app.id}>
//                 <p><strong>Job:</strong> {app.jobs.title}</p>
//                 <p><strong>Status:</strong> {app.status}</p>
//               </div>
//             ))}
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { supabase } from "../../../supabase-client";

// TypeScript interfaces for better type safety
interface Job {
  id: number;
  title: string;
  description: string;
  location: string;
  pay: string;
  worker_type: string;
  employer_id: string;
  created_at: string;
  users?: {
    full_name: string;
    email: string;
  };
}

interface Application {
  id: number;
  job_id: number;
  worker_id: string;
  worker_email?: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  jobs: {
    title: string;
    employer_email?: string;
    employer_id?: string;
  };
  users?: {
    full_name: string;
    email: string;
  };
}

interface NewJobForm {
  title: string;
  description: string;
  location: string;
  pay: string;
  worker_type: string;
}

// Main JobBoard Component
export default function JobBoard({ session }: { session: any }) {
  
  // ========================================
  // STATE MANAGEMENT
  // ========================================
  
  // User role and authentication
  const [role, setRole] = useState<"worker" | "employer">("worker");
  const userEmail = session.user.email;

  // Job-related state
  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);

  // UI state for employer
  const [showApplications, setShowApplications] = useState(false);
  const [posting, setPosting] = useState(false);

  // Form state for new job posting
  const [newJob, setNewJob] = useState<NewJobForm>({
    title: "",
    description: "",
    location: "",
    pay: "",
    worker_type: "maid",
  });

  
  // ========================================
  // DATABASE OPERATIONS
  // ========================================

  /**
   * Fetches the current user's role from the database
   * Determines if user is a worker or employer
   */
  const fetchUserRole = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("role")
        .eq("email", userEmail)
        .single();

      if (error) {
        console.error("Error fetching user role:", error);
        return;
      }

      if (data) {
        setRole(data.role);
      }
    } catch (err) {
      console.error("Unexpected error fetching user role:", err);
    }
  };

  /**
   * Fetches all job listings with employer information
   * Orders by most recent first
   */
  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select(`
          *,
          users ( full_name, email )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching jobs:", error);
        return;
      }

      setJobs(data || []);
    } catch (err) {
      console.error("Unexpected error fetching jobs:", err);
    }
  };

  /**
   * Fetches all job applications with related job and user information
   * Used by both workers and employers
   */
  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from("applications")
        .select(`
          *, 
          jobs(*),
          users(*)
        `)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching applications:", error);
        return;
      }

      setApplications(data || []);
    } catch (err) {
      console.error("Unexpected error fetching applications:", err);
    }
  };

  /**
   * Debug function to fetch and log all users
   * Can be used for development/testing purposes
   */
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching users:", error);
        return;
      }

      console.log("Users:", data);
    } catch (err) {
      console.error("Unexpected error fetching users:", err);
    }
  };

  
  // ========================================
  // USER ACTIONS - WORKER FUNCTIONS
  // ========================================

  /**
   * Handles job application submission by workers
   * Checks for duplicate applications before submitting
   */
  const applyToJob = async (jobId: number) => {
    // Confirm user wants to apply
    const confirmed = window.confirm("Are you sure you want to apply for this job?");
    if (!confirmed) return;

    try {
      // Check if user has already applied to this job
      const { data: existingApplication, error: checkError } = await supabase
        .from("applications")
        .select("*")
        .eq("job_id", jobId)
        .eq("worker_id", session.user.id)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking existing application:", checkError);
        alert("Error checking application status. Please try again.");
        return;
      }

      if (existingApplication) {
        alert("You have already applied for this job.");
        return;
      }

      // Submit new application
      const { error: insertError } = await supabase
        .from("applications")
        .insert({
          job_id: jobId,
          worker_id: session.user.id,
          status: "pending",
        })
        .select()
        .single();

      if (insertError) {
        console.error("Error submitting application:", insertError);
        alert("Error submitting application. Please try again.");
        return;
      }

      // Update local state to show "Pending" immediately
      setApplications((prev) => [
        ...prev,
        { 
          id: Date.now(), // Temporary ID for UI update
          job_id: jobId, 
          worker_id: session.user.id,
          worker_email: userEmail, 
          status: "pending",
          created_at: new Date().toISOString(),
          jobs: { title: "Loading..." }
        } as Application
      ]);

      alert("Application submitted successfully!");

    } catch (err) {
      console.error("Unexpected error applying to job:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  
  // ========================================
  // USER ACTIONS - EMPLOYER FUNCTIONS
  // ========================================

  /**
   * Handles job posting form submission by employers
   * Creates new job listing in the database
   */
  const handlePostJob = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);

    try {
      const { error } = await supabase
        .from("jobs")
        .insert({
          ...newJob,
          employer_id: session.user.id,
        });

      if (error) {
        console.error("Error posting job:", error);
        alert("Error posting job: " + error.message);
        return;
      }

      // Reset form and refresh job listings
      setNewJob({ 
        title: "", 
        description: "", 
        location: "", 
        pay: "", 
        worker_type: "maid" 
      });
      
      await fetchJobs();
      alert("Job posted successfully!");

    } catch (err) {
      console.error("Unexpected error posting job:", err);
      alert("An unexpected error occurred. Please try again.");
    } finally {
      setPosting(false);
    }
  };

  /**
   * Handles accepting job applications by employers
   * Updates application status to "accepted"
   */
  const acceptApplication = async (applicationId: number) => {
    const confirmed = window.confirm("Are you sure you want to accept this application?");
    if (!confirmed) return;

    try {
      const { error } = await supabase
        .from("applications")
        .update({ status: "accepted" })
        .eq("id", applicationId);

      if (error) {
        console.error("Error accepting application:", error);
        alert("Error accepting application. Please try again.");
        return;
      }

      // Refresh applications to show updated status
      await fetchApplications();
      alert("Application accepted successfully!");

    } catch (err) {
      console.error("Unexpected error accepting application:", err);
      alert("An unexpected error occurred. Please try again.");
    }
  };

  
  // ========================================
  // COMPONENT LIFECYCLE
  // ========================================

  /**
   * Initial data loading and real-time subscription setup
   */
  useEffect(() => {
    // Load initial data
    const loadInitialData = async () => {
      await Promise.all([
        fetchJobs(),
        fetchApplications(),
        fetchUserRole()
      ]);
    };

    loadInitialData();

    // Set up real-time subscriptions for live updates
    const jobChannel = supabase
      .channel("jobs-changes")
      .on("postgres_changes", { 
        event: "*", 
        schema: "public", 
        table: "jobs" 
      }, fetchJobs)
      .subscribe();

    const applicationChannel = supabase
      .channel("applications-changes")
      .on("postgres_changes", { 
        event: "*", 
        schema: "public", 
        table: "applications" 
      }, fetchApplications)
      .subscribe();

    // Cleanup subscriptions on component unmount
    return () => {
      supabase.removeChannel(jobChannel);
      supabase.removeChannel(applicationChannel);
    };
  }, []);

  
  // ========================================
  // HELPER FUNCTIONS
  // ========================================

  /**
   * Checks if the current worker has already applied to a specific job
   */
  const hasAppliedToJob = (jobId: number): boolean => {
    return applications.some((app) => 
      app.job_id === jobId && app.worker_id === session.user.id
    );
  };

  /**
   * Gets applications for jobs posted by the current employer
   */
  const getEmployerApplications = (): Application[] => {
    return applications.filter((app) => 
      app.jobs.employer_id === session.user.id
    );
  };

  /**
   * Gets applications submitted by the current worker
   */
  const getWorkerApplications = (): Application[] => {
    return applications.filter((app) => 
      app.worker_id === session.user.id
    );
  };

  
  // ========================================
  // RENDER COMPONENT
  // ========================================

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      
      {/* ========================================
          EMPLOYER SECTION - JOB POSTING FORM
          ======================================== */}
      
      {role === "employer" && (
        <div style={{ 
          border: "2px solid #007bff", 
          borderRadius: "8px",
          padding: "20px", 
          marginBottom: "30px",
          backgroundColor: "#f8f9fa"
        }}>
          <h2 style={{ color: "#007bff", marginBottom: "20px" }}>Post a New Job</h2>
          
          <form onSubmit={handlePostJob}>
            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Job Title *
              </label>
              <input
                type="text"
                placeholder="e.g. House Cleaning, Carpentry Work, etc."
                value={newJob.title}
                onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                required
                style={{ 
                  width: "100%", 
                  padding: "10px", 
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px"
                }}
              />
            </div>

            <div style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Job Description *
              </label>
              <textarea
                placeholder="Describe the job requirements, duties, and any special instructions..."
                value={newJob.description}
                onChange={e => setNewJob({ ...newJob, description: e.target.value })}
                required
                rows={4}
                style={{ 
                  width: "100%", 
                  padding: "10px", 
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px",
                  resize: "vertical"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "15px", marginBottom: "15px" }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Location *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mumbai, Delhi, etc."
                  value={newJob.location}
                  onChange={e => setNewJob({ ...newJob, location: e.target.value })}
                  required
                  style={{ 
                    width: "100%", 
                    padding: "10px", 
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "14px"
                  }}
                />
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                  Pay *
                </label>
                <input
                  type="text"
                  placeholder="e.g. ₹500/day, ₹15000/month"
                  value={newJob.pay}
                  onChange={e => setNewJob({ ...newJob, pay: e.target.value })}
                  required
                  style={{ 
                    width: "100%", 
                    padding: "10px", 
                    border: "1px solid #ccc",
                    borderRadius: "4px",
                    fontSize: "14px"
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: "20px" }}>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
                Worker Type *
              </label>
              <select
                value={newJob.worker_type}
                onChange={e => setNewJob({ ...newJob, worker_type: e.target.value })}
                style={{ 
                  width: "100%", 
                  padding: "10px", 
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                  fontSize: "14px"
                }}
              >
                <option value="maid">Maid</option>
                <option value="driver">Driver</option>
                <option value="carpenter">Carpenter</option>
                <option value="cook">Cook</option>
                <option value="gardener">Gardener</option>
                <option value="electrician">Electrician</option>
                <option value="plumber">Plumber</option>
              </select>
            </div>

            <button 
              type="submit" 
              disabled={posting} 
              style={{ 
                width: "100%",
                padding: "12px",
                backgroundColor: posting ? "#6c757d" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                fontSize: "16px",
                fontWeight: "bold",
                cursor: posting ? "not-allowed" : "pointer"
              }}
            >
              {posting ? "Posting Job..." : "Post Job"}
            </button>
          </form>
        </div>
      )}

      
      {/* ========================================
          EMPLOYER SECTION - APPLICATIONS MANAGEMENT
          ======================================== */}
      
      {role === "employer" && (
        <div style={{ marginBottom: "30px" }}>
          <button 
            onClick={() => setShowApplications(prev => !prev)} 
            style={{ 
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "4px",
              fontSize: "14px",
              cursor: "pointer",
              marginBottom: "20px"
            }}
          >
            {showApplications ? "Hide Applications" : "Show Applications"}
          </button>

          {showApplications && (
            <div style={{ 
              border: "2px solid #28a745", 
              borderRadius: "8px",
              padding: "20px",
              backgroundColor: "#f8fff9"
            }}>
              <h2 style={{ color: "#28a745", marginBottom: "20px" }}>
                Applications for Your Jobs
              </h2>
              
              {getEmployerApplications().length === 0 ? (
                <p style={{ textAlign: "center", color: "#6c757d", fontStyle: "italic" }}>
                  No applications received yet.
                </p>
              ) : (
                <div style={{ display: "grid", gap: "15px" }}>
                  {getEmployerApplications().map((app) => (
                    <div 
                      key={app.id} 
                      style={{ 
                        border: "1px solid #28a745", 
                        borderRadius: "6px",
                        padding: "15px",
                        backgroundColor: "white"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                        <div>
                          <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>
                            {app.jobs.title}
                          </h4>
                          <p style={{ margin: "5px 0", color: "#555" }}>
                            <strong>Applicant:</strong> {app.users?.full_name || "Unknown"}
                          </p>
                          <p style={{ margin: "5px 0", color: "#555" }}>
                            <strong>Email:</strong> {app.users?.email || app.worker_email || "Unknown"}
                          </p>
                          <p style={{ margin: "5px 0" }}>
                            <strong>Status:</strong> 
                            <span style={{ 
                              color: app.status === "accepted" ? "#28a745" : "#ffc107",
                              fontWeight: "bold",
                              marginLeft: "8px"
                            }}>
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </span>
                          </p>
                        </div>
                        
                        {app.status === "pending" && (
                          <button 
                            onClick={() => acceptApplication(app.id)}
                            style={{
                              padding: "8px 16px",
                              backgroundColor: "#28a745",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "14px",
                              cursor: "pointer"
                            }}
                          >
                            Accept Application
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      
      {/* ========================================
          MAIN SECTION - JOB LISTINGS
          ======================================== */}
      
      <div style={{ marginBottom: "30px" }}>
        <h2 style={{ color: "#333", marginBottom: "20px", fontSize: "28px" }}>
          Available Jobs
        </h2>
        
        {jobs.length === 0 ? (
          <p style={{ textAlign: "center", color: "#6c757d", fontStyle: "italic" }}>
            No jobs available at the moment. Check back later!
          </p>
        ) : (
          <div style={{ display: "grid", gap: "20px" }}>
            {jobs.map((job) => (
              <div 
                key={job.id} 
                style={{ 
                  border: "1px solid #ddd", 
                  borderRadius: "8px",
                  padding: "20px",
                  backgroundColor: "white",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}
              >
                <div style={{ marginBottom: "15px" }}>
                  <h3 style={{ margin: "0 0 10px 0", color: "#007bff", fontSize: "22px" }}>
                    {job.title}
                  </h3>
                  <p style={{ margin: "5px 0", color: "#666", fontSize: "14px" }}>
                    <strong>Posted by:</strong> {job.users?.full_name || "Unknown"} 
                    ({job.users?.email || "Unknown"})
                  </p>
                </div>

                <div style={{ marginBottom: "15px" }}>
                  <p style={{ margin: "8px 0", lineHeight: "1.5", color: "#555" }}>
                    {job.description}
                  </p>
                </div>

                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
                  gap: "10px",
                  marginBottom: "15px"
                }}>
                  <p style={{ margin: "0", color: "#555" }}>
                    <strong>📍 Location:</strong> {job.location}
                  </p>
                  <p style={{ margin: "0", color: "#555" }}>
                    <strong>💰 Pay:</strong> {job.pay}
                  </p>
                  <p style={{ margin: "0", color: "#555" }}>
                    <strong>👨‍💼 Worker Type:</strong> {job.worker_type}
                  </p>
                </div>

                {/* Show Apply button only for workers */}
                {role === "worker" && (
                  <div style={{ textAlign: "right" }}>
                    {(() => {
                      const myApp = applications.find(app => app.job_id === job.id && app.worker_id === session.user.id);
                      if (myApp) {
                        if (myApp.status === "accepted") {
                          return (
                            <button 
                              disabled 
                              style={{
                                padding: "10px 20px",
                                backgroundColor: "green",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "14px",
                                cursor: "not-allowed",
                                fontWeight: "bold"
                              }}
                            >
                              Accepted
                            </button>
                          );
                        }
                        if (myApp.status === "rejected") {
                          return (
                            <button 
                              disabled 
                              style={{
                                padding: "10px 20px",
                                backgroundColor: "red",
                                color: "white",
                                border: "none",
                                borderRadius: "4px",
                                fontSize: "14px",
                                cursor: "not-allowed",
                                fontWeight: "bold"
                              }}
                            >
                              Rejected
                            </button>
                          );
                        }
                        return (
                          <button 
                            disabled 
                            style={{
                              padding: "10px 20px",
                              backgroundColor: "#6c757d",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "14px",
                              cursor: "not-allowed",
                              fontWeight: "bold"
                            }}
                          >
                            Application Pending
                          </button>
                        );
                      }
                      return (
                        <button 
                          onClick={() => applyToJob(job.id)}
                          style={{
                            padding: "10px 20px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            fontSize: "14px",
                            cursor: "pointer",
                            fontWeight: "bold"
                          }}
                        >
                          Apply Now
                        </button>
                      );
                    })()}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      
      {/* ========================================
          WORKER SECTION - MY APPLICATIONS
          ======================================== */}
      
      {role === "worker" && (
        <div style={{ 
          border: "2px solid #17a2b8", 
          borderRadius: "8px",
          padding: "20px",
          backgroundColor: "#f0fdff"
        }}>
          <h2 style={{ color: "#17a2b8", marginBottom: "20px" }}>My Applications</h2>
          
          {getWorkerApplications().length === 0 ? (
            <p style={{ textAlign: "center", color: "#6c757d", fontStyle: "italic" }}>
              You haven't applied to any jobs yet. Browse the job listings above to get started!
            </p>
          ) : (
            <div style={{ display: "grid", gap: "15px" }}>
              {getWorkerApplications().map((app) => (
                <div 
                  key={app.id} 
                  style={{ 
                    border: "1px solid #17a2b8", 
                    borderRadius: "6px",
                    padding: "15px",
                    backgroundColor: "white"
                  }}
                >
                  <h4 style={{ margin: "0 0 10px 0", color: "#333" }}>
                    {app.jobs.title}
                  </h4>
                  <p style={{ margin: "5px 0" }}>
                    <strong>Status:</strong> 
                    <span style={{ 
                      color: app.status === "accepted" ? "#28a745" : 
                            app.status === "rejected" ? "#dc3545" : "#ffc107",
                      fontWeight: "bold",
                      marginLeft: "8px"
                    }}>
                      {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                    </span>
                  </p>
                  <p style={{ margin: "5px 0", color: "#666", fontSize: "12px" }}>
                    Applied on: {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
      
    </div>
  );
}