package com.example.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.data.MockData
import com.example.model.*
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch

enum class ScanningPhase {
    IDLE,
    SCANNING,
    COMPLETE
}

data class LocalLinkUiState(
    val currentViewMode: ViewMode = ViewMode.CUSTOMER,
    val isDarkMode: Boolean = true,
    
    // Customer Portal State
    val searchQuery: String = "",
    val selectedCategory: String? = null,
    val isScannerOpen: Boolean = false,
    val scanningPhase: ScanningPhase = ScanningPhase.IDLE,
    val scanProgress: Float = 0f,
    val scanStatusText: String = "",
    val activeDiagnosticIssue: DiagnosticIssue? = null,
    val isBookingSheetOpen: Boolean = false,
    val selectedProvider: Provider? = null,
    val selectedDate: String = "Today",
    val selectedTimeSlot: String = "2:30 PM - 3:30 PM",
    val addressInput: String = "742 Evergreen Terrace, Apt 4B",
    val customerNotesInput: String = "Water cutoff valve is accessible right behind the cabinet door.",
    val customerBookings: List<Booking> = MockData.initialCustomerBookings,
    
    // Provider Dashboard State
    val isProviderAvailable: Boolean = true,
    val incomingRequests: List<Booking> = MockData.initialIncomingProviderRequests,
    val providerSchedule: List<ProviderScheduleItem> = MockData.initialProviderSchedule,
    val providerAnalytics: ProviderAnalytics = MockData.defaultProviderAnalytics,
    val activeBriefBooking: Booking? = null,
    val isCameraOpen: Boolean = false,
    val capturedBitmap: android.graphics.Bitmap? = null,
    
    // Feedback Banner
    val snackbarMessage: String? = null
)

class LocalLinkViewModel : ViewModel() {

    private val _uiState = MutableStateFlow(LocalLinkUiState())
    val uiState: StateFlow<LocalLinkUiState> = _uiState.asStateFlow()

    fun setViewMode(mode: ViewMode) {
        _uiState.update { it.copy(currentViewMode = mode) }
    }

    fun toggleDarkMode() {
        _uiState.update { it.copy(isDarkMode = !it.isDarkMode) }
    }

    fun toggleProviderAvailability() {
        _uiState.update {
            val next = !it.isProviderAvailable
            val msg = if (next) "Status: ONLINE — Accepting immediate local requests" else "Status: PAUSED — Incoming bookings paused"
            it.copy(isProviderAvailable = next, snackbarMessage = msg)
        }
    }

    fun updateSearchQuery(query: String) {
        _uiState.update { it.copy(searchQuery = query) }
    }

    fun selectCategory(categoryId: String?) {
        _uiState.update { it.copy(selectedCategory = if (it.selectedCategory == categoryId) null else categoryId) }
    }

    // --- Camera Flow ---
    fun openCamera() {
        _uiState.update { it.copy(isCameraOpen = true) }
    }

    fun closeCamera() {
        _uiState.update { it.copy(isCameraOpen = false) }
    }

    fun handleCapturedPhoto(bitmap: android.graphics.Bitmap) {
        val capturedIssue = DiagnosticIssue(
            id = "issue_live_${System.currentTimeMillis() % 10000}",
            title = "Live Camera Detected Defect: Pipe Joint Leakage",
            category = "Plumbing",
            urgency = UrgencyLevel.EMERGENCY,
            rootCause = "Active fluid pooling & slip compression ring displacement detected from live camera frames.",
            diagnosticSummary = "Camera vision detected localized joint stress. Requires P-trap realignment and replacement compression washer.",
            estimatedDuration = "45 - 60 min",
            priceRange = "₹950 - ₹1,450",
            suggestedParts = listOf(
                "1-1/2 in. Universal PVC P-Trap Kit",
                "Beveled Slip Joint Rubber Washers (2-pack)",
                "High-Density Thread Seal Tape",
                "12 in. Tongue & Groove Plumber Pliers"
            ),
            confidenceScore = 98,
            drawableResName = "sample_pipe_leak",
            capturedBitmap = bitmap
        )

        _uiState.update {
            it.copy(
                isCameraOpen = false,
                capturedBitmap = bitmap,
                activeDiagnosticIssue = capturedIssue,
                isScannerOpen = true,
                scanningPhase = ScanningPhase.SCANNING,
                scanProgress = 0.15f,
                scanStatusText = "Ingesting live camera photo into neural CV pipeline...",
                snackbarMessage = "Photo captured! AI Diagnostics running..."
            )
        }

        viewModelScope.launch {
            kotlinx.coroutines.delay(600)
            _uiState.update {
                it.copy(
                    scanProgress = 0.5f,
                    scanStatusText = "Analyzing captured photo: detecting pipe contours & joint degradation..."
                )
            }
            kotlinx.coroutines.delay(700)
            _uiState.update {
                it.copy(
                    scanProgress = 0.85f,
                    scanStatusText = "Cross-referencing parts inventory & local technician hourly rates..."
                )
            }
            kotlinx.coroutines.delay(600)
            _uiState.update {
                it.copy(
                    scanningPhase = ScanningPhase.COMPLETE,
                    scanProgress = 1.0f,
                    scanStatusText = "Live Image AI Diagnosis Complete (98% Confidence)"
                )
            }
        }
    }

    // --- AI Scanner Flow ---
    fun openScanner(sampleIssue: DiagnosticIssue? = null) {
        val targetIssue = sampleIssue ?: MockData.sampleIssues.first()
        _uiState.update {
            it.copy(
                isScannerOpen = true,
                scanningPhase = ScanningPhase.IDLE,
                scanProgress = 0f,
                scanStatusText = "Ready to inspect visual defects...",
                activeDiagnosticIssue = targetIssue
            )
        }
    }

    fun closeScanner() {
        _uiState.update {
            it.copy(
                isScannerOpen = false,
                scanningPhase = ScanningPhase.IDLE,
                scanProgress = 0f
            )
        }
    }

    fun runDiagnosticScan() {
        viewModelScope.launch {
            _uiState.update {
                it.copy(
                    scanningPhase = ScanningPhase.SCANNING,
                    scanProgress = 0.1f,
                    scanStatusText = "Analyzing hardware geometry and moisture patterns..."
                )
            }
            delay(600)
            _uiState.update {
                it.copy(
                    scanProgress = 0.4f,
                    scanStatusText = "Detecting material: 1-1/2\" Schedule 40 PVC & slip-joint..."
                )
            }
            delay(700)
            _uiState.update {
                it.copy(
                    scanProgress = 0.75f,
                    scanStatusText = "Identifying defect: Thread failure & rubber gasket fatigue..."
                )
            }
            delay(600)
            _uiState.update {
                it.copy(
                    scanProgress = 0.95f,
                    scanStatusText = "Cross-referencing replacement parts catalog & local rates..."
                )
            }
            delay(500)
            _uiState.update {
                it.copy(
                    scanningPhase = ScanningPhase.COMPLETE,
                    scanProgress = 1.0f,
                    scanStatusText = "Diagnosis Complete — High Confidence (98%)"
                )
            }
        }
    }

    fun selectSampleIssue(issue: DiagnosticIssue) {
        _uiState.update {
            it.copy(
                activeDiagnosticIssue = issue,
                scanningPhase = ScanningPhase.IDLE,
                scanProgress = 0f,
                scanStatusText = "Selected issue: ${issue.title}"
            )
        }
    }

    // --- Booking Flow ---
    fun openBookingSheet(issue: DiagnosticIssue? = null, provider: Provider? = null) {
        val targetIssue = issue ?: _uiState.value.activeDiagnosticIssue ?: MockData.sampleIssues.first()
        val targetProvider = provider ?: MockData.providers.first()
        _uiState.update {
            it.copy(
                isBookingSheetOpen = true,
                isScannerOpen = false,
                activeDiagnosticIssue = targetIssue,
                selectedProvider = targetProvider,
                selectedDate = "Today",
                selectedTimeSlot = "2:30 PM - 3:30 PM"
            )
        }
    }

    fun closeBookingSheet() {
        _uiState.update { it.copy(isBookingSheetOpen = false) }
    }

    fun selectBookingDate(date: String) {
        _uiState.update { it.copy(selectedDate = date) }
    }

    fun selectBookingTimeSlot(slot: String) {
        _uiState.update { it.copy(selectedTimeSlot = slot) }
    }

    fun selectProviderForBooking(provider: Provider) {
        _uiState.update { it.copy(selectedProvider = provider) }
    }

    fun updateBookingAddress(address: String) {
        _uiState.update { it.copy(addressInput = address) }
    }

    fun updateBookingNotes(notes: String) {
        _uiState.update { it.copy(customerNotesInput = notes) }
    }

    fun confirmBooking() {
        val state = _uiState.value
        val issue = state.activeDiagnosticIssue ?: MockData.sampleIssues.first()
        val provider = state.selectedProvider ?: MockData.providers.first()
        val newBookingId = "bk_${System.currentTimeMillis() % 10000}"

        val newBooking = Booking(
            id = newBookingId,
            customerName = "Alex Morgan",
            customerPhone = "(555) 234-5678",
            customerAddress = state.addressInput.ifBlank { "742 Evergreen Terrace, Apt 4B" },
            diagnosticIssue = issue,
            provider = provider,
            scheduledDate = state.selectedDate,
            scheduledTimeSlot = state.selectedTimeSlot,
            status = BookingStatus.CONFIRMED,
            partsChecklist = issue.suggestedParts.mapIndexed { idx, part ->
                ChecklistItem("part_${newBookingId}_$idx", part, isChecked = true)
            },
            notes = state.customerNotesInput,
            finalPrice = issue.priceRange.split("-").lastOrNull()?.trim() ?: "₹1,450"
        )

        val newScheduleItem = ProviderScheduleItem(
            id = "sch_${System.currentTimeMillis() % 10000}",
            timeSlot = state.selectedTimeSlot,
            clientName = "Alex Morgan",
            address = state.addressInput.ifBlank { "742 Evergreen Terrace, Apt 4B" },
            serviceTitle = issue.title,
            urgency = issue.urgency,
            estimatedEarnings = newBooking.finalPrice,
            status = BookingStatus.CONFIRMED,
            partsCount = issue.suggestedParts.size,
            notes = state.customerNotesInput
        )

        _uiState.update {
            it.copy(
                isBookingSheetOpen = false,
                customerBookings = listOf(newBooking) + it.customerBookings,
                providerSchedule = listOf(newScheduleItem) + it.providerSchedule,
                snackbarMessage = "Booking Confirmed! ${provider.name} is scheduled for ${state.selectedDate} (${state.selectedTimeSlot})"
            )
        }
    }

    fun cancelCustomerBooking(bookingId: String) {
        _uiState.update { state ->
            state.copy(
                customerBookings = state.customerBookings.filterNot { it.id == bookingId },
                snackbarMessage = "Booking canceled successfully"
            )
        }
    }

    // --- Provider Actions ---
    fun openBriefDetails(booking: Booking) {
        _uiState.update { it.copy(activeBriefBooking = booking) }
    }

    fun closeBriefDetails() {
        _uiState.update { it.copy(activeBriefBooking = null) }
    }

    fun toggleChecklistItem(bookingId: String, partId: String) {
        _uiState.update { state ->
            val updatedIncoming = state.incomingRequests.map { booking ->
                if (booking.id == bookingId) {
                    val updatedParts = booking.partsChecklist.map { item ->
                        if (item.id == partId) item.copy(isChecked = !item.isChecked) else item
                    }
                    booking.copy(partsChecklist = updatedParts)
                } else booking
            }

            val updatedCustomer = state.customerBookings.map { booking ->
                if (booking.id == bookingId) {
                    val updatedParts = booking.partsChecklist.map { item ->
                        if (item.id == partId) item.copy(isChecked = !item.isChecked) else item
                    }
                    booking.copy(partsChecklist = updatedParts)
                } else booking
            }

            val updatedBrief = state.activeBriefBooking?.let { brief ->
                if (brief.id == bookingId) {
                    val updatedParts = brief.partsChecklist.map { item ->
                        if (item.id == partId) item.copy(isChecked = !item.isChecked) else item
                    }
                    brief.copy(partsChecklist = updatedParts)
                } else brief
            }

            state.copy(
                incomingRequests = updatedIncoming,
                customerBookings = updatedCustomer,
                activeBriefBooking = updatedBrief
            )
        }
    }

    fun acceptRequest(bookingId: String) {
        val target = _uiState.value.incomingRequests.find { it.id == bookingId } ?: return
        val newScheduleItem = ProviderScheduleItem(
            id = "sch_${System.currentTimeMillis() % 10000}",
            timeSlot = target.scheduledTimeSlot,
            clientName = target.customerName,
            address = target.customerAddress,
            serviceTitle = target.diagnosticIssue.title,
            urgency = target.diagnosticIssue.urgency,
            estimatedEarnings = target.finalPrice,
            status = BookingStatus.EN_ROUTE,
            partsCount = target.partsChecklist.size,
            notes = target.notes
        )

        _uiState.update { state ->
            state.copy(
                incomingRequests = state.incomingRequests.filterNot { it.id == bookingId },
                providerSchedule = listOf(newScheduleItem) + state.providerSchedule,
                activeBriefBooking = null,
                snackbarMessage = "Request Accepted! Status updated to 'En Route' to ${target.customerName}"
            )
        }
    }

    fun declineRequest(bookingId: String) {
        _uiState.update { state ->
            state.copy(
                incomingRequests = state.incomingRequests.filterNot { it.id == bookingId },
                activeBriefBooking = null,
                snackbarMessage = "Request declined and routed to next available pro"
            )
        }
    }

    fun markScheduleItemCompleted(scheduleId: String) {
        _uiState.update { state ->
            val updatedSchedule = state.providerSchedule.map { item ->
                if (item.id == scheduleId) item.copy(status = BookingStatus.COMPLETED) else item
            }
            state.copy(
                providerSchedule = updatedSchedule,
                snackbarMessage = "Job marked as COMPLETED! Payout credited to pending balance."
            )
        }
    }

    fun dismissSnackbar() {
        _uiState.update { it.copy(snackbarMessage = null) }
    }
}
