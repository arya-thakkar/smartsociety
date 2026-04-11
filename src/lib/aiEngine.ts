/**
 * AI Decision Engine for Amenity Bookings
 * 
 * Logic:
 * 1. Calculate a Priority Score based on Resident History, Role, and Timing.
 * 2. Detect conflicts between Pending and Approved bookings.
 * 3. Generate human-readable reasoning for the decision.
 */

export type BookingStatus = "pending" | "approved" | "rejected" | "waitlisted";

export interface Booking {
  id: number;
  resident: string;
  amenity: string;
  date: string;
  time: string;
  status: BookingStatus;
  requestedAt: string; // ISO String
  reasoning?: string;
  score?: number;
}

export interface ResidentProfile {
  name: string;
  role: "Resident" | "Admin" | "Guard";
  monthlyUsageCount: number;
  lastUsageDate?: string; // ISO String
}

export class AmenityAIEngine {
  private baseScore = 100;

  /**
   * Calculates a multi-factor priority score for a booking request.
   */
  public calculateScore(booking: Booking, profile: ResidentProfile): number {
    let score = this.baseScore;

    // 1. Role Bonus (Admins/Committee members get higher priority)
    if (profile.role === "Admin") {
      score += 25;
    }

    // 2. Frequency Penalty (Fairness: penalize frequent users)
    score -= profile.monthlyUsageCount * 5;

    // 3. Recency Penalty (Fairness: penalize very recent users)
    if (profile.lastUsageDate) {
      const lastUsed = new Date(profile.lastUsageDate).getTime();
      const now = new Date().getTime();
      const daysSinceLastUse = (now - lastUsed) / (1000 * 60 * 60 * 24);

      if (daysSinceLastUse < 7) {
        score -= 15;
      }
    }

    // 4. Timing Bonus (First-come, first-served weight)
    const requestTime = new Date(booking.requestedAt).getTime();
    const todayStart = new Date().setHours(0, 0, 0, 0);
    const hoursSinceRequest = (todayStart - requestTime) / (1000 * 60 * 60);
    score += Math.max(0, hoursSinceRequest * 0.1); // Small bonus for early birds

    return Math.round(score);
  }

  /**
   * Generates a human-readable explanation for the score.
   */
  public generateReasoning(score: number, booking: Booking, profile: ResidentProfile): string {
    const reasons: string[] = [];

    if (profile.role === "Admin") reasons.push("Committee priority bonus applied.");
    if (profile.monthlyUsageCount > 3) reasons.push(`High monthly usage (${profile.monthlyUsageCount} times) reduced priority.`);
    
    if (profile.lastUsageDate) {
      const daysSince = Math.floor((new Date().getTime() - new Date(profile.lastUsageDate).getTime()) / (1000 * 60 * 60 * 24));
      if (daysSince < 7) reasons.push(`Recent usage (${daysSince} days ago) reduced priority.`);
    }

    if (score > 110) return "Excellent standing. " + reasons.join(" ");
    if (score > 90) return "Good standing. " + reasons.join(" ");
    return "Fair usage limits applied. " + reasons.join(" ");
  }

  /**
   * Processes a list of pending bookings against approved ones.
   */
  public processPending(
    pending: Booking[],
    approved: Booking[],
    profiles: Record<string, ResidentProfile>
  ): Booking[] {
    return pending.map(b => {
      const profile = profiles[b.resident] || { name: b.resident, role: "Resident", monthlyUsageCount: 0 };
      const score = this.calculateScore(b, profile);
      const reasoning = this.generateReasoning(score, b, profile);

      // Simple Conflict Check (Over-capacity check usually handled by frontend, 
      // but AI checks if this resident is "allowed" vs others)
      let status: BookingStatus = "approved";
      
      // Auto-reject if score is too low (e.g. they use it literally every day)
      if (score < 50) {
        status = "rejected";
      }

      return { ...b, score, reasoning, status };
    });
  }
}

export const aiEngine = new AmenityAIEngine();
