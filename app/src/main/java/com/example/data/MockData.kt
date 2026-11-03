package com.example.data

import com.example.model.*

object MockData {

    val sampleIssues = listOf(
        DiagnosticIssue(
            id = "issue_plumb_1",
            title = "Under-Sink P-Trap Joint Separation",
            category = "Plumbing",
            urgency = UrgencyLevel.EMERGENCY,
            rootCause = "Deteriorated slip joint compression washer and cross-threaded PVC coupling ring causing active leakage under water head pressure.",
            diagnosticSummary = "Immediate P-trap reconstruction and washer replacement required. Water supply should be isolated to prevent subfloor rotting.",
            estimatedDuration = "45 - 60 min",
            priceRange = "₹950 - ₹1,450",
            suggestedParts = listOf(
                "1-1/2 in. PVC P-Trap Assembly Kit",
                "Beveled Slip Joint Rubber Washers (2-pack)",
                "Teflon High-Density Thread Seal Tape",
                "12 in. Tongue and Groove Water Pump Pliers"
            ),
            confidenceScore = 98,
            drawableResName = "sample_pipe_leak"
        ),
        DiagnosticIssue(
            id = "issue_elec_2",
            title = "Arcing 120V GFCI Kitchen Receptacle",
            category = "Electrical",
            urgency = UrgencyLevel.EMERGENCY,
            rootCause = "Loose terminal screw causing micro-arcing and thermal degradation inside 2-gang electrical work box, tripping secondary breaker.",
            diagnosticSummary = "Safety hazard detected. High fire-risk junction. Requires circuit de-energization, wire stripping, and industrial GFCI install.",
            estimatedDuration = "30 - 45 min",
            priceRange = "₹850 - ₹1,250",
            suggestedParts = listOf(
                "20-Amp Self-Test Tamper-Resistant GFCI Outlet",
                "Ideal Wire Nut Connectors (Yellow/Red)",
                "Commercial Electric 7-in-1 Wire Stripper",
                "Dual Range Non-Contact AC Voltage Detector"
            ),
            confidenceScore = 96,
            drawableResName = "ic_locallink_logo"
        ),
        DiagnosticIssue(
            id = "issue_hvac_3",
            title = "AC Evaporator Condensate Overflow",
            category = "HVAC & Cooling",
            urgency = UrgencyLevel.URGENT,
            rootCause = "Biocidal algae sediment blocking the 3/4 inch gravity condensate drain line, tripping primary drain pan float safety switch.",
            diagnosticSummary = "Unit halted via float switch. Drain line suction flush needed alongside pan treatment tablets to prevent ceiling drywall collapse.",
            estimatedDuration = "60 - 75 min",
            priceRange = "₹1,200 - ₹1,850",
            suggestedParts = listOf(
                "HVAC Line Vacuum Suction Pump Kit",
                "3/4 in. Schedule 40 PVC Trap & Cleanout Tee",
                "Pan-Treat Condensate Overflow Inhibitor Tablets",
                "Direct-Fit Secondary Float Switch Sensor"
            ),
            confidenceScore = 94,
            drawableResName = "sample_pipe_leak"
        ),
        DiagnosticIssue(
            id = "issue_repair_4",
            title = "Drywall Impact Puncture & Stud Check",
            category = "Handyman",
            urgency = UrgencyLevel.ROUTINE,
            rootCause = "4x5 inch puncture through 1/2\" gypsum board. Stud framing intact without pipe or wire interference.",
            diagnosticSummary = "Standard California patch repair with fiber mesh backing and two skim coats of lightweight joint compound.",
            estimatedDuration = "60 - 90 min",
            priceRange = "₹750 - ₹1,150",
            suggestedParts = listOf(
                "Self-Adhesive Steel Drywall Repair Patch (6x6 in)",
                "Pre-Mixed All-Purpose Lightweight Joint Compound",
                "6 in. Stainless Steel Taping & Putty Knife",
                "220-Grit Foam Sanding Sponge & Primer"
            ),
            confidenceScore = 97,
            drawableResName = "ic_locallink_logo"
        )
    )

    val serviceCategories = listOf(
        ServiceCategory("cat_plumbing", "Plumbing", "Leaks, pipes, fixtures & water heaters", 14, "plumbing"),
        ServiceCategory("cat_electrical", "Electrical", "Wiring, breaker panels, outlets & lighting", 9, "electric"),
        ServiceCategory("cat_hvac", "HVAC / AC", "Cooling, heating, coils & duct repairs", 7, "hvac"),
        ServiceCategory("cat_handyman", "Handyman", "Drywall, doors, hardware & quick fixes", 18, "handyman"),
        ServiceCategory("cat_carpentry", "Carpentry", "Framing, trim, cabinetry & wood repairs", 6, "carpentry"),
        ServiceCategory("cat_appliances", "Appliances", "Washers, dishwashers, ovens & dryers", 11, "appliances")
    )

    val providers = listOf(
        Provider(
            id = "pro_marcus",
            name = "Marcus Vance",
            businessName = "Vance Precision Plumbing",
            specialty = "Master Licensed Plumber (#PL-8821)",
            rating = 4.98,
            reviewCount = 184,
            distanceMiles = 1.2,
            hourlyRate = 499,
            badge = "LocalLink Certified Master",
            completedJobs = 342,
            isOnline = true,
            phone = "+91 98450 11023",
            avatarInitials = "MV"
        ),
        Provider(
            id = "pro_elena",
            name = "Elena Rostova",
            businessName = "VoltCraft Electrical Labs",
            specialty = "Certified Master Electrician",
            rating = 4.96,
            reviewCount = 142,
            distanceMiles = 2.1,
            hourlyRate = 599,
            badge = "Verified Top Pro",
            completedJobs = 286,
            isOnline = true,
            phone = "+91 98210 99341",
            avatarInitials = "ER"
        ),
        Provider(
            id = "pro_david",
            name = "David Chen",
            businessName = "Apex Thermal Solutions",
            specialty = "EPA Universal Certified HVAC Specialist",
            rating = 4.94,
            reviewCount = 98,
            distanceMiles = 3.4,
            hourlyRate = 549,
            badge = "Rapid Response Certified",
            completedJobs = 195,
            isOnline = false,
            phone = "+91 97120 44125",
            avatarInitials = "DC"
        ),
        Provider(
            id = "pro_sarah",
            name = "Sarah Jenkins",
            businessName = "Jenkins Multi-Trade Craftsmen",
            specialty = "Licensed General Contractor & Handyman",
            rating = 4.92,
            reviewCount = 215,
            distanceMiles = 1.8,
            hourlyRate = 399,
            badge = "Community Favorite",
            completedJobs = 412,
            isOnline = true,
            phone = "+91 99001 55208",
            avatarInitials = "SJ"
        )
    )

    val initialCustomerBookings = listOf(
        Booking(
            id = "bk_1001",
            customerName = "Alex Morgan",
            customerPhone = "+91 98765 43210",
            customerAddress = "742 Evergreen Terrace, Flat 4B",
            diagnosticIssue = sampleIssues[0],
            provider = providers[0],
            scheduledDate = "Today",
            scheduledTimeSlot = "2:30 PM - 3:30 PM",
            status = BookingStatus.EN_ROUTE,
            partsChecklist = sampleIssues[0].suggestedParts.mapIndexed { idx, part ->
                ChecklistItem("part_$idx", part, isChecked = idx < 2)
            },
            notes = "Water shutoff valve is located directly under the sink basin behind the left cupboard door.",
            finalPrice = "₹1,250"
        ),
        Booking(
            id = "bk_1002",
            customerName = "Alex Morgan",
            customerPhone = "+91 98765 43210",
            customerAddress = "742 Evergreen Terrace, Flat 4B",
            diagnosticIssue = sampleIssues[1],
            provider = providers[1],
            scheduledDate = "Tomorrow",
            scheduledTimeSlot = "10:00 AM - 11:00 AM",
            status = BookingStatus.CONFIRMED,
            partsChecklist = sampleIssues[1].suggestedParts.mapIndexed { idx, part ->
                ChecklistItem("part_e_$idx", part, isChecked = true)
            },
            notes = "Kitchen island power circuit. Breaker labeled #7.",
            finalPrice = "₹1,100"
        )
    )

    val initialIncomingProviderRequests = listOf(
        Booking(
            id = "req_2001",
            customerName = "Sophia Reynolds",
            customerPhone = "+91 98112 33418",
            customerAddress = "824 Willow Creek Way, Suite 12",
            diagnosticIssue = sampleIssues[0],
            provider = providers[0],
            scheduledDate = "Today",
            scheduledTimeSlot = "Immediate / Urgent (Next available)",
            status = BookingStatus.PENDING,
            partsChecklist = sampleIssues[0].suggestedParts.mapIndexed { idx, part ->
                ChecklistItem("req_part_$idx", part, isChecked = idx == 0 || idx == 1)
            },
            notes = "Customer says water is collecting in a bucket fast. Needs urgent response.",
            finalPrice = "₹1,450"
        )
    )

    val initialProviderSchedule = listOf(
        ProviderScheduleItem(
            id = "sch_1",
            timeSlot = "09:30 AM - 10:30 AM",
            clientName = "Robert Davis",
            address = "512 Oak Ridge Rd",
            serviceTitle = "Emergency Pressure Relief Valve Replacement",
            urgency = UrgencyLevel.EMERGENCY,
            estimatedEarnings = "₹1,600",
            status = BookingStatus.COMPLETED,
            partsCount = 3,
            notes = "Job completed smoothly. Tested at 65 PSI."
        ),
        ProviderScheduleItem(
            id = "sch_2",
            timeSlot = "01:15 PM - 02:15 PM",
            clientName = "Sophia Reynolds",
            address = "824 Willow Creek Way, Suite 12",
            serviceTitle = "Kitchen Sink P-Trap Assembly & Seal",
            urgency = UrgencyLevel.EMERGENCY,
            estimatedEarnings = "₹1,450",
            status = BookingStatus.EN_ROUTE,
            partsCount = 4,
            notes = "Customer waiting. Parts confirmed in service van."
        ),
        ProviderScheduleItem(
            id = "sch_3",
            timeSlot = "04:30 PM - 05:30 PM",
            clientName = "Greg Anderson",
            address = "1209 Cedar Lane",
            serviceTitle = "Main Line Pressure Regulator Calibration",
            urgency = UrgencyLevel.ROUTINE,
            estimatedEarnings = "₹950",
            status = BookingStatus.CONFIRMED,
            partsCount = 2,
            notes = "Standard residential inspection."
        )
    )

    val defaultProviderAnalytics = ProviderAnalytics()
}
