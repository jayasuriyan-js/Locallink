package com.example.model

enum class ViewMode {
    CUSTOMER,
    PROVIDER
}

enum class UrgencyLevel(val label: String, val badgeColorHex: Long) {
    EMERGENCY("Critical / Active Leak", 0xFFFF5757),
    URGENT("Urgent (< 24h)", 0xFFF59E0B),
    ROUTINE("Standard Repair", 0xFF10B981)
}

enum class BookingStatus(val label: String) {
    PENDING("Request Sent"),
    CONFIRMED("Confirmed"),
    EN_ROUTE("Pro En Route"),
    IN_PROGRESS("In Progress"),
    COMPLETED("Completed")
}

data class ServiceCategory(
    val id: String,
    val name: String,
    val description: String,
    val activePros: Int,
    val iconKey: String
)

data class DiagnosticIssue(
    val id: String,
    val title: String,
    val category: String,
    val urgency: UrgencyLevel,
    val rootCause: String,
    val diagnosticSummary: String,
    val estimatedDuration: String,
    val priceRange: String,
    val suggestedParts: List<String>,
    val confidenceScore: Int = 97,
    val drawableResName: String = "sample_pipe_leak",
    val capturedBitmap: android.graphics.Bitmap? = null
)

data class Provider(
    val id: String,
    val name: String,
    val businessName: String,
    val specialty: String,
    val rating: Double,
    val reviewCount: Int,
    val distanceMiles: Double,
    val hourlyRate: Int,
    val badge: String,
    val completedJobs: Int,
    val isOnline: Boolean = true,
    val phone: String = "(555) 234-8901",
    val avatarInitials: String = "MV"
)

data class ChecklistItem(
    val id: String,
    val name: String,
    val isChecked: Boolean = false
)

data class Booking(
    val id: String,
    val customerName: String,
    val customerPhone: String,
    val customerAddress: String,
    val diagnosticIssue: DiagnosticIssue,
    val provider: Provider,
    val scheduledDate: String,
    val scheduledTimeSlot: String,
    val status: BookingStatus,
    val partsChecklist: List<ChecklistItem>,
    val notes: String = "",
    val finalPrice: String = "₹1,250"
)

data class ProviderScheduleItem(
    val id: String,
    val timeSlot: String,
    val clientName: String,
    val address: String,
    val serviceTitle: String,
    val urgency: UrgencyLevel,
    val estimatedEarnings: String,
    val status: BookingStatus,
    val partsCount: Int,
    val notes: String
)

data class ProviderAnalytics(
    val totalRevenue: String = "₹48,500",
    val upcomingPayout: String = "₹8,900",
    val completedJobsCount: Int = 42,
    val averageRating: Double = 4.98,
    val responseRatePercent: Int = 99,
    val weeklyEarnings: List<Pair<String, Int>> = listOf(
        "Mon" to 3200,
        "Tue" to 5400,
        "Wed" to 4100,
        "Thu" to 6200,
        "Fri" to 6800,
        "Sat" to 4900,
        "Sun" to 0
    )
)
