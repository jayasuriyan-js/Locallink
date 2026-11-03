package com.example

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.animation.Crossfade
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.model.ViewMode
import com.example.ui.components.AiScannerDialog
import com.example.ui.components.CameraScanScreen
import com.example.ui.components.TopNavBar
import com.example.ui.customer.BookingDialog
import com.example.ui.customer.CustomerPortalScreen
import com.example.ui.provider.ProviderDashboardScreen
import com.example.ui.theme.LocalLinkTheme
import com.example.viewmodel.LocalLinkViewModel

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            val viewModel: LocalLinkViewModel = viewModel()
            val uiState by viewModel.uiState.collectAsStateWithLifecycle()

            LocalLinkTheme(darkTheme = uiState.isDarkMode) {
                val snackbarHostState = remember { SnackbarHostState() }

                LaunchedEffect(uiState.snackbarMessage) {
                    uiState.snackbarMessage?.let { msg ->
                        snackbarHostState.showSnackbar(msg, duration = SnackbarDuration.Short)
                        viewModel.dismissSnackbar()
                    }
                }

                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    snackbarHost = { SnackbarHost(snackbarHostState) },
                    topBar = {
                        TopNavBar(
                            currentViewMode = uiState.currentViewMode,
                            isDarkMode = uiState.isDarkMode,
                            isProviderOnline = uiState.isProviderAvailable,
                            onViewModeChange = { mode -> viewModel.setViewMode(mode) },
                            onToggleDarkMode = { viewModel.toggleDarkMode() }
                        )
                    }
                ) { innerPadding ->
                    Box(
                        modifier = Modifier
                            .fillMaxSize()
                            .padding(innerPadding)
                    ) {
                        Crossfade(
                            targetState = uiState.currentViewMode,
                            label = "viewModeTransition"
                        ) { viewMode ->
                            when (viewMode) {
                                ViewMode.CUSTOMER -> {
                                    CustomerPortalScreen(
                                        uiState = uiState,
                                        onOpenCamera = { viewModel.openCamera() },
                                        onOpenScanner = { issue -> viewModel.openScanner(issue) },
                                        onOpenBookingSheet = { issue, pro -> viewModel.openBookingSheet(issue, pro) },
                                        onCancelBooking = { id -> viewModel.cancelCustomerBooking(id) },
                                        onSearchChange = { q -> viewModel.updateSearchQuery(q) },
                                        onCategorySelect = { catId -> viewModel.selectCategory(catId) }
                                    )
                                }
                                ViewMode.PROVIDER -> {
                                    ProviderDashboardScreen(
                                        uiState = uiState,
                                        onToggleAvailability = { viewModel.toggleProviderAvailability() },
                                        onAcceptRequest = { id -> viewModel.acceptRequest(id) },
                                        onDeclineRequest = { id -> viewModel.declineRequest(id) },
                                        onTogglePartChecklist = { bookingId, partId ->
                                            viewModel.toggleChecklistItem(bookingId, partId)
                                        },
                                        onMarkScheduleCompleted = { id -> viewModel.markScheduleItemCompleted(id) },
                                        onInspectBrief = { booking -> viewModel.openBriefDetails(booking) }
                                    )
                                }
                            }
                        }

                        // Live AI Camera Viewfinder & Scanner
                        CameraScanScreen(
                            isOpen = uiState.isCameraOpen,
                            onDismiss = { viewModel.closeCamera() },
                            onPhotoCaptured = { bitmap -> viewModel.handleCapturedPhoto(bitmap) },
                            onSelectSample = {
                                viewModel.closeCamera()
                                viewModel.openScanner(null)
                            }
                        )

                        // AI Diagnostic Scanner Dialog
                        AiScannerDialog(
                            isOpen = uiState.isScannerOpen,
                            scanningPhase = uiState.scanningPhase,
                            scanProgress = uiState.scanProgress,
                            statusText = uiState.scanStatusText,
                            currentIssue = uiState.activeDiagnosticIssue,
                            onDismiss = { viewModel.closeScanner() },
                            onRunScan = { viewModel.runDiagnosticScan() },
                            onSelectSample = { issue -> viewModel.selectSampleIssue(issue) },
                            onProceedToBooking = { issue -> viewModel.openBookingSheet(issue, null) },
                            onOpenCamera = {
                                viewModel.closeScanner()
                                viewModel.openCamera()
                            }
                        )

                        // Progressive Booking Dialog
                        BookingDialog(
                            isOpen = uiState.isBookingSheetOpen,
                            issue = uiState.activeDiagnosticIssue,
                            selectedProvider = uiState.selectedProvider,
                            selectedDate = uiState.selectedDate,
                            selectedTimeSlot = uiState.selectedTimeSlot,
                            addressInput = uiState.addressInput,
                            notesInput = uiState.customerNotesInput,
                            onDismiss = { viewModel.closeBookingSheet() },
                            onSelectProvider = { pro -> viewModel.selectProviderForBooking(pro) },
                            onSelectDate = { date -> viewModel.selectBookingDate(date) },
                            onSelectTimeSlot = { slot -> viewModel.selectBookingTimeSlot(slot) },
                            onAddressChange = { addr -> viewModel.updateBookingAddress(addr) },
                            onNotesChange = { notes -> viewModel.updateBookingNotes(notes) },
                            onConfirmBooking = { viewModel.confirmBooking() }
                        )
                    }
                }
            }
        }
    }
}
